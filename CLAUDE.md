# ai-learning

A personal AI-learning repo. The main artifact is `ai-page/` — everything
else (`Example/`, `Google Transformer/`, `ollama/`) is a small standalone
file unrelated to `ai-page`; don't assume they share code or conventions.

## ai-page

A zero-build interactive curriculum browser. `index.html` holds the CSS
and markup; JS lives in `ai-page/js/` as classic (non-module) scripts
loaded via `<script src>` tags in dependency order — **not**
`<script type="module">`, which Chrome blocks under `file://` (see "no
build step" below). The page renders the curriculum four ways:

- **Cosmos** (`js/view-cosmos.js`) — 3D scene (Three.js): domains are
  stars, subjects orbit as planets, topics orbit those as moons.
- **Knowledge Web** (`js/view-mindmap.js`) — force-directed graph
  (vis-network).
- **Mission Control** (`js/view-mission-control.js`) — stat dashboard /
  domain overview cards.
- **Topic Explorer** (`js/view-cards.js`) — searchable, filterable card
  grid.

All four views are derived from one parse of the curriculum Markdown
(`parseCurriculum` in `js/parser.js`), which returns a single canonical
model — `{ title, domains: [{ name, subjects: [{ name, rawName, id,
topics: [{name, desc, id}] }] }] }` — that each view module reads
directly; there is no per-view re-parsing of the Markdown. There is no
build step — open `ai-page/index.html` directly in a browser (double
click, no server needed).

### File layout

```
ai-page/
  index.html                 CSS + markup + <script src> tags, no view logic
  course-curriculum.md       curriculum content (source of truth)
  course-curriculum.js       generated from the .md (see below)
  build-curriculum.js        the generator
  js/
    palette.js                hslToRgb, generatePalette          (pure)
    parser.js                 parseCurriculum, validateCurriculum,
                               escapeHtml                         (pure)
    panel.js                  Panel — shared side-panel singleton
    view-cosmos.js             CosmosView
    view-mindmap.js             MindmapView
    view-cards.js               CardsView
    view-mission-control.js     MissionControlView
    app.js                     bootstrap, switchView/nextView/prevView,
                               keyboard nav, click-outside-panel listener
```
Load order in `index.html` matters: each file depends only on what's
listed above it (`course-curriculum.js` → `palette.js` → `parser.js` →
`panel.js` → the four `view-*.js` files → `app.js` last, since it's the
one that calls `parseCurriculum`/`generatePalette` and wires everything
together at `window.onload`).

### View module interface

Each view is an IIFE exposing exactly one global (`CosmosView`,
`MindmapView`, `CardsView`, `MissionControlView`) with the same lifecycle
methods, so `app.js`'s `switchView` is a generic loop over
`viewModules{}` instead of one `if/else` branch per view name — adding a
5th view means adding one entry to that map, not editing the switcher:

- `activate(model, palette)` — lazy-builds the view on first call (each
  view tracks its own `initialized` flag internally), then
  resumes/refreshes it (restarts an animation loop, re-fits the graph, etc).
- `deactivate()` — pauses whatever `requestAnimationFrame` loop the view
  owns (Cosmos's render loop, the mindmap's pulse/drift loop) so it stops
  running while the view isn't visible.
- `resize()` — re-fits the view after a layout change. `Panel` (see below)
  calls this on every view via `Panel.onResize(...)` registrations in
  `app.js`, rather than reaching into view internals directly.

State that used to be loose top-level globals (`networkInstance`,
`mapAnimationProfile`, `mindmapLoopId`, `constellationActive`,
`resumeConstellationLoop`, `resizeConstellationFn`, `viewInitialized`) now
lives inside the relevant view module's closure.

### The side panel (`js/panel.js`)

`Panel` is the shared detail view opened by Topic Explorer cards
(`Panel.openTopic(...)`) and Mission Control domain cards
(`Panel.openDomain(...)`). It doesn't know about `CosmosView`/`MindmapView`
internals — a view that needs to re-fit itself when the panel opens/closes
registers a callback via `Panel.onResize(fn)` instead.

### Editing the curriculum

The curriculum content lives in `ai-page/course-curriculum.md` — that is
the source of truth. `ai-page/course-curriculum.js` is a **generated**
file (do not hand-edit it); it exists only because browsers block
`fetch()` of local files under `file://`, so the Markdown is wrapped in a
JS variable that `index.html` loads via `<script src="course-curriculum.js">`.

To change the curriculum:
```
# edit ai-page/course-curriculum.md, then:
node ai-page/build-curriculum.js
# commit both course-curriculum.md and course-curriculum.js
```

The generator JSON-encodes the Markdown, so backticks/`${...}`/quotes in
content can never break the generated JS (unlike the old hand-written
template literal it replaced).

If this page ever becomes always-served over http(s) (e.g. GitHub Pages
only, no more local `file://` usage), `course-curriculum.js` and
`build-curriculum.js` can be deleted and `index.html` can instead
`fetch('course-curriculum.md')` directly — `parseCurriculum` already
operates on a plain string, so no parser changes would be needed. At that
point `js/*.js` could also switch to `<script type="module">` with real
`import`/`export` if desired, since the `file://` CORS restriction would
no longer apply.

### Code conventions

- Iterative feature additions are marked with paired banner comments,
  e.g. `// ── HUE-SHIFT-START: ... ──` / `// ── HUE-SHIFT-END ──`, so a
  feature's full diff footprint is easy to find even after it's been
  squashed into one file.
- `parseCurriculum` strips the leading numeric prefix (`"1. "`) from
  subject names once, into `.name`; `.rawName` keeps the original heading
  text for the rare case a view needs it (currently only validation
  warnings, which reference the raw heading for easier lookup in the
  source file).
- All curriculum-derived text is passed through `escapeHtml` (in
  `js/parser.js`) before being interpolated into an `innerHTML` template
  literal — content is trusted today, but this is cheap insurance against
  a stray `<`/`&` in a topic name, or the content source becoming less
  trusted later.
