# Driver Onboarding Mobile

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/driver-onboarding-mobile/all.json`

## Purpose

Guide a driver through mobile identity, verification, consent, and first-use readiness with compact steps, recovery, and feedback.

## Use When

- A driver must complete several mobile setup steps before operating.
- Verification, consent, or device readiness can fail and recover.
- The system must work as a short mobile journey rather than a desktop form.

## Do Not Use Without Review

- The task is one standalone form section.
- Legal consent, identity evidence, or support escalation is undefined.
- The system requires product-specific routing that belongs in a template.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Uses a single-column mobile layout with stable action area. |
| State | Each step owns pending, complete, validation, and recovery states. |
| Voice | Short labels and helper copy avoid dense desktop instructions. |
| Momentum | Stepper and Animated Moment communicate progress without autoplay decisions. |
| Accessibility | Keyboard, screen reader, and reduced-motion flows remain complete. |
| Depth | Escalation uses sheet/dialog only when the user requests help. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| progress | Stepper | yes | Current setup step. |
| identity | Phone Input \| Code Input | yes | Verification inputs. |
| trust | Biometric Prompt | conditional | Device trust or quick login setup. |
| readiness | Animated Moment \| Card Summary | conditional | Explains setup completion or next action. |
| validation | Inline Validation | yes | Step-level recovery. |
| actions | Button[] | yes | Continue, back, skip allowed, finish. |

## Components And Primitives Used

- Stepper
- Phone Input
- Code Input
- Biometric Prompt
- Animated Moment
- Card Summary
- Button
- Inline Validation
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Identity first | Required | Phone/OTP before device setup. |
| Biometric opt-in | Required | Optional device trust with fallback. |
| First-use ready | Required state | Summary and next action. |
| Support escalation | Review | Only when recovery owner is defined. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Step transition | Uses Design System motion after Continue or Back. |
| Readiness cue | Animated Moment is idle until the user reaches final step. |
| Validation reveal | Appears inline near the current step. |
| Reduced motion | Removes decorative progress animation. |

## Accessibility

- Stepper exposes current step.
- Back and Continue are reachable in the mobile action area.
- Validation appears after user action.
- Biometric setup has OTP or support fallback.

## Implementation Checklist

- Declare `progress`: Current setup step.
- Declare `identity`: Verification inputs.
- Declare `validation`: Step-level recovery.
- Declare `actions`: Continue, back, skip allowed, finish.
- Continue advances steps after user action.
- Back restores the prior step.
- Finish shows feedback only after user action.
- Mobile viewport has no horizontal overflow.

## Tests And Rejection Rules

Must test:

- Continue advances steps after user action.
- Back restores the prior step.
- Finish shows feedback only after user action.
- Mobile viewport has no horizontal overflow.

Reject if:

- The system auto-advances without user action.
- Desktop table/form layout is forced into mobile.
- A template-level route or dashboard is hidden inside the pattern.

## MIEL

Agents can decide:

- Use this pattern for mobile driver setup with verification and readiness.
- Use Design System inputs, security, progress, and feedback components.
- Keep each step short and recoverable.

Agents must ask:

- Legal consent, support escalation, identity evidence, offline mode, or role assignment is unclear.

Agents must reject:

- The system auto-advances without user action.
- Desktop table/form layout is forced into mobile.
- A template-level route or dashboard is hidden inside the pattern.

Handoff language:

> Confirm required steps, optional skips, verification policy, consent copy, support route, and final handoff destination.
