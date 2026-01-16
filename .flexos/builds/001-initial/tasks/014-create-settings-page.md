---
id: 014-create-settings-page
sequence: 14
status: pending
dependsOn: ["005", "006"]

inputs:
  prototype: ../../prototype/004-settings.html
  spec: ../../specs/009-pages_settings.md

expectedOutput:
  - src/pages/settings/index.vue
  - src/pages/settings/profile.vue
  - src/pages/settings/notifications.vue
  - src/pages/settings/account.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Create Settings Page

## Objective

Create the settings pages matching `prototype/004-settings.html`.

## Files to Create

### 1. src/pages/settings/index.vue

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

// Redirect to profile on desktop, show menu on mobile
const { isMobile } = useDevice()

onMounted(() => {
  if (!isMobile.value) {
    navigateTo('/settings/profile', { replace: true })
  }
})
</script>

<template>
  <div class="settings-page">
    <header class="page-header">
      <h1 class="page-title">Settings</h1>
    </header>

    <nav class="settings-nav">
      <NuxtLink to="/settings/profile" class="settings-nav-item">
        <LucideUser class="w-5 h-5" />
        <span>Profile</span>
        <LucideChevronRight class="w-5 h-5 ml-auto" />
      </NuxtLink>

      <NuxtLink to="/settings/notifications" class="settings-nav-item">
        <LucideBell class="w-5 h-5" />
        <span>Notifications</span>
        <LucideChevronRight class="w-5 h-5 ml-auto" />
      </NuxtLink>

      <NuxtLink to="/settings/account" class="settings-nav-item">
        <LucideShield class="w-5 h-5" />
        <span>Account</span>
        <LucideChevronRight class="w-5 h-5 ml-auto" />
      </NuxtLink>

      <div class="settings-divider" />

      <button class="settings-nav-item danger" @click="logout">
        <LucideLogOut class="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.settings-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: inherit;
  text-decoration: none;
  transition: var(--transition-base);
}

.settings-nav-item:hover {
  border-color: var(--color-primary);
}

.settings-nav-item.danger {
  color: var(--color-danger);
}

.settings-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-4) 0;
}
</style>
```

### 2. src/pages/settings/profile.vue

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'Profile Settings - TaskFlow'
})

const authStore = useAuthStore()
const supabase = useSupabaseClient()
const toast = useToast()

const name = ref(authStore.profile?.name || '')
const email = ref(authStore.profile?.email || '')
const saving = ref(false)
const uploadingAvatar = ref(false)

const avatarUrl = computed(() => authStore.profile?.avatar_url)
const initials = computed(() => {
  const n = name.value || email.value || 'U'
  return n.charAt(0).toUpperCase()
})

const handleSave = async () => {
  saving.value = true

  try {
    await authStore.updateProfile({
      name: name.value.trim()
    })
    toast.success('Profile updated')
  } catch (e) {
    toast.error('Failed to update profile')
  } finally {
    saving.value = false
  }
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    toast.error('Image must be less than 2MB')
    return
  }

  uploadingAvatar.value = true

  try {
    const ext = file.name.split('.').pop()
    const path = `avatars/${authStore.user?.id}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    await authStore.updateProfile({ avatar_url: publicUrl })
    toast.success('Avatar updated')
  } catch (e) {
    toast.error('Failed to upload avatar')
  } finally {
    uploadingAvatar.value = false
  }
}

const handleRemoveAvatar = async () => {
  await authStore.updateProfile({ avatar_url: null })
  toast.success('Avatar removed')
}
</script>

<template>
  <div class="settings-section">
    <div class="settings-header">
      <NuxtLink to="/settings" class="back-link md:hidden">
        <LucideArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <h2 class="settings-title">Profile</h2>
    </div>

    <div class="settings-content">
      <!-- Avatar -->
      <div class="form-section">
        <label class="form-label">Profile Photo</label>
        <div class="avatar-section">
          <div class="avatar-preview">
            <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
            <span v-else class="avatar-initials">{{ initials }}</span>
          </div>
          <div class="avatar-actions">
            <label class="btn btn-secondary btn-sm">
              <span v-if="uploadingAvatar">Uploading...</span>
              <span v-else>Upload Photo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                class="hidden"
                :disabled="uploadingAvatar"
                @change="handleAvatarUpload"
              />
            </label>
            <button
              v-if="avatarUrl"
              class="btn btn-ghost btn-sm"
              @click="handleRemoveAvatar"
            >
              Remove
            </button>
          </div>
          <p class="form-help">JPG, PNG, or GIF. Max 2MB.</p>
        </div>
      </div>

      <div class="divider" />

      <!-- Name -->
      <div class="form-group">
        <label class="form-label" for="name">Full Name</label>
        <Input id="name" v-model="name" placeholder="Your name" />
      </div>

      <!-- Email (read-only for now) -->
      <div class="form-group">
        <label class="form-label" for="email">Email Address</label>
        <Input id="email" v-model="email" type="email" disabled />
        <p class="form-help">This is the email you use to log in.</p>
      </div>

      <div class="divider" />

      <!-- Save -->
      <div class="form-actions">
        <Button
          variant="primary"
          :loading="saving"
          @click="handleSave"
        >
          Save Changes
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-section {
  max-width: 600px;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.back-link {
  color: var(--color-text-muted);
}

.settings-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.settings-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.form-section {
  margin-bottom: var(--space-6);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.avatar-preview {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: white;
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
}

.avatar-actions {
  display: flex;
  gap: var(--space-2);
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-6) 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
```

### 3. src/pages/settings/notifications.vue

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'Notification Settings - TaskFlow'
})

const authStore = useAuthStore()
const toast = useToast()

// Preferences
const preferences = reactive({
  task_reminders: authStore.profile?.preferences?.task_reminders ?? true,
  task_assignments: authStore.profile?.preferences?.task_assignments ?? true,
  team_activity: authStore.profile?.preferences?.team_activity ?? true,
  task_completions: authStore.profile?.preferences?.task_completions ?? false,
  push_enabled: authStore.profile?.preferences?.push_enabled ?? false,
  weekly_digest: authStore.profile?.preferences?.weekly_digest ?? true
})

const updatePreference = async (key: string, value: boolean) => {
  try {
    await authStore.updateProfile({
      preferences: {
        ...authStore.profile?.preferences,
        [key]: value
      }
    })
    toast.success('Preference saved')
  } catch (e) {
    toast.error('Failed to save preference')
    // Revert
    preferences[key] = !value
  }
}

const togglePushNotifications = async (enabled: boolean) => {
  if (enabled) {
    // Request permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      toast.error('Push notifications permission denied')
      preferences.push_enabled = false
      return
    }
  }
  await updatePreference('push_enabled', enabled)
}
</script>

<template>
  <div class="settings-section">
    <div class="settings-header">
      <NuxtLink to="/settings" class="back-link md:hidden">
        <LucideArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <h2 class="settings-title">Notifications</h2>
    </div>

    <div class="settings-content">
      <!-- In-App -->
      <div class="pref-section">
        <h3 class="pref-section-title">In-App Notifications</h3>

        <div class="pref-item">
          <div class="pref-info">
            <span class="pref-label">Task reminders</span>
            <span class="pref-description">Get notified when tasks are due or overdue</span>
          </div>
          <Toggle
            v-model="preferences.task_reminders"
            @update:modelValue="updatePreference('task_reminders', $event)"
          />
        </div>

        <div class="pref-item">
          <div class="pref-info">
            <span class="pref-label">Task assignments</span>
            <span class="pref-description">Get notified when you're assigned to a task</span>
          </div>
          <Toggle
            v-model="preferences.task_assignments"
            @update:modelValue="updatePreference('task_assignments', $event)"
          />
        </div>

        <div class="pref-item">
          <div class="pref-info">
            <span class="pref-label">Team activity</span>
            <span class="pref-description">Get notified when team members join or leave projects</span>
          </div>
          <Toggle
            v-model="preferences.team_activity"
            @update:modelValue="updatePreference('team_activity', $event)"
          />
        </div>

        <div class="pref-item">
          <div class="pref-info">
            <span class="pref-label">Task completions</span>
            <span class="pref-description">Get notified when tasks you created are completed</span>
          </div>
          <Toggle
            v-model="preferences.task_completions"
            @update:modelValue="updatePreference('task_completions', $event)"
          />
        </div>
      </div>

      <div class="divider" />

      <!-- Push -->
      <div class="pref-section">
        <h3 class="pref-section-title">Push Notifications</h3>

        <div class="pref-item">
          <div class="pref-info">
            <span class="pref-label">Enable push notifications</span>
            <span class="pref-description">Receive notifications even when TaskFlow is closed</span>
          </div>
          <Toggle
            v-model="preferences.push_enabled"
            @update:modelValue="togglePushNotifications($event)"
          />
        </div>
      </div>

      <div class="divider" />

      <!-- Email -->
      <div class="pref-section">
        <h3 class="pref-section-title">Email Notifications</h3>

        <div class="pref-item">
          <div class="pref-info">
            <span class="pref-label">Weekly digest</span>
            <span class="pref-description">Receive a weekly summary of your tasks and activity</span>
          </div>
          <Toggle
            v-model="preferences.weekly_digest"
            @update:modelValue="updatePreference('weekly_digest', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-section {
  max-width: 600px;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.back-link {
  color: var(--color-text-muted);
}

.settings-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.settings-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.pref-section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-4);
}

.pref-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) 0;
}

.pref-item:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.pref-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.pref-label {
  font-weight: var(--font-medium);
}

.pref-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-6) 0;
}
</style>
```

### 4. src/pages/settings/account.vue

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'Account Settings - TaskFlow'
})

const authStore = useAuthStore()
const supabase = useSupabaseClient()
const toast = useToast()

// Password change
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})
const passwordErrors = ref<Record<string, string>>({})
const changingPassword = ref(false)

const passwordStrength = computed(() => {
  const password = passwordForm.value.new
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  return strength
})

const validatePassword = () => {
  passwordErrors.value = {}

  if (!passwordForm.value.current) {
    passwordErrors.value.current = 'Current password is required'
  }

  if (!passwordForm.value.new) {
    passwordErrors.value.new = 'New password is required'
  } else if (passwordForm.value.new.length < 8) {
    passwordErrors.value.new = 'Password must be at least 8 characters'
  }

  if (passwordForm.value.new !== passwordForm.value.confirm) {
    passwordErrors.value.confirm = "Passwords don't match"
  }

  return Object.keys(passwordErrors.value).length === 0
}

const handleChangePassword = async () => {
  if (!validatePassword()) return

  changingPassword.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.value.new
    })

    if (error) throw error

    toast.success('Password updated')
    passwordForm.value = { current: '', new: '', confirm: '' }
  } catch (e: any) {
    toast.error(e.message || 'Failed to update password')
  } finally {
    changingPassword.value = false
  }
}

// Delete account
const showDeleteModal = ref(false)
const deleteConfirmation = ref('')
const deleting = ref(false)

const handleDeleteAccount = async () => {
  if (deleteConfirmation.value !== 'DELETE') return

  deleting.value = true

  try {
    // This would call your backend API to delete the account
    // For now, just sign out
    await authStore.logout()
    await navigateTo('/')
  } catch (e) {
    toast.error('Failed to delete account')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="settings-section">
    <div class="settings-header">
      <NuxtLink to="/settings" class="back-link md:hidden">
        <LucideArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <h2 class="settings-title">Account</h2>
    </div>

    <div class="settings-content">
      <!-- Change Password -->
      <div class="form-section">
        <h3 class="section-title">Change Password</h3>

        <form @submit.prevent="handleChangePassword" class="password-form">
          <div class="form-group">
            <label class="form-label" for="current-password">Current Password</label>
            <Input
              id="current-password"
              v-model="passwordForm.current"
              type="password"
              :error="!!passwordErrors.current"
            />
            <span v-if="passwordErrors.current" class="form-error">
              {{ passwordErrors.current }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="new-password">New Password</label>
            <Input
              id="new-password"
              v-model="passwordForm.new"
              type="password"
              :error="!!passwordErrors.new"
            />
            <div v-if="passwordForm.new" class="password-strength">
              <div class="strength-bars">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="strength-bar"
                  :class="{ active: i <= passwordStrength }"
                />
              </div>
              <span class="strength-label">
                {{ ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1] || '' }}
              </span>
            </div>
            <span v-if="passwordErrors.new" class="form-error">
              {{ passwordErrors.new }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="confirm-password">Confirm New Password</label>
            <Input
              id="confirm-password"
              v-model="passwordForm.confirm"
              type="password"
              :error="!!passwordErrors.confirm"
            />
            <span v-if="passwordErrors.confirm" class="form-error">
              {{ passwordErrors.confirm }}
            </span>
          </div>

          <div class="form-actions">
            <Button type="submit" variant="primary" :loading="changingPassword">
              Update Password
            </Button>
          </div>
        </form>
      </div>

      <div class="divider" />

      <!-- Danger Zone -->
      <div class="danger-zone">
        <h3 class="section-title danger">Danger Zone</h3>

        <div class="danger-item">
          <div class="danger-info">
            <span class="danger-label">Delete Account</span>
            <span class="danger-description">
              Once you delete your account, there is no going back.
              All your projects and tasks will be permanently deleted.
            </span>
          </div>
          <Button variant="danger" @click="showDeleteModal = true">
            Delete Account
          </Button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Delete Account">
      <div class="delete-modal">
        <div class="delete-warning">
          <LucideAlertTriangle class="w-12 h-12 text-danger" />
          <p>
            This action cannot be undone. All your projects, tasks, and data
            will be permanently deleted.
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">
            Type <strong>DELETE</strong> to confirm
          </label>
          <Input v-model="deleteConfirmation" placeholder="DELETE" />
        </div>

        <div class="delete-actions">
          <Button variant="ghost" @click="showDeleteModal = false">
            Cancel
          </Button>
          <Button
            variant="danger"
            :loading="deleting"
            :disabled="deleteConfirmation !== 'DELETE'"
            @click="handleDeleteAccount"
          >
            Delete My Account
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.settings-section {
  max-width: 600px;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.back-link {
  color: var(--color-text-muted);
}

.settings-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.settings-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.section-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-4);
}

.section-title.danger {
  color: var(--color-danger);
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.password-strength {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.strength-bars {
  display: flex;
  gap: 4px;
}

.strength-bar {
  width: 32px;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
}

.strength-bar.active {
  background: var(--color-primary);
}

.strength-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-6) 0;
}

.danger-zone {
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  background: rgba(239, 68, 68, 0.05);
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.danger-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.danger-label {
  font-weight: var(--font-medium);
}

.danger-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.delete-modal {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.delete-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.delete-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}
</style>
```

## Acceptance Criteria

- [ ] Settings index shows navigation on mobile
- [ ] Profile settings allow name change
- [ ] Avatar upload and remove works
- [ ] All notification toggles save immediately
- [ ] Push notification toggle requests permission
- [ ] Password change validates current password
- [ ] Password strength indicator works
- [ ] Delete account requires typing "DELETE"
- [ ] All sections responsive
- [ ] TypeScript passes
