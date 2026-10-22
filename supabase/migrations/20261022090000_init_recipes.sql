-- Recetario: initial schema.
--
-- Every table carries an owner_id and has row level security enabled, so phase 2
-- (sharing) only needs extra policies, never a data migration. See docs/SPEC.md.

create table recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  locale text not null,
  servings integer,
  prep_min integer,
  cook_min integer,
  ingredients jsonb not null,
  steps jsonb not null,
  raw_input text not null,
  notes text,
  photo_original text,
  photo_enhanced text,
  photo_active text not null default 'original' check (photo_active in ('original', 'enhanced')),
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Recetarios: flat folders that hold cookbooks.
create table collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  position text not null
);

-- Libros: playlists of recipes, each in zero or one collection.
create table cookbooks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  collection_id uuid references collections (id) on delete set null,
  title text not null,
  position text not null,
  is_system boolean not null default false
);

-- Deleting a cookbook never deletes recipes, and vice versa: only the link goes.
create table cookbook_recipes (
  cookbook_id uuid not null references cookbooks (id) on delete cascade,
  recipe_id uuid not null references recipes (id) on delete cascade,
  position text not null,
  primary key (cookbook_id, recipe_id)
);

create index recipes_owner_created_idx on recipes (owner_id, created_at desc);
create index recipes_owner_favorite_idx on recipes (owner_id) where is_favorite;
create index collections_owner_idx on collections (owner_id, position);
create index cookbooks_owner_idx on cookbooks (owner_id, position);
create index cookbooks_collection_idx on cookbooks (collection_id, position);
create index cookbook_recipes_recipe_idx on cookbook_recipes (recipe_id);

alter table recipes enable row level security;
alter table collections enable row level security;
alter table cookbooks enable row level security;
alter table cookbook_recipes enable row level security;

create policy "Owners read and write their recipes"
  on recipes for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Owners read and write their collections"
  on collections for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Owners read and write their cookbooks"
  on cookbooks for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- cookbook_recipes has no owner_id of its own: it inherits the cookbook's owner.
create policy "Owners read and write the recipes in their cookbooks"
  on cookbook_recipes for all to authenticated
  using (
    exists (
      select 1 from cookbooks
      where cookbooks.id = cookbook_recipes.cookbook_id
        and cookbooks.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from cookbooks
      where cookbooks.id = cookbook_recipes.cookbook_id
        and cookbooks.owner_id = auth.uid()
    )
  );
