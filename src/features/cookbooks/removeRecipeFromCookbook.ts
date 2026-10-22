import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

/**
 * Saca una receta de un libro, sin borrarla.
 *
 * Si era su último libro vuelve al libro por defecto, que es el trato de siempre: una receta sin
 * libro no se encuentra. Devuelve ese libro cuando ha hecho falta, para poder contarlo.
 */
export async function removeRecipeFromCookbook(
  cookbookId: string,
  recipeId: string,
): Promise<Cookbook | null> {
  await supabaseCookbookRecipeStore.remove(cookbookId, recipeId);

  const left = await supabaseCookbookRecipeStore.listCookbookIds(recipeId);
  if (left.length > 0) return null;

  const fallback = await supabaseCookbookStore.ensureDefault();
  await supabaseCookbookRecipeStore.add(fallback.id, recipeId);

  return fallback;
}
