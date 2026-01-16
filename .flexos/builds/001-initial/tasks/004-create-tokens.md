---
id: 004-create-tokens
sequence: 4
status: pending
dependsOn: ["001", "002"]

inputs:
  tokens: ../../prototype/shared/tokens.css

expectedOutput:
  - src/assets/css/tokens.css

validation:
  - file_exists: "src/assets/css/tokens.css"
---

# Task: Create Design Tokens

## Objective

Copy and adapt the prototype design tokens for use in the Nuxt application.

## Source

Copy from `prototype/shared/tokens.css` - this file contains all design tokens for:
- Colors
- Typography
- Spacing
- Radius
- Shadows
- Transitions
- Z-index

## Steps

1. Read `prototype/shared/tokens.css`
2. Create `src/assets/css/tokens.css` with the same content
3. Update nuxt.config.ts to include the CSS:

```typescript
export default defineNuxtConfig({
  css: ['~/assets/css/tokens.css']
})
```

## Key Tokens (Reference)

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-background: #fafafa;
  --color-surface: #ffffff;
  --color-border: #e5e7eb;
  --color-text: #111827;
  --color-text-muted: #6b7280;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Typography */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

  /* Transitions */
  --duration-150: 150ms;
  --duration-200: 200ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Z-index */
  --z-dropdown: 100;
  --z-modal: 500;
  --z-toast: 800;
}
```

## Acceptance Criteria

- [ ] tokens.css copied from prototype
- [ ] CSS loaded in nuxt.config.ts
- [ ] All CSS variables accessible in components
- [ ] No hardcoded values in source file
