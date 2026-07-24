// components/DuplicateWarningBanner.tsx
//
// DuplicateWarningBanner
// ----------------------------------------
// Shown in the connection creation form when the standardization
// engine finds potential duplicate connections.
//
// Renders differently based on confidence:
//   high   → "This looks like an existing contact" + merge prompt
//   medium → "This might be an existing contact" + soft suggestion
//
// User choices:
//   "Yes, same person" → calls /api/connections/merge
//   "No, different person" → dismisses, proceeds with original create
//
// This component never auto-merges. User decides. Always.
// This mirrors the approval gate pattern from the AI draft flow.

'use client'

import { useState } from 'react'
import type { DuplicateCandidate } from '@/lib/standardization/types'

interface Props {
  candidates: DuplicateCandidate[]
  incomingName: string
  onMerge: (targetId: string, canonicalName: string) => Promise<void>
  onDismiss: () => void
  aiAvailable: boolean
}

export function DuplicateWarningBanner({
  candidates,
  incomingName,
  onMerge,
  onDismiss,
  aiAvailable,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [chosenName, setChosenName] = useState(incomingName)
  const [merging, setMerging] = useState(false)
  const [showNamePicker, setShowNamePicker] = useState(false)

  if (candidates.length === 0) return null

  const highConfidence = candidates.filter(c => c.confidence === 'high')
  const mediumConfidence = candidates.filter(c => c.confidence === 'medium')
  const topCandidate = candidates[0]

  const handleMerge = async () => {
    if (!selectedId) return
    setMerging(true)
    try {
      await onMerge(selectedId, chosenName)
    } finally {
      setMerging(false)
    }
  }

  return (
    <div
      className="rounded-lg border p-4 mb-4"
      style={{
        borderColor: highConfidence.length > 0 ? '#F59E0B' : '#E2E8E4',
        backgroundColor: highConfidence.length > 0 ? '#FFFBEB' : '#FAFAFA',
      }}
      data-testid="duplicate-warning-banner"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p
            className="font-semibold text-sm"
            style={{ color: '#212121', fontFamily: 'Public Sans, sans-serif' }}
          >
            {highConfidence.length > 0
              ? 'This looks like an existing contact'
              : 'This might be an existing contact'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
            {aiAvailable
              ? 'Checked with AI + fuzzy matching'
              : 'Checked with fuzzy matching'}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs"
          style={{ color: '#9CA3AF' }}
          data-testid="duplicate-dismiss"
        >
          Dismiss
        </button>
      </div>

      {/* Candidate List */}
      <div className="space-y-2 mb-3">
        {candidates.map(candidate => (
          <button
            key={candidate.connection_id}
            onClick={() => {
              setSelectedId(
                selectedId === candidate.connection_id ? null : candidate.connection_id
              )
              setShowNamePicker(true)
            }}
            className="w-full text-left rounded-md border p-3 transition-colors"
            style={{
              borderColor:
                selectedId === candidate.connection_id ? '#B1FA63' : '#E2E8E4',
              backgroundColor:
                selectedId === candidate.connection_id ? '#F0FDF4' : '#FFFFFF',
            }}
            data-testid={`candidate-${candidate.connection_id}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: '#212121', fontFamily: 'Public Sans, sans-serif' }}
                >
                  {candidate.display_name}
                </p>
                {(candidate.title || candidate.city) && (
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                    {[candidate.title, candidate.city].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <ConfidencePill confidence={candidate.confidence} />
            </div>
          </button>
        ))}
      </div>

      {/* Name Picker (shown after selecting a candidate) */}
      {selectedId && showNamePicker && (
        <div
          className="rounded-md border p-3 mb-3"
          style={{ borderColor: '#E2E8E4', backgroundColor: '#FFFFFF' }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: '#212121' }}>
            Which name should we use?
          </p>
          <div className="space-y-1.5">
            {[incomingName, candidates.find(c => c.connection_id === selectedId)?.display_name]
              .filter(Boolean)
              .map(name => (
                <label
                  key={name}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="canonical_name"
                    value={name}
                    checked={chosenName === name}
                    onChange={() => setChosenName(name!)}
                    style={{ accentColor: '#B1FA63' }}
                  />
                  <span className="text-sm" style={{ color: '#212121' }}>
                    {name}
                  </span>
                </label>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {selectedId ? (
          <>
            <button
              onClick={handleMerge}
              disabled={merging}
              className="flex-1 rounded-md py-2 text-sm font-semibold transition-opacity"
              style={{
                backgroundColor: '#203229',
                color: '#B1FA63',
                fontFamily: 'Public Sans, sans-serif',
                opacity: merging ? 0.6 : 1,
              }}
              data-testid="confirm-merge"
            >
              {merging ? 'Merging…' : 'Yes, merge them'}
            </button>
            <button
              onClick={() => {
                setSelectedId(null)
                setShowNamePicker(false)
              }}
              className="rounded-md px-3 py-2 text-sm border"
              style={{ borderColor: '#E2E8E4', color: '#6B7280' }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={onDismiss}
            className="text-sm"
            style={{ color: '#6B7280', fontFamily: 'Public Sans, sans-serif' }}
            data-testid="different-person"
          >
            No, these are different people →
          </button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ConfidencePill
// ---------------------------------------------------------------------------

function ConfidencePill({ confidence }: { confidence: DuplicateCandidate['confidence'] }) {
  const styles = {
    high: { bg: '#FEF3C7', text: '#92400E', label: 'Very likely' },
    medium: { bg: '#F3F4F6', text: '#374151', label: 'Possibly' },
    low: { bg: '#F9FAFB', text: '#9CA3AF', label: 'Maybe' },
  }

  const style = styles[confidence]

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}
