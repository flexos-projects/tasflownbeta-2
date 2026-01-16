# Nuxt 3 Build Documentation

Quick reference for Nuxt 3 patterns used in TaskFlow builds.

---

## Project Setup

### Initialize Project

```bash
npx nuxi@latest init taskflow
cd taskflow
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate",
    "typecheck": "nuxt typecheck",
    "lint": "eslint ."
  }
}
```

---

## Configuration

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    'nuxt-lucide-icons'
  ],

  // Source directory
  srcDir: 'src/',

  // Runtime config (env vars)
  runtimeConfig: {
    // Server-only
    supabaseServiceKey: '',
    // Public (exposed to client)
    public: {
      supabaseUrl: '',
      supabaseAnonKey: ''
    }
  },

  // Supabase module config
  supabase: {
    redirect: false // We handle auth redirects manually
  },

  // CSS
  css: ['~/assets/css/tokens.css'],

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },

  // App config
  app: {
    head: {
      title: 'TaskFlow',
      meta: [
        { name: 'description', content: 'Lightweight task management' }
      ]
    }
  }
})
```

---

## Directory Structure

```
taskflow/
├── nuxt.config.ts
├── package.json
├── app.vue
│
├── src/
│   ├── assets/
│   │   └── css/
│   │       └── tokens.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   │
│   ├── composables/
│   │   └── useProjects.ts
│   │
│   ├── layouts/
│   │   └── default.vue
│   │
│   ├── middleware/
│   │   └── auth.ts
│   │
│   ├── pages/
│   │   ├── index.vue
│   │   └── projects/
│   │       └── [id].vue
│   │
│   ├── plugins/
│   │   └── supabase.client.ts
│   │
│   ├── server/
│   │   └── api/
│   │
│   └── stores/
│       └── auth.ts
│
└── supabase/
    └── migrations/
```

---

## Auto-Imports

Nuxt 3 auto-imports these (no import statements needed):

### Vue Composition API
```typescript
ref, reactive, computed, watch, watchEffect
onMounted, onUnmounted, onBeforeMount
provide, inject
nextTick
```

### Nuxt Composables
```typescript
useRuntimeConfig()      // Access config
useRoute()              // Current route
useRouter()             // Router instance
useFetch()              // Data fetching
useAsyncData()          // Async data
useState()              // SSR-safe state
useHead()               // Meta tags
useCookie()             // Cookie management
navigateTo()            // Programmatic navigation
definePageMeta()        // Page metadata
```

### Pinia
```typescript
defineStore()
storeToRefs()
```

### Supabase (with @nuxtjs/supabase)
```typescript
useSupabaseClient()     // Supabase client
useSupabaseUser()       // Current user
```

---

## Component Pattern

```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-disabled': disabled }
    ]"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
```

---

## Page Pattern

```vue
<script setup lang="ts">
// Page metadata
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// SEO
useHead({
  title: 'Dashboard - TaskFlow'
})

// Data fetching
const supabase = useSupabaseClient()
const { data: tasks, pending } = await useAsyncData('tasks', async () => {
  const { data } = await supabase.from('tasks').select('*')
  return data
})
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <div v-if="pending">Loading...</div>
    <div v-else>
      <TaskList :tasks="tasks" />
    </div>
  </div>
</template>
```

---

## Routing

### File-Based Routes

```
src/pages/
├── index.vue              → /
├── login.vue              → /login
├── dashboard.vue          → /dashboard
│
├── projects/
│   ├── index.vue          → /projects
│   └── [id]/
│       └── index.vue      → /projects/:id
│
└── settings/
    ├── index.vue          → /settings
    └── profile.vue        → /settings/profile
```

### Dynamic Routes

```vue
<!-- src/pages/projects/[id]/index.vue -->
<script setup lang="ts">
const route = useRoute()
const projectId = computed(() => route.params.id as string)
</script>
```

### Navigation

```vue
<script setup lang="ts">
// Programmatic navigation
const goToProject = (id: string) => {
  navigateTo(`/projects/${id}`)
}

// With replace
navigateTo('/login', { replace: true })
</script>

<template>
  <NuxtLink to="/dashboard">Dashboard</NuxtLink>
</template>
```

---

## Middleware

### Auth Middleware

```typescript
// src/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login')
  }
})
```

### Guest Middleware

```typescript
// src/middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  if (user.value) {
    return navigateTo('/dashboard')
  }
})
```

### Using Middleware

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script>
```

---

## Layouts

### Default Layout

```vue
<!-- src/layouts/default.vue -->
<template>
  <div class="app-shell">
    <Sidebar />
    <main class="app-content">
      <Header />
      <slot />
    </main>
  </div>
</template>
```

### Auth Layout

```vue
<!-- src/layouts/auth.vue -->
<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>
```

### Using Layouts

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
</script>
```

---

## Pinia Stores

### Define Store

```typescript
// src/stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const loading = ref(false)
  const profile = ref<Profile | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  async function login(email: string, password: string) {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    loading.value = false
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    login,
    logout
  }
})
```

### Use Store

```vue
<script setup lang="ts">
const authStore = useAuthStore()
const { user, loading } = storeToRefs(authStore)

const handleLogout = () => authStore.logout()
</script>
```

---

## References

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [@nuxtjs/supabase](https://supabase.nuxtjs.org/)
