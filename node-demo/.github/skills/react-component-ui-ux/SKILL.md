---
name: react-component-ui-ux
description: 'Apply thoughtful UI and UX best practices when building, reviewing, or refactoring React components. Use when: React component design, frontend UI, UX review, responsive layout, accessibility, interaction design, visual hierarchy, design system alignment, component polish, or user-flow improvements.'
argument-hint: 'Describe the React component, screen, user flow, or design issue to address.'
---

# React Component UI/UX

Build React components that are clear, accessible, responsive, visually intentional, and consistent with the surrounding product. Improve the user experience without inventing a separate design language or changing behavior that the request does not authorize.

## When to Use

- Create or redesign a React component, page, panel, form, table, navigation area, or workflow.
- Review a component for usability, accessibility, responsive behavior, or visual hierarchy.
- Refine an existing frontend implementation that feels generic, crowded, unclear, or unfinished.
- Translate an existing product pattern or design system into a reusable React component.

## Guardrails

- Start from the existing component, route, design system, tokens, assets, and neighboring UI when they exist.
- Preserve the established visual language in an existing product. Do not introduce a competing theme, arbitrary gradients, or unrelated component variants.
- Keep page sections unframed and full-width where appropriate. Use cards only for repeated items, dialogs, or genuinely framed tools; do not nest cards inside cards.
- Prefer purposeful typography and a restrained, domain-appropriate palette. Avoid default-looking layouts, purple-on-white templates, excessive rounded pills, and decorative elements that do not support the task.
- Use familiar icons for icon-only actions and provide accessible names or tooltips for unfamiliar icons. Use the project’s icon library when one exists; use Lucide when it is already enabled or is the chosen project convention.
- Do not use visible instructional prose to explain obvious controls or shortcuts. Make affordances, labels, states, and focus treatment self-explanatory.
- Never sacrifice keyboard access, semantic HTML, focus visibility, color contrast, or reduced-motion support for visual polish.
- Do not use placeholder or stock-like imagery when users need to inspect the actual product, object, state, or content. Use existing assets or an appropriate real/generated bitmap asset when imagery is part of the request.
- Keep layout dimensions stable for controls, grids, tiles, and toolbars so labels, icons, loading states, and hover states do not cause layout shift.
- Avoid viewport-scaled font sizes and negative letter spacing. Ensure text wraps or reflows instead of overflowing its container.

## Procedure

1. Identify the concrete UI surface and its primary user task. Read the target component, its direct parent or route, nearby styles, existing tokens, and relevant tests only as needed.
2. Inspect the local design language:
   - typography, spacing, color, borders, radii, shadows, and motion tokens;
   - existing buttons, inputs, dialogs, tables, navigation, empty states, and loading states;
   - icon and asset conventions;
   - responsive breakpoints and accessibility utilities.
3. State one local UX hypothesis and one cheap check that could disprove it. Example: "The action is hard to discover because it has no persistent label; checking the component at narrow width and with keyboard focus will reveal whether the proposed control remains understandable."
4. Define the component contract before styling:
   - primary action and secondary actions;
   - required, optional, invalid, disabled, loading, empty, and success states;
   - data and error boundaries;
   - keyboard interaction and focus order;
   - responsive changes in structure, density, and content priority.
5. Make the smallest coherent implementation. Prefer existing primitives and tokens. Keep business logic separate from presentation when the codebase has that boundary. Use semantic elements before adding ARIA, and add ARIA only when native semantics do not express the interaction.
6. Add meaningful interaction states: hover, focus-visible, pressed, disabled, loading, validation, empty, error, and success where applicable. Make state changes perceivable without relying on color alone.
7. Validate at representative desktop and mobile widths. Check for overflow, clipped text, overlapping controls, unstable dimensions, awkward wrapping, and loss of primary actions. Check keyboard-only navigation and reduced-motion behavior.
8. Run the narrowest relevant test, typecheck, lint, or build command immediately after the edit. If visual tooling is available, use a screenshot or browser check for the changed surface.
9. Review the diff for unnecessary abstraction, one-off styles that should use tokens, inaccessible icon-only controls, missing states, and unrelated formatting churn. Finish with the repository’s applicable checks.

## Decision Points

### Is this an existing product or a new surface?

- Existing product: reuse its primitives, tokens, content tone, and interaction patterns.
- New surface: choose one clear visual direction that fits the domain, then define reusable tokens instead of styling each element independently.

### Should an action be text, icon, or both?

- Use text when the action is ambiguous, high impact, or important for scanning.
- Use an icon for a familiar compact tool action when space is constrained.
- Use icon plus text when the action is unfamiliar, destructive, or benefits from explicit confirmation.
- Provide an accessible name for every icon-only control and a tooltip when the icon is not immediately familiar.

### Should content be hidden on small screens?

- Preserve the primary task, status, and recovery actions.
- Reflow, collapse, paginate, or move secondary content before removing it.
- Keep touch targets usable and avoid requiring precision gestures.

### Is a visual effect helping?

- Keep animation if it communicates hierarchy, progress, state change, or continuity.
- Respect `prefers-reduced-motion` and avoid animation that delays or obscures task completion.
- Remove decoration that competes with content, creates noise, or resembles an unrelated template.

### Does a component need a new abstraction?

- Reuse an existing primitive when it covers the interaction and visual contract.
- Add a reusable component when the same behavior or pattern appears more than once or when it creates a meaningful accessibility boundary.
- Keep one-off composition local when abstraction would hide simple layout or make customization harder.

## Completion Criteria

- The primary task and next action are apparent without explanatory UI copy.
- The component matches the surrounding design system or clearly establishes reusable tokens for a new surface.
- Semantic markup, labels, keyboard navigation, focus-visible styling, contrast, and non-color state cues are present.
- Loading, empty, error, disabled, and success states are handled wherever the component can encounter them.
- The layout remains usable at desktop and mobile widths with no clipped or overlapping content.
- Motion is purposeful and reduced-motion friendly.
- Focused automated validation passes, and visual/browser validation is performed when available.
- The final diff is scoped to the requested UI/UX improvement and does not introduce unrelated refactoring.

## Example Prompts

- "Review this React form for accessibility and mobile usability."
- "Redesign this dashboard panel using the existing component library and preserve its data behavior."
- "Make this table usable on small screens without hiding the primary actions."
- "Polish this empty state and add loading, error, and keyboard interaction states."
