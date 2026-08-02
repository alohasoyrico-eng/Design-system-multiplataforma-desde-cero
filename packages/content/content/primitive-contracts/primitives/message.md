# Message

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/message.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Tone foundation roles into implementation-ready messaging primitives for intent, severity, anatomy, recovery, accessibility, localization, and UI mapping.

Message sits between foundations and components.
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

Audiences: `Product Designers`, `Content Designers`, `Developers`, `Researchers`, `Service Designers`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `states`, `agentInstructions`, `rejectIf`, `accessibility`

Governing foundations: `Tone`, `Voice`, `State`, `Accessibility`

Foundation inputs: `sys.tone.*`, `sys.voice.*`, `sys.state.*`, `sys.accessibility.*`

Coordinates primitives: `None declared`

Token dependencies: `sys.tone.*`, `sys.voice.*`, `sys.state.*`, `sys.accessibility.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| intent | message.intent.* | Info, success, warning, danger, neutral, and assistive message purpose. |
| severity | message.severity.* | Low, medium, high, and blocking operational consequence. |
| anatomy | message.anatomy.* | Title, body, consequence, action, recovery, and support path. |
| announcement | message.a11y.* | Live region, alert, focus, and status behavior. |
| localization | message.locale.* | Length, clarity, ambiguity, and translation guardrails. |

## Product Examples

- Block card confirmation: Danger message states consequence, recovery path, and primary/secondary actions before confirmation.
- OTP error: Message distinguishes invalid code from expired code and offers resend or alternate path.
- Station route unavailable: Message explains location permission or route provider failure with fallback list.

## API

Props: `intent`, `severity`, `title`, `body`, `action`, `recovery`, `announceAs`, `locale`

Outputs: `messageRole`, `copyParts`, `a11yBehavior`, `uiMapping`, `recoveryPath`

## States

- neutral
- assistive
- success
- warning
- danger
- blocking
- recoverable
- localized

## Responsibilities

- Render Message through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- sys.tone.*
- sys.voice.*
- sys.state.*
- sys.accessibility.*

## Agent Instructions

- Choose message intent before UI component.
- Always include consequence and recovery for danger or blocking states.
- Map accessibility behavior before rendering toast, alert, inline error, banner, dialog, or empty state.

## Reject If

- Copy describes what happened but not what to do next.
- Danger message has no consequence or recovery path.
- Message uses humor, metaphor, or vague language in operational contexts.
- Agent renders feedback without accessible announcement behavior.

## Prevents

Hardcoded message values and one-off implementation behavior.

## Demo Evidence

Type: `message`
