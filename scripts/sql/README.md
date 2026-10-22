# Scripts SQL

Se ejecutan a mano desde el dashboard de Supabase: **SQL Editor → New query → pegar → Run**.
No hay forma de lanzarlos desde el CLI: `supabase db` solo aplica migraciones, y ejecutar SQL
suelto pediría la contraseña de la base de datos o la clave `service_role`, que no deben andar
sueltas por el repo.

| Script | Qué hace |
| --- | --- |
| `wipeData.sql` | Vacía recetas, libros, recetarios y fotos. No toca el esquema ni tu cuenta. |

Lo que vive en el móvil (los borradores a medias) no se borra desde aquí: eso está en el
almacenamiento del navegador, por origen. Se va solo cuando borras los datos del sitio.
