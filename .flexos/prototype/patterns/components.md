# TaskFlow Component Reference

Quick reference for available CSS classes in prototypes. Use these instead of writing custom styles.

---

## Buttons

### Base Class
Always start with `.btn`, then add a variant.

```html
<button class="btn btn-primary">Primary Action</button>
```

### Variants

| Class | Use For |
|-------|---------|
| `.btn-primary` | Main actions (Save, Submit, Create) |
| `.btn-secondary` | Secondary actions (Cancel, Back) |
| `.btn-ghost` | Tertiary actions, toolbar buttons |
| `.btn-danger` | Destructive actions (Delete, Remove) |
| `.btn-success` | Positive confirmations |
| `.btn-link` | Text links that look like buttons |

### Sizes

| Class | Size |
|-------|------|
| `.btn-xs` | Extra small (inline, tags) |
| `.btn-sm` | Small (compact UI) |
| (default) | Medium (standard) |
| `.btn-lg` | Large (forms, CTAs) |
| `.btn-xl` | Extra large (hero sections) |

### Modifiers

| Class | Effect |
|-------|--------|
| `.btn-icon` | Square button for icon-only (36x36px) |
| `.btn-block` | Full width button |
| `.btn-loading` | Shows spinner, hides text |

### Examples

```html
<!-- Standard primary button -->
<button class="btn btn-primary">Save Changes</button>

<!-- Small secondary button -->
<button class="btn btn-secondary btn-sm">Cancel</button>

<!-- Icon-only ghost button -->
<button class="btn btn-ghost btn-icon">
  <i data-lucide="x"></i>
</button>

<!-- Full-width button in form -->
<button class="btn btn-primary btn-block btn-lg">Create Account</button>

<!-- Loading state -->
<button class="btn btn-primary btn-loading" disabled>Saving...</button>
```

---

## Form Inputs

### Text Inputs

| Class | Use For |
|-------|---------|
| `.input` | Standard text input |
| `.input-sm` | Compact input |
| `.input-lg` | Large input (forms) |
| `.input-error` | Input with validation error |

```html
<input type="text" class="input" placeholder="Enter task name">
<input type="email" class="input input-error" value="invalid">
```

### Textarea

```html
<textarea class="textarea" placeholder="Description"></textarea>
```

### Select

```html
<select class="select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Checkbox & Toggle

```html
<!-- Checkbox -->
<input type="checkbox" class="checkbox">

<!-- Toggle switch -->
<input type="checkbox" class="toggle">
```

### Form Structure

| Class | Use For |
|-------|---------|
| `.form-group` | Wrapper for label + input + hint/error |
| `.form-label` | Input label |
| `.form-hint` | Helper text below input |
| `.form-error` | Error message below input |

```html
<div class="form-group">
  <label class="form-label">Task Name</label>
  <input type="text" class="input" placeholder="Enter task name">
  <span class="form-hint">Keep it short and clear</span>
</div>

<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="input input-error" value="invalid@">
  <span class="form-error">Please enter a valid email</span>
</div>
```

---

## Cards

### Base Structure

```html
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content</div>
  <div class="card-footer">Actions</div>
</div>
```

### Variants

| Class | Effect |
|-------|--------|
| `.card` | Base card (white, bordered) |
| `.card-hover` | Adds hover shadow |
| `.card-clickable` | Adds pointer cursor |
| `.card-accent` | Adds left color accent |

### Card Parts (all optional)

| Class | Use For |
|-------|---------|
| `.card-header` | Top section with title |
| `.card-body` | Main content area |
| `.card-footer` | Bottom section for actions |

### Examples

```html
<!-- Simple card -->
<div class="card">
  <div class="card-body">
    <h3>Card Title</h3>
    <p>Card content goes here.</p>
  </div>
</div>

<!-- Clickable card with hover -->
<div class="card card-hover card-clickable">
  <div class="card-body">Click me</div>
</div>

<!-- Card with accent (set --accent-color for custom) -->
<div class="card card-accent" style="--accent-color: var(--color-project-blue)">
  <div class="card-body">Project card</div>
</div>
```

---

## Navigation

### Horizontal Nav

```html
<nav class="nav">
  <a href="#" class="nav-item active">Dashboard</a>
  <a href="#" class="nav-item">Projects</a>
  <a href="#" class="nav-item">Settings</a>
</nav>
```

### Vertical Nav (for sidebars)

```html
<nav class="nav nav-vertical">
  <a href="#" class="nav-item active">
    <i data-lucide="home" class="nav-item-icon"></i>
    Dashboard
  </a>
  <a href="#" class="nav-item">
    <i data-lucide="folder" class="nav-item-icon"></i>
    Projects
  </a>
</nav>
```

### Nav Classes

| Class | Use For |
|-------|---------|
| `.nav` | Nav container |
| `.nav-vertical` | Vertical layout (add to .nav) |
| `.nav-item` | Individual nav link |
| `.nav-item.active` | Current/selected item |
| `.nav-item-icon` | Icon inside nav item |

---

## Sidebar

### Full Structure

```html
<aside class="sidebar">
  <div class="sidebar-header">
    <!-- Logo/title -->
  </div>
  <nav class="sidebar-nav">
    <!-- Navigation items -->
  </nav>
  <div class="sidebar-footer">
    <!-- User info/settings -->
  </div>
</aside>
```

### Sidebar Parts

| Class | Use For |
|-------|---------|
| `.sidebar` | Main container (280px width) |
| `.sidebar-header` | Top section (logo/title) |
| `.sidebar-nav` | Scrollable navigation area |
| `.sidebar-section` | Group of nav items |
| `.sidebar-section-title` | Section heading (uppercase) |
| `.sidebar-footer` | Bottom section (user info) |

### Example

```html
<aside class="sidebar">
  <div class="sidebar-header">
    <span class="text-lg font-semibold">TaskFlow</span>
  </div>

  <nav class="sidebar-nav">
    <div class="sidebar-section">
      <div class="sidebar-section-title">Main</div>
      <div class="nav nav-vertical">
        <a href="#" class="nav-item active">
          <i data-lucide="home" class="nav-item-icon"></i>
          Dashboard
        </a>
      </div>
    </div>
  </nav>

  <div class="sidebar-footer">
    <div class="flex items-center gap-3">
      <div class="avatar avatar-sm">JD</div>
      <span class="text-sm">John Doe</span>
    </div>
  </div>
</aside>
```

---

## Avatars

### Sizes

| Class | Size |
|-------|------|
| `.avatar-xs` | 24px |
| `.avatar-sm` | 32px |
| `.avatar` | 40px (default) |
| `.avatar-lg` | 48px |
| `.avatar-xl` | 64px |
| `.avatar-2xl` | 96px |

### Examples

```html
<!-- With initials -->
<div class="avatar">JD</div>

<!-- With image -->
<div class="avatar">
  <img src="user.jpg" alt="John Doe">
</div>

<!-- Different sizes -->
<div class="avatar avatar-sm">JD</div>
<div class="avatar avatar-lg">JD</div>

<!-- Avatar group (stacked) -->
<div class="avatar-group">
  <div class="avatar avatar-sm">JD</div>
  <div class="avatar avatar-sm">AS</div>
  <div class="avatar avatar-sm">+3</div>
</div>
```

---

## Badges & Tags

### Badges (rounded pills)

| Class | Color |
|-------|-------|
| `.badge` | Gray (default) |
| `.badge-primary` | Blue |
| `.badge-success` | Green |
| `.badge-warning` | Amber |
| `.badge-error` | Red |
| `.badge-info` | Sky blue |

```html
<span class="badge">Default</span>
<span class="badge badge-success">Complete</span>
<span class="badge badge-warning">Due Soon</span>
<span class="badge badge-error">Overdue</span>

<!-- Badge with dot indicator -->
<span class="badge badge-dot badge-success">Active</span>
```

### Tags (less rounded)

```html
<span class="tag">Design</span>
<span class="tag tag-removable">
  Development
  <button class="tag-remove">&times;</button>
</span>
```

---

## Modals

### Structure

```html
<div class="modal-backdrop open">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Modal Title</h2>
      <button class="modal-close">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="modal-body">
      <!-- Content -->
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Modal Sizes

| Class | Max Width |
|-------|-----------|
| `.modal-sm` | 400px |
| (default) | 500px |
| `.modal-lg` | 700px |
| `.modal-xl` | 900px |
| `.modal-full` | 100vw - 32px |

### Visibility

- Add `.open` to `.modal-backdrop` to show
- Remove `.open` to hide

---

## Dropdowns

### Structure

```html
<div class="dropdown open">
  <button class="btn btn-secondary">Options</button>
  <div class="dropdown-menu">
    <button class="dropdown-item">Edit</button>
    <button class="dropdown-item">Duplicate</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item dropdown-item-danger">Delete</button>
  </div>
</div>
```

### Classes

| Class | Use For |
|-------|---------|
| `.dropdown` | Container |
| `.dropdown-menu` | Menu panel |
| `.dropdown-menu-right` | Right-aligned menu |
| `.dropdown-item` | Menu item |
| `.dropdown-item-danger` | Destructive item (red) |
| `.dropdown-divider` | Horizontal separator |

### Visibility

- Add `.open` to `.dropdown` to show menu
- Remove `.open` to hide

---

## Tables

```html
<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Status</th>
      <th>Due Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Task 1</td>
      <td><span class="badge badge-success">Done</span></td>
      <td>Jan 15</td>
    </tr>
  </tbody>
</table>
```

### Variants

| Class | Effect |
|-------|--------|
| `.table` | Base table |
| `.table-striped` | Alternating row colors |

---

## Empty States

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <i data-lucide="inbox"></i>
  </div>
  <h3 class="empty-state-title">No tasks yet</h3>
  <p class="empty-state-description">
    Create your first task to get started.
  </p>
  <button class="btn btn-primary">Create Task</button>
</div>
```

---

## Progress & Loading

### Progress Bar

```html
<div class="progress">
  <div class="progress-bar" style="width: 60%"></div>
</div>

<!-- Sizes -->
<div class="progress progress-sm">...</div>
<div class="progress progress-lg">...</div>
```

### Skeleton Loader

```html
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text" style="width: 70%"></div>

<div class="skeleton skeleton-avatar"></div>
<div class="skeleton skeleton-button"></div>
```

---

## Utility Classes

### Flex

| Class | Effect |
|-------|--------|
| `.flex` | `display: flex` |
| `.flex-col` | `flex-direction: column` |
| `.items-center` | `align-items: center` |
| `.items-start` | `align-items: flex-start` |
| `.justify-between` | `justify-content: space-between` |
| `.justify-center` | `justify-content: center` |
| `.flex-1` | `flex: 1` |
| `.flex-shrink-0` | `flex-shrink: 0` |

### Gap

| Class | Size |
|-------|------|
| `.gap-1` | 4px |
| `.gap-2` | 8px |
| `.gap-3` | 12px |
| `.gap-4` | 16px |
| `.gap-6` | 24px |
| `.gap-8` | 32px |

### Padding

| Class | Size |
|-------|------|
| `.p-0` through `.p-8` | 0 to 32px |

### Width

| Class | Effect |
|-------|--------|
| `.w-full` | 100% width |
| `.max-w-xs` through `.max-w-xl` | Max width constraints |

### Text

| Class | Effect |
|-------|--------|
| `.text-xs` through `.text-5xl` | Font sizes |
| `.font-medium` | 500 weight |
| `.font-semibold` | 600 weight |
| `.font-bold` | 700 weight |
| `.text-muted` | Gray-500 color |
| `.text-secondary` | Gray-600 color |
| `.truncate` | Ellipsis overflow |
| `.text-center` | Center aligned |

### Display

| Class | Effect |
|-------|--------|
| `.hidden` | `display: none` |
| `.block` | `display: block` |
| `.inline-flex` | `display: inline-flex` |
| `.grid` | `display: grid` |

### Grid

| Class | Effect |
|-------|--------|
| `.grid-cols-2` | 2-column grid |
| `.grid-cols-3` | 3-column grid |
| `.grid-cols-4` | 4-column grid |

### Other

| Class | Effect |
|-------|--------|
| `.divider` | Horizontal line separator |
| `.sr-only` | Screen reader only |
| `.rounded-lg` | 8px border radius |
| `.shadow-lg` | Large shadow |
| `.border` | 1px border |
| `.overflow-y-auto` | Vertical scroll |

---

## Responsive Prefixes

Available for some utilities:

| Prefix | Min Width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |

```html
<!-- Hidden on mobile, flex on medium+ -->
<div class="hidden md:flex">Desktop nav</div>

<!-- Full width on mobile, 3 cols on large -->
<div class="grid grid-cols-1 lg:grid-cols-3">...</div>
```

---

*When a component you need isn't here, check if you can compose it from existing classes. Only write custom CSS as a last resort.*
