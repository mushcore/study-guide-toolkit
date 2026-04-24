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

// Per-course default language for inline <code> chips inside HTML-injected trees.
// When the surrounding tree carries a `data-course-id`, inline code is force-highlighted
// using this language instead of `highlightAuto`. Keeps colors coherent in code-heavy
// courses where hljs auto-detection is unreliable on short fragments.
const COURSE_INLINE_LANG = {
  '4870': 'csharp',
};

// Gate forced-language highlighting on chips that clearly look like code.
// Without this, csharp's contextual keywords (e.g. `file`) bleed into filenames
// and path-like tokens where they shouldn't.
function looksLikeCode(s) {
  if (!s) return false;
  if (/[()\[\]{};=<>@]/.test(s)) return true;      // code punctuation
  if (/^[A-Z][a-zA-Z0-9]/.test(s)) return true;    // PascalCase identifier / type
  if (/^["']/.test(s)) return true;                // string/char literal
  if (/^#[:!]/.test(s)) return true;               // directive prefix (#:, #!)
  return false;
}

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

// Post-mount pass: find every <pre><code class="language-*"> inside the
// referenced subtree and run highlight.js on it. Use after
// `dangerouslySetInnerHTML` so marked-produced code blocks get highlighted.
export function useHljsInside(ref, deps = []) {
  React.useLayoutEffect(() => {
    if (!ref.current || !window.hljs) return;
    const blocks = ref.current.querySelectorAll('pre > code');
    blocks.forEach(el => {
      if (el.dataset.hljs === 'done') return;
      const m = el.className.match(/language-([^\s]+)/);
      const langRaw = m ? m[1].toLowerCase() : '';
      const mapped = LANG_MAP[langRaw] || langRaw;
      const text = el.textContent || '';
      try {
        let res;
        if (mapped && !AUTO_LANGS.has(mapped) && window.hljs.getLanguage(mapped)) {
          res = window.hljs.highlight(text, { language: mapped, ignoreIllegals: true });
        } else {
          res = window.hljs.highlightAuto(text);
        }
        el.innerHTML = res.value;
        el.classList.add('hljs');
        el.dataset.hljs = 'done';
        // Give the wrapping <pre> the same visual treatment as hand-authored code blocks.
        const pre = el.parentElement;
        if (pre && pre.tagName === 'PRE') pre.classList.add('code', 'hl-block');
      } catch { /* swallow */ }
    });
    // Inline <code> (not inside <pre>) — highlight so syntax tokens stand out per chip.
    // Per-course default language is picked up from the nearest `data-course-id` ancestor.
    const courseHost = ref.current.closest('[data-course-id]');
    const courseId = courseHost ? courseHost.dataset.courseId : '';
    const courseLang = COURSE_INLINE_LANG[courseId] || '';
    const inlines = ref.current.querySelectorAll('code');
    inlines.forEach(el => {
      if (el.dataset.hljs === 'done') return;
      if (el.parentElement && el.parentElement.tagName === 'PRE') return;
      const text = el.textContent || '';
      try {
        if (courseLang && window.hljs.getLanguage(courseLang) && looksLikeCode(text)) {
          const res = window.hljs.highlight(text, { language: courseLang, ignoreIllegals: true });
          el.innerHTML = res.value;
        }
        // Non-code-looking chips (filenames, plain words) stay as-is; CSS gives them the chip frame.
        el.classList.add('hljs', 'ds-code-inline');
        el.dataset.hljs = 'done';
      } catch { /* swallow */ }
    });
  }, deps);
}

// Drop-in replacement for `<div dangerouslySetInnerHTML={{__html: html}}/>`
// that also post-highlights any embedded <pre><code> blocks.
export const HtmlWithCode = ({ html, as: Tag = 'div', className, style }) => {
  const ref = React.useRef(null);
  useHljsInside(ref, [html]);
  return <Tag ref={ref} className={className} style={style} dangerouslySetInnerHTML={{__html: html || ''}}/>;
};

export default Highlighted;
