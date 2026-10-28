import { useEffect, useRef, useState } from 'react';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import DeliverablesBoard from './components/DeliverablesBoard';
import TeamManager from './components/TeamManager';
import { loadTasks, saveTasks } from './data/storage';
import { createExampleTasks, STAGES, TEAM } from './data/tasks';
import { emptyDeliverables, loadDeliverables, saveDeliverables } from './data/deliverables';
import { moveTask } from './data/taskMovement';
import { focusTasks, loadFocusOwner, saveFocusOwner } from './data/focusView';
import { applyTheme, loadTheme, saveTheme } from './data/theme';
import { loadSortMode, saveSortMode, sortTasks } from './data/taskOrder';
import { loadProfiles, loadTeam, saveProfiles, saveTeam, validateProfile, validateTeam } from './data/team';

export default function App() {
  const [enteredDemo, setEnteredDemo] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [teamError, setTeamError] = useState(false);
  const [managingTeam, setManagingTeam] = useState(false);
  const [deliverables, setDeliverables] = useState([]);
  const [deliverablesError, setDeliverablesError] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(undefined);
  const [message, setMessage] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [focusOwner, setFocusOwner] = useState(() => { try { return loadFocusOwner(window.localStorage, loadTeam(window.localStorage)); } catch { return ''; } });
  const [theme, setTheme] = useState(() => { try { return loadTheme(window.localStorage); } catch { return 'light'; } });
  const [sortMode, setSortMode] = useState(() => { try { return loadSortMode(window.localStorage); } catch { return 'priority'; } });
  const visibleTasks = sortTasks(focusTasks(tasks, focusOwner), sortMode);
  const opener = useRef(null);
  const demoButton = useRef(null);
  const addButton = useRef(null);
  const teamButton = useRef(null);
  function load() {
    let roster;
    try { roster = loadTeam(window.localStorage); setProfiles(loadProfiles(window.localStorage)); setTeamError(false); }
    catch { setTeamError(true); setLoadError(true); setReady(false); loadLinks(); return; }
    try {
      setMembers(roster);
      setTasks(loadTasks(window.localStorage, roster)); setLoadError(false); setReady(true);
    } catch { setLoadError(true); setReady(false); }
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
    saveTasks(window.localStorage, next, members);
    setTasks(next); setMessage(text); close();
  }
  function save(task) { commit(editing ? tasks.map(t => t.id === task.id ? task : t) : [...tasks, task], focusOwner && task.assignee !== focusOwner ? 'Task saved. It is hidden by the current Focus View.' : 'Task saved.'); }
  function remove(id) { commit(tasks.filter(t => t.id !== id), 'Task deleted.'); }
  function handoff(id, nextOwner) {
    const task = tasks.find(t => t.id === id);
    if (!task || task.assignee === nextOwner || !members.includes(nextOwner)) return;
    const nextTasks = tasks.map(t => t.id === id ? { ...t, assignee: nextOwner } : t);
    saveTasks(window.localStorage, nextTasks, members);
    setTasks(nextTasks);
    setMessage(`“${task.title}” assigned to ${nextOwner}.`);
  }
  function move(id, status, beforeId = null) {
    const next = moveTask(tasks, id, status, beforeId);
    if (next === tasks) return;
    saveTasks(window.localStorage, next, members);
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
    try { remembered = saveFocusOwner(window.localStorage, owner, members); } catch { /* Keep the current view usable. */ }
    setMessage(remembered ? '' : 'Focus View changed for now, but this browser could not remember your selection.');
  }
  function changeSort(mode) {
    setSortMode(mode);
    let remembered = false;
    try { remembered = saveSortMode(window.localStorage, mode); } catch { /* Keep the current order usable. */ }
    setMessage(remembered ? '' : 'Order changed for now, but this browser could not remember your selection.');
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
    try { saveTasks(window.localStorage, createExampleTasks().map(task => members.includes(task.assignee) ? task : { ...task, assignee:members[0] }), members); load(); }
    catch { setMessage('Could not reset storage. Check browser settings and retry.'); }
  }
  function resetWorkspace() {
    if (!window.confirm('Reset local team and tasks? This permanently replaces this browser’s saved roster and tasks with examples.')) return;
    try { saveTasks(window.localStorage, createExampleTasks(), TEAM); saveTeam(window.localStorage, TEAM); setFocusOwner(''); saveFocusOwner(window.localStorage, '', TEAM); load(); }
    catch { setMessage('Could not reset local team and tasks. Check browser storage settings and retry.'); }
  }
  function closeTeam() { setManagingTeam(false); requestAnimationFrame(() => teamButton.current?.focus()); }
  function addMember(name, profile) {
    if (!name || name.length < 2) throw new Error('Enter a name of at least two characters.');
    const checked = validateProfile(profile);
    if (!checked.email) throw new Error('Enter an email address.');
    let next;
    try { next = validateTeam([...members, name]); }
    catch { throw new Error('Use a unique name of no more than 60 characters.'); }
    try { saveProfiles(window.localStorage, { ...profiles, [name]:checked }); saveTeam(window.localStorage, next); }
    catch { throw new Error('Could not save this member in the browser.'); }
    setProfiles({ ...profiles, [name]:checked }); setMembers(next); setMessage(`${name} added to the team.`);
  }
  function updateMember(name, profile) {
    const checked = validateProfile(profile);
    const next = { ...profiles, [name]:checked };
    try { saveProfiles(window.localStorage, next); }
    catch { throw new Error('Could not save member details in the browser.'); }
    setProfiles(next); setMessage(`${name}’s details saved.`);
  }
  function removeMember(name) {
    if (tasks.some(task => task.assignee === name)) throw new Error(`Reassign ${name}’s tasks first.`);
    if (members.length === 1) throw new Error('Keep at least one member.');
    const next = members.filter(member => member !== name);
    try { saveTeam(window.localStorage, next); }
    catch { throw new Error('Could not remove this member from browser storage.'); }
    if (focusOwner === name) { setFocusOwner(''); try { saveFocusOwner(window.localStorage, '', next); } catch { /* An invalid old preference is ignored on reload. */ } }
    const remaining = { ...profiles }; delete remaining[name];
    try { saveProfiles(window.localStorage, remaining); setProfiles(remaining); } catch { /* An orphaned profile is not shown. */ }
    setMembers(next); setMessage(`${name} removed from the team.`);
  }
  if (!enteredDemo) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-xl border border-border-subtle bg-surface-card p-6 shadow-sm sm:p-8">
          <p className="mb-3 text-sm font-medium text-brand-link">Vibecoding Project Tracker</p>
          <h1 className="text-2xl font-semibold tracking-tight">Demo login</h1>
          <p id="demo-explanation" className="mt-4 leading-7">No details are needed. These fields are for display only. Press Log in to use the demo as Alex Morgan.</p>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="demo-email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="demo-email" type="email" disabled placeholder="Not needed for demo" aria-describedby="demo-explanation" className="min-h-11 w-full rounded-lg border border-border-control bg-surface-column px-3 text-text-muted disabled:cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="demo-password" className="mb-1 block text-sm font-medium">Password</label>
              <input id="demo-password" type="password" disabled placeholder="Not needed for demo" aria-describedby="demo-explanation" className="min-h-11 w-full rounded-lg border border-border-control bg-surface-column px-3 text-text-muted disabled:cursor-not-allowed" />
            </div>
          </div>
          <button
            type="button"
            ref={demoButton}
            autoFocus
            onClick={() => {
              setEnteredDemo(true);
              requestAnimationFrame(() => document.getElementById('workspace-heading')?.focus());
            }}
            className="mt-6 min-h-11 w-full rounded-lg bg-brand-primary px-4 py-2 font-medium text-white hover:bg-brand-accent"
          >Log in</button>
          <p className="mt-5 text-sm leading-6 text-text-muted">Demo only: this does not authenticate you. Tasks and team members are examples, and changes are saved only in this browser.</p>
        </div>
      </main>
    );
  }
  return (
    <div className="min-h-screen">
      <a href="#board" className="sr-only z-50 rounded-lg bg-brand-primary p-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to board</a>
      <header className="border-b border-border-subtle bg-surface-card">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-brand-link"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-primary" />Team workspace</div>
            <h1 id="workspace-heading" tabIndex={-1} className="break-words text-xl font-semibold tracking-tight">Vibecoding Project Tracker</h1>
            <p className="mt-1 text-sm leading-6 text-text-muted">Tasks, context and deliverables for your team.</p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-3">
            <button ref={teamButton} type="button" disabled={!ready} onClick={() => setManagingTeam(true)} className="min-h-11 rounded-lg border border-border-control bg-surface-card px-3 text-sm font-medium hover:bg-surface-hover disabled:opacity-50">Manage team</button>
            <button type="button" role="switch" aria-checked={theme === 'dark'} aria-label="Dark mode" onClick={toggleTheme} className="flex min-h-11 items-center gap-2 rounded-lg border border-border-control bg-surface-card px-3 text-sm font-medium hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link"><span aria-hidden="true">{theme === 'dark' ? '☾' : '☀'}</span><span>{theme === 'dark' ? 'Dark' : 'Light'}</span><span aria-hidden="true" className={`relative h-5 w-9 rounded-full transition-colors motion-reduce:transition-none ${theme === 'dark' ? 'bg-brand-primary' : 'bg-border-control'}`}><span className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white transition-transform motion-reduce:transition-none ${theme === 'dark' ? 'translate-x-[18px]' : 'translate-x-0.5'}`} /></span></button>
            <button ref={addButton} disabled={!ready} onClick={() => open(null)} className="min-h-11 rounded-lg bg-brand-primary px-4 py-2 font-medium text-white hover:bg-brand-accent disabled:opacity-50">Add task</button>
            <button type="button" onClick={() => { setEnteredDemo(false); requestAnimationFrame(() => demoButton.current?.focus()); }} className="min-h-11 rounded-lg border border-border-control bg-surface-card px-3 text-sm font-medium hover:bg-surface-hover">Log out</button>
          </div>
        </div>
      </header>
      <main id="board" tabIndex={-1} className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        {deliverablesError ? <section aria-labelledby="deliverables-heading" className="mb-8 rounded-xl border border-border-control bg-surface-card p-5"><h2 id="deliverables-heading" className="text-xl font-semibold">Could not load deliverable links</h2><p className="my-3 text-sm">Saved link data is unavailable or invalid. Nothing has been overwritten.</p><div className="flex flex-wrap gap-3"><button onClick={loadLinks} className="min-h-11 rounded-lg border border-border-control px-4">Retry links</button><button onClick={resetLinks} className="min-h-11 rounded-lg border border-border-control px-4 text-due-overdue">Reset local links</button></div></section> : deliverables.length > 0 && <DeliverablesBoard items={deliverables} onSave={saveLink} />}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Project board</h2>
            <p className="mt-1 text-sm text-text-muted">{sortMode === 'manual' && !focusOwner ? 'Drag cards between stages or reorder them within a stage. Click a six-dot grip for move options.' : `Cards are ordered by ${sortMode === 'priority' ? 'priority' : sortMode === 'due' ? 'due date' : 'saved order'} within each stage. Drag cards between stages; choose Manual on the full board to reorder within a stage.`}</p>
          </div>
          <p className="text-sm text-text-muted"><span className="font-semibold text-text-primary">{visibleTasks.length}</span> {focusOwner ? `of ${tasks.length} tasks` : 'tasks'} <span aria-hidden="true">·</span> {members.length} {members.length === 1 ? 'member' : 'members'}</p>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle bg-surface-card px-4 py-3 sm:flex-nowrap xl:flex-wrap">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-stage-todo text-brand-link">◎</span>
          <div className="min-w-0 sm:flex-1 xl:flex-none"><h3 className="font-semibold">Focus View</h3><p className="text-sm text-text-muted">Filter by engineer or sort tasks.</p></div>
          <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-auto sm:shrink-0">
            <div className="flex items-center gap-2">
              <label htmlFor="focus-owner" className="text-sm font-medium">Engineer</label>
              <span className="relative">
                <select id="focus-owner" value={focusOwner} onChange={event => changeFocus(event.target.value)} className="min-h-11 w-36 appearance-none rounded-lg border border-border-control bg-surface-input py-2 pl-3 pr-9 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link">
                  <option value="">All tasks</option>
                  {members.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-text-muted"><path d="m3 6 5 5 5-5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="task-order" className="text-sm font-medium">Order</label>
              <span className="relative">
                <select id="task-order" value={sortMode} onChange={event => changeSort(event.target.value)} className="min-h-11 w-28 appearance-none rounded-lg border border-border-control bg-surface-input py-2 pl-3 pr-9 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link"><option value="priority">Priority</option><option value="due">Due date</option><option value="manual">Manual</option></select>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-text-muted"><path d="m3 6 5 5 5-5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
          </div>
          {focusOwner && <button type="button" onClick={() => changeFocus('')} className="min-h-11 rounded-lg px-3 text-sm font-medium text-brand-link hover:bg-surface-hover">Show all tasks</button>}
        </div>
        <p role="status" className="mb-3 text-sm text-text-muted">{message}</p>
        {focusOwner && ready && !loadError && visibleTasks.length === 0 && <p className="mb-4 rounded-lg border border-border-subtle bg-surface-card p-4 text-sm">No tasks assigned to {focusOwner}. Choose another engineer or show all tasks.</p>}
        {loadError ? <div role="alert" className="rounded-lg border border-border-control bg-surface-card p-5"><h3 className="font-semibold">Could not load saved {teamError ? 'team or tasks' : 'tasks'}</h3><p className="my-3">Browser storage is unavailable or contains invalid data. Nothing has been overwritten.</p><div className="flex flex-wrap gap-3"><button onClick={load} className="min-h-11 rounded border border-border-control px-4">Retry</button><button onClick={teamError ? resetWorkspace : reset} className="min-h-11 rounded border border-border-control px-4 text-due-overdue">Reset local {teamError ? 'team and tasks' : 'tasks'}</button></div></div> : ready ? <Board tasks={visibleTasks} members={members} onEdit={open} onHandoff={handoff} onMove={move} now={now} allowReorder={!focusOwner && sortMode === 'manual'} /> : <p>Loading tasks…</p>}
        <aside aria-label="Prototype information" className="mt-6 border-t border-border-subtle pt-4 text-sm leading-6 text-text-muted">
          <p>Demo view: Alex Morgan. No account is signed in.</p>
          <p><strong className="font-medium text-text-primary">Example workspace.</strong> The initial tasks and team members are fictional.</p>
          <p>Saved in this browser. Changes are not shared across devices.</p>
        </aside>
      </main>
      {editing !== undefined && <TaskModal task={editing} members={members} onClose={close} onSave={save} onDelete={remove} />}
      {managingTeam && <TeamManager members={members} profiles={profiles} tasks={tasks} onAdd={addMember} onUpdate={updateMember} onRemove={removeMember} onClose={closeTeam} />}
    </div>
  );
}
