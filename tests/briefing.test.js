import test from 'node:test';
import assert from 'node:assert/strict';
import { taskBriefing } from '../src/data/briefing.js';

test('briefing includes title, description and complete Markdown context', () => {
  const context = '## Background\n\n```js\n  const x = 1;\n```\n';
  assert.equal(taskBriefing({ title:'  Fix import  ', description:'  Preserve data  ', context }),
    `# Fix import\n\n## Description\nPreserve data\n\n## Context\n${context}`);
});

test('briefing stays readable with optional fields empty', () => {
  assert.equal(taskBriefing({ title:'Review', description:'', context:'' }), '# Review');
  assert.equal(taskBriefing({ title:'', description:'', context:'' }), '# Untitled task');
});
