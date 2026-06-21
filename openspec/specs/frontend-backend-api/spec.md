# Spec: Frontend-Backend API

## Purpose
Keep frontend form fields, backend request parsing, and response rendering aligned through a clear API contract.

## Requirements

### Requirement: Generate Badge API
The backend MUST expose a `POST /api/generate` endpoint for badge generation.

#### Scenario: Successful request
- **GIVEN** a request contains `photo`, `name`, `department`, `position`, and `employeeId`
- **WHEN** the backend completes processing
- **THEN** it returns `task_id`, `id_photo`, and `badge_png`

### Requirement: Contract Consistency
The frontend and backend MUST use the same field names for the generation request and response.

#### Scenario: Field alignment
- **GIVEN** the upload form submits employee data
- **WHEN** the request reaches the backend
- **THEN** backend field parsing succeeds without custom frontend-only transformations
