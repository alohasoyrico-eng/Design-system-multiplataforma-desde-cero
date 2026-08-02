# Drawer Adapter

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/drawer-adapter/all.json`

## Purpose

Adapt desktop side panels, navigation, or inspectors into mobile drawers with focus recovery, close paths, and content parity.

## Use When

- Desktop content lives beside the route but mobile needs it in an overlay drawer.
- The same content must remain discoverable across viewport changes.
- Users need a bounded panel for navigation, details, or tools.

## Do Not Use Without Review

- The drawer becomes unrelated page content.
- The adapted content requires a full page or multi-step form.
- Close, focus, or layer ownership conflicts with Topbar or Sidebar.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines drawer edge, width, safe margins, internal scroll, and action placement. |
| Depth | Owns overlay and elevation when content leaves document system. |
| Momentum | Uses Design System drawer reveal and reduced-motion fallback. |
| State | Controls closed, open, focus, selected, and dismissed states. |
| Accessibility | Requires labelled drawer, close button, focus containment, Escape/back close, and restored focus. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button | yes | Opens the adapted drawer after user action. |
| drawer | Drawer | yes | Owns overlay, edge, and close recovery. |
| content | Menu \| List \| Card | yes | Adapted navigation or inspector content. |
| decision | Dialog | conditional | Escalates risky choices from inside the drawer. |
| feedback | Toast | conditional | Reports drawer selection or save state. |

## Components And Primitives Used

- Drawer
- Menu
- Button
- Dialog
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Navigation drawer | Current candidate | Adapts side navigation into mobile drawer. |
| Inspector drawer | Candidate | Adapts contextual detail or tools. |
| Decision drawer | Candidate | Menu action escalates to Dialog when needed. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open | Drawer enters from the owning edge after user action. |
| Close | Dismissal restores focus to the opener. |
| Escalate | Dialog appears above drawer only for required decisions. |

## Accessibility

- Drawer starts closed.
- Close is always visible and keyboard reachable.
- Focus returns to the trigger after close.
- Dialog escalation does not hide cancellation.

## Implementation Checklist

- Declare `trigger`: Opens the adapted drawer after user action.
- Declare `drawer`: Owns overlay, edge, and close recovery.
- Declare `content`: Adapted navigation or inspector content.
- Trigger opens drawer from closed state.
- Close button and Escape/back behavior are defined.
- Menu selection reports feedback.
- Risky selection opens Dialog.
- Drawer layer appears above route content.

## Tests And Rejection Rules

Must test:

- Trigger opens drawer from closed state.
- Close button and Escape/back behavior are defined.
- Menu selection reports feedback.
- Risky selection opens Dialog.
- Drawer layer appears above route content.

Reject if:

- The drawer replaces a full route.
- The adapted content has no close path.
- The drawer opens by default without user intent.

## MIEL

Agents can decide:

- Use Drawer Adapter when desktop side content needs a mobile overlay.
- Use Menu for compact adapted choices.
- Escalate risky drawer actions to Dialog.

Agents must ask:

- The drawer owner, content parity, close path, or layer relationship is unclear.

Agents must reject:

- The drawer replaces a full route.
- The adapted content has no close path.
- The drawer opens by default without user intent.

Handoff language:

> Confirm source panel, mobile owner, trigger, close behavior, content parity, and escalation rules.
