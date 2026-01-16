---
type: analysis
title: Component Mapping
status: complete
---

# Component Mapping: Prototype → Production

Maps prototype HTML patterns to Vue 3 production components.

## UI Components (12)

| Prototype Pattern | Production Component | Props |
|-------------------|---------------------|-------|
| `.btn` | `Button.vue` | variant, size, disabled, loading |
| `.input` | `Input.vue` | type, placeholder, error, disabled |
| `.card` | `Card.vue` | variant, hover, padding |
| `.badge` | `Badge.vue` | variant, size |
| `.avatar` | `Avatar.vue` | src, name, size |
| `.modal` | `Modal.vue` | open, title, size |
| `.dropdown` | `Dropdown.vue` | items, placement |
| `.progress` | `Progress.vue` | value, max, variant |
| `.checkbox` | `Checkbox.vue` | checked, indeterminate, disabled |
| `.toggle` | `Toggle.vue` | checked, disabled |
| `.select` | `Select.vue` | options, value, placeholder |
| `.skeleton` | `Skeleton.vue` | variant (text, avatar, card) |

## Layout Components (3)

| Prototype Pattern | Production Component | Props |
|-------------------|---------------------|-------|
| `.sidebar` | `Sidebar.vue` | collapsed |
| `.header` | `Header.vue` | title, breadcrumb |
| `.bottom-nav` | `BottomNav.vue` | items |

## Page-Specific Components

### Landing Page
| Section | Component | Notes |
|---------|-----------|-------|
| Hero | `HeroSection.vue` | CTA buttons, headline |
| Features | `FeaturesSection.vue` | 3-column grid |
| Pricing | `PricingSection.vue` | 3 tier cards |
| CTA | `CTASection.vue` | Final conversion |

### Dashboard
| Section | Component | Notes |
|---------|-----------|-------|
| Today's Tasks | `TodaysTasks.vue` | Filterable list |
| Overdue | `OverdueTasks.vue` | Warning styling |
| Recent Projects | `RecentProjects.vue` | Card grid |

### Projects
| Element | Component | Notes |
|---------|-----------|-------|
| Project Card | `ProjectCard.vue` | Color, progress, tasks |
| Create Modal | `CreateProjectModal.vue` | Form in modal |
| Task List | `TaskList.vue` | Sortable, checkable |
| Task Item | `TaskItem.vue` | Checkbox, due date |

## CSS Class → Tailwind Mapping

```
Prototype Token         → Tailwind Class
------------------------------------------
.text-primary          → text-blue-600 dark:text-blue-400
.text-secondary        → text-gray-600 dark:text-gray-400
.text-muted            → text-gray-500 dark:text-gray-500
.bg-surface            → bg-white dark:bg-gray-900
.bg-surface-elevated   → bg-white dark:bg-gray-800
.border-subtle         → border-gray-200 dark:border-gray-700
.rounded-md            → rounded-lg
.rounded-lg            → rounded-xl
.shadow-sm             → shadow-sm
.shadow-md             → shadow-md
```

## State Mappings

| Prototype State | Vue Implementation |
|-----------------|-------------------|
| `.is-loading` | `:class="{ 'opacity-50': loading }"` + Spinner |
| `.is-disabled` | `:disabled="disabled"` |
| `.is-active` | `:class="{ 'bg-blue-50': active }"` |
| `.is-error` | `:class="{ 'border-red-500': error }"` |
| `.is-success` | `:class="{ 'border-green-500': success }"` |

## Responsive Breakpoints

| Prototype | Tailwind | Viewport |
|-----------|----------|----------|
| `@mobile` | Default | < 768px |
| `@tablet` | `md:` | 768px+ |
| `@desktop` | `lg:` | 1024px+ |
| `@wide` | `xl:` | 1280px+ |

## Animation Mappings

| Prototype | Tailwind/CSS |
|-----------|--------------|
| `.fade-in` | `animate-fade-in` (custom) |
| `.slide-up` | `animate-slide-up` (custom) |
| `.transition-base` | `transition-all duration-200` |
| `.transition-fast` | `transition-all duration-150` |

## Icon Mappings

All icons use Lucide. Prototype uses SVG directly, production uses:

```vue
<LucideIcon name="check" :size="20" />
```

Common icons:
- `check` - Checkboxes, success
- `x` - Close, cancel
- `plus` - Add items
- `chevron-down` - Dropdowns
- `chevron-right` - Navigation
- `home` - Dashboard nav
- `folder` - Projects nav
- `settings` - Settings nav
- `bell` - Notifications
- `user` - Profile
