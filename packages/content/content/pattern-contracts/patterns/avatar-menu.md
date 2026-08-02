# Avatar Menu

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/avatar-menu/all.json`

## Purpose

Expose account, settings, and session actions from an avatar trigger while preserving one shared menu interaction model.

## Use When

- A shell or product surface needs account-level actions.
- The trigger identity matters more than an icon-only overflow action.
- Actions are compact, secondary, and tied to user/session context.

## Do Not Use Without Review

- The menu contains forms, long explanations, or multi-step settings.
- The avatar is used only as decoration and does not open account actions.
- The action set includes destructive or compliance actions without confirmation rules.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines trigger size, panel width, section separation, and edge alignment. |
| Voice | Owns short account labels, session action labels, and destructive copy. |
| Energy | Preserves neutral shell behavior; danger is only used for risky session actions when needed. |
| Depth | Menu panel floats above shell content without becoming a card. |
| Momentum | Trigger and panel reveal use the same menu rhythm as other contextual actions. |
| Accessibility | Avatar trigger announces the account menu, expanded state, menu role, and focus return. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Menu variant: avatar-trigger | yes | Uses the shared Menu trigger that composes Avatar internally. |
| avatar | Avatar | yes | Shows account identity and optional status inside the trigger. |
| items | MenuItem[] | yes | Profile, settings, help, and session actions. |
| sections | separator | conditional | Separates account actions from session/destructive actions. |

## Components And Primitives Used

- Menu
- Avatar

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Account | Current | Avatar trigger with profile, settings, and sign out. |
| Workspace | Supported | Avatar trigger with workspace and help actions. |
| Session risk | Supported | Session action uses danger tone when it ends access. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open | Panel opens after user interaction and inherits Menu reveal motion. |
| Close | Escape, outside click, or item selection closes and returns focus. |
| Selection | Selected actions close the panel and hand off feedback to the caller. |

## Accessibility

- Trigger uses aria-haspopup menu and aria-expanded.
- Panel uses role menu and items use role menuitem.
- Escape closes and returns focus to the avatar trigger.
- The avatar has an accessible name through the trigger label.
- Danger actions are not communicated through color alone.

## Implementation Checklist

- Declare `trigger`: Uses the shared Menu trigger that composes Avatar internally.
- Declare `avatar`: Shows account identity and optional status inside the trigger.
- Declare `items`: Profile, settings, help, and session actions.
- Avatar trigger opens and closes the shared Menu panel.
- Keyboard users can open with Enter or ArrowDown.
- Escape closes and restores focus.
- Account and session sections are separated.
- No shell or template creates a parallel account menu implementation.

## Tests And Rejection Rules

Must test:

- Avatar trigger opens and closes the shared Menu panel.
- Keyboard users can open with Enter or ArrowDown.
- Escape closes and restores focus.
- Account and session sections are separated.
- No shell or template creates a parallel account menu implementation.

Reject if:

- The trigger is a raw button or details element outside Menu.
- Avatar and menu are implemented separately for the same trigger.
- Session actions lack close behavior or focus recovery.

## MIEL

Agents can decide:

- Use Avatar Menu for compact account/session actions.
- Use separators when account and session actions have different risk.
- Use the shared Menu avatar-trigger variant instead of local details markup.

Agents must ask:

- Actions change permissions, billing, legal state, or identity.
- The menu needs forms, long settings, or onboarding content.
- The avatar identity source is unknown.

Agents must reject:

- The trigger is a raw button or details element outside Menu.
- Avatar and menu are implemented separately for the same trigger.
- Session actions lack close behavior or focus recovery.

Handoff language:

> Confirm identity source, action order, session risk, and whether any item should escalate to Dialog or Drawer.
