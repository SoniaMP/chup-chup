# Recetario

App móvil de recetario personal. La especificación completa está en `docs/SPEC.md`: léela antes de proponer cambios de modelo o de alcance.

## Stack

- Expo (React Native) + TypeScript en modo estricto
- Supabase: Postgres, Auth, Storage y Edge Functions
- Zod para todos los contratos de datos, compartidos entre la app y las Edge Functions

## Principios de arquitectura

- Arquitectura limpia: el dominio (tipos, esquemas Zod, reglas) no depende de Supabase ni de React. Supabase vive detrás de repositorios.
- Separar por feature (`recipes`, `library`, `ai`, `photos`), no por tipo de archivo.
- Las claves de la IA solo existen en Edge Functions. Nunca en el cliente.
- Toda salida de la IA se valida con Zod antes de llegar a la UI.
- Todo lleva UUID y `owner_id`, con RLS activado, aunque el MVP sea de una sola usuaria (preparado para compartir en la fase 2).
- Orden manual con fractional indexing en el campo `position`.
- No construir nada de la fase 2 (compartir, "La he hecho"). Solo no cerrarle la puerta.

## Convenciones

- Interfaz en español de España.
- Código, nombres y commits en inglés.
- Base de datos en snake_case; TypeScript en camelCase, con el mapeo en la capa de repositorio.
- Antes de un cambio grande, propón el plan y espera confirmación.

## Por dónde empezar

Paso 1 del plan de `docs/SPEC.md`: esquema Zod de la receta y prompt de estructuración, con tests usando textos de ejemplo "escritos rápido y mal".
