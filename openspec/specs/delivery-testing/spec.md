# Spec: Delivery Testing

## Purpose
Define the minimum checks required to verify the demo can be run, reviewed, and delivered safely.

## Requirements

### Requirement: Verify the Happy Path
The project MUST provide a repeatable way to verify the complete generation flow.

#### Scenario: Local smoke test
- **GIVEN** the frontend, backend, and ID photo service are running
- **WHEN** a valid image and employee fields are submitted
- **THEN** the user can see and download the generated badge PNG

### Requirement: Verify Failure Paths
The project MUST document key failure cases.

#### Scenario: Dependency unavailable
- **GIVEN** the ID photo service is not running
- **WHEN** the user submits a generation request
- **THEN** the backend returns a readable service-unavailable error
