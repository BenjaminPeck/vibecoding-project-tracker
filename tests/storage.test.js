import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTasks, saveTasks, validDate, TASK_KEY } from '../src/data/storage.js';
function memory(raw=null) { return {raw,getItem(){return this.raw;},setItem(key,value){assert.equal(key,TASK_KEY);this.raw=value;}}; }
test('seed once, persist edits and preserve an intentionally empty board',()=>{
 const s=memory();const tasks=loadTasks(s);assert.equal(tasks.length,4);
 tasks[0].title='Edited';saveTasks(s,tasks);assert.equal(loadTasks(s)[0].title,'Edited');
 saveTasks(s,[]);assert.deepEqual(loadTasks(s),[]);
});
test('invalid data is rejected without overwriting it',()=>{
 for(const raw of ['broken','{}','[{"id":"bad"}]']){const s=memory(raw);assert.throws(()=>loadTasks(s));assert.equal(s.raw,raw);}
 const s=memory();const tasks=loadTasks(s);const original=s.raw;tasks.push(tasks[0]);assert.throws(()=>saveTasks(s,tasks));assert.equal(s.raw,original);
});
test('read and write failures propagate rather than reporting success',()=>{
 assert.throws(()=>loadTasks({getItem(){throw Error('denied');}}));
 assert.throws(()=>saveTasks({setItem(){throw Error('quota');}},[]));
});
test('calendar validation rejects impossible dates',()=>{
 assert(validDate('2028-02-29'));assert(!validDate('2026-02-29'));assert(!validDate('2026-13-01'));assert(!validDate('bad'));
});
