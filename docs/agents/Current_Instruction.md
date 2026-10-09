# Universal BBI writer instruction — send after assigning a writer slot

You are writing **new expansion ideas** for Bro Business Ideas, for Indian readers. The owner will assign you a writer slot (1, 2, or 3) and may give you a different display name. Your display name does not change your slot, category range, or table. If a shared chat prompt still contains the literal `[OWNER: INSERT 1, 2, OR 3]`, resolve your slot from your existing Pinky 1/2/3 assignment and `bbi_agent_assignments`; never choose a different slot. Check any rows already written after that prompt and flag a wrong-table write immediately. Read this complete instruction, the [approved taxonomy](BBI_Taxonomy.md), your existing assignment/work log, and the database assignment row before writing. Do not restart or duplicate the 100 drafts already saved in each table.

| Writer slot | Assigned category IDs | The only idea table you may edit |
|---|---|---|
| 1 | C001–C034 | `public.ideas_pinky_1` |
| 2 | C035–C067 | `public.ideas_pinky_2` |
| 3 | C068–C100 | `public.ideas_pinky_3` |

The approved new taxonomy also exists in Supabase as `public.bbi_expansion_categories` and `public.bbi_expansion_subcategories`: 100 main categories, exactly ten approved subcategories each. Read these lookup tables to verify exact IDs, names, slugs and ordering. They are read-only for you. The 679 established live ideas, their 20 category routes and existing indexed URLs are legacy content; do not edit them. The new architecture is **main category page → ten subcategory choices → idea cards → individual idea pages**. Never store an idea as a category or create a separate subcategory for every new idea. The repo implements this navigation; your job is the content in your staging table.

## Work order and counts

## Current category assignments — 2026-10-09 17:57 IST

The owner showed screenshots of incomplete public category pages. The immediate next category is now fixed for each slot; do not choose a different category or start several categories at once. These are staging-writing assignments, not publication instructions.

| Slot | Main category to complete now | Existing staged drafts at this checkpoint | Missing to reach 100 |
|---|---|---:|---:|
| 1 | C004 Beverage Product Business Ideas | 4 | 96 |
| 2 | C040 Local Event Services Business Ideas | 6 | 94 |
| 3 | C079 Cross-Border Trade Services Business Ideas | 3 | 97 |

Re-read your table before writing because counts can change. Work through approved S01 to S10 in order: bring S01 to ten distinct ideas, verify it, then S02, and so on until all ten have ten. Improve existing staged drafts as needed; a matching live copy counts once and stays untouched. Keep the ten subcategory counts in each batch log. Hand off a complete 100-idea category, then stop for the coordinator's review and release. Do not describe staged ideas as already visible on the website. The incomplete public “Ideas coming soon” display is a separate site issue tracked in PENDING #40.

Choose **one main category inside your assigned range** and finish it before moving to the next. For its ten approved subcategories, write **at least ten meaningfully distinct idea pages in each**: at least **100 idea pages per completed main category**. Your earlier one-per-subcategory drafts count toward this target after you check and improve them. They do not mean that the category is finished. Read the current rows first, count distinct IDs and slugs by subcategory, and fill the missing slots. Avoid duplicate titles and overlapping business models even when their slugs differ. A staged idea that has also been copied to live counts once, not twice. Do not publish to `public.ideas` yourself; the coordinator will review and sync completed content separately.

Check category names and slugs against the approved taxonomy and existing legacy names/slugs. If there is a genuine overlap, propose one distinctive name fitted to that category; do not use a repeated `New ...` or `Latest ...` formula. Record the proposed change for the coordinator before inserting that category. The **known C089 correction is already applied**: C089 is **Home-Based Business Ventures**, slug `home-based-business-ventures`; the legacy **Work From Home Business Ideas** keeps `work-from-home-business-ideas`. C089's ten subcategories and existing idea IDs remain the same. Use the corrected C089 category fields if slot 3 is yours.

## Standard for every idea page

Write for a real person in India considering a specific business. Use the page's **existing sections and database fields**; do not add sections just to inflate the count. The **visitor-facing copy across the complete idea page must contain at least 500 words**, with no upper limit. Expand the detailed bullet points substantially. In the appropriate existing fields, explain what I would offer, whom I would serve, how I could begin, needed tools or skills, how revenue could work, practical difficulties, pros, cons, and an honest founder-fit verdict. Adapt the detail to the idea: local habits, town size, language, payments, transport, family commitments, trust, seasonality and affordability only where relevant. Avoid invented prices, timelines, statistics, regulatory claims, testimonials, or achievements. There is **no web research requirement** for this writing pass; do not claim to have researched facts you did not verify.

Use a **first-person prospective-founder point of view** in the main body: “I could…”, “I would…”, “I need to…”. Bring warmth and emotional understanding to the reader's hopes and worries, but do not pretend you personally ran the business. Vary openings, rhythm, examples, details and tone from page to page. No copied paragraphs, repeated bullet framework, interchangeable noun swaps or stock calls to action. Keep machine-readable fields and headings in the site's expected format.

The idea page already has a **Validate** button. Where an existing section naturally discusses a next step, tell the reader in fresh, varied wording to click **Validate on that page** and view its current, real-time data **on their own screen**. Never assert that you clicked it for them or know today's result. Do not paste the same line across ideas.

## Saving, verification and handoff

Use your assigned **37-column** staging table only, with status pending. Save in batches of up to ten, read each batch back, and verify the required fields, at least 500 visitor-facing words per idea, unique idea IDs and slugs, and exact category/subcategory IDs, names and slugs against the two lookup tables. Check for duplicates across live and all staging tables. Do not alter legacy rows, the live `ideas` table, schema, taxonomy tables, another writer's table, or site deployment.

**Before writing the next row**, update your primary assignment document with your current name, permanent slot/table/range, these rules, and the active main category. Save it in your account's **Artifacts** and commit/push its named copy to [docs/agents]. Keep a work log there and in Artifacts as you write: record timestamps, the ten subcategory counts, actual saved IDs, batch read-back results, and remaining gaps. Do not leave the only updated copy in chat. Commit and push the named documents to [docs/agents](https://github.com/Pinkycherry/newbusinessideas3/tree/main/docs/agents), using your current agent name in the filenames (for example, `Agent_Name_Assignment.md` and `Agent_Name_Work_Log.md`). Never commit secrets. At each completed main category, report the ten verified counts and pause that category for coordinator review before starting the next.
