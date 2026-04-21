#!/usr/bin/env node
// Extract COMP 4915 study-guide JSON into the canonical content/ tree.
// Run: node scripts/extract-4915.js

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const H = require('./extract-helpers');

const ROOT = path.resolve(__dirname, '..');
const DATA = require('/tmp/sg-extract/4915.json');
const OUT = path.join(ROOT, 'content', '4915');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function writeFile(p, body) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, body, 'utf8');
}

function stripHtmlTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
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
  const normTitle = String(title).trim().toLowerCase();
  const m = first.match(/^#{1,3}\s+(.*)$/);
  if (m && m[1].trim().toLowerCase().replace(/[*_`]/g, '') === normTitle) {
    lines.splice(firstIdx, 1);
    if (lines[firstIdx] && lines[firstIdx].trim() === '') lines.splice(firstIdx, 1);
    return lines.join('\n');
  }
  return md;
}

// Take the first 1–2 sentences from an HTML blob.
function proseFromHtml(html) {
  if (!html) return '';
  const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!pMatch) return stripHtmlTags(html).split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
  const text = stripHtmlTags(pMatch[1]);
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 2).join(' ').trim();
}

// ---------------------------------------------------------------------------
// Module clustering for flashcards (cluster by topic name string).
// ---------------------------------------------------------------------------

const MODULES = [
  { id: 'fs-perms',              name: 'Filesystem & permissions' },
  { id: 'shell-text',            name: 'Shell, redirection & text processing' },
  { id: 'processes-scheduling',  name: 'Processes & scheduling' },
  { id: 'networking',            name: 'Networking' },
  { id: 'package-mgmt',          name: 'Package management & boot' },
  { id: 'kubernetes',            name: 'Kubernetes & containers' },
  { id: 'scripting',             name: 'Bash scripting & regex' },
  { id: 'misc',                  name: 'Misc / editors / misc topics' }
];

function moduleForTopic(topicName) {
  const t = String(topicName).toLowerCase();

  // Kubernetes / containers
  if (/k8s|kubernetes|namespac|cgroup|qos|cni|container|pod/.test(t)) return 'kubernetes';

  // Scripting — bash, perl, flow-control, etc.
  if (/script|bash (scripting|vs c|recognize)|\$\* vs \$@|flow control|perl|shell startup|startup files|function precedence|expansions|shell params|export/.test(t)) return 'scripting';

  // Networking
  if (/network|nfs|samba|nis|ldap|sendmail|dns|iptables|apache|ssh|ftp|dhcp|hostname/.test(t)) return 'networking';

  // Package mgmt & boot
  if (/runlevel|boot|pam/.test(t)) return 'package-mgmt';

  // Processes & scheduling
  if (/process|job|cron|systemd|background|pipe(s)?/.test(t)) return 'processes-scheduling';

  // Shell, redirection & text processing
  if (/shell|redirect|quoting|globbing|grep|filter|text util|find|history|editor|stderr|bit bucket|\/dev\/null|\/dev\/zero/.test(t)) return 'shell-text';

  // Filesystem & permissions
  if (/filesystem|permission|inode|link|storage|fstab|acl|umask|setgid|setuid|flags|chroot/.test(t)) return 'fs-perms';

  // Everything else
  return 'misc';
}

// Module label for lesson/topic frontmatter (display)
function moduleLabelForLesson(title) {
  const t = String(title).toLowerCase();
  if (/filesystem|inode/.test(t)) return 'Filesystem & permissions';
  if (/kubernet|container|pod/.test(t)) return 'Kubernetes & containers';
  if (/networ|ssh|ftp|dns|nfs|samba|nis|ldap|sendmail|iptables|apache/.test(t)) return 'Networking';
  if (/\bboot\b|runlevel|\buser\b|\badmin\b|sysadmin/.test(t)) return 'Package management & boot';
  if (/script/.test(t)) return 'Bash scripting & regex';
  if (/quot|redirect|shell/.test(t)) return 'Shell, redirection & text processing';
  if (/exam|craft/.test(t)) return 'Misc / editors / misc topics';
  return 'Misc / editors / misc topics';
}

// Module label for topic-dives based on source pillar value
function moduleLabelForPillar(pillar) {
  const p = String(pillar || '').toLowerCase();
  const map = {
    fundamentals: 'Filesystem & permissions',
    shell: 'Shell, redirection & text processing',
    sysadmin: 'Package management & boot',
    network: 'Networking',
    kubernetes: 'Kubernetes & containers'
  };
  return map[p] || 'Misc / editors / misc topics';
}

// ---------------------------------------------------------------------------
// Tagging heuristic
// ---------------------------------------------------------------------------

function tagsFromText(text, extras = []) {
  const base = String(text || '').toLowerCase();
  const picks = new Set();
  const map = [
    ['inode', 'filesystem'],
    ['link', 'filesystem'],
    ['filesystem', 'filesystem'],
    ['fstab', 'filesystem'],
    ['permission', 'permissions'],
    ['chmod', 'permissions'],
    ['umask', 'permissions'],
    ['setuid', 'permissions'],
    ['setgid', 'permissions'],
    ['acl', 'permissions'],
    ['grep', 'text-processing'],
    ['awk', 'text-processing'],
    ['sed', 'text-processing'],
    ['find', 'text-processing'],
    ['tr ', 'text-processing'],
    ['filter', 'text-processing'],
    ['redirect', 'redirection'],
    ['pipe', 'redirection'],
    ['stderr', 'redirection'],
    ['/dev/null', 'redirection'],
    ['quot', 'shell'],
    ['glob', 'shell'],
    ['expansion', 'shell'],
    ['shell', 'shell'],
    ['param', 'shell'],
    ['script', 'scripting'],
    ['bash', 'scripting'],
    ['function', 'scripting'],
    ['flow control', 'scripting'],
    ['perl', 'scripting'],
    ['process', 'processes'],
    ['job', 'processes'],
    ['background', 'processes'],
    ['boot', 'boot'],
    ['runlevel', 'boot'],
    ['pam', 'auth'],
    ['ssh', 'networking'],
    ['ftp', 'networking'],
    ['dns', 'networking'],
    ['dhcp', 'networking'],
    ['nfs', 'networking'],
    ['samba', 'networking'],
    ['nis', 'networking'],
    ['ldap', 'networking'],
    ['sendmail', 'networking'],
    ['iptables', 'networking'],
    ['apache', 'networking'],
    ['network', 'networking'],
    ['hostname', 'networking'],
    ['kubernet', 'kubernetes'],
    ['k8s', 'kubernetes'],
    ['pod', 'kubernetes'],
    ['namespace', 'kubernetes'],
    ['cgroup', 'kubernetes'],
    ['qos', 'kubernetes'],
    ['cni', 'kubernetes'],
    ['container', 'kubernetes'],
    ['control plane', 'kubernetes'],
    ['chroot', 'containers'],
    ['vi', 'editor'],
    ['history', 'shell'],
    ['editor', 'editor'],
    ['tar', 'archives'],
    ['archive', 'archives'],
    ['compression', 'archives']
  ];
  for (const [needle, tag] of map) {
    if (base.includes(needle)) picks.add(tag);
  }
  for (const e of extras) if (e) picks.add(String(e).toLowerCase().replace(/\s+/g, '-'));
  if (picks.size === 0) picks.add('linux');
  return Array.from(picks).slice(0, 4);
}

// ---------------------------------------------------------------------------
// course.yaml
// ---------------------------------------------------------------------------

function buildCourse() {
  return {
    id: '4915',
    code: 'COMP 4915',
    name: 'Special Topics in MIS (UNIX / Linux / Kubernetes)',
    exam: '2026-04-23T13:30:00-07:00',
    room: 'SW01 3190',
    format: 'Final Exam — MCQ + TF + SHORT + ESSAY',
    instructor: 'Bruce Link',
    notes: 'Source: study guide cover "Thu Apr 23 · 13:30 · SW01 3190".\n'
  };
}

// ---------------------------------------------------------------------------
// flashcards.yaml
// ---------------------------------------------------------------------------

function buildFlashcards() {
  const byTopic = new Map();
  for (const c of DATA.flashcards) {
    if (!byTopic.has(c.topic)) byTopic.set(c.topic, []);
    byTopic.get(c.topic).push(c);
  }

  const modMap = new Map();
  for (const m of MODULES) modMap.set(m.id, { id: m.id, name: m.name, topics: [] });

  for (const [topicName, cards] of byTopic.entries()) {
    const modId = moduleForTopic(topicName);

    // Look for a matching topic-dive by rough name substring for prose
    const needle = topicName.toLowerCase().split(/[\/\s]+/)[0];
    const match = DATA.topics.find(t => String(t.title).toLowerCase().includes(needle));
    let prose = match ? proseFromHtml(match.html) : '';
    if (!prose) {
      prose = `Flashcards covering ${topicName}.`;
    }

    const pillarFromCard = cards[0] && cards[0].pillar;
    const topicObj = {
      id: '4915-' + H.slug(topicName),
      name: topicName,
      tags: tagsFromText(topicName, [pillarFromCard]),
      prose,
      cards: cards.map(c => ({
        type: 'name',
        prompt: H.inlineMd(c.q),
        answer: H.inlineMd(c.a)
      }))
    };

    modMap.get(modId).topics.push(topicObj);
  }

  // Keep only modules that have topics, preserving declared order
  const modules = MODULES
    .map(m => modMap.get(m.id))
    .filter(m => m.topics.length > 0);

  return { modules };
}

// ---------------------------------------------------------------------------
// mock-exam.yaml
// ---------------------------------------------------------------------------

function buildMockExam() {
  const duration_seconds = 7200;
  const questions = DATA.mockExam.map((raw, idx) => H.normalizeMockQuestion(raw, idx));
  return { duration_seconds, questions };
}

// ---------------------------------------------------------------------------
// lessons/
// ---------------------------------------------------------------------------

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
      id: `4915-lesson-${s}`,
      title: lesson.title,
      hook: lesson.hook || '',
      tags: tagsFromText(lesson.title),
      module: moduleLabelForLesson(lesson.title)
    };
    out.push({ filename, content: fmFence(fm, body) });
  });
  return out;
}

// ---------------------------------------------------------------------------
// code-practice/
// ---------------------------------------------------------------------------

function detectLang(starter) {
  const s = String(starter || '');
  if (/#!\/usr\/bin\/env\s+python|#!\/usr\/bin\/python|^\s*def\s+\w+\s*\(/m.test(s)) return 'python';
  if (/^\s*apiVersion\s*:/m.test(s)) return 'yaml';
  if (/#include\b/.test(s)) return 'c';
  if (/^\s*FROM\s+\w/m.test(s)) return 'dockerfile';
  if (/^\s*SELECT\s|^\s*CREATE\s+TABLE\s/im.test(s)) return 'sql';
  return 'bash';
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
      id: `4915-code-${s}`,
      title: cp.title,
      lang,
      variant: 'starter-solution',
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

// ---------------------------------------------------------------------------
// topic-dives/
// ---------------------------------------------------------------------------

function buildTopicDives() {
  const out = [];
  DATA.topics.forEach(t => {
    const s = H.slug(t.title);
    const filename = `${s}.md`;
    let body = H.htmlToMarkdown(t.html);
    body = stripLeadingTitle(body, t.title);
    const priority = String(t.priority || 'mid').toLowerCase();
    const fm = {
      id: `4915-topic-${s}`,
      title: t.title,
      pillar: t.pillar || 'tech',
      priority,
      chapter: t.chapter || '',
      tags: tagsFromText(t.title, [t.pillar])
    };
    out.push({ filename, content: fmFence(fm, body) });
  });
  return out;
}

// ---------------------------------------------------------------------------
// cheat-sheet.md
// ---------------------------------------------------------------------------

function buildCheatSheet() {
  const title = 'COMP 4915 — exam-eve cheat sheet';
  let body = `---\ntitle: "${title}"\n---\n\n`;
  DATA.cheatSheet.forEach(block => {
    body += `## ${block.title}\n\n`;
    body += H.htmlToMarkdown(block.body).trim() + '\n\n';
  });
  return body.trimEnd() + '\n';
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

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
  buildCodePractice().forEach(f => writeFile(path.join(codeDir, f.filename), f.content));

  const divesDir = path.join(OUT, 'topic-dives');
  ensureDir(divesDir);
  buildTopicDives().forEach(f => writeFile(path.join(divesDir, f.filename), f.content));

  writeFile(path.join(OUT, 'cheat-sheet.md'), buildCheatSheet());

  console.log('COMP 4915 extraction complete →', OUT);
}

if (require.main === module) main();
