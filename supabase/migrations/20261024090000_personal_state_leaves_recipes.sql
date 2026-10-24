-- Personal state leaves recipes.
--
-- A recipe row is content, and content has one owner. What each cook does with a recipe -- her
-- note, her star, the cover she picked -- belongs to her, not to the recipe. The day a recipe can
-- sit in someone else's kitchen, those three columns would collide: one cook's note would
-- overwrite another's. See "Recetas ajenas: acceso, no propiedad" in docs/SPEC.md.
--
-- From here on, saved_recipes is the definition of "my kitchen": what you have is what you saved,
-- whether or not you wrote it. While there is a single user, the owner and the one who saved it
-- are the same person, so the move is a straight copy and nothing is lost.

create table saved_recipes (
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  recipe_id uuid not null references recipes (id) on delete cascade,
  notes text,
  is_favorite boolean not null default false,
  library_image text,
  saved_at timestamptz not null default now(),
  primary key (owner_id, recipe_id)
);

-- The kitchen is read whole and ordered by when it was saved; favourites are a filter on top.
create index saved_recipes_owner_saved_idx on saved_recipes (owner_id, saved_at desc);
create index saved_recipes_owner_favorite_idx on saved_recipes (owner_id) where is_favorite;
create index saved_recipes_recipe_idx on saved_recipes (recipe_id);

alter table saved_recipes enable row level security;

create policy "Owners read and write what they saved"
  on saved_recipes for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

insert into saved_recipes (owner_id, recipe_id, notes, is_favorite, library_image, saved_at)
select owner_id, id, notes, is_favorite, library_image, created_at
from recipes;

-- Dropping these also drops recipes_owner_favorite_idx, which indexed is_favorite.
alter table recipes
  drop column notes,
  drop column is_favorite,
  drop column library_image;
