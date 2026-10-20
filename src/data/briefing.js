// Leave the author's context untouched so code blocks and indentation survive copying.
export function taskBriefing({ title, description, context }) {
  const sections = [`# ${title.trim() || 'Untitled task'}`];
  if (description.trim()) sections.push(`## Description\n${description.trim()}`);
  if (context.trim()) sections.push(`## Context\n${context}`);
  return sections.join('\n\n');
}
