import { recipeSchema, type Recipe } from "@/domain/recipes/recipe";
import type { RecipeInput } from "@/domain/recipes/recipeInput";
import { randomUuid } from "@/lib/randomUuid";
import { getLocalOwnerId } from "./localOwnerId";
import { localRecipeStore } from "./localRecipeStore";

/** Convierte lo que la usuaria acepta en una receta con identidad, y la guarda. */
export async function saveRecipe(input: RecipeInput): Promise<Recipe> {
  const now = new Date().toISOString();
  const recipe = recipeSchema.parse({
    ...input,
    id: randomUuid(),
    ownerId: await getLocalOwnerId(),
    createdAt: now,
    updatedAt: now,
  });

  await localRecipeStore.add(recipe);
  return recipe;
}
