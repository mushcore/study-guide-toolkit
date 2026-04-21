// Recall — cloze / predict / name / diagram.
import React from 'react';
import SG from '../state.js';
import { Highlighted } from './Highlighted.jsx';
import { Markdown } from './Markdown.jsx';

const RecallCard = ({ topic, onRate, onNext, onPrev, idxInQueue, queueLen, onJumpTopic, active = true }) => {
  const [cardIdx, setCardIdx] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const card = topic.cards[cardIdx];

  React.useEffect(() => { setCardIdx(0); setRevealed(false); }, [topic.id]);

  const nextCard = () => {
    if (cardIdx < topic.cards.length - 1) { setCardIdx(cardIdx + 1); setRevealed(false); }
    else onNext();
  };
  const prevCard = () => {
    if (cardIdx > 0) { setCardIdx(cardIdx - 1); setRevealed(false); }
    else onPrev();
  };

  const rate = (n) => { onRate(topic.id, n); nextCard(); };

  React.useEffect(() => {
    if (!active) return;
    const h = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === ' ') { e.preventDefault(); setRevealed(r => !r); }
      if (e.key === 'j') prevCard();
      if (e.key === 'k') nextCard();
      if (['1','2','3','4','5'].includes(e.key)) rate(parseInt(e.key));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const modeLabel = {
    cloze: 'Cloze deletion',
    predict: 'Predict the output',
    name: 'Name this concept',
    diagram: 'Label the diagram',
  }[card.type] || 'Recall';

  const siblings = window.ALL_TOPICS.filter(t => t.courseId === topic.courseId && t.module === topic.module);

  return (
    <div className="page">
      <div className="eyebrow">{topic.courseCode || ''} · {topic.module} · card {cardIdx+1}/{topic.cards.length}</div>
      <h1 className="h1">{topic.name}</h1>
      <p className="sub">{topic.prose}</p>

      <div className="recall-wrap">
        <div className={`recall-card${revealed ? ' revealed' : ''}`}>
          <div className="mode-label">{modeLabel}</div>
          <div className="topic-label">{topic.tags.map(t => `#${t}`).join(' · ')}</div>

          {card.type === 'cloze' && (
            <div className="prompt"><Markdown text={card.prompt} /></div>
          )}
          {card.type === 'name' && (
            <div className="prompt">
              <Markdown text={card.prompt} />
              {revealed && (
                <div className="name-answer">
                  <Markdown text={card.answer} />
                </div>
              )}
            </div>
          )}
          {card.type === 'predict' && (
            <>
              <div className="prompt" style={{fontSize:'var(--fs-14)', marginBottom:10}}>Predict the output of this {card.lang}:</div>
              <Highlighted code={card.code} lang={card.lang} className="code hl-block"/>
              {revealed && (
                <div className="answer">
                  <span className="answer-label">answer</span>
                  <Markdown text={card.answer} />
                </div>
              )}
            </>
          )}
          {card.type === 'diagram' && (
            <>
              <div className="prompt" style={{fontSize:'var(--fs-14)', marginBottom:10}}><Markdown text={card.prompt} /></div>
              <div className="mermaid-frame">
                {renderDiagram(card.mermaid, card.labels, revealed)}
              </div>
              {revealed && (
                <div className="answer">
                  <span className="answer-label">answer</span>
                  <Markdown text={card.answer} />
                </div>
              )}
            </>
          )}

          {!revealed && (
            <button className="reveal-btn" onClick={() => setRevealed(true)}>Reveal ↵ space</button>
          )}

          {revealed && (card.explanation || card.example) && (
            <details className="card-detail">
              <summary>More detail</summary>
              <div className="card-detail-body">
                {card.explanation && (
                  <div className="card-detail-section">
                    <div className="card-detail-label">Explanation</div>
                    <div className="card-detail-content"><Markdown text={card.explanation} /></div>
                  </div>
                )}
                {card.example && (
                  <div className="card-detail-section">
                    <div className="card-detail-label">Example</div>
                    <div className="card-detail-content"><Markdown text={card.example} /></div>
                  </div>
                )}
              </div>
            </details>
          )}

          {revealed && (card.bloom || card.source) && (
            <div className="card-meta">
              {card.bloom && (
                <span className="bloom-chip" data-bloom={card.bloom} title={`Bloom's level: ${card.bloom}`}>
                  {card.bloom}
                </span>
              )}
              {card.source && <span className="source-tag">{card.source}</span>}
            </div>
          )}

          {revealed && (
            <div className="rate-row">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`rate-btn r${n}`} onClick={() => rate(n)}>
                  <span className="num">{n}</span>
                  <span className="lbl">{['again','hard','ok','good','easy'][n-1]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="recall-rail">
          <div className="rail-block">
            <h4>Module · {topic.module}</h4>
            {siblings.map(s => (
              <div key={s.id} className={`rail-queue-item${s.id === topic.id ? ' current' : ''}`} onClick={() => s.id !== topic.id && onJumpTopic(s)}>
                <span className="name">{s.name}</span>
                <span className="b">L{SG.loadConf()[s.id] || '—'}</span>
              </div>
            ))}
          </div>
          <div className="rail-block">
            <h4>Keybinds</h4>
            <div className="kb-list">
              <div className="kb"><span>Reveal</span><kbd>space</kbd></div>
              <div className="kb"><span>Rate</span><kbd>1-5</kbd></div>
              <div className="kb"><span>Next / prev</span><kbd>j · k</kbd></div>
              <div className="kb"><span>Palette</span><kbd>⌘K</kbd></div>
            </div>
          </div>
          <div className="rail-block">
            <h4>Queue</h4>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'var(--fs-11)', color:'var(--text-dim)'}}>
              {idxInQueue + 1} / {queueLen} in session
              <div className="bar" style={{height:4, background:'var(--panel-3)', borderRadius:2, marginTop:8, overflow:'hidden'}}>
                <div style={{height:'100%', background:'var(--accent)', width: `${((idxInQueue+1)/queueLen)*100}%`}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function renderDiagram(src, labels, revealed) {
  const parts = src.split(/(\?\?\?[A-Z])/g);
  return parts.map((p, i) => {
    if (/^\?\?\?[A-Z]$/.test(p)) {
      return <span key={i} className="blank">{revealed ? (labels[p] || '?') : '____'}</span>;
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

export default RecallCard;
