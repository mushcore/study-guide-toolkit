// Per-course dashboard.
import React from 'react';
import SG from '../state.js';

const CourseView = ({ courseId, onJumpTopic, onJumpRoute }) => {
  const course = window.COURSES.find(c => c.id === courseId);
  if (!course) {
    return (
      <div className="page">
        <div className="eyebrow">404</div>
        <h1 className="h1">Course not found</h1>
        <p className="sub">No course with id <code className="ds-code-inline">{String(courseId)}</code>. The URL may be stale.</p>
        <button className="reveal-btn" onClick={() => onJumpRoute && onJumpRoute({name: 'dashboard'})}>← Back to dashboard</button>
      </div>
    );
  }
  const conf = SG.loadConf();
  const s = SG.examState(course);

  const allTopics = course.modules.flatMap(m => m.topics);
  const total = allTopics.length;
  const mastered = allTopics.filter(t => (conf[t.id] || 0) >= 4).length;
  const due = SG.courseDueCount(course);
  const weakest = SG.courseWeakest(course);
  const pctMastered = total ? Math.round((mastered / total) * 100) : 0;

  const practiceCount = (window.PRACTICE && window.PRACTICE[courseId]) ? window.PRACTICE[courseId].length : 0;
  const cardsDisabled = courseId === '4870';
  const subpages = [
    { key: 'lessons',  title: 'Lessons',     sub: 'long-form walk-throughs',           meta: 'read top-to-bottom' },
    { key: 'mock',     title: 'Mock Exam',   sub: 'timed MCQ · mirrors real format',   meta: course.format },
  ];
  if (!cardsDisabled) {
    subpages.push(
      { key: 'practice', title: 'Practice',    sub: 'code + applied · lab/exam-grounded', meta: `${practiceCount} items` },
      { key: 'flash',    title: 'Flash Cards', sub: 'all topics · sequential deck',      meta: `${total} cards` },
    );
  }
  if (course.cheatsheet_allowed) {
    subpages.push({ key: 'cheat', title: 'Cheat Sheet', sub: 'printable · exam-eve', meta: '8.5×11' });
  }

  const startTopRecall = () => {
    if (weakest) onJumpTopic(weakest);
  };

  return (
    <div className="page">
      <div className="cv-header">
        <div>
          <div className="eyebrow">{course.code} · {course.format}</div>
          <h1 className="h1" style={{marginBottom: 4}}>{course.name}</h1>
          <div className="sub">
            Exam in <span style={{color:'var(--text)'}}>{s.label}</span> · {course.room}
          </div>
        </div>
        <div className="cv-exam-block">
          <div className="cv-countdown-label">COUNTDOWN</div>
          <div className={`cv-countdown ${s.state}`}>{s.label}</div>
          <div className="cv-exam-when">{new Date(course.exam).toLocaleString(undefined, {weekday:'short', month:'short', day:'numeric', hour:'numeric', minute:'2-digit'})}</div>
        </div>
      </div>

      {!cardsDisabled && (
        <div className="cv-kpis">
          <div className="cv-kpi">
            <div className="k-label">DUE TODAY</div>
            <div className="k-value">{due}</div>
            <div className="k-sub">{due === 0 ? 'all caught up' : 'cards to review'}</div>
          </div>
          <div className="cv-kpi">
            <div className="k-label">MASTERED</div>
            <div className="k-value">{mastered}<span className="k-denom">/{total}</span></div>
            <div className="k-sub">{pctMastered}% · Leitner box ≥4</div>
          </div>
          <div className="cv-kpi">
            <div className="k-label">WEAKEST</div>
            <div className="k-value sm">{weakest ? weakest.name : '—'}</div>
            <div className="k-sub">
              {weakest
                ? <button className="cv-inline-btn" onClick={startTopRecall}>start recall →</button>
                : 'nothing flagged'}
            </div>
          </div>
        </div>
      )}

      <div className="ds-section-title" style={{marginTop: 24, marginBottom: 12}}>Sections</div>
      <div className="cv-subnav">
        {subpages.map(p => (
          <button key={p.key} className="cv-subnav-card" onClick={() => onJumpRoute({name: p.key, courseId})}>
            <div className="cv-sn-title">{p.title}</div>
            <div className="cv-sn-sub">{p.sub}</div>
            <div className="cv-sn-meta">{p.meta} <span className="arr">→</span></div>
          </button>
        ))}
      </div>

      {!cardsDisabled && (
        <>
          <div className="heatmap-head" style={{marginTop: 28}}>
            <div className="ds-section-title" style={{border:'none', padding:0}}>Topic heatmap</div>
            <div className="heatmap-legend">
              <span><span className="sw hm-l0"/>unseen</span>
              <span><span className="sw hm-l1"/>1</span>
              <span><span className="sw hm-l2"/>2</span>
              <span><span className="sw hm-l3"/>3</span>
              <span><span className="sw hm-l4"/>4</span>
              <span><span className="sw hm-l5"/>5</span>
            </div>
          </div>

          <div className="heatmap">
            {course.modules.map(m => (
              <div key={m.id} className="hm-module">
                <div className="m-name">
                  {m.name}
                  <div className="m-count" style={{marginTop:4}}>{m.topics.length} topics</div>
                </div>
                <div className="hm-tiles">
                  {m.topics.map(t => {
                    const r = conf[t.id] || 0;
                    const isDue = SG.isDue(t);
                    return (
                      <div key={t.id} className={`hm-tile ${SG.heatClass(r)}`} onClick={() => onJumpTopic(t)}>
                        <span className="lb">{r ? `L${r}` : isDue ? 'DUE' : '—'}</span>
                        <div className="t-name">{t.name}</div>
                        <div className="t-meta">
                          <span>{t.cards.length} cards</span>
                          <span>{t.tags[0] || ''}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseView;
