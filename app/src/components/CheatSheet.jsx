// Cheat sheet — study-review dossier. Single column, dense but breathable.
// Content is markdown-rendered per section; this component adds the numbered
// section frame, a jump chip-row, and classifies "Must-know" / "Traps" / "TL;DR"
// blocks so CSS can give each its own visual tier.
import React from 'react';
import SG from '../state.js';
import { HtmlWithCode } from './Highlighted.jsx';

// Slugify a section heading so we can link to it.
function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// After-mount pass that tags common authorial patterns so CSS can style them:
//   <p><strong>Must-know</strong></p> + <ul>   →  cs-label-must + cs-list-must
//   <p><strong>Traps</strong></p>     + <ul>   →  cs-label-traps + cs-list-traps
//   <p><strong>TL;DR</strong> ...</p>          →  cs-tldr
// Also walks <li> to promote `<strong>Label</strong> · text` into a labelled row.
function useEnhanceCheatBody(ref, deps = []) {
  React.useLayoutEffect(() => {
    if (!ref.current) return;

    // 1. Label + list detection
    ref.current.querySelectorAll('p').forEach(p => {
      const first = p.firstElementChild;
      const only  = p.children.length === 1;
      const txt   = (p.textContent || '').trim();

      // TL;DR paragraph — lead text starts with a bold "TL;DR"
      if (first && first.tagName === 'STRONG' && first.textContent.trim().toUpperCase() === 'TL;DR') {
        p.classList.add('cs-tldr');
        return;
      }

      // Solo bolded label paragraph (e.g. "**Must-know**" on its own line)
      if (only && first && first.tagName === 'STRONG') {
        const label = first.textContent.trim().toLowerCase();
        const kind =
          /^must[- ]?know|essentials|highlights|key$/.test(label) ? 'must' :
          /^traps?|gotchas?|pitfalls?|watch out$/.test(label) ? 'traps' :
          null;

        // Find next element; tag if it's a ul/ol/table
        let next = p.nextElementSibling;
        while (next && next.tagName === 'BR') next = next.nextElementSibling;
        if (kind && next && (next.tagName === 'UL' || next.tagName === 'OL' || next.tagName === 'TABLE')) {
          p.classList.add('cs-label', `cs-label-${kind}`);
          next.classList.add('cs-list', `cs-list-${kind}`);
          p.dataset.csLabel = first.textContent.trim();
        } else if (!kind) {
          // A solo-bold paragraph followed by a list/table/code is a "sub-head"
          if (next && ['UL', 'OL', 'TABLE', 'PRE'].includes(next.tagName)) {
            p.classList.add('cs-sublabel');
          }
        }
      }
    });

    // 2. Li with leading <strong> becomes a label-row
    ref.current.querySelectorAll('li').forEach(li => {
      const first = li.firstChild;
      if (first && first.nodeType === 1 && first.tagName === 'STRONG') {
        li.classList.add('cs-li-labeled');
      }
    });
  }, deps);
}

const TocStrip = ({ items, activeId, onJump }) => (
  <nav className="cheat-toc" aria-label="Cheat-sheet sections">
    {items.map((it, i) => {
      const id = it.slug;
      const active = activeId === id;
      return (
        <button
          key={id}
          type="button"
          className={`cheat-toc-chip ${active ? 'is-active' : ''}`}
          onClick={() => onJump(id)}
          title={it.heading}
        >
          <span className="cheat-toc-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="cheat-toc-label">{it.shortHeading}</span>
        </button>
      );
    })}
  </nav>
);

const CheatSection = ({ index, heading, slug, body }) => {
  const ref = React.useRef(null);
  useEnhanceCheatBody(ref, [body]);

  return (
    <section id={slug} className="cheat-section" data-index={String(index + 1).padStart(2, '0')}>
      <header className="cheat-section-head">
        <div className="cheat-section-num" aria-hidden>
          <span className="cheat-section-num-digit">{String(index + 1).padStart(2, '0')}</span>
          <span className="cheat-section-num-tick">§</span>
        </div>
        <h2 className="cheat-section-title">{heading}</h2>
      </header>
      <div ref={ref} className="cs-body">
        <HtmlWithCode html={body}/>
      </div>
    </section>
  );
};

// Shorten a heading for the TOC chip (drop trailing after em-dash / comma list).
function shortTitle(h) {
  const s = String(h);
  // Split on em-dash first; fall back to comma
  const parts = s.split(/\s*[—–-]\s*/);
  let out = parts[0].trim();
  // If it's too long still, truncate
  if (out.length > 28) out = out.slice(0, 26).trim() + '…';
  return out;
}

const CheatSheet = ({ courseId }) => {
  const course = window.COURSES.find(c => c.id === courseId);
  const rawItems = (window.CHEAT_SHEETS || {})[courseId] || [];

  const items = React.useMemo(() => rawItems.map(it => ({
    heading: it.heading,
    shortHeading: shortTitle(it.heading),
    slug: slugify(it.heading),
    body: it.body,
  })), [rawItems]);

  const [activeId, setActiveId] = React.useState(items[0]?.slug || null);

  // IntersectionObserver to track the active section for the chip row
  React.useEffect(() => {
    if (!items.length) return;
    const nodes = items.map(it => document.getElementById(it.slug)).filter(Boolean);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(entries => {
      // Pick the topmost visible entry
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveId(visible[0].target.id);
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, [items]);

  const handleJump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  };

  // Fallback: auto-derived sheet from module topics (legacy path, rarely used).
  if (!items.length) {
    return (
      <div className="page" data-course-id={courseId}>
        <div className="cheat-hero">
          <div className="eyebrow">{course.code} · cheat sheet</div>
          <h1 className="h1">{course.name}</h1>
          <p className="sub">No cheat-sheet.md yet — showing a scaffold from flashcards.</p>
        </div>
        <div className="cheat">
          {course.modules.map((m, i) => (
            <section key={m.id} className="cheat-section" data-index={String(i + 1).padStart(2, '0')}>
              <header className="cheat-section-head">
                <div className="cheat-section-num" aria-hidden>
                  <span className="cheat-section-num-digit">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cheat-section-num-tick">§</span>
                </div>
                <h2 className="cheat-section-title">{m.name}</h2>
              </header>
              <div className="cs-body">
                <ul>
                  {m.topics.map(t => (
                    <li key={t.id} className="cs-li-labeled">
                      <strong>{t.name}</strong> — {t.prose}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  const total = items.length;

  return (
    <div className="page" data-course-id={courseId}>
      <div className="cheat-hero">
        <div className="cheat-hero-meta">
          <span className="cheat-hero-code">{course.code}</span>
          <span className="cheat-hero-sep">·</span>
          <span className="cheat-hero-kind">exam-eve review dossier</span>
        </div>
        <h1 className="cheat-hero-title">{course.name}</h1>
        <p className="cheat-hero-sub">
          Triage-ready review doc. Scan, decide, hand-copy the highest-leverage bits onto your 8.5&thinsp;×&thinsp;11 paper.
        </p>
        <div className="cheat-hero-stats">
          <div className="cheat-stat">
            <span className="cheat-stat-value">{total.toString().padStart(2, '0')}</span>
            <span className="cheat-stat-label">Sections</span>
          </div>
          <div className="cheat-stat">
            <span className="cheat-stat-value">80</span>
            <span className="cheat-stat-label">Marks</span>
          </div>
          <div className="cheat-stat">
            <span className="cheat-stat-value">60</span>
            <span className="cheat-stat-label">Minutes</span>
          </div>
        </div>
      </div>

      <TocStrip items={items} activeId={activeId} onJump={handleJump} />

      <div className="cheat">
        {items.map((it, i) => (
          <CheatSection key={it.slug} index={i} heading={it.heading} slug={it.slug} body={it.body}/>
        ))}
      </div>
    </div>
  );
};

export default CheatSheet;
