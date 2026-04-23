// Flash Cards — runs all course topics sequentially in one session.
import React from 'react';
import SG from '../state.js';
import RecallCard from './RecallCard.jsx';

const FlashCards = ({ courseId, onRate, onJumpTopic, onBack, active }) => {
  const course = window.COURSES.find(c => c.id === courseId);
  const allTopics = course ? course.modules.flatMap(m => m.topics) : [];

  const [topicIdx, setTopicIdx] = React.useState(0);
  const [done, setDone] = React.useState(false);

  if (!course || allTopics.length === 0) {
    return (
      <div className="page">
        <div className="eyebrow">Flash Cards</div>
        <h1 className="h1">No topics found</h1>
        <button className="reveal-btn" onClick={onBack}>← Back</button>
      </div>
    );
  }

  if (done) {
    const conf = SG.loadConf();
    const mastered = allTopics.filter(t => (conf[t.id] || 0) >= 4).length;
    return (
      <div className="page">
        <div className="eyebrow">{course.code} · Flash Cards</div>
        <h1 className="h1">Session complete</h1>
        <p className="sub">Reviewed all {allTopics.length} topics · {mastered}/{allTopics.length} mastered (L≥4)</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="reveal-btn" onClick={() => { setTopicIdx(0); setDone(false); }}>Restart</button>
          <button className="reveal-btn" onClick={onBack}>← Back to course</button>
        </div>
      </div>
    );
  }

  const topic = allTopics[topicIdx];

  return (
    <RecallCard
      key={topic.id}
      topic={topic}
      onRate={onRate}
      onNext={() => {
        if (topicIdx < allTopics.length - 1) setTopicIdx(i => i + 1);
        else setDone(true);
      }}
      onPrev={() => {
        if (topicIdx > 0) setTopicIdx(i => i - 1);
      }}
      idxInQueue={topicIdx}
      queueLen={allTopics.length}
      onJumpTopic={onJumpTopic}
      active={active}
    />
  );
};

export default FlashCards;
