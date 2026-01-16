---
type: pages
title: Projects Page
description: Projects list view with create, filter, and project cards
status: approved
priority: high
sequence: 8
route: /projects
prototype: 003-projects.html
relatesTo:
  - 003-features_core
  - 007-pages_dashboard
tags:
  - app
  - authenticated
generatedBy: ai
---

# Projects Page Spec

## Overview

The projects page shows all of a user's projects in a scannable grid format. It's the primary navigation point for accessing individual projects.

---

## Page Layout

### Desktop (1024px+)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                                    │
├─────────┼───────────────────────────────────────────────────────────┤
│         │                                                           │
│ Nav     │  Projects                          [+ New Project]        │
│ Items   │                                                           │
│         │  [Active ▼]  [Archived]                                   │
│         │                                                           │
│         │  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│         │  │ 🔵             │ │ 🟢             │ │ 🟡             ││
│         │  │                │ │                │ │                ││
│         │  │ Website        │ │ Mobile App     │ │ Q1 Planning    ││
│         │  │ Redesign       │ │                │ │                ││
│         │  │                │ │                │ │                ││
│         │  │ 5/8 tasks      │ │ 5/12 tasks     │ │ 2/6 tasks      ││
│         │  │ Updated 2h ago │ │ Updated 1d ago │ │ Updated 3d ago ││
│         │  └────────────────┘ └────────────────┘ └────────────────┘│
│         │                                                           │
│         │  ┌────────────────┐                                       │
│         │  │ 🟣             │                                       │
│         │  │                │                                       │
│         │  │ Customer       │                                       │
│         │  │ Research       │                                       │
│         │  │                │                                       │
│         │  │ 4/4 tasks ✓    │                                       │
│         │  │ Archived       │                                       │
│         │  └────────────────┘                                       │
│         │                                                           │
└─────────┴───────────────────────────────────────────────────────────┘
```

### Mobile (<768px)

```
┌───────────────────────────────────────────┐
│ ☰  Projects                    🔔  👤   │
├───────────────────────────────────────────┤
│                                           │
│  [Active ▼]  [Archived]                   │
│                                           │
│  ┌───────────────────────────────────────┐│
│  │ 🔵 Website Redesign                   ││
│  │    5/8 tasks · Updated 2h ago         ││
│  └───────────────────────────────────────┘│
│                                           │
│  ┌───────────────────────────────────────┐│
│  │ 🟢 Mobile App                         ││
│  │    5/12 tasks · Updated 1d ago        ││
│  └───────────────────────────────────────┘│
│                                           │
│  ┌───────────────────────────────────────┐│
│  │ 🟡 Q1 Planning                        ││
│  │    2/6 tasks · Updated 3d ago         ││
│  └───────────────────────────────────────┘│
│                                           │
├───────────────────────────────────────────┤
│  🏠    📁    ➕    🔔    ⚙️              │
└───────────────────────────────────────────┘
```

---

## Components

### Page Header

| Element | Desktop | Mobile |
|---------|---------|--------|
| Title | "Projects" (h1) | In header bar |
| New Project Button | Primary button | FAB or bottom nav "+" |

### Filter Tabs

Two toggle buttons:
- **Active** (default): Shows non-archived projects
- **Archived**: Shows archived projects

| State | Behavior |
|-------|----------|
| Active selected | Show projects where `archived_at IS NULL` |
| Archived selected | Show projects where `archived_at IS NOT NULL` |

### Project Card

```
┌────────────────────────────────────────┐
│ [Color bar - top or left border]       │
│                                        │
│  [Icon]  Project Name                  │
│                                        │
│  Short description if exists           │
│  (truncated to 2 lines)                │
│                                        │
│  5/8 tasks · Updated 2 hours ago       │
│                                        │
└────────────────────────────────────────┘
```

| Element | Details |
|---------|---------|
| Color indicator | 4px left border in project color |
| Icon | Project icon (from preset list) |
| Name | Project name, truncate if long |
| Description | First 2 lines of description (if exists) |
| Progress | "X/Y tasks" where Y is total, X is completed |
| Last updated | Relative time ("2 hours ago", "3 days ago") |

### Project Card States

| State | Visual |
|-------|--------|
| Default | White background, border |
| Hover | Slight shadow, border darker |
| All done | Checkmark icon, "✓ All done" |
| Archived | Faded, "Archived" badge |

### New Project Modal

```
┌────────────────────────────────────────────────────────────┐
│  New Project                                          [×]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Name *                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ My New Project                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Description (optional)                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ What is this project about?                          │  │
│  │                                                      │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Color                                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [●] [●] [●] [●] [●] [●] [●] [●] [●] [●]             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Icon                                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [📁] [💼] [🌐] [❤️] [⭐] [⚡]                        │  │
│  │ [☕] [📖] [📷] [🎵] [💻] [🏠]                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                              [Cancel]  [Create Project]    │
└────────────────────────────────────────────────────────────┘
```

| Field | Validation | Required |
|-------|------------|----------|
| Name | 1-100 characters | Yes |
| Description | 0-500 characters | No |
| Color | One of 10 presets | Yes (default: blue) |
| Icon | One of 12 presets | Yes (default: folder) |

---

## Data Requirements

```typescript
interface ProjectsPageData {
  projects: Array<{
    id: string
    name: string
    description: string | null
    color: string
    icon: string
    archived_at: string | null
    created_at: string
    updated_at: string
    task_count: number
    completed_count: number
  }>
  filter: 'active' | 'archived'
}
```

---

## Interactions

### Create Project

1. Click "New Project" button
2. Modal opens
3. Enter name (required)
4. Optionally add description
5. Select color (default selected)
6. Select icon (default selected)
7. Click "Create Project"
8. Modal closes
9. Navigate to new project page

### Open Project

1. Click project card
2. Navigate to `/projects/:id`

### Filter Toggle

1. Click "Active" or "Archived" tab
2. List updates to show filtered projects
3. URL updates (e.g., `?filter=archived`)

### Project Card Actions (Desktop)

On hover, show options menu:
- Open project
- Edit project
- Archive/Unarchive project
- Delete project

### Project Card Actions (Mobile)

Long press shows action sheet:
- Open project
- Edit project
- Archive/Unarchive project
- Delete project

---

## Empty States

### No Projects (New User)

```
┌───────────────────────────────────────────┐
│                                           │
│              📁                           │
│                                           │
│      No projects yet                      │
│                                           │
│   Create your first project to start      │
│   organizing your tasks.                  │
│                                           │
│      [Create Project]                     │
│                                           │
└───────────────────────────────────────────┘
```

### No Archived Projects

```
┌───────────────────────────────────────────┐
│                                           │
│              📦                           │
│                                           │
│      No archived projects                 │
│                                           │
│   When you archive a project, it will     │
│   appear here.                            │
│                                           │
└───────────────────────────────────────────┘
```

---

## Loading States

### Initial Load

Show skeleton cards (6 cards on desktop, 3 on mobile):

```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ ░░░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░░░ │
│                │ │                │ │                │
│ ░░░░░░░░░░░░   │ │ ░░░░░░░░░░░░   │ │ ░░░░░░░░░░░░   │
│                │ │                │ │                │
│ ░░░░░░░░       │ │ ░░░░░░░░       │ │ ░░░░░░░░       │
└────────────────┘ └────────────────┘ └────────────────┘
```

### Creating Project

Button shows loading spinner. Modal stays open until success.

---

## Sorting

Default sort: `updated_at DESC` (most recently updated first)

Future consideration: Allow sorting by:
- Recently updated
- Alphabetical
- Most tasks
- Oldest first

---

## Performance

| Metric | Target |
|--------|--------|
| Initial load | <500ms |
| Create project | <300ms |
| Filter switch | <100ms |

### Pagination

- Load first 20 projects immediately
- Load more on scroll (infinite scroll)
- Or: "Load more" button if >20 projects

---

## Analytics Events

| Event | Properties |
|-------|------------|
| `projects_page_viewed` | filter, project_count |
| `project_card_clicked` | project_id |
| `new_project_modal_opened` | source |
| `project_created` | project_id, has_description |
| `filter_changed` | new_filter |

---

## Acceptance Criteria

- [ ] Projects page shows all user's projects
- [ ] Active/Archived filter works correctly
- [ ] Project cards show name, color, progress, last updated
- [ ] Clicking project navigates to project detail
- [ ] "New Project" opens create modal
- [ ] Create modal validates required fields
- [ ] New project is created and user is redirected
- [ ] Empty states are helpful and actionable
- [ ] Loading states show skeleton cards
- [ ] Page is responsive (grid on desktop, list on mobile)

---

*The projects page is the command center. It should answer "what am I working on?" at a glance.*
