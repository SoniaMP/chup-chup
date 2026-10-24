import { z } from "zod";
import { recipeInputSchema } from "./recipeInput";

/**
 * El contenido de una receta ya guardada: lo que es de quien la escribió.
 *
 * Aquí no hay nada personal. La nota, la estrella y la portada que le pone cada cocinera viven en
 * `savedRecipe`, porque el día que una receta esté en la cocina de otra persona, su nota no puede
 * pisar la de su dueña. Ver «Recetas ajenas» en `docs/SPEC.md`.
 */
export const recipeSchema = recipeInputSchema
  .omit({ notes: true })
  .extend({
    id: z.uuid(),
    ownerId: z.uuid(),
    /** Rutas dentro del bucket, no URLs: las del bucket privado se firman y caducan. */
    photoOriginal: z.string().trim().min(1).max(200).optional(),
    photoEnhanced: z.string().trim().min(1).max(200).optional(),
    photoActive: z.enum(["original", "enhanced"]).default("original"),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .refine((recipe) => recipe.photoActive === "original" || recipe.photoEnhanced !== undefined, {
    error: "No se puede activar la foto mejorada si no existe",
    path: ["photoActive"],
  });

export type Recipe = z.infer<typeof recipeSchema>;
