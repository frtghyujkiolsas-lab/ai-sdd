# AI Badge Studio

> Upload a casual employee photo, standardize it into an ID portrait, compose it into a branded employee badge, and export a ready-to-use PNG.

![AI Badge Studio Showcase](docs/showcase-hero-v5.png)

## Why This Project

This is a small AI product demo for an internal HR / admin workflow:

- Turn casual employee photos into standardized ID photos.
- Keep employee fields editable and reviewable.
- Compose the portrait into a unified company badge template.
- Export a final PNG that can be used for onboarding, HR records, or internal display.

The goal is not just "generate an image", but to show a controllable product workflow:

```text
Photo Upload
→ ID Photo Standardization
→ Badge Template Composition
→ Quality Check
→ PNG Export
```

## Core Features

- **Photo upload**: Upload a casual portrait from the browser.
- **ID photo generation**: Integrates with HivisionIDPhotos for face detection, cropping, background replacement, and ID-photo standardization.
- **Badge composition**: Uses an HTML/CSS badge template and injects employee fields dynamically.
- **PNG export**: Renders the final badge image through a local backend workflow.
- **HR-style dashboard**: Includes a basic management view for reviewing generated badge tasks.

## Tech Stack

- **Frontend**: React, Vite, TypeScript-style component structure, Tailwind-style utility classes.
- **Backend**: Python standard-library HTTP service.
- **Image processing**: HivisionIDPhotos API / Docker service.
- **Rendering**: HTML/CSS badge template + headless browser screenshot export.

## Project Structure

```text
xianma-badge/
├── figma-make-export/        # React frontend prototype
├── server.py                 # Local API service
├── templates/                # Badge HTML/CSS templates
├── assets/                   # Public-safe visual assets
├── docs/                     # GitHub showcase assets
└── README.md
```

## Run Locally

### 1. Start HivisionIDPhotos

Run HivisionIDPhotos locally and make sure its API is available:

```bash
curl http://localhost:8080/docs
```

### 2. Start Backend

```bash
cd xianma-badge
python3 server.py
```

Default backend address:

```text
http://localhost:8888
```

### 3. Start Frontend

```bash
cd xianma-badge/figma-make-export
npm install
npm run dev
```

Then open the local Vite address shown in the terminal.

## API Example

```bash
curl -X POST http://localhost:8888/api/generate \
  -F 'name=Demo User' \
  -F 'department=Product' \
  -F 'position=AI Product Manager' \
  -F 'employeeId=XM-2026-001' \
  -F 'photo=@/path/to/demo-photo.png'
```

Response:

```text
id_photo   Standardized ID photo in base64
badge_png  Final badge PNG in base64
task_id    Generated task ID
```

## Product Thinking

This project focuses on three product design principles:

- **Controllability**: AI handles repetitive image standardization, while employee information remains editable.
- **Consistency**: Badge output follows one unified visual template.
- **Workflow fit**: The product is designed for an internal admin / HR scenario, not as a generic image toy.

## Privacy Note

This repository should only include demo images and anonymized sample data. Avoid committing real employee photos, generated badges with real personal information, logs, or local uploads.
