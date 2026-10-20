# Vibecoding Project Tracker — Design

Status: Revised direction for software engineers: modern, warm and focused.
Owner: Benjamin Peck, sole developer. The application serves a team of users.
Scope: M3 `design-done`. Visual specification and reusable tokens for the later build milestones.

## 1. Mood and layout

A modern engineering workspace with warm surfaces, precise typography and purposeful colour, built for scanning tasks and resuming technical work.

Design for software engineers working in teams. Use warm ivory surroundings, white task cards, charcoal text and saturated indigo primary actions. Pale lavender, blue, amber and sage column headers add colour without tinting every task. Keep controls compact, labels explicit and technical context easy to scan. This direction reflects Benjamin’s preference; usability has not yet been tested. No external visual references have been selected.

Desktop composition, top to bottom:

1. Header: product name and short description on the left; primary “Add task” action on the right.
2. Deliverable strip: Presentation, Demo, Report and Documentation in four equal slots above the board. Each includes a label, empty/linked indicator and URL control.
3. Board: four equal columns labelled To Do, In Progress, Review and Done, with task counts beside the headings.
4. Task cards: type label, title, assignee, due-date label and a distinct “Copy Context” action.

Use 12px vertical header padding and 24px desktop horizontal padding. Use 24px outer board padding, 16px column gaps and 12px card gaps. At intermediate desktop widths the board may scroll horizontally; at 320 CSS pixels stack columns in stage order to support zoom and reflow without horizontal page scrolling. Keep the primary desktop target of 1280×720 usable. The header and deliverable strip remain in normal document flow rather than covering the board while scrolling.

Use colour mainly for primary actions, small stage markers, type badges and urgency labels. Avoid decorative gradients, oversized hero sections and playful illustrations. Keep task information prominent, with modest corner radii, crisp separators and minimal shadows. Stage names remain visible so stage colour cannot be confused with urgency.

Initial sample cards use plausible software-development work across feature, bug, review and completed states. Their names, reproduction notes and owners are fictional examples, not verified issues or research evidence. Relative dates show the urgency colours on first use without making the sample depend on a fixed assessment date.

## 2. Colour tokens

All values are implemented in `tailwind.config.js`. Foreground tokens below are intended for text/icons on white or the matching pale surface. Border tokens are decorative separators, not the sole indication of an input or action.

| Token | Hex | Use |
|---|---|---|
| brand-primary | #4338CA | Primary buttons with white text and focus outline |
| brand-accent | #3730A3 | Primary button hover and active states |
| surface-page | #F8F7F4 | Page background |
| surface-card | #FFFFFF | Task cards and modal |
| surface-column | #F0EFEB | Board columns and secondary surfaces |
| surface-hover | #E8E6F2 | Secondary hover state |
| text-primary | #24232B | Headings and primary content |
| text-muted | #625F6B | Supporting text, dates and counts |
| border-subtle | #DEDCE2 | Cards and column separators |
| border-control | #807B89 | Input outlines |
| stage-todo | #EDE9FE | Lavender To Do header surface |
| stage-progress | #DBEAFE | Blue In Progress header surface |
| stage-review | #FEF3C7 | Amber Review header surface |
| stage-done | #DCFCE7 | Sage Done header surface |
| type-feature | #5B21B6 | Feature icon, label and small accent stripe |
| type-feature-soft | #F3E8FF | Feature label background |
| type-bug | #9D174D | Bug icon, label and small accent stripe |
| type-bug-soft | #FCE7F3 | Bug label background |
| due-safe | #166534 | Calm due-date text/icon |
| due-safe-soft | #F0FDF4 | Calm due-date background |
| due-warning | #854D0E | Yellow: due in two calendar days |
| due-warning-soft | #FEF9C3 | Warning date background |
| due-overdue | #991B1B | Red: due today/tomorrow, overdue with `!!`, and destructive actions |
| due-overdue-soft | #FEE2E2 | Overdue date background |
| due-neutral | #475569 | Done or no due date |
| due-neutral-soft | #F1F5F9 | Neutral date background |

Task type is shown with a labelled badge/icon and a 3px left accent. Urgency uses the separate due-date label and its pale background. Keep the rest of the card white so the two meanings do not compete.

Due-state boundaries follow PRD FR-07: Done always neutral; no date neutral; past due red with `!!`; today/tomorrow red; two calendar days away yellow; three or more calendar days away green. Date-only deadlines end immediately before the following local day. Recalculate at least once per minute and on tab focus.

## 3. Typography

Use local system fonts to avoid font downloads and keep the prototype predictable.

| Role | Stack | Reason |
|---|---|---|
| Heading | ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif | Clear headings using the device's familiar font |
| Body | Same as heading | Consistent, readable forms and cards |
| Context/code | ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace | Preserves alignment in Markdown and code snippets |

- Page title: 20px / 28px, semibold, slightly tight letter spacing (-0.02em).
- Column and modal section titles: 16px / 24px, semibold, sentence case.
- Card titles: 14px / 20px, semibold; wrap rather than hide the title.
- Body, buttons and form values: 14px / 20px.
- Supporting labels and timestamps: 14px / 20px; do not use muted colour to hide important information.
- Context editor: 13px / 20px, monospace.
- Use monospace for code, file paths and technical identifiers; use proportional text for task titles and prose. Use tabular numerals for task counts and dates.

## 4. Components and interaction

### Cards

White surface, 1px subtle border, 10px radius, 16px padding and a small shadow on hover. Use a clear title control to open editing and a separate Copy Context button. No nested buttons. Clicking any non-interactive card area opens editing and establishes the title button as the focus-return target. Separate controls such as Copy Context must not open editing. Show the assignee's name alongside initials so ownership is unambiguous.

### Buttons and controls

Primary buttons have indigo fill, white text, 8px radius and at least 44px height. Secondary actions have dark text on white with a control border. Destructive actions use the overdue colour plus explicit wording. Every action has a visible keyboard focus outline with an offset. Use text labels for unfamiliar icons.

### Task modal

Centre a white modal up to 640px wide over a dark translucent backdrop. Limit height to 85vh and scroll its content. Show title and description first, then task type/status/assignee/due date, then Context, AI tool and its update time. Keep Save task and Cancel accessible in the footer, with Delete task separated on the left for existing tasks. Use visible labels, adjacent error text, focus containment, Escape dismissal and focus return to the opener. Cancel, Escape and the close button discard unsaved edits. Backdrop clicks leave the modal open. Show a short “Changes are saved when you select Save task” hint. Keep entered values if saving fails.

### Ownership and handoff

Show a restrained initials badge beside each configured team member name; avoid oversized avatars or decorative profile illustrations. The avatar, name and chevron form one compact disclosure control. Activating it reveals other team members under “Hand off to…”. Escape or clicking elsewhere closes the choices, and focus returns to the owner control after a selection. The modal assignee control is saved with Save task. Selecting a different owner from the card saves immediately and shows a confirmation. This changes browser-local task data; do not imply that a teammate has received a notification.

### Deliverable slots

Show one URL input per slot with a Save link action. Filled slots show “Linked” and an Open link action. Empty slots show “No link yet”. Keep edit/remove actions available. Labels and status text accompany indicators, so status does not depend on colour.

### Feedback and empty states

Use a quiet inset empty state within each column. Show validation inline; show transient confirmations in a status region readable by assistive technology. Failed saves and clipboard errors must remain visible until dismissed or resolved. Confirm deletion with named Delete task and Cancel actions. Respect reduced-motion preferences; any toast fade is at most 150ms.

### Engineering workflow

Keep type, title, owner and deadline visible without opening a task. Make Copy Context accessible directly from the card. The context editor preserves line breaks and indentation and provides enough vertical space for a useful technical briefing. Use explicit labels such as Feature, Bug, Review and Copy Context. Do not add decorative terminal panels, fake activity feeds, invented metrics or nonfunctional search controls to make the app appear technical.

Place a compact copy icon inside the context editor's top-right corner. Its accessible name and tooltip are “Copy Markdown”; copying uses the currently displayed Markdown, including unsaved edits. On success the icon changes to a check for one second, then returns to the copy symbol. Announce success to assistive technology without adding visible status text. On failure, show an error, focus and select the editor text for manual copying. Keep the editor's right padding clear of the icon.

The separate “Copy Context” action on each card and in the task modal assembles a Markdown briefing from title, optional description and complete context. Card copy uses saved values; modal copy uses the displayed fields without saving. A small copy icon changes to a check for one second after success and then returns; the screen reader receives a status announcement without visible success text. Show an inline, labelled, read-only textarea containing the entire briefing if clipboard writing fails, with a Close action that returns focus to Copy Context.

### Movement

Use the status dropdown for moving tasks. Do not show drag handles or grabbing cursors unless drag-and-drop is deliberately selected and implemented later. The distinctive feature remains a PRD decision.

## 5. Voice and microcopy

Use short, direct language that explains the result of an action.

| Location | Text |
|---|---|
| Product description | Tasks, context and deliverables for your team. |
| Primary action | Add task |
| Empty column | No tasks here yet. |
| Empty board action | Add your first task |
| Save action | Save task |
| Copy button | Copy Context |
| Copy success (screen reader) | Context copied. |
| Copy failure | Couldn't copy context. Select and copy the text manually. |
| Delete confirmation | Delete “{title}”? This cannot be undone. |
| Handoff action | Hand off to… |
| Handoff confirmation | Task assigned to {name}. |
| Context hint | Record the background, constraints, what you tried and what comes next. |
| Context timestamp | Last updated {relativeTime} |
| No context timestamp | No context saved yet. |
| Required title | Enter a task title. |
| Invalid URL | Enter a link starting with https:// or http://. |
| Local storage failure | Couldn't save in this browser. Keep this page open and check browser storage settings. |
| Prototype storage note | Saved in this browser. Changes are not shared across devices. |

## 6. Wordmark

Product name: Vibecoding Project Tracker, matching the PRD title.
Use the heading font at semibold weight in text-primary, with a small indigo accent alongside it. No custom logo is required. Plain typography keeps the header compact and leaves room for the board.

## 7. Design review checklist

- Palette and fonts exist in Tailwind and the base page uses them.
- Text colour pairs meet at least 4.5:1 contrast for normal text.
- Type and urgency have distinct locations, labels and meaning.
- Keyboard focus, modal behaviour and errors are specified for implementation.
- Ownership describes application team members, while Benjamin owns development.
- UI wording accurately describes localStorage without claiming live collaboration.
- Review rendered screens during later implementation; this document alone does not validate the final UI.

Out of scope: dark mode, theme switching, custom icon artwork, elaborate animation and a database. Design documentation does not mark the board, modal or other build milestones complete.


## 8. Accessibility acceptance plan

Target WCAG 2.2 Level AA across the finished prototype. This is a design target, not a claim of compliance; assess all applicable criteria on the implementation. The checks below prioritise this application's main risks.

| Check | Implementation and manual acceptance |
|---|---|
| Keyboard | Complete create, edit, assign, move, copy and delete with Tab, Shift+Tab, Enter/Space and native select keys. No mouse-only actions or keyboard traps. Add a skip link to the main board. |
| Focus | Use a clearly visible 2px indigo outline with a 2px offset. Keep focused controls visible and unobscured. After deletion, focus the next task or Add task if none remain. |
| Dialogs | Give the modal an accessible title; move focus inside, contain Tab navigation, make background content inert, support Escape and restore focus to the opener. A delete confirmation initially focuses Cancel. |
| Semantics | Use native buttons, inputs and selects, one page heading, labelled stage sections and task lists. Icon-only controls have accessible names; decorative icons are hidden from assistive technology. |
| Forms | Associate visible labels with inputs. Connect hints/errors using aria-describedby and mark invalid fields with aria-invalid. Explain how to fix errors and retain entered values; focus the first invalid input after failed submission. |
| Feedback | Announce copy, save, handoff and status changes through a polite status region without stealing focus. Announce blocking errors appropriately. Repeated copy buttons include the task title in their accessible name while retaining “Copy Context”. |
| Colour and contrast | Normal text at least 4.5:1; essential control boundaries, icons and focus indicators at least 3:1 against adjacent colours. Show Feature/Bug and urgency text as well as colour. Check hover, focus and validation states too. |
| Zoom and reflow | At 200% text enlargement, nothing clips or disappears. At 320 CSS px (equivalent to 400% zoom on a 1280px viewport), stack board columns and deliverable slots, wrap long text and keep modal actions reachable. Check user text-spacing overrides without loss. |
| Targets | Adopt 44×44 CSS px minimum interactive hit areas as a project design choice; preserve readable spacing between adjacent actions. |
| Motion | Honour prefers-reduced-motion; remove optional transitions. Do not flash or animate task movement automatically. |
| Pointer alternatives | Retain a status dropdown if drag-and-drop is added. No essential information or action appears only on hover. |

Test full flows with keyboard only and with VoiceOver/Safari on macOS. Record browser/version, steps, results and fixes. Run an automated accessibility audit once screens exist, then manually verify interaction and announcements; automated results alone do not establish conformance.

Sources: [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) and [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). The 44px target choice and the specific focus styling are project decisions.


## 9. Interaction states and requirement mapping

These states complete the existing design; they are not new product features.

| Surface | Required states / behaviour | Requirements |
|---|---|---|
| Board | First-use examples, populated columns, empty columns, empty board, storage read error | FR-01, FR-04; DR-06, DR-07 |
| Task form | Create, edit, invalid input, unsaved changes, failed save with retained input, successful save | FR-02, FR-03; NFR-05 |
| Delete | Name the task, focus Cancel, explicit confirmation; do not remove the task if persistence fails | FR-02; NFR-02, NFR-05 |
| Ownership | Show name and initials; announce only a successfully saved reassignment | FR-06; DR-02 |
| Urgency | Text plus colour for calm/warning/overdue/neutral, Done override and no-date label | FR-07 |
| Context | Empty/template, edited, saved timestamp, unchanged timestamp on unrelated edits | FR-08; DR-04 |
| Clipboard | Saved card values versus displayed modal values, successful copy, manual-copy fallback | FR-09 |
| Anchors | No link, draft URL, invalid URL, saved link, cleared link and failed save | FR-10; DR-05 |

On clipboard failure expose a labelled read-only textarea containing the complete generated briefing, with a Close action. Let the user select and copy it without losing task edits. Give this fallback appropriate dialog/focus behaviour if it is displayed as a modal.

On invalid stored data, show a persistent explanation with Retry and an explicit Reset local data option. Reset opens a confirmation describing the loss, defaults focus to Cancel and only clears this app's keys. Never silently replace existing data with demo tasks. A retry must not discard unsaved form input. This is the recovery specified in NFR-05/DR-07, not a backup facility.

Long task titles wrap; long URLs and technical strings wrap without widening the page. No action depends on hover. Do not add disabled placeholder controls for features that have not been built. The distinctive feature FR-11 remains open and has no approved design yet.
