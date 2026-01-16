---
id: 005-create-ui-components
sequence: 5
status: pending
dependsOn: ["003", "004"]

inputs:
  components: ../../prototype/shared/components.css
  patterns: ../../prototype/patterns/components.md
  docs:
    - ../docs/001-nuxt3.md

expectedOutput:
  - src/components/ui/Button.vue
  - src/components/ui/Input.vue
  - src/components/ui/Card.vue
  - src/components/ui/Badge.vue
  - src/components/ui/Avatar.vue
  - src/components/ui/Modal.vue
  - src/components/ui/Dropdown.vue
  - src/components/ui/Progress.vue
  - src/components/ui/Checkbox.vue
  - src/components/ui/Toggle.vue
  - src/components/ui/Select.vue
  - src/components/ui/Skeleton.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Create UI Components

## Objective

Create reusable UI components matching the prototype component styles.

## Reference Files

- `prototype/shared/components.css` - CSS classes to match
- `prototype/patterns/components.md` - Component documentation

## Components (12)

### 1. Button.vue

```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  loading: false,
  disabled: false,
  icon: false
})
</script>

<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      {
        'btn-block': block,
        'btn-loading': loading,
        'btn-icon': icon
      }
    ]"
    :disabled="disabled || loading"
  >
    <slot />
  </button>
</template>
```

### 2. Input.vue

```vue
<script setup lang="ts">
interface Props {
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'search'
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="['input', `input-${size}`, { 'input-error': error }]"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>
```

### 3-12. Other Components

Create similar components for:
- **Card**: `.card`, `.card-header`, `.card-body`, `.card-footer`
- **Badge**: `.badge`, `.badge-success`, `.badge-warning`, `.badge-error`
- **Avatar**: `.avatar`, sizes xs-2xl
- **Modal**: `.modal-backdrop`, `.modal`, `.modal-header`, `.modal-body`, `.modal-footer`
- **Dropdown**: `.dropdown`, `.dropdown-menu`, `.dropdown-item`
- **Progress**: `.progress`, `.progress-bar`
- **Checkbox**: `.checkbox`
- **Toggle**: `.toggle`
- **Select**: `.select`
- **Skeleton**: `.skeleton`, `.skeleton-text`

## Component Props Pattern

Each component should have:
- TypeScript interface for props
- Default values via withDefaults
- Emit types for events
- CSS class mapping from props

## Acceptance Criteria

- [ ] All 12 components created
- [ ] Props match prototype CSS classes
- [ ] TypeScript strict mode passes
- [ ] Components use design tokens
- [ ] All variants working
- [ ] All sizes working
