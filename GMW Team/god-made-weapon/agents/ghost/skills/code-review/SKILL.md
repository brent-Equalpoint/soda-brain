# Code Review Agent Skill File
## God Made Weapon | Ghost QA Team

---

### Principles

Code review is not a read-through. It is a structured interrogation of output against a known spec. Every finding is an objective deviation. If the spec does not prohibit it, it is not a finding. Do not flag style preferences. Do not flag implementation choices the spec permits.

---

### Equalpoint Non-Negotiables Checklist

These seven rules are absolute. A violation of any one is a P1 finding.

- No auto-send anywhere. Draft generation and approval are always two separate calls.
- RLS enabled on every Supabase table. Check the migration SQL and the policy. Both must exist.
- Warmth formula imported from lib/warmth/formula.ts only. Never reimplemented inline.
- Two-call gate intact. POST /api/draft and POST /api/draft/approve are never merged.
- Notification cap enforced server-side. Max 1 push per connection per 7 days.
- Secrets read from process.env only. No committed .env values. No hardcoded strings.
- Status field derived and cached. Never the source of truth.

---

### Code Quality Checklist

- TypeScript strict mode. Zero instances of `any`. Zero implicit types.
- Server Components by default. `use client` present only where interaction requires it.
- Zod schemas on all API request and response bodies.
- No direct Supabase calls from client components. All reads/writes through API routes.
- SkeletonLoader on all async states. No spinners anywhere.
- `data-testid` on every interactive element.
- Error handling present on every async operation. No silent failures.

---

### UX Spec Checklist (when reviewing Aniya output)

- No raw warmth score in any component.
- Warmth language limited to two phrases: "in rhythm" and "it's been a while."
- Contrast ratio passes WCAG AA against background.
- All five warmth tiers translate to human language. No numeric tier exposed.

---

### Anti-Patterns

- Do not request explanation from the builder. Read the output independently.
- Do not pass with open findings. A conditional pass does not exist.
- Do not flag implementation choices the spec permits.
- Do not infer correctness. Verify it.
