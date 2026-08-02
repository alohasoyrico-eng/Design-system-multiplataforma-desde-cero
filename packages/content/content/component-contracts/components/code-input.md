# Code Input

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/code-input/all.json`

## Purpose

Use Code Input to capture one bounded verification code without owning the full authentication journey.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `input`

Token dependencies: `comp.input.*`, `comp.code-input.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Owns login system
- No visible label
- Six independent fields
- Color-only error
- Ask before build: The code affects money, access, or safety.
- Ask before build: Delivery channel, expiry, or resend policy is unclear.
- Ask before build: OTP combines with password, biometric, or risk recovery.

## Use When

- Use Code Input for one SMS, OTP, email, or approval code.
- Use length when the product code is intentionally short or long.
- Use warning for expiring or resend-sensitive states.

## Do Not Use Without Review

- Ask before use when the code affects money, access, or safety.
- Ask before use when delivery channel, expiry, or resend policy is unclear.
- Ask before use when oTP combines with password, biometric, or risk recovery.
- Code Input owns the whole auth system.
- The code field has no label.
- Error or expiry is color-only.
- The code has no visible label.
- Each slot is an unrelated input.
- The component owns login sequencing.
- Expiry or error is color-only.

## Operational Example

Use Code Input to capture one bounded verification code without owning the full authentication journey.

### Why Code Input

- SMS and OTP are variants of the same Code Input family: one visible code entry with channel-specific helper copy.
- Code Input keeps one code entry accessible and paste-friendly.
- Passcode Keypad is not a Code Input variant; it belongs to authentication patterns because it owns keypad, progress dots, biometric, and backspace behavior.
- Use a pattern when code entry is combined with password, biometrics, resend policy, retry limits, or risk handling.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Group label | Names the verification code purpose in visible text. | comp.input.*, sys.voice.* |
| Code slots | Show digit progress while behaving as one logical input. | comp.code-input.*, sys.frame.* |
| Helper line | Carries expiry, resend, or recovery guidance. | comp.input.*, sys.tone.*, sys.voice.* |
| Focus state | Makes the active slot visible for keyboard users. | sys.accessibility.* |
| Completion state | Confirms code entry without submitting unrelated flows. | sys.state.* |

## Accessibility

State precedence: disabled, error, warning, complete, focus, hover, default

- Expose the code as one grouped input, not six unrelated fields.
- Support paste and one-time-code autocomplete where the platform allows it.
- Associate helper, timer, and error text with the field.
- Keep slot targets large enough for touch.
- Provide text-backed warning and error states.

## Foundations

Referenced token families:

- `comp.code-input.*`
- `comp.input.*`
- `sys.accessibility.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.voice.*`

Code Input API exposes label, value, length, variant, state, and helper copy while reusing Input label/helper rhythm and owning grouped slot geometry. Passcode Keypad behavior is outside this API and belongs to authentication patterns.

## Variants

Code Input variants describe code source and sensitivity while preserving one grouped code-entry contract. Use length for digit count; use variant for meaning such as sms, otp, approval, masked, or compact.

Approved variants from demos: `sms`, `otp`, `approval`, `masked`, `compact`

Demo labels:

- SMS
- OTP
- Approval
- Masked
- Compact

## States

Code Input states communicate focus, completion, expiry, error, and disabled behavior without taking over the auth pattern.

Supported states from docs: `default`, `hover`, `focus`, `complete`, `warning`, `error`, `disabled`

## Variant X State Behavior

Variant defines slot treatment; state defines verification feedback while auth sequencing stays in patterns.

State matrix: `default`, `hover`, `focus`, `complete`, `warning`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| SMS | sms |  |
| OTP | otp |  |
| Approval | approval |  |
| Compact | compact |  |

## Full Width

Code Input can fill auth forms and mobile sheets while each slot keeps a minimum readable target.

- Auth form: layout: button-stack
- Mobile sheet: layout: button-stack
- Approval code: layout: button-stack

## Responsive Layout Patterns

Keep code slots in one readable row when possible and preserve paste/autofill behavior before changing layout.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Code Input should stay close to its instruction, timer, and resend action; the surrounding auth pattern owns the sequence.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use large slots and visible timer copy. | single code field | lg |
| Tablet | Keep helper copy in the same field group. | auth panel field | md |
| Desktop | Use compact slots inside the login column. | compact auth field | sm |

## Playground

Use the playground to verify code length, helper copy, variant, and state before composing an auth pattern.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Security code |  |
| value | text | 428195 |  |
| variant | select | sms | sms, otp, approval, masked, compact |
| state | select | default | default, hover, focus, complete, warning, error, disabled |

## API And Foundations

Code Input API exposes label, value, length, variant, state, and helper copy while reusing Input label/helper rhythm and owning grouped slot geometry. Passcode Keypad behavior is outside this API and belongs to authentication patterns.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible code label. |
| value | string | No | Current code value. |
| length | number | No | Number of code digits; use this instead of creating digit-count variants. |
| variant | "sms" \| "otp" \| "approval" \| "masked" \| "compact" | No | Semantic treatment for code source or sensitivity while preserving one logical input. |
| masked | boolean | No | Masks visible slot digits while keeping the underlying one-time-code input value. |
| helper | string | No | Short helper text. |
| onValueChange | (value: string) => void | No | Called when local digits change. |
| state | "default" \| "hover" \| "focus" \| "complete" \| "warning" \| "error" \| "disabled" | No | Semantic validation or interaction state. |
| density | "sm" \| "md" \| "lg" | No | Maps to shared Input rhythm for label, helper, and slot size. |
| error | string | No | Error helper text; sets aria-invalid on code slots. |
| disabled | boolean | No | Disables every code slot. |
| onComplete | (value: string) => void | No | Called when all digits are filled. |

## Implementation Checklist

- Provide `label`: Visible code label.
- Grouped accessible name
- Paste behavior
- Timer helper
- Error state
- Disabled state
- Responsive slots

## Tests And Rejection Rules

Must test:

- Grouped accessible name
- Paste behavior
- Timer helper
- Error state
- Disabled state
- Responsive slots

Reject if:

- The code has no visible label.
- Each slot is an unrelated input.
- The component owns login sequencing.
- Expiry or error is color-only.

## MIEL

MIEL treats Code Input as one code-entry component. Agents may place it when a verification code is known, but humans confirm delivery channel, resend policy, expiry, and auth pattern context.

Agents can decide:

- Use Code Input for one SMS, OTP, email, or approval code.
- Use length when the product code is intentionally short or long.
- Use warning for expiring or resend-sensitive states.

Agents must ask:

- The code affects money, access, or safety.
- Delivery channel, expiry, or resend policy is unclear.
- OTP combines with password, biometric, or risk recovery.

Agents must reject:

- Code Input owns the whole auth system.
- The code field has no label.
- Error or expiry is color-only.

Handoff language:

> I am using Code Input for one verification code. Please confirm channel, length, expiry, resend behavior, accessible helper text, and the surrounding auth pattern.
