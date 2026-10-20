import assert from 'node:assert/strict';
import test from 'node:test';
import { focusTasks, loadFocusOwner, saveFocusOwner } from '../src/data/focusView.js';

test('focus view keeps only one owner without changing saved order', () => {
  const tasks = [
    { id: 'a', assignee: 'Alex Morgan', status: 'todo', dueDate: '2026-10-25' },
    { id: 'b', assignee: 'Sam Patel', status: 'todo', dueDate: '2026-10-20' },
    { id: 'c', assignee: 'Alex Morgan', status: 'todo', dueDate: '2026-10-21' },
    { id: 'd', assignee: 'Alex Morgan', status: 'review', dueDate: null },
  ];
  assert.equal(focusTasks(tasks, ''), tasks);
  assert.deepEqual(focusTasks(tasks, 'Alex Morgan').map(task => task.id), ['a', 'c', 'd']);
  assert.deepEqual(tasks.map(task => task.id), ['a', 'b', 'c', 'd']);
});

test('focus preference restores valid owners and clears to all tasks', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  assert.equal(saveFocusOwner(storage, 'Jamie Chen'), true);
  assert.equal(loadFocusOwner(storage), 'Jamie Chen');
  assert.equal(saveFocusOwner(storage, ''), true);
  assert.equal(loadFocusOwner(storage), '');
  data.set('vibecoding-focus-owner', 'Unknown');
  assert.equal(loadFocusOwner(storage), '');
});
