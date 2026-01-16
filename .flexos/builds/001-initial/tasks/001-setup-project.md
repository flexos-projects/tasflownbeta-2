---
id: 001-setup-project
sequence: 1
status: pending
dependsOn: []

inputs:
  docs:
    - ../docs/001-nuxt3.md

expectedOutput:
  - package.json
  - nuxt.config.ts
  - tsconfig.json

validation:
  - command: "pnpm typecheck"
    expect: "success"
---

# Task: Setup Project

## Objective

Initialize a new Nuxt 3 project with TypeScript support.

## Steps

1. Create project using nuxi:
   ```bash
   npx nuxi@latest init taskflow --template v3
   cd taskflow
   ```

2. Configure nuxt.config.ts:
   ```typescript
   export default defineNuxtConfig({
     devtools: { enabled: true },
     srcDir: 'src/',
     typescript: {
       strict: true,
       typeCheck: true
     },
     app: {
       head: {
         title: 'TaskFlow',
         meta: [
           { name: 'description', content: 'Lightweight task management' }
         ]
       }
     }
   })
   ```

3. Update tsconfig.json for strict mode

4. Create src/ directory structure:
   ```
   src/
   ├── assets/
   ├── components/
   ├── composables/
   ├── layouts/
   ├── middleware/
   ├── pages/
   ├── plugins/
   ├── stores/
   └── types/
   ```

## Acceptance Criteria

- [ ] Nuxt 3 project initialized
- [ ] srcDir set to 'src/'
- [ ] TypeScript strict mode enabled
- [ ] Directory structure created
- [ ] `pnpm dev` starts without errors
