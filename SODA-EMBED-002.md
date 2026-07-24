# SODA-EMBED-002 · Ambient Chip Matching and Room Nudges
**Supersedes:** SODA-EMBED-001 (score-based matching, retired)
**Assigned to:** Kennis (backend) · Aniya (frontend) · Nelson (data)
**Gate:** Ghost reviews before any surface ships
**Priority:** P1 · BTW Cincinnati deliverable · July 14
**Session reference:** Working session June 23, 2026

---

## WHAT CHANGED FROM SODA-EMBED-001

SODA-EMBED-001 surfaced a numeric match score (0–99) on match cards and
the attendee table. That is wrong for Equalpoint's language system and
wrong for SODA's product posture.

**Scores are removed entirely.** No number, percentage, rank, or rating
appears anywhere in the UI. Not in small text. Not in a tooltip. Not in
a developer-facing log that could leak to the client.

**What replaces scores:** ambient nudges. The system still computes
offer-need arc distance internally. That computation drives which names
are surfaced, in what order, and with what language. But the user sees
only: a name, a reason in plain English, and an action. Nothing numerical.

The existing SODA chip system (chip selection at check-in, chip exchange
between attendees, the match inbox) is the integration point. This
feature does not add a new surface. It adds intelligence to what already
exists.

---

## NON-NEGOTIABLES BEFORE ANY CODE

Read these before touching anything:

- `references/schema.md`: full Postgres schema
- `references/api-routes.md`: all API endpoints
- `lib/warmth/formula.ts`: warmth formula, never reimplemented inline
- `CLAUDE.md`: binding rules; all seven hold for this feature

**Rules specific to this feature:**

- No score, number, percentage, or rank is ever shown to any user. Ever.
- Match order is the only signal the UI exposes. First is not labeled "best."
- Nudge language is the only warmth signal. Plain English. No digits.
- Vectors stay server-side. No client-side vector math. No raw floats in API responses.
- Embeddings invalidate when chips change. `chip_hash` detects staleness.
- All secrets via Doppler. No `.env` commits.
- RLS on every table, immediately, before any data flows through it.
- loop_events rows are append-only. Never updated or deleted.

---

## WHAT THE SYSTEM DOES

### The internal computation (invisible to users)

At check-in, when an attendee finalizes their chips, the system computes
a 384-dimensional vector for that person from their chip profile. This
happens server-side in a Vercel edge function. The vector is stored in
Supabase with pgvector. The attendee never sees it.

When the match surface loads, the system runs a pgvector cosine similarity
query to find the attendees whose offer vectors are closest to this
person's need vector, and vice versa. The result is an ordered list.
The system uses that order to decide what nudges to surface and what
reason strings to build. The order is never exposed. The computation
is never exposed. Only the nudge is exposed.

### The external output (what users see)

Three nudge types, all plain English, all action-first:

**Room nudge (operator-facing only)**
A signal in the operator view that names a gap, a bridge at risk,
or a cluster with unmet needs. Plain declarative sentence. No numbers.
Example: "Nine people in this room are looking for legal counsel.
No one has offered it. Consider flagging this from the stage."

**Match nudge (attendee-facing)**
A suggestion in the attendee's match inbox that names one person and
gives one plain-English reason. The reason cites only chip facts: what the other person offers or needs: never a computed property.
Example: "Kofi offers grant writing expertise. You listed grant
opportunities as something you are looking for."

**Bridge nudge (operator-facing only)**
A signal that a specific attendee is positioned to connect two worlds
that are not yet connecting. Names the person and the two worlds.
No centrality score. No ranking.
Example: "Noor connects the Capital Table world and the Founders world.
She has had two requests this session. Route new asks thoughtfully."

---

## SECTION 1: DATABASE CHANGES (Kennis)

### What carries over from SODA-EMBED-001

The three migration files from SODA-EMBED-001 are still correct:
- `001_enable_pgvector.sql`: no change
- `002_person_embeddings.sql`: no change
- `005_vector_indexes.sql`: no change

### What changes

**Drop the match_score column from soda_chip_matches.**
The table still exists but the numeric score column is removed.
The system uses the row's existence and the `shown_to_a`,
`shown_to_b`, and `loop_closed` flags. Order is determined at
query time by pgvector distance, not by a stored score.

```sql
-- 006_remove_match_score.sql
ALTER TABLE soda_chip_matches DROP COLUMN IF EXISTS match_score;
ALTER TABLE soda_chip_matches DROP COLUMN IF EXISTS offer_need_fit;
ALTER TABLE soda_chip_matches DROP COLUMN IF EXISTS focus_alignment;
ALTER TABLE soda_chip_matches DROP COLUMN IF EXISTS arc_distance;

-- Add reason string instead: plain English, derived at compute time
ALTER TABLE soda_chip_matches ADD COLUMN reason TEXT;
ALTER TABLE soda_chip_matches ADD COLUMN nudge_type TEXT
  CHECK (nudge_type IN ('match', 'bridge', 'gap'));
```

**Drop the heat_map table.**
The visual heat map is deferred to V2. The operator view is functional,
text-based, and does not require UMAP coordinates.

```sql
-- 007_drop_heat_map.sql
DROP TABLE IF EXISTS soda_event_heat_map;
```

**Add operator_nudges table.**
Room-level signals for the operator view. Gap alerts, bridge load
signals, cluster signals. All plain text. No numbers stored.

```sql
-- 008_operator_nudges.sql
CREATE TABLE soda_operator_nudges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES soda_events(id) ON DELETE CASCADE,
  nudge_type  TEXT NOT NULL CHECK (nudge_type IN ('gap', 'bridge_load', 'cluster')),
  nudge_text  TEXT NOT NULL,
  action_text TEXT,
  resolved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE soda_operator_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "host_reads_nudges"
  ON soda_operator_nudges FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM soda_events WHERE host_id = auth.uid()
    )
  );

CREATE POLICY "service_writes_nudges"
  ON soda_operator_nudges FOR ALL
  USING (auth.role() = 'service_role');
```

---

## SECTION 2: TYPES (Kennis)

Replace the score-bearing types from SODA-EMBED-001 with these.
The PersonEmbedding type is unchanged. Remove ChipMatch and replace
with NudgeMatch.

```typescript
// lib/soda/matching/types.ts

// Internal only: never serialized to client
export interface PersonEmbedding {
  attendeeId:     string
  eventId:        string
  fullVector:     number[]
  offersVector:   number[]
  needsVector:    number[]
  focusVector:    number[]
  resourceVector: number[]
  titleVector:    number[]
  chipHash:       string
  modelVersion:   string
}

// What the client receives: no numbers anywhere
export interface NudgeMatch {
  attendeeId:  string
  displayName: string
  title:       string
  worldName:   string
  worldColor:  string
  reason:      string   // plain English, chip-derived only
  nudgeType:   'match' | 'bridge' | 'gap'
  isBridge:    boolean
}

export interface OperatorNudge {
  id:          string
  nudgeType:   'gap' | 'bridge_load' | 'cluster'
  nudgeText:   string
  actionText:  string | null
  resolved:    boolean
}

// EmbeddingWeights: internal only, never exposed
export const DEFAULT_WEIGHTS = {
  offers:    0.30,
  needs:     0.30,
  focus:     0.20,
  resources: 0.12,
  title:     0.08,
} as const
```

---

## SECTION 3: REASON BUILDER (Nelson + Kennis)

The reason string is the only output the user sees from the matching
system. It must be plain English, cite only chip facts, and never
reference a computed property, a score, or a ranking.

Nelson owns the logic for which chip pairs produce which reason strings.
Kennis owns the TypeScript implementation.

```typescript
// lib/soda/matching/reason.ts

interface ChipOverlap {
  theirOfferYourNeed: string[]  // what they offer that you need
  yourOfferTheirNeed: string[]  // what you offer that they need
  sharedFocus:        string[]  // shared focus world
}

export function buildReason(
  forAttendee: { name: string; offers: string[]; needs: string[] },
  matchAttendee: { name: string; offers: string[]; needs: string[] },
  overlap: ChipOverlap
): string {
  const first = matchAttendee.name.split(' ')[0]

  // Priority 1: they offer what you need
  if (overlap.theirOfferYourNeed.length > 0) {
    const chip = overlap.theirOfferYourNeed[0]
    return `${first} offers ${chip.toLowerCase()}. You listed that as something you are looking for.`
  }

  // Priority 2: you offer what they need
  if (overlap.yourOfferTheirNeed.length > 0) {
    const chip = overlap.yourOfferTheirNeed[0]
    return `You offer ${chip.toLowerCase()}. ${first} is looking for exactly that.`
  }

  // Priority 3: both are bidirectional
  if (overlap.theirOfferYourNeed.length > 0 && overlap.yourOfferTheirNeed.length > 0) {
    return `${first} offers what you need, and you offer what they need. Worth a conversation.`
  }

  // Priority 4: shared focus world
  if (overlap.sharedFocus.length > 0) {
    return `You and ${first} are both working in ${overlap.sharedFocus[0]}.`
  }

  // Fallback: cross-world signal only: do not surface without at least this
  return `${first} works in a world that connects to yours.`
}

// Gap nudge language: operator facing
export function buildGapNudge(
  chipLabel: string,
  needCount: number,
  offerCount: number
): string {
  if (offerCount === 0) {
    return `People in this room are looking for ${chipLabel.toLowerCase()}. No one has offered it yet. Consider flagging this from the stage.`
  }
  return `${needCount} people are looking for ${chipLabel.toLowerCase()}. Only ${offerCount === 1 ? 'one person has' : `${offerCount} people have`} offered it. Route introductions thoughtfully.`
}

// Bridge load nudge: operator facing
export function buildBridgeLoadNudge(
  bridgeName: string,
  worldA: string,
  worldB: string,
  requestCount: number
): string {
  const load = requestCount >= 4
    ? 'high load this session'
    : 'active this session'
  return `${bridgeName} connects ${worldA} and ${worldB}: ${load}. Route new asks to them only if the fit is strong.`
}
```

**Reason language rules (enforced in code review):**

- Sentences begin with a name or "You." Never "Based on your chips" or similar.
- Only chip labels are quoted. No computed terms (arc distance, similarity, fit).
- No qualitative strength words: not "strong match," not "great fit," not "highly compatible."
- The reason ends with an invitation to act or a plain statement of fact. Never a call to urgency.
- If no chip overlap exists, the match is not surfaced. Do not build a reason from nothing.

---

## SECTION 4: API ROUTES (Kennis)

### POST /api/soda/embed
Unchanged from SODA-EMBED-001. Runs at chip finalization. Computes
and stores vectors. Triggers match recompute. Returns `{ status }`.
Never returns a vector or a score to the caller.

### GET /api/soda/matches
Returns ordered NudgeMatch list for one attendee. No scores in the
response. Order is determined by pgvector distance. Reason strings
are built server-side before the response is sent.

```typescript
// app/api/soda/matches/route.ts

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const attendeeId = searchParams.get('attendeeId')
  const eventId    = searchParams.get('eventId')
  if (!attendeeId || !eventId) {
    return Response.json({ error: 'missing params' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })

  // Get requesting attendee's chip profile and vectors
  const { data: me } = await supabase
    .from('soda_person_embeddings')
    .select('offers_vector, needs_vector, full_vector')
    .eq('attendee_id', attendeeId)
    .eq('event_id', eventId)
    .single()

  if (!me) return Response.json({ matches: [] })

  // Get requesting attendee's chips for reason building
  const { data: myChips } = await supabase
    .from('soda_attendees')
    .select('display_name, chips')
    .eq('id', attendeeId)
    .single()

  // pgvector nearest-neighbor: find closest by offer-need arc
  // Returns attendee metadata + chip data for reason building
  // Does NOT return vectors or scores to this route
  const { data: candidates } = await supabase.rpc('get_ambient_matches', {
    p_attendee_id:   attendeeId,
    p_event_id:      eventId,
    p_offers_vector: me.offers_vector,
    p_needs_vector:  me.needs_vector,
    p_limit:         8,
  })

  // Build NudgeMatch array: no numbers, reasons only
  const matches: NudgeMatch[] = (candidates ?? [])
    .map((c: any) => {
      const overlap = computeOverlap(myChips?.chips, c.chips)
      if (!overlap.theirOfferYourNeed.length &&
          !overlap.yourOfferTheirNeed.length &&
          !overlap.sharedFocus.length) {
        return null // no meaningful overlap: do not surface
      }
      return {
        attendeeId:  c.attendee_id,
        displayName: c.display_name,
        title:       c.title,
        worldName:   c.world_name,
        worldColor:  c.world_color,
        reason:      buildReason(myChips, c, overlap),
        nudgeType:   'match' as const,
        isBridge:    c.is_bridge ?? false,
      }
    })
    .filter(Boolean)
    .slice(0, 5)

  // Log shown events to loop_events
  await supabase.from('loop_events').insert(
    matches.map(m => ({
      event_id:    eventId,
      actor_id:    attendeeId,
      target_id:   m!.attendeeId,
      type:        'match_shown',
      shown_at:    new Date().toISOString(),
      // no score field: intentional
    }))
  )

  return Response.json({ matches })
}

function computeOverlap(myChips: any, theirChips: any): ChipOverlap {
  const myOffers  = myChips?.offers  ?? []
  const myNeeds   = myChips?.needs   ?? []
  const myFocus   = myChips?.focus   ?? []
  const theirOffers = theirChips?.offers ?? []
  const theirNeeds  = theirChips?.needs  ?? []
  const theirFocus  = theirChips?.focus  ?? []

  return {
    theirOfferYourNeed: theirOffers.filter((o: string) => chipPairs(o, myNeeds)),
    yourOfferTheirNeed: myOffers.filter((o: string)    => chipPairs(o, theirNeeds)),
    sharedFocus:        myFocus.filter((f: string)     => theirFocus.includes(f)),
  }
}

function chipPairs(offer: string, needs: string[]): boolean {
  return needs.some(need => OFFER_NEED_PAIRS.some(
    ([o, n]) => (offer === o && need === n) || (offer === n && need === o)
  ))
}
```

### Postgres function: get_ambient_matches

```sql
-- 009_ambient_matches_fn.sql
CREATE OR REPLACE FUNCTION get_ambient_matches(
  p_attendee_id   UUID,
  p_event_id      UUID,
  p_offers_vector VECTOR(384),
  p_needs_vector  VECTOR(384),
  p_limit         INT DEFAULT 8
)
RETURNS TABLE (
  attendee_id  UUID,
  display_name TEXT,
  title        TEXT,
  world_name   TEXT,
  world_color  TEXT,
  chips        JSONB,
  is_bridge    BOOLEAN
)
LANGUAGE sql STABLE
AS $$
  SELECT
    a.id                                AS attendee_id,
    a.display_name,
    a.title,
    w.name                              AS world_name,
    w.color                             AS world_color,
    a.chips,
    a.is_bridge
  FROM soda_person_embeddings e
  JOIN soda_attendees a  ON a.id = e.attendee_id
  JOIN soda_worlds    w  ON w.id = a.world_id
  WHERE e.event_id    = p_event_id
    AND e.attendee_id != p_attendee_id
  ORDER BY
    -- arc distance: my offers to their needs + their offers to my needs
    (e.needs_vector  <=> p_offers_vector) +
    (e.offers_vector <=> p_needs_vector)
  LIMIT p_limit;
$$;
```

### GET /api/soda/operator/nudges
Returns operator nudges for the event. Gap alerts, bridge load signals.
Operator-facing only. Attendees cannot call this route.

```typescript
// app/api/soda/operator/nudges/route.ts
// Returns OperatorNudge[] for the authenticated host only.
// All nudge text is pre-built at compute time.
// No numbers in any nudge string.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')
  const supabase = createRouteHandlerClient({ cookies })

  // Verify the caller is the event host
  const { data: event } = await supabase
    .from('soda_events')
    .select('host_id')
    .eq('id', eventId)
    .single()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || event?.host_id !== user.id) {
    return Response.json({ error: 'unauthorized' }, { status: 403 })
  }

  const { data: nudges } = await supabase
    .from('soda_operator_nudges')
    .select('id, nudge_type, nudge_text, action_text, resolved')
    .eq('event_id', eventId)
    .eq('resolved', false)
    .order('created_at', { ascending: false })

  return Response.json({ nudges: nudges ?? [] })
}
```

---

## SECTION 5: NUDGE COMPUTE JOB (Nelson)

Nelson owns this. It runs as a Supabase edge function on a five-minute
cron, or on-demand when check-in count changes significantly.

The job scans the event for three signal types and writes to
`soda_operator_nudges`. It clears stale nudges (resolved or outdated)
before each run for the event.

```typescript
// supabase/functions/compute-nudges/index.ts

// Gap detection: chip labels where need count > offer count * 2
// Language: buildGapNudge() from reason.ts

// Bridge load detection: attendees flagged is_bridge with
// loop_events 'match_shown' count > 3 in the last 60 minutes
// Language: buildBridgeLoadNudge() from reason.ts

// Cluster signal: worlds where more than 60% of attendees
// have the same unmet need
// Language: plain declarative sentence naming the world and the need

// Rules:
// - Never write a number into nudge_text or action_text
// - Never write a score, rank, or percentage
// - Maximum 8 nudges active at one time per event
// - Resolved nudges are never rewritten unless the signal recurs
// - Each nudge has one clear action or is purely informational
```

---

## SECTION 6: LOOP EVENTS (Kennis)

All loop events from SODA-EMBED-001 carry over. One addition: remove
any score or numeric field from loop event rows. The row existence and
type are the signal. Numbers are not.

```typescript
// match_shown: attendee saw a nudge match
await supabase.from('loop_events').insert({
  event_id:    eventId,
  actor_id:    attendeeId,
  target_id:   matchAttendeeId,
  type:        'match_shown',
  shown_at:    new Date().toISOString(),
  // no score field
})

// match_tapped: attendee tapped a nudge to see full profile
await supabase.from('loop_events').insert({
  event_id:     eventId,
  actor_id:     attendeeId,
  target_id:    matchAttendeeId,
  type:         'match_tapped',
  tapped_at:    new Date().toISOString(),
})

// intro_facilitated: operator tapped "Introduce" on a match card
await supabase.from('loop_events').insert({
  event_id:      eventId,
  actor_id:      operatorId,
  target_id:     attendeeAId,
  secondary_id:  attendeeBId,
  type:          'intro_facilitated',
  facilitated_at:new Date().toISOString(),
})

// loop_closed: both attendees confirmed they met
await supabase.from('loop_events').insert({
  event_id:   eventId,
  actor_id:   attendeeAId,
  target_id:  attendeeBId,
  type:       'loop_closed',
  closed_at:  new Date().toISOString(),
})
```

---

## SECTION 7: DISPLAY COMPONENTS (Aniya)

Aniya owns all surfaces. Four components total.

### NudgeMatchCard

The only attendee-facing match surface. Shows one suggested person.
No score. No rank. No "top match" label.

```typescript
// components/soda/NudgeMatchCard.tsx
'use client'

interface Props {
  match: NudgeMatch
  onTap: (attendeeId: string) => void
}

// Visual hierarchy:
//   1. Avatar (world color)
//   2. Display name
//   3. Title + world name (muted)
//   4. Reason string (the only intelligent content: give it space)
//   5. Bridge indicator (⌁ if isBridge, no label beyond the mark)
//   6. Single CTA: "Learn more": opens profile sheet

// Rules:
// - Reason string gets its own line and its own text treatment
//   It is not a subtitle. It is the point of the card.
// - No badge, tag, or label reading "match" or "recommended"
// - No visual indicator of match strength (no bar, ring, dot)
// - isBridge shown as ⌁ mark only: no "bridge" text label
// - Tap logs match_tapped to loop_events before navigation
// - SkeletonLoader for async state
// - data-testid="nudge-match-card" on root element
```

### NudgeMatchList

Container for the attendee's match inbox. Ordered list of NudgeMatchCards.
No header reading "Your matches" or "Recommended": let the cards speak.

```typescript
// components/soda/NudgeMatchList.tsx
// Rules:
// - Empty state: "Check back as more people check in."
//   Not "No matches found." Not blank.
// - Maximum 5 cards shown at once
// - No "see more" or pagination: 5 is the list
// - data-testid="nudge-match-list" on root element
```

### OperatorNudgePanel

Operator-facing only. Shows gap alerts, bridge load warnings, cluster signals.
Plain text, one action per nudge, dismiss to resolve.

```typescript
// components/soda/OperatorNudgePanel.tsx
// Rules:
// - Every nudge is one sentence. No more.
// - action_text is the secondary sentence if present.
// - Dismiss button marks resolved=true via PATCH /api/soda/operator/nudges/[id]
// - Bridge load nudges render with the ⌁ mark before the name
// - Gap nudges render with no icon: the text carries it
// - No sorting UI: most recent at top, resolved disappear
// - data-testid="operator-nudge-panel" on root element
```

### AttendeeDetailSheet

Slide-up sheet when an attendee is tapped in the operator view.
Shows chips only. No match scores. One "Facilitate intro" button that
opens the introduction flow.

```typescript
// components/soda/AttendeeDetailSheet.tsx
// Rules:
// - Offers in world color chip pills
// - Needs in muted chip pills
// - No computed properties shown
// - "Facilitate intro" button logs intro_facilitated to loop_events
// - data-testid="attendee-detail-sheet" on root element
```

---

## SECTION 8: LANGUAGE LOCKOUT (All agents)

These strings may never appear anywhere in the SODA chip matching system.
Not in UI copy. Not in API responses. Not in operator-facing text.
Not in developer-facing logs that could surface to any client.

```
LOCKED OUT:
  match score
  score
  match strength
  compatibility
  compatible
  similarity
  recommended
  top match
  best match
  ranked
  ranking
  [any digit] out of [any digit]
  [any percentage]
  [any decimal representing a computed property]
```

Ghost checks for all of these in code review. Any occurrence is a P0 block.

---

## SECTION 9: GHOST VERIFICATION CHECKLIST

Ghost reviews before any surface ships. Every item.

```
EMBEDDING
[ ] Vectors never returned to client. API responses contain only plain text.
[ ] chip_hash staleness check in place: no redundant recomputation
[ ] Embedding API key via Doppler only
[ ] RLS on soda_person_embeddings tested: attendee reads own record only

MATCHING
[ ] No score, rank, percentage, or numeric strength indicator anywhere in UI
[ ] No "match", "recommended", "top", "best" labels on match surfaces
[ ] Reason strings cite chip labels only: no computed terms
[ ] Null filtering: matches without chip overlap are not surfaced
[ ] Maximum 5 NudgeMatchCards shown per attendee
[ ] match_shown logged to loop_events for every card rendered
[ ] match_tapped logged before navigation on card tap

OPERATOR NUDGES
[ ] No numbers in nudge_text or action_text
[ ] Bridge load nudges flag only when request count exceeds threshold
[ ] Nudge compute job clears stale nudges before each run
[ ] Operator route verifies host_id before returning nudges
[ ] Maximum 8 nudges active at one time per event

LOOP EVENTS
[ ] No score or numeric field in any loop_events row from this feature
[ ] loop_closed fires only when both attendees confirm meeting
[ ] loop_events is append-only: no updates or deletes

LANGUAGE
[ ] Ghost string search passes: none of the locked-out terms present
[ ] Empty states use invitation language not failure language
[ ] Bridge indicator is ⌁ mark only, no "bridge" text label

GENERAL
[ ] All new tables have RLS before any data flows through them
[ ] Migrations numbered sequentially and committed before code that uses them
[ ] data-testid on all interactive elements
[ ] SkeletonLoader on all async states, no spinners
```

---

## VERSION MAP

```
V1 · BTW July 14:
  Embedding at check-in
  Ambient match nudges in attendee inbox (5 max, reason strings)
  Operator nudge panel (gaps, bridge load)
  loop_events logging for Study One

V2 · September 14 launch:
  UMAP heat map visualization (spatial layout, no numbers)
  Bridge arc display (offer-need lines between worlds)
  Cluster density layer (world glow, no labels or metrics)

V3 · Post-launch:
  Equalpoint handoff (event match seeds Equalpoint warmth clock)
  Three-sided scoring (burden signal integrated with Equalpoint graph)
  Longitudinal loop analysis (Study One findings feed calibration)
```

Each version earns the next one.

---

*SODA-EMBED-002 · June 23, 2026*
*Kennis (backend) · Aniya (frontend) · Nelson (data) · Ghost (gate)*
*Supersedes SODA-EMBED-001*
