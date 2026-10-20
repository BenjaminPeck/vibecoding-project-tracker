import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSortMode, saveSortMode, sortTasks } from '../src/data/taskOrder.js';

test('priority is default; ties use due date; manual preserves saved order', () => {
  const tasks = [
    { id:'a', priority:'low', dueDate:'2026-10-20' },
    { id:'b', priority:'high', dueDate:'2026-10-25' },
    { id:'c', priority:'normal', dueDate:null },
    { id:'d', priority:'high', dueDate:'2026-10-21' },
  ];
  assert.deepEqual(sortTasks(tasks, 'priority').map(task => task.id), ['d', 'b', 'c', 'a']);
  assert.deepEqual(sortTasks(tasks, 'due').map(task => task.id), ['a', 'd', 'b', 'c']);
  assert.equal(sortTasks(tasks, 'manual'), tasks);
  assert.deepEqual(tasks.map(task => task.id), ['a', 'b', 'c', 'd']);
});

test('sort choice persists separately and unknown values return to priority', () => {
  const data = new Map();
  const storage = { getItem:key => data.get(key) ?? null, setItem:(key,value) => data.set(key,value) };
  assert.equal(loadSortMode(storage), 'priority');
  assert.equal(saveSortMode(storage, 'manual'), true);
  assert.equal(loadSortMode(storage), 'manual');
  data.set('vibecoding-task-order', 'unknown');
  assert.equal(loadSortMode(storage), 'priority');
});
