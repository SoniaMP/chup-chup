-- Compartir una receta: un enlace con testigo que lleva a una página de solo lectura.
--
-- No hay política de lectura anónima sobre `recipes`: la página la sirve una Edge Function con
-- permisos de servidor que comprueba el testigo y decide qué campos salen. Aquí solo se guarda
-- quién comparte qué y hasta cuándo, un enlace por receta. Volver a compartir le da otros treinta
-- días al mismo enlace, y dejar de compartir borra la fila, con lo que el enlace muere para todo
-- el mundo a la vez.

create extension if not exists pgcrypto with schema extensions;

create table recipe_shares (
  recipe_id uuid primary key references recipes (id) on delete cascade,
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- El testigo lo pone Postgres, nunca el cliente: 24 bytes al azar, en hexadecimal.
  token text not null unique default encode(extensions.gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
);

alter table recipe_shares enable row level security;

create policy "Owners read their shares"
  on recipe_shares for select to authenticated
  using (owner_id = auth.uid());

create policy "Owners share their own recipes"
  on recipe_shares for insert to authenticated
  with check (
    owner_id = auth.uid()
    and exists (select 1 from recipes where recipes.id = recipe_id and recipes.owner_id = auth.uid())
  );

create policy "Owners renew their shares"
  on recipe_shares for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Owners stop sharing"
  on recipe_shares for delete to authenticated
  using (owner_id = auth.uid());
