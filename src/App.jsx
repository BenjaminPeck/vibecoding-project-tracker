import { useEffect, useRef, useState } from 'react';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import DeliverablesBoard from './components/DeliverablesBoard';
import { loadTasks, saveTasks } from './data/storage';
import { createExampleTasks, STAGES, TEAM } from './data/tasks';
import { emptyDeliverables, loadDeliverables, saveDeliverables } from './data/deliverables';
import { moveTask } from './data/taskMovement';
import { focusTasks, loadFocusOwner, saveFocusOwner } from './data/focusView';
import { applyTheme, loadTheme, saveTheme } from './data/theme';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [deliverablesError, setDeliverablesError] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(undefined);
  const [message, setMessage] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [focusOwner, setFocusOwner] = useState(() => { try { return loadFocusOwner(window.localStorage); } catch { return ''; } });
  const [theme, setTheme] = useState(() => { try { return loadTheme(window.localStorage); } catch { return 'light'; } });
  const visibleTasks = focusTasks(tasks, focusOwner);
  const opener = useRef(null);
  const addButton = useRef(null);
  function load() {
    try { setTasks(loadTasks(window.localStorage)); setLoadError(false); setReady(true); }
    catch { setLoadError(true); setReady(false); }
    loadLinks();
  }
  function loadLinks() {
    try { setDeliverables(loadDeliverables(window.localStorage)); setDeliverablesError(false); }
    catch { setDeliverablesError(true); }
  }
  useEffect(load, []);
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  function open(task) { opener.current = document.activeElement; setEditing(task); }
  function close() {
    setEditing(undefined);
    requestAnimationFrame(() => (opener.current?.isConnected ? opener.current : addButton.current)?.focus());
  }
  function commit(next, text) {
    saveTasks(window.localStorage, next);
    setTasks(next); setMessage(text); close();
  }
  function save(task) { commit(editing ? tasks.map(t => t.id === task.id ? task : t) : [...tasks, task], focusOwner && task.assignee !== focusOwner ? 'Task saved. It is hidden by the current Focus View.' : 'Task saved.'); }
  function remove(id) { commit(tasks.filter(t => t.id !== id), 'Task deleted.'); }
  function handoff(id, nextOwner) {
    const task = tasks.find(t => t.id === id);
    if (!task || task.assignee === nextOwner || !TEAM.includes(nextOwner)) return;
    const nextTasks = tasks.map(t => t.id === id ? { ...t, assignee: nextOwner } : t);
    saveTasks(window.localStorage, nextTasks);
    setTasks(nextTasks);
    setMessage(`“${task.title}” assigned to ${nextOwner}.`);
  }
  function move(id, status, beforeId = null) {
    const next = moveTask(tasks, id, status, beforeId);
    if (next === tasks) return;
    saveTasks(window.localStorage, next);
    setTasks(next);
    const task = tasks.find(item => item.id === id);
    const label = STAGES.find(stage => stage.id === status).label;
    setMessage(task.status === status ? `“${task.title}” reordered in ${label}.` : `“${task.title}” moved to ${label}.`);
  }
  function saveLink(id, url) {
    const next = deliverables.map(slot => slot.id === id ? { ...slot, url } : slot);
    saveDeliverables(window.localStorage, next);
    setDeliverables(next);
  }
  function changeFocus(owner) {
    setFocusOwner(owner);
    let remembered = false;
    try { remembered = saveFocusOwner(window.localStorage, owner); } catch { /* Keep the current view usable. */ }
    setMessage(remembered ? '' : 'Focus View changed for now, but this browser could not remember your selection.');
  }
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
    let remembered = false;
    try { remembered = saveTheme(window.localStorage, next); } catch { /* Keep the visible preference. */ }
    setMessage(remembered ? '' : 'Theme changed for now, but this browser could not remember your selection.');
  }
  function resetLinks() {
    if (!window.confirm('Reset local deliverable links? This permanently removes this app’s saved links.')) return;
    try { saveDeliverables(window.localStorage, emptyDeliverables()); loadLinks(); }
    catch { setMessage('Could not reset deliverable links. Check browser storage settings and retry.'); }
  }
  function reset() {
    if (!window.confirm('Reset local tasks? This permanently replaces this app’s saved tasks with examples.')) return;
    try { saveTasks(window.localStorage, createExampleTasks()); load(); }
    catch { setMessage('Could not reset storage. Check browser settings and retry.'); }
  }
  return (
    <div className="min-h-screen">
      <a href="#board" className="sr-only z-50 rounded-lg bg-brand-primary p-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to board</a>
      <header className="border-b border-border-subtle bg-surface-card">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-brand-link"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-primary" />Team workspace</div>
            <h1 className="break-words text-xl font-semibold tracking-tight">Vibecoding Project Tracker</h1>
            <p className="mt-1 text-sm leading-6 text-text-muted">Tasks, context and deliverables for your team.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" role="switch" aria-checked={theme === 'dark'} aria-label="Dark mode" onClick={toggleTheme} className="flex min-h-11 items-center gap-2 rounded-lg border border-border-control bg-surface-card px-3 text-sm font-medium hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link"><span aria-hidden="true">{theme === 'dark' ? '☾' : '☀'}</span><span>{theme === 'dark' ? 'Dark' : 'Light'}</span><span aria-hidden="true" className={`relative h-5 w-9 rounded-full transition-colors motion-reduce:transition-none ${theme === 'dark' ? 'bg-brand-primary' : 'bg-border-control'}`}><span className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white transition-transform motion-reduce:transition-none ${theme === 'dark' ? 'translate-x-[18px]' : 'translate-x-0.5'}`} /></span></button>
            <button ref={addButton} disabled={!ready} onClick={() => open(null)} className="min-h-11 rounded-lg bg-brand-primary px-4 py-2 font-medium text-white hover:bg-brand-accent disabled:opacity-50">Add task</button>
          </div>
        </div>
      </header>
      <main id="board" tabIndex={-1} className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        {deliverablesError ? <section aria-labelledby="deliverables-heading" className="mb-8 rounded-xl border border-border-control bg-surface-card p-5"><h2 id="deliverables-heading" className="text-xl font-semibold">Could not load deliverable links</h2><p className="my-3 text-sm">Saved link data is unavailable or invalid. Nothing has been overwritten.</p><div className="flex flex-wrap gap-3"><button onClick={loadLinks} className="min-h-11 rounded-lg border border-border-control px-4">Retry links</button><button onClick={resetLinks} className="min-h-11 rounded-lg border border-border-control px-4 text-due-overdue">Reset local links</button></div></section> : deliverables.length > 0 && <DeliverablesBoard items={deliverables} onSave={saveLink} />}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Project board</h2>
            <p className="mt-1 text-sm text-text-muted">{focusOwner ? 'Focus View sorts this engineer’s tasks by due date within each stage. Edit a task to change its status.' : 'Drag cards by the six-dot grip to move or reorder them. You can also change Status when editing a task.'}</p>
          </div>
          <p className="text-sm text-text-muted"><span className="font-semibold text-text-primary">{visibleTasks.length}</span> {focusOwner ? `of ${tasks.length} tasks` : 'tasks'} <span aria-hidden="true">·</span> {TEAM.length} demo members</p>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle bg-surface-card px-4 py-3">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-stage-todo text-brand-link">◎</span>
          <div className="min-w-0 flex-1"><h3 className="font-semibold">Focus View</h3><p className="text-sm text-text-muted">See one engineer’s work in this browser.</p></div>
          <label htmlFor="focus-owner" className="text-sm font-medium">Engineer</label>
          <select id="focus-owner" value={focusOwner} onChange={event => changeFocus(event.target.value)} className="min-h-11 rounded-lg border border-border-control bg-surface-input px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link">
            <option value="">All tasks</option>
            {TEAM.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
          {focusOwner && <button type="button" onClick={() => changeFocus('')} className="min-h-11 rounded-lg px-3 text-sm font-medium text-brand-link hover:bg-surface-hover">Show all tasks</button>}
        </div>
        <p role="status" className="mb-3 text-sm text-text-muted">{message}</p>
        {focusOwner && ready && !loadError && visibleTasks.length === 0 && <p className="mb-4 rounded-lg border border-border-subtle bg-surface-card p-4 text-sm">No tasks assigned to {focusOwner}. Choose another engineer or show all tasks.</p>}
        {loadError ? <div role="alert" className="rounded-lg border border-border-control bg-surface-card p-5"><h3 className="font-semibold">Could not load saved tasks</h3><p className="my-3">Browser storage is unavailable or contains invalid data. Nothing has been overwritten.</p><div className="flex flex-wrap gap-3"><button onClick={load} className="min-h-11 rounded border border-border-control px-4">Retry</button><button onClick={reset} className="min-h-11 rounded border border-border-control px-4 text-due-overdue">Reset local tasks</button></div></div> : ready ? <Board tasks={visibleTasks} onEdit={open} onHandoff={handoff} onMove={move} now={now} allowDrag={!focusOwner} /> : <p>Loading tasks…</p>}
        <aside aria-label="Prototype information" className="mt-6 border-t border-border-subtle pt-4 text-sm leading-6 text-text-muted">
          <p><strong className="font-medium text-text-primary">Example workspace.</strong> The initial tasks and team members are fictional.</p>
          <p>Saved in this browser. Changes are not shared across devices.</p>
        </aside>
      </main>
      {editing !== undefined && <TaskModal task={editing} onClose={close} onSave={save} onDelete={remove} />}
    </div>
  );
}
