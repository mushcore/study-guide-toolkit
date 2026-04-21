// Topic Deep-Dives — filterable collapsible list.
import React from 'react';
import { LessonBlock } from './Lessons.jsx';

const PRIORITY_RANK = { high: 0, mid: 1, low: 2 };

const TopicDives = ({ courseId, onJumpTopic }) => {
  const course = window.COURSES.find(c => c.id === courseId) || window.COURSES[0];
  const TOPIC_DIVES = window.TOPIC_DIVES || {};
  const dives = (TOPIC_DIVES[courseId] || []).slice().sort((a, b) => {
    const pa = PRIORITY_RANK[a.priority] ?? 9;
    const pb = PRIORITY_RANK[b.priority] ?? 9;
    if (pa !== pb) return pa - pb;
    return (a.title || '').localeCompare(b.title || '');
  });

  const [filter, setFilter] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [openId, setOpenId] = React.useState(null);

  const tags = Array.from(new Set(dives.flatMap(d => d.tags || []))).sort();

  const blockText = (b) => {
    if (b.text) return b.text;
    if (b.html) return b.html.replace(/<[^>]+>/g, ' ');
    if (b.code) return b.code;
    if (b.q) return `${b.q} ${b.a || ''}`;
    return '';
  };

  const match = (d) => {
    if (filter !== 'all' && !(d.tags || []).includes(filter)) return false;
    if (!q) return true;
    const needle = q.toLowerCase();
    if ((d.title || '').toLowerCase().includes(needle)) return true;
    return (d.blocks || []).some(b => blockText(b).toLowerCase().includes(needle));
  };

  const visible = dives.filter(match);

  if (!dives.length) return (
    <div className="page">
      <div className="eyebrow">{course.code} · topic deep-dives</div>
      <h1 className="h1">No topic dives for this course yet</h1>
      <p className="sub">Add .md files to <code className="ds-code-inline">content/{courseId}/topic-dives/</code>.</p>
    </div>
  );

  return (
    <div className="page">
      <div className="eyebrow">{course.code} · topic deep-dives</div>
      <h1 className="h1">Every topic, full-depth</h1>
      <p className="sub">{dives.length} dives · {visible.length} shown · filter by tag or search inline. Click to expand.</p>

      <div className="dive-bar">
        <input className="dive-search" placeholder="search titles + content…" value={q} onChange={e => setQ(e.target.value)} />
        <div className="dive-tags">
          <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>all</button>
          {tags.map(t => (
            <button key={t} className={filter === t ? 'on' : ''} onClick={() => setFilter(t)}>#{t}</button>
          ))}
        </div>
      </div>

      <div className="panel-block">
        {visible.map(d => {
          const open = openId === d.id;
          return (
            <div key={d.id} className={`dive-item${open ? ' open' : ''}`}>
              <div className="dive-head" onClick={() => setOpenId(open ? null : d.id)}>
                <span className="dive-chevron">{open ? '▾' : '▸'}</span>
                <span className="dive-name">{d.title}</span>
                <span className="dive-tag-row">
                  {(d.tags || []).map(tag => <span key={tag} className="dive-tag">#{tag}</span>)}
                </span>
                {d.chapter && <span className="dive-lb">{d.chapter}</span>}
                {d.priority && <span className={`dive-pri dive-pri-${d.priority}`}>{d.priority}</span>}
              </div>
              {open && (
                <div className="dive-body">
                  {(d.blocks || []).map((b, i) => <LessonBlock key={i} b={b}/>)}
                </div>
              )}
            </div>
          );
        })}
        {!visible.length && (
          <div style={{padding: 20, textAlign: 'center', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize:'var(--fs-12)'}}>
            no dives match {q ? `"${q}"` : `#${filter}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDives;
