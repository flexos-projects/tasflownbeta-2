---
type: core
subtype: design
title: TaskFlow Design System
description: Visual design philosophy, tokens, components, and patterns
sequence: 6
status: active
---

# TaskFlow Design System

## Design Philosophy

TaskFlow's design is guided by these principles:

1. **Clarity over decoration** - Every visual element serves a purpose
2. **Consistency is confidence** - Same patterns everywhere build muscle memory
3. **Mobile is primary** - Design for thumbs first, mice second
4. **Fast feels good** - 60fps animations, instant feedback
5. **Accessible by default** - WCAG AA minimum, AAA where possible

### Visual Inspiration

Our design language draws from:
- **Linear** - Clean, fast, keyboard-first
- **Notion** - Simple, content-focused
- **Apple Notes** - Familiar, approachable
- **Things 3** - Beautiful task management

We intentionally avoid:
- Complex dashboards (Jira)
- Bright colors everywhere (Monday)
- Skeuomorphic elements (old Trello)

---

## Color System

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary 500 | `#3b82f6` | Primary actions, links, focus |
| Primary 600 | `#2563eb` | Primary hover states |
| Primary 700 | `#1d4ed8` | Primary active states |
| Primary 100 | `#dbeafe` | Primary backgrounds, badges |
| Primary 50 | `#eff6ff` | Subtle primary backgrounds |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#22c55e` | Completed tasks, positive feedback |
| Warning | `#f59e0b` | Due soon, caution states |
| Error | `#ef4444` | Overdue, destructive actions |
| Info | `#0ea5e9` | Informational messages |

### Neutral Colors (Gray Scale)

| Token | Hex | Usage |
|-------|-----|-------|
| Gray 50 | `#fafafa` | Page background |
| Gray 100 | `#f5f5f5` | Card hover, subtle backgrounds |
| Gray 200 | `#e5e5e5` | Borders, dividers |
| Gray 300 | `#d4d4d4` | Disabled borders |
| Gray 400 | `#a3a3a3` | Placeholder text, disabled text |
| Gray 500 | `#737373` | Muted text |
| Gray 600 | `#525252` | Secondary text |
| Gray 700 | `#404040` | Body text |
| Gray 900 | `#171717` | Headings, primary text |

### Project Colors

10 preset colors for project identification:

| Name | Hex | Name | Hex |
|------|-----|------|-----|
| Blue | `#3b82f6` | Purple | `#8b5cf6` |
| Green | `#22c55e` | Pink | `#ec4899` |
| Amber | `#f59e0b` | Cyan | `#06b6d4` |
| Red | `#ef4444` | Indigo | `#6366f1` |
| Teal | `#14b8a6` | Orange | `#f97316` |

---

## Typography

### Font Family

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

**Why Inter?**
- Designed for screens
- Excellent legibility at small sizes
- Variable font for optimal file size
- Wide language support

### Type Scale

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| xs | 12px (0.75rem) | 16px | Captions, badges, timestamps |
| sm | 14px (0.875rem) | 20px | Secondary text, form labels |
| base | 16px (1rem) | 24px | Body text, inputs |
| lg | 18px (1.125rem) | 28px | Subheadings, large text |
| xl | 20px (1.25rem) | 28px | Card titles |
| 2xl | 24px (1.5rem) | 32px | Section headers |
| 3xl | 30px (1.875rem) | 36px | Page titles |
| 4xl | 36px (2.25rem) | 40px | Hero headlines |
| 5xl | 48px (3rem) | 48px | Marketing headlines |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Normal | 400 | Body text |
| Medium | 500 | Emphasized text, labels |
| Semibold | 600 | Headings, buttons |
| Bold | 700 | Strong emphasis |

---

## Spacing System

8px base grid with half-step for fine-tuning.

| Token | Value | Usage |
|-------|-------|-------|
| space-0 | 0 | Reset |
| space-0.5 | 2px | Hairline gaps |
| space-1 | 4px | Tight inline spacing |
| space-1.5 | 6px | Button icon gap |
| space-2 | 8px | Component internal padding |
| space-2.5 | 10px | Input padding |
| space-3 | 12px | Small gaps |
| space-4 | 16px | Standard padding |
| space-5 | 20px | Section gaps |
| space-6 | 24px | Card padding |
| space-8 | 32px | Large section gaps |
| space-10 | 40px | Page section gaps |
| space-12 | 48px | Major section gaps |
| space-16 | 64px | Hero section padding |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 2px | Tags, small elements |
| radius-default | 4px | Chips, inline elements |
| radius-md | 6px | Inputs, buttons |
| radius-lg | 8px | Cards, modals |
| radius-xl | 12px | Large cards, containers |
| radius-2xl | 16px | Hero sections |
| radius-full | 9999px | Avatars, pills |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-xs | 0 1px 2px rgba(0,0,0,0.05) | Subtle depth |
| shadow-sm | 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1) | Cards at rest |
| shadow-md | 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1) | Hover states |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1) | Modals, dropdowns |
| shadow-xl | 0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.1) | Dialogs, popovers |

---

## Component Inventory

### Input Components

| Component | States | Sizes |
|-----------|--------|-------|
| Text Input | default, focus, error, disabled | sm, md, lg |
| Textarea | default, focus, error, disabled | sm, md, lg |
| Select | default, focus, error, disabled | sm, md, lg |
| Checkbox | unchecked, checked, indeterminate, disabled | sm, md |
| Toggle | off, on, disabled | md |
| Date Picker | closed, open | md |

### Action Components

| Component | Variants | Sizes |
|-----------|----------|-------|
| Button | primary, secondary, ghost, danger, link | xs, sm, md, lg, xl |
| Icon Button | primary, secondary, ghost | sm, md, lg |
| Link | default, muted | - |

### Display Components

| Component | Variants |
|-----------|----------|
| Card | default, hover, clickable, accent |
| Badge | default, primary, success, warning, error, info |
| Tag | default, removable |
| Avatar | default, with status indicator |
| Avatar Group | stacked |
| Progress | default, sm, lg |
| Skeleton | text, avatar, card, button |

### Navigation Components

| Component | Variants |
|-----------|----------|
| Navbar | public, app |
| Sidebar | expanded, collapsed |
| Bottom Nav | with notification badges |
| Tabs | underline, pills |
| Breadcrumb | with separator |
| Menu | vertical, horizontal |

### Overlay Components

| Component | Sizes |
|-----------|-------|
| Modal | sm, md, lg, xl, full |
| Dropdown | default, right-aligned |
| Tooltip | top, right, bottom, left |
| Toast | success, error, info, warning |
| Bottom Sheet | half, full |

### Layout Components

| Component | Usage |
|-----------|-------|
| Container | max-width wrapper |
| Grid | responsive grid layouts |
| Stack | vertical/horizontal spacing |
| Divider | horizontal/vertical separator |

---

## Responsive Breakpoints

| Name | Width | Typical Device |
|------|-------|----------------|
| xs | <640px | Mobile phones |
| sm | 640px | Large phones, small tablets |
| md | 768px | Tablets |
| lg | 1024px | Small laptops, tablets landscape |
| xl | 1280px | Laptops, desktops |
| 2xl | 1536px | Large desktops |

### Mobile-First Approach

```css
/* Mobile (default) */
.element { padding: 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .element { padding: 1.5rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .element { padding: 2rem; }
}
```

---

## Animation & Transitions

### Timing

| Token | Duration | Usage |
|-------|----------|-------|
| duration-75 | 75ms | Micro-interactions (checkbox) |
| duration-100 | 100ms | Hover states |
| duration-150 | 150ms | Default transitions |
| duration-200 | 200ms | Dropdowns, tooltips |
| duration-300 | 300ms | Modals, larger elements |
| duration-500 | 500ms | Page transitions |

### Easing

| Token | Curve | Usage |
|-------|-------|-------|
| ease-out | cubic-bezier(0, 0, 0.2, 1) | Enter animations |
| ease-in | cubic-bezier(0.4, 0, 1, 1) | Exit animations |
| ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | Transitions |
| ease-bounce | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Playful micro-interactions |

### Common Transitions

```css
/* Default */
transition: all 150ms ease-in-out;

/* Colors only */
transition: color 150ms, background-color 150ms, border-color 150ms;

/* Transform with shadow */
transition: transform 200ms ease-out, box-shadow 200ms ease-out;
```

---

## Touch Targets

Minimum touch target sizes for accessibility:

| Size | Pixels | Usage |
|------|--------|-------|
| Minimum | 44px × 44px | WCAG AAA requirement |
| Comfortable | 48px × 48px | Default for most tappable elements |
| Large | 56px × 56px | Primary actions, FAB |

---

## Iconography

### Icon Set

Using **Lucide Icons** (fork of Feather Icons with more options).

| Category | Icons |
|----------|-------|
| Navigation | home, folder, bell, settings, menu |
| Actions | plus, edit, trash, check, x |
| Status | circle, check-circle, alert-circle, info |
| Objects | user, calendar, clock, tag, search |

### Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| xs | 12px | Inline with xs text |
| sm | 16px | Buttons, inline |
| md | 20px | Default size |
| lg | 24px | Cards, features |
| xl | 32px | Empty states, features |
| 2xl | 48px | Hero sections |

---

## Dark Mode (Future)

While v1 is light mode only, we design with dark mode in mind:

### Semantic Color Tokens

```css
/* Light mode */
--color-background: var(--gray-50);
--color-surface: var(--white);
--color-text: var(--gray-900);
--color-text-muted: var(--gray-500);

/* Dark mode (future) */
--color-background: var(--gray-900);
--color-surface: var(--gray-800);
--color-text: var(--gray-50);
--color-text-muted: var(--gray-400);
```

---

## Accessibility Checklist

Every component must meet these criteria:

- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Focus states visible
- [ ] Keyboard navigable
- [ ] ARIA labels for interactive elements
- [ ] Motion respects prefers-reduced-motion
- [ ] Touch targets ≥ 44px

---

*This document is the source of truth for visual design decisions. The design tokens CSS file (`tokens.css`) implements these values.*
