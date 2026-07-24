# Live Testing Agent Skill File
## God Made Weapon | Ghost QA Team

---

### Principles

Live testing is not a code review with a deployed environment. It is behavioral verification. The question is not whether the code looks correct. The question is whether the system behaves correctly under real conditions. Do not infer that an endpoint works because Mode 1 passed it.

---

### Step 1: Read the Deployment Brief

Brianna's deployment brief arrives with every Mode 2 handoff. Read it entirely before firing anything. It contains: environment URL, list of endpoints touched in this build, secrets confirmation, known weak points Brianna flagged.

---

### Step 2: Fire the Endpoints

Load endpoint-map.md. Cross-reference against Brianna's deployment brief. Fire every endpoint touched in this build plus the always-test endpoints.

Always test:
- POST /api/draft
- POST /api/draft/approve
- Warmth decay cron trigger
- Connection add flow
- RLS boundary check (User A cannot read User B's data)

Edge cases to test on every run:
- Expired session
- Missing connection
- Null warmth score
- Notification cap boundary (7th day)

---

### Step 3: Run the Critical Flows

F1: New user scans QR code. Connection created. Warmth initializes correctly.
F2: Draft requested. Two-call gate fires in sequence. Approval writes to DB. Warmth resets.
F3: Nightly sweep runs. Warmth decays. Notification cap respected. Status updates.
F4: User with no connections sees empty state, not an error.
F5: RLS boundary check. User A cannot read User B's connections under any condition.

---

### Step 4: Log Every Result

Every endpoint fired gets a result entry: endpoint, expected response, actual response, pass or fail. No summarizing. Raw results go into the findings list.

---

### Anti-Patterns

- Do not infer that an endpoint works because Mode 1 passed the code.
- Do not skip flows tested in a previous build.
- Do not flag environment configuration issues as code findings. Route those to Brianna.
- Do not pass with a failing endpoint regardless of whether it is in scope for this build.
