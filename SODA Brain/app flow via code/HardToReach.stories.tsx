// src/stories/HardToReach.stories.tsx
//
// These are the states that cost you six clicks and a fake account to see in the running app.
// In here they are one click. This is the entire argument for Storybook.

import type { Meta, StoryObj } from '@storybook/react';
import { GateToast } from '@/components/GateToast';
import { WarmthTimeline } from '@/components/WarmthTimeline';
import { OpsDashboard } from '@/components/OpsDashboard';
import {
  warmthDay1, warmthDay12, warmthDay200, warmthEmpty,
  roomHealthy, roomAlarm, roomEmpty,
} from '@/fixtures';

/* ============================================================
   GATE TOAST
   In the app: enter code, type name+email, walk in, tap a person,
   tap Add connection, while unverified. Six steps.
   Here: click.
   ============================================================ */

const gateMeta: Meta<typeof GateToast> = {
  title: 'Toasts/GateToast',
  component: GateToast,
  parameters: { backgrounds: { default: 'canvas' } },
};
export default gateMeta;

export const VerifyRequired: StoryObj<typeof GateToast> = {
  args: {
    body: 'Verify your card to add connections. It keeps who you meet real.',
    cta: 'Verify now',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Purple, because it needs attention. Green is reserved for confirmations. ' +
          'This is the only non-green toast in the product, on purpose: a required step must never read as a success.',
      },
    },
  },
};

/* ============================================================
   WARMTH TIMELINE
   Acceptance criterion from the reporting spec:
   "renders correctly at day 1, day 12, and day 200 with no layout change."
   You cannot check that in a running app without waiting 200 days.
   Here it is three stories.
   ============================================================ */

export const TimelineDay1: StoryObj<typeof WarmthTimeline> = {
  render: () => <WarmthTimeline data={warmthDay1} />,
  parameters: {
    docs: { description: { story: 'The morning after. Almost no line yet. Horizon band dominates.' } },
  },
};

export const TimelineDay12: StoryObj<typeof WarmthTimeline> = {
  render: () => <WarmthTimeline data={warmthDay12} />,
  parameters: {
    docs: { description: { story: 'The normal case. Decay is visible, plenty of horizon left.' } },
  },
};

export const TimelineDay200: StoryObj<typeof WarmthTimeline> = {
  render: () => <WarmthTimeline data={warmthDay200} />,
  parameters: {
    docs: {
      description: {
        story:
          'The long tail. No horizon left to speak of. Axis labels must re-space, the line must not crush. ' +
          'If this looks wrong, the component has hard-coded milestones in it, which the spec forbids.',
      },
    },
  },
};

export const TimelineEmpty: StoryObj<typeof WarmthTimeline> = {
  render: () => <WarmthTimeline data={warmthEmpty} />,
  parameters: {
    docs: { description: { story: 'Zero connections. The chart must degrade to an honest empty state, not a crash.' } },
  },
};

/* ============================================================
   OPS DASHBOARD
   The alarm state is the whole reason the screen exists,
   and it is the state you can never reproduce on demand in a real room.
   ============================================================ */

export const OpsAlarm: StoryObj<typeof OpsDashboard> = {
  render: () => <OpsDashboard room={roomAlarm} />,
  parameters: {
    docs: {
      description: {
        story:
          '24 people connected with nobody. Red, loudest thing on screen, with the named list and suggested intros. ' +
          'This is the state you are designing for, and you can never summon it on demand at a real event.',
      },
    },
  },
};

export const OpsHealthy: StoryObj<typeof OpsDashboard> = {
  render: () => <OpsDashboard room={roomHealthy} />,
  parameters: {
    docs: { description: { story: 'Room is working. Nothing red. The screen should be boring.' } },
  },
};

export const OpsDoorsJustOpened: StoryObj<typeof OpsDashboard> = {
  render: () => <OpsDashboard room={roomEmpty} />,
  parameters: {
    docs: { description: { story: 'All zeros. Must not render 24 red alarms or divide by zero on the ratios.' } },
  },
};
