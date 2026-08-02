# Phone Input

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/phone-input/all.json`

## Purpose

Use Phone Input to capture one localized phone number with visible country selector, calling code, formatting, validation, and recovery copy.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `input`

Token dependencies: `comp.input.*`, `comp.phone-input.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Owns verification journey
- No visible label
- Country signal is flag-only
- Validity is icon-only
- Ask before build: The field triggers SMS or identity verification.
- Ask before build: Country selection or phone formatting rules are unclear.
- Ask before build: Phone capture affects account recovery or financial decisions.

## Use When

- Use Phone Input for driver invites, support contact, or OTP preparation.
- Use valid only when formatting and reachability rules pass.
- Use compact only when prefix and helper remain readable.

## Do Not Use Without Review

- Ask before use when the field triggers SMS or identity verification.
- Ask before use when country selection or phone formatting rules are unclear.
- Ask before use when phone capture affects account recovery or financial decisions.
- Phone Input owns the OTP journey.
- The country signal is flag-only or visual-only.
- Validity is icon-only.
- The field has no visible label.
- Country and calling code are not perceivable.
- The component owns OTP delivery.

## Operational Example

Use Phone Input to capture one localized phone number with visible country selector, calling code, formatting, validation, and recovery copy.

### Why Phone Input

- Phone Input keeps the number, prefix, helper, and validation together as one field.
- It can prepare an OTP handoff without sending or sequencing verification.
- Use a pattern when phone capture includes country search, OTP delivery, retries, or identity recovery.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Label | Names the phone field and why it is needed. | comp.input.*, sys.voice.* |
| Country selector | Shows the active flag, country name, and dialing code while keeping large country search in patterns. | comp.phone-input.* |
| Number field | Captures the local number with readable grouping. | comp.input.*, sys.voice.* |
| Status icon | Reinforces validity or handoff state with text-backed meaning. | sys.symbol.* |
| Helper line | Explains OTP, support, or recovery consequences. | comp.input.*, sys.tone.* |

## Accessibility

State precedence: disabled, error, warning, valid, focus, hover, default

- Associate the label and helper text with the input.
- Expose the country selector and calling code so the flag is not the only country signal.
- Use aria-invalid for error states.
- Do not send OTP automatically from the field.
- Keep validity text-backed, not icon-only.

## Foundations

Referenced token families:

- `comp.input.*`
- `comp.phone-input.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

Phone Input API exposes label, value, country, countries, prefix, variant, state, helper copy, and value metadata while reusing Input control rhythm, focus, and accessibility.

## Variants

Phone Input variants define field density and handoff treatment while verification system remains a pattern.

Approved variants from demos: `country-code`, `compact`, `otp-handoff`, `readonly`

Demo labels:

- Country code
- Compact
- OTP handoff
- Readonly

## States

Phone Input states communicate focus, validity, warning, error, and disabled behavior without triggering verification on their own.

Supported states from docs: `default`, `hover`, `focus`, `valid`, `warning`, `error`, `disabled`

## Variant X State Behavior

Variant defines field treatment; state defines validation and availability while OTP sequencing stays in patterns.

State matrix: `default`, `hover`, `focus`, `valid`, `warning`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Country code | country-code |  |
| Compact | compact |  |
| OTP handoff | otp-handoff |  |

## Full Width

Phone Input can fill forms, drawers, and mobile auth panels while the prefix and number keep readable rhythm.

- Invite form: layout: button-stack
- Auth panel: layout: button-stack
- Drawer row: layout: button-stack

## Responsive Layout Patterns

Keep the country code visible on small viewports and move country search or OTP resend behavior into patterns.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Phone Input stays a field component; viewport rules decide target size, prefix visibility, and handoff placement.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use large field height and keep prefix visible. | single phone field | lg |
| Tablet | Keep helper copy with the field. | form panel field | md |
| Desktop | Use compact treatment only when prefix remains readable. | admin form row | sm |

## Playground

Use the playground to verify label, prefix, value, variant, and validation state before composing invite or OTP flows.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Phone number |  |
| value | text | 55 1842 9011 |  |
| variant | select | country-code | country-code, compact, otp-handoff, readonly |
| state | select | default | default, hover, focus, valid, warning, error, disabled |

## API And Foundations

Phone Input API exposes label, value, country, countries, prefix, variant, state, helper copy, and value metadata while reusing Input control rhythm, focus, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible phone label. |
| value | string | No | Current phone digits. |
| prefix | string | No | Legacy dialing prefix fallback when country is not provided. |
| country | string | No | ISO country code used by the compact selector and flag primitive. |
| countries | Array<{ country: string, label: string, callingCode: string, nationalLength: number }> | No | Allowed country options for the selector. |
| variant | "country-code" \| "compact" \| "otp-handoff" \| "readonly" | No | Controls the local phone capture treatment without owning OTP delivery or recovery flow. |
| helper | string | No | Short helper text. |
| disabled | boolean | No | Disables the input. |
| state | "default" \| "hover" \| "focus" \| "valid" \| "warning" \| "error" \| "disabled" | No | Semantic validation or interaction state. |
| density | "sm" \| "md" \| "lg" | No | Maps to the shared Input control density. |
| error | string | No | Error helper text; sets aria-invalid and error state. |
| onValueChange | (digits: string, meta: PhoneMeta) => void | No | Called with national digits and country/calling-code metadata. |

## Implementation Checklist

- Provide `label`: Visible phone label.
- Label association
- Country selector and calling code visibility
- Validation state
- Error helper
- Disabled state
- Responsive width

## Tests And Rejection Rules

Must test:

- Label association
- Country selector and calling code visibility
- Validation state
- Error helper
- Disabled state
- Responsive width

Reject if:

- The field has no visible label.
- Country and calling code are not perceivable.
- The component owns OTP delivery.
- Validity is icon-only.

## MIEL

MIEL treats Phone Input as one localized number field. Agents may place it when the product needs a phone value, but humans confirm country rules, OTP handoff, recovery impact, and pattern context.

Agents can decide:

- Use Phone Input for driver invites, support contact, or OTP preparation.
- Use valid only when formatting and reachability rules pass.
- Use compact only when prefix and helper remain readable.

Agents must ask:

- The field triggers SMS or identity verification.
- Country selection or phone formatting rules are unclear.
- Phone capture affects account recovery or financial decisions.

Agents must reject:

- Phone Input owns the OTP journey.
- The country signal is flag-only or visual-only.
- Validity is icon-only.

Handoff language:

> I am using Phone Input for one localized number. Please confirm country rules, formatting, OTP or recovery use, validation copy, and surrounding pattern behavior.
