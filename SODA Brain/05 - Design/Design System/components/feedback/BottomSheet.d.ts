import * as React from 'react';

export interface BottomSheetProps {
  /** Whether the sheet is raised. Animates in/out. Default true. */
  open?: boolean;
  /** Called when the dimmed backdrop is tapped. */
  onClose?: () => void;
  /** Optional display-type heading at the top of the sheet. */
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Style overrides for the sheet surface. */
  style?: React.CSSProperties;
}

/**
 * A dark sheet that rises over a dimmed screen at a calm moment — rounded
 * top, grabber handle, optional title. Tapping the backdrop closes it.
 * Renders absolutely inside its nearest positioned ancestor.
 */
export function BottomSheet(props: BottomSheetProps): JSX.Element;
