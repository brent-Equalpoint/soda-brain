# SODA — Build Error Log

> Append only. Log every build error and every safepoint before moving on.
> One entry per event. Do not edit prior entries.

---

## Error Entry Format

```
## [GMW-###] [Short description] — [Agent] — [date]
**Error:** [Exact error message or description]
**File:** [File path where it occurred]
**Root cause:** [What actually caused it]
**Fix:** [What was changed to resolve it]
**Verified:** [Yes / No — did the fix confirm resolved?]
**Last safepoint:** [SAFE-### or "none set"]
```

---

## Safepoint Entry Format

A safepoint marks a known-good build state. Set one:
- After Ghost issues CLEAR TO SHIP on any slice
- After a prototype is approved and before backend work begins
- Before any migration that alters existing tables
- At the end of every completed phase

```
## [SAFE-###] [What is stable] — [Agent] — [date]
**Task:** GMW-###
**Phase:** [Phase # and name — e.g., Phase 1: Vertical Slice]
**Stable state:** [What is working and fully verified at this point]
**Branch:** [branch name — e.g., gmw-007-room-view]
**Commit:** [short hash or "pending commit"]
**Verified files:** [key files confirmed in clean state]
**Next planned action:** [What was queued to happen next]
**To rewind here:** git checkout [branch], load startup sequence, read SESSION.md — the state above is your anchor.
```

---

<!-- Entries below this line — newest at bottom -->
