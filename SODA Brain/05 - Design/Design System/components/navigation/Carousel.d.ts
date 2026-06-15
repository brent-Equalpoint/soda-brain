import * as React from 'react';

export interface CarouselButtonArg {
  /** True on the final card. */
  last: boolean;
  /** Advance, or fire onDone on the last card. */
  next: () => void;
  /** The label to show (nextLabel, or doneLabel on the last card). */
  label: string;
}

export interface CarouselProps {
  /** One node per card — the consumer builds illustration + headline + body. */
  cards: React.ReactNode[];
  /** Fired when the last card's button is pressed. */
  onDone?: () => void;
  /** Fired when Skip is tapped. */
  onSkip?: () => void;
  /** Button label before the last card. Default "Next". */
  nextLabel?: string;
  /** Button label on the last card. Default "Got it". */
  doneLabel?: string;
  /**
   * Render-prop for the advance button so the consumer can use the DS
   * Button. Receives { last, next, label }.
   */
  renderButton?: (arg: CarouselButtonArg) => React.ReactNode;
}

/**
 * A short, skippable onboarding carousel: green "N of M" progress cue and
 * a Skip link up top, one card in the center, progress dots, and a
 * full-width advance button ("Next" → "Got it" on the last card).
 */
export function Carousel(props: CarouselProps): JSX.Element;
