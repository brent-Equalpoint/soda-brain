import * as React from 'react';

export interface EventRowProps {
  /** Host identity shown as the small uppercase eyebrow. */
  host: string;
  /** Event name. */
  name: string;
  /** Status label when not live, e.g. "Upcoming" or "Mar 14". */
  status?: string;
  /** When true, shows the green "Live now" dot-tag and a green edge. */
  live?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * A full-width event row for a host's list — host eyebrow, name, and a
 * status tag. Live events read green ("Live now"); the rest stay muted.
 */
export function EventRow(props: EventRowProps): JSX.Element;
