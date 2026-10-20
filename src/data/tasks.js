export const STAGES = [
  { id: 'todo', label: 'To Do', surface: 'bg-stage-todo', hint: 'Prioritised for the next sprint' },
  { id: 'in-progress', label: 'In Progress', surface: 'bg-stage-progress', hint: 'Currently being built' },
  { id: 'review', label: 'Review', surface: 'bg-stage-review', hint: 'Ready for review' },
  { id: 'done', label: 'Done', surface: 'bg-stage-done', hint: 'Completed and verified' },
];

// Fictional people for this prototype, not research participants.
export const TEAM = ['Alex Morgan', 'Sam Patel', 'Jamie Chen'];

function dateOffset(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function createExampleTasks() {
  const base = {
    description: '', type: 'feature', dueDate: null, createdDate: dateOffset(-7),
    context: '', contextTool: null, contextUpdatedAt: new Date().toISOString(),
  };
  return [
    { ...base, id: 'demo-01', title: 'Add keyboard shortcut for a new task', description: 'Let engineers open the task form with a shortcut when focus is outside an input.', status: 'todo', assignee: TEAM[0], dueDate: dateOffset(5), context: '## Background\nCreating tasks currently requires reaching the header button.\n\n## Constraints\nDo not intercept typing inside inputs or the Markdown editor. Keep the existing Add task button.\n\n## Tried so far\nNo shortcut has been implemented.\n\n## Pick up\nChoose a discoverable shortcut, add keyboard handling, and check focus returns after Cancel.' },
    { ...base, id: 'demo-02', title: 'Fix duplicate cards after rapid Save', description: 'Investigate repeated submit events before the task is written to browser storage.', type: 'bug', status: 'in-progress', assignee: TEAM[1], dueDate: dateOffset(2), contextTool: 'Cursor', context: '## Background\nA rapid double click on Save task can create two cards in the example workflow.\n\n## Constraints\nDo not discard entered text or report success before localStorage confirms the write.\n\n## Tried so far\nReproduced with repeated clicks; no fix has been merged.\n\n## Pick up\nGuard the submit path, then verify one card is created and the button remains keyboard accessible.' },
    { ...base, id: 'demo-03', title: 'Review focus return from task modal', description: 'Check keyboard focus after Save, Cancel, Escape and Delete.', status: 'review', assignee: TEAM[2], dueDate: dateOffset(1), context: '## Background\nThe modal closes through several paths. Review each path with keyboard navigation.\n\n## Constraints\nReturn focus to the control that opened the modal; keep error text announced.\n\n## Tried so far\nBasic Enter and Escape flows were checked in the prototype.\n\n## Pick up\nComplete a keyboard-only pass and record any failed focus path.' },
    { ...base, id: 'demo-04', title: 'Persist board changes across reloads', description: 'Save task edits locally and restore them when the browser reopens.', status: 'done', assignee: TEAM[0], dueDate: dateOffset(-3), context: '## Background\nThe prototype needs a reliable browser-local task list for the demo.\n\n## Constraints\nKeep an intentionally empty board empty; do not replace malformed saved data silently.\n\n## Tried so far\nSave, reload and invalid-data paths were checked.\n\n## Pick up\nRevisit storage behaviour during the final accessibility and deployment pass.' },
  ];
}

// Upgrade only the untouched first-release examples; edited or deleted data stays intact.
export function isLegacyExampleTasks(tasks) {
  const legacy = [
    ['demo-01', 'Make project deliverables easy to find', 'Keep the presentation, demo, report and documentation together.', 'feature', 'todo', TEAM[0]],
    ['demo-02', 'Build a clear task editing flow', 'Give every task a title, owner and place on the board.', 'feature', 'in-progress', TEAM[1]],
    ['demo-03', 'Check keyboard focus in the task form', 'Make sure focus returns to the task after closing the form.', 'bug', 'review', TEAM[2]],
    ['demo-04', 'Agree the project requirements', 'Define the behaviour, quality standards and data the prototype needs.', 'feature', 'done', TEAM[0]],
  ];
  return tasks.length === legacy.length && tasks.every((task, index) => {
    const [id, title, description, type, status, assignee] = legacy[index];
    return task.id === id && task.title === title && task.description === description && task.type === type && task.status === status && task.assignee === assignee && task.dueDate === null && task.createdDate === '2026-10-20' && task.context === '' && task.contextTool === null && task.contextUpdatedAt === null;
  });
}
