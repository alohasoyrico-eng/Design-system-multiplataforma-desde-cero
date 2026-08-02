# Roles And Permissions

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/roles-and-permissions/all.json`

## Purpose

Let admins grant access safely with dependencies, auditability, templates, review paths, and reversible feedback.

## Use When

- Users assign permissions, roles, or access templates.
- Permission changes need review, audit, or dependency checks.
- A matrix or table must explain who gets access and why.

## Do Not Use Without Review

- Permission source, owner, or dependency model is unclear.
- Changes can affect finance, compliance, identity, or security without approval.
- The surface cannot show audit evidence or recovery.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines matrix density, role grouping, review panel placement, and audit spacing. |
| Voice | Owns role labels, permission copy, dependency warnings, and audit language. |
| Energy | Controls enabled, inherited, warning, and pending states without color-only meaning. |
| State | Enabled, disabled, inherited, pending, blocked, dirty, saved, and audit states are explicit. |
| Depth | Confirmation and policy hints layer above the matrix with Design System overlays. |
| Accessibility | Permission state, role scope, dependency warnings, and audit trail are text-backed. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| matrix | Table | yes | Role/permission grid using package Table for structure. |
| controls | Checkbox \| Switch | yes | Atomic permission toggles. |
| policy | Badge \| Tooltip \| InlineValidation | conditional | Dependency, inherited, or blocked state. |
| audit | AuditEvent | yes | Evidence of changes and owner. |
| actions | Button[] | yes | Review, save, cancel, or request approval. |

## Components And Primitives Used

- Table
- Checkbox
- Switch
- Badge
- Tooltip
- Inline Validation
- Audit Event
- Button
- Toast
- Dialog

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Role matrix | Required | Permissions are grouped by role and capability. |
| Pending review | Required state | Sensitive changes require confirmation or approval. |
| Audit trail | Required | Recent access changes stay visible. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Toggle state | Permission state updates immediately but save/review remains explicit. |
| Policy feedback | Warnings appear without layout jump. |
| Save feedback | Toast or audit update confirms the result. |

## Accessibility

- Permission labels identify role and capability.
- Inherited or blocked states are text-backed.
- Audit events are readable in order.
- Save/review actions are keyboard reachable.

## Implementation Checklist

- Declare `matrix`: Role/permission grid using package Table for structure.
- Declare `controls`: Atomic permission toggles.
- Declare `audit`: Evidence of changes and owner.
- Declare `actions`: Review, save, cancel, or request approval.
- Permission toggle marks the matrix dirty.
- Blocked dependency shows validation.
- Save reveals feedback and audit evidence.
- Keyboard users can reach controls and actions.

## Tests And Rejection Rules

Must test:

- Permission toggle marks the matrix dirty.
- Blocked dependency shows validation.
- Save reveals feedback and audit evidence.
- Keyboard users can reach controls and actions.

Reject if:

- Permission changes have no audit path.
- Blocked or inherited states are color-only.
- The pattern hides role/capability scope.

## MIEL

Agents can decide:

- Use Roles and Permissions for access policy processs.
- Use Table plus atomic controls; do not package Permission Matrix as a component.
- Require audit evidence for permission changes.

Agents must ask:

- Role model, dependency policy, approval system, audit requirements, or tenant scope is unclear.
- Changes affect finance, security, compliance, legal, or identity access.

Agents must reject:

- Permission changes have no audit path.
- Blocked or inherited states are color-only.
- The pattern hides role/capability scope.

Handoff language:

> Confirm roles, capabilities, dependencies, approval policy, audit requirements, tenant scope, and recovery behavior.
