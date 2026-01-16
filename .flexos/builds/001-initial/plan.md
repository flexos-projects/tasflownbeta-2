---
type: plan
title: TaskFlow Initial Build Plan
status: approved
---

# Build Plan: TaskFlow Initial

## Overview

Create the complete TaskFlow application from scratch using Nuxt 4, Firebase, and Gemini AI.

## Source Specs (10 files)

| Spec | Type | Purpose |
|------|------|---------|
| 003-features_core.md | features | Projects, Tasks, Dashboard, Search |
| 004-features_auth.md | features | Auth methods, flows, session management |
| 006-pages_landing.md | pages | Landing page - 9 sections |
| 007-pages_dashboard.md | pages | Dashboard layout and components |
| 008-pages_projects.md | pages | Projects list and detail |
| 009-pages_settings.md | pages | Settings navigation and forms |
| 010-pages_login.md | pages | Login form and states |
| 011-pages_signup.md | pages | Signup form and validation |
| 012-database_schema.md | database | Firestore collections |
| 013-flows_onboarding.md | flows | 4-step onboarding |

## Prototypes (7 files)

| Prototype | Status | Spec |
|-----------|--------|------|
| 001-landing.html | Ready | 006-pages_landing.md |
| 002-dashboard.html | Ready | 007-pages_dashboard.md |
| 003-projects.html | Ready | 008-pages_projects.md |
| 004-settings.html | Ready | 009-pages_settings.md |
| 005-login.html | Ready | 010-pages_login.md |
| 006-signup.html | Pending | 011-pages_signup.md |
| 007-onboarding.html | Pending | 013-flows_onboarding.md |

## Build Documentation (3 files)

| Doc | Coverage |
|-----|----------|
| 001-nuxt4.md | Nuxt 4 setup, conventions, patterns |
| 002-firebase.md | Firebase Auth, Firestore, Storage |
| 003-gemini.md | Gemini AI SDK integration |

## Execution Phases

### Phase 1: Foundation (Tasks 001-007)

**Goal:** Set up project infrastructure and core services.

```
001 Setup Project ─────────────┐
                               ├──> 003 Create Layout
002 Install Dependencies ──────┼──> 004 Create Tokens
                               │
                               ├──> 006 Create Auth Store
                               └──> 007 Create Firebase Client
```

**Outputs:**
- Nuxt 4 project structure
- Tailwind 4 configuration
- Firebase client initialization
- Auth store with Pinia
- Design tokens from prototype

### Phase 2: UI Components (Task 005)

**Goal:** Create reusable UI component library.

**Depends on:** Tasks 003, 004

**Components (12):**
- Button (all variants: primary, secondary, ghost, danger)
- Input (text, email, password, with validation)
- Card (basic, hover, clickable, accent)
- Badge (default, success, warning, error)
- Avatar (sizes, initials, image)
- Modal (sizes, transitions)
- Dropdown (positioning, items)
- Progress (bar, percentage)
- Checkbox (checked, indeterminate)
- Toggle (switch style)
- Select (native, custom options)
- Skeleton (text, avatar, card)

### Phase 3: Pages (Tasks 008-014)

**Goal:** Create all application pages matching prototypes exactly.

```
                    ┌──> 008 Landing Page
005 UI Components ──┼──> 009 Login Page
                    ├──> 010 Signup Page
                    ├──> 011 Onboarding Flow
006 Auth Store ─────┼──> 012 Dashboard Page
007 Firebase Client ┼──> 013 Projects Page
                    └──> 014 Settings Page
```

**Page Count:** 12 total pages
- Landing (1)
- Auth (2): Login, Signup
- Onboarding (4): Index, Profile, Workspace, Complete
- App (5): Dashboard, Projects Index, Project Detail, Settings tabs

### Phase 4: Navigation (Task 015)

**Goal:** Create layout navigation components.

**Components:**
- Sidebar (desktop, collapsible)
- Header (breadcrumb, user menu)
- MobileNav (bottom sheet navigation)

### Phase 5: Wiring (Tasks 016-018)

**Goal:** Connect all pages with routing, auth, and final configuration.

```
All Pages ──> 016 Wire Up Routing
                    │
006 Auth Store ─────┼──> 017 Add Auth Middleware
                    │
017 Auth Middleware ┴──> 018 Final Config
```

**Outputs:**
- Route guards for protected pages
- Guest-only middleware for auth pages
- Complete nuxt.config.ts
- Environment example file

## Expected Output Tree

```
taskflow/
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── app.vue
│
├── assets/
│   └── css/
│       └── tokens.css
│
├── components/
│   ├── ui/
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Card.vue
│   │   ├── Badge.vue
│   │   ├── Avatar.vue
│   │   ├── Modal.vue
│   │   ├── Dropdown.vue
│   │   ├── Progress.vue
│   │   ├── Checkbox.vue
│   │   ├── Toggle.vue
│   │   ├── Select.vue
│   │   └── Skeleton.vue
│   │
│   ├── layout/
│   │   ├── Sidebar.vue
│   │   ├── Header.vue
│   │   └── MobileNav.vue
│   │
│   ├── landing/
│   │   ├── HeroSection.vue
│   │   ├── FeaturesSection.vue
│   │   ├── PricingSection.vue
│   │   └── CTASection.vue
│   │
│   ├── dashboard/
│   │   ├── TodaysTasks.vue
│   │   ├── OverdueTasks.vue
│   │   └── RecentProjects.vue
│   │
│   └── projects/
│       ├── ProjectCard.vue
│       ├── CreateProjectModal.vue
│       └── TaskList.vue
│
├── composables/
│   ├── useAuth.ts
│   └── useFirestore.ts
│
├── layouts/
│   └── default.vue
│
├── lib/
│   └── firebase.ts
│
├── middleware/
│   ├── auth.ts
│   └── guest.ts
│
├── pages/
│   ├── index.vue
│   ├── login.vue
│   ├── signup.vue
│   ├── dashboard.vue
│   │
│   ├── onboarding/
│   │   ├── index.vue
│   │   ├── profile.vue
│   │   ├── workspace.vue
│   │   └── complete.vue
│   │
│   ├── projects/
│   │   ├── index.vue
│   │   └── [id].vue
│   │
│   └── settings/
│       ├── index.vue
│       ├── profile.vue
│       └── notifications.vue
│
├── plugins/
│   └── router.ts
│
├── stores/
│   └── auth.ts
│
└── types/
    └── index.ts
```

## Success Criteria

- [ ] All 18 tasks completed
- [ ] TypeScript strict mode passes
- [ ] All pages match prototypes exactly
- [ ] Responsive 320px to 1920px
- [ ] Firebase Auth working (email/password)
- [ ] Firestore CRUD operations working
- [ ] Navigation between pages working
- [ ] Protected routes require auth
- [ ] Guest routes redirect if authenticated

## Estimated Effort

| Phase | Tasks | Est. Files |
|-------|-------|------------|
| Foundation | 7 | 10 |
| UI Components | 1 | 12 |
| Pages | 7 | 20 |
| Navigation | 1 | 3 |
| Wiring | 3 | 5 |
| **Total** | **18** | **~50** |
