# Voice

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/voice.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Language, typography and communication structure

Define typographic hierarchy and product language so content, numerals, and decisions are scannable, actionable, respectful, and consistent across mobile and desktop.

Voice defines the complete typographic and communication system: families, weights, scale, line heights, numerals, labels, guidance, repair copy, and confirmations.

Display, heading, and numeral roles use Edenred Black. Body, subtitles, captions, UI labels, tables, and code use Ubuntu.

Voice gives teams a stable hierarchy so product copy can be scanned before it is read.

## Definition Of Ready

Before building or auditing any artifact against this foundation, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every decision must translate back to Design System foundations and primitives.
- Components, patterns, templates, and docs must consume the system contract instead of redefining foundation behavior locally.
- Any exception must be documented as a gap or review gate before implementation.

Layer: `Foundation`

Platform: `System`

Audiences: `Product Designers`, `Developers`, `Product Managers`, `Content Designers`, `Researchers`, `Service Designers`, `Agents`

Required sections: `overview`, `roles`, `productExamples`, `tokens`, `rules`, `dependencies`, `agentInstructions`, `rejectIf`

Reference translation: `Adapt`

Token dependencies: `ref.voice.*`, `sys.voice.*`, `sys.tone.*`, `comp.*.voice aliases`

Primitive dependencies: `Typography`, `Focus`, `Loading`, `Disabled`

Component dependencies: `Input`, `Button`, `Select`, `Inline Validation`, `Dialog`, `Table`, `Chart Panel`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| display | sys.voice.display.* | Major page or template identity with Edenred Black. |
| heading | sys.voice.heading.* | Section titles and product hierarchy with Edenred Black. |
| numeral | sys.voice.numeral.* | KPIs, metrics, balances, counts, dashboard values, and prominent operational numbers with Edenred Black. |
| label | sys.voice.label.* | Controls, table headers, KPI labels, form labels with Ubuntu. |
| paragraph | sys.voice.paragraph.* | Body copy, guidance, explanations with Ubuntu. |
| caption | sys.voice.caption | Metadata, timestamps, helper text, secondary annotations. |
| code | sys.voice.code.* | Token names, API examples, agent-readable snippets. |

## Product Examples

- Driver onboarding: Display introduces the step; paragraph explains permission value; repair copy explains blocked recovery.
- OTP and biometrics: Labels remain terse; urgent copy explains risk without blaming the user.
- Dashboard: KPI labels, deltas, legends, and summaries use distinct roles so fleet managers can scan quickly.
- Configuration: Permission warnings explain dependency and consequence before destructive action.

## Token Dependencies

- ref.voice.*
- sys.voice.*
- sys.tone.*
- comp.*.voice aliases

## Primitive Dependencies

- Typography
- Focus
- Loading
- Disabled

## Component Dependencies

- Input
- Button
- Select
- Inline Validation
- Dialog
- Table
- Chart Panel

## Agent Instructions

- Use Edenred Black only for display, heading, and numeral roles; use Ubuntu for all other product and UI text.
- Write labels as objects or actions, not explanations.
- Write repair copy with cause, next action, and ownership.
- Keep agent and human spec language aligned.

## Reject If

- Typography uses size or weight without semantic role.
- Display text appears inside compact controls or dense tables.
- Error copy states failure without recovery.
- Agent specs omit content, localization, or accessibility consequences.

## Reference Notes

### Architecture

The Voice layer follows the same ref -> sys -> comp chain as the reference system.

```text
FONT FAMILIES
brand -> Edenred Black, Ubuntu fallback: Display + Heading + Numeral
sans  -> Ubuntu, system fallback: Label + Paragraph
mono  -> Ubuntu Mono fallback: Code + Token names

COMPOSITE ROLES
Display xl/l/m/s
Heading xl/l/m/s
Numeral xl/l/m/s
Label xl/l/m/s
Paragraph xl/l/m/s
Caption
Overline
Code

RULE
No raw font-family, font-size, line-height, or weight in components.
```
