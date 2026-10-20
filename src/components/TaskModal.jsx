import { useEffect, useRef, useState } from 'react';
import { STAGES, TEAM } from '../data/tasks';
import { localDate, validDate } from '../data/storage';
const control = 'mt-1 min-h-11 w-full rounded-lg border border-border-control bg-white px-3 py-2 text-sm';
const secondary = 'min-h-11 rounded-lg border border-border-control px-4 py-2 text-sm font-medium';
export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const dialog = useRef(null);
  const title = useRef(null);
  const cancelDelete = useRef(null);
  const [form, setForm] = useState(() => task || { title:'', description:'', type:'feature', status:'todo', assignee:TEAM[0], dueDate:'' });
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => { dialog.current.showModal(); title.current.focus(); }, []);
  useEffect(() => { if (deleting) cancelDelete.current.focus(); else title.current?.focus(); }, [deleting]);
  function change(e) { setForm({ ...form, [e.target.name]:e.target.value }); }
  function save(e) {
    e.preventDefault(); setError(''); setTitleError(false);
    if (!form.title.trim()) { setTitleError(true); title.current.focus(); return; }
    if (form.dueDate && !validDate(form.dueDate)) { setError('Enter a valid due date.'); return; }
    const next = { ...form, title:form.title.trim(), dueDate:form.dueDate || null, id:task?.id || crypto.randomUUID(), createdDate:task?.createdDate || localDate(), context:task?.context || '', contextTool:task?.contextTool || null, contextUpdatedAt:task?.contextUpdatedAt || null };
    try { onSave(next); } catch { setError("Couldn't save in this browser. Your changes are still here. Check storage settings and try Save task again."); }
  }
  function remove() { try { onDelete(task.id); } catch { setError("Couldn't delete this task. It has not been removed. Check storage settings and try again."); } }
  return <dialog ref={dialog} aria-labelledby="modal-title" onCancel={e => { e.preventDefault(); onClose(); }} className="m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-[640px] overflow-y-auto rounded-xl bg-white p-0 text-text-primary shadow-xl backdrop:bg-black/40">
    {deleting ? <div className="p-6">
      <h2 id="modal-title" className="text-xl font-semibold">Delete task?</h2>
      <p className="my-4 break-words">Delete “{task.title}”? This cannot be undone.</p>
      {error && <p role="alert" className="mb-4 text-due-overdue">{error}</p>}
      <div className="flex flex-wrap justify-end gap-3"><button ref={cancelDelete} className={secondary} onClick={() => {setDeleting(false);setError('');}}>Cancel</button><button className="min-h-11 rounded-lg bg-due-overdue px-4 py-2 text-white" onClick={remove}>Delete task</button></div>
    </div> : <form onSubmit={save} noValidate className="p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3"><h2 id="modal-title" className="text-xl font-semibold">{task ? 'Edit task' : 'Add task'}</h2><button type="button" onClick={onClose} className={secondary}>Close</button></div>
      <p className="mt-2 text-sm text-text-muted">Changes are saved when you select Save task. Title and assignee are required.</p>
      <div className="mt-5 space-y-4">
        <div><label htmlFor="task-title" className="text-sm font-medium">Title (required)</label><input ref={title} id="task-title" name="title" value={form.title} onChange={change} required aria-invalid={titleError} aria-describedby={titleError ? 'title-error' : undefined} className={control} />{titleError && <p id="title-error" className="mt-1 text-sm text-due-overdue">Enter a task title.</p>}</div>
        <div><label htmlFor="task-description" className="text-sm font-medium">Description</label><textarea id="task-description" name="description" value={form.description} onChange={change} rows={3} className={control} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="task-type" className="text-sm font-medium">Type</label><select id="task-type" name="type" value={form.type} onChange={change} className={control}><option value="feature">Feature</option><option value="bug">Bug</option></select><span aria-hidden="true" className={`mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${form.type === 'bug' ? 'bg-type-bug-soft text-type-bug' : 'bg-type-feature-soft text-type-feature'}`}>{form.type === 'bug' ? '!' : '◆'} {form.type === 'bug' ? 'Bug' : 'Feature'}</span></div>
          <div><label htmlFor="task-status" className="text-sm font-medium">Status</label><select id="task-status" name="status" value={form.status} onChange={change} className={control}>{STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
          <div><label htmlFor="task-assignee" className="text-sm font-medium">Assignee (required)</label><select id="task-assignee" name="assignee" value={form.assignee} onChange={change} required className={control}>{TEAM.map(name => <option key={name}>{name}</option>)}</select></div>
          <div><label htmlFor="task-due" className="text-sm font-medium">Due date (optional)</label><input id="task-due" type="date" name="dueDate" value={form.dueDate || ''} onChange={change} className={control} /></div>
        </div>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-due-overdue">{error}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border-subtle pt-4">
        {task && <button type="button" onClick={() => {setDeleting(true);setError('');}} className={`${secondary} text-due-overdue`}>Delete task</button>}
        <div className="ml-auto flex flex-wrap gap-3"><button type="button" onClick={onClose} className={secondary}>Cancel</button><button type="submit" className="min-h-11 rounded-lg bg-brand-primary px-4 py-2 font-medium text-white hover:bg-brand-accent">Save task</button></div>
      </div>
    </form>}
  </dialog>;
}
