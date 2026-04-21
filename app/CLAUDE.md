# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from this directory (`app/`):

- `npm run dev` — Vite dev server. Vite is configured with `server.fs.allow: ['..']` so it can load the content bundles from the sibling `../content/_dist/` directory.
- `npm run build` — production build into `dist/` (base path `/study-guides/`).
- `npm run preview` — serve the built `dist/`.
- `./deploy.sh ["commit msg"]` — builds, then syncs `dist/` into the sibling `../deploy/` repo (`DEPLOY_DIR` override supported) and pushes to GitHub Pages (`https://mushcore.github.io/study-guides/`). Assumes `../deploy/.git` exists.

Content bundles live **outside** this app. To rebuild them, run from the parent dir (`../`):

- `npm run build-content` — compiles `content/{4736,4870,4911,4915}/` → `content/_dist/{id}.js` per `content/SCHEMA.md`.
- `node scripts/build-content.js 4736 4911` — subset rebuild.

No test, lint, or typecheck scripts are defined.

## Architecture

Single-page Vite + React 18 app. Pure client-side; no backend. Hash-based router. Content is data-driven and loaded via IIFE script bundles that populate `window.*` globals before React mounts.

### Boot sequence (`src/main.jsx`)
1. Initializes `highlight.js` and `mermaid` on `window` (components read them globally).
2. **Side-effect imports** the four content bundles in order (`../../content/_dist/{4736,4870,4911,4915}.js`) followed by `_aggregator.js`. The bundles are plain IIFEs that populate `window.CONTENT[id]`.
3. `_aggregator.js` flattens `window.CONTENT` into the globals every component reads: `COURSES`, `ALL_TOPICS`, `LESSONS`, `TOPIC_DIVES`, `MOCK_QUESTIONS`, `CODE_PROBLEMS`, `CODE_ANNOTATIONS`, `CHEAT_SHEETS`. It also renames bundle fields for consumers (`question → q`, `rationale → why`).
4. Only then does React render `<App />`.

Implication: components **assume `window.COURSES` etc. are already populated** at render time. Do not add code paths that execute before the aggregator.

### Routing (`src/router.js`)
Hash-only. Route shapes:
- `#/` → dashboard
- `#/c/{courseId}` → course home
- `#/c/{courseId}/{subview}` where subview ∈ `priorities | lessons | dives | mock | code | cheat`
- `#/t/{topicId}` → recall card (courseId derived by looking up `window.ALL_TOPICS`)
- `#/replay` → quiz replay

`App.jsx` keeps React state in sync with `window.location.hash` via `popstate` + `hashchange` listeners and persists the last route to `localStorage['sgv2:route']`. A `RouteErrorBoundary` wraps every route and resets on route change.

### Content dispatch quirk
In `App.jsx`, the `code` subview branches on course id: **COMP 4911 uses `CodeAnnotation.jsx`; all other courses use `CodeApplied.jsx`**. The aggregator splits `codePractice` by `variant === 'annotation'` accordingly. New courses must pick a variant in both places.

### Persistence (`src/state.js`)
All persistence is `localStorage` under the `sgv2:` prefix (`sgv2:conf`, `sgv2:last`, `sgv2:hist`, `sgv2:tweak`, `sgv2:route`). Spaced-repetition scheduling lives here (`SG.INTERVALS = [0,1,3,7,14]`, `SG.isDue`). `SG` is also attached to `window` so non-ESM code can poke at it.

### Edit-mode / parent-frame protocol
`App.jsx` listens for `postMessage` events of type `__activate_edit_mode` / `__deactivate_edit_mode` from a parent frame and announces itself with `__edit_mode_available`. Tweak changes post `__edit_mode_set_keys` back up. The `TWEAK_DEFAULTS` literal is wrapped in `/*EDITMODE-BEGIN*/ … /*EDITMODE-END*/` sentinel comments — preserve these markers; an external editor rewrites this block in place.

### Content schema
Canonical spec: `../content/SCHEMA.md`. Source of truth for the shape of `course.yaml`, `flashcards.yaml`, `mock-exam.yaml`, `lessons/*.md`, `code-practice/*.md`, `topic-dives/*.md`, `cheat-sheet.md`. The build pipeline is: schema → `scripts/build-content.js` → consumers. Any schema change must update all three.

Four course IDs are hard-coded throughout (`4736`, `4870`, `4911`, `4915`) — in `main.jsx` imports, `_aggregator.js` ids array, and `scripts/build-content.js` COURSES constant. Adding/removing a course requires touching all three.

**Adding a new course end-to-end** (raw materials → live in the app): see `../ADD-NEW-COURSE.md`. That doc is the canonical pipeline and consolidates the teaching / formatting standards (SuperMemo 20 rules, Bloom's progression, worked-example transparency, peer-shareability + teaching-craft rubrics) that every generated artifact must follow.

## Styling

Two CSS files, imported once in `main.jsx`: `tokens.css` (design tokens — CSS custom properties) then `styles.css` (the rest, ~57 KB single file). Density and motion are toggled via `data-density` / `data-motion` attributes on `<html>`, driven by the Tweaks overlay.
