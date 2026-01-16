---
id: 015-create-navigation
sequence: 15
status: pending
dependsOn: ["003", "005"]

inputs:
  prototype: ../../prototype/shared/components.css
  spec: ../../specs/003-features_core.md

expectedOutput:
  - src/components/layout/Sidebar.vue
  - src/components/layout/Header.vue
  - src/components/layout/BottomNav.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
  - responsive: [375, 768, 1024]
---

# Task: Create Navigation Components

## Objective

Create the navigation components (Sidebar, Header, BottomNav) that work across all authenticated pages.

## Files to Create

### 1. src/components/layout/Sidebar.vue

Desktop sidebar navigation (hidden on mobile).

```vue
<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { to: '/dashboard', icon: 'LucideHome', label: 'Dashboard' },
  { to: '/projects', icon: 'LucideFolder', label: 'Projects' },
  { to: '/settings', icon: 'LucideSettings', label: 'Settings' }
]

const isActive = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <NuxtLink to="/dashboard" class="logo-link">
        <span class="logo-text">TaskFlow</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="['nav-item', { active: isActive(item.to) }]"
      >
        <component :is="item.icon" class="nav-icon" />
        <span class="nav-label">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User Menu -->
    <div class="sidebar-footer">
      <div class="user-info">
        <Avatar :name="authStore.displayName" :src="authStore.avatarUrl" size="sm" />
        <div class="user-details">
          <span class="user-name">{{ authStore.displayName }}</span>
          <span class="user-email">{{ authStore.email }}</span>
        </div>
      </div>
      <button class="logout-btn" @click="authStore.logout">
        <LucideLogOut class="w-4 h-4" />
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  height: 100dvh;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
}

.sidebar-logo {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
}

.logo-text {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: var(--transition-base);
}

.nav-item:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.nav-item.active {
  background: var(--color-primary);
  color: white;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  min-width: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  padding: var(--space-2);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-base);
}

.logout-btn:hover {
  background: var(--color-danger);
  color: white;
}

/* Hide on mobile */
@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
}
</style>
```

### 2. src/components/layout/Header.vue

Mobile header bar.

```vue
<script setup lang="ts">
interface Props {
  title?: string
  showBack?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: false
})

const router = useRouter()
const authStore = useAuthStore()

const goBack = () => {
  router.back()
}
</script>

<template>
  <header class="mobile-header">
    <div class="header-left">
      <button v-if="showBack" class="header-btn" @click="goBack">
        <LucideArrowLeft class="w-5 h-5" />
      </button>
      <button v-else class="header-btn menu-btn">
        <LucideMenu class="w-5 h-5" />
      </button>
    </div>

    <div class="header-center">
      <span v-if="title" class="header-title">{{ title }}</span>
      <NuxtLink v-else to="/dashboard" class="header-logo">
        TaskFlow
      </NuxtLink>
    </div>

    <div class="header-right">
      <button class="header-btn">
        <LucideBell class="w-5 h-5" />
      </button>
      <NuxtLink to="/settings/profile">
        <Avatar :name="authStore.displayName" :src="authStore.avatarUrl" size="sm" />
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.mobile-header {
  display: none;
  height: 56px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-3);
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 30;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.header-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
}

.header-btn:hover {
  background: var(--color-bg);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-title {
  font-weight: var(--font-semibold);
}

.header-logo {
  font-weight: var(--font-bold);
  color: var(--color-primary);
  text-decoration: none;
}

/* Show only on mobile */
@media (max-width: 767px) {
  .mobile-header {
    display: flex;
  }
}
</style>
```

### 3. src/components/layout/BottomNav.vue

Mobile bottom navigation bar.

```vue
<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/dashboard', icon: 'LucideHome', label: 'Home' },
  { to: '/projects', icon: 'LucideFolder', label: 'Projects' },
  { to: '/projects/new', icon: 'LucidePlus', label: 'New', primary: true },
  { to: '/notifications', icon: 'LucideBell', label: 'Alerts' },
  { to: '/settings', icon: 'LucideSettings', label: 'Settings' }
]

const isActive = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path.replace('/new', ''))
}
</script>

<template>
  <nav class="bottom-nav">
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      :class="[
        'nav-item',
        { active: isActive(item.to), primary: item.primary }
      ]"
    >
      <component :is="item.icon" class="nav-icon" />
      <span class="nav-label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(56px + var(--safe-area-bottom, 0px));
  padding-bottom: var(--safe-area-bottom, 0px);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  z-index: 40;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: var(--transition-base);
  padding: var(--space-2);
}

.nav-item:hover,
.nav-item.active {
  color: var(--color-primary);
}

.nav-item.primary {
  position: relative;
}

.nav-item.primary .nav-icon {
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  padding: var(--space-2);
  width: 40px;
  height: 40px;
  margin-top: -12px;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.nav-label {
  font-size: var(--text-xs);
}

/* Show only on mobile */
@media (max-width: 767px) {
  .bottom-nav {
    display: flex;
  }
}
</style>
```

## Integration with Default Layout

Update `src/layouts/default.vue` to include navigation:

```vue
<template>
  <div class="app-layout">
    <Sidebar />
    <Header />
    <main class="main-content">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100dvh;
  background: var(--color-bg);
}

.main-content {
  padding: var(--space-6);
}

/* Desktop: offset for sidebar */
@media (min-width: 768px) {
  .main-content {
    margin-left: 240px;
  }
}

/* Mobile: offset for header and bottom nav */
@media (max-width: 767px) {
  .main-content {
    padding-top: calc(56px + var(--space-4));
    padding-bottom: calc(56px + var(--safe-area-bottom, 0px) + var(--space-4));
  }
}
</style>
```

## Acceptance Criteria

- [ ] Sidebar shows on desktop (>=768px)
- [ ] Sidebar hides on mobile (<768px)
- [ ] Header shows on mobile only
- [ ] Bottom nav shows on mobile only
- [ ] Active states work correctly
- [ ] User info displays in sidebar
- [ ] Logout button works
- [ ] All nav items link to correct pages
- [ ] Safe area padding applied on mobile
- [ ] TypeScript passes
