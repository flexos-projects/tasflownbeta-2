---
type: pages
title: Login Page
description: User login with email and password
status: approved
priority: high
sequence: 10
route: /login
prototype: 005-login.html
relatesTo:
  - 004-features_auth
  - 011-pages_signup
tags:
  - auth
  - public
generatedBy: ai
---

# Login Page Spec

## Overview

The login page is the gateway for returning users. It should be fast, simple, and get out of the way.

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      [TaskFlow Logo]                            │
│                                                                 │
│                     Welcome back                                │
│                                                                 │
│    ┌─────────────────────────────────────────────────────────┐  │
│    │                                                         │  │
│    │  Email                                                  │  │
│    │  ┌───────────────────────────────────────────────────┐  │  │
│    │  │ alice@example.com                                 │  │  │
│    │  └───────────────────────────────────────────────────┘  │  │
│    │                                                         │  │
│    │  Password                                               │  │
│    │  ┌───────────────────────────────────────────────────┐  │  │
│    │  │ ••••••••                                     👁   │  │  │
│    │  └───────────────────────────────────────────────────┘  │  │
│    │                              Forgot password?           │  │
│    │                                                         │  │
│    │  ┌───────────────────────────────────────────────────┐  │  │
│    │  │                     Log In                        │  │  │
│    │  └───────────────────────────────────────────────────┘  │  │
│    │                                                         │  │
│    │  Don't have an account? Sign up                        │  │
│    │                                                         │  │
│    └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Visual Design

### Background

- Subtle gradient: `linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)`
- Or solid: `#f8fafc` (gray-50)

### Card

- Background: white
- Border: 1px solid gray-200
- Border radius: 16px (radius-xl)
- Shadow: shadow-lg
- Max width: 400px
- Padding: 32px (space-8)

### Logo

- TaskFlow logo centered above card
- Click to go to landing page
- Size: height 32px

### Typography

| Element | Style |
|---------|-------|
| "Welcome back" | text-2xl, font-semibold, gray-900 |
| Labels | text-sm, font-medium, gray-700 |
| Links | text-sm, primary-600, underline on hover |
| Body text | text-sm, gray-600 |

---

## Form Fields

### Email Input

| Property | Value |
|----------|-------|
| Type | email |
| Autocomplete | email |
| Placeholder | "you@example.com" |
| Required | Yes |
| Autofocus | Yes |

### Password Input

| Property | Value |
|----------|-------|
| Type | password (toggleable) |
| Autocomplete | current-password |
| Placeholder | "Enter your password" |
| Required | Yes |
| Show/hide toggle | Eye icon on right |

---

## Form States

### Default

- All fields empty or populated
- Submit button enabled
- No errors shown

### Loading

- Submit button shows spinner
- Button text: "Logging in..."
- All fields disabled
- Prevent double submission

### Success

- Brief success state (optional)
- Redirect to dashboard (or redirect URL)

### Error States

| Error | Display |
|-------|---------|
| Invalid credentials | Red alert below form: "Invalid email or password" |
| Account locked | Red alert: "Too many attempts. Try again in X minutes." |
| Unverified email | Red alert with link: "Please verify your email. [Resend]" |
| Server error | Red alert: "Something went wrong. Please try again." |

Error Alert Component:
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠ Invalid email or password                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Validation

### Client-Side

| Field | Validation | Timing |
|-------|------------|--------|
| Email | Valid email format | On blur |
| Password | Not empty | On submit |

### Server-Side

| Check | Response |
|-------|----------|
| Email exists | Generic error (don't reveal) |
| Password correct | Generic error (don't reveal) |
| Account active | Specific error if locked |
| Email verified | Specific error with resend option |

---

## Interactions

### Tab Order

1. Email input
2. Password input
3. Show/hide password toggle
4. Forgot password link
5. Log In button
6. Sign up link

### Password Toggle

1. Click eye icon
2. Toggle input type: password ↔ text
3. Icon changes: eye ↔ eye-off
4. Focus stays on input

### Form Submission

1. Click "Log In" or press Enter
2. Validate fields client-side
3. Show loading state
4. Submit to server
5. On success: Redirect
6. On error: Show error message, keep form data

### Forgot Password Link

1. Click "Forgot password?"
2. Navigate to `/forgot-password`
3. Preserve email if entered (query param)

### Sign Up Link

1. Click "Sign up"
2. Navigate to `/signup`
3. Preserve email if entered (query param)

---

## Redirect Behavior

### Default Redirect

- After successful login: `/dashboard`

### Redirect Parameter

- If URL has `?redirect=/some/path`
- After login: Redirect to that path
- Validate redirect is internal (prevent open redirect)

### Onboarding Check

- If `onboarding_completed = false`
- Redirect to `/onboarding` instead of dashboard

---

## Security

### Rate Limiting

| Limit | Behavior |
|-------|----------|
| 5 failed attempts | Lock account for 15 minutes |
| Show remaining | "X attempts remaining" after 3 failures |

### Session

- Create secure HTTP-only cookie
- Session duration: 7 days sliding
- CSRF token in cookie

### No Password Hints

- Never reveal if email exists
- Never reveal password requirements on login
- Generic "Invalid email or password" for all auth failures

---

## Mobile Layout

Same layout but:
- Full-width card (edge-to-edge with margin)
- Larger touch targets (min 48px)
- Show/hide password button is 44x44px minimum
- Virtual keyboard doesn't cover submit button

```
┌───────────────────────────────────────────┐
│                                           │
│           [TaskFlow Logo]                 │
│                                           │
│          Welcome back                     │
│                                           │
│ ┌───────────────────────────────────────┐ │
│ │ Email                                 │ │
│ │ ┌───────────────────────────────────┐ │ │
│ │ │ alice@example.com                 │ │ │
│ │ └───────────────────────────────────┘ │ │
│ │                                       │ │
│ │ Password                              │ │
│ │ ┌───────────────────────────────────┐ │ │
│ │ │ ••••••••                     👁   │ │ │
│ │ └───────────────────────────────────┘ │ │
│ │                     Forgot password?  │ │
│ │                                       │ │
│ │ ┌───────────────────────────────────┐ │ │
│ │ │           Log In                  │ │ │
│ │ └───────────────────────────────────┘ │ │
│ │                                       │ │
│ │ Don't have an account? Sign up       │ │
│ └───────────────────────────────────────┘ │
│                                           │
└───────────────────────────────────────────┘
```

---

## Analytics Events

| Event | Properties |
|-------|------------|
| `login_page_viewed` | has_redirect, source |
| `login_attempted` | - |
| `login_succeeded` | redirect_to |
| `login_failed` | error_type |
| `forgot_password_clicked` | - |
| `signup_link_clicked` | - |

---

## SEO

| Meta | Value |
|------|-------|
| Title | Log In - TaskFlow |
| Description | Log in to your TaskFlow account to manage your projects and tasks. |
| Robots | noindex (don't index login page) |

---

## Acceptance Criteria

- [ ] Logo links to landing page
- [ ] Email field has correct autocomplete
- [ ] Password field has show/hide toggle
- [ ] Form validates email format on blur
- [ ] Form submits on Enter key
- [ ] Loading state shows during submission
- [ ] Invalid credentials shows error message
- [ ] Account lockout shows appropriate message
- [ ] Forgot password link navigates correctly
- [ ] Sign up link navigates correctly
- [ ] Successful login redirects to dashboard
- [ ] Redirect parameter is honored (if valid)
- [ ] Page is fully responsive

---

*The login page should be invisible. Users should fly through it without thinking.*
