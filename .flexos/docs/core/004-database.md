---
type: core
subtype: database
title: TaskFlow Database
description: Data philosophy, entity overview, and access patterns
sequence: 4
status: active
---

# TaskFlow Database

## Data Philosophy

TaskFlow's data model is intentionally simple. We optimize for:

1. **Read performance** - Most operations are reads (viewing tasks, projects)
2. **Simple relationships** - No complex joins, prefer denormalization
3. **Offline-first** - Structure data for easy client-side caching
4. **Security by default** - Row-level security on everything

---

## Database Provider

**Supabase** (PostgreSQL + Auth + Realtime)

### Why Supabase?

| Requirement | Supabase Solution |
|-------------|-------------------|
| Authentication | Supabase Auth with multiple providers |
| Database | PostgreSQL with full SQL support |
| Realtime | Built-in Realtime subscriptions |
| Row-level security | Native PostgreSQL RLS |
| File storage | Supabase Storage (for avatars) |
| Edge functions | Supabase Edge Functions |

### Alternatives Considered

| Alternative | Why Not |
|-------------|---------|
| Firebase | NoSQL limitations, vendor lock-in |
| PlanetScale | No built-in auth/realtime |
| Neon | Less mature ecosystem |
| Self-hosted PostgreSQL | Operational overhead |

---

## Core Entities

### Users (profiles)

Extended user data beyond Supabase Auth.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key, matches auth.users.id |
| email | text | User's email address |
| name | text | Display name |
| avatar_url | text | URL to avatar image (nullable) |
| onboarding_completed | boolean | Has completed onboarding? |
| created_at | timestamptz | Account creation time |
| updated_at | timestamptz | Last profile update |

**Indexes:** `id` (primary), `email` (unique)

**RLS Policies:**
- Users can read their own profile
- Users can update their own profile
- Users can read profiles of team members

### Projects

Top-level organizational unit.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| owner_id | uuid | References profiles.id |
| name | text | Project name (1-100 chars) |
| description | text | Project description (nullable) |
| color | text | Hex color code |
| icon | text | Icon identifier |
| archived_at | timestamptz | When archived (nullable) |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |

**Indexes:** `id` (primary), `owner_id`, `archived_at`

**RLS Policies:**
- Users can read projects they're members of
- Users can create projects (becomes owner)
- Only owner can update project
- Only owner can delete project

### Tasks

The atomic unit of work.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| project_id | uuid | References projects.id |
| created_by | uuid | References profiles.id |
| assigned_to | uuid | References profiles.id (nullable) |
| title | text | Task title (1-200 chars) |
| description | text | Task description (nullable) |
| done | boolean | Is task complete? |
| done_at | timestamptz | When completed (nullable) |
| due_date | date | Due date (nullable) |
| priority | text | high, medium, low, or null |
| position | integer | Order within project |
| tags | text[] | Array of tag strings |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |

**Indexes:** `id` (primary), `project_id`, `assigned_to`, `due_date`, `done`

**RLS Policies:**
- Users can read tasks in projects they're members of
- Users can create tasks in projects they're members of
- Users can update tasks in projects they're members of
- Users can delete tasks in projects they're members of

### Team Members

Project membership and roles.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| project_id | uuid | References projects.id |
| user_id | uuid | References profiles.id |
| role | text | 'owner' or 'member' |
| joined_at | timestamptz | When joined |

**Indexes:** `id` (primary), `project_id`, `user_id`, unique(`project_id`, `user_id`)

**RLS Policies:**
- Users can read members of projects they're in
- Only owner can add/remove members
- Members can remove themselves

### Invitations

Pending team invitations.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| project_id | uuid | References projects.id |
| email | text | Invited email address |
| role | text | Role to assign on accept |
| invited_by | uuid | References profiles.id |
| status | text | pending, accepted, revoked, expired |
| token | text | Unique invitation token |
| created_at | timestamptz | When sent |
| expires_at | timestamptz | Expiration (7 days from creation) |

**Indexes:** `id` (primary), `token` (unique), `project_id`, `email`

**RLS Policies:**
- Project owners can create invitations
- Project owners can read/revoke invitations
- Anyone can accept by token (auth required)

### Notifications

User notifications.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles.id |
| type | text | Notification type (enum) |
| title | text | Notification title |
| body | text | Notification body (nullable) |
| data | jsonb | Type-specific payload |
| read_at | timestamptz | When read (nullable) |
| created_at | timestamptz | When created |

**Indexes:** `id` (primary), `user_id`, `read_at`, `created_at`

**Notification Types:**
- `task_due` - Task due tomorrow
- `task_overdue` - Task past due date
- `task_assigned` - Assigned to a task
- `task_completed` - Task was completed
- `member_joined` - New team member
- `member_left` - Team member left
- `weekly_digest` - Weekly summary

**RLS Policies:**
- Users can read their own notifications
- Users can mark their own as read
- System can create notifications for any user

---

## Entity Relationships

```
profiles (1) ──┬── (N) projects        [as owner]
               ├── (N) team_members    [as user]
               ├── (N) tasks           [as creator/assignee]
               ├── (N) invitations     [as inviter]
               └── (N) notifications   [as recipient]

projects (1) ──┬── (N) tasks
               ├── (N) team_members
               └── (N) invitations

tasks (1) ──── (1) projects            [belongs to]
```

---

## Access Patterns

### High-Frequency Reads

| Pattern | Query | Indexes Used |
|---------|-------|--------------|
| Dashboard: Today's tasks | `tasks where due_date = today and done = false` | `due_date`, `done` |
| Dashboard: Recent projects | `projects where member order by updated_at limit 5` | `team_members.user_id` |
| Project: Task list | `tasks where project_id = ? order by position` | `project_id` |
| Notifications | `notifications where user_id = ? order by created_at desc` | `user_id`, `created_at` |

### Write Patterns

| Pattern | Tables Affected | Notes |
|---------|-----------------|-------|
| Create task | tasks | Auto-set position to max + 1 |
| Complete task | tasks | Set done = true, done_at = now |
| Reorder tasks | tasks (batch) | Update position for affected tasks |
| Create project | projects, team_members | Insert owner as team member |
| Accept invite | invitations, team_members | Update status, create member |

---

## Computed Fields

Fields we compute rather than store:

| Field | Computation | Where |
|-------|-------------|-------|
| `project.task_count` | `count(tasks where project_id)` | Query time or view |
| `project.completed_count` | `count(tasks where done = true)` | Query time or view |
| `user.unread_count` | `count(notifications where read_at is null)` | Query time |

---

## Data Validation

### Application-Level

| Entity | Field | Validation |
|--------|-------|------------|
| profiles | name | 1-100 chars, required |
| profiles | email | Valid email format |
| projects | name | 1-100 chars, required |
| projects | color | Valid hex color (#000000) |
| tasks | title | 1-200 chars, required |
| tasks | priority | Enum: high, medium, low, null |
| tasks | tags | Max 5 items, each 1-30 chars |

### Database-Level

- Foreign key constraints on all references
- Check constraints on enums
- Unique constraints on email, invitation token
- Not null constraints on required fields

---

## Migrations Strategy

1. **Forward-only** - No down migrations in production
2. **Backward-compatible** - New columns nullable or with defaults
3. **Blue-green safe** - Old and new code can run simultaneously
4. **Tested locally** - All migrations tested before deployment

### Migration Naming

```
YYYYMMDDHHMMSS_description.sql

Examples:
20250114100000_create_profiles_table.sql
20250114100100_create_projects_table.sql
20250114100200_add_projects_icon_column.sql
```

---

## Backup & Recovery

### Supabase Provides

- Daily automated backups (retained 7 days)
- Point-in-time recovery (Pro plan)
- Logical backups on demand

### Our Additions

- Weekly logical backup to S3
- Restore runbook documented
- Recovery tested quarterly

---

## Security Model

### Row-Level Security (RLS)

All tables have RLS enabled. No public access.

### Principle of Least Privilege

- Users only access data they're members of
- Service role used only for admin operations
- Anon role has zero permissions

### Sensitive Data

| Data | Protection |
|------|------------|
| Passwords | Handled by Supabase Auth (bcrypt) |
| Tokens | Random, unique, time-limited |
| Email | Not exposed in public queries |
| PII | Minimal collection |

---

*This document is the source of truth for data modeling decisions. For the detailed schema with all fields and constraints, see the database spec.*
