#!/usr/bin/env node
// Extract COMP 4870 study-guide JSON into the canonical content tree.
// Run from /Users/kevinliang/BCIT/CST/TERM4:
//   node scripts/extract-4870.js
//
// Reads /tmp/sg-extract/4870.json, writes content/4870/*.

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const H = require('./extract-helpers');

const ROOT = '/Users/kevinliang/BCIT/CST/TERM4';
const SRC = '/tmp/sg-extract/4870.json';
const OUT = path.join(ROOT, 'content', '4870');

const DATA = JSON.parse(fs.readFileSync(SRC, 'utf8'));

// ---------------- helpers ----------------

function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }

function writeFile(p, body) {
  mkdirp(path.dirname(p));
  fs.writeFileSync(p, body.endsWith('\n') ? body : body + '\n');
}

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function yamlDump(obj) {
  return yaml.dump(obj, { lineWidth: 120, noRefs: true, quotingType: '"' });
}

// ---------------- course.yaml ----------------

function buildCourse() {
  const meta = DATA.meta;
  // room = last segment after "·" in examDateHuman
  let room = 'BCIT';
  if (meta.examDateHuman) {
    const parts = meta.examDateHuman.split('·').map(s => s.trim()).filter(Boolean);
    if (parts.length) room = parts[parts.length - 1];
  }
  // format: construct from formatTable rows (excluding TOTAL)
  const ft = meta.formatTable || { rows: [] };
  const pieces = (ft.rows || [])
    .filter(r => r.type && r.type.toUpperCase() !== 'TOTAL')
    .map(r => `${r.count} ${r.type}`);
  const totalRow = (ft.rows || []).find(r => r.type && r.type.toUpperCase() === 'TOTAL');
  let formatStr = pieces.join(' + ');
  if (totalRow) formatStr += ` · ${totalRow.total} marks · ${totalRow.notes.replace(/·/g, '·')}`;

  const notes = (meta.instructorIntel || [])
    .map(h => '- ' + stripTags(h))
    .join('\n');

  const obj = {
    id: '4870',
    code: 'COMP 4870',
    name: 'Enterprise .NET',
    exam: meta.examDateISO,
    room,
    format: formatStr,
    instructor: 'Medhat Elmasry',
  };
  // Preserve multi-line notes with yaml '|' block style by converting manually:
  let y = yamlDump(obj);
  if (notes) y += 'notes: |\n' + notes.split('\n').map(l => '  ' + l).join('\n') + '\n';
  writeFile(path.join(OUT, 'course.yaml'), y);
}

// ---------------- flashcards.yaml ----------------

// Cluster flashcard topics into modules.
// Topics observed: AI, ML.NET, Cache, gRPC, TDD, FileBased, Aspire,
// Localization, TagHelpers, Blazor, ExcelPDF.
const MODULE_MAP = {
  'ai-ml': {
    name: 'AI & ML.NET',
    topics: ['AI', 'ML.NET'],
  },
  'caching-grpc': {
    name: 'Caching & gRPC',
    topics: ['Cache', 'gRPC'],
  },
  'testing-hosting': {
    name: 'Testing, file-based apps & Aspire',
    topics: ['TDD', 'FileBased', 'Aspire'],
  },
  'web-ui': {
    name: 'Localization, Tag Helpers & Blazor',
    topics: ['Localization', 'TagHelpers', 'Blazor'],
  },
  'export': {
    name: 'Excel / PDF / Chart export',
    topics: ['ExcelPDF'],
  },
};

// Derive human-readable topic group label (card.topic -> display name)
const TOPIC_DISPLAY = {
  'AI': 'AI (Semantic Kernel, MAF, MCP, Ollama)',
  'ML.NET': 'ML.NET pipeline',
  'Cache': 'Caching (IMemoryCache + Redis)',
  'gRPC': 'gRPC',
  'TDD': 'TDD / xUnit',
  'FileBased': 'File-based C# apps',
  'Aspire': 'ASP.NET Aspire',
  'Localization': 'Localization',
  'TagHelpers': 'Tag Helpers',
  'Blazor': 'Blazor QuickGrid',
  'ExcelPDF': 'Excel / PDF / Chart export',
};

// Map topic (card.topic) -> tag list
const TOPIC_TAGS = {
  'AI': ['ai', 'semantic-kernel'],
  'ML.NET': ['ml-net', 'machine-learning'],
  'Cache': ['cache', 'redis'],
  'gRPC': ['grpc', 'proto'],
  'TDD': ['tdd', 'xunit'],
  'FileBased': ['file-based', 'dotnet-run'],
  'Aspire': ['aspire', 'orchestration'],
  'Localization': ['localization', 'i18n'],
  'TagHelpers': ['tag-helpers', 'razor'],
  'Blazor': ['blazor', 'quickgrid'],
  'ExcelPDF': ['excel', 'pdf', 'chart'],
};

// Map topic -> matching DATA.topics[] entry for prose
function findTopicProse(topicKey) {
  // Find by matching title keywords
  const hint = {
    'AI': 'Semantic Kernel',
    'ML.NET': 'ML.NET',
    'Cache': 'IMemoryCache',
    'gRPC': 'gRPC',
    'TDD': 'xUnit',
    'FileBased': 'File-based',
    'Aspire': 'Aspire',
    'Localization': 'Localization',
    'TagHelpers': 'Tag Helpers',
    'Blazor': 'Blazor',
    'ExcelPDF': 'Excel',
  }[topicKey];
  if (!hint) return null;
  return DATA.topics.find(t => t.title && t.title.includes(hint)) || null;
}

function proseFor(topicKey) {
  const t = findTopicProse(topicKey);
  if (t && t.html) {
    // take first <p> if present
    const m = t.html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (m) {
      const txt = stripTags(m[1]);
      if (txt) return txt;
    }
  }
  // Fallback 1-sentence synth
  const synth = {
    'AI': 'AI topics cover Semantic Kernel, Microsoft Agent Framework, MCP and running local models via Ollama.',
    'ML.NET': 'ML.NET follows a seven-step pipeline: context, load, split, pipeline, fit, evaluate, save.',
    'Cache': 'Three caching strategies: IMemoryCache (single server), Redis (distributed) and the Razor Cache Tag Helper.',
    'gRPC': 'gRPC is contract-first RPC over HTTP/2 — .proto defines messages, tooling generates C# server and client stubs.',
    'TDD': 'TDD with xUnit: write a failing test (red), make it pass (green), refactor — driven by Fact, Theory, Assert.',
    'FileBased': '.NET 10 lets a single .cs file act as a runnable app via `dotnet run app.cs` and top-level directives (#:sdk, #:package).',
    'Aspire': 'ASP.NET Aspire orchestrates a polyglot stack — AppHost wires up multiple projects, Redis, SQL, and the dashboard.',
    'Localization': 'Localization is data-driven: register AddLocalization, ship .resx resource files per culture, and configure RequestLocalizationOptions.',
    'TagHelpers': 'Tag Helpers are C# classes that look like HTML attributes — built-in ones cover 90% of cases; custom helpers subclass TagHelper.',
    'Blazor': 'Blazor QuickGrid renders tabular data in three components: <QuickGrid>, <PropertyColumn> per field, and a <Paginator>.',
    'ExcelPDF': 'Generate bytes, wrap in File(...) with the right MIME type — ClosedXML for Excel, QuestPDF for PDF, Chart.js for charts.',
  };
  return synth[topicKey] || '';
}

function buildFlashcards() {
  // group cards by topic
  const byTopic = {};
  for (const c of DATA.flashcards) {
    if (!byTopic[c.topic]) byTopic[c.topic] = [];
    byTopic[c.topic].push(c);
  }

  const modules = [];
  for (const [moduleId, def] of Object.entries(MODULE_MAP)) {
    const topics = [];
    for (const tk of def.topics) {
      const cards = byTopic[tk] || [];
      if (!cards.length) continue;
      const topicObj = {
        id: `4870-${H.slug(TOPIC_DISPLAY[tk] || tk)}`,
        name: TOPIC_DISPLAY[tk] || tk,
        tags: TOPIC_TAGS[tk] || [H.slug(tk)],
        prose: proseFor(tk),
        cards: cards.map(c => {
          const q = c.q || '';
          const a = H.inlineMd(c.a || '');
          // Only emit cloze if literal "____" or <ins> blanks.
          const hasCloze = /____/.test(q) || /<ins>/i.test(q);
          if (hasCloze) {
            // Convert to {{...}} blanks — replace <ins>X</ins> with {{X}}, ____ with {{?}}
            let prompt = q.replace(/<ins>([\s\S]*?)<\/ins>/gi, (_, x) => '{{' + stripTags(x).trim() + '}}');
            prompt = prompt.replace(/____+/g, '{{?}}');
            return {
              type: 'cloze',
              prompt: H.inlineMd(prompt),
              answer: a,
            };
          }
          return {
            type: 'name',
            prompt: H.inlineMd(q),
            answer: a,
          };
        }),
      };
      topics.push(topicObj);
    }
    if (topics.length) modules.push({ id: moduleId, name: def.name, topics });
  }

  writeFile(path.join(OUT, 'flashcards.yaml'), yamlDump({ modules }));
}

// ---------------- mock-exam.yaml ----------------

function buildMockExam() {
  const questions = DATA.mockExam.map((raw, idx) => H.normalizeMockQuestion(raw, idx));
  const duration = (DATA.meta.mockDurationMinutes || 60) * 60;
  writeFile(
    path.join(OUT, 'mock-exam.yaml'),
    yamlDump({ duration_seconds: duration, questions })
  );
}

// ---------------- lessons ----------------

function lessonModuleFor(title) {
  const t = title.toLowerCase();
  if (/semantic kernel|agent framework|mcp|ml\.net|ollama|slm/.test(t)) return 'AI & ML.NET';
  if (/cache|redis/.test(t)) return 'Caching';
  if (/grpc/.test(t)) return 'gRPC';
  if (/tdd|xunit|test/.test(t)) return 'Testing';
  if (/file-based|aspire/.test(t)) return 'Hosting';
  if (/localization/.test(t)) return 'Localization';
  if (/tag helper/.test(t)) return 'Tag Helpers';
  if (/blazor|quickgrid/.test(t)) return 'Blazor';
  if (/excel|pdf|chart/.test(t)) return 'Export';
  if (/mcq|cheat sheet|trap|spotting/.test(t)) return 'Exam prep';
  if (/prerequisite|boot sequence|skeleton/.test(t)) return 'Foundations';
  return 'Misc';
}

function lessonTags(title) {
  const tags = [];
  const t = title.toLowerCase();
  if (/semantic kernel/.test(t)) tags.push('semantic-kernel');
  if (/agent framework|maf/.test(t)) tags.push('maf');
  if (/mcp/.test(t)) tags.push('mcp');
  if (/ml\.net/.test(t)) tags.push('ml-net');
  if (/cach/.test(t)) tags.push('cache');
  if (/grpc/.test(t)) tags.push('grpc');
  if (/tdd|xunit/.test(t)) tags.push('tdd');
  if (/file-based/.test(t)) tags.push('file-based');
  if (/aspire/.test(t)) tags.push('aspire');
  if (/localization/.test(t)) tags.push('localization');
  if (/tag helper/.test(t)) tags.push('tag-helpers');
  if (/blazor|quickgrid/.test(t)) tags.push('blazor');
  if (/excel/.test(t)) tags.push('excel');
  if (/pdf/.test(t)) tags.push('pdf');
  if (/chart/.test(t)) tags.push('chart');
  if (/mcq|trap/.test(t)) tags.push('exam-prep');
  if (/cheat sheet/.test(t)) tags.push('cheat-sheet');
  if (/boot sequence|prerequisite/.test(t)) tags.push('aspnet-core');
  if (!tags.length) tags.push('dotnet');
  return tags.slice(0, 3);
}

// Post-process markdown to:
// - add default "cs" language to untagged fenced code blocks
// - strip duplicated "**Analogy —**" / "**Takeaway —**" etc. inside callout blockquotes
function postProcessMd(md, defaultLang = 'cs') {
  // 1. Fix untagged fences: tag only opening fences (toggle state).
  const lines = md.split('\n');
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^```(.*)$/);
    if (!m) continue;
    if (!inFence) {
      // opening fence
      if (!m[1].trim()) {
        lines[i] = '```' + defaultLang;
      }
      inFence = true;
    } else {
      // closing fence — leave untouched
      inFence = false;
    }
  }
  let out = lines.join('\n');
  // 2. Strip duplicated callout labels right after "> **Label**\n> **Label ..."
  const labels = ['Analogy', 'Takeaway', 'Pitfall', 'Example', 'Note', 'Warning', 'Tip', 'Insight'];
  for (const lab of labels) {
    const re = new RegExp(
      '(^> \\*\\*' + lab + '\\*\\*\\n)> \\*\\*' + lab + '(?:[\\s\\S]*?)\\*\\*[\\s\\S]*?(?= )',
      'gm'
    );
    out = out.replace(re, '$1> ');
  }
  // Simpler targeted replace: "> **Label**\n> **Label —** " => "> **Label**\n> "
  for (const lab of labels) {
    const re = new RegExp(
      '(> \\*\\*' + lab + '\\*\\*\\n)> \\*\\*' + lab + '[^*\\n]*\\*\\*\\s*',
      'g'
    );
    out = out.replace(re, '$1> ');
  }
  return out;
}

function stripLeadingTitle(md, title) {
  // remove leading "# Title" or "## Title" if present as first heading
  const lines = md.split('\n');
  let i = 0;
  while (i < lines.length && !lines[i].trim()) i++;
  if (i < lines.length) {
    const first = lines[i].trim();
    const titleNorm = title.trim().toLowerCase();
    if (/^#{1,3}\s+/.test(first)) {
      const hText = first.replace(/^#+\s+/, '').trim().toLowerCase();
      if (hText === titleNorm || hText.includes(titleNorm) || titleNorm.includes(hText)) {
        lines.splice(i, 1);
      }
    }
  }
  return lines.join('\n').replace(/^\s+/, '');
}

function buildLessons() {
  const dir = path.join(OUT, 'lessons');
  for (const L of DATA.lessons) {
    const n = L.n;
    const s = H.slug(L.title);
    const fn = `${String(n).padStart(2, '0')}-${s}.md`;
    const md = postProcessMd(stripLeadingTitle(H.htmlToMarkdown(L.html || ''), L.title));
    const fm = {
      n,
      id: `4870-lesson-${s}`,
      title: L.title,
      hook: L.hook || '',
      tags: lessonTags(L.title),
      module: lessonModuleFor(L.title),
    };
    const body = `---\n${yamlDump(fm)}---\n\n${md}`;
    writeFile(path.join(dir, fn), body);
  }
}

// ---------------- code-practice ----------------

function detectLang(starter) {
  const s = String(starter || '');
  if (/<\?xml|<Project|<ItemGroup|<PackageReference/.test(s)) return 'xml';
  if (/^\s*\{[\s\S]*"/.test(s)) return 'json';
  if (/^\s*(def |import |from )/m.test(s) && !/using |namespace /m.test(s)) return 'python';
  return 'cs';
}

function buildCodePractice() {
  const dir = path.join(OUT, 'code-practice');
  DATA.codePractice.forEach((p, i) => {
    const n = i + 1;
    const s = H.slug(p.title);
    const fn = `${String(n).padStart(2, '0')}-${s}.md`;
    const lang = detectLang(p.starter);
    const fm = {
      n,
      id: `4870-code-${s}`,
      title: p.title,
      lang,
      variant: 'starter-solution',
      tags: lessonTags(p.title),
    };
    const body = [
      '---',
      yamlDump(fm).trim(),
      '---',
      '',
      '## Prompt',
      '',
      p.prompt || '',
      '',
      '## Starter',
      '',
      '```' + lang,
      (p.starter || '').replace(/\n+$/, ''),
      '```',
      '',
      '## Solution',
      '',
      '```' + lang,
      (p.solution || '').replace(/\n+$/, ''),
      '```',
      '',
      '## Why',
      '',
      p.explanation || '',
      '',
    ].join('\n');
    writeFile(path.join(dir, fn), body);
  });
}

// ---------------- topic-dives ----------------

function buildTopicDives() {
  const dir = path.join(OUT, 'topic-dives');
  for (const t of DATA.topics) {
    const s = H.slug(t.title);
    const fn = `${s}.md`;
    const md = postProcessMd(H.htmlToMarkdown(t.html || ''));
    const fm = {
      id: `4870-topic-${s}`,
      title: t.title,
      pillar: 'tech',
      priority: String(t.priority || 'mid').toLowerCase(),
      chapter: t.chapter || '',
      tags: topicDiveTags(t.pillar, t.title),
    };
    const body = `---\n${yamlDump(fm)}---\n\n${md}`;
    writeFile(path.join(dir, fn), body);
  }
}

function topicDiveTags(pillar, title) {
  const out = [];
  if (pillar) out.push(H.slug(pillar));
  const extra = lessonTags(title || '');
  for (const t of extra) if (!out.includes(t)) out.push(t);
  return out.slice(0, 4);
}

// ---------------- cheat-sheet.md ----------------

function buildCheatSheet() {
  const blocks = DATA.cheatSheet.map(b => {
    const body = postProcessMd(H.htmlToMarkdown(b.body || ''));
    return `## ${b.title}\n\n${body.trim()}\n`;
  });
  const content = `---\ntitle: "COMP 4870 — exam-eve cheat sheet"\n---\n\n${blocks.join('\n')}`;
  writeFile(path.join(OUT, 'cheat-sheet.md'), content);
}

// ---------------- run ----------------

mkdirp(OUT);
buildCourse();
buildFlashcards();
buildMockExam();
buildLessons();
buildCodePractice();
buildTopicDives();
buildCheatSheet();

console.log('4870 extraction complete ->', OUT);
