---
type: features
title: Core MVP Features
description: Projects, Tasks, Dashboard, and Search - the essential features
status: approved
priority: high
sequence: 3
relatesTo:
  - 004-features_auth
  - 012-database_schema
tags:
  - mvp
  - core
generatedBy: ai
---

# Core MVP Features Spec

## Overview

This spec defines the four core features that make up TaskFlow's MVP:

1. **Projects** - Organizational containers for tasks
2. **Tasks** - The atomic unit of work
3. **Dashboard** - Home screen showing what needs attention
4. **Search** - Find anything quickly

These features must work flawlessly before we add anything else.

---

## Feature 1: Projects

### User Story

As a user, I want to organize my work into projects so that I can focus on one context at a time.

### Data Model

```typescript
interface Project {
  id: string           // UUID
  owner_id: string     // References user
  name: string         // 1-100 characters
  description: string | null  // Optional, markdown
  color: string        // Hex color from preset list
  icon: string         // Icon name from preset list
  archived_at: string | null  // When archived
  created_at: string   // ISO timestamp
  updated_at: string   // ISO timestamp
}
```

### Project Colors (Presets)

| Name | Hex | Preview |
|------|-----|---------|
| Blue | #3b82f6 | Primary, default |
| Green | #22c55e | Success-like |
| Amber | #f59e0b | Warning-like |
| Red | #ef4444 | Urgent |
| Purple | #8b5cf6 | Creative |
| Pink | #ec4899 | Fun |
| Cyan | #06b6d4 | Fresh |
| Indigo | #6366f1 | Professional |
| Teal | #14b8a6 | Calm |
| Orange | #f97316 | Energy |

### Project Icons (Presets)

`folder`, `briefcase`, `globe`, `heart`, `star`, `zap`, `coffee`, `book`, `camera`, `music`, `code`, `home`

### Actions

| Action | Trigger | Behavior |
|--------|---------|----------|
| Create | Click "New Project" | Modal with name, color, icon picker |
| Edit | Click project settings | Edit name, description, color, icon |
| Archive | Click "Archive" in settings | Soft delete, hide from active list |
| Restore | Click "Restore" in archived | Unarchive, show in active list |
| Delete | Click "Delete" in settings | Hard delete with confirmation |

### Screens

1. **Projects List** (`/projects`)
   - Header: Title + "New Project" button
   - Filter: Active / Archived toggle
   - Grid: Project cards (2 cols mobile, 3 cols desktop)

2. **Project Card**
   - Color accent bar (left border)
   - Icon + Name
   - Task count (X tasks, Y done)
   - Last updated timestamp

3. **New Project Modal**
   - Name input (required)
   - Color picker (grid of 10 colors)
   - Icon picker (grid of 12 icons)
   - Description textarea (optional)
   - Create button

### Acceptance Criteria

- [ ] User can create a project with name, color, and icon
- [ ] User can edit project name, description, color, icon
- [ ] User can archive a project
- [ ] User can restore an archived project
- [ ] User can permanently delete a project (with confirmation)
- [ ] Archived projects are hidden from the active list
- [ ] Project list shows task count for each project
- [ ] Project colors display correctly throughout the app

---

## Feature 2: Tasks

### User Story

As a user, I want to create and manage tasks within a project so that I can track my work.

### Data Model

```typescript
interface Task {
  id: string                  // UUID
  project_id: string          // References project
  created_by: string          // References user
  assigned_to: string | null  // References user (optional)
  title: string               // 1-200 characters
  description: string | null  // Optional, markdown
  done: boolean               // Completion status
  done_at: string | null      // When completed
  due_date: string | null     // Date only (YYYY-MM-DD)
  priority: 'high' | 'medium' | 'low' | null
  position: number            // Sort order within project
  tags: string[]              // Array of tag strings (max 5)
  created_at: string          // ISO timestamp
  updated_at: string          // ISO timestamp
}
```

### Priority Levels

| Priority | Color | Usage |
|----------|-------|-------|
| High | Red (#ef4444) | Urgent, do first |
| Medium | Amber (#f59e0b) | Important, do soon |
| Low | Green (#22c55e) | Can wait |
| None | Gray (#737373) | No priority set |

### Actions

| Action | Trigger | Behavior |
|--------|---------|----------|
| Create | Enter in input field | Add task at bottom of list |
| Edit | Click task | Open task detail modal |
| Complete | Click checkbox | Toggle done, animate strikethrough |
| Uncomplete | Click checked checkbox | Toggle done back |
| Delete | Swipe left or menu | Remove with undo toast |
| Reorder | Drag handle | Update position |
| Assign | Click assignee | Open team member picker |
| Set Due | Click due date | Open date picker |
| Set Priority | Click priority | Open priority picker |

### Screens

1. **Task List** (within Project Detail)
   - Inline add input at bottom
   - Task items in position order
   - Done tasks at bottom (collapsible)

2. **Task Item**
   - Checkbox (left)
   - Title (center, truncate if long)
   - Priority indicator (colored dot)
   - Due date (if set)
   - Assignee avatar (if assigned)
   - Drag handle (right, desktop only)

3. **Task Detail Modal**
   - Title input (editable)
   - Description textarea (markdown)
   - Status: Todo / Done toggle
   - Due date picker
   - Priority picker
   - Assignee picker (if team project)
   - Tags input
   - Delete button (with confirmation)
   - Created/Updated timestamps

4. **Inline Add Task**
   - Text input with placeholder "Add a task..."
   - Enter to add, Escape to cancel
   - After add, focus remains for rapid entry

### Task Behaviors

**Completion Animation:**
1. Checkbox fills with checkmark
2. Title gets strikethrough
3. Task fades slightly
4. Task moves to "Done" section after 1s

**Due Date Display:**
- Future: Show date (Jan 15)
- Today: Show "Today" in primary color
- Tomorrow: Show "Tomorrow"
- Past due: Show date in red with warning icon

**Reordering:**
- Desktop: Drag handle visible on hover
- Mobile: Long press to enter reorder mode
- Optimistic update, sync on drop

### Acceptance Criteria

- [ ] User can create a task with just a title
- [ ] User can edit task title, description, due date, priority
- [ ] User can mark task as done/undone
- [ ] User can delete a task with undo option
- [ ] User can reorder tasks within a project
- [ ] Completed tasks move to a separate section
- [ ] Due dates display relative to today
- [ ] Overdue tasks are visually indicated
- [ ] Tags can be added and removed

---

## Feature 3: Dashboard

### User Story

As a user, I want to see what needs my attention today so that I can start working immediately.

### Layout

**Desktop:**
```
┌─────────────────────────────────────────────────┐
│ Good morning, Alice                             │
├─────────────────────────┬───────────────────────┤
│ Today (3)               │ Recent Projects       │
│ ┌─────────────────────┐ │ ┌───────────────────┐ │
│ │ Task 1              │ │ │ Website Redesign  │ │
│ │ Task 2              │ │ │ Mobile App        │ │
│ │ Task 3              │ │ │ Q1 Planning       │ │
│ └─────────────────────┘ │ └───────────────────┘ │
│                         │                       │
│ Overdue (1)             │                       │
│ ┌─────────────────────┐ │                       │
│ │ Task 4 (3 days ago) │ │                       │
│ └─────────────────────┘ │                       │
└─────────────────────────┴───────────────────────┘
```

**Mobile:**
```
┌─────────────────────────┐
│ Good morning, Alice     │
├─────────────────────────┤
│ Today (3)               │
│ ┌─────────────────────┐ │
│ │ Task 1              │ │
│ │ Task 2              │ │
│ │ Task 3              │ │
│ └─────────────────────┘ │
│                         │
│ Overdue (1)             │
│ ┌─────────────────────┐ │
│ │ Task 4 (3 days ago) │ │
│ └─────────────────────┘ │
│                         │
│ Recent Projects         │
│ ┌─────────────────────┐ │
│ │ Website Redesign    │ │
│ │ Mobile App          │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Sections

1. **Welcome Header**
   - Greeting based on time of day
   - User's first name
   - Today's date

2. **Today's Tasks**
   - Tasks due today across all projects
   - Show project color indicator
   - Max 5 items, then "See all X tasks"
   - Empty state: "Nothing due today 🎉"

3. **Overdue Tasks**
   - Tasks past due date, not done
   - Show days overdue
   - Red warning styling
   - Only show if there are overdue tasks

4. **Recent Projects**
   - Last 5 projects accessed (by updated_at)
   - Compact card format
   - Quick access to project detail

### Data Requirements

```typescript
interface DashboardData {
  user: {
    name: string
  }
  todayTasks: Task[]  // due_date = today, done = false
  overdueTasks: Task[] // due_date < today, done = false
  recentProjects: Project[] // order by updated_at, limit 5
}
```

### Acceptance Criteria

- [ ] Dashboard shows greeting with user's name
- [ ] Today's tasks section shows tasks due today
- [ ] Overdue section shows past-due tasks (if any)
- [ ] Recent projects shows last 5 accessed
- [ ] Clicking a task opens task detail
- [ ] Clicking a project navigates to project
- [ ] Empty states are friendly and actionable
- [ ] Dashboard loads in under 500ms

---

## Feature 4: Search

### User Story

As a user, I want to search across all my projects and tasks so that I can find anything quickly.

### Search Behavior

1. **Trigger**: Click search icon in header, or press `/`
2. **UI**: Overlay with search input and results
3. **Scope**: Projects and tasks across all projects
4. **Matching**: Title contains query (case-insensitive)

### Search Interface

```
┌─────────────────────────────────────────────────┐
│ 🔍 Search...                               [×]  │
├─────────────────────────────────────────────────┤
│                                                 │
│ Projects (2)                                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🔵 Website Redesign                         │ │
│ │ 🟢 Mobile App                               │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Tasks (5)                                       │
│ ┌─────────────────────────────────────────────┐ │
│ │ ☐ Design homepage mockup (Website Redesign)│ │
│ │ ☐ Review mockup (Website Redesign)          │ │
│ │ ☑ Setup project (Mobile App)                │ │
│ │ ☐ Design app icon (Mobile App)              │ │
│ │ ☐ Write homepage copy (Website Redesign)    │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Search Features

| Feature | Behavior |
|---------|----------|
| Debounce | Wait 300ms after typing to search |
| Highlight | Bold matching text in results |
| Keyboard nav | Arrow keys to navigate, Enter to select |
| Recent | Show last 5 searches when empty |
| No results | "No results for 'query'" with suggestions |

### Filters (Optional Enhancement)

| Filter | Behavior |
|--------|----------|
| `in:project-name` | Limit to specific project |
| `is:done` | Only completed tasks |
| `is:overdue` | Only overdue tasks |
| `due:today` | Only due today |

### Implementation Notes

- For <1000 items: Client-side filtering
- For >1000 items: Server-side with pagination
- Index: task.title, project.name

### Acceptance Criteria

- [ ] Search opens with `/` keyboard shortcut
- [ ] Search overlay covers page content
- [ ] Results update as user types (debounced)
- [ ] Projects and tasks are grouped in results
- [ ] Matching text is highlighted
- [ ] Clicking result navigates to item
- [ ] Recent searches shown when input is empty
- [ ] "No results" state is helpful
- [ ] Escape closes search

---

## Cross-Feature Requirements

### Performance

| Metric | Target |
|--------|--------|
| Dashboard load | <500ms |
| Task create | <100ms perceived |
| Task complete | <50ms perceived |
| Search results | <300ms after typing stops |
| Project list | <500ms |

### Offline Support

| Action | Offline Behavior |
|--------|------------------|
| View dashboard | Works (cached data) |
| View project | Works (cached data) |
| Create task | Queued, sync when online |
| Complete task | Optimistic, sync when online |
| Search | Works on cached data |

### Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| Network error | "Couldn't save. Will retry." | Auto-retry |
| Server error | "Something went wrong." | Retry button |
| Conflict | "Task was updated elsewhere." | Refresh |

---

*These features form the core of TaskFlow. They must be rock-solid before we add anything else.*
