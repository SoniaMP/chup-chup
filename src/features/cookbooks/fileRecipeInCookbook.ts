import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

/**
 * Mete la receta en el libro elegido, o en el de por defecto si no se ha elegido ninguno.
 *
 * Ninguna receta se queda sin libro: ese es el trato. Elegir libro al guardar es opcional, no
 * tener libro no lo es.
 */
export async function fileRecipeInCookbook(recipeId: string, cookbookId: string | null): Promise<void> {
  const target = cookbookId ?? (await supabaseCookbookStore.ensureDefault()).id;
  await supabaseCookbookRecipeStore.add(target, recipeId);
}
