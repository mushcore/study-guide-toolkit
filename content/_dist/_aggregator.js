// Aggregator: flattens window.CONTENT (one object per course from *.js bundles)
// into the window globals that study-guidev2's JSX components consume.
// Runs after the per-course bundle scripts; runs before state.js + JSX.

(function () {
  const ids = ['4736', '4870', '4911', '4915', '3522'];
  const C = window.CONTENT || {};

  // window.COURSES — one Course object per id, flashcard modules attached.
  window.COURSES = ids.filter(id => C[id]).map(id => ({
    ...C[id].meta,
    modules: C[id].modules.map(m => ({
      ...m,
      topics: m.topics.map(t => ({ ...t, module: m.name })),
    })),
  }));

  // window.ALL_TOPICS — flattened for palette + fuzzy search.
  window.ALL_TOPICS = window.COURSES.flatMap(c =>
    c.modules.flatMap(m =>
      m.topics.map(t => ({
        ...t,
        courseId: c.id,
        courseCode: c.code,
        courseName: c.name,
      }))
    )
  );

  // window.LESSONS[courseId] = [{ n, id, title, hook, tags, module, blocks: [...] }, ...]
  window.LESSONS = {};
  ids.forEach(id => { if (C[id]) window.LESSONS[id] = C[id].lessons; });

  // window.TOPIC_DIVES[courseId] = [{ id, title, pillar, priority, chapter, tags, blocks: [...] }, ...]
  window.TOPIC_DIVES = {};
  ids.forEach(id => { if (C[id]) window.TOPIC_DIVES[id] = C[id].topicDives; });

  // window.MOCK_QUESTIONS[courseId] = [{ q, choices, correct, why, ... }, ...]
  // Rename question → q, rationale → why for the existing MockExam.jsx.
  window.MOCK_QUESTIONS = {};
  ids.forEach(id => {
    if (!C[id]) return;
    window.MOCK_QUESTIONS[id] = C[id].mockExam.questions
      .filter(q => Array.isArray(q.choices) && q.choices.length > 0)
      .map(q => ({
        ...q,
        q: q.question,
        why: q.rationale,
      }));
  });

  // window.CODE_PROBLEMS[courseId] = starter-solution problems only.
  // Bundle provides prompt_html + why_html — keep as HTML for CodeApplied.jsx to render.
  window.CODE_PROBLEMS = {};
  ids.forEach(id => {
    if (!C[id]) return;
    window.CODE_PROBLEMS[id] = C[id].codePractice
      .filter(p => p.variant !== 'annotation')
      .map(p => ({
        id: p.id,
        title: p.title,
        lang: p.lang,
        prompt: p.prompt_html || '',
        starter: p.starter || '',
        solution: p.solution || '',
        why: p.why_html || '',
      }));
  });

  // window.CODE_ANNOTATIONS[courseId] = annotation-variant problems.
  // Shape matches CodeAnnotation.jsx: { id, title, lang, code, notes: [{ line, tag, text }] }.
  window.CODE_ANNOTATIONS = {};
  ids.forEach(id => {
    if (!C[id]) return;
    window.CODE_ANNOTATIONS[id] = C[id].codePractice
      .filter(p => p.variant === 'annotation')
      .map(p => ({
        id: p.id,
        title: p.title,
        lang: p.lang,
        code: p.code || '',
        notes: p.notes || [],
      }));
  });

  // window.CHEAT_SHEETS[courseId] = [{ heading, body }, ...] — body is HTML.
  window.CHEAT_SHEETS = {};
  ids.forEach(id => {
    if (!C[id]) return;
    window.CHEAT_SHEETS[id] = C[id].cheatSheet.blocks.map(b => ({
      heading: b.heading,
      body: b.body_html,
    }));
  });
})();
