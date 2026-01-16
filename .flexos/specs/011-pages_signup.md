---
type: pages
title: Signup Page
description: New user registration with email, password, and name
status: approved
priority: high
sequence: 11
route: /signup
prototype: 006-signup.html
relatesTo:
  - 004-features_auth
  - 010-pages_login
  - 013-flows_onboarding
tags:
  - auth
  - public
generatedBy: ai
---

# Signup Page Spec

## Overview

The signup page converts visitors into users. It must be frictionless while collecting the minimum necessary information.

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      [TaskFlow Logo]                            │
│                                                                 │
│                   Create your account                           │
│                                                                 │
│    ┌─────────────────────────────────────────────────────────┐  │
│    │                                                         │  │
│    │  Full name                                              │  │
│    │  ┌───────────────────────────────────────────────────┐  │  │
│    │  │ Alice Johnson                                     │  │  │
│    │  └───────────────────────────────────────────────────┘  │  │
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
│    │  ████████░░ Strong                                      │  │
│    │                                                         │  │
│    │  ☑ I agree to the Terms of Service and Privacy Policy  │  │
│    │                                                         │  │
│    │  ┌───────────────────────────────────────────────────┐  │  │
│    │  │                Create Account                     │  │  │
│    │  └───────────────────────────────────────────────────┘  │  │
│    │                                                         │  │
│    │  Already have an account? Log in                       │  │
│    │                                                         │  │
│    └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Form Fields

### Full Name

| Property | Value |
|----------|-------|
| Type | text |
| Autocomplete | name |
| Placeholder | "Your name" |
| Required | Yes |
| Autofocus | Yes |
| Max length | 100 |

### Email

| Property | Value |
|----------|-------|
| Type | email |
| Autocomplete | email |
| Placeholder | "you@example.com" |
| Required | Yes |

### Password

| Property | Value |
|----------|-------|
| Type | password (toggleable) |
| Autocomplete | new-password |
| Placeholder | "Create a password" |
| Required | Yes |
| Min length | 8 |

### Terms Checkbox

| Property | Value |
|----------|-------|
| Type | checkbox |
| Required | Yes |
| Label | "I agree to the Terms of Service and Privacy Policy" |
| Links | Terms and Privacy are clickable |

---

## Password Strength Indicator

### Requirements Checklist

```
Password Requirements:
☑ At least 8 characters
☑ Contains a letter
☐ Contains a number
```

- Show when password field is focused
- Green check for met requirements
- Gray unchecked for unmet

### Strength Bar

| Strength | Criteria | Color | Bar |
|----------|----------|-------|-----|
| Weak | <8 chars | Red | ██░░░░░░░░ |
| Fair | 8+ chars, 1 type | Orange | ████░░░░░░ |
| Good | 8+ chars, 2 types | Yellow | ██████░░░░ |
| Strong | 8+ chars, letter + number | Green | ████████░░ |
| Very Strong | 12+ chars, 3+ types | Green | ██████████ |

---

## Form States

### Default

- All fields empty
- Submit button disabled until required fields filled
- No errors shown

### Filling Out

- Enable submit when: name not empty, email valid, password meets requirements, terms checked
- Real-time validation feedback

### Loading

- Submit button shows spinner
- Button text: "Creating account..."
- All fields disabled

### Success

- Account created
- Navigate to email verification screen or onboarding

### Error States

| Error | Display |
|-------|---------|
| Email exists | Below email field: "This email is already registered. [Log in]" |
| Weak password | Show requirements not met |
| Terms not accepted | Below checkbox: "You must accept the terms to continue" |
| Server error | Alert: "Something went wrong. Please try again." |

---

## Validation

### Client-Side (Real-Time)

| Field | Validation | Display |
|-------|------------|---------|
| Name | Not empty | Error on blur if empty |
| Name | Max 100 chars | Prevent typing beyond limit |
| Email | Valid format | Error on blur if invalid |
| Password | Min 8 chars | Update requirements checklist |
| Password | Has letter | Update requirements checklist |
| Password | Has number | Update requirements checklist |
| Terms | Checked | Error on submit if unchecked |

### Server-Side

| Check | Response |
|-------|----------|
| Email unique | "This email is already registered" |
| Email valid | Generic validation error |
| Rate limit | "Too many signup attempts. Please wait." |

---

## Email Uniqueness Check

Check if email exists as user types (debounced):

1. User enters email
2. On blur or after 1 second of no typing
3. API call to check if email exists
4. If exists: Show error with login link
5. If not exists: Clear any error

---

## Post-Signup Flow

```
Signup Complete
    │
    ▼
Email Verification Sent
    │
    ▼
"Check Your Email" Screen
    │
    │ (User clicks link in email)
    │
    ▼
Email Verified
    │
    ▼
Redirect to Onboarding
```

### Check Your Email Screen

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      [Email Icon]                               │
│                                                                 │
│                   Check your email                              │
│                                                                 │
│    We sent a verification link to alice@example.com            │
│                                                                 │
│    Click the link in the email to verify your account.         │
│                                                                 │
│    Didn't receive the email?                                    │
│    [Resend Email]    [Use Different Email]                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Interactions

### Tab Order

1. Full name input
2. Email input
3. Password input
4. Show/hide password toggle
5. Terms checkbox
6. Terms of Service link
7. Privacy Policy link
8. Create Account button
9. Log in link

### Terms Links

- "Terms of Service" opens `/terms` in new tab
- "Privacy Policy" opens `/privacy` in new tab
- Links don't uncheck the checkbox

### Form Submission

1. Click "Create Account" or press Enter
2. Validate all fields
3. If errors: Show errors, focus first error field
4. If valid: Show loading state
5. Submit to server
6. On success: Navigate to verification screen
7. On error: Show error, preserve form data

---

## Security

### Rate Limiting

| Limit | Behavior |
|-------|----------|
| 5 signups per IP/hour | Show "Too many attempts" error |
| 3 resend emails per email/hour | Disable resend button |

### Password Storage

- Never send password in URL
- Never log password
- Hash with bcrypt on server

### Email Verification

- Required before account is fully active
- Link expires in 24 hours
- Can request new link (rate limited)

---

## Mobile Layout

Same as login, with additional consideration for password requirements:

```
┌───────────────────────────────────────────┐
│                                           │
│           [TaskFlow Logo]                 │
│                                           │
│        Create your account                │
│                                           │
│ ┌───────────────────────────────────────┐ │
│ │ Full name                             │ │
│ │ ┌───────────────────────────────────┐ │ │
│ │ │ Alice Johnson                     │ │ │
│ │ └───────────────────────────────────┘ │ │
│ │                                       │ │
│ │ Email                                 │ │
│ │ ┌───────────────────────────────────┐ │ │
│ │ │ alice@example.com                 │ │ │
│ │ └───────────────────────────────────┘ │ │
│ │                                       │ │
│ │ Password                              │ │
│ │ ┌───────────────────────────────────┐ │ │
│ │ │ ••••••••                     👁   │ │ │
│ │ └───────────────────────────────────┘ │ │
│ │ ████████░░ Strong                     │ │
│ │                                       │ │
│ │ ☑ I agree to the Terms and Privacy   │ │
│ │                                       │ │
│ │ ┌───────────────────────────────────┐ │ │
│ │ │        Create Account             │ │ │
│ │ └───────────────────────────────────┘ │ │
│ │                                       │ │
│ │ Already have an account? Log in      │ │
│ └───────────────────────────────────────┘ │
│                                           │
└───────────────────────────────────────────┘
```

---

## Analytics Events

| Event | Properties |
|-------|------------|
| `signup_page_viewed` | source, referrer |
| `signup_form_started` | - |
| `signup_attempted` | - |
| `signup_succeeded` | - |
| `signup_failed` | error_type |
| `email_check_performed` | email_exists |
| `terms_link_clicked` | link_type |
| `login_link_clicked` | - |
| `verification_email_sent` | - |
| `verification_email_resent` | - |

---

## SEO

| Meta | Value |
|------|-------|
| Title | Sign Up - TaskFlow |
| Description | Create your free TaskFlow account and start managing projects today. No credit card required. |
| Robots | index, follow (we want signups!) |

---

## Acceptance Criteria

- [ ] All form fields work correctly
- [ ] Password strength indicator updates in real-time
- [ ] Email uniqueness is checked
- [ ] Terms checkbox is required
- [ ] Terms links open in new tab
- [ ] Form validates before submission
- [ ] Loading state shows during submission
- [ ] Errors display appropriately
- [ ] Success redirects to verification screen
- [ ] Verification email is sent
- [ ] Resend email button works
- [ ] Login link navigates correctly
- [ ] Page is fully responsive

---

*Signup is a one-time experience. Make it memorable for the right reasons.*
