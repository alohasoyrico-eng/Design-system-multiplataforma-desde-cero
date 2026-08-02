# Avatar Group

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/avatar-group/all.json`

## Purpose

Represent people, teams, ownership, overflow, permission-aware disclosure, and presence without packaging grouped identity as a component yet.

## Use When

- A surface needs to show multiple people or teams.
- Overflow count or member disclosure matters.
- Identity affects permissions, ownership, collaboration, or escalation.

## Do Not Use Without Review

- One person is enough; use Avatar.
- Overflow disclosure, privacy, or permission policy is unclear.
- Members are decorative and do not communicate ownership or collaboration.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines stack, overlap, overflow, and disclosure placement. |
| Voice | Owns accessible names, count labels, roles, and privacy copy. |
| Energy | Controls active, online, blocked, selected, and overflow states. |
| State | Loaded, overflow, hidden, permissioned, loading, empty, and selected states are explicit. |
| Depth | Popover/Tooltip discloses members without replacing identity. |
| Accessibility | Each member and overflow count has text-backed meaning. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| members | Avatar[] | yes | Visible identities. |
| overflow | Badge \| Button | conditional | Count and disclosure trigger. |
| disclosure | Popover \| Tooltip \| List | conditional | Member details and permissions. |
| feedback | InlineValidation | conditional | Privacy or unavailable member state. |

## Components And Primitives Used

- Avatar
- Badge
- Button
- Popover
- Tooltip
- List
- Inline Validation

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Team stack | Required | Visible members plus overflow count. |
| Permissioned disclosure | Required state | Hidden members explain privacy. |
| Owner group | Candidate | Shows accountable people for a process. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Disclosure | Popover/Tooltip uses Design System overlay motion. |
| Overflow update | Count updates without shifting the row. |
| Reduced motion | Removes decorative member movement. |

## Accessibility

- Members have accessible names.
- Overflow count is text-backed.
- Disclosure is keyboard reachable.
- Privacy state is explained.

## Implementation Checklist

- Declare `members`: Visible identities.
- Overflow count is visible.
- Disclosure opens after user action.
- Member labels are available.
- Privacy state is not color-only.

## Tests And Rejection Rules

Must test:

- Overflow count is visible.
- Disclosure opens after user action.
- Member labels are available.
- Privacy state is not color-only.

Reject if:

- Members are decorative only.
- Overflow has no accessible count.
- Disclosure exposes private data without policy.

## MIEL

Agents can decide:

- Use Avatar Group as a pattern when multiple identities need ownership or disclosure.
- Compose Avatar, Badge, Popover, Tooltip, and List.
- Keep grouped identity out of package components until bounded behavior is approved.

Agents must ask:

- Privacy, permission, member source, or disclosure policy is unclear.
- Identity affects access, employment, support, or regulated processs.

Agents must reject:

- Members are decorative only.
- Overflow has no accessible count.
- Disclosure exposes private data without policy.

Handoff language:

> Confirm member source, privacy, overflow count, disclosure behavior, permission rules, and accessible labels.
