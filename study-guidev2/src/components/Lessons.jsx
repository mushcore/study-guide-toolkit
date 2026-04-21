// Lessons — long-form read-through, capped reading column, callouts, checkpoints.
import React from 'react';
import { Highlighted } from './Highlighted.jsx';
import { Markdown } from './Markdown.jsx';

let mermaidDiagramCounter = 0;

const MermaidDiagram = ({ source }) => {
  const [svg, setSvg] = React.useState('');
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    const id = `mermaid-d-${++mermaidDiagramCounter}`;
    const m = window.mermaid;
    if (!m) { setError('mermaid not loaded'); return; }
    m.render(id, source)
      .then(({ svg }) => { if (!cancelled) { setSvg(svg); setError(null); } })
      .catch(e => { if (!cancelled) setError(String(e && e.message || e)); });
    return () => { cancelled = true; };
  }, [source]);

  if (error) {
    return (
      <div className="mermaid-error">
        <div style={{fontSize:'var(--fs-11)', color:'var(--bad)', marginBottom:6, fontFamily:'var(--font-mono)'}}>Mermaid render failed — {error}</div>
        <pre className="code hl-block"><code>{source}</code></pre>
      </div>
    );
  }
  return <div className="mermaid-block" dangerouslySetInnerHTML={{__html: svg}}/>;
};

export const Checkpoint = ({ q, a }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="checkpoint" onClick={() => setOpen(o => !o)}>
      <div className="ck-label">Checkpoint</div>
      <div className="ck-q"><Markdown text={q}/></div>
      {open
        ? <div className="ck-a"><Markdown text={a}/></div>
        : <div style={{fontSize:'var(--fs-11)', color:'var(--text-faint)', fontFamily:'var(--font-mono)'}}>click to reveal</div>}
    </div>
  );
};

export const LessonBlock = ({ b }) => {
  if (!b) return null;
  switch (b.kind) {
    case 'p':
      return <p dangerouslySetInnerHTML={{__html: b.html}}/>;
    case 'h2':
      return <h3 dangerouslySetInnerHTML={{__html: b.html}}/>;
    case 'h3':
      return <h4 dangerouslySetInnerHTML={{__html: b.html}}/>;
    case 'code':
      return <Highlighted code={b.code} lang={b.lang || 'plaintext'} className="code hl-block"/>;
    case 'callout': {
      const v = b.variant || 'note';
      const label = v.charAt(0).toUpperCase() + v.slice(1);
      return (
        <div className={`callout callout-${v} ${v}`}>
          <strong className="callout-label">{label} —</strong>{' '}
          <span dangerouslySetInnerHTML={{__html: b.html}}/>
        </div>
      );
    }
    case 'checkpoint':
      return <Checkpoint q={b.q} a={b.a} />;
    case 'table':
      return <div className="lesson-table" dangerouslySetInnerHTML={{__html: b.html}}/>;
    case 'mermaid':
      return <MermaidDiagram source={b.source}/>;
    case 'diagram':
      return (
        <div className="diagram">
          {b.title && <div className="diagram-title">{b.title}</div>}
          <div className="diagram-svg" dangerouslySetInnerHTML={{__html: b.svg}}/>
          {b.legend && <div className="d-legend" dangerouslySetInnerHTML={{__html: b.legend}}/>}
        </div>
      );
    case 'html':
    default:
      return <div className="lesson-html" dangerouslySetInnerHTML={{__html: b.html || ''}}/>;
  }
};

const Lessons = ({ courseId }) => {
  const course = window.COURSES.find(c => c.id === courseId) || window.COURSES[0];
  const lessons = (window.LESSONS || {})[courseId] || [];
  const [idx, setIdx] = React.useState(0);
  const [done, setDone] = React.useState(() => new Set());
  const L = lessons[idx];

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [idx]);

  if (!L) return (
    <div className="page">
      <div className="eyebrow">{course.code} · lessons</div>
      <h1 className="h1">No lessons for this course yet</h1>
      <p className="sub">Add .md files to <code className="ds-code-inline">content/{courseId}/lessons/</code> and re-run <code className="ds-code-inline">npm run build-content</code>.</p>
    </div>
  );

  const num = String(L.n).padStart(2, '0');

  return (
    <div className="page">
      <div className="eyebrow">{course.code} · lessons · read top to bottom</div>
      <h1 className="h1">Lessons</h1>
      <p className="sub">Long-form walk-throughs. Each one ends with a checkpoint you can self-grade.</p>

      <div className="lesson-nav">
        {lessons.map((l, i) => (
          <button key={l.id} className={`${i === idx ? 'active' : ''} ${done.has(i) ? 'done' : ''}`} onClick={() => setIdx(i)}>
            {String(l.n).padStart(2, '0')} · {l.title}
          </button>
        ))}
      </div>

      <div className="lesson">
        <div className="lesson-head">
          <div className="lesson-num">Lesson {num}{L.module ? ` · ${L.module}` : ''}</div>
          <div className="lesson-title">{L.title}</div>
          {L.hook && <div className="hook">{L.hook}</div>}
        </div>
        {(L.blocks || []).map((b, i) => <LessonBlock key={i} b={b}/>)}
        <div style={{display:'flex', justifyContent:'space-between', marginTop:24, paddingTop:16, borderTop:'1px solid var(--border)'}}>
          <button className="reveal-btn" onClick={() => setIdx(Math.max(0, idx-1))} disabled={idx === 0}>← Previous</button>
          <button className="reveal-btn" onClick={() => { setDone(d => new Set([...d, idx])); setIdx(Math.min(lessons.length-1, idx+1)); }} disabled={idx === lessons.length - 1}>Mark done · next →</button>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
