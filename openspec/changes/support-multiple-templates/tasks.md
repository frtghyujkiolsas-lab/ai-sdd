# Tasks: Support Multiple Templates

## 1. Product and Contract

- [ ] 1.1 Define template metadata fields.
- [ ] 1.2 Add `templateId` to the generation contract as an optional field.
- [ ] 1.3 Document default-template fallback behavior.

## 2. Frontend

- [ ] 2.1 Add template selection UI.
- [ ] 2.2 Display available template cards.
- [ ] 2.3 Submit selected `templateId` with the generation request.

## 3. Backend

- [ ] 3.1 Add a template registry.
- [ ] 3.2 Resolve template path by `templateId`.
- [ ] 3.3 Return a readable error for unknown templates.

## 4. Verification

- [ ] 4.1 Verify current no-template request still works.
- [ ] 4.2 Verify selected template affects final PNG output.
- [ ] 4.3 Run OpenSpec validation, frontend build, and Python syntax check.
