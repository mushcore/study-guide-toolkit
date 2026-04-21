// Mock Exam — instant-feedback MCQ.
import React from 'react';

const MockExam = ({ courseId }) => {
  const course = window.COURSES.find(c => c.id === courseId) || window.COURSES[0];
  const allQs = ((window.MOCK_QUESTIONS || {})[courseId] || []).filter(q => Array.isArray(q.choices) && q.choices.length > 0);
  const memoryFocusCount = allQs.filter(q => Array.isArray(q.tags) && q.tags.includes('memory-focus')).length;

  const [filter, setFilter] = React.useState('all');
  const [answers, setAnswers] = React.useState({});

  const qs = filter === 'memory-focus'
    ? allQs.filter(q => Array.isArray(q.tags) && q.tags.includes('memory-focus'))
    : allQs;

  React.useEffect(() => { setAnswers({}); }, [filter]);

  const answeredCount = Object.keys(answers).length;
  const score = qs.filter((q, i) => answers[i] === q.correct).length;

  const reset = () => setAnswers({});

  return (
    <div className="page">
      <div className="eyebrow">{course.code} · mock exam · {course.format}</div>
      <h1 className="h1">Mock exam</h1>
      <p className="sub">{qs.length} MCQ · instant feedback on selection.</p>

      {memoryFocusCount > 0 && (
        <div className="mock-tabs" role="tablist" aria-label="Question bank filter">
          <button
            role="tab"
            aria-selected={filter === 'all'}
            className={`mock-tab${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All <span className="mock-tab-count">({allQs.length})</span>
          </button>
          <button
            role="tab"
            aria-selected={filter === 'memory-focus'}
            className={`mock-tab${filter === 'memory-focus' ? ' active' : ''}`}
            onClick={() => setFilter('memory-focus')}
          >
            Memory focus <span className="mock-tab-count">({memoryFocusCount})</span>
          </button>
        </div>
      )}

      <div className="mock-header">
        <div className="mock-info">
          {answeredCount} / {qs.length} answered · score {score}/{answeredCount || 0}
        </div>
        <button className="reveal-btn" onClick={reset} disabled={answeredCount === 0}>
          Reset
        </button>
      </div>

      {qs.map((q, i) => {
        const answered = answers[i] !== undefined;
        return (
          <div key={i} className="question">
            <div className="q-num">Q{i+1}</div>
            <div className="q-text">{q.q}</div>
            <div className="choices">
              {q.choices.map((c, ci) => {
                let cls = 'choice';
                if (answers[i] === ci) cls += ' selected';
                if (answered) {
                  if (ci === q.correct) cls += ' correct';
                  else if (answers[i] === ci) cls += ' incorrect';
                }
                return (
                  <div key={ci} className={cls} onClick={() => !answered && setAnswers({...answers, [i]: ci})}>
                    <span className="letter">{String.fromCharCode(97+ci)}</span>
                    <span>{c}</span>
                  </div>
                );
              })}
            </div>
            {answered && (
              <div className="q-why">
                <strong>{answers[i] === q.correct ? '✓ correct' : '✗ ' + q.choices[q.correct]}</strong> — {q.why}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MockExam;
