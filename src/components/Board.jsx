import { useEffect, useRef, useState } from 'react';
import { STAGES, TEAM } from '../data/tasks';
import { dueLabel, dueShortLabel, dueState } from '../data/dueDate';

const dueClasses = {
  safe: 'bg-due-safe-soft text-due-safe',
  imminent: 'bg-due-overdue-soft text-due-overdue',
  warning: 'bg-due-warning-soft text-due-warning',
  overdue: 'bg-due-overdue-soft text-due-overdue',
  neutral: 'bg-due-neutral-soft text-due-neutral',
};

function TaskCard({ task, onEdit, onHandoff, now }) {
  const initials = task.assignee.split(' ').map(part => part[0]).join('');
  const isBug = task.type === 'bug';
  const urgency = dueState(task, now);
  const [handoffError, setHandoffError] = useState('');
  const handoffMenu = useRef(null);
  const ownerButton = useRef(null);
  useEffect(() => {
    function dismiss(event) {
      if (handoffMenu.current?.open && !handoffMenu.current.contains(event.target)) handoffMenu.current.open = false;
    }
    function escape(event) {
      if (event.key === 'Escape' && handoffMenu.current?.open) {
        handoffMenu.current.open = false;
        ownerButton.current?.focus();
        event.stopPropagation();
      }
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  function handoff(nextOwner) {
    if (nextOwner === task.assignee) return;
    try {
      onHandoff(task.id, nextOwner);
      setHandoffError('');
      handoffMenu.current.open = false;
      ownerButton.current?.focus();
    } catch {
      setHandoffError(`Couldn't hand off “${task.title}”. The owner is still ${task.assignee}. Check browser storage and try again.`);
    }
  }
  return (
    <li onClick={event => {
      if (event.target.closest('button, a, input, select, textarea, summary')) return;
      event.currentTarget.querySelector('button')?.focus();
      onEdit(task);
    }} className={`min-w-0 cursor-pointer rounded-[10px] border border-border-subtle border-l-[3px] bg-surface-card p-4 transition-colors hover:border-border-control motion-reduce:transition-none ${isBug ? 'border-l-type-bug' : 'border-l-type-feature'}`}>
      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${isBug ? 'bg-type-bug-soft text-type-bug' : 'bg-type-feature-soft text-type-feature'}`}>
        <span aria-hidden="true">{isBug ? '!' : '◆'}</span>{isBug ? 'Bug' : 'Feature'}
      </span>
      <h4 className="mt-2 break-words text-sm font-semibold leading-6"><button onClick={() => onEdit(task)} className="min-h-11 w-full break-words text-left hover:text-brand-primary">{task.title}</button></h4>
      <p className="mt-2 break-words text-sm leading-6 text-text-muted">{task.description}</p>
      <div className="mt-4 flex min-w-0 items-center justify-between gap-2 border-t border-border-subtle pt-2">
        <details ref={handoffMenu} className="relative min-w-0 flex-1">
          <summary ref={ownerButton} className="flex min-h-11 w-fit max-w-full cursor-pointer list-none items-center gap-2 rounded-lg px-1 text-left text-sm hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary [&::-webkit-details-marker]:hidden" aria-label={`Assigned to ${task.assignee}. Hand off “${task.title}”`}>
            <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-column text-xs font-semibold">{initials}</span>
            <span className="min-w-0 truncate font-medium">{task.assignee}</span>
            <span aria-hidden="true" className="text-text-muted">⌄</span>
          </summary>
          <div className="absolute left-0 top-full z-20 mt-1 w-max min-w-48 max-w-[calc(100vw-3rem)] rounded-lg border border-border-subtle bg-white p-1 shadow-lg">
            <p className="px-3 py-2 text-xs font-semibold text-text-muted">Hand off to…</p>
            {TEAM.filter(name => name !== task.assignee).map(name => <button key={name} type="button" onClick={() => handoff(name)} className="block min-h-11 w-full rounded-md px-3 py-2 text-left text-sm hover:bg-surface-hover">{name}</button>)}
          </div>
        </details>
        <span className={`shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${dueClasses[urgency]}`} aria-label={dueLabel(task, urgency)} title={dueLabel(task, urgency)}>{dueShortLabel(task, urgency)}</span>
      </div>
      {handoffError && <p role="alert" id={`handoff-error-${task.id}`} className="mt-2 text-sm text-due-overdue">{handoffError}</p>}
    </li>
  );
}

export default function Board({ tasks, onEdit, onHandoff, now }) {
  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STAGES.map(stage => {
        const items = tasks.filter(task => task.status === stage.id);
        return (
          <section key={stage.id} aria-labelledby={`stage-${stage.id}`} className="min-w-0 rounded-xl bg-surface-column p-3">
            <div className={`mb-3 rounded-lg px-3 py-3 ${stage.surface}`}>
              <div className="flex items-center justify-between gap-2">
                <h3 id={`stage-${stage.id}`} className="font-semibold">{stage.label}</h3>
                <span className="text-sm font-semibold tabular-nums" aria-label={`${items.length} ${items.length === 1 ? 'task' : 'tasks'}`}>{items.length}</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{stage.hint}</p>
            </div>
            {items.length ? <ul className="space-y-3">{items.map(task => <TaskCard key={task.id} task={task} onEdit={onEdit} onHandoff={onHandoff} now={now} />)}</ul> :
              <p className="rounded-lg border border-dashed border-border-control p-5 text-sm text-text-muted">No tasks here yet.</p>}
          </section>
        );
      })}
    </div>
  );
}
