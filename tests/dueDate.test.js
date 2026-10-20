import test from 'node:test';
import assert from 'node:assert/strict';
import { dueLabel, dueShortLabel, dueState } from '../src/data/dueDate.js';

test('deadline colours follow local calendar days', () => {
  const now = new Date(2026, 9, 20, 15);
  const task = dueDate => ({ status: 'todo', dueDate });
  assert.equal(dueState(task('2026-10-19'), now), 'overdue');
  assert.equal(dueState(task('2026-10-20'), now), 'imminent');
  assert.equal(dueState(task('2026-10-21'), now), 'imminent');
  assert.equal(dueState(task('2026-10-22'), now), 'warning');
  assert.equal(dueState(task('2026-10-23'), now), 'safe');
  assert.match(dueShortLabel(task('2026-10-19'), 'overdue'), /^Overdue!!/);
  assert.match(dueLabel(task('2026-10-19'), 'overdue'), /^Overdue!!/);
});

test('done and undated tasks are neutral regardless of time', () => {
  const now = new Date(2026, 9, 30);
  assert.equal(dueState({ status: 'done', dueDate: '2026-10-20' }, now), 'neutral');
  assert.equal(dueState({ status: 'todo', dueDate: null }, now), 'neutral');
  assert.match(dueLabel({ status: 'done', dueDate: '2026-10-20' }, 'neutral'), /^Done · due /);
  assert.equal(dueLabel({ status: 'todo', dueDate: null }, 'neutral'), 'No due date');
});

test('calendar bands stay stable across a daylight-saving transition', () => {
  const task = { status: 'review', dueDate: '2026-10-25' };
  assert.equal(dueState(task, new Date(2026, 9, 23, 23)), 'warning');
  assert.equal(dueState(task, new Date(2026, 9, 24, 23)), 'imminent');
  assert.equal(dueState(task, new Date(2026, 9, 25, 23)), 'imminent');
  assert.equal(dueState(task, new Date(2026, 9, 26)), 'overdue');
});
