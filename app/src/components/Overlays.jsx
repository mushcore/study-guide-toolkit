// Tweaks panel + shortcut overlay
import React from 'react';

export const Tweaks = ({ open, settings, onChange, onClose }) => {
  if (!open) return null;
  return (
    <div className="tweaks-panel">
      <h5>Tweaks</h5>
      <div className="t-row">
        <div className="t-label">Density</div>
        <div className="seg">
          {['comfortable','compact'].map(v => (
            <button key={v} className={settings.density === v ? 'on' : ''} onClick={() => onChange({ density: v })}>{v}</button>
          ))}
        </div>
      </div>
      <div className="t-row">
        <div className="t-label">Default recall</div>
        <div className="seg">
          {['auto','cloze','predict','name'].map(v => (
            <button key={v} className={settings.defaultRecall === v ? 'on' : ''} onClick={() => onChange({ defaultRecall: v })}>{v}</button>
          ))}
        </div>
      </div>
      <div className="t-row">
        <div className="t-label">Motion</div>
        <div className="seg">
          {['on','reduce'].map(v => (
            <button key={v} className={settings.motion === v ? 'on' : ''} onClick={() => onChange({ motion: v })}>{v}</button>
          ))}
        </div>
      </div>
      <button className="reveal-btn" style={{marginTop:10, width:'100%', textAlign:'center', fontSize:'var(--fs-10)'}} onClick={onClose}>close</button>
    </div>
  );
};

export const ShortcutOverlay = ({ open, onClose }) => {
  if (!open) return null;
  const rows = [
    ['⌘K · /', 'Open command palette'],
    ['j · k', 'prev / next card'],
    ['1–5', 'Leitner rating (again → easy)'],
    ['space', 'Reveal answer'],
    ['?', 'Show this overlay'],
    ['g g', 'Jump to dashboard'],
    ['g c', 'Jump to course picker'],
    ['esc', 'Close any overlay'],
    ['p', 'Print cheat sheet'],
  ];
  return (
    <div className="shortcut-scrim" onClick={onClose}>
      <div className="shortcut-card" onClick={e => e.stopPropagation()}>
        <h3>Keyboard shortcuts</h3>
        <div className="shortcut-grid">
          {rows.map(([k,v]) => (
            <div key={k} className="kb">
              <span>{v}</span>
              <kbd>{k}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
