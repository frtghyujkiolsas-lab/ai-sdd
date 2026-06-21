# Proposal: AI Badge Demo

## Intent

Build a demo that shows how an AI product requirement can move from vague business input to a working, reviewable delivery.

## Problem

HR and admin teams often receive employee photos in inconsistent formats. Manually cropping, retouching, and placing them into a company badge template is repetitive and error-prone.

## Scope

- Upload one employee photo.
- Collect basic employee fields.
- Generate a standardized ID photo.
- Compose the final badge PNG from a template.
- Display and download the result.
- Document the delivery flow with AI-SDD artifacts.

## Out of Scope

- Real employee database integration.
- Complex permission system.
- Production-grade audit workflow.
- Batch generation.
- Multi-tenant template marketplace.

## Approach

Use the existing React prototype and Python backend as the implementation surface. Add docs and OpenSpec-style artifacts to make the delivery path explicit.
