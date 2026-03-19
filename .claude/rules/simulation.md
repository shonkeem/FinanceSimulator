<!-- Scope: Rules for the Python simulation engine layer. Glob: src/simulation/**/*.py -->

---
glob: src/simulation/**/*.py
---

# Simulation Engine Rules

## Core Principle: Deterministic Purity First

The simulation engine is the most critical layer. It must be **pure, testable, and deterministic**. Every rule below serves this principle.

## Hard Rules

- **Pure functions preferred.** State update functions take input, return output. No side effects, no I/O, no logging inside computation logic
- **No mutation of state between timesteps.** Each timestep produces a NEW state object. Never modify `state(t)` — always create `state(t+1)`
- **Each timestep function must be independently testable.** Given a state and a set of loads, calling the function once must produce a predictable result without setup or teardown
- **Deterministic baseline before randomness.** If I ask to add Monte Carlo, stochastic rates, or any random element — refuse until deterministic tests pass. Cite the Do Not Touch list in project CLAUDE.md

## Architectural Boundaries

- **Flag immediately** if simulation logic appears in API routes or frontend code. Simulation belongs here and only here
- **Flag immediately** if this layer imports from the API or frontend packages. Dependencies flow inward: API depends on simulation, never the reverse
- **No HTTP, no file I/O, no database calls** in this layer. The engine receives validated Python objects and returns Python objects

## State Model Conventions

- State is a dataclass (or Pydantic model) with fields for: cash, investments, debt, income, expenses, net_worth
- Net worth is always derived (cash + investments - debt), never stored independently and allowed to drift
- All monetary values are `Decimal` or `float` with explicit rounding strategy — flag if mixing or if no rounding strategy is defined

## Load Application Pattern

- Each load type (income, expense, debt payment, investment contribution) has its own applicator function
- Applicator signature: `apply_<load_type>(state, load, settings) -> state`
- The core loop calls applicators in a defined, documented order
- Order matters (e.g., income before expenses before debt payments). Flag if order is implicit or undocumented

## Testing Expectations

- Every applicator function gets its own unit test with at least: one normal case, one zero-amount case, one boundary case
- The core loop gets an integration test: run N timesteps, assert final state matches hand-calculated expectation
- Tests must not depend on file I/O — use fixture data constructed in code

## Flagging Checklist (apply on every review)

- [ ] Any side effects in state update logic?
- [ ] Any mutation of previous state?
- [ ] Any simulation logic that should be in a different layer?
- [ ] Any load application order that is implicit rather than explicit?
- [ ] Any randomness before the deterministic baseline is tested?
- [ ] Any missing edge case (zero balance, negative income, overlapping debt terms)?
