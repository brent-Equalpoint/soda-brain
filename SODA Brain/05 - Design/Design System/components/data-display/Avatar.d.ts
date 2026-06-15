import * as React from 'react';

export interface AvatarProps {
  /** Person's name — drives both the initials and the deterministic fallback color. */
  name?: string;
  /** Optional photo URL. When set, shows the photo instead of initials. */
  src?: string | null;
  /** Diameter in px (default 48). */
  size?: number;
  /** Override the fallback background color (else hashed from name). */
  color?: string;
  style?: React.CSSProperties;
}

/**
 * Circular identity mark. Photo if provided, else white initials on a
 * stable color from the identity palette. Used everywhere a person appears.
 */
export function Avatar(props: AvatarProps): JSX.Element;
/** Get the up-to-2-letter uppercase initials for a name. */
export function initialsOf(name?: string): string;
