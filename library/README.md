# Catálogo de imágenes

Las imágenes que cualquier usuaria puede poner como portada de un libro o de una receta. Las cura
quien desarrolla; nadie las sube desde la app.

## Cómo se añade una imagen

1. Guarda los originales en `library/originals/` (sirven JPG, PNG, HEIC o WebP) y pásalos por:

   ```
   npm run covers -- library/originals
   ```

   Eso las deja cuadradas y en dos tamaños dentro de `library/ready/`: `<id>.jpg` (1200 px) para
   la pantalla del libro y `<id>-small.jpg` (400 px) para las tarjetas de las listas. El nombre
   del fichero original se convierte en el identificador, así que llámalos en inglés y sin
   tildes: `roasted-lemons.jpg`, no `Limones Asados.JPG`.

   Va en JPEG y no en WebP porque `sips`, que es lo que trae macOS, no escribe WebP. El código
   acepta los dos, así que si algún día instalas `cwebp`, conviven sin migrar nada.

2. Sube el contenido de `library/ready/` al bucket **`library-images`**, fichero a fichero y a la
   raíz:

   ```
   for f in library/ready/*.jpg; do
     npx supabase storage cp "$f" "ss:///library-images/$(basename "$f")" --experimental
   done
   ```

   No sirve `cp -r library/ready ss:///library-images`: el CLI siempre cuelga la carpeta de
   destino, y las imágenes acaban en `library-images/ready/`, donde `supabaseLibraryImageStore`
   no las ve porque solo lista la raíz. Para comprobarlo, **la barra final importa**:
   `npx supabase storage ls ss:///library-images/ --experimental` lista el contenido;
   sin ella lista el bucket. También se puede subir a mano desde el panel
   (Storage → library-images → Upload files).

   El bucket es público para leer y nadie tiene permiso de escritura, así que desde la app no
   sube nadie: el CLI puede porque entra por la API de gestión del proyecto, no como usuaria.

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

Aquí quedan los motivos y las reglas. Los doce prompts ya escritos, uno por imagen y con el
nombre de fichero de cada una, están en [`PROMPTS.md`](PROMPTS.md): es lo que se pega en el
generador.

**Doce motivos: ocho para libros y cuatro de plato para recetas**, cada uno en los cuatro fondos.
Cuarenta y ocho en total, de las que las doce primeras ya están hechas.

Eso contradice la idea original de "doce llenan la rejilla sin que haya que elegir entre cuarenta",
y conviene saberlo: el selector pinta una rejilla plana sin filtro, así que con cuarenta y ocho hay
que hacer scroll. Se eligió aun así para que cada cocinera pueda quedarse con el color que le
guste. El nombre del fichero lleva el fondo delante (`olive-jars.jpg`) para que al menos salgan
agrupadas por color.

Requisitos que no se negocian, porque la app las pinta así:

- **Cuadradas.** El selector y las tarjetas recortan al centro; si el motivo está descentrado, se
  pierde. Pide 1:1 desde el principio.
- **1200 × 1200 px.** Es el tamaño grande que guarda `npm run covers`. Si un generador solo da
  1024, vale: el script escala lo que le llegue y la app pinta las portadas a 64 px en las listas
  y a 88 px en el selector.
- **Que se entienda encogida.** A 64 px lo que distingue una portada de otra es el color y la
  silueta, no el detalle: un motivo y nada más, y de trazo con cuerpo.
- **A sangre, sin marco.** El color tiene que llegar a los cuatro bordes. Un dibujo montado sobre
  una hoja con sombra trae el margen puesto, y ese margen acaba en la app.
- **Colores de la paleta**, que es crema (`#FDF6EA`) y terracota (`#CF542C`). Nada azulado ni de
  blanco clínico.
- **Que no sean color crema todas.** Una portada clara y sin contraste, encogida, es un cuadrado
  del mismo color que la pantalla: parece un hueco en vez de una portada.
- **Nada de caras, marcas, logotipos ni envases**, ni texto dentro de la imagen.

### Todas son dibujo a línea

**Ni fotos ni texturas.** Se probaron las dos —un mármol fotográfico y un patrón de madera— y
ninguna pertenecía a esta app: al lado del logotipo parecían de otro producto, y encogidas no eran
más que una mancha. Todas son un trazo de tinta continuo, dos colores y nada más.

Lo que cambia entre ellas no es el estilo, es **sobre qué están dibujadas**: cuatro fondos —crema,
terracota, oliva y marrón—, repartidos por luminancia para que no haya dos que pesen igual en la
rejilla. Todos los dibujos sobre crema serían, encogidos, cuadrados del color de la pantalla.

### Las ocho de libro: utensilios y despensa

Un libro agrupa cosas distintas ("Cenas rápidas", "De mi madre"), así que su portada no puede ser
un plato concreto: **cazuela con tapa · mortero con su mano · limones con una ramita de hierbas ·
varillas y cuchara de madera · sartén · rodillo sobre la masa · tarros de despensa · ajos y
cebolla.**

### Las cuatro de receta: platos

Para recetas sí es comida, pero genérica, que valga para muchas: **cuenco de guiso · fuente de
verduras asadas · hogaza con una rebanada cortada · ensaladera de hoja verde.** Dibujadas
igual que las otras ocho: la foto de verdad es la que pone la cocinera, y manda sobre la del
catálogo.

### Y después

1. Guarda los originales en `library/originals/` con el nombre que les toca, que es
   **`<fondo>-<motivo>.jpg`** (`cream-pot.jpg`, `olive-salad-bowl.jpg`): en inglés, sin tildes y
   con guiones. Esa carpeta está en `.gitignore`.
2. `npm run covers -- library/originals`
3. Sube `library/ready/` al bucket, como dice arriba. **El bucket es la lista**: no hay que
   registrar nada en el código, aparecen solas en el selector, por orden de nombre de fichero.
4. Rellena `manifest.json` con el origen de cada una. Si son generadas, **pega el prompt exacto**:
   es justo para lo que existe el manifiesto.

Si vienen de un banco de fotos en vez de un generador, que sean de licencia libre para uso
comercial (Unsplash, Pexels) y que quede escrito en `manifest.json` el autor y el enlace.
