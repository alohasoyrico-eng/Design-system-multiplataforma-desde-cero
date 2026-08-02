# Card Security Code Input

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/card-security-code-input/all.json`

## Purpose

Use Card Security Code Input to capture one CVC/CVV value with numeric keyboard, cc-csc autocomplete, local length validation, optional reveal, and recovery copy before a pattern or template handles card enrollment.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Momentum`, `State`, `Accessibility`, `Depth`, `Tone`, `Growth`, `Symbol`, `Iconography`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Loading`, `Disabled`, `Message`

Component dependencies: `None declared`

Token dependencies: `comp.input.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.accessibility.*`

Reference translation: Adapt - The reference ZIP shows payment card display but no editable CVC/CVV field. Design System promotes a bounded security code field so card enrollment can use the same Input rhythm without inventing a pattern too early.

Gaps or review gates:

- The component owns backend validation, tokenization, card ownership, or submission.
- The code is exposed outside the input or reveal action.
- Invalid state is color-only.
- Autocomplete and numeric input mode are missing.
- Ask before build: The system stores, tokenizes, validates with backend, or associates a card.
- Ask before build: The card program has nonstandard CVC/CVV rules.
- Ask before build: Card number, expiry, brand selection, or payment ownership is required.

## Use When

- Use Card Security Code Input for one CVC/CVV value.
- Use local length validation.
- Use reveal only as a field action.

## Do Not Use Without Review

- Ask before use when the system stores, tokenizes, validates with backend, or associates a card.
- Ask before use when the card program has nonstandard CVC/CVV rules.
- Ask before use when card number, expiry, brand selection, or payment ownership is required.
- The component owns the full card form.
- The component promises payment or ownership approval.
- The security code is displayed outside the input/reveal interaction.
- The component owns backend validation, tokenization, card ownership, or submission.
- The code is exposed outside the input or reveal action.
- Invalid state is color-only.
- Autocomplete and numeric input mode are missing.

## Operational Example

Use Card Security Code Input to capture one CVC/CVV value with numeric keyboard, cc-csc autocomplete, local length validation, optional reveal, and recovery copy before a pattern or template handles card enrollment.

### Why Card Security Code Input

- It captures one sensitive verification code without owning payment enrollment.
- It keeps length, helper, error, autocomplete, numeric keyboard, and reveal together as one component.
- Use a pattern later for card number, expiry, backend validation, tokenization, and card ownership.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Label | Names the security code field and remains visible. | comp.input.*, sys.voice.* |
| Input surface | Uses Input rhythm, focus, density, and mono value styling. | comp.input.*, sys.frame.*, sys.energy.* |
| Security icon | Signals sensitive code capture without replacing label or helper text. | sys.iconography.*, sys.symbol.* |
| Reveal action | Lets users verify entry with an accessible field action and no separate pattern. | comp.input.*, sys.accessibility.* |
| Validation message | Uses local length checks only for correction. | sys.state.*, sys.tone.* |

## Accessibility

State precedence: disabled, loading, error, valid, filled, default

- Associate visible label and helper or error text with the input.
- Use inputmode numeric and autocomplete cc-csc.
- Expose invalid length with aria-invalid only when recovery is required.
- Expose reveal as a button with aria-label and aria-pressed.
- Do not announce or display backend approval or card ownership from this component.

## Foundations

Referenced token families:

- `comp.input.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

Card Security Code Input API exposes one local CVC/CVV field. It owns digit normalization, local length validation, and optional reveal only; backend validation, tokenization, card ownership, card number, expiry, and submission stay outside the component.

## Variants

Card Security Code Input variants describe local code capture treatment. Card number, expiry, backend checks, and full enrollment remain separate components or future patterns.

Approved variants from demos: `default`

Demo labels:

- Default
- Four digits
- Hidden
- Error

## States

States communicate entry, local validation, loading, error, and disabled behavior without owning card enrollment.

Supported states from docs: `Default`, `filled`, `valid`, `loading`, `error`, `disabled`

## Variant X State Behavior

Card Security Code Input has one local capture variant; state tells whether the code is empty, incomplete, valid, loading, invalid, or unavailable.

State matrix: `default`, `filled`, `valid`, `loading`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default | default |  |
| Filled | default | filled |
| Valid | default | valid |
| Loading | default | loading |
| Error | default | error |
| Disabled | default | disabled |

## Full Width

Card Security Code Input stays compact so it can sit beside Card Expiry or Date Picker in the same form row while preserving CVC/CVV rhythm.

- Onboarding: layout: button-stack
- Four-digit card: layout: button-stack
- Correction: layout: button-stack

## Responsive Layout Patterns

Keep the security code visible, compact, and correctable. Multi-field card enrollment should wait until Card Number, Expiry, and Security Code components are all ready.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Card Security Code Input remains a single field component; viewport rules decide density and pairing with sibling card fields.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use large density and keep reveal plus helper copy close to the field. | onboarding field | lg |
| Tablet | Pair beside expiry only when touch targets remain clear. | wallet panel | md |
| Desktop | Use standard density in admin or support forms. | form row | md |

## Playground

Use the playground to verify code length, reveal behavior, helper copy, density, and disabled/loading behavior before composing card enrollment screens.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Security code |  |
| value | text | 482 |  |
| state | select | valid | default, filled, valid, loading, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Card Security Code Input API exposes one local CVC/CVV field. It owns digit normalization, local length validation, and optional reveal only; backend validation, tokenization, card ownership, card number, expiry, and submission stay outside the component.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible security code label. |
| value | string | No | Raw security code value. |
| helper | string | No | Short guidance or consequence copy. |
| error | string | No | Visible recovery message; overrides local length message. |
| disabled | boolean | No | Disables the field. |
| loading | boolean | No | Shows a check in progress without claiming approval. |
| required | boolean | No | Marks value required. |
| density | "sm" \| "md" \| "lg" | No | Maps to Input density. |
| state | "default" \| "filled" \| "valid" \| "loading" \| "error" \| "disabled" | No | Semantic preview or controlled state. |
| name | string | No | Native input name. |
| placeholder | string | No | Example security code format. |
| expectedLength | 3 \| 4 | No | Required local code length. |
| validationMessage | string | No | Local invalid-length recovery copy. |
| revealable | boolean | No | Adds the reveal field action. |
| revealed | boolean | No | Initial visibility state. |
| onValueChange | (digits: string, meta: CardSecurityCodeMeta) => void | No | Called with digits, validity, expectedLength, and complete flag. |

## Implementation Checklist

- Provide `label`: Visible security code label.
- Digit normalization on input and paste
- 3-digit and 4-digit expected length
- Reveal action label and aria-pressed
- aria-invalid and helper association
- autocomplete cc-csc
- numeric keyboard hint
- Disabled and loading states
- Responsive width

## Tests And Rejection Rules

Must test:

- Digit normalization on input and paste
- 3-digit and 4-digit expected length
- Reveal action label and aria-pressed
- aria-invalid and helper association
- autocomplete cc-csc
- numeric keyboard hint
- Disabled and loading states
- Responsive width

Reject if:

- The component owns backend validation, tokenization, card ownership, or submission.
- The code is exposed outside the input or reveal action.
- Invalid state is color-only.
- Autocomplete and numeric input mode are missing.

## MIEL

MIEL treats Card Security Code Input as one sensitive supporting field. Agents may place it for CVC/CVV capture, but humans confirm card program, security policy, and surrounding enrollment system.

Agents can decide:

- Use Card Security Code Input for one CVC/CVV value.
- Use local length validation.
- Use reveal only as a field action.

Agents must ask:

- The system stores, tokenizes, validates with backend, or associates a card.
- The card program has nonstandard CVC/CVV rules.
- Card number, expiry, brand selection, or payment ownership is required.

Agents must reject:

- The component owns the full card form.
- The component promises payment or ownership approval.
- The security code is displayed outside the input/reveal interaction.

Handoff language:

> I am using Card Security Code Input for one CVC/CVV value with local length validation and optional reveal. Please confirm the card program, backend validation path, recovery copy, and whether Card Number or Card Expiry components are also needed.
