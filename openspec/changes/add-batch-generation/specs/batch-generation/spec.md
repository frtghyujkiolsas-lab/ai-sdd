# Delta: Batch Generation

## ADDED Requirements

### Requirement: Batch Badge Generation
The system MUST support generating badges for multiple employee records in one batch flow.

#### Scenario: Valid batch
- **GIVEN** a batch contains multiple valid employee records and photos
- **WHEN** the user starts batch generation
- **THEN** the system generates badge results for all valid records

### Requirement: Row-Level Validation
The system MUST identify invalid records before or during batch generation.

#### Scenario: Missing required field
- **GIVEN** one employee record is missing a required field
- **WHEN** the batch is validated
- **THEN** the system marks that record as invalid with a readable message

### Requirement: Partial Success
The system MUST allow valid records to succeed even if some records fail.

#### Scenario: One failed photo
- **GIVEN** a batch contains one unsupported photo and several valid photos
- **WHEN** generation runs
- **THEN** valid records produce badge results
- **AND** the failed record includes a failure reason
