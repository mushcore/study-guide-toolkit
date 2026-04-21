// Small inline markdown renderer for flash card prompts/answers.
// Supports: **bold**, *em*, `code`, ```lang blocks```, {{cloze}}, and
// backslash escapes (\_ \* \` \[ \] \\).
import React from 'react';

const LANG_MAP = {
  cs: 'csharp', 'c#': 'csharp',
  js: 'javascript', ts: 'typescript',
  sh: 'bash', py: 'python', proto: 'protobuf',
};

function tokenize(text) {
  const out = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];

    if (c === '\\' && i + 1 < n) {
      out.push({ t: 'text', v: text[i + 1] });
      i += 2;
      continue;
    }

    if (c === '{' && text[i + 1] === '{') {
      const end = text.indexOf('}}', i + 2);
      if (end > -1) {
        out.push({ t: 'cloze', v: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }

    if (c === '`') {
      if (text.startsWith('```', i)) {
        const end = text.indexOf('```', i + 3);
        if (end > -1) {
          const body = text.slice(i + 3, end);
          const nl = body.indexOf('\n');
          const lang = nl > -1 ? body.slice(0, nl).trim() : '';
          const code = nl > -1 ? body.slice(nl + 1) : body;
          out.push({ t: 'codeblock', lang, v: code });
          i = end + 3;
          continue;
        }
      }
      const end = text.indexOf('`', i + 1);
      if (end > -1) {
        out.push({ t: 'code', v: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    if (c === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end > -1) {
        out.push({ t: 'bold', v: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }

    if (c === '*') {
      const end = text.indexOf('*', i + 1);
      if (end > -1) {
        out.push({ t: 'em', v: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    let j = i + 1;
    while (j < n && !'\\`*{'.includes(text[j])) j++;
    out.push({ t: 'text', v: text.slice(i, j) });
    i = j;
  }

  const merged = [];
  for (const tok of out) {
    const prev = merged[merged.length - 1];
    if (tok.t === 'text' && prev && prev.t === 'text') prev.v += tok.v;
    else merged.push(tok);
  }
  return merged;
}

function InlineCode({ code }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.hljs) return;
    try {
      const res = window.hljs.highlightAuto(code || '');
      ref.current.innerHTML = res.value;
    } catch {
      ref.current.textContent = code || '';
    }
  }, [code]);
  return <code ref={ref} className="hljs ds-code-inline">{code}</code>;
}

function CodeBlock({ code, lang }) {
  const ref = React.useRef(null);
  const resolved = LANG_MAP[(lang || '').toLowerCase()] || (lang || '').toLowerCase();
  React.useEffect(() => {
    if (!ref.current || !window.hljs) return;
    try {
      const res = resolved && window.hljs.getLanguage(resolved)
        ? window.hljs.highlight(code || '', { language: resolved, ignoreIllegals: true })
        : window.hljs.highlightAuto(code || '');
      ref.current.innerHTML = res.value;
    } catch {
      ref.current.textContent = code || '';
    }
  }, [code, resolved]);
  return (
    <pre className="md-code-block">
      <code ref={ref} className={`hljs language-${resolved || 'auto'}`}>{code}</code>
    </pre>
  );
}

function renderNodes(tokens, keyPrefix = '') {
  return tokens.map((tok, i) => {
    const k = `${keyPrefix}${i}`;
    switch (tok.t) {
      case 'text': return <React.Fragment key={k}>{tok.v}</React.Fragment>;
      case 'bold': return <strong key={k}>{renderNodes(tokenize(tok.v), `${k}-`)}</strong>;
      case 'em':   return <em key={k}>{renderNodes(tokenize(tok.v), `${k}-`)}</em>;
      case 'code': return <InlineCode key={k} code={tok.v} />;
      case 'codeblock': return <CodeBlock key={k} code={tok.v} lang={tok.lang} />;
      case 'cloze': return <span key={k} className="cloze">{renderNodes(tokenize(tok.v), `${k}-`)}</span>;
      default: return null;
    }
  });
}

const OL_RE = /^(\d+)\.\s+(.*)$/;
const UL_RE = /^[-*]\s+(.*)$/;
const FENCE_RE = /^```(\S*)\s*$/;

function groupBlocks(text) {
  const blocks = [];
  let cur = null;
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fence = FENCE_RE.exec(line);
    if (fence) {
      const lang = fence[1] || '';
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      if (i < lines.length) i++; // consume closing fence
      blocks.push({ type: 'code', lang, body: buf.join('\n') });
      cur = null;
      continue;
    }
    const ol = OL_RE.exec(line);
    const ul = !ol ? UL_RE.exec(line) : null;
    if (ol) {
      if (!cur || cur.type !== 'ol') { cur = { type: 'ol', items: [] }; blocks.push(cur); }
      cur.items.push(ol[2]);
    } else if (ul) {
      if (!cur || cur.type !== 'ul') { cur = { type: 'ul', items: [] }; blocks.push(cur); }
      cur.items.push(ul[1]);
    } else {
      if (!cur || cur.type !== 'p') { cur = { type: 'p', items: [] }; blocks.push(cur); }
      cur.items.push(line);
    }
    i++;
  }
  return blocks;
}

export const Markdown = ({ text }) => {
  if (!text) return null;
  if (!text.includes('\n')) return <>{renderNodes(tokenize(text))}</>;
  const blocks = groupBlocks(text);
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'code') {
          return <CodeBlock key={i} code={b.body} lang={b.lang} />;
        }
        if (b.type === 'ol') {
          return (
            <ol key={i} className="md-list md-ol">
              {b.items.map((l, j) => <li key={j}>{renderNodes(tokenize(l))}</li>)}
            </ol>
          );
        }
        if (b.type === 'ul') {
          return (
            <ul key={i} className="md-list md-ul">
              {b.items.map((l, j) => <li key={j}>{renderNodes(tokenize(l))}</li>)}
            </ul>
          );
        }
        return (
          <React.Fragment key={i}>
            {b.items.map((line, j) => (
              <React.Fragment key={j}>
                {j > 0 && <br />}
                {renderNodes(tokenize(line))}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Markdown;
