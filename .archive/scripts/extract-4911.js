#!/usr/bin/env node
// Extract COMP 4911 study-guide JSON into the canonical content/ tree.
// Run from repo root: node scripts/extract-4911.js

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const H = require('./extract-helpers');

const ROOT = path.resolve(__dirname, '..');
const DATA = require('/tmp/sg-extract/4911.json');
const OUT = path.join(ROOT, 'content', '4911');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function writeFile(p, body) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, body, 'utf8');
}
function yamlDump(obj) {
  return yaml.dump(obj, { lineWidth: 120, noRefs: true, quotingType: '"', forceQuotes: false });
}
function fmFence(frontmatter, body) {
  return '---\n' + yamlDump(frontmatter).trim() + '\n---\n\n' + body.replace(/^\n+/, '');
}
function stripHtmlTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
function stripLeadingTitle(md, title) {
  const lines = md.split('\n');
  const firstIdx = lines.findIndex(l => l.trim() !== '');
  if (firstIdx === -1) return md;
  const first = lines[firstIdx].trim();
  const normTitle = title.trim().toLowerCase();
  const m = first.match(/^#{1,3}\s+(.*)$/);
  if (m && m[1].trim().toLowerCase().replace(/[*_`]/g, '') === normTitle) {
    lines.splice(firstIdx, 1);
    if (lines[firstIdx] && lines[firstIdx].trim() === '') lines.splice(firstIdx, 1);
    return lines.join('\n');
  }
  return md;
}
function proseFromHtml(html) {
  if (!html) return '';
  const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!pMatch) return stripHtmlTags(html).split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
  const text = stripHtmlTags(pMatch[1]);
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 2).join(' ').trim();
}

// ---- tagging ---------------------------------------------------------------

function tagsFromText(text, extras = []) {
  const base = String(text || '').toLowerCase();
  const picks = new Set();
  const map = [
    ['stateless', 'session-beans'],
    ['stateful', 'session-beans'],
    ['singleton', 'session-beans'],
    ['session bean', 'session-beans'],
    ['session', 'session-beans'],
    ['ejb', 'ejb'],
    ['entity', 'jpa'],
    ['entitymanager', 'jpa'],
    ['persistence', 'jpa'],
    ['jpa', 'jpa'],
    ['mapping', 'jpa'],
    ['@column', 'jpa'],
    ['@table', 'jpa'],
    ['@entity', 'jpa'],
    ['relationship', 'relationships'],
    ['onetoone', 'relationships'],
    ['onetomany', 'relationships'],
    ['manytomany', 'relationships'],
    ['inheritance', 'inheritance'],
    ['discriminator', 'inheritance'],
    ['jpql', 'jpql'],
    ['query', 'jpql'],
    ['transaction', 'transactions'],
    ['acid', 'transactions'],
    ['@transactionattribute', 'transactions'],
    ['callback', 'callbacks'],
    ['@prepersist', 'callbacks'],
    ['listener', 'callbacks'],
    ['security', 'security'],
    ['@rolesallowed', 'security'],
    ['jndi', 'jndi'],
    ['injection', 'jndi'],
    ['mdb', 'mdb'],
    ['message-driven', 'mdb'],
    ['rup', 'process'],
    ['use case', 'use-cases'],
    ['use-case', 'use-cases'],
    ['mbti', 'mbti'],
    ['earned value', 'evms'],
    ['evms', 'evms'],
    ['test', 'testing'],
    ['bce', 'analysis'],
    ['boundary', 'analysis'],
    ['best practice', 'process'],
    ['mistake', 'process'],
    ['architecture', 'architecture'],
    ['4+1', 'architecture']
  ];
  for (const [needle, tag] of map) {
    if (base.includes(needle)) picks.add(tag);
  }
  for (const e of extras) if (e) picks.add(String(e).toLowerCase().replace(/\s+/g, '-'));
  if (picks.size === 0) picks.add('ejb');
  return Array.from(picks).slice(0, 4);
}

// ---- module clustering -----------------------------------------------------

function moduleForFlashcardTopic(topicName) {
  const t = topicName.toLowerCase();
  if (t.includes('ejb intro') || t.includes('session bean')) return { id: 'ejb', name: 'EJB — session beans' };
  if (t.includes('mdb')) return { id: 'ejb', name: 'EJB — session beans' };
  if (t.includes('entitymanager') || t.includes('mapping') || t.includes('relationship') || t.includes('inheritance') || t.includes('callback')) {
    return { id: 'jpa', name: 'JPA — entities & persistence' };
  }
  if (t.includes('jpql') || t.includes('transaction')) return { id: 'jpql', name: 'JPQL / queries & transactions' };
  if (t.includes('security') || t.includes('jndi') || t.includes('injection')) return { id: 'jee-infra', name: 'Java EE infrastructure' };
  if (t.includes('rup') || t.includes('workflow') || t.includes('best practice') || t.includes('use case') || t.includes('architecture')) {
    return { id: 'process', name: 'Unified Process & architecture' };
  }
  if (t.includes('mbti') || t.includes('evms') || t.includes('testing')) return { id: 'soft-skills', name: 'Testing, EVMS & soft skills' };
  return { id: 'misc', name: 'Misc' };
}

function lessonModule(title) {
  const t = title.toLowerCase();
  if (t.includes('ejb') || t.includes('session') || t.includes('annotation') || t.includes('java ee')) return 'EJB — session beans';
  if (t.includes('jpa') || t.includes('entity') || t.includes('persist') || t.includes('mapping') || t.includes('relationship') || t.includes('inheritance')) return 'JPA — entities & persistence';
  if (t.includes('jpql') || t.includes('query') || t.includes('transaction')) return 'JPQL / queries & transactions';
  if (t.includes('rup') || t.includes('unified process') || t.includes('use case') || t.includes('architecture') || t.includes('best practice')) return 'Unified Process & architecture';
  if (t.includes('mbti') || t.includes('evms') || t.includes('testing') || t.includes('earned value')) return 'Testing, EVMS & soft skills';
  return 'EJB — session beans';
}

function pillarForTopic(t) {
  const p = String(t.pillar || '').toLowerCase();
  if (p === 'proc' || p === 'process') return 'process';
  return 'tech';
}

// ---- course.yaml -----------------------------------------------------------

function buildCourse() {
  return {
    id: '4911',
    code: 'COMP 4911',
    name: 'Developing Enterprise Service',
    exam: '2026-04-20T10:30:00-07:00',
    room: 'SW05 2875',
    format: 'Final Exam — MCQ + T/F + Short Answer + Essay + Code Annotation',
    instructor: 'Bruce Link',
    notes: 'Source: study guide cover "Mon Apr 20 · 10:30 · SW05 2875".\n'
  };
}

// ---- flashcards.yaml -------------------------------------------------------

function buildFlashcards() {
  const byTopic = new Map();
  for (const c of DATA.flashcards) {
    if (!byTopic.has(c.topic)) byTopic.set(c.topic, []);
    byTopic.get(c.topic).push(c);
  }

  const modules = new Map();
  for (const [topicName, cards] of byTopic.entries()) {
    const mod = moduleForFlashcardTopic(topicName);
    if (!modules.has(mod.id)) modules.set(mod.id, { id: mod.id, name: mod.name, topics: [] });

    // Try to match a DATA.topics entry for prose
    const lower = topicName.toLowerCase();
    let matchTopic = DATA.topics.find(t => {
      const tl = String(t.title).toLowerCase();
      return tl.includes(lower) || lower.split(/[\s\/]+/).some(w => w.length > 3 && tl.includes(w));
    });
    let prose = matchTopic ? proseFromHtml(matchTopic.html) : '';
    if (!prose) prose = `Cards covering ${topicName}.`;

    const pillarFromCard = cards[0] && cards[0].pillar;
    const topicObj = {
      id: '4911-' + H.slug(topicName),
      name: topicName,
      tags: tagsFromText(topicName, [pillarFromCard]),
      prose,
      cards: cards.map(c => ({
        type: 'name',
        prompt: H.inlineMd(c.q),
        answer: H.inlineMd(c.a)
      }))
    };
    modules.get(mod.id).topics.push(topicObj);
  }

  // Preferred module order
  const order = ['ejb', 'jpa', 'jpql', 'jee-infra', 'process', 'soft-skills', 'misc'];
  const modArr = order.filter(k => modules.has(k)).map(k => modules.get(k));
  for (const [k, v] of modules.entries()) if (!order.includes(k)) modArr.push(v);

  return { modules: modArr };
}

// ---- mock-exam.yaml --------------------------------------------------------

function buildMockExam() {
  const duration_seconds = 7200; // no DATA.meta; default 2 hr
  const questions = DATA.mockExam.map((raw, idx) => H.normalizeMockQuestion(raw, idx));
  return { duration_seconds, questions };
}

// ---- lessons ---------------------------------------------------------------

function buildLessons() {
  const out = [];
  DATA.lessons.forEach((lesson, i) => {
    const n = lesson.n || (i + 1);
    const s = H.slug(lesson.title);
    const filename = `${String(n).padStart(2, '0')}-${s}.md`;
    let body = H.htmlToMarkdown(lesson.html);
    body = stripLeadingTitle(body, lesson.title);
    const fm = {
      n,
      id: `4911-lesson-${s}`,
      title: lesson.title,
      hook: lesson.hook || '',
      tags: tagsFromText(lesson.title),
      module: lessonModule(lesson.title)
    };
    out.push({ filename, content: fmFence(fm, body) });
  });
  return out;
}

// ---- code-practice (ANNOTATION variant) ------------------------------------

// Try to split an explanation paragraph into sentence-sized notes.
// Returns an array of note text strings (without line numbers) — we then
// map sentences to code lines heuristically by searching for tokens each
// sentence mentions inside the solution's code.
function splitExplanationSentences(expl) {
  const text = stripHtmlTags(expl).trim();
  if (!text) return [];
  // Sentence split on ". " keeping abbreviations like "e.g." intact-ish.
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z@`(])/);
  return parts.map(s => s.trim()).filter(Boolean);
}

// Token candidates we hunt for in the code to pick a line number.
function extractTokens(sentence) {
  const tokens = [];
  // Code-ish tokens: @Annotation, camelCase idents, dot-path, quoted strings
  const reCode = /`([^`]+)`|@[A-Za-z]\w*(?:\.[A-Za-z]\w*)*|\b[A-Za-z_][A-Za-z0-9_]{2,}\b/g;
  let m;
  while ((m = reCode.exec(sentence)) !== null) {
    const tok = m[1] || m[0];
    tokens.push(tok);
  }
  return tokens;
}

function findLineForToken(codeLines, token) {
  const needle = token.replace(/^`|`$/g, '');
  for (let i = 0; i < codeLines.length; i++) {
    if (codeLines[i].includes(needle)) return i + 1;
  }
  return null;
}

function shortTag(sentence) {
  // First salient code-token or first few words
  const codeTok = sentence.match(/`([^`]+)`|@[A-Za-z]\w*/);
  if (codeTok) return '`' + (codeTok[1] || codeTok[0]) + '`';
  const words = sentence.split(/\s+/).slice(0, 3).join(' ');
  return words.replace(/[.!?,:;]$/, '');
}

function buildNotesFromExplanation(solutionCode, explanationRaw) {
  const codeLines = solutionCode.split('\n');
  const sentences = splitExplanationSentences(explanationRaw);
  if (sentences.length === 0) return { notes: [], degraded: true };

  const notes = [];
  const used = new Set();
  let anyDegraded = false;

  for (const sentence of sentences) {
    const tokens = extractTokens(sentence);
    let line = null;
    for (const tok of tokens) {
      const ln = findLineForToken(codeLines, tok);
      if (ln !== null && !used.has(ln)) { line = ln; break; }
      if (line === null && ln !== null) line = ln;
    }
    if (line === null) {
      anyDegraded = true;
      notes.push({ line: null, tag: shortTag(sentence), text: sentence });
    } else {
      used.add(line);
      notes.push({ line, tag: shortTag(sentence), text: sentence });
    }
  }
  return { notes, degraded: anyDegraded };
}

function buildCodePractice() {
  const out = [];
  const degradedList = [];
  DATA.codePractice.forEach((cp, i) => {
    const n = i + 1;
    const s = H.slug(cp.title);
    const filename = `${String(n).padStart(2, '0')}-${s}.md`;
    const lang = 'java';
    const solution = String(cp.solution || '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
      .replace(/[ \t]+$/gm, '').replace(/\s+$/, '');

    const { notes, degraded } = buildNotesFromExplanation(solution, cp.explanation || '');
    if (degraded) degradedList.push(cp.title);

    const fm = {
      n,
      id: `4911-cp-${s}`,
      title: cp.title,
      lang,
      variant: 'annotation',
      tags: tagsFromText(cp.title)
    };

    // Optional prompt blockquote
    const promptText = H.inlineMd(cp.prompt || '').trim();
    const promptBlock = promptText ? `> ${promptText}\n\n` : '';

    const noteLines = notes.map(nt => {
      if (nt.line === null) {
        return `- **lines 1–${solution.split('\n').length}** · ${nt.tag} — ${nt.text}`;
      }
      return `- **line ${nt.line}** · ${nt.tag} — ${nt.text}`;
    });

    const degradeNote = degraded ? `<!-- note parsing degraded: some notes lack exact line references; summary-scope lines used instead -->\n` : '';

    const body =
      promptBlock +
      `## Code\n\n\`\`\`${lang}\n${solution}\n\`\`\`\n\n` +
      `## Notes\n\n` + degradeNote +
      noteLines.join('\n') + '\n';

    out.push({ filename, content: fmFence(fm, body) });
  });
  return { out, degradedList };
}

// ---- topic-dives -----------------------------------------------------------

function buildTopicDives() {
  const out = [];
  DATA.topics.forEach(t => {
    const s = H.slug(t.title);
    const filename = `${s}.md`;
    let body = H.htmlToMarkdown(t.html);
    body = stripLeadingTitle(body, t.title);
    const priority = String(t.priority || 'mid').toLowerCase();
    const fm = {
      id: `4911-topic-${s}`,
      title: t.title,
      pillar: pillarForTopic(t),
      priority,
      chapter: t.chapter || '',
      tags: tagsFromText(t.title, [pillarForTopic(t)])
    };
    out.push({ filename, content: fmFence(fm, body) });
  });
  return out;
}

// ---- cheat-sheet.md --------------------------------------------------------

function buildCheatSheet() {
  const title = 'COMP 4911 — exam-eve cheat sheet';
  let body = `---\ntitle: "${title}"\n---\n\n`;
  DATA.cheatSheet.forEach(block => {
    body += `## ${block.title}\n\n`;
    body += H.htmlToMarkdown(block.body).trim() + '\n\n';
  });
  return body.trimEnd() + '\n';
}

// ---- main ------------------------------------------------------------------

function main() {
  ensureDir(OUT);

  writeFile(path.join(OUT, 'course.yaml'), yamlDump(buildCourse()));
  writeFile(path.join(OUT, 'flashcards.yaml'), yamlDump(buildFlashcards()));
  writeFile(path.join(OUT, 'mock-exam.yaml'), yamlDump(buildMockExam()));

  const lessonsDir = path.join(OUT, 'lessons');
  ensureDir(lessonsDir);
  buildLessons().forEach(f => writeFile(path.join(lessonsDir, f.filename), f.content));

  const codeDir = path.join(OUT, 'code-practice');
  ensureDir(codeDir);
  const cp = buildCodePractice();
  cp.out.forEach(f => writeFile(path.join(codeDir, f.filename), f.content));

  const divesDir = path.join(OUT, 'topic-dives');
  ensureDir(divesDir);
  buildTopicDives().forEach(f => writeFile(path.join(divesDir, f.filename), f.content));

  writeFile(path.join(OUT, 'cheat-sheet.md'), buildCheatSheet());

  console.log('COMP 4911 extraction complete ->', OUT);
  if (cp.degradedList.length) {
    console.log('Degraded annotation parsing in:', cp.degradedList.join('; '));
  } else {
    console.log('All code-practice notes parsed with line references.');
  }
}

if (require.main === module) main();
