# Catálogo de imágenes

Las imágenes que cualquier usuaria puede poner como portada de un libro o de una receta. Las cura
quien desarrolla; nadie las sube desde la app.

## Cómo se añade una imagen

1. Guarda los originales en una carpeta cualquiera (sirven JPG, PNG, HEIC o WebP) y pásalos por:

   ```
   npm run covers -- ~/Desktop/mis-imagenes
   ```

   Eso las deja cuadradas y en dos tamaños dentro de `library/ready/`: `<id>.jpg` (1200 px) para
   la pantalla del libro y `<id>-small.jpg` (400 px) para las tarjetas de las listas. El nombre
   del fichero original se convierte en el identificador, así que llámalos en inglés y sin
   tildes: `roasted-lemons.jpg`, no `Limones Asados.JPG`.

   Va en JPEG y no en WebP porque `sips`, que es lo que trae macOS, no escribe WebP. El código
   acepta los dos, así que si algún día instalas `cwebp`, conviven sin migrar nada.

2. Sube el contenido de `library/ready/` al bucket **`library-images`** desde el panel de Supabase
   (Storage → library-images → Upload files). El bucket es público para leer y nadie tiene permiso
   de escritura: por eso se sube desde ahí.

3. Añade su entrada en `manifest.json`, con el origen, la licencia y —si es generada— el prompt.

## Reglas de lo que entra

- Nada de caras reconocibles: harían falta permisos de imagen.
- Nada de marcas, logotipos ni envases reconocibles en el plato.
- Texturas y fondos para los libros, que agrupan cosas distintas; fotos de un plato concreto para
  las recetas.
- Si es generada con IA: se puede usar y vender, pero no se puede reclamar su autoría. Para el
  logotipo de la app eso importa; para una portada decorativa, no.

## Por qué el manifiesto

La app no lo lee. Está para que, el día que alguien pregunte de dónde viene una imagen que se
distribuye con el producto, la respuesta no sea "creo que la hizo una IA".
