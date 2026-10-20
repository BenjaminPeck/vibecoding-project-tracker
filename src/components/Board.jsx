import { STAGES } from '../data/tasks';

function TaskCard({ task, onEdit }) {
  const initials = task.assignee.split(' ').map(part => part[0]).join('');
  return (
    <li onClick={event => {
      if (event.target.closest('button, a, input, select, textarea')) return;
      event.currentTarget.querySelector('button')?.focus();
      onEdit(task);
    }} className="min-w-0 cursor-pointer rounded-[10px] border border-border-subtle bg-surface-card p-4 transition-colors hover:border-border-control motion-reduce:transition-none">
      <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{task.type}</span>
      <h4 className="mt-2 break-words text-sm font-semibold leading-6"><button onClick={() => onEdit(task)} className="min-h-11 w-full break-words text-left hover:text-brand-primary">{task.title}</button></h4>
      <p className="mt-2 break-words text-sm leading-6 text-text-muted">{task.description}</p>
      <div className="mt-5 flex min-w-0 items-center gap-2 border-t border-border-subtle pt-3">
        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-column text-xs font-semibold">{initials}</span>
        <span className="min-w-0 break-words text-sm"><span className="sr-only">Assigned to </span>{task.assignee}</span>
      </div>
    </li>
  );
}

export default function Board({ tasks, onEdit }) {
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
            {items.length ? <ul className="space-y-3">{items.map(task => <TaskCard key={task.id} task={task} onEdit={onEdit} />)}</ul> :
              <p className="rounded-lg border border-dashed border-border-control p-5 text-sm text-text-muted">No tasks here yet.</p>}
          </section>
        );
      })}
    </div>
  );
}
