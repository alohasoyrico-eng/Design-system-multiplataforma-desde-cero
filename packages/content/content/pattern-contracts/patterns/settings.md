# Settings

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/settings/all.json`

## Purpose

Organize preferences, account controls, notification rules, integrations, and dangerous actions into predictable groups with clear save behavior.

## Use When

- Users configure durable product, account, workspace, notification, or security preferences.
- Controls need grouping, descriptions, immediate vs saved behavior, and confirmation.
- Dangerous or irreversible actions need visual separation and recovery policy.

## Do Not Use Without Review

- The UI is a one-off form rather than durable settings.
- Immediate and saved changes are mixed without feedback.
- Danger zone actions are placed with normal preferences.
- Controls are unlabeled or depend on icon/color only.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines group spacing, row density, control alignment, and responsive stacking. |
| Voice | Owns setting labels, descriptions, confirmation copy, Toast messages, and danger copy. |
| Energy | Controls group surface, focus, danger zone, disabled, and changed states. |
| State | Immediate, dirty, saving, saved, error, disabled, and destructive states are explicit. |
| Tone | Danger tone is reserved for irreversible or high-risk actions. |
| Accessibility | Every row associates label/description with its control and preserves keyboard focus. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| sections | SettingsSection[] | yes | Titled groups with optional description. |
| rows | SettingsRow[] | yes | Label, description, control, state, and feedback. |
| saveModel | immediate \| explicit-save \| mixed | yes | Declares whether changes save instantly or require submit. |
| feedback | Toast \| InlineValidation \| ErrorPanel | yes | Confirms saved changes, failures, and undo when available. |
| dangerZone | DangerAction[] | conditional | Separated destructive actions with confirmation and recovery policy. |
| responsiveMode | stacked \| two-column | yes | Mobile stacks rows; desktop can use grouped panels. |

## Components And Primitives Used

- Switch
- Select
- Input
- Button
- Toast
- Dialog
- Card

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Immediate settings | Current candidate | Switch/select changes save immediately and report Toast feedback. |
| Explicit save | Candidate | Dirty state is tracked and saved with a primary action. |
| Danger zone | Required state | Destructive actions are separated and confirmed. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Save feedback | Toast or inline state appears after change; reduced motion avoids decorative entrance. |
| Dirty state | Changed rows update immediately without layout shift. |
| Danger confirmation | Dialog/sheet opens after user action with focus management. |

## Accessibility

- Each setting has a visible label and associated description.
- Controls expose checked/selected/disabled state.
- Immediate changes announce success or failure.
- Danger actions require confirmation and named consequence.
- Keyboard navigation follows row order and does not trap focus.

## Implementation Checklist

- Declare `sections`: Titled groups with optional description.
- Declare `rows`: Label, description, control, state, and feedback.
- Declare `saveModel`: Declares whether changes save instantly or require submit.
- Declare `feedback`: Confirms saved changes, failures, and undo when available.
- Declare `responsiveMode`: Mobile stacks rows; desktop can use grouped panels.
- Immediate setting saves and shows feedback.
- Explicit-save setting tracks dirty state and blocks duplicate submit.
- Danger action is separated and requires confirmation.
- Mobile rows stack without losing labels/descriptions.
- Screen reader labels include setting name and state.
- Disabled settings explain why they cannot change.

## Tests And Rejection Rules

Must test:

- Immediate setting saves and shows feedback.
- Explicit-save setting tracks dirty state and blocks duplicate submit.
- Danger action is separated and requires confirmation.
- Mobile rows stack without losing labels/descriptions.
- Screen reader labels include setting name and state.
- Disabled settings explain why they cannot change.

Reject if:

- A setting has no visible label.
- Immediate and explicit save behavior are mixed without state.
- Danger action appears as a normal row.

## MIEL

Agents can decide:

- Group settings when labels, descriptions, and save behavior are explicit.
- Use immediate save for simple reversible toggles with clear feedback.
- Separate danger actions when destructive risk is present.

Agents must ask:

- Save behavior, permission policy, danger consequence, account/session impact, or recovery is unclear.
- Settings affect billing, security, identity, access, compliance, or integrations.

Agents must reject:

- A setting has no visible label.
- Immediate and explicit save behavior are mixed without state.
- Danger action appears as a normal row.

Handoff language:

> Confirm setting groups, row labels, save model, permissions, feedback, danger actions, and responsive organization.
