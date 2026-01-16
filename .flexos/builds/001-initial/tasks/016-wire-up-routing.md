---
id: 016-wire-up-routing
sequence: 16
status: pending
dependsOn: ["008", "009", "010", "011", "012", "013", "014", "015"]

inputs:
  docs:
    - ../docs/001-nuxt3.md
  spec: ../../specs/003-features_core.md

expectedOutput:
  - src/middleware/guest.ts

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Wire Up Routing

## Objective

Create the guest middleware and ensure all routes are properly configured.

## Files to Create

### 1. src/middleware/guest.ts

Middleware to redirect authenticated users away from auth pages.

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()

  // Wait for auth state to be ready
  await new Promise(resolve => setTimeout(resolve, 100))

  // If user is logged in, redirect to dashboard
  if (user.value) {
    return navigateTo('/dashboard')
  }
})
```

## Route Configuration

### Public Routes (no middleware)

| Route | Page | Description |
|-------|------|-------------|
| `/` | `pages/index.vue` | Landing page |
| `/terms` | `pages/terms.vue` | Terms of service |
| `/privacy` | `pages/privacy.vue` | Privacy policy |

### Guest Routes (guest middleware)

| Route | Page | Description |
|-------|------|-------------|
| `/login` | `pages/login.vue` | Login page |
| `/signup` | `pages/signup.vue` | Signup page |
| `/forgot-password` | `pages/forgot-password.vue` | Password reset |

### Authenticated Routes (auth middleware)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | `pages/dashboard.vue` | User dashboard |
| `/projects` | `pages/projects/index.vue` | Projects list |
| `/projects/:id` | `pages/projects/[id]/index.vue` | Project detail |
| `/settings` | `pages/settings/index.vue` | Settings hub |
| `/settings/profile` | `pages/settings/profile.vue` | Profile settings |
| `/settings/notifications` | `pages/settings/notifications.vue` | Notification prefs |
| `/settings/account` | `pages/settings/account.vue` | Account settings |
| `/onboarding` | `pages/onboarding/index.vue` | Onboarding start |
| `/onboarding/profile` | `pages/onboarding/profile.vue` | Profile setup |
| `/onboarding/project` | `pages/onboarding/project.vue` | First project |
| `/onboarding/complete` | `pages/onboarding/complete.vue` | Onboarding done |

## Page Meta Examples

### Guest Page (login, signup)

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})
</script>
```

### Authenticated Page (dashboard, projects)

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script>
```

### Public Page (landing)

```vue
<script setup lang="ts">
definePageMeta({
  layout: false  // No layout, full page
})
</script>
```

## Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Unauthenticated User                                           │
│  ┌─────────────┐                                                │
│  │ Landing (/) │                                                │
│  └──────┬──────┘                                                │
│         │                                                       │
│    ┌────┴────┐                                                  │
│    │         │                                                  │
│    ▼         ▼                                                  │
│  Login    Signup                                                │
│    │         │                                                  │
│    │    ┌────┴────────────────────────┐                         │
│    │    │                             │                         │
│    │    ▼                             │                         │
│    │  Onboarding (new users)          │                         │
│    │    │                             │                         │
│    │    ▼                             │                         │
│    └───►Dashboard◄────────────────────┘                         │
│                                                                 │
│  Authenticated User                                             │
│  ┌───────────┐    ┌──────────┐    ┌──────────┐                  │
│  │ Dashboard │◄──►│ Projects │◄──►│ Settings │                  │
│  └───────────┘    └──────────┘    └──────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Redirect Handling

### After Login

```typescript
// In login.vue handleSubmit
const redirect = route.query.redirect as string
await navigateTo(redirect || '/dashboard')
```

### After Signup

```typescript
// In signup.vue handleSubmit
// New users go to onboarding
await navigateTo('/onboarding')
```

### After Onboarding

```typescript
// In onboarding/complete.vue
await navigateTo('/dashboard')
```

### Auth Redirect (protected page accessed while logged out)

```typescript
// In auth.ts middleware
if (!user.value) {
  return navigateTo({
    path: '/login',
    query: { redirect: to.fullPath }
  })
}
```

## Error Pages

### 404 Not Found

Create `pages/[...slug].vue` or `error.vue`:

```vue
<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page not found</h2>
      <p class="error-description">
        The page you're looking for doesn't exist.
      </p>
      <NuxtLink to="/" class="btn btn-primary">
        Go Home
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.error-content {
  text-align: center;
}

.error-code {
  font-size: 6rem;
  font-weight: var(--font-bold);
  color: var(--color-primary);
  line-height: 1;
}

.error-title {
  font-size: var(--text-2xl);
  margin-top: var(--space-4);
}

.error-description {
  color: var(--color-text-muted);
  margin-top: var(--space-2);
  margin-bottom: var(--space-6);
}
</style>
```

## Acceptance Criteria

- [ ] Guest middleware redirects logged-in users to dashboard
- [ ] Auth middleware redirects logged-out users to login
- [ ] Login remembers redirect URL
- [ ] Signup redirects to onboarding
- [ ] Onboarding redirects to dashboard
- [ ] 404 page displays properly
- [ ] All routes use correct middleware
- [ ] All routes use correct layout
- [ ] TypeScript passes
