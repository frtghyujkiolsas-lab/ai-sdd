# Design: Add Batch Generation

## Product Flow

```text
Upload employee batch data
→ Upload or map employee photos
→ Validate required fields
→ Generate badges one by one
→ Show success and failure summary
→ Download generated outputs
```

## Frontend Design

- Add a batch entry point separate from the single-person generation flow.
- Show row-level validation status.
- Display generated results and failed records separately.

## Backend Design

- Reuse the current single-badge generation function for each employee record.
- Return a batch summary with success count, failure count, and item-level messages.
- Avoid blocking the existing `/api/generate` single request behavior.

## Failure Handling

Batch generation should allow partial success. A bad photo or missing field for one employee should not block all other records.
