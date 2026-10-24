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
| 8b. «Mejorar con IA» | Por hacer. Falta elegir servicio de retoque: es una decisión, no código |
| 9. Caché offline de lectura | Por hacer. Lo prestado tendrá que borrarse al perder el acceso: nace sabiéndolo |
| 10. Sacar lo personal de `recipes` a `saved_recipes` | **Hecho.** `recipes` es contenido; `saved_recipes` es «mi cocina». Nada de acceso ni revocación todavía |

## Lo último que se estaba haciendo

El **catálogo de imágenes del proyecto**: portadas que cualquier usuaria puede elegir para sus
libros y recetas, curadas por quien desarrolla.

- Bucket público `library-images` y columna `library_image` en `cookbooks` y `recipes`: hechos y
  aplicados en el proyecto.
- Selector de portada, tarjetas que pintan la portada elegida y acción «Crear portada» en los dos
  menús: hechos.
- `npm run covers -- <carpeta>` deja las imágenes cuadradas y en dos tamaños; se suben arrastrando
  al bucket desde el panel.
- **Pendiente: subir imágenes.** Hasta que haya alguna en el bucket, el selector sale vacío.

Y el **logotipo**: `assets/logo.png` (el gorro con el tenedor y la cuchara) ya genera icono,
splash, icono adaptativo de Android y favicon, conectados en `app.json`. Es provisional: el
definitivo lo hará un diseñador, y cambiarlo será sustituir los PNG y volver a generar.

## Antes de dar el MVP por cerrado

Cosas que no son código y que, si no están, dejan la app a medias. Repasar esta lista antes de
decir que el MVP está hecho:

- [x] **Subir las doce imágenes del catálogo** al bucket `library-images`. Hechas el 24 de
      octubre de 2026 y subidas: veinticuatro ficheros en la raíz del bucket, doce en el
      selector. Los originales están en `library/originals/` y los preparados en
      `library/ready/`, ninguna de las dos carpetas en git. El estilo, los cuatro fondos y los
      prompts exactos están en [`library/PROMPTS.md`](../library/PROMPTS.md).
- [ ] **Quitarle el fondo crema al logotipo**, que en modo oscuro se recorta como un cuadrado
      claro. El dibujo se queda: se intentó rehacerlo en el trazo del catálogo y salió sin
      carácter. Es un recorte, no un rediseño.
- [ ] **Icono propio, distinto del logotipo.** Son dos encargos con exigencias contrarias: el
      icono se pinta a 48 px y Android le recorta todo menos el 66 % central, así que pide una
      sola forma maciza —el gorro solo—, mientras que el logotipo pide carácter. El prompt y el
      porqué están al final de [`library/PROMPTS.md`](../library/PROMPTS.md).
- [ ] **Mirar la confirmación de correo** en el panel de Supabase y, si está activada, que la URL
      de redirección apunte a donde corre la app.
- [ ] **Elegir el servicio de retoque** (paso 8b), o dejar «Mejorar con IA» fuera del MVP a
      sabiendas.

## Decisiones abiertas

En `SPEC.md`, sección «Ideas por concretar», están las seis con sus preguntas: buscar por los
ingredientes que tienes, buscar dentro o fuera de tu cocina, el buscador hacia el mundo, la
fila de chips, categorizar recetas y el plan gratuito frente al PRO (~2 €). Además:

- **El diseño de la pantalla principal** está parado a la espera de un diseñador. Por eso los
  recetarios del paso 5 no se han hecho: cambian esa pantalla.
- **Pantalla de registro**: dentro del MVP y sin hacer. Hoy la usuaria se crea a mano en el panel.
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
- **Un borrado bloqueado por una política no da error en Postgres**, simplemente no borra nada: hay
  que pedir de vuelta la fila borrada para saberlo.
