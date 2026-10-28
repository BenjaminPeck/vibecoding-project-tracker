export const STAGES = [
  { id: 'todo', label: 'To Do', surface: 'bg-stage-todo', hint: 'Prioritised for the next sprint' },
  { id: 'in-progress', label: 'In Progress', surface: 'bg-stage-progress', hint: 'Currently being built' },
  { id: 'review', label: 'Review', surface: 'bg-stage-review', hint: 'Ready for review' },
  { id: 'done', label: 'Done', surface: 'bg-stage-done', hint: 'Completed and verified' },
];

// Fictional people for this prototype, not research participants.
export const TEAM = ['Alex Morgan', 'Sam Patel', 'Jamie Chen'];

function dateOffset(days, anchor = new Date()) {
  const date = new Date(anchor);
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function createExampleTasks(anchor = new Date()) {
  const base = {
    description: '', type: 'feature', priority: 'normal', dueDate: null, createdDate: dateOffset(-7, anchor),
    context: '', contextTool: null, contextUpdatedAt: new Date().toISOString(),
  };
  return [
    { ...base, id: 'demo-01', title: 'Add keyboard shortcut for a new task', description: 'Let engineers open the task form with a shortcut when focus is outside an input.', status: 'todo', assignee: TEAM[0], dueDate: dateOffset(5, anchor), context: '## Background\nCreating tasks currently requires reaching the header button.\n\n## Constraints\nDo not intercept typing inside inputs or the Markdown editor. Keep the existing Add task button.\n\n## Tried so far\nNo shortcut has been implemented.\n\n## Pick up\nChoose a discoverable shortcut, add keyboard handling, and check focus returns after Cancel.' },
    { ...base, id: 'demo-02', title: 'Fix duplicate cards after rapid Save', description: 'Investigate repeated submit events before the task is written to browser storage.', type: 'bug', priority: 'high', status: 'in-progress', assignee: TEAM[1], dueDate: dateOffset(2, anchor), contextTool: 'Cursor', context: '## Background\nA rapid double click on Save task can create two cards in the example workflow.\n\n## Constraints\nDo not discard entered text or report success before localStorage confirms the write.\n\n## Tried so far\nReproduced with repeated clicks; no fix has been merged.\n\n## Pick up\nGuard the submit path, then verify one card is created and the button remains keyboard accessible.' },
    { ...base, id: 'demo-03', title: 'Review focus return from task modal', description: 'Check keyboard focus after Save, Cancel, Escape and Delete.', status: 'review', assignee: TEAM[2], dueDate: dateOffset(1, anchor), context: '## Background\nThe modal closes through several paths. Review each path with keyboard navigation.\n\n## Constraints\nReturn focus to the control that opened the modal; keep error text announced.\n\n## Tried so far\nBasic Enter and Escape flows were checked in the prototype.\n\n## Pick up\nComplete a keyboard-only pass and record any failed focus path.' },
    { ...base, id: 'demo-04', title: 'Persist board changes across reloads', description: 'Save task edits locally and restore them when the browser reopens.', priority: 'low', status: 'done', assignee: TEAM[0], dueDate: dateOffset(-3, anchor), context: '## Background\nThe prototype needs a reliable browser-local task list for the demo.\n\n## Constraints\nKeep an intentionally empty board empty; do not replace malformed saved data silently.\n\n## Tried so far\nSave, reload and invalid-data paths were checked.\n\n## Pick up\nRevisit storage behaviour during the final accessibility and deployment pass.' },
    { ...base, id: 'demo-05', title: 'Prepare a release checklist', description: 'List the checks the team should complete before sharing a build.', priority: 'high', status: 'todo', assignee: TEAM[2], dueDate: dateOffset(3, anchor), context: '## Background\nThe team needs a short handoff checklist before a demo build is shared.\n\n## Pick up\nCover the build, key interactions, keyboard use and the public link.' },
    { ...base, id: 'demo-06', title: 'Improve failed-save guidance', description: 'Make it clearer when a task could not be saved in the browser.', status: 'todo', assignee: TEAM[1], dueDate: dateOffset(9, anchor), context: '## Background\nA failed write should not look like a successful save.\n\n## Pick up\nCheck the message, keep the form data available, and offer a retry path.' },
    { ...base, id: 'demo-07', title: 'Check sorting after status changes', description: 'Keep due-date and priority order correct when a task moves column.', priority: 'low', status: 'in-progress', assignee: TEAM[0], dueDate: dateOffset(7, anchor), contextTool: 'ChatGPT', context: '## Background\nChanging a task stage should not remove its due date or priority.\n\n## Pick up\nMove a card between columns in each order mode and check where it appears.' },
    { ...base, id: 'demo-08', title: 'Fix long task titles on mobile', description: 'Check that long titles wrap without widening the page.', type: 'bug', status: 'in-progress', assignee: TEAM[2], dueDate: dateOffset(4, anchor), context: '## Background\nLong task names can crowd a narrow card.\n\n## Pick up\nTest a 320px viewport and keep the title, owner and actions reachable.' },
    { ...base, id: 'demo-09', title: 'Review due-date labels', description: 'Check that urgency is clear in text as well as colour.', status: 'review', assignee: TEAM[1], dueDate: dateOffset(6, anchor), context: '## Background\nDeadline colours need readable text labels.\n\n## Pick up\nCheck due today, overdue, future and undated examples.' },
    { ...base, id: 'demo-10', title: 'Add feature and bug badges', description: 'Show task type with a visible label on each card.', status: 'done', assignee: TEAM[2], dueDate: dateOffset(-5, anchor), context: '## Background\nEngineers should recognise a feature or bug without relying on colour.\n\n## Pick up\nKeep the text labels visible in both themes.' },
  ];
}

// Expand only the exact four-task fictional sample set; preserve edited or deleted work.
export function isPreviousExampleTasks(tasks) {
  if (tasks.length !== 4 || !tasks.every(task => task.id?.startsWith('demo-'))) return false;
  const anchor = new Date(`${tasks[0].createdDate}T12:00:00`);
  anchor.setDate(anchor.getDate() + 7);
  const expected = new Map(createExampleTasks(anchor).slice(0, 4).map(task => [task.id, task]));
  const fields = ['id', 'title', 'description', 'type', 'priority', 'dueDate', 'createdDate', 'context', 'contextTool', 'status', 'assignee'];
  return tasks.every(task => {
    const original = expected.get(task.id);
    return original && Object.keys(task).length === Object.keys(original).length && fields.every(field => task[field] === original[field]);
  });
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
    return task.id === id && task.title === title && task.description === description && task.type === type && (task.priority === undefined || task.priority === 'normal') && task.status === status && task.assignee === assignee && task.dueDate === null && task.createdDate === '2026-10-20' && task.context === '' && task.contextTool === null && task.contextUpdatedAt === null;
  });
}
