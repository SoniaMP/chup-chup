import { cookbookSchema, type Cookbook } from "@/domain/cookbooks/cookbook";
import type { Database } from "@/lib/databaseTypes";

type CookbookRow = Database["public"]["Tables"]["cookbooks"]["Row"];

/** Una fila de Postgres como libro del dominio: snake_case a camelCase, `null` a ausencia. */
export function cookbookFromRow(row: CookbookRow): Cookbook {
  return cookbookSchema.parse({
    id: row.id,
    ownerId: row.owner_id,
    ...(row.collection_id !== null && { collectionId: row.collection_id }),
    title: row.title,
    position: row.position,
    ...(row.library_image !== null && { libraryImage: row.library_image }),
    ...(row.cover_photo !== null && { coverPhoto: row.cover_photo }),
    isSystem: row.is_system,
  });
}
