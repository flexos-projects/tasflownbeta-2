---
id: 013-create-projects-page
sequence: 13
status: pending
dependsOn: ["005", "006", "007"]

inputs:
  prototype: ../../prototype/003-projects.html
  spec: ../../specs/008-pages_projects.md

expectedOutput:
  - src/pages/projects/index.vue
  - src/pages/projects/[id]/index.vue
  - src/components/project/ProjectCard.vue
  - src/components/project/ProjectForm.vue
  - src/components/task/TaskList.vue
  - src/components/task/TaskItem.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
  - responsive: [375, 768, 1024]
---

# Task: Create Projects Page

## Objective

Create the projects pages and components matching `prototype/003-projects.html`.

## Files to Create

### 1. src/pages/projects/index.vue

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'Projects - TaskFlow'
})

const { projects, fetchProjects, createProject, loading } = useProjects()
const showCreateModal = ref(false)
const filter = ref<'active' | 'archived'>('active')

const filteredProjects = computed(() => {
  if (filter.value === 'active') {
    return projects.value.filter(p => !p.archived_at)
  }
  return projects.value.filter(p => p.archived_at)
})

onMounted(() => {
  fetchProjects()
})

const handleCreate = async (data: { name: string; description?: string; color: string }) => {
  const project = await createProject(data.name, data.color, data.description)
  showCreateModal.value = false
  if (project) {
    await navigateTo(`/projects/${project.id}`)
  }
}
</script>

<template>
  <div class="projects-page">
    <!-- Page Header -->
    <header class="page-header">
      <div>
        <h1 class="page-title">Projects</h1>
      </div>
      <div class="page-header-actions">
        <Button variant="primary" @click="showCreateModal = true">
          <LucidePlus class="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
    </header>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button
        :class="['filter-tab', { active: filter === 'active' }]"
        @click="filter = 'active'"
      >
        Active
      </button>
      <button
        :class="['filter-tab', { active: filter === 'archived' }]"
        @click="filter = 'archived'"
      >
        Archived
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="projects-grid">
      <Skeleton v-for="i in 6" :key="i" class="h-32" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProjects.length === 0" class="empty-state">
      <LucideFolder class="empty-icon" />
      <h3 class="empty-title">
        {{ filter === 'active' ? 'No projects yet' : 'No archived projects' }}
      </h3>
      <p class="empty-description">
        {{ filter === 'active'
          ? 'Create your first project to start organizing your tasks.'
          : 'When you archive a project, it will appear here.'
        }}
      </p>
      <Button
        v-if="filter === 'active'"
        variant="primary"
        @click="showCreateModal = true"
      >
        Create Project
      </Button>
    </div>

    <!-- Projects Grid -->
    <div v-else class="projects-grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </div>

    <!-- Create Modal -->
    <Modal v-model="showCreateModal" title="New Project">
      <ProjectForm @submit="handleCreate" @cancel="showCreateModal = false" />
    </Modal>
  </div>
</template>

<style scoped>
.filter-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.filter-tab {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: var(--transition-base);
}

.filter-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.projects-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.empty-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-2);
}

.empty-description {
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
  max-width: 300px;
}
</style>
```

### 2. src/pages/projects/[id]/index.vue

```vue
<script setup lang="ts">
const route = useRoute()
const projectId = route.params.id as string

definePageMeta({
  middleware: ['auth']
})

const { project, fetchProject, loading } = useProjects()
const { tasks, fetchTasks, createTask, toggleTask, loading: tasksLoading } = useTasks(projectId)

const showTaskForm = ref(false)
const newTaskTitle = ref('')

onMounted(async () => {
  await Promise.all([
    fetchProject(projectId),
    fetchTasks()
  ])
})

useHead({
  title: computed(() => project.value?.name ? `${project.value.name} - TaskFlow` : 'Project - TaskFlow')
})

const handleCreateTask = async () => {
  if (!newTaskTitle.value.trim()) return

  await createTask({
    title: newTaskTitle.value,
    project_id: projectId
  })

  newTaskTitle.value = ''
  showTaskForm.value = false
}
</script>

<template>
  <div class="project-page">
    <!-- Loading -->
    <div v-if="loading" class="project-loading">
      <Skeleton class="h-8 w-48 mb-4" />
      <Skeleton class="h-4 w-32 mb-8" />
      <Skeleton v-for="i in 5" :key="i" class="h-12 mb-2" />
    </div>

    <template v-else-if="project">
      <!-- Project Header -->
      <header class="project-header">
        <div class="project-header-info">
          <div
            class="project-color"
            :style="{ backgroundColor: project.color }"
          />
          <div>
            <h1 class="project-title">{{ project.name }}</h1>
            <p v-if="project.description" class="project-description">
              {{ project.description }}
            </p>
          </div>
        </div>
        <div class="project-actions">
          <Button variant="primary" @click="showTaskForm = true">
            <LucidePlus class="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </header>

      <!-- Quick Add Task -->
      <div v-if="showTaskForm" class="quick-add-task">
        <Input
          v-model="newTaskTitle"
          placeholder="What needs to be done?"
          @keyup.enter="handleCreateTask"
          @keyup.escape="showTaskForm = false"
        />
        <div class="quick-add-actions">
          <Button size="sm" variant="ghost" @click="showTaskForm = false">
            Cancel
          </Button>
          <Button size="sm" variant="primary" @click="handleCreateTask">
            Add
          </Button>
        </div>
      </div>

      <!-- Task List -->
      <TaskList :tasks="tasks" :loading="tasksLoading" @toggle="toggleTask" />
    </template>

    <!-- Not Found -->
    <div v-else class="project-not-found">
      <h2>Project not found</h2>
      <NuxtLink to="/projects" class="btn btn-primary">
        Back to Projects
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
}

.project-header-info {
  display: flex;
  gap: var(--space-4);
}

.project-color {
  width: 4px;
  border-radius: 2px;
  flex-shrink: 0;
}

.project-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
}

.project-description {
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.quick-add-task {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
}

.quick-add-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
</style>
```

### 3. src/components/project/ProjectCard.vue

```vue
<script setup lang="ts">
import type { Project } from '~/types'

interface Props {
  project: Project
}

const props = defineProps<Props>()

const progress = computed(() => {
  const total = props.project.task_count || 0
  const completed = props.project.completed_count || 0
  return { total, completed }
})

const relativeTime = computed(() => {
  // Simple relative time formatting
  const date = new Date(props.project.updated_at)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `Updated ${days}d ago`
  if (hours > 0) return `Updated ${hours}h ago`
  return 'Updated just now'
})
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.id}`"
    class="project-card"
  >
    <div
      class="project-color-bar"
      :style="{ backgroundColor: project.color }"
    />
    <div class="project-content">
      <h3 class="project-name">{{ project.name }}</h3>
      <p v-if="project.description" class="project-description">
        {{ project.description }}
      </p>
      <div class="project-meta">
        <span class="project-progress">
          {{ progress.completed }}/{{ progress.total }} tasks
        </span>
        <span class="project-updated">
          {{ relativeTime }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.project-card {
  display: flex;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition-base);
  text-decoration: none;
  color: inherit;
}

.project-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.project-color-bar {
  width: 4px;
  flex-shrink: 0;
}

.project-content {
  padding: var(--space-4);
  flex: 1;
}

.project-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-1);
}

.project-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
</style>
```

### 4. src/components/project/ProjectForm.vue

```vue
<script setup lang="ts">
const emit = defineEmits<{
  submit: [data: { name: string; description?: string; color: string }]
  cancel: []
}>()

const name = ref('')
const description = ref('')
const color = ref('#3b82f6')

const colors = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
  '#84cc16'  // lime
]

const handleSubmit = () => {
  if (!name.value.trim()) return

  emit('submit', {
    name: name.value.trim(),
    description: description.value.trim() || undefined,
    color: color.value
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="project-form">
    <div class="form-group">
      <label class="form-label" for="project-name">Name *</label>
      <Input
        id="project-name"
        v-model="name"
        placeholder="My New Project"
        required
      />
    </div>

    <div class="form-group">
      <label class="form-label" for="project-description">Description (optional)</label>
      <Textarea
        id="project-description"
        v-model="description"
        placeholder="What is this project about?"
        rows="3"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Color</label>
      <div class="color-picker">
        <button
          v-for="c in colors"
          :key="c"
          type="button"
          class="color-option"
          :class="{ selected: c === color }"
          :style="{ backgroundColor: c }"
          @click="color = c"
        />
      </div>
    </div>

    <div class="form-actions">
      <Button type="button" variant="ghost" @click="emit('cancel')">
        Cancel
      </Button>
      <Button type="submit" variant="primary" :disabled="!name.trim()">
        Create Project
      </Button>
    </div>
  </form>
</template>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.color-picker {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-base);
}

.color-option.selected {
  border-color: var(--color-text);
}

.color-option:hover {
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}
</style>
```

### 5. src/components/task/TaskList.vue

```vue
<script setup lang="ts">
import type { Task } from '~/types'

interface Props {
  tasks: Task[]
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: [taskId: string]
}>()

const pendingTasks = computed(() =>
  props.tasks.filter(t => !t.done)
)

const completedTasks = computed(() =>
  props.tasks.filter(t => t.done)
)
</script>

<template>
  <div class="task-list">
    <!-- Loading -->
    <div v-if="loading" class="task-loading">
      <Skeleton v-for="i in 5" :key="i" class="h-12 mb-2" />
    </div>

    <template v-else>
      <!-- Pending Tasks -->
      <div v-if="pendingTasks.length" class="task-section">
        <TaskItem
          v-for="task in pendingTasks"
          :key="task.id"
          :task="task"
          @toggle="emit('toggle', task.id)"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="completedTasks.length === 0" class="task-empty">
        <LucideCheckCircle class="w-12 h-12 text-muted" />
        <p>No tasks yet. Add one above!</p>
      </div>

      <!-- Completed Tasks -->
      <div v-if="completedTasks.length" class="task-section completed-section">
        <button class="completed-toggle">
          <LucideChevronDown class="w-4 h-4" />
          Completed ({{ completedTasks.length }})
        </button>
        <div class="completed-tasks">
          <TaskItem
            v-for="task in completedTasks"
            :key="task.id"
            :task="task"
            @toggle="emit('toggle', task.id)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
}

.task-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.task-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8);
  color: var(--color-text-muted);
  text-align: center;
}

.completed-section {
  margin-top: var(--space-6);
}

.completed-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2) 0;
}

.completed-tasks {
  opacity: 0.6;
}
</style>
```

### 6. src/components/task/TaskItem.vue

```vue
<script setup lang="ts">
import type { Task } from '~/types'

interface Props {
  task: Task
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="task-item" :class="{ done: task.done }">
    <Checkbox :modelValue="task.done" @update:modelValue="emit('toggle')" />
    <div class="task-content">
      <span class="task-title">{{ task.title }}</span>
      <div v-if="task.due_date" class="task-due">
        <LucideCalendar class="w-3 h-3" />
        {{ task.due_date }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.task-item:hover {
  border-color: var(--color-primary);
}

.task-item.done .task-title {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.task-content {
  flex: 1;
}

.task-title {
  display: block;
}

.task-due {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}
</style>
```

## Acceptance Criteria

- [ ] Projects list page shows all user's projects
- [ ] Active/Archived filter works correctly
- [ ] Project cards show name, color, progress, last updated
- [ ] Clicking project navigates to project detail
- [ ] "New Project" opens create modal
- [ ] Create modal validates required fields
- [ ] New project is created and user is redirected
- [ ] Project detail page shows tasks
- [ ] Can add new tasks from project page
- [ ] Can toggle task completion
- [ ] Empty states are helpful
- [ ] Loading states show skeletons
- [ ] Page is responsive
- [ ] TypeScript passes
