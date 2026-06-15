import * as React from 'react';

export interface ContactRowProps {
  name: string;
  /** Role shown before the met-at line. */
  role?: string;
  /** Mono meta line, e.g. "Creative Meetup, Cleveland". */
  metAt?: string;
  /** Trailing follow-up signal badge. */
  signal?: 'reached' | 'nudge' | 'saved' | 'just';
  /** Color of the optional warmth dot (green→amber→purple as it cools). */
  warmthColor?: string;
  /** Photo URL (else initials avatar). */
  src?: string | null;
  onClick?: () => void;
  /** Wrap in a bordered card (default) or render bare for tight overview lists. */
  boxed?: boolean;
  style?: React.CSSProperties;
}

/**
 * A person in a list — avatar, name, met-at line, optional warmth dot,
 * trailing signal. Used in the Room View, the rolodex, and event detail.
 */
export function ContactRow(props: ContactRowProps): JSX.Element;
