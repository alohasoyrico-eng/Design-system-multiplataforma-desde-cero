# Bulk Actions

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/bulk-actions/all.json`

## Purpose

Coordinate selection across many records and expose a temporary action surface with count, policy, confirmation, progress, undo, and recovery.

## Use When

- Users need to apply one action to multiple rows, cards, drivers, vehicles, movements, or permissions.
- Selection state must persist while filtering, sorting, paging, or scrolling.
- Actions can be destructive, asynchronous, permissioned, export-oriented, or reversible.

## Do Not Use Without Review

- Only one item can be acted on at a time.
- The action consequence, permission rule, confirmation, undo, or audit event is unknown.
- The pattern hides selected count, affected records, or destructive risk.
- Selection state is stored only in the visual table row and cannot survive filtering or pagination.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines table/card selection rhythm, toolbar placement, sticky behavior, and responsive overflow. |
| Voice | Names selected count, action consequence, destructive risk, progress, success, and undo copy. |
| Energy | Controls selected rows, toolbar surface, focus, action priority, and destructive confirmation. |
| Depth | Separates the bulk toolbar or sheet from the content without hiding selected context. |
| Momentum | Reveals the action toolbar after user selection and respects reduced motion. |
| State | Selected, indeterminate, disabled, loading, confirming, success, error, and undo states are explicit. |
| Accessibility | Requires keyboard selection, select-all state, announced toolbar, Escape close, focus restoration, and non-color-only selected state. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| selectionModel | SelectionState | yes | Stable selected keys independent from visible row order. |
| selectionControls | Checkbox \| Toggle | yes | Row and select-all controls with indeterminate state. |
| toolbar | BulkActionToolbar | yes | Temporary action surface with selected count and commands. |
| actions | BulkAction[] | yes | Each action declares risk, permission, async behavior, and confirmation need. |
| confirmation | Dialog \| InlineConfirm | conditional | Required for destructive, financial, permission, or irreversible actions. |
| feedback | Toast \| Progress \| AuditEvent | yes | Communicates progress, success, failure, undo, and audit result. |
| responsiveMode | toolbar \| bottom-sheet \| overflow-menu | yes | Desktop may use toolbar; mobile moves actions to sheet/menu. |

## Components And Primitives Used

- Table
- Checkbox
- Button
- Dialog
- Toast
- Badge
- Progress Indicator

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Table selection | Current candidate | Rows plus select-all header and contextual toolbar. |
| Card selection | Candidate | Cards use explicit selection controls and a bottom action bar. |
| Destructive action | Required state | Requires confirmation, progress, and recovery/undo. |
| Export action | Candidate | Can skip confirmation when data scope is visible and permissioned. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Toolbar reveal | Appears after the first user selection; reduced motion uses instant state change. |
| Selection feedback | Selected items update immediately; no delayed animation can hide state. |
| Progress feedback | Async actions expose loading/progress before success or failure. |

## Accessibility

- Select-all exposes checked, unchecked, and indeterminate state.
- Selected count is announced when the toolbar appears.
- Keyboard users can select rows and reach bulk actions without losing context.
- Escape clears or closes the toolbar only when that behavior is explicitly documented.
- Destructive actions require confirmation and clear entity naming.

## Implementation Checklist

- Declare `selectionModel`: Stable selected keys independent from visible row order.
- Declare `selectionControls`: Row and select-all controls with indeterminate state.
- Declare `toolbar`: Temporary action surface with selected count and commands.
- Declare `actions`: Each action declares risk, permission, async behavior, and confirmation need.
- Declare `feedback`: Communicates progress, success, failure, undo, and audit result.
- Declare `responsiveMode`: Desktop may use toolbar; mobile moves actions to sheet/menu.
- Select/deselect single row.
- Select all visible records and expose indeterminate state.
- Selection survives filtering/sorting/pagination when product rules require it.
- Destructive action requires confirmation and announces result.
- Async progress, success, error, and undo are visible and accessible.
- Mobile action surface does not cover selected context without a close path.

## Tests And Rejection Rules

Must test:

- Select/deselect single row.
- Select all visible records and expose indeterminate state.
- Selection survives filtering/sorting/pagination when product rules require it.
- Destructive action requires confirmation and announces result.
- Async progress, success, error, and undo are visible and accessible.
- Mobile action surface does not cover selected context without a close path.

Reject if:

- Selected count or selected entities are hidden.
- Destructive action runs without confirmation or recovery.
- Selection is visual-only and not machine-readable.

## MIEL

Agents can decide:

- Use Bulk Actions when selected records and allowed actions are explicit.
- Choose toolbar, sheet, or overflow mode from viewport and density rules.
- Require confirmation for destructive or permission-sensitive actions.

Agents must ask:

- Action consequence, selected scope, audit event, permission rule, or undo behavior is unclear.
- Selection should persist across filters, pages, or backend result sets.
- The action can affect money, access, compliance, legal records, or irreversible state.

Agents must reject:

- Selected count or selected entities are hidden.
- Destructive action runs without confirmation or recovery.
- Selection is visual-only and not machine-readable.

Handoff language:

> Confirm selection scope, permitted actions, destructive policy, progress feedback, undo, audit, and responsive action surface.
