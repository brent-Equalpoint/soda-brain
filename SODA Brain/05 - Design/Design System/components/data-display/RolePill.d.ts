import * as React from 'react';

export interface RolePillProps {
  /** Pill label, e.g. "Owner" or "Collaborator". */
  children?: React.ReactNode;
  /**
   * granted = solid green (role assigned by invite, account setup);
   * owner = deep-green surface; collaborator = quiet muted tag.
   */
  tone?: 'granted' | 'owner' | 'collaborator';
  style?: React.CSSProperties;
}

/**
 * A read-only badge for a host role that was granted, not chosen —
 * green when freshly assigned, deep-green for an Owner, muted for a
 * Collaborator.
 */
export function RolePill(props: RolePillProps): JSX.Element;
