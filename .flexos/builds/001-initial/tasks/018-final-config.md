---
id: 018-final-config
sequence: 18
status: pending
dependsOn: ["017"]

inputs:
  docs:
    - ../docs/001-nuxt3.md
    - ../docs/002-supabase.md
  spec: ../../docs/core/007-technical.md

expectedOutput:
  - nuxt.config.ts
  - .env.example

validation:
  - command: "pnpm typecheck"
    expect: "success"
  - command: "pnpm build"
    expect: "success"
---

# Task: Final Configuration

## Objective

Finalize the Nuxt configuration and create environment example file for deployment.

## Files to Create/Update

### 1. nuxt.config.ts (Final Version)

```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable devtools
  devtools: { enabled: true },

  // Source directory
  srcDir: 'src/',

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Modules
  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-lucide-icons'
  ],

  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/signup', '/terms', '/privacy']
    }
  },

  // Pinia configuration
  pinia: {
    storesDirs: ['./src/stores/**']
  },

  // App configuration
  app: {
    head: {
      title: 'TaskFlow',
      titleTemplate: '%s - TaskFlow',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Lightweight task management for individuals and small teams' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  },

  // CSS
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/base.css'
  ],

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: 'tailwind.config.ts',
    cssPath: '~/assets/css/tailwind.css'
  },

  // Lucide icons configuration
  lucideIcons: {
    prefix: 'Lucide'
  },

  // Runtime config (accessible via useRuntimeConfig)
  runtimeConfig: {
    // Private keys (server-side only)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,

    // Public keys (exposed to client)
    public: {
      appName: 'TaskFlow',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },

  // Experimental features
  experimental: {
    // Enable typed pages
    typedPages: true
  },

  // Nitro (server) configuration
  nitro: {
    preset: 'vercel'
  },

  // Route rules
  routeRules: {
    // Static pages
    '/': { prerender: true },
    '/terms': { prerender: true },
    '/privacy': { prerender: true },

    // SPA pages (client-side rendered)
    '/dashboard/**': { ssr: false },
    '/projects/**': { ssr: false },
    '/settings/**': { ssr: false },
    '/onboarding/**': { ssr: false }
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['pinia']
    }
  },

  // Compatibility
  compatibilityDate: '2024-01-01'
})
```

### 2. .env.example

```bash
# ===========================================
# TaskFlow Environment Variables
# ===========================================
# Copy this file to .env and fill in the values

# -------------------------------------------
# Supabase Configuration
# -------------------------------------------
# Get these from your Supabase project settings:
# https://app.supabase.com/project/_/settings/api

# Project URL (required)
SUPABASE_URL=https://your-project.supabase.co

# Anon/Public key (required for client-side)
SUPABASE_KEY=your-anon-key-here

# Service role key (optional, server-side only)
# WARNING: Never expose this to the client!
SUPABASE_SERVICE_KEY=your-service-role-key

# -------------------------------------------
# Application Configuration
# -------------------------------------------

# Public URL of your app
APP_URL=http://localhost:3000

# -------------------------------------------
# Development
# -------------------------------------------

# Enable Nuxt devtools
NUXT_DEVTOOLS=true
```

### 3. tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/components/**/*.{js,vue,ts}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/plugins/**/*.{js,ts}',
    './src/app.vue',
    './src/error.vue'
  ],
  theme: {
    extend: {
      // Colors reference CSS variables from tokens
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        surface: 'var(--color-surface)',
        bg: 'var(--color-bg)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)'
      },
      // Spacing reference CSS variables
      spacing: {
        'safe-top': 'var(--safe-area-top)',
        'safe-bottom': 'var(--safe-area-bottom)',
        'safe-left': 'var(--safe-area-left)',
        'safe-right': 'var(--safe-area-right)'
      },
      // Border radius
      borderRadius: {
        DEFAULT: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      },
      // Font sizes
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)'
      }
    }
  },
  plugins: []
} satisfies Config
```

### 4. public/manifest.json (PWA Manifest)

```json
{
  "name": "TaskFlow",
  "short_name": "TaskFlow",
  "description": "Lightweight task management for individuals and small teams",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### 5. vercel.json (Deployment Config)

```json
{
  "framework": "nuxt",
  "regions": ["iad1"],
  "env": {
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_KEY": "@supabase-key"
  }
}
```

## Pre-Deployment Checklist

### Environment

- [ ] `.env` file created from `.env.example`
- [ ] `SUPABASE_URL` set correctly
- [ ] `SUPABASE_KEY` set correctly
- [ ] `APP_URL` set for production

### Database

- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Storage bucket created for avatars

### Build

- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` completes successfully
- [ ] `pnpm preview` works locally

### Assets

- [ ] Favicon created (`public/favicon.ico`)
- [ ] App icons created (`public/icons/`)
- [ ] Apple touch icon created (`public/apple-touch-icon.png`)

## Final Project Structure

```
taskflow/
├── .nuxt/                      # Generated
├── node_modules/               # Dependencies
├── public/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── manifest.json
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-512-maskable.png
├── src/
│   ├── assets/
│   │   └── css/
│   │       ├── tokens.css
│   │       ├── base.css
│   │       └── tailwind.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── landing/
│   │   ├── dashboard/
│   │   ├── project/
│   │   └── task/
│   ├── composables/
│   │   ├── useProjects.ts
│   │   ├── useTasks.ts
│   │   └── useToast.ts
│   ├── layouts/
│   │   ├── default.vue
│   │   └── auth.vue
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── guest.ts
│   ├── pages/
│   │   ├── index.vue
│   │   ├── login.vue
│   │   ├── signup.vue
│   │   ├── dashboard.vue
│   │   ├── projects/
│   │   ├── settings/
│   │   └── onboarding/
│   ├── plugins/
│   │   └── supabase.client.ts
│   ├── stores/
│   │   └── auth.ts
│   ├── types/
│   │   └── index.ts
│   └── app.vue
├── .env
├── .env.example
├── .gitignore
├── nuxt.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## Acceptance Criteria

- [ ] nuxt.config.ts includes all modules
- [ ] Supabase module configured correctly
- [ ] Tailwind configured with design tokens
- [ ] .env.example documents all variables
- [ ] PWA manifest created
- [ ] Vercel config ready for deployment
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` completes without errors
- [ ] App runs correctly with `pnpm preview`
