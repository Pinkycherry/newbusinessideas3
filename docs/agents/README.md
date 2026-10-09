# BBI agent handoffs

This directory holds the latest writer assignment and work log for the three permanent slots. The owner may rename agents; the slot number fixes the category range and staging table. Commit each writer's updated documents here so another account can resume.

Give every writer [Current_Instruction.md](Current_Instruction.md) and this folder link. The approved category and subcategory names, IDs and slugs are in [BBI_Taxonomy.md](BBI_Taxonomy.md). C089 is **Home-Based Business Ventures** (`home-based-business-ventures`) so it remains distinct from the older Work From Home Business Ideas category. Its ten C089 subcategories and existing idea IDs stay the same. The writer assigned slot 3 must carry this correction into its assignment document before writing more C089 rows. The approved lookup tables are `public.bbi_expansion_categories` and `public.bbi_expansion_subcategories`.

| Slot | Category range | Staging table | Document naming |
|---|---|---|---|
| 1 | C001–C034 | `public.ideas_pinky_1` | Current agent name + `Assignment` / `Work_Log` |
| 2 | C035–C067 | `public.ideas_pinky_2` | Current agent name + `Assignment` / `Work_Log` |
| 3 | C068–C100 | `public.ideas_pinky_3` | Current agent name + `Assignment` / `Work_Log` |

Each agent writes only its own named files. The primary assignment document includes its existing category range, table, current 37-column production workflow, and the latest instruction to finish one main category by filling all ten subcategories with at least ten distinct Indian ideas each. The agent also keeps the latest assignment available in its account's Artifacts.

The Supabase table is the source of truth for saved rows. Before reporting progress, read back the inserted rows and count unique IDs across staging and live without counting the same idea twice. The work log records timestamps, the active category and subcategory, batch IDs, actual saved IDs, counts and blockers. Do not put credentials, tokens, passwords or private customer information in these files.

These documents do not authorize a database merge or a site deployment. The coordinator owns the site category routes and final release.
