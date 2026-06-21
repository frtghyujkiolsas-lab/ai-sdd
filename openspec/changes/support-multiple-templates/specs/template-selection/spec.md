# Delta: Template Selection

## ADDED Requirements

### Requirement: Template Selection
The system MUST allow a generation request to specify which badge template should be used.

#### Scenario: Generate with selected template
- **GIVEN** a user selects an available badge template
- **WHEN** they submit the generation request
- **THEN** the backend renders the final badge using the selected template

### Requirement: Default Template Fallback
The system MUST keep the current single-template flow working when no template is selected.

#### Scenario: Generate without template ID
- **GIVEN** a generation request does not include `templateId`
- **WHEN** the backend processes the request
- **THEN** it uses the default badge template

### Requirement: Unknown Template Handling
The system MUST reject unknown template IDs with a readable error.

#### Scenario: Unknown template
- **GIVEN** a generation request includes an unsupported `templateId`
- **WHEN** the backend resolves the template
- **THEN** it returns an error explaining that the template does not exist
