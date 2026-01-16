---
type: pages
title: Dashboard Page
description: Home screen showing today's tasks, overdue items, and recent projects
status: approved
priority: high
sequence: 7
route: /dashboard
prototype: 002-dashboard.html
relatesTo:
  - 003-features_core
  - 008-pages_projects
tags:
  - app
  - authenticated
generatedBy: ai
---

# Dashboard Page Spec

## Overview

The dashboard is the first screen users see after logging in. It answers the question: "What should I focus on right now?"

**Design principle**: Show what's urgent, hide what's not. The dashboard should be scannable in 3 seconds.

---

## Page Layout

### Desktop (1024px+)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                                    │
├─────────┼───────────────────────────────────────────────────────────┤
│         │                                                           │
│ Nav     │  Good morning, Alice                  Tuesday, Jan 14     │
│ Items   │                                                           │
│         │  ┌────────────────────────────┐ ┌──────────────────────┐  │
│         │  │ Today (3)                  │ │ Recent Projects      │  │
│         │  │                            │ │                      │  │
│         │  │ ☐ Review mockup            │ │ 🔵 Website Redesign  │  │
│         │  │   Website Redesign         │ │    3 tasks left      │  │
│         │  │                            │ │                      │  │
│         │  │ ☐ Implement header         │ │ 🟢 Mobile App        │  │
│         │  │   Website Redesign         │ │    7 tasks left      │  │
│         │  │                            │ │                      │  │
│         │  │ ☐ Design app icon          │ │ 🟡 Q1 Planning       │  │
│         │  │   Mobile App               │ │    4 tasks left      │  │
│         │  │                            │ │                      │  │
│         │  └────────────────────────────┘ │ View all projects →  │  │
│         │                                 └──────────────────────┘  │
│         │  ┌────────────────────────────┐                           │
│         │  │ Overdue (1)                │                           │
│         │  │                            │                           │
│         │  │ ⚠ Write homepage copy      │                           │
│         │  │   Website Redesign · 3 days│                           │
│         │  │                            │                           │
│         │  └────────────────────────────┘                           │
│         │                                                           │
└─────────┴───────────────────────────────────────────────────────────┘
```

### Mobile (<768px)

```
┌───────────────────────────────────────────┐
│ ☰  Dashboard                    🔔  👤   │
├───────────────────────────────────────────┤
│                                           │
│  Good morning, Alice                      │
│  Tuesday, Jan 14                          │
│                                           │
│  Today (3)                                │
│  ┌───────────────────────────────────────┐│
│  │ ☐ Review mockup with stakeholders     ││
│  │   🔵 Website Redesign                 ││
│  ├───────────────────────────────────────┤│
│  │ ☐ Implement header component          ││
│  │   🔵 Website Redesign                 ││
│  ├───────────────────────────────────────┤│
│  │ ☐ Design app icon                     ││
│  │   🟢 Mobile App                       ││
│  └───────────────────────────────────────┘│
│                                           │
│  Overdue (1)                              │
│  ┌───────────────────────────────────────┐│
│  │ ⚠ Write homepage copy                 ││
│  │   🔵 Website Redesign · 3 days ago    ││
│  └───────────────────────────────────────┘│
│                                           │
│  Recent Projects                          │
│  ┌───────────────────────────────────────┐│
│  │ 🔵 Website Redesign     3 tasks left  ││
│  ├───────────────────────────────────────┤│
│  │ 🟢 Mobile App           7 tasks left  ││
│  ├───────────────────────────────────────┤│
│  │ 🟡 Q1 Planning          4 tasks left  ││
│  └───────────────────────────────────────┘│
│  View all projects →                      │
│                                           │
├───────────────────────────────────────────┤
│  🏠    📁    ➕    🔔    ⚙️              │
└───────────────────────────────────────────┘
```

---

## Sections

### Welcome Header

| Element | Content |
|---------|---------|
| Greeting | Based on time of day (see below) |
| Name | User's first name |
| Date | Current date (e.g., "Tuesday, Jan 14") |

**Time-based greetings:**
- 5am - 12pm: "Good morning"
- 12pm - 5pm: "Good afternoon"
- 5pm - 9pm: "Good evening"
- 9pm - 5am: "Working late"

### Today's Tasks Section

**Query**: Tasks where `due_date = today` AND `done = false`

| Element | Behavior |
|---------|----------|
| Header | "Today (X)" where X is count |
| Task list | Up to 5 tasks |
| "See all" | Show if more than 5 tasks |
| Empty state | "Nothing due today 🎉" |

**Task item display:**
- Checkbox (click to complete)
- Task title (truncate if long)
- Project indicator (color dot + name)
- Priority indicator (if high)

### Overdue Section

**Query**: Tasks where `due_date < today` AND `done = false`

| Element | Behavior |
|---------|----------|
| Header | "Overdue (X)" with warning icon |
| Task list | All overdue tasks (up to 5) |
| Days indicator | "X days ago" or "X days overdue" |
| Empty state | Don't show section at all |

**Visual treatment:**
- Warning icon (⚠) in header
- Red accent color
- Days overdue shown per task

### Recent Projects Section

**Query**: Projects where user is member, ordered by `updated_at DESC`, limit 5

| Element | Behavior |
|---------|----------|
| Header | "Recent Projects" |
| Project list | Up to 5 projects |
| "View all" | Link to `/projects` |
| Empty state | "Create your first project" button |

**Project item display:**
- Color indicator (dot or left border)
- Project name
- Tasks remaining count ("X tasks left")

---

## Data Requirements

```typescript
interface DashboardData {
  user: {
    id: string
    name: string
    email: string
  }
  todayTasks: Array<{
    id: string
    title: string
    done: boolean
    priority: string | null
    project: {
      id: string
      name: string
      color: string
    }
  }>
  overdueTasks: Array<{
    id: string
    title: string
    due_date: string
    done: boolean
    project: {
      id: string
      name: string
      color: string
    }
  }>
  recentProjects: Array<{
    id: string
    name: string
    color: string
    tasks_remaining: number
    updated_at: string
  }>
}
```

---

## Interactions

### Task Completion

1. User clicks checkbox
2. Optimistic update: Task shows checkmark + strikethrough
3. API call to update task
4. Task fades out (500ms delay)
5. Task removed from list
6. Count updates

### Task Click

1. User clicks task title
2. Navigate to project page with task highlighted
3. OR: Open task detail modal (depends on implementation)

### Project Click

1. User clicks project card
2. Navigate to `/projects/:id`

### Pull to Refresh (Mobile)

1. User pulls down on list
2. Show refresh indicator
3. Refetch dashboard data
4. Update all sections

---

## Loading States

### Initial Load

```
┌───────────────────────────────────────────┐
│                                           │
│  Good morning, █████                      │
│  ████████                                 │
│                                           │
│  Today                                    │
│  ┌───────────────────────────────────────┐│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░            ││
│  ├───────────────────────────────────────┤│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░            ││
│  ├───────────────────────────────────────┤│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░            ││
│  └───────────────────────────────────────┘│
│                                           │
└───────────────────────────────────────────┘
```

Use skeleton loaders for:
- User name (1 line)
- Date (1 short line)
- Task items (3 skeleton cards)
- Project items (3 skeleton cards)

### Background Refresh

No visible loading indicator. Update in place when data arrives.

---

## Empty States

### No Tasks Due Today

```
┌───────────────────────────────────────────┐
│  Today                                    │
│  ┌───────────────────────────────────────┐│
│  │                                       ││
│  │      🎉                               ││
│  │                                       ││
│  │  Nothing due today                    ││
│  │                                       ││
│  │  Enjoy your free time, or add some   ││
│  │  tasks to stay productive.            ││
│  │                                       ││
│  └───────────────────────────────────────┘│
└───────────────────────────────────────────┘
```

### No Projects

```
┌───────────────────────────────────────────┐
│  Recent Projects                          │
│  ┌───────────────────────────────────────┐│
│  │                                       ││
│  │      📁                               ││
│  │                                       ││
│  │  No projects yet                      ││
│  │                                       ││
│  │  [Create your first project]          ││
│  │                                       ││
│  └───────────────────────────────────────┘│
└───────────────────────────────────────────┘
```

### New User (No Data)

Show onboarding prompt instead of empty states:

```
┌───────────────────────────────────────────┐
│                                           │
│  Welcome to TaskFlow!                     │
│                                           │
│  ┌───────────────────────────────────────┐│
│  │                                       ││
│  │  Let's get you started                ││
│  │                                       ││
│  │  1. Create your first project         ││
│  │  2. Add some tasks                    ││
│  │  3. Start getting things done         ││
│  │                                       ││
│  │  [Create Project →]                   ││
│  │                                       ││
│  └───────────────────────────────────────┘│
│                                           │
└───────────────────────────────────────────┘
```

---

## Error States

### Network Error

```
┌───────────────────────────────────────────┐
│                                           │
│  ⚠️ Couldn't load dashboard              │
│                                           │
│  Check your connection and try again.    │
│                                           │
│  [Retry]                                  │
│                                           │
└───────────────────────────────────────────┘
```

### Partial Error

If one section fails, show error in that section only. Other sections should still work.

---

## Performance

| Metric | Target |
|--------|--------|
| Time to first paint | <500ms |
| Time to interactive | <1000ms |
| Data fetch | <500ms |
| Task completion | <100ms perceived |

### Caching Strategy

1. Show cached data immediately on load
2. Fetch fresh data in background
3. Update UI when fresh data arrives
4. Cache expires after 5 minutes

---

## Accessibility

- [ ] All interactive elements are keyboard accessible
- [ ] Tasks can be completed with keyboard (Enter/Space)
- [ ] Color is not the only indicator (use icons too)
- [ ] Screen reader announces section updates
- [ ] Focus management when tasks are removed

---

## Analytics Events

| Event | Properties |
|-------|------------|
| `dashboard_viewed` | tasks_today_count, tasks_overdue_count, projects_count |
| `task_completed_from_dashboard` | task_id, project_id |
| `project_clicked_from_dashboard` | project_id |
| `see_all_tasks_clicked` | - |
| `see_all_projects_clicked` | - |

---

## Acceptance Criteria

- [ ] Dashboard loads in under 1 second
- [ ] Greeting shows correct time-based message
- [ ] Today's tasks section shows tasks due today
- [ ] Overdue section shows past-due tasks (or hidden if none)
- [ ] Recent projects shows last 5 accessed projects
- [ ] Clicking task checkbox completes the task
- [ ] Clicking task navigates to project
- [ ] Clicking project navigates to project detail
- [ ] Empty states are helpful and actionable
- [ ] Pull to refresh works on mobile
- [ ] Skeleton loading states shown during initial load

---

*The dashboard is the heart of the app. It must be fast, clear, and actionable.*
