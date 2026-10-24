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

## Qué imágenes hacen falta

Esto es el encargo, para poder hacerlas de una sentada (en otra sesión, con un generador de
imágenes o buscando en bancos de fotos). Hasta que haya alguna en el bucket, el selector de
portada sale vacío.

**Doce imágenes para empezar: ocho de textura para libros y cuatro de plato para recetas.** Doce
llenan la rejilla del selector sin que haya que elegir entre cuarenta, y son pocas para repasarlas
a mano una por una.

Requisitos que no se negocian, porque la app las pinta así:

- **Cuadradas.** El selector y las tarjetas recortan al centro; si el motivo está descentrado, se
  pierde. Pide 1:1 desde el principio.
- **Mínimo 1200 × 1200 px.** Es el tamaño grande que guarda `npm run covers`.
- **El centro, tranquilo.** Encima de la portada va el título en blanco: una imagen con mucho
  detalle o mucho contraste en el medio se come el texto.
- **Luz cálida, nada de blanco clínico.** La app es crema (`#FDF6EA`) y terracota (`#CF542C`): una
  foto azulada o de fondo blanco puro canta al lado de todo lo demás.
- **Nada de caras, marcas, logotipos ni envases**, ni texto dentro de la imagen.

### Las ocho de libro: textura, no plato

Un libro agrupa cosas distintas ("Cenas rápidas", "De mi madre"), así que su portada no puede ser
un plato concreto. Lo que funciona: superficies y materiales de cocina, de cerca y desenfocados.

Ocho motivos, uno por imagen: **mármol crema · madera de nogal · lino arrugado · barro cocido ·
mortero de piedra · harina sobre mesa oscura · azulejo artesanal verde oliva · cobre viejo.**

Prompt base, cambiando solo el motivo:

> Close-up texture of <motivo>, soft warm diffused daylight from the left, shallow depth of
> field, centered composition with a calm empty center, muted terracotta and cream palette,
> no objects, no text, no people, square 1:1, photographic, 1200x1200.

### Las cuatro de receta: plato, de cerca

Para recetas sí es comida, pero genérica, que valga para muchas: **un guiso en cazuela de barro ·
verduras asadas en bandeja · masa y pan recién hecho · ensalada de hoja verde.**

> Overhead close-up of <plato> on a rustic ceramic plate, warm natural window light, homemade and
> slightly imperfect, cream and terracotta tones, dark wood table, no hands, no faces, no
> branding, no text, square 1:1, photographic, 1200x1200.

### Y después

1. Guarda los doce originales en una carpeta, con el **nombre que quieres que tengan de
   identificador**: en inglés, sin tildes y con guiones (`cream-marble.jpg`, `clay-pot-stew.jpg`).
2. `npm run covers -- <esa carpeta>`
3. Sube `library/ready/` al bucket, como dice arriba. **El bucket es la lista**: no hay que
   registrar nada en el código, aparecen solas en el selector, por orden de nombre de fichero.
4. Rellena `manifest.json` con el origen de cada una. Si son generadas, **pega el prompt exacto**:
   es justo para lo que existe el manifiesto.

Si vienen de un banco de fotos en vez de un generador, que sean de licencia libre para uso
comercial (Unsplash, Pexels) y que quede escrito en `manifest.json` el autor y el enlace.
