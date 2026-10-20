import { STAGES, TEAM } from './tasks.js';

export const FOCUS_KEY = 'vibecoding-focus-owner';

export function loadFocusOwner(storage) {
  try {
    const value = storage.getItem(FOCUS_KEY);
    return TEAM.includes(value) ? value : '';
  } catch { return ''; }
}

export function saveFocusOwner(storage, owner) {
  if (owner && !TEAM.includes(owner)) return false;
  try {
    if (owner) storage.setItem(FOCUS_KEY, owner);
    else storage.removeItem(FOCUS_KEY);
    return true;
  } catch { return false; }
}

export function focusTasks(tasks, owner) {
  if (!owner) return tasks;
  return tasks.filter(task => task.assignee === owner).sort((a, b) => {
    const stageOrder = STAGES.findIndex(stage => stage.id === a.status) - STAGES.findIndex(stage => stage.id === b.status);
    if (stageOrder) return stageOrder;
    return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31');
  });
}
