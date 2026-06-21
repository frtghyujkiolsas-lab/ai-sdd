# Proposal: Support Multiple Templates

## Intent

Allow the badge generator to support more than one company badge template, so the same generation workflow can adapt to different enterprise visual styles.

## Problem

The current demo proves one complete badge generation flow, but the template is fixed. In real HR/admin usage, different departments, visitor badges, temporary badges, or client demos may require different layouts.

## Scope

- Add a template selection concept to the product flow.
- Define how templates are identified and previewed.
- Keep the existing single-template flow as the default.
- Ensure frontend, backend, and API contract stay aligned.

## Out of Scope

- Full template marketplace.
- Online visual template editor.
- Permission-based template approval.
- Complex multi-tenant configuration.

## Approach

Introduce a lightweight template ID and template metadata model first. The backend continues to own final badge rendering, while the frontend only selects and previews available templates.
