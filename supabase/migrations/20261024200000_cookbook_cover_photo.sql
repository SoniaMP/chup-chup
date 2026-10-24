-- La portada de un libro puede ser una foto de la usuaria, no solo una imagen del catálogo.
--
-- O una u otra, nunca las dos: un libro no tiene contenido que fotografiar, así que su portada es
-- solo identidad y no hay nada que decidir entre dos. La app vacía una al poner la otra; aquí no
-- se fuerza, porque arreglar un libro con las dos puestas no vale una restricción que complique
-- cada escritura.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cookbook-covers',
  'cookbook-covers',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- Las rutas son "<owner_id>/<cookbook_id>.jpg", así que la primera carpeta de cada objeto es la
-- dueña, igual que en las fotos de receta.
create policy "Owners read their cookbook covers"
  on storage.objects for select to authenticated
  using (bucket_id = 'cookbook-covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owners upload their cookbook covers"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'cookbook-covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owners replace their cookbook covers"
  on storage.objects for update to authenticated
  using (bucket_id = 'cookbook-covers' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'cookbook-covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owners delete their cookbook covers"
  on storage.objects for delete to authenticated
  using (bucket_id = 'cookbook-covers' and (storage.foldername(name))[1] = auth.uid()::text);

alter table cookbooks add column cover_photo text;
