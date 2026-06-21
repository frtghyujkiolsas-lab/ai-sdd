# Design: AI Badge Demo

## Architecture

```text
React Upload Form
→ Python `/api/generate`
→ HivisionIDPhotos
→ HTML/CSS Badge Template
→ Browser Render Screenshot
→ PNG Response
```

## Frontend

- Collect employee photo and structured fields.
- Submit multipart form data to the backend.
- Show processing state.
- Display `id_photo` and `badge_png` from the response.

## Backend

- Validate required fields.
- Call the ID photo service.
- Inject employee data and processed portrait into the HTML badge template.
- Render and export the final image.

## Design Decisions

- Use template-based composition instead of AI-generating the full badge, because field layout must be stable.
- Keep employee fields editable and structured, because HR data should not be hallucinated by AI.
- Return final PNG from the backend, because the backend owns the authoritative rendering result.
