import * as React from 'react';

export interface SegmentedOption {
  /** Stable value emitted by onChange. */
  value: string;
  /** Visible label. */
  label: string;
  /** Optional tiny line beneath the label (e.g. "The whole experience"). */
  subtitle?: string;
}

export interface SegmentedToggleProps {
  /** 2–3 options. A bare string is treated as both value and label. */
  options: Array<SegmentedOption | string>;
  /** Currently selected value. */
  value: string;
  /** Fires with the chosen option's value. */
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

/**
 * A 2–3 option segmented control on a dark track. The selected option
 * fills SODA green with near-black text; options may carry a subtitle.
 * Used for the Event Mode (Full / Simple) control in host setup.
 */
export function SegmentedToggle(props: SegmentedToggleProps): JSX.Element;
