// lib/chips/bank.ts
//
// The chip bank. Every selectable Need, Offer, and Focus chip lives here,
// each tagged with one or more contexts from the seven-value taxonomy.
//
// Why this file matters: the context tags here drive the entire context-aware
// suggestion engine in suggestions.ts. A Focus chip only surfaces when it shares
// a context with the user's selected Needs and Offers. So the quality of these
// tags IS the quality of the suggestions. Tag deliberately.
//
// The seven contexts (from types.ts):
//   capital     money, funding, investment, financial
//   talent      people, hiring, team, skills
//   customers   users, growth, distribution, market
//   knowledge   advice, mentorship, expertise, learning
//   community   relationships, introductions, network, belonging
//   resources   tools, space, infrastructure, operational
//   creative    design, content, brand, storytelling
//
// Keep labels short (one or two words) so they read cleanly on a card chip.
// A chip may carry multiple contexts when it genuinely spans them.

import type { ChipEntry } from './types';

export const CHIP_BANK: ChipEntry[] = [
  // ─────────────────────────────────────────
  // NEEDS  (what someone is looking for)
  // ─────────────────────────────────────────
  { label: 'Funding',          category: 'needs', context: 'capital' },
  { label: 'Investment',       category: 'needs', context: 'capital' },
  { label: 'Grants',           category: 'needs', context: 'capital' },
  { label: 'Loans',            category: 'needs', context: 'capital' },
  { label: 'Hiring',           category: 'needs', context: 'talent' },
  { label: 'Co-founder',       category: 'needs', context: ['talent', 'community'] },
  { label: 'Looking for work', category: 'needs', context: 'talent' },
  { label: 'Customers',        category: 'needs', context: 'customers' },
  { label: 'Distribution',     category: 'needs', context: 'customers' },
  { label: 'Beta users',       category: 'needs', context: 'customers' },
  { label: 'Advice',           category: 'needs', context: 'knowledge' },
  { label: 'Mentorship',       category: 'needs', context: 'knowledge' },
  { label: 'Feedback',         category: 'needs', context: ['knowledge', 'creative'] },
  { label: 'Introductions',    category: 'needs', context: 'community' },
  { label: 'Partnerships',     category: 'needs', context: ['community', 'customers'] },
  { label: 'Collaboration',    category: 'needs', context: ['community', 'creative'] },
  { label: 'Workspace',        category: 'needs', context: 'resources' },
  { label: 'Tools',            category: 'needs', context: 'resources' },
  { label: 'Suppliers',        category: 'needs', context: 'resources' },
  { label: 'Design help',      category: 'needs', context: 'creative' },
  { label: 'Content',          category: 'needs', context: 'creative' },

  // ─────────────────────────────────────────
  // OFFERS  (what someone can give)
  // ─────────────────────────────────────────
  { label: 'Investment',       category: 'offers', context: 'capital' },
  { label: 'Funding access',   category: 'offers', context: 'capital' },
  { label: 'Loans',            category: 'offers', context: 'capital' },
  { label: 'Hiring',           category: 'offers', context: 'talent' },
  { label: 'Recruiting',       category: 'offers', context: 'talent' },
  { label: 'Talent network',   category: 'offers', context: ['talent', 'community'] },
  { label: 'Customers',        category: 'offers', context: 'customers' },
  { label: 'Distribution',     category: 'offers', context: 'customers' },
  { label: 'Growth help',      category: 'offers', context: 'customers' },
  { label: 'Advice',           category: 'offers', context: 'knowledge' },
  { label: 'Mentorship',       category: 'offers', context: 'knowledge' },
  { label: 'Expertise',        category: 'offers', context: 'knowledge' },
  { label: 'Feedback',         category: 'offers', context: ['knowledge', 'creative'] },
  { label: 'Introductions',    category: 'offers', context: 'community' },
  { label: 'Partnerships',     category: 'offers', context: ['community', 'customers'] },
  { label: 'Collaboration',    category: 'offers', context: ['community', 'creative'] },
  { label: 'Workspace',        category: 'offers', context: 'resources' },
  { label: 'Tools',            category: 'offers', context: 'resources' },
  { label: 'Infrastructure',   category: 'offers', context: 'resources' },
  { label: 'Design',           category: 'offers', context: 'creative' },
  { label: 'Branding',         category: 'offers', context: 'creative' },
  { label: 'Content',          category: 'offers', context: 'creative' },

  // ─────────────────────────────────────────
  // FOCUS  (the specificity layer, context-matched to the above)
  // These only surface when they share a context with selected Needs/Offers.
  // ─────────────────────────────────────────

  // capital-focused
  { label: 'Pre-seed',         category: 'focus', context: 'capital' },
  { label: 'Seed',             category: 'focus', context: 'capital' },
  { label: 'Series A',         category: 'focus', context: 'capital' },
  { label: 'Angel',            category: 'focus', context: 'capital' },
  { label: 'Venture',          category: 'focus', context: 'capital' },
  { label: 'Bootstrapped',     category: 'focus', context: 'capital' },
  { label: 'Fintech',          category: 'focus', context: ['capital', 'customers'] },

  // talent-focused
  { label: 'Engineering',      category: 'focus', context: 'talent' },
  { label: 'Design hires',     category: 'focus', context: ['talent', 'creative'] },
  { label: 'Sales',            category: 'focus', context: ['talent', 'customers'] },
  { label: 'Operations',       category: 'focus', context: ['talent', 'resources'] },
  { label: 'Leadership',       category: 'focus', context: ['talent', 'knowledge'] },
  { label: 'Early-stage team', category: 'focus', context: 'talent' },

  // customers-focused
  { label: 'Go-to-market',     category: 'focus', context: 'customers' },
  { label: 'B2B',              category: 'focus', context: 'customers' },
  { label: 'B2C',              category: 'focus', context: 'customers' },
  { label: 'Enterprise',       category: 'focus', context: 'customers' },
  { label: 'Marketplaces',     category: 'focus', context: ['customers', 'community'] },
  { label: 'Pricing',          category: 'focus', context: ['customers', 'knowledge'] },

  // knowledge-focused
  { label: 'Fundraising',      category: 'focus', context: ['knowledge', 'capital'] },
  { label: 'Product strategy', category: 'focus', context: 'knowledge' },
  { label: 'Early-stage',      category: 'focus', context: 'knowledge' },
  { label: 'Scaling',          category: 'focus', context: ['knowledge', 'talent'] },
  { label: 'Hiring advice',    category: 'focus', context: ['knowledge', 'talent'] },

  // community-focused
  { label: 'Investors',        category: 'focus', context: ['community', 'capital'] },
  { label: 'Operators',        category: 'focus', context: ['community', 'talent'] },
  { label: 'Press',            category: 'focus', context: ['community', 'creative'] },
  { label: 'Founders',         category: 'focus', context: 'community' },
  { label: 'Partners',         category: 'focus', context: ['community', 'customers'] },

  // resources-focused
  { label: 'Studio space',     category: 'focus', context: 'resources' },
  { label: 'Equipment',        category: 'focus', context: 'resources' },
  { label: 'Manufacturing',    category: 'focus', context: 'resources' },
  { label: 'Cloud / infra',    category: 'focus', context: 'resources' },

  // creative-focused
  { label: 'Product design',   category: 'focus', context: 'creative' },
  { label: 'Brand',            category: 'focus', context: 'creative' },
  { label: 'UX',               category: 'focus', context: ['creative', 'knowledge'] },
  { label: '3D',               category: 'focus', context: 'creative' },
  { label: 'Gaming',           category: 'focus', context: ['creative', 'customers'] },
  { label: 'Film / video',     category: 'focus', context: 'creative' },
  { label: 'Music',            category: 'focus', context: 'creative' },
  { label: 'Web',              category: 'focus', context: ['creative', 'resources'] },
  { label: 'Animation',        category: 'focus', context: 'creative' },
  { label: 'Illustration',     category: 'focus', context: 'creative' },
];

// ─────────────────────────────────────────
// Search helper used by ChipBankInput for Needs and Offers
// (Focus uses getFocusSuggestions instead, for context-aware filtering)
// ─────────────────────────────────────────

/**
 * Returns chips in a category whose label matches the query (prefix and
 * substring). Empty query returns the whole category. Case-insensitive.
 */
export function searchBank(query: string, category: ChipEntry['category']): ChipEntry[] {
  const inCategory = CHIP_BANK.filter(c => c.category === category);
  const q = query.toLowerCase().trim();
  if (!q) return inCategory;
  // Prefix matches first, then substring matches, so the closest reads top.
  const prefix = inCategory.filter(c => c.label.toLowerCase().startsWith(q));
  const substring = inCategory.filter(
    c => !c.label.toLowerCase().startsWith(q) && c.label.toLowerCase().includes(q)
  );
  return [...prefix, ...substring];
}
