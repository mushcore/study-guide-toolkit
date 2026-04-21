// Shared conversion helpers used by per-course extraction.
// HTML -> Markdown with custom rules, slugging, mock-answer normalization.
//
// Usage:
//   const H = require('./scripts/extract-helpers');
//   const md = H.htmlToMarkdown(lesson.html);
//   const slug = H.slug('Race conditions & critical regions');

const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '*',
    bulletListMarker: '-'
  });
  td.use(gfm);

  // Preserve SVG and other raw HTML blocks that can't round-trip.
  td.keep(['svg', 'iframe']);

  // <code class="inline">X</code> -> `X` (inline code)
  // Default turndown converts <code> correctly, but ensure class doesn't break it.
  td.addRule('inline-code', {
    filter: function (node) {
      return node.nodeName === 'CODE' && node.parentNode && node.parentNode.nodeName !== 'PRE';
    },
    replacement: function (content) {
      return '`' + content.replace(/`/g, '\\`') + '`';
    }
  });

  // <pre><code class="language-X">...</code></pre> -> fenced block
  td.addRule('fenced-code', {
    filter: function (node) {
      return (
        node.nodeName === 'PRE' &&
        node.firstChild && node.firstChild.nodeName === 'CODE'
      );
    },
    replacement: function (_content, node) {
      const code = node.firstChild;
      const cls = (code.getAttribute && code.getAttribute('class')) || '';
      const m = cls.match(/language-([\w+-]+)/);
      let lang = m ? m[1] : '';
      // Map common aliases
      const aliases = { csharp: 'cs', 'c#': 'cs', shell: 'bash', sh: 'bash', plaintext: 'text' };
      if (aliases[lang]) lang = aliases[lang];
      const text = code.textContent || '';
      const trimmed = text.replace(/\n+$/, '');
      return '\n\n```' + lang + '\n' + trimmed + '\n```\n\n';
    }
  });

  // Checkpoints: <div class="checkpoint"> with .q and .a children -> blockquote Q/A
  td.addRule('checkpoint', {
    filter: function (node) {
      return node.nodeName === 'DIV' && hasClass(node, 'checkpoint');
    },
    replacement: function (_content, node) {
      const q = findChildWithClass(node, ['q', 'ck-q']);
      const a = findChildWithClass(node, ['a', 'ck-a']);
      const qText = q ? cleanInline(q) : '';
      const aText = a ? cleanInline(a) : '';
      return '\n\n> **Q:** ' + qText + '\n> **A:** ' + aText + '\n\n';
    }
  });

  // Labeled callouts: analogy, takeaway, example, pitfall, note, warning, tip
  const calloutMap = {
    analogy: 'Analogy',
    takeaway: 'Takeaway',
    example: 'Example',
    pitfall: 'Pitfall',
    note: 'Note',
    warning: 'Warning',
    warn: 'Warning',
    tip: 'Note',
    insight: 'Takeaway',
    callout: 'Note'
  };
  td.addRule('callout-div', {
    filter: function (node) {
      if (node.nodeName !== 'DIV') return false;
      const cls = node.getAttribute('class') || '';
      return Object.keys(calloutMap).some(k => cls.split(/\s+/).includes(k));
    },
    replacement: function (_content, node) {
      const cls = node.getAttribute('class') || '';
      const kind = Object.keys(calloutMap).find(k => cls.split(/\s+/).includes(k));
      const label = calloutMap[kind];
      // Strip leading bold label like "Analogy." at the start of the inner HTML, since we prepend our own.
      // Convert inner HTML to markdown recursively via a fresh turndown pass on a cloned node.
      const inner = serializeInner(node);
      const innerMd = htmlToMarkdown(inner)
        .replace(new RegExp('^\\s*\\*\\*' + label + '\\.?\\*\\*\\.?\\s*', 'i'), '')
        .replace(new RegExp('^\\s*\\*\\*' + label + '\\*\\*\\.?\\s*', 'i'), '')
        .trim();
      const quoted = innerMd.split('\n').map(l => l.length ? '> ' + l : '>').join('\n');
      return '\n\n> **' + label + '**\n' + quoted + '\n\n';
    }
  });

  // Tables with colspan/rowspan -> keep as raw HTML
  td.addRule('complex-table', {
    filter: function (node) {
      if (node.nodeName !== 'TABLE') return false;
      return !!node.querySelector && !!(node.querySelector('[colspan],[rowspan]'));
    },
    replacement: function (_c, node) {
      return '\n\n' + serializeOuter(node) + '\n\n';
    }
  });

  // Strip empty/irrelevant wrappers that add noise but no info
  td.addRule('drop-empty-div', {
    filter: function (node) {
      if (node.nodeName !== 'DIV') return false;
      const cls = node.getAttribute('class') || '';
      return cls.split(/\s+/).some(c => ['source-chip', 'badge', 'tag-row', 'meta-chip'].includes(c));
    },
    replacement: function () { return ''; }
  });

  return td;
}

function hasClass(node, c) {
  const cls = node.getAttribute && node.getAttribute('class');
  if (!cls) return false;
  return cls.split(/\s+/).includes(c);
}

function findChildWithClass(node, classes) {
  for (const ch of Array.from(node.childNodes || [])) {
    if (ch.nodeType === 1 && classes.some(c => hasClass(ch, c))) return ch;
  }
  return null;
}

function serializeInner(node) {
  return node.innerHTML || '';
}

function serializeOuter(node) {
  return node.outerHTML || '';
}

function cleanInline(node) {
  // Return the text content with inline tags flattened to markdown.
  const html = node.innerHTML || node.textContent || '';
  return htmlToMarkdown(html).replace(/\n+/g, ' ').trim();
}

let _td;
function getTD() { if (!_td) _td = makeTurndown(); return _td; }

function htmlToMarkdown(html) {
  if (!html) return '';
  return getTD().turndown(String(html)).trim() + '\n';
}

function slug(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
    || 'untitled';
}

function inlineMd(html) {
  if (!html) return '';
  return htmlToMarkdown(html).replace(/\n+/g, ' ').trim();
}

// Convert source mock-exam answer into schema-normalized { type, choices, correct, rationale }.
function normalizeMockQuestion(raw, idx) {
  const srcType = String(raw.type || '').toLowerCase();
  const qText = inlineMd(raw.question || '');
  const expl = inlineMd(raw.explanation || '');
  const topic = raw.topic || '';
  const marks = Number(raw.marks || 1);

  let type, choices, correct;

  if (srcType === 't/f' || srcType === 'tf' || srcType === 'true/false') {
    type = 'MCQ';
    choices = ['True', 'False'];
    const a = String(raw.answer || '').trim().toUpperCase();
    correct = a === 'T' || a === 'TRUE' ? 0 : 1;
  } else if (srcType === 'mcq' || srcType === 'multiple choice' || srcType === 'mc') {
    type = 'MCQ';
    choices = Array.isArray(raw.choices) ? raw.choices.slice() : [];
    // Strip leading "a. " / "A) " prefix from choices if present, then convert inline HTML to Markdown.
    choices = choices.map(c => inlineMd(String(c).replace(/^\s*[a-eA-E][.)\]]\s*/, '').trim()));
    const a = raw.answer;
    if (typeof a === 'number') {
      correct = a;
    } else if (typeof a === 'string' && /^[a-eA-E]$/.test(a.trim())) {
      correct = 'abcde'.indexOf(a.trim().toLowerCase());
    } else {
      // Fallback: search for a choice matching the answer text.
      correct = 0;
    }
    if (correct < 0 || correct >= choices.length) correct = 0;
  } else if (srcType === 'short answer' || srcType === 'short' || srcType === 'applied' || srcType === 'essay' || srcType === 'code annotation' || srcType === 'code') {
    type = 'SHORT';
    choices = undefined;
    correct = String(raw.answer || '').trim();
  } else {
    // Unknown — treat as SHORT to avoid data loss.
    type = 'SHORT';
    choices = undefined;
    correct = String(raw.answer || '').trim();
  }

  const out = {
    id: 'q' + String(idx + 1),
    type,
    topic,
    marks,
    question: qText,
    correct,
    rationale: expl
  };
  if (choices) out.choices = choices;
  return out;
}

module.exports = {
  htmlToMarkdown,
  inlineMd,
  slug,
  normalizeMockQuestion
};
