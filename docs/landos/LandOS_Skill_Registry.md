# LandOS Skill Registry

Reference doc for all LandOS skills available to agents. No secrets, no deal data.

Skills are modular instruction blocks agents load at runtime for a specific task.
Agents must not embed full skill logic in their CLAUDE.md; skills are loaded per task.

---

## Registry Format

| Skill ID | Trigger / When to Load | Owner Agent | Status |
|---|---|---|---|
| `duke-fast-default` | Address or APN provided, no comp request | Duke | Active |
| `duke-area-only` | City/county/region query, no parcel identity | Duke | Active |
| `duke-full-report` | Tyler explicitly requests Full Report with comp credit | Duke | Active |
| `duke-unconfirmed-parcel` | Multiple LP matches returned, waiting on parcel selection | Duke | Active |
| `ace-call-prep` | Tyler asks for call prep on a specific deal or seller | Ace | Active |
| `ace-call-analysis` | Tyler shares a transcript, call notes, or text thread | Ace | Active |
| `ace-follow-up-draft` | Tyler asks for a follow-up text, email, or voicemail | Ace | Active |
| `ace-offer-call` | Tyler preparing to make an offer on a call | Ace | Active |
| `ace-renegotiation` | Deal hit a problem requiring seller re-engagement | Ace | Active |
| `ace-training-ingest` | Tyler asks Ace to process a file from LandOS_Raw_Training | Ace | Active |
| `finn-deal-economics` | Deal needs cost tracking, risk scoring, or economics review | Finn | Shell — not yet built |
| `drew-buyer-research` | Deal needs buyer research, exit prep, or listing strategy | Drew | Shell — not yet built |
| `mia-campaign-review` | Campaign or lead-source performance review needed | Mia | Shell — not yet built |
| `rex-market-intel` | Market absorption, DOM, price-per-acre, county friendliness query | Rex | Shell — not yet built |
| `rex-industry-intel` | Public operator strategy intelligence review | Rex | Shell — not yet built |
| `rex-ai-evolution` | Model/tool/repo monitoring task for AI change log | AI Watcher | Shell — not yet built |
| `security-repo-review` | New package, MCP server, or repo needs security checklist | Security | Shell — not yet built |
| `tc-closing-task-list` | Deal entered contract phase needing closing logistics | TC | Shell — not yet built |
| `strategy-exit-review` | Deal needing exit strategy selection or offer strategy review | Strategy | Shell — not yet built |

---

## Rules

- Skills for "Shell — not yet built" agents are documented here as placeholders. Do not attempt to invoke them until the agent CLAUDE.md is built.
- When building a new skill, add its entry to this registry before using it.
- Skills replace large CLAUDE.md prompt blocks. If a CLAUDE.md section is only used for one workflow, extract it as a skill.
- Skill IDs use kebab-case. Prefix with the owning agent's short name.

---

## Duke Skills (Active)

### `duke-fast-default`

Load when: address or APN is provided, no Full Report or comp request.

Steps: lp_search → lp_resolve_property → lp_property_data → fact labels → scoring → EV estimate → anomaly flags → Default Duke Report in chat. Target under 2 minutes. No comp credit used.

### `duke-area-only`

Load when: city/county/region query, no specific parcel provided or verifiable.

Steps: lp_search with area params → area statistics → report labeled "Local Area Context, Not Parcel Verified." Never apply parcel-level facts, scoring, or EV to an area-only result.

### `duke-full-report`

Load when: Tyler explicitly approves spending one LandPortal comp credit.

Steps: same as fast-default plus lp_comp_report_create → individual comp rows → extended valuation. MUST have explicit Tyler approval before calling lp_comp_report_create. Never auto-trigger.

### `duke-unconfirmed-parcel`

Load when: lp_search returns multiple matches.

Steps: present matches, require exact parcel selection. Do not proceed to lp_property_data until a single parcel is confirmed. Save property ID + FIPS on selection.

---

## Ace Skills (Active)

See Ace CLAUDE.md sections 11–18 for full workflow definitions. Skill IDs above map to those sections.

---

## Future Skills

Skills for planned agents will be defined when those agent CLAUDE.md files are built.
Register the skill ID here first, then write the CLAUDE.md workflow block.
