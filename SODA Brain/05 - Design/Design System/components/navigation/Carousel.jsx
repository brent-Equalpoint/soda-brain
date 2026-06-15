import React from 'react';

/**
 * SODA Carousel — a short, skippable onboarding carousel. A thin green
 * progress cue ("2 of 4") and a quiet Skip link sit at the top, always
 * visible; one card shows in the center; a full-width green button
 * advances ("Next" → "Got it" on the last card). Light, concrete, never
 * a wall of text. Manages its own index. `cards` is an array of nodes.
 */
export function Carousel({ cards = [], onDone, onSkip, nextLabel = 'Next', doneLabel = 'Got it', renderButton }) {
  const [i, setI] = React.useState(0);
  const last = i >= cards.length - 1;
  const next = () => (last ? onDone && onDone() : setI((n) => n + 1));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-label)',
            letterSpacing: 'var(--ls-tag-wide)',
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          {i + 1} of {cards.length}
        </span>
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-muted)',
            padding: 4,
          }}
        >
          Skip
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        {cards[i]}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
        {cards.map((_, n) => (
          <span
            key={n}
            style={{
              width: n === i ? 18 : 6,
              height: 6,
              borderRadius: 'var(--r-pill)',
              background: n === i ? 'var(--accent)' : 'var(--border-strong)',
              transition: 'width var(--dur-fast) var(--ease)',
            }}
          />
        ))}
      </div>

      {renderButton ? renderButton({ last, next, label: last ? doneLabel : nextLabel }) : null}
    </div>
  );
}
