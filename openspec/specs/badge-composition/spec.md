# Spec: Badge Composition

## Purpose
Define how standardized portraits and structured employee fields are composed into a stable company badge PNG.

## Requirements

### Requirement: Compose Badge from Template
The system MUST generate the final employee badge from an HTML/CSS template.

#### Scenario: Template render
- **GIVEN** employee fields and a standardized ID photo
- **WHEN** the backend injects them into the badge template
- **THEN** the rendered output contains the portrait, name, department, position, and employee ID

### Requirement: Export Badge as PNG
The system MUST export the final badge as a PNG image.

#### Scenario: Downloadable result
- **GIVEN** the badge template renders successfully
- **WHEN** the backend captures the template
- **THEN** it returns a PNG result to the frontend
