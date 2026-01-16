---
id: 012-create-dashboard-page
sequence: 12
status: pending
dependsOn: ["005", "006", "007"]

inputs:
  prototype: ../../prototype/002-dashboard.html
  spec: ../../specs/007-pages_dashboard.md

expectedOutput:
  - src/pages/dashboard.vue
  - src/components/dashboard/TodaysTasks.vue
  - src/components/dashboard/OverdueTasks.vue
  - src/components/dashboard/RecentProjects.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
  - responsive: [375, 768, 1024]
---

# Task: Create Dashboard Page

## Objective

Create the dashboard page matching `prototype/002-dashboard.html` exactly.

## Files to Create

### 1. src/pages/dashboard.vue

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'Dashboard - TaskFlow'
})

const authStore = useAuthStore()
const { projects, fetchProjects, loading: projectsLoading } = useProjects()

onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <div class="dashboard">
    <!-- Page Header -->
    <header class="page-header">
      <div>
        <h1 class="page-title">
          Welcome back, {{ authStore.displayName }}
        </h1>
        <p class="page-subtitle">
          Here's what's on your plate today
        </p>
      </div>
      <div class="page-header-actions">
        <NuxtLink to="/projects" class="btn btn-primary">
          <LucidePlus class="w-4 h-4 mr-2" />
          New Project
        </NuxtLink>
      </div>
    </header>

    <!-- Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Today's Tasks -->
      <section class="dashboard-section">
        <TodaysTasks />
      </section>

      <!-- Overdue Tasks -->
      <section class="dashboard-section">
        <OverdueTasks />
      </section>

      <!-- Recent Projects -->
      <section class="dashboard-section dashboard-section-wide">
        <RecentProjects :projects="projects" :loading="projectsLoading" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-section-wide {
    grid-column: span 2;
  }
}
</style>
```

### 2. src/components/dashboard/TodaysTasks.vue

```vue
<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const tasks = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!user.value) return

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('tasks')
    .select('*, projects(name, color)')
    .eq('due_date', today)
    .eq('done', false)
    .order('created_at', { ascending: true })
    .limit(5)

  tasks.value = data || []
  loading.value = false
})

const toggleTask = async (task: any) => {
  await supabase
    .from('tasks')
    .update({ done: true })
    .eq('id', task.id)

  tasks.value = tasks.value.filter(t => t.id !== task.id)
}
</script>

<template>
  <div class="section-card">
    <div class="section-header">
      <h2 class="section-title">
        <LucideCalendar class="w-5 h-5 mr-2" />
        Today's Tasks
      </h2>
      <Badge v-if="tasks.length">{{ tasks.length }}</Badge>
    </div>

    <div v-if="loading" class="section-loading">
      <Skeleton v-for="i in 3" :key="i" class="h-12 mb-2" />
    </div>

    <div v-else-if="tasks.length === 0" class="section-empty">
      <p>No tasks due today. Enjoy your day!</p>
    </div>

    <div v-else class="task-list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
      >
        <Checkbox @change="toggleTask(task)" />
        <div class="task-content">
          <span class="task-title">{{ task.title }}</span>
          <span
            class="task-project"
            :style="{ color: task.projects?.color }"
          >
            {{ task.projects?.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 3. src/components/dashboard/OverdueTasks.vue

Similar structure to TodaysTasks but filtering for `due_date < today AND done = false`.

### 4. src/components/dashboard/RecentProjects.vue

```vue
<script setup lang="ts">
import type { Project } from '~/types'

interface Props {
  projects: Project[]
  loading: boolean
}

const props = defineProps<Props>()

const recentProjects = computed(() =>
  props.projects.slice(0, 4)
)
</script>

<template>
  <div class="section-card">
    <div class="section-header">
      <h2 class="section-title">
        <LucideFolder class="w-5 h-5 mr-2" />
        Recent Projects
      </h2>
      <NuxtLink to="/projects" class="btn btn-ghost btn-sm">
        View All
      </NuxtLink>
    </div>

    <div v-if="loading" class="project-grid">
      <Skeleton v-for="i in 4" :key="i" class="h-24" />
    </div>

    <div v-else-if="projects.length === 0" class="section-empty">
      <p>No projects yet.</p>
      <NuxtLink to="/projects" class="btn btn-primary btn-sm mt-4">
        Create Project
      </NuxtLink>
    </div>

    <div v-else class="project-grid">
      <NuxtLink
        v-for="project in recentProjects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        class="project-card"
      >
        <div
          class="project-color"
          :style="{ backgroundColor: project.color }"
        />
        <div class="project-info">
          <h3 class="project-name">{{ project.name }}</h3>
          <p class="project-description">
            {{ project.description || 'No description' }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 639px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

## Acceptance Criteria

- [ ] Matches prototype exactly
- [ ] Welcome message shows user name
- [ ] Today's tasks section working
- [ ] Overdue tasks section working
- [ ] Recent projects grid working
- [ ] Empty states handled
- [ ] Loading states shown
- [ ] Responsive layout
- [ ] TypeScript passes
