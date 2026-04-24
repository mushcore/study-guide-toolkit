#!/usr/bin/env node
// Merge Module 1 per-topic cards.yaml drafts into a canonical flashcards.yaml.
// Normalizes agent drift: front/back → prompt/answer, invalid types → name/cloze,
// {{cN::X}} → {{X}}, strips `mcq` choices, promotes `predict`/`diagram` shape.

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DRAFT_DIR = '/Users/kevinliang/BCIT/CST/TERM4/content/4870/_scratch/draft';
const OUT = '/Users/kevinliang/BCIT/CST/TERM4/content/4870/flashcards.yaml';

// Module layout — ordered list of (module-id, module-name, topic-ids)
const MODULES = [
  {
    id: 'module-1-ai-in-dotnet',
    name: 'AI in .NET',
    topics: [
      'ai-agent-framework',
      'ml-pipeline-workflow',
      'ai-semantic-kernel',
      'ml-data-transforms',
      'ml-regression-evaluation',
      'ml-prediction-consumption',
      'ai-chat-completion-local',
      'ai-cloud-models',
      'ml-automl-cli',
    ],
  },
  {
    id: 'module-2-distributed-services',
    name: 'Distributed Services & Orchestration',
    topics: [
      'grpc-proto-contracts',
      'grpc-server-implementation',
      'grpc-client-consumption',
      'aspire-apphost',
      'aspire-service-defaults',
      'aspire-orchestrated-resources',
    ],
  },
  {
    id: 'module-3-performance-caching',
    name: 'Performance & Caching',
    topics: [
      'cache-abstractions',
      'cache-expiration',
      'cache-aside-pattern',
      'redis-configuration',
      'cache-tag-helper',
      'taghelper-authoring',
      'taghelper-output-registration',
    ],
  },
  {
    id: 'module-4-i18n-ui',
    name: 'Internationalization & Modern UI',
    topics: [
      'localization-resources-cultures',
      'localization-setup',
      'localization-injection',
      'blazor-quickgrid',
    ],
  },
  {
    id: 'module-5-dotnet10-reporting',
    name: '.NET 10 Scripts & Reporting',
    topics: [
      'file-based-app-basics',
      'file-based-app-directives',
      'file-based-app-web',
      'excel-export',
      'pdf-export',
      'chart-rendering',
    ],
  },
  {
    id: 'module-6-testing',
    name: 'Testing Discipline',
    topics: [
      'tdd-cycle',
      'xunit-attributes-assertions',
      'xunit-fixtures-lifecycle',
    ],
  },
];
// Flat priority-ordered list (kept for backward-compat reads of per-topic drafts)
const TOPICS = MODULES.flatMap(m => m.topics);

function stripClozePrefix(s) {
  if (typeof s !== 'string') return s;
  // Strip Anki-style `c1::`, `c2::` etc. from within `{{...}}` markers.
  return s.replace(/\{\{c\d+::([^}]+)\}\}/g, '{{$1}}');
}

function normalizeCard(raw) {
  const c = { ...raw };

  // Rename fields
  if (c.front !== undefined && c.prompt === undefined) { c.prompt = c.front; delete c.front; }
  if (c.back !== undefined && c.answer === undefined) { c.answer = c.back; delete c.back; }

  // Normalize type
  const t = c.type;
  if (t === 'qa' || t === 'recall' || t === 'mcq') {
    c.type = 'name';
    // MCQ had choices array; schema 'name' has no choices — drop it + collapse answer.
    if (c.choices) delete c.choices;
  }

  // Strip cloze prefixes from the prompt
  if (c.prompt) c.prompt = stripClozePrefix(c.prompt);

  // Cloze cards: ensure the prompt has at least one `{{...}}` blank
  if (c.type === 'cloze' && c.prompt && !/\{\{[^}]+\}\}/.test(c.prompt)) {
    console.warn(`WARN: cloze card ${c.id} has no {{...}} blanks — converting to name`);
    c.type = 'name';
  }

  // Predict cards: must have `code` field
  if (c.type === 'predict' && !c.code) {
    // Check if code is embedded in prompt
    console.warn(`WARN: predict card ${c.id} missing code field — converting to name`);
    c.type = 'name';
  }

  // Diagram cards: must have `mermaid` + `labels`
  if (c.type === 'diagram' && (!c.mermaid || !c.labels)) {
    console.warn(`WARN: diagram card ${c.id} missing mermaid/labels — converting to name`);
    c.type = 'name';
    delete c.mermaid; delete c.labels;
  }

  return c;
}

function loadTopic(id) {
  const p = path.join(DRAFT_DIR, id, 'cards.yaml');
  if (!fs.existsSync(p)) {
    console.error(`MISSING: ${p}`);
    process.exit(1);
  }
  const parsed = yaml.load(fs.readFileSync(p, 'utf8'));
  // Some agents used `title:` instead of `name:` — normalize.
  if (!parsed.name && parsed.title) { parsed.name = parsed.title; delete parsed.title; }
  // Fallback: derive name from id if neither name nor title present.
  if (!parsed.name) {
    parsed.name = parsed.id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }
  // Ensure topic-level `source` exists — inherited by cards without per-card source.
  const DEFAULT_SOURCE = {
    'ai-agent-framework': 'notes/AI-Models_MAF_SCRIPT.docx; research-ai.md §MAF',
    'ai-semantic-kernel': 'slides/CSharp_Meets_AI.pptx; notes/AI-Models_MAF_SCRIPT.docx; research-ai.md §Semantic Kernel',
    'ai-chat-completion-local': 'slides/SLM.pptx; notes/SLM.docx; research-ai.md §Ollama, §Chat Completion',
    'ai-cloud-models': 'notes/AI-Models_MAF_SCRIPT.docx; research-ai.md §Call GitHub Models, §Call Azure OpenAI',
    'ml-pipeline-workflow': 'slides/ML.NET.pptx; notes/ML.NET_VSCODE_SCRIPT.docx; research-mlnet.md §Complete ML.NET Workflow',
    'ml-data-transforms': 'slides/ML.NET.pptx; notes/ML.NET_VSCODE_SCRIPT.docx; research-mlnet.md §Key Transform Classes',
    'ml-regression-evaluation': 'slides/ML.NET.pptx; notes/ML.NET_VSCODE_SCRIPT.docx; research-mlnet.md §Evaluation Metrics',
    'ml-prediction-consumption': 'notes/ML.NET_VS2022_SCRIPT.docx; notes/ML.NET_VSCODE_SCRIPT.docx; research-mlnet.md §PredictionEngine, §Save & Load',
    'ml-automl-cli': 'notes/ML.NET_vscode_automl_SCRIPT.docx; research-mlnet.md §AutoML CLI',
  };
  if (!parsed.source && DEFAULT_SOURCE[parsed.id]) parsed.source = DEFAULT_SOURCE[parsed.id];
  // Some agents dropped `prose:` — insert a neutral placeholder (will be caught by audit warning).
  if (!parsed.prose) parsed.prose = `Cards for the ${parsed.name} topic.`;
  if (!parsed.tags) parsed.tags = [];
  if (!parsed.id || !parsed.name || !parsed.cards) {
    console.error(`INVALID STRUCTURE: ${p} — id=${parsed.id} name=${parsed.name} cards=${parsed.cards?.length}`);
    process.exit(1);
  }
  parsed.cards = parsed.cards.map(normalizeCard);
  console.log(`  ${id}: ${parsed.cards.length} cards, types [${[...new Set(parsed.cards.map(c => c.type))].join(', ')}]`);
  return parsed;
}

const out = {
  modules: MODULES.map(m => ({
    id: m.id,
    name: m.name,
    topics: m.topics.map(loadTopic),
  })),
};

fs.writeFileSync(OUT, yaml.dump(out, { lineWidth: 120, noRefs: true, sortKeys: false }));
const totalTopics = out.modules.reduce((s, m) => s + m.topics.length, 0);
const totalCards  = out.modules.reduce((s, m) => s + m.topics.reduce((t, x) => t + x.cards.length, 0), 0);
console.log(`\nWrote ${OUT}`);
console.log(`Modules: ${out.modules.length} · Topics: ${totalTopics} · Cards total: ${totalCards}`);
