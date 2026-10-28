import { STAGES, TEAM, createExampleTasks, isLegacyExampleTasks, isPreviousExampleTasks } from './tasks.js';
import { CONTEXT_TOOLS } from './context.js';
import { PRIORITIES } from './taskOrder.js';
export const TASK_KEY = 'vibetracker.tasks';
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validateTasks(tasks, members = TEAM) {
  if (!Array.isArray(tasks)) throw new Error('Saved tasks must be a list.');
  const ids = new Set();
  for (const t of tasks) {
    if (!t || typeof t.id !== 'string' || !t.id || ids.has(t.id) || typeof t.title !== 'string' || !t.title.trim() || typeof t.description !== 'string' || !members.includes(t.assignee) || !STAGES.some(s => s.id === t.status) || !['feature', 'bug'].includes(t.type) || !(t.priority === undefined || PRIORITIES.includes(t.priority)) || !validDate(t.createdDate) || !(t.dueDate === null || validDate(t.dueDate)) || typeof t.context !== 'string' || !(t.contextTool === null || CONTEXT_TOOLS.includes(t.contextTool)) || !(t.contextUpdatedAt === null || (typeof t.contextUpdatedAt === 'string' && !Number.isNaN(Date.parse(t.contextUpdatedAt))))) throw new Error('Saved task data is invalid.');
    ids.add(t.id);
  }
  return tasks.map(task => task.priority === undefined ? { ...task, priority:'normal' } : task);
}
export function loadTasks(storage, members = TEAM) {
  const raw = storage.getItem(TASK_KEY);
  if (raw !== null) {
    const saved = validateTasks(JSON.parse(raw), members);
    if (isLegacyExampleTasks(saved)) {
      const refreshed = createExampleTasks();
      try { saveTasks(storage, refreshed, members); return refreshed; }
      catch { return saved; }
    }
    if (isPreviousExampleTasks(saved)) {
      const expanded = [...saved, ...createExampleTasks().slice(4)];
      try { saveTasks(storage, expanded, members); return expanded; }
      catch { return saved; }
    }
    return saved;
  }
  const initial = createExampleTasks();
  saveTasks(storage, initial, members);
  return initial;
}
export function saveTasks(storage, tasks, members = TEAM) {
  storage.setItem(TASK_KEY, JSON.stringify(validateTasks(tasks, members)));
}
export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
