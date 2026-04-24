// Hash-based router — keeps window.location.hash in sync with React route state.
// URL shapes:
//   #/                         → { name: 'dashboard' }
//   #/c/4736                   → { name: 'course', courseId: '4736' }
//   #/c/4736/<subview>         → { name: subview, courseId: '4736' }
//     subview ∈ { lessons, mock, practice, cheat, flash }
//     (cheat is hidden in-app when the course's cheatsheet_allowed is false,
//      but the route still exists; the component handles the empty state.)
//   #/t/<topic-id>             → { name: 'topic', topicId, courseId (derived) }
//   #/replay                   → { name: 'replay' }

const SUBVIEWS = new Set(['lessons', 'mock', 'practice', 'cheat', 'flash']);

export function parseHash(hash) {
  const h = (hash || '').replace(/^#/, '').replace(/^\/+/, '');
  if (!h) return { name: 'dashboard' };

  const parts = h.split('/').filter(Boolean);

  if (parts[0] === 'c' && parts[1]) {
    const courseId = parts[1];
    if (!parts[2]) return { name: 'course', courseId };
    if (SUBVIEWS.has(parts[2])) return { name: parts[2], courseId };
    return { name: 'course', courseId };
  }

  if (parts[0] === 't' && parts[1]) {
    const topicId = parts[1];
    const t = (window.ALL_TOPICS || []).find(x => x.id === topicId);
    return { name: 'topic', topicId, courseId: t ? t.courseId : undefined };
  }

  if (parts[0] === 'replay') return { name: 'replay' };
  if (parts[0] === 'dashboard') return { name: 'dashboard' };

  return { name: 'dashboard' };
}

export function serializeRoute(r) {
  if (!r || r.name === 'dashboard') return '#/';
  if (r.name === 'course' && r.courseId) return `#/c/${r.courseId}`;
  if (SUBVIEWS.has(r.name) && r.courseId) return `#/c/${r.courseId}/${r.name}`;
  if (r.name === 'topic' && r.topicId) return `#/t/${r.topicId}`;
  if (r.name === 'replay') return `#/replay`;
  return '#/';
}

export function routesEqual(a, b) {
  return a && b && a.name === b.name && a.courseId === b.courseId && a.topicId === b.topicId;
}

const SGRouter = { parseHash, serializeRoute, routesEqual };
window.SGRouter = SGRouter;
export default SGRouter;
