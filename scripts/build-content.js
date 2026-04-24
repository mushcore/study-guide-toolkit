#!/usr/bin/env node
// Compile `content/{courseId}/` → `content/_dist/{courseId}.js` bundles.
// Spec: content/SCHEMA.md §Compilation + §Validation.
//
//   node scripts/build-content.js              # build all courses
//   node scripts/build-content.js 4736 4911    # subset
//
// Output shape (per SCHEMA §Compilation):
//   window.CONTENT["{id}"] = { meta, modules, mockExam, lessons, practice, cheatSheet };
//
// Breaking changes from the previous compiler:
// - codePractice[] → practice[] with kind: code | applied discriminator.
// - topicDives[] removed entirely.
// - cheatSheet may be null when course.yaml.cheatsheet_allowed is false.
// - course meta.cheatsheet_allowed required.
// - Legacy directories `topic-dives/` and `code-practice/` fail the build.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const DIST_DIR = path.join(CONTENT_DIR, '_dist');
const COURSES = ['4736', '4870', '4911', '4915', '3522', 'COMP3975', 'COMP4537'];

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
  'console', 'dockerfile', 'makefile', 'ini', 'toml', 'diff', 'regex', 'apache', 'nginx',
  'php', 'blade'
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
  const html = marked.parseInline(md || '', { async: false, gfm: true });
  return html.trim();
}

function renderBlockHtml(md) {
  return marked.parse(md || '', { async: false, gfm: true }).trim();
}

const MERMAID_STARTER = /^\s*(flowchart\s+(TB|TD|BT|RL|LR)\b|graph\s+(TB|TD|BT|RL|LR)\b|sequenceDiagram\b|stateDiagram(-v2)?\b|classDiagram\b|erDiagram\b|journey\b|gantt\b|pie\b|gitGraph\b|mindmap\b|timeline\b)/;

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

function reflowSingleLineMermaid(src) {
  let s = src;
  s = s.replace(/^(\s*(?:flowchart|graph)\s+(?:TB|TD|BT|RL|LR))\s+/, '$1\n  ');
  s = s.replace(/^(\s*(?:sequenceDiagram|classDiagram|erDiagram|journey|gantt|pie|gitGraph|mindmap|timeline|stateDiagram(?:-v2)?))\s+/, '$1\n  ');
  s = s.replace(/\s+(subgraph\s)/g, '\n  $1');
  s = s.replace(/\s+(end)(?!\w)/g, '\n  $1');
  s = s.replace(/\s+(direction\s)/g, '\n  $1');
  s = s.replace(/\s+(classDef\s)/g, '\n  $1');
  s = s.replace(/\s+(class\s+[A-Z])/g, '\n  $1');
  s = s.replace(/\s+(participant\s)/g, '\n  $1');
  s = s.replace(/\s+(autonumber\b)/g, '\n  $1');
  s = s.replace(/\s+(Note\s+(?:over|left of|right of)\s)/g, '\n  $1');
  s = s.replace(/([\]\}\)])\s+([A-Za-z]\w*)(\s*(?:\[|\{|\(|--|==|-\.))/g, '$1\n  $2$3');
  const EDGE_START = '(?:-->|-\\.->|==>|--\\s|==\\s|-\\.\\s)';
  s = s.replace(new RegExp(`(-->|-\\.->|==>)\\s+([A-Za-z]\\w*)\\s+(?=[A-Za-z]\\w*\\s*${EDGE_START})`, 'g'), '$1 $2\n  ');
  s = s.replace(/\s+([A-Za-z]\w*\s*(?:->>\+?|-->>\+?|->>-|--x|-x))/g, '\n  $1');
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
        if (!inQuote && cur.trim() === '') break;
        block.push(cur);
        for (let k = 0; k < cur.length; k++) if (cur[k] === '"') inQuote = !inQuote;
        i++;
      }
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
        blocks.push({ kind: 'html', html: renderBlockHtml(tok.raw || '') });
    }
  }
  return fuseDiagramBlocks(splitCheckParagraphs(blocks));
}

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

function findCheckpointBoundary(s) {
  let inCode = false;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '`') { inCode = !inCode; continue; }
    if (!inCode && s[i] === '?') return i;
  }
  return -1;
}

function fuseDiagramBlocks(blocks) {
  const SVG_RE = /^\s*<svg\b/i;
  const out = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b && b.kind === 'p' && typeof b.html === 'string' && SVG_RE.test(b.html)) {
      let title = null;
      const prev = out[out.length - 1];
      if (prev && prev.kind === 'p' && typeof prev.text === 'string'
          && prev.text.length <= 140
          && !/<(svg|img|ul|ol|table|div|h[1-6])/i.test(prev.html || '')) {
        title = prev.text.trim();
        out.pop();
      }
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

  const inlineLabel = firstLine.match(/^\*\*([A-Za-z]+)\*\*[.:]?\s+(.*)$/);
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

  return {
    kind: 'html',
    html: renderBlockHtml(tok.raw)
  };
}

// ----------------------------- legacy-directory guard ------------------------

function rejectLegacyDirs(dir, id) {
  const legacy = [
    { dirname: 'topic-dives', msg: 'deprecated `topic-dives/` directory found — dives are removed from the schema. Run `/enrich-course ' + id + '` to migrate (Category H1).' },
    { dirname: 'code-practice', msg: 'deprecated `code-practice/` directory found — renamed to `practice/` with `kind:` discriminator. Run `/enrich-course ' + id + '` to migrate (Category H2).' }
  ];
  for (const { dirname, msg } of legacy) {
    if (fs.existsSync(path.join(dir, dirname))) fail(`[${id}] ${msg}`);
  }
}

// ----------------------------- loaders ---------------------------------------

function loadCourseMeta(dir) {
  const course = yaml.load(readFile(path.join(dir, 'course.yaml')));
  if (!course || !course.id || !course.code || !course.name || !course.exam) {
    fail('course.yaml missing required fields at ' + dir);
  }
  if (typeof course.cheatsheet_allowed !== 'boolean') {
    fail('course.yaml missing required field `cheatsheet_allowed` (bool) at ' + dir);
  }
  const meta = {
    id: course.id,
    code: course.code,
    name: course.name,
    exam: course.exam,
    room: course.room || '',
    format: course.format || '',
    cheatsheet_allowed: course.cheatsheet_allowed,
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
      if (t.priority !== undefined) {
        warn(`topic ${t.id} has deprecated "priority" field — remove (field no longer supported)`);
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
  let strategyCount = 0;
  for (const f of files) {
    const { data, content } = matter(readFile(path.join(lessonsDir, f)));
    for (const req of ['n', 'id', 'title']) {
      if (data[req] === undefined) fail(`lesson ${f} missing frontmatter field: ${req}`);
    }
    if (data.kind === 'strategy') {
      strategyCount++;
      // Strategy lesson id is `{courseId}-exam-strategy` — per-course to satisfy
      // global lesson-id uniqueness. Bare `exam-strategy` is accepted for new
      // courses where the author hasn't yet prefixed.
      if (data.id !== 'exam-strategy' && !/-exam-strategy$/.test(data.id)) {
        fail(`lesson ${f} has kind: strategy but id is "${data.id}" (must be "exam-strategy" or "{courseId}-exam-strategy")`);
      }
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
      kind: data.kind,
      source: data.source,
      blocks
    });
  }
  if (strategyCount === 0) fail(`no lesson with kind: strategy found — every course must include lessons/00-exam-strategy.md`);
  if (strategyCount > 1) fail(`multiple lessons with kind: strategy found — exactly one required`);
  return lessons.sort((a, b) => a.n - b.n);
}

function loadPractice(dir) {
  const pDir = path.join(dir, 'practice');
  if (!fs.existsSync(pDir)) fail('missing `practice/` directory at ' + dir);
  const files = readDirFiles(pDir, '.md');
  if (files.length === 0) fail('`practice/` directory is empty at ' + dir);
  const problems = [];
  for (const f of files) {
    const { data, content } = matter(readFile(path.join(pDir, f)));
    for (const req of ['n', 'id', 'title', 'kind', 'source']) {
      if (data[req] === undefined) fail(`practice ${f} missing frontmatter field: ${req}`);
    }
    if (data.kind !== 'code' && data.kind !== 'applied') {
      fail(`practice ${f} has invalid kind: "${data.kind}" (must be "code" or "applied")`);
    }
    if (data.kind === 'code') {
      if (!data.lang) fail(`practice ${f} (kind: code) missing frontmatter field: lang`);
      const variant = data.variant || 'starter-solution';
      if (variant !== 'starter-solution' && variant !== 'annotation') {
        fail(`practice ${f} has invalid variant: "${variant}" (must be "starter-solution" or "annotation")`);
      }
      const parsed = parseCodePracticeBody(content, variant, f, data.lang);
      problems.push({
        kind: 'code',
        variant,
        n: data.n,
        id: data.id,
        title: data.title,
        lang: data.lang,
        tags: data.tags || [],
        source: data.source,
        ...parsed
      });
    } else {
      // kind: applied
      const parsed = parseAppliedPracticeBody(content, f);
      problems.push({
        kind: 'applied',
        n: data.n,
        id: data.id,
        title: data.title,
        tags: data.tags || [],
        source: data.source,
        ...parsed
      });
    }
  }
  return problems.sort((a, b) => a.n - b.n);
}

function splitH2Sections(md) {
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
  return sections;
}

function parseCodePracticeBody(md, variant, fname, lang) {
  const sections = splitH2Sections(md);

  if (variant === 'annotation') {
    if (!sections['code'] || !sections['notes']) {
      fail(`practice ${fname} (kind: code, variant: annotation) missing Code/Notes sections`);
    }
    const codeMatch = sections['code'].match(/```[\w-]*\n([\s\S]*?)\n```/);
    if (!codeMatch) fail(`practice ${fname} Code section has no fenced block`);
    const notes = parseAnnotationNotes(sections['notes']);
    return { code: codeMatch[1], notes };
  }

  // starter-solution
  const need = ['prompt', 'starter', 'solution', 'why'];
  for (const k of need) {
    if (!sections[k]) fail(`practice ${fname} (kind: code) missing H2 "${k[0].toUpperCase() + k.slice(1)}"`);
  }
  const starterFence = sections['starter'].match(/```([\w-]*)\n([\s\S]*?)\n```/);
  const solFence = sections['solution'].match(/```([\w-]*)\n([\s\S]*?)\n```/);
  if (!starterFence) fail(`practice ${fname} Starter has no fenced block`);
  if (!solFence) fail(`practice ${fname} Solution has no fenced block`);

  const extraStarter = sections['starter'].match(/```[\w-]*\n[\s\S]*?\n```[\s\S]+?```[\w-]*\n/);
  if (extraStarter) warn(`practice ${fname} Starter has multiple fences`);
  const extraSol = sections['solution'].match(/```[\w-]*\n[\s\S]*?\n```[\s\S]+?```[\w-]*\n/);
  if (extraSol) warn(`practice ${fname} Solution has multiple fences`);

  return {
    prompt_html: renderBlockHtml(sections['prompt']),
    starter: starterFence[2],
    solution: solFence[2],
    why_html: renderBlockHtml(sections['why'])
  };
}

function parseAppliedPracticeBody(md, fname) {
  const sections = splitH2Sections(md);
  const need = ['problem', 'walkthrough', 'common wrong approaches', 'why'];
  for (const k of need) {
    if (!sections[k]) {
      const prettyName = k.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      fail(`practice ${fname} (kind: applied) missing H2 "${prettyName}"`);
    }
  }
  return {
    problem_html: renderBlockHtml(sections['problem']),
    walkthrough_html: renderBlockHtml(sections['walkthrough']),
    common_wrong_html: renderBlockHtml(sections['common wrong approaches']),
    why_html: renderBlockHtml(sections['why'])
  };
}

function parseAnnotationNotes(md) {
  const lines = md.split('\n');
  const notes = [];
  for (const line of lines) {
    const m = line.match(/^\s*-\s+\*\*line[s]?\s+([0-9–\-,\s]+)\*\*\s*[·.]\s*(.+?)\s*[—-]\s*(.+)$/);
    if (m) {
      const lineStr = m[1].trim();
      const first = parseInt(lineStr.match(/\d+/)?.[0] || '0', 10);
      notes.push({ line: first, tag: m[2].trim(), text: m[3].trim() });
    } else if (/\S/.test(line)) {
      const loose = line.replace(/^\s*-\s+/, '').trim();
      if (loose && !/^<!--/.test(loose)) notes.push({ line: 0, tag: 'note', text: loose });
    }
  }
  return notes;
}

function loadCheatSheet(dir, cheatsheetAllowed) {
  const cheatPath = path.join(dir, 'cheat-sheet.md');
  const exists = fs.existsSync(cheatPath);

  if (!cheatsheetAllowed) {
    if (exists) {
      fail(`cheat-sheet.md present but course.yaml has cheatsheet_allowed: false — delete the file (the real exam doesn't permit one) or flip the flag`);
    }
    return null;
  }

  if (!exists) {
    fail(`course.yaml has cheatsheet_allowed: true but cheat-sheet.md is missing at ${dir}`);
  }

  const src = readFile(cheatPath);
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
  rejectLegacyDirs(dir, id);
  const meta = loadCourseMeta(dir);
  if (meta.id !== id) fail(`course.yaml id "${meta.id}" !== dir name "${id}"`);
  const modules = loadFlashcards(dir);
  const mockExam = loadMockExam(dir);
  const lessons = loadLessons(dir);
  const practice = loadPractice(dir);
  const cheatSheet = loadCheatSheet(dir, meta.cheatsheet_allowed);

  return { meta, modules, mockExam, lessons, practice, cheatSheet };
}

function main() {
  const args = process.argv.slice(2);
  const targets = args.length ? args : COURSES;

  ensureDir(DIST_DIR);
  const manifest = { courses: [], builtAt: new Date().toISOString() };
  const globalTopicIds = new Set();
  const globalLessonIds = new Set();
  const globalPracticeIds = new Set();

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
    for (const p of bundle.practice) {
      if (globalPracticeIds.has(p.id)) fail(`duplicate practice id: ${p.id}`);
      globalPracticeIds.add(p.id);
    }

    const payload = safeJsonStringify(bundle);
    const js = `/* auto-generated by scripts/build-content.js — do not edit */\nwindow.CONTENT = window.CONTENT || {};\nwindow.CONTENT[${JSON.stringify(id)}] = ${payload};\n`;
    const outPath = path.join(DIST_DIR, `${id}.js`);
    fs.writeFileSync(outPath, js);
    const hash = sha256(js);

    const practiceByKind = bundle.practice.reduce((acc, p) => {
      acc[p.kind] = (acc[p.kind] || 0) + 1;
      return acc;
    }, {});

    manifest.courses.push({
      id,
      file: path.relative(ROOT, outPath),
      hash,
      cheatsheet_allowed: bundle.meta.cheatsheet_allowed,
      counts: {
        modules: bundle.modules.length,
        topics: bundle.modules.reduce((a, m) => a + m.topics.length, 0),
        cards: bundle.modules.reduce((a, m) => a + m.topics.reduce((b, t) => b + t.cards.length, 0), 0),
        lessons: bundle.lessons.length,
        practice: bundle.practice.length,
        practiceByKind,
        cheatBlocks: bundle.cheatSheet ? bundle.cheatSheet.blocks.length : null,
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
