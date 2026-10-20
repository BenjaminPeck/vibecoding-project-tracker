import { useEffect, useRef, useState } from 'react';

const field = 'mt-1.5 min-h-11 w-full rounded-lg border border-border-control bg-surface-input px-3 text-sm placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link';
const quietButton = 'min-h-11 rounded-lg px-3 text-sm font-medium text-text-muted hover:bg-surface-hover hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link';
const initials = name => name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();

export default function TeamManager({ members, profiles, tasks, onAdd, onUpdate, onRemove, onClose }) {
  const dialog = useRef(null);
  const input = useRef(null);
  const editButtons = useRef({});
  const [draft, setDraft] = useState({ name:'', email:'', gitlab:'' });
  const [editing, setEditing] = useState('');
  const [details, setDetails] = useState({ email:'', gitlab:'' });
  const [error, setError] = useState('');
  const [editError, setEditError] = useState('');
  useEffect(() => { dialog.current.showModal(); input.current.focus(); }, []);
  function add(event) {
    event.preventDefault();
    try { onAdd(draft.name.trim(), { email:draft.email, gitlab:draft.gitlab }); setDraft({ name:'', email:'', gitlab:'' }); setError(''); input.current.focus(); }
    catch (failure) { setError(failure.message); }
  }
  function saveDetails(event) {
    event.preventDefault();
    try { onUpdate(editing, details); const member = editing; setEditing(''); setEditError(''); requestAnimationFrame(() => editButtons.current[member]?.focus()); }
    catch (failure) { setEditError(failure.message); }
  }
  function remove(member) {
    try { onRemove(member); setError(''); requestAnimationFrame(() => input.current?.focus()); }
    catch (failure) { setError(failure.message); }
  }
  return <dialog ref={dialog} aria-labelledby="team-title" aria-describedby="team-description" onCancel={event => { event.preventDefault(); onClose(); }} className="m-auto max-h-[min(90vh,840px)] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto rounded-2xl border border-border-subtle bg-surface-card p-0 text-text-primary shadow-2xl backdrop:bg-black/60">
    <div className="flex items-start justify-between gap-4 border-b border-border-subtle px-5 py-5 sm:px-7">
      <div className="min-w-0"><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-link">Workspace</p><h2 id="team-title" className="text-2xl font-semibold tracking-tight">Manage team</h2><p id="team-description" className="mt-1 text-sm leading-6 text-text-muted">Keep ownership and contact details in one place.</p></div>
      <button type="button" onClick={onClose} aria-label="Close team manager" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border-subtle text-text-muted hover:bg-surface-hover hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg></button>
    </div>
    <div className="space-y-6 px-5 py-6 sm:px-7">
      <section aria-labelledby="add-member-title" className="rounded-xl border border-border-subtle bg-surface-column p-4 sm:p-5">
        <div className="mb-4"><h3 id="add-member-title" className="font-semibold">Add a member</h3><p className="mt-1 text-sm text-text-muted">Their name will appear in assignment and Focus View.</p></div>
        <form onSubmit={add} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="member-name" className="text-sm font-medium">Full name <span aria-hidden="true" className="text-due-overdue">*</span></label><input ref={input} id="member-name" value={draft.name} onChange={event => setDraft({ ...draft, name:event.target.value })} maxLength={60} autoComplete="name" required className={field} /></div>
            <div><label htmlFor="member-email" className="text-sm font-medium">Email <span aria-hidden="true" className="text-due-overdue">*</span></label><input id="member-email" type="email" value={draft.email} onChange={event => setDraft({ ...draft, email:event.target.value })} maxLength={254} autoComplete="email" required className={field} /></div>
          </div>
          <div><label htmlFor="member-gitlab" className="text-sm font-medium">GitLab profile <span className="font-normal text-text-muted">(optional)</span></label><input id="member-gitlab" type="url" placeholder="https://gitlab.com/username" value={draft.gitlab} onChange={event => setDraft({ ...draft, gitlab:event.target.value })} className={field} /></div>
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="max-w-sm text-xs leading-5 text-text-muted">Saved in this browser. GitLab links open profiles; they do not connect accounts.</p><button className="min-h-11 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link">+ Add member</button></div>
        </form>
      </section>
      {error && <p role="alert" className="rounded-lg border border-due-overdue bg-due-overdue-soft p-3 text-sm text-due-overdue">{error}</p>}
      <section aria-labelledby="members-title">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2"><h3 id="members-title" className="text-lg font-semibold">Team members <span className="ml-1 rounded-full bg-stage-todo px-2 py-0.5 text-sm font-medium text-brand-link">{members.length}</span></h3><p className="text-xs text-text-muted">Reassign tasks before removing a member.</p></div>
        <ul className="divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface-card">{members.map(member => {
          const count = tasks.filter(task => task.assignee === member).length;
          const profile = profiles[member] || { email:'', gitlab:'' };
          return <li key={member} className="p-3 sm:px-4">
            <div className="flex flex-wrap items-center gap-3">
              <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stage-todo text-sm font-semibold text-brand-link">{initials(member)}</span>
              <div className="min-w-0 flex-1"><strong className="block break-words text-sm font-semibold">{member}</strong><p className="break-all text-xs text-text-muted">{profile.email || 'No email added'}</p></div>
              <span className="rounded-full bg-surface-column px-2.5 py-1 text-xs font-medium text-text-muted">{count} {count === 1 ? 'task' : 'tasks'}</span>
              <div className="flex items-center gap-1"><button ref={element => { editButtons.current[member] = element; }} type="button" onClick={() => { setEditing(member); setDetails(profile); setEditError(''); }} className={quietButton} aria-label={`Edit ${member}’s details`}>Edit</button><button type="button" disabled={count > 0 || members.length === 1} title={count ? `Reassign ${member}’s tasks before removing` : members.length === 1 ? 'Keep at least one member' : undefined} onClick={() => remove(member)} className={`${quietButton} text-due-overdue hover:text-due-overdue disabled:cursor-not-allowed disabled:opacity-40`} aria-label={`Remove ${member}`}>Remove</button></div>
            </div>
            {profile.gitlab && <a href={profile.gitlab} target="_blank" rel="noopener noreferrer" className="ml-14 mt-1 inline-block break-all text-xs font-medium text-brand-link underline underline-offset-2">View GitLab profile for {member} ↗</a>}
            {editing === member && <form onSubmit={saveDetails} className="ml-0 mt-4 space-y-3 rounded-lg bg-surface-column p-4 sm:ml-14"><h4 className="text-sm font-semibold">Edit {member}’s details</h4><div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor="edit-email" className="text-sm font-medium">Email</label><input id="edit-email" type="email" value={details.email} onChange={event => setDetails({ ...details, email:event.target.value })} className={field} /></div><div><label htmlFor="edit-gitlab" className="text-sm font-medium">GitLab profile URL</label><input id="edit-gitlab" type="url" value={details.gitlab} onChange={event => setDetails({ ...details, gitlab:event.target.value })} className={field} /></div></div>{editError && <p role="alert" className="text-sm text-due-overdue">{editError}</p>}<div className="flex justify-end gap-2"><button type="button" onClick={() => { setEditing(''); setEditError(''); requestAnimationFrame(() => editButtons.current[member]?.focus()); }} className={quietButton}>Cancel</button><button className="min-h-11 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-accent">Save details</button></div></form>}
          </li>;
        })}</ul>
      </section>
    </div>
  </dialog>;
}
