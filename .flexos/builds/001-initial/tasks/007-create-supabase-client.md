---
id: 007-create-supabase-client
sequence: 7
status: pending
dependsOn: ["002"]

inputs:
  docs:
    - ../docs/002-supabase.md
  spec: ../../specs/012-database_schema.md

expectedOutput:
  - src/plugins/supabase.client.ts
  - src/composables/useProjects.ts
  - src/composables/useTasks.ts

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Create Supabase Client & Composables

## Objective

Set up Supabase client plugin and data composables.

## Files to Create

### 1. src/plugins/supabase.client.ts

```typescript
export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()

  // Listen to auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      authStore.fetchProfile()
    }

    if (event === 'SIGNED_OUT') {
      // Clear any cached data
    }
  })
})
```

### 2. src/composables/useProjects.ts

```typescript
import type { Project } from '~/types'

export function useProjects() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchProjects() {
    if (!user.value) return

    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.value.id)
      .is('archived_at', null)
      .order('updated_at', { ascending: false })

    if (fetchError) {
      error.value = fetchError
    } else {
      projects.value = data || []
    }

    loading.value = false
  }

  async function createProject(name: string, color: string = '#3b82f6') {
    if (!user.value) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        color,
        owner_id: user.value.id
      })
      .select()
      .single()

    if (error) throw error

    projects.value.unshift(data)
    return data
  }

  async function updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value[idx] = data

    return data
  }

  async function archiveProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    projects.value = projects.value.filter(p => p.id !== id)
  }

  async function getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Project
  }

  return {
    projects: readonly(projects),
    loading: readonly(loading),
    error: readonly(error),
    fetchProjects,
    createProject,
    updateProject,
    archiveProject,
    getProject
  }
}
```

### 3. src/composables/useTasks.ts

```typescript
import type { Task } from '~/types'

export function useTasks(projectId: Ref<string | null>) {
  const supabase = useSupabaseClient()

  const tasks = ref<Task[]>([])
  const loading = ref(false)

  async function fetchTasks() {
    if (!projectId.value) return

    loading.value = true

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId.value)
      .order('position', { ascending: true })

    if (!error) {
      tasks.value = data || []
    }

    loading.value = false
  }

  async function addTask(title: string) {
    if (!projectId.value) throw new Error('No project selected')

    const position = tasks.value.length

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title,
        project_id: projectId.value,
        position,
        done: false
      })
      .select()
      .single()

    if (error) throw error
    tasks.value.push(data)
    return data
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) tasks.value[idx] = data

    return data
  }

  async function toggleTask(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return

    await updateTask(id, { done: !task.done })
  }

  async function deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error

    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  // Watch project changes
  watch(projectId, () => {
    if (projectId.value) {
      fetchTasks()
    } else {
      tasks.value = []
    }
  }, { immediate: true })

  // Computed
  const completedCount = computed(() =>
    tasks.value.filter(t => t.done).length
  )

  const progress = computed(() =>
    tasks.value.length > 0
      ? Math.round((completedCount.value / tasks.value.length) * 100)
      : 0
  )

  return {
    tasks: readonly(tasks),
    loading: readonly(loading),
    completedCount,
    progress,
    fetchTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask
  }
}
```

## Acceptance Criteria

- [ ] Plugin initializes auth listener
- [ ] useProjects composable working
- [ ] useTasks composable working
- [ ] CRUD operations functional
- [ ] TypeScript passes
- [ ] Reactive state updates
