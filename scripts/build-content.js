#!/usr/bin/env node
// Compile `content/{courseId}/` → `content/_dist/{courseId}.js` bundles.
// Spec: content/SCHEMA.md §Compilation + §Validation.
//
//   node scripts/build-content.js              # build all four courses
//   node scripts/build-content.js 4736 4911    # subset
//
// Output shape (per SCHEMA §Compilation):
//   window.CONTENT["{id}"] = { meta, modules, mockExam, lessons, codePractice, topicDives, cheatSheet };

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const DIST_DIR = path.join(CONTENT_DIR, '_dist');
const COURSES = ['4736', '4870', '4911', '4915', '3522'];

const RECOGNISED_CALLOUTS = {
  analogy: 'analogy',
  takeaway: 'takeaway',
  pitfall: 'pitfall',
  example: 'example',
  note: 'note',
  warning: 'warning'
};

const LANG_OK = new Set([
  'c', 'cpp', 'cs', 'java', 'js', 'ts', 'python', 'bash', 'powershell',
  'sql', 'proto', 'xml', 'yaml', 'json', 'html', 'css', 'text', 'mermaid',
  'console', 'dockerfile', 'makefile', 'ini', 'toml', 'diff', 'regex', 'apache', 'nginx'
]);

const warnings = [];
function warn(msg) { warnings.push(msg); process.stderr.write('WARN: ' + msg + '\n'); }
function fail(msg) { throw new Error('BUILD FAILED: ' + msg); }

// ----------------------------- utility ---------------------------------------

function readFile(p) { return fs.readFileSync(p, 'utf8'); }
function readDirFiles(p, ext) {
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).filter(f => f.endsWith(ext)).sort();
}
function sha256(s) { return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16); }
function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function safeJsonStringify(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

// ----------------------------- markdown → blocks -----------------------------

function renderInlineHtml(md) {
  // Used for short strings: mock choices, card prompts, cheat-sheet inline.
  const html = marked.parseInline(md || '', { async: false, gfm: true });
  return html.trim();
}

function renderBlockHtml(md) {
  return marked.parse(md || '', { async: false, gfm: true }).trim();
}

// Detect unfenced mermaid blocks and wrap them in ```mermaid fences.
// Handles source files where flowchart/sequenceDiagram/etc. were pasted raw
// without code fences — marked would otherwise lex them as a paragraph.
const MERMAID_STARTER = /^\s*(flowchart\s+(TB|TD|BT|RL|LR)\b|graph\s+(TB|TD|BT|RL|LR)\b|sequenceDiagram\b|stateDiagram(-v2)?\b|classDiagram\b|erDiagram\b|journey\b|gantt\b|pie\b|gitGraph\b|mindmap\b|timeline\b)/;

// Newlines inside quoted labels break the mermaid parser (it treats each
// line as a separate statement). Convert them to <br/> so multi-line
// node labels survive.
function normalizeQuotedNewlines(src) {
  let out = '';
  let inQ = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '"') { inQ = !inQ; out += ch; continue; }
    if (inQ && ch === '\n') { out += '<br/>'; continue; }
    out += ch;
  }
  return out;
}

// Several source lessons ship mermaid as one long line (every statement on
// the same line, space-separated). Mermaid can't parse that — statements
// must be separated by newlines or `;`. Insert newlines before common
// statement boundaries so at least the common shapes render.
function reflowSingleLineMermaid(src) {
  // Runs unconditionally — regexes are safe on well-formed multi-line
  // source (they match keywords preceded by any whitespace, so existing
  // newlines survive). Needed because some source files cram statements
  // onto a single line with only label-internal newlines.
  let s = src;
  // Split off the header keyword from the first statement.
  s = s.replace(/^(\s*(?:flowchart|graph)\s+(?:TB|TD|BT|RL|LR))\s+/, '$1\n  ');
  s = s.replace(/^(\s*(?:sequenceDiagram|classDiagram|erDiagram|journey|gantt|pie|gitGraph|mindmap|timeline|stateDiagram(?:-v2)?))\s+/, '$1\n  ');
  // Keyword-led statements always start a new line.
  s = s.replace(/\s+(subgraph\s)/g, '\n  $1');
  s = s.replace(/\s+(end)(?!\w)/g, '\n  $1');
  s = s.replace(/\s+(direction\s)/g, '\n  $1');
  s = s.replace(/\s+(classDef\s)/g, '\n  $1');
  s = s.replace(/\s+(class\s+[A-Z])/g, '\n  $1');
  s = s.replace(/\s+(participant\s)/g, '\n  $1');
  s = s.replace(/\s+(autonumber\b)/g, '\n  $1');
  s = s.replace(/\s+(Note\s+(?:over|left of|right of)\s)/g, '\n  $1');
  // After a closing node shape, if followed by a bare ID + bracket/arrow,
  // that's the start of a new statement.
  s = s.replace(/([\]\}\)])\s+([A-Za-z]\w*)(\s*(?:\[|\{|\(|--|==|-\.))/g, '$1\n  $2$3');
  // After an edge terminator `--> ID`, if followed by another `ID <edge>`,
  // split so each edge statement sits on its own line. The next edge can
  // be any mermaid flowchart edge opener: `-->`, `-.->`, `==>`, or the
  // label variants `-- text --`, `-. text .->`, `== text ==>`.
  const EDGE_START = '(?:-->|-\\.->|==>|--\\s|==\\s|-\\.\\s)';
  s = s.replace(new RegExp(`(-->|-\\.->|==>)\\s+([A-Za-z]\\w*)\\s+(?=[A-Za-z]\\w*\\s*${EDGE_START})`, 'g'), '$1 $2\n  ');
  // Sequence-diagram message edges (`->>`, `-->>`, `-x`, `--x`).
  // Break before any identifier that starts a new message line.
  s = s.replace(/\s+([A-Za-z]\w*\s*(?:->>\+?|-->>\+?|->>-|--x|-x))/g, '\n  $1');
  // `direction LR` and standalone `end` terminate a statement — the next
  // identifier begins a fresh one.
  s = s.replace(/\b(direction\s+(?:TB|TD|BT|RL|LR))\s+(?=[A-Za-z])/g, '$1\n  ');
  s = s.replace(/(^|\n)(\s*end)\b(?!\w)[ \t]+(?=[A-Za-z])/g, '$1$2\n  ');
  return s;
}

function preprocessMermaid(md) {
  const lines = md.split('\n');
  const out = [];
  let inFence = false;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      out.push(line);
      i++;
      continue;
    }
    if (!inFence && MERMAID_STARTER.test(line)) {
      const block = [];
      let inQuote = false;
      while (i < lines.length) {
        const cur = lines[i];
        // Only treat a blank line as a block terminator when we are NOT
        // inside a quoted node label. Source files sometimes embed a
        // blank line inside a label (e.g. multi-paragraph code snippets).
        if (!inQuote && cur.trim() === '') break;
        block.push(cur);
        for (let k = 0; k < cur.length; k++) if (cur[k] === '"') inQuote = !inQuote;
        i++;
      }
      // Strip accidental markdown escapes inside mermaid source.
      // Also strip the `  ` markdown hard-break before newlines — those
      // only exist because the source was authored as markdown paragraphs.
      const joined = block.join('\n')
        .replace(/\\([\[\]()<>_*`])/g, '$1')
        .replace(/ {2,}\n/g, '\n');
      const src = normalizeQuotedNewlines(reflowSingleLineMermaid(joined));
      out.push('```mermaid');
      out.push(src);
      out.push('```');
      continue;
    }
    out.push(line);
    i++;
  }
  return out.join('\n');
}

// Turn a markdown body into the SCHEMA LessonBlock[] array.
// Uses marked's lexer to walk tokens, then applies callout / checkpoint / code transforms.
function parseLessonBlocks(md) {
  const tokens = marked.lexer(preprocessMermaid(md || ''));
  const blocks = [];

  for (const tok of tokens) {
    switch (tok.type) {
      case 'heading': {
        const level = tok.depth;
        const kind = level === 2 ? 'h2' : level === 3 ? 'h3' : level === 4 ? 'h3' : 'p';
        blocks.push({
          kind,
          html: renderInlineHtml(tok.text),
          text: tok.text
        });
        break;
      }
      case 'paragraph': {
        blocks.push({
          kind: 'p',
          html: renderInlineHtml(tok.text),
          text: tok.text
        });
        break;
      }
      case 'code': {
        let lang = (tok.lang || '').toLowerCase().trim();
        if (!lang) {
          warn('code fence without language tag');
          lang = 'text';
        } else if (!LANG_OK.has(lang)) {
          warn('unrecognised code fence language: ' + lang);
        }
        if (lang === 'mermaid') {
          blocks.push({ kind: 'mermaid', source: tok.text });
        } else {
          blocks.push({ kind: 'code', lang, code: tok.text });
        }
        break;
      }
      case 'blockquote': {
        const out = classifyBlockquote(tok);
        blocks.push(out);
        break;
      }
      case 'table': {
        blocks.push({
          kind: 'table',
          html: renderBlockHtml(tok.raw)
        });
        break;
      }
      case 'list': {
        blocks.push({
          kind: 'p',
          html: renderBlockHtml(tok.raw),
          text: tok.raw
        });
        break;
      }
      case 'html': {
        blocks.push({ kind: 'html', html: tok.raw });
        break;
      }
      case 'space':
      case 'hr':
        break;
      default:
        // Unknown token type — fall back to rendering as HTML.
        blocks.push({ kind: 'html', html: renderBlockHtml(tok.raw || '') });
    }
  }
  return fuseDiagramBlocks(splitCheckParagraphs(blocks));
}

// COMP 4915 lessons ship inline "Check: question?answer" prompts as plain
// paragraph text (sometimes several concatenated in one paragraph). Convert
// them into checkpoint blocks so the renderer's click-to-reveal works.
function splitCheckParagraphs(blocks) {
  const out = [];
  for (const b of blocks) {
    if (!b || b.kind !== 'p' || typeof b.text !== 'string' || !/(^|\s)Check:\s/.test(b.text)) {
      out.push(b);
      continue;
    }
    const text = b.text;
    const idx = text.search(/(^|\s)Check:\s/);
    const matchStart = text[idx] === 'C' ? idx : idx + 1;
    const prefix = text.slice(0, matchStart).trim();
    if (prefix) out.push({ kind: 'p', html: renderInlineHtml(prefix), text: prefix });
    const rest = text.slice(matchStart + 'Check:'.length);
    const segments = rest.split(/\s+Check:\s+/);
    for (let seg of segments) {
      seg = seg.trim();
      if (!seg) continue;
      const qEnd = findCheckpointBoundary(seg);
      let q, a;
      if (qEnd === -1) { q = seg; a = ''; }
      else { q = seg.slice(0, qEnd + 1).trim(); a = seg.slice(qEnd + 1).trim(); }
      out.push({ kind: 'checkpoint', q, a });
    }
  }
  return out;
}

// First '?' outside of backtick code spans marks the Q/A split.
function findCheckpointBoundary(s) {
  let inCode = false;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '`') { inCode = !inCode; continue; }
    if (!inCode && s[i] === '?') return i;
  }
  return -1;
}

// Fuse a caption paragraph + <svg> paragraph + optional legend paragraph
// into a single `diagram` block. Matches v1 source HTML where these three
// parts were grouped in a <div class="diagram">. The renderer turns this
// back into one framed card so the diagram, its title, and its legend read
// as a single unit instead of three loose paragraphs.
function fuseDiagramBlocks(blocks) {
  const SVG_RE = /^\s*<svg\b/i;
  const out = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b && b.kind === 'p' && typeof b.html === 'string' && SVG_RE.test(b.html)) {
      // Pop a short plain-text caption off the end if present.
      let title = null;
      const prev = out[out.length - 1];
      if (prev && prev.kind === 'p' && typeof prev.text === 'string'
          && prev.text.length <= 140
          && !/<(svg|img|ul|ol|table|div|h[1-6])/i.test(prev.html || '')) {
        title = prev.text.trim();
        out.pop();
      }
      // Absorb a trailing legend paragraph that starts with a <strong> label.
      let legend = null;
      const next = blocks[i + 1];
      if (next && next.kind === 'p' && typeof next.html === 'string'
          && /^\s*<strong\b/i.test(next.html)) {
        legend = next.html;
        i++;
      }
      out.push({ kind: 'diagram', title, svg: b.html, legend });
      i++;
      continue;
    }
    out.push(b);
    i++;
  }
  return out;
}

function classifyBlockquote(tok) {
  // Detect `**Q:** ... **A:** ...` checkpoint.
  const raw = tok.raw
    .replace(/^>\s?/gm, '')
    .replace(/\r\n/g, '\n')
    .trim();

  const qMatch = raw.match(/^\*\*Q:\*\*\s*([\s\S]*?)(?=\n\s*\*\*A:\*\*)/i);
  const aMatch = raw.match(/\*\*A:\*\*\s*([\s\S]*)$/i);
  if (qMatch && aMatch) {
    return {
      kind: 'checkpoint',
      q: qMatch[1].trim(),
      a: aMatch[1].trim()
    };
  }

  // Detect `**Label**` first-line callout.
  const firstLine = raw.split('\n', 1)[0].trim();
  const labelMatch = firstLine.match(/^\*\*([A-Za-z]+)\*\*\s*\.?\s*$/);
  if (labelMatch) {
    const key = labelMatch[1].toLowerCase();
    if (RECOGNISED_CALLOUTS[key]) {
      const body = raw.slice(firstLine.length).replace(/^\n+/, '');
      return {
        kind: 'callout',
        variant: RECOGNISED_CALLOUTS[key],
        html: renderBlockHtml(body),
        text: body
      };
    } else {
      warn('unknown callout label: ' + labelMatch[1]);
    }
  }

  // Inline `**Label**.` at start of first line — still a callout.
  const inlineLabel = firstLine.match(/^\*\*([A-Za-z]+)\*\*\.?\s+(.*)$/);
  if (inlineLabel && RECOGNISED_CALLOUTS[inlineLabel[1].toLowerCase()]) {
    const key = inlineLabel[1].toLowerCase();
    const rest = (inlineLabel[2] + '\n' + raw.split('\n').slice(1).join('\n')).trim();
    return {
      kind: 'callout',
      variant: RECOGNISED_CALLOUTS[key],
      html: renderBlockHtml(rest),
      text: rest
    };
  }

  // Plain blockquote.
  return {
    kind: 'html',
    html: renderBlockHtml(tok.raw)
  };
}

// ----------------------------- loaders ---------------------------------------

function loadCourseMeta(dir) {
  const course = yaml.load(readFile(path.join(dir, 'course.yaml')));
  if (!course || !course.id || !course.code || !course.name || !course.exam) {
    fail('course.yaml missing required fields at ' + dir);
  }
  const meta = {
    id: course.id,
    code: course.code,
    name: course.name,
    exam: course.exam,
    room: course.room || '',
    format: course.format || '',
    instructor: course.instructor,
    sections: course.sections,
    notes_html: course.notes ? renderBlockHtml(course.notes) : undefined
  };
  return meta;
}

function loadFlashcards(dir) {
  const fc = yaml.load(readFile(path.join(dir, 'flashcards.yaml')));
  if (!fc || !Array.isArray(fc.modules)) fail('flashcards.yaml missing modules[]');
  for (const m of fc.modules) {
    if (!m.id || !m.name || !Array.isArray(m.topics)) fail('invalid module: ' + JSON.stringify(m).slice(0, 80));
    for (const t of m.topics) {
      if (!t.id || !t.name || !Array.isArray(t.cards) || t.cards.length === 0) {
        fail('invalid topic ' + t.id + ' (must have id, name, cards[])');
      }
      for (const card of t.cards) {
        validateCard(card, t.id);
      }
    }
  }
  return fc.modules;
}

function validateCard(c, topicId) {
  if (!c.type) fail('card in topic ' + topicId + ' missing type');
  if (c.type === 'cloze') {
    if (!c.prompt || !/\{\{[^}]+\}\}/.test(c.prompt)) {
      fail('cloze card in ' + topicId + ' has no {{…}} blanks');
    }
  } else if (c.type === 'name' || c.type === 'predict' || c.type === 'diagram') {
    if (!c.prompt && c.type !== 'predict') fail(`${c.type} card in ${topicId} missing prompt`);
    if (!c.answer) fail(`${c.type} card in ${topicId} missing answer`);
  } else {
    warn('unknown card type: ' + c.type + ' in ' + topicId);
  }
}

function loadMockExam(dir) {
  const mx = yaml.load(readFile(path.join(dir, 'mock-exam.yaml')));
  if (!mx || !Array.isArray(mx.questions)) fail('mock-exam.yaml missing questions[]');
  const idSeen = new Set();
  for (const q of mx.questions) {
    if (!q.id) fail('mock question missing id');
    if (idSeen.has(q.id)) fail('duplicate mock question id: ' + q.id);
    idSeen.add(q.id);
    if (!q.type) fail('mock question ' + q.id + ' missing type');
    if (q.type === 'MCQ') {
      if (!Array.isArray(q.choices) || q.choices.length === 0) fail('MCQ ' + q.id + ' missing choices');
      if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.choices.length) {
        fail('MCQ ' + q.id + ' correct index out of range');
      }
    } else if (q.type === 'MULTI') {
      if (!Array.isArray(q.choices) || q.choices.length === 0) fail('MULTI ' + q.id + ' missing choices');
      if (!Array.isArray(q.correct) || q.correct.length === 0) fail('MULTI ' + q.id + ' invalid correct');
      for (const c of q.correct) {
        if (c < 0 || c >= q.choices.length) fail('MULTI ' + q.id + ' correct contains out-of-range');
      }
    } else if (q.type === 'SHORT') {
      if (typeof q.correct !== 'string') fail('SHORT ' + q.id + ' correct must be string');
    } else {
      warn('unknown mock type: ' + q.type);
    }
  }
  return {
    duration_seconds: mx.duration_seconds || 3600,
    pass_mark: mx.pass_mark,
    questions: mx.questions
  };
}

function loadLessons(dir) {
  const lessonsDir = path.join(dir, 'lessons');
  const files = readDirFiles(lessonsDir, '.md');
  const lessons = [];
  for (const f of files) {
    const { data, content } = matter(readFile(path.join(lessonsDir, f)));
    for (const req of ['n', 'id', 'title']) {
      if (data[req] === undefined) fail(`lesson ${f} missing frontmatter field: ${req}`);
    }
    if (!content.trim()) warn(`lesson ${f} body empty`);
    const blocks = parseLessonBlocks(content);
    lessons.push({
      n: data.n,
      id: data.id,
      title: data.title,
      hook: data.hook || '',
      tags: data.tags || [],
      module: data.module || '',
      priority: data.priority,
      source: data.source,
      blocks
    });
  }
  return lessons.sort((a, b) => a.n - b.n);
}

function loadCodePractice(dir) {
  const cpDir = path.join(dir, 'code-practice');
  const files = readDirFiles(cpDir, '.md');
  const problems = [];
  for (const f of files) {
    const { data, content } = matter(readFile(path.join(cpDir, f)));
    for (const req of ['n', 'id', 'title', 'lang']) {
      if (data[req] === undefined) fail(`code-practice ${f} missing frontmatter: ${req}`);
    }
    const variant = data.variant || 'starter-solution';
    const parsed = parseCodePracticeBody(content, variant, f, data.lang);
    problems.push({
      n: data.n,
      id: data.id,
      title: data.title,
      lang: data.lang,
      tags: data.tags || [],
      variant,
      ...parsed
    });
  }
  return problems.sort((a, b) => a.n - b.n);
}

function parseCodePracticeBody(md, variant, fname, lang) {
  // Split on H2 headings.
  const sections = {};
  const re = /^##\s+(.+?)\s*$/gm;
  const heads = [];
  let m;
  while ((m = re.exec(md)) !== null) heads.push({ title: m[1].trim(), idx: m.index, end: re.lastIndex });
  for (let i = 0; i < heads.length; i++) {
    const s = heads[i];
    const next = heads[i + 1];
    const body = md.slice(s.end, next ? next.idx : md.length).trim();
    sections[s.title.toLowerCase()] = body;
  }

  if (variant === 'annotation') {
    if (!sections['code'] || !sections['notes']) {
      fail(`code-practice ${fname} (annotation) missing Code/Notes sections`);
    }
    const codeMatch = sections['code'].match(/```[\w-]*\n([\s\S]*?)\n```/);
    if (!codeMatch) fail(`code-practice ${fname} Code section has no fenced block`);
    const notes = parseAnnotationNotes(sections['notes']);
    return { code: codeMatch[1], notes };
  }

  // starter-solution
  const need = ['prompt', 'starter', 'solution', 'why'];
  for (const k of need) {
    if (!sections[k]) fail(`code-practice ${fname} missing H2 "${k[0].toUpperCase() + k.slice(1)}"`);
  }
  const starterFence = sections['starter'].match(/```([\w-]*)\n([\s\S]*?)\n```/);
  const solFence = sections['solution'].match(/```([\w-]*)\n([\s\S]*?)\n```/);
  if (!starterFence) fail(`code-practice ${fname} Starter has no fenced block`);
  if (!solFence) fail(`code-practice ${fname} Solution has no fenced block`);

  const extraStarter = sections['starter'].match(/```[\w-]*\n[\s\S]*?\n```[\s\S]+?```[\w-]*\n/);
  if (extraStarter) warn(`code-practice ${fname} Starter has multiple fences`);
  const extraSol = sections['solution'].match(/```[\w-]*\n[\s\S]*?\n```[\s\S]+?```[\w-]*\n/);
  if (extraSol) warn(`code-practice ${fname} Solution has multiple fences`);

  return {
    prompt_html: renderBlockHtml(sections['prompt']),
    starter: starterFence[2],
    solution: solFence[2],
    why_html: renderBlockHtml(sections['why'])
  };
}

function parseAnnotationNotes(md) {
  const lines = md.split('\n');
  const notes = [];
  for (const line of lines) {
    // `- **line N** · tag — text`  or  `- **lines 1–N** · tag — text`
    const m = line.match(/^\s*-\s+\*\*line[s]?\s+([0-9–\-,\s]+)\*\*\s*[·.]\s*(.+?)\s*[—-]\s*(.+)$/);
    if (m) {
      const lineStr = m[1].trim();
      const first = parseInt(lineStr.match(/\d+/)?.[0] || '0', 10);
      notes.push({ line: first, tag: m[2].trim(), text: m[3].trim() });
    } else if (/\S/.test(line)) {
      // Loose bullet — keep as line 0.
      const loose = line.replace(/^\s*-\s+/, '').trim();
      if (loose && !/^<!--/.test(loose)) notes.push({ line: 0, tag: 'note', text: loose });
    }
  }
  return notes;
}

function loadTopicDives(dir) {
  const td = path.join(dir, 'topic-dives');
  const files = readDirFiles(td, '.md');
  const dives = [];
  for (const f of files) {
    const { data, content } = matter(readFile(path.join(td, f)));
    if (!data.id || !data.title) fail(`topic-dive ${f} missing id/title`);
    const blocks = parseLessonBlocks(content);
    dives.push({
      id: data.id,
      title: data.title,
      pillar: data.pillar || 'tech',
      priority: data.priority || 'mid',
      chapter: data.chapter,
      tags: data.tags || [],
      blocks
    });
  }
  const prio = { high: 0, mid: 1, low: 2 };
  return dives.sort((a, b) => (prio[a.priority] || 1) - (prio[b.priority] || 1) || a.title.localeCompare(b.title));
}

function loadCheatSheet(dir) {
  const src = readFile(path.join(dir, 'cheat-sheet.md'));
  const { data, content } = matter(src);
  const re = /^##\s+(.+?)\s*$/gm;
  const heads = [];
  let m;
  while ((m = re.exec(content)) !== null) heads.push({ title: m[1].trim(), idx: m.index, end: re.lastIndex });
  if (heads.length === 0) fail('cheat-sheet.md has no ## blocks at ' + dir);
  const blocks = [];
  for (let i = 0; i < heads.length; i++) {
    const s = heads[i];
    const next = heads[i + 1];
    const body = content.slice(s.end, next ? next.idx : content.length).trim();
    blocks.push({
      heading: s.title,
      body_md: body,
      body_html: renderBlockHtml(body)
    });
  }
  return { title: data.title, blocks };
}

// ----------------------------- build -----------------------------------------

function buildCourse(id) {
  const dir = path.join(CONTENT_DIR, id);
  if (!fs.existsSync(dir)) fail('missing content dir: ' + dir);
  const meta = loadCourseMeta(dir);
  if (meta.id !== id) fail(`course.yaml id "${meta.id}" !== dir name "${id}"`);
  const modules = loadFlashcards(dir);
  const mockExam = loadMockExam(dir);
  const lessons = loadLessons(dir);
  const codePractice = loadCodePractice(dir);
  const topicDives = loadTopicDives(dir);
  const cheatSheet = loadCheatSheet(dir);

  return { meta, modules, mockExam, lessons, codePractice, topicDives, cheatSheet };
}

function main() {
  const args = process.argv.slice(2);
  const targets = args.length ? args : COURSES;

  ensureDir(DIST_DIR);
  const manifest = { courses: [], builtAt: new Date().toISOString() };
  const globalTopicIds = new Set();
  const globalLessonIds = new Set();
  const globalCodeIds = new Set();
  const globalDiveIds = new Set();

  for (const id of targets) {
    process.stdout.write(`Building ${id}... `);
    const bundle = buildCourse(id);

    // Cross-course uniqueness.
    for (const m of bundle.modules) for (const t of m.topics) {
      if (globalTopicIds.has(t.id)) fail(`duplicate topic id across courses: ${t.id}`);
      globalTopicIds.add(t.id);
    }
    for (const l of bundle.lessons) {
      if (globalLessonIds.has(l.id)) fail(`duplicate lesson id: ${l.id}`);
      globalLessonIds.add(l.id);
    }
    for (const c of bundle.codePractice) {
      if (globalCodeIds.has(c.id)) fail(`duplicate code-practice id: ${c.id}`);
      globalCodeIds.add(c.id);
    }
    for (const d of bundle.topicDives) {
      if (globalDiveIds.has(d.id)) fail(`duplicate topic-dive id: ${d.id}`);
      globalDiveIds.add(d.id);
    }

    const payload = safeJsonStringify(bundle);
    const js = `/* auto-generated by scripts/build-content.js — do not edit */\nwindow.CONTENT = window.CONTENT || {};\nwindow.CONTENT[${JSON.stringify(id)}] = ${payload};\n`;
    const outPath = path.join(DIST_DIR, `${id}.js`);
    fs.writeFileSync(outPath, js);
    const hash = sha256(js);
    manifest.courses.push({
      id,
      file: path.relative(ROOT, outPath),
      hash,
      counts: {
        modules: bundle.modules.length,
        topics: bundle.modules.reduce((a, m) => a + m.topics.length, 0),
        cards: bundle.modules.reduce((a, m) => a + m.topics.reduce((b, t) => b + t.cards.length, 0), 0),
        lessons: bundle.lessons.length,
        codePractice: bundle.codePractice.length,
        topicDives: bundle.topicDives.length,
        cheatBlocks: bundle.cheatSheet.blocks.length,
        mockQuestions: bundle.mockExam.questions.length
      }
    });
    process.stdout.write(`ok (${hash})\n`);
  }

  fs.writeFileSync(path.join(DIST_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  process.stdout.write(`\nManifest: ${path.relative(ROOT, path.join(DIST_DIR, 'manifest.json'))}\n`);
  if (warnings.length) process.stdout.write(`Warnings: ${warnings.length} (see stderr above)\n`);
}

try {
  main();
} catch (e) {
  process.stderr.write('\n' + e.message + '\n');
  process.exit(1);
}
