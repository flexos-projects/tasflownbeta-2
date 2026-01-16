---
id: 006-create-auth-store
sequence: 6
status: pending
dependsOn: ["002"]

inputs:
  docs:
    - ../docs/002-supabase.md
  spec: ../../specs/004-features_auth.md

expectedOutput:
  - src/stores/auth.ts

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Create Auth Store

## Objective

Create a Pinia store for authentication state management.

## File: src/stores/auth.ts

```typescript
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  name: string | null
  avatar_url: string | null
  onboarding_completed: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // State
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const displayName = computed(() =>
    profile.value?.name || user.value?.email?.split('@')[0] || 'User'
  )
  const needsOnboarding = computed(() =>
    isAuthenticated.value && !profile.value?.onboarding_completed
  )

  // Actions
  async function fetchProfile() {
    if (!user.value) return

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (fetchError) {
      console.error('Failed to fetch profile:', fetchError)
      return
    }

    profile.value = data
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      await fetchProfile()
    } catch (e: any) {
      error.value = getAuthErrorMessage(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function signup(email: string, password: string, name: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })

      if (authError) throw authError

      // Profile is created via database trigger
      await fetchProfile()
    } catch (e: any) {
      error.value = getAuthErrorMessage(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    profile.value = null
  }

  async function resetPassword(email: string) {
    loading.value = true
    error.value = null

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
      if (resetError) throw resetError
    } catch (e: any) {
      error.value = getAuthErrorMessage(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user.value) return

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.value.id)
      .select()
      .single()

    if (updateError) throw updateError

    profile.value = data
  }

  async function completeOnboarding() {
    await updateProfile({ onboarding_completed: true })
  }

  // Initialize
  watch(user, (newUser) => {
    if (newUser) {
      fetchProfile()
    } else {
      profile.value = null
    }
  }, { immediate: true })

  return {
    // State
    user,
    profile,
    loading,
    error,
    // Getters
    isAuthenticated,
    displayName,
    needsOnboarding,
    // Actions
    fetchProfile,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    completeOnboarding
  }
})

// Helper function
function getAuthErrorMessage(error: any): string {
  const messages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/too-many-requests': 'Too many attempts. Please try again later.'
  }

  return messages[error.code] || error.message || 'An error occurred'
}
```

## Acceptance Criteria

- [ ] Auth store created with Pinia
- [ ] Login/signup/logout working
- [ ] Profile fetching working
- [ ] Onboarding state tracked
- [ ] Error handling implemented
- [ ] TypeScript passes
