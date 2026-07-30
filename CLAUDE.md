# ai-learning

A personal AI-learning repo. The main artifact is `ai-page/` — everything
else (`Example/`, `Google Transformer/`, `ollama/`) is a small standalone
file unrelated to `ai-page`; don't assume they share code or conventions.

## ai-page

A zero-build, single-file interactive curriculum browser. `index.html`
contains all CSS/JS inline and renders the curriculum four ways:

- **Cosmos** — 3D scene (Three.js): domains are stars, subjects orbit as
  planets, topics orbit those as moons.
- **Knowledge Web** — force-directed graph (vis-network).
- **Mission Control** — stat dashboard / domain overview cards.
- **Topic Explorer** — searchable, filterable card grid.

All four views are derived from one parse of the curriculum Markdown
(`parseCurriculum` in `index.html`), which returns a single canonical
model — `{ title, domains: [{ name, subjects: [{ name, rawName, id,
topics: [{name, desc, id}] }] }] }` — that each view function (`initCosmos`,
`initMindmap`, `initCards`, `initMissionControl`) reads directly; there is
no per-view re-parsing of the Markdown. There is no build step — open
`ai-page/index.html` directly in a browser (double click, no server
needed).

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
operates on a plain string, so no parser changes would be needed.

### Code conventions in index.html

- Iterative feature additions are marked with paired banner comments,
  e.g. `// ── HUE-SHIFT-START: ... ──` / `// ── HUE-SHIFT-END ──`, so a
  feature's full diff footprint is easy to find even after it's been
  squashed into the single file.
- Each of the four views is lazily initialized once (`viewInitialized`)
  and exposes a pause/resume path for its animation loop
  (`constellationActive`, `mindmapLoopId`) so `requestAnimationFrame`
  loops stop running when a view isn't visible.

- `parseCurriculum` strips the leading numeric prefix (`"1. "`) from
  subject names once, into `.name`; `.rawName` keeps the original heading
  text for the rare case a view needs it (currently only validation
  warnings, which reference the raw heading for easier lookup in the
  source file).
