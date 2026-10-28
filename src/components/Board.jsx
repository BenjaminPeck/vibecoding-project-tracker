import { useEffect, useRef, useState } from 'react';
import { STAGES } from '../data/tasks';
import { dueLabel, dueShortLabel, dueState } from '../data/dueDate';
import { taskBriefing } from '../data/briefing';
import CopyFallback from './CopyFallback';
import CopyIcon from './CopyIcon';

const dueClasses = {
  safe: 'bg-due-safe-soft text-due-safe',
  imminent: 'bg-due-overdue-soft text-due-overdue',
  warning: 'bg-due-warning-soft text-due-warning',
  overdue: 'bg-due-overdue-soft text-due-overdue',
  neutral: 'bg-due-neutral-soft text-due-neutral',
};

function TaskCard({ task, members, stageTasks, stageIndex, onEdit, onHandoff, onMove, now, onCardDragStart, onCardDragEnd, onCardDragOver, onCardDrop, onHandlePointerDown, onHandlePointerMove, onHandlePointerUp, onHandlePointerCancel, pointerOffset, isDragging, isDropTarget, allowReorder }) {
  const initials = task.assignee.split(' ').map(part => part[0]).join('');
  const isBug = task.type === 'bug';
  const urgency = dueState(task, now);
  const [handoffError, setHandoffError] = useState('');
  const [moveActionError, setMoveActionError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyFallback, setCopyFallback] = useState('');
  const copyButton = useRef(null);
  const copyTimer = useRef(null);
  const handoffMenu = useRef(null);
  const ownerButton = useRef(null);
  const moveButton = useRef(null);
  const moveMenu = useRef(null);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const suppressClick = useRef(false);
  useEffect(() => {
    function dismiss(event) {
      if (handoffMenu.current?.open && !handoffMenu.current.contains(event.target)) handoffMenu.current.open = false;
      if (moveMenuOpen && !moveMenu.current?.contains(event.target) && !moveButton.current?.contains(event.target)) setMoveMenuOpen(false);
    }
    function escape(event) {
      if (event.key === 'Escape' && handoffMenu.current?.open) {
        handoffMenu.current.open = false;
        ownerButton.current?.focus();
        event.stopPropagation();
      }
      if (event.key === 'Escape' && moveMenuOpen) {
        setMoveMenuOpen(false);
        moveButton.current?.focus();
        event.stopPropagation();
      }
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [moveMenuOpen]);
  useEffect(() => () => window.clearTimeout(copyTimer.current), []);
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
  async function copyTask() {
    const briefing = taskBriefing(task);
    try {
      await navigator.clipboard.writeText(briefing);
      setCopyFallback('');
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1000);
    } catch {
      setCopied(false);
      setCopyFallback(briefing);
    }
  }
  function moveWithButton(status, beforeId = null) {
    try { onMove(task.id, status, beforeId); setMoveActionError(''); setMoveMenuOpen(false); requestAnimationFrame(() => [...document.querySelectorAll('[data-move-task]')].find(element => element.dataset.moveTask === task.id)?.focus()); }
    catch { setMoveActionError(`Couldn't move “${task.title}”. Its position is unchanged.`); }
  }
  function toggleMoveMenu() {
    if (moveMenuOpen) { setMoveMenuOpen(false); moveButton.current?.focus(); }
    else {
      setMoveMenuOpen(true);
      requestAnimationFrame(() => moveMenu.current?.querySelector('button:not(:disabled)')?.focus());
    }
  }
  return (
    <li data-drop-card={task.id} data-drop-status={task.status} draggable onDragStart={event => { suppressClick.current = true; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', task.id); onCardDragStart(task.id); }} onDragEnd={() => { onCardDragEnd(); window.setTimeout(() => { suppressClick.current = false; }, 0); }} onDragOver={event => onCardDragOver(event, task.id)} onDrop={event => onCardDrop(event, task)} onClick={event => {
      if (suppressClick.current) return;
      if (event.target.closest('button, a, input, select, textarea, summary')) return;
      event.currentTarget.querySelector('button')?.focus();
      onEdit(task);
    }} style={pointerOffset ? { transform: `translate3d(${pointerOffset.x}px, ${pointerOffset.y}px, 0)`, zIndex: 40, pointerEvents: 'none', boxShadow: '0 16px 36px rgba(0, 0, 0, 0.18)' } : undefined} className={`relative min-w-0 cursor-pointer rounded-[10px] border border-border-subtle border-l-[3px] bg-surface-card p-4 transition-colors hover:border-border-control motion-reduce:transition-none ${isBug ? 'border-l-type-bug' : 'border-l-type-feature'} ${isDragging && !pointerOffset ? 'opacity-50' : ''} ${isDropTarget ? 'ring-2 ring-brand-primary ring-offset-2' : ''}`}>
      <div className="pr-11">
        <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${isBug ? 'bg-type-bug-soft text-type-bug' : 'bg-type-feature-soft text-type-feature'}`}><span aria-hidden="true">{isBug ? '!' : '◆'}</span>{isBug ? 'Bug' : 'Feature'}</span>
        <span className="ml-2 inline-flex items-center rounded-md border border-border-subtle px-2 py-1 text-xs font-medium text-text-muted">{({ high:'↑ High', normal:'Normal', low:'↓ Low' })[task.priority || 'normal']}</span>
        <button ref={moveButton} data-move-task={task.id} type="button" aria-label={`Move “${task.title}”`} aria-expanded={moveMenuOpen} onPointerDown={event => { suppressClick.current = true; onHandlePointerDown(event, task.id); }} onPointerMove={onHandlePointerMove} onPointerUp={event => { const dragged = onHandlePointerUp(event); if (!dragged) toggleMoveMenu(); window.setTimeout(() => { suppressClick.current = false; }, 0); }} onPointerCancel={() => { onHandlePointerCancel(); suppressClick.current = false; }} onClick={event => { event.stopPropagation(); if (event.detail === 0) toggleMoveMenu(); }} className="absolute right-2 top-2 flex h-11 w-11 cursor-grab touch-none items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.2" /><circle cx="11" cy="3" r="1.2" /><circle cx="5" cy="8" r="1.2" /><circle cx="11" cy="8" r="1.2" /><circle cx="5" cy="13" r="1.2" /><circle cx="11" cy="13" r="1.2" /></svg></button>
        {moveMenuOpen && <div ref={moveMenu} role="group" aria-label={`Move “${task.title}” options`} className="absolute right-2 top-12 z-30 w-48 max-w-[calc(100vw-3rem)] rounded-lg border border-border-control bg-surface-card p-1 shadow-lg">
          {allowReorder && <>
            <p className="px-3 py-1 text-xs font-semibold text-text-muted">Reorder</p>
            <button type="button" disabled={stageIndex === 0} onClick={() => moveWithButton(task.status, stageTasks[stageIndex - 1]?.id)} className="block min-h-11 w-full rounded-md px-3 py-2 text-left text-sm hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50">Move up</button>
            <button type="button" disabled={stageIndex === stageTasks.length - 1} onClick={() => moveWithButton(task.status, stageTasks[stageIndex + 2]?.id || null)} className="block min-h-11 w-full rounded-md px-3 py-2 text-left text-sm hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50">Move down</button>
          </>}
          <p className="border-t border-border-subtle px-3 pb-1 pt-2 text-xs font-semibold text-text-muted">Move to column</p>
          {STAGES.filter(stage => stage.id !== task.status).map(stage => <button key={stage.id} type="button" onClick={() => moveWithButton(stage.id)} className="block min-h-11 w-full rounded-md px-3 py-2 text-left text-sm hover:bg-surface-hover">{stage.label}</button>)}
        </div>}
      </div>
      <h4 className="mt-1 break-words text-base font-semibold leading-6"><button onClick={() => onEdit(task)} className="min-h-11 w-full break-words text-left hover:text-brand-link">{task.title}</button></h4>
      <p className="mt-2 break-words text-sm leading-6 text-text-muted">{task.description}</p>
      <div className="mt-4 flex min-w-0 items-center justify-between gap-2 border-t border-border-subtle pt-2">
        <details ref={handoffMenu} className="relative min-w-0 flex-1">
          <summary ref={ownerButton} className="flex min-h-11 w-fit max-w-full cursor-pointer list-none items-center gap-2 rounded-lg px-1 text-left text-sm hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link [&::-webkit-details-marker]:hidden" aria-label={`Assigned to ${task.assignee}. Hand off “${task.title}”`}>
            <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-column text-xs font-semibold">{initials}</span>
            <span className="min-w-0 truncate font-medium">{task.assignee}</span>
            <span aria-hidden="true" className="text-text-muted">⌄</span>
          </summary>
          <div className="absolute left-0 top-full z-20 mt-1 w-max min-w-48 max-w-[calc(100vw-3rem)] rounded-lg border border-border-subtle bg-surface-card p-1 shadow-lg">
            <p className="px-3 py-2 text-xs font-semibold text-text-muted">Hand off to…</p>
            {members.filter(name => name !== task.assignee).map(name => <button key={name} type="button" onClick={() => handoff(name)} className="block min-h-11 w-full rounded-md px-3 py-2 text-left text-sm hover:bg-surface-hover">{name}</button>)}
          </div>
        </details>
        <span className={`shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${dueClasses[urgency]}`} aria-label={dueLabel(task, urgency)} title={dueLabel(task, urgency)}>{dueShortLabel(task, urgency)}</span>
      </div>
      <div className="mt-2">
        <button ref={copyButton} type="button" onClick={copyTask} className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-brand-link hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link"><CopyIcon copied={copied} size={16} />Copy Context</button>
      </div>
      <span role="status" className="sr-only">{copied ? 'Context copied.' : ''}</span>
      {copyFallback && <CopyFallback text={copyFallback} onClose={() => { setCopyFallback(''); copyButton.current?.focus(); }} />}
      {handoffError && <p role="alert" id={`handoff-error-${task.id}`} className="mt-2 text-sm text-due-overdue">{handoffError}</p>}
      {moveActionError && <p role="alert" className="mt-2 text-sm text-due-overdue">{moveActionError}</p>}
    </li>
  );
}

export default function Board({ tasks, members, onEdit, onHandoff, onMove, now, allowReorder = true }) {
  const [draggedId, setDraggedId] = useState(null);
  const [pointerOffset, setPointerOffset] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [moveError, setMoveError] = useState('');
  const pointerDrag = useRef(null);
  function canDrop(id, status) {
    const source = tasks.find(task => task.id === id);
    return source && (allowReorder || source.status !== status);
  }
  function finishMove(id, status, beforeId = null) {
    setDraggedId(null);
    setPointerOffset(null);
    setDropTarget(null);
    if (!canDrop(id, status)) return;
    try { onMove(id, status, allowReorder ? beforeId : null); setMoveError(''); }
    catch { setMoveError("Couldn't move this task. Its position is unchanged; check browser storage and try again."); }
  }
  function finishDrop(event, status, beforeId = null) {
    event.preventDefault();
    event.stopPropagation();
    const id = event.dataTransfer.getData('text/plain') || draggedId;
    finishMove(id, status, beforeId);
  }
  function pointerDown(event, id) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerDrag.current = { id, x:event.clientX, y:event.clientY, target:null, active:false };
    setMoveError('');
  }
  function pointerMove(event) {
    const drag = pointerDrag.current;
    if (!drag) return;
    if (!drag.active && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return;
    if (!drag.active) { drag.active = true; setDraggedId(drag.id); }
    setPointerOffset({ id:drag.id, x:event.clientX - drag.x, y:event.clientY - drag.y });
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const card = element?.closest('[data-drop-card]');
    const stage = element?.closest('[data-drop-stage]');
    drag.target = card && card.dataset.dropCard !== drag.id && canDrop(drag.id, card.dataset.dropStatus) ? { status:card.dataset.dropStatus, beforeId:allowReorder ? card.dataset.dropCard : null } : stage && canDrop(drag.id, stage.dataset.dropStage) ? { status:stage.dataset.dropStage, beforeId:null } : null;
    setDropTarget(drag.target ? drag.target.beforeId ? `card:${drag.target.beforeId}` : `stage:${drag.target.status}` : null);
  }
  function pointerUp() {
    const drag = pointerDrag.current;
    pointerDrag.current = null;
    if (drag?.active && drag.target) finishMove(drag.id, drag.target.status, drag.target.beforeId);
    else { setDraggedId(null); setDropTarget(null); setPointerOffset(null); }
    return Boolean(drag?.active);
  }
  function pointerCancel() {
    pointerDrag.current = null;
    setDraggedId(null);
    setDropTarget(null);
    setPointerOffset(null);
  }
  return (
    <div>
    {moveError && <p role="alert" className="mb-4 rounded-lg border border-due-overdue bg-due-overdue-soft p-3 text-sm text-due-overdue">{moveError}</p>}
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STAGES.map(stage => {
        const items = tasks.filter(task => task.status === stage.id);
        return (
          <section key={stage.id} data-drop-stage={stage.id} aria-labelledby={`stage-${stage.id}`} onDragOver={event => { if (!draggedId || !canDrop(draggedId, stage.id)) return; event.preventDefault(); event.dataTransfer.dropEffect = 'move'; if (dropTarget !== `stage:${stage.id}`) setDropTarget(`stage:${stage.id}`); }} onDrop={event => finishDrop(event, stage.id)} className={`min-w-0 rounded-xl bg-surface-column p-3 ${dropTarget === `stage:${stage.id}` ? 'ring-2 ring-brand-primary ring-offset-2' : ''}`}>
            <div className={`mb-3 rounded-lg px-3 py-3 ${stage.surface}`}>
              <div className="flex items-center justify-between gap-2">
                <h3 id={`stage-${stage.id}`} className="font-semibold">{stage.label}</h3>
                <span className="text-sm font-semibold tabular-nums" aria-label={`${items.length} ${items.length === 1 ? 'task' : 'tasks'}`}>{items.length}</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{stage.hint}</p>
            </div>
            {items.length ? <ul className="space-y-3">{items.map((task, index) => <TaskCard key={task.id} task={task} members={members} stageTasks={items} stageIndex={index} onEdit={onEdit} onHandoff={onHandoff} onMove={onMove} now={now} allowReorder={allowReorder} pointerOffset={pointerOffset?.id === task.id ? pointerOffset : null} isDragging={draggedId === task.id} isDropTarget={dropTarget === `card:${task.id}`} onHandlePointerDown={pointerDown} onHandlePointerMove={pointerMove} onHandlePointerUp={pointerUp} onHandlePointerCancel={pointerCancel} onCardDragStart={id => { setDraggedId(id); setDropTarget(null); setMoveError(''); }} onCardDragEnd={() => { setDraggedId(null); setDropTarget(null); }} onCardDragOver={(event, id) => { if (!draggedId || draggedId === id || !canDrop(draggedId, task.status)) return; event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = 'move'; const target = allowReorder ? `card:${id}` : `stage:${task.status}`; if (dropTarget !== target) setDropTarget(target); }} onCardDrop={(event, target) => finishDrop(event, target.status, allowReorder ? target.id : null)} />)}</ul> :
              <p className="rounded-lg border border-dashed border-border-control p-5 text-sm text-text-muted">No tasks here yet.</p>}
          </section>
        );
      })}
    </div>
    </div>
  );
}
