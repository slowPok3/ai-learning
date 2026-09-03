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
Indentation-based blocks (Step 2).
