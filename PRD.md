# Vibecoding Project Tracker — PRD

**Status:** Revised development draft. Review the requirements and complete the **`<TODO>`** sections before committing `prd-done`.

Sources: the supplied hackathon slides, `Create Next App.pdf` (hackathon portal export), and `CM6312_2026-27_Assessment_1 (1).pdf` (assessment brief). Benjamin is the sole developer and owns implementation, review and assessment submission. The application is designed for a team of users managing a shared project. Development ownership and application task ownership are separate. The starter data fields and tech stack are retained; the localStorage limitation is described below.

---

## 1. Problem

A team working on a vibecoding project needs to track tasks, identify who owns each task, and retain prompts and context so another member can continue the work. Without this record, handoffs can lose decisions and duplicate effort.

## 2. Target users

- **Primary:** members of a student vibecoding team managing tasks and handing work to one another.
- **Secondary:** future student teams working on similar projects.

Benjamin builds the application individually. This does not restrict the product to one user or make Benjamin the default owner of every application task. User research with team members must be documented from actual evidence.

## 3. Product overview

A single-page web app with two persistent surfaces:

- A **Kanban board** where vibecoding tasks move through four states.
- An **Anchor Board** above it that pins the four final-project deliverables (Presentation, Demo, Report, Documentation).

Each task carries the prompt context that produced it, so any team member can click a button and copy the task + prompt history back into an AI chat to continue work.

## 4. Primary user flow

1. Open the Webapp. The board loads from local storage.
2. Click "+" to add a task. Fill in title, type, assignee, due date, prompt context.
3. Move the task across columns as you work.
4. When stuck, click "Copy as Prompt Context" on a task and paste it into Claude/ChatGPT/Cursor to continue.
5. Hand off a task to another team member using the assignee dropdown; the board shows the new owner.
6. Drop final deliverable links into the Anchor Board as you produce them.

## 5. Data model

Preserve these starter field names and types. Document any future schema change.

```js
// A single vibecoding task.
Task = {
  id: string,                    // uuid or timestamp string
  title: string,
  description: string,
  type: 'feature' | 'bug',       // visual color coding
  status: 'todo' | 'in-progress' | 'review' | 'done',
  assignee: string,              // one of the configured team member names from §8
  dueDate: string | null,        // ISO date 'YYYY-MM-DD'
  createdDate: string,           // ISO date 'YYYY-MM-DD'

  // Added in later milestones:
  context: string,               // M9 context — curated briefing for the next AI session / user
  contextTool: string | null,    // M9 context — 'Claude' | 'ChatGPT' | 'Cursor' | 'Lovable' | 'Replit' | 'Other'
  contextUpdatedAt: string|null, // M9 context — ISO timestamp set automatically on save
}

// One of four pinned deliverable slots.
Anchor = {
  id: 'presentation' | 'demo' | 'report' | 'documentation',
  label: string,                 // human-readable
  url: string | null,            // the link the user pastes in
}
```

## 6. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React (via Vite) | What the scaffold ships with. Don't migrate. |
| Styling | Tailwind | Already configured. Use utility classes; no separate CSS files. |
| State | React `useState` + a `useLocalStorage` hook | Simple, no library needed. |
| Persistence | **localStorage** | Zero infra. Pick this. Do not switch to a backend mid-hackathon. |
| Deploy | Vercel | One-click deploy from GitHub. |

> **Decision:** localStorage, not a shared backend. If you want a shared backend later, that's M14 — out of scope for the hackathon.

## 7. Stage names

Four columns, in this order, with these exact labels in the UI:

1. **To Do**
2. **In Progress**
3. **Review**
4. **Done**

## 8. Developer and application team

### Development ownership

| Role | Name | GitHub handle |
|---|---|---|
| Sole developer and assessment author | Benjamin Peck | BenjaminPeck |

Benjamin owns all development milestones. There are no additional coursework developers to assign milestone work to.

### Application users

The prototype supports a team of three members, following the starter scope. Configure three distinct member names for `Task.assignee`; all three appear in assignment and handoff dropdowns. Each task has one owner. Team members can create, edit, assign and reassign tasks using the application without authentication.

The team's actual names are application configuration, not development contributors. Use clearly labelled fictional names for demonstration until a real target team's names are supplied. Do not treat sample users as research participants. Do not hard-code Benjamin as the owner of every task.

### Team access and persistence boundary

The starter uses localStorage: team tasks and assignments persist within the same browser profile. Team workflows can be demonstrated there, but changes do not appear automatically on teammates' separate devices. This is a team-oriented prototype, not yet a shared online workspace.

Confirmed scope: this is a local prototype using localStorage only. Do not add a database or backend. Demonstrate team assignment and handoff within one browser profile. Separate-device synchronisation is outside this prototype’s scope.

## 9. Milestone ownership

Benjamin Peck owns every milestone. Labels below belong in commit messages pushed to the connected repository.

| # | Commit keyword | Deliverable | Owner |
|---|---|---|---|
| 1 | `git-linked` | Repository and portal connection | Benjamin Peck |
| 2 | `prd-done` | Reviewed PRD | Benjamin Peck |
| 3 | `design-done` | Design system and voice | Benjamin Peck |
| 4 | `data-model` | Task model and board | Benjamin Peck |
| 5 | `crud-modal` | Task modal and persistence | Benjamin Peck |
| 6 | `tag-style` | Feature/bug styling | Benjamin Peck |
| 7 | `task-owner` | Owner indicator and team handoff | Benjamin Peck |
| 8 | `due-tint` | Due-date styling | Benjamin Peck |
| 9 | `task-context` | Context field | Benjamin Peck |
| 10 | `copy-context` | Copy context | Benjamin Peck |
| 11 | `project-deliverables` | Anchor Board | Benjamin Peck |
| 12 | `secret-sauce` | Distinctive interaction | Benjamin Peck |
| 13 | `pitch-done` | Demo and pitch | Benjamin Peck |

Work sequentially: review the PRD, complete the design, then build the model and modal before dependent features. M6–M11 build on the board and editable tasks. M12 must be visible in the demo and preserve the core flows.

## 10. AI / vibe coding angle

Where AI will be heavily used:
- M4, M5: scaffold the board and the modal from a single prompt each.
- M9, M10: write the Markdown serialization helper for the Context field.
- M7: animation polish for the handoff toast.

Where AI will **not** save you time:
- M2 (this PRD review) — read it yourself.
- M3 (DESIGN.md) — design taste is yours, not the model's.
- M12 (secret-sauce) — the whole point is that AI can't predict it.
- M13 (pitch) — write the script in your own voice.

Keep the Context field of each real task up to date as you work. By the end of the hackathon you should have a handful of curated context blocks — those become part of your Module 5 "Vibe Coding History" deliverable.

## 11. Project identity

Fill in:

- **Project name:** Vibecoding Project Tracker
- **Proposed tagline:** Keep your tasks, AI context and deliverables together.
- **Tracker URL after deploy:** `<TODO>` (Vercel will give it to you)

## 12. Out of scope (do not build)

- Authentication / accounts.
- Real GitHub integration.
- A real backend / shared database.
- Dedicated mobile features. Accessible reflow for narrow viewports and browser zoom remains required.
- Multi-team support.
- Real-time collaboration.

## 13. Definition of done

The hackathon is "done" when all 13 milestone labels have been included in commit messages pushed to the connected repository and recognised on the dashboard. These are commit-message keywords, not Git tags. The portal export uses `task-context`, `copy-context`, `project-deliverables` and `pitch-done`; these replace the older starter labels. A milestone keyword records progress, but the checks below establish whether the feature works. The pitch is "done" when:

- The board loads on Vercel without errors.
- The "Copy as Prompt Context" demo works on stage.
- 5 min pitch is rehearsed.

---

*Adapted from the supplied hackathon starter PRD: developed individually by Benjamin for team use.*


## 14. Functional requirements and acceptance criteria

MVP identifies the core working tracker. Non-MVP does not mean an agreed requirement can be omitted from the assessed prototype. Candidate enhancements are not commitments until Benjamin approves them.

| ID | Requirement | Priority | Rationale / source | Acceptance criteria |
|---|---|---|---|---|
| FR-01 | Render the four-column board | MVP | M4: make progress visible | Exact labels and order from §7; tasks appear under their saved status; each card shows title and assignee; first use seeds 3–4 fictional tasks once; deleting all tasks does not trigger reseeding |
| FR-02 | Create, edit and delete tasks through one modal | MVP | M5: maintain task information | “+” opens a blank form; clicking a card opens saved values; save creates or updates the task; delete removes it; blank titles show validation; cancel preserves saved data; IDs and createdDate are generated automatically |
| FR-03 | Change task status | MVP | M5: track work through stages | Modal dropdown supports all four states; saving moves the existing card without duplication |
| FR-04 | Persist tasks and anchors | MVP | M5 and M11: retain work | Creation, edits, deletions, reassignment, context and URLs survive reload and browser reopening in the same browser profile |
| FR-05 | Distinguish feature and bug tasks | MVP | M6: identify task type | Consistent type colours and icons on cards and modal; a label/icon communicates meaning without colour alone |
| FR-06 | Display ownership and support handoff | MVP | M7: make responsibility clear | Card shows initials/name; handoff dropdown uses all three configured team member names; reassignment updates the card, shows confirmation and persists |
| FR-07 | Show due-date urgency | MVP | M8: identify time-sensitive work | Calm, warning, overdue and neutral are distinguishable; Done overrides urgency; states update while the board remains open without editing a task |
| FR-08 | Store Markdown context and selected AI tool | MVP | M9: retain the briefing for continued work | Modal contains Context textarea and optional tool dropdown from §5; saved context/tool survive reload; saved context changes update contextUpdatedAt; unrelated changes do not; show a relative last-updated hint |
| FR-09 | Copy task context | MVP | M10: transfer the briefing into an AI chat | Button on every card and in modal copies title, description and complete context as readable Markdown; verify by pasting into a text editor; card copy does not open modal; failures show a message |
| FR-10 | Maintain deliverable anchors | MVP | M11: keep outputs accessible | Presentation, Demo, Report and Documentation remain above the board; each saves one URL; empty/filled status updates on adding/removing it; saved HTTP/HTTPS links open and survive reload |
| FR-11 | Add one distinctive interaction | Required after MVP | M12: differentiate the tracker | Benjamin chooses and justifies the interaction, records acceptance criteria and demonstrates it without breaking core flows; choice remains `<TODO>` |

### Proposed boundary and form decisions

These clarify gaps in the slides and need Benjamin’s review:

- Require a trimmed title and one configured assignee. Default type to feature and status to todo. Description and dueDate may be empty.
- Interpret date-only dueDate at the end of that date in the user's local timezone.
- Incomplete tasks past their due time are overdue. Those due within the next 24 hours, including exactly 24 hours, show warning. Those due later show calm, including the otherwise unspecified 24–48-hour window. Undated tasks and Done tasks are neutral.
- Copying inside the modal uses the displayed form values; it does not silently save them.
- New context starts with headings Background, Constraints, Tried so far, and Pick up. Record actual prompts and outcomes under Tried so far.
- Validate anchor URLs as HTTP/HTTPS and show errors next to invalid inputs.

## 15. Non-functional requirements

NFR-01 is directly required by the assessment. Other rows are proposed quality criteria for Benjamin’s review. Desktop remains the primary target, with accessible reflow required for browser zoom and narrow viewports. Target WCAG 2.2 AA; conformance must be evaluated on the finished implementation.

| ID | Requirement and acceptance check | Priority | Justification |
|---|---|---|---|
| NFR-01 | Assessor can open the deployed prototype and use its features without registration or a paid subscription; test in a signed-out browser | MVP | Assessment pp. 4 and 6 requires marking access |
| NFR-02 | Pass DESIGN.md §8 keyboard, focus, dialog, semantics, form, feedback, contrast, target-size and motion checks; verify with keyboard and VoiceOver/Safari and record results | MVP | Supports usable, understandable interaction |
| NFR-03 | Remain usable at 1280×720, 200% text enlargement and 320 CSS px width; stack columns and anchor slots at narrow widths, prevent horizontal page scrolling and clipping, and keep modal controls reachable | MVP | Supports a reliable laptop demonstration |
| NFR-04 | Saving and updating the board with 100 fictional tasks completes within one second on the recorded test laptop/browser | MVP | Proposed measurable responsiveness target |
| NFR-05 | Storage failures show an actionable error and never falsely report a successful save; normal reload/reopen retains data | MVP | Protects user effort and communicates limitations |
| NFR-06 | Core flows pass in current Chrome and one other browser; record versions and failures | MVP | Reduces browser-specific marking problems |
| NFR-07 | Display context as text; sanitise it if Markdown preview is later adopted; pasted HTML must not execute | MVP | Keeps user-entered context safe to display |

localStorage is browser- and device-specific and may be cleared. Assigning another owner does not synchronise data to their device. Do not imply that this prototype provides live collaboration or backups.

## 16. Data requirements

Use the exact Task and Anchor field names and formats in §5, including `createdDate` (not `createdAt`) and assignee names. All rows are MVP requirements.

| ID | Data | Source / collection | Justification and check |
|---|---|---|---|
| DR-01 | id, title, description, type, status | User form; application generates unique ID | Identifies and organises tasks; compare saved form values with rendered cards |
| DR-02 | Three team member names and Task.assignee | Target team supplies names for §8 configuration; fictional names may be used for demos | Supports ownership; only configured names are accepted |
| DR-03 | dueDate and createdDate | User supplies due date; application generates creation date | Supports urgency and record creation; validate ISO dates and preserve createdDate during edits |
| DR-04 | context, contextTool, contextUpdatedAt | User writes actual briefing and selects tool; application timestamps saved changes | Enables continuation; verify storage and copied content match input |
| DR-05 | Four Anchor objects with fixed IDs, labels and nullable URLs | Fixed slots; user supplies links | Connects final outputs; verify IDs remain stable and URLs persist |
| DR-06 | Three or four example tasks and initialisation state | Fictional seed data from application | Demonstrates first-use behaviour; mark examples as fictional and seed only once |

GitHub handles belong in project documentation, not the runtime task model. No external data feed or AI API is required. Fictional demo data must not be presented as research evidence.

## 17. Stakeholder and persona evidence

The assessment requires justified stakeholders and a persona for one main stakeholder. The following are candidates derived from the briefs; no interviews or findings are claimed.

| ID | Candidate stakeholder | Why relevant | Evidence to collect |
|---|---|---|---|
| SH-01 | Student team members | Coordinate tasks, ownership, AI context and handoffs | Actual team workflows, handoff problems, priorities and client/user feedback |
| SH-02 | Future student cohorts | Secondary users identified in §2 | Validate whether their needs differ from the primary team’s needs |
| SH-03 | Module leader / lecturers acting as client | Assessment identifies them as project stakeholders | Feedback on requirements, scope and design assumptions |
| SH-04 | Assessor | Needs access and traceable evidence | Check access and submission requirements |

Confirm whether a real-world client is assigned before adding one. Maintain an elicitation log with date, participant role, method, actual observations, affected requirement IDs and resulting decisions. Separate brief-derived requirements from research findings and proposed design choices.

Persona to complete from evidence: stakeholder group, relevant role/experience, usage context, goals, tasks, frustrations, accessibility needs, a representative scenario and affected requirement IDs. Do not invent interviews, quotations or research findings. The student's research and persona remain outstanding.

## 18. Prototype traceability and verification

| Component | Requirements | Evidence to capture |
|---|---|---|
| Board/cards | FR-01, FR-03, FR-05, FR-07; DR-01, DR-03, DR-06 | Four stages, type markers and every urgency state |
| Task modal/storage | FR-02, FR-04; DR-01, DR-03; NFR-02, NFR-05 | Create/edit/delete, validation, cancellation and reload |
| Ownership | FR-06; DR-02 | Before/after handoff and confirmation |
| Context and copy | FR-08, FR-09; DR-04 | Saved context/tool/time and pasted clipboard output |
| Anchor Board | FR-10; DR-05 | Empty/filled slots, URL validation and reopening links |
| Distinctive interaction | FR-11 | Agreed interaction and acceptance results |
| Whole application | NFR-01–NFR-07 | Signed-out access, keyboard, viewport, timing, storage, browser and input-handling checks |

For each test record date, environment, expected result, actual result and pass/fail. Fix failures before the final demo. Explain design and interaction choices through UX principles, screenshots and literature actually consulted. Justify any component not already mapped to a requirement.

The assessed prototype must be clickable and interactive with working features. Representative records are sufficient; every possible data record need not be populated. The distinction rubric expects all agreed requirements, including non-MVP requirements, to be included. Optional ideas such as drag-and-drop or Markdown preview become requirements only after agreement, justification and acceptance criteria are recorded.

## 19. Assessment delivery checklist

Separate these submission obligations from app features. The four anchor slots do not replace the formal assessment submission.

- Individual report of no more than 2,000 words. This project is being developed individually, as clarified by Benjamin.
- Submit one report PDF using the brief's naming pattern `[student name and surname-2].pdf`.
- Complete and submit `Coversheet.pdf`.
- Submit an interactive prototype link or APK accessible without registration or subscription. Include a clear prototype link in the report.
- Cover justified stakeholders, one persona, functional/non-functional/data requirements with unique IDs and MVP labels, screenshots, requirement mappings, and UX/interaction reasoning.
- Record active hackathon participation, which is assessed separately.
- Check the actual deadline in Learning Central; no date/time is supplied in the PDF.
- Submit through Learning Central and download submitted files to verify them and the receipt.
- Do not purchase software, subscriptions or add-ons for the coursework, as stated in the assessment brief.

The assessment explicitly permits AI tools for prototype creation and requires the report to state which tools were used and how. The written report remains subject to the assessment's general AI guidance. This AI-assisted PRD is a development draft, not student-authored research or a finished assessment report. Keep an accurate tool-use log and critically evaluate generated implementation and requirements.

## 20. Review before the PRD milestone

- Check developer details and application team configuration in §8, milestone ownership in §9 and project identity in §11.
- Verify that team workflows work within one browser profile and persist through localStorage; no database, backend or cross-device synchronisation is required.
- Choose and justify FR-11 and write its acceptance criteria.
- Review the proposed boundaries and quality targets.
- Compare requirements with actual client feedback; record unresolved questions.
- Confirm the repository registered in the portal is `BenjaminPeck/vibecoding-project-tracker` and its webhook is configured.
- Commit the reviewed PRD with `prd-done` in the message and push to that repository. A local file or local commit alone does not update the portal.
- Record the deployed URL when available; do not invent it to remove a placeholder.
