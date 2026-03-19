<!-- Scope: Rules for React + TypeScript frontend code. Glob: src/**/*.tsx, src/**/*.ts (excluding tests) -->

---
glob: src/**/*.tsx,src/**/*.ts,!src/**/*.test.ts,!src/**/*.test.tsx,!src/**/*.spec.ts,!src/**/*.spec.tsx
---

# Frontend Rules

## Core Principle: Presentational by Default

React components display data and collect input. They do NOT compute financial logic. If a component is doing math beyond formatting, something is wrong.

## Hard Rules

- **Flag immediately** if any financial calculation, simulation logic, or domain business rule appears in a component. This belongs in the simulation engine
- **Components are presentational** unless explicitly designated as a container. If building a container, name it with a `Container` suffix and comment why it needs to be one
- **TypeScript strict mode is non-negotiable.** No `any` types. No `@ts-ignore` without a comment explaining why. No implicit `any` from untyped imports
- **Props must be explicitly typed.** Use interface declarations, not inline types, for any prop interface used by more than one component

## TypeScript Strictness

- Enable and respect: `strict: true`, `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`
- Prefer `unknown` over `any` when the type is genuinely not known
- Use discriminated unions for state that can be in multiple shapes (loading / error / success)
- Flag type assertions (`as SomeType`) — they usually indicate a modeling problem

## Component Conventions

- One component per file. File name matches component name (PascalCase)
- Co-locate component-specific types in the same file
- Hooks that are reused go in a `hooks/` directory with one hook per file
- Avoid prop drilling beyond 2 levels — extract a context or restructure

## State Management

- Local state (`useState`) for UI-only state (open/closed, form input values)
- No global state library until the need is proven. React context is sufficient for now
- Flag any premature introduction of Redux, Zustand, Jotai, or similar
- API response data: fetch in the component or a custom hook, do not cache prematurely

## Formatting and Display Logic

- Formatting functions (currency, percentages, dates) belong in a `utils/formatters.ts` file, not inline in JSX
- Flag hardcoded locale or currency symbols — use a formatter utility

## Flagging Checklist (apply on every review)

- [ ] Any financial math or domain logic in a component?
- [ ] Any `any` type or `@ts-ignore` without justification?
- [ ] Any prop drilling deeper than 2 levels?
- [ ] Any state management library introduced without proven need?
- [ ] Any component doing both data fetching and complex rendering? (split it)
- [ ] Any hardcoded display values that should use a formatter?
