import test from 'node:test';
import assert from 'node:assert/strict';
import { DELIVERABLE_KEY, emptyDeliverables, loadDeliverables, saveDeliverables, validDeliverableUrl } from '../src/data/deliverables.js';

function memory(raw = null) { return { raw, getItem(key) { assert.equal(key, DELIVERABLE_KEY); return this.raw; }, setItem(key, value) { assert.equal(key, DELIVERABLE_KEY); this.raw = value; } }; }

test('four fixed slots survive save, reload and clear', () => {
  const storage = memory();
  const initial = loadDeliverables(storage);
  assert.deepEqual(initial.map(item => item.id), ['presentation', 'demo', 'report', 'documentation']);
  assert(initial.every(item => item.url === null));
  const linked = initial.map(item => item.id === 'demo' ? { ...item, url: 'https://example.com/demo' } : item);
  saveDeliverables(storage, linked);
  assert.equal(loadDeliverables(storage)[1].url, 'https://example.com/demo');
  saveDeliverables(storage, emptyDeliverables());
  assert.equal(loadDeliverables(storage)[1].url, null);
  assert.equal(loadDeliverables(storage).length, 4);
});

test('only HTTP and HTTPS URLs are accepted', () => {
  assert(validDeliverableUrl('https://example.com/report'));
  assert(validDeliverableUrl('http://localhost:5173/demo'));
  for (const url of ['', 'example.com', 'javascript:alert(1)', 'ftp://example.com', 'https://']) assert(!validDeliverableUrl(url));
});

test('invalid saved links are rejected without being overwritten', () => {
  const storage = memory('{bad');
  assert.throws(() => loadDeliverables(storage));
  assert.equal(storage.raw, '{bad');
  const slots = emptyDeliverables();
  slots[0].url = 'javascript:alert(1)';
  assert.throws(() => saveDeliverables(storage, slots));
  assert.equal(storage.raw, '{bad');
  assert.throws(() => saveDeliverables(storage, slots.slice(1)));
});
