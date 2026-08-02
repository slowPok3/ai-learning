# Changelog

Notable changes to `ai-page`, most recent first. See `git log` for full
commit-level detail; see `ROADMAP.md` for what's planned next.

## 2026-08-01
- Fixed accessibility gaps: nav dots, Topic Explorer/Mission Control
  cards, and the search clear button are now real `<button>`s
  (focusable, Enter/Space-activated); added `aria-label`s to icon-only
  nav buttons, `aria-current` on the active nav dot, `<label>`s for
  search/domain-filter, and an `aria-live` region announcing search
  result counts.
- Added `ROADMAP.md` to track remaining known improvements.

## 2026-07-30
- Pinned and added Subresource Integrity (SRI) hashes to the three
  CDN-loaded scripts (three.js, OrbitControls, vis-network); vis-network
  was previously unpinned to `latest`.
- Split `index.html`'s inline script into `js/*.js` modules
  (`parser.js`, `palette.js`, `panel.js`, four `view-*.js` files,
  `app.js`); replaced ad-hoc top-level globals with per-view state and a
  shared `activate`/`deactivate`/`resize` interface.
- Escaped curriculum text before `innerHTML` injection across all views
  (XSS hardening).
- Unified curriculum parsing into a single canonical model
  (`parseCurriculum`), replacing two independent parsers that had
  already drifted apart.
- Moved curriculum content out of a hand-written JS template literal
  into `course-curriculum.md` (real, hand-editable source), generated
  into `course-curriculum.js` via `build-curriculum.js`. Added
  `CLAUDE.md` documenting the architecture for future sessions.

## Earlier
Initial curriculum browser build-out: the four views (Cosmos, Knowledge
Web, Mission Control, Topic Explorer), Cosmos animation features (star
twinkle, shooting-star variety, cluster spin, per-planet hue-shift),
card entrance staggering, and iterative curriculum content revisions.
See `git log` for the full commit history.
