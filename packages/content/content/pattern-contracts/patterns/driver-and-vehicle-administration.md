# Driver And Vehicle Administration

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/driver-and-vehicle-administration/all.json`

## Purpose

Support alta, baja, editing, assignment, suspension, recovery, and audit for drivers and vehicles through composed management surfaces.

## Use When

- Operators manage drivers, vehicles, cards, documents, or assignments.
- Rows require status, identity, quick actions, pagination, and audit recovery.
- Lifecycle actions need confirmation, permissions, and feedback.

## Do Not Use Without Review

- The process is only a static list.
- Lifecycle consequences, permissions, or audit policy are unclear.
- Driver and vehicle processs are mixed without clear ownership.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines split management layout, table density, summary panels, and action placement. |
| Voice | Owns lifecycle labels, confirmation copy, status, empty states, and audit language. |
| Energy | Controls active, suspended, review, maintenance, and selected states semantically. |
| State | Loaded, loading, empty, selected, dirty, suspended, pending, error, and audit states are explicit. |
| Depth | Edit, assignment, and confirmation surfaces use Design System overlays without becoming table components. |
| Accessibility | Identity, status, actions, pagination, and audit feedback are keyboard reachable and text-backed. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| driverTable | Table | yes | Driver rows composed from Design System table behavior. |
| vehicleTable | Table | yes | Vehicle rows composed from Design System table behavior. |
| identity | Avatar \| Badge | conditional | Driver identity and status metadata. |
| summary | CardSummary \| AuditEvent | conditional | Selected vehicle/card or recent lifecycle event. |
| actions | QuickAction \| Button[] | yes | Invite, edit, assign, suspend, recover, or export. |
| pagination | Pagination | conditional | Paged datasets and remote result sets. |

## Components And Primitives Used

- Table
- Avatar
- Badge
- Quick Action
- Button
- Pagination
- Empty State
- Card Summary
- Audit Event
- Toast
- Dialog

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Driver management | Required | Driver identity, status, assignment, and lifecycle actions. |
| Vehicle management | Required | Vehicle status, card summary, maintenance state, and assignment action. |
| Recovery | Required state | Suspended or failed entities show recovery and audit trail. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Selection | Selected row updates detail context without page jump. |
| Lifecycle feedback | Confirmation and toast feedback preserve table context. |
| Pagination | Page changes preserve toolbar and status orientation. |

## Accessibility

- Tables have labels and row context.
- Lifecycle actions have explicit labels.
- Status is not color-only.
- Pagination and audit feedback are keyboard reachable.

## Implementation Checklist

- Declare `driverTable`: Driver rows composed from Design System table behavior.
- Declare `vehicleTable`: Vehicle rows composed from Design System table behavior.
- Declare `actions`: Invite, edit, assign, suspend, recover, or export.
- Driver and vehicle tabs or sections remain distinct.
- Lifecycle action requires confirmation when destructive.
- Pagination remains reachable.
- Empty and audit states are visible.

## Tests And Rejection Rules

Must test:

- Driver and vehicle tabs or sections remain distinct.
- Lifecycle action requires confirmation when destructive.
- Pagination remains reachable.
- Empty and audit states are visible.

Reject if:

- Lifecycle actions have no confirmation or audit path.
- Driver/vehicle ownership is ambiguous.
- The table is a fake component instead of Design System composition.

## MIEL

Agents can decide:

- Use this pattern for driver and vehicle lifecycle processs.
- Compose package Table and bounded Package components instead of management-table components.
- Use Audit Event for lifecycle evidence.

Agents must ask:

- Lifecycle policy, permissions, data ownership, audit requirements, or recovery rules are unclear.
- Actions affect identity, employment, finance, cards, compliance, or legal state.

Agents must reject:

- Lifecycle actions have no confirmation or audit path.
- Driver/vehicle ownership is ambiguous.
- The table is a fake component instead of Design System composition.

Handoff language:

> Confirm driver and vehicle lifecycle actions, permissions, row data, assignment rules, audit policy, recovery, and pagination.
