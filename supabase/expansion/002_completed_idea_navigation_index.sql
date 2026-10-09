-- Supports grouped expansion category counts and scoped subcategory listings.
-- Index-only addition: it does not update any idea row or change a URL.
create index if not exists idx_ideas_completed_category_subcategory_trend
  on public.ideas (category_slug, subcategory_slug, trend_score desc)
  where status = 'completed';
