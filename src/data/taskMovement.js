import { STAGES } from './tasks.js';

export function moveTask(tasks, id, status, beforeId = null) {
  const source = tasks.find(task => task.id === id);
  if (!source || !STAGES.some(stage => stage.id === status) || beforeId === id) return tasks;
  const remaining = tasks.filter(task => task.id !== id);
  const targetIndex = beforeId === null ? -1 : remaining.findIndex(task => task.id === beforeId && task.status === status);
  if (beforeId !== null && targetIndex < 0) return tasks;
  const next = [...remaining];
  next.splice(targetIndex < 0 ? next.length : targetIndex, 0, { ...source, status });
  if (next.every((task, index) => task.id === tasks[index].id && task.status === tasks[index].status)) return tasks;
  return next;
}
