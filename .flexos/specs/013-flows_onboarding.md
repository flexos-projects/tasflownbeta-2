---
type: flow
title: Onboarding Flow
description: New user onboarding from signup to first project
status: approved
priority: high
sequence: 13
screens:
  - id: welcome
    page: /onboarding
    next: profile
    queries: []
    description: Welcome message and overview of what's next
  - id: profile
    page: /onboarding/profile
    next: project
    queries:
      - updateProfile
    description: Set name and optional avatar
  - id: project
    page: /onboarding/project
    next: complete
    queries:
      - createProject
    description: Create first project with name and color
  - id: complete
    page: /onboarding/complete
    next: null
    queries:
      - markOnboardingComplete
    description: Success message and redirect to dashboard
transitions:
  - from: welcome
    to: profile
    action: Click 'Get Started' button
  - from: profile
    to: project
    action: Click 'Continue' after entering name
  - from: project
    to: complete
    action: Click 'Create Project' with valid name
  - from: complete
    to: dashboard
    action: Click 'Go to Dashboard' or auto-redirect after 3s
relatesTo:
  - 004-features_auth
  - 011-pages_signup
prototype: 007-onboarding.html
tags:
  - onboarding
  - flow
generatedBy: ai
---

# Onboarding Flow Spec

## Overview

The onboarding flow guides new users from signup to their first project. It's designed to be quick (under 2 minutes) while setting users up for success.

**Goals:**
1. Collect minimal necessary information (name)
2. Create first project (builds investment)
3. Educate on core concepts (without being annoying)
4. Get user to dashboard as fast as possible

---

## Flow Diagram

```
Email Verified
    │
    ▼
┌─────────────────────┐
│   1. Welcome        │
│   ─────────────     │
│   Welcome message   │
│   [Get Started]     │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│   2. Profile        │
│   ─────────────     │
│   Name input        │
│   Avatar (optional) │
│   [Continue]        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│   3. First Project  │
│   ─────────────     │
│   Project name      │
│   Color picker      │
│   [Create Project]  │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│   4. Complete       │
│   ─────────────     │
│   Success message   │
│   [Go to Dashboard] │
└─────────────────────┘
    │
    ▼
Dashboard (with new project)
```

---

## Screen 1: Welcome

### Route

`/onboarding`

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Step 1 of 3                                                    │
│  ━━━○○○                                                         │
│                                                                 │
│                         👋                                       │
│                                                                 │
│              Welcome to TaskFlow!                               │
│                                                                 │
│    Let's set up your account. This will only take a minute.    │
│                                                                 │
│              ┌───────────────────────────────┐                  │
│              │        Get Started            │                  │
│              └───────────────────────────────┘                  │
│                                                                 │
│                                                                 │
│                                                       [Skip →]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

| Element | Behavior |
|---------|----------|
| Progress indicator | Shows step 1 of 3 |
| Emoji | 👋 wave animation on load |
| "Get Started" button | Navigate to Profile step |
| "Skip" link | Mark onboarding incomplete, go to dashboard |

### Data

No data collection on this screen.

---

## Screen 2: Profile

### Route

`/onboarding/profile`

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Step 2 of 3                                                    │
│  ━━━━━○○                                                        │
│                                                                 │
│              Tell us about yourself                             │
│                                                                 │
│         ┌─────┐                                                 │
│         │     │  [Upload Photo]                                 │
│         │ 👤  │                                                  │
│         │     │  (Optional)                                     │
│         └─────┘                                                 │
│                                                                 │
│  What should we call you?                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Alice Johnson                                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│  This is how you'll appear to your team.                        │
│                                                                 │
│              ┌───────────────────────────────┐                  │
│              │          Continue             │                  │
│              └───────────────────────────────┘                  │
│                                                                 │
│                                                       [Skip →]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

| Element | Behavior |
|---------|----------|
| Avatar upload | Optional, opens file picker |
| Name input | Pre-filled from signup if available |
| "Continue" button | Enabled when name is not empty |
| "Skip" link | Keep existing name, go to Project step |

### Validation

| Field | Validation |
|-------|------------|
| Name | Required, 1-100 characters |
| Avatar | Optional, max 2MB, JPG/PNG/GIF |

### Data Saved

```typescript
{
  name: string,
  avatar_url?: string
}
```

---

## Screen 3: First Project

### Route

`/onboarding/project`

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Step 3 of 3                                                    │
│  ━━━━━━━━━○                                                     │
│                                                                 │
│              Create your first project                          │
│                                                                 │
│    Projects help you organize related tasks. You can create    │
│    more later.                                                  │
│                                                                 │
│  Project name                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ My First Project                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Pick a color                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [●] [●] [●] [●] [●] [●] [●] [●] [●] [●]                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│              ┌───────────────────────────────┐                  │
│              │       Create Project          │                  │
│              └───────────────────────────────┘                  │
│                                                                 │
│                                                       [Skip →]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

| Element | Behavior |
|---------|----------|
| Project name input | Empty by default, placeholder "My First Project" |
| Color picker | 10 preset colors, first selected by default |
| "Create Project" button | Enabled when name is not empty |
| "Skip" link | Skip project creation, go to Complete |

### Color Options

Same as project colors:
- Blue (#3b82f6) - default selected
- Green (#22c55e)
- Amber (#f59e0b)
- Red (#ef4444)
- Purple (#8b5cf6)
- Pink (#ec4899)
- Cyan (#06b6d4)
- Indigo (#6366f1)
- Teal (#14b8a6)
- Orange (#f97316)

### Validation

| Field | Validation |
|-------|------------|
| Name | Required, 1-100 characters |
| Color | Required, one of preset colors |

### Data Saved

```typescript
{
  name: string,
  color: string
}
```

---

## Screen 4: Complete

### Route

`/onboarding/complete`

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ━━━━━━━━━━━━━                                                  │
│                                                                 │
│                         🎉                                       │
│                                                                 │
│              You're all set!                                    │
│                                                                 │
│         Your account is ready. Time to get things done.        │
│                                                                 │
│              ┌───────────────────────────────┐                  │
│              │       Go to Dashboard         │                  │
│              └───────────────────────────────┘                  │
│                                                                 │
│                    Redirecting in 3...                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

| Element | Behavior |
|---------|----------|
| Confetti animation | Brief celebration effect |
| "Go to Dashboard" button | Navigate to dashboard immediately |
| Countdown | Auto-redirect after 3 seconds |

### Side Effects

1. Mark `onboarding_completed = true` in profile
2. If project was created, navigate to that project's page
3. If skipped, navigate to dashboard

---

## Skip Behavior

### Skip from Welcome

- Mark onboarding as incomplete
- Navigate to dashboard
- Show onboarding prompt on dashboard

### Skip from Profile

- Keep existing name (from signup)
- Navigate to Project step

### Skip from Project

- Don't create a project
- Navigate to Complete step
- Dashboard will show "Create first project" prompt

### Skip from Complete

- Not applicable (no skip option)

---

## Edge Cases

### User Refreshes During Onboarding

- Resume from current step
- Data from previous steps is saved
- Progress indicator reflects current position

### User Navigates Away

- Save current step's data if valid
- On return, resume from same step
- Don't lose progress

### User Closes Browser

- Save step progress to server
- On next login, check `onboarding_completed`
- If false, redirect to appropriate step

### Back Navigation

- Allow going back to previous steps
- Preserve entered data
- Update progress indicator

---

## Mobile Layout

Same flow, full-screen steps:

```
┌───────────────────────────────────────────┐
│                                           │
│  Step 2 of 3                              │
│  ━━━━━○○                                  │
│                                           │
│       Tell us about yourself              │
│                                           │
│    ┌─────┐                                │
│    │     │  [Upload Photo]                │
│    │ 👤  │                                 │
│    │     │  (Optional)                    │
│    └─────┘                                │
│                                           │
│  What should we call you?                 │
│  ┌───────────────────────────────────────┐│
│  │ Alice Johnson                         ││
│  └───────────────────────────────────────┘│
│                                           │
│  ┌───────────────────────────────────────┐│
│  │           Continue                    ││
│  └───────────────────────────────────────┘│
│                                           │
│                              [Skip →]     │
│                                           │
└───────────────────────────────────────────┘
```

---

## Progress Indicator

### Design

```
Step 1 of 3
━━━○○○        (Welcome - current)
━━━━━○○       (Profile - current)
━━━━━━━━━○    (Project - current)
━━━━━━━━━━━━  (Complete)
```

### States

| Step | Bar | Description |
|------|-----|-------------|
| 1 | 33% filled | Welcome |
| 2 | 66% filled | Profile |
| 3 | 99% filled | Project |
| Complete | 100% filled | Done |

---

## Analytics Events

| Event | Properties |
|-------|------------|
| `onboarding_started` | source |
| `onboarding_step_viewed` | step_number, step_name |
| `onboarding_step_completed` | step_number, step_name |
| `onboarding_step_skipped` | step_number, step_name |
| `onboarding_completed` | steps_completed, time_taken |
| `onboarding_abandoned` | last_step, time_spent |

---

## A/B Test Ideas (Future)

1. **Skip visibility**: Hidden skip vs visible skip
2. **Step count**: 3 steps vs 2 steps (combine profile/project)
3. **Project step**: Required vs optional
4. **Avatar prompt**: With photo upload vs without

---

## Acceptance Criteria

### Welcome Screen
- [ ] Progress indicator shows step 1 of 3
- [ ] "Get Started" navigates to Profile
- [ ] "Skip" navigates to dashboard with onboarding incomplete

### Profile Screen
- [ ] Name input is pre-filled if available
- [ ] Avatar upload works (optional)
- [ ] Continue is disabled until name is entered
- [ ] Data is saved on Continue

### Project Screen
- [ ] Color picker shows all 10 colors
- [ ] First color is selected by default
- [ ] Create Project is disabled until name is entered
- [ ] Project is created on submit

### Complete Screen
- [ ] Confetti animation plays
- [ ] "Go to Dashboard" navigates immediately
- [ ] Auto-redirect after 3 seconds
- [ ] onboarding_completed is set to true

### General
- [ ] Progress is saved on each step
- [ ] Can go back to previous steps
- [ ] Works on mobile
- [ ] Skip is available on all steps (except complete)

---

*Onboarding is a first impression. Make it fast, friendly, and forgettable (in a good way).*
