---
type: flow
title: Task Management Flow
description: Creating, editing, completing, and deleting tasks within a project
status: approved
priority: high
sequence: 15
screens:
  - id: project-detail
    page: /projects/:id
    next: null
    queries:
      - getProject
      - getTasks
    description: Project page with task list and inline add
  - id: task-modal
    page: /projects/:id
    next: project-detail
    queries:
      - getTask
      - updateTask
      - deleteTask
    description: Task detail modal for editing
transitions:
  - from: project-detail
    to: project-detail
    action: Type in inline add field and press Enter
  - from: project-detail
    to: task-modal
    action: Click on a task to open detail
  - from: project-detail
    to: project-detail
    action: Click checkbox to toggle complete
  - from: task-modal
    to: project-detail
    action: Click outside modal or press Escape
relatesTo:
  - 003-features_core
  - 012-database_schema
tags:
  - flow
  - tasks
generatedBy: ai
---

# Task Management Flow Spec

## Overview

Task management is the core of TaskFlow. Users spend most of their time creating, viewing, completing, and organizing tasks. Every interaction must feel instant.

---

## Flow Overview

```
Project Detail Page
    │
    ├── Inline Add ─────────────────────────────────────────┐
    │   │                                                   │
    │   ▼                                                   │
    │   Type title → Enter → Task created at bottom         │
    │                                                       │
    ├── Complete Task ──────────────────────────────────────┤
    │   │                                                   │
    │   ▼                                                   │
    │   Click checkbox → Task strikethrough → Move to done  │
    │                                                       │
    ├── View/Edit Task ─────────────────────────────────────┤
    │   │                                                   │
    │   ▼                                                   │
    │   Click task → Modal opens → Edit fields → Auto-save  │
    │                                                       │
    ├── Delete Task ────────────────────────────────────────┤
    │   │                                                   │
    │   ▼                                                   │
    │   Swipe left (mobile) or menu → Confirm → Undo toast  │
    │                                                       │
    └── Reorder Tasks ──────────────────────────────────────┘
        │
        ▼
        Drag handle → Drop → Position updated
```

---

## Task List Layout

### Project Detail Page

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Projects    Website Redesign                    [⚙️ Settings]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  To Do (5)                                                          │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ☐  Implement header component         Today    ⚡    ≡          ││
│  └─────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ☐  Review mockup with stakeholders    Jan 15   ●     ≡          ││
│  └─────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ☐  Set up analytics tracking          Jan 20         ≡          ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ➕  Add a task...                                               ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  Done (3)                                              [▼ Collapse] │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ☑  Design homepage mockup              ✓ Jan 8                  ││
│  └─────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ☑  Write homepage copy                 ✓ Jan 6                  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Task Item Components

| Element | Description | Position |
|---------|-------------|----------|
| Checkbox | Toggle done/undone | Left |
| Title | Task title, truncate if long | Center |
| Due date | Relative date or "Today" | Right (before priority) |
| Priority | Colored dot (red/amber/green) | Right (before drag) |
| Drag handle | ≡ for reordering | Right (desktop only) |

---

## Task Creation

### Inline Add Field

```
┌─────────────────────────────────────────────────────────────────┐
│ ➕  Add a task...                                               │
└─────────────────────────────────────────────────────────────────┘
```

| State | Behavior |
|-------|----------|
| Blurred | Shows placeholder "Add a task..." |
| Focused | Cursor active, ready to type |
| With text | Shows entered text |
| Submit | Enter creates task, field clears, stays focused |

### Creation Flow

1. Click inline add field (or use keyboard shortcut `c`)
2. Type task title
3. Press Enter
4. Task created at bottom of list
5. Field clears, stays focused for rapid entry
6. Press Escape to blur

### Quick Entry Parsing (Future Enhancement)

```
"Review docs tomorrow"      → Due date: tomorrow
"Call client @high"         → Priority: high
"Fix bug #urgent"           → Tag: urgent
"Meeting 1/20"              → Due date: Jan 20
```

---

## Task Completion

### Toggle Behavior

1. Click checkbox
2. Optimistic update: Checkmark appears, title strikethrough
3. Task fades slightly (opacity: 0.7)
4. After 500ms, task animates to Done section
5. Done section count updates

### Undo

- No explicit undo for completion
- Click checkbox again to uncomplete
- Task moves back to To Do section

### Animation

```
Before:  ☐ Task title
Click:   ☑ Task title (strikethrough)
500ms:   Task slides down to Done section
```

---

## Task Detail Modal

### Layout

```
┌────────────────────────────────────────────────────────────────────┐
│                                                              [×]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Implement header component                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Build responsive header with logo, navigation, and mobile   │  │
│  │ hamburger menu. Should match the prototype exactly.         │  │
│  │                                                              │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ─────────────────────────────────────────────────────────────────│
│                                                                    │
│  Status                                                            │
│  [○ To Do]  [● Done]                                              │
│                                                                    │
│  Due Date                                                          │
│  ┌──────────────────────┐                                          │
│  │ Jan 14, 2025    📅  │  [Clear]                                 │
│  └──────────────────────┘                                          │
│                                                                    │
│  Priority                                                          │
│  [None] [Low] [● Medium] [High]                                   │
│                                                                    │
│  Assignee                                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [Avatar] Alice Johnson                               ▼      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Tags                                                              │
│  [dev] [component] [+]                                            │
│                                                                    │
│  ─────────────────────────────────────────────────────────────────│
│                                                                    │
│  Created Jan 2 by Alice · Updated 2 hours ago                     │
│                                                                    │
│  ─────────────────────────────────────────────────────────────────│
│                                                                    │
│  [🗑 Delete Task]                                                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Fields

| Field | Type | Behavior |
|-------|------|----------|
| Title | Inline text | Auto-save on blur |
| Description | Textarea | Auto-save on blur, markdown support |
| Status | Toggle | Immediately toggles done state |
| Due Date | Date picker | Opens calendar, auto-save on select |
| Priority | Button group | Immediately updates priority |
| Assignee | Dropdown | Shows team members, auto-save on select |
| Tags | Tag input | Add/remove tags, max 5 |

### Auto-Save Behavior

1. User edits field
2. 500ms after last keystroke (debounced)
3. Save to server
4. Show subtle "Saved" indicator or checkmark
5. On error: Show error, revert to previous value

---

## Task Deletion

### Delete Flow

1. Open task detail modal
2. Click "Delete Task" at bottom
3. Confirmation appears: "Delete this task?"
4. Click "Delete" to confirm
5. Task removed from list
6. Toast appears: "Task deleted" with [Undo]

### Undo Delete

- Toast lasts 5 seconds
- Click "Undo" to restore task
- Task reappears in original position

### Mobile Delete

1. Swipe task left
2. Red "Delete" button appears
3. Tap Delete
4. Task removed with undo toast

OR

1. Long press task
2. Action sheet appears
3. Select "Delete"
4. Confirmation dialog
5. Task removed with undo toast

---

## Task Reordering

### Desktop

1. Hover over task to show drag handle (≡)
2. Click and drag handle
3. Task lifts (shadow appears)
4. Drag to new position
5. Other tasks make room
6. Drop to finalize
7. Position saved to server

### Mobile

1. Long press task (not checkbox)
2. Task lifts with haptic feedback
3. Drag to new position
4. Release to drop
5. Position saved

### Technical Notes

- Use optimistic updates
- Only update `position` field
- Batch update affected tasks
- On error, revert to original positions

---

## Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `c` | Focus inline add | Project page |
| `Enter` | Create task | Inline add focused |
| `Escape` | Blur input / Close modal | Any |
| `j` / `k` | Navigate up/down in list | Project page |
| `Space` | Toggle complete | Task focused |
| `e` | Open task detail | Task focused |
| `Delete` | Delete task | Task detail modal |
| `↑` / `↓` | Move task up/down | Task focused (future) |

---

## Empty State

When project has no tasks:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         📋                                       │
│                                                                 │
│              No tasks yet                                       │
│                                                                 │
│    Add your first task to get started.                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ➕  Add a task...                                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Performance Targets

| Action | Target |
|--------|--------|
| Create task | <100ms perceived |
| Complete task | <50ms perceived |
| Open detail modal | <100ms |
| Save field edit | <500ms (debounced) |
| Delete task | <100ms perceived |
| Reorder task | <100ms perceived |

---

## Analytics Events

| Event | Properties |
|-------|------------|
| `task_created` | project_id, has_due_date, has_priority |
| `task_completed` | task_id, time_since_created |
| `task_uncompleted` | task_id |
| `task_edited` | task_id, fields_changed |
| `task_deleted` | task_id, was_completed |
| `task_reordered` | task_id, old_position, new_position |
| `task_detail_opened` | task_id |
| `task_assigned` | task_id, assignee_id |

---

## Acceptance Criteria

### Task Creation
- [ ] Inline add creates task on Enter
- [ ] Task appears at bottom of list
- [ ] Field clears and stays focused after create
- [ ] Escape blurs the input

### Task Completion
- [ ] Clicking checkbox toggles done state
- [ ] Completed tasks show strikethrough
- [ ] Completed tasks move to Done section
- [ ] Uncompleting moves back to To Do

### Task Detail
- [ ] Clicking task opens detail modal
- [ ] All fields are editable
- [ ] Changes auto-save (debounced)
- [ ] Status toggle works
- [ ] Date picker works
- [ ] Priority selector works
- [ ] Assignee dropdown shows team members
- [ ] Tags can be added/removed

### Task Deletion
- [ ] Delete button is in modal
- [ ] Confirmation is required
- [ ] Undo toast appears for 5 seconds
- [ ] Undo restores task
- [ ] Mobile swipe delete works

### Task Reordering
- [ ] Drag handle visible on desktop hover
- [ ] Drag and drop reorders tasks
- [ ] Mobile long-press enables drag
- [ ] Position persists after refresh

---

*Task management is where users spend their time. Every millisecond counts.*
