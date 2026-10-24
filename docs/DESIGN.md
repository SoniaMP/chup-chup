# Recetario — Sistema de diseño

Tokens, pantallas y patrones de interacción de la app. La especificación funcional está en
`SPEC.md`; aquí solo está el "cómo se ve y cómo se siente".

**Procedencia:** extraído del prototipo de Lovable (`reference/lovable`, no versionado). Ese
prototipo es React para web: sirve como referencia visual y de flujos, **no como código**. Los
colores venían en OKLCH, que React Native no entiende; aquí están ya convertidos a hex, con el
valor original al lado para poder recalcularlos.

El prototipo es anterior a algunas decisiones del SPEC. Lo que aparece aquí es **la versión
vigente**, no la del prototipo; las diferencias están marcadas como `[cambio]`.

## Color

### Claro

| Token | Hex | OKLCH original | Uso |
| --- | --- | --- | --- |
| `background` | `#FDF6EA` | `0.975 0.018 80` | fondo de pantalla, crema cálido |
| `foreground` | `#2C1A14` | `0.24 0.03 40` | texto principal |
| `card` | `#FFFDF8` | `0.995 0.008 80` | tarjetas, listas, barra inferior |
| `primary` | `#CF542C` | `0.6 0.165 38` | terracota: acciones, números de paso, foco |
| `primaryForeground` | `#FEFAF3` | `0.985 0.01 80` | texto sobre terracota |
| `secondary` | `#F4E6D2` | `0.93 0.03 75` | superficies secundarias |
| `secondaryForeground` | `#3F271E` | `0.3 0.04 40` | texto sobre secundario |
| `muted` | `#F3EADB` | `0.94 0.022 78` | buscador, chips, bloques de datos |
| `mutedForeground` | `#725F54` | `0.5 0.03 50` | texto secundario |
| `olive` | `#657B3D` | `0.55 0.09 125` | acento verde: confirmar, recetarios |
| `oliveSoft` | `#E0EAC8` | `0.92 0.045 120` | fondo de acento verde |
| `saffron` | `#EDB345` | `0.8 0.14 80` | estrella de favorita |
| `inferred` | `#FEE9BE` | `0.94 0.06 85` | fondo del aviso con las suposiciones de la IA |
| `inferredForeground` | `#6E4108` | `0.42 0.09 65` | texto de ese aviso |
| `frame` | `#E5D5C3` | `0.88 0.03 70` | marco exterior (web) / fondo del modo cocina |
| `border` | `#E5D8C9` | `0.89 0.025 72` | bordes y separadores |
| `destructive` | `#E7000B` | `0.577 0.245 27.325` | borrar |

### Oscuro

| Token | Hex | OKLCH original |
| --- | --- | --- |
| `background` | `#1D140F` | `0.2 0.018 45` |
| `foreground` | `#F6EDE0` | `0.95 0.02 80` |
| `card` | `#2A1F1A` | `0.25 0.02 45` |
| `primary` | `#E87045` | `0.68 0.16 40` |
| `primaryForeground` | `#190F0B` | `0.18 0.02 40` |
| `secondary` | `#392A23` | `0.3 0.025 45` |
| `muted` | `#322621` | `0.28 0.02 45` |
| `mutedForeground` | `#B1A291` | `0.72 0.03 70` |
| `olive` | `#90A963` | `0.7 0.1 125` |
| `oliveSoft` | `#2D371A` | `0.32 0.05 125` |
| `saffron` | `#F3B94C` | `0.82 0.14 80` |
| `inferred` | `#4A330F` | `0.34 0.06 75` |
| `inferredForeground` | `#FAD18A` | `0.88 0.1 80` |
| `frame` | `#0B0605` | `0.13 0.01 45` |
| `border` | `rgba(255,255,255,0.10)` | `1 0 0 / 10%` |

El modo oscuro no es obligatorio en la primera versión de la app, pero los tokens existen desde
el principio para no tener que repintar nada después.

### Degradados

| Token | De → a | Uso |
| --- | --- | --- |
| `gradientWarm` | `#E56731` → `#C04637` (135°) | botón principal, botón Crear, azulejo de Favoritas |
| `gradientPlaceholder` | `#F8D8B4` → `#FBBEA3` (140°) | receta sin foto |
| `gradientPlaceholder` (oscuro) | `#4E341F` → `#4A2010` | ídem en oscuro |

## Tipografía

- **Fraunces** (serif) para títulos y números destacados. Token `fontDisplay`, interletraje `-0.01em`.
- **Figtree** (sans) para todo lo demás. Cuerpo a **17 px**.
- En Expo: `expo-font` con `@expo-google-fonts/fraunces` y `@expo-google-fonts/figtree`.

| Nivel | Tamaño | Fuente |
| --- | --- | --- |
| Título de pantalla | 36 | Fraunces 600 |
| Título de libro (sobre portada) | 48 | Fraunces 600 |
| Encabezado de sección | 24 | Fraunces 600 |
| Cuerpo | 17 | Figtree 400 |
| Paso en modo cocina | 36 | Figtree 600 |
| Etiqueta / dato secundario | 14 | Figtree 400 |
| Rótulo de sección | 14, mayúsculas, `tracking-widest`, terracota | Figtree 600 |

## Forma, sombra y espaciado

- **Radio** base 16: `sm 12 · md 14 · lg 16 · xl 20 · 2xl 24 · 3xl 30`. Botones principales y chips
  son píldoras (radio completo).
- **Margen lateral de pantalla:** 20. Separación entre elementos de lista: 4–8; entre bloques: 20–28.
- **Alturas de toque:** 44 los botones redondos de cabecera, 56 los botones principales, 80 los
  botones gigantes del modo cocina.
- `shadowSoft`: color `#6B3725` al 25 %, desplazamiento Y 10, radio 30. En RN, `shadowColor` +
  `shadowOpacity 0.25` + `shadowRadius 15` y `elevation: 6` en Android.
- `shadowGlow`: color `#CF542C` al 55 %, Y 12, radio 28. Solo para el botón principal y el de
  nueva receta.
- `[cambio]` `shadowGlowDark`: el mismo color al 28 %, Y 10, radio 36. En oscuro, el halo al 55 %
  no se lee como luz sino como una mancha naranja alrededor del botón.

## Movimiento

| Animación | Qué hace | Dónde |
| --- | --- | --- |
| `rise` | entra desde 10 px abajo con fundido, 450 ms | elementos de lista, en cascada de 60 ms |
| `bob` | flota y se balancea ±6°, bucle | chispa de «Cocinando tu receta…», retoque de foto |
| `steam` | sube 34 px desvaneciéndose, bucle 1,6 s | vapor de la olla, tres columnas desfasadas 350 ms |
| `pop` | escala a 1,35 y vuelve, 350 ms | estrella al marcar favorita |

Curva de entrada: `cubic-bezier(0.2, 0.8, 0.2, 1)`.

## Navegación

`[cambio]` **El MVP no tiene barra inferior.** Mi cocina ocupa la pantalla y **Nueva receta** es un
botón flotante: el `gradientWarm` y el `shadowGlow` del prototipo, pero pastilla de 64 de alto con
el icono y el texto «Nueva receta» dentro, no círculo. Abajo a la derecha, a 20 del borde y 24 del
área segura.

- `[cambio]` La pantalla se llama **Mi cocina**, no «Biblioteca».
- `[cambio]` **Favoritas no es una pestaña**: es la primera fila de Mi cocina. Era una duplicidad.
- `[cambio]` **La búsqueda tampoco es una pestaña**: se queda en la cabecera de Mi cocina y busca por
  título y por ingrediente («¿qué hago con esta calabaza?»).
- La barra inferior llega en la fase 2, con **Mi cocina · Buscar · Crear · Amigos**. Entonces Crear
  vuelve al centro de la barra como círculo elevado.

## Pantallas

### Mi cocina
Cabecera con el título grande y el avatar (perfil y ajustes). Debajo, el buscador, y una lista
única con tres tipos de fila, todas con miniatura de 64:

1. **Favoritas** — azulejo con `gradientWarm` y estrella. Subtítulo «Lista automática · N recetas».
2. **Recetarios** — carpeta sobre `oliveSoft`, desplegable con un chevrón que gira. Al abrirse, los
   libros de dentro se indentan 24 con una línea vertical `oliveSoft` a la izquierda.
3. **Libros sueltos** — portada en mosaico. Subtítulo «Libro · N recetas».

Chips de filtro: Recetarios · Libros · Recetas. Activo = relleno terracota. `[cambio]` A la
derecha de esa fila, fijo, el chip **+ Nuevo libro**: sin relleno, filo de puntos y terracota,
para que no se lea como un filtro más. Ahí se crean los libros; el **+** de la cabecera se
quitó por confundirse con el de crear recetas.

`[cambio]` No hay libro «Por probar» de serie: eso pasa a la fase 2.

### Detalle de libro
Portada cuadrada a sangre (mosaico 2×2 de las 4 primeras recetas, o la primera foto si hay menos de
4), degradado al fondo para que el título se lea encima. Rótulo con el recetario al que pertenece o
«Libro suelto». Lista de recetas reordenable **manteniendo y arrastrando el asa** de la derecha.
Menú `···` → hoja inferior para mover el libro a otro recetario.

### Detalle de receta
Foto en 4:4.2 a sangre con degradado inferior; volver y estrella flotando encima. Debajo, botones
contextuales de foto (*Añadir foto* / *Mejorar con IA* / *Volver a la original*), el título en
Fraunces 36, y tres bloques de datos: Preparación · Cocción · Raciones con `−`/`+`.

**Al cambiar las raciones se reescalan las cantidades** (redondeo: a entero desde 10, a un decimal
por debajo; coma decimal, no punto).

Después: *Modo cocina* (principal) y *Añadir a libro* (secundario, abre hoja inferior con casillas),
la lista de ingredientes en tarjeta con separadores y la cantidad en negrita terracota a la
izquierda, y los pasos numerados en círculos `oliveSoft`.

`[cambio]` Faltan **las notas personales**, que el prototipo no tenía. Van en esta pantalla, en un
bloque propio claramente separado de los pasos, y editables en cualquier momento. El bloque se
muestra solo si hay nota; si no, un botón discreto para añadirla.

### Modo cocina
Pantalla completa. Barra de progreso segmentada arriba (un segmento por paso), «Paso N de M» en
Fraunces terracota, el paso a 36 px, y dos botones de 80 de alto: anterior (circular, `muted`) y
siguiente (píldora, `gradientWarm`), que en el último paso dice «¡Terminado!». Chip verde
«Pantalla siempre encendida»: `expo-keep-awake`.

### Crear receta
Dos pasos, rotulados «Paso 1 de 2» y «Paso 2 de 2 · Revisión».

1. **Escribir** — título «Nueva receta», subtítulo «Sin formato, sin prisas. Nosotros lo ordenamos.»,
   un área de texto grande (mínimo 288 de alto, radio 24, borde de 2 que se vuelve terracota al
   enfocar) y el botón *Estructurar con IA* con chispa.
2. **Esperar** — ilustración de olla con tres columnas de vapor animadas y una chispa flotando.
   «Cocinando tu receta…» / «Ordenando ingredientes, calculando tiempos y afinando cantidades.»
3. **Revisar** — título editable en línea, aviso sobre fondo `inferred` con lo que ha supuesto la
   IA, los tres datos numéricos, y los ingredientes y pasos editables. Abajo, *Volver a intentar* y
   *Guardar receta*.

`[cambio]` **No se resalta campo por campo.** El prototipo marcaba cada dato inferido con fondo
`inferred` y botones de *Aceptar* / *Descartar*; eso desaparece. El token `inferred` se usa solo
para el aviso con las suposiciones de la IA encima del borrador. La receta se revisa entera, y
guardar es aceptar.

### Estados vacíos
Círculo de 144 con `gradientPlaceholder`, icono grande a trazo fino encima, dos puntos decorativos
(uno `olive`, otro `saffron`), título en 24 y una línea de texto en `mutedForeground`.

## Patrones reutilizables

- **Hoja inferior** para elegir (añadir a libro, mover a recetario), con el botón de confirmar fijo abajo.
- **Avisos breves** tras cada acción, con el texto concreto: «Añadida a Navidad y Postres», no «Hecho».
- **Receta sin foto:** nunca un hueco gris, siempre `gradientPlaceholder` con una olla a trazo fino.
- **Fotos:** comparador antes/después con deslizador, y siempre la vuelta a la original.

## Equivalencias en React Native

| Prototipo (web) | En la app |
| --- | --- |
| Tailwind + clases | tokens de `src/theme` + `StyleSheet` (o NativeWind) |
| `@dnd-kit` | `react-native-draggable-flatlist` |
| `vaul` (Drawer) | `@gorhom/bottom-sheet` |
| `sonner` (avisos) | aviso propio sobre `react-native-reanimated` |
| `lucide-react` | `lucide-react-native` |
| `navigator.wakeLock` | `expo-keep-awake` |
| `@tanstack/react-router` | `expo-router` |
| animaciones CSS | `react-native-reanimated` |
| filtros CSS (`brightness`) | no existen: el retoque de foto es real, no un filtro |

Lo último importa: en el prototipo «Mejorar con IA» es un filtro CSS de brillo y contraste. En la
app es una imagen distinta de verdad, generada y guardada.

## Decisiones pendientes

1. **Icono y nombre de la app**, y pantalla de carga.
2. **Servicio de retoque de foto** (ver `SPEC.md`): decide si el comparador «antes/después» enfrenta
   dos imágenes reales o un procesado local.
