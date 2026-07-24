// app/api/connections/standardize/route.ts
//
// POST /api/connections/standardize
// ----------------------------------------
// Called before a connection is written to check for duplicates.
// Returns StandardizationResult for the UI to act on.
//
// This is a CHECK endpoint — it does not write anything.
// The existing POST /api/connections endpoint writes the connection.
// The UI decides whether to show a merge prompt based on this response.
//
// Flow:
//   User fills connection form
//     → FE calls POST /api/connections/standardize (this route)
//     → If duplicates found → show DuplicateWarningBanner
//     → User confirms "yes same person" → call PATCH /api/connections/merge
//     → User dismisses → proceed with original POST /api/connections

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { standardizeName } from '@/lib/standardization/engine'
import { DEFAULT_CONFIG } from '@/lib/standardization/types'
import { z } from 'zod'

const RequestSchema = z.object({
  display_name: z.string().min(1).max(255),
})

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 })
  }

  const { display_name } = parsed.data
  const supabase = createServerClient()

  // Fetch all existing connections for this owner
  // Only fields needed for standardization — not the full record
  const { data: existingConnections, error } = await supabase
    .from('connections')
    .select('id, owner_id, display_name, title, city, tags, meeting_context')
    .eq('owner_id', userId)
    .neq('status', 'archived')

  if (error) {
    console.error('[standardize] Failed to fetch connections:', error)
    return Response.json({ error: 'fetch_failed' }, { status: 500 })
  }

  const result = await standardizeName(
    display_name,
    existingConnections ?? [],
    DEFAULT_CONFIG
  )

  // Only return high and medium confidence duplicates to the UI
  // Low confidence matches are logged but not surfaced
  const surfacedDuplicates = result.duplicates.filter(
    d => d.confidence === 'high' || d.confidence === 'medium'
  )

  return Response.json({
    ...result,
    duplicates: surfacedDuplicates,
    ai_available: !!process.env.ANTHROPIC_API_KEY,
  })
}
