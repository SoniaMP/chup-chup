# Estudio de mercado

Hecho el 25 de octubre de 2026. Punto de partida: Fava (`fava-app.com`), y a partir de ahí las
apps de recetario que sí compiten con Chup Chup.

Esto no es una lista de funciones que haya que construir. Es el mapa del terreno: quién hay, qué
da por hecho el mercado, qué hueco queda libre y cuál de nuestras decisiones es un foso y cuál es
solo una carencia con buena excusa. Lo que de aquí salga y se decida, se escribe en
[`SPEC.md`](SPEC.md); lo que quede abierto, en «Ideas por concretar».

## La conclusión, primero

**Hay competencia y es sana.** Sana quiere decir dos cosas: que la demanda está demostrada —hay
apps con 54.000 y 320.000 valoraciones viviendo de esto— y que **nadie ocupa nuestro sitio**. El
mercado está troceado en cuatro negocios distintos que la gente confunde porque todos hablan de
recetas:

| Negocio | Quién | Pregunta que resuelve |
| --- | --- | --- |
| Gestor de recetario | Paprika, Crouton, Mela | «Tengo recetas por todas partes y las quiero juntas» |
| Capturador social | ReciMe | «He visto una receta en Instagram y la quiero guardar» |
| Planificador con IA | Samsung Food | «Dime qué ceno esta semana y hazme la compra» |
| Comunidad | Cookpad | «Quiero ver qué cocinan los demás» |

**Fava no es ninguno de los cuatro y tampoco es competencia nuestra**: es un diario social de
cocina, el Strava de los fogones. Compite por el momento *después* de cocinar. Nosotras competimos
por el momento *antes y durante*.

**La competencia real es ReciMe**, y tiene sección propia en este documento: 757 valoraciones en
España, en español, y hace casi todo lo que a nosotras nos falta. La línea que nos separa es que
ella captura recetas que ya existen en una pantalla y nosotras ordenamos las que no están escritas
en ninguna parte.

Lo que tenemos y nadie más junta: **estructurar texto escrito deprisa y mal guardando el
original**, **organización tipo Spotify** y **acceso en vez de propiedad**. Sobre eso se puede
construir una marca.

Lo que nos falta y el mercado da por hecho: **importar de una URL**, **escalar raciones** y, más
adelante, **lista de la compra**. Y un cuarto, el más incómodo: **hoy no hay ningún motivo para
abrir la app mañana**.

## Fava, a fondo

Lo que es: diario de cocina con feed social. Su lema, *«Cook. Log. Share.»*; su promesa,
*«Photograph your meals, save recipes, and share your cooking journey with the people you love»*.

| | |
| --- | --- |
| Quién la hace | Ezer Moysis, en solitario |
| Desde | Primera versión el 20 de marzo de 2026; la 2.3.0, el 7 de junio |
| Dónde | iOS y Android |
| Idiomas | **Solo inglés** |
| Precio | Gratis, sin compras dentro ni suscripciones |
| Tracción | 1-3 valoraciones en App Store y fuera del top 30 de Food & Drink en EE. UU. |

### Sus once funciones, una a una

| Función | Qué hace | ¿La tenemos? |
| --- | --- | --- |
| *Snap & log* | Foto del plato, nombre y descripción, al diario. Dice que en menos de 20 segundos | No, y no la queremos |
| *Save recipes* | **Importar de una URL con un toque**, ingredientes y pasos extraídos solos | **No. Es nuestro hueco más grande** |
| *Every recipe, beautifully saved* | Importar de la web, **fotografiar la página de un libro** y **extraer la receta de fotos del plato con IA** | No |
| *Cook together* | Seguir a gente, ver qué cocinan, invitar a colaborar en un plato | No, y es fase 2 en otra forma |
| *Track your streak* | Racha diaria, objetivos semanales, estadísticas | No, y **no copiar** |
| *Discover recipes* | Buscar entre quienes sigues por plato, ingrediente o dieta | Fase 2 («buscador hacia el mundo») |
| *Share your cooks* | **Tarjetas de compartir generadas solas** para Stories y WhatsApp | No: compartimos una línea de texto pelada |
| *Your feed, your community* | Feed de amistades con «foodos», comentarios y guardados. *«No ads, no algorithms»* | No, y no la queremos |
| *Log a cook in seconds* | Registro rápido con etiquetado de con quién cocinaste | Parecido a «La he hecho», fase 2 |
| *Discover what others are cooking* | Recetas en tendencia dentro de tu red | Fase 2 |
| *Build your cooking profile* | Perfil público con historial, estadísticas y recetas guardadas | No, y no la queremos |

Organiza con **etiquetas y géneros planos**, sin carpetas ni listas. Tiene modo oscuro, multifoto
y respuestas a comentarios desde la 2.3.0.

### Su stack es exactamente el nuestro

Su política de privacidad lo dice: **Supabase** (autenticación, base de datos y ficheros, alojado
en la UE), **Expo** para las notificaciones, **Sentry** para errores y **PostHog** para analítica
anónima. Borrado de cuenta desde Ajustes, «permanente e inmediato».

Eso es lo más útil de todo el estudio, y no es una función:

- **Una persona sola con nuestras mismas herramientas llega a las dos tiendas en unos meses.**
  Construir esto no es el foso. El foso es a quién se lo cuentas y por qué te elige.
- **Y publicar no es llegar.** Está en las dos tiendas desde marzo, con 1-3 valoraciones. La parte
  difícil empieza después de la primera compilación.
- Su política de privacidad **no menciona la IA** aunque su web la anuncia. Nosotras tenemos que
  decir qué sale del móvil, a dónde va y qué se guarda, porque el texto de la receta sí viaja a un
  proveedor.

### Lo que Fava hace mejor que nosotras, sin discusión

1. **Importar de una URL.** Un toque, y la receta dentro.
2. **Fotografiar la página de un libro.** La misma tubería que ya tenemos, con una imagen en vez
   de texto.
3. **Tarjetas de compartir.** Su enlace se ve bonito en WhatsApp; el nuestro es una línea de texto.
4. **Un motivo para volver mañana.** Racha, objetivos y feed. No queremos los tres, pero sí lo que
   resuelven.
5. **Onboarding.** La 2.3.0 trae un tour de bienvenida. Nuestra cocina recién instalada está vacía.

### Lo que no hay que copiarle

**Rachas, objetivos, likes, perfil público y feed.** No es que sean malos: es que son *otra app*.
Fava presume de no tener anuncios ni algoritmo y aun así te mide por constancia. Un recetario
donde nadie ve lo que cocinas es una promesa distinta y más fácil de cumplir.

Tampoco **multifoto ni fotos por paso**, ya fuera del MVP por buenas razones.

## Las apps con las que de verdad competimos

| | Plataformas | Precio | Importar URL | Escalar raciones | Modo cocina | Lista de la compra | Planificador | Social | Español | Offline |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Chup Chup** | iOS, Android, web | Gratis (PRO ~2 € por decidir) | **No** | **No** | Sí | **No** | No | No, por diseño | **Sí, nativo** | Sí (lectura) |
| Paprika 3 | iOS, Android, Mac, Windows | 4,99 $ iOS · 29,99 $ escritorio, pago único por plataforma | Sí | Sí | Sí | Sí, por pasillos | Sí, con menús reutilizables | No | Sí (16 idiomas) | Sí |
| Crouton | Solo Apple (iPhone, iPad, Mac, Watch, Vision) | Gratis + *Crouton Plus* 24,99 $ y *Discover* 1,99 $/mes o 14,99 $/año | Sí, y PDF, texto y `schema.org` | Sí, por multiplicador, raciones o ingrediente | Sí, manos libres y con temporizadores | Sí, a Recordatorios de Apple | Sí, y los genera solo | No | **No** (inglés, francés, alemán) | Sí (iCloud) |
| Mela | Solo iOS y Mac | Pago único (no lo dice su web) | Sí, con navegador propio y RSS | No lo dice | Sí, muy cuidado | Sí, a Recordatorios | Sí, al Calendario | No | No lo dice | Sí (iCloud) |
| ReciMe | iOS, Android, web y extensión de Chrome | Gratis con 5 importaciones por semana + *Plus* 34,99-39,99 €/año | **Sí, y de Instagram, TikTok, YouTube, Pinterest y fotos de recetas a mano** | Sí | Sí | Sí, por pasillos y con pedido a domicilio | Sí, y *Magic Meal Plan* | No | **Sí** | No lo dice |
| Samsung Food | iOS, Android, web | Gratis + *Food+* 6,99 $/mes o 59,99 $/año | Sí | Sí | Sí, con IA en *Food+* | Sí, compartida | Sí, con IA en *Food+* | Sí, comunidades | Sí | No lo dice |
| Cookpad | iOS, Android, web | Gratis + *Premium* mensual | No es su negocio | No | No | No | No | **Sí, es su negocio** | **Sí, es su casa** | No |

Cifras que ponen cada una en su sitio: **Paprika, 54.000 valoraciones con 4,9**; **ReciMe,
320.000 con 4,8**; **Crouton, 2.900 con 4,8**; **Cookpad, unos 6 millones de recetas** subidas por
su gente; **Fava, 1-3 valoraciones**.

Lo que hay que leer de cada una:

- **Paprika** es la medida del valor. Cinco euros, pago único, en español, con despensa,
  planificador, listas por pasillos y lectura sin conexión. Cualquier precio nuestro se compara con
  ese. Hay una Paprika 4 en beta abierta con suscripción opcional, según terceros: si el referente
  del pago único se pasa a la suscripción, nos deja sitio.
- **Crouton** es nuestra vecina más peligrosa en producto y la más inofensiva en mercado: hace casi
  todo lo que querríamos hacer y lo hace fino —temporizadores detectados en los pasos, escalado por
  ingrediente, básculas bluetooth, Siri— pero **solo existe en Apple y no está en español**. Es la
  prueba de que este producto se puede vender bien, y la prueba de que el hueco en español sigue ahí.
- **Mela** es el espejo de nuestro tono: sin red social, sin IA, las cosas bien hechas y en su
  sitio. También la advertencia: solo Apple, y su integración con Recordatorios y Calendario es un
  foso que nosotras, siendo multiplataforma, no podemos cavar.
- **ReciMe** es la competencia de verdad y tiene sección propia aquí abajo.
- **Samsung Food** marca el techo de precio del mercado (59,99 $/año) y lo que se puede cobrar: la
  IA de verdad —planes semanales, despensa, nutrición— está detrás del muro. Confirma la regla del
  `SPEC`: estructurar no se cobra, lo caro sí.
- **Cookpad** es el dueño del español y de la comunidad. Es la razón por la que nuestra fase 2 no
  debe intentar ser una plaza pública: ese sitio está ocupado por seis millones de recetas.

## ReciMe, que es la competencia de verdad

Reconocido el 25 de octubre de 2026, después del primer repaso: es la app contra la que de verdad
nos van a comparar, no Fava.

| | |
| --- | --- |
| Quién | ReciMe Pty Ltd, Australia |
| Dónde | iOS, Android, web y extensión de Chrome |
| Idiomas | Español, inglés, francés, alemán y portugués |
| Tamaño | Dice «15 millones de cocineras» en su web. Más de un millón de instalaciones en Android con 4,7; unas 320.000 valoraciones en la ficha estadounidense de App Store con 4,8 |
| **En España** | **757 valoraciones con 4,7, y las reseñas están escritas en español.** Aquí ya está |
| Precio | Gratis con **5 importaciones «inteligentes» por semana**. *ReciMe Plus*: 34,99-39,99 € al año, con 22,99 € y 7,99 € entre las opciones. Prueba de 7 días **con tarjeta por delante** |

### Qué hace, y hay que reconocérselo

Su trabajo es uno y lo hace mejor que nadie: **capturar una receta que ya existe en una pantalla
ajena**. Importa de Instagram, TikTok, Facebook, YouTube y Pinterest, de una URL, de capturas de
pantalla, de notas, Google Docs, Notion y Evernote, y **también de fotos de recetas escritas a
mano**. Encima lleva planificador semanal, *Magic Meal Plan*, listas de la compra por pasillos con
pedido a domicilio, nutrición calculada, escalado de raciones, conversión de unidades, modo paso a
paso con la pantalla encendida y libros de recetas.

Dicho de otro modo: **hace todo lo que a nosotras nos falta, y en español.**

### Dónde le duele

Esto no es opinión, está en sus reseñas y en los análisis del sector:

- **El plan gratuito es un escaparate, no un plan.** Cinco importaciones por semana en una app
  cuyo motivo de existir es importar. Hay reseñas de gente que se la desinstaló diciendo que
  deberían avisar de que no se puede usar sin pagar.
- **La prueba pide la tarjeta por delante**, y eso le ha generado un hilo constante de reseñas de
  cobros tras intentar cancelar.
- **Solo suscripción.** Varias reseñas que por lo demás la adoran dicen lo mismo: querrían pagar
  una vez.
- **La lista de la compra no suma ingredientes repetidos**, ni cuando la misma receta está
  planificada dos veces, y lo que cae en la categoría equivocada no se puede mover.
- **El planificador y la lista no están conectados**: si cambias la receta o las raciones, la
  lista no se entera y te vas a comprar con datos viejos.
- Hay una reseña, una sola y sin respuesta, de alguien que perdió todas sus recetas después de
  pagar el plan anual. Como dato aislado no prueba nada; como miedo del público, existe.

### Por dónde la ganamos

Por orden de cuánto le costaría a ella copiarlo:

1. **Por la receta que no está escrita en ninguna parte.** ReciMe captura lo que ya existe en una
   pantalla. Para una receta tuya te da un formulario en blanco, como todas. Lo nuestro es «pollo,
   un chorrito de vino, al horno hasta que esté» convertido en receta, con las cantidades vagas
   normalizadas y los supuestos declarados. **Ella transcribe; nosotras interpretamos.** Es lo único
   que no puede añadir sin cambiar lo que es.
2. **Por el precio y por la honestidad del plan gratuito.** Su herida más grande es nuestra regla
   escrita: estructurar no se va al PRO en ningún caso, y lo que se limita es el volumen, no el
   acceso. En la nuestra puedes crear recetas gratis; en la suya, cinco a la semana. Y sin tarjeta
   por delante. Esto ya está decidido y no cuesta una línea de código: lo que falta es **decirlo**.
3. **Porque lo tuyo es tuyo y te lo puedes llevar.** Su negocio vive del encierro; el nuestro no.
   Guardamos `raw_input`, leemos sin conexión y la regla de la casa es «acceso, nunca propiedad».
   **Exportar el recetario entero** es barato para nosotras y es una promesa que ella no puede
   hacer sin tocarse el bolsillo.
4. **Por la lista de la compra, si algún día se hace.** Ahí su fallo es nuestro punto fuerte
   técnico: sumar ingredientes repetidos exige nombres y unidades normalizados, que es exactamente
   lo que nuestra IA ya devuelve y lo que ella no tiene. Si se hace, el listón está puesto: suma
   duplicados y se recalcula al cambiar las raciones.
5. **Por la organización.** Sus libros son planos, por tipo de comida o cocina. Recetarios, libros
   y orden manual son más expresivos, y es la mitad de nuestra promesa.
6. **Porque los datos están en Europa.** Ella es una empresa australiana con suscripción; nosotras,
   Supabase en la UE. Pequeño, pero en España se cuenta.

### Dónde no hay que pelear

**En el importador.** Un millón de instalaciones en Android, extensión de Chrome y un extractor
afinado sobre millones de publicaciones. Importar de una URL entra porque es lo mínimo que se
espera (paso 13), pero **no puede ser nuestra promesa**: ahí se pierde.

Tampoco en nutrición, ni en planificador semanal, ni en pedido a domicilio. Son otro producto.

### La frase que sale de aquí

**ReciMe es para las recetas de internet. Chup Chup es para las recetas que no están en internet:
las tuyas y las de tu familia.** Si eso se sostiene, no competimos; nos repartimos.

### Lo que esto corrige de este mismo documento

**ReciMe ya importa fotos de recetas escritas a mano.** El paso 15 se escribió aquí diciendo que
digitalizar la libreta de la abuela era terreno libre, y no lo es. Sigue valiendo la pena, pero la
diferencia no puede ser *capturar* la foto: tiene que ser lo que hacemos con ella —entender «un
vaso de los de agua» y declarar lo que hemos supuesto—, que es lo mismo que nos distingue en el
texto libre.

## Lo que el mercado da por hecho

Lo que aparece en todas y por tanto no distingue, solo se echa de menos:

| Función | Quién la tiene | Nosotras |
| --- | --- | --- |
| Importar de una URL | Todas menos nosotras | **No** |
| Escalar raciones | Paprika, Crouton, ReciMe, Samsung | **No** |
| Convertir unidades | Paprika, Crouton, ReciMe | No |
| Modo cocina con pantalla encendida | Paprika, Crouton, Mela, ReciMe | **Sí** |
| Temporizadores detectados en los pasos | Crouton, Paprika, Mela | No |
| Lista de la compra | Paprika, Crouton, Mela, ReciMe, Samsung | No |
| Categorías o carpetas | Todas | A medias: libros y recetarios sí, categorías por decidir |
| Lectura sin conexión | Paprika, Crouton, Mela | **Sí** |
| Escanear la página de un libro | Crouton, Mela, Fava | No |

Dos de esas ya las tenemos y no las estamos contando en ninguna parte: **modo cocina** y **lectura
sin conexión**. Las cocinas tienen mal wifi; eso va en la ficha de la tienda.

## Lo que solo tenemos nosotras

Cuatro cosas, y ninguna es una función que se pueda añadir en una tarde a la app de otro:

1. **Escribes deprisa y mal, y sale ordenado.** Todas las demás importan recetas *ya escritas*:
   una URL, una página de libro, un vídeo. Ninguna resuelve **el texto que escribes tú** —«pollo,
   un chorrito de vino, al horno hasta que esté»—, que es como está escrita la mitad de la cocina de
   una casa. El *Full Recipe mode* de Fava y el formulario de Paprika te hacen rellenar campos.
2. **Guardamos lo que escribiste.** `raw_input` se queda, y la IA declara sus supuestos en
   `assumptions`. Nadie en la categoría conserva el original. Eso merece verse en la pantalla de la
   receta: un «ver lo que escribí».
3. **Organización tipo Spotify.** Recetarios, libros y orden manual con *fractional indexing*.
   Enfrente hay etiquetas planas (Fava), categorías y subcategorías (Paprika) o libros por tipo de
   comida (ReciMe). Lo nuestro es más expresivo y es la mitad de la promesa de la app.
4. **Acceso, nunca propiedad.** Esto no es una función, es la forma de las tablas, y es el único
   foso difícil de copiar. Un diario de publicaciones como Fava no puede convertirse en pasarela de
   recetarios de pago sin reescribirse. Nosotras ya estamos construidas para eso.

Y dos ventajas de mercado que tenemos sin trabajar:

- **Español de España de verdad.** Crouton no está en español. Fava, solo en inglés. Pero cuidado:
  Paprika, ReciMe, Samsung Food y Cookpad sí. Estar traducida no distingue; **entender el idioma**
  sí: el chorrito, el vaso de los de agua, la cucharada colmada y el punto de sal. Normalizar
  cantidades vagas en español es exactamente lo que ya hace nuestro prompt, y es el único sitio
  donde el idioma es producto y no traducción.
- **Sin red social, por diseño.** En 2026 eso se puede decir en voz alta y es una promesa, no una
  carencia: aquí nadie ve lo que cocinas.

## Nuestros huecos, por orden de valor contra coste

| # | Hueco | Por qué importa | Coste |
| --- | --- | --- | --- |
| 1 | **Importar de una URL** | Lo tienen todas. Hoy, para guardar una receta de un blog, hay que copiarla a mano | Bajo: la Edge Function ya convierte texto en receta validada; falta traer el HTML y limpiarlo antes del prompt |
| 2 | **Escalar raciones** | La función más querida de las apps tipo Paprika. Ni Fava la tiene | Muy bajo: ya hay `servings` y `quantity` numérico |
| 3 | **Foto de una página o de una receta a mano** | En España no es «importar»: es digitalizar la libreta de la abuela. Carga emocional que ninguna de las grandes toca | Bajo: el modelo ya es multimodal y el esquema y la validación están puestos |
| 4 | **Un motivo para volver** | Un recetario se escribe una vez y se lee poco. Es nuestra debilidad real | Medio: «La he hecho» (fecha y nota) es la versión sobria, sin rachas ni likes |
| 5 | **Etiquetas `og:` en el visor** | El canal de crecimiento más barato que tiene la app. Fava hace tarjetas; nosotras, una línea de texto | Muy bajo, y el visor ya existe |
| 6 | **Buscar por lo que tengo en la nevera** | Ya está en «Ideas por concretar». Samsung lo cobra; media docena de apps nuevas viven solo de esto | Medio |
| 7 | **Categorías de vocabulario cerrado** | Las etiquetas libres de Fava no filtran nada útil: confirma que la lista cerrada era lo correcto | Medio |
| 8 | **Temporizadores en los pasos** | Crouton, Paprika y Mela los detectan solos. Es el momento de los fogones, que es nuestro terreno | Bajo dentro del modo cocina |
| 9 | **Primera pantalla con algo dentro** | Fava añadió un tour en la 2.3.0. Mi cocina recién instalada no tiene nada que enseñar | Muy bajo: dos o tres recetas de ejemplo con portada del catálogo |
| 10 | **Lista de la compra** | Es la razón número uno para abrir una app de recetas a diario, y la vende todo el mundo menos Fava | Alto, y fuera del MVP. Mejor candidata a PRO que el retoque de foto |

## Qué cobra cada una

| App | Modelo | Precio |
| --- | --- | --- |
| Fava | Gratis | Sin suscripciones |
| Paprika 3 | Pago único por plataforma | 4,99 $ iOS · 29,99 $ Mac o Windows · Android gratis hasta 50 recetas |
| Crouton | Gratis + desbloqueo + suscripción | *Plus* 24,99 $ · *Discover* 1,99 $/mes o 14,99 $/año |
| ReciMe | Suscripción | Entre 29,99 $ y 59,99 $, con 7 días de prueba |
| Samsung Food | Gratis + *Food+* | 6,99 $/mes o 59,99 $/año, variable por país |
| Cookpad | Gratis + *Premium* | Mensual, disponible en España |
| Cookidoo (Thermomix) | Suscripción con colecciones de pago | Unos 60 €/año |

Lo que esto dice del PRO de ~2 € del `SPEC`: **el precio está bien elegido y por debajo de todo el
mercado**, pero el techo es mucho más alto de lo que estamos pidiendo. Dos avisos:

- **El pago único de Paprika es la referencia contra la que nos van a comparar**, no la suscripción
  de ReciMe. Cinco euros y para siempre, en español, con planificador y listas.
- **Lo que hoy pensamos cobrar —el retoque de foto con IA— es lo que menos se paga de esta lista.**
  Nadie cobra por mejorar una foto. Se cobra por planificar, por la lista de la compra, por la
  nutrición y por el acceso a recetarios ajenos. Conviene revisarlo cuando toque.

## Fase 3: ya hay quien lo hace, y se le puede copiar los deberes

La pasarela de recetarios de pago no es una idea sin precedentes: **Cookidoo**, la de Thermomix,
cobra unos 60 € al año por acceder a un catálogo y vende colecciones aparte. Lo que se aprende de
ella sin gastar nada:

- **El acceso revocable funciona como negocio**, y la gente lo acepta: es la misma regla de
  «Recetas ajenas».
- **Las colecciones compradas no viajan entre cuentas**, y eso la gente lo lleva mal.
- **En los foros españoles se buscan grupos de cinco para compartir una cuenta**, lo que dice que a
  60 € al año el precio pesa. Si algún día cobramos acceso, el precio por recetario tiene que ser
  pequeño o la gente se organizará para esquivarlo.

Y **Cookpad** marca el otro límite: la comunidad abierta ya existe y es gratis. Nuestra fase 2 no
debe competir con una plaza pública de seis millones de recetas; tiene sentido como **círculo
pequeño** —tu familia, tus amistades— y la fase 3 como **relación de una cocinera con quien la
sigue**, no como catálogo.

## Lo que no sabemos

Conviene no confundir este documento con la verdad:

- **La tracción de Fava es de hoy.** Con 1-3 valoraciones, cualquier conclusión sobre si gusta o no
  es ruido. Lo sólido es qué funciones tiene, no cómo le va.
- **Los precios son los de las fichas de EE. UU.**, en dólares, y varios cambian por país. Antes de
  fijar el nuestro hay que mirar la ficha española.
- **Varias comparativas son de competidores** (CookBook publica la mitad de las listas de «mejores
  apps»), así que sus pegas a otros están interesadas.
- **De Paprika 4 solo hay fuentes de terceros.** Si de verdad se pasa a suscripción, cambia la
  referencia de precio de todo el mercado y merece una comprobación.
- **No hemos probado ninguna de estas apps por dentro.** Esto se ha hecho con sus webs, sus fichas
  de tienda y sus políticas de privacidad.

## Lo que se decidió el 25 de octubre de 2026

Salió de este estudio, el mismo día, y ya está repartido en [`SPEC.md`](SPEC.md) y
[`ESTADO.md`](ESTADO.md). Aquí queda el porqué.

### Se hace, sin discusión

| Qué | Por qué | Dónde está anotado |
| --- | --- | --- |
| **Etiquetas `og:` en el visor** | El canal de crecimiento más barato que tiene la app, y el visor ya existe. Fava reparte tarjetas; nosotras, una línea de texto | Paso 12 |
| **Importar una receta desde una URL** | El único hueco que se nota al segundo día, y lo tienen todas. La Edge Function ya convierte texto en receta validada | Paso 13 |
| **Escalar raciones** | Casi gratis: ya hay `servings` y `quantity` numérico. Es la función más querida de las apps tipo Paprika y ni Fava la tiene | Paso 14 |
| **Foto de una página de libro o de una receta a mano** | La misma tubería con una imagen en vez de texto, para digitalizar la libreta de tu casa. **Ojo:** ReciMe ya importa fotos de recetas a mano, así que la diferencia no es capturar la foto, es entender lo que dice | Paso 15 |
| **«La he hecho»: fecha y nota, nada más** | El único arreglo honesto a que un recetario se escriba una vez y se lea poco. Lo que Fava resuelve con rachas, resuelto sin convertirse en red social | Paso 16 |
| **Buscar por lo que tengo en la nevera** | Sí o sí, pero **la forma está por estudiar** y toca la pantalla principal, que espera al diseñador. Las preguntas siguen en «Ideas por concretar» | `SPEC.md`, «Ideas por concretar» |
| **Contar el modo cocina, el offline y que no hay red social** | Tres cosas que ya funcionan y que hoy no se cuentan en ningún sitio. Las dos primeras no las tiene la competencia más parecida | `ESTADO.md`, antes de cerrar el MVP |
| **Mi cocina recién instalada con algo dentro** | Es la única primera impresión que hay, y hoy está vacía. Fava añadió un tour en su 2.3.0 | `ESTADO.md`, antes de cerrar el MVP |

### Se hará, pero en la fase 2

**Buscar recetas de otras personas cuando ellas las hayan hecho públicas.** Una segunda superficie
para buscar fuera de tu cocina, atada a «hacer un libro público o privado», que ya era fase 2. La
fase 3 además lo necesita: un recetario de pago que no se puede encontrar no se vende. Lo que este
estudio sí descarta no es buscar, es **ser una comunidad**: ahí está la diferencia entre poder
encontrar lo que alguien ha decidido publicar y montar una plaza donde pasar el rato, que es lo que
Cookpad ya tiene con seis millones de recetas en español.

### Cambia de sitio

**El retoque de foto con IA deja de ser el candidato al plan PRO.** Nadie en este mercado cobra por
mejorar una foto: se cobra por planificar, por la lista de la compra, por nutrición y por acceso. El
PRO de ~2 € sigue en pie y sigue estando por debajo de todo el mercado, pero su contenido se decide
más adelante: de momento, volumen.

### En tentativa, ni dentro ni enterrada

**La lista de la compra.** Es la razón número uno para abrir una app de recetas a diario y la vende
todo el mundo menos Fava, pero es trabajo de verdad y no es MVP. Queda como la mejor candidata al
plan PRO cuando llegue.

### Cerrado en no

No es nuestro mercado, y decirlo cierra la pregunta para las próximas sesiones:

- **Rachas, objetivos semanales, «me gusta», comentarios, perfil público y feed.** Son otra app, y
  «aquí nadie ve lo que cocinas» solo se puede prometer si no existen.
- **Ser una comunidad.** Feed de amistades, perfiles públicos y plaza donde pasar el rato, no:
  Cookpad ya tiene seis millones de recetas en español y no vamos a ganarle ahí. Buscar lo que otras
  personas han hecho público es otra cosa y sí se hará, en la fase 2.
- **Nutrición y calorías.** Otro producto: necesita una base de datos de alimentos y mete la app en
  terreno de salud.
- **Multifoto y fotos por paso.** Ya estaban fuera con buenas razones; que Fava las haya añadido no
  cambia ninguna.

## Fuentes

- Fava: [fava-app.com](https://fava-app.com/) · [App Store](https://apps.apple.com/gb/app/fava-cook-log-share/id6757719864) · [Google Play](https://play.google.com/store/apps/details?id=com.fava.app&hl=en_US) · [ficha en mwm.ai](https://mwm.ai/apps/fava-cook-log-share/6757719864) · política de privacidad en `fava-cook.pages.dev/privacy`
- Paprika: [App Store](https://apps.apple.com/us/app/paprika-recipe-manager-3/id1303222868) · [Google Play](https://play.google.com/store/apps/details?id=com.hindsightlabs.paprika.android.v3&hl=en_US) · [reseña con precios y Paprika 4](https://ultimatemealplans.com/reviews/paprika)
- Crouton: [crouton.app](https://crouton.app) · [App Store](https://apps.apple.com/us/app/crouton-recipe-manager/id1461650987)
- Mela: [mela.recipes](https://mela.recipes)
- ReciMe: [App Store](https://apps.apple.com/us/app/recime-recipe-keeper/id1593779280)
- Samsung Food: [Food+](https://samsungfood.com/food-plus/) · [qué incluye la suscripción](https://support.samsungfood.com/hc/en-us/articles/32709269852052-What-s-Included-in-Your-Samsung-Food-Subscription) · [reseña](https://www.plantoeat.com/blog/2026/01/samsung-food-review-pros-and-cons/)
- Cookpad: [cookpad.com/es](https://cookpad.com/es/homepage) · [Cookpad y Mis Recetas](https://www.genbeta.com/redes-sociales-y-comunidades/cookpad-mis-recetas-y-allthecooks-se-alian-hablamos-con-sus-responsables)
- Cookidoo: [qué es y cuánto cuesta](https://service.thermomix.com/hc/en-us/articles/7925020790547-What-is-Cookidoo-How-much-does-it-cost) · [subida de precio](https://www.iphone-ticker.de/thermomix-app-preis-fuer-cookidoo-abo-steigt-25-prozent-237796/)
- Comparativas del sector: [cookbookmanager.com](https://cookbookmanager.com/post/best-recipe-manager-apps) (de una competidora) · [lowi.es](https://www.lowi.es/blog/mejores-aplicaciones-de-recetas/) · [movilzona.es](https://www.movilzona.es/noticias/aplicaciones/apps-anotar-guardar-recetas/)
