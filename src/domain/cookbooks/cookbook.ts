import { z } from "zod";

/**
 * Un libro: una lista de recetas con su propio orden, como una playlist.
 *
 * Vive en cero o un recetario (`collectionId`). `isSystem` queda reservado para los libros que
 * cree la app en la fase 2; en el MVP todos son de la usuaria.
 */
export const cookbookSchema = z.object({
  id: z.uuid(),
  ownerId: z.uuid(),
  collectionId: z.uuid().optional(),
  title: z.string().trim().min(1, "El libro necesita un nombre").max(120),
  position: z.string().min(1),
  isSystem: z.boolean().default(false),
});

export type Cookbook = z.infer<typeof cookbookSchema>;
