# Recetario — Especificación del MVP

Recetario personal en el móvil: escribes una receta deprisa y la IA la deja siempre con la misma estructura.

## Fases

- **Fase 1 (MVP):** uso personal, una sola usuaria. Crear, organizar y consultar recetas.
- **Fase 2:** compartir recetas y libros con otras usuarias. No se construye en el MVP, pero el modelo de datos ya lo admite.
- **Fase 3:** pasarela entre cocineros y cocineras. Un cocinero publica un recetario, quien
  quiera leerlo paga una suscripción, y la app cobra y reparte. El contenido nunca deja de ser
  del cocinero: cuando retira el acceso, desaparece. Es otro negocio pegado a este, y su precio
  no está en la parte técnica: facturar significa IVA del país de cada compradora, reembolsos,
  reparto, identificar al cocinero para pagarle y responder de lo que publica.

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
- Foto opcional por receta, añadida en cualquier momento. Sin retoque.
- Compartir una receta por enlace: **visor HTML de solo lectura**, sin sesión y sin app.
- Lectura offline de las recetas guardadas.

**Fuera del MVP**

- **Abrir una receta compartida dentro de la app** y guardarla en tu cocina (fase 2). En el MVP
  el enlace lleva al visor y nada más. Compartir libros y el registro "La he hecho" también
  son fase 2.
- Recetarios de pago y suscripciones (fase 3). En el MVP no hay nada de eso, pero la regla de
  «Recetas ajenas» sí se respeta desde ahora, porque es la que decide la forma de las tablas.
- Libro "Por probar" de serie y "Quiero hacerla" como funcionalidad propia (fase 2).
- Hacer un libro público o privado, y fijarlo arriba de la biblioteca (fase 2).
- **Mejorar con IA**, el retoque de la foto. Fuera desde el 24 de octubre de 2026 y aparcado
  para una fase final: ver «Fotos y retoque».
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

**El MVP no tiene barra inferior.** Mi cocina ocupa la pantalla y **Nueva receta** es un botón
flotante abajo a la derecha, con su nombre escrito y no un `+` pelado. Con solo dos elementos, y siendo uno de ellos una acción y no un destino, una
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

- Chip **+ Nuevo libro** a la derecha de la fila de chips de Mi cocina. En la cabecera y no en
  la lista, porque la lista se va hacia arriba en cuanto hay libros; a la derecha y separado de
  los chips que filtran, porque esa fila acabará siendo «Favoritas · Recetarios · Libros ·
  Recetas» y los filtros crecen por la izquierda. Sin relleno y con filo de puntos: en esa fila
  conviven un chip que filtra y otro que crea, y tienen que distinguirse a la vista.
  **Es provisional, y de las que se van solas:** en la fase 2, la barra inferior trae un
  destino **Crear**, y ahí es donde acaban yendo las dos creaciones, la de libro y la de
  receta. Vive en la cabecera mientras dure el MVP.
- **En la cabecera no hay `+`.** Hubo uno y no se entendía: en la misma pantalla había dos `+`
  iguales y sin nombre, uno que hacía libros y otro que hacía recetas. Crear un libro es una
  acción rara, así que se pide donde están los libros, con su nombre puesto; crear una receta
  es la acción diaria y se queda a un solo toque en el botón flotante.
- **+ Nuevo libro** arriba del todo en la hoja "Añadir a libro" de una receta: crea el libro y añade la receta en un solo paso.

Pantallas: Mi cocina, detalle de libro, detalle de receta (con modo cocina), crear receta (entrada + revisión), foto y retoque, perfil y ajustes.

## Creación de receta con IA

La IA estructura y sugiere, pero nada se guarda sin revisión.

1. La usuaria escribe ingredientes base y pasos, rápido y sin cuidar la forma.
2. La Edge Function envía el texto a la IA y pide una salida que cumpla el esquema de receta.
3. La respuesta se valida con Zod. Si no cumple, se reintenta una vez con un modelo mejor y
   después se devuelve un error. Ese reintento es también la red de calidad: lo corriente lo
   resuelve el modelo barato y solo se paga el caro cuando hace falta.
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

### Límites de la Edge Function

Lo que protege la factura el día que esto sea público, por orden de importancia:

| Puerta | Cómo |
| --- | --- |
| Solo con sesión | La función lee la sesión de quien llama; sin ella, 401 |
| Tope por cocinera y día | Tabla `ai_usage`, contada con la clave de servicio para que no se pueda reescribir desde el cliente. Del cupo solo descuentan los aciertos: un intento que no da receta se devuelve |
| Tope de texto | 6.000 caracteres por receta |
| Caché del prompt | El prompt y el esquema no cambian: se envían marcados para cachear |
| Modelo configurable | `AI_MODEL` y `AI_BACKUP_MODEL` son secretos, no código: cambiarlos no es desplegar |
| Tope de gasto | En la consola del proveedor, como último cinturón |

| Tabla | Campos | Notas |
| --- | --- | --- |
| `ai_usage` | `owner_id`, `day`, `used` | Sin políticas RLS a propósito: solo la Edge Function escribe aquí |

## Modelo de datos

| Tabla | Campos | Notas |
| --- | --- | --- |
| `recipes` | `id`, `owner_id`, `title`, `locale`, `servings`, `prep_min`, `cook_min`, `ingredients` (jsonb), `steps` (jsonb), `raw_input`, `photo_original?`, `photo_enhanced?`, `photo_active`, `created_at`, `updated_at` | Solo contenido. `photo_active`: `original` o `enhanced`. `notes`, `is_favorite` y `library_image` salen de aquí: ver «Recetas ajenas» |
| `saved_recipes` | `owner_id`, `recipe_id`, `notes?`, `is_favorite`, `library_image?`, `saved_at` | Lo que cada cocinera tiene en su cocina y lo que ha hecho con ello. Clave primaria `(owner_id, recipe_id)` |
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
- **«Mejorar con IA» queda fuera del MVP**, para una de las fases finales: decidido el 24 de
  octubre de 2026. El modelo de datos ya lo contempla —`photo_original`, `photo_enhanced` y
  `photo_active`—, así que añadirlo después no obliga a migrar nada. Lo de abajo describe
  cómo será cuando se haga.
- Tras subirla aparece el botón **Mejorar con IA**. Si no se pulsa, se queda la original.
- El retoque solo ajusta luz, contraste, color y encuadre centrado. No regenera ni cambia el plato.
- Se guardan las dos versiones y se puede volver a la original.
- La foto es parte del contenido y viaja con la receta: quien tenga acceso la ve. Encima, cada
  cocinera puede ponerle su propia portada, que manda sobre la de la dueña.
- Pendiente, cuando llegue su fase: elegir el servicio de retoque. Procesado determinista tipo
  auto-enhance —barato y predecible, mejora poco una foto mala— o modelo de edición con
  instrucciones estrictas, que queda mucho mejor pero se inventa comida que no cocinaste.
- **La foto se añade a una receta que ya existe**, no durante la revisión: antes de guardar no hay
  carpeta donde subirla. Poder ponerla mientras se crea —un limbo donde la foto espera a que la
  receta nazca— queda para una fase posterior.
- En la base se guarda **la ruta del objeto**, no una URL: el bucket `recipe-photos` es privado y
  sus URLs se firman y caducan. La firma se hace al pintar.
- **Fase 2:** la política de lectura del bucket es solo para la dueña, así que quien tenga acceso a
  una receta ajena no vería su foto. Cuando llegue compartir, las firmas tendrán que salir de una
  Edge Function que compruebe el acceso.

## Offline

- Las recetas guardadas, los libros y qué receta está en qué libro se leen sin conexión desde una
  copia en el disco del móvil. La escribe la pantalla principal cuando el servidor contesta, y al
  leerla se vuelve a validar con Zod: si ya no encaja, se tira en vez de reventar.
- **Las fotos quedan fuera.** Sin red se lee la receta entera, pero sin imágenes. Guardar los
  ficheros obligaría a gestionar espacio y, en la fase 2, a borrarlos del disco al perder el
  acceso. Decidido el 24 de octubre de 2026.
- Crear, editar y la IA requieren red. Sin sincronización offline en el MVP.
- Lo prestado se borra de la caché cuando se pierde el acceso: ver «Recetas ajenas». Hoy, con una
  sola cocina, la copia se borra entera al cerrar sesión.

## Recetas ajenas: acceso, no propiedad

La regla que gobierna todo lo que viene después, y la única:

> **Una receta de otra persona es siempre acceso, nunca propiedad. Si su dueña la borra o retira
> el acceso, desaparece de tu cocina. Lo único que te la deja para siempre es un gesto explícito
> tuyo, «Hacerla mía», que crea una copia tuya, y solo está disponible si la dueña lo permite.**

De ahí sale todo lo demás:

- **Borrar es un borrado real.** `delete` de la fila, sin lápidas ni columnas `deleted_at` que
  haya que filtrar para siempre. Y se nota en todas las cocinas que la tenían, que es justo lo que
  un recetario de pago necesita: el cocinero cierra el grifo y se cierra de verdad.
- **Quitar de mi cocina y borrar son dos acciones distintas.** Quitar lo ajeno es soltar el
  acceso y no toca la receta de nadie. Borrar es destruir lo tuyo. El menú de la receta enseña una
  u otra según de quién sea.
- **Mientras el acceso vive, lo que ves es la receta de su dueña, al día.** Si cambia las
  cantidades o los pasos, los ves. Eso es lo que hace útil seguir a un cocinero, y lo que una
  copia no da.
- **Lo que escribes tú es tuyo y sobrevive.** Tus notas, que la hayas marcado favorita y la
  portada que le pusiste no se van cuando se va la receta: nunca fueron de ella.
- **La foto de la receta viaja con la receta.** Si la dueña le puso foto, la ves y se descarga como
  parte del contenido. Encima de eso, cada cocinera puede ponerle la suya: manda la tuya si la
  tienes, y si no, la de la dueña.
- **Contra una captura de pantalla no hay nada que hacer.** Lo que se vende es acceso, como en
  cualquier suscripción, no imposibilidad de copiar. Conviene no prometer otra cosa.
- **Choca con la caché offline (paso 9).** Una receta prestada que se guardó para leer sin
  conexión sigue en el móvil cuando le retiran el acceso. La caché tendrá que saber qué es
  prestado y borrarlo. Es trabajo de la fase 2, pero el paso 9 no puede diseñarse ignorándolo.

### Lo que esto obligó a hacer en el MVP (hecho)

`recipes` mezcla hoy dos cosas: el contenido de la receta, que es de su dueña, y lo que cada
cocinera ha hecho con ella, que es de cada cual. Con recetas ajenas eso no se sostiene —las notas
de una pisarían las de otra—, así que lo personal sale a su tabla **ahora**, mientras hay una sola
usuaria y la mudanza es gratis:

| Se queda en `recipes` (contenido) | Se va a `saved_recipes` (de cada cocinera) |
| --- | --- |
| `title`, `locale`, `servings`, `prep_min`, `cook_min`, `ingredients`, `steps`, `raw_input` | `notes` |
| `photo_original`, `photo_enhanced`, `photo_active` | `is_favorite` |
| `owner_id`: de quién es la receta | `library_image`: la portada que le pone cada cual |

`saved_recipes(owner_id, recipe_id, notes?, is_favorite, library_image?, saved_at)` es la
definición de **«mi cocina»**: lo que tienes es lo que tienes guardado, seas o no su dueña. Hasta
la fase 2, dueña y guardadora son siempre la misma persona.

En el código, `Recipe` es el contenido y `SavedRecipe` es la receta con lo que cada cocinera ha
puesto en ella, plana para que las pantallas no se enteren de que son dos tablas. Quién puede
cambiar qué lo decide el repositorio: `update` toca el contenido y `savePersonal` lo personal.

No se construye nada de suscripciones, acceso ni revocación. Solo se deja la casa en condiciones.

## Compartir una receta

**El visor entra en el MVP; abrir en la app se queda en la fase 2.** Decidido el 24 de octubre
de 2026. El motivo es que son dos trabajos de tamaños muy distintos: el visor es una pieza
suelta que no toca el modelo de permisos, y abrir en la app rompe la regla que hoy sostiene
todo —cada fila es de una dueña y nadie más la ve—, así que arrastra tabla de accesos,
políticas nuevas, firmas de foto por Edge Function, revocación y borrado de lo prestado en la
copia local.

La propietaria envía un enlace a una receta suya. Quien lo recibe cae en uno de dos sitios:

1. **Tiene la app.** El enlace abre la receta dentro de la app. Puede leerla, usar el modo cocina
   y guardarla en su cocina. **No puede editarla**: no es suya. Es la misma pantalla de receta de
   siempre, con otro juego de acciones según de quién sea.
2. **No tiene la app.** El enlace abre un **visor HTML** en la web: la receta y nada más. Sin
   sesión, sin acciones, sin editar. No es la app en web, es una página de solo lectura.

El enlace es el mismo en los dos casos, así que construir el visor no estorba al otro camino:
el día que la app intercepte el enlace, la página seguirá estando para quien no la tenga.

Lo que hay que decidir antes de construirlo:

- **Qué viaja y qué no.** Las notas personales no salen, y el `raw_input` tampoco: el visor es
  público. **La foto sí viaja** (decidido el 24 de octubre de 2026). Como el bucket es privado,
  la página no puede llevar la ruta: la Edge Function firma la foto al servirla, y esa firma vive
  un rato y se puede reenviar mientras dure.
- **Quién puede abrir el enlace.** Enlace secreto que basta tener, o receta marcada como pública.
  Lo primero no necesita sesión en el receptor y lo segundo sí necesita una política de lectura
  anónima en Postgres.
- **Si el enlace se puede retirar**, y qué pasa entonces con quien ya guardó la receta.
- **Qué significa «guardar»**: una copia propia que ya se puede editar, o una referencia a la
  receta de la otra persona, que cambia cuando su dueña la cambia. Va con «quitar frente a
  borrar».
- **Dónde vive el visor.** Hoy lo sirve la Edge Function `shared-recipe`, y eso tiene un tope
  descubierto el 24 de octubre de 2026: **`*.supabase.co` no sirve HTML**. Su pasarela cambia el
  `content-type` a `text/plain` y añade `content-security-policy: sandbox`, para que nadie monte
  páginas de phishing en su dominio. Comprobado con una función de prueba. Así que la página
  llega entera pero el navegador la enseña como texto. Para que se vea como página hace falta un
  dominio que no sea de Supabase: el dominio propio de Supabase (de pago), o servirla desde donde
  se despliegue la web de la app. Hasta entonces, el enlace funciona pero se lee mal.
- **Enlaces universales**, para que el mismo enlace abra la app si está instalada: fase 2.
- **Qué se ve en el visor** cuando la receta tiene foto, y si desde ahí se invita a instalar la app.

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
9. Caché offline de lectura, sabiendo ya que lo prestado se borra al perder el acceso. Hecha,
   sin las fotos.
10. Sacar lo personal de `recipes` a `saved_recipes`, que pasa a ser «mi cocina». Hecho.
11. Compartir una receta por enlace, solo el visor HTML: testigo secreto por receta, Edge
    Function que devuelve la página y botón de dejar de compartir.

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
- **Plan gratuito y plan PRO.** La idea: estructurar tu texto libre entra en el plan gratuito
  (con tope de volumen, nunca de acceso) y lo caro de verdad —la foto con IA— vive en un PRO de
  unos 2 € al mes, lo justo para cubrir el uso. Está por decidir: qué más entra en PRO; cuántas
  recetas al día da el plan gratuito; si el tope es diario o mensual; qué pasa cuando se agota
  (esperar a mañana o pagar); y cómo se cobra, que es tanto una decisión de producto como de
  papeles. Lo técnico ya está preparado: el límite por cocinera y día existe y se cuenta donde
  no se puede tocar.
