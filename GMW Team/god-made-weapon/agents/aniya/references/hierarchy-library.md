# Hierarchy Library
## God Made Weapon | Aniya UX/UI Team
## Living document — expand as patterns are established.

---

## Type Scale

| Level | Font | Weight | Size | Use |
|-------|------|--------|------|-----|
| Display | Aktiv Grotesk Ex | Bold | 28–36px | Hero moments. One per screen maximum. |
| Heading 1 | Public Sans | SemiBold | 22–24px | Screen title. |
| Heading 2 | Public Sans | SemiBold | 18–20px | Section header, card title. |
| Subheading | Public Sans | Medium | 15–16px | Supporting label beneath a heading. |
| Body | Public Sans | Regular | 15–16px | Primary reading content. |
| Body Strong | Public Sans | Medium | 15–16px | Emphasized body copy. Not a heading. |
| Caption | Public Sans | Regular | 12–13px | Metadata, timestamps, secondary labels. |
| Caption Strong | Public Sans | Medium | 12–13px | Badges, status indicators in caption size. |

**Never mix Display and Body on the same element.**
**Never use Aktiv Grotesk Ex outside Display.**

---

## Spacing Logic

Spacing follows an 8px base unit. Do not invent values outside this scale.

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Icon gap, tight label padding |
| space-2 | 8px | Component internal padding |
| space-3 | 12px | Related element separation |
| space-4 | 16px | Standard element separation |
| space-5 | 20px | Section breathing room |
| space-6 | 24px | Card padding, section separation |
| space-8 | 32px | Major section break |
| space-10 | 40px | Screen top/bottom inset |
| space-12 | 48px | Large section gap |

---

## Visual Weight Decision Tree

When determining how much weight an element should carry:

```
Is this the primary action on the screen?
  YES → Full-width button, FL-Green fill, Body Strong label.
  NO → Continue.

Is this a secondary action the user might need?
  YES → Ghost button (border only, no fill) or text link.
  NO → Continue.

Is this destructive?
  YES → System red token, never FL-Green. Requires explicit confirmation.
  NO → Continue.

Is this metadata or context?
  YES → Caption level. Muted text (#8A8A8A).
  NO → Body level.
```

---

## Screen Zone Map (Mobile, 390px viewport)

```
┌─────────────────────────┐
│  Safe area top / status  │  ← 44–54px
├─────────────────────────┤
│  Navigation header       │  ← 48px
├─────────────────────────┤
│                          │
│  Content zone            │  ← Scroll area
│  (lists, cards, text)    │
│                          │
├─────────────────────────┤
│  Primary action zone     │  ← 80–96px (fixed bottom)
│  (CTA button or tabs)    │
├─────────────────────────┤
│  Safe area bottom        │  ← 34px
└─────────────────────────┘
```

Primary actions live in the thumb-reach zone at the bottom.
Destructive confirmations appear in center-screen dialogs, never in the primary action zone.

---

## Information Priority Rules

1. Primary action: what this screen exists for. One per screen. Bottom zone.
2. Primary content: what the user needs to read before acting. Content zone, top.
3. Secondary content: supporting context. Below primary content.
4. Metadata: timestamps, IDs, system info. Caption level. Below everything.
5. Navigation: back or close. Header zone. Never competing with content.
