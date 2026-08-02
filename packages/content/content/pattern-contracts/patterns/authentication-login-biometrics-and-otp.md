# Authentication Login Biometrics And Otp

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/authentication-login-biometrics-and-otp/all.json`

## Purpose

Coordinate phone login, OTP verification, biometric step-up, fallback, validation, and feedback as one recoverable authentication system.

## Use When

- A product needs more than one authentication method.
- OTP and biometric recovery must share state and copy.
- Risk, retry, lockout, or fallback behavior must be visible before build.

## Do Not Use Without Review

- A single local Biometric Prompt or Code Input is enough.
- Security policy, retry limits, or recovery ownership is unclear.
- Authentication affects regulated, financial, or account access decisions.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Focus order, labels, status announcements, and retry recovery are required. |
| State | Idle, sending, code sent, verifying, biometric, fallback, locked, success, and error are explicit. |
| Voice | Copy explains the next action without exposing security internals. |
| Momentum | Step changes use Design System motion and respect reduced motion. |
| Frame | Phone and OTP fields stay readable on compact mobile viewports. |
| Energy | Validation and success states use semantic Design System tones only. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| identity | Phone Input | yes | Primary identifier and recovery contact. |
| otp | Code Input | conditional | Shown after the user requests a code. |
| biometric | Biometric Prompt | conditional | Step-up or returning-user authentication. |
| validation | Inline Validation \| Error Panel | yes | Recoverable field and policy errors. |
| feedback | Toast | conditional | Non-blocking success or retry feedback. |
| actions | Button[] | yes | Send, verify, fallback, and recovery actions. |

## Components And Primitives Used

- Phone Input
- Code Input
- Biometric Prompt
- Button
- Inline Validation
- Error Panel
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Phone + OTP | Required | Baseline login and recovery. |
| Biometric step-up | Required | Returning user or sensitive action. |
| Fallback recovery | Required state | OTP or support path after biometric failure. |
| Locked/retry | Security review | Retry count and lockout copy require policy. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Code reveal | OTP section enters only after Send OTP. |
| Biometric prompt | Uses component motion; no autoplay success. |
| Error recovery | Validation appears near the failing action. |
| Reduced motion | Keeps state changes immediate and text-backed. |

## Accessibility

- Phone and OTP fields have visible labels.
- Biometric action has a text fallback.
- Errors use inline validation or error panel, not color-only state.
- Focus moves only after a user-triggered transition.

## Implementation Checklist

- Declare `identity`: Primary identifier and recovery contact.
- Declare `validation`: Recoverable field and policy errors.
- Declare `actions`: Send, verify, fallback, and recovery actions.
- Send OTP reveals code input after user action.
- Verify shows feedback only after user action.
- Fallback path remains keyboard reachable.
- Narrow viewport keeps fields, prompt, and actions readable.

## Tests And Rejection Rules

Must test:

- Send OTP reveals code input after user action.
- Verify shows feedback only after user action.
- Fallback path remains keyboard reachable.
- Narrow viewport keeps fields, prompt, and actions readable.

Reject if:

- A demo auto-verifies before user action.
- Biometric replaces OTP fallback.
- Security copy exposes implementation details or uses raw tokens.

## MIEL

Agents can decide:

- Use this pattern when phone, OTP, and biometric states must coordinate.
- Use Design System security/input/feedback components rather than custom controls.
- Keep retry feedback local unless policy requires a blocking dialog.

Agents must ask:

- Retry limit, lockout, device trust, risk score, recovery owner, or audit trail is unclear.
- Auth affects financial, identity, compliance, or account recovery behavior.

Agents must reject:

- A demo auto-verifies before user action.
- Biometric replaces OTP fallback.
- Security copy exposes implementation details or uses raw tokens.

Handoff language:

> Confirm identity method, OTP expiry, retry limits, biometric fallback, lockout, audit needs, and support recovery before implementation.
