# Vibecoding Project Tracker — Product Requirements

## 1. Functional requirements

These describe what the team-facing prototype must do. **MVP** means required for the minimum viable prototype. **After MVP** remains required for the completed hackathon prototype. IDs are stable for design and test references. Requirements are specifications, not claims that features are implemented.

### FR-01 — Render the four-column board

**Priority:** MVP

**Rationale/source:** M4: make progress visible.

**Acceptance criteria**

- Columns labelled To Do, In Progress, Review and Done in that order.
- Tasks appear under their saved status.
- Each card shows title and assignee.
- First use seeds 3–4 fictional tasks once.
- Deleting all tasks does not trigger reseeding.
- Show a labelled empty state for an empty column and an Add task action when the board is empty.

### FR-02 — Create, edit and delete tasks through one modal

**Priority:** MVP

**Rationale/source:** M5: maintain task information.

**Acceptance criteria**

- “+” opens a blank form.
- Clicking a card opens saved values.
- Save creates or updates the task.
- Delete removes it.
- Blank titles show validation.
- Cancel preserves saved data.
- IDs and createdDate are generated automatically.
- Require a trimmed non-empty title and one configured assignee; description and due date are optional.
- Cancel, Escape and the close button discard unsaved edits. Clicking the backdrop does not close the form.
- Deleting an existing task requires confirmation naming the task; Cancel preserves it.

### FR-03 — Change task status

**Priority:** MVP

**Rationale/source:** M5: track work through stages.

**Acceptance criteria**

- Modal dropdown supports all four states.
- Saving moves the existing card without duplication.
- Changing status in the modal takes effect only on Save task; Cancel leaves the original column unchanged.
- Dragging a card to another column changes its saved status; dropping before a card can reorder within a column. A storage failure leaves the original status/order unchanged and shows an error. The modal Status dropdown remains available without dragging.

### FR-04 — Persist tasks and anchors

**Priority:** MVP

**Rationale/source:** M5 and M11: retain work.

**Acceptance criteria**

- Creation, edits, deletions, reassignment, context and URLs survive reload and browser reopening in the same browser profile.
- Do not report success until the browser storage write succeeds; on failure retain form input and offer a retry.

### FR-05 — Distinguish feature and bug tasks

**Priority:** MVP

**Rationale/source:** M6: identify task type.

**Acceptance criteria**

- Consistent type colours and icons on cards and modal.
- A label/icon communicates meaning without colour alone.

### FR-06 — Display ownership and support handoff

**Priority:** MVP

**Rationale/source:** M7: make responsibility clear.

**Acceptance criteria**

- Card shows initials/name.
- Handoff dropdown uses the current configured team members.
- Reassignment updates the card, shows confirmation and persists.
- The modal assignee change takes effect on Save task. A separate board handoff control, if provided, saves immediately and announces the new owner.
- Selecting the current owner is a no-op. Handoff does not send notifications or change other task fields.

### FR-07 — Show due-date urgency

**Priority:** MVP

**Rationale/source:** M8: identify time-sensitive work.

**Acceptance criteria**

- Green, yellow, red and neutral deadline states are distinguishable by text as well as colour; overdue dates are red with a visible `!!` marker.
- Done overrides urgency.
- States update while the board remains open without editing a task.
- Use the proposed deadline rules below. Recalculate at least once per minute and when returning to the browser tab.

#### FR-07 deadline rules

Interpret a date-only due date as the final instant before the following local calendar day. Test exact boundaries rather than parsing it as UTC midnight.

| Condition, evaluated in this order | State |
|---|---|
| Task is Done | Neutral |
| No due date | Neutral |
| Due date is before today | Red, overdue with `!!` |
| Due today or tomorrow | Red |
| Due in two calendar days | Yellow |
| Due in three or more calendar days | Green |

These bands use local calendar dates, not rolling 24-hour periods. State labels accompany colours; date changes need no manual refresh.

### FR-08 — Store Markdown context and selected AI tool

**Priority:** MVP

**Rationale/source:** M9: retain the briefing for continued work.

**Acceptance criteria**

- Modal contains Context textarea and optional tool dropdown with the values defined in DR-04.
- Saved context/tool survive reload.
- Saved context changes update contextUpdatedAt.
- Unrelated changes do not.
- Show a relative last-updated hint.
- Provide an inline copy control for the context editor that copies its currently displayed Markdown, including unsaved edits, without saving the task. Give success feedback and a manual-selection fallback if clipboard access fails.
- Offer Background, Constraints, Tried so far and Pick up as a starting template. Users can record prompts and their outcomes in Tried so far.
- Save the timestamp on creation only if context contains non-whitespace text; subsequently update it when saved context changes, including clearing it. Changing only the AI tool does not change the context timestamp.

### FR-09 — Copy task context

**Priority:** MVP

**Rationale/source:** M10: transfer the briefing into an AI chat.

**Acceptance criteria**

- Button on every card and in modal copies title, description and complete context as readable Markdown.
- Verify by pasting into a text editor.
- Card copy does not open modal.
- Failures show a message.
- Card copy uses saved task values; modal copy uses displayed values without saving them (proposed behaviour).
- Copy still works when optional description/context is blank. On clipboard failure, show the full generated text in a labelled selectable field for manual copying.

### FR-10 — Maintain deliverable anchors

**Priority:** MVP

**Rationale/source:** M11: keep outputs accessible.

**Acceptance criteria**

- Presentation, Demo, Report and Documentation remain above the board.
- Each saves one URL.
- Empty/filled status updates on adding/removing it.
- Saved HTTP/HTTPS links open and survive reload.
- Validate HTTP/HTTPS URLs, associate errors with the field and preserve invalid input for correction.
- Save link persists an edited URL; Open link opens the saved URL. Clear link removes the URL but preserves its fixed slot.

### FR-11 — Filter tasks by engineer using Focus View

**Priority:** After MVP · **Status:** Defined for M12

**Requirement:** Provide a Focus View that filters the board to one selected engineer’s tasks without changing task ownership or hiding the route back to the full board (M12).

**Rationale:** An engineer needs a quick view of their own work while the team board remains available.

**Acceptance criteria**

- An explicitly labelled engineer selector offers every configured team member and All tasks.
- Selecting an engineer shows only their tasks in the existing four status columns, using the current board order setting.
- The board shows the visible count and an explicit Show all tasks action. A selected engineer with no work receives an informative empty state.
- The selection survives reload in the same browser. If preference storage fails, the view still changes for the current page and explains that it will not be remembered.
- Filtering does not alter saved task records, owners, or the local-only prototype model. Users can still edit tasks; the full board retains drag reordering.

### FR-12 — Switch between light and dark modes

**Priority:** After MVP · **Status:** Defined

**Requirement:** Let a user switch the interface between the existing light theme and a dark theme from the top-right header without changing their task data.

**Acceptance criteria**

- A labelled, keyboard-operable switch reports its current on/off state and changes the whole interface, including the board and task modal.
- The chosen mode survives reload in the same browser; if preference storage fails, the current page still changes and reports that the choice was not remembered.
- Both modes retain readable text, visible focus, and text labels alongside type, deadline and status colours.

### FR-13 — Prioritise and order tasks

**Priority:** After MVP · **Status:** Defined

**Requirement:** Let users set a task's priority and show higher-priority tasks first in each column by default.

**Acceptance criteria**

- The task modal offers High, Normal and Low in a labelled dropdown; new tasks default to Normal. The saved priority appears as text on the card.
- Each column defaults to High, then Normal, then Low; tasks of equal priority use earliest due date first, with undated tasks last.
- A labelled Order control offers Priority, Due date and Manual. Manual shows saved card order and enables dragging; clicking or keyboard-activating each card's labelled grip opens non-drag actions for reordering or changing columns. Sorted views do not present these manual controls.
- The order choice survives reload in the same browser and applies within Focus View. Changing the view does not rewrite task records.
- Existing saved tasks without a priority load as Normal without overwriting their stored records; invalid priority values are rejected.

### FR-14 — Manage the local team roster

**Priority:** After MVP

**Requirement:** Add and remove team members so the task owner list reflects the current team.

**Acceptance criteria**

- A labelled Manage team dialog lists members and their assigned task counts, and accepts a unique member name and email address, plus an optional GitLab profile URL.
- Member email and GitLab profile URL can be edited later. A saved GitLab URL opens the profile only; it does not import activity or authenticate the member.
- Newly added members appear in the task assignee, card handoff and Focus View controls and remain after reload in the same browser.
- A member with assigned tasks cannot be removed until those tasks are reassigned; at least one member remains.
- Invalid names and failed browser writes show an error without reporting success. Managing members does not create accounts or share changes with another browser.

## 2. Non-functional requirements

These specify quality standards. All are **MVP**. WCAG 2.2 AA is a target to assess on the completed prototype, not a current compliance claim.

### NFR-01 — Access for assessment

**Priority:** MVP

**Rationale:** Assessment pp. 4 and 6 requires marking access.

**Acceptance/constraint:** Assessor can open the deployed prototype and use its features without registration or a paid subscription; test in a signed-out browser.

### NFR-02 — Accessible interaction

**Priority:** MVP

**Rationale:** Supports usable, understandable interaction.

- Complete all core flows using a keyboard, with visible unobscured focus and no keyboard traps.
- Use labelled native controls, an accessible modal title, focus containment and return, and announced save/copy/handoff feedback.
- Normal text contrast is at least 4.5:1; essential controls and focus indicators at least 3:1 against adjacent colours. Type and urgency use labels as well as colour.
- Adopt 44×44 CSS px interactive hit areas as a project choice and honour reduced-motion preferences.
- Verify all detailed checks in DESIGN.md §8 with keyboard and VoiceOver/Safari; record results. Automated checks supplement manual evaluation.

### NFR-03 — Zoom and reflow

**Priority:** MVP

**Rationale:** Supports a reliable laptop demonstration.

**Acceptance/constraint:** Remain usable at 1280×720, 200% text enlargement and 320 CSS px width; stack columns and anchor slots at narrow widths, prevent horizontal page scrolling and clipping, and keep modal controls reachable.

### NFR-04 — Response time

**Priority:** MVP

**Rationale:** Proposed measurable responsiveness target.

**Acceptance/constraint:** Proposed target: with 100 fictional tasks, each of 10 consecutive task saves updates the board within one second, measured from Save task activation to the updated card being rendered. Record hardware, OS, browser version and timings; exclude initial loading. This is an assistant-proposed target, not a measured user need.

### NFR-05 — Reliability and error recovery

**Priority:** MVP

**Rationale:** Protects user effort and communicates limitations.

**Acceptance/constraint:** Failed reads/writes must show actionable persistent errors and must not show a false saved state. Keep unsaved form input available for retry. Invalid stored data must not be silently replaced by seed data. Offer reload/retry; an explicit reset requires confirmation and affects only this application’s storage keys. Existing data remains untouched until the user confirms reset. Test failures as well as normal reload/reopening.

### NFR-06 — Browser compatibility

**Priority:** MVP

**Rationale:** Reduces browser-specific marking problems.

**Acceptance/constraint:** Core flows pass in current Chrome and one other browser; record versions and failures.

### NFR-07 — Safe handling of user input

**Priority:** MVP

**Rationale:** Keeps user-entered context safe to display.

**Acceptance/constraint:** Display context as text; sanitise it if Markdown preview is later adopted; pasted HTML must not execute.

## 3. Data requirements

DR-01–DR-07 are **MVP**; DR-08–DR-11 support later additions. Each group identifies its source, purpose and rules. Retain starter field names, particularly `createdDate`. No external data feed or AI API is required.

### DR-01 — Task identity and classification

**Priority:** MVP

**Source:** User form; application generates IDs.

**Rationale:** Identify and organise work.

**Data rules:** Require a unique immutable ID, trimmed non-empty title and valid type/status. Description may be empty. Defaults are feature and todo.

### DR-02 — Team membership and ownership

**Priority:** MVP

**Source:** Three fictional initial team names; user selects owner and may update the local roster.

**Rationale:** Support team assignment and handoff.

**Data rules:** Each task references exactly one current member name. Demo names are clearly fictional; developer identity does not determine task ownership. Account registration is not required.

### DR-03 — Task dates

**Priority:** MVP

**Source:** User supplies dueDate; application generates createdDate.

**Rationale:** Support deadlines and record creation.

**Data rules:** Use valid YYYY-MM-DD calendar dates. dueDate may be null; createdDate is immutable. Apply FR-07 local-calendar rules.

### DR-04 — AI context

**Priority:** MVP

**Source:** User supplies text/tool; application generates update timestamp.

**Rationale:** Retain an editable briefing for continued work.

**Data rules:** Preserve Markdown whitespace and line breaks. Restrict tool to the listed values or null. Apply FR-08 timestamp rules. No generated example content is actual prompt history.

### DR-05 — Deliverable links

**Priority:** MVP

**Source:** Fixed slot definitions; user supplies URLs.

**Rationale:** Keep project outputs accessible.

**Data rules:** Exactly four fixed IDs/labels must exist. Validate HTTP/HTTPS URLs; empty slots store null. Clearing a link never deletes its slot.

### DR-06 — Initial demonstration data

**Priority:** MVP

**Source:** Fictional application seed data.

**Rationale:** Provide a usable first-run demonstration.

**Data rules:** Seed 3–4 fictional software-development tasks only when there is no initialised dataset. Give examples plausible descriptions, Markdown context and relative due dates so urgency states can be demonstrated. An empty saved list remains empty. Seed task assignees match the configured names; all fields satisfy this schema. An untouched first-release example dataset may be upgraded to the revised examples; edited or deleted task data must remain unchanged.

### DR-07 — Storage and integrity

**Priority:** MVP

**Source:** Application serialises and reads localStorage.

**Rationale:** Preserve records without silently losing user data.

**Data rules:** Restore saved field values on the same origin/browser profile. Validate types, required values, enum membership, unique task IDs and exact anchor slots. Reject malformed records through NFR-05 recovery; do not overwrite them with examples. Browser-cleared data cannot be recovered automatically. No cross-device sync or backup is provided.

### DR-08 — Focus View preference

**Priority:** After MVP

**Source:** Engineer selection in FR-11.

**Data rules:** Store only the selected configured team-member name in a separate browser-local key. An absent or unrecognised value means All tasks. Clearing the filter removes this preference without editing task records.

### DR-09 — Theme preference

**Priority:** After MVP

**Source:** Header theme switch in FR-12.

**Data rules:** Store `light` or `dark` in a separate browser-local key; absent or unrecognised values use light mode. This preference must not alter task or deliverable records.

### DR-10 — Task priority and order preference

**Priority:** After MVP

**Source:** Priority field and board Order control in FR-13.

**Data rules:** Each task stores `high`, `normal` or `low`; legacy tasks without this field behave as `normal`. Store the selected order mode (`priority`, `due` or `manual`) separately from task records. Missing or unrecognised mode defaults to `priority`.

### DR-11 — Local team roster

**Priority:** After MVP

**Source:** Manage team controls in FR-14.

**Data rules:** Store an ordered list of unique, trimmed member names in a separate browser-local key, and contact details keyed by member name in another local key. Use three fictional names only when no roster has been saved; these examples may have blank contact details. New members require a valid email address; GitLab URL is optional and must point to an HTTPS gitlab.com profile. Keep at least one member, limit the roster to 50 members and names to 2–60 characters. Invalid saved data must not be silently overwritten. A task owner must be present in the current roster; removing a member who still owns tasks is disallowed.

### Task field reference (DR-01–DR-04, DR-10)

| Field | Type and validation | Source |
|---|---|---|
| `id` | Unique, non-empty string; unchanged during edits | Application generates on creation |
| `title` | Required trimmed, non-empty string | User input |
| `description` | String; empty allowed | User input |
| `type` | `feature` or `bug`; default `feature` | User selection |
| `priority` | `high`, `normal` or `low`; default `normal` | User selection |
| `status` | `todo`, `in-progress`, `review`, `done`; default `todo` | User selection |
| `assignee` | Required string matching one of three configured team member names | User selection from team configuration |
| `dueDate` | Valid ISO date `YYYY-MM-DD` or null | User input |
| `createdDate` | ISO date `YYYY-MM-DD`; unchanged during edits | Application generates on creation |
| `context` | Markdown string preserving line breaks; empty allowed | User input, initially offered the FR-08 template |
| `contextTool` | `Claude`, `ChatGPT`, `Cursor`, `Lovable`, `Replit`, `Other`, or null | Optional user selection |
| `contextUpdatedAt` | ISO timestamp or null until context has first been saved with content; thereafter update when saved context changes | Application-generated |

### Deliverable field definitions (DR-05)

| Field | Type and validation | Source |
|---|---|---|
| `id` | One of `presentation`, `demo`, `report`, `documentation`; unique and fixed | Application configuration |
| `label` | Corresponding label: Presentation, Demo, Report, Documentation | Application configuration |
| `url` | Valid HTTP/HTTPS URL string or null | User input |

Exactly four deliverable records must exist. Removing a URL preserves its record and label.
