import * as React from 'react';

export interface ResendControlProps {
  /** Countdown length in seconds before the link re-arms. Default 20. */
  seconds?: number;
  /** Called when the (re-armed) link is tapped. The timer restarts itself. */
  onResend?: () => void;
  /** Active-state label. Default "Resend code". */
  label?: string;
  style?: React.CSSProperties;
}

/**
 * The calm resend control on the code screen: shows "Resend in 0:20" in
 * muted grey while counting down, then becomes an active green text link.
 */
export function ResendControl(props: ResendControlProps): JSX.Element;
