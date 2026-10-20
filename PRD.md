# Vibecoding Project Tracker — Product Requirements

## 1. Functional requirements

MVP requirements are required for the minimum viable prototype. FR-11 is required after the MVP, but its specific behaviour remains to be defined.

| ID | Requirement | Priority | Rationale / source | Acceptance criteria |
|---|---|---|---|---|
| FR-01 | Render the four-column board | MVP | M4: make progress visible | Columns labelled To Do, In Progress, Review and Done in that order; tasks appear under their saved status; each card shows title and assignee; first use seeds 3–4 fictional tasks once; deleting all tasks does not trigger reseeding |
| FR-02 | Create, edit and delete tasks through one modal | MVP | M5: maintain task information | “+” opens a blank form; clicking a card opens saved values; save creates or updates the task; delete removes it; blank titles show validation; cancel preserves saved data; IDs and createdDate are generated automatically |
| FR-03 | Change task status | MVP | M5: track work through stages | Modal dropdown supports all four states; saving moves the existing card without duplication |
| FR-04 | Persist tasks and anchors | MVP | M5 and M11: retain work | Creation, edits, deletions, reassignment, context and URLs survive reload and browser reopening in the same browser profile |
| FR-05 | Distinguish feature and bug tasks | MVP | M6: identify task type | Consistent type colours and icons on cards and modal; a label/icon communicates meaning without colour alone |
| FR-06 | Display ownership and support handoff | MVP | M7: make responsibility clear | Card shows initials/name; handoff dropdown uses all three configured team member names; reassignment updates the card, shows confirmation and persists |
| FR-07 | Show due-date urgency | MVP | M8: identify time-sensitive work | Calm, warning, overdue and neutral are distinguishable; Done overrides urgency; states update while the board remains open without editing a task |
| FR-08 | Store Markdown context and selected AI tool | MVP | M9: retain the briefing for continued work | Modal contains Context textarea and optional tool dropdown with the values defined in DR-04; saved context/tool survive reload; saved context changes update contextUpdatedAt; unrelated changes do not; show a relative last-updated hint |
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

## 2. Non-functional requirements

All non-functional requirements are MVP requirements. Target WCAG 2.2 AA; conformance must be evaluated on the finished implementation. The response-time target in NFR-04 is proposed for review.

| ID | Requirement and acceptance check | Priority | Justification |
|---|---|---|---|
| NFR-01 | Assessor can open the deployed prototype and use its features without registration or a paid subscription; test in a signed-out browser | MVP | Assessment pp. 4 and 6 requires marking access |
| NFR-02 | Support complete keyboard operation, visible unobscured focus, labelled controls, accessible dialogs and announced feedback. Normal text contrast must be at least 4.5:1 and essential control/focus contrast at least 3:1. Provide text alongside status colours, 44×44 CSS px hit areas and reduced-motion support. Pass the detailed DESIGN.md §8 checks using keyboard and VoiceOver/Safari | MVP | Supports usable, understandable interaction |
| NFR-03 | Remain usable at 1280×720, 200% text enlargement and 320 CSS px width; stack columns and anchor slots at narrow widths, prevent horizontal page scrolling and clipping, and keep modal controls reachable | MVP | Supports a reliable laptop demonstration |
| NFR-04 | Saving and updating the board with 100 fictional tasks completes within one second on the recorded test laptop/browser | MVP | Proposed measurable responsiveness target |
| NFR-05 | Storage failures show an actionable error and never falsely report a successful save; normal reload/reopen retains data | MVP | Protects user effort and communicates limitations |
| NFR-06 | Core flows pass in current Chrome and one other browser; record versions and failures | MVP | Reduces browser-specific marking problems |
| NFR-07 | Display context as text; sanitise it if Markdown preview is later adopted; pasted HTML must not execute | MVP | Keeps user-entered context safe to display |

| NFR-08 | Use localStorage within one browser profile only; do not introduce a database, backend, cross-device synchronisation or real-time collaboration. Explain browser-local storage in the interface | MVP | Confirmed prototype constraint; supports team workflows on one device |
| NFR-09 | Retain the starter React/Vite and Tailwind architecture and deploy the prototype to Vercel | MVP | Preserves the agreed implementation environment |

## 3. Data requirements

All data requirements are MVP requirements. Preserve the field names and formats defined below, including `createdDate`.

| ID | Data | Source / collection | Justification and check |
|---|---|---|---|
| DR-01 | id, title, description, type, status | User form; application generates unique ID | Identifies and organises tasks; compare saved form values with rendered cards |
| DR-02 | Three team member names and Task.assignee | Target team supplies three distinct names for application configuration; fictional names may be used for demos | Supports ownership; only configured names are accepted |
| DR-03 | dueDate and createdDate | User supplies due date; application generates creation date | Supports urgency and record creation; validate ISO dates and preserve createdDate during edits |
| DR-04 | context, contextTool, contextUpdatedAt | User writes actual briefing and selects tool; application timestamps saved changes | Enables continuation; verify storage and copied content match input |
| DR-05 | Four Anchor objects with fixed IDs, labels and nullable URLs | Fixed slots; user supplies links | Connects final outputs; verify IDs remain stable and URLs persist |
| DR-06 | Three or four example tasks and initialisation state | Fictional seed data from application | Demonstrates first-use behaviour; mark examples as fictional and seed only once |

GitHub handles belong in project documentation, not the runtime task model. No external data feed or AI API is required. Fictional demo data must not be presented as research evidence.

### Task field definitions (DR-01–DR-04)

| Field | Type and validation | Source |
|---|---|---|
| `id` | Unique, non-empty string; unchanged during edits | Application generates on creation |
| `title` | Required trimmed, non-empty string | User input |
| `description` | String; empty allowed | User input |
| `type` | `feature` or `bug`; default `feature` | User selection |
| `status` | `todo`, `in-progress`, `review`, `done`; default `todo` | User selection |
| `assignee` | Required string matching one of three configured team member names | User selection from team configuration |
| `dueDate` | Valid ISO date `YYYY-MM-DD` or null | User input |
| `createdDate` | ISO date `YYYY-MM-DD`; unchanged during edits | Application generates on creation |
| `context` | Markdown string preserving line breaks; empty allowed | User input, initially offered the FR-08 template |
| `contextTool` | `Claude`, `ChatGPT`, `Cursor`, `Lovable`, `Replit`, `Other`, or null | Optional user selection |
| `contextUpdatedAt` | ISO timestamp or null before context has been saved; update when saved context changes | Application-generated |

### Deliverable field definitions (DR-05)

| Field | Type and validation | Source |
|---|---|---|
| `id` | One of `presentation`, `demo`, `report`, `documentation`; unique and fixed | Application configuration |
| `label` | Corresponding label: Presentation, Demo, Report, Documentation | Application configuration |
| `url` | Valid HTTP/HTTPS URL string or null | User input |

Exactly four deliverable records must exist. Removing a URL preserves its record and label.

### Storage and integrity (DR-06–DR-07)

DR-06: Store an initialisation state so fictional example tasks are created once. An intentionally empty task list must remain empty after reload. Example assignees must match the configured team names and be clearly fictional when no real team has been supplied.

DR-07 (MVP): Serialise tasks and anchors to localStorage and restore their field values on reopening the same origin in the same browser profile. Validate loaded records against the defined types and allowed values. Invalid stored data must produce a recoverable error rather than silently overwriting it with example data. This preserves user input and prevents invalid records from breaking the board. Browser storage can be cleared by the user and is not a backup.
