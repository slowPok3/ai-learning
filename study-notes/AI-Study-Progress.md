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
| [[#Python Basics]] | Prerequisites → Programming Basics | ⬜ Not started | — |

---

## Python Basics
**Curriculum:** Prerequisites → Programming Basics → *Python Basics* (`S1-T1`)
**Status:** ⬜ Not started
**Background going in:** zero Python; strong in Pascal/C/C++ and PowerShell (primary scripting language).

### Progress
- [ ] Environment: REPL, running scripts (`python3 script.py`)
- [ ] Indentation-based blocks (vs C/C++ braces, no semicolons)
- [ ] Variables & dynamic typing (no declarations, name can rebind to any type)
- [ ] Core data structures: `list`, `tuple`, `dict`, `set`
- [ ] Loops: `for`/`while`, iterating collections directly (not index-based)
- [ ] Functions: `def`, default args, functions as first-class values
- [ ] OOP: classes, `self`, inheritance, dunder methods
- [ ] Functional style: lambdas, comprehensions, `map`/`filter`
- [ ] Hands-on exercise

### Notes
- Coming from PowerShell/C++, the two real adjustments are: indentation *is* the block syntax, and dynamic typing (no `int`/`string` declarations).
- Rough equivalence table:
  - `list` ≈ resizable array / PowerShell `@()`
  - `dict` ≈ PowerShell hashtable `@{}` / C++ `std::map`
  - `tuple` ≈ immutable fixed-size list (no direct C/PowerShell equivalent)
  - `set` ≈ unique unordered values (no direct C/PowerShell equivalent)
- Functions are values (closer to PowerShell scriptblocks than C function pointers) — this is the on-ramp to the functional-programming half of this topic.

### Next up
Start from the top: environment + syntax basics.
