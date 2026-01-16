---
type: core
subtype: flows
title: TaskFlow User Flows
description: Key user journeys, interactions, and edge cases
sequence: 5
status: active
---

# TaskFlow User Flows

## Flow Philosophy

Every user flow in TaskFlow should:

1. **Minimize steps** - Fewest clicks/taps to complete an action
2. **Provide feedback** - Every action has visible feedback
3. **Allow recovery** - Undo/back is always available
4. **Work offline** - Degrade gracefully without network

---

## Critical User Journeys

### 1. First-Time User Journey

The path from landing page to first completed task.

```
Landing Page
    │
    ▼
Sign Up Page ──────────┐
    │                  │ (email exists)
    ▼                  ▼
Email Verification    Login Page
    │                  │
    ▼                  ▼
Onboarding Start ◄────┘
    │
    ▼
Profile Setup (name, optional avatar)
    │
    ▼
Create First Project (name, color)
    │
    ▼
Onboarding Complete
    │
    ▼
Dashboard (with new empty project)
    │
    ▼
Project Detail ────► Create First Task
                          │
                          ▼
                    Task Created! 🎉
```

**Key Metrics:**
- Time from signup to first task: Target < 3 minutes
- Onboarding completion rate: Target > 80%
- Drop-off points to monitor: Email verification, first project

**Edge Cases:**
- User closes browser during onboarding → Resume where they left off
- User skips onboarding → Mark as incomplete, show prompt on dashboard
- Invalid email → Show error, allow retry

### 2. Daily Task Check Flow

The most common user session: reviewing and working on tasks.

```
Open App (Dashboard)
    │
    ├── View Today's Tasks
    │       │
    │       ▼
    │   Complete Task ──► Task strikethrough + move to done
    │       │
    │       ▼
    │   Next Task...
    │
    ├── View Overdue Tasks
    │       │
    │       ▼
    │   Reschedule ──► Date picker ──► Task updated
    │       │
    │       or
    │       ▼
    │   Complete anyway
    │
    └── Quick Add Task
            │
            ▼
        Task Input ──► Enter title ──► Select project ──► Created
```

**Optimizations:**
- Pre-fetch today's and overdue tasks on app load
- Optimistic UI for task completion
- One-tap reschedule for common options (today, tomorrow, next week)

### 3. Project Management Flow

Creating, organizing, and managing a project.

```
Projects List
    │
    ├── Create Project Button
    │       │
    │       ▼
    │   Project Modal ──► Name ──► Color ──► Create
    │       │
    │       ▼
    │   New Project (redirected to project page)
    │
    └── Existing Project Card
            │
            ▼
        Project Detail
            │
            ├── Add Task (inline input)
            │       │
            │       ▼
            │   Type title ──► Enter ──► Task created at bottom
            │
            ├── Edit Task (click task)
            │       │
            │       ▼
            │   Task Modal ──► Edit fields ──► Save
            │
            ├── Complete Task (checkbox)
            │       │
            │       ▼
            │   Strikethrough ──► Move to done section
            │
            ├── Delete Task (swipe or menu)
            │       │
            │       ▼
            │   Confirm ──► Task removed ──► Undo toast
            │
            ├── Reorder Tasks (drag handle)
            │       │
            │       ▼
            │   Drag ──► Drop ──► Position updated
            │
            └── Project Settings (gear icon)
                    │
                    ▼
                Settings Page ──► Edit name/color ──► Manage team
```

### 4. Team Collaboration Flow

Inviting team members and assigning tasks.

```
Project Settings
    │
    ▼
Team Members Section
    │
    ├── Current Members List
    │       │
    │       └── Remove Member ──► Confirm ──► Member removed
    │
    └── Invite Button
            │
            ▼
        Invite Modal
            │
            ▼
        Enter Email ──► Send Invitation
            │
            ▼
        Pending Invitation shown
            │
            ▼ (Invitee receives email)

        Click Link in Email
            │
            ├── (Not logged in) ──► Sign Up ──► Accept ──► Join
            │
            └── (Logged in) ──► Accept ──► Join
                    │
                    ▼
                Project now visible to invitee
```

**Error Handling:**
- Email already a member → Show "Already a member" error
- Invitation expired → Show "Expired" message, offer to request new
- Invitation revoked → Show "No longer valid" message

### 5. Task Assignment Flow

Assigning tasks to team members.

```
Task (in project with team members)
    │
    ▼
Click Assignee Field
    │
    ▼
Team Member Picker (dropdown)
    │
    ├── Unassigned (clear assignee)
    │
    ├── Assign to self
    │
    └── Assign to team member
            │
            ▼
        Assignee updated
            │
            ▼
        Notification sent to assignee (if not self)
```

---

## Authentication Flows

### Sign Up

```
Sign Up Page
    │
    ▼
Enter Email
    │
    ├── (Email exists) ──► "Account exists. Log in?" link
    │
    └── (Email valid)
            │
            ▼
        Enter Password
            │
            ├── (Too weak) ──► Show strength indicator + requirements
            │
            └── (Strong enough)
                    │
                    ▼
                Enter Name
                    │
                    ▼
                Accept Terms (checkbox)
                    │
                    ▼
                Create Account Button
                    │
                    ▼
                Verification Email Sent
                    │
                    ▼
                Check Your Email Page
                    │
                    ▼ (Click link in email)

                Email Verified
                    │
                    ▼
                Redirect to Onboarding
```

### Log In

```
Login Page
    │
    ▼
Enter Email
    │
    ▼
Enter Password
    │
    ├── (Incorrect) ──► "Invalid credentials" ──► Retry
    │       │
    │       └── (5 failures) ──► Account locked ──► Reset required
    │
    └── (Correct)
            │
            ├── (Onboarding incomplete) ──► Onboarding
            │
            └── (Onboarding complete) ──► Dashboard
```

### Forgot Password

```
Login Page
    │
    ▼
"Forgot Password?" link
    │
    ▼
Forgot Password Page
    │
    ▼
Enter Email
    │
    ▼
Send Reset Link Button
    │
    ▼
Check Your Email Page
    │
    ▼ (Click link in email)

Reset Password Page
    │
    ▼
Enter New Password
    │
    ▼
Confirm New Password
    │
    ▼
Reset Button
    │
    ▼
Success ──► Redirect to Login
```

---

## Error Flows

### Network Error

```
Any Action
    │
    ▼ (Network fails)

Toast: "Connection lost. Changes saved locally."
    │
    ▼
Action queued for retry
    │
    ▼ (Network restored)

Retry queued actions
    │
    ▼
Toast: "Back online. Changes synced."
```

### Session Expired

```
Any Action
    │
    ▼ (401 Unauthorized)

Modal: "Session expired. Please log in again."
    │
    ▼
Log In Button
    │
    ▼
Login Page (with redirect back to current page)
```

### Rate Limited

```
Any Action
    │
    ▼ (429 Too Many Requests)

Toast: "Too many requests. Please wait."
    │
    ▼
Retry with exponential backoff
```

---

## Mobile-Specific Flows

### Swipe Actions

| Gesture | On Task | Result |
|---------|---------|--------|
| Swipe right | Complete task | Toggle done state |
| Swipe left | Delete task | Show confirm, then delete |
| Long press | Show actions | Menu with edit, assign, delete |

### Pull to Refresh

| Screen | Refreshes |
|--------|-----------|
| Dashboard | Today's tasks, recent projects |
| Projects list | All projects |
| Project detail | Project info, all tasks |

### Bottom Sheet Patterns

- Task detail (edit mode)
- Project picker
- Date picker
- Team member picker
- Confirm dialogs

---

## Flow State Transitions

### Task States

```
┌──────────────────────────────────────┐
│                                      │
│    Created ──► In Progress ──► Done  │
│       │              │          │    │
│       │              │          │    │
│       └──────────────┴──────────┘    │
│                 │                    │
│                 ▼                    │
│              Deleted                 │
│                                      │
└──────────────────────────────────────┘
```

### Project States

```
Active ◄──► Archived ──► Deleted
```

### Invitation States

```
Pending ──┬──► Accepted ──► (Team Member created)
          │
          ├──► Revoked
          │
          └──► Expired (auto after 7 days)
```

---

## Analytics Events

Key events to track for each flow:

| Flow | Events |
|------|--------|
| Signup | `signup_started`, `signup_completed`, `signup_failed` |
| Onboarding | `onboarding_started`, `onboarding_step_completed`, `onboarding_skipped`, `onboarding_completed` |
| Task CRUD | `task_created`, `task_completed`, `task_uncompleted`, `task_deleted`, `task_edited` |
| Project | `project_created`, `project_archived`, `project_deleted` |
| Team | `invitation_sent`, `invitation_accepted`, `member_removed` |

---

*This document describes the ideal user flows. For detailed UI specifications, see the page specs.*
