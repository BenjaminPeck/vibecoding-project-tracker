export const DELIVERABLE_KEY = 'vibetracker.deliverables';

export const DELIVERABLE_SLOTS = [
  { id: 'presentation', label: 'Presentation' },
  { id: 'demo', label: 'Demo' },
  { id: 'report', label: 'Report' },
  { id: 'documentation', label: 'Documentation' },
];

export function emptyDeliverables() {
  return DELIVERABLE_SLOTS.map(slot => ({ ...slot, url: null }));
}

export function validDeliverableUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname);
  } catch { return false; }
}

export function validateDeliverables(items) {
  if (!Array.isArray(items) || items.length !== DELIVERABLE_SLOTS.length) throw new Error('Saved deliverables are invalid.');
  for (const slot of DELIVERABLE_SLOTS) {
    const matches = items.filter(item => item?.id === slot.id);
    if (matches.length !== 1 || matches[0].label !== slot.label || !(matches[0].url === null || (typeof matches[0].url === 'string' && validDeliverableUrl(matches[0].url)))) throw new Error('Saved deliverables are invalid.');
  }
  return DELIVERABLE_SLOTS.map(slot => items.find(item => item.id === slot.id));
}

export function loadDeliverables(storage) {
  const raw = storage.getItem(DELIVERABLE_KEY);
  if (raw !== null) return validateDeliverables(JSON.parse(raw));
  const initial = emptyDeliverables();
  saveDeliverables(storage, initial);
  return initial;
}

export function saveDeliverables(storage, items) {
  storage.setItem(DELIVERABLE_KEY, JSON.stringify(validateDeliverables(items)));
}
