---
type: flow
title: Project Creation Flow
description: Creating a new project from the projects page
status: approved
priority: high
sequence: 14
screens:
  - id: projects-list
    page: /projects
    next: create-modal
    queries: []
    description: Projects list with 'New Project' button
  - id: create-modal
    page: /projects
    next: project-detail
    queries:
      - createProject
    description: Modal with project name, description, color, icon
  - id: project-detail
    page: /projects/:id
    next: null
    queries:
      - getProject
    description: Newly created project page (empty state)
transitions:
  - from: projects-list
    to: create-modal
    action: Click 'New Project' button
  - from: create-modal
    to: projects-list
    action: Click 'Cancel' or click outside modal
  - from: create-modal
    to: project-detail
    action: Click 'Create Project' with valid data
relatesTo:
  - 003-features_core
  - 008-pages_projects
tags:
  - flow
  - project
generatedBy: ai
---

# Project Creation Flow Spec

## Overview

Creating a project is one of the most common actions in TaskFlow. This flow covers the modal-based creation from the projects page.

---

## Flow Diagram

```
Projects Page
    │
    ├── Click "New Project" button
    │       │
    │       ▼
    │   ┌─────────────────────────────────────┐
    │   │         Create Project Modal        │
    │   │                                     │
    │   │  Name: [________________]           │
    │   │                                     │
    │   │  Description: [______________]      │
    │   │               [______________]      │
    │   │                                     │
    │   │  Color: [●][●][●][●][●]...         │
    │   │                                     │
    │   │  Icon: [📁][💼][🌐][❤️]...         │
    │   │                                     │
    │   │         [Cancel] [Create Project]   │
    │   └─────────────────────────────────────┘
    │       │                   │
    │       │                   │
    │       ▼                   ▼
    │   Cancel              Create
    │   (close modal)       (create & redirect)
    │       │                   │
    │       ▼                   ▼
    └── Projects Page      New Project Page
                           (empty state)
```

---

## Trigger Points

Project creation can be triggered from:

1. **Projects page** - "New Project" button in header
2. **Dashboard** - Empty state "Create Project" button
3. **Onboarding** - Step 3 create project
4. **Keyboard shortcut** - `p` from anywhere (future)
5. **Mobile bottom nav** - "+" button opens menu with "New Project"

---

## Modal Design

### Layout

```
┌────────────────────────────────────────────────────────────┐
│  New Project                                          [×]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Name *                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Website Redesign                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Description (optional)                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Complete overhaul of company website with new        │  │
│  │ branding and improved UX.                            │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Color                                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [●] [○] [○] [○] [○] [○] [○] [○] [○] [○]             │  │
│  │  ▲                                                   │  │
│  │ Selected                                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Icon                                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [📁] [💼] [🌐] [❤️] [⭐] [⚡]                        │  │
│  │ [☕] [📖] [📷] [🎵] [💻] [🏠]                        │  │
│  │  ▲                                                   │  │
│  │ Selected                                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                              [Cancel]  [Create Project]    │
└────────────────────────────────────────────────────────────┘
```

### Fields

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| Name | text | Yes | Empty | 1-100 chars |
| Description | textarea | No | Empty | 0-500 chars |
| Color | color picker | Yes | Blue (#3b82f6) | One of 10 presets |
| Icon | icon picker | Yes | folder | One of 12 presets |

### Color Options

10 preset colors displayed as filled circles:

| Color | Hex | Selected State |
|-------|-----|----------------|
| Blue | #3b82f6 | ● (filled with checkmark) |
| Green | #22c55e | ○ (filled, no checkmark) |
| Amber | #f59e0b | ○ |
| Red | #ef4444 | ○ |
| Purple | #8b5cf6 | ○ |
| Pink | #ec4899 | ○ |
| Cyan | #06b6d4 | ○ |
| Indigo | #6366f1 | ○ |
| Teal | #14b8a6 | ○ |
| Orange | #f97316 | ○ |

### Icon Options

12 preset icons in a 6×2 grid:

| Row 1 | folder | briefcase | globe | heart | star | zap |
|-------|--------|-----------|-------|-------|------|-----|
| Row 2 | coffee | book | camera | music | code | home |

Selected icon has a border/highlight.

---

## Interactions

### Opening Modal

1. Click "New Project" button
2. Modal appears with overlay
3. Focus moves to Name input
4. Background is dimmed and unclickable

### Closing Modal

| Action | Behavior |
|--------|----------|
| Click "Cancel" | Close modal, discard data |
| Click × button | Close modal, discard data |
| Click overlay | Close modal, discard data |
| Press Escape | Close modal, discard data |

No confirmation dialog (form is simple enough to re-enter).

### Form Validation

**Name field:**
- Show error on blur if empty: "Project name is required"
- Show error if >100 chars: "Name must be 100 characters or less"

**Submit button:**
- Disabled until name is not empty
- Shows loading spinner during submission

### Submission

1. Click "Create Project"
2. Validate all fields
3. If errors: Show errors, focus first error
4. If valid: Show loading state
5. API call to create project
6. On success: Close modal, navigate to new project
7. On error: Show error toast, keep modal open

---

## Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| Network error | "Couldn't create project. Please try again." | Keep modal open, retry button |
| Server error | "Something went wrong. Please try again." | Keep modal open |
| Validation error | Field-specific error message | Highlight field |

---

## Success Behavior

After successful creation:

1. Modal closes
2. Brief success toast: "Project created"
3. Navigate to `/projects/:newProjectId`
4. New project page shows empty state with "Add your first task"

---

## Mobile Considerations

### Modal → Bottom Sheet

On mobile (<640px), modal becomes a bottom sheet:

```
┌───────────────────────────────────────────┐
│                                           │
│                                           │
│   [Content behind, dimmed]                │
│                                           │
│                                           │
├───────────────────────────────────────────┤
│  ─────  (drag handle)                     │
│                                           │
│  New Project                              │
│                                           │
│  Name *                                   │
│  ┌───────────────────────────────────────┐│
│  │ My Project                            ││
│  └───────────────────────────────────────┘│
│                                           │
│  Description                              │
│  ┌───────────────────────────────────────┐│
│  │                                       ││
│  └───────────────────────────────────────┘│
│                                           │
│  Color                                    │
│  [●] [○] [○] [○] [○]                     │
│  [○] [○] [○] [○] [○]                     │
│                                           │
│  Icon                                     │
│  [📁] [💼] [🌐] [❤️] [⭐] [⚡]            │
│  [☕] [📖] [📷] [🎵] [💻] [🏠]            │
│                                           │
│  ┌───────────────────────────────────────┐│
│  │         Create Project                ││
│  └───────────────────────────────────────┘│
│                                           │
└───────────────────────────────────────────┘
```

- Swipe down to dismiss
- Full-width button at bottom
- Keyboard pushes content up

---

## Data Flow

### Input

```typescript
interface CreateProjectInput {
  name: string           // Required, 1-100 chars
  description?: string   // Optional, 0-500 chars
  color: string          // Required, hex color
  icon: string           // Required, icon name
}
```

### Output

```typescript
interface Project {
  id: string
  owner_id: string
  name: string
  description: string | null
  color: string
  icon: string
  archived_at: null
  created_at: string
  updated_at: string
}
```

### Side Effects

1. Project created in database
2. User automatically added as owner in team_members
3. Analytics event fired

---

## Analytics Events

| Event | Properties |
|-------|------------|
| `new_project_modal_opened` | source (projects_page, dashboard, onboarding) |
| `new_project_modal_closed` | completed (true/false) |
| `project_created` | project_id, has_description, color, icon |

---

## Acceptance Criteria

- [ ] "New Project" button opens modal
- [ ] Modal shows all form fields
- [ ] Name field is focused on open
- [ ] Color picker shows 10 options with selection
- [ ] Icon picker shows 12 options with selection
- [ ] Defaults are blue color and folder icon
- [ ] Submit is disabled until name is entered
- [ ] Validation errors show appropriately
- [ ] Loading state shows during submission
- [ ] Success navigates to new project
- [ ] Error shows toast and keeps modal open
- [ ] Modal closes on Cancel, ×, overlay click, Escape
- [ ] Mobile shows bottom sheet instead of modal

---

*Creating a project should feel effortless. Don't make users think.*
