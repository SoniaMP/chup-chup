import { z } from "zod";
import { recipeInputSchema } from "./recipeInput";

/** Una receta ya guardada, con su identidad, su propietaria y sus fotos. */
export const recipeSchema = recipeInputSchema
  .extend({
    id: z.uuid(),
    ownerId: z.uuid(),
    photoOriginal: z.url().optional(),
    photoEnhanced: z.url().optional(),
    /** Imagen del catálogo, para cuando no hay foto propia. La foto propia manda siempre. */
    libraryImage: z.string().trim().min(1).max(120).optional(),
    photoActive: z.enum(["original", "enhanced"]).default("original"),
    isFavorite: z.boolean().default(false),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .refine((recipe) => recipe.photoActive === "original" || recipe.photoEnhanced !== undefined, {
    error: "No se puede activar la foto mejorada si no existe",
    path: ["photoActive"],
  });

export type Recipe = z.infer<typeof recipeSchema>;
