// Priorities — weighted what-to-study-vs-skip table.
import React from 'react';
import SG from '../state.js';

const Priorities = ({ courseId, onJumpTopic }) => {
  const course = window.COURSES.find(c => c.id === courseId) || window.COURSES[0];
  const conf = SG.loadConf();

  const rows = course.modules.flatMap(m => m.topics.map(t => {
    const r = conf[t.id] || 0;
    const cards = t.cards.length;
    const weight = cards * (r ? (6 - r) : 6);

    let tier;
    if (r >= 4) tier = 'skim';
    else if (r === 3) tier = 'mid';
    else if (r === 1 || r === 2) tier = 'deep';
    else if (cards >= 3) tier = 'deep';
    else if (cards >= 2) tier = 'mid';
    else tier = 'skim';

    return { t, r, cards, weight, tier, module: m.name };
  })).sort((a, b) => b.weight - a.weight);

  const tierMeta = {
    deep: { cls: 'hi', label: 'DEEP', },
    mid: { cls: 'med', label: 'MID', },
    skim: { cls: 'low', label: 'SKIM', },
  };

  return (
    <div className="page">
      <div className="eyebrow">{course.code} · priorities · {course.format}</div>
      <h1 className="h1">What to study · what to skip</h1>
      <p className="sub">Ranked by weight = (cards remaining) × (6 − confidence). DEEP rows cannot be skipped.</p>

      <div className="panel-block">
        <div className="hdr">
          <h3>Weighted plan</h3>
          <span className="count-total">{rows.length} topics</span>
        </div>
        <div className="prio-list">
          {rows.map(({ t, r, weight, tier, module }) => {
            const meta = tierMeta[tier];
            return (
              <div key={t.id} className={`prio-row ${meta.cls}`} onClick={() => onJumpTopic({ ...t, courseId })}>
                <span className="p-tier"><span className={`badge ${meta.cls}`}>{meta.label}</span></span>
                <span className="p-name">
                  <div className="pn-title">{t.name}</div>
                  <div className="pn-why">{module.toLowerCase()}</div>
                </span>
                <span className="p-metric">L{r || '—'}</span>
                <span className="p-metric">{t.cards.length}c</span>
                <span className="p-weight">{weight}</span>
                <span className="p-go">open →</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Priorities;
