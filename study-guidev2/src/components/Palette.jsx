// Command palette — global jump. ⌘K / Ctrl-K / "/"
import React from 'react';
import SG from '../state.js';

const Palette = ({ open, onClose, onJump }) => {
  const [q, setQ] = React.useState('');
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQ(''); setIdx(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 10);
    }
  }, [open]);

  const actions = React.useMemo(() => SG.buildActions(), [open]);
  const filtered = React.useMemo(() => {
    if (!q) return actions;
    return actions
      .map(a => { const f = SG.fuzzy(q, a.label); return f ? { ...a, _f: f } : null; })
      .filter(Boolean)
      .sort((a, b) => b._f.score - a._f.score);
  }, [q, actions]);

  const grouped = React.useMemo(() => {
    const g = {};
    filtered.slice(0, 40).forEach(a => { (g[a.group] = g[a.group] || []).push(a); });
    return g;
  }, [filtered]);

  const flat = React.useMemo(() => Object.values(grouped).flat(), [grouped]);

  const handleKey = (e) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, flat.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') {
      const pick = flat[idx];
      if (pick) { onJump(pick); onClose(); }
    }
  };

  if (!open) return null;

  return (
    <div className="palette-scrim" onClick={onClose}>
      <div className="palette" onClick={e => e.stopPropagation()} onKeyDown={handleKey}>
        <div className="palette-input-row">
          <span className="glyph">›</span>
          <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setIdx(0); }} placeholder="Jump to a course, topic, or action…" />
          <span className="esc">esc</span>
        </div>
        {Object.keys(grouped).length === 0 && (
          <div className="palette-section" style={{ padding: 28, textAlign: 'center', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize:'var(--fs-11)' }}>
            no matches
          </div>
        )}
        {Object.keys(grouped).map(group => (
          <div key={group} className="palette-section">
            <div className="palette-section-head">{group}</div>
            {grouped[group].map((a) => {
              const myIdx = flat.indexOf(a);
              return (
                <div
                  key={group + a.id}
                  className={`palette-item${myIdx === idx ? ' active' : ''}`}
                  onMouseEnter={() => setIdx(myIdx)}
                  onClick={() => { onJump(a); onClose(); }}
                >
                  <span className="k">{a.kind}</span>
                  <span className="name" dangerouslySetInnerHTML={{ __html: a._f ? a._f.highlighted : a.label }} />
                  <span className="meta">{a.meta}</span>
                </div>
              );
            })}
          </div>
        ))}
        <div className="palette-foot">
          <span>↑↓ navigate · ↵ open</span>
          <span>⌘K / /</span>
        </div>
      </div>
    </div>
  );
};

export default Palette;
