import * as React from 'react';

export interface BadgeProps {
  /** Freeform color tone (used when neither status nor signal is set). */
  tone?: 'neutral' | 'green' | 'purple' | 'amber' | 'yellow' | 'danger';
  /** Documentation status — maps to green (built) / yellow (spec). */
  status?: 'built' | 'spec';
  /** Contact follow-up signal — maps reached→green, nudge→purple, saved/just→neutral. */
  signal?: 'reached' | 'nudge' | 'saved' | 'just';
  /** Show a leading dot in the current color. */
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Small mono pill. Carries either a documentation status, a contact
 * follow-up signal, or a freeform tone. Meaning is word + color.
 */
export function Badge(props: BadgeProps): JSX.Element;
