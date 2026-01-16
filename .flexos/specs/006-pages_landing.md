---
type: pages
title: Landing Page
description: Marketing homepage with hero, features, and CTA
status: approved
priority: high
sequence: 6
route: /
prototype: 001-landing.html
relatesTo:
  - 007-pages_dashboard
tags:
  - marketing
  - public
generatedBy: ai
---

# Landing Page Spec

## Overview

The landing page is the first impression for most visitors. It must clearly communicate what TaskFlow does, who it's for, and why it's different—all in under 5 seconds.

**Goals:**
1. Communicate value proposition instantly
2. Build trust with social proof
3. Drive signups (primary CTA)
4. Support secondary exploration (features, pricing)

---

## Page Structure

```
┌─────────────────────────────────────────────────────────┐
│ 1. Navigation                                           │
├─────────────────────────────────────────────────────────┤
│ 2. Hero Section                                         │
├─────────────────────────────────────────────────────────┤
│ 3. Social Proof                                         │
├─────────────────────────────────────────────────────────┤
│ 4. Features                                             │
├─────────────────────────────────────────────────────────┤
│ 5. How It Works                                         │
├─────────────────────────────────────────────────────────┤
│ 6. Testimonials                                         │
├─────────────────────────────────────────────────────────┤
│ 7. Pricing Preview                                      │
├─────────────────────────────────────────────────────────┤
│ 8. Final CTA                                            │
├─────────────────────────────────────────────────────────┤
│ 9. Footer                                               │
└─────────────────────────────────────────────────────────┘
```

---

## Section 1: Navigation

### Desktop

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]    Features  Pricing  About    [Log In] [Sign Up →] │
└─────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]                                      [☰]            │
└─────────────────────────────────────────────────────────────┘

Menu opens as slide-down:
┌─────────────────────────────────────────────────────────────┐
│ Features                                                    │
│ Pricing                                                     │
│ About                                                       │
│ ──────────────────────────────────────────────────────────  │
│ Log In                                                      │
│ [Sign Up Free →]                                           │
└─────────────────────────────────────────────────────────────┘
```

### Behavior

| Element | Action |
|---------|--------|
| Logo | Link to `/` |
| Features | Scroll to Features section |
| Pricing | Link to `/pricing` |
| About | Link to `/about` |
| Log In | Link to `/login` |
| Sign Up | Link to `/signup` (primary button style) |

---

## Section 2: Hero

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                Task management that                         │
│                gets out of your way                         │
│                                                             │
│    Simple project and task management for freelancers       │
│                  and small teams.                           │
│                                                             │
│         [Get Started Free]    [See How It Works]           │
│                                                             │
│                    [Product Screenshot]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Content

| Element | Content |
|---------|---------|
| Headline | "Task management that gets out of your way" |
| Subheadline | "Simple project and task management for freelancers and small teams." |
| Primary CTA | "Get Started Free" → `/signup` |
| Secondary CTA | "See How It Works" → Scroll to How It Works |
| Visual | Product screenshot showing dashboard or task list |

### Visual Notes

- Background: Subtle gradient (primary-50 to white)
- Headline: text-5xl, font-bold, gray-900
- Subheadline: text-xl, gray-600, max-width 600px
- Screenshot: Slight shadow, rounded corners, maybe tilted 3D effect

---

## Section 3: Social Proof

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│      Trusted by 1,000+ freelancers and small teams         │
│                                                             │
│     [Logo 1]  [Logo 2]  [Logo 3]  [Logo 4]  [Logo 5]       │
└─────────────────────────────────────────────────────────────┘
```

**Alternative (if no logos yet):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    1,000+          5,000+           4.9/5                  │
│    Users           Tasks/Day        App Store              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Content

| Element | Content |
|---------|---------|
| Headline | "Trusted by 1,000+ freelancers and small teams" |
| Logos | 5 recognizable but not huge company logos (or testimonial source logos) |
| OR Stats | User count, tasks completed, rating |

---

## Section 4: Features

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                  Everything you need,                       │
│                nothing you don't.                           │
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │      ⚡         │ │      📱         │ │      👥         ││
│  │                 │ │                 │ │                 ││
│  │  Lightning      │ │  Mobile         │ │  Team           ││
│  │  Fast           │ │  First          │ │  Ready          ││
│  │                 │ │                 │ │                 ││
│  │ Every action    │ │ Full experience │ │ Invite your     ││
│  │ under 100ms.    │ │ on any device.  │ │ team in seconds.││
│  │ No waiting.     │ │ Not "responsive"│ │ Simple roles,   ││
│  │                 │ │ —equal.         │ │ no complexity.  ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │      ✨         │ │      🔔         │ │      🔒         ││
│  │                 │ │                 │ │                 ││
│  │  Beautifully    │ │  Smart          │ │  Private &      ││
│  │  Simple         │ │  Reminders      │ │  Secure         ││
│  │                 │ │                 │ │                 ││
│  │ Clean design,   │ │ Never miss a    │ │ Your data is    ││
│  │ no clutter.     │ │ deadline. We'll │ │ yours. We don't ││
│  │ Focus on work.  │ │ remind you.     │ │ sell it.        ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Features List

| Icon | Title | Description |
|------|-------|-------------|
| ⚡ | Lightning Fast | Every action completes in under 100ms. No loading spinners, no waiting around. |
| 📱 | Mobile First | Full experience on any device. Not "mobile-friendly"—mobile-equal. |
| 👥 | Team Ready | Invite your team in seconds. Simple roles, no enterprise complexity. |
| ✨ | Beautifully Simple | Clean design that doesn't get in your way. Focus on your work, not the tool. |
| 🔔 | Smart Reminders | Never miss a deadline. Get reminded when tasks are due or overdue. |
| 🔒 | Private & Secure | Your data is yours. We don't sell it, we don't show ads. |

### Mobile Layout

- 1 column, stacked vertically
- Each feature card full width
- More padding between cards

---

## Section 5: How It Works

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    Get started in minutes                   │
│                                                             │
│     ①                    ②                    ③            │
│  Create a              Add your             Get things      │
│  project               tasks                done             │
│                                                             │
│  Give it a name        Write what needs     Check off tasks  │
│  and color. That's     to be done. Set      as you complete  │
│  it.                   due dates if you     them. Feel the   │
│                        want.                satisfaction.    │
│                                                             │
│                  [Get Started Free →]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Steps

| Step | Title | Description |
|------|-------|-------------|
| 1 | Create a project | Give it a name and color. That's it. No templates, no configuration. |
| 2 | Add your tasks | Write what needs to be done. Set due dates if you want. |
| 3 | Get things done | Check off tasks as you complete them. Feel the satisfaction. |

---

## Section 6: Testimonials

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                  What our users say                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  "Finally, a task manager that doesn't require a    │  │
│  │   PhD to use. I was up and running in 2 minutes."   │  │
│  │                                                      │  │
│  │   [Avatar]  Sarah Chen                              │  │
│  │             Freelance Designer                       │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  "We tried Asana, Trello, and Notion. TaskFlow is   │  │
│  │   the first tool our whole team actually uses."     │  │
│  │                                                      │  │
│  │   [Avatar]  Marcus Johnson                          │  │
│  │             Marketing Agency Founder                 │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Testimonials

| Quote | Name | Title |
|-------|------|-------|
| "Finally, a task manager that doesn't require a PhD to use. I was up and running in 2 minutes." | Sarah Chen | Freelance Designer |
| "We tried Asana, Trello, and Notion. TaskFlow is the first tool our whole team actually uses." | Marcus Johnson | Marketing Agency Founder |
| "I love that it works perfectly on my phone. Most apps feel like an afterthought on mobile." | Alex Rivera | Consultant |

---

## Section 7: Pricing Preview

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    Simple, fair pricing                     │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐│
│  │       Free          │    │           Pro              ││
│  │                     │    │                             ││
│  │        $0           │    │     $8/user/month          ││
│  │                     │    │                             ││
│  │   3 projects        │    │   Unlimited projects       ││
│  │   100 tasks         │    │   Unlimited tasks          ││
│  │   Solo only         │    │   Team collaboration       ││
│  │                     │    │   Priority support         ││
│  │                     │    │                             ││
│  │  [Get Started]      │    │  [Start Free Trial]        ││
│  └─────────────────────┘    └─────────────────────────────┘│
│                                                             │
│              See full pricing details →                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Notes

- Pro tier card should be highlighted (border or shadow)
- Both buttons go to `/signup`
- "See full pricing details" links to `/pricing`

---

## Section 8: Final CTA

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Ready to get organized?                        │
│                                                             │
│     Start your free account today. No credit card          │
│                    required.                                │
│                                                             │
│              [Get Started Free →]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design

- Dark background (gray-900 or primary-900)
- White text
- Large primary button

---

## Section 9: Footer

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Logo]                                                     │
│  Task management that gets out of your way.                 │
│                                                             │
│  Product          Company         Legal                     │
│  Features         About           Privacy                   │
│  Pricing          Blog            Terms                     │
│  Changelog        Careers                                   │
│                                                             │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  © 2025 TaskFlow. All rights reserved.    [Twitter] [GitHub]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Links

| Column | Links |
|--------|-------|
| Product | Features (anchor), Pricing, Changelog |
| Company | About, Blog, Careers |
| Legal | Privacy Policy, Terms of Service |
| Social | Twitter, GitHub |

---

## Mobile Responsive

### Key Changes

| Section | Desktop | Mobile |
|---------|---------|--------|
| Nav | Full links | Hamburger menu |
| Hero | Large text | Smaller text, stacked buttons |
| Features | 3-column grid | 1-column stack |
| How It Works | Horizontal steps | Vertical steps |
| Testimonials | Side by side | Stacked |
| Pricing | Side by side | Stacked |
| Footer | 3-column | 1-column stacked |

---

## SEO

| Meta | Content |
|------|---------|
| Title | TaskFlow - Task management that gets out of your way |
| Description | Simple project and task management for freelancers and small teams. No complexity, no learning curve. Get started free. |
| OG Image | Product screenshot with branding |

---

## Acceptance Criteria

- [ ] Navigation links work correctly
- [ ] All CTAs link to signup
- [ ] Page is fully responsive (320px - 1920px)
- [ ] Images are optimized and lazy-loaded
- [ ] Page loads in under 2 seconds
- [ ] Smooth scroll for anchor links
- [ ] Mobile menu opens/closes correctly
- [ ] SEO meta tags are present

---

*This page is the front door. Every word, every image, every button must earn its place.*
