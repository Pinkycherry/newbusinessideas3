# REDESIGNING — bbusiness.online cinematic redesign (shared log for Pinky 1 and Pinky 2)

Read this first if you are picking up the redesign. Newest entries at the top of the log. Times are IST.
Pinky 1 = this session (model: claude-fable-5-2, earlier claude-opus-5-5). Pinky 2 = the other Claude Code account.
When Pinky 1 runs out of tokens, Pinky 2 continues from "NEXT STEPS" below. Update this file and commit it to main before you stop.

## The goal (founder, 10-11 Nov 2026)

Make the home page cinematic, not generic, on phone, tablet and desktop. Nothing static, no sloppy cards or buttons.
Two reference sites (patterns only, never copy their code, art or brand):

- https://www.mbidirectmail.com/ : header menus with red connection lines (hub + curves to ringed items), round floating
  button whose links fan out on a curve with dotted lines, four quarters around a centre logo, pinned scroll scenes,
  bento cards with small live infographics.
- https://dairyfoodbg.com/ : hero is a pre-rendered 3D video scrubbed by scroll inside sticky sections, text fades over it.
  We do the same feel with STILL IMAGES (founder's decision: no video, no Gemini video watermark tricks).

## Founder rules that apply to this work

- Commit straight to main. No side branches, no local-only commits. Give the live URL (https://bbusiness.online/), never repo links.
- After each deploy: wait for https://bbusiness.online/version.json to show the new commit, then purge the Cloudflare cache
  (dashboard, Caching, Configuration, Purge Everything).
- Push from the sandbox is blocked: commit through the GitHub web upload page in the founder's Chrome
  (https://github.com/Pinkycherry/newbusinessideas3/upload/main). Stage files under `.up/pNN/` with `~` in place of `/`,
  rename with a small change-hook script on the file input, tick "Commit directly to main".
- Home page: allowed to change composition, order and presentation. Other pages: motion only, never touch content.
- Never show idea counts ("100 ideas", "50 ideas"). Categories heading says "50+ main categories" (53 are live).
- No icons in the header or its drop-downs. Never hide "Business Ideas" in category links.
- Zero invented numbers. The six search counts below are the founder's own paid keyword research. Never name the tool.
  No Google Trends.
- No emojis. Short replies to the founder. Log every edit in the memory work log too.
- Founder is non-technical: plain words, no jargon in replies.

## What is live now (after batch 2)

Files: `src/components/home/cinema.tsx` + `cinema.css` (new section components), `scroll-story.tsx` + `.css`
(round button, older scroll pieces), `src/components/v2/frame.tsx` (header, footer), `src/components/home/ember.css`
(theme + header wire styles), `src/routes/index.tsx` (home), `src/lib/home-live.functions.ts` (home data).

| Area | State | Where |
|---|---|---|
| Header menus (desktop, every page) | Red line drops from the open menu word to a hub with an "All ..." link; curves run to a ring beside each column; columns fade up | frame.tsx `Wire`, `HUBS`; ember.css `.mm-wire` |
| Round button (every page) | Reference fan: pills on a curve with dotted lines. Pills = THIS page's own h2 sections (max 7, picked evenly) + Back to top + Pause motion | scroll-story.tsx `OrbitMenu`, css `.ss-fan` |
| Categories row | "50+ main categories", no counts, glides left by itself, free swipe, arrows, Skip, middle card lit | cinema.tsx `Carousel` |
| Ideas row | 24 real ideas from six home and street categories, ends with a button to /lists | home-live `street`, index.tsx `reads` |
| Blog row | Every post as a 16:9 card in the same gliding row | index.tsx `#blog`, css `.cn-postcard` |
| What India is searching for | Six monthly all-India search counts, count up on scroll (replaced the India map) | cinema.tsx `SearchDemand`, index.tsx `DEMAND` |
| We have been where you are | Drawn line with a travelling light, four chapters | `StoryRail` |
| Eight ways | Icons circle the centre | `OrbitRing` |
| Working process | Four panels with small moving pictures (shapes and words only, no numbers) | `ProcessBento`, `Viz` |
| Built by hand (team) | Names fly through a light frame one at a time, no cards | `Tunnel` |
| Four steps | Four quarters around the brand mark, tap opens links | `Quad` |
| Inside the library | Mini browser tilts in, rows take turns lit, search box types examples | css `.cn-lib`, `useTypedPlaceholder` |
| FAQ | Plain list again | index.tsx |

The six numbers (monthly searches, all India, founder's research, November 2026; update every month in `DEMAND`):
new business ideas 8,02,911; zero investment business ideas 6,51,371; low investment business ideas 4,72,897;
work from home ideas 3,49,721; side hustles 2,94,305; small business ideas 1,42,339.

## What failed or was rejected (do not repeat)

- Batch 1 header: thin light lines flowing across the bar plus a glowing dot. Founder: "scrap". Removed.
- Batch 1 round button as a boxed table-of-contents panel. Founder: must be the reference fan. Replaced.
- Batch 1 rows with arrows only, stepping every 3 seconds with snap. Founder: lost the cinematic scroll. Now a continuous glide.
- Blog as a fly-through tunnel: thumbnails wrong size, ghost items behind, unstable. Replaced by 16:9 cards in the row.
- Team tunnel with many ghost items overlapping. Now one item at a time.
- Sticky scroll-pinned card reels (10 Nov, other session): confusing on phones. Replaced by the gliding rows.
- Chubby doll characters for the hero: founder changed to ultra-realistic people.
- Google Gemini video with watermark: not used. Never crop or remove a provider watermark.
- Local preview cannot reach the database, so the hero preview card and the ideas row are empty locally. Check those on the live site.

## Waiting on the founder

Realistic images he is generating in ChatGPT from the brief Pinky 1 wrote (in the chat, 11 Nov):
1-5 the same South Indian town from five camera positions (high wide, rooftop, street level with empty middle, road with
four gateways, glowing doorway), 2560 x 1440, no people, no text; 6-7 six realistic people on flat grey (#808080), three per
sheet, walking and looking up; 8-9 the same six, relieved, walking forward; 10 mist on black; then tall 1080 x 1920 versions
of 1-5. Light always from the left, golden hour.

## NEXT STEPS (in order)

1. Founder reviews batch 2 on phone and laptop. Fix what he flags first.
2. HERO STORY (needs images 1-3, 6, 7, 10): sticky scene at the top of the home page. Scroll zooms and cross-fades
   town frame 1 to 2 to 3; six cut-out people stand in the street; above each a thought bubble drawn in code with one of
   the six searches and its number (count up). Cut the people out of the grey sheets (background removal, WebP with alpha),
   save under `public/images/hero/`. Phone uses the tall frames. Until images arrive, the old hero stays.
3. VALIDATE STORY mid-page (needs images 4, 5, 8, 9): road with four gateways = Find an idea, Read the four answers,
   Check it free, Decide; ends at the glowing doorway with the "Explore the library" button.
4. Recompose the home page order around those two scenes; drop sections that repeat each other.
5. Phone and tablet pass on every section (padding, tap targets, nothing static).
6. Bring the row, scene and button motion to inner pages (lists, blog, category) without touching content.
7. Raw purchased pages (lists hub, failed startups, topic pages) have the header but not the round button: add it.
8. Still open from before: number icons 8-100, subcategory icons 21-42, batch 9 redo icons, answer page images
   (all from the founder); Cloudflare paid plan; the remaining seller template pages (see HANDOFF.md and the page
   inventory artifact).

## Log (newest first)

- 11 Nov 2026 ~05:40 IST — Pinky 1 (claude-fable-5-2): BATCH 2 committed to main through the GitHub upload: header
  connection lines, fan button with page sections, gliding rows, blog 16:9 cards, search numbers section replacing the
  India map, steadier team scene, library motion. This file created. Next: confirm deploy, purge cache, founder review.
- 11 Nov 2026 ~04:30 IST — Pinky 1: founder reviewed batch 1 with screenshots: blog and team scenes "corrupted", button
  not like the reference, rows lost the auto scroll, header lines "scrap", home not recomposed. Wrote the ChatGPT image
  brief (first chubby characters, then realistic people on his order). Founder gave the six search numbers.
- 11 Nov 2026 ~02:30 IST — Pinky 1: BATCH 1 live (commit e343260): cinema.tsx and cinema.css added; carousels, story
  rail, orbit ring, process panels, tunnels, quarters; FAQ plain again.
- 10 Nov 2026 night — Pinky 1 (other session): "cinema motion" commits 5084268 to c07bada: scroll-story.tsx, round
  menu, India journey, sticky reels. Founder found it sloppy, which started this redesign.
