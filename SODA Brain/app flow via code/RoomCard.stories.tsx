// src/stories/RoomCard.stories.tsx
//
// The dressing room. Every outfit RoomCard can wear, side by side in the sidebar.
// No launching the app. No typing a room code. No walking into the room.
// Click a story, see the state.

import type { Meta, StoryObj } from '@storybook/react';
import { RoomCard } from '@/components/RoomCard';
import { maya, ife, emptyCardPerson, longNamePerson } from '@/fixtures';

const meta: Meta<typeof RoomCard> = {
  title: 'Room/RoomCard',
  component: RoomCard,
  parameters: {
    backgrounds: { default: 'canvas' },   // SODA is dark-only. Never preview on white.
  },
  // Controls: knobs in the sidebar so you can poke at props without editing code.
  argTypes: {
    isYou: { control: 'boolean' },
    onTap: { action: 'tapped' },          // logs to the Actions panel when clicked
  },
};
export default meta;

type Story = StoryObj<typeof RoomCard>;

/* ---------- the normal cases ---------- */

export const Verified: Story = {
  args: { person: maya },
};

export const Unverified: Story = {
  args: { person: ife },
  parameters: {
    docs: { description: { story: 'No badge in the top-right corner. The corner stays empty.' } },
  },
};

export const WithMatch: Story = {
  args: { person: maya },
  parameters: {
    docs: { description: { story: 'Purple match strip. Verified check sits top-right.' } },
  },
};

/* ---------- you ---------- */

export const YouUnverified: Story = {
  args: { person: { ...maya, id: 'you', name: 'Brent Montgomery', verified: false }, isYou: true },
  parameters: {
    docs: { description: { story: 'Your own card. Dashed placeholder circle top-right, where the badge will go.' } },
  },
};

export const YouVerified: Story = {
  args: { person: { ...maya, id: 'you', name: 'Brent Montgomery', verified: true }, isYou: true },
  parameters: {
    docs: { description: { story: 'The dashed circle fills in with the green check. The payoff.' } },
  },
};

/* ---------- the states that break things (this is why Storybook earns its keep) ---------- */

export const NoCardYet: Story = {
  args: { person: emptyCardPerson },
  parameters: {
    docs: { description: { story: 'Walked in, never built a card. Role is empty. Does the layout hold?' } },
  },
};

export const LongNameAndRole: Story = {
  args: { person: longNamePerson },
  parameters: {
    docs: { description: { story: 'The layout-breaker. Long name plus long role plus a badge in the corner. Nothing should overlap or clip.' } },
  },
};

/* ---------- see them all at once ---------- */

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 420 }}>
      <RoomCard person={maya} />
      <RoomCard person={ife} />
      <RoomCard person={emptyCardPerson} />
      <RoomCard person={longNamePerson} />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'The regression view. Change RoomCard, glance here, confirm nothing else broke.' } },
  },
};
