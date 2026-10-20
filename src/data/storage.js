import { STAGES, TEAM, createExampleTasks } from './tasks.js';
import { CONTEXT_TOOLS } from './context.js';
export const TASK_KEY = 'vibetracker.tasks';
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validateTasks(tasks) {
  if (!Array.isArray(tasks)) throw new Error('Saved tasks must be a list.');
  const ids = new Set();
  for (const t of tasks) {
    if (!t || typeof t.id !== 'string' || !t.id || ids.has(t.id) || typeof t.title !== 'string' || !t.title.trim() || typeof t.description !== 'string' || !TEAM.includes(t.assignee) || !STAGES.some(s => s.id === t.status) || !['feature', 'bug'].includes(t.type) || !validDate(t.createdDate) || !(t.dueDate === null || validDate(t.dueDate)) || typeof t.context !== 'string' || !(t.contextTool === null || CONTEXT_TOOLS.includes(t.contextTool)) || !(t.contextUpdatedAt === null || (typeof t.contextUpdatedAt === 'string' && !Number.isNaN(Date.parse(t.contextUpdatedAt))))) throw new Error('Saved task data is invalid.');
    ids.add(t.id);
  }
  return tasks;
}
export function loadTasks(storage) {
  const raw = storage.getItem(TASK_KEY);
  if (raw !== null) return validateTasks(JSON.parse(raw));
  const initial = createExampleTasks();
  saveTasks(storage, initial);
  return initial;
}
export function saveTasks(storage, tasks) {
  validateTasks(tasks);
  storage.setItem(TASK_KEY, JSON.stringify(tasks));
}
export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
