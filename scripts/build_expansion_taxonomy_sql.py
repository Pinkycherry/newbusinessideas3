"""Build the additive expansion taxonomy migration from approved repo sources."""

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
ts = (ROOT / "src/config/expansion-taxonomy.ts").read_text()
match = re.search(
    r"export const EXPANSION_SUBCATEGORIES: Record<string, ExpansionSubcategory\[\]> = (\{.*\});\s*$",
    ts,
    re.S,
)
assert match, "Expansion taxonomy not found"
subcategories_by_slug = json.loads(match.group(1))
document = (ROOT / "docs/agents/BBI_Taxonomy.md").read_text()
entries = re.findall(
    r"^### (C\d{3}) — (.+?)\n\n(?:Proposed )?[Cc]ategory slug: `([^`]+)`",
    document,
    re.M,
)
assert len(entries) == len(subcategories_by_slug) == 100
categories = [
    {"category_id": category_id, "name": name, "slug": slug}
    for category_id, name, slug in entries
]
subcategories = []
for category in categories:
    items = subcategories_by_slug[category["slug"]]
    assert len(items) == 10
    for ordinal, item in enumerate(items, 1):
        assert item["id"] == f"{category['category_id']}-S{ordinal:02}"
        subcategories.append(
            {
                "subcategory_id": item["id"],
                "category_id": category["category_id"],
                "ordinal": ordinal,
                "name": item["name"],
                "slug": item["slug"],
            }
        )
assert len(subcategories) == 1000
assert len({category["slug"] for category in categories}) == 100
assert len({item["subcategory_id"] for item in subcategories}) == 1000

sql = """-- Additive taxonomy for the new BBI expansion. Legacy rows and tables are untouched.
-- Mirrored by src/config/expansion-taxonomy.ts for the site navigation.
create table public.bbi_expansion_categories (
  category_id text primary key check (category_id ~ '^C[0-9]{3}$'),
  name text not null unique,
  slug text not null unique
);
create table public.bbi_expansion_subcategories (
  subcategory_id text primary key check (subcategory_id ~ '^C[0-9]{3}-S(0[1-9]|10)$'),
  category_id text not null references public.bbi_expansion_categories(category_id),
  ordinal smallint not null check (ordinal between 1 and 10),
  name text not null,
  slug text not null,
  unique (category_id, ordinal),
  unique (category_id, slug),
  check (left(subcategory_id, 4) = category_id)
);
create index bbi_expansion_subcategories_category_idx
  on public.bbi_expansion_subcategories(category_id, ordinal);
alter table public.bbi_expansion_categories enable row level security;
alter table public.bbi_expansion_subcategories enable row level security;
revoke all on public.bbi_expansion_categories, public.bbi_expansion_subcategories
  from anon, authenticated;
grant select on public.bbi_expansion_categories, public.bbi_expansion_subcategories
  to anon, authenticated, service_role;
create policy "Read expansion categories" on public.bbi_expansion_categories
  for select to anon, authenticated using (true);
create policy "Read expansion subcategories" on public.bbi_expansion_subcategories
  for select to anon, authenticated using (true);

insert into public.bbi_expansion_categories (category_id, name, slug)
select category_id, name, slug from jsonb_to_recordset($bbi_categories$
"""
sql += json.dumps(categories, ensure_ascii=False, separators=(",", ":"))
sql += """
$bbi_categories$::jsonb) as x(category_id text, name text, slug text);
insert into public.bbi_expansion_subcategories
  (subcategory_id, category_id, ordinal, name, slug)
select subcategory_id, category_id, ordinal, name, slug
from jsonb_to_recordset($bbi_subcategories$
"""
sql += json.dumps(subcategories, ensure_ascii=False, separators=(",", ":"))
sql += """
$bbi_subcategories$::jsonb) as x(
  subcategory_id text, category_id text, ordinal smallint, name text, slug text
);
"""
target = ROOT / "supabase/expansion/001_approved_taxonomy.sql"
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(sql)
print(f"{target}: {len(categories)} categories, {len(subcategories)} subcategories")
