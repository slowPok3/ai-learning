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
| [[#Attention]] | Deep Learning → Attention | 🟡 In progress (restarted, slower pace) | 2026-09-16 |
| [[#Transformers]] | Deep Learning → Transformers | ⬜ Not started | — |
| [[#Python Basics]] | Prerequisites → Programming Basics | ⏸️ On hold | 2026-09-03 |

---

## Attention
**Curriculum:** Deep Learning → Attention (`S54`)
**Status:** 🟡 In progress (restarted 2026-09-16 — first pass moved too fast)
**Approach:** first pass went straight to a finished simulator script and jumped ahead to multi-head before the fundamentals (dot product, softmax) were solid by hand. Restarting: build a transformer from scratch, one small hand-computed piece at a time, writing new code incrementally instead of being handed a finished file.

### Progress
- [x] Attention intuition (`S54-T2`): why attention exists, what problem it solves
- [ ] Query, key, value (`S54-T1`) — redo from scratch, slower, with a tiny 2D hand-computed example first

### Notes (kept from first pass — still valid reference)
- Core problem attention solves: RNNs compress the whole sequence into one fixed-size memory vector (lossy over long sequences) and process sequentially (no GPU parallelism). Attention lets every token look directly at every other token, all at once, weighted by relevance.
- Canonical example: "it" resolving to different nouns depending on one other word elsewhere in the sentence ("...because it is too big" vs "...too small") — needs direct, weighted access to the whole sentence, not a compressed summary.
- The 4 mechanical steps: **Score** (Q·K per pair) → **Scale** (÷√d_k, numerical stability) → **Softmax** (rows become percentages summing to 100%) → **Weighted sum** (blend Values by those percentages) = new context-aware vector per word.
- **Dot product**: multiply corresponding components, sum them — measures how "aligned" two vectors are (big positive = similar direction, zero = unrelated, negative = opposite). `QKᵀ` is just "do that for every pair of words at once" via matrix multiplication.
- **Softmax**: `e^x_i / sum(e^x_j)` — turns arbitrary numbers into a probability row (positive, sums to 1). Exponentiating (rather than just dividing by the sum) handles negative scores and *exaggerates* the gap between them, so the most relevant word(s) dominate rather than attention being spread near-evenly.
- Ran `Google Transformer/TransformerSimulator.py` (3-word toy sentence, 4-dim embeddings) and traced numbers through all 4 steps by hand — this worked, but multi-head was introduced too soon after.
- Caveat noticed in the toy example: it uses `Q = K = words`, so the raw score matrix comes out symmetric. Artifact of the simplification — in a real transformer, Q and K are separate learned projections, so attention is generally **asymmetric**.
- Also built `Google Transformer/TransformerSimulator_MultiHead.py` (2-head version) — code runs correctly, but revisit once single-head is solid by hand, not just by reading a script's output.
- Env note: got a `Failed to initialize NumPy` warning (harmless here) — `pip install numpy` recommended since most of the Python ML stack assumes it's present.

### Next up
Rebuild from scratch, starting even before Q/K/V: what a word embedding actually is, then a hand-computed dot product on a tiny 2D example.

---

## Transformers
**Curriculum:** Deep Learning → Transformers (`S55`)
**Status:** ⬜ Not started — deferred until [[#Attention]] fundamentals are solid again.

### Progress
- [ ] Self-attention (`S55-T1`)
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
