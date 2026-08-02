# Help Center

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/help-center/all.json`

## Purpose

Help users find support content through search, category navigation, article state, tags, empty states, and recovery without leaving product context.

## Use When

- A product surface needs searchable help, FAQs, onboarding guidance, or support articles.
- Content has categories, tags, keywords, and article detail.
- Search, no-result recovery, and navigation behavior need consistent ownership.

## Do Not Use Without Review

- The content is a single static help block.
- Search has no keywords, tags, empty state, or recovery path.
- Article content, support routing, or localization ownership is unclear.
- The pattern duplicates product navigation instead of supporting help content.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines category/sidebar layout, article width, search placement, and responsive stack. |
| Voice | Owns article titles, category labels, no-result copy, tags, and support escalation language. |
| Energy | Controls selected article, search focus, category state, and result emphasis. |
| State | Searching, results, no results, article selected, loading, and support escalation states are explicit. |
| Growth | Tags and keywords provide compact metadata for discovery. |
| Accessibility | Search label, navigable categories, article headings, focus movement, and no-result announcement are required. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| search | SearchInputSlot | yes | Searches title, body, tags, and keywords. |
| categories | HelpCategory[] | yes | Grouped navigation with article counts or section labels. |
| results | HelpResult[] | conditional | Flat result list when search is active. |
| article | HelpArticle | yes | Selected article content with title, body, tags, and support links. |
| emptyState | EmptyState | yes | No-result recovery with clear next step. |
| supportEscalation | SupportAction[] | optional | Contact/support links when self-service fails. |
| responsiveMode | sidebar \| stacked \| drawer | yes | Desktop can use sidebar; mobile stacks or uses drawer. |

## Components And Primitives Used

- Input
- Accordion
- Tag
- Empty State
- Button
- Drawer

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Category browse | Current candidate | Categories expand while no search is active. |
| Search results | Current candidate | Search switches to flat ranked results. |
| Article detail | Current candidate | Article content, tags, and related support actions. |
| Mobile support | Candidate | Category navigation moves to drawer or stacked index. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Search results | Results update without page jump; reduced motion removes reveal animation. |
| Category disclosure | Uses system disclosure motion and keeps focus stable. |
| Article change | Moves focus to article heading after user selection. |

## Accessibility

- Search has a visible or visually hidden label.
- Category navigation is keyboard accessible.
- Selected article heading receives focus after navigation.
- No results are announced and include recovery.
- Support escalation links are explicit and not hidden behind icon-only controls.

## Implementation Checklist

- Declare `search`: Searches title, body, tags, and keywords.
- Declare `categories`: Grouped navigation with article counts or section labels.
- Declare `article`: Selected article content with title, body, tags, and support links.
- Declare `emptyState`: No-result recovery with clear next step.
- Declare `responsiveMode`: Desktop can use sidebar; mobile stacks or uses drawer.
- Search matches title, tag, and keyword content.
- No-result state gives recovery path.
- Category browsing works without search.
- Article selection updates heading and focus.
- Mobile layout keeps search and article access visible.
- Localization can replace article/category text without layout breakage.

## Tests And Rejection Rules

Must test:

- Search matches title, tag, and keyword content.
- No-result state gives recovery path.
- Category browsing works without search.
- Article selection updates heading and focus.
- Mobile layout keeps search and article access visible.
- Localization can replace article/category text without layout breakage.

Reject if:

- Search has no recovery path.
- Articles are unstructured blobs without headings or tags.
- Help navigation replaces product navigation.

## MIEL

Agents can decide:

- Use Help Center when content categories, articles, tags, and search behavior are defined.
- Choose category browse or search result mode from user intent.
- Expose support escalation when self-service cannot answer.

Agents must ask:

- Content ownership, article source, localization, support routing, or search ranking is unclear.
- The help content includes legal, billing, medical, safety, or compliance instructions.

Agents must reject:

- Search has no recovery path.
- Articles are unstructured blobs without headings or tags.
- Help navigation replaces product navigation.

Handoff language:

> Confirm article source, category model, keyword/tag strategy, no-result recovery, support escalation, localization, and mobile navigation.
