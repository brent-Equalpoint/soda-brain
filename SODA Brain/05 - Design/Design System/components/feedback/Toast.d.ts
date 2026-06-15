import * as React from 'react';

export interface ToastProps {
  /** The confirmation text, e.g. "Card saved" or "Drop fired". */
  message: React.ReactNode;
  /** Animate in when true; slides down/out when false. */
  show?: boolean;
  /** Accent edge color — green confirm, purple private, red error. */
  tone?: 'green' | 'purple' | 'danger';
  style?: React.CSSProperties;
}

/**
 * A small confirmation pill that rises from the bottom of a screen.
 * Used across the attendee app, Command Center, and Admin.
 */
export function Toast(props: ToastProps): JSX.Element;
