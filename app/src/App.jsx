import React from 'react';
import SG from './state.js';
import SGRouter from './router.js';
import Palette from './components/Palette.jsx';
import Dashboard from './components/Dashboard.jsx';
import CourseView from './components/CourseView.jsx';
import RecallCard from './components/RecallCard.jsx';
import CheatSheet from './components/CheatSheet.jsx';
import { Tweaks, ShortcutOverlay } from './components/Overlays.jsx';
import Priorities from './components/Priorities.jsx';
import Lessons from './components/Lessons.jsx';
import TopicDives from './components/TopicDives.jsx';
import MockExam from './components/MockExam.jsx';
import QuizReplay from './components/QuizReplay.jsx';
import CodeApplied from './components/CodeApplied.jsx';
import CodeAnnotation from './components/CodeAnnotation.jsx';
import FlashCards from './components/FlashCards.jsx';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "defaultRecall": "auto",
  "motion": "on",
  "showRationale": true
}/*EDITMODE-END*/;

// Error boundary — catches render errors in any route and offers a way home.
class RouteErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error('[RouteErrorBoundary]', err, info); }
  componentDidUpdate(prev) { if (prev.routeKey !== this.props.routeKey && this.state.err) this.setState({ err: null }); }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="page">
        <div className="eyebrow">error</div>
        <h1 className="h1">Something broke in this view</h1>
        <p className="sub">{String(this.state.err.message || this.state.err)}</p>
        <button className="reveal-btn" onClick={() => { window.location.hash = '#/'; }}>← Back to dashboard</button>
      </div>
    );
  }
}

const App = () => {
  const [route, setRouteState] = React.useState(() => {
    const fromHash = SGRouter.parseHash(window.location.hash);
    if (fromHash.name !== 'dashboard') return fromHash;
    try { return JSON.parse(localStorage.getItem('sgv2:route') || '{"name":"dashboard"}'); }
    catch { return { name: 'dashboard' }; }
  });

  const setRoute = React.useCallback((next) => {
    setRouteState(prev => {
      if (SGRouter.routesEqual(prev, next)) return prev;
      const hash = SGRouter.serializeRoute(next);
      if (window.location.hash !== hash) window.history.pushState(next, '', hash);
      return next;
    });
  }, []);

  React.useEffect(() => {
    const initHash = SGRouter.serializeRoute(route);
    if (window.location.hash !== initHash) {
      window.history.replaceState(route, '', initHash);
    }
    const onPop = () => {
      const next = SGRouter.parseHash(window.location.hash);
      setRouteState(next);
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => { localStorage.setItem('sgv2:route', JSON.stringify(route)); }, [route]);

  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [shortcutOpen, setShortcutOpen] = React.useState(false);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [, force] = React.useReducer(x => x + 1, 0);

  const [settings, setSettings] = React.useState(() => ({
    ...TWEAK_DEFAULTS,
    ...SG.loadTweak(),
  }));
  React.useEffect(() => {
    document.documentElement.setAttribute('data-density', settings.density);
    document.documentElement.setAttribute('data-motion', settings.motion === 'reduce' ? 'reduce' : 'on');
    SG.saveTweak(settings);
  }, [settings]);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') { setEditMode(true); setTweaksOpen(true); }
      if (e.data.type === '__deactivate_edit_mode') { setEditMode(false); setTweaksOpen(false); }
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const updateTweaks = (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  React.useEffect(() => {
    const gbuf = { k: '', t: 0 };
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault(); setPaletteOpen(true);
      } else if (e.key === '?') {
        setShortcutOpen(true);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false); setShortcutOpen(false);
      } else if (e.key === 'g') {
        gbuf.k = 'g'; gbuf.t = Date.now();
      } else if (gbuf.k === 'g' && Date.now() - gbuf.t < 1200) {
        if (e.key === 'g') setRoute({ name: 'dashboard' });
        if (e.key === 'c') setPaletteOpen(true);
        gbuf.k = '';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen]);

  const jumpCourse = (id) => setRoute({ name: 'course', courseId: id });
  const jumpTopic = (t) => {
    SG.saveLast({ topicId: t.id, courseId: t.courseId, at: Date.now() });
    setRoute({ name: 'topic', topicId: t.id, courseId: t.courseId });
  };
  const rate = (topicId, r) => { SG.rate(topicId, r); force(); };

  const handleJump = (action) => {
    if (action.kind === 'course') jumpCourse(action.id);
    if (action.kind === 'dash') setRoute({ name: 'dashboard' });
    if (action.kind === 'topic') {
      const t = window.ALL_TOPICS.find(x => x.id === action.id);
      if (t) jumpTopic(t);
    }
    if (action.kind === 'cheat') {
      const cid = route.courseId || '4736';
      setRoute({ name: 'cheat', courseId: cid });
    }
    if (action.kind === 'shortcuts') setShortcutOpen(true);
    if (action.kind === 'view') setRoute({ name: action.view, courseId: action.courseId || route.courseId || '4736' });
  };

  const topic = route.name === 'topic' ? window.ALL_TOPICS.find(t => t.id === route.topicId) : null;
  const courseForCrumbs = route.courseId ? window.COURSES.find(c => c.id === route.courseId) : null;

  return (
    <>
      <div className="topbar">
        <span className="crumbs">
          <span style={{cursor:'pointer'}} onClick={() => setRoute({name:'dashboard'})}>dashboard</span>
          {courseForCrumbs && <><span>/</span><span style={{cursor:'pointer'}} onClick={() => jumpCourse(courseForCrumbs.id)}>{courseForCrumbs.code}</span></>}
          {topic && <><span>/</span><span className="cur">{topic.name}</span></>}
          {route.name === 'cheat' && <><span>/</span><span className="cur">cheat sheet</span></>}
        </span>
        <img src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Fmushcore.github.io%2Fstudy-guides%2F%23%2F&label=&icon=github&color=%23121212&message=&style=for-the-badge&tz=UTC">
        </img>
      </div>

      <RouteErrorBoundary routeKey={`${route.name}|${route.courseId||''}|${route.topicId||''}`}>
        {route.name === 'dashboard' && (
          <Dashboard
            onJumpCourse={jumpCourse}
            onJumpTopic={jumpTopic}
          />
        )}

        {route.name === 'course' && <CourseView courseId={route.courseId} onJumpTopic={jumpTopic} onJumpRoute={setRoute}/>}
        {route.name === 'priorities' && <Priorities courseId={route.courseId} onJumpTopic={jumpTopic}/>}
        {route.name === 'lessons' && <Lessons courseId={route.courseId}/>}
        {route.name === 'dives' && <TopicDives courseId={route.courseId} onJumpTopic={jumpTopic}/>}
        {route.name === 'mock' && <MockExam courseId={route.courseId}/>}
        {route.name === 'replay' && <QuizReplay onJumpTopic={jumpTopic}/>}
        {route.name === 'code' && (route.courseId === '4911' ? <CodeAnnotation courseId={route.courseId}/> : <CodeApplied courseId={route.courseId}/>)}
        {route.name === 'topic' && topic && (
          <RecallCard
            topic={topic}
            onRate={rate}
            onNext={() => {
              const cid = route.courseId || topic.courseId;
              if (cid) setRoute({ name: 'course', courseId: cid });
              else setRoute({ name: 'dashboard' });
            }}
            onPrev={() => {
              const cid = route.courseId || topic.courseId;
              if (cid) setRoute({ name: 'course', courseId: cid });
              else setRoute({ name: 'dashboard' });
            }}
            idxInQueue={0}
            queueLen={topic.cards.length}
            onJumpTopic={jumpTopic}
            active={!paletteOpen && !shortcutOpen && !tweaksOpen}
          />
        )}
        {route.name === 'topic' && !topic && (
          <div className="page">
            <div className="eyebrow">404</div>
            <h1 className="h1">Topic not found</h1>
            <p className="sub">No topic with id <code className="ds-code-inline">{route.topicId}</code>.</p>
            <button className="reveal-btn" onClick={() => setRoute({name:'dashboard'})}>← Back to dashboard</button>
          </div>
        )}
        {route.name === 'cheat' && <CheatSheet courseId={route.courseId}/>}
        {route.name === 'flash' && (
          <FlashCards
            courseId={route.courseId}
            onRate={rate}
            onJumpTopic={jumpTopic}
            onBack={() => setRoute({ name: 'course', courseId: route.courseId })}
            active={!paletteOpen && !shortcutOpen && !tweaksOpen}
          />
        )}
      </RouteErrorBoundary>

      <ShortcutOverlay open={shortcutOpen} onClose={() => setShortcutOpen(false)}/>
      <Tweaks open={tweaksOpen} settings={settings} onChange={updateTweaks} onClose={() => setTweaksOpen(false)}/>
    </>
  );
};

export default App;
