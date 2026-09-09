# Design workflow — portable

The standing rules for designing and building UI, plus the commands that
install the stack they depend on.

This file is deliberately self-contained so it can be pasted into another
project's `CLAUDE.md`, or into `~/.claude/CLAUDE.md` to apply everywhere.

---

## The workflow

Applies to every request to design, redesign, or touch UI. It does not need to
be restated.

### 1. Lead with Impeccable

| Situation | Command |
|---|---|
| New page or surface | `/impeccable init` |
| Reviewing existing UI | `/impeccable audit` |
| Motion and animation work | `/impeccable animate` |

Other verbs exist and are listed in the skill's own Commands table — `shape`,
`critique`, `polish`, `bolder`, `quieter`, `distill`, `typeset`, `layout`,
`colorize`, `clarify`, `delight`, `harden`, `adapt`, `optimize`, `overdrive`,
`extract`, `document`, `onboard`, `live`.

`/impeccable init` writes `PRODUCT.md`, and the skill blocks new-surface and
redesign flows until that file exists. Run it once per project.

### 2. Frontend Design runs itself

Anthropic's `frontend-design` skill loads on its own for UI work. Do not
invoke it manually.

### 3. Inspiration is inspiration — never a copy

Refero, Godly, Landbook, Awwwards, Dribbble and Mobbin are reference material.
Take the idea, the rhythm, the hierarchy. **Never reproduce a design as-is**,
and never lift a company's distinctive branded UI.

### 4. Components — check in this order

1. 21st.dev
2. Aceternity
3. Magic UI
4. React Bits
5. Cocoon UI
6. Motion Primitives
7. Animate UI
8. Cult UI

Applies to nav, hero, cards, testimonials, footer and the rest of the standard
furniture. Stop at the first one that genuinely fits rather than surveying all
eight.

### 5. Scroll animation and choreography → GSAP skill

Pinning, scroll triggers, timelines, scrubbing. Eight skills are installed:
`gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`,
`gsap-react`, `gsap-frameworks`, `gsap-performance`, `gsap-utils`.

### 6. 3D and WebGL → Claude Design Skillstack

The marketplace is configured. The `core-3d-animation` bundle is **not
installed** — install it when 3D is actually wanted, not before.

---

## Two constraints that bind all of the above

- **Free tiers only** for third-party tooling until launch. Everything in this
  stack is free and none of it needs an API key.
- **Never name an AI vendor in public copy**, including anything these skills
  generate.

---

## Installing the stack

Verified working. Note the corrections — three of the commonly circulated
commands are wrong.

```bash
# 1. Impeccable — anti-slop design workflow
#    `npx impeccable install` may fail with a 403 on its signed bundle;
#    installing the skill straight from the repo works and is equivalent.
npx skills add https://github.com/pbakaus/impeccable \
  --global --agent claude-code --skill impeccable --copy -y

# 2. Anthropic's Frontend Design skill
npx skills add https://github.com/anthropics/skills \
  --global --agent claude-code --skill frontend-design --copy -y

# 3. UI/UX Pro Max
#    NOT `claude plugin add` — there is no `add` subcommand.
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill

# 4. GSAP — official GreenSock skills
npx skills add https://github.com/greensock/gsap-skills \
  --global --agent claude-code --skill '*' --copy -y

# 5. Claude Design Skillstack — marketplace only
claude plugin marketplace add freshtechbro/claudedesignskills
# later, only when 3D is wanted:
# claude plugin install core-3d-animation@claude-design-skillstack
```

The agent id is `claude-code`, not `claude`. `--copy` writes real files rather
than symlinks into a temporary clone. `--global` targets `~/.claude/skills/`.

### Verifying

```bash
ls ~/.claude/skills/          # impeccable, frontend-design, gsap-*
claude plugin marketplace list
claude plugin list
```

### If skills vanish

On an ephemeral or rebuilt machine, `~/.claude/` does not survive. Re-run the
block above — that is the whole recovery.

---

## Sources

| Skill | Repo | Licence |
|---|---|---|
| Impeccable 4.2.3 | https://github.com/pbakaus/impeccable | see repo |
| frontend-design | https://github.com/anthropics/skills | see repo |
| ui-ux-pro-max 2.13.0 | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | see repo |
| gsap-skills (8) | https://github.com/greensock/gsap-skills | see repo |
| Claude Design Skillstack | https://github.com/freshtechbro/claudedesignskills | see repo |
