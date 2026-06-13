Date: 2026-06-13
Latest commit: 377b185 Fix LandOS shell agent YAML descriptions (pending new commit for this sprint)
Files changed:
  landos-agents/duke-due-diligence/CLAUDE.md (major rewrite -- ~2,700 lines to ~110 lines)
  landos-agents/duke-due-diligence/skills/duke-fast-default.md (new -- full Fast Default workflow)
  landos-agents/duke-due-diligence/skills/duke-full-report.md (new -- comp credit upgrade addendum)
  landos-agents/duke-due-diligence/skills/duke-area-only.md (new -- area-only local market context)
  landos-agents/duke-due-diligence/skills/duke-unconfirmed-parcel.md (new -- multi-candidate disambiguation)
  docs/landos/LandOS_Skill_Registry.md (updated -- Duke skills now show file paths and accurate steps)
  docs/landos/LandOS_Current_State.md (updated -- reflects refactor complete, pending commit)
Tests: pending npm run build verification before commit
Known issues: None. Duke agent.yaml and settings.json unchanged.
Next action: Tyler approves commit, restarts ClaudeClaw, runs Duke smoke test on address-only dashboard input.
