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
  el enlace lleva al visor y nada más. Compartir libros sigue siendo fase 2. **El registro «La he hecho»
  sale de la fase 2** el 25 de octubre de 2026 y pasa a ser el paso 16 del plan, en su versión
  sobria —fecha y nota, sin rachas ni estadísticas—, porque es lo único que da un motivo para
  volver a abrir la app.
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
- Límites de uso y planes de pago. El retoque de foto con IA **dejó de ser el candidato al plan
  PRO el 25 de octubre de 2026**: nadie en este mercado cobra por mejorar una foto, se cobra por
  planificar, por la lista de la compra, por nutrición y por acceso (ver [`MERCADO.md`](MERCADO.md)).
  **Estructurar la receta con IA no se va al plan PRO en ningún caso**: es lo que hace útil la
  app, y sin ello la versión gratuita no permite ni crear una receta. Si hay que limitar el
  plan gratuito, se limita el volumen (cuántas recetas se guardan o se crean al mes), no el
  acceso a estructurar.
- **Nada de red social, y es una decisión, no una carencia.** Rachas, objetivos semanales, «me
  gusta», comentarios, perfil público de cocinera y feed de amistades quedan fuera para siempre:
  son otra app, y «aquí nadie ve lo que cocinas» solo se puede prometer si no existen. Cerrado el
  25 de octubre de 2026 con el estudio de mercado.
- **Comunidad abierta tipo plaza pública.** Cookpad ya tiene seis millones de recetas en español.
  La fase 2 es un círculo pequeño —tu familia, tus amistades—, no un catálogo.
- **Nutrición y calorías.** Otro producto: necesita una base de datos de alimentos y mete la app en
  terreno de salud. Cuando llegue, mucho más adelante, irá en el plan PRO.
- **Lista de la compra.** Fuera del MVP pero no enterrada: es la razón número uno para abrir una app
  de recetas a diario y la mejor candidata al plan PRO cuando llegue.

## Navegación

**El MVP no tiene barra inferior.** Mi cocina ocupa la pantalla y crear es un **`+` redondo**
flotante abajo a la derecha. Al tocarlo sube una hoja con lo que se puede crear: **Apunta una
receta**, **Pega una receta** y, tras un separador, **Nuevo libro** (ver «Crear libros y
recetarios»). Con solo dos elementos, y siendo uno de
ellos una acción y no un destino, una barra de dos huecos se vería descompensada.

- **Mi cocina:** la biblioteca, al estilo de "Tu biblioteca" de Spotify. Arriba, la lista fija de Favoritos; debajo, los recetarios desplegables con sus libros y los libros sueltos. Filtros (Recetarios / Libros / Recetas).
- **Crear:** dos caminos que acaban en la misma revisión. *Apunta una receta*: texto libre →
  estructurar con IA → revisión. *Pega una receta*: texto ya escrito → parser propio, sin IA →
  revisión. Ver «Pegar una receta, sin IA».

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
| Cambiar portada | Hecho. Del catálogo del proyecto **o una foto tuya**, nunca las dos: elegir una vacía la otra y borra el fichero que deja de usarse |
| Compartir el libro | Fase 2. Compartir **una receta** sí está hecho: paso 11 |
| Información (hacerlo público o privado) | Fase 2 |
| Fijar arriba / Dejar de fijar | Fase 2 |

Crear libros y recetarios:

- **Una sola puerta, y dentro las dos cosas con su nombre.** Decidido el 25 de octubre de 2026,
  mirando cómo lo resuelve ReciMe. El flotante **Crear** abre una hoja con las recetas arriba,
  que son la acción diaria y por eso van primeras, y **Nuevo libro** debajo, que se hace cuatro
  veces al año.
- **Las recetas se nombran por lo que traes, no por cómo se procesan.** Decidido el 26 de octubre
  de 2026. La hoja queda así, cada fila con una línea de explicación debajo:
  - **Apunta una receta** — «Escríbela a tu manera y la ordenamos».
  - **Pega una receta** — «Copiada de una web, un mensaje o tus notas».
  - *separador*
  - **Nuevo libro**.

  **La palabra IA no sale en la hoja.** Quien la ve elige la IA aunque su receta ya esté bien
  escrita, y el camino fiel se queda sin usar. La pantalla de *Apunta una receta* sí dice, en
  pequeño, que el texto lo ordena una IA: por honestidad y porque lo pide el formulario de datos
  de Google Play. Cuando lleguen **Desde un enlace** (paso 13) y **Desde una foto** (paso 15)
  entran en la misma lista con el mismo criterio. Dentro de un libro la hoja es la misma sin
  *Nuevo libro*. Pide una `description` opcional en las filas de `ActionSheet`.
- **Se acepta el toque de más en la acción diaria.** Crear una receta pasa de un toque a dos. Se
  paga a gusto: la fricción es mínima y a cambio **no hay dos sitios** y la pantalla principal
  queda limpia, que es lo que importa en la pantalla que más se mira.
- **Fuera el chip `+ Nuevo libro` de la fila de chips.** Era provisional y estaba en mal sitio: esa
  fila acabará siendo «Favoritas · Recetarios · Libros · Recetas» y los filtros crecen por la
  izquierda, así que un chip que crea acabaría estorbando a los que filtran. Ahora la fila es solo
  de filtros.
- **El flotante vuelve a ser un `+` sin texto**, decidido el 25 de octubre de 2026, y esta vez sí
  se entiende. Lo que falló en su día no era el signo: era que hubiera **dos `+` iguales** en la
  misma pantalla, uno que hacía libros y otro que hacía recetas. Con una sola puerta no hay con qué
  confundirlo, y lo que crea lo dice la hoja con todas las letras. Su nombre accesible es «Crear»,
  que es como se llamará el destino de la barra inferior en la fase 2: cuando llegue, la hoja se
  convierte en esa pestaña y no hay nada que reaprender.
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

## Pegar una receta, sin IA

Decidido el 26 de octubre de 2026. El camino existe por **fidelidad**, no por dinero: hay recetas
que ya vienen escritas —de un blog, de un mensaje, de las notas del móvil— y ahí la IA no es mejor,
es peor, porque toca lo que no debe. Tendría sentido aunque la IA fuera gratis e infinita.

1. **Un cuadro para la receta entera y el título en su propio campo**, que es lo único que no se
   puede deducir con fiabilidad. Encima del cuadro, el consejo de importación: «Funciona mejor si
   cada ingrediente y cada paso van en su línea. Si puedes, escribe "Ingredientes" y "Pasos"
   encima de cada parte».
2. **El corte entre ingredientes y pasos** sale de los encabezados («Ingredientes», «Preparación»,
   «Elaboración», «Pasos», «Modo de hacerlo»…). Sin encabezados, de la forma de cada línea: corta
   o con número delante, ingrediente; frase larga, paso.
3. **Cada ingrediente se separa solo con lo que está escrito, sin convertir ni inventar nada.**
   Lee enteros, decimales con coma, fracciones (`1/2`, `½`) y una lista cerrada de unidades en
   español (g, kg, ml, l, cucharada, cucharadita, taza, vaso, diente, pizca, lata, sobre…),
   quitando el «de» de detrás. Un rango (`2-3 huevos`) se queda en cantidad 2 y nota «2-3». Lo
   demás («un chorrito de aceite», «sal al gusto») va entero al nombre y sin cantidad: no escala,
   y se acepta, porque tampoco venía la cantidad.
4. **El parser devuelve un borrador, no una receta válida**, igual que `draftFromStructuredRecipe`
   con la respuesta de la IA. El borrador ya admite listas vacías y la validación estricta entra
   al guardar, así que un fallo nunca es un callejón: la revisión se abre con lo que haya.
5. **Avisa de lo que no ha encontrado, nunca de lo que ha supuesto**, en el mismo sitio que los
   `assumptions` de la IA: «No he encontrado los pasos», «Hay 4 ingredientes sin cantidad».
6. **Se guarda el texto pegado en `raw_input`**, como en el otro camino.

**El puente a la IA.** Desde la revisión de una receta pegada se puede pedir que la IA la pase a
limpio, con estas condiciones:

- Solo de pegada a IA. Al revés no hace falta.
- Solo aparece si el parser ha dejado avisos, y va junto a ellos: «Hay 4 ingredientes sin
  cantidad. ¿Quieres que la IA la pase a limpio?». Si ha salido limpia, no está.
- Manda `raw_input` a la misma `structure-recipe`. No hay función ni prompt nuevos.
- Si ya se ha tocado el borrador, avisa de que se pierden los cambios. Si no, no pregunta.
- Cuenta para el tope diario como cualquier otra estructuración.

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

## Modo cocina

Decidido el 26 de octubre de 2026 en una ronda de preguntas. El punto de partida: el paso decía
«Sofríe la cebolla» y no decía cuánta, y para saberlo había que tapar el paso con la lista de
ingredientes. El paso de pago de ReciMe es eso mismo, un paso a paso con un botón de ingredientes;
lo que nos separa es que **el paso diga sus cantidades y que la cocina hable**.

**Cada paso enseña los ingredientes que usa, con su cantidad**, debajo del texto y en letra que
se lee de lejos. **Los pone la app al pintar, no la IA**: busca en el texto del paso cada palabra
con sentido del nombre del ingrediente (sin artículos ni «de»), sin tildes ni mayúsculas y
quitando el plural de los dos lados. Así funciona en todas las recetas, también en las ya
guardadas y en las pegadas, que no pasan por la IA. Ante la duda se enseña: un ingrediente de más
molesta menos que el que falta. Lo que no resuelve, y se acepta: «la masa» o «la mezcla» no
nombran nada (y ahí no hay nada que medir), y «la mitad del azúcar» enseña el azúcar entero. Si
se queda corto, el paso gana `ingredients` desde la IA y esto queda de respaldo.

**Antes del primer paso, un resumen**: «VAS A COCINAR · Bizcocho de yogur», «Para 4 − +» y los
ingredientes ya escalados, con «Empezar a cocinar» abajo. Decidido el 26 de octubre de 2026: las
raciones se deciden ahí, no en mitad de la receta con las manos en la masa.

**La pantalla de los pasos**, de arriba abajo: Salir y Pantalla encendida; los temporizadores en
marcha; la barra de progreso; «Paso 2 de 6» e Ingredientes; el temporizador del paso; el paso en
grande; sus cantidades; y encima de
los botones, en pequeño, **el siguiente paso con sus cantidades** («DESPUÉS · Corta el chorizo en
rodajas · 150 g chorizo»), para ir preparándolo mientras se sofríe. Abajo, en una sola fila,
**← · ▶ · Siguiente**.

**La voz, en dos tiempos.**

- **Ahora: te lee la receta** con la voz del sistema (`expo-speech`), sin internet ni micrófono.
  El play **se queda leyendo**: lee el paso actual y, a partir de ahí, cada paso nuevo al llegar a
  él, hasta que se pulse pausa. Lee el paso y después sus cantidades («Necesitas: una cebolla
  grande, dos zanahorias…»), nunca la vista previa. En el idioma de la receta (`locale`), con las
  cantidades como se dicen («media», «gramos», «uno y medio»). Al salir se calla, y cada vez que
  se entra empieza apagado.
- **Después: le das órdenes**, con un vocabulario cerrado: *siguiente, anterior, repite,
  ingredientes* y *cuánto/cuánta + ingrediente*. Se activa con un botón al entrar, no escucha
  siempre. Pide micrófono (el permiso que se quitó el 26 de octubre, y que Play pide justificar)
  y reconocimiento nativo. Si resulta muy complicado, con la lectura basta.
- **Más adelante, para el PRO: preguntarle lo que sea** («¿puedo cambiar la nata?»). Tiene coste
  por uso.

**Temporizadores.**

- **Es opcional, y va arriba**, justo debajo de «Paso 3 de 9». Si el texto trae un tiempo («20
  minutos», «40 min», «1 hora», «hora y media»), sale ya puesto y destacado con ese tiempo; si no,
  solo un botón discreto, **«+ Añadir temporizador»**, que al tocarlo lo abre en 5 minutos.
  Cambiado el 26 de octubre de 2026 al probarlo: no todos los pasos tienen tiempo. «Un par de
  minutos» o «hasta que esté dorado» no cuentan: eso es interpretar.
- **El tiempo se escribe a mano tocándolo** («90», «1:30», «1h30», «1 h 30 min»), porque ir
  minuto a minuto hasta hora y media es una tortura, y **se afina con −1 / +1**, antes de arrancar
  y mientras corre. **Se arranca con un play pequeño a la derecha**, y una × lo quita si se ha
  añadido sin querer. Al arrancarlo, se va a la franja de arriba y vuelve «+ Añadir temporizador». No hay pantalla de ajustes.
- **Se arranca con un toque, nunca solo**, y puede haber varios a la vez, en una franja arriba
  («Lentejas · 32:10»). Salir con uno en marcha pide confirmar.
- **Al acabar, suena hasta que lo paras.** Decidido el 26 de octubre de 2026: un aviso que suena
  una vez no sirve si estás en el salón. La voz lo dice una vez («Lentejas: ya está el tiempo») y
  después pita cada pocos segundos, vibra en bucle y la fila parpadea con un **«Parar»** grande. El
  + sigue ahí para el «le faltan dos minutitos», y sumarle un minuto también lo calla.
- **En la web**, para probar ya: la cuenta atrás en pantalla, que se sostiene porque el modo
  cocina mantiene la pantalla encendida. No suena con el móvil bloqueado ni en otra app, y lo dice.
- **En Android, y es una función de Android**: tiene que sonar como una alarma, en bucle y hasta
  que se pare, con el móvil bloqueado o la app cerrada. **El camino elegido, el 26 de octubre de
  2026: que lo ponga el reloj del propio móvil.** Android deja pedirle «un temporizador de 40
  minutos llamado Lentejas» (la acción `android.intent.action.SET_TIMER`, con
  `expo-intent-launcher` y el permiso normal `SET_ALARM`, que Play no pone en duda). El reloj suena
  como una alarma de verdad y **quita el riesgo de las alarmas exactas**: desde Android 12 los
  avisos programados se pueden retrasar minutos si no hay ese permiso, Play solo lo da sin más a
  las apps de reloj, y aquí lo tiene el reloj, no nosotras.
  **Lo que cuesta:** el ±1 de nuestra franja no mueve el temporizador del reloj, así que en Android
  o se ajusta allí, o la franja solo enseña la cuenta atrás. La alternativa, sonar en bucle con
  notificaciones propias, es mucho más trabajo nativo y vuelve a los permisos que Play restringe.
  **En iPhone** no hay forma de pedírselo al reloj del sistema: queda para cuando llegue iOS.

**Raciones (el paso 14).**

- Se eligen en la ficha de la receta con **«Para 4 − +»**, encima de los ingredientes, y entran
  contigo en el resumen del modo cocina, donde se pueden cambiar todavía. **En los pasos ya no**:
  ahí se cocina, no se planifica.
- **El selector se explica solo, sin avisos**: «¿Para cuántas personas?» encima, «6 personas − +», y
  al cambiarlo una línea debajo: «Cantidades ajustadas para 6 personas. La receta original es para
  8 personas.» Igual en la ficha y en el resumen, para aprenderlo una vez.
- **No se guardan**: cada vez se empieza en las raciones de la receta. Guardar «la hago para
  seis» es planificar, y eso es el plan semanal del PRO.
- **Sin raciones en la receta no hay selector.** En la ficha, en el sitio del selector, sale un chip
  de borde discontinuo, «Raciones sin definir», y debajo, pequeño: «Edita la receta para añadir las personas y podrás ajustar
  las cantidades.» Sin botón: para editar ya está el lápiz de arriba. En
  el resumen del modo cocina no sale nada: ahí se viene a cocinar, no a editar.
- **Lo que falta de preparación, cocción o raciones no se pinta en la ficha**, ni como un «—» ni
  como aviso: un tiempo que falta no impide cocinar. Las raciones son la excepción de arriba porque
  sin ellas se pierde algo que funciona. Decidido el 26 de octubre de 2026.
- **Redondeo:** lo que se cuenta, a la media unidad más cercana y nunca por debajo de media
  («1½ cebollas»); lo que no se parte (huevo, lata, sobre…), a la unidad; cucharadas,
  cucharaditas, tazas y vasos, a la media; gramos y mililitros, al entero hasta 20, de 5 en 5
  hasta 100 y de 10 en 10 por encima. Sin cantidad, como estaba. La voz dice lo redondeado.

**Fuera, por ahora:** tachar ingredientes (con las cantidades en cada paso casi no hace falta),
volver por donde se dejó y guardar las raciones elegidas.

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
12. Etiquetas `og:` en el visor, para que el enlace se vea como una tarjeta al pegarlo. Va con el
    dominio, que es cuando el enlace empieza a repartirse.
13. Importar una receta desde una URL: traer el HTML, limpiarlo y pasarlo por el prompt que ya
    existe.
14. Escalar raciones, en la receta y en el modo cocina, con el redondeo de «Modo cocina».
15. Foto de una página de libro o de una receta escrita a mano → receta, con la misma tubería que
    el texto libre. **La gracia no es leer la foto, que eso ya lo hace ReciMe, sino interpretarla**:
    normalizar «un vaso de los de agua» y declarar lo que se ha supuesto, igual que con el texto.
16. «La he hecho»: fecha y nota por cada vez que se cocina. Sin rachas ni estadísticas.
17. Pegar una receta sin IA, con la hoja nueva y el puente a la IA (ver «Pegar una receta, sin
    IA»). Decidido el 26 de octubre de 2026; el orden respecto al resto está por decidir.
18. Modo cocina con potencia (ver «Modo cocina»): cantidades en cada paso, vista previa del
    siguiente, lectura en voz alta y temporizadores en pantalla que suenan hasta pararlos. Hecho en
    la web el 26 de octubre de 2026. Después, en Android, el temporizador del reloj del sistema y
    las órdenes por voz.

Los cinco últimos salen del estudio de mercado del 25 de octubre de 2026
([`MERCADO.md`](MERCADO.md)). Del 12 al 14 son baratos y se notan al segundo día de uso; el 15 y el
16 son los dos que cambian lo que la app es.

## Ideas por concretar

Cosas acordadas que todavía no tienen forma. Antes de construirlas, una ronda de preguntas.

- **Buscar recetas por los ingredientes que tengo. Se hace: decidido el 25 de octubre de 2026.**
  Escribes «pepino, tomate, sandía» y la app propone recetas que lleven al menos uno. Lo que falta
  es la forma, y hay que estudiarla antes de tocar código, porque cambia la pantalla principal.
  Está por decidir: si vive en el buscador de siempre o
  en su propia pantalla; si ordena por cuántos ingredientes coinciden (y si enseña cuáles te
  faltan); si busca solo por el nombre exacto del ingrediente o entiende que «tomate cherry» es
  tomate; y si eso último necesita la IA o basta con buscar en la base de datos.
- **Buscar recetas de otras personas cuando sean públicas. Se hace, en la fase 2:** decidido el 25
  de octubre de 2026. Una segunda superficie para buscar fuera de tu cocina, como la pestaña Buscar
  de Spotify frente a su biblioteca, pero **solo sobre lo que su dueña haya marcado como público**:
  va de la mano de «hacer un libro público o privado», que ya era fase 2. La fase 3 además lo
  necesita, porque un recetario de pago que no se puede encontrar no se vende. Lo que **no** se
  hace es ser una comunidad —feed, perfiles, likes—: ese sitio es de Cookpad y no es nuestro
  mercado (ver [`MERCADO.md`](MERCADO.md)). Está por decidir: si es una pantalla propia o un chip
  más de la fila; qué se enseña (recetas, libros, cocineras); cómo se trae algo a tu cocina; y qué
  significa «público» exactamente, que es una política de lectura en Postgres y no solo una casilla.
  Va con el punto siguiente y con la fila de chips.
- **Buscar en mi cocina o buscar lo que me han compartido.** Sigue abierta, y no es lo mismo que el
  punto anterior: aquí no se busca en el mundo, se busca en tu círculo. Hoy solo hay una búsqueda
  porque solo hay recetas propias; cuando lleguen las compartidas (fase 2) y los recetarios que
  sigues (fase 3) habrá dos preguntas distintas con la misma caja de texto: «¿qué tengo yo?» y
  «¿qué me han dado?». Está por decidir: si son dos pestañas, dos modos de la misma caja o dos
  pantallas; cuál manda por defecto; y qué se ve de una receta ajena antes de quedársela.
- **Modo cocina: hay que meterle mucha caña.** Acordado el 25 de octubre de 2026 y **concretado
  el 26**: ver la sección «Modo cocina».
- **Las raciones como columna vertebral: modo cocina, raciones elegidas y lista de la compra.**
  Acordado el 25 de octubre de 2026, y **todo esto puede ser fase 2** menos el escalado, que ya es
  el paso 14. Son tres cosas encadenadas, y la fuerza está en la cadena, no en cada pieza:
  1. **En el modo cocina se elige para cuántos comensales.** Si la receta está pensada para dos y
     hoy sois cuatro, las cantidades se recalculan ahí mismo, con las manos en la masa y sin salir
     de la pantalla. Esto es el paso 14 y es donde más se nota.
  2. **Y se elige *antes*, para la receta que vas a hacer.** No solo mientras cocinas: decides «esta
     la haré para seis» cuando la estás planeando, y la receta ya te habla en esas cantidades.
  3. **Con eso, la lista de la compra deja de ser una función añadida y pasa a ser la consecuencia
     natural**: si la app sabe para cuántos vas a cocinar, sabe qué hay que comprar. Por eso sube de
     peso respecto a lo que decía el estudio de mercado.
  Lo que nos da fuerza aquí es técnico y ya lo tenemos: `quantity` numérico y unidades normalizadas
  por la IA. Es lo que hace que escalar sea exacto y que sumar ingredientes repetidos funcione, que
  es justo donde falla ReciMe (ver [`MERCADO.md`](MERCADO.md)). Las raciones elegidas son de cada
  vez y lo que no se parte se redondea a la unidad, decidido el 26 de octubre de 2026 (ver «Modo
  cocina»). Está por decidir: si la lista de la compra es de una receta, de
  varias o de una semana; y si vive en su pantalla o cuelga del libro.
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
- **Plan gratuito y plan PRO.** Decidido el 26 de octubre de 2026, con números:
  - **La IA de texto es gratis y sin créditos.** Estructurar una receta cuesta unos 0,25 céntimos
    contando el rescate a Sonnet (Haiku 5.5 a 0,10 $/0,50 $ por millón de tokens); un recetario
    de 200 recetas, medio dólar. El único freno es el tope diario que ya existe
    (`AI_DAILY_LIMIT`, 30), y al agotarse no se cobra: «Hoy ya has pasado a limpio 30 recetas.
    Mañana más», con *Pega una receta* como salida.
  - **La regla: lo que cuesta más cuanta más gente lo usa, lo paga quien más lo usa.** Lo que crece
    con los usuarios son las fotos guardadas y leer imágenes, no la IA de texto.
  - **El PRO, unos 2 €/mes o 18 €/año, lleva leer y guardar imágenes y el plan semanal**: pasar a
    limpio fotos de recetas (libros, libretas, recortes; paso 15), fotos de platos sin límite (el
    gratuito, unas 50), retoque de foto y generar el plan semanal. **El cálculo calórico** también
    irá en el PRO, mucho más adelante: es mucho más complejo (ver «Fuera del MVP»).
  - **Escalar raciones y compartir se quedan en el gratuito**: son cálculo local y básicos.
  - **Cuentas aproximadas:** con 1.000 usuarios activos la app cuesta unos 45 $/mes (Supabase Pro,
    VPS e IA) y la cubren unas 27 suscripciones (2,7 %) quitando el 15 % de Google; con 10.000,
    unos 170 $ y un 1 %. El coste fijo se reparte, así que crecer lo pone más fácil.
  - **Red de seguridad, sin código:** un tope de gasto mensual en la consola de Anthropic.

  Queda por decidir cómo se cobra, que es tanto producto como papeles.
