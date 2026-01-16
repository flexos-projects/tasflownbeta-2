---
id: 010-create-signup-page
sequence: 10
status: pending
dependsOn: ["005", "006"]

inputs:
  prototype: ../../prototype/006-signup.html
  spec: ../../specs/011-pages_signup.md

expectedOutput:
  - src/pages/signup.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Create Signup Page

## Objective

Create the signup page matching `prototype/006-signup.html`.

## File: src/pages/signup.vue

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})

useHead({
  title: 'Create Account - TaskFlow'
})

const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const agreedToTerms = ref(false)

// Password strength
const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  return strength
})

const strengthLabel = computed(() => {
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  return labels[passwordStrength.value - 1] || ''
})

const validate = () => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  }

  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email'
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  if (!agreedToTerms.value) {
    errors.value.terms = 'You must agree to the terms'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true
  errors.value = {}

  try {
    await authStore.signup(
      form.value.email,
      form.value.password,
      form.value.name
    )

    // Redirect to onboarding
    await navigateTo('/onboarding')
  } catch (e: any) {
    errors.value.form = authStore.error || 'Failed to create account'
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
      <h1 class="auth-title">Create your account</h1>
      <p class="auth-subtitle">Start organizing your work today</p>
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <!-- Form error -->
      <div v-if="errors.form" class="alert alert-error">
        {{ errors.form }}
      </div>

      <!-- Name -->
      <div class="form-group">
        <label class="form-label" for="name">Full Name</label>
        <Input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="John Doe"
          :error="!!errors.name"
        />
        <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
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
        <label class="form-label" for="password">Password</label>
        <Input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="At least 8 characters"
          :error="!!errors.password"
        />
        <!-- Password strength indicator -->
        <div v-if="form.password" class="password-strength">
          <div class="strength-bars">
            <div
              v-for="i in 4"
              :key="i"
              class="strength-bar"
              :class="{ active: i <= passwordStrength }"
            />
          </div>
          <span class="strength-label">{{ strengthLabel }}</span>
        </div>
        <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
      </div>

      <!-- Confirm Password -->
      <div class="form-group">
        <label class="form-label" for="confirmPassword">Confirm Password</label>
        <Input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm your password"
          :error="!!errors.confirmPassword"
        />
        <span v-if="errors.confirmPassword" class="form-error">
          {{ errors.confirmPassword }}
        </span>
      </div>

      <!-- Terms -->
      <div class="form-group">
        <label class="flex items-center gap-2">
          <Checkbox v-model="agreedToTerms" />
          <span class="text-sm">
            I agree to the
            <NuxtLink to="/terms" class="text-primary">Terms of Service</NuxtLink>
            and
            <NuxtLink to="/privacy" class="text-primary">Privacy Policy</NuxtLink>
          </span>
        </label>
        <span v-if="errors.terms" class="form-error">{{ errors.terms }}</span>
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
        Create Account
      </Button>
    </form>

    <div class="auth-footer">
      <p class="text-sm text-muted">
        Already have an account?
        <NuxtLink to="/login" class="text-primary font-medium">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Same styles as login + password strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.strength-bars {
  display: flex;
  gap: 4px;
}

.strength-bar {
  width: 32px;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
}

.strength-bar.active {
  background: var(--color-primary);
}

.strength-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
</style>
```

## Acceptance Criteria

- [ ] Matches prototype
- [ ] Form validation working
- [ ] Password strength indicator
- [ ] Terms checkbox required
- [ ] Redirect to onboarding after signup
- [ ] Guest middleware applied
- [ ] TypeScript passes
