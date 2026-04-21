// Code Annotation — line-numbered source with pinned callouts.
import React from 'react';

const CodeAnnotation = ({ courseId }) => {
  const course = window.COURSES.find(c => c.id === courseId) || window.COURSES[0];
  const problems = (window.CODE_ANNOTATIONS || {})[courseId] || [];
  const [idx, setIdx] = React.useState(0);
  const [activePin, setActivePin] = React.useState(null);
  const [revealAll, setRevealAll] = React.useState(false);
  const p = problems[idx];

  React.useEffect(() => { setActivePin(null); setRevealAll(false); }, [idx]);

  if (!p) return (
    <div className="page">
      <div className="eyebrow">{course.code} · code annotation</div>
      <h1 className="h1">No annotated snippets yet</h1>
      <p className="sub">Add entries to <code className="ds-code-inline">CODE_ANNOTATIONS['{courseId}']</code>.</p>
    </div>
  );

  const lines = p.code.split('\n');
  const noteByLine = {};
  p.notes.forEach((n, i) => { noteByLine[n.line] = { ...n, pinNum: i + 1 }; });

  return (
    <div className="page">
      <div className="eyebrow">{course.code} · code annotation</div>
      <h1 className="h1">Read the code · tap a pin for context</h1>
      <p className="sub">
        4911 doesn't test you on writing these from scratch — it tests whether you understand
        why each line is shaped the way it is. Click any numbered pin to reveal that line's note.
      </p>

      <div className="lesson-nav">
        {problems.map((pr, i) => (
          <button key={pr.id} className={i === idx ? 'active' : ''} onClick={() => setIdx(i)}>
            {String(i + 1).padStart(2, '0')} · {pr.title}
          </button>
        ))}
      </div>

      <div className="panel-block" style={{ marginBottom: 14 }}>
        <div className="hdr">
          <h3>{p.title} · <span style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize:'var(--fs-11)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.lang}</span></h3>
          <button className="reveal-btn" style={{ padding: '4px 10px', fontSize:'var(--fs-10)' }} onClick={() => setRevealAll(v => !v)}>
            {revealAll ? 'collapse all' : 'reveal all'}
          </button>
        </div>

        <div className="annot-code hljs">
          {lines.map((ln, i) => {
            const lineNo = i + 1;
            const note = noteByLine[lineNo];
            const isActive = revealAll || activePin === lineNo;
            let html = ln || '\u00a0';
            try {
              if (window.hljs && ln) {
                const langMap = { cs: 'csharp', proto: 'protobuf' };
                const L = langMap[p.lang] || p.lang || 'plaintext';
                html = window.hljs.highlight(ln, { language: L, ignoreIllegals: true }).value || html;
              }
            } catch {}
            return (
              <div key={i} className={`annot-row${note ? ' has-pin' : ''}${isActive ? ' active' : ''}`}>
                <span className="annot-gutter">{String(lineNo).padStart(2, ' ')}</span>
                <span className="annot-pin-cell">
                  {note && (
                    <button
                      className={`annot-pin${isActive ? ' on' : ''}`}
                      onClick={() => setActivePin(activePin === lineNo ? null : lineNo)}
                      title={`Note ${note.pinNum}`}
                    >
                      {note.pinNum}
                    </button>
                  )}
                </span>
                <span className="annot-src" dangerouslySetInnerHTML={{__html: html}}/>
              </div>
            );
          })}
        </div>
      </div>

      <div className="annot-notes">
        <div className="ds-section-title" style={{ marginBottom: 10 }}>Notes</div>
        {p.notes.map((n, i) => {
          const on = revealAll || activePin === n.line;
          return (
            <div
              key={i}
              className={`annot-note${on ? ' on' : ''}`}
              onClick={() => setActivePin(activePin === n.line ? null : n.line)}
            >
              <span className="annot-note-pin">{i + 1}</span>
              <div className="annot-note-body">
                <div className="annot-note-head">
                  <span className="annot-note-tag">{n.tag}</span>
                  <span className="annot-note-line">line {n.line}</span>
                </div>
                <div className="annot-note-text">{on ? n.text : <span style={{ color: 'var(--text-faint)' }}>tap to reveal</span>}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodeAnnotation;
