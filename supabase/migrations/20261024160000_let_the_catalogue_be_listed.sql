-- The catalogue selector was always empty: a public bucket is not a listable bucket.
--
-- "Public" only means the objects can be downloaded by url without a token. Listing goes
-- through storage.objects, which has row level security on, and there was no select policy
-- for this bucket, so every app got back an empty list. There is still no insert, update or
-- delete policy: the catalogue is curated with the cli, never from the app.

create policy "Anyone lists the library catalogue"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'library-images');
