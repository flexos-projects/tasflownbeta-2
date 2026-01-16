---
id: 017-add-auth-middleware
sequence: 17
status: pending
dependsOn: ["006", "016"]

inputs:
  docs:
    - ../docs/001-nuxt3.md
    - ../docs/002-supabase.md
  spec: ../../specs/004-features_auth.md

expectedOutput:
  - src/middleware/auth.ts

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Add Auth Middleware

## Objective

Create the auth middleware that protects authenticated routes and handles session management.

## Files to Create

### 1. src/middleware/auth.ts

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const authStore = useAuthStore()

  // Wait for auth state to initialize
  if (process.client) {
    // Give time for Supabase auth state to hydrate
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Not authenticated - redirect to login
  if (!user.value) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }

  // Load profile if not loaded
  if (!authStore.profile) {
    await authStore.fetchProfile()
  }

  // Check if user needs onboarding (new users)
  if (authStore.profile && !authStore.profile.onboarding_completed) {
    // Allow access to onboarding pages
    if (to.path.startsWith('/onboarding')) {
      return
    }
    // Redirect to onboarding
    return navigateTo('/onboarding')
  }
})
```

## Auth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Auth Middleware Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User requests protected route                                   │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │ Is user logged  │                                            │
│  │     in?         │                                            │
│  └────────┬────────┘                                            │
│           │                                                     │
│    ┌──────┴──────┐                                              │
│    │             │                                              │
│    No           Yes                                             │
│    │             │                                              │
│    ▼             ▼                                              │
│  Redirect    ┌─────────────────┐                                │
│  to /login   │ Has profile     │                                │
│  with        │ been loaded?    │                                │
│  ?redirect   └────────┬────────┘                                │
│                       │                                         │
│                ┌──────┴──────┐                                  │
│                │             │                                  │
│                No           Yes                                 │
│                │             │                                  │
│                ▼             ▼                                  │
│          Fetch profile  ┌─────────────────┐                     │
│                │        │ Onboarding      │                     │
│                │        │ completed?      │                     │
│                │        └────────┬────────┘                     │
│                │                 │                              │
│                │          ┌──────┴──────┐                       │
│                │          │             │                       │
│                │          No           Yes                      │
│                │          │             │                       │
│                │          ▼             ▼                       │
│                │     Redirect to    Allow access                │
│                │     /onboarding    to route                    │
│                │                                                │
│                └────────►─────────────►──────────►              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Session Handling

### Initial Load (SSR)

```typescript
// In auth.ts middleware
export default defineNuxtRouteMiddleware(async (to, from) => {
  // On server, check session from cookie
  const supabase = useSupabaseClient()

  if (process.server) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return navigateTo('/login')
    }
  }

  // On client, use reactive user
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo('/login')
  }
})
```

### Session Expiry

Add session refresh handling in the auth store:

```typescript
// In stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()

  // Listen for auth state changes
  onMounted(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear state and redirect
        user.value = null
        profile.value = null
        navigateTo('/login')
      }

      if (event === 'TOKEN_REFRESHED') {
        // Session was refreshed automatically
        console.log('Session refreshed')
      }

      if (event === 'USER_UPDATED') {
        // User data changed
        fetchProfile()
      }
    })
  })
})
```

## Route Protection Summary

### Protected Routes (auth middleware)

```typescript
// These pages require auth middleware
const protectedRoutes = [
  '/dashboard',
  '/projects',
  '/projects/:id',
  '/settings',
  '/settings/profile',
  '/settings/notifications',
  '/settings/account',
  '/onboarding',
  '/onboarding/profile',
  '/onboarding/project',
  '/onboarding/complete'
]
```

### Guest Routes (guest middleware)

```typescript
// These pages redirect to dashboard if logged in
const guestRoutes = [
  '/login',
  '/signup',
  '/forgot-password'
]
```

### Public Routes (no middleware)

```typescript
// These pages are always accessible
const publicRoutes = [
  '/',
  '/terms',
  '/privacy'
]
```

## Error Handling

### Network Errors

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    // Auth checks...
  } catch (error) {
    console.error('Auth middleware error:', error)

    // On error, allow navigation but show toast
    const toast = useToast()
    toast.error('Session check failed. Please refresh.')
  }
})
```

### Concurrent Navigation

```typescript
// Prevent duplicate redirects
let isRedirecting = false

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (isRedirecting) return

  const user = useSupabaseUser()

  if (!user.value) {
    isRedirecting = true
    try {
      return navigateTo('/login')
    } finally {
      isRedirecting = false
    }
  }
})
```

## Testing Auth Middleware

### Test Cases

1. **Unauthenticated access to protected route**
   - Expected: Redirect to `/login?redirect=/protected-route`

2. **Authenticated access to protected route**
   - Expected: Allow access

3. **New user accessing protected route**
   - Expected: Redirect to `/onboarding`

4. **Session expires while on protected route**
   - Expected: Redirect to `/login` on next navigation

5. **Network error during auth check**
   - Expected: Log error, show toast, allow navigation

## Acceptance Criteria

- [ ] Auth middleware protects all authenticated routes
- [ ] Unauthenticated users redirected to login
- [ ] Login redirect preserves original destination
- [ ] New users (onboarding incomplete) redirected to onboarding
- [ ] Session expiry handled gracefully
- [ ] Auth state changes trigger appropriate updates
- [ ] No infinite redirect loops
- [ ] Works correctly on SSR and client-side navigation
- [ ] TypeScript passes
