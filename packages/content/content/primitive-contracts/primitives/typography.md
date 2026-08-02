# Typography

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/typography.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Voice foundation roles into implementation-ready text primitives for display, headings, numerals, labels, body, captions, overline, and code.

Typography sits between foundations and components.
It consumes semantic tokens and exposes a narrow API.
It prevents hardcoded values, detached semantics, and inconsistent implementation.
It must be portable across React, Flutter, documentation, and agent specs.

## Definition Of Ready

Before building or auditing any artifact against this primitive, confirm:

- Design System foundations govern the primitive.
- The primitive exposes a narrow, reusable API and never a one-off component shortcut.
- Components, patterns, templates, and docs consume the primitive contract instead of redefining visual values locally.
- ZIP reference details may influence equivalence only after the primitive maps them back to system foundations.

Layer: `Primitive`

Platform: `System`

Audiences: `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `tokens`, `states`, `agentInstructions`, `rejectIf`

Governing foundations: `Voice`, `Tone`, `Frame`, `Accessibility`

Foundation inputs: `sys.voice.*`, `sys.tone.*`, `sys.frame.*`, `sys.a11y.*`

Coordinates primitives: `None declared`

Token dependencies: `ref.voice.*`, `sys.voice.*`, `typography.*`, `comp.*.voice aliases`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| display | typography.display.* | Template/page identity and major product moments with Edenred Black. |
| heading | typography.heading.* | Section and panel hierarchy with Edenred Black. |
| numeral | typography.numeral.* | KPIs, metrics, balances, counts, dashboard values, and prominent operational numbers with Edenred Black. |
| label | typography.label.* | Controls, KPI labels, table headers, filters with Ubuntu. |
| paragraph | typography.paragraph.* | Guidance, descriptions, empty/error copy with Ubuntu. |
| caption | typography.caption | Metadata, helper text, timestamps, legal/support notes. |
| code | typography.code.* | Token names, specs, API snippets, agent contracts. |

## Product Examples

- Driver onboarding: Display names the step; paragraph explains value; label names controls.
- Card detail: Balance, actions, status, and movement metadata use distinct text roles.
- Fleet dashboard: KPI value, label, delta, chart title, legend, summary, and table text are separable.
- Configuration: Permission dependencies and destructive consequences use readable repair/urgent hierarchy.

## API

Props: `role`, `size`, `tone`, `truncate`, `as`

Outputs: `semanticElement`, `cssCustomProperties`, `accessibleText`

## States

- default
- secondary
- disabled
- error
- warning
- success
- inverse
- truncated

## Responsibilities

- Renders text with Voice tokens: family, size, weight, line height, and role.
- Enforces Edenred Black for display/titles/numerals and Ubuntu for body/UI text.
- Maps roles to semantic HTML and product copy hierarchy.
- Handles captions, labels, body, display, numerals, and code without raw CSS.

## Token Dependencies

- ref.voice.*
- sys.voice.*
- typography.*
- comp.*.voice aliases

## Agent Instructions

- Use Edenred Black only for display, heading, and numeral roles.
- Use Ubuntu for body, UI, caption, subtitle, and code roles.
- Do not choose font size directly in components.
- Match text role to content purpose and surface density.

## Reject If

- Raw font-size, line-height, family, or weight appears in component CSS.
- Hero-scale text is used inside compact controls or dense panels.
- Error/repair copy lacks next action.
- Code/spec text is styled as body copy without distinction.

## Prevents

Raw font-size, font-weight, font-family, or text rendered without semantic hierarchy.

## Demo Evidence

Type: `typography`

Initial: `display`

Choices:

- display: Display
- heading: Heading
- label: Label
- paragraph: Paragraph
- code: Code
