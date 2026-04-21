#!/usr/bin/env node
// Extract COMP 4736 study-guide JSON into the canonical content/ tree.
// Run: node scripts/extract-4736.js

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const H = require('./extract-helpers');

const ROOT = path.resolve(__dirname, '..');
const DATA = require('/tmp/sg-extract/4736.json');
const OUT = path.join(ROOT, 'content', '4736');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function writeFile(p, body) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, body, 'utf8');
}

// ---- helpers ----------------------------------------------------------------

function stripHtmlTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function tagsFromText(text, extras = []) {
  const base = String(text || '').toLowerCase();
  const picks = new Set();
  const map = [
    ['deadlock', 'deadlock'],
    ['coffman', 'deadlock'],
    ['semaphore', 'semaphores'],
    ['monitor', 'monitors'],
    ['producer', 'ipc'],
    ['ipc', 'ipc'],
    ['critical', 'sync'],
    ['race', 'sync'],
    ['mutex', 'sync'],
    ['mutual', 'sync'],
    ['paging', 'paging'],
    ['page', 'paging'],
    ['memory', 'memory'],
    ['address', 'memory'],
    ['translation', 'paging'],
    ['fit', 'allocation'],
    ['buddy', 'allocation'],
    ['tlb', 'paging'],
    ['scheduling', 'scheduling'],
    ['thread', 'threads'],
    ['process', 'processes'],
    ['banker', 'deadlock'],
    ['readers', 'ipc'],
    ['writers', 'ipc'],
    ['dining', 'ipc'],
    ['philosophers', 'ipc'],
    ['peterson', 'sync'],
    ['tsl', 'sync'],
    ['spinlock', 'sync'],
    ['pipe', 'ipc'],
    ['fifo', 'paging'],
    ['lru', 'paging'],
    ['optimal', 'paging'],
    ['virtual', 'memory'],
    ['physical', 'memory'],
    ['frame', 'paging'],
    ['replacement', 'paging']
  ];
  for (const [needle, tag] of map) {
    if (base.includes(needle)) picks.add(tag);
  }
  for (const e of extras) if (e) picks.add(String(e).toLowerCase().replace(/\s+/g, '-'));
  if (picks.size === 0) picks.add('os');
  return Array.from(picks).slice(0, 4);
}

function pillarToTag(p) {
  if (!p) return null;
  const map = { sync: 'sync', deadlock: 'deadlock', memory: 'memory' };
  return map[p] || String(p).toLowerCase().replace(/\s+/g, '-');
}

// Module clustering for flashcards
function moduleForTopic(topicName) {
  const t = topicName.toLowerCase();
  if (t.includes('deadlock')) return { id: 'deadlock', name: 'Deadlock' };
  if (t.includes('memory') || t.includes('paging') || t.includes('alloc')) return { id: 'memory', name: 'Memory & Paging' };
  if (t.includes('ipc') || t.includes('sem')) return { id: 'ipc-sync', name: 'IPC & Synchronization' };
  return { id: 'scheduling-misc', name: 'Scheduling & misc' };
}

// Module for lessons/topics (used in frontmatter `module`)
function lessonModule(title) {
  const t = title.toLowerCase();
  if (t.includes('deadlock')) return 'Deadlock';
  if (t.includes('memory') || t.includes('paging') || t.includes('page') || t.includes('alloc') || t.includes('address')) return 'Memory & Paging';
  if (t.includes('semaphore') || t.includes('monitor') || t.includes('mutex') || t.includes('ipc') || t.includes('race') || t.includes('critical') || t.includes('producer') || t.includes('sync')) return 'IPC & Synchronization';
  return 'IPC & Synchronization';
}

function yamlDump(obj) {
  return yaml.dump(obj, {
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false
  });
}

function fmFence(frontmatter, body) {
  return '---\n' + yamlDump(frontmatter).trim() + '\n---\n\n' + body.replace(/^\n+/, '');
}

// Strip a leading top-level H1/H2/H3 that duplicates the title
function stripLeadingTitle(md, title) {
  const lines = md.split('\n');
  const firstIdx = lines.findIndex(l => l.trim() !== '');
  if (firstIdx === -1) return md;
  const first = lines[firstIdx].trim();
  const normTitle = title.trim().toLowerCase();
  const m = first.match(/^#{1,3}\s+(.*)$/);
  if (m && m[1].trim().toLowerCase().replace(/[*_`]/g, '') === normTitle) {
    lines.splice(firstIdx, 1);
    // drop blank line that follows
    if (lines[firstIdx] && lines[firstIdx].trim() === '') lines.splice(firstIdx, 1);
    return lines.join('\n');
  }
  return md;
}

// Take the first 1–2 sentences from an HTML blob, stripping headings.
function proseFromHtml(html) {
  if (!html) return '';
  // Grab first <p>…</p>
  const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!pMatch) return stripHtmlTags(html).split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
  const text = stripHtmlTags(pMatch[1]);
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 2).join(' ').trim();
}

function clozeFromCard(q, a) {
  // Turn "____" blanks into {{answer-fragment}}; answer-fragments are split from `a` by `;`
  const fragments = String(a).split(/[;]/).map(s => s.trim().replace(/\.$/, '')).filter(Boolean);
  let idx = 0;
  const prompt = String(q).replace(/_{3,}/g, () => {
    const f = fragments[idx] || '___';
    idx += 1;
    return `{{${f}}}`;
  });
  // Also handle <ins>X</ins>
  const prompt2 = prompt.replace(/<ins>([\s\S]*?)<\/ins>/gi, (_m, inner) => `{{${stripHtmlTags(inner)}}}`);
  return {
    prompt: H.inlineMd(prompt2),
    answer: fragments.join(', ')
  };
}

function looksLikeBlankCard(q) {
  return /_{3,}/.test(q) || /<ins>/i.test(q);
}

// ---- course.yaml ------------------------------------------------------------

function buildCourse() {
  const meta = DATA.meta;
  // Parse room from examDateHuman: "Tue Apr 21 · BCIT"
  const parts = String(meta.examDateHuman || '').split('·').map(s => s.trim());
  const room = parts[parts.length - 1] || 'BCIT';
  const durationMin = meta.mockDurationMinutes || 120;

  // Derive format: total marks from formatTable row totals? "Online Part 1 ~30" + "Written Part 2 ~70" = ~100
  // Use "~90 marks · 2 hr · closed book" per spec
  const format = `~90 marks · ${Math.round(durationMin / 60)} hr · closed book`;

  // Assemble notes from instructor intel
  const intel = (meta.instructorIntel || []).map(s => stripHtmlTags(s));
  const notesLines = [
    'Closed book. Bring laptop (charged), calculator, blank paper, pencil.',
    ...intel
  ];
  const notes = notesLines.join('\n');

  const course = {
    id: '4736',
    code: 'COMP 4736',
    name: 'Operating Systems',
    exam: meta.examDateISO,
    room,
    format,
    instructor: meta.instructor || 'Rahim',
    notes
  };
  return course;
}

// ---- flashcards.yaml --------------------------------------------------------

function buildFlashcards() {
  // Group cards by topic string
  const byTopic = new Map();
  for (const c of DATA.flashcards) {
    if (!byTopic.has(c.topic)) byTopic.set(c.topic, []);
    byTopic.get(c.topic).push(c);
  }

  // Module buckets
  const modules = new Map(); // moduleId -> { id, name, topics: [] }

  for (const [topicName, cards] of byTopic.entries()) {
    const mod = moduleForTopic(topicName);
    if (!modules.has(mod.id)) modules.set(mod.id, { id: mod.id, name: mod.name, topics: [] });

    // Find matching topics[] entry by a fuzzy match on pillar/theme for prose
    // Try topic title match substring
    const pillarFromCard = cards[0] && cards[0].pillar;
    const matchTopic = DATA.topics.find(t => String(t.title).toLowerCase().includes(topicName.toLowerCase().split('/')[0].toLowerCase()));
    let prose = '';
    if (matchTopic) prose = proseFromHtml(matchTopic.html);
    if (!prose) {
      // Synthesize one sentence
      if (topicName === 'IPC1/Sem') prose = 'Race conditions, mutual exclusion, and semaphores for coordinating concurrent processes.';
      else if (topicName === 'IPC2') prose = 'Classic IPC problems (producer-consumer, readers-writers, dining philosophers) and monitors.';
      else if (topicName === 'Deadlock') prose = 'Coffman conditions, resource graphs, detection matrices, and recovery strategies.';
      else if (topicName === 'Memory/Paging') prose = 'Virtual-to-physical translation, page tables, and page-replacement algorithms.';
      else if (topicName === 'Memory/Alloc') prose = 'Fit algorithms, buddy system, fragmentation, and allocation trade-offs.';
      else prose = `Cards covering ${topicName}.`;
    }

    const topicObj = {
      id: '4736-' + H.slug(topicName),
      name: topicName,
      tags: tagsFromText(topicName, [pillarToTag(pillarFromCard)]),
      prose,
      cards: []
    };

    for (const c of cards) {
      if (looksLikeBlankCard(c.q)) {
        const { prompt, answer } = clozeFromCard(c.q, c.a);
        if (/\{\{/.test(prompt)) {
          topicObj.cards.push({ type: 'cloze', prompt, answer });
          continue;
        }
      }
      topicObj.cards.push({
        type: 'name',
        prompt: H.inlineMd(c.q),
        answer: H.inlineMd(c.a)
      });
    }

    modules.get(mod.id).topics.push(topicObj);
  }

  // Fixed module ordering
  const order = ['ipc-sync', 'deadlock', 'memory', 'scheduling-misc'];
  const modArr = order.filter(k => modules.has(k)).map(k => modules.get(k));
  // add any stragglers
  for (const [k, v] of modules.entries()) if (!order.includes(k)) modArr.push(v);

  return { modules: modArr };
}

// ---- mock-exam.yaml ---------------------------------------------------------

function buildMockExam() {
  const duration_seconds = (DATA.meta.mockDurationMinutes || 120) * 60;
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
      id: `4736-lesson-${s}`,
      title: lesson.title,
      hook: lesson.hook || '',
      tags: tagsFromText(lesson.title),
      module: lessonModule(lesson.title)
    };
    out.push({ filename, content: fmFence(fm, body) });
  });
  return out;
}

// ---- code-practice ---------------------------------------------------------

function detectLang(starter) {
  const s = String(starter || '');
  if (/#include\b/.test(s)) return 'c';
  if (/\bpublic\s+class\b/.test(s)) return 'java';
  if (/^\s*def\s+\w+\s*\(/m.test(s) || /\bprint\s*\(/.test(s)) return 'python';
  return 'c';
}

function buildCodePractice() {
  const out = [];
  DATA.codePractice.forEach((cp, i) => {
    const n = i + 1;
    const s = H.slug(cp.title);
    const filename = `${String(n).padStart(2, '0')}-${s}.md`;
    const lang = detectLang(cp.starter);
    const promptMd = /<[a-z][\s\S]*>/i.test(cp.prompt) ? H.htmlToMarkdown(cp.prompt) : (cp.prompt || '').trim();
    const starter = String(cp.starter || '').replace(/[ \t]+$/gm, '').replace(/\s+$/, '');
    const solution = String(cp.solution || '').replace(/[ \t]+$/gm, '').replace(/\s+$/, '');
    const whyMd = H.htmlToMarkdown(cp.explanation || '');

    const fm = {
      n,
      id: `4736-code-${s}`,
      title: cp.title,
      lang,
      tags: tagsFromText(cp.title)
    };

    const body =
      `## Prompt\n\n${promptMd.trim()}\n\n` +
      `## Starter\n\n\`\`\`${lang}\n${starter}\n\`\`\`\n\n` +
      `## Solution\n\n\`\`\`${lang}\n${solution}\n\`\`\`\n\n` +
      `## Why\n\n${whyMd.trim()}\n`;

    out.push({ filename, content: fmFence(fm, body) });
  });
  return out;
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
      id: `4736-topic-${s}`,
      title: t.title,
      pillar: 'tech',
      priority,
      chapter: t.chapter,
      tags: tagsFromText(t.title, [pillarToTag(t.pillar)])
    };
    out.push({ filename, content: fmFence(fm, body) });
  });
  return out;
}

// ---- cheat-sheet.md --------------------------------------------------------

function buildCheatSheet() {
  const title = 'COMP 4736 — exam-eve cheat sheet';
  let body = `---\ntitle: "${title}"\n---\n\n`;
  DATA.cheatSheet.forEach(block => {
    body += `## ${block.title}\n\n`;
    body += H.htmlToMarkdown(block.body).trim() + '\n\n';
  });
  return body.trimEnd() + '\n';
}

// ---- write ------------------------------------------------------------------

function main() {
  ensureDir(OUT);

  // course.yaml
  writeFile(path.join(OUT, 'course.yaml'), yamlDump(buildCourse()));

  // flashcards.yaml
  writeFile(path.join(OUT, 'flashcards.yaml'), yamlDump(buildFlashcards()));

  // mock-exam.yaml
  writeFile(path.join(OUT, 'mock-exam.yaml'), yamlDump(buildMockExam()));

  // lessons/
  const lessonsDir = path.join(OUT, 'lessons');
  ensureDir(lessonsDir);
  buildLessons().forEach(f => writeFile(path.join(lessonsDir, f.filename), f.content));

  // code-practice/
  const codeDir = path.join(OUT, 'code-practice');
  ensureDir(codeDir);
  buildCodePractice().forEach(f => writeFile(path.join(codeDir, f.filename), f.content));

  // topic-dives/
  const divesDir = path.join(OUT, 'topic-dives');
  ensureDir(divesDir);
  buildTopicDives().forEach(f => writeFile(path.join(divesDir, f.filename), f.content));

  // cheat-sheet.md
  writeFile(path.join(OUT, 'cheat-sheet.md'), buildCheatSheet());

  console.log('COMP 4736 extraction complete →', OUT);
}

if (require.main === module) main();
