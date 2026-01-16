---
id: 008-create-landing-page
sequence: 8
status: pending
dependsOn: ["003", "004", "005"]

inputs:
  prototype: ../../prototype/001-landing.html
  spec: ../../specs/006-pages_landing.md
  tokens: ../../prototype/shared/tokens.css

expectedOutput:
  - src/pages/index.vue
  - src/components/landing/HeroSection.vue
  - src/components/landing/FeaturesSection.vue
  - src/components/landing/PricingSection.vue
  - src/components/landing/CTASection.vue

validation:
  - command: "pnpm typecheck"
    expect: "success"
  - responsive: [375, 768, 1024, 1440]
---

# Task: Create Landing Page

## Objective

Create the landing page matching `prototype/001-landing.html` exactly.

## Reference

Open `prototype/001-landing.html` in browser and match pixel-perfect.

## Files to Create

### 1. src/pages/index.vue

```vue
<script setup lang="ts">
definePageMeta({
  layout: false // Landing has no sidebar
})

useHead({
  title: 'TaskFlow - Lightweight Task Management'
})
</script>

<template>
  <div class="landing-page">
    <LandingNav />
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <TestimonialsSection />
    <PricingSection />
    <CTASection />
    <LandingFooter />
  </div>
</template>
```

### 2. src/components/landing/HeroSection.vue

Reference prototype sections:
- Headline + subtitle
- Primary + secondary CTAs
- Hero image/illustration

```vue
<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">
          Task management<br>
          <span class="text-primary">made simple</span>
        </h1>
        <p class="hero-subtitle">
          Stop juggling apps. TaskFlow gives you one beautiful place
          to manage projects, track tasks, and collaborate with your team.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/signup" class="btn btn-primary btn-lg">
            Start Free
          </NuxtLink>
          <NuxtLink to="/login" class="btn btn-secondary btn-lg">
            Sign In
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
```

### 3. src/components/landing/FeaturesSection.vue

3-column feature grid with icons.

### 4. src/components/landing/PricingSection.vue

3 pricing tiers: Free, Pro, Team.

### 5. src/components/landing/CTASection.vue

Dark background call-to-action.

## Sections to Implement

1. **Navigation** - Logo, nav links, CTA button
2. **Hero** - Headline, subtitle, CTAs
3. **Social Proof** - Logos or trust badges
4. **Features** - 3-column grid with icons
5. **How It Works** - 3-step process
6. **Testimonials** - Customer quotes
7. **Pricing** - 3 tier cards
8. **CTA** - Final call-to-action
9. **Footer** - Links, social, copyright

## Acceptance Criteria

- [ ] Matches prototype exactly
- [ ] Responsive 320px to 1920px
- [ ] All links work (nav, CTAs)
- [ ] Uses design tokens
- [ ] No custom CSS (use Tailwind + tokens)
- [ ] TypeScript passes
- [ ] Images optimized (if any)
