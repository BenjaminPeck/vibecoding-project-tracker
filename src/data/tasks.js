export const STAGES = [
  { id: 'todo', label: 'To Do', surface: 'bg-stage-todo', hint: 'Ready for a fresh start' },
  { id: 'in-progress', label: 'In Progress', surface: 'bg-stage-progress', hint: 'Taking shape' },
  { id: 'review', label: 'Review', surface: 'bg-stage-review', hint: 'A second pair of eyes' },
  { id: 'done', label: 'Done', surface: 'bg-stage-done', hint: 'Ready to build on' },
];

// Fictional people for this prototype, not research participants.
export const TEAM = ['Alex Morgan', 'Sam Patel', 'Jamie Chen'];

export function createExampleTasks() {
  const base = {
    description: '', type: 'feature', dueDate: null, createdDate: '2026-10-20',
    context: '', contextTool: null, contextUpdatedAt: null,
  };
  return [
    { ...base, id: 'demo-01', title: 'Make project deliverables easy to find', description: 'Keep the presentation, demo, report and documentation together.', status: 'todo', assignee: TEAM[0] },
    { ...base, id: 'demo-02', title: 'Build a clear task editing flow', description: 'Give every task a title, owner and place on the board.', status: 'in-progress', assignee: TEAM[1] },
    { ...base, id: 'demo-03', title: 'Check keyboard focus in the task form', description: 'Make sure focus returns to the task after closing the form.', type: 'bug', status: 'review', assignee: TEAM[2] },
    { ...base, id: 'demo-04', title: 'Agree the project requirements', description: 'Define the behaviour, quality standards and data the prototype needs.', status: 'done', assignee: TEAM[0] },
  ];
}
