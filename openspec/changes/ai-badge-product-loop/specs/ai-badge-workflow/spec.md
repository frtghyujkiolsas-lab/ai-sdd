# Delta: AI Badge Workflow

## ADDED Requirements

### Requirement: Employee Badge Generation
The system MUST generate a company badge from an uploaded employee portrait and structured employee fields.

#### Scenario: Generate badge successfully
- GIVEN a user submits a valid portrait and required employee fields
- WHEN the generation workflow completes
- THEN the system returns a standardized ID photo and final badge PNG

### Requirement: Structured Product Delivery Artifacts
The repository MUST include product delivery artifacts that show how the demo moves from requirement to delivery.

#### Scenario: Reviewer inspects the repository
- GIVEN a reviewer opens the repository
- WHEN they browse `docs/` and `openspec/`
- THEN they can understand the requirement, PRD, prototype flow, API contract, backend logic, integration testing, and delivery review
