#!/usr/bin/env node
// For cards whose `answer` field is actually a full mechanism sentence
// (length > 30 words or contains sentence-terminators), promote it to
// `explanation` and derive a short `answer` from the cloze blank or
// from a key term. Also stamp in a placeholder `example` when missing.
// Target: the 3 topics whose agents skipped these fields.

const fs = require('fs');
const yaml = require('js-yaml');

const FC = '/Users/kevinliang/BCIT/CST/TERM4/content/4870/flashcards.yaml';
const TARGETS = new Set([
  'ml-data-transforms',
  'ml-prediction-consumption',
  'ml-automl-cli',
]);

const doc = yaml.load(fs.readFileSync(FC, 'utf8'));

// Extract first {{...}} blank from a cloze prompt
function firstBlank(prompt) {
  const m = /\{\{([^}]+)\}\}/.exec(prompt || '');
  if (!m) return null;
  return m[1].replace(/^`+|`+$/g, ''); // strip wrapping backticks
}

// Heuristic: is this "answer" really a mechanism-length explanation?
function looksLikeExplanation(a) {
  if (!a) return false;
  const wordCount = a.trim().split(/\s+/).length;
  return wordCount > 18 || /\. [A-Z`]/.test(a);  // multi-sentence or long
}

let promoted = 0;
for (const mod of doc.modules) {
  for (const topic of mod.topics) {
    if (!TARGETS.has(topic.id)) continue;

    for (const card of topic.cards) {
      // If no explanation AND answer looks like a mechanism, promote it
      if (!card.explanation && looksLikeExplanation(card.answer)) {
        card.explanation = card.answer;
        // Derive a shorter answer
        if (card.type === 'cloze') {
          const blank = firstBlank(card.prompt);
          card.answer = blank || card.answer.split('.')[0].trim();
        } else {
          // For `name` cards, keep first sentence or up to 15 words
          const first = card.answer.split(/(?<=[.!?])\s+/)[0].trim();
          const words = first.split(/\s+/).slice(0, 15).join(' ');
          card.answer = words + (first.split(/\s+/).length > 15 ? ' …' : '');
        }
        promoted++;
      }

      // Example placeholder when missing
      if (!card.example) {
        card.example = '<!-- example: Stage 5 enrichment -->';
      }
    }
  }
}

fs.writeFileSync(FC, yaml.dump(doc, { lineWidth: 120, noRefs: true, sortKeys: false }));
console.log(`Promoted ${promoted} answers → explanation, stamped examples on missing cards.`);
