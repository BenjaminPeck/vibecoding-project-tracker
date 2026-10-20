export const CONTEXT_TEMPLATE = `## Background

## Constraints

## Tried so far

## Pick up
`;

export const CONTEXT_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

export function contextUpdatedAt(previous, context, now = new Date()) {
  if (!previous) return context.trim() ? now.toISOString() : null;
  if (context !== previous.context) return now.toISOString();
  return previous.contextUpdatedAt;
}

export function relativeContextTime(timestamp, now = new Date()) {
  if (!timestamp) return 'No context saved yet.';
  const elapsed = Math.max(0, now.getTime() - Date.parse(timestamp));
  if (elapsed < 60_000) return 'Last updated just now';
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `Last updated ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Last updated ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.floor(hours / 24);
  return `Last updated ${days} ${days === 1 ? 'day' : 'days'} ago`;
}
