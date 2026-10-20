export const PRIORITIES = ['high', 'normal', 'low'];
export const SORT_KEY = 'vibecoding-task-order';
export const SORT_MODES = ['priority', 'due', 'manual'];

export function loadSortMode(storage) {
  try {
    const saved = storage.getItem(SORT_KEY);
    return SORT_MODES.includes(saved) ? saved : 'priority';
  } catch { return 'priority'; }
}

export function saveSortMode(storage, mode) {
  if (!SORT_MODES.includes(mode)) return false;
  try { storage.setItem(SORT_KEY, mode); return true; }
  catch { return false; }
}

export function sortTasks(tasks, mode) {
  if (mode === 'manual') return tasks;
  return [...tasks].sort((a, b) => {
    if (mode === 'priority') {
      const difference = PRIORITIES.indexOf(a.priority ?? 'normal') - PRIORITIES.indexOf(b.priority ?? 'normal');
      if (difference) return difference;
    }
    return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31');
  });
}
