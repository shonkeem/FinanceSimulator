<!-- Scope: Rules for FastAPI backend routes and API layer. Glob: api/**/*.py, backend/**/*.py -->

---
glob: api/**/*.py,backend/**/*.py
---

# API Layer Rules

## Core Principle: Thin Orchestration Only

API routes receive requests, validate input, call the simulation engine, and return results. They contain ZERO simulation logic. If a route is doing financial math, it is wrong.

## Hard Rules

- **Flag immediately** if any simulation logic, state calculations, or load application code appears in an API route. This belongs in `src/simulation/`
- **Flag immediately** if a route directly manipulates simulation state rather than delegating to the engine
- **Pydantic models for all request and response bodies.** No raw dicts crossing API boundaries
- **Routes must not catch and silently swallow exceptions.** Let FastAPI's exception handling work. Add explicit error responses only for known, recoverable cases

## Endpoint Design

- Each endpoint is a thin orchestrator:
  1. Receive and validate input (Pydantic handles this)
  2. Call simulation engine function(s)
  3. Transform engine output to response model
  4. Return response
- No multi-step business logic in routes. If orchestration becomes complex, extract a service function (still not simulation logic — coordination logic)

## Pydantic Conventions

- Input models for the three-file architecture: `FramingInput`, `LoadsInput`, `SettingsInput`
- These models must mirror the JSON schemas exactly — they ARE the validation layer
- Use `Field(...)` with descriptions for all fields that are not self-documenting
- Use strict types where appropriate (`StrictInt`, `StrictFloat`) to prevent silent coercion
- Response models are separate from input models, even if fields overlap

## Error Handling

- Use FastAPI `HTTPException` with meaningful status codes and detail messages
- 400 for validation errors that Pydantic doesn't catch (cross-field validation)
- 422 is automatic from Pydantic — do not duplicate this handling
- 500 should be rare — if the simulation engine raises, let it propagate with context

## Dependencies and Injection

- Use FastAPI's `Depends()` for shared logic (e.g., parsing the three input files)
- Do not instantiate the simulation engine inside route functions — inject it
- Keep dependency functions focused: one dependency, one responsibility

## Flagging Checklist (apply on every review)

- [ ] Any financial calculation or state manipulation in a route?
- [ ] Any raw dict used as request or response body?
- [ ] Any silently swallowed exception?
- [ ] Any route longer than ~30 lines? (probably doing too much)
- [ ] Any direct file I/O in a route? (should be in a dependency or service)
- [ ] Any simulation import used directly in route logic rather than as a delegated call?
