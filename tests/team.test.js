import test from 'node:test';
import assert from 'node:assert/strict';
import { loadProfiles, loadTeam, saveProfiles, saveTeam, TEAM_KEY, validateProfile } from '../src/data/team.js';
import { loadTasks, saveTasks } from '../src/data/storage.js';
import { loadFocusOwner, saveFocusOwner } from '../src/data/focusView.js';

function memory() {
  const values = new Map();
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test('team membership persists and drives task ownership and focus validation', () => {
  const storage = memory();
  const initial = loadTeam(storage);
  const tasks = loadTasks(storage, initial);
  const next = [...initial, 'Taylor Reed'];
  saveTeam(storage, next);
  tasks[0].assignee = 'Taylor Reed';
  saveTasks(storage, tasks, next);
  assert.equal(loadTasks(storage, loadTeam(storage))[0].assignee, 'Taylor Reed');
  assert.equal(saveFocusOwner(storage, 'Taylor Reed', next), true);
  assert.equal(loadFocusOwner(storage, next), 'Taylor Reed');
  assert.equal(loadFocusOwner(storage, initial), '');
  assert.throws(() => saveTasks(storage, tasks, initial));
});

test('invalid roster cannot replace saved members', () => {
  const storage = memory();
  saveTeam(storage, ['Alex Morgan']);
  assert.throws(() => saveTeam(storage, ['Alex Morgan', 'alex morgan']));
  assert.equal(loadTeam(storage)[0], 'Alex Morgan');
  storage.values.set(TEAM_KEY, '{bad');
  assert.throws(() => loadTeam(storage));
});

test('member contact details validate and persist separately from assignments', () => {
  const storage = memory();
  const profile = validateProfile({ email:'taylor@example.com', gitlab:'https://gitlab.com/taylor' });
  saveProfiles(storage, { 'Taylor Reed':profile });
  assert.deepEqual(loadProfiles(storage)['Taylor Reed'], profile);
  assert.throws(() => validateProfile({ email:'invalid', gitlab:'' }));
  assert.throws(() => validateProfile({ email:'taylor@example.com', gitlab:'http://gitlab.com/taylor' }));
  assert.throws(() => validateProfile({ email:'taylor@example.com', gitlab:'https://example.com/taylor' }));
});
