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
| [[#Python Basics]] | Prerequisites → Programming Basics | 🟡 In progress | 2026-09-03 |

---

## Python Basics
**Curriculum:** Prerequisites → Programming Basics → *Python Basics* (`S1-T1`)
**Status:** 🟡 In progress
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
