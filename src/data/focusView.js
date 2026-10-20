import { TEAM } from './tasks.js';

export const FOCUS_KEY = 'vibecoding-focus-owner';

export function loadFocusOwner(storage, members = TEAM) {
  try {
    const value = storage.getItem(FOCUS_KEY);
    return members.includes(value) ? value : '';
  } catch { return ''; }
}

export function saveFocusOwner(storage, owner, members = TEAM) {
  if (owner && !members.includes(owner)) return false;
  try {
    if (owner) storage.setItem(FOCUS_KEY, owner);
    else storage.removeItem(FOCUS_KEY);
    return true;
  } catch { return false; }
}

export function focusTasks(tasks, owner) {
  if (!owner) return tasks;
  return tasks.filter(task => task.assignee === owner);
}
