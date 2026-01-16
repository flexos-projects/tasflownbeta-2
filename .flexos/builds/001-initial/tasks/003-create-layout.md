---
id: 003-create-layout
sequence: 3
status: pending
dependsOn: ["001", "002"]

inputs:
  prototype: ../../prototype/002-dashboard.html
  docs:
    - ../docs/001-nuxt3.md

expectedOutput:
  - src/layouts/default.vue
  - src/layouts/auth.vue
  - app.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Create Layouts

## Objective

Create the base layouts matching the prototype structure.

## Files to Create

### 1. app.vue

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### 2. src/layouts/default.vue

The app shell layout with sidebar and content area. Reference: `prototype/002-dashboard.html`

```vue
<template>
  <div class="app-shell">
    <aside class="sidebar">
      <slot name="sidebar">
        <Sidebar />
      </slot>
    </aside>
    <main class="app-content">
      <Header />
      <div class="page-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Sidebar and Header are created in task 015
// For now, use placeholder divs
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100dvh;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--color-background);
}

.page-content {
  flex: 1;
  padding: var(--space-6);
}

@media (max-width: 767px) {
  .sidebar {
    display: none;
  }

  .page-content {
    padding: var(--space-4);
  }
}
</style>
```

### 3. src/layouts/auth.vue

Centered layout for login/signup pages. Reference: `prototype/005-login.html`

```vue
<template>
  <div class="auth-layout">
    <div class="auth-container">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: var(--color-background);
}

.auth-container {
  width: 100%;
  max-width: 400px;
}
</style>
```

## Acceptance Criteria

- [ ] app.vue created
- [ ] default.vue layout matches prototype structure
- [ ] auth.vue layout centered properly
- [ ] Uses design tokens (no hardcoded values)
- [ ] Mobile responsive (sidebar hidden on mobile)
- [ ] TypeScript passes
