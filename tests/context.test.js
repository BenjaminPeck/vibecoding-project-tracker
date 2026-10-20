import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTEXT_TEMPLATE, contextUpdatedAt, relativeContextTime } from '../src/data/context.js';

test('context timestamp changes only when saved text changes', () => {
  const now = new Date('2026-10-20T12:00:00.000Z');
  assert.equal(contextUpdatedAt(null, '  ', now), null);
  assert.equal(contextUpdatedAt(null, CONTEXT_TEMPLATE, now), now.toISOString());
  const old = { context: '## Background\nOne line', contextUpdatedAt: '2026-10-19T12:00:00.000Z' };
  assert.equal(contextUpdatedAt(old, old.context, now), old.contextUpdatedAt);
  assert.equal(contextUpdatedAt(old, '## Background\nOne line\n', now), now.toISOString());
  assert.equal(contextUpdatedAt(old, '', now), now.toISOString());
});

test('relative context hint has a clear empty and saved state', () => {
  const now = new Date('2026-10-20T12:00:00.000Z');
  assert.equal(relativeContextTime(null, now), 'No context saved yet.');
  assert.equal(relativeContextTime('2026-10-20T11:58:00.000Z', now), 'Last updated 2 minutes ago');
});
