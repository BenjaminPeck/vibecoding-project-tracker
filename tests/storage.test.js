import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTasks, saveTasks, validDate, TASK_KEY } from '../src/data/storage.js';
import { TEAM, createExampleTasks, isLegacyExampleTasks, isPreviousExampleTasks } from '../src/data/tasks.js';
function memory(raw=null) { return {raw,getItem(){return this.raw;},setItem(key,value){assert.equal(key,TASK_KEY);this.raw=value;}}; }
test('seed once, persist edits and preserve an intentionally empty board',()=>{
 const s=memory();const tasks=loadTasks(s);assert.equal(tasks.length,10);
 assert.deepEqual(['todo','in-progress','review','done'].map(status=>tasks.filter(task=>task.status===status).length),[3,3,2,2]);
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

test('older saved tasks gain Normal priority without overwriting their original data',()=>{
 const storage=memory();const tasks=loadTasks(storage);
 const old=tasks.map(({priority,...task})=>task);
 storage.raw=JSON.stringify(old);
 const loaded=loadTasks(storage);
 assert(loaded.every(task=>task.priority==='normal'));
 assert.equal(storage.raw,JSON.stringify(old));
 loaded[0].priority='high';saveTasks(storage,loaded);
 assert.equal(loadTasks(storage)[0].priority,'high');
 const invalid=JSON.parse(storage.raw);invalid[0].priority='urgent';
 const invalidStorage=memory(JSON.stringify(invalid));
 assert.throws(()=>loadTasks(invalidStorage));
 assert.equal(invalidStorage.raw,JSON.stringify(invalid));
});

test('only untouched legacy sample tasks refresh to software-development examples', () => {
 const base={description:'',type:'feature',dueDate:null,createdDate:'2026-10-20',context:'',contextTool:null,contextUpdatedAt:null};
 const old=[
  {...base,id:'demo-01',title:'Make project deliverables easy to find',description:'Keep the presentation, demo, report and documentation together.',status:'todo',assignee:TEAM[0]},
  {...base,id:'demo-02',title:'Build a clear task editing flow',description:'Give every task a title, owner and place on the board.',status:'in-progress',assignee:TEAM[1]},
  {...base,id:'demo-03',title:'Check keyboard focus in the task form',description:'Make sure focus returns to the task after closing the form.',type:'bug',status:'review',assignee:TEAM[2]},
  {...base,id:'demo-04',title:'Agree the project requirements',description:'Define the behaviour, quality standards and data the prototype needs.',status:'done',assignee:TEAM[0]},
 ];
 assert(isLegacyExampleTasks(old));
 const storage=memory(JSON.stringify(old));
 const refreshed=loadTasks(storage);
 assert.match(refreshed[0].title,/keyboard shortcut/);
 assert.equal(loadTasks(storage)[0].title,refreshed[0].title);
 old[0].description='Personal edit';
 assert(!isLegacyExampleTasks(old));
 const editedStorage=memory(JSON.stringify(old));
 assert.equal(loadTasks(editedStorage)[0].description,'Personal edit');
 assert.equal(editedStorage.raw,JSON.stringify(old));
 old[0].description='Keep the presentation, demo, report and documentation together.';
 old[0].priority='high';
 assert(!isLegacyExampleTasks(old));
});

test('only the unchanged four-task sample expands without replacing saved task order', () => {
 const previous=createExampleTasks(new Date('2026-10-20T12:00:00')).slice(0,4);
 const reordered=[previous[1],previous[2],previous[3],{...previous[0],contextUpdatedAt:new Date('2026-10-21T12:00:00Z').toISOString()}];
 assert(isPreviousExampleTasks(reordered));
 const storage=memory(JSON.stringify(reordered));
 const expanded=loadTasks(storage);
 assert.equal(expanded.length,10);
 assert.deepEqual(expanded.slice(0,4).map(task=>task.id),reordered.map(task=>task.id));
 assert.equal(expanded[3].contextUpdatedAt,reordered[3].contextUpdatedAt);
 assert.equal(loadTasks(storage).length,10);
 const edited=structuredClone(previous);edited[0].description='Personal edit';
 assert(!isPreviousExampleTasks(edited));
 const editedStorage=memory(JSON.stringify(edited));
 assert.equal(loadTasks(editedStorage).length,4);
 assert.equal(editedStorage.raw,JSON.stringify(edited));
 const deletedStorage=memory(JSON.stringify(previous.slice(1)));
 assert.equal(loadTasks(deletedStorage).length,3);
});
