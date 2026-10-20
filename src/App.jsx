import { useEffect, useRef, useState } from 'react';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import { loadTasks, saveTasks } from './data/storage';
import { createExampleTasks, TEAM } from './data/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(undefined);
  const [message, setMessage] = useState('');
  const [now, setNow] = useState(() => new Date());
  const opener = useRef(null);
  const addButton = useRef(null);
  function load() {
    try { setTasks(loadTasks(window.localStorage)); setLoadError(false); setReady(true); }
    catch { setLoadError(true); setReady(false); }
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
  function save(task) { commit(editing ? tasks.map(t => t.id === task.id ? task : t) : [...tasks, task], 'Task saved.'); }
  function remove(id) { commit(tasks.filter(t => t.id !== id), 'Task deleted.'); }
  function handoff(id, nextOwner) {
    const task = tasks.find(t => t.id === id);
    if (!task || task.assignee === nextOwner || !TEAM.includes(nextOwner)) return;
    const nextTasks = tasks.map(t => t.id === id ? { ...t, assignee: nextOwner } : t);
    saveTasks(window.localStorage, nextTasks);
    setTasks(nextTasks);
    setMessage(`“${task.title}” assigned to ${nextOwner}.`);
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
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-brand-primary"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-primary" />Team workspace</div>
            <h1 className="break-words text-xl font-semibold tracking-tight">Vibecoding Project Tracker</h1>
            <p className="mt-1 text-sm leading-6 text-text-muted">Tasks, context and deliverables for your team.</p>
          </div>
          <button ref={addButton} disabled={!ready} onClick={() => open(null)} className="min-h-11 rounded-lg bg-brand-primary px-4 py-2 font-medium text-white hover:bg-brand-accent disabled:opacity-50">Add task</button>
        </div>
      </header>
      <main id="board" tabIndex={-1} className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Project board</h2>
            <p className="mt-1 text-sm text-text-muted">A shared view of what comes next.</p>
          </div>
          <p className="text-sm text-text-muted"><span className="font-semibold text-text-primary">{tasks.length}</span> tasks <span aria-hidden="true">·</span> {TEAM.length} demo members</p>
        </div>
        <p role="status" className="mb-3 text-sm text-text-muted">{message}</p>
        {loadError ? <div role="alert" className="rounded-lg border border-border-control bg-white p-5"><h3 className="font-semibold">Could not load saved tasks</h3><p className="my-3">Browser storage is unavailable or contains invalid data. Nothing has been overwritten.</p><div className="flex flex-wrap gap-3"><button onClick={load} className="min-h-11 rounded border border-border-control px-4">Retry</button><button onClick={reset} className="min-h-11 rounded border border-border-control px-4 text-due-overdue">Reset local tasks</button></div></div> : ready ? <Board tasks={tasks} onEdit={open} onHandoff={handoff} now={now} /> : <p>Loading tasks…</p>}
        <aside aria-label="Prototype information" className="mt-6 border-t border-border-subtle pt-4 text-sm leading-6 text-text-muted">
          <p><strong className="font-medium text-text-primary">Example workspace.</strong> The initial tasks and team members are fictional.</p>
          <p>Saved in this browser. Changes are not shared across devices.</p>
        </aside>
      </main>
      {editing !== undefined && <TaskModal task={editing} onClose={close} onSave={save} onDelete={remove} />}
    </div>
  );
}
