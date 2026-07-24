// src/fixtures/index.ts
// One source of fake truth. Used by Storybook stories, dev route seeds, and tests.
// If a bug shows up in the workbench, it reproduces exactly in a test, because the data is identical.

import type { Attendee, Person, WarmthSeries, YouState } from '@/types';

/* ---------- People ---------- */

export const maya: Person = {
  id: 'maya',
  name: 'Maya Okafor',
  role: 'Founder, Northbound',
  color: '#3bd75c',
  verified: true,
  offers: ['Mentorship', 'Introductions'],
  needs: ['Collaboration', 'Funding'],
  match: { isMatch: true, reason: 'You both work in product design' },
};

export const ife: Person = {
  id: 'ife',
  name: 'Ife Adeyemi',
  role: 'Design lead',
  color: '#a47bff',
  verified: false,               // unverified: no badge
  offers: ['Feedback', 'Mentorship'],
  needs: ['Collaboration'],
  match: { isMatch: false },
};

export const emptyCardPerson: Person = {
  id: 'newcomer',
  name: 'Sam Reyes',
  role: '',                      // walked in, never built a card
  color: '#60a5fa',
  verified: false,
  offers: [],
  needs: [],
  match: { isMatch: false },
};

export const longNamePerson: Person = {
  id: 'long',
  name: 'Bartholomew Vandersteen-Achebe',   // the layout-breaker
  name_long: true,
  role: 'Principal Solutions Architect and Head of Platform Engineering',
  color: '#f59e0b',
  verified: true,
  offers: ['Expertise', 'Advice', 'Mentorship'],
  needs: ['Co-founder'],
  match: { isMatch: true, reason: 'You both want a technical co-founder' },
};

export const roomOf19: Person[] = [
  maya, ife, emptyCardPerson, longNamePerson,
  // ...15 more, elided
];

/* ---------- Attendee (you) states ---------- */

export const attendeeStarter: Attendee = {
  id: 'you',
  name: 'Brent Montgomery',
  contactMethod: 'email',
  contact: 'brent@gilchrist.co',
  youState: 'starter' as YouState,   // in the room, no card, unverified
  canConnect: false,
  connections: [],
};

export const attendeeWithCard: Attendee = {
  ...attendeeStarter,
  youState: 'card' as YouState,
  role: 'Founder, Gilchrist',
  offers: ['Advice', 'Mentorship'],
  needs: ['Collaboration', 'Work'],
  canConnect: false,                 // still gated. card is not the key.
};

export const attendeeVerified: Attendee = {
  ...attendeeWithCard,
  youState: 'verified' as YouState,
  canConnect: true,                  // the badge is the key to connecting
  connections: ['maya'],
};

export const attendeeSms: Attendee = {
  ...attendeeStarter,
  contactMethod: 'sms',
  contact: '+12165550147',
};

/* ---------- Warmth series (the reporting timeline) ---------- */

// warmth = max(0, round(base * exp(-0.01 * days)))  [locked formula, never re-derive]
function decaySeries(total: number, days: number): WarmthSeries {
  const series = [];
  for (let d = 0; d <= days; d++) {
    const alive = Math.round(total * Math.pow(Math.exp(-0.01 * d), 2.6));
    const cooling = Math.round((total - alive) * 0.62);
    series.push({ day: d, in_rhythm: alive, cooling, been_a_while: total - alive - cooling });
  }
  return { total, days_elapsed: days, series };
}

export const warmthDay1   = decaySeries(412, 1);    // report opened the morning after
export const warmthDay12  = decaySeries(412, 12);   // the normal case
export const warmthDay200 = decaySeries(412, 200);  // the long tail. layout must not break.
export const warmthEmpty: WarmthSeries = { total: 0, days_elapsed: 0, series: [{ day: 0, in_rhythm: 0, cooling: 0, been_a_while: 0 }] };

/* ---------- Ops dashboard ---------- */

export const roomHealthy = {
  inRoom: 187, cardsBuilt: 163, connections: 412,
  consideredRatio: 0.68,
  connectedZero: 3,                  // healthy room, few stragglers
  lonely: [],
};

export const roomAlarm = {
  inRoom: 187, cardsBuilt: 163, connections: 412,
  consideredRatio: 0.68,
  connectedZero: 24,                 // the alarm state, the whole point of the screen
  lonely: [
    { id: 'andre', name: 'Andre Willis', role: 'Engineer', minutesInRoom: 52,
      suggestedIntro: { name: 'Nikki Cho', reason: 'both want a technical co-founder' } },
    { id: 'priya', name: 'Priya Nair', role: 'Founder, Nested', minutesInRoom: 47,
      suggestedIntro: { name: 'Devin Park', reason: 'he funds her stage' } },
  ],
};

export const roomEmpty = {
  inRoom: 0, cardsBuilt: 0, connections: 0,
  consideredRatio: 0, connectedZero: 0, lonely: [],   // doors just opened
};
