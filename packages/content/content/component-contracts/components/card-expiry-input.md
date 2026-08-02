# Card Expiry Input

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/card-expiry-input/all.json`

## Purpose

Use Card Expiry Input to capture one MM/YY card expiry with numeric keyboard, cc-exp autocomplete, local month and expired-date validation, and recovery copy before a pattern or template handles card enrollment.

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

Reference translation: Adapt - The reference ZIP shows PaymentCard expiry display values such as 12/28 and 03/27 but no editable expiry field. Design System promotes a bounded expiry field so card enrollment can use the same Input rhythm without inventing a pattern too early.

Gaps or review gates:

- The component owns backend validation, tokenization, card ownership, or submission.
- Expired or invalid state is color-only.
- The value is not formatted or cannot be corrected.
- Autocomplete and numeric input mode are missing.
- Ask before build: The system stores, tokenizes, validates with backend, or associates a card.
- Ask before build: The card program has nonstandard expiry rules.
- Ask before build: Card number, CVC, brand selection, or payment ownership is required.

## Use When

- Use Card Expiry Input for one MM/YY expiry.
- Use local month and expired-date validation.
- Use loading only for a local or backend check in progress.

## Do Not Use Without Review

- Ask before use when the system stores, tokenizes, validates with backend, or associates a card.
- Ask before use when the card program has nonstandard expiry rules.
- Ask before use when card number, CVC, brand selection, or payment ownership is required.
- The component owns the full card form.
- The component promises payment or ownership approval.
- Expired-date behavior is hidden in helper copy.
- The component owns backend validation, tokenization, card ownership, or submission.
- Expired or invalid state is color-only.
- The value is not formatted or cannot be corrected.
- Autocomplete and numeric input mode are missing.

## Operational Example

Use Card Expiry Input to capture one MM/YY card expiry with numeric keyboard, cc-exp autocomplete, local month and expired-date validation, and recovery copy before a pattern or template handles card enrollment.

### Why Card Expiry Input

- It formats and validates one card expiry without owning enrollment.
- It keeps MM/YY, helper, error, autocomplete, and numeric keyboard together as one component.
- Use a pattern later for card number, CVV, backend validation, tokenization, and card ownership.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Label | Names the expiry field and remains visible. | comp.input.*, sys.voice.* |
| Input surface | Uses Input rhythm, focus, density, and mono value styling. | comp.input.*, sys.frame.*, sys.energy.* |
| Calendar icon | Signals date capture without replacing label or helper text. | sys.iconography.*, sys.symbol.* |
| Formatted value | Formats digits as MM/YY while preserving raw digits for callbacks. | sys.voice.*, sys.accessibility.* |
| Validation message | Uses month and expired-date checks only for local recovery. | sys.state.*, sys.tone.* |

## Accessibility

State precedence: disabled, loading, error, valid, filled, default

- Associate visible label and helper or error text with the input.
- Use inputmode numeric and autocomplete cc-exp.
- Expose invalid month or expired date with aria-invalid only when recovery is required.
- Do not announce or display backend approval or card ownership from this component.
- Preserve keyboard entry, paste, autofill, and correction.

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

Card Expiry Input API exposes one local expiry field. It owns MM/YY formatting and local month or expired-date validation only; backend validation, tokenization, card ownership, CVC, card number, and submission stay outside the component.

## Variants

Card Expiry Input variants describe local expiry capture treatment. Card number, security code, and full card enrollment remain separate components or future patterns.

Approved variants from demos: `default`

Demo labels:

- Default
- Valid
- Incomplete
- Error

## States

States communicate entry, local validation, loading, error, and disabled behavior without owning card enrollment.

Supported states from docs: `Default`, `filled`, `valid`, `loading`, `error`, `disabled`

## Variant X State Behavior

Card Expiry Input has one local capture variant; state tells whether the value is empty, incomplete, valid, loading, invalid, expired, or unavailable.

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

Card Expiry Input fills onboarding and wallet forms while preserving compact MM/YY rhythm.

- Onboarding: layout: button-stack
- Wallet add card: layout: button-stack
- Correction: layout: button-stack

## Responsive Layout Patterns

Keep the compact expiry visible and correctable. Multi-field card enrollment should wait until Card Number, Expiry, and Security Code components are all ready.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Card Expiry Input remains a single field component; viewport rules decide density and pairing with sibling card fields.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use large density and keep helper copy close to the field. | onboarding field | lg |
| Tablet | Pair beside security code only when touch targets remain clear. | wallet panel | md |
| Desktop | Use standard density in admin or support forms. | form row | md |

## Playground

Use the playground to verify MM/YY formatting, month and expired-date state, helper copy, density, and disabled/loading behavior before composing card enrollment screens.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Expiry date |  |
| value | text | 12/28 |  |
| state | select | valid | default, filled, valid, loading, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Card Expiry Input API exposes one local expiry field. It owns MM/YY formatting and local month or expired-date validation only; backend validation, tokenization, card ownership, CVC, card number, and submission stay outside the component.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible expiry label. |
| value | string | No | Formatted or raw expiry value. |
| helper | string | No | Short guidance or consequence copy. |
| error | string | No | Visible recovery message; overrides local expiry message. |
| disabled | boolean | No | Disables the field. |
| loading | boolean | No | Shows a check in progress without claiming approval. |
| required | boolean | No | Marks value required. |
| density | "sm" \| "md" \| "lg" | No | Maps to Input density. |
| state | "default" \| "filled" \| "valid" \| "loading" \| "error" \| "disabled" | No | Semantic preview or controlled state. |
| name | string | No | Native input name. |
| placeholder | string | No | Example expiry format. |
| validationMessage | string | No | Local invalid-month recovery copy. |
| expiredMessage | string | No | Local expired-date recovery copy. |
| onValueChange | (value: string, meta: CardExpiryMeta) => void | No | Called with formatted value, raw digits, month, year, validity, and expired flag. |

## Implementation Checklist

- Provide `label`: Visible expiry label.
- MM/YY formatting on input and paste
- Valid, invalid month, expired, incomplete, and empty states
- aria-invalid and helper association
- autocomplete cc-exp
- numeric keyboard hint
- Disabled and loading states
- Responsive width

## Tests And Rejection Rules

Must test:

- MM/YY formatting on input and paste
- Valid, invalid month, expired, incomplete, and empty states
- aria-invalid and helper association
- autocomplete cc-exp
- numeric keyboard hint
- Disabled and loading states
- Responsive width

Reject if:

- The component owns backend validation, tokenization, card ownership, or submission.
- Expired or invalid state is color-only.
- The value is not formatted or cannot be corrected.
- Autocomplete and numeric input mode are missing.

## MIEL

MIEL treats Card Expiry Input as one sensitive supporting field. Agents may place it for expiry capture, but humans confirm card program, expired-date policy, and surrounding enrollment system.

Agents can decide:

- Use Card Expiry Input for one MM/YY expiry.
- Use local month and expired-date validation.
- Use loading only for a local or backend check in progress.

Agents must ask:

- The system stores, tokenizes, validates with backend, or associates a card.
- The card program has nonstandard expiry rules.
- Card number, CVC, brand selection, or payment ownership is required.

Agents must reject:

- The component owns the full card form.
- The component promises payment or ownership approval.
- Expired-date behavior is hidden in helper copy.

Handoff language:

> I am using Card Expiry Input for one MM/YY expiry with local month and expired-date validation. Please confirm the card program, backend validation path, recovery copy, and whether Card Number or Security Code components are also needed.
