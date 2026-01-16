---
type: features
title: Notifications System
description: In-app notifications, push notifications, and notification preferences
status: draft
priority: medium
sequence: 5
relatesTo:
  - 003-features_core
  - 012-database_schema
tags:
  - notifications
  - post-mvp
generatedBy: ai
---

# Notifications System Spec

## Overview

Notifications keep users informed about important events without being overwhelming. We start with in-app notifications and expand to push/email in v1.1.

**Philosophy**: Notifications should be helpful, not noisy. Every notification type must pass the "would I want to know this?" test.

---

## Notification Types

### Core Notifications (MVP)

| Type | Trigger | Priority |
|------|---------|----------|
| `task_due` | Task due tomorrow | Medium |
| `task_overdue` | Task past due date | High |
| `task_assigned` | Assigned to a task | Medium |
| `task_completed` | Task you created was completed | Low |
| `member_joined` | Team member joined your project | Low |
| `member_left` | Team member left your project | Low |

### Future Notifications (v1.2+)

| Type | Trigger | Priority |
|------|---------|----------|
| `weekly_digest` | Weekly summary email | Low |
| `mention` | Mentioned in task description | High |
| `project_archived` | Project you're in was archived | Medium |
| `invitation_received` | Invited to a project | High |

---

## Notification Data Model

```typescript
interface Notification {
  id: string                    // UUID
  user_id: string               // Recipient
  type: NotificationType        // Enum of types
  title: string                 // Short title (max 100 chars)
  body: string | null           // Optional longer description
  data: Record<string, any>     // Type-specific payload
  read_at: string | null        // When read (null = unread)
  created_at: string            // When created
}

type NotificationType =
  | 'task_due'
  | 'task_overdue'
  | 'task_assigned'
  | 'task_completed'
  | 'member_joined'
  | 'member_left'
  | 'weekly_digest'
```

### Type-Specific Data Payloads

**task_due / task_overdue / task_assigned / task_completed:**
```typescript
{
  task_id: string
  task_title: string
  project_id: string
  project_name: string
  completed_by?: string  // For task_completed
}
```

**member_joined / member_left:**
```typescript
{
  user_id: string
  user_name: string
  project_id: string
  project_name: string
}
```

---

## UI Components

### Notification Bell (Header)

Location: App header, right side

```
┌─────────────────────────────────────────────────┐
│  Logo    Search...           [🔔]  [Avatar ▼]   │
└─────────────────────────────────────────────────┘
                                  │
                                  │ (if unread)
                                  │
                                 [2] ◄─ Red badge
```

**States:**
- No notifications: Bell icon (gray)
- Unread notifications: Bell icon + red badge with count
- Badge shows count up to 9, then "9+"

### Notification Dropdown

Opens when clicking bell icon.

```
┌────────────────────────────────────────┐
│ Notifications                   Mark all │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ 🔴 Task due tomorrow               │ │
│ │ "Review mockup" is due tomorrow    │ │
│ │ Website Redesign · 2h ago          │ │
│ └────────────────────────────────────┘ │
│ ┌────────────────────────────────────┐ │
│ │ 🔴 Task overdue                    │ │
│ │ "Design app icon" was due 2 days ago│ │
│ │ Mobile App · 1d ago                │ │
│ └────────────────────────────────────┘ │
│ ┌────────────────────────────────────┐ │
│ │ ○ Bob joined Website Redesign      │ │
│ │ Bob Smith is now a team member     │ │
│ │ 3d ago                             │ │
│ └────────────────────────────────────┘ │
├────────────────────────────────────────┤
│           View all notifications        │
└────────────────────────────────────────┘
```

**Behaviors:**
- Click notification → Navigate to relevant item + mark as read
- "Mark all" → Mark all as read
- "View all" → Navigate to full notifications page (if we add one)

### Notification Item

```
┌────────────────────────────────────────┐
│ [●] Task due tomorrow                  │
│     "Review mockup" is due tomorrow    │
│     Website Redesign · 2h ago          │
└────────────────────────────────────────┘
```

| Element | Unread | Read |
|---------|--------|------|
| Indicator | 🔴 Red dot | ○ Empty circle |
| Background | Slightly blue tinted | White |
| Title | Semibold | Normal |

### Empty State

```
┌────────────────────────────────────────┐
│                                        │
│            🔔                          │
│                                        │
│     No notifications yet               │
│                                        │
│   When something important happens,    │
│   you'll see it here.                  │
│                                        │
└────────────────────────────────────────┘
```

---

## Notification Preferences

### Settings Page (`/settings/notifications`)

```
┌────────────────────────────────────────────────────┐
│ Notifications                                      │
├────────────────────────────────────────────────────┤
│                                                    │
│ In-App Notifications                               │
│ ─────────────────────────────────────────────────  │
│                                                    │
│ Task reminders                            [ON]     │
│ Get notified when tasks are due                    │
│                                                    │
│ Task assignments                          [ON]     │
│ Get notified when assigned to a task               │
│                                                    │
│ Team activity                             [ON]     │
│ Get notified when team members join/leave          │
│                                                    │
│ Task completions                          [OFF]    │
│ Get notified when tasks you created are completed  │
│                                                    │
│ ─────────────────────────────────────────────────  │
│                                                    │
│ Push Notifications (Coming Soon)                   │
│ ─────────────────────────────────────────────────  │
│                                                    │
│ Enable push notifications                 [...]    │
│                                                    │
│ ─────────────────────────────────────────────────  │
│                                                    │
│ Email Notifications (Coming Soon)                  │
│ ─────────────────────────────────────────────────  │
│                                                    │
│ Weekly digest                             [...]    │
│ Receive a weekly summary of your activity          │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Preference Data Model

```typescript
interface NotificationPreferences {
  // In-app
  in_app_task_reminders: boolean     // Due/overdue
  in_app_task_assignments: boolean   // Assigned to you
  in_app_team_activity: boolean      // Member joined/left
  in_app_task_completions: boolean   // Your tasks completed

  // Push (future)
  push_enabled: boolean
  push_task_due: boolean
  push_task_overdue: boolean

  // Email (future)
  email_weekly_digest: boolean
}
```

---

## Notification Generation

### When Notifications Are Created

| Event | Notification | Recipients |
|-------|--------------|------------|
| Task due date = tomorrow | `task_due` | Assignee (or creator if unassigned) |
| Task due date < today | `task_overdue` | Assignee (or creator if unassigned) |
| Task assigned | `task_assigned` | New assignee |
| Task completed | `task_completed` | Task creator (if different from completer) |
| Member joins project | `member_joined` | Project owner |
| Member leaves project | `member_left` | Project owner |

### Notification Triggers

**Scheduled (daily cron job):**
- Check all tasks with due_date = tomorrow → Create `task_due`
- Check all tasks with due_date < today AND done = false → Create `task_overdue`

**Real-time (on action):**
- Task assigned → Create `task_assigned`
- Task completed → Create `task_completed`
- Member joins → Create `member_joined`
- Member leaves → Create `member_left`

### Deduplication

| Type | Deduplication Rule |
|------|-------------------|
| `task_due` | One per task per day |
| `task_overdue` | One per task total (don't spam) |
| `task_assigned` | One per assignment (reassign creates new) |
| Others | No deduplication needed |

---

## Notification Delivery

### In-App (MVP)

1. Notification created in database
2. Realtime subscription updates client
3. Bell badge updates
4. Dropdown shows new notification

### Push Notifications (v1.1)

1. Check user's push preferences
2. If enabled, send via Web Push API
3. Service worker shows notification
4. Click opens TaskFlow to relevant item

**Push notification format:**
```
┌────────────────────────────────────────┐
│ TaskFlow                               │
│                                        │
│ Task due tomorrow                      │
│ "Review mockup" is due tomorrow        │
└────────────────────────────────────────┘
```

### Email (v1.2)

Only for weekly digest initially.

**Subject**: Your TaskFlow week in review

**Content**:
- Tasks completed this week
- Tasks due next week
- Overdue tasks (if any)
- Recent team activity

---

## Actions

### Mark as Read

| Trigger | Effect |
|---------|--------|
| Click notification | Mark that notification as read |
| "Mark all" button | Mark all notifications as read |
| Automatic | Mark as read when viewing related item |

### Delete Notifications

- Not implemented in v1
- Old notifications (>30 days) auto-deleted by cron

### Clear All

- Not implemented in v1
- "Mark all as read" is sufficient

---

## Mobile Considerations

### Bell Icon on Mobile

- In header (same as desktop)
- Opens bottom sheet instead of dropdown
- Full-height scrollable list

### Push Notifications on Mobile

- Request permission on first use
- Handle notification tap → Open app to relevant item
- Badge on app icon (iOS)

---

## Analytics Events

| Event | Properties |
|-------|------------|
| `notification_received` | type |
| `notification_clicked` | type |
| `notification_marked_read` | type, was_clicked |
| `notifications_marked_all_read` | count |
| `push_permission_granted` | - |
| `push_permission_denied` | - |

---

## Acceptance Criteria

### Bell Icon
- [ ] Bell shows in header when logged in
- [ ] Badge shows unread count
- [ ] Badge shows "9+" for 10+ unread
- [ ] Click opens dropdown

### Dropdown
- [ ] Shows recent notifications (max 10)
- [ ] Unread notifications are visually distinct
- [ ] Click notification navigates to item
- [ ] Click notification marks as read
- [ ] "Mark all" marks all as read
- [ ] Empty state when no notifications

### Notification Generation
- [ ] `task_due` created day before due date
- [ ] `task_overdue` created when past due
- [ ] `task_assigned` created on assignment
- [ ] `task_completed` created on completion
- [ ] `member_joined` created when member added
- [ ] `member_left` created when member removed

### Preferences
- [ ] User can toggle each notification type
- [ ] Preferences persist correctly
- [ ] Disabled types don't generate notifications

---

*Notifications should inform, not overwhelm. Start minimal and add based on user feedback.*
