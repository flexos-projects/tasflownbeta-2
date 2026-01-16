# Supabase Build Documentation

Quick reference for Supabase patterns used in TaskFlow builds.

---

## Installation

```bash
# Nuxt module handles client setup
pnpm add @nuxtjs/supabase
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],

  supabase: {
    redirect: false // We handle auth manually
  },

  runtimeConfig: {
    supabaseServiceKey: '', // Server-only
    public: {
      supabaseUrl: '',
      supabaseAnonKey: ''
    }
  }
})
```

---

## Client Usage

### Get Client

```typescript
// Auto-imported by @nuxtjs/supabase
const supabase = useSupabaseClient()
const user = useSupabaseUser()
```

---

## Authentication

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      name: 'John Doe'
    }
  }
})
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut()
```

### Get Current User

```typescript
// Reactive user state (auto-updated)
const user = useSupabaseUser()

// Or direct call
const { data: { user } } = await supabase.auth.getUser()
```

---

## Database Operations

### Select

```typescript
// Get all
const { data, error } = await supabase
  .from('projects')
  .select('*')

// Get with filter
const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('owner_id', userId)
  .is('archived_at', null)
  .order('updated_at', { ascending: false })

// Get single
const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('id', projectId)
  .single()

// Select with relations
const { data } = await supabase
  .from('projects')
  .select(`
    *,
    tasks (
      id,
      title,
      done
    )
  `)
```

### Insert

```typescript
// Insert one
const { data, error } = await supabase
  .from('projects')
  .insert({
    name: 'New Project',
    owner_id: userId,
    color: '#3b82f6'
  })
  .select()
  .single()
```

### Update

```typescript
const { data, error } = await supabase
  .from('tasks')
  .update({ done: true })
  .eq('id', taskId)
  .select()
  .single()
```

### Delete

```typescript
const { error } = await supabase
  .from('tasks')
  .delete()
  .eq('id', taskId)
```

---

## Real-Time Subscriptions

```typescript
const channel = supabase
  .channel('tasks-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'tasks',
      filter: `project_id=eq.${projectId}`
    },
    (payload) => {
      if (payload.eventType === 'INSERT') {
        tasks.value.push(payload.new)
      }
      if (payload.eventType === 'UPDATE') {
        const idx = tasks.value.findIndex(t => t.id === payload.new.id)
        if (idx !== -1) tasks.value[idx] = payload.new
      }
      if (payload.eventType === 'DELETE') {
        tasks.value = tasks.value.filter(t => t.id !== payload.old.id)
      }
    }
  )
  .subscribe()

// Cleanup
onUnmounted(() => {
  supabase.removeChannel(channel)
})
```

---

## Row Level Security (RLS)

### Enable RLS

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

### Common Policies

```sql
-- Users can only see their own projects
CREATE POLICY "Users can view own projects"
ON projects FOR SELECT
USING (auth.uid() = owner_id);

-- Users can create projects
CREATE POLICY "Users can create projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = owner_id);
```

---

## Database Schema (TaskFlow)

### profiles

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### projects

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### tasks

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  due_date DATE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## References

- [Supabase Documentation](https://supabase.com/docs)
- [@nuxtjs/supabase](https://supabase.nuxtjs.org/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
