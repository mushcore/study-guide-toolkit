// Aggregator: flattens window.CONTENT (one object per course from *.js bundles)
// into the window globals that study-guidev2's JSX components consume.
// Runs after the per-course bundle scripts; runs before state.js + JSX.

(function () {
  const C = window.CONTENT || {};
  const ids = Object.keys(C);

  // window.COURSES — one Course object per id, flashcard modules attached.
  // meta.cheatsheet_allowed rides along so consumers can gate the cheat subview.
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

  // window.LESSONS[courseId] = [{ n, id, title, hook, tags, module, kind, blocks: [...] }, ...]
  // kind === 'strategy' marks the exam-strategy lesson (lessons/00-exam-strategy.md).
  window.LESSONS = {};
  ids.forEach(id => { if (C[id]) window.LESSONS[id] = C[id].lessons; });

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

  // window.PRACTICE[courseId] = [{ kind, variant?, n, id, title, lang?, tags, source, ...body-fields }, ...]
  // Consumers dispatch on `kind` + `variant`:
  //   kind === 'code' + variant === 'starter-solution' → { prompt_html, starter, solution, why_html }
  //   kind === 'code' + variant === 'annotation' → { code, notes: [{ line, tag, text }] }
  //   kind === 'applied' → { problem_html, walkthrough_html, common_wrong_html, why_html }
  window.PRACTICE = {};
  ids.forEach(id => { if (C[id]) window.PRACTICE[id] = C[id].practice || []; });

  // window.CHEAT_SHEETS[courseId] = null | [{ heading, body }, ...]
  // null when the course's cheatsheet_allowed is false (the compiler refuses to
  // produce a cheat-sheet in that case; app must hide the subview).
  window.CHEAT_SHEETS = {};
  ids.forEach(id => {
    if (!C[id]) return;
    window.CHEAT_SHEETS[id] = C[id].cheatSheet
      ? C[id].cheatSheet.blocks.map(b => ({ heading: b.heading, body: b.body_html }))
      : null;
  });
})();
