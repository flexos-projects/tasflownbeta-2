---
id: 009-create-login-page
sequence: 9
status: pending
dependsOn: ["005", "006"]

inputs:
  prototype: ../../prototype/005-login.html
  spec: ../../specs/010-pages_login.md

expectedOutput:
  - src/pages/login.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Create Login Page

## Objective

Create the login page matching `prototype/005-login.html` exactly.

## File: src/pages/login.vue

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})

useHead({
  title: 'Sign In - TaskFlow'
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = ref({
  email: '',
  password: ''
})
const errors = ref<Record<string, string>>({})
const submitting = ref(false)

const validate = () => {
  errors.value = {}

  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email'
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true
  errors.value = {}

  try {
    await authStore.login(form.value.email, form.value.password)

    // Redirect to intended page or dashboard
    const redirect = route.query.redirect as string
    await navigateTo(redirect || '/dashboard')
  } catch (e: any) {
    errors.value.form = authStore.error || 'Invalid credentials'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <div class="auth-header">
      <NuxtLink to="/" class="auth-logo">
        TaskFlow
      </NuxtLink>
      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-subtitle">Sign in to your account</p>
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <!-- Form error -->
      <div v-if="errors.form" class="alert alert-error">
        {{ errors.form }}
      </div>

      <!-- Email -->
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <Input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          :error="!!errors.email"
        />
        <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
      </div>

      <!-- Password -->
      <div class="form-group">
        <div class="flex justify-between items-center">
          <label class="form-label" for="password">Password</label>
          <NuxtLink to="/forgot-password" class="text-sm text-primary">
            Forgot password?
          </NuxtLink>
        </div>
        <Input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Enter your password"
          :error="!!errors.password"
        />
        <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
      </div>

      <!-- Submit -->
      <Button
        type="submit"
        variant="primary"
        size="lg"
        block
        :loading="submitting"
        :disabled="submitting"
      >
        Sign In
      </Button>
    </form>

    <div class="auth-footer">
      <p class="text-sm text-muted">
        Don't have an account?
        <NuxtLink to="/signup" class="text-primary font-medium">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.auth-logo {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
}

.auth-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  margin-top: var(--space-4);
}

.auth-subtitle {
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.auth-footer {
  text-align: center;
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}
</style>
```

## Acceptance Criteria

- [ ] Matches prototype exactly
- [ ] Form validation working
- [ ] Error states displayed
- [ ] Loading state on submit
- [ ] Redirect after login
- [ ] Guest middleware applied
- [ ] Uses auth layout
- [ ] TypeScript passes
