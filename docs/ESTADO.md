# Dónde estamos

Última actualización: 24 de octubre de 2026.

Este documento es el traspaso entre sesiones: qué funciona, qué falta y qué decisiones están
abiertas. El qué y el por qué del producto siguen en [`SPEC.md`](SPEC.md); los comandos, en el
[`README.md`](../README.md) de la raíz.

## El plan de trabajo, a día de hoy

| Paso | Estado |
| --- | --- |
| 1. Esquema Zod y prompt de estructuración | Hecho, con seis fixtures grabados que los tests comprueban sin red |
| 2. Proyecto Supabase: tablas, RLS y Storage | Hecho |
| 3. Edge Function de estructuración | **Hecho y desplegado.** Haiku por defecto, Sonnet de rescate, prompt cacheado, tope por cocinera y día |
| 4. App Expo: crear, revisar, listar y ver receta | Hecho |
| 5. Mi cocina | Libros, favoritas, búsqueda y reordenación arrastrando, hechos. **Faltan los recetarios** (las carpetas que agrupan libros) |
| 6. Búsqueda por título e ingrediente | Hecho, y además busca libros por su nombre. Las recetas de los resultados traen su menú: portada, añadir a un libro y borrar |
| 7. Notas personales y modo cocina | Hecho |
| 8a. Foto de la receta | **Hecho.** Cámara o galería, encogida, a un bucket privado que se lee con URLs firmadas |
| 8b. «Mejorar con IA» | **Fuera del MVP**, para una fase final. El esquema ya lo contempla, así que entrar después no cuesta nada |
| 9. Caché offline de lectura | **Hecho.** Recetas, libros y pertenencias en el disco del móvil; las fotos fuera. Al cerrar sesión se borra |
| 10. Sacar lo personal de `recipes` a `saved_recipes` | **Hecho.** `recipes` es contenido; `saved_recipes` es «mi cocina». Nada de acceso ni revocación todavía |

## Lo último que se estaba haciendo

El **catálogo de imágenes del proyecto**: portadas que cualquier usuaria puede elegir para sus
libros y recetas, curadas por quien desarrolla.

- Bucket público `library-images` y columna `library_image` en `cookbooks` y `recipes`: hechos y
  aplicados en el proyecto.
- Selector de portada, tarjetas que pintan la portada elegida y acción «Crear portada» en los dos
  menús: hechos.
- `npm run covers -- library/originals` deja las imágenes cuadradas y en dos tamaños; se suben
  con el CLI, una a una y a la raíz del bucket, como explica `library/README.md`.
- **Las doce primeras están dentro**: dibujo a línea, dos colores, sobre cuatro fondos de la
  paleta, y el selector ya las pinta. Hizo falta una política de lectura sobre `storage.objects`:
  el bucket era público y aun así la lista llegaba vacía.

Y el **logotipo**: `assets/logo.png` (el gorro con el tenedor y la cuchara) ya genera icono,
splash, icono adaptativo de Android y favicon, conectados en `app.json`. Es provisional: el
definitivo lo hará un diseñador, y cambiarlo será sustituir los PNG y volver a generar.

## Antes de dar el MVP por cerrado

Cosas que no son código y que, si no están, dejan la app a medias. Repasar esta lista antes de
decir que el MVP está hecho:

- [ ] **Terminar el catálogo: doce motivos en cuatro fondos, cuarenta y ocho imágenes.** Las
      doce primeras se generaron y subieron el 24 de octubre de 2026 —veinticuatro ficheros en la
      raíz del bucket, doce en el selector— pero con los nombres viejos (`drawn-<motivo>.jpg`).
      Al ampliar el catálogo, el nombre pasó a ser **`<fondo>-<motivo>.jpg`** para que el selector
      las agrupe por color, así que **esas veinticuatro hay que borrarlas del bucket y volver a
      subirlas renombradas**, o quedarán duplicadas. Los originales renombrados están en
      `library/originals/` y `npm run covers` los deja en `library/ready/`; ninguna de las dos
      carpetas va en git. Los prompts de las cuarenta y ocho están en
      [`library/PROMPTS.md`](../library/PROMPTS.md), con una marca en las doce ya hechas.
- [ ] **Decidir si el selector aguanta cuarenta y ocho.** `CoverPicker` pinta una rejilla plana
      sin filtro ni agrupación, y el encargo original hablaba de doce justamente por eso. El
      nombre del fichero lleva el fondo delante para que al menos salgan por color; si se hace
      pesado, hay que filtrar por color en el selector.
- **El logotipo se queda como está, con su fondo crema.** Se probaron las dos alternativas el 24
  de octubre de 2026 y las dos se descartaron: rehacerlo en el trazo del catálogo salió limpio y
  sin carácter, y recortarle el fondo gustó menos que dejarlo. Que en modo oscuro se vea como un
  cuadrado claro es un precio aceptado, no un pendiente.
- [ ] **Icono propio, distinto del logotipo.** Son dos encargos con exigencias contrarias: el
      icono se pinta a 48 px y Android le recorta todo menos el 66 % central, así que pide una
      sola forma maciza —el gorro solo—, mientras que el logotipo pide carácter. El prompt y el
      porqué están al final de [`library/PROMPTS.md`](../library/PROMPTS.md).
- [ ] **Apuntar la *Site URL* a la app cuando se despliegue** (Authentication → URL
      Configuration). La confirmación de correo está **activada** y el circuito entero está
      probado: registrarse, recibir, confirmar y entrar funciona. Lo único pendiente es a dónde
      cae la usuaria *después* de confirmar, que hoy es la URL por defecto y es una página rota.
      La cuenta se confirma igual, porque eso pasa al tocar el enlace. Si algún día tiene que
      volver a un sitio concreto, es el parámetro `emailRedirectTo` en `signUp`.

## Decisiones abiertas

En `SPEC.md`, sección «Ideas por concretar», están las seis con sus preguntas: buscar por los
ingredientes que tienes, buscar dentro o fuera de tu cocina, el buscador hacia el mundo, la
fila de chips, categorizar recetas y el plan gratuito frente al PRO (~2 €). Además:

- **El diseño de la pantalla principal** está parado a la espera de un diseñador. Por eso los
  recetarios del paso 5 no se han hecho: cambian esa pantalla.
- **Compartir sigue siendo fase 2**, y la pasarela de recetarios de pago es una fase 3 nueva.
  Nada de eso se construye ahora; está descrito en `SPEC.md` para no cerrarle la puerta.

## Lo que se decidió el 24 de octubre de 2026

Una ronda de preguntas sobre el borrado acabó en otro sitio: **una receta de otra persona es
acceso, nunca propiedad**. Está entera en la sección «Recetas ajenas» de `SPEC.md`, y lo que
hay que recordar es esto:

- **Borrar sigue siendo un `delete` de verdad**, y cuando haya recetas ajenas se notará en
  todas las cocinas que la tenían. Nada de `deleted_at`.
- **Lo personal ya salió de `recipes`** —`notes`, `is_favorite`, `library_image`— a la tabla
  `saved_recipes`, que es la definición de «mi cocina». Hecho el mismo día: con una sola
  usuaria, el traslado fue un `insert … select`.
- **La foto es contenido y viaja con la receta**; la portada que le pone cada cocinera es suya
  y manda sobre la de la dueña.
- Apareció una **fase 3**: la app como pasarela de recetarios de pago entre un cocinero y quien
  se suscribe. Cobrar trae IVA, reembolsos y reparto: el precio no está en lo técnico.

## Lo que se aprende por las malas

- **Tocar el prompt o `src/domain` obliga a volver a desplegar la Edge Function**: viajan dentro
  de ella. Si no, la app sigue con la versión vieja y vuelves loca buscando el fallo.
- **Después de `db push`, `npm run types:db`.** Los tipos de la base son generados.
- **Después de tocar el prompt, regrabar los fixtures**, o los tests defienden el comportamiento
  viejo y tapan el arreglo.
- **Nunca tapar el error real con un mensaje amable.** Nos ha costado tiempo tres veces: en el
  login, al guardar y al llamar a la IA. Lo que falla tiene que decir por qué.
- **Un bucket público no es un bucket listable.** «Público» solo quiere decir que sus ficheros se
  bajan por URL sin credenciales; listarlos pasa por `storage.objects`, que tiene RLS, y sin
  política de lectura la app recibe una lista vacía sin error ninguno. Le pasó al catálogo de
  portadas: las doce imágenes estaban subidas y el selector seguía vacío.
- **Un borrado bloqueado por una política no da error en Postgres**, simplemente no borra nada: hay
  que pedir de vuelta la fila borrada para saberlo.
