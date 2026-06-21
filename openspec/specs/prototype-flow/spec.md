# Spec: Prototype Flow

## Purpose
Describe the frontend prototype flow and keep the UI, states, and result rendering aligned with the delivery contract.

## Requirements

### Requirement: Provide a Complete User Flow
The frontend MUST support the full path from upload to final result.

#### Scenario: Generate one badge
- **GIVEN** a user opens the upload page
- **WHEN** they upload a photo and submit employee information
- **THEN** the system shows processing status and displays the generated badge result

### Requirement: Keep Result Rendering Consistent
The result page MUST display the backend-generated badge PNG.

#### Scenario: Avoid duplicate rendering logic
- **GIVEN** the backend returns `badge_png`
- **WHEN** the result page renders
- **THEN** it displays the returned image directly instead of rebuilding the badge in frontend code
