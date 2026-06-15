import * as React from 'react';

export interface ProgressBarProps {
  /** Current value (used with max). */
  value?: number;
  /** Max value (default 100). */
  max?: number;
  /** Alternative: a 0–1 ratio (overrides value/max). */
  ratio?: number;
  /** Fill color (default green). */
  color?: string;
  /** Track height in px (default 6). */
  height?: number;
  style?: React.CSSProperties;
}

/**
 * Thin green fill on a dark track. Drives the survey progress and any
 * stepped flow.
 */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
