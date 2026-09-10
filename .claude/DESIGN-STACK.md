# Design & Frontend Skill Stack

Everything Claude Code loads for design work on this project, plus the reference
libraries that have no install command and live here instead.

Plugins and marketplaces are declared in `.claude/settings.json`, so this stack
reproduces on any machine or fresh session that checks out the branch — no
manual re-install.

## Project stack this targets

React + TanStack Router/Start · Vite · Tailwind CSS v4 · Radix UI (shadcn-style)
· `framer-motion` · `gsap` · Recharts · Embla · Supabase.

`gsap` and `framer-motion` are already dependencies, so the GSAP and Motion
skills below apply to code that already exists rather than proposing new deps.

## Installed plugins

| Plugin | Marketplace | Gives you |
|---|---|---|
| `frontend-design` | anthropics/claude-code | Anthropic's core design skill — commit to an aesthetic direction before writing code instead of defaulting to generic AI layout |
| `impeccable` | pbakaus/impeccable | 1 skill + 23 `/impeccable` commands (polish, audit, critique, doctor) + 4 review agents + anti-pattern detection |
| `ui-ux-pro-max` | nextlevelbuilder | 7 skills — searchable style/color/font-pairing databases and UX guidelines |
| `gsap-skills` | greensock (official) | 8 skills — core, timeline, ScrollTrigger, plugins, utils, React hooks, performance |
| `core-3d-animation` | freshtechbro | 5 skills — Three.js, R3F, GSAP ScrollTrigger, Motion/Framer, Babylon.js |
| `animation-components` | freshtechbro | 5 skills — Magic UI, React Bits, React Spring, Anime.js, AOS, Lottie |
| `meta-skills` | freshtechbro | 2 skills — modern web design guidelines, 3D/animation integration patterns |
| `extended-3d-scroll` | freshtechbro | 6 skills — Locomotive Scroll, Barba.js, PixiJS, A-Frame, PlayCanvas, lightweight 3D |
| `authoring-motion` | freshtechbro | 4 skills — Blender pipeline, Spline, Rive, Substance 3D |

39 skills and 4 agents total. Skills load on demand, not all at once.

### Notes

- `core-3d-animation` already bundles `threejs-webgl`, `gsap-scrolltrigger` and
  `react-three-fiber`, so those are **not** installed separately — doing so would
  duplicate the same skill content.
- `gsap-scrolltrigger` ships in both `core-3d-animation` and `gsap-skills`.
  Prefer the `gsap-skills` version; it is the official GreenSock one.
- `authoring-motion` covers desktop authoring tools (Blender, Substance Painter).
  Useful for producing assets, not for editing this codebase.
- Impeccable's hooks run its engine on `Edit`/`Write` and at `Stop`. The engine
  binary self-installs to `~/.impeccable/bin/` on first run; the hooks are
  guarded and no-op if it is missing, so nothing breaks without it.

## Routing — which skill for which job

| Task | Use |
|---|---|
| New page or component, needs an aesthetic direction | `frontend-design` first |
| Existing UI looks generic or off | `/impeccable critique`, then `/impeccable polish` |
| Picking colors, fonts, or a style system | `ui-ux-pro-max` |
| Scroll-driven or timeline animation | `gsap-skills` |
| React component transitions | `motion-framer` (framer-motion is already installed) |
| Pre-built animated components | `animated-component-libraries` |
| 3D scene in React | `react-three-fiber` |

## Reference libraries (no install — browse these)

These are the non-installable half of the stack: look here for direction before
building, and cite a specific reference rather than describing a vibe.

**Design systems**
- Refero — https://styles.refero.design/

**Inspiration**
- Godly — https://godly.website
- Land-book — https://land-book.com
- Awwwards — https://www.awwwards.com
- Dribbble — https://dribbble.com
- Mobbin — https://mobbin.com (real product UI flows)

**Components & motion** — mostly React + Tailwind, so they drop into this stack
- 21st.dev — https://21st.dev
- Aceternity UI — https://ui.aceternity.com
- Magic UI — https://magicui.design
- React Bits — https://reactbits.dev
- Kokonut UI — https://kokonutui.com
- Motion Primitives — https://motion-primitives.com
- Animate UI — https://animate-ui.com
- Cult UI — https://www.cult-ui.com

**Directory**
- Front-end Design Toolkit — https://github.com/wilwaldon/Claude-Code-Frontend-Design-Toolkit
  (a curated README of 70+ tools; a link directory, not an installable plugin)

## Maintenance

```sh
claude plugin list                  # what is installed and enabled
claude plugin marketplace update    # refresh all marketplaces
claude plugin update <name>         # update one plugin (restart to apply)
claude plugin details <name>        # component inventory + token cost
```
