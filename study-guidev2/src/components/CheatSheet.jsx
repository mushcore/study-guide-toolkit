// Cheat sheet — printable.
import React from 'react';
import SG from '../state.js';

const CheatSheet = ({ courseId }) => {
  const course = window.COURSES.find(c => c.id === courseId);
  const items = (window.CHEAT_SHEETS || {})[courseId] || [];

  return (
    <div className="page">
      <div className="cheat-toolbar">
        <div>
          <div className="eyebrow">{course.code} · exam-eve cheat sheet</div>
          <h1 className="h1">{course.name}</h1>
          <p className="sub">Hand-copyable summary. Ctrl/⌘-P to print one sheet per course.</p>
        </div>
        <button className="reveal-btn" onClick={() => window.print()}>Print ⌘P</button>
      </div>
      <div className="cheat">
        {items.length > 0 ? items.map((it, i) => (
          <div key={i} className="cs-block">
            <h4>{it.heading}</h4>
            <div className="cs-body" dangerouslySetInnerHTML={{__html: it.body}}/>
          </div>
        )) : course.modules.map(m => (
          <div key={m.id} className="cs-block">
            <h4>{m.name}</h4>
            <ul>
              {m.topics.map(t => (
                <li key={t.id}>
                  <strong>{t.name}</strong> — {t.prose}
                  {t.cards.filter(c => c.type === 'cloze').slice(0,1).map((c,i) => (
                    <div key={i} style={{marginTop:2, color:'var(--text-faint)'}} dangerouslySetInnerHTML={{__html: SG.renderCloze(c.prompt).replace(/<span class="cloze">/g,'<span style="color:var(--accent);font-family:var(--font-mono)">').replace(/<\/span>/g,'</span>')}}/>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheatSheet;
