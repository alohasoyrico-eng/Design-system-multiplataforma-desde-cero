# Fullscreen Sheet

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/fullscreen-sheet/all.json`

## Purpose

Run a focused mobile task in a near-fullscreen sheet while preserving route context, recovery, validation, and a clear close path.

## Use When

- A mobile system needs more than one short action but should not become a new page.
- Users need to edit or review contextual data without losing their place.
- The task needs step progress, validation, and submit feedback.

## Do Not Use Without Review

- The task is permanent navigation or a full screen destination.
- The sheet hides critical context needed to make the decision.
- Close, back, validation, or focus recovery rules are unclear.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines safe area, sheet edge, internal scrolling, action rail, and responsive density. |
| Voice | Owns title, helper copy, validation, close, back, and submit labels. |
| Energy | Controls action priority, focus, invalid, disabled, and success states. |
| Depth | Separates the sheet from the current route only when it leaves document system. |
| Momentum | Uses sheet reveal, step transition, and reduced-motion fallback. |
| Accessibility | Requires labelled surface, focus containment, Escape/back close, and restored focus. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button | yes | Opens the mobile task after user intent. |
| sheet | BottomSheet | yes | Owns the mobile container and close recovery. |
| progress | Stepper | conditional | Shows task position for multi-step work. |
| content | Input \| Select \| Custom | yes | Task fields or review content. |
| validation | InlineValidation | conditional | Explains blocked progress. |
| actions | Button[] | yes | Back, continue, submit, and cancel actions. |
| feedback | Toast | conditional | Confirms completion without replacing navigation. |

## Components And Primitives Used

- Stepper
- Input
- Button
- Inline Validation
- Card Summary
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Single task | Candidate | One sheet with one submit step. |
| Stepped task | Current candidate | Step progress, back/continue, validation, and submit. |
| Review task | Candidate | Final step summarizes values before submit. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open | Sheet enters after trigger with Design System reveal timing. |
| Step change | Content changes only after explicit continue/back. |
| Close | Cancel or submit restores focus to the trigger. |

## Accessibility

- The sheet has an accessible title.
- Open state starts closed and only changes after user action.
- Validation appears after attempted progress.
- Back and close paths are keyboard reachable.
- Focus returns to the trigger after close.

## Implementation Checklist

- Declare `trigger`: Opens the mobile task after user intent.
- Declare `sheet`: Owns the mobile container and close recovery.
- Declare `content`: Task fields or review content.
- Declare `actions`: Back, continue, submit, and cancel actions.
- Trigger opens sheet from closed state.
- Continue advances only when required data is present.
- Back returns to the previous step.
- Submit shows feedback and closes the sheet.
- Phone viewport keeps actions visible without overlap.

## Tests And Rejection Rules

Must test:

- Trigger opens sheet from closed state.
- Continue advances only when required data is present.
- Back returns to the previous step.
- Submit shows feedback and closes the sheet.
- Phone viewport keeps actions visible without overlap.

Reject if:

- The sheet replaces primary navigation.
- The task has no close or back path.
- Validation appears before user action.

## MIEL

Agents can decide:

- Use Fullscreen Sheet for contextual mobile tasks that are larger than an Action Sheet.
- Use Stepper when the task has clear ordered steps.
- Use Inline Validation for blocked progress.

Agents must ask:

- Navigation ownership, close recovery, destructive submit, or persistence rules are unclear.

Agents must reject:

- The sheet replaces primary navigation.
- The task has no close or back path.
- Validation appears before user action.

Handoff language:

> Confirm trigger, step model, required fields, close behavior, submit consequence, and feedback.
