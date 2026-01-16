---
id: 002-install-dependencies
sequence: 2
status: pending
dependsOn: ["001"]

inputs:
  docs:
    - ../docs/001-nuxt3.md
    - ../docs/002-supabase.md

expectedOutput:
  - package.json

validation:
  - command: "pnpm install"
    expect: "success"
---

# Task: Install Dependencies

## Objective

Install all required dependencies for TaskFlow.

## Dependencies

### Nuxt Modules
```bash
pnpm add @nuxtjs/supabase @nuxtjs/tailwindcss @pinia/nuxt nuxt-lucide-icons
```

### Development
```bash
pnpm add -D typescript @types/node eslint prettier
```

## nuxt.config.ts Updates

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-lucide-icons'
  ],

  supabase: {
    redirect: false
  },

  runtimeConfig: {
    supabaseServiceKey: '',
    public: {
      supabaseUrl: '',
      supabaseAnonKey: ''
    }
  }
})
```

## Package Versions (Reference)

| Package | Version |
|---------|---------|
| nuxt | ^3.x |
| @nuxtjs/supabase | ^1.x |
| @nuxtjs/tailwindcss | ^6.x |
| @pinia/nuxt | ^0.5.x |
| nuxt-lucide-icons | ^1.x |

## Acceptance Criteria

- [ ] All dependencies installed
- [ ] Modules configured in nuxt.config.ts
- [ ] Supabase module configured
- [ ] `pnpm dev` starts without errors
- [ ] No peer dependency warnings
