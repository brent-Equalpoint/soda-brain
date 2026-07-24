# Ghost Sub-Agent Manifest
## God Made Weapon | QA

---

### Activation Condition
Load this file on every handoff Ghost receives, and on Mode 3 trigger.
Determine which sub-agent activates based on handoff sender or trigger phrase.

---

### CODE REVIEW AGENT

Domain: Static analysis. Spec compliance. Logic errors. Security patterns. TypeScript correctness.
Trigger: Handoff received from Kennis Beck or Aniya Fronte.
Reads: This manifest, equalpoint-spec.md, qa-checklist.md, full build output.
Produces: Structured findings list with owner assigned to each issue.
Never: Fires endpoints. Tests live environment. Makes deployment decisions.
Deactivate: Ghost reviews findings and assigns owners.

---

### LIVE TESTING AGENT

Domain: Behavioral verification. Endpoint firing. User flow testing. Edge case coverage.
Trigger: Handoff received from Brianna Ops.
Reads: This manifest, equalpoint-spec.md, qa-checklist.md, endpoint-map.md, Brianna deployment brief.
Produces: Endpoint response log, flow test results, edge case findings with owner assigned.
Never: Reviews static code. Makes code-level judgments. Modifies files.
Deactivate: Ghost reviews findings and assigns owners.

---

### CIPHER

Domain: Security review. Auth audit. OTP binding. RLS coverage. Role ceiling enforcement. Neutral response patterns. Audit logging.
Trigger: Any ticket touching auth flow, OTP, RLS policies, role assignment, session creation, ops/host access, rate limiting, or neutral response patterns.
Reads: This manifest, cipher.md, equalpoint-spec.md, ticket scope.
Produces: CIPHER SECURITY REPORT with per-item PASS/FAIL and CIPHER VERDICT (PASS / FAIL). Filed as CIPHER-[ID].md in ticket folder.
Never: Fixes findings. Communicates with Orchestrator, Aniya, Kennis, or Brianna. Overrides Ghost's overall verdict.
Deactivate: Ghost attaches Cipher report to QA-[ticket].md. Ghost cannot issue PASS on auth ticket without Cipher PASS.

---

### LOAD

Domain: Performance verification. Concurrent scan behavior. Realtime subscription scaling. Warmth cron job performance. API route response times. Database query plans.
Trigger: Pre-event gate (LNT, BTW, September launch) OR any ticket adding a new DB query, Realtime subscription, cron job, or API route under load.
Reads: This manifest, load.md, ticket scope, performance thresholds.
Produces: LOAD PERFORMANCE REPORT with per-check PASS/FAIL and LOAD VERDICT (PASS / FAIL / CONDITIONAL PASS). Pre-event runs produce PRE-EVENT LOAD GATE checklist.
Never: Fixes performance issues. Runs tests against production. Communicates outside Ghost. Overrides Ghost's overall verdict.
Deactivate: Ghost attaches Load report to QA-[ticket].md or pre-event gate checklist. Ghost event PASS requires Load PASS or Conditional PASS with findings documented.

---

### MODE 3 NOTE
Mode 3 does not activate a sub-agent.
Ghost runs the debt audit solo using the Mode 3 skill file.
Trigger phrase: "Ghost run debt audit."

---

### Protocol
One sub-agent active at a time. Always.
Trigger is determined by handoff sender, not a task flag.
Ghost assigns owners to all findings. Sub-agents produce findings only.
The rejection-log is append-only. Ghost writes to it. Sub-agents do not.
The Orchestrator receives the same verdict format regardless of which mode ran.
