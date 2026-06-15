import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. primary = the green call-to-action; ghost = secondary; purple = private/Nudge action; danger = destructive. */
  variant?: 'primary' | 'ghost' | 'purple' | 'danger';
  /** Size of the button. */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to full container width (the mobile default). */
  block?: boolean;
  disabled?: boolean;
  /** Optional leading glyph (Unicode, e.g. "✓" or "←"). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * The SODA button. Green primary means "this is the one thing to do".
 * Use `purple` only for private / follow-up actions, never decoratively.
 */
export function Button(props: ButtonProps): JSX.Element;
