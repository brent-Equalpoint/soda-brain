import * as React from 'react';

export interface EventCardProps {
  /** Host identity (org or person name). Shown as the green eyebrow / logo tile. */
  host: string;
  /** Event name. */
  name: string;
  /** Date label, e.g. "Mar 14". */
  date: string;
  /** Location, e.g. "Cleveland" (row variant). */
  where?: string;
  /** People-met count. */
  met?: number;
  /** Whether a recap/survey link exists (row variant). */
  recap?: boolean;
  /** 'strip' = compact horizontal card; 'row' = full-width list row. */
  variant?: 'strip' | 'row';
  onClick?: () => void;
}

/**
 * An event in the Home — a compact strip card or a full-width list row
 * with a logo tile and a green met count.
 */
export function EventCard(props: EventCardProps): JSX.Element;
