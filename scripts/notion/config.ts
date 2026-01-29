/**
 * Notion API configuration for roadmap fetching
 */

// The Notion database ID from the public roadmap URL:
// https://confirmed-copper-f3a.notion.site/2d35f96e0b7080309d90ee08eeef20b3?v=...
export const NOTION_DATABASE_ID = '2d35f96e-0b70-8058-b720-000b0981fff3';

// Property name mapping: Notion property names -> our internal field names.
export const PROPERTY_MAP = {
  title: 'Initiative / Deliverable',
  status: 'Task Status',
  progress: 'Initiative Progress',
  priority: 'Priority',
  phase: 'Phase',
  parentItem: 'Parent item',
} as const;

// Status value mapping: Notion select option names -> our RoadmapStatus values.
export const STATUS_MAP: Record<string, 'done' | 'in-progress' | 'not-started'> = {
  'Done': 'done',
  'done': 'done',
  'Complete': 'done',
  'Completed': 'done',
  'In Progress': 'in-progress',
  'In progress': 'in-progress',
  'in progress': 'in-progress',
  'Not Started': 'not-started',
  'Not started': 'not-started',
  'not started': 'not-started',
  'To Do': 'not-started',
};
