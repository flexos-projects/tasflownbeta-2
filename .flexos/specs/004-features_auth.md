---
type: features
title: Authentication System
description: Signup, login, password reset, and session management
status: approved
priority: high
sequence: 4
relatesTo:
  - 003-features_core
  - 012-database_schema
  - 013-flows_onboarding
tags:
  - auth
  - security
  - mvp
generatedBy: ai
---

# Authentication System Spec

## Overview

TaskFlow uses email/password authentication powered by Supabase Auth. We prioritize simplicity and security over feature count—no SSO, no social login (initially), no MFA.

---

## Authentication Methods

### Primary: Email + Password

The only auth method at launch.

| Field | Validation |
|-------|------------|
| Email | Valid email format, unique |
| Password | Min 8 chars, at least 1 letter and 1 number |

### Future: Magic Link (v1.1)

Passwordless email login.

| Trigger | Send magic link to email |
|---------|--------------------------|
| User clicks link | Log in without password |
| Link expires | 1 hour |

### Future: Google OAuth (v1.2)

Social login option.

| Provider | Google |
|----------|--------|
| Scope | Email, profile |
| Account linking | By email address |

---

## Authentication Flows

### Sign Up Flow

```
Sign Up Page
    │
    ├── Enter Email
    │       │
    │       ├── (Invalid format) ──► "Please enter a valid email"
    │       │
    │       ├── (Already exists) ──► "Account exists. Log in instead?"
    │       │
    │       └── (Valid, new)
    │               │
    │               ▼
    ├── Enter Password
    │       │
    │       ├── (Too weak) ──► Show strength indicator + requirements
    │       │
    │       └── (Strong enough)
    │               │
    │               ▼
    ├── Enter Name
    │       │
    │       └── (1-100 chars)
    │               │
    │               ▼
    ├── Accept Terms
    │       │
    │       └── (Required checkbox)
    │               │
    │               ▼
    └── Create Account
            │
            ▼
    Account Created ──► Verification Email Sent
            │
            ▼
    "Check Your Email" Page
            │
            ▼ (User clicks link in email)

    Email Verified
            │
            ▼
    Redirect to Onboarding
```

### Login Flow

```
Login Page
    │
    ├── Enter Email
    │       │
    │       └── (Any email)
    │               │
    │               ▼
    ├── Enter Password
    │       │
    │       └── (Any password)
    │               │
    │               ▼
    └── Log In Button
            │
            ├── (Invalid credentials) ──► "Invalid email or password"
            │       │
            │       └── (After 5 failures) ──► Account locked (15 min)
            │
            └── (Valid credentials)
                    │
                    ├── (Onboarding incomplete) ──► /onboarding
                    │
                    └── (Onboarding complete) ──► /dashboard
```

### Forgot Password Flow

```
Login Page
    │
    └── "Forgot password?" link
            │
            ▼
Forgot Password Page
    │
    ├── Enter Email
    │       │
    │       └── (Any email - don't reveal if exists)
    │               │
    │               ▼
    └── Send Reset Link
            │
            ▼
    "Check Your Email" Page
            │
            ▼ (If account exists, email sent)

    Click Link in Email
            │
            ▼
    Reset Password Page
    │
    ├── Enter New Password
    │       │
    │       └── (Strength validation)
    │               │
    │               ▼
    ├── Confirm New Password
    │       │
    │       └── (Must match)
    │               │
    │               ▼
    └── Reset Password Button
            │
            ▼
    Password Updated ──► Redirect to Login
```

### Logout Flow

```
User Menu
    │
    └── "Log Out" option
            │
            ▼
    Clear Session
            │
            ▼
    Redirect to Landing Page
```

---

## UI Components

### Sign Up Page (`/signup`)

```
┌────────────────────────────────────────────┐
│                                            │
│            [TaskFlow Logo]                 │
│                                            │
│         Create your account                │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Email                                │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │ alice@example.com                │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │                                      │  │
│  │ Password                             │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │ ••••••••                    👁   │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │ ████████░░ Strong                    │  │
│  │                                      │  │
│  │ Full name                            │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │ Alice Johnson                    │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │                                      │  │
│  │ ☑ I agree to the Terms of Service   │  │
│  │   and Privacy Policy                 │  │
│  │                                      │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │      Create Account              │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │                                      │  │
│  │ Already have an account? Log in     │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

### Login Page (`/login`)

```
┌────────────────────────────────────────────┐
│                                            │
│            [TaskFlow Logo]                 │
│                                            │
│         Welcome back                       │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Email                                │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │ alice@example.com                │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │                                      │  │
│  │ Password                             │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │ ••••••••                    👁   │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │                   Forgot password?   │  │
│  │                                      │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │          Log In                  │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │                                      │  │
│  │ Don't have an account? Sign up      │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

### Password Strength Indicator

| Strength | Bar | Label | Color |
|----------|-----|-------|-------|
| Weak | ██░░░░░░░░ | Weak | Red |
| Fair | ████░░░░░░ | Fair | Orange |
| Good | ██████░░░░ | Good | Yellow |
| Strong | ████████░░ | Strong | Green |
| Very Strong | ██████████ | Very Strong | Green |

### Password Requirements

Display below password field when focused:

- ☑ At least 8 characters
- ☑ At least 1 letter
- ☑ At least 1 number
- ☐ At least 1 special character (optional, bonus)

---

## Form Validation

### Real-Time Validation

| Field | Validation | Message |
|-------|------------|---------|
| Email | Format | "Please enter a valid email address" |
| Email | Unique (on blur) | "This email is already registered" |
| Password | Length | "Password must be at least 8 characters" |
| Password | Complexity | Show requirements checklist |
| Name | Required | "Please enter your name" |
| Name | Length | "Name must be less than 100 characters" |
| Terms | Checked | "You must accept the terms to continue" |

### Submit Validation

| Error | Message |
|-------|---------|
| Invalid credentials | "Invalid email or password" |
| Account locked | "Too many attempts. Try again in 15 minutes." |
| Email not verified | "Please verify your email first" |
| Server error | "Something went wrong. Please try again." |

---

## Session Management

### Session Properties

| Property | Value |
|----------|-------|
| Storage | HTTP-only secure cookie |
| Duration | 7 days (sliding) |
| Refresh | Automatic on API calls |

### Session Events

| Event | Behavior |
|-------|----------|
| Login | Create session, redirect to app |
| Logout | Clear session, redirect to landing |
| Expired | Show "Session expired" modal, redirect to login |
| Invalid | Clear session, redirect to login |

### Multi-Device

| Behavior | Description |
|----------|-------------|
| Multiple sessions | Allowed (one per device) |
| Session list | Not shown (keep it simple) |
| Logout all | Not implemented (v1) |

---

## Security Measures

### Password Security

| Measure | Implementation |
|---------|----------------|
| Hashing | bcrypt (via Supabase) |
| Min length | 8 characters |
| Complexity | At least 1 letter + 1 number |
| Breach check | Optional (HaveIBeenPwned API) |

### Rate Limiting

| Action | Limit | Window |
|--------|-------|--------|
| Login attempts | 5 | 15 minutes |
| Password reset requests | 3 | 1 hour |
| Signup attempts | 5 | 1 hour |

### Account Lockout

| Trigger | 5 failed login attempts |
|---------|-------------------------|
| Duration | 15 minutes |
| Reset | Automatic after duration |
| Bypass | Password reset |

### CSRF Protection

| Method | Supabase built-in |
|--------|-------------------|
| Token | In cookie |

---

## Email Templates

### Verification Email

**Subject**: Verify your TaskFlow email

**Body**:
```
Hi [Name],

Welcome to TaskFlow! Please verify your email address by clicking the button below.

[Verify Email Address]

This link will expire in 24 hours.

If you didn't create a TaskFlow account, you can ignore this email.

Thanks,
The TaskFlow Team
```

### Password Reset Email

**Subject**: Reset your TaskFlow password

**Body**:
```
Hi [Name],

We received a request to reset your password. Click the button below to choose a new password.

[Reset Password]

This link will expire in 1 hour.

If you didn't request this, you can ignore this email. Your password won't be changed.

Thanks,
The TaskFlow Team
```

---

## Error States

### Login Errors

| Error | Message | Action |
|-------|---------|--------|
| Invalid credentials | "Invalid email or password" | Focus email field |
| Account locked | "Too many attempts. Try again in 15 minutes." | Show countdown |
| Unverified email | "Please verify your email first." | Link to resend |
| Server error | "Something went wrong. Please try again." | Retry button |

### Signup Errors

| Error | Message | Action |
|-------|---------|--------|
| Email exists | "This email is already registered." | Link to login |
| Weak password | "Password doesn't meet requirements." | Show requirements |
| Server error | "Something went wrong. Please try again." | Retry button |

---

## Analytics Events

| Event | Properties |
|-------|------------|
| `signup_started` | source |
| `signup_completed` | method |
| `signup_failed` | error_type |
| `login_started` | source |
| `login_completed` | method |
| `login_failed` | error_type |
| `logout` | - |
| `password_reset_requested` | - |
| `password_reset_completed` | - |

---

## Acceptance Criteria

### Sign Up
- [ ] User can create account with email, password, name
- [ ] Password strength indicator shows live feedback
- [ ] Terms checkbox is required
- [ ] Verification email is sent
- [ ] Clicking verification link activates account
- [ ] Duplicate email shows appropriate error

### Log In
- [ ] User can log in with email and password
- [ ] Invalid credentials show generic error
- [ ] Account locks after 5 failed attempts
- [ ] Successful login redirects to dashboard

### Password Reset
- [ ] User can request password reset
- [ ] Reset email is sent (if account exists)
- [ ] Reset link works within 1 hour
- [ ] User can set new password
- [ ] Old password no longer works

### Session
- [ ] Session persists across browser close
- [ ] Session expires after 7 days of inactivity
- [ ] Logout clears session completely
- [ ] Expired session redirects to login

---

*Authentication is the foundation of security. Every flow must be tested thoroughly.*
