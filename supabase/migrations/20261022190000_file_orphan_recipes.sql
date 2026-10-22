-- Every recipe belongs to at least one cookbook from now on, so the ones saved before that rule
-- existed get filed into their owner's system cookbook.

insert into cookbooks (owner_id, title, position, is_system)
select distinct owner_id, 'Mis últimas incorporaciones', 'a', true
from recipes
where not exists (
  select 1 from cookbooks
  where cookbooks.owner_id = recipes.owner_id and cookbooks.is_system
);

-- Order keys are plain lowercase letters, the same alphabet the app uses: a, b, … y, za, zb, …
insert into cookbook_recipes (cookbook_id, recipe_id, position)
select
  system_cookbook.id,
  orphan.id,
  repeat('z', ((orphan.rank - 1) / 25)::int) || chr((97 + ((orphan.rank - 1) % 25))::int)
from (
  select
    recipes.id,
    recipes.owner_id,
    row_number() over (partition by recipes.owner_id order by recipes.created_at) as rank
  from recipes
  where not exists (
    select 1 from cookbook_recipes where cookbook_recipes.recipe_id = recipes.id
  )
) as orphan
join cookbooks as system_cookbook
  on system_cookbook.owner_id = orphan.owner_id and system_cookbook.is_system;
