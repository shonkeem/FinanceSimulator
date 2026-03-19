<!-- Scope: Project-specific context for the Financial Simulation Sandbox. Version this file. -->

# Financial Simulation Sandbox

Personal finance simulation engine with interactive frontend. Discrete-time, deterministic state evolution — not a static calculator.

## Stack

- **Frontend:** React + TypeScript, Vite
- **Backend:** FastAPI, Python, Pydantic
- **Simulation:** Pure Python engine (no external sim frameworks)

## Three-File Input Architecture

All simulation scenarios are defined by three JSON files:

- **framing.json** — Defines the simulation timeframe and identity: start date, end date, time step granularity (monthly), person/household metadata
- **loads.json** — Defines all financial "loads" (things that move money): income streams, expense categories, debt instruments (with terms/rates), investment accounts (with contribution rules and growth assumptions)
- **settings.json** — Simulation-level knobs: inflation assumptions, tax parameters, rebalancing rules, output granularity, flags for optional features

These three files are the ONLY input to the simulation engine. The engine must never assume data that is not in these files.

## Conceptual Data Model

The simulation tracks these state variables at each timestep:

- **Cash** — liquid funds available
- **Investments** — account balances by type, subject to growth/contribution rules
- **Debt** — outstanding balances by instrument, subject to payment/interest rules
- **Income** — inflows per period from all sources
- **Expenses** — outflows per period by category
- **Net Worth** — derived: cash + investments - debt

## Architecture Layers (Separation of Concerns)

1. **Input Layer** — Reads and validates the three JSON files via Pydantic models
2. **Simulation Engine** — Pure Python. Takes validated input, produces a timeline of states. No I/O, no side effects
3. **API Layer** — FastAPI. Thin orchestrator: receives requests, calls engine, returns results. No simulation logic here
4. **Frontend** — React. Presentational. Displays results, collects input. No business logic

## Simulation Philosophy

- Each timestep produces a new state from the previous state + loads. This is **discrete-time state evolution**
- The core loop is: `state(t+1) = apply_loads(state(t), loads, settings)`
- State is immutable between steps — never mutate in place
- The engine must be deterministic given identical inputs

## Current Build State

### Exists now
- Project scaffolding (Vite + React frontend, FastAPI backend skeleton)
- Dev environment configured and running
- Architecture decisions documented (this file)

### Does NOT exist yet
- Simulation engine (core loop, state model, load application logic)
- Pydantic input models for the three JSON files
- API endpoints
- Frontend visualization components
- Tests

### Next milestone
- Build the simulation engine: Pydantic input models → state dataclass → core loop → single deterministic run producing a timeline

## Do Not Touch List

These features are OFF LIMITS until the deterministic core loop is verified working with tests:

- **Monte Carlo / stochastic simulation** — deterministic baseline first
- **Event system** (life events, job changes, windfalls) — core loads first
- **Visualization / charting** — engine must produce correct numbers first
- **Tax optimization logic** — basic tax rates in settings.json are sufficient for now
- **Multi-scenario comparison** — single scenario must work first
- **Export / reporting** — premature until output format is stable

If I mention any of these, remind me of this list and redirect to the current milestone.