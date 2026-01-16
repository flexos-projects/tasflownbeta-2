---
id: 011-create-onboarding-flow
sequence: 11
status: pending
dependsOn: ["005", "006"]

inputs:
  prototype: ../../prototype/007-onboarding.html
  spec: ../../specs/013-flows_onboarding.md

expectedOutput:
  - src/pages/onboarding/index.vue
  - src/pages/onboarding/profile.vue
  - src/pages/onboarding/project.vue
  - src/pages/onboarding/complete.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Create Onboarding Flow

## Objective

Create the 4-step onboarding flow matching `prototype/007-onboarding.html`.

## Onboarding Steps

1. **Welcome** - Introduction, overview
2. **Profile** - Name, avatar
3. **First Project** - Create first project
4. **Complete** - Success, redirect to dashboard

## Files to Create

### 1. src/pages/onboarding/index.vue (Welcome)

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

useHead({
  title: 'Welcome - TaskFlow'
})
</script>

<template>
  <div class="onboarding-card">
    <div class="onboarding-progress">
      <div class="progress-step active" />
      <div class="progress-step" />
      <div class="progress-step" />
      <div class="progress-step" />
    </div>

    <div class="onboarding-content">
      <div class="onboarding-icon">
        <LucideRocket class="w-12 h-12 text-primary" />
      </div>
      <h1 class="onboarding-title">Welcome to TaskFlow</h1>
      <p class="onboarding-description">
        Let's get you set up in just a few steps.
        You'll be managing tasks like a pro in no time.
      </p>
    </div>

    <div class="onboarding-actions">
      <NuxtLink to="/onboarding/profile" class="btn btn-primary btn-lg btn-block">
        Let's Go
      </NuxtLink>
      <button class="btn btn-ghost" @click="skip">
        Skip for now
      </button>
    </div>
  </div>
</template>
```

### 2. src/pages/onboarding/profile.vue

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

const authStore = useAuthStore()
const name = ref(authStore.profile?.name || '')
const saving = ref(false)

const handleNext = async () => {
  saving.value = true
  await authStore.updateProfile({ name: name.value })
  saving.value = false
  await navigateTo('/onboarding/project')
}
</script>

<template>
  <div class="onboarding-card">
    <div class="onboarding-progress">
      <div class="progress-step completed" />
      <div class="progress-step active" />
      <div class="progress-step" />
      <div class="progress-step" />
    </div>

    <div class="onboarding-content">
      <h1 class="onboarding-title">Tell us about yourself</h1>
      <p class="onboarding-description">
        What should we call you?
      </p>

      <div class="form-group mt-6">
        <label class="form-label">Your Name</label>
        <Input v-model="name" placeholder="John Doe" size="lg" />
      </div>
    </div>

    <div class="onboarding-actions">
      <Button
        variant="primary"
        size="lg"
        block
        :loading="saving"
        @click="handleNext"
      >
        Continue
      </Button>
      <NuxtLink to="/onboarding" class="btn btn-ghost">
        Back
      </NuxtLink>
    </div>
  </div>
</template>
```

### 3. src/pages/onboarding/project.vue

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

const { createProject } = useProjects()

const projectName = ref('')
const projectColor = ref('#3b82f6')
const creating = ref(false)

const colors = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899'  // pink
]

const handleCreate = async () => {
  if (!projectName.value.trim()) return

  creating.value = true
  await createProject(projectName.value, projectColor.value)
  creating.value = false
  await navigateTo('/onboarding/complete')
}
</script>

<template>
  <div class="onboarding-card">
    <div class="onboarding-progress">
      <div class="progress-step completed" />
      <div class="progress-step completed" />
      <div class="progress-step active" />
      <div class="progress-step" />
    </div>

    <div class="onboarding-content">
      <h1 class="onboarding-title">Create your first project</h1>
      <p class="onboarding-description">
        Projects help you organize related tasks together.
      </p>

      <div class="space-y-4 mt-6">
        <div class="form-group">
          <label class="form-label">Project Name</label>
          <Input
            v-model="projectName"
            placeholder="e.g., Website Redesign"
            size="lg"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Color</label>
          <div class="color-picker">
            <button
              v-for="color in colors"
              :key="color"
              class="color-option"
              :class="{ selected: color === projectColor }"
              :style="{ backgroundColor: color }"
              @click="projectColor = color"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="onboarding-actions">
      <Button
        variant="primary"
        size="lg"
        block
        :loading="creating"
        :disabled="!projectName.trim()"
        @click="handleCreate"
      >
        Create Project
      </Button>
      <NuxtLink to="/onboarding/profile" class="btn btn-ghost">
        Back
      </NuxtLink>
    </div>
  </div>
</template>
```

### 4. src/pages/onboarding/complete.vue

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.completeOnboarding()
})

const goToDashboard = () => {
  navigateTo('/dashboard')
}
</script>

<template>
  <div class="onboarding-card">
    <div class="onboarding-progress">
      <div class="progress-step completed" />
      <div class="progress-step completed" />
      <div class="progress-step completed" />
      <div class="progress-step active" />
    </div>

    <div class="onboarding-content text-center">
      <div class="onboarding-icon success">
        <LucideCheckCircle class="w-16 h-16 text-green-500" />
      </div>
      <h1 class="onboarding-title">You're all set!</h1>
      <p class="onboarding-description">
        Your workspace is ready. Start adding tasks and
        get things done.
      </p>
    </div>

    <div class="onboarding-actions">
      <Button
        variant="primary"
        size="lg"
        block
        @click="goToDashboard"
      >
        Go to Dashboard
      </Button>
    </div>
  </div>
</template>
```

## Shared Styles

Add to each page or create a shared onboarding style:

```css
.onboarding-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  max-width: 480px;
  width: 100%;
}

.onboarding-progress {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
}

.progress-step {
  flex: 1;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
}

.progress-step.active,
.progress-step.completed {
  background: var(--color-primary);
}

.onboarding-content {
  margin-bottom: var(--space-8);
}

.onboarding-icon {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-4);
}

.onboarding-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  text-align: center;
}

.onboarding-description {
  color: var(--color-text-muted);
  text-align: center;
  margin-top: var(--space-2);
}

.onboarding-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.color-picker {
  display: flex;
  gap: var(--space-2);
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}

.color-option.selected {
  border-color: var(--color-text);
}
```

## Acceptance Criteria

- [ ] All 4 steps created
- [ ] Progress indicator working
- [ ] Profile update working
- [ ] Project creation working
- [ ] Onboarding completion tracked
- [ ] Redirect to dashboard after complete
- [ ] Can skip onboarding
- [ ] TypeScript passes
