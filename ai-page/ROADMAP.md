# ai-page Roadmap

Backlog of known improvement areas, roughly priority-ordered. Completed
work is listed briefly for context; see git log for detail.

## Done
- Curriculum content moved to `course-curriculum.md` (real source file)
- Curriculum parsing unified into one canonical model (`parseCurriculum`)
- Curriculum text escaped before `innerHTML` injection (XSS hardening)
- `index.html` split into `js/*.js` modules; per-view state encapsulated
- CDN scripts (three.js, OrbitControls, vis-network) pinned + SRI-hashed

## Open

### 1. Accessibility gaps (highest priority)
Several interactive elements are built from non-interactive tags with
only an `onclick`, so they're invisible to keyboard/screen-reader users:
- `.nav-dot` (bottom-nav view switcher) — `<div>`, no `tabindex`/`role`,
  no Enter/Space activation.
- `#custom-clear-btn` (search clear "×") — `<span>`, same gap.
- `.card` / `.visual-card` (Topic Explorer / Mission Control cards) —
  `<div>`s, same gap; these are the primary way to reach topic/domain
  detail, so this blocks a whole interaction path for keyboard users.
- Bottom-nav buttons are emoji-only with `title` (not reliably announced
  by screen readers) instead of `aria-label`.
- `#search` and `#domainFilter` have no associated `<label>`.
- No `aria-live` region announcing Topic Explorer result-count changes.

### 2. No fallback if a CDN script fails to load
If three.js or vis-network fail to load (ad-blocker, restrictive network,
or a future SRI mismatch), `CosmosView`/`MindmapView` throw an uncaught
`ReferenceError` the moment the user switches to that view — blank
screen, error only visible in devtools. A `typeof THREE === 'undefined'`
guard with an inline message would turn that into an understandable
state.

### 3. Dead CSS in index.html
`input[type="search"]::-webkit-search-cancel-button` and
`::-webkit-search-decoration` (~18 lines) target a selector that can
never match — `#search` is `type="text"`. Either delete the dead rules
or change the input to `type="search"` (decide what that means for the
existing custom clear button first).

### 4. Cosmos twinkle-loop performance (needs profiling, not a clear bug)
The star-twinkle effect runs a 1500-iteration loop with a `Math.sin()`
call per star every animation frame. Likely fine on desktop; worth
profiling on a low-end mobile device before deciding whether it needs
throttling or a cheaper approximation.

## Checked and ruled out
- Knowledge Web's tooltip (`title: topic.desc ? ... `) passes unescaped
  curriculum text into vis-network, but vis-network 10.1.0's Popup uses
  `.innerText` (verified against the actual pinned bundle), which is a
  safe text-only sink — no action needed, and adding `escapeHtml()` here
  would actually be a regression (visible literal `&amp;` instead of `&`,
  since `innerText` doesn't decode entities).
