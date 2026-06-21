# Design: Support Multiple Templates

## Product Flow

```text
Upload employee photo
→ Fill employee fields
→ Select badge template
→ Generate ID photo
→ Compose selected template
→ Export PNG
```

## Frontend Design

- Add a template selection area before generation.
- Show template name, thumbnail, and short description.
- Default to the current Xianma-style template when no template is selected.

## Backend Design

- Maintain a template registry with template ID, display name, and HTML template path.
- Accept `templateId` in the generation request.
- Resolve the selected template before rendering.
- Reject unknown template IDs with a readable error.

## Compatibility

The current single-template behavior remains valid. Existing requests without `templateId` should continue to use the default template.
