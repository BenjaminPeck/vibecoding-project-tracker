import { useEffect, useRef } from 'react';

export default function CopyFallback({ text, onClose, label = 'Task briefing for manual copying' }) {
  const field = useRef(null);
  useEffect(() => { field.current?.focus(); field.current?.select(); }, []);
  return <div className="mt-3 rounded-lg border border-due-overdue bg-due-overdue-soft p-3" onClick={event => event.stopPropagation()}>
    <p role="alert" className="text-sm font-medium text-due-overdue">Couldn't copy context. Select and copy the text manually.</p>
    <label className="mt-3 block text-sm font-medium">{label}<textarea ref={field} readOnly value={text} rows={8} className="mt-1 w-full resize-y rounded-lg border border-border-control bg-surface-input p-3 font-mono text-sm text-text-primary" /></label>
    <button type="button" onClick={onClose} className="mt-2 min-h-11 rounded-lg border border-border-control bg-surface-card px-4 text-sm font-medium">Close</button>
  </div>;
}
