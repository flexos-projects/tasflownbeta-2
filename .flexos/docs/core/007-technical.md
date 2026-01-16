---
type: core
subtype: technical
title: TaskFlow Technical Architecture
description: Tech stack, project structure, API patterns, and deployment
sequence: 7
status: active
---

# TaskFlow Technical Architecture

## Tech Stack Overview

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Nuxt 3 | SSR, file-based routing, Vue ecosystem |
| Styling | Tailwind CSS | Utility-first, design tokens, purging |
| State | Pinia | Simple, TypeScript-first, devtools |
| Database | Supabase (PostgreSQL) | Auth, realtime, RLS, edge functions |
| Hosting | Vercel | Edge deployment, preview builds |
| Analytics | Posthog | Open-source, self-hostable |
| Error Tracking | Sentry | Industry standard |

### Why This Stack?

**Nuxt 3 over Next.js:**
- Vue's reactivity is more intuitive
- Better TypeScript integration out of the box
- Smaller bundle sizes for our use case
- Team familiarity

**Supabase over Firebase:**
- PostgreSQL vs NoSQL gives us real queries
- Row-level security is more intuitive
- No vendor lock-in (can migrate to any Postgres)
- Better for relational data

**Tailwind over CSS-in-JS:**
- Faster development with utility classes
- Smaller production bundles (tree-shaking)
- Design system enforcement
- No runtime cost

---

## Project Structure

```
taskflow/
├── .nuxt/                    # Build output (gitignored)
├── .output/                  # Production build (gitignored)
├── public/                   # Static assets
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── tokens.css    # Design tokens
│   │   │   └── main.css      # Global styles
│   │   └── images/
│   ├── components/
│   │   ├── ui/               # Base UI components
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Card.vue
│   │   │   └── ...
│   │   ├── layout/           # Layout components
│   │   │   ├── Sidebar.vue
│   │   │   ├── Header.vue
│   │   │   └── BottomNav.vue
│   │   ├── project/          # Project-specific components
│   │   │   ├── ProjectCard.vue
│   │   │   └── ProjectForm.vue
│   │   ├── task/             # Task-specific components
│   │   │   ├── TaskItem.vue
│   │   │   ├── TaskList.vue
│   │   │   └── TaskForm.vue
│   │   └── notification/     # Notification components
│   │       ├── NotificationBell.vue
│   │       └── NotificationItem.vue
│   ├── composables/
│   │   ├── useAuth.ts        # Authentication state
│   │   ├── useProjects.ts    # Projects data/actions
│   │   ├── useTasks.ts       # Tasks data/actions
│   │   ├── useNotifications.ts
│   │   └── useToast.ts       # Toast notifications
│   ├── layouts/
│   │   ├── default.vue       # App layout (sidebar + header)
│   │   ├── auth.vue          # Auth pages layout
│   │   ├── public.vue        # Public pages layout
│   │   └── onboarding.vue    # Onboarding flow layout
│   ├── middleware/
│   │   ├── auth.ts           # Require authentication
│   │   └── guest.ts          # Redirect if authenticated
│   ├── pages/
│   │   ├── index.vue         # Landing page
│   │   ├── login.vue
│   │   ├── signup.vue
│   │   ├── dashboard.vue
│   │   ├── projects/
│   │   │   ├── index.vue     # Projects list
│   │   │   └── [id]/
│   │   │       ├── index.vue # Project detail
│   │   │       └── settings.vue
│   │   ├── settings/
│   │   │   ├── index.vue
│   │   │   ├── profile.vue
│   │   │   ├── notifications.vue
│   │   │   └── account.vue
│   │   └── onboarding/
│   │       ├── index.vue
│   │       ├── profile.vue
│   │       ├── project.vue
│   │       └── complete.vue
│   ├── plugins/
│   │   ├── supabase.client.ts
│   │   └── posthog.client.ts
│   ├── server/
│   │   ├── api/
│   │   │   └── ...           # API routes
│   │   └── middleware/
│   │       └── ...           # Server middleware
│   ├── stores/
│   │   ├── auth.ts           # Auth state
│   │   ├── projects.ts       # Projects state
│   │   ├── tasks.ts          # Tasks state
│   │   └── notifications.ts  # Notifications state
│   ├── types/
│   │   ├── index.ts          # Shared types
│   │   ├── database.ts       # Database types
│   │   └── api.ts            # API types
│   └── utils/
│       ├── date.ts           # Date formatting
│       ├── validation.ts     # Form validation
│       └── helpers.ts        # Misc helpers
├── supabase/
│   ├── migrations/           # Database migrations
│   ├── functions/            # Edge functions
│   └── seed.sql              # Seed data for dev
├── .env.example              # Environment variables template
├── .eslintrc.js
├── .prettierrc
├── nuxt.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## API Design

### Client-Side Data Fetching

Use Supabase client directly for CRUD operations:

```typescript
// composables/useProjects.ts
export function useProjects() {
  const supabase = useSupabaseClient()
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchProjects() {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .is('archived_at', null)
      .order('updated_at', { ascending: false })

    if (fetchError) {
      error.value = fetchError
    } else {
      projects.value = data
    }

    loading.value = false
  }

  return { projects, loading, error, fetchProjects }
}
```

### Server-Side API Routes

For complex operations or when we need server-side logic:

```typescript
// server/api/projects/[id]/archive.post.ts
export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')
  const supabase = await serverSupabaseServiceRole(event)

  // Archive project
  const { error } = await supabase
    .from('projects')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', projectId)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
```

### Real-Time Subscriptions

```typescript
// Subscribe to task changes in a project
const channel = supabase
  .channel(`project:${projectId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'tasks',
      filter: `project_id=eq.${projectId}`
    },
    (payload) => {
      handleTaskChange(payload)
    }
  )
  .subscribe()
```

---

## State Management

### Pinia Store Structure

```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(true)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const displayName = computed(() => profile.value?.name || user.value?.email)

  // Actions
  async function login(email: string, password: string) { ... }
  async function logout() { ... }
  async function fetchProfile() { ... }

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    displayName,
    login,
    logout,
    fetchProfile
  }
})
```

### State Synchronization

```
┌─────────────────┐
│   Supabase      │ ◄─── Single source of truth
└────────┬────────┘
         │
         │ Realtime subscription
         ▼
┌─────────────────┐
│   Pinia Store   │ ◄─── Client-side cache
└────────┬────────┘
         │
         │ Reactive binding
         ▼
┌─────────────────┐
│   Components    │ ◄─── UI
└─────────────────┘
```

---

## Authentication Flow

### Supabase Auth + Nuxt

```typescript
// plugins/supabase.client.ts
export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()

  // Listen to auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    authStore.user = session?.user ?? null

    if (session?.user) {
      authStore.fetchProfile()
    }
  })
})
```

### Auth Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login', {
      query: { redirect: to.fullPath }
    })
  }
})
```

---

## Performance Optimizations

### Code Splitting

Nuxt handles this automatically with file-based routing:
- Each page is a separate chunk
- Components are auto-imported and tree-shaken

### Caching Strategy

```typescript
// composables/useProjects.ts
const CACHE_KEY = 'projects-cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function fetchProjects(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_TTL) {
        projects.value = data
        return
      }
    }
  }

  // Fetch from Supabase...
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: projects.value,
    timestamp: Date.now()
  }))
}
```

### Image Optimization

Use `@nuxt/image` for automatic optimization:

```vue
<NuxtImg
  src="/images/hero.png"
  width="800"
  height="600"
  format="webp"
  loading="lazy"
/>
```

---

## Error Handling

### Global Error Handler

```typescript
// plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // Log to Sentry
    Sentry.captureException(error, {
      extra: { component: instance?.$options.name, info }
    })

    // Show toast to user
    const toast = useToast()
    toast.error('Something went wrong. Please try again.')
  }
})
```

### API Error Handling

```typescript
async function createTask(task: Partial<Task>) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    if (error.code === '23505') {
      throw new Error('Task already exists')
    }
    throw error
  }
}
```

---

## Testing Strategy

### Unit Tests

Using Vitest for composables and utilities:

```typescript
// tests/composables/useProjects.test.ts
describe('useProjects', () => {
  it('fetches projects for current user', async () => {
    const { projects, fetchProjects } = useProjects()
    await fetchProjects()
    expect(projects.value.length).toBeGreaterThan(0)
  })
})
```

### Component Tests

Using Vue Test Utils:

```typescript
// tests/components/TaskItem.test.ts
describe('TaskItem', () => {
  it('renders task title', () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask }
    })
    expect(wrapper.text()).toContain(mockTask.title)
  })
})
```

### E2E Tests

Using Playwright:

```typescript
// tests/e2e/create-task.spec.ts
test('user can create a task', async ({ page }) => {
  await page.goto('/projects/1')
  await page.fill('[data-testid="task-input"]', 'New task')
  await page.press('[data-testid="task-input"]', 'Enter')
  await expect(page.locator('[data-testid="task-item"]')).toContainText('New task')
})
```

---

## Deployment

### Environment Variables

```bash
# .env.example
NUXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NUXT_PUBLIC_POSTHOG_KEY=phc_...
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".output/public",
  "framework": "nuxt"
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
      - uses: vercel/deploy@v1
```

---

## Security Checklist

- [ ] All API routes validate input
- [ ] Supabase RLS enabled on all tables
- [ ] No secrets in client-side code
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting on auth endpoints
- [ ] Secure HTTP headers (CSP, HSTS, etc.)
- [ ] Dependencies regularly updated
- [ ] Security audit quarterly

---

*This document is the source of truth for technical decisions. For implementation details, see the build tasks.*
