# Vibecoding Project Tracker

Benjamin Peck's individual React/Vite coursework prototype for a development team's task workflow. The interface uses a four-stage Kanban board, task context, ownership, due dates and four deliverable links. The initial ten tasks and three team members are fictional examples.

The entry screen is a **demo login**. Its Email and Password fields are disabled; selecting Log in opens the board as the fictional Alex Morgan. Log out returns to the entry screen. There is no authentication, database, server-side account or live multi-user collaboration. Tasks, roster, profiles, links and preferences are saved in this browser's localStorage on this origin. Another browser or device gets its own data. A reload returns to the demo login, while saved workspace data remains in the browser.

## Run locally

```bash
npm install
npm run dev
```

Open the address Vite prints, usually `http://localhost:5173/`. Select **Log in**; no details are needed.

## Check and build

```bash
node --test tests/*.test.js
npm run build
```

The production output is in `dist/`. The public deployment previously used for assessment is [project-tracker-coral-alpha.vercel.app](https://project-tracker-coral-alpha.vercel.app/); check that it reflects the latest source before treating it as evidence.

## Where to find the specification

- [PRD.md](PRD.md): functional, non-functional and data requirements.
- [DESIGN.md](DESIGN.md): visual and interaction decisions.
- `src/App.jsx`: app state and local workflow.
- `src/components/`: board, task editor, deliverables and team controls.
- `src/data/`: validation, browser storage, sorting and task movement.

The private coursework evidence and assessment notes are held outside this repository in its sibling `Coursework Notes` folder. They are not part of the app or deployment.
