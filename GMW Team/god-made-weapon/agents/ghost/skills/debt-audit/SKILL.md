# Ghost Mode 3: Debt Audit Skill File
## God Made Weapon | Ghost QA

---

### Activation

Trigger phrase: "Ghost run debt audit."
Activated by: Brent Montgomery or Alysha Montgomery directly.
No active build task required. No sub-agents activated.
Output: docs/qa/DEBT-AUDIT-[date].md

---

### Inspection Area 1: Reference Drift

Question: Does the documentation match the actual codebase?

Schema drift — run in Supabase SQL editor:
```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```
Cross-reference against schema.md. Every discrepancy is a finding.

Component drift:
```bash
find src/components -name "*.tsx" | sort
find src/app -name "*.tsx" | sort
```
Cross-reference against components.md. Missing entries in either direction are findings.

API route drift:
```bash
find src/app/api -name "route.ts" | sort
```
Cross-reference against api-routes.md.

Warmth formula drift:
```bash
cat src/lib/warmth/formula.ts
```
Formula in warmth.md must match formula.ts exactly. Any discrepancy is P1.

---

### Inspection Area 2: Formula Integrity

Question: Is the warmth formula imported from the correct location everywhere?

```bash
grep -rn "Math.exp" src/
grep -rn "0\.01" src/
grep -rn "base_warmth" src/
grep -rn "days_since" src/
```

Any result outside src/lib/warmth/formula.ts is a P1 finding. No exceptions.

---

### Inspection Area 3: Two-Call Gate Integrity

Question: Has the draft generation and approval gate ever been merged?

```bash
grep -rn "autoSend\|auto_send\|auto-send" src/
grep -rn "sendMessage\|send_message" src/
grep -rn "draft/approve" src/
```

draft/approve must appear exactly once: in the approve handler.
The draft route handler must not contain any database write.

```bash
cat src/app/api/draft/route.ts
```

Any database write in this file is P1.

---

### Inspection Area 4: RLS Coverage

Question: Does every table have Row Level Security enabled and a policy defined?

```sql
SELECT tablename, rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Any table where rls_enabled is false is P1.

```sql
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

Every table needs RLS enabled AND at least one policy. Route all findings to Kennis Beck.

---

### Inspection Area 5: SESSION.md Continuity

Question: Are there phase transitions in CHANGELOG that have no SESSION.md entry?

```bash
cat .agent/SESSION.md
cat CHANGELOG.md
```

Cross-reference every task in CHANGELOG against SESSION.md. Any task that completed without a SESSION.md update is a finding. Flag the task ID and agent who closed it. Brent reviews that task's output manually.

---

### Inspection Area 6: SODA Decision Integrity

Question: Does any current implementation contradict a locked SODA decision?

Priority checks:

```bash
# Check for lingering Clerk references
grep -rn "clerk\|@clerk" src/
grep -rn "clerk" package.json

# Check warmth phrases
grep -rn "warmth\|rhythm\|while" src/components

# Check priority_score persistence
grep -rn "priority_score" src/app/api

# Check loop_events integrity
grep -rn "loop_events" src/

# Check for raw warmth score in UI
grep -rn "warmth_score\|warmthScore" src/components
```

Any implementation contradicting a locked SODA decision without a new SODA entry is P1.

---

### Severity Tiers

P1 — Contradicts a locked SODA decision or non-negotiable rule. Blocks BTW. Fix before any other work.
P2 — Reference file drift or documentation gap. Must close before September launch.
P3 — Minor inconsistency that does not affect behavior. Addressed in normal sprint flow.

---

### Debt Report Format

Write to docs/qa/DEBT-AUDIT-[date].md.

```
DEBT AUDIT REPORT
Date: [date]
Run by: Ghost
Requested by: [name]

SUMMARY
P1 findings: [n]
P2 findings: [n]
P3 findings: [n]
Total: [n]

P1 FINDINGS

FINDING-001
Area: [inspection area]
Severity: P1
Description: [specific description with file path and line number]
Command that found it: [exact command]
Owner: [agent name]
Action: [specific action to take]
Blocks BTW: Yes

P2 FINDINGS
[same format]

P3 FINDINGS
[same format]

GAPS REQUIRING MANUAL REVIEW
[task IDs with missing SESSION.md entries, flagged to Brent]
```

---

### Cleanup Sprint Structure

Day 1: Ghost runs full debt audit. Report written.
Day 1 afternoon: Brent reviews report. Assigns P1 items. Schedules manual reviews.
Day 2: Kennis and Aniya close P1 findings. Ghost runs Mode 1 on each fix.
Day 3: P2 findings addressed. Reference files updated.
Day 3 close: Ghost runs second Mode 3 pass. Zero P1 findings required to proceed.

When to run: Before BTW Cincinnati. Before September 14 launch. After any sprint where more than three tasks closed.
