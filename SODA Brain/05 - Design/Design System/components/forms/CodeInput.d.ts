import * as React from 'react';

export interface CodeInputProps {
  /** Number of digit cells (default 6). */
  length?: number;
  /** Current code value (controlled). */
  value?: string;
  /** Called with the cleaned numeric string on change. */
  onChange?: (value: string) => void;
  /** Show the error (red) border, e.g. when a code did not match. */
  error?: boolean;
}

/**
 * The six-digit email verification entry from Sign-In. A row of cells
 * with a green active cell; turns red on a failed code.
 */
export function CodeInput(props: CodeInputProps): JSX.Element;
