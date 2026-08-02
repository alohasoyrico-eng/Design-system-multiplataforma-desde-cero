# Transfer List

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/transfer-list/all.json`

## Purpose

Move users, vehicles, roles, permissions, or stations between available and selected sets with search, review, and reversible feedback.

## Use When

- Users need to assign many entities from one set to another.
- Search, selection, review, or permission rules affect transfer.
- The transfer changes membership, access, routes, or assignments.

## Do Not Use Without Review

- A simple Select or Multi Select is enough.
- Source, destination, permission, or audit policy is unclear.
- Transfers are irreversible without confirmation.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines two-pane layout, action column, density, and responsive stacking. |
| Voice | Owns available/selected labels, count, empty, and confirmation copy. |
| Energy | Controls selected, disabled, warning, and transfer action states. |
| State | Selected, moved, empty, filtered, disabled, pending, saved, and error states are explicit. |
| Depth | Confirmation and review layer above panes when needed. |
| Accessibility | Counts, movement direction, and selected state are text-backed. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| available | List \| Checkbox[] | yes | Source set. |
| selected | List \| Checkbox[] | yes | Destination set. |
| actions | Button[] | yes | Move, remove, apply, reset. |
| search | Input | conditional | Filters large sets. |
| feedback | Badge \| Toast \| InlineValidation | conditional | Counts, saved state, or blocked transfer. |

## Components And Primitives Used

- List
- Checkbox
- Button
- Input
- Badge
- Toast
- Inline Validation

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Role assignment | Required | Move users or roles between sets. |
| Filtered transfer | Required state | Search narrows source list. |
| Review before save | Candidate | Confirmation required for risky transfer. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Move item | Item appears in destination after explicit action. |
| Count update | Counts update instantly. |
| Reduced motion | No animated sorting required. |

## Accessibility

- Pane labels are present.
- Counts are text-backed.
- Move actions name direction.
- Keyboard users can select and transfer.

## Implementation Checklist

- Declare `available`: Source set.
- Declare `selected`: Destination set.
- Declare `actions`: Move, remove, apply, reset.
- Move selected item to destination.
- Remove item from destination.
- Search filters available list.
- Counts update after transfer.

## Tests And Rejection Rules

Must test:

- Move selected item to destination.
- Remove item from destination.
- Search filters available list.
- Counts update after transfer.

Reject if:

- A simpler Select/Multi Select is enough.
- Counts are hidden.
- Transfer direction is ambiguous.

## MIEL

Agents can decide:

- Use Transfer List for assigning entities between two sets.
- Use List/Checkbox/Button composition.
- Require review for risky transfers.

Agents must ask:

- Source, destination, permission, audit, or persistence policy is unclear.
- Transfer affects access, finance, compliance, legal, or identity state.

Agents must reject:

- A simpler Select/Multi Select is enough.
- Counts are hidden.
- Transfer direction is ambiguous.

Handoff language:

> Confirm source, destination, allowed moves, search, selection, audit, confirmation, and persistence behavior.
