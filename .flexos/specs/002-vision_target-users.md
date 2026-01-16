---
type: vision
title: Target Users
description: User personas, jobs to be done, and anti-personas
status: approved
priority: high
sequence: 2
relatesTo:
  - 001-vision_product
tags:
  - users
  - personas
  - research
generatedBy: human
---

# Target Users Spec

## User Research Summary

Based on interviews with 25 potential users (15 freelancers, 10 small team leads):

### Key Findings

1. **Simplicity is the #1 request**: Every user mentioned wanting "something simpler"
2. **Mobile usage is high**: 60% check tasks on mobile daily
3. **Team size is small**: Average team is 3-5 people
4. **Tool fatigue is real**: Average user has tried 4+ task management tools
5. **Price sensitivity is moderate**: Willing to pay $5-15/user/month for the right tool

---

## Primary Persona: The Freelancer

### Profile

**Name**: Alex Chen
**Age**: 32
**Location**: Austin, TX
**Occupation**: Freelance UX Designer
**Income**: $120K/year
**Tech Comfort**: High

### Background

Alex left a full-time design role 2 years ago to freelance. They work with 4-6 clients at any time, each with different projects and timelines. Work happens on a MacBook in coffee shops and on an iPhone in transit.

### Current Tools

- Apple Notes (chaotic, no structure)
- Notion (tried, too complex)
- Calendar (for deadlines only)
- Email (as a todo list, disaster)

### Goals

1. Know what to work on today
2. Never miss a client deadline
3. Keep project context in one place
4. Look professional to clients

### Frustrations

1. "I spend 20 minutes every morning figuring out what to do"
2. "I've tried 5 tools and they all feel like overkill"
3. "I don't need Gantt charts, I need a list"
4. "My phone app is always a worse version of the desktop"

### A Day in Alex's Life

| Time | Activity | Pain Points |
|------|----------|-------------|
| 7:30am | Check phone for urgent tasks | Notes app is chaos |
| 9:00am | Client call, take notes | Notes disconnected from tasks |
| 11:00am | Deep work on design project | What should I work on? |
| 1:00pm | Quick task review on phone | Mobile app sucks |
| 3:00pm | Switch to different client | Lost context |
| 5:00pm | Plan tomorrow | Too many places to check |

### Jobs to Be Done

1. **When** I start my work day, **I want to** see exactly what needs my attention, **so that** I can focus immediately
2. **When** I'm with a client, **I want to** quickly capture action items, **so that** I don't forget commitments
3. **When** I switch between projects, **I want to** see relevant context, **so that** I can pick up where I left off
4. **When** I'm on my phone, **I want to** check and complete tasks, **so that** I'm productive anywhere

### How TaskFlow Helps Alex

- Dashboard shows today's tasks immediately
- Quick add task from anywhere
- Project context is always visible
- Mobile app is fully functional

---

## Secondary Persona: The Team Lead

### Profile

**Name**: Jordan Martinez
**Age**: 38
**Location**: Denver, CO
**Occupation**: Founder, 8-person marketing agency
**Income**: Agency revenue $1.2M/year
**Tech Comfort**: Medium-High

### Background

Jordan started the agency 5 years ago. The team of 8 handles multiple client campaigns simultaneously. They've tried Asana (too complex), Trello (boards got messy), and Basecamp (too opinionated).

### Current Tools

- Slack (communication)
- Google Docs (collaboration)
- Spreadsheets (project tracking, disaster)
- Email (client communication)

### Goals

1. See what everyone is working on
2. Assign tasks without micromanaging
3. Know when things are at risk
4. Keep the team aligned

### Frustrations

1. "We spend 30 min every standup just figuring out status"
2. "I can't tell what's overdue without digging through boards"
3. "Every tool requires a project management certification to use"
4. "We don't need workflows and automations, we need a list"

### Jobs to Be Done

1. **When** I start my day, **I want to** see team status at a glance, **so that** I can spot blockers early
2. **When** I assign work, **I want to** delegate clearly, **so that** there's no confusion about ownership
3. **When** deadlines approach, **I want to** see what's at risk, **so that** I can intervene if needed
4. **When** onboarding new team members, **I want to** get them productive immediately, **so that** we don't waste training time

### How TaskFlow Helps Jordan

- Dashboard shows team activity
- Simple assignment (one click)
- Due date warnings
- No training needed

---

## Anti-Personas

These are users we explicitly DO NOT serve:

### The Enterprise PM

**Profile**: Works at a 500+ person company with complex workflows

**Why not**: Needs enterprise features (SSO, audit logs, custom workflows) that would compromise our simplicity

**Signs**: Asks about "resource allocation," "capacity planning," "enterprise pricing"

### The Power User

**Profile**: Wants to customize everything, needs 50+ integrations

**Why not**: Would push us toward complexity and feature bloat

**Signs**: First question is "does it integrate with [obscure tool]?"

### The Price Shopper

**Profile**: Only considers free tools, won't pay for productivity

**Why not**: We can't build a sustainable business on free users

**Signs**: Complains about any pricing, expects everything free

### The All-in-One Seeker

**Profile**: Wants task management, docs, chat, video, and CRM in one tool

**Why not**: We do one thing well, not everything poorly

**Signs**: Asks "can it replace Notion AND Slack AND Zoom?"

---

## User Segmentation

### By Team Size

| Segment | % of Users | Behavior | Pricing |
|---------|------------|----------|---------|
| Solo (1) | 60% | Personal projects, 2-4 projects | Free → Pro |
| Duo (2) | 15% | Business partner, shared projects | Pro |
| Small (3-5) | 15% | Small team, 5-10 projects | Pro |
| Growing (6-10) | 8% | Department/agency, 10-20 projects | Pro |
| Large (11+) | 2% | Not our target | May churn to enterprise |

### By Use Case

| Segment | % of Users | Primary Need |
|---------|------------|--------------|
| Client Work | 45% | Track deliverables across clients |
| Internal Projects | 30% | Team coordination on projects |
| Personal + Work | 20% | Mix of personal and professional |
| Side Projects | 5% | Hobby/side business projects |

### By Industry

| Industry | % of Users | Specific Needs |
|----------|------------|----------------|
| Design/Creative | 30% | Visual project organization |
| Development | 20% | Sprint-like task batching |
| Marketing | 20% | Campaign tracking |
| Consulting | 15% | Client deliverables |
| Other | 15% | General task management |

---

## User Journey Stages

### 1. Awareness

**How they find us:**
- Word of mouth (40%)
- Google search "simple task management" (25%)
- Social media (15%)
- Comparison articles (10%)
- Other (10%)

### 2. Consideration

**What they evaluate:**
- Is it really simpler than what I use?
- Does it work on mobile?
- Can I try it free?
- What does it cost for my team?

### 3. Decision

**Why they choose us:**
- Simplicity (50%)
- Mobile experience (20%)
- Price (15%)
- Recommendation (15%)

### 4. Activation

**First week milestones:**
- Day 1: Create first project, add 3+ tasks
- Day 3: Complete first task, return to dashboard
- Day 7: Add a due date, check mobile app

### 5. Retention

**What keeps them:**
- Daily dashboard habit
- Task completion satisfaction
- Team collaboration (if applicable)
- Mobile convenience

### 6. Expansion

**How they grow:**
- Free → Pro (hit limits)
- Solo → Team (invite colleague)
- 1 project → 5 projects (more clients)

### 7. Advocacy

**How they refer:**
- Tell colleagues (word of mouth)
- Share on social media
- Respond to "what do you use for tasks?" posts

---

## User Research Roadmap

### Ongoing Research

| Activity | Frequency | Purpose |
|----------|-----------|---------|
| User interviews | 5/month | Deep understanding |
| NPS surveys | Monthly | Satisfaction tracking |
| In-app feedback | Continuous | Quick feedback loop |
| Churn interviews | All churns | Understand why |

### Planned Research

| Research | Timeline | Goal |
|----------|----------|------|
| Mobile usability testing | Q1 | Validate mobile experience |
| Team workflow observation | Q2 | Understand team dynamics |
| Competitive analysis | Q2 | Positioning validation |
| Pricing research | Q3 | Pricing optimization |

---

*This spec guides who we build for. When evaluating features, ask: "Would Alex or Jordan use this?"*
