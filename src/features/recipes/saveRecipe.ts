import { recipeSchema, type Recipe } from "@/domain/recipes/recipe";
import type { RecipeInput } from "@/domain/recipes/recipeInput";
import { currentOwnerId } from "@/features/auth/currentOwnerId";
import { randomUuid } from "@/lib/randomUuid";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

/** Convierte lo que la usuaria acepta en una receta con identidad, y la guarda. */
export async function saveRecipe(input: RecipeInput): Promise<Recipe> {
  const now = new Date().toISOString();
  const recipe = recipeSchema.parse({
    ...input,
    id: randomUuid(),
    ownerId: await currentOwnerId(),
    createdAt: now,
    updatedAt: now,
  });

  return supabaseRecipeStore.add(recipe);
}
