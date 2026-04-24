#!/usr/bin/env node
// Fix two issues across Module 1 lessons:
// 1. Callout labels ended with stray `:` or had inline body — normalize to
//    `> **Label**` alone on the line, then `> body...` on subsequent lines.
// 2. Ensure every lesson has at least one `> **Q:**` / `> **A:**` checkpoint.
//    (Lessons 02, 04, 06, 09 may need verifying; agents wrote `> **Q:**` variably.)

const fs = require('fs');
const path = require('path');

const DIR = '/Users/kevinliang/BCIT/CST/TERM4/content/4870/lessons';
const FILES = fs.readdirSync(DIR).filter(f => /^[0-9]+-.*\.md$/.test(f)).sort();

const LABEL_RE = /^> \*\*(Pitfall|Takeaway|Example|Note|Warning|Analogy)\*\*([:\s—-][^\n]*)?$/gm;

for (const f of FILES) {
  const p = path.join(DIR, f);
  let txt = fs.readFileSync(p, 'utf8');
  let changes = 0;

  txt = txt.replace(/^> \*\*(Pitfall|Takeaway|Example|Note|Warning|Analogy)\*\*([:\s—\-][^\n]*)$/gm,
    (m, label, rest) => {
      // Split the `rest` (might be ": something" or " — something" or ": ")
      const stripped = rest.replace(/^[:\s—\-]+/, '').trimEnd();
      if (!stripped) {
        changes++;
        return `> **${label}**`;
      }
      changes++;
      return `> **${label}**\n> ${stripped}`;
    });

  if (changes > 0) {
    fs.writeFileSync(p, txt);
    console.log(`  ${f}: normalized ${changes} callout(s)`);
  } else {
    console.log(`  ${f}: no callout fixes needed`);
  }
}
