# BBI agent handoffs

This directory holds the latest agent-facing assignment and work log for the three Pinky writers. Commit each agent's updated document here so a replacement account can resume from the same instructions.

The approved category and subcategory names, IDs and slugs are in [BBI_Taxonomy.md](BBI_Taxonomy.md). C089 is **Home-Based Business Ventures** (`home-based-business-ventures`) so it remains distinct from the older Work From Home Business Ideas category. Its ten C089 subcategories and existing idea IDs stay the same. Pinky 3 must carry this correction into its assignment document before writing more C089 rows.

| Agent | Assignment file | Work log |
|---|---|---|
| Pinky 1 | `Pinky_1_Assignment.md` | `Pinky_1_Work_Log.md` |
| Pinky 2 | `Pinky_2_Assignment.md` | `Pinky_2_Work_Log.md` |
| Pinky 3 | `Pinky_3_Assignment.md` | `Pinky_3_Work_Log.md` |

Each agent writes only its own named files. The primary assignment document includes its existing category range, table, current 37-column production workflow, and the latest instruction to finish one main category by filling all ten subcategories with at least ten distinct Indian ideas each. The agent also keeps the latest assignment available in its account's Artifacts.

The Supabase table is the source of truth for saved rows. Before reporting progress, read back the inserted rows and count unique IDs across staging and live without counting the same idea twice. The work log records timestamps, the active category and subcategory, batch IDs, actual saved IDs, counts and blockers. Do not put credentials, tokens, passwords or private customer information in these files.

These documents do not authorize a database merge or a site deployment. The coordinator owns the site category routes and final release.
