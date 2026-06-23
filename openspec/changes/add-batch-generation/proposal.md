# Proposal: Add Batch Generation

## Intent

Support batch badge generation for onboarding or HR preparation scenarios where multiple employee badges need to be created at once.

## Problem

The current product flow generates one employee badge per request. This proves the core workflow, but HR/admin work often happens in batches, especially during onboarding, events, or temporary staff registration.

## Scope

- Define a batch generation flow.
- Support multiple employee records with corresponding photos.
- Reuse the existing single-person generation logic.
- Provide batch-level success and failure feedback.

## Out of Scope

- Large-scale async job queue.
- Enterprise employee database integration.
- Spreadsheet template design.
- Role-based approval workflow.

## Approach

Treat batch generation as orchestration over the existing single-badge workflow. The first version should focus on correctness and clear partial-failure feedback, not high concurrency.
