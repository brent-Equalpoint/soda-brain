# Endpoint Map
## God Made Weapon | Ghost QA
## Live Testing Agent reads this before firing anything.
## Brianna's deployment brief identifies which endpoints are in scope per build.
## This file is updated by Kennis Beck whenever an endpoint is added, modified, or removed.

---

## Always-Test Endpoints

These fire on every Mode 2 run regardless of build scope.

---

### POST /api/draft

Purpose: Generate a nudge draft for a connection. No database write.

Request:
```json
{
  "connectionId": "uuid",
  "userId": "uuid"
}
```

Expected response (200):
```json
{
  "draft": "string — generated nudge text",
  "connectionId": "uuid",
  "generatedAt": "ISO 8601 timestamp"
}
```

Pass conditions:
- Status 200
- Response contains `draft` string (non-empty)
- No database row created (verify: query draft_history table before and after — row count unchanged)
- Response time < 5000ms

Edge cases:
- connectionId not found → 404 `{ "error": "Connection not found" }`
- connectionId belongs to different user → 403 `{ "error": "Forbidden" }`
- Expired session → 401 `{ "error": "Unauthorized" }`
- Claude API unavailable → 503 `{ "error": "Draft generation unavailable" }`

---

### POST /api/draft/approve

Purpose: Write an approved draft to the database, send the nudge, reset warmth.

Request:
```json
{
  "connectionId": "uuid",
  "userId": "uuid",
  "draft": "string — the approved draft text"
}
```

Expected response (200):
```json
{
  "success": true,
  "connectionId": "uuid",
  "sentAt": "ISO 8601 timestamp",
  "warmthReset": true
}
```

Pass conditions:
- Status 200
- Row written to draft_history
- Warmth score reset to base_warmth for this connection
- last_notified updated on connection record
- Nudge delivered (or queued if async)

Edge cases:
- Missing draft body → 400 `{ "error": "Draft required" }`
- Connection already received nudge within 7 days → 409 `{ "error": "Notification cap reached" }`
- Expired session → 401

---

### GET /api/connections

Purpose: Return the authenticated user's connection list with current warmth data.

Request: Authenticated. No body.

Expected response (200):
```json
{
  "connections": [
    {
      "id": "uuid",
      "name": "string",
      "warmthTier": "in rhythm | it's been a while",
      "lastContact": "ISO 8601 timestamp | null",
      "createdAt": "ISO 8601 timestamp"
    }
  ]
}
```

Pass conditions:
- Status 200
- Response contains only connections belonging to authenticated user (RLS check)
- No raw warmth_score in response body
- No numeric tier in response body
- Empty array (not 404) when user has no connections

Edge cases:
- Expired session → 401
- User with no connections → 200 `{ "connections": [] }`

---

### POST /api/connections

Purpose: Create a new connection after QR scan.

Request:
```json
{
  "userId": "uuid",
  "scannedUserId": "uuid",
  "eventContext": "string | null"
}
```

Expected response (201):
```json
{
  "connectionId": "uuid",
  "warmthInitialized": true,
  "createdAt": "ISO 8601 timestamp"
}
```

Pass conditions:
- Status 201
- Connection row created in connections table
- Warmth record initialized with base_warmth
- RLS policy applies immediately

Edge cases:
- Connection already exists between these two users → 409 `{ "error": "Connection already exists" }`
- scannedUserId is the same as userId → 400 `{ "error": "Cannot connect to yourself" }`
- Expired session → 401

---

### DELETE /api/connections/:connectionId

Purpose: Remove a connection.

Request: Authenticated. connectionId in path.

Expected response (200):
```json
{ "success": true }
```

Pass conditions:
- Status 200
- Connection row removed
- Warmth record removed
- Draft history for this connection retained (for discard signal integrity)

Edge cases:
- connectionId not found → 404
- connectionId belongs to different user → 403
- Expired session → 401

---

## Warmth Cron Endpoint

### POST /api/cron/warmth-decay

Purpose: Triggered by pg_cron nightly. Decays all warmth scores. Updates status. Respects notification cap.

Request:
```json
{
  "cronSecret": "string from env"
}
```

Expected response (200):
```json
{
  "processed": number,
  "decayed": number,
  "notificationsSent": number,
  "notificationsSkipped": number,
  "errors": []
}
```

Pass conditions:
- Status 200
- All connections processed
- Warmth decayed using formula: max(0, round(base_warmth * e^(-0.01 * days_since_contact)))
- Notification cap respected (max 1 per connection per 7 days)
- Connections with null warmth score skipped and logged
- New connections (< 1 day old) skipped from decay

Edge cases:
- Invalid cronSecret → 401
- Database timeout on large user set → 503, partial process logged

---

## Endpoint Maintenance Notes

- Kennis Beck updates this file when any endpoint is added, changed, or removed.
- Ghost flags any endpoint not in this map that appears in Brianna's deployment brief as a P2 documentation finding.
- Ghost flags any endpoint in this map that returns a shape different from what is documented as a P1 finding.
- This file does not include internal Supabase triggers or pg_cron schedules — those are in the schema documentation.
