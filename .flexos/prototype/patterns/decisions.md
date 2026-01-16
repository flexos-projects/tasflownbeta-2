# TaskFlow Design Decisions

This document explains the **why** behind TaskFlow's design choices. Read this before building any prototype to understand the philosophy, not just the implementation.

---

## Core Philosophy

### Clarity Over Decoration
Every visual element must serve a purpose. If you can't explain why something exists, remove it.

- No decorative gradients or shadows
- No icons without meaning
- No color for color's sake
- White space is a feature, not wasted space

### Mobile-First, Always
Design for thumbs first, mice second. This isn't just about responsive breakpoints—it's about interaction patterns.

- Touch targets minimum 44px (prefer 48px)
- Important actions at thumb reach (bottom of screen on mobile)
- Assume fat-finger mistakes will happen
- Swipe gestures before hover states

### Consistency Builds Muscle Memory
Same patterns everywhere. Users shouldn't have to re-learn how things work on each page.

- Same button styles everywhere
- Same form patterns everywhere
- Same spacing rhythms everywhere
- Same feedback patterns everywhere

---

## Visual Decisions

### Why Blue (#3b82f6)?
Blue is the safest, most universally understood color for primary actions:
- No strong cultural associations
- Works for both genders/ages
- High contrast against white
- Distinguishable for colorblind users

**Rule**: Blue is ONLY for primary actions. Never use it for decoration.

### Why Gray-50 (#fafafa) Background?
Pure white (#fff) is harsh on screens. Gray-50 provides:
- Easier on the eyes for long sessions
- Better contrast with white cards
- Subtle depth without shadows

**Rule**: Background is gray-50, cards/surfaces are white.

### Why 8px Spacing Grid?
8px divides evenly and scales well:
- 4px for tight/compact UI
- 8px for component internals
- 16px for standard gaps
- 24px/32px for section gaps

**Rule**: All spacing must be multiples of 4px. Random values break rhythm.

### Why Inter Font?
Inter was designed for screens:
- Excellent legibility at small sizes (14px body text)
- Clear distinction between similar characters (Il1, O0)
- Variable font = one file, all weights
- MIT licensed, no cost

**Rule**: Body text is 14px, never smaller except for timestamps/captions.

---

## Component Decisions

### Buttons

**Why rounded-lg (8px)?**
- Not too sharp (aggressive)
- Not too round (playful)
- Matches our "professional but friendly" tone

**Why semibold text?**
- Medium weight is too subtle
- Bold is too heavy
- Semibold provides clear hierarchy without shouting

**Why 150ms transitions?**
- Faster than 200ms (feels snappy)
- Slower than 100ms (not jarring)
- Human perception threshold for "instant"

### Cards

**Why 1px border instead of shadow?**
- Shadows can look "floaty" or dated
- Borders feel grounded and modern (Linear-style)
- Better performance (no blur calculations)
- Works better in dark mode (future)

**When to use shadow?**
- Hover states (feedback)
- Elevated elements (modals, dropdowns)
- Never at rest for cards

### Forms

**Why 16px font size for inputs?**
- iOS zooms inputs below 16px
- Prevents unwanted zoom on focus
- Better accessibility

**Why visible borders on inputs?**
- Borderless inputs look modern but confuse users
- Clear boundaries reduce errors
- Better for users with low vision

**Why inline validation?**
- Real-time feedback reduces errors
- Don't wait until submit to tell users they made mistakes
- Use green checkmarks, not just red errors

---

## Layout Decisions

### Sidebar (280px)

**Why fixed width?**
- Predictable content width
- No layout shifts
- Easier to design for

**Why 280px specifically?**
- Wide enough for readable text
- Narrow enough to leave content space
- Matches common patterns (VS Code, Figma, Linear)

**Why border, not shadow?**
- Consistent with card philosophy
- Cleaner visual separation
- Better performance

### Content Area

**Why max-width 1024px?**
- Optimal line length for reading (60-80 chars)
- Prevents content from spreading too thin on large screens
- Centers focus

**Why not full-width?**
- Wide text is hard to read
- Forms look lost in wide spaces
- Actions become hard to reach

---

## Interaction Decisions

### Hover States

**Rule**: Only add hover effects on devices that support hover.

```css
@media (hover: hover) {
  .element:hover { ... }
}
```

This prevents "sticky" hover states on touch devices.

### Focus States

**Rule**: Every interactive element must have visible focus states.

- Use `outline` (not `box-shadow`) for focus rings
- 2px solid primary color
- 2px offset from element

This is non-negotiable for keyboard accessibility.

### Loading States

**Rule**: Always show loading feedback within 100ms.

- Use skeleton loaders for content
- Use spinners for actions (buttons)
- Never leave users wondering if something is working

### Empty States

**Rule**: Empty states are opportunities, not errors.

- Explain why it's empty
- Show what the user can do
- Include a primary action
- Add helpful illustration (optional)

---

## Color Usage Rules

### When to Use Each Color

| Color | Use For |
|-------|---------|
| Primary (blue) | Main actions, links, focus rings |
| Success (green) | Completed states, positive feedback |
| Warning (amber) | Due soon, caution states |
| Error (red) | Overdue, destructive actions, errors |
| Gray | Text, borders, backgrounds, neutral UI |

### Color Pairings

| Text On | Use Color |
|---------|-----------|
| White background | gray-900 (primary), gray-600 (secondary) |
| Gray-50 background | gray-900 (primary), gray-500 (muted) |
| Primary background | white |
| Error/Success background | -700 shade of same color |

---

## Spacing Rules

### When to Use Each Size

| Spacing | Use For |
|---------|---------|
| 4px (space-1) | Tight inline elements, icon gaps |
| 8px (space-2) | Component internal padding |
| 12px (space-3) | Form group gaps, small cards |
| 16px (space-4) | Standard padding, nav item spacing |
| 24px (space-6) | Card padding, section gaps |
| 32px (space-8) | Large section gaps |
| 48px+ | Page section dividers |

### Spacing Patterns

**Inside components**: 8px, 12px, 16px
**Between components**: 16px, 24px
**Between sections**: 32px, 48px

---

## Z-Index Strategy

Don't make up z-index values. Use the scale:

| Layer | Z-Index | Use For |
|-------|---------|---------|
| Base | 0 | Default content |
| Dropdown | 100 | Dropdown menus |
| Sticky | 200 | Sticky headers |
| Fixed | 300 | Fixed navbars |
| Modal backdrop | 400 | Overlay dimming |
| Modal | 500 | Modal dialogs |
| Popover | 600 | Popovers, bottom sheets |
| Tooltip | 700 | Tooltips |
| Toast | 800 | Toast notifications |

---

## Accessibility Non-Negotiables

1. **Color contrast**: 4.5:1 minimum for text
2. **Touch targets**: 44px minimum
3. **Focus visible**: Every interactive element
4. **Motion**: Respect `prefers-reduced-motion`
5. **Labels**: Every input has a label (visible or aria)
6. **Hierarchy**: Headings in order (h1, h2, h3)
7. **Alt text**: Every meaningful image

---

## Anti-Patterns (Don't Do This)

### Visual
- Don't use more than 2 font weights per page
- Don't use more than 3 colors (excluding grays)
- Don't use shadows on everything
- Don't use gradients for backgrounds
- Don't use animations for decoration

### Interaction
- Don't hide important actions behind menus
- Don't use hover-only interactions on mobile
- Don't use double-click
- Don't use right-click for essential features
- Don't auto-play anything

### Layout
- Don't use horizontal scrolling (except for specific components)
- Don't use fixed heights that could clip content
- Don't center everything
- Don't use viewport units (vh) for heights—use dvh

---

## Quick Reference: Common Mistakes

| Instead of... | Use... |
|---------------|--------|
| `100vh` | `100dvh` |
| Custom shadows | `var(--shadow-sm/md/lg)` |
| Arbitrary colors | Design token colors |
| `font-weight: 600` | `var(--font-semibold)` |
| Custom border radius | `var(--radius-lg)` |
| Pixel values | Spacing tokens |
| `.my-button` | `.btn .btn-primary` |
| `.my-sidebar` | `.sidebar` |
| Inline styles for layout | Utility classes |

---

*This document is the source of truth for design decisions. When in doubt, refer here first.*
