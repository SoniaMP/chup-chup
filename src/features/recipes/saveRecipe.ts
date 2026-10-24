import type { RecipeInput } from "@/domain/recipes/recipeInput";
import { savedRecipeSchema, type SavedRecipe } from "@/domain/recipes/savedRecipe";
import { currentOwnerId } from "@/features/auth/currentOwnerId";
import { randomUuid } from "@/lib/randomUuid";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

/**
 * Convierte lo que la usuaria acepta en una receta con identidad, y la guarda en su cocina.
 *
 * Nace guardada por quien la escribe: la nota que haya puesto en la revisión es suya, no de la
 * receta, y por eso viaja en la misma operación pero a otra tabla.
 */
export async function saveRecipe(input: RecipeInput): Promise<SavedRecipe> {
  const now = new Date().toISOString();
  const saved = savedRecipeSchema.parse({
    ...input,
    id: randomUuid(),
    ownerId: await currentOwnerId(),
    createdAt: now,
    updatedAt: now,
    savedAt: now,
  });

  return supabaseRecipeStore.add(saved);
}
