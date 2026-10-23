# Recetario — Especificación del MVP

Recetario personal en el móvil: escribes una receta deprisa y la IA la deja siempre con la misma estructura.

## Fases

- **Fase 1 (MVP):** uso personal, una sola usuaria. Crear, organizar y consultar recetas.
- **Fase 2:** compartir recetas y libros con otras usuarias. No se construye en el MVP, pero el modelo de datos ya lo admite.

Principio rector: ninguna decisión del MVP obliga a migrar datos cuando llegue la fase 2.

## Decisiones técnicas

| Área | Decisión | Motivo |
| --- | --- | --- |
| Cliente | Expo (React Native) + TypeScript estricto | Un código para iOS, Android y web |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) | Auth y propiedad de datos listas para la fase 2 |
| Identificadores | UUID en todas las entidades, `owner_id` en todo | Compartir sin migrar IDs |
| IA | Edge Function de Supabase | La clave del proveedor nunca llega al cliente |
| Validación | Esquemas Zod compartidos entre cliente y Edge Function | La salida de la IA se valida antes de mostrarse |
| Idioma | Se respeta el idioma de entrada; campo `locale` | Base para traducir en la fase 2 |
| Costes | Sin límites de uso; tope de gasto en el proveedor de IA | MVP de una sola usuaria |

## Alcance

**Dentro del MVP**

- Registro e inicio de sesión; recetas privadas de la usuaria.
  **Pendiente:** hoy solo existe la pantalla de inicio de sesión y la usuaria se crea a mano desde
  el panel de Supabase. La pantalla de registro sigue dentro del MVP, está por hacer.
- Crear receta desde texto libre → IA estructura y sugiere → revisión editable → guardar.
- Editar y borrar recetas, con notas personales por receta ("la próxima vez, menos sal").
- Libros tipo playlist, recetarios tipo carpeta y Favoritos.
- Foto opcional por receta, añadida en cualquier momento, con retoque "Mejorar con IA".
- Lectura offline de las recetas guardadas.

**Fuera del MVP**

- Compartir recetas o libros, y registro "La he hecho" con fecha y foto (fase 2).
- Libro "Por probar" de serie y "Quiero hacerla" como funcionalidad propia (fase 2).
- Hacer un libro público o privado, y fijarlo arriba de la biblioteca (fase 2).
- Entrada por voz propia (se usa el dictado del teclado).
- Etiquetas sueltas, recetarios anidados.
- Escritura offline y sincronización.
- Varias fotos por receta o fotos por paso.
- Límites de uso y planes de pago. Cuando lleguen, el retoque de foto con IA es el primer
  candidato a quedarse en el plan PRO, por ser lo único con un coste por uso apreciable.
  **Estructurar la receta con IA no se va al plan PRO en ningún caso**: es lo que hace útil la
  app, y sin ello la versión gratuita no permite ni crear una receta. Si hay que limitar el
  plan gratuito, se limita el volumen (cuántas recetas se guardan o se crean al mes), no el
  acceso a estructurar.

## Navegación

**El MVP no tiene barra inferior.** Mi cocina ocupa la pantalla y **Crear** es un botón flotante
abajo a la derecha. Con solo dos elementos, y siendo uno de ellos una acción y no un destino, una
barra de dos huecos se vería descompensada.

- **Mi cocina:** la biblioteca, al estilo de "Tu biblioteca" de Spotify. Arriba, la lista fija de Favoritos; debajo, los recetarios desplegables con sus libros y los libros sueltos. Filtros (Recetarios / Libros / Recetas).
- **Crear:** texto libre → estructurar con IA → revisión.

Decisiones:

- Favoritos no tiene pestaña propia: es una lista fija dentro de Mi cocina.
- La búsqueda no es una pestaña: vive en la cabecera de Mi cocina, y busca por título y también
  por ingrediente ("¿qué hago con esta calabaza?").
- Ajustes y perfil se abren desde un avatar en la cabecera de Mi cocina, como en Spotify.
- "Amigos" no existe en el MVP (sería una pestaña vacía). La barra inferior llega en la fase 2,
  cuando haya destinos que la llenen: **Mi cocina · Buscar · Crear · Amigos**.

Acciones de un libro:

Un libro se maneja desde un solo menú, en un solo sitio: dejando el dedo encima del libro en la
biblioteca, como en las listas de Spotify. El menú es una hoja que sube desde abajo, igual que la
pregunta de borrar. Dentro del libro no hay acciones: tocarlo en la biblioteca abre su pantalla,
que solo enseña sus recetas.

| Acción | Estado |
| --- | --- |
| Cambiar nombre | Hecho. También vale para el libro por defecto: la app lo reconoce por `is_system`, no por el título |
| Eliminar libro | Hecho. Nunca para el libro por defecto, y las recetas que solo estuvieran ahí pasan al libro por defecto antes de borrarlo |
| Crear portada | Pendiente, va con el paso 8 (fotos): hoy la portada es un degradado |
| Compartir | Fase 2 |
| Información (hacerlo público o privado) | Fase 2 |
| Fijar arriba / Dejar de fijar | Fase 2 |

Crear libros y recetarios:

- Botón **+** en la cabecera de Mi cocina, que abre una hoja con *Nuevo libro* y *Nuevo recetario*.
- **+ Nuevo libro** arriba del todo en la hoja "Añadir a libro" de una receta: crea el libro y añade la receta en un solo paso.

Pantallas: Mi cocina, detalle de libro, detalle de receta (con modo cocina), crear receta (entrada + revisión), foto y retoque, perfil y ajustes.

## Creación de receta con IA

La IA estructura y sugiere, pero nada se guarda sin revisión.

1. La usuaria escribe ingredientes base y pasos, rápido y sin cuidar la forma.
2. La Edge Function envía el texto a la IA y pide una salida que cumpla el esquema de receta.
3. La respuesta se valida con Zod. Si no cumple, se reintenta una vez y después se devuelve un error.
4. Se abre un borrador editable, guardado en el dispositivo: sobrevive a cerrar la app y nunca
   viaja a la base de datos. No se resalta nada; la receta se revisa entera.
5. La usuaria corrige lo que quiera y acepta.
6. Al confirmar, se guarda la receta junto con el texto original (`raw_input`).

Reglas para la IA:

- Respeta el idioma de entrada y lo devuelve en `locale`.
- Normaliza cantidades vagas ("un chorrito") a valores concretos.
- Puede añadir pasos obvios que falten (precalentar el horno).
- Devuelve en `assumptions` una lista breve de lo que ha supuesto, que se muestra sobre el borrador
  y no se guarda con la receta.
- No cambia el plato: no añade ni quita ingredientes principales.
- Nunca genera ni modifica las notas personales.

## Modelo de datos

| Tabla | Campos | Notas |
| --- | --- | --- |
| `recipes` | `id`, `owner_id`, `title`, `locale`, `servings`, `prep_min`, `cook_min`, `ingredients` (jsonb), `steps` (jsonb), `raw_input`, `notes?`, `photo_original?`, `photo_enhanced?`, `photo_active`, `is_favorite`, `created_at`, `updated_at` | `photo_active`: `original` o `enhanced` |
| `collections` (recetarios) | `id`, `owner_id`, `title`, `position` | Carpetas, sin anidar |
| `cookbooks` (libros) | `id`, `owner_id`, `collection_id?`, `title`, `position`, `is_system` | Un libro en cero o un recetario. `is_system` queda reservado para libros de sistema (fase 2) |
| `cookbook_recipes` | `cookbook_id`, `recipe_id`, `position` | Muchos a muchos con orden propio |

Forma de los campos jsonb:

```typescript
type Ingredient = {
  name: string;
  quantity?: number;
  unit?: string;
  note?: string;
};

type Step = {
  text: string;
};
```

Reglas:

- `position` con fractional indexing (claves tipo `a0`, `a0V`): reordenar toca una sola fila.
- Borrar un libro no borra recetas, igual que borrar una playlist no borra canciones.
- Borrar una receta la quita de todos sus libros (cascade en `cookbook_recipes`).
- Favoritos es una lista virtual: recetas con `is_favorite = true`. No es un libro.
- Row Level Security por `owner_id` desde el MVP; en la fase 2 se amplía con permisos de compartición.

## Organización tipo Spotify

Recetario = carpeta. Libro = playlist. Receta = canción.

- Una receta puede estar en muchos libros; cada libro tiene su propio orden manual.
- Un libro pertenece a cero o un recetario. Los recetarios no se anidan.

## Fotos y retoque

- Una foto opcional por receta, añadida al crearla o en cualquier momento después (cámara o galería).
- Se sube a Supabase Storage.
- Tras subirla aparece el botón **Mejorar con IA**. Si no se pulsa, se queda la original.
- El retoque solo ajusta luz, contraste, color y encuadre centrado. No regenera ni cambia el plato.
- Se guardan las dos versiones y se puede volver a la original.
- Pendiente: elegir el servicio de retoque (procesado determinista tipo auto-enhance o modelo de edición con instrucciones estrictas).

## Offline

- Las recetas guardadas se leen sin conexión desde una caché local.
- Crear, editar y la IA requieren red. Sin sincronización offline en el MVP.

## Referencia visual

Existe un prototipo hecho en Lovable. Lovable genera React web (no React Native), así que sirve como referencia visual y de flujos, no como código reutilizable. Los tokens de color y tipografía, las pantallas y los patrones de interacción ya extraídos están en `DESIGN.md`.

## Plan de trabajo

1. Esquema Zod de la receta y prompt de estructuración (la pieza con más incertidumbre).
2. Proyecto Supabase: tablas, RLS y Storage.
3. Edge Function de estructuración con validación y reintento.
4. App Expo: crear, revisar, listar y ver receta.
5. Mi cocina: libros, recetarios, Favoritos, creación con + y reordenación.
6. Búsqueda en Mi cocina: por título e ingrediente.
7. Notas personales y modo cocina.
8. Fotos y retoque.
9. Caché offline de lectura.

## Ideas por concretar

Cosas acordadas que todavía no tienen forma. Antes de construirlas, una ronda de preguntas.

- **Buscar recetas por los ingredientes que tengo.** Escribes «pepino, tomate, sandía» y la app
  propone recetas que lleven al menos uno. Está por decidir: si vive en el buscador de siempre o
  en su propia pantalla; si ordena por cuántos ingredientes coinciden (y si enseña cuáles te
  faltan); si busca solo por el nombre exacto del ingrediente o entiende que «tomate cherry» es
  tomate; y si eso último necesita la IA o basta con buscar en la base de datos.
- **Buscar en mi cocina o buscar fuera.** Hoy solo hay una búsqueda, porque solo hay recetas
  propias. Cuando se compartan (fase 2) habrá dos preguntas distintas con la misma caja de
  texto: «¿qué tengo yo?» y «¿qué tienen los demás?». Está por decidir: si son dos pestañas,
  dos modos de la misma caja o dos pantallas; cuál manda por defecto; y qué se ve de una receta
  ajena antes de quedársela.
- **Quitar una receta de mi cocina frente a borrarla.** En cuanto una receta pueda venir de otra
  usuaria, «borrar» deja de ser una sola cosa: borrar lo que es mío es destruirlo, y quitar de mi
  cocina algo de otra persona es soltarlo, porque sigue existiendo donde su dueña lo tenga. Son
  dos acciones distintas con dos textos distintos, y el menú de la receta tendrá que elegir cuál
  enseña según de quién sea. Va junto con lo anterior: hasta que no se decida cómo se busca y se
  guarda lo ajeno, esto no se puede cerrar.
- **Un buscador hacia el mundo, como Spotify.** Hoy la caja de la cocina filtra lo que ya es tuyo,
  y eso se queda así. Además haría falta una segunda superficie para buscar fuera: el catálogo de
  las demás, como la pestaña Buscar de Spotify frente a su biblioteca. Está por decidir: si es una
  pantalla propia o un chip más de la fila; qué se enseña (recetas, libros, cocineras); y cómo se
  trae algo a tu cocina. Va con los dos puntos de arriba y con la fila de chips.
- **Fila de chips para acotar la cocina.** «Favoritas · Libros · Recetas» como chips que acotan el
  tipo, mientras el texto filtra dentro, igual que la biblioteca de Spotify. Hoy Favoritas es un
  chip suelto con su propia lógica; ahí pasaría a ser uno más de la fila. Es la base del buscador
  avanzado.
- **Categorías de la receta.** Al crearla se podría etiquetar por tipo de cocina (asiática,
  japonesa, italiana) y por propiedad (sin gluten, sin lactosa, antiinflamatoria). Ojo: «etiquetas
  sueltas» está hoy *fuera* del MVP, y la razón era el desorden; esto solo lo evita si el
  vocabulario es cerrado, es decir, una lista nuestra que se elige, no texto libre que cada una
  escribe a su manera. Está por decidir: lista cerrada o libre; si «cocina» admite una o varias;
  si vive en un campo `categories` de la propia receta o en su tabla; si la IA las propone al
  estructurar (paso 3) y la usuaria solo confirma; y si acaban siendo chips de filtro en la
  cocina, que es donde se volverían útiles de verdad.
