// Code / Applied — prompt + starter + solution + explanation.
import React from 'react';
import { Highlighted } from './Highlighted.jsx';

const EditableCode = ({ initial, lang, resetKey }) => {
  const [code, setCode] = React.useState(initial || '');
  const taRef = React.useRef(null);
  React.useEffect(() => { setCode(initial || ''); }, [resetKey]);
  React.useLayoutEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.max(200, ta.scrollHeight) + 'px';
  }, [code]);
  return (
    <div className="editable-code">
      <Highlighted code={code || ' '} lang={lang} className="code hl-block editable-code-pre"/>
      <textarea
        ref={taRef}
        value={code}
        onChange={e => setCode(e.target.value)}
        spellCheck={false}
        className="editable-code-ta"
      />
    </div>
  );
};

const CodeApplied = ({ courseId }) => {
  const course = window.COURSES.find(c => c.id === courseId) || window.COURSES[0];
  const problems = (window.CODE_PROBLEMS || {})[courseId] || [];
  const [idx, setIdx] = React.useState(0);
  const [showSol, setShowSol] = React.useState(false);
  const p = problems[idx];

  React.useEffect(() => { setShowSol(false); window.scrollTo({ top: 0, behavior: 'instant' }); }, [idx]);

  if (!p) return (
    <div className="page">
      <div className="eyebrow">{course.code} · code / applied</div>
      <h1 className="h1">No code problems for this course yet</h1>
      <p className="sub">Add .md files to <code className="ds-code-inline">content/{courseId}/code-practice/</code>.</p>
    </div>
  );

  return (
    <div className="page">
      <div className="eyebrow">{course.code} · code + applied</div>
      <h1 className="h1">Starter + solution</h1>
      <p className="sub">Practice problems with hidden solutions. Type along before revealing. {problems.length} total.</p>

      <div className="lesson-nav">
        {problems.map((pr, i) => (
          <button key={pr.id} className={i === idx ? 'active' : ''} onClick={() => setIdx(i)}>
            {String(i+1).padStart(2,'0')} · {pr.title}
          </button>
        ))}
      </div>

      {p.prompt && (
        <div className="panel-block" style={{marginBottom: 14}}>
          <div className="hdr">
            <h3>Prompt</h3>
            <span className="count-total">{p.lang}</span>
          </div>
          <div className="code-prompt" dangerouslySetInnerHTML={{__html: p.prompt}}/>
        </div>
      )}

      <div className="two-col" style={{gridTemplateColumns: '1fr 1fr'}}>
        <div className="panel-block">
          <div className="hdr">
            <h3>Starter · {p.lang}</h3>
            <span className="count-total">edit freely</span>
          </div>
          <EditableCode initial={p.starter} lang={p.lang} resetKey={p.id}/>
        </div>
        <div className="panel-block">
          <div className="hdr">
            <h3>Solution</h3>
            <button className="reveal-btn" style={{padding:'4px 10px', fontSize:'var(--fs-10)'}} onClick={() => setShowSol(s => !s)}>
              {showSol ? 'hide' : 'reveal'}
            </button>
          </div>
          {showSol ? (
            <>
              <Highlighted code={p.solution} lang={p.lang} className="code hl-block" style={{minHeight:200}}/>
              {p.why && (
                <div className="answer" style={{marginTop:14, paddingTop:12, borderTop:'1px dashed var(--border)', fontSize:'var(--fs-13)', color:'var(--text-dim)'}}>
                  <strong style={{color:'var(--accent)', fontFamily:'var(--font-mono)', fontSize:'var(--fs-11)', letterSpacing:'0.1em', textTransform:'uppercase', display:'block', marginBottom:6}}>why</strong>
                  <div dangerouslySetInnerHTML={{__html: p.why}}/>
                </div>
              )}
            </>
          ) : (
            <div style={{minHeight:200, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-faint)', fontFamily:'var(--font-mono)', fontSize:'var(--fs-12)'}}>
              try it first · reveal when stuck
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeApplied;
