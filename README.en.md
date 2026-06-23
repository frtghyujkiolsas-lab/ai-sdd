<div align="center">

# AI Badge Studio

### AI-SDD Spec-Driven Development Sample

![status](https://img.shields.io/badge/status-product_delivery-2ea44f)
![workflow](https://img.shields.io/badge/workflow-SDD%20Spec--Driven%20Development-red)
![frontend](https://img.shields.io/badge/frontend-React%20%7C%20Vite-61dafb)
![backend](https://img.shields.io/badge/backend-Python-3776ab)
![platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-6e7781)

**Idea → Requirement → PRD → Specs → Prototype → API Contract → Frontend → Backend → Integration Test → Product Delivery**

*From idea to a complete product loop: fast validation and high-quality delivery through a standard product-engineering workflow*

[简体中文](README.md) | **English**

</div>

![AI Badge Studio Showcase](docs/showcase-hero-v5.png)

## Why This Project

`ai-sdd` is a **Spec-Driven Development (SDD)** sample repository for AI product managers and solo builders. It does not only showcase a small tool. It demonstrates how to turn a vague business request into PRD, specs, API contracts, frontend interaction, backend logic, integration testing, and delivery artifacts.

The current example is an **AI Employee Badge Generator**:

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

![AI Badge Studio Dashboard](docs/product-dashboard.png)

The dashboard preview shows the complete product workspace: employee fields and photo upload on the left, AI ID-photo processing in the middle, final badge preview on the right, and quality / time / success-rate signals for delivery validation.

## AI-SDD Workflow

```text
01 Idea
→ 02 Requirement
→ 03 PRD
→ 04 Specs
→ 05 Prototype
→ 06 API Contract
→ 07 Frontend
→ 08 Backend
→ 09 Integration Test
→ 10 Product Delivery
```

![AI-SDD Workflow](docs/sdd-workflow.png)

Documentation map:

| Stage | Docs |
| --- | --- |
| Product definition | [Process Overview](docs/00-process-overview.md) · [Requirement Clarification](docs/01-requirement-clarify.md) · [PRD](docs/02-prd.md) |
| Solution freeze | [Prototype Freeze](docs/03-prototype-freeze.md) · [API Contract](docs/04-api-contract.md) |
| Delivery | [Backend Design](docs/05-backend-design.md) · [Integration Test](docs/06-integration-test.md) · [Delivery Review](docs/07-delivery-review.md) |

## Spec-Driven Structure

This repository follows a `specs/` + `changes/` model, so requirements do not stay as loose notes or a single PRD. They are converted into verifiable, traceable, and iterative specs:

```text
openspec/
├── specs/      # Current system behavior as the source of truth
└── changes/    # Change packages and delivery records for the badge system
```

`specs/` describes what the system should currently do. `changes/ai-badge-product-loop/` records the complete delivery process from intent to implementation. Future capabilities such as multiple templates or batch generation first enter `changes/`, then get synchronized into the main specs.

## Spec Iteration Log

| Change | Status | Description |
| --- | --- | --- |
| Core product loop | Completed | Core flow for photo upload, ID photo standardization, badge composition, and PNG export |
| `support-multiple-templates` | Planned | Support multiple company badge templates to reduce customization cost |
| `add-batch-generation` | Planned | Support batch employee import and badge generation for HR onboarding |

## Core Features

- **Photo upload**: Upload a casual portrait from the browser.
- **ID photo generation**: Integrates with HivisionIDPhotos for face detection, cropping, background replacement, and ID-photo standardization.
- **Badge composition**: Uses an HTML/CSS badge template and injects employee fields dynamically.
- **PNG export**: Renders the final badge image through a local backend workflow.
- **HR-style dashboard**: Includes a basic management view for reviewing generated badge tasks.

## Product Thinking

This project focuses on three product design principles:

- **Controllability**: AI handles repetitive image standardization, while employee information remains editable.
- **Consistency**: Badge output follows one unified visual template.
- **Workflow fit**: The product is designed for an internal admin / HR scenario, not as a generic image toy.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Python HTTP service
- **Image processing**: HivisionIDPhotos API / Docker service
- **Rendering**: HTML/CSS badge template + headless browser screenshot export

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
  -F 'name=Sample User' \
  -F 'department=Product' \
  -F 'position=AI Product Manager' \
  -F 'employeeId=XM-2026-001' \
  -F 'photo=@/path/to/sample-photo.png'
```

Response:

```text
id_photo   Standardized ID photo in base64
badge_png  Final badge PNG in base64
task_id    Generated task ID
```

## Project Structure

```text
xianma-badge/
├── docs/                     # Standard product delivery workflow docs
├── openspec/                 # Specs and change packages
├── figma-make-export/        # React frontend prototype
├── server.py                 # Local API service
├── templates/                # Badge HTML/CSS templates
├── assets/                   # Public-safe visual assets
└── README.md
```

## Privacy Note

This repository should only include anonymized sample images and test data. Avoid committing real employee photos, generated badges with real personal information, logs, or local uploads.
