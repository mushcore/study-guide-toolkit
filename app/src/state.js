// Confidence + scheduling + palette utilities — all localStorage-backed.

const LS_CONF = 'sgv2:conf';
const LS_LAST = 'sgv2:last';
const LS_HIST = 'sgv2:hist';
const LS_TWEAK = 'sgv2:tweak';

export const SG = {};

SG.loadConf = () => { try { return JSON.parse(localStorage.getItem(LS_CONF) || '{}'); } catch { return {}; } };
SG.saveConf = (c) => localStorage.setItem(LS_CONF, JSON.stringify(c));
SG.rate = (topicId, rating) => {
  const c = SG.loadConf(); c[topicId] = rating; SG.saveConf(c);
  const h = SG.loadHist(); h.push({ topicId, at: Date.now(), rating }); SG.saveHist(h);
};

SG.loadLast = () => { try { return JSON.parse(localStorage.getItem(LS_LAST) || 'null'); } catch { return null; } };
SG.saveLast = (v) => localStorage.setItem(LS_LAST, JSON.stringify(v));

SG.loadHist = () => { try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch { return []; } };
SG.saveHist = (h) => localStorage.setItem(LS_HIST, JSON.stringify(h));

SG.loadTweak = () => { try { return JSON.parse(localStorage.getItem(LS_TWEAK) || '{}'); } catch { return {}; } };
SG.saveTweak = (t) => localStorage.setItem(LS_TWEAK, JSON.stringify(t));

SG.INTERVALS = [0, 1, 3, 7, 14];
SG.level = (rating) => rating || 0;
SG.heatClass = (rating) => rating ? `hm-l${rating}` : 'hm-l0';

SG.isDue = (topic) => {
  const conf = SG.loadConf()[topic.id];
  if (!conf) return true;
  const hist = SG.loadHist().filter(h => h.topicId === topic.id);
  if (!hist.length) return true;
  const last = hist[hist.length - 1];
  const intervalMs = SG.INTERVALS[Math.min(conf, 5) - 1] * 86400000;
  if (conf < 3) return true;
  return (Date.now() - last.at) >= intervalMs;
};

SG.courseDueCount = (course) => {
  let n = 0;
  course.modules.forEach(m => m.topics.forEach(t => { if (SG.isDue(t)) n++; }));
  return n;
};

SG.courseWeakest = (course) => {
  const conf = SG.loadConf();
  let worst = null;
  course.modules.forEach(m => m.topics.forEach(t => {
    const r = conf[t.id] || 0;
    if (worst === null || r < (conf[worst.id] || 0)) worst = t;
  }));
  return worst;
};

SG.examState = (course) => {
  const diff = new Date(course.exam).getTime() - Date.now();
  const h = diff / 3600000;
  if (h < 0) return { state: 'past', diff, label: '—' };
  if (h < 24) return { state: 'imminent', diff, label: `${Math.floor(h)}h` };
  if (h < 72) return { state: 'soon', diff, label: `${Math.floor(h/24)}d ${Math.floor(h%24)}h` };
  return { state: 'ok', diff, label: `${Math.floor(h/24)}d` };
};

SG.buildActions = () => {
  const courses = window.COURSES;
  const out = [];
  courses.forEach(c => {
    out.push({ kind: 'course', group: 'Courses', id: c.id, label: `${c.code} — ${c.name}`, meta: SG.examState(c).label + ' to exam' });
  });
  out.push({ kind: 'dash', group: 'Jump', id: 'dashboard', label: 'Dashboard', meta: 'home' });
  out.push({ kind: 'view', group: 'Views', view: 'lessons',  id: 'view-lessons',  label: 'Lessons · read top to bottom', meta: 'long-form' });
  out.push({ kind: 'view', group: 'Views', view: 'mock',     id: 'view-mock',     label: 'Mock exam · timed', meta: 'MCQ' });
  out.push({ kind: 'view', group: 'Views', view: 'practice', id: 'view-practice', label: 'Practice · code + applied', meta: 'starter+sol / problem+walkthrough' });
  out.push({ kind: 'view', group: 'Views', view: 'flash',    id: 'view-flash',    label: 'Flash cards · sequential deck', meta: 'all topics' });
  out.push({ kind: 'cheat',     group: 'Views', id: 'cheat',     label: 'Exam-eve cheat sheet', meta: 'print (conditional)' });
  out.push({ kind: 'replay',    group: 'Views', id: 'replay',    label: 'Quiz replay · history', meta: 'explain' });
  out.push({ kind: 'shortcuts', group: 'Jump',  id: 'shortcuts', label: 'Keyboard shortcuts…',   meta: '?' });
  window.ALL_TOPICS.forEach(t => {
    out.push({ kind: 'topic', group: 'Topics', id: t.id, courseId: t.courseId, label: t.name, meta: `${t.courseCode} · ${t.module}` });
  });
  return out;
};

SG.fuzzy = (q, s) => {
  q = q.toLowerCase(); s = s.toLowerCase();
  if (!q) return { score: 0, highlighted: null };
  let i = 0, j = 0, score = 0, streak = 0, hi = '';
  while (i < q.length && j < s.length) {
    if (q[i] === s[j]) { hi += `<em>${s[j]}</em>`; i++; streak++; score += 1 + streak; }
    else { hi += s[j]; streak = 0; }
    j++;
  }
  hi += s.slice(j);
  if (i < q.length) return null;
  return { score, highlighted: hi };
};

SG.renderCloze = (text) => text.replace(/\{\{(.+?)\}\}/g, (_, g) => `<span class="cloze">${g}</span>`);

window.SG = SG;

export default SG;
