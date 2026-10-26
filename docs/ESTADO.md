# Dónde estamos

Última actualización: 26 de octubre de 2026.

Este documento es el traspaso entre sesiones: qué funciona, qué falta y qué decisiones están
abiertas. El qué y el por qué del producto siguen en [`SPEC.md`](SPEC.md); los comandos, en el
[`README.md`](../README.md) de la raíz; quién compite y en qué nos distinguimos, en
[`MERCADO.md`](MERCADO.md).

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
| 11. Compartir: visor HTML | **Hecho.** Enlace con testigo que caduca a los 30 días, Edge Function pública que arma la página, y dejar de compartir. Falta dominio: Supabase no sirve HTML |

## Lo último que se estaba haciendo

El **catálogo de imágenes del proyecto**: portadas que cualquier usuaria puede elegir para sus
libros y recetas, curadas por quien desarrolla.

- Bucket público `library-images` y columna `library_image` en `cookbooks` y `recipes`: hechos y
  aplicados en el proyecto.
- Selector de portada, tarjetas que pintan la portada elegida y acción «Cambiar portada» en los
  dos menús: hechos. La rejilla del selector se mide sola y llena el ancho que haya.
- **La portada de un libro puede ser una foto propia**, de la cámara o de la galería, en el
  bucket privado `cookbook-covers`. O del catálogo o tuya, nunca las dos: no hay regla de
  precedencia que la usuaria no pueda ver. Las recetas no cambian, ahí la foto es contenido.
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

- [x] **Catálogo de portadas: hecho el 25 de octubre de 2026.** Cuarenta y ocho imágenes —doce
      motivos en cuatro fondos, crema, terracota, oliva y marrón— generadas, revisadas una a una
      y subidas al bucket `library-images`: noventa y seis ficheros, comprobado que cada portada
      tiene su `-small` y que no queda ninguna con el nombre viejo. Los originales están en
      `library/originals/` y los preparados en `library/ready/`, ninguna de las dos en git. Los
      prompts exactos y los ocho fallos que salieron por el camino, con su arreglo, están en
      [`library/PROMPTS.md`](../library/PROMPTS.md); el origen de cada imagen, en
      `library/manifest.json`.
- [ ] **Mirar el selector con las cuarenta y ocho dentro.** Ya se puede ver en la app, que es
      la única forma de decidirlo. `CoverPicker` pinta una rejilla plana sin filtro, y el encargo
      original hablaba de doce justamente por eso; a cambio, la rejilla se mide sola y el nombre
      del fichero lleva el fondo delante, así que salen agrupadas por color. Si se hace pesado
      recorrerlas, el siguiente paso es filtrar por color.
- **El logotipo se queda como está, con su fondo crema.** Se probaron las dos alternativas el 24
  de octubre de 2026 y las dos se descartaron: rehacerlo en el trazo del catálogo salió limpio y
  sin carácter, y recortarle el fondo gustó menos que dejarlo. Que en modo oscuro se vea como un
  cuadrado claro es un precio aceptado, no un pendiente.
- [ ] **Icono propio, distinto del logotipo.** Son dos encargos con exigencias contrarias: el
      icono se pinta a 48 px y Android le recorta todo menos el 66 % central, así que pide una
      sola forma maciza —el gorro solo—, mientras que el logotipo pide carácter. El prompt y el
      porqué están al final de [`library/PROMPTS.md`](../library/PROMPTS.md).
- [x] **Dar al visor un dominio que no sea de Supabase. Hecho el 25 de octubre de 2026.** Se
      sirve en `https://chup-chup.es/r/<testigo>`, que nginx pasa por detrás a la Edge Function
      tirando sus dos cabeceras (`content-type: text/plain` y `content-security-policy: sandbox`,
      que son las que hacían que el enlace se viera como código). Comprobado desde fuera: devuelve
      `text/html`. Ni una línea del código de la función tuvo que cambiar.
- [ ] **Apuntar la *Site URL* a la app cuando se despliegue** (Authentication → URL
      Configuration). La confirmación de correo está **activada** y el circuito entero está
      probado: registrarse, recibir, confirmar y entrar funciona. Lo único pendiente es a dónde
      cae la usuaria *después* de confirmar, que hoy es la URL por defecto y es una página rota.
      La cuenta se confirma igual, porque eso pasa al tocar el enlace. Si algún día tiene que
      volver a un sitio concreto, es el parámetro `emailRedirectTo` en `signUp`.
- [ ] **La hoja no se cierra arrastrando, aunque el gesto está puesto.** `BottomSheet` lleva un
      `Pan` sobre la pestaña desde el 25 de octubre de 2026 y en el móvil no responde; se cierra
      tocando fuera, que sí funciona. Sin diagnosticar: lo primero que hay que mirar es si los
      gestos llegan dentro del `Modal` —hay un `GestureHandlerRootView` propio ahí dentro justo
      para eso— y si la pestaña es un objetivo demasiado pequeño para agarrarla.
- [ ] **Contar en la ficha de la tienda el modo cocina, la lectura sin conexión y que no hay red
      social.** Las tres ya funcionan y hoy no se cuentan en ningún sitio; las dos primeras no las
      tiene la competencia más parecida. Sale del estudio de mercado ([`MERCADO.md`](MERCADO.md)).
- [ ] **Mi cocina recién instalada con algo dentro.** Dos o tres recetas de ejemplo con portada del
      catálogo: es la única primera impresión que hay, y hoy está vacía.

## El despliegue, que es lo siguiente

Hablado el 25 de octubre de 2026. Lo que hay en la mano: el dominio **`chup-chup.es`**, comprado
ese mismo día, y un **VPS listo**. Lo que se quiere: **la web y la app de Android**, las dos.

El orden importa, porque la web desbloquea cosas que hoy están a medias:

1. **El servidor, hecho el 25 de octubre de 2026.** `chup-chup.es` y `www` apuntan a
   `82.165.216.242`; nginx sirve `/var/www/chup-chup.es` y Let's Encrypt da el certificado, con
   redirección de `http` a `https` y renovación automática probada. El sitio vive en
   `/etc/nginx/sites-available/chup-chup.es`.
   **La web está arriba y funciona**, probada en el navegador. Desplegar es esto, desde el
   portátil:

   ```
   npm run build:web
   rsync -az --delete dist/ deploy@82.165.216.242:/var/www/chup-chup.es/
   ```

   `build:web` y no `expo export` a secas: `expo export` escribe `<html lang="en">` en la portada
   y no hay forma de cambiarlo desde la configuración (`app/+html.tsx` solo vale si la salida web
   es `static`, y la nuestra es `single`), así que `scripts/exportWeb.ts` lo corrige después de
   compilar. Y con `https` de verdad quedan arreglados la hoja de compartir del móvil y el
   portapapeles del enlace, que fallaban por ir sin cifrar.
2. **El visor, hecho el mismo día.** `/r/<testigo>` en nginx, con las cabeceras de Supabase
   tiradas. Ver el punto de arriba.
3. **Android, empezado el 26 de octubre de 2026 y aparcado.** EAS está montado: sesión `sonhja`,
   proyecto en la organización `sonhjas-team` (el `projectId` está en `app.json`), `eas.json` con
   los perfiles `development`, `preview` (APK) y `production` (AAB), cada uno con su entorno, y
   `expo-dev-client` instalado. La primera *development build* compiló e instaló, pero no se
   llegó a usar. **Para retomarla:** una development build sola no hace nada, carga el código
   del portátil, así que necesita `npx expo start --dev-client` en marcha y el móvil en la misma
   wifi. Quitado de paso el permiso de micrófono que metía `expo-image-picker`
   (`microphonePermission: false`), que Play habría pedido justificar.
   Lo que marca el calendario no es el código: una cuenta de desarrollador personal nueva
   necesita **doce probadores durante catorce días** antes de poder publicar. Eso se empieza
   pronto o se espera dos semanas al final.

## Entrar con Google: la web hecha, falta el móvil

Decidido el 26 de octubre de 2026: la gente tiene que poder entrar con Google, y se hace **nativo
en el móvil y con redirección en la web** (opción A). En el móvil sale el selector de cuentas
del sistema, que es un toque; por el navegador Google enseñaría «Continuar a `xxxx.supabase.co`»,
y quitar eso cuesta unos 10 $/mes.

**En la web, hecho el 26 de octubre de 2026**, probado en local y desplegado en `chup-chup.es`:
`GoogleSignIn` (el botón y el «o con tu correo», en entrar y en crear cuenta), `signInWithGoogle`,
`oauthReturnUrl` y `detectSessionInUrl` solo en la web. En el móvil el botón no se pinta todavía.
Configurado: proyecto «Chup Chup» en Google Cloud con un cliente OAuth *Aplicación web*
(orígenes `https://chup-chup.es` y `http://localhost:8081`, redirección al callback de Supabase),
el proveedor Google activado en Supabase, y *Site URL* y *Redirect URLs* a `https://chup-chup.es`
y `http://localhost:8081`, sin barra al final.

**Después, para el móvil:** `@react-native-google-signin/google-signin`, que entrega un token a
`supabase.auth.signInWithIdToken`. Pide un segundo cliente OAuth de tipo *Android* con el paquete
`es.chupchup.app` y la huella SHA-1 de la firma (`npx eas-cli credentials -p android`), y otro más
cuando Play firme la app con su propia clave. Solo funciona en una development build, no en
Expo Go.

**Antes de publicar:** la «G» del botón es de un solo color y las normas de marca de Google piden
la de cuatro colores, que necesita `react-native-svg`. Y la política de privacidad tiene que decir
que con Google se recibe el nombre y el correo. **Para iOS, más adelante:** si se ofrece entrar con
Google, Apple obliga a ofrecer también «Iniciar sesión con Apple».

Una cuenta creada con correo y otra con Google del mismo correo se unen solas en Supabase. El
nombre llega en `user_metadata.name`, que es de donde ya sale la firma, pero completo, con
apellidos.

### Lo que ya está decidido

- **El dominio es `chup-chup.es`**, comprado el 25 de octubre de 2026. La web cuelga de la raíz y
  el visor de `/r/<testigo>`. Se acabó la duda de si colgar de `soniadev.es`: no hay que mudarse
  después ni mantener redirecciones vivas.
- **El identificador del paquete de Android es `es.chupchup.app`**, y **no se puede cambiar
  nunca**: una vez publicada en Play, cambiarlo es publicar otra app y dejar sin actualizaciones a
  quien tenga la primera. No se ve en pantalla —el nombre visible sí se cambia cuando se quiera—,
  pero sale en la URL de la ficha. **Va sin guion a propósito y no es un descuido**: un
  identificador de paquete no admite guiones, así que `es.chup-chup` no es válido y el dominio no
  se puede copiar tal cual. Ya está en `app.json`, en Android y en iOS.

### Lo que hay que decidir antes de la primera compilación
- **La base del enlace del visor es configuración, hecho el 25 de octubre de 2026:**
  `EXPO_PUBLIC_SHARE_BASE_URL=https://chup-chup.es`, y sin ella se cae a la URL de la Edge
  Function.

**Decidido el 25 de octubre de 2026: etiquetas `og:` en el visor**, para que al pegar el enlace en
WhatsApp salga la tarjeta con la foto y el título en vez de una línea de texto. Se hacen al colgar
el visor del dominio, que es cuando el enlace empieza a repartirse: es el paso 12 del plan.

## Decisiones abiertas

En `SPEC.md`, sección «Ideas por concretar», está la lista con sus preguntas, y ahí se le ha
sumado **meterle mucha caña al modo cocina**. Dos cambiaron de estado el 25 de octubre de 2026 con
el estudio de mercado: **buscar por los ingredientes que
tienes** pasa a «se hace», con la forma por estudiar, y **buscar recetas de otras personas** pasa a
«se hace en la fase 2», pero solo sobre lo que su dueña haya marcado como público. Lo que sí se
cerró en no es **ser una comunidad**: feed, perfiles y likes. Además:

- **El diseño de la pantalla principal** está parado a la espera de un diseñador. Por eso los
  recetarios del paso 5 no se han hecho: cambian esa pantalla.
- **Compartir se parte en dos el 24 de octubre de 2026**: el **visor HTML entra en el MVP**
  como paso 11, y **abrir la receta dentro de la app se queda en la fase 2**, porque eso sí
  toca el modelo de permisos entero. La pasarela de recetarios de pago sigue siendo fase 3.

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
