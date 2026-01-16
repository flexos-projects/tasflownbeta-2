---
type: agent
title: TaskFlow Build Agent
version: 1
---

# Agent Instructions

## Context

You are building TaskFlow, a lightweight task management application. The app is built with Nuxt 3, styled with Tailwind CSS, uses Supabase for auth and database, and is hosted on Vercel.

This is a full build from scratch—there is no existing codebase to preserve.

## Project Goals

1. **Simplify task management** - Clean, focused interface for managing projects and tasks
2. **Mobile-first design** - Works beautifully on all devices
3. **Real-time collaboration** - Live updates via Supabase Realtime
4. **Fast onboarding** - 4-step flow to get users productive quickly

## Tech Stack

- **Framework:** Nuxt 3
- **Runtime:** Vue 3 with Composition API
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS (configured with design tokens)
- **State:** Pinia
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime
- **Icons:** Lucide Vue Next
- **Hosting:** Vercel

## Design System

All visual decisions are documented in:
- `prototype/shared/tokens.css` - Color, typography, spacing values
- `prototype/shared/components.css` - Component styles
- `prototype/patterns/components.md` - Component usage
- `prototype/patterns/layouts.md` - Page structure
- `prototype/patterns/decisions.md` - Design rationale

**Critical:** Match prototypes exactly. The HTML files in `prototype/` are the visual contract.

## Data Sources

Mock data comes from:
- `prototype/shared/mockdb-data.json` - Mock data for prototypes

This data should inform the production data models in Supabase.

## Code Style

### Vue Components
```vue
<script setup lang="ts">
// TypeScript with setup syntax
interface Props {
  title: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <div class="component">
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
  </div>
</template>
```

### File Organization
```
src/
├── components/
│   ├── ui/           # Button, Card, Input, etc.
│   ├── layout/       # Sidebar, Header, BottomNav
│   ├── landing/      # Landing page sections
│   ├── dashboard/    # Dashboard components
│   └── projects/     # Project components
├── composables/      # Vue composables
├── layouts/          # Nuxt layouts
├── middleware/       # Route middleware
├── pages/            # Routes
├── plugins/          # Nuxt plugins
├── stores/           # Pinia stores
├── types/            # TypeScript definitions
└── assets/
    └── css/          # Global CSS, tokens
```

## Common Mistakes to Avoid

1. **Don't invent colors** - Use CSS variables from tokens.css
2. **Don't skip responsive** - Test at 320px, 768px, 1024px, 1440px
3. **Don't forget loading states** - Every async operation needs feedback
4. **Don't use Options API** - Always use Composition API with setup
5. **Don't overcomplicate** - Keep components focused and simple

## Testing Checklist

Before marking a task complete:
- [ ] Matches prototype visually
- [ ] Responsive down to 320px
- [ ] TypeScript strict mode passes
- [ ] No console errors
- [ ] Links and navigation work
- [ ] Loading states shown
- [ ] Error states handled

## Commit Messages

Use conventional commits:
```
feat: add dashboard page layout
fix: correct task card spacing
style: adjust button hover states
```
