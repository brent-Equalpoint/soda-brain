import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Mono uppercase label rendered above the field. */
  label?: string;
  /** Recoverable error message; turns the border red and shows the message (the only place red is used). */
  error?: string;
  /** Calm helper line beneath the field (shown only when there is no error). */
  hint?: string;
}

/**
 * Labelled text field. Dark fill, green focus border. Used in Sign-In,
 * Check-In, profile editing, and the Admin forms.
 */
export function Input(props: InputProps): JSX.Element;
