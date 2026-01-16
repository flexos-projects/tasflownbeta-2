# /prototype - TaskFlow Prototype Builder

Build interactive HTML prototypes for TaskFlow pages.

---

## Before You Start

**Read these files** (mandatory):
1. `.flexos/prototype/patterns/decisions.md` - Design philosophy & rules
2. `.flexos/prototype/patterns/components.md` - Available CSS classes
3. `.flexos/prototype/patterns/layouts.md` - Page structure patterns

**Skim for reference**:
4. `.flexos/docs/core/006-design.md` - Full design spec
5. `.flexos/prototype/shared/mockdb-data.json` - Test data schema

---

## Prototype Structure

Every prototype follows this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] - TaskFlow</title>

  <!-- Design Tokens & Components (ALWAYS include) -->
  <link rel="stylesheet" href="shared/tokens.css">
  <link rel="stylesheet" href="shared/components.css">

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

  <!-- Page-specific styles (keep minimal) -->
  <style>
    /* Only styles that don't exist in components.css */
  </style>
</head>
<body>

  <div id="app">
    <!-- Page content here -->
  </div>

  <!-- Mock Data -->
  <script src="shared/mockdb-data.json"></script>

  <!-- Vue 3 CDN -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

  <script>
    // Initialize Lucide icons
    lucide.createIcons();

    // Vue app
    const { createApp, ref, computed, onMounted } = Vue;

    createApp({
      setup() {
        // State
        const tasks = ref([]);
        const projects = ref([]);

        // Load mock data
        onMounted(() => {
          // Use data from mockdb-data.json
        });

        return {
          tasks,
          projects
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
```

---

## CSS Rules

### DO: Use Existing Classes

```html
<!-- Buttons -->
<button class="btn btn-primary">Save</button>
<button class="btn btn-secondary btn-sm">Cancel</button>
<button class="btn btn-ghost btn-icon"><i data-lucide="x"></i></button>

<!-- Cards -->
<div class="card card-hover">
  <div class="card-body">Content</div>
</div>

<!-- Navigation -->
<nav class="nav nav-vertical">
  <a href="#" class="nav-item active">
    <i data-lucide="home" class="nav-item-icon"></i>
    Dashboard
  </a>
</nav>

<!-- Sidebar -->
<aside class="sidebar">
  <div class="sidebar-header">...</div>
  <nav class="sidebar-nav">...</nav>
  <div class="sidebar-footer">...</div>
</aside>
```

### DON'T: Invent New Classes

```html
<!-- WRONG: Making up classes -->
<button class="my-button primary-action">Save</button>
<div class="app-sidebar custom-nav">...</div>

<!-- RIGHT: Use existing classes -->
<button class="btn btn-primary">Save</button>
<aside class="sidebar">...</aside>
```

### Inline Styles: Only For Dynamic Values

```html
<!-- OK: Dynamic values from data -->
<div class="progress">
  <div class="progress-bar" :style="{ width: progress + '%' }"></div>
</div>

<!-- OK: Project accent color -->
<div class="card card-accent" :style="{ '--accent-color': project.color }"></div>

<!-- NOT OK: Layout/component styling -->
<div style="display: flex; gap: 16px; padding: 24px;">...</div>
```

---

## Icons

Use Lucide icons via the `data-lucide` attribute:

```html
<i data-lucide="home"></i>
<i data-lucide="folder"></i>
<i data-lucide="check-circle"></i>
<i data-lucide="plus"></i>
<i data-lucide="more-horizontal"></i>
<i data-lucide="search"></i>
<i data-lucide="settings"></i>
<i data-lucide="bell"></i>
<i data-lucide="calendar"></i>
<i data-lucide="clock"></i>
<i data-lucide="user"></i>
<i data-lucide="trash-2"></i>
<i data-lucide="edit-2"></i>
<i data-lucide="x"></i>
```

After Vue mounts, call `lucide.createIcons()` to render them.

---

## Vue Patterns

### State Management

```javascript
setup() {
  // Simple state
  const isLoading = ref(true);
  const tasks = ref([]);
  const selectedTask = ref(null);

  // Computed
  const completedTasks = computed(() =>
    tasks.value.filter(t => t.done)
  );

  const progress = computed(() =>
    tasks.value.length ?
      (completedTasks.value.length / tasks.value.length) * 100 :
      0
  );

  return { isLoading, tasks, selectedTask, completedTasks, progress };
}
```

### Event Handlers

```javascript
// Toggle task
const toggleTask = (task) => {
  task.done = !task.done;
};

// Open modal
const showModal = ref(false);
const openModal = () => { showModal.value = true; };
const closeModal = () => { showModal.value = false; };

// Delete with confirmation
const deleteTask = (task) => {
  if (confirm(`Delete "${task.title}"?`)) {
    tasks.value = tasks.value.filter(t => t.id !== task.id);
  }
};
```

### Conditional Classes

```html
<div :class="['nav-item', { active: isActive }]">...</div>

<button :class="['btn', loading ? 'btn-loading' : 'btn-primary']">
  Save
</button>

<span :class="[
  'badge',
  task.done ? 'badge-success' : 'badge-warning'
]">
  {{ task.done ? 'Complete' : 'In Progress' }}
</span>
```

---

## Common Layouts

### App Shell (Dashboard, Projects, etc.)

```html
<div class="app-shell">
  <aside class="sidebar">
    <!-- Sidebar content -->
  </aside>
  <main class="app-content">
    <header class="page-header">
      <div>
        <h1 class="page-title">Page Title</h1>
        <p class="page-subtitle">Subtitle text</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary">Action</button>
      </div>
    </header>
    <!-- Page content -->
  </main>
</div>
```

### Centered Content (Landing, Auth)

```html
<div class="page-centered">
  <nav class="navbar">...</nav>
  <main class="container">
    <div class="content-narrow">
      <!-- Centered content -->
    </div>
  </main>
</div>
```

---

## Output Location

Save prototypes to:
```
.flexos/prototype/
├── shared/
│   ├── tokens.css
│   ├── components.css
│   └── mockdb-data.json
├── 001-landing.html
├── 002-dashboard.html
├── 003-projects.html
└── ...
```

Use numbered prefixes matching spec numbers where applicable.

---

## Checklist Before Submitting

- [ ] Links tokens.css and components.css
- [ ] Uses existing CSS classes (not custom)
- [ ] Uses Lucide icons (not emoji)
- [ ] Vue 3 for interactivity
- [ ] Responsive (test at 375px, 768px, 1024px)
- [ ] Touch targets 44px+ on interactive elements
- [ ] Empty states handled
- [ ] Loading states shown
- [ ] No hardcoded colors/spacing (use tokens)

---

## Remember

- **Prototypes are disposable** - Don't be precious
- **Use existing classes** - Check components.md first
- **Keep inline styles minimal** - Only for dynamic values
- **Test on mobile** - Thumb-first design
- **Show, don't tell** - Make it clickable

*When in doubt, read the patterns docs.*
