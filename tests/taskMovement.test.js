import test from 'node:test';
import assert from 'node:assert/strict';
import { moveTask } from '../src/data/taskMovement.js';

test('dragging moves a task to another status without losing data', () => {
  const tasks = [
    { id: 'a', status: 'todo', context: 'full brief' },
    { id: 'b', status: 'review', context: '' },
  ];
  const moved = moveTask(tasks, 'a', 'review', 'b');
  assert.deepEqual(moved.map(task => [task.id, task.status]), [['a', 'review'], ['b', 'review']]);
  assert.equal(moved[0].context, 'full brief');
  assert.equal(tasks[0].status, 'todo');
});

test('dropping on a card reorders; dropping on a column appends', () => {
  const tasks = [{ id: 'a', status: 'todo' }, { id: 'b', status: 'todo' }, { id: 'c', status: 'todo' }];
  assert.deepEqual(moveTask(tasks, 'c', 'todo', 'a').map(task => task.id), ['c', 'a', 'b']);
  assert.deepEqual(moveTask(tasks, 'a', 'todo').map(task => task.id), ['b', 'c', 'a']);
  assert.equal(moveTask(tasks, 'b', 'todo', 'b'), tasks);
});
