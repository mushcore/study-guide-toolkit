// Practice — unified view over content/{id}/practice/*.md.
// Dispatches per item by `kind` + `variant`:
//   kind === 'code' + variant === 'starter-solution' → StarterSolutionBody
//   kind === 'code' + variant === 'annotation'       → AnnotationBody
//   kind === 'applied'                               → AppliedBody
//
// All items share a single tab nav at the top.
import React from 'react';
import { Highlighted } from './Highlighted.jsx';

// --- starter-solution renderer + supporting editable code widget ------------

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

const StarterSolutionBody = ({ item }) => {
  const [showSol, setShowSol] = React.useState(false);
  React.useEffect(() => { setShowSol(false); window.scrollTo({ top: 0, behavior: 'instant' }); }, [item.id]);
  return (
    <>
      {item.prompt_html && (
        <div className="panel-block" style={{marginBottom: 14}}>
          <div className="hdr">
            <h3>Prompt</h3>
            <span className="count-total">{item.lang}</span>
          </div>
          <div className="code-prompt" dangerouslySetInnerHTML={{__html: item.prompt_html}}/>
        </div>
      )}
      <div className="two-col" style={{gridTemplateColumns: '1fr 1fr'}}>
        <div className="panel-block">
          <div className="hdr">
            <h3>Starter · {item.lang}</h3>
            <span className="count-total">edit freely</span>
          </div>
          <EditableCode initial={item.starter} lang={item.lang} resetKey={item.id}/>
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
              <Highlighted code={item.solution} lang={item.lang} className="code hl-block" style={{minHeight:200}}/>
              {item.why_html && (
                <div className="answer" style={{marginTop:14, paddingTop:12, borderTop:'1px dashed var(--border)', fontSize:'var(--fs-13)', color:'var(--text-dim)'}}>
                  <strong style={{color:'var(--accent)', fontFamily:'var(--font-mono)', fontSize:'var(--fs-11)', letterSpacing:'0.1em', textTransform:'uppercase', display:'block', marginBottom:6}}>why</strong>
                  <div dangerouslySetInnerHTML={{__html: item.why_html}}/>
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
    </>
  );
};

// --- annotation renderer ----------------------------------------------------

const AnnotationBody = ({ item }) => {
  const [activePin, setActivePin] = React.useState(null);
  const [revealAll, setRevealAll] = React.useState(false);
  React.useEffect(() => { setActivePin(null); setRevealAll(false); }, [item.id]);

  const lines = (item.code || '').split('\n');
  const noteByLine = {};
  (item.notes || []).forEach((n, i) => { noteByLine[n.line] = { ...n, pinNum: i + 1 }; });

  return (
    <>
      <div className="panel-block" style={{ marginBottom: 14 }}>
        <div className="hdr">
          <h3>{item.title} · <span style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize:'var(--fs-11)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.lang}</span></h3>
          <button className="reveal-btn" style={{ padding: '4px 10px', fontSize:'var(--fs-10)' }} onClick={() => setRevealAll(v => !v)}>
            {revealAll ? 'collapse all' : 'reveal all'}
          </button>
        </div>

        <div className="annot-code hljs">
          {lines.map((ln, i) => {
            const lineNo = i + 1;
            const note = noteByLine[lineNo];
            const isActive = revealAll || activePin === lineNo;
            let html = ln || ' ';
            try {
              if (window.hljs && ln) {
                const langMap = { cs: 'csharp', proto: 'protobuf' };
                const L = langMap[item.lang] || item.lang || 'plaintext';
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
        {(item.notes || []).map((n, i) => {
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
    </>
  );
};

// --- applied renderer -------------------------------------------------------
// Reveals walkthrough + common-wrong on demand — applied problems earn more
// from attempt-then-reveal than code problems (no executable answer to verify).

const AppliedBody = ({ item }) => {
  const [showWalk, setShowWalk] = React.useState(false);
  const [showWrong, setShowWrong] = React.useState(false);
  React.useEffect(() => { setShowWalk(false); setShowWrong(false); window.scrollTo({ top: 0, behavior: 'instant' }); }, [item.id]);
  return (
    <>
      <div className="panel-block" style={{marginBottom: 14}}>
        <div className="hdr"><h3>Problem</h3></div>
        <div className="code-prompt" dangerouslySetInnerHTML={{__html: item.problem_html || ''}}/>
      </div>

      <div className="panel-block" style={{marginBottom: 14}}>
        <div className="hdr">
          <h3>Walkthrough</h3>
          <button className="reveal-btn" style={{padding:'4px 10px', fontSize:'var(--fs-10)'}} onClick={() => setShowWalk(v => !v)}>
            {showWalk ? 'hide' : 'reveal'}
          </button>
        </div>
        {showWalk
          ? <div dangerouslySetInnerHTML={{__html: item.walkthrough_html || ''}}/>
          : <div style={{minHeight:80, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-faint)', fontFamily:'var(--font-mono)', fontSize:'var(--fs-12)'}}>
              work it out first · reveal when stuck
            </div>}
      </div>

      <div className="panel-block" style={{marginBottom: 14}}>
        <div className="hdr">
          <h3>Common wrong approaches</h3>
          <button className="reveal-btn" style={{padding:'4px 10px', fontSize:'var(--fs-10)'}} onClick={() => setShowWrong(v => !v)}>
            {showWrong ? 'hide' : 'reveal'}
          </button>
        </div>
        {showWrong
          ? <div dangerouslySetInnerHTML={{__html: item.common_wrong_html || ''}}/>
          : <div style={{minHeight:60, color:'var(--text-faint)', fontFamily:'var(--font-mono)', fontSize:'var(--fs-12)', textAlign:'center', paddingTop:16}}>
              check your traps against this after attempting
            </div>}
      </div>

      {item.why_html && (
        <div className="panel-block">
          <div className="hdr"><h3>Why</h3></div>
          <div dangerouslySetInnerHTML={{__html: item.why_html}}/>
        </div>
      )}
    </>
  );
};

// --- outer -----------------------------------------------------------------

const Practice = ({ courseId }) => {
  const course = window.COURSES.find(c => c.id === courseId) || window.COURSES[0];

  if (course.practice_allowed === false) {
    return (
      <div className="page">
        <div className="eyebrow">{course.code} · practice unavailable</div>
        <h1 className="h1">Practice is not available for this course</h1>
        <p className="sub">Study from lessons + mock exam + flash cards instead.</p>
      </div>
    );
  }

  const items = (window.PRACTICE || {})[courseId] || [];
  const [idx, setIdx] = React.useState(0);
  const item = items[idx];

  if (!item) return (
    <div className="page">
      <div className="eyebrow">{course.code} · practice</div>
      <h1 className="h1">No practice items for this course yet</h1>
      <p className="sub">Add .md files to <code className="ds-code-inline">content/{courseId}/practice/</code> with <code className="ds-code-inline">kind: code | applied</code> frontmatter. Every practice item traces to a lab, assignment, or past-exam question.</p>
    </div>
  );

  const kindLabel = item.kind === 'applied'
    ? 'applied practice'
    : (item.variant === 'annotation' ? 'code · annotation' : 'code · starter + solution');

  return (
    <div className="page">
      <div className="eyebrow">{course.code} · {kindLabel}</div>
      <h1 className="h1">{item.title}</h1>
      <p className="sub">{items.length} total. Practice mirrors real exam questions — similar to but different from the labs / assignments.</p>

      <div className="lesson-nav">
        {items.map((p, i) => (
          <button key={p.id} className={i === idx ? 'active' : ''} onClick={() => setIdx(i)}>
            {String(i+1).padStart(2,'0')} · {p.title}
          </button>
        ))}
      </div>

      {item.kind === 'code' && (item.variant !== 'annotation') && <StarterSolutionBody item={item}/>}
      {item.kind === 'code' && item.variant === 'annotation'    && <AnnotationBody       item={item}/>}
      {item.kind === 'applied'                                    && <AppliedBody          item={item}/>}
    </div>
  );
};

export default Practice;
