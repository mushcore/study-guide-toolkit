// Quiz Replay — past quiz attempts.
import React from 'react';

const SEEDED_REPLAYS = [
  { at: Date.now() - 86400000*2, course: 'COMP 4736', set: 'Concurrency · mock', score: '7/10', gotWrong: ['deadlock-detection', 'deadlock-banker'] },
  { at: Date.now() - 86400000, course: 'COMP 4870', set: 'AI / MAF · quick check', score: '4/5', gotWrong: ['mcp-transports'] },
  { at: Date.now() - 3600000*6, course: 'COMP 4736', set: 'Memory · checkpoint', score: '2/3', gotWrong: ['pagefault'] },
  { at: Date.now() - 3600000*2, course: 'COMP 4915', set: 'Linux · quick check', score: '3/3', gotWrong: [] },
];

const QuizReplay = ({ onJumpTopic }) => {
  const [openIdx, setOpenIdx] = React.useState(0);

  return (
    <div className="page">
      <div className="eyebrow">history · quizzes + mocks · replay with explanations</div>
      <h1 className="h1">Quiz replay</h1>
      <p className="sub">Every past attempt with why-you-got-it-wrong. Click a wrong answer to jump into its topic.</p>

      <div className="two-col">
        <div className="panel-block">
          <div className="hdr">
            <h3>Sessions</h3>
            <span className="count-total">{SEEDED_REPLAYS.length} recent</span>
          </div>
          {SEEDED_REPLAYS.map((r, i) => {
            const ago = Math.round((Date.now() - r.at)/3600000);
            const hrs = ago < 24 ? `${ago}h ago` : `${Math.round(ago/24)}d ago`;
            return (
              <div key={i} className={`q-row${i === openIdx ? ' active' : ''}`} style={{gridTemplateColumns:'90px 1fr auto 60px'}} onClick={() => setOpenIdx(i)}>
                <span className="course-code">{r.course}</span>
                <span className="weakest"><span className="hl">{r.set}</span></span>
                <span className="due">{r.score}</span>
                <span className="go">{hrs}</span>
              </div>
            );
          })}
        </div>

        <div className="panel-block">
          <div className="hdr">
            <h3>Wrong answers</h3>
            <span className="count-total">drill these</span>
          </div>
          {SEEDED_REPLAYS[openIdx].gotWrong.length === 0 && (
            <div style={{fontFamily:'var(--font-mono)', fontSize:'var(--fs-12)', color:'var(--ok)'}}>Perfect score. Nothing to drill.</div>
          )}
          {SEEDED_REPLAYS[openIdx].gotWrong.map(tid => {
            const t = window.ALL_TOPICS.find(x => x.id === tid);
            if (!t) return null;
            return (
              <div key={tid} className="replay-wrong" onClick={() => onJumpTopic(t)}>
                <div className="rw-name">{t.name}</div>
                <div className="rw-why">{t.prose}</div>
                <div className="rw-go">drill →</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizReplay;
