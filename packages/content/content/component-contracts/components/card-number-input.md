# Card Number Input

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/card-number-input/all.json`

## Purpose

Use Card Number Input to capture one card number with grouping, numeric keyboard, local Luhn validation, and recovery copy before a pattern or template handles backend validation.

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

Reference translation: Adapt - The reference onboarding system captures card number with Field + Input, mono value, credit-card icon, grouping, and a validate action. Design System promotes the number field because Luhn validation and sensitive recovery rules exceed generic Input.

Gaps or review gates:

- Owns backend validation, tokenization, card ownership, or submission
- Luhn invalid state is color-only
- Value is not grouped or cannot be corrected
- Autocomplete and numeric input mode are missing
- Ask before build: The system stores, tokenizes, validates with backend, or associates a card.
- Ask before build: The card program may not use standard Luhn rules.
- Ask before build: Expiry, CVC, brand selection, or payment ownership is required.

## Use When

- Use Card Number Input for one card number.
- Use Luhn for local structure validation.
- Use loading only for a local or backend check in progress.

## Do Not Use Without Review

- Ask before use when the system stores, tokenizes, validates with backend, or associates a card.
- Ask before use when the card program may not use standard Luhn rules.
- Ask before use when expiry, CVC, brand selection, or payment ownership is required.
- The component owns the full card form.
- The component promises payment or ownership approval.
- Sensitive card behavior is hidden in helper copy.
- The component owns backend validation, tokenization, card ownership, or submission.
- Luhn invalid state is color-only.
- The value is not grouped or cannot be corrected.
- Autocomplete and numeric input mode are missing.

## Operational Example

Use Card Number Input to capture one card number with grouping, numeric keyboard, local Luhn validation, and recovery copy before a pattern or template handles backend validation.

### Why Card Number Input

- It formats and validates one sensitive number without owning card enrollment.
- It keeps Luhn, helper, error, autocomplete, and numeric keyboard together as one component.
- Use a pattern later for CVV, expiry, backend validation, tokenization, and card ownership.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Label | Names the card number field and remains visible. | comp.input.*, sys.voice.* |
| Input surface | Uses Input rhythm, focus, density, and mono value styling. | comp.input.*, sys.frame.*, sys.energy.* |
| Card icon | Signals card capture without replacing label or helper text. | sys.iconography.*, sys.symbol.* |
| Grouped value | Formats digits in readable groups while preserving a raw numeric value for callbacks. | sys.voice.*, sys.accessibility.* |
| Validation message | Uses Luhn only for local structure and never claims backend approval. | sys.state.*, sys.tone.* |

## Accessibility

State precedence: disabled, loading, error, valid, filled, default

- Associate visible label and helper or error text with the input.
- Use inputmode numeric and autocomplete cc-number.
- Expose local validation with aria-invalid only when the number structure is invalid.
- Do not announce or display full card ownership, backend approval, or tokenization from this component.
- Preserve keyboard entry, paste, and correction.

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

Card Number Input API exposes one local card number field. It owns formatting and Luhn structure only; backend validation, tokenization, ownership, CVC, expiry, and submission stay outside the component.

## Variants

Card Number Input variants describe local capture treatment. Expiry, CVC, and full card forms remain separate components or future patterns.

Approved variants from demos: `default`

Demo labels:

- Default
- Valid
- Incomplete
- Error

## States

States communicate entry, local validation, loading, error, and disabled behavior without owning payment submission.

Supported states from docs: `Default`, `filled`, `valid`, `loading`, `error`, `disabled`

## Variant X State Behavior

Card Number Input has one local capture variant; state tells whether the value is empty, incomplete, valid, loading, invalid, or unavailable.

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

Card Number Input fills onboarding and wallet forms while preserving grouped number rhythm.

- Onboarding: layout: button-stack
- Wallet add card: layout: button-stack
- Correction: layout: button-stack

## Responsive Layout Patterns

Keep the full card number visible enough for correction. Move multi-field card enrollment into patterns after Card Number, Expiry, and Security Code components exist.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Card Number Input remains a single field component; viewport rules decide density and surrounding submit placement.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use large density and keep helper copy close to the field. | onboarding field | lg |
| Tablet | Keep it full width inside card setup panels. | wallet panel | md |
| Desktop | Use standard density in admin or support forms. | form row | md |

## Playground

Use the playground to verify grouping, Luhn state, helper copy, density, and disabled/loading behavior before composing card enrollment screens.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Card number |  |
| value | text | 4111 1111 1111 1111 |  |
| state | select | valid | default, filled, valid, loading, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Card Number Input API exposes one local card number field. It owns formatting and Luhn structure only; backend validation, tokenization, ownership, CVC, expiry, and submission stay outside the component.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible card number label. |
| value | string | No | Formatted or raw card number value. |
| helper | string | No | Short guidance or consequence copy. |
| error | string | No | Visible recovery message; overrides local Luhn message. |
| disabled | boolean | No | Disables the field. |
| loading | boolean | No | Shows a check in progress without claiming backend success. |
| required | boolean | No | Marks value required. |
| density | "sm" \| "md" \| "lg" | No | Maps to Input density. |
| state | "default" \| "filled" \| "valid" \| "loading" \| "error" \| "disabled" | No | Semantic preview or controlled state. |
| name | string | No | Native input name. |
| placeholder | string | No | Example card number format. |
| validationMessage | string | No | Local Luhn recovery copy. |
| onValueChange | (digits: string, meta: CardNumberMeta) => void | No | Called with raw digits, formatted value, brand hint, validity, and luhnValid. |

## Implementation Checklist

- Provide `label`: Visible card number label.
- Grouping on input and paste
- Luhn valid and invalid states
- aria-invalid and helper association
- autocomplete cc-number
- numeric keyboard hint
- Disabled and loading states
- Responsive width

## Tests And Rejection Rules

Must test:

- Grouping on input and paste
- Luhn valid and invalid states
- aria-invalid and helper association
- autocomplete cc-number
- numeric keyboard hint
- Disabled and loading states
- Responsive width

Reject if:

- The component owns backend validation, tokenization, card ownership, or submission.
- Luhn invalid state is color-only.
- The value is not grouped or cannot be corrected.
- Autocomplete and numeric input mode are missing.

## MIEL

MIEL treats Card Number Input as one sensitive field. Agents may place it for card capture, but humans confirm card program, validation copy, and surrounding enrollment system.

Agents can decide:

- Use Card Number Input for one card number.
- Use Luhn for local structure validation.
- Use loading only for a local or backend check in progress.

Agents must ask:

- The system stores, tokenizes, validates with backend, or associates a card.
- The card program may not use standard Luhn rules.
- Expiry, CVC, brand selection, or payment ownership is required.

Agents must reject:

- The component owns the full card form.
- The component promises payment or ownership approval.
- Sensitive card behavior is hidden in helper copy.

Handoff language:

> I am using Card Number Input for one grouped card number with local Luhn validation. Please confirm the card program, backend validation path, recovery copy, and whether Expiry or Security Code components are also needed.
