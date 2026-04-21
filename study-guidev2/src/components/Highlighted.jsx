// Highlighted — thin wrapper around highlight.js.
import React from 'react';

const LANG_MAP = {
  cs: 'csharp', 'c#': 'csharp',
  js: 'javascript', ts: 'typescript',
  sh: 'bash',
  py: 'python',
  proto: 'protobuf',
};
const AUTO_LANGS = new Set(['', 'plaintext', 'text', 'txt', 'none']);

export const Highlighted = ({ code, lang, className = 'code', style, blockRef }) => {
  const ref = React.useRef(null);
  const normalized = (lang || '').toLowerCase();
  const mapped = LANG_MAP[normalized] || normalized;
  const resolved = AUTO_LANGS.has(mapped) ? null : mapped;

  React.useEffect(() => {
    if (!ref.current || !window.hljs) return;
    ref.current.removeAttribute('data-highlighted');
    try {
      let res;
      if (resolved && window.hljs.getLanguage(resolved)) {
        res = window.hljs.highlight(code || '', { language: resolved, ignoreIllegals: true });
      } else {
        res = window.hljs.highlightAuto(code || '');
      }
      ref.current.innerHTML = res.value;
    } catch (e) {
      ref.current.textContent = code || '';
    }
  }, [code, resolved]);

  return (
    <pre className={className} style={style} ref={blockRef}>
      <code ref={ref} className={`hljs language-${resolved || 'auto'}`}>{code}</code>
    </pre>
  );
};

export const HighlightedInline = ({ code, lang = 'plaintext' }) => {
  const ref = React.useRef(null);
  const resolved = LANG_MAP[lang] || lang;
  React.useEffect(() => {
    if (!ref.current || !window.hljs) return;
    try {
      const res = window.hljs.highlight(code || '', { language: resolved, ignoreIllegals: true });
      ref.current.innerHTML = res.value;
    } catch { ref.current.textContent = code || ''; }
  }, [code, resolved]);
  return <code ref={ref} className="hljs ds-code-inline" style={{ padding: '1px 5px' }}>{code}</code>;
};

export default Highlighted;
