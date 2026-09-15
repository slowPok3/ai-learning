---
title: AI Study Progress
tags: [ai-curriculum, study-log]
---

# AI Curriculum — Study Progress

Tracking progress through the [[ai-page]] curriculum (`ai-page/course-curriculum.md`).
One section per topic below, added as it's studied. Status legend: 🟡 in progress · ✅ done · ⬜ not started.

## Status overview

| Topic | Domain → Subject | Status | Started |
|---|---|---|---|
| [[#Attention]] | Deep Learning → Attention | 🟡 In progress | 2026-09-15 |
| [[#Transformers]] | Deep Learning → Transformers | 🟡 In progress | 2026-09-15 |
| [[#Python Basics]] | Prerequisites → Programming Basics | ⏸️ On hold | 2026-09-03 |

---

## Attention
**Curriculum:** Deep Learning → Attention (`S54`)
**Status:** 🟡 In progress
**Approach:** learning Transformers directly, picking up Python as needed along the way (rather than finishing Python Basics first). `Google Transformer/TransformerSimulator.py` in this repo is a ready-made hands-on resource (PyTorch self-attention demo) — using it as the anchor once we hit Query/Key/Value mechanics.

### Progress
- [x] Attention intuition (`S54-T2`): why attention exists, what problem it solves
- [x] Query, key, value (`S54-T1`): search-engine analogy (Query=what you want, Key=what a page is about, Value=the content) + ran `TransformerSimulator.py`

### Notes
- Core problem attention solves: RNNs compress the whole sequence into one fixed-size memory vector (lossy over long sequences) and process sequentially (no GPU parallelism). Attention lets every token look directly at every other token, all at once, weighted by relevance.
- Canonical example: "it" resolving to different nouns depending on one other word elsewhere in the sentence ("...because it is too big" vs "...too small") — needs direct, weighted access to the whole sentence, not a compressed summary.
- The 4 mechanical steps: **Score** (Q·K per pair) → **Scale** (÷√d_k, numerical stability) → **Softmax** (rows become percentages summing to 100%) → **Weighted sum** (blend Values by those percentages) = new context-aware vector per word.
- Ran `Google Transformer/TransformerSimulator.py` (3-word toy sentence "AI is awesome", 4-dim embeddings) and traced real numbers through all 4 steps.
- Caveat noticed in the toy example: it uses `Q = K = words`, so the raw score matrix comes out symmetric (score[i][j] == score[j][i]). That's an artifact of this simplification — in a real transformer, Q and K are separate learned projections, so attention is generally **asymmetric** (A can attend to B without B attending equally to A).
- Env note: got a `Failed to initialize NumPy` warning (harmless here) — `pip install numpy` recommended since most of the Python ML stack assumes it's present.

### Next up
Multi-head attention (`S55-T2`) — why one attention pass isn't enough.

---

## Transformers
**Curriculum:** Deep Learning → Transformers (`S55`)
**Status:** 🟡 In progress

### Progress
- [x] Self-attention (`S55-T1`) — covered via the `TransformerSimulator.py` walkthrough under [[#Attention]] (same 4-step mechanism, applied to a sequence)
- [ ] Multi-head attention (`S55-T2`)
- [ ] Positional encoding (`S55-T3`)

---

## Python Basics
**Curriculum:** Prerequisites → Programming Basics → *Python Basics* (`S1-T1`)
**Status:** ⏸️ On hold — picking up remaining items opportunistically while working through Transformers instead of finishing linearly.
**Background going in:** zero Python; strong in Pascal/C/C++ and PowerShell (primary scripting language).
**Setup:** Cursor editor on Windows, project at `M:\GIT\AI-Learning\python`, running via `python hello.py` in the integrated terminal.

### Progress
- [x] Environment: REPL, running scripts (`python hello.py` in Cursor's terminal)
- [x] Indentation-based blocks (vs C/C++ braces, no semicolons)
- [x] Variables & dynamic typing (no declarations, name can rebind to any type)
- [x] Core data structures: `list`, `tuple`, `dict`, `set`
- [ ] Loops: `for`/`while`, iterating collections directly (not index-based)
- [ ] Functions: `def`, default args, functions as first-class values
- [ ] OOP: classes, `self`, inheritance, dunder methods
- [ ] Functional style: lambdas, comprehensions, `map`/`filter`
- [ ] Hands-on exercise

### Notes
- Coming from PowerShell/C++, the two real adjustments are: indentation *is* the block syntax, and dynamic typing (no `int`/`string` declarations).
- Functions are values (closer to PowerShell scriptblocks than C function pointers) — this is the on-ramp to the functional-programming half of this topic.
- No `++`/`--` operators — always `x = x + 1`.

### Cheat sheet: data structures

**`list`** — resizable, ordered, mutable.
```python
users = ["alice", "bob"]
users.append("carol")
```
≈ PowerShell `@()` array.

**`dict`** — key/value pairs, mutable.
```python
roles = {"alice": "admin"}
roles["bob"] = "read-only"
```
≈ PowerShell hashtable `@{}` / C++ `std::map`.

**`tuple`** — ordered, **fixed-length, immutable**.
```python
point = (3, 4)          # or just 3, 4 — the comma makes it a tuple, not the parens
x, y = point             # unpacking
```
- Immutable → hashable → can be used as a dict key (a `list` can't).
- Signals "exactly N related values" (a coordinate, a multi-value return), not just "a locked list."
- No native PowerShell equivalent — closest is .NET's `[System.Tuple]::Create(3, 4)` / PS7 `[ValueTuple]`; PowerShell scripts normally just return an array and rely on convention instead of enforced immutability.

**`set`** — unordered, **unique values only**, fast membership testing.
```python
perms = {"read", "write", "read"}   # dup silently dropped
"read" in perms                      # O(1) lookup
a | b   # union
a & b   # intersection
a - b   # difference
```
- Gotcha: `{}` alone is an empty **dict**, not an empty set — empty set is `set()`.
- No native PowerShell equivalent — `Select-Object -Unique` is a one-off dedupe operation, not a persistent type; the real equivalent is .NET's `[System.Collections.Generic.HashSet[object]]`.

### Next up
Loops: for/while, iterating collections directly (Step 5).
