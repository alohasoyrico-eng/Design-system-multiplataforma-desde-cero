# Sidebar

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/sidebar/all.json`

## Purpose

Organize Design System collections, artifact groups, counts, active location, and responsive drawer behavior without becoming page content, filters, or a collapsed rail.

## Use When

- A shell needs persistent navigation across documentation or product sections.
- Navigation has parent collections and child routes with a maximum visible depth of two levels.
- Small viewports can open the same navigation as a drawer from the Topbar menu trigger.

## Do Not Use Without Review

- More than two visible levels are required; use local nav, tabs, breadcrumbs, Tree View, or a dedicated information architecture review.
- The sidebar is asked to own filters, tables, detail panels, process state, or page-specific controls.
- Child routes require decorative icons by default.
- A collapsed rail is requested; Design System currently documents drawer behavior, not a collapsed Sidebar variant.
- Footer utilities change account, workspace, support, environment, or session policy.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines persistent width, drawer placement, internal scroll, group spacing, and content minmax rules. |
| Voice | Keeps parent labels, child labels, disclosure names, active-route copy, and count labels readable. |
| Energy | Controls surface, active state, hover/focus, border, and Badge count color through semantic tokens. |
| Depth | Persistent desktop sidebar stays flat; mobile drawer gets overlay/elevation only when it leaves document system. |
| Momentum | Controls disclosure, hover, active, drawer, and reduced-motion behavior through system duration and easing. |
| State | Hover, focus, selected, pressed, disabled, and open states resolve without color-only meaning. |
| Tone | Navigation stays neutral by default and avoids urgent styling for orientation. |
| Growth | Artifact counts are metadata and use count treatment rather than primary labels. |
| Symbol | Parent group symbols communicate zones without adding icons to child routes. |
| Iconography | Icons are parent-only by default and use system sizing/optical alignment. |
| Accessibility | Disclosure state, focus ring, touch target, aria-current, Escape, and reduced-motion behavior are required. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| brand | BrandSlot | optional | Optional identity above navigation groups; current docs shell keeps brand in Topbar. |
| groups | SidebarGroup[] | yes | Parent collections with icon, label, count metadata, and children. |
| items | SidebarItem[] | yes | Child routes are text-first links with aria-current for the active page. |
| activeItem | RouteId | yes | Current child route; active state must not rely on color alone. |
| maxDepth | 2 | yes | Only parent to child is visible. Third level moves to local navigation or another pattern. |
| drawer | DrawerMode | conditional | Mobile opens the same sidebar from the Topbar menu button. |
| footer | SidebarFooter | optional | Separate utility region for help, version, workspace, or environment metadata. |

## Components And Primitives Used

- Accordion
- Icon Button
- Badge
- Breadcrumbs
- Drawer

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Persistent | Current | Desktop and wide tablet use the real sidebar beside content. |
| Drawer | Current | Small viewports open the same sidebar from the docs menu button. |
| Logo + footer | Candidate | Product shells may add identity above groups and utility metadata below navigation. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Group disclosure | Uses quick reveal/collapse; reduced motion removes animated height/opacity. |
| Mobile drawer | Slides from the navigation edge with focus restoration and Escape close. |
| Active route | Changes instantly so orientation is not delayed by animation. |

## Accessibility

- Use an aside or navigation landmark with an accessible label.
- Parent groups expose disclosure state through native details/summary or equivalent ARIA.
- The active child route uses aria-current.
- Drawer opens only after user interaction and provides a close path.
- Focus remains visible in persistent and drawer modes.
- Reduced motion removes nonessential movement.

## Implementation Checklist

- Declare `groups`: Parent collections with icon, label, count metadata, and children.
- Declare `items`: Child routes are text-first links with aria-current for the active page.
- Declare `activeItem`: Current child route; active state must not rely on color alone.
- Declare `maxDepth`: Only parent to child is visible. Third level moves to local navigation or another pattern.
- Persistent desktop layout does not overlap content.
- Mobile drawer starts closed and can open/close from the menu trigger.
- Parent items are the only navigation rows with icons.
- Active child route is visible and non-color-only.
- Logo/footer variant keeps footer below navigation without overlap.
- No hardcoded colors, spacing, type, or custom controls outside Design System tokens/components.

## Tests And Rejection Rules

Must test:

- Persistent desktop layout does not overlap content.
- Mobile drawer starts closed and can open/close from the menu trigger.
- Parent items are the only navigation rows with icons.
- Active child route is visible and non-color-only.
- Logo/footer variant keeps footer below navigation without overlap.
- No hardcoded colors, spacing, type, or custom controls outside Design System tokens/components.

Reject if:

- Child items get decorative icons by default.
- It contains filters, tables, detail, or visual-only state.
- The pattern adds a collapsed rail without a Design System contract.

## MIEL

Agents can decide:

- Grouped, drawer, or logo + footer variant when product rules are explicit.
- Parent icons, child text links, Badge counts, and aria-current.

Agents must ask:

- More than two levels are needed.
- Footer, workspace, account, support, environment, or mobile owner changes.

Agents must reject:

- Child items get decorative icons by default.
- It contains filters, tables, detail, or visual-only state.
- The pattern adds a collapsed rail without a Design System contract.

Handoff language:

> Confirm group order, active route, max depth, footer utilities, and mobile drawer owner.
