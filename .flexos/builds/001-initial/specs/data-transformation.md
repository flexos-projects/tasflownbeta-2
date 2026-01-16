---
type: analysis
title: Data Transformation
status: complete
---

# Data Transformation: MockDB → Supabase

How prototype mock data maps to production Supabase schema.

## MockDB Structure

From `prototype/shared/mockdb-data.json`:

```json
{
  "users": [...],
  "projects": [...],
  "tasks": [...],
  "notifications": [...]
}
```

## Transformation Rules

### Users → profiles

**MockDB:**
```json
{
  "id": "user-1",
  "email": "john@example.com",
  "name": "John Doe",
  "avatar": "/avatars/john.jpg"
}
```

**Supabase:**
```sql
-- auth.users (managed by Supabase Auth)
-- profiles (our table)
{
  "id": "uuid",           -- References auth.users.id
  "name": "John Doe",
  "avatar_url": "https://...",
  "onboarding_completed": true,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Transformation:**
- `id` → UUID from Supabase Auth
- `email` → Stored in auth.users (not duplicated)
- `name` → `name` in profiles
- `avatar` → `avatar_url` (full URL, not path)

### Projects

**MockDB:**
```json
{
  "id": "proj-1",
  "name": "Website Redesign",
  "color": "#3b82f6",
  "owner": "user-1",
  "taskCount": 12,
  "completedCount": 8
}
```

**Supabase:**
```sql
{
  "id": "uuid",
  "owner_id": "uuid",     -- References auth.users.id
  "name": "Website Redesign",
  "description": null,
  "color": "#3b82f6",
  "archived_at": null,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Transformation:**
- `id` → Auto-generated UUID
- `owner` → `owner_id` (UUID reference)
- `taskCount`, `completedCount` → Computed via query (not stored)
- Added: `description`, `archived_at` for soft delete

### Tasks

**MockDB:**
```json
{
  "id": "task-1",
  "project": "proj-1",
  "title": "Design homepage",
  "done": false,
  "dueDate": "2025-01-20"
}
```

**Supabase:**
```sql
{
  "id": "uuid",
  "project_id": "uuid",
  "title": "Design homepage",
  "done": false,
  "due_date": "2025-01-20",
  "position": 0,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Transformation:**
- `project` → `project_id` (UUID reference)
- `dueDate` → `due_date` (snake_case)
- Added: `position` for ordering

### Notifications

**MockDB:**
```json
{
  "id": "notif-1",
  "user": "user-1",
  "type": "task_due",
  "title": "Task due tomorrow",
  "body": "Design homepage is due tomorrow",
  "read": false,
  "createdAt": "2025-01-14T10:00:00Z"
}
```

**Supabase:**
```sql
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "task_due",
  "title": "Task due tomorrow",
  "body": "Design homepage is due tomorrow",
  "data": {},             -- JSON for extra context
  "read_at": null,        -- null = unread, timestamp = read
  "created_at": "timestamp"
}
```

**Transformation:**
- `user` → `user_id` (UUID reference)
- `read` (boolean) → `read_at` (timestamp or null)
- `createdAt` → `created_at` (snake_case)
- Added: `data` JSONB for flexible metadata

## Query Patterns

### Dashboard: Today's Tasks

**MockDB (client-side filter):**
```javascript
tasks.filter(t => t.dueDate === today && !t.done)
```

**Supabase:**
```typescript
const { data } = await supabase
  .from('tasks')
  .select('*, projects(name, color)')
  .eq('due_date', today)
  .eq('done', false)
  .order('position')
```

### Dashboard: Overdue Tasks

```typescript
const { data } = await supabase
  .from('tasks')
  .select('*, projects(name, color)')
  .lt('due_date', today)
  .eq('done', false)
  .order('due_date')
```

### Project with Task Counts

**MockDB:** Stored on project object

**Supabase:** Computed via query
```typescript
const { data } = await supabase
  .from('projects')
  .select(`
    *,
    tasks(count),
    tasks!inner(count).filter(done.eq.true)
  `)
```

Or use a database view/function for efficiency.

## Seed Data Generation

For development/testing, transform mockdb-data.json to Supabase seed:

```sql
-- seed.sql
INSERT INTO profiles (id, name, avatar_url, onboarding_completed)
VALUES
  ('uuid-1', 'John Doe', 'https://...', true);

INSERT INTO projects (id, owner_id, name, color)
VALUES
  ('uuid-2', 'uuid-1', 'Website Redesign', '#3b82f6');

INSERT INTO tasks (id, project_id, title, done, due_date, position)
VALUES
  ('uuid-3', 'uuid-2', 'Design homepage', false, '2025-01-20', 0);
```

## Real-Time Considerations

| Entity | Real-Time Needed | Reason |
|--------|------------------|--------|
| Tasks | Yes | Collaborative editing |
| Projects | Yes | Name/color changes |
| Notifications | Yes | Instant delivery |
| Profiles | No | Rarely changes |

Configure Supabase Realtime for tasks, projects, notifications tables.
