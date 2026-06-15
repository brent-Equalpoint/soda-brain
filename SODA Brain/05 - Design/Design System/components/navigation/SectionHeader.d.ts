import * as React from 'react';

export interface SectionHeaderProps {
  /** Mono uppercase label. */
  title: string;
  /** Optional green action label on the right, e.g. "See all". */
  action?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}

/**
 * A mono uppercase section label with an optional green "See all"
 * action. Divides blocks on the Home and cockpit panels.
 */
export function SectionHeader(props: SectionHeaderProps): JSX.Element;
