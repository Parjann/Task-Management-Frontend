export const APP_NAME = 'Pyramid';
export const APP_DESCRIPTION = 'Modern collaborative task management platform';

export const TASK_STATUSES = [
  { value: 'BACKLOG', label: 'Backlog', color: '#6B7280' },
  { value: 'TODO', label: 'To Do', color: '#3B82F6' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#F59E0B' },
  { value: 'IN_REVIEW', label: 'In Review', color: '#8B5CF6' },
  { value: 'DONE', label: 'Done', color: '#10B981' },
  { value: 'CANCELED', label: 'Canceled', color: '#EF4444' },
] as const;

export const TASK_PRIORITIES = [
  { value: 'LOW', label: 'Low', color: '#10B981' },
  { value: 'MEDIUM', label: 'Medium', color: '#3B82F6' },
  { value: 'HIGH', label: 'High', color: '#F59E0B' },
  { value: 'URGENT', label: 'Urgent', color: '#EF4444' },
] as const;
