-- El catálogo de imágenes del proyecto.
--
-- Son fotos y texturas que viajan con la app para que cualquiera pueda ponerle cara a sus libros
-- y a sus recetas sin tener una foto propia. Las cura quien desarrolla, no las usuarias: el
-- bucket es público para leer y nadie tiene permiso para escribir, así que subirlas se hace desde
-- el panel. Su procedencia (origen, licencia, prompt) vive en `library/manifest.json`.

insert into storage.buckets (id, name, public)
values ('library-images', 'library-images', true)
on conflict (id) do nothing;

-- Lo que se guarda es el identificador de la imagen, nunca una copia: si dos cocineras eligen la
-- misma, las dos apuntan al mismo fichero, y mejorar la imagen las mejora a las dos.
alter table cookbooks add column library_image text;
alter table recipes add column library_image text;
