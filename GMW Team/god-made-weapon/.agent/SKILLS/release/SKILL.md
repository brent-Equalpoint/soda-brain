# SKILL: release
## God Made Weapon — Deployment Playbook
### Loaded by: Brianna Ops
### Triggered when: Deploy phase begins on Ghost-cleared work

> The rollback is always written before the deploy begins.
> If you cannot explain how to undo it, you are not ready to do it.

---

## Gate: Load Only If

- Ghost has issued CLEAR TO SHIP or CONDITIONAL SHIP
- Task branch has been reviewed by Ghost

If Ghost has issued HOLD, there are open Critical/High bugs, or no Ghost clearance exists: stop immediately. Use the STOP format from AGENTS.md Section 4.

---

## Step 0: Read Before Touching Infrastructure

Read in order:
1. `.agent/AGENTS.md`
2. `agents/brianna-ops.md`
3. `docs/PLAN.md`
4. `docs/qa/GMW-###.md` — Ghost's QA report

Extract from handoff briefs:
- **Kennis Beck:** env vars required, migrations required, infrastructure notes
- **Aniya Fronte:** build requirements, static asset notes, frontend env vars
- **Ghost:** ship recommendation, conditional terms, infrastructure bugs to fix first, known weak points

Do not proceed until all extraction fields are filled.

---

## Step 1: Pre-Deployment Gate

Every box must be checked before any deploy command runs.

**Code**
- [ ] Ghost: CLEAR TO SHIP or CONDITIONAL SHIP
- [ ] No open Critical or High bugs
- [ ] All code committed, no uncommitted changes
- [ ] Branch up to date with base, no merge conflicts
- [ ] CI pipeline passed (tests green, lint clean, build succeeds)

**Environment**
- [ ] All env vars from Kennis Beck's handoff set in target environment
- [ ] All frontend env vars (NEXT_PUBLIC_*) set
- [ ] Secrets in secrets manager, not in repo `.env` files
- [ ] `.env.example` updated with placeholder values
- [ ] No `localhost` URLs in environment config
- [ ] SSL certificate valid, not expiring within 30 days

**Database**
- [ ] Migrations reviewed
- [ ] Rollback scripts exist and tested in staging
- [ ] Database backup taken immediately before migration deploy
- [ ] Migrations tested successfully in staging first
- [ ] No destructive migrations without human approval (stopping condition)

**Infrastructure**
- [ ] Rollback plan written (Step 2 — do this before continuing)
- [ ] Monitoring configured for new feature (Step 5)
- [ ] CDN cache invalidation plan exists if assets changed
- [ ] Cost implications documented and approved

**Communication**
- [ ] Human notified deployment is beginning
- [ ] Deploy window is appropriate

---

## Step 2: Rollback Plan — Write Before Deploy

```markdown
## Rollback Plan — GMW-###
Written: [before deploy] | Acknowledged by human: Yes / No

### Trigger — rollback immediately if within 60 min of deploy:
- Error rate exceeds [N]% (baseline: ___%)
- API response time exceeds [N]ms (baseline: ___ms)
- Any Critical bug reported by users or monitoring
- [Task-specific trigger if any]

### Application Code Rollback
1. [Exact command or UI step]
2. Verify: [How to confirm rollback succeeded]

### Database Migration Rollback
[No migrations: state that explicitly]
[If migrations:]
1. Complete app rollback first
2. [Exact rollback command]
3. Verify: `npx prisma migrate status` — confirm rolled back

### Environment and CDN
[Env vars changed: list what to revert]
[Assets changed: cache invalidation command]
[Nothing changed: state that explicitly]

### Post-Rollback Checks
- [ ] Application responding at [URL]
- [ ] Auth flow works
- [ ] Primary feature works
- [ ] No new errors in monitoring

### Escalation
If rollback fails: escalate to human immediately. No further changes without direction. Preserve all logs.
```

Attach to `docs/releases/GMW-###.md`. Human must acknowledge before proceeding to Step 3.

---

## Step 3: Deploy Sequence

Sequential. Each stage passes before the next begins.

### Stage 1: Staging

```
1. Deploy task branch to staging environment
2. Monitor pipeline: [ ] Build  [ ] Tests  [ ] Deploy  [ ] Health check
3. Run migrations on staging (if applicable): [ ] Complete  [ ] Data integrity check passes
4. Smoke test (minimum 3):
   [ ] App loads at staging URL
   [ ] Auth works with test account
   [ ] Primary new feature works
```

If any check fails: STOP. File the failure as a bug. Route to the appropriate agent. Wait for fix.
No staging environment: flag as Medium risk in release notes. Proceed with extra caution.

### Stage 2: Production

```
1. Confirm staging passed all checks
2. Confirm rollback plan exists and human is notified
3. Run migrations first (if migration-first strategy): backup → migrate → verify
4. Deploy application code
5. Monitor pipeline: [ ] Build  [ ] Tests  [ ] Deploy  [ ] Health check
6. Run post-deploy migrations (if migration-after strategy)
7. CDN cache invalidation (if assets changed): [ ] Triggered  [ ] New assets loading
8. Post-deploy smoke test (minimum 5):
   [ ] App loads at production URL, no errors
   [ ] SSL active (HTTPS, no cert warnings)
   [ ] Auth works
   [ ] Primary feature works end to end
   [ ] No new errors in monitoring (watch 5 min)
```

### Stage 3: 15-Minute Watch

Monitor for 15 minutes after production deploy:
- Error rate: any spike above baseline?
- API response times: any degradation?
- Server resources: CPU, memory, DB connections behaving normally?
- User reports: anything coming in?

Watch passes cleanly → proceed to Step 4.
Rollback condition triggered → execute rollback plan immediately.

---

## Step 4: Environment Variable Standards

- Naming: `ALL_CAPS_WITH_UNDERSCORES`. Public frontend: `NEXT_PUBLIC_*`.
- Storage: production and staging secrets in Doppler (or AWS Secrets Manager). Never in repo `.env` files.
- Every new var added to `.env.example` with a placeholder value and description comment.
- Document every var in release notes: name, purpose, environment, owner.

Config file ownership: `.eslintrc.json`, `.prettierrc`, `.eslintignore` → Brianna Ops / Human. `tsconfig.json` → Kennis Beck / Brianna Ops. Never modify without human approval.

---

## Step 5: CI/CD Pipeline Standard

Required stages in order:

```
Trigger → Install → Lint → Type check → Unit tests → Integration tests → Build
  → [Staging] Deploy → Smoke test
  → [Production, after staging] Deploy → Health check
```

Every stage fails the pipeline if it fails. No `continue-on-error` on test or build stages.
Pipeline failures send alerts immediately. Logs retained 30 days minimum. Secrets never printed in logs.

GitHub Actions default structure reference: `.github/workflows/deploy.yml`

---

## Step 6: Monitoring

Configure before deploy. Minimum stack:

| Layer | Default Tool | Watches |
|---|---|---|
| Application errors | Sentry | Exceptions, unhandled rejections, API errors |
| Infrastructure | CloudWatch or Datadog | CPU, memory, DB connections, disk |
| Uptime | Better Uptime or Datadog Synthetics | Is the app reachable? |
| API performance | Datadog APM or CloudWatch | Response times, throughput, error rates |

Default alert thresholds:

| Metric | Warning | Critical |
|---|---|---|
| Error rate | >1% | >5% |
| API p95 response | >500ms | >2000ms |
| CPU | >70% sustained | >90% sustained |
| Memory | >75% sustained | >90% sustained |
| Uptime | >1 min down | >5 min down |

Document every monitor configured in release notes.

---

## Step 7: Cost Documentation

```markdown
## Cost Estimate — GMW-###
| Resource | Type | Cost/month |
|---|---|---|
| [Service] | [Plan] | $[amount] |
| **Total** | | $[amount] |

### At 10x Load
| Resource | Projected change | Cost/month |
|---|---|---|
| **Total** | | $[amount] |
```

Flag for human acknowledgment: any single resource over $100/month, any config over $500/month at 10x load.

---

## Step 8: Release Document

Produce `docs/releases/GMW-###.md` after 15-minute watch passes.

```markdown
# Release Notes — GMW-###
## Task: [title] | Released by: Brianna Ops | Date: [marker] | Status: LIVE / ROLLED BACK

## What Shipped
[2-3 sentences. What deployed. What users can now do.]

## Deployment Summary
| Task branch | Merged to | Method | Migrations | Cache invalidated | Ghost clearance |
|---|---|---|---|---|---|

## Environment Variables
| Variable | Purpose | Environment | Owner |
|---|---|---|---|

## Infrastructure Changes
[What was added, changed, or removed]

## Deployment Architecture
[Text diagram: User → CDN → Frontend → Backend → Database → External services]

## Monitoring
| Monitor | Tool | Watches | Alert threshold | Alert goes to |
|---|---|---|---|---|

## Rollback Procedure
[Copy rollback plan from Step 2 in full]

## Cost Estimate
[From Step 7]

## Known Issues
[CONDITIONAL SHIP terms, Medium/Low bugs shipped, infrastructure gaps]

## Post-Deployment Checklist
- [ ] App live at production URL
- [ ] SSL active
- [ ] Auth verified in production
- [ ] Primary feature verified in production
- [ ] Monitoring active
- [ ] 15-minute watch complete
- [ ] Rollback plan accessible
- [ ] Release document complete
- [ ] CHANGELOG updated
- [ ] Human notified
```

---

## Step 9: CHANGELOG and Handoff

**CHANGELOG append:**
```markdown
## [GMW-###] [Title] — Brianna Ops — [marker]
### Released / Infrastructure / Environment / Monitoring / Known Issues
- [One line per item]
```

**Handoff to Ghost:** use the handoff brief format in `agents/brianna-ops.md`. Include: production URL, staging URL, how Ghost gets a test session, new endpoints, env var names, known weak points, rollback location.

---

## What Brianna Ops Never Does

- Deploy without Ghost CLEAR TO SHIP or CONDITIONAL SHIP
- Edit application code — code bugs route back to the owning agent
- Skip the rollback plan — no plan means no deploy
- Deploy migrations without an immediate pre-migration backup
- Store secrets in the repo in any form
- Close the session without the 15-minute watch
- Surprise the human with a production deploy

---

*God Made Weapon — release SKILL.md v1.1 — trimmed*
*Loaded by Brianna Ops. Read-only.*
