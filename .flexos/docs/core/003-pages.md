---
type: core
subtype: pages
title: TaskFlow Pages
description: Complete site map with routes, layouts, and navigation structure
sequence: 3
status: active
---

# TaskFlow Pages

## Site Architecture

TaskFlow is a single-page application with three distinct sections:

1. **Public Pages** - Marketing, auth, legal (no login required)
2. **Authenticated Pages** - The actual app (login required)
3. **Onboarding Flow** - New user setup (post-signup)

---

## Route Map

### Public Routes (No Auth Required)

| Route | Page | Layout | Purpose |
|-------|------|--------|---------|
| `/` | Landing | Public | Marketing homepage |
| `/login` | Login | Auth | User login |
| `/signup` | Signup | Auth | New user registration |
| `/forgot-password` | Forgot Password | Auth | Password reset request |
| `/reset-password` | Reset Password | Auth | Password reset form |
| `/pricing` | Pricing | Public | Pricing details |
| `/about` | About | Public | Company information |
| `/terms` | Terms of Service | Public | Legal terms |
| `/privacy` | Privacy Policy | Public | Privacy policy |
| `/help` | Help Center | Public | Support articles |

### Authenticated Routes (Login Required)

| Route | Page | Layout | Purpose |
|-------|------|--------|---------|
| `/dashboard` | Dashboard | App | Home after login |
| `/projects` | Projects List | App | All projects |
| `/projects/new` | New Project | App | Create project modal |
| `/projects/:id` | Project Detail | App | Single project tasks |
| `/projects/:id/settings` | Project Settings | App | Edit project, members |
| `/settings` | User Settings | App | Account settings hub |
| `/settings/profile` | Profile Settings | App | Name, email, avatar |
| `/settings/notifications` | Notification Settings | App | Email/push prefs |
| `/settings/account` | Account Settings | App | Password, delete account |

### Onboarding Routes (Post-Signup)

| Route | Page | Layout | Purpose |
|-------|------|--------|---------|
| `/onboarding` | Onboarding Start | Onboarding | Welcome screen |
| `/onboarding/profile` | Profile Setup | Onboarding | Name, avatar |
| `/onboarding/project` | First Project | Onboarding | Create first project |
| `/onboarding/complete` | Onboarding Complete | Onboarding | Success, CTA to dashboard |

---

## Layouts

### Public Layout

For marketing pages. Full-width, no sidebar.

```
┌──────────────────────────────────────────┐
│  Navbar (Logo | Nav Links | Login/Signup)│
├──────────────────────────────────────────┤
│                                          │
│              Page Content                │
│                                          │
├──────────────────────────────────────────┤
│  Footer (Links | Social | Copyright)     │
└──────────────────────────────────────────┘
```

**Navbar items:**
- Logo (links to `/`)
- Features (anchor to section)
- Pricing (links to `/pricing`)
- About (links to `/about`)
- Log In (links to `/login`)
- Sign Up (CTA button, links to `/signup`)

### Auth Layout

For login/signup pages. Centered card, gradient background.

```
┌──────────────────────────────────────────┐
│                                          │
│         ┌──────────────────┐             │
│         │  Logo            │             │
│         │                  │             │
│         │  Auth Form       │             │
│         │                  │             │
│         │  Links           │             │
│         └──────────────────┘             │
│                                          │
└──────────────────────────────────────────┘
```

**Design:**
- Gradient background (primary-50 to white)
- Centered card (max-width 400px)
- Logo at top of card
- Form fields
- Links below form (forgot password, switch to signup/login)

### App Layout

For authenticated pages. Sidebar + main content.

**Desktop (1024px+):**
```
┌────────────────────────────────────────────────────┐
│  Header (Breadcrumb | Search | Notifications | User)│
├────────────┬───────────────────────────────────────┤
│            │                                       │
│  Sidebar   │           Main Content               │
│  (280px)   │                                       │
│            │                                       │
│  - Dashboard│                                       │
│  - Projects │                                       │
│  - Settings │                                       │
│            │                                       │
└────────────┴───────────────────────────────────────┘
```

**Tablet (768px - 1023px):**
```
┌──────────────────────────────────────────┐
│  Header (Hamburger | Title | User)       │
├──────────────────────────────────────────┤
│                                          │
│              Main Content                │
│                                          │
│                                          │
└──────────────────────────────────────────┘

[Slide-out sidebar on hamburger tap]
```

**Mobile (<768px):**
```
┌──────────────────────────────────────────┐
│  Header (Hamburger | Title | User)       │
├──────────────────────────────────────────┤
│                                          │
│              Main Content                │
│                                          │
│                                          │
├──────────────────────────────────────────┤
│  Bottom Nav (Home | Projects | Add | Notif | More) │
└──────────────────────────────────────────┘
```

### Onboarding Layout

For onboarding flow. Full-screen, progress indicator.

```
┌──────────────────────────────────────────┐
│  Progress (Step 1 of 3)                  │
├──────────────────────────────────────────┤
│                                          │
│         ┌──────────────────┐             │
│         │  Step Content    │             │
│         │                  │             │
│         │  [Continue]      │             │
│         └──────────────────┘             │
│                                          │
│                                 [Skip]   │
└──────────────────────────────────────────┘
```

---

## Navigation Structure

### Primary Navigation (Sidebar/Bottom Nav)

| Icon | Label | Route | Badge |
|------|-------|-------|-------|
| Home | Dashboard | `/dashboard` | - |
| Folder | Projects | `/projects` | Project count |
| Bell | Notifications | - | Unread count |
| Settings | Settings | `/settings` | - |

### User Menu (Header dropdown)

| Icon | Label | Route/Action |
|------|-------|--------------|
| User | Profile | `/settings/profile` |
| Settings | Settings | `/settings` |
| Help | Help Center | `/help` (external) |
| LogOut | Log Out | Logout action |

### Breadcrumb Patterns

| Page | Breadcrumb |
|------|------------|
| Dashboard | Dashboard |
| Projects | Projects |
| Project Detail | Projects / [Project Name] |
| Project Settings | Projects / [Project Name] / Settings |
| Settings | Settings |
| Profile Settings | Settings / Profile |

---

## Page Specifications

### Landing Page (`/`)

**Sections:**
1. Hero - Headline, subtitle, CTAs, illustration
2. Social proof - Logos or stats
3. Features - 3-column grid with icons
4. How it works - 3-step process
5. Testimonials - 2-3 customer quotes
6. Pricing preview - Link to pricing page
7. CTA - Final call to action
8. Footer - Links, social, copyright

**Mobile behavior:**
- Single column layout
- Stacked sections
- Touch-friendly CTAs

### Dashboard (`/dashboard`)

**Sections:**
1. Welcome header - "Good morning, [Name]"
2. Today's tasks - Due today across projects (max 5, then "See all")
3. Overdue tasks - Past due tasks (warning styling)
4. Recent projects - Last 5 accessed projects

**States:**
- Loading: Skeleton cards
- Empty: Onboarding prompt for new users
- Error: Retry button

### Projects List (`/projects`)

**Sections:**
1. Header - "Projects" title, Create button
2. Filters - Active / Archived toggle
3. Projects grid - Cards with name, color, task count

**States:**
- Loading: Skeleton cards (6)
- Empty: "Create your first project" CTA
- Filtered empty: "No archived projects"

### Project Detail (`/projects/:id`)

**Sections:**
1. Header - Project name, color, settings link
2. Task list - Grouped by status or flat list
3. Add task - Inline input at bottom

**States:**
- Loading: Skeleton list
- Empty: "Add your first task" prompt
- Error: Retry with cached data

### Settings (`/settings`)

**Sections:**
1. Settings navigation - Profile, Notifications, Account
2. Active section content

**Subsections:**
- Profile: Name, email, avatar upload
- Notifications: Email prefs, push prefs
- Account: Change password, delete account

---

## Responsive Breakpoints

| Name | Width | Layout Changes |
|------|-------|----------------|
| Mobile | <640px | Bottom nav, single column, hamburger menu |
| Tablet | 640-1023px | Collapsible sidebar, 2 columns |
| Desktop | 1024px+ | Fixed sidebar, multi-column layouts |
| Wide | 1280px+ | Max container width, centered content |

---

## URL Parameters & State

### Query Parameters

| Page | Parameter | Purpose |
|------|-----------|---------|
| `/projects` | `?filter=archived` | Show archived projects |
| `/projects/:id` | `?task=:taskId` | Open task detail |
| `/settings` | `?tab=notifications` | Active settings tab |

### Route Guards

| Route Pattern | Guard | Redirect |
|---------------|-------|----------|
| `/dashboard`, `/projects/*`, `/settings/*` | requireAuth | `/login` |
| `/login`, `/signup` | redirectIfAuth | `/dashboard` |
| `/onboarding/*` | requireAuth + !onboardingComplete | `/dashboard` |

---

## SEO & Meta

### Public Pages

| Page | Title | Description |
|------|-------|-------------|
| Landing | TaskFlow - Task management that gets out of your way | Simple project and task management for freelancers and small teams. |
| Pricing | Pricing - TaskFlow | Affordable plans for individuals and teams. Free tier available. |
| Login | Log In - TaskFlow | Log in to your TaskFlow account. |
| Signup | Sign Up - TaskFlow | Create your free TaskFlow account. |

### App Pages

All app pages use:
- Title: `[Page Name] | TaskFlow`
- No-index (private content)
- Canonical URL pointing to clean route

---

*This document is the source of truth for all routes and navigation. When adding new pages, update this document first.*
