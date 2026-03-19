# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend
```bash
cd frontend
npm run dev      # Start dev server at http://localhost:5173
npm run build    # TypeScript compile + Vite build to dist/
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend
```bash
source backend/my_venv/bin/activate
uvicorn backend.app.main:app --reload  # Starts at http://127.0.0.1:8000
```

## Architecture

**Stack:** FastAPI backend + React (TypeScript) frontend, connected via REST.

**Backend** (`backend/app/main.py`): Single-file FastAPI server with CORS configured for the frontend dev server (`http://localhost:5173`). Three endpoints:
- `GET /health` — health check
- `POST /echo` — debug echo with UTC timestamp
- `POST /simulate` — accepts `{name, age, income, expenses}`, returns `{payload, net, timestamp_utc}` after a 1.5s simulated delay

**Frontend** (`frontend/src/`):
- `App.tsx` — root component, owns all state. Uses a `status` state machine (`idle | loading | success | error`) to drive UI transitions. Submits form data to `/simulate` and displays the returned net income.
- `components/Trials.tsx` — work-in-progress component, not yet integrated into the app.

The frontend POSTs to the hardcoded URL `http://127.0.0.1:8000/simulate`.
