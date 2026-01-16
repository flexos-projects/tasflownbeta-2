---
type: database
title: Database Schema
description: Complete database schema with tables, fields, relationships, and RLS policies
status: approved
priority: high
sequence: 12
provider: supabase
tables:
  - name: profiles
    description: Extended user profile data beyond auth
    fields:
      - { name: id, type: uuid, primary: true, references: auth.users.id }
      - { name: email, type: text, unique: true, nullable: false }
      - { name: name, type: text, nullable: false }
      - { name: avatar_url, type: text, nullable: true }
      - { name: onboarding_completed, type: boolean, default: false }
      - { name: created_at, type: timestamptz, default: now() }
      - { name: updated_at, type: timestamptz, default: now() }
  - name: projects
    description: Top-level organizational containers
    fields:
      - { name: id, type: uuid, primary: true, default: gen_random_uuid() }
      - { name: owner_id, type: uuid, references: profiles.id, nullable: false }
      - { name: name, type: text, nullable: false }
      - { name: description, type: text, nullable: true }
      - { name: color, type: text, default: "#3b82f6" }
      - { name: icon, type: text, default: "folder" }
      - { name: archived_at, type: timestamptz, nullable: true }
      - { name: created_at, type: timestamptz, default: now() }
      - { name: updated_at, type: timestamptz, default: now() }
  - name: tasks
    description: Individual work items within projects
    fields:
      - { name: id, type: uuid, primary: true, default: gen_random_uuid() }
      - { name: project_id, type: uuid, references: projects.id, nullable: false }
      - { name: created_by, type: uuid, references: profiles.id, nullable: false }
      - { name: assigned_to, type: uuid, references: profiles.id, nullable: true }
      - { name: title, type: text, nullable: false }
      - { name: description, type: text, nullable: true }
      - { name: done, type: boolean, default: false }
      - { name: done_at, type: timestamptz, nullable: true }
      - { name: due_date, type: date, nullable: true }
      - { name: priority, type: text, nullable: true }
      - { name: position, type: integer, default: 0 }
      - { name: tags, type: "text[]", default: "{}" }
      - { name: created_at, type: timestamptz, default: now() }
      - { name: updated_at, type: timestamptz, default: now() }
  - name: team_members
    description: Project membership and roles
    fields:
      - { name: id, type: uuid, primary: true, default: gen_random_uuid() }
      - { name: project_id, type: uuid, references: projects.id, nullable: false }
      - { name: user_id, type: uuid, references: profiles.id, nullable: false }
      - { name: role, type: text, default: "member" }
      - { name: joined_at, type: timestamptz, default: now() }
  - name: invitations
    description: Pending team invitations
    fields:
      - { name: id, type: uuid, primary: true, default: gen_random_uuid() }
      - { name: project_id, type: uuid, references: projects.id, nullable: false }
      - { name: email, type: text, nullable: false }
      - { name: role, type: text, default: "member" }
      - { name: invited_by, type: uuid, references: profiles.id, nullable: false }
      - { name: status, type: text, default: "pending" }
      - { name: token, type: text, unique: true }
      - { name: created_at, type: timestamptz, default: now() }
      - { name: expires_at, type: timestamptz }
  - name: notifications
    description: User notifications
    fields:
      - { name: id, type: uuid, primary: true, default: gen_random_uuid() }
      - { name: user_id, type: uuid, references: profiles.id, nullable: false }
      - { name: type, type: text, nullable: false }
      - { name: title, type: text, nullable: false }
      - { name: body, type: text, nullable: true }
      - { name: data, type: jsonb, default: "{}" }
      - { name: read_at, type: timestamptz, nullable: true }
      - { name: created_at, type: timestamptz, default: now() }
relatesTo:
  - 003-features_core
  - 004-features_auth
  - 005-features_notifications
tags:
  - database
  - schema
  - mvp
generatedBy: ai
---

# Database Schema Spec

## Overview

TaskFlow uses Supabase (PostgreSQL) with Row-Level Security (RLS) for data access control. This spec defines all tables, relationships, constraints, and security policies.

---

## Tables

### profiles

Extended user profile data. Created automatically when a user signs up.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL CHECK (char_length(name) <= 100),
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();
```

### projects

Top-level organizational containers for tasks.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  description TEXT,
  color TEXT DEFAULT '#3b82f6' CHECK (color ~ '^#[0-9a-fA-F]{6}$'),
  icon TEXT DEFAULT 'folder' CHECK (icon IN ('folder', 'briefcase', 'globe', 'heart', 'star', 'zap', 'coffee', 'book', 'camera', 'music', 'code', 'home')),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_archived_at ON projects(archived_at);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();
```

### tasks

Individual work items within projects.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description TEXT,
  done BOOLEAN DEFAULT false,
  done_at TIMESTAMPTZ,
  due_date DATE,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low') OR priority IS NULL),
  position INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}' CHECK (array_length(tags, 1) <= 5 OR tags = '{}'),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_done ON tasks(done);
CREATE INDEX idx_tasks_project_position ON tasks(project_id, position);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Trigger for done_at
CREATE OR REPLACE FUNCTION set_task_done_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.done = true AND OLD.done = false THEN
    NEW.done_at = now();
  ELSIF NEW.done = false THEN
    NEW.done_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_task_done_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_task_done_at();
```

### team_members

Project membership linking users to projects.

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Indexes
CREATE INDEX idx_team_members_project_id ON team_members(project_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
```

### invitations

Pending invitations to join projects.

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  invited_by UUID NOT NULL REFERENCES profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked', 'expired')),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '7 days'
);

-- Indexes
CREATE INDEX idx_invitations_project_id ON invitations(project_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status);
```

### notifications

User notifications for important events.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('task_due', 'task_overdue', 'task_assigned', 'task_completed', 'member_joined', 'member_left', 'weekly_digest')),
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  body TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE read_at IS NULL;
```

---

## Helper Functions

```sql
-- Updated at trigger function
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if user is project member
CREATE OR REPLACE FUNCTION is_project_member(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE project_id = project_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is project owner
CREATE OR REPLACE FUNCTION is_project_owner(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE project_id = project_uuid AND user_id = user_uuid AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Row-Level Security (RLS) Policies

### profiles

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can read profiles of team members
CREATE POLICY "Users can read team member profiles"
  ON profiles FOR SELECT
  USING (
    id IN (
      SELECT tm2.user_id FROM team_members tm1
      JOIN team_members tm2 ON tm1.project_id = tm2.project_id
      WHERE tm1.user_id = auth.uid()
    )
  );
```

### projects

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can read projects they're members of
CREATE POLICY "Members can read projects"
  ON projects FOR SELECT
  USING (is_project_member(id, auth.uid()));

-- Users can create projects (they become owner)
CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Only owners can update projects
CREATE POLICY "Owners can update projects"
  ON projects FOR UPDATE
  USING (is_project_owner(id, auth.uid()));

-- Only owners can delete projects
CREATE POLICY "Owners can delete projects"
  ON projects FOR DELETE
  USING (is_project_owner(id, auth.uid()));
```

### tasks

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Members can read tasks in their projects
CREATE POLICY "Members can read tasks"
  ON tasks FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

-- Members can create tasks in their projects
CREATE POLICY "Members can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    is_project_member(project_id, auth.uid())
    AND created_by = auth.uid()
  );

-- Members can update tasks in their projects
CREATE POLICY "Members can update tasks"
  ON tasks FOR UPDATE
  USING (is_project_member(project_id, auth.uid()));

-- Members can delete tasks in their projects
CREATE POLICY "Members can delete tasks"
  ON tasks FOR DELETE
  USING (is_project_member(project_id, auth.uid()));
```

### team_members

```sql
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Members can read team members of their projects
CREATE POLICY "Members can read team members"
  ON team_members FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

-- Owners can add team members
CREATE POLICY "Owners can add team members"
  ON team_members FOR INSERT
  WITH CHECK (is_project_owner(project_id, auth.uid()));

-- Owners can remove team members
CREATE POLICY "Owners can remove team members"
  ON team_members FOR DELETE
  USING (is_project_owner(project_id, auth.uid()));

-- Members can remove themselves
CREATE POLICY "Members can remove themselves"
  ON team_members FOR DELETE
  USING (user_id = auth.uid());
```

### invitations

```sql
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Owners can read invitations for their projects
CREATE POLICY "Owners can read invitations"
  ON invitations FOR SELECT
  USING (is_project_owner(project_id, auth.uid()));

-- Owners can create invitations
CREATE POLICY "Owners can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    is_project_owner(project_id, auth.uid())
    AND invited_by = auth.uid()
  );

-- Owners can update (revoke) invitations
CREATE POLICY "Owners can update invitations"
  ON invitations FOR UPDATE
  USING (is_project_owner(project_id, auth.uid()));

-- Anyone can read their own invitations (by email)
CREATE POLICY "Users can read own invitations"
  ON invitations FOR SELECT
  USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );
```

### notifications

```sql
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());
```

---

## Database Triggers for Side Effects

### Auto-create owner as team member on project creation

```sql
CREATE OR REPLACE FUNCTION auto_add_owner_to_team()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO team_members (project_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_add_owner_to_team
  AFTER INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION auto_add_owner_to_team();
```

### Auto-create profile on user signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

---

## Views

### Project with task counts

```sql
CREATE OR REPLACE VIEW projects_with_counts AS
SELECT
  p.*,
  COUNT(t.id) AS task_count,
  COUNT(t.id) FILTER (WHERE t.done = true) AS completed_count
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
GROUP BY p.id;
```

### Today's tasks

```sql
CREATE OR REPLACE VIEW tasks_due_today AS
SELECT t.*, p.name AS project_name, p.color AS project_color
FROM tasks t
JOIN projects p ON p.id = t.project_id
WHERE t.due_date = CURRENT_DATE AND t.done = false;
```

### Overdue tasks

```sql
CREATE OR REPLACE VIEW tasks_overdue AS
SELECT t.*, p.name AS project_name, p.color AS project_color
FROM tasks t
JOIN projects p ON p.id = t.project_id
WHERE t.due_date < CURRENT_DATE AND t.done = false;
```

---

## Acceptance Criteria

- [ ] All tables created with correct schema
- [ ] All indexes created for performance
- [ ] All triggers working correctly
- [ ] RLS enabled on all tables
- [ ] All RLS policies tested
- [ ] Views returning correct data
- [ ] Foreign key cascades working

---

*The database is the foundation. Every query must be fast, every access controlled.*
