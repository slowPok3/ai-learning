# ai-page Roadmap

Backlog of known improvement areas, roughly priority-ordered. Completed
work is not repeated here — see `CHANGELOG.md` for dated history and
`git log` for full commit-level detail.

## Open

### 1. No fallback if a CDN script fails to load
If three.js or vis-network fail to load (ad-blocker, restrictive network,
or a future SRI mismatch), `CosmosView`/`MindmapView` throw an uncaught
`ReferenceError` the moment the user switches to that view — blank
screen, error only visible in devtools. A `typeof THREE === 'undefined'`
guard with an inline message would turn that into an understandable
state.

### 2. Dead CSS in index.html
`input[type="search"]::-webkit-search-cancel-button` and
`::-webkit-search-decoration` (~18 lines) target a selector that can
never match — `#search` is `type="text"`. Either delete the dead rules
or change the input to `type="search"` (decide what that means for the
existing custom clear button first).

### 3. Cosmos twinkle-loop performance (needs profiling, not a clear bug)
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
