# Drawer

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/drawer/all.json`

## Purpose

Use Drawer for contextual detail, review, or secondary editing while preserving the current task behind the overlay.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.drawer.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.depth.*`, `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Blocking confirmation without Dialog
- Lost focus
- Footer unreachable
- Wrong slide direction
- Raw visual values
- Ask before build: The action is destructive or blocks progress.
- Ask before build: Unsaved changes need confirmation.
- Ask before build: The content may be a full page route instead of a panel.

## Use When

- Use Drawer for contextual detail or editing.
- Use left side for filter/control panels when it matches layout origin.
- Keep footer actions visible for long content.

## Do Not Use Without Review

- Ask before use when the action is destructive or blocks progress.
- Ask before use when unsaved changes need confirmation.
- Ask before use when the content may be a full page route instead of a panel.
- Drawer contains a blocking destructive decision without Dialog review.
- Close, Escape, focus, or scroll behavior is undefined.
- The panel stretches or hides the page context without reason.
- Drawer replaces a blocking Dialog.
- The panel becomes a full route without navigation semantics.
- Footer actions or close controls do not work.
- Body scroll hides required actions.
- Raw visual or motion values are used.

## Operational Example

Use Drawer for contextual detail, review, or secondary editing while preserving the current task behind the overlay.

### Why Drawer

- Drawer keeps context visible while giving enough room for detail or editing.
- The ZIP reference defines the blurred overlay, side slide motion, rounded leading edge, footer, and scrollable body.
- Drawer should not replace Dialog when the user must make a blocking decision.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Overlay | Dims the page while preserving enough context to understand origin. | comp.drawer.*, sys.depth.*, sys.momentum.* |
| Panel | Slides from a side with full-height surface, radius, border, and shadow. | comp.drawer.*, sys.frame.*, sys.energy.* |
| Header | Names the task and exposes close without hiding the object context. | sys.voice.*, sys.accessibility.* |
| Body | Scrolls independent content without shifting the footer. | sys.frame.*, sys.state.* |
| Footer | Pins primary and secondary actions to the panel, not the page. | sys.state.*, sys.energy.*, sys.tone.* |

## Accessibility

State precedence: closing, open, focus, default, closed

- Use role dialog with aria-modal true when the drawer overlays the page.
- Move focus into the drawer and restore it to the trigger when closed.
- Escape closes only when unsaved changes or destructive context are handled.
- Keep header, body, and footer order predictable for keyboard and screen-reader users.
- Use Dialog instead when a blocking confirmation is required.

## Foundations

Referenced token families:

- `comp.drawer.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.voice.*`

Drawer API exposes title, description, variant, side, lifecycle, fields, footer actions, and close behavior while Design System foundations own overlay, panel geometry, motion, focus, and responsive behavior.

## Variants

Drawer variants describe the panel job: side sheet, filter, detail, edit, and review.

Approved variants from demos: `detail`, `filter`, `edit`, `review`

Demo labels:

- Ana Sosa
- Filter routes
- Driver details
- Edit policy
- Review assignment

## States

Drawer states cover lifecycle, focus, unsaved availability, and the closed trigger state.

Supported states from docs: `open`, `focus`, `closing`, `closed`, `default`

## Variant X State Behavior

Variant defines the panel purpose; state defines lifecycle, focus, and whether the trigger or panel is visible.

State matrix: `open`, `focus`, `closing`, `default`, `closed`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Side sheet | side-sheet |  |
| Filter | filter |  |
| Detail | detail |  |

## Full Width

Drawer uses the full viewport height while the panel keeps a defined width. The overlay is full-width; the surface is not.

- Right panel: layout: right side sheet
- Left filter: layout: left side sheet
- Closed trigger: layout: trigger only

## Responsive Layout Patterns

Drawer stays side-aligned on roomy viewports and approaches full width on phones. Long bodies scroll while footer actions remain reachable.

| Example | Layout | Density |
| --- | --- | --- |
| Phone near-full sheet | simple-demo-row | lg |
| Desktop contextual panel | simple-demo-row | sm |

## Viewport Organization

Use Drawer when users need context plus room to act. Use Dialog for blocking confirmation and Menu for compact action lists.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use near-full width with stacked footer actions. | edge sheet | lg |
| Tablet | Keep enough page context visible outside the panel. | side sheet | md |
| Desktop | Use for detail, filters, and edits without route changes. | right panel | sm |

## Playground

Use the playground to verify title, description, variant, side, lifecycle, scroll body, footer actions, and close behavior.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Card controls |  |
| description | text | Review limits, status, and driver access before saving. |  |
| variant | select | side-sheet | side-sheet, filter, detail, edit, review |
| state | select | open | open, focus, closing, default, closed |
| side | select | right | right, left |

## API And Foundations

Drawer API exposes title, description, variant, side, lifecycle, fields, footer actions, and close behavior while Design System foundations own overlay, panel geometry, motion, focus, and responsive behavior.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Drawer title. |
| description | string | No | Drawer description. |
| triggerLabel | string | No | Drawer trigger label. |
| variant | "side-sheet" \| "filter" \| "detail" \| "edit" \| "review" | No | Drawer job. |
| state | "closed" \| "default" \| "open" \| "focus" \| "closing" | No | Lifecycle state. |
| tone | "neutral" \| "info" \| "danger" | No | Panel risk tone. |
| density | "sm" \| "md" \| "lg" | No | Density scale from Flow context. |
| side | DrawerSide | No | Drawer side. |
| content | DrawerContent[] | No | Structured detail rows such as Badge, Progress, or supporting copy. |
| fields | DrawerField[] | No | Local drawer fields. |
| actions | Action[] | No | Drawer actions. |
| open | boolean | No | Initial or controlled open state. |
| id | string | No | Stable drawer id. |
| onOpenChange | (open: boolean) => void | No | Called when local open state changes. |
| onAction | (action: Action) => void | No | Called when an action is selected. |

## Implementation Checklist

- Provide `label`: Drawer title.
- Role dialog and aria-modal when overlaying
- Initial focus and focus restoration
- Escape and close behavior
- Scrollable body with pinned footer
- Left and right slide motion
- Phone width and footer stacking

## Tests And Rejection Rules

Must test:

- Role dialog and aria-modal when overlaying
- Initial focus and focus restoration
- Escape and close behavior
- Scrollable body with pinned footer
- Left and right slide motion
- Phone width and footer stacking

Reject if:

- Drawer replaces a blocking Dialog.
- The panel becomes a full route without navigation semantics.
- Footer actions or close controls do not work.
- Body scroll hides required actions.
- Raw visual or motion values are used.

## MIEL

MIEL treats Drawer as contextual workspace expansion: agents can propose it for filters, detail, and edits while humans confirm if the moment should be a Dialog, Menu, or full route instead.

Agents can decide:

- Use Drawer for contextual detail or editing.
- Use left side for filter/control panels when it matches layout origin.
- Keep footer actions visible for long content.

Agents must ask:

- The action is destructive or blocks progress.
- Unsaved changes need confirmation.
- The content may be a full page route instead of a panel.

Agents must reject:

- Drawer contains a blocking destructive decision without Dialog review.
- Close, Escape, focus, or scroll behavior is undefined.
- The panel stretches or hides the page context without reason.

Handoff language:

> I am using Drawer to keep context while expanding the workspace. Please confirm side, close rules, unsaved-change behavior, footer actions, and route escalation.
