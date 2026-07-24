// app/api/connections/merge/route.ts
//
// PATCH /api/connections/merge
// ----------------------------------------
// Merges two connections after the user explicitly confirms
// they are the same person. This is the ONLY place merging happens.
//
// Merge logic:
//   - Keep the target connection (the existing one)
//   - Move all history from the source to the target
//   - Archive the source connection
//   - Use the user's chosen canonical display_name
//
// The two-step pattern mirrors the draft approval gate:
//   POST /api/connections/standardize  → check (no write)
//   PATCH /api/connections/merge       → act (writes DB)

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const RequestSchema = z.object({
  source_id: z.string().uuid(),          // connection to be merged away (archived)
  target_id: z.string().uuid(),          // connection to keep
  canonical_name: z.string().min(1),    // the name the user chose to keep
})

export async function PATCH(request: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 })
  }

  const { source_id, target_id, canonical_name } = parsed.data
  const supabase = createServerClient()

  // Verify ownership of both connections
  const { data: connections } = await supabase
    .from('connections')
    .select('id, owner_id, display_name, base_warmth')
    .in('id', [source_id, target_id])
    .eq('owner_id', userId)

  if (!connections || connections.length !== 2) {
    return Response.json({ error: 'connections_not_found' }, { status: 404 })
  }

  const source = connections.find(c => c.id === source_id)
  const target = connections.find(c => c.id === target_id)

  if (!source || !target) {
    return Response.json({ error: 'invalid_ids' }, { status: 400 })
  }

  // ── Merge Steps ───────────────────────────────────────────────────────

  // 1. Move all history from source → target
  const { error: historyError } = await supabase
    .from('connection_history')
    .update({ connection_id: target_id })
    .eq('connection_id', source_id)

  if (historyError) {
    console.error('[merge] History migration failed:', historyError)
    return Response.json({ error: 'merge_failed' }, { status: 500 })
  }

  // 2. Update target with canonical name and best warmth
  //    Take the higher base_warmth of the two — generous interpretation
  const bestBaseWarmth = Math.max(source.base_warmth, target.base_warmth)

  const { error: updateError } = await supabase
    .from('connections')
    .update({
      display_name: canonical_name,
      base_warmth: bestBaseWarmth,
    })
    .eq('id', target_id)

  if (updateError) {
    console.error('[merge] Target update failed:', updateError)
    return Response.json({ error: 'merge_failed' }, { status: 500 })
  }

  // 3. Archive the source (never hard-delete — preserve audit trail)
  const { error: archiveError } = await supabase
    .from('connections')
    .update({ status: 'archived' })
    .eq('id', source_id)

  if (archiveError) {
    console.error('[merge] Source archive failed:', archiveError)
    return Response.json({ error: 'merge_failed' }, { status: 500 })
  }

  // 4. Log the merge in history
  await supabase.from('connection_history').insert({
    connection_id: target_id,
    owner_id: userId,
    event_type: 'note',
    content: `Merged with duplicate connection "${source.display_name}"`,
    metadata: {
      merge_source_id: source_id,
      merge_source_name: source.display_name,
      canonical_name,
    },
  })

  return Response.json({
    ok: true,
    merged_into: target_id,
    canonical_name,
  })
}
