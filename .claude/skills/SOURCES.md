# Third-party skills — sources

Installed 2026-08-08 at the founder's request. All project-level (`.claude/skills/`), available to any Claude Code session working in this repo.

| Skill(s) | Source | License |
|---|---|---|
| 48 skills (ab-testing, copywriting, cro, pricing, launch, etc.) + `seo-audit-marketing` | https://github.com/coreyhaines31/marketingskills | MIT |
| `seo-audit` | https://github.com/southwellmedia/seo-audit | none found in repo — attribute on use |
| 28 skills (`cold-email-kickoff`, `icp-onboarding`, `smartlead-*`, `prospeo-*`, etc.) | https://github.com/growthenginenowoslawski/coldoutboundskills | MIT |
| `grand-slam-offer` | https://github.com/itsfromgaurav/grand-slam-offer-skill | none found in repo — attribute on use |

## Naming collision

Both `marketingskills` and `southwellmedia/seo-audit` ship a skill literally named `seo-audit`. Kept the standalone repo's version (explicitly requested by name) as `seo-audit`; the one bundled inside the marketing pack is renamed `seo-audit-marketing`. Everything else installed under its original folder name — no other collisions.

## Not installed

`coldoutboundskills`' `Common Outbound Lists/` folder (~500MB of scraped US business/lead data as zips/CSVs) and its root `.env.example`/`presentation.html`/`docs/roadmap.md` were intentionally left out — not skill definitions, and too large for this repo. If a cold-outbound skill needs that data, re-clone the source repo separately rather than committing it here.

## Notes on the cold-outbound skills specifically

Several (`smartlead-*`, `prospeo-*`, `zapmail-*`, `dynadot-*`, `instantly-*`) call real paid APIs and expect your own API keys in a local `.env` (Smartlead, Prospeo, Dynadot, Zapmail, MillionVerifier, Blitz, RapidAPI, Instantly, OpenWebNinja, OpenRouter — see each `SKILL.md`/`scripts/` for specifics). They won't do anything destructive on their own — they just won't work until you supply keys for whichever ones you actually want to use.

## Refreshing

To pull updates later: re-clone the source repo, diff its `skills/` (or root, for the two single-skill repos) against the matching folders here, and re-copy.
