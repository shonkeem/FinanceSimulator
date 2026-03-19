---
name: shutdown
description: End-of-session audit for FinanceSimulator. Checks git status, runs tests, checks build, summarizes the session, updates CLAUDE.md current state, and writes the session log.
---

# End-of-Session Shutdown — Financial Simulation Sandbox

**Do NOT commit, push, fix, or modify any code. This is a read-only audit.**
If any step fails to run (missing test runner, no git repo), skip it, note that it was skipped, and continue to the next step.

Optional developer note: $ARGUMENTS

---

## Step 1 — Uncommitted Work Audit

Run `git status` and `git diff --stat`.
- List every changed file with a one-line description of what changed
- Categorize as: staged / unstaged / untracked
- If working tree is clean, say so explicitly

## Step 2 — Test Health Check

Detect which test runners are present:
- Python: run `pytest --tb=short -q` if `pytest` is installed
- TypeScript: run `npx vitest run --reporter=verbose` from `frontend/` if vitest is configured

Report: total tests, passed, failed, skipped.
If any tests fail, list each failing test name and a one-line summary of the failure.

## Step 3 — Build Check

Run `tsc --noEmit` from `frontend/`.
Run `ruff check src/ api/` if ruff is available.
Report all errors and warnings. Do not fix anything.

## Step 4 — Session Diff Summary

Run `git log --oneline --since="8 hours ago"`.
Summarize what was accomplished this session in 3–5 bullet points written as past-tense accomplishments.
If no commits exist in that window, base the summary on the uncommitted diff from Step 1.

## Step 5 — Next Session Kickoff Note

Using the uncommitted work from Step 1, any failing tests from Step 2, and the "Next step" section of `CLAUDE.md`, write 2–3 concrete, actionable next steps for the next session. Be specific — name files and functions, not vague goals.

## Step 6 — Update CLAUDE.md Current Build State

Read the `## Current Build State` section of `CLAUDE.md`. Based on all evidence gathered this session — git diff, committed files, test results, and build output — update the three fields in place:

- **Exists now** — add any items that were built or fixed this session; remove nothing that was already listed
- **Does NOT exist yet** — remove any items that now exist; add anything newly discovered to be missing
- **Next step** — replace with the most immediate actionable next step, consistent with Step 5's kickoff note; be specific (name the file and function to write next)

Also update the `*Last updated*` date to today.

Only edit the `## Current Build State` section. Do not touch any other part of `CLAUDE.md`.

## Step 7 — Write Session Log

Append to `docs/session-log.md` (create file and `docs/` directory if they don't exist):

```
## YYYY-MM-DD
### Done
- [accomplishment bullets from Step 4]
### Status
- Tests: X passed, Y failed, Z skipped
- Uncommitted files: [count]
### Next Session
- [next step bullets from Step 5]
---
```

Use today's actual date. Do not overwrite existing entries. This step runs after Step 6 so the next steps written to the log are consistent with what was just written to CLAUDE.md.

---

After writing the session log, print the full session summary to the chat so the developer can review it before closing.
