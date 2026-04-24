#!/usr/bin/env node
// Second-pass lesson fixer. Handles two tricky callout forms agents produced:
//   A. `> **Pitfall:**` — label has a colon INSIDE the bold markers
//   B. `> **Example — something**` — em-dash body INSIDE the bold markers
// Normalizes both to the SCHEMA-canonical form:
//   > **Label**
//   > body line(s)

const fs = require('fs');
const path = require('path');

const DIR = '/Users/kevinliang/BCIT/CST/TERM4/content/4870/lessons';
const FILES = fs.readdirSync(DIR).filter(f => /^[0-9]+-.*\.md$/.test(f)).sort();

const LABELS = 'Pitfall|Takeaway|Example|Note|Warning|Analogy';

for (const f of FILES) {
  const p = path.join(DIR, f);
  let txt = fs.readFileSync(p, 'utf8');
  let changes = 0;

  // Form A: `> **Label:**` + rest of line
  // Strip the trailing colon inside **...** and move any inline body to a new line
  txt = txt.replace(new RegExp(`^> \\*\\*(${LABELS}):\\*\\*(.*)$`, 'gm'),
    (m, label, rest) => {
      changes++;
      const body = rest.trim();
      return body ? `> **${label}**\n> ${body}` : `> **${label}**`;
    });

  // Form B: `> **Label — body**` (em-dash OR ordinary dash with spaces)
  txt = txt.replace(new RegExp(`^> \\*\\*(${LABELS})\\s*[—\\-]\\s*([^*]*)\\*\\*(.*)$`, 'gm'),
    (m, label, body, trailing) => {
      changes++;
      const full = (body + trailing).trim();
      return full ? `> **${label}**\n> ${full}` : `> **${label}**`;
    });

  if (changes > 0) {
    fs.writeFileSync(p, txt);
    console.log(`  ${f}: ${changes} callout(s) normalized`);
  } else {
    console.log(`  ${f}: no changes`);
  }
}
