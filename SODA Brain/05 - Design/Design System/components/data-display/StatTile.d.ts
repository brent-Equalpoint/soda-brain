import * as React from 'react';

export interface StatTileProps {
  /** The figure (number or short string). Rendered big in Archivo Black. */
  value: React.ReactNode;
  /** Mono uppercase caption beneath the figure. */
  label: string;
  /** Color of the figure (default green). */
  color?: string;
  style?: React.CSSProperties;
}

/**
 * A single live vital sign — big green number over a mono label. The
 * building block of the Live Stat Bar and dashboard counts.
 */
export function StatTile(props: StatTileProps): JSX.Element;
