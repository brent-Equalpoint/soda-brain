import * as React from 'react';

export interface TabItem {
  id: string;
  /** Icon glyph (Unicode, e.g. "■" "▣" "◎"). */
  icon: React.ReactNode;
  label: string;
  /** Show a purple dot (waiting follow-up nudges). */
  dot?: boolean;
}

export interface TabBarProps {
  tabs: TabItem[];
  /** id of the active tab (rendered green). */
  active: string;
  onChange?: (id: string) => void;
}

/**
 * The fixed bottom tab bar of the Home — icon over mono label, active
 * tab green, optional purple nudge dot.
 */
export function TabBar(props: TabBarProps): JSX.Element;
