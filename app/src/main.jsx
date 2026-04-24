import React from 'react';
import { createRoot } from 'react-dom/client';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import mermaid from 'mermaid';

// highlight.js available globally so components reading window.hljs still work.
window.hljs = hljs;

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'ui-monospace, SF Mono, Menlo, Consolas, monospace',
  themeVariables: {
    background: '#0d1117',
    primaryColor: '#181818',
    primaryTextColor: '#e5e5e5',
    primaryBorderColor: '#7aa2f7',
    lineColor: '#a3a3a3',
    secondaryColor: '#1f1f1f',
    tertiaryColor: '#121212'
  }
});
window.mermaid = mermaid;

// CSS
import './tokens.css';
import './styles.css';

// Content bundles are plain JS IIFEs that populate window.CONTENT, then the
// aggregator flattens that into window.COURSES / ALL_TOPICS / LESSONS / etc.
// Side-effect imports execute them in order.
import '../../content/_dist/4736.js';
import '../../content/_dist/4870.js';
import '../../content/_dist/4911.js';
import '../../content/_dist/4915.js';
import '../../content/_dist/3522.js';
import '../../content/_dist/COMP3975.js';
import '../../content/_dist/COMP4537.js';
import '../../content/_dist/_aggregator.js';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
