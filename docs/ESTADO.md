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
| 8. Fotos y retoque | **Por hacer.** Es lo siguiente que tocaba |
| 9. Caché offline de lectura | Por hacer. Lo prestado tendrá que borrarse al perder el acceso: nace sabiéndolo |
| 10. Sacar lo personal de `recipes` a `saved_recipes` | **Decidido y por hacer.** Es lo que deja la casa lista para recetas ajenas |

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
- **Lo personal sale de `recipes`** —`notes`, `is_favorite`, `library_image`— a una tabla
  `saved_recipes`, que pasa a ser la definición de «mi cocina». Se hace **en el MVP**, con una
  sola usuaria, porque después cuesta una migración de verdad.
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
