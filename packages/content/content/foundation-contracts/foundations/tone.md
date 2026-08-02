# Tone

Generated portable foundation contract for Design System.

The JSON spec and foundation copy remain the editable source of truth. Regenerate this file with `npm run build:foundation-contracts` after changing foundation copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/foundations/tone.json`
- `packages/content/content/foundation-copy.json`

## Purpose

Emotional temperature and service behavior

Govern product language temperature so neutral, assistive, urgent, repair, and confirmation messages are respectful, useful, and operationally clear.

Tone defines the structural framework for how the product communicates through text.

It governs error messages, empty states, confirmations, labels, warnings, and instructional copy.

Tone does not write every sentence. It defines the pattern that makes content actionable, respectful, progressive, and consistent.

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

Token dependencies: `ref.tone.*`, `sys.tone.*`, `sys.voice.*`, `sys.energy.*`

Primitive dependencies: `Typography`, `Color`, `Disabled`

Component dependencies: `Inline Validation`, `Toast`, `Dialog`, `Empty State`, `Error Panel`, `Tooltip`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| neutral | sys.tone.neutral.* | Default labels, metadata, dashboard explanations. |
| assistive | sys.tone.assistive.* | Guidance before action or setup. |
| urgent | sys.tone.urgent.* | Warnings, thresholds, time-sensitive operational risk. |
| repair | sys.tone.repair.* | Error recovery, permission failures, declined actions. |
| confirm | sys.tone.confirm.* | Successful save, route handoff, card state change. |

## Product Examples

- Driver onboarding: Assistive copy explains why location improves nearby stations before asking permission.
- OTP failure: Repair copy tells what happened, what to try, and when to request a new code.
- Dashboard threshold: Urgent copy names risk without dramatizing normal variance.
- Roles and permissions: Destructive copy states consequence, affected users, and audit record.

## Token Dependencies

- ref.tone.*
- sys.tone.*
- sys.voice.*
- sys.energy.*

## Primitive Dependencies

- Typography
- Color
- Disabled

## Component Dependencies

- Inline Validation
- Toast
- Dialog
- Empty State
- Error Panel
- Tooltip

## Agent Instructions

- Write copy with consequence and next action.
- Use repair tone for failures; do not blame the user.
- Use urgent tone only for operational risk or time-sensitive decisions.
- Confirmation must mention the resulting state when relevant.

## Reject If

- Copy is decorative or vague.
- Error copy lacks recovery.
- Urgent tone is used for normal information.
- Confirmation omits consequence for risky actions.

## Reference Notes

### Communication Principles

The reference model treats communication as structure, not flavor.

```text
PRINCIPLES
1. Actionable over informational
2. Blame the system, not the user
3. Progressive disclosure
4. Consistent tense
5. No jargon

CONFIRMATIONS
past tense: Changes saved, Route started

ACTIONS
present imperative: Save changes, Start route

WARNINGS
conditional future: This will block card use
```
