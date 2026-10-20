// A date-only deadline stays open through that entire local calendar day.
export function dueState(task, now = new Date()) {
  if (task.status === 'done' || !task.dueDate) return 'neutral';
  const [year, month, day] = task.dueDate.split('-').map(Number);
  // Compare calendar dates so daylight-saving changes do not shift the bands.
  const dueDay = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAway = Math.round((dueDay - today) / (24 * 60 * 60 * 1000));
  if (daysAway < 0) return 'overdue';
  if (daysAway <= 1) return 'imminent';
  if (daysAway === 2) return 'warning';
  return 'safe';
}

export function dueLabel(task, state) {
  if (!task.dueDate) return task.status === 'done' ? 'Done · no due date' : 'No due date';
  const [year, month, day] = task.dueDate.split('-').map(Number);
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(year, month - 1, day));
  if (task.status === 'done') return `Done · due ${formatted}`;
  if (state === 'overdue') return `Overdue!! · ${formatted}`;
  if (state === 'imminent') return `Due today or tomorrow · ${formatted}`;
  if (state === 'warning') return `Due in two days · ${formatted}`;
  return `Due ${formatted}`;
}

export function dueShortLabel(task, state) {
  if (!task.dueDate) return task.status === 'done' ? 'Done' : 'No date';
  const [year, month, day] = task.dueDate.split('-').map(Number);
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short',
  }).format(new Date(year, month - 1, day));
  if (task.status === 'done') return `Done · ${formatted}`;
  if (state === 'overdue') return `Overdue!! · ${formatted}`;
  if (state === 'imminent') return `Soon · ${formatted}`;
  if (state === 'warning') return `2 days · ${formatted}`;
  return `Due ${formatted}`;
}
