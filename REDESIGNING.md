# REDESIGNING — bbusiness.online cinematic redesign (shared log for Pinky 1 and Pinky 2)

Read this first if you are picking up the redesign. Newest entries at the top of the log. Times are IST.
Pinky 1 = this session (model: claude-fable-5-2, earlier claude-opus-5-5). Pinky 2 = the other Claude Code account.
When Pinky 1 runs out of tokens, Pinky 2 continues from "NEXT STEPS" below. Update this file and commit it to main before you stop.

## HANDOVER TO PINKY 2 — 11 Nov 2026 ~09:15 IST (written by Pinky 1, model claude-fable-5-2, out of tokens)

Live commit: fce88f5 (batch 3). Cache purged after it. Nothing is half done locally; main is the truth.
Founder's last order: STOP, no edits, only this log. Do not start until he says go.

### 1. First job when he says go: the rows (HIS MAIN COMPLAINT, still broken)

Rows = "50+ main categories", "Ideas you can start from home or your own street", "Long reads for the next decision"
(home page, component `Carousel` in src/components/home/cinema.tsx, styles `.cn-car*` in cinema.css).
He says: "the scroll is not working, just the carousel is working". Cause (my bug):
- The row pauses (`hold.current = true`) on mouseenter, pointerdown, touchstart and focus so the reader can swipe.
  The page-scroll link (`onPage` in the Carousel effect, moves `tr.scrollLeft` by 0.6 x scroll delta) returns early
  while `hold.current` is true. So with the mouse over the cards, or a finger on the row, page scroll does nothing.
  FIX: let `onPage` run even while held (only the self-glide should pause), or drop the hold on plain hover.
- The pop-up (`.cn-car.is-pop li>*` animation `cn-pop`) plays only when the whole row enters the screen.
  He wants EVERY card to pop up again and again as the reader scrolls or moves the mouse, like the reference site's
  cards. FIX: per-card pop each time a card crosses into view / becomes the middle card (replay), both directions,
  phone and desktop.
- NEVER add buttons to these rows (arrows, progress bar, Skip were rejected with anger). No buttons at all.
- Keep: self glide, free finger swipe, middle card lit, 16:9 blog thumbnails, no idea counts, "50+ main categories".

### 2. Reference sites (study them live in his Chrome before building; patterns only, never copy code or art)

- https://www.mbidirectmail.com/ (main reference). What to take:
  header: hover a menu word, a red line drops to a hub, curves run to ringed items (done on desktop, check it);
  round floating button on the right: fan of pills on a curve with dotted lines (done, pills = page sections);
  four quarters around a centre logo ("Tap to explore"); pinned scroll scenes where things pop as you scroll;
  bento cards with small live infographics; big count infographics (never plain number cards).
- https://dairyfoodbg.com/ (hero reference): scroll-scrubbed film inside sticky sections, text fading over it.
  We do it with still images (founder: no video, never remove or crop a provider watermark).

### 3. Images: where they are

- Founder's originals (ChatGPT, realistic): only in the chat uploads of Pinky 1's session, NOT in the repo.
  If you need them again, ask him to re-send or drop them in the repo.
- In the repo, public/images/hero/ (all WebP, used by src/components/home/film.tsx):
  town-1..4.webp = the same South Indian street from wide to close (hero film, id #top);
  road-1..4.webp = road leaving town through gateways, tiled gateways, walled doorway, open doors to fields
  (validate film, id #how-it-works);
  p-student, p-jobholder, p-wfh, p-cook, p-village, p-tailor (.webp, transparent) = six people "before";
  p-<same>-after.webp = the same six "after". Cut from grey sheets with OpenCV GrabCut (script was in /tmp, gone;
  method: border median as background, mask by colour distance and saturation, grabCut, split by column gaps).
- Not used on purpose: the hoodie/laptop people sheet (different faces) and the hill shot (red flag on the tower
  can read as political). Never came: aerial town shot, mist layer, tall phone versions (1080 x 1920).
- Person to number mapping (SEEKERS in src/routes/index.tsx): student = side hustles, job holder = new business
  ideas, work-from-home woman = work from home ideas, cook = small business ideas, village youth = low investment
  business ideas, tailor = zero investment business ideas.

### 4. Pending list, in order

1. Fix the rows as in section 1. Then apply the same card motion wherever cards send people to articles, ideas and
   lists (blog index, lists, category pages), motion only, no content change.
2. Founder review of batch 3 (hero film, validate road). Not reviewed yet. Check on a real phone: people overlap,
   bubble sizes, text over faces (he dislikes text over faces), scroll length (4 frames x 95svh each may feel long).
3. Recompose the home page: it is long and repeats itself (old hero block still sits under the hero film; numbers
   appear in the hero bubbles AND in the ring infographic "What India is searching for"). Ask him what to drop.
4. Phone and tablet pass on every home section. He says every section is still sloppy on phone.
5. Sections he flagged that may still need more: "Inside the library", "Our working process", "Built by hand",
   "Four steps", "One free home, eight ways", "We have been where you are". He wants cinematic, not card grids.
6. Round button: also missing on raw purchased pages (lists hub, failed startups, topic pages).
7. Monthly: update the six search numbers in DEMAND (index.tsx) from his research. Never name the tool.
8. Older open items: number icons 8-100, subcategory icons 21-42, batch 9 redo icons, answer page images (all from
   him); Cloudflare paid plan; remaining seller template pages (HANDOFF.md, page inventory artifact).

### 5. How to work with him (learned the hard way)

- He reviews on the live site. Deploy = GitHub web upload in his Chrome (push from the sandbox is denied), wait for
  /version.json, purge Cloudflare, then give https://bbusiness.online/ . The local build has no database: the hero
  preview card and the ideas row are empty locally, check those live.
- Short replies, plain words. If he says stop, stop. If he says note, only note.
- Show, do not explain. He judges by motion on phone first.
- Log every step here and in the memory work log.

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
| What India is searching for | One infographic panel: six rings (longer ring = more searches) that draw in, a sweep line, the centre and a ranked list take the six searches in turn; tap picks one (replaced the India map) | cinema.tsx `SearchDemand`, index.tsx `DEMAND` |
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
- The six search numbers as six big count-up cards. Founder: sloppy. Now one ring infographic.
- Arrows, progress bar and Skip button under the rows. Founder hated them. Removed; never add buttons to rows.
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

- 11 Nov 2026 ~08:30 IST — Pinky 1 (claude-fable-5-2): BATCH 3. Founder sent 20 realistic images (no aerial shot, no
  mist layer came). Used: four street frames (town-1..4) and four road frames (road-1..4) in public/images/hero/, plus
  twelve people cut out of the grey sheets with OpenCV GrabCut (p-<role>.webp before, p-<role>-after.webp after).
  Not used: the hoodie/laptop sheet (different people) and the hill shot (red flag on the tower reads as political).
  NEW src/components/home/film.tsx (Film): sticky stage, frames zoom and dissolve as the page scrolls, text slides and
  cut-out people per step, thought bubbles with the six monthly search counts drawn in code.
  HOME: (1) hero film #top replaces the top of the page (h1 lives there now; the old hero block below it has an h2);
  (2) validate road film #how-it-works before "Eight ways": Find an idea, Read the four answers, Check it for free,
  Build it or walk away, ending at the open door with the six people walking out.
  ROWS (categories, ideas, blog): founder rejected the arrows, bar and Skip button. Removed. Cards now pop up each time
  the row scrolls into view (replays), the page scroll moves the row both ways, the middle card grows, pointing lifts
  a card, the row still glides by itself and can be swiped.
  html.ss-off is now set when motion is paused (film falls back to one picture with the text under it).
  NEXT: founder review; phone and tablet pass; same row motion on inner pages; tall phone crops if he sends them.

- 11 Nov 2026 ~06:20 IST — Pinky 1 (claude-fable-5-2): founder rejected the six numbers as plain count-up cards
  ("sloppy"). Rebuilt as one ring infographic (SearchDemand in cinema.tsx, .cn-demand / .cn-dm-* in cinema.css).
  Lesson: numbers are never shown as plain cards; they go into an infographic with motion.

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
