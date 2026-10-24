# Los doce prompts del catálogo

El encargo de [`README.md`](README.md) convertido en doce prompts concretos, uno por imagen, para
generarlas de una sentada. Esto es lo que se pega en el generador.

Están en inglés porque los generadores entienden mejor el inglés; el nombre de cada apartado es el
**nombre que tiene que llevar el fichero**, que es el identificador que acaba en el bucket.

**Las doce son dibujo a línea continua, en la línea del logotipo.** Ni fotos ni texturas: se
probaron las dos y ninguna pertenecía a esta app. Un trazo de tinta, dos colores y nada más.

## Los cuatro fondos

Doce dibujos sobre fondo crema serían, encogidos, doce cuadrados del color de la pantalla: el
selector parecería vacío. Así que el dibujo es siempre el mismo y lo que cambia es **sobre qué
está dibujado**.

El oliva sale de la paleta de la app (`src/theme/palette.ts`). Los otros dos no: el `primary`
(`#CF542C`) sale demasiado vivo de portada y compite con los botones, así que el terracota del
catálogo es un ladrillo más apagado, elegido sobre la sartén generada; y el marrón se eligió claro
a propósito, para que no pese lo mismo que el terracota.

| Fondo | Hex | Tinta |
| --- | --- | --- |
| Crema | `#FDF6EA` | terracota `#CF542C` |
| Terracota | `#A54228` | crema `#FDF6EA` |
| Oliva | `#657B3D` | crema `#FDF6EA` |
| Marrón | `#B38353` | crema `#FDF6EA`, gruesa |

Tres imágenes de cada uno. Los cuatro están repartidos **por luminancia**, que es lo que decide
cuánto pesa cada portada en la rejilla: crema 240, marrón 138, oliva 109, terracota 85. Dos fondos
igual de oscuros se confunden de un vistazo aunque sean de otro color — pasó con el marrón y el
terracota, que salieron a 84 y 85, y por eso se aclaró el marrón.

El precio de aclararlo: **el marrón es el fondo con menos contraste de los tres de color.** La
tinta crema le saca 102 puntos de luminancia, contra 131 en el oliva y 155 en el terracota. Por eso
los tres prompts de marrón, y solo esos, piden **línea gruesa** en vez de media. A tamaño completo
se notan un pelo más rotundos; encogidos es justo lo que les hace falta.

El marrón es además el fondo que menos se repite: el mismo prompt dio `#C89F7A` una vez y
`#B38353` la siguiente, 27 puntos de luminancia de diferencia. La buena es la segunda, y es la
referencia con la que hay que comparar las otras dos. Si sale la clara, se repite.

Si prefieres las doce en crema, es cambiar esa frase en cada prompt — pero entonces se distinguen
por la silueta y nada más, y a 64 px eso es poco.

## Antes de generar

- **Cuadradas, 1:1**, siempre. Si el generador pide una medida, el lado más grande que dé.
- **A sangre, sin marco.** Los generadores tienden a montar el dibujo sobre una hoja de papel con
  sombra, dentro de un fondo gris claro. Ese margen viaja al bucket y sale en la app. El fondo de
  color tiene que llegar a los cuatro bordes.
- **El motivo, grande.** Que llene en torno al 85 % del cuadro. Pequeño y centrado con mucho aire
  se pierde: a 64 px el dibujo se queda en nada. Pide el 85 % aunque salga al 70 %: los
  generadores se quedan cortos, y pedir el 70 % acaba en la mitad del cuadro.
- **Los colores no salen exactos**, y con el crema da igual: las tres salieron en `#F8F1DD`
  clavado. Pero **con los fondos saturados el generador no se repite**: el mismo prompt dio
  `#C14C21` en el batidor y `#A54228` en la sartén. Se eligió el de la sartén, y por eso cada
  fondo va descrito con palabras además del hex —«ladrillo cálido y apagado, color de teja vieja,
  no naranja vivo»—: el hex lo ignoran, las palabras no.
- **Compara cada fondo con el de su pareja** antes de darla por buena. Tres imágenes del mismo
  color que no casan entre sí se ven de lejos en la rejilla.
- **Los fondos de color se leen mucho mejor encogidos** que el crema: crema sobre terracota tiene
  contraste de verdad, y terracota sobre crema no. Las tres de crema son las flojas del grupo.
- **Trazo de peso medio**, no de un pelo. El logotipo aguanta encogido porque su línea es gruesa.
- **Nada de detalle fino repetido.** Es el fallo que no se ve hasta que encoges: una ramita de
  romero, los alambres de un batidor o veinte hojas de ensalada se empastan a 64 px y dejan una
  mancha peluda. Pocas formas y grandes. Por eso los prompts de abajo dicen cuántas: «cinco o seis
  alambres», «unas pocas hojas grandes».
- **Si solo da 1024 × 1024, vale.** `npm run covers` escala lo que le llegue, y la app pinta las
  portadas a 64 px en las listas y a 88 px en el selector.
- **Nada de caras, manos, marcas, logotipos ni texto** dentro de la imagen.

Si el generador acepta parámetros al final, en Midjourney y parecidos: `--ar 1:1 --style raw`.

## Las ocho de libro: utensilios y despensa

Un libro agrupa cosas distintas ("Cenas rápidas", "De mi madre"), así que su portada no puede ser
un plato concreto: son utensilios y despensa, que valen para cualquier cosa.

### drawn-pot.jpg — fondo crema

> Minimal hand-drawn line illustration of a lidded cooking pot with two handles and a wisp of
> steam, drawn in a single continuous terracotta ink line (#CF542C) on a flat cream background
> (#FDF6EA). The cream background fills the entire square frame edge to edge: no paper sheet, no
> mounted print, no drop shadow, no outer margin, no frame, no background scene. Confident
> medium-weight ink line, even throughout, clean continuous contours, no sketchy or scratchy
> strokes, no hatching, no shading, no fill, no second color. The motif is centered and large,
> filling about 85% of the frame, flat 2D, no perspective, no text, square 1:1.

### drawn-mortar.jpg — fondo crema

> Minimal hand-drawn line illustration of a mortar with its pestle resting in it, drawn in a single
> continuous terracotta ink line (#CF542C) on a flat cream background (#FDF6EA). The cream
> background fills the entire square frame edge to edge: no paper sheet, no mounted print, no drop
> shadow, no outer margin, no frame, no background scene. Confident medium-weight ink line, even
> throughout, clean continuous contours, no sketchy or scratchy strokes, no hatching, no shading,
> no fill, no second color. The motif is centered and large, filling about 85% of the frame, flat
> 2D, no perspective, no text, square 1:1.

### drawn-lemons-herbs.jpg — fondo crema

> Minimal hand-drawn line illustration of two lemons and a small sprig of herbs with five or six
> large simple leaves, no fine repeated detail, drawn in a single continuous terracotta ink line
> (#CF542C) on a flat cream background (#FDF6EA). The cream background fills the entire square
> frame edge to edge: no paper sheet, no mounted print, no drop shadow, no outer margin, no frame,
> no background scene. Confident medium-weight ink line, even throughout, clean continuous
> contours, no sketchy or scratchy strokes, no hatching, no shading, no fill, no second color. The
> motif is centered and large, filling about 85% of the frame, flat 2D, no perspective, no text,
> square 1:1.

### drawn-whisk-spoon.jpg — fondo terracota

> Minimal hand-drawn line illustration of a balloon whisk with only five or six widely spaced
> wires, crossed with a wooden spoon, no fine repeated detail, drawn in a single continuous cream
> ink line (#FDF6EA) on a flat deep warm brick terracotta background (#A54228), the colour of a
> weathered clay roof tile, muted rather than bright, not a vivid orange and not maroon. The
> terracotta background fills the entire square frame edge to edge: no paper sheet, no mounted
> print, no drop shadow, no outer margin, no frame, no background scene. Confident medium-weight
> ink line, even throughout, clean continuous contours, no sketchy or scratchy strokes, no
> hatching, no shading, no fill, no second color. The motif is centered and large, filling about
> 85% of the frame, flat 2D, no perspective, no text, square 1:1.

### drawn-pan.jpg — fondo terracota

> Minimal hand-drawn line illustration of a frying pan with a long handle, seen from slightly
> above, drawn in a single continuous cream ink line (#FDF6EA) on a flat deep warm brick terracotta
> background (#A54228), the colour of a weathered clay roof tile, muted rather than bright, not a
> vivid orange and not maroon. The terracotta background fills the entire square frame edge to
> edge: no paper sheet, no mounted print, no drop shadow, no outer margin, no frame, no background
> scene. Confident medium-weight ink line, even throughout, clean continuous contours, no sketchy
> or scratchy strokes, no hatching, no shading, no fill, no second color. The motif is centered and
> large, filling about 85% of the frame, flat 2D, no perspective, no text, square 1:1.

### drawn-rolling-pin.jpg — fondo oliva

> Minimal hand-drawn line illustration of a rolling pin lying on a round of dough, drawn in a
> single continuous cream ink line (#FDF6EA) on a flat medium olive green background (#657B3D), the
> colour of a green olive, not a dark forest green and not khaki. The olive background fills the
> entire square frame edge to edge: no paper sheet, no mounted print, no drop shadow, no outer
> margin, no frame, no background scene. Confident medium-weight ink line, even throughout, clean
> continuous contours, no sketchy or scratchy strokes, no hatching, no shading, no fill, no second
> color. The motif is centered and large, filling about 85% of the frame, flat 2D, no perspective,
> no text, square 1:1.

### drawn-jars.jpg — fondo oliva

> Minimal hand-drawn line illustration of three pantry jars of different heights with their lids
> on, drawn in a single continuous cream ink line (#FDF6EA) on a flat medium olive green background
> (#657B3D), the colour of a green olive, not a dark forest green and not khaki. The olive
> background fills the entire square frame edge to edge: no paper sheet, no mounted print, no drop
> shadow, no outer margin, no frame, no background scene. Confident medium-weight ink line, even
> throughout, clean continuous contours, no sketchy or scratchy strokes, no hatching, no shading,
> no fill, no second color. The motifs are centered and large, filling about 85% of the frame, flat
> 2D, no perspective, no text, no labels, square 1:1.

### drawn-garlic-onion.jpg — fondo marrón

> Minimal hand-drawn line illustration of a head of garlic and an onion side by side, drawn in a
> single continuous cream ink line (#FDF6EA) on a flat light warm caffè-latte brown background
> (#A98057), milky and soft, light but still clearly darker than the cream ink, not a dark
> chocolate brown, not grey and not beige. The brown background fills the entire square frame edge
> to edge: no paper sheet, no mounted print, no drop shadow, no outer margin, no frame, no
> background scene. Confident bold ink line, noticeably thicker than a fine liner so it holds up
> against the light background, even throughout, clean continuous contours, no sketchy or scratchy
> strokes, no hatching, no shading, no fill, no second color. The motifs are centered and large,
> filling about 85% of the frame, flat 2D, no perspective, no text, square 1:1.

## Las cuatro de receta: platos

Para recetas sí es comida, pero genérica, que valga para muchas. Mismo trazo que las de libro: una
foto aquí desentonaría con las otras ocho, y además la foto de verdad es la que pone la cocinera,
que manda sobre la del catálogo.

### drawn-stew-bowl.jpg — fondo terracota

> Minimal hand-drawn line illustration of a deep bowl with a spoon resting in it, the stew
> suggested by one simple wavy line across the surface and two small curls of steam, no visible
> chunks, no fine repeated detail, drawn in a single continuous cream ink line (#FDF6EA) on a flat
> deep warm brick terracotta background (#A54228), the colour of a weathered clay roof tile, muted
> rather than bright, not a vivid orange and not maroon. The terracotta background fills the entire
> square frame edge to edge: no paper sheet, no mounted print, no drop shadow, no outer margin, no
> frame, no background scene. Confident medium-weight ink line, even throughout, clean continuous
> contours, no sketchy or scratchy strokes, no hatching, no shading, no fill, no second color,
> outlines only with nothing painted in. The motif is centered and large, filling about 85% of the
> frame, flat 2D, no perspective, no text, square 1:1.

### drawn-salad-bowl.jpg — fondo oliva

> Minimal hand-drawn line illustration of a wide bowl holding a few large simple salad leaves, no
> fine repeated detail, drawn in a single continuous cream ink line (#FDF6EA) on a flat medium
> olive green background (#657B3D), the colour of a green olive, not a dark forest green and not
> khaki. The olive background fills the entire square frame edge to edge: no paper sheet, no
> mounted print, no drop shadow, no outer margin, no frame, no background scene. Confident
> medium-weight ink line, even throughout, clean continuous contours, no sketchy or scratchy
> strokes, no hatching, no shading, no fill, no second color. The motif is centered and large,
> filling about 85% of the frame, flat 2D, no perspective, no text, square 1:1.

### drawn-roast-tray.jpg — fondo marrón

> Minimal hand-drawn line illustration of a baking tray holding five or six large simple pieces of
> roasted vegetable, seen from above, no fine repeated detail, drawn in a single continuous cream
> ink line (#FDF6EA) on a flat light warm caffè-latte brown background (#A98057), milky and soft,
> light but still clearly darker than the cream ink, not a dark chocolate brown, not grey and not
> beige. The brown background fills the entire square frame edge to edge: no paper sheet, no
> mounted print, no drop shadow, no outer margin, no frame, no background scene. Confident bold ink
> line, noticeably thicker than a fine liner so it holds up against the light background, even
> throughout, clean continuous contours, no sketchy or scratchy strokes, no hatching, no shading,
> no fill, no second color. The motif is centered and large, filling about 85% of the frame, flat
> 2D, no perspective, no text, square 1:1.

### drawn-bread-loaf.jpg — fondo marrón

> Minimal hand-drawn line illustration of a round loaf of bread with one slice cut from it, drawn
> in a single continuous cream ink line (#FDF6EA) on a flat light warm caffè-latte brown background
> (#A98057), milky and soft, light but still clearly darker than the cream ink, not a dark
> chocolate brown, not grey and not beige. The brown background fills the entire square frame edge
> to edge: no paper sheet, no mounted print, no drop shadow, no outer margin, no frame, no
> background scene. Confident bold ink line, noticeably thicker than a fine liner so it holds up
> against the light background, even throughout, clean continuous contours, no sketchy or scratchy
> strokes, no hatching, no shading, no fill, no second color. The motif is centered and large,
> filling about 85% of the frame, flat 2D, no perspective, no text, square 1:1.

## Si el generador acepta negativos

La misma casilla para las doce:

> paper sheet, mounted print, poster mockup, drop shadow, outer margin, white border, frame,
> vignette, sketch, scratchy strokes, pencil texture, crosshatch, hatching, shading, gradient,
> watercolor, painted fill, multiple colors, 3D, photograph, text, watermark

## Repasar cada una antes de aceptarla

Una por una, y se vuelve a generar la que falle:

- **¿Llega el color a los cuatro bordes?** Si hay un margen claro, una hoja o una sombra, no vale:
  ese marco acaba en la app.
- ¿El dibujo llena el cuadro, o se ha quedado pequeño en medio?
- ¿Se sostiene el trazo encogida a 64 px, o se desvanece? Esto no se juzga a ojo mirando la imagen
  grande: hay que encogerla.
- ¿Son dos colores, o se han colado un relleno, una sombra o un tercer tono?
- ¿Hay cara, mano, marca o texto? Fuera.
- Puesta al lado del logotipo, ¿parecen del mismo sitio?

Para verla al tamaño al que se pinta, **sobre una copia** —`sips` escribe encima del fichero—:

```
cp imagen.jpg prueba.jpg && sips -Z 64 prueba.jpg && sips -Z 384 prueba.jpg
```

La encoge a 64 px y la vuelve a ampliar: lo que se vea ahí es lo que se ve en la app.

## Si sale mal, qué palabra cambiar

Las formas de fallar que ya hemos visto, y lo que las arregla:

- **Sale enmarcado**, sobre una hoja con sombra y fondo gris. La más común de este estilo. Insiste
  en `fills the entire square frame edge to edge` y mete `paper sheet, mounted print, poster
  mockup, drop shadow, white border` en los negativos.
- **El dibujo sale pequeño** con mucho aire alrededor. `filling about 85% of the frame`.
- **La línea sale demasiado fina** y a 64 px desaparece. `confident medium-weight ink line`, y si
  hace falta `thicker line`.
- **El motivo se empasta al encoger** aunque de grande esté precioso: son demasiadas formas
  pequeñas. Di cuántas quieres —`only five or six`, `a few large simple`— y añade `no fine
  repeated detail`.
- **El fondo sale de otro tono** que el de su pareja del mismo color. El hex no basta: describe el
  color con palabras y di de qué se tiene que diferenciar (`not a dark brick red and not maroon`).
- **Sale a lápiz o con rayado.** Insiste en `single continuous ink line`, `no hatching, no
  shading`, y añade `vector-like` si sigue saliendo peludo.
- **Salen más de dos colores.** Cualquier palabra que nombre un contorno o un realce acaba en tres
  tonos. Di `no second color` y `no fill`.
- **Una forma sale pintada por dentro.** Pasó con el cuenco de guiso: un tropezón relleno de un
  naranja distinto, el 5 % de la imagen. Cuesta verlo en grande y canta encogido. Añade
  `outlines only with nothing painted in`.
- **El contenido de un recipiente se empasta.** No lo dibujes: súgerelo. La cazuela funciona
  porque tiene vapor y nada dentro; el guiso falló por pintar diez tropezones. `suggested by one
  simple wavy line`, `no visible chunks`.

## Después de los doce: la segunda tanda

Cada motivo en sus dos versiones, **clara y oscura**, para que cada cocinera elija la que le guste:
el mismo dibujo con tinta terracota sobre crema y con tinta crema sobre color. Veinticuatro
imágenes en vez de doce. Los doce de aquí son la primera mitad; la segunda sale de invertir el
fondo y la tinta de cada prompt, que es lo único que cambia.

No hay que tocar nada de código: el bucket es la lista y aparecen solas en el selector.

## Después

1. Los doce originales en `library/originals/`, con **estos nombres de fichero**. La carpeta está
   en `.gitignore`: los originales pesan y no tienen por qué viajar en el repositorio.
2. `npm run covers -- library/originals`
3. Subir `library/ready/` al bucket `library-images` desde el panel de Supabase. El bucket es la
   lista: aparecen solas en el selector, por orden de nombre de fichero.
4. Rellenar `manifest.json` con una entrada por imagen: el prompt exacto de aquí, el generador y
   su modelo, y que es generada con IA.

## Y el logotipo

Fuera del catálogo. Y son **dos cosas distintas, no una**: el logotipo y el icono. Hasta ahora
los cuatro PNG de `app.json` salían del mismo dibujo, pero eso era comodidad, no una regla —
`icon.png`, `splash-icon.png`, `adaptive-icon.png` y `favicon.png` son ficheros independientes.

Separarlos importa porque **sus exigencias se contradicen**: el icono se pinta a 48 px y Android
le recorta todo menos el 66 % central, así que pide pocas formas, grandes y gordas. El logotipo se
ve en el splash y donde se enseñe la marca, a tamaño grande, y ahí lo que se quiere es carácter.
Pedirle a un solo dibujo las dos cosas es lo que da un resultado soso: se acaba sacrificando lo
bonito para que sobreviva encogido.

### El logotipo

El provisional (`assets/logo.png`) ya tiene el carácter: tinta que tiembla, trazos que se repasan,
presión que cambia. **Su único defecto anotado es el fondo crema**, que en modo oscuro se recorta
como un cuadrado claro — y eso se arregla recortando el fondo, no volviendo a dibujarlo.

Se intentó rehacerlo en el trazo del catálogo y salió peor: limpio, simétrico y sin gracia,
«demasiado poco de todo», con fondo blanco puro (`#FEFEFE`) que al lado del `#F6EFE4` del splash
canta más que el crema de ahora. La culpa fue del prompt: `three simple shapes and nothing else`,
`no folds or pleats`, `even throughout` y `clean continuous contours` describen un vector, no una
tinta.

Si algún día se rehace, hay que pedir **lo contrario que en las doce portadas**: pincel de grosor
variable, líneas que se cruzan y se repasan, asimetría, `hand-inked, not vectorized`. Las portadas
quieren limpieza porque se ven a 64 px; el logotipo quiere mano.

### El icono

Aquí sí mandan las medidas, y lo que funciona es **quitar cosas, no afinar la línea**:

- **Una sola forma.** El gorro solo, sin el tenedor ni la cuchara. A 48 px tres objetos cruzados
  se convierten en una mancha: se comprobó con el logotipo generado, cuyas púas desaparecen.
- **Silueta maciza mejor que contorno.** Un trazo fino a 48 px casi no existe. Terracota sólido
  sobre el crema que el propio `app.json` ya pinta de fondo es lo que se lee a cualquier tamaño.
- **Al 60 % del cuadro.** Android recorta el icono adaptativo a círculo o a cuadrado redondeado y
  solo garantiza el 66 % central.

**Antes de generar nada, prueba a recortarlo del logotipo que ya tienes.** El gorro ocupa de
`y=49` a `y=970` en `assets/logo.png`; recortado y centrado en un cuadrado llena el cuadro, se lee
a 48 px y trae el carácter que una silueta generada no tiene. Sale gratis y es lo recomendado.

Se intentó el camino contrario —pedirle a Gemini una silueta maciza— y salió un clipart que vale
para cualquier app de cocina. La culpa, otra vez, del prompt: `a single solid silhouette, no inner
detail` describe exactamente eso. Si aun así quieres generarlo:

> Minimal flat icon of a chef's hat, a single solid terracotta silhouette (#CF542C) on a
> transparent background, no outline, no inner detail, no fork, no spoon, no text. The hat is
> centred and fills about 60% of the frame, leaving a generous even margin on all four sides.
> Simple enough to read at 48 pixels, flat 2D, no perspective, no gradient, no shading, no drop
> shadow, no frame. Square 1:1, transparent PNG.

Negativos:

> outline, line art, thin lines, inner detail, fork, spoon, cutlery, background colour, backdrop,
> paper sheet, drop shadow, frame, border, gradient, shading, 3D, photograph, text, watermark

Si prefieres que el icono siga siendo de línea y no macizo, cambia `a single solid terracotta
silhouette` por `a thick terracotta outline, very bold`. Se lee peor a 48 px, pero se parece más
al logotipo.

### Lo que hay que saber antes de tocar nada de esto

- **Gemini no da PNG transparente, y lo finge.** Pedirle `transparent PNG` devuelve un JPEG
  opaco con **el cuadriculado de transparencia dibujado como píxeles**: se comprobó midiendo, la
  zona «transparente» alterna `#FFFFFF` y `#E0E0E0`. Usarla tal cual pondría un tablero de ajedrez
  gris de fondo.
- **Pero la transparencia hace menos falta de lo que parece.** El icono de iOS tiene que ser
  opaco, así que `icon.png` quiere fondo sólido, no alfa. Y el fondo que ya pintan el splash y el
  icono adaptativo es `#F6EFE4`, que es exactamente el crema del logotipo provisional: recortado
  de ahí, encaja sin que se note. Solo importa donde el dibujo caiga sobre una superficie oscura.
- **Hay que rehacer los cuatro PNG** a mano, porque no hay script: `icon.png`, `splash-icon.png` y
  `adaptive-icon.png` a 1024 × 1024, `favicon.png` a 196 × 196. Con el logotipo y el icono
  separados, el splash sale del logotipo y los otros tres del icono.
- **Una autoría generada con IA no se puede reclamar**, y en un logotipo eso pesa más que en una
  portada decorativa — lo dice «Reglas de lo que entra» del README. El definitivo era para un
  diseñador.
