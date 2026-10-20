import { useState } from 'react';
import Board from './components/Board';
import { createExampleTasks, TEAM } from './data/tasks';

export default function App() {
  // M4 is a read-only board. Editing and persistent storage arrive together in M5.
  const [tasks] = useState(createExampleTasks);
  return (
    <div className="min-h-screen">
      <a href="#board" className="sr-only z-50 rounded-lg bg-brand-primary p-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to board</a>
      <header className="border-b border-border-subtle bg-surface-card">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-primary"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-primary" />Team workspace</div>
            <h1 className="break-words text-2xl font-semibold tracking-tight">Vibecoding Project Tracker</h1>
            <p className="mt-1 text-sm leading-6 text-text-muted">Tasks, context and deliverables for your team.</p>
          </div>
          <p className="rounded-full border border-border-subtle px-3 py-2 text-sm text-text-muted">Local prototype</p>
        </div>
      </header>
      <main id="board" tabIndex={-1} className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Project board</h2>
            <p className="mt-1 text-sm text-text-muted">A shared view of what comes next.</p>
          </div>
          <p className="text-sm text-text-muted"><span className="font-semibold text-text-primary">{tasks.length}</span> tasks <span aria-hidden="true">·</span> {TEAM.length} demo members</p>
        </div>
        <Board tasks={tasks} />
        <aside aria-label="Prototype information" className="mt-6 border-t border-border-subtle pt-4 text-sm leading-6 text-text-muted">
          <p><strong className="font-medium text-text-primary">Example workspace.</strong> These tasks and team members are fictional.</p>
          <p>This first version displays the board. Task editing and saving will be added next.</p>
        </aside>
      </main>
    </div>
  );
}
