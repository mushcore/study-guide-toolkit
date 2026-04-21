// Dashboard — exam countdowns
import React from 'react';
import SG from '../state.js';

const Dashboard = ({ onJumpCourse }) => {
  const courses = window.COURSES;
  const totalDue = courses.reduce((n, c) => n + SG.courseDueCount(c), 0);

  const examCards = courses
    .map(c => ({ c, s: SG.examState(c) }))
    .sort((a, b) => a.s.diff - b.s.diff);

  return (
    <div className="page">
      <div className="exam-rail">
        {examCards.map(({ c, s }) => (
          <div key={c.id} className={`exam-card ${s.state}`} onClick={() => onJumpCourse(c.id)}>
            {s.state === 'imminent' && <span className="pulse" />}
            <div className="code">{c.code}</div>
            <div className="name">{c.name}</div>
            <div className="count">{s.label}</div>
            <div className="when">{new Date(c.exam).toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' }).toUpperCase()} · {c.room}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
