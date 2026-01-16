# TaskFlow Layout Patterns

This document describes page structures, layout patterns, and responsive behavior for TaskFlow prototypes.

---

## Page Types

TaskFlow has three types of pages:

### 1. Public Pages (Marketing/Auth)
No sidebar, centered content, full-width hero sections.

- Landing page
- Login/Register
- Pricing
- About

### 2. App Pages (Authenticated)
Sidebar navigation, content area, optional right panel.

- Dashboard
- Project list/detail
- Task views
- Settings

### 3. Focus Pages
Minimal UI, single task focus.

- Task creation wizard
- Onboarding flow
- Empty project state

---

## Layout Tokens

Use these CSS variables for consistent sizing:

| Token | Value | Use For |
|-------|-------|---------|
| `--sidebar-width` | 280px | Sidebar width |
| `--sidebar-collapsed-width` | 64px | Collapsed sidebar |
| `--header-height` | 64px | Top header/navbar |
| `--container-max` | 1280px | Max content width |
| `--content-max-width` | 1024px | Readable content width |

---

## App Shell (Sidebar Layout)

The standard authenticated layout:

```
┌──────────────────────────────────────────────────────────┐
│                    Browser Window                         │
├──────────┬───────────────────────────────────────────────┤
│          │                                               │
│          │                                               │
│ Sidebar  │              Content Area                     │
│  280px   │           (flex: 1, scrollable)               │
│          │                                               │
│          │                                               │
│          │                                               │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

### HTML Structure

```html
<div class="app-shell">
  <aside class="sidebar">
    <!-- Sidebar content -->
  </aside>
  <main class="app-content">
    <!-- Page content -->
  </main>
</div>

<style>
.app-shell {
  display: flex;
  min-height: 100dvh;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}
</style>
```

### Mobile Behavior
On mobile (< 768px):
- Sidebar is hidden by default
- Hamburger menu reveals sidebar as overlay
- Content takes full width

```html
<!-- Mobile: sidebar hidden, show with .open -->
<aside class="sidebar mobile-sidebar">...</aside>

<style>
@media (max-width: 767px) {
  .mobile-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: var(--z-modal);
    transform: translateX(-100%);
    transition: transform var(--duration-200) var(--ease-out);
  }

  .mobile-sidebar.open {
    transform: translateX(0);
  }
}
</style>
```

---

## Content Patterns

### Centered Content (Public Pages)

```
┌──────────────────────────────────────────────────────────┐
│                        Navbar                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│        ┌────────────────────────────────────┐            │
│        │                                    │            │
│        │      Centered Content              │            │
│        │        max-width: 1024px           │            │
│        │                                    │            │
│        └────────────────────────────────────┘            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

```html
<div class="page-centered">
  <div class="container">
    <div class="content-narrow">
      <!-- Content here -->
    </div>
  </div>
</div>

<style>
.content-narrow {
  max-width: var(--content-max-width);
  margin: 0 auto;
}
</style>
```

### Split View (Detail Pages)

```
┌──────────┬───────────────────────────────────┬───────────┐
│          │                                   │           │
│          │                                   │  Detail   │
│ Sidebar  │           Main Content            │  Panel    │
│          │                                   │  320px    │
│          │                                   │           │
└──────────┴───────────────────────────────────┴───────────┘
```

```html
<div class="app-shell">
  <aside class="sidebar">...</aside>
  <main class="app-content">
    <div class="split-view">
      <div class="split-main">
        <!-- Main content -->
      </div>
      <aside class="split-panel">
        <!-- Detail panel -->
      </aside>
    </div>
  </main>
</div>

<style>
.split-view {
  display: flex;
  gap: var(--space-6);
  height: 100%;
}

.split-main {
  flex: 1;
  min-width: 0; /* Prevent flex overflow */
}

.split-panel {
  width: 320px;
  flex-shrink: 0;
  border-left: 1px solid var(--color-border);
  padding-left: var(--space-6);
}

@media (max-width: 1023px) {
  .split-panel {
    display: none; /* Or convert to modal on mobile */
  }
}
</style>
```

---

## Page Headers

### Standard Page Header

```
┌──────────────────────────────────────────────────────────┐
│  Page Title                              [ Actions ]      │
│  Subtitle or breadcrumb                                  │
├──────────────────────────────────────────────────────────┤
```

```html
<header class="page-header">
  <div class="page-header-content">
    <h1 class="page-title">Dashboard</h1>
    <p class="page-subtitle">Welcome back, John</p>
  </div>
  <div class="page-header-actions">
    <button class="btn btn-primary">New Task</button>
  </div>
</header>

<style>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  margin: 0;
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.page-header-actions {
  flex-shrink: 0;
}

@media (max-width: 639px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header-actions {
    margin-top: var(--space-4);
  }
}
</style>
```

---

## Card Grids

### Standard Grid (Projects, Tasks)

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│              │ │              │ │              │
│    Card 1    │ │    Card 2    │ │    Card 3    │
│              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│              │ │              │
│    Card 4    │ │    Card 5    │
│              │ │              │
└──────────────┘ └──────────────┘
```

```html
<div class="card-grid">
  <div class="card card-hover">...</div>
  <div class="card card-hover">...</div>
  <div class="card card-hover">...</div>
</div>

<style>
.card-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
```

---

## List Views

### Task List

```
┌──────────────────────────────────────────────────────────┐
│ ☐  Task title                          Due: Jan 15   ... │
├──────────────────────────────────────────────────────────┤
│ ☐  Another task                        Due: Jan 16   ... │
├──────────────────────────────────────────────────────────┤
│ ☑  Completed task                      Done          ... │
└──────────────────────────────────────────────────────────┘
```

```html
<div class="task-list">
  <div class="task-item">
    <input type="checkbox" class="checkbox">
    <div class="task-content">
      <span class="task-title">Task title</span>
      <span class="task-meta">Due: Jan 15</span>
    </div>
    <button class="btn btn-ghost btn-icon btn-sm">
      <i data-lucide="more-horizontal"></i>
    </button>
  </div>
</div>

<style>
.task-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.task-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--duration-150);
}

.task-item:last-child {
  border-bottom: none;
}

.task-item:hover {
  background-color: var(--color-surface-hover);
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.task-meta {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-0-5);
}
</style>
```

---

## Responsive Breakpoints

| Breakpoint | Min Width | Typical Device |
|------------|-----------|----------------|
| (default) | 0px | Mobile phones |
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Laptops, desktops |
| `2xl` | 1536px | Large desktops |

### Media Query Pattern

Always mobile-first:

```css
/* Mobile (default) */
.element { padding: var(--space-4); }

/* Tablet+ */
@media (min-width: 768px) {
  .element { padding: var(--space-6); }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .element { padding: var(--space-8); }
}
```

---

## Spacing Rhythm

Consistent vertical spacing creates visual rhythm:

| Context | Spacing |
|---------|---------|
| Inside components | 8-16px |
| Between related items | 16px |
| Between groups | 24px |
| Between sections | 32-48px |
| Page padding | 24px (mobile), 32px (tablet), 48px (desktop) |

### Section Spacing

```html
<section class="section">
  <h2 class="section-title">Recent Projects</h2>
  <div class="card-grid">...</div>
</section>

<section class="section">
  <h2 class="section-title">Tasks Due Today</h2>
  <div class="task-list">...</div>
</section>

<style>
.section {
  margin-bottom: var(--space-8);
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-4);
}
</style>
```

---

## Common Layout CSS

Copy this into prototypes that need app layouts:

```css
/* App Shell */
.app-shell {
  display: flex;
  min-height: 100dvh;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
  background-color: var(--color-background);
}

/* Page Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

/* Card Grid */
.card-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 640px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Section */
.section {
  margin-bottom: var(--space-8);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-4);
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .app-content {
    padding: var(--space-4);
  }

  .page-header {
    flex-direction: column;
  }
}
```

---

## Empty States

Every list/grid should handle empty state:

```html
<div class="card-grid">
  <!-- If no items -->
  <div class="empty-state">
    <div class="empty-state-icon">
      <i data-lucide="folder"></i>
    </div>
    <h3 class="empty-state-title">No projects yet</h3>
    <p class="empty-state-description">
      Create your first project to get started organizing your tasks.
    </p>
    <button class="btn btn-primary">Create Project</button>
  </div>
</div>
```

---

## Skeleton Loading

Show skeletons while content loads:

```html
<!-- Card skeleton -->
<div class="card">
  <div class="card-body">
    <div class="skeleton skeleton-text" style="width: 60%"></div>
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text" style="width: 80%"></div>
  </div>
</div>

<!-- List item skeleton -->
<div class="task-item">
  <div class="skeleton" style="width: 18px; height: 18px; border-radius: 4px;"></div>
  <div class="flex-1">
    <div class="skeleton skeleton-text" style="width: 70%"></div>
    <div class="skeleton skeleton-text" style="width: 40%; margin-top: 4px;"></div>
  </div>
</div>
```

---

*When building a new page, start with these patterns. Only deviate when you have a specific reason.*
