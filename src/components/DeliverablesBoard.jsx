import { useEffect, useRef, useState } from 'react';
import { validDeliverableUrl } from '../data/deliverables';

function DeliverableSlot({ slot, onSave }) {
  const [draft, setDraft] = useState(slot.url || '');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const input = useRef(null);
  useEffect(() => { setDraft(slot.url || ''); }, [slot.url]);
  const fieldId = `deliverable-${slot.id}`;
  function save(event) {
    event.preventDefault();
    setMessage('');
    const url = draft.trim();
    if (!validDeliverableUrl(url)) { setError('Enter a link starting with https:// or http://.'); return; }
    try {
      onSave(slot.id, url);
      setDraft(url);
      setError('');
      setMessage(`${slot.label} link saved.`);
    } catch { setError("Couldn't save this link in this browser. Your entry is still here; check storage settings and try again."); }
  }
  function clear() {
    try {
      onSave(slot.id, null);
      setDraft('');
      setError('');
      setMessage(`${slot.label} link cleared.`);
      input.current?.focus();
    } catch { setError("Couldn't clear this link in this browser. The saved link is still available; try again."); }
  }
  return <li className="min-w-0 rounded-xl border border-border-subtle bg-surface-card p-4">
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-semibold">{slot.label}</h3>
      <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${slot.url ? 'bg-due-safe-soft text-due-safe' : 'bg-due-neutral-soft text-due-neutral'}`}>{slot.url ? 'Linked' : 'No link yet'}</span>
    </div>
    <form onSubmit={save} noValidate className="mt-3">
      <label htmlFor={fieldId} className="text-sm font-medium">{slot.label} URL</label>
      <input ref={input} id={fieldId} type="url" inputMode="url" value={draft} onChange={event => { setDraft(event.target.value); setError(''); setMessage(''); }} placeholder="https://example.com" aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} className="mt-1 min-h-11 w-full rounded-lg border border-border-control bg-white px-3 py-2 text-sm" />
      {error && <p id={`${fieldId}-error`} role="alert" className="mt-2 text-sm text-due-overdue">{error}</p>}
      {message && <p role="status" className="mt-2 text-sm text-text-muted">{message}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="submit" className="min-h-11 rounded-lg bg-brand-primary px-3 py-2 text-sm font-medium text-white hover:bg-brand-accent">Save link</button>
        {slot.url && <>
          <a href={slot.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg border border-border-control px-3 py-2 text-sm font-medium text-brand-primary hover:bg-surface-hover" aria-label={`Open ${slot.label} link in a new tab`}>Open link <span aria-hidden="true" className="ml-1">↗</span></a>
          <button type="button" onClick={clear} className="min-h-11 rounded-lg px-2 py-2 text-sm font-medium text-due-overdue hover:bg-due-overdue-soft" aria-label={`Clear ${slot.label} link`}>Clear</button>
        </>}
      </div>
    </form>
  </li>;
}

export default function DeliverablesBoard({ items, onSave }) {
  return <section aria-labelledby="deliverables-heading" className="mb-8">
    <div className="mb-4"><h2 id="deliverables-heading" className="text-xl font-semibold tracking-tight">Deliverables</h2><p className="mt-1 text-sm text-text-muted">Keep the presentation, demo, report and documentation links together.</p></div>
    <ul className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map(slot => <DeliverableSlot key={slot.id} slot={slot} onSave={onSave} />)}</ul>
  </section>;
}
