import * as React from 'react';

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Whether this chip is selected (fills green). */
  selected?: boolean;
  onClick?: () => void;
  /** Render a leading "＋" to signal a write-in / add-your-own chip. */
  writeIn?: boolean;
  children?: React.ReactNode;
}

/**
 * Tappable pill used for the Role / Offer / Need micro-profile steps
 * and profile editing. Green when selected. Always fully round.
 */
export function Chip(props: ChipProps): JSX.Element;
