/**
 * TaskFlow MockDB
 * In-memory database interface for prototypes
 *
 * Loads data from mockdb-data.json and provides query methods
 *
 * Usage:
 *   MockDB.currentUser                    - Get current logged-in user
 *   MockDB.projects.all()                 - Get all projects
 *   MockDB.projects.find('proj-1')        - Get project by ID
 *   MockDB.projects.where({ archived_at: null }) - Filter projects
 *   MockDB.tasks.forProject('proj-1')     - Get tasks for a project
 *   MockDB.tasks.dueToday()               - Get tasks due today
 *   MockDB.notifications.unread()         - Get unread notifications
 */

const MockDB = {
  _data: null,
  _loaded: false,

  /**
   * Initialize MockDB by loading data from JSON file
   * Call this before using any other methods
   */
  async init() {
    if (this._loaded) return this;

    try {
      const response = await fetch('shared/mockdb-data.json');
      this._data = await response.json();
      this._loaded = true;
      console.log('[MockDB] Loaded successfully');
    } catch (error) {
      console.error('[MockDB] Failed to load data:', error);
      // Fallback to empty data
      this._data = {
        currentUser: null,
        users: [],
        projects: [],
        tasks: [],
        teamMembers: [],
        invitations: [],
        notifications: [],
        activityLog: [],
        stats: {}
      };
    }
    return this;
  },

  /**
   * Get current logged-in user
   */
  get currentUser() {
    return this._data?.currentUser || null;
  },

  /**
   * Generic query helpers
   */
  _query(table) {
    const data = this._data?.[table] || [];
    return {
      all: () => [...data],
      find: (id) => data.find(item => item.id === id) || null,
      where: (query) => data.filter(item =>
        Object.entries(query).every(([key, value]) => {
          if (value === null) return item[key] === null;
          if (value === undefined) return item[key] !== undefined;
          return item[key] === value;
        })
      ),
      first: (query) => {
        if (!query) return data[0] || null;
        return data.find(item =>
          Object.entries(query).every(([key, value]) => item[key] === value)
        ) || null;
      },
      count: (query) => query ? MockDB._query(table).where(query).length : data.length
    };
  },

  /**
   * Users collection
   */
  users: {
    all() { return MockDB._query('users').all(); },
    find(id) { return MockDB._query('users').find(id); },
    where(query) { return MockDB._query('users').where(query); },
    byEmail(email) { return MockDB._query('users').first({ email }); }
  },

  /**
   * Projects collection
   */
  projects: {
    all() { return MockDB._query('projects').all(); },
    find(id) { return MockDB._query('projects').find(id); },
    where(query) { return MockDB._query('projects').where(query); },

    active() {
      return MockDB._query('projects').where({ archived_at: null });
    },

    archived() {
      return MockDB._query('projects').all().filter(p => p.archived_at !== null);
    },

    forUser(userId) {
      const memberProjectIds = MockDB._query('teamMembers')
        .where({ user_id: userId })
        .map(tm => tm.project_id);
      return MockDB._query('projects').all()
        .filter(p => memberProjectIds.includes(p.id));
    },

    recent(limit = 5) {
      return MockDB._query('projects').where({ archived_at: null })
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, limit);
    }
  },

  /**
   * Tasks collection
   */
  tasks: {
    all() { return MockDB._query('tasks').all(); },
    find(id) { return MockDB._query('tasks').find(id); },
    where(query) { return MockDB._query('tasks').where(query); },

    forProject(projectId) {
      return MockDB._query('tasks').where({ project_id: projectId })
        .sort((a, b) => a.position - b.position);
    },

    assignedTo(userId) {
      return MockDB._query('tasks').where({ assigned_to: userId, done: false });
    },

    completed() {
      return MockDB._query('tasks').where({ done: true });
    },

    pending() {
      return MockDB._query('tasks').where({ done: false });
    },

    dueToday() {
      const today = new Date().toISOString().split('T')[0];
      return MockDB._query('tasks').all()
        .filter(t => t.due_date === today && !t.done);
    },

    overdue() {
      const today = new Date().toISOString().split('T')[0];
      return MockDB._query('tasks').all()
        .filter(t => t.due_date && t.due_date < today && !t.done);
    },

    dueThisWeek() {
      const today = new Date();
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const todayStr = today.toISOString().split('T')[0];
      const weekStr = weekFromNow.toISOString().split('T')[0];

      return MockDB._query('tasks').all()
        .filter(t => t.due_date && t.due_date >= todayStr && t.due_date <= weekStr && !t.done);
    },

    byPriority(priority) {
      return MockDB._query('tasks').where({ priority, done: false });
    },

    withTag(tag) {
      return MockDB._query('tasks').all()
        .filter(t => t.tags && t.tags.includes(tag));
    }
  },

  /**
   * Team Members collection
   */
  teamMembers: {
    all() { return MockDB._query('teamMembers').all(); },
    find(id) { return MockDB._query('teamMembers').find(id); },

    forProject(projectId) {
      const members = MockDB._query('teamMembers').where({ project_id: projectId });
      return members.map(tm => ({
        ...tm,
        user: MockDB.users.find(tm.user_id)
      }));
    },

    forUser(userId) {
      return MockDB._query('teamMembers').where({ user_id: userId });
    }
  },

  /**
   * Invitations collection
   */
  invitations: {
    all() { return MockDB._query('invitations').all(); },
    find(id) { return MockDB._query('invitations').find(id); },

    pending() {
      return MockDB._query('invitations').where({ status: 'pending' });
    },

    forProject(projectId) {
      return MockDB._query('invitations').where({ project_id: projectId });
    }
  },

  /**
   * Notifications collection
   */
  notifications: {
    all() { return MockDB._query('notifications').all(); },
    find(id) { return MockDB._query('notifications').find(id); },

    forUser(userId) {
      return MockDB._query('notifications').where({ user_id: userId })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    unread(userId = null) {
      const userNotifs = userId
        ? MockDB._query('notifications').where({ user_id: userId })
        : MockDB._query('notifications').all();
      return userNotifs.filter(n => n.read_at === null);
    },

    unreadCount(userId = null) {
      return this.unread(userId).length;
    },

    byType(type) {
      return MockDB._query('notifications').where({ type });
    }
  },

  /**
   * Activity Log collection
   */
  activityLog: {
    all() { return MockDB._query('activityLog').all(); },

    recent(limit = 10) {
      return MockDB._query('activityLog').all()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);
    },

    forUser(userId) {
      return MockDB._query('activityLog').where({ user_id: userId });
    },

    forProject(projectId) {
      return MockDB._query('activityLog').all()
        .filter(a => a.metadata?.project_id === projectId);
    }
  },

  /**
   * Stats
   */
  get stats() {
    return this._data?.stats || {};
  },

  /**
   * Utility: Format date for display
   */
  formatDate(dateString, options = {}) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (options.relative) {
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays === -1) return 'Tomorrow';
      if (diffDays > 0 && diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 0 && diffDays > -7) return `In ${Math.abs(diffDays)} days`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...options
    });
  },

  /**
   * Utility: Get initials from name
   */
  getInitials(name) {
    if (!name) return '?';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  /**
   * Utility: Get color for priority
   */
  getPriorityColor(priority) {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#22c55e'
    };
    return colors[priority] || '#6b7280';
  },

  /**
   * Utility: Get task status
   */
  getTaskStatus(task) {
    if (task.done) return 'completed';
    const today = new Date().toISOString().split('T')[0];
    if (task.due_date && task.due_date < today) return 'overdue';
    if (task.due_date === today) return 'due-today';
    return 'pending';
  }
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  window.MockDB = MockDB;
  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MockDB.init());
  } else {
    MockDB.init();
  }
}

// CommonJS export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MockDB;
}
