# Chup Chup

Recetario personal en el móvil: escribes una receta deprisa y mal, y la IA la deja siempre con la
misma estructura. Expo (React Native) + TypeScript, con Supabase detrás.

- Qué es y hacia dónde va: [`docs/SPEC.md`](docs/SPEC.md)
- Colores, tipografías y pantallas: [`docs/DESIGN.md`](docs/DESIGN.md)
- Reglas de código: [`CLAUDE.md`](CLAUDE.md)

## Arrancar

```bash
npm install
npm start                 # Metro: pulsa w para web, o escanea el QR
```

Hace falta un `.env` con las claves del proyecto de Supabase. La plantilla está en `.env.example`:

```bash
cp .env.example .env      # y rellena las dos variables
```

Las dos son públicas por diseño —la URL del proyecto y la clave *publishable*— y lo que protege
los datos es el RLS, no el secreto de la clave. **La clave de la IA no está aquí ni puede estar**:
vive como secreto de la Edge Function.

Si la app no carga en el móvil por la IP, mira que sea la de ahora: `ipconfig getifaddr en0`.

## El día a día

```bash
npm test                  # 147 tests, sin red y sin coste
npm run test:watch
npm run typecheck         # tsc --noEmit
npm run lint              # eslint .
```

Los tres tienen que estar limpios antes de dar algo por terminado.

## Base de datos y backend

El proyecto está enlazado con Supabase; estos comandos hablan con el proyecto de verdad.

```bash
npx supabase login                                 # una vez, en tu terminal
npx supabase link --project-ref udgxufgdklvystegoeei

npx supabase migration list --linked               # qué hay aplicado y qué falta
npx supabase db push                               # aplica las migraciones nuevas
npm run types:db                                   # regenera src/lib/databaseTypes.ts
```

Después de `db push`, **siempre** `npm run types:db`: los tipos de la base salen de ahí, no se
escriben a mano.

Para borrar todos los datos y empezar de cero, el SQL está en
[`scripts/sql/README.md`](scripts/sql/README.md): se pega en el editor SQL del panel, así que no
hace falta ni la contraseña de la base ni la clave de servicio.

## La IA (Edge Function)

La función `structure-recipe` recibe el texto libre, llama a Claude, valida con el mismo esquema
Zod que usa la app y devuelve la receta.

```bash
npx supabase functions deploy structure-recipe     # tras tocar la función, el prompt o el esquema
npx supabase functions list                        # ¿está arriba?
```

Secretos, que viven solo en el servidor:

```bash
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
npx supabase secrets set AI_MODEL=claude-sonnet-5-5      # por defecto, claude-haiku-5-5
npx supabase secrets set AI_BACKUP_MODEL=claude-opus-5-5  # el de rescate
npx supabase secrets set AI_DAILY_LIMIT=50                # recetas por cocinera y día
```

Cambiar de modelo o de tope **no** necesita desplegar: son secretos, no código.

Ojo: el prompt y los esquemas viajan dentro de la función. Si tocas
`src/features/ai/structureRecipePrompt.ts` o `src/domain/recipes/*`, hay que volver a desplegar o
la app seguirá usando la versión vieja.

Cuando algo falla, los registros están en el panel: Edge Functions → structure-recipe → Logs.

## Fixtures del prompt

Seis recetas «escritas deprisa y mal» con su salida grabada. Los tests las comprueban sin red y
sin coste; grabarlas sí cuesta (céntimos) y necesita la clave en tu terminal, no en Supabase.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run record:fixtures                     # solo las que falten
npm run record:fixtures -- --all            # todas, tras tocar el prompt
npm run record:fixtures -- pancakes-english # una
MODEL=claude-sonnet-5-5 npm run record:fixtures -- --all   # comparar modelos
```

Después de tocar el prompt hay que regrabar: si no, los tests defienden el comportamiento viejo.

## Catálogo de imágenes

Las portadas que cualquiera puede elegir para sus libros y recetas. Las cura quien desarrolla.

```bash
npm run covers -- ~/Desktop/mis-imagenes    # cuadra y saca los dos tamaños en library/ready/
```

Y se suben arrastrando a **Storage → `library-images`** en el panel. El cómo y el por qué, en
[`library/README.md`](library/README.md).
