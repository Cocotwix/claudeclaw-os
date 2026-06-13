Close out this LandOS build session. Do the following steps in order:

**Step 1 — Write the session note.**

Create a file at `docs/landos/sessions/session_YYYY-MM-DD_<slug>.md` where:
- `YYYY-MM-DD` is today's date
- `<slug>` is a 2–4 word kebab-case label for what this session accomplished (e.g., `foundation-sprint-v1`, `duke-runtime-refactor`)

File contents:

```
Date: YYYY-MM-DD
Latest commit: <hash> <message>
Files changed: <list of files created or modified>
Tests: <pass count if run, or "not run">
Known issues: <if any, else "None">
Next action: <one sentence — the exact next thing to do in a future session>
```

Rules:
- No property-specific data
- No secrets, tokens, or credentials
- No APNs, addresses, or deal-specific data
- Keep it to 10 lines max

**Step 2 — Update docs/landos/sessions/README.md.**

Add a row to the index table:

```
| YYYY-MM-DD | <slug> | <commit hash> |
```

**Step 3 — Update docs/landos/LandOS_Current_State.md.**

Update:
- Latest commit (if a new commit was made)
- Active build issue (if status changed)
- Server status (if changed)
- Known Untracked Files (if new files were created)
- Next Exact Action (set to the next action from the session note)

**Step 4 — Report the exact git add command** for the files created or modified in this session. Do not stage, commit, or push.

Report when done.
