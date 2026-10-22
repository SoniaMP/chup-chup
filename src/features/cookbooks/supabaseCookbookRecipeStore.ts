import type { Recipe } from "@/domain/recipes/recipe";
import { positionBetween } from "@/domain/ordering/positionBetween";
import { recipeFromRow } from "@/features/recipes/recipeFromRow";
import { supabase } from "@/lib/supabase";

const TABLE = "cookbook_recipes";

/**
 * Qué recetas hay en cada libro, y en qué orden.
 *
 * Borrar un libro no borra recetas y borrar una receta la saca de todos sus libros: eso lo hacen
 * las claves foráneas en cascada, no esta capa.
 */
export const supabaseCookbookRecipeStore = {
  async listRecipes(cookbookId: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("position, recipes (*)")
      .eq("cookbook_id", cookbookId)
      .order("position");

    if (error !== null) throw new Error(error.message);
    return data.map((row) => recipeFromRow(row.recipes));
  },

  /** Qué receta está en qué libro, todo de una vez: la pantalla principal lo necesita entero. */
  async listAll(): Promise<{ cookbookId: string; recipeId: string }[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("cookbook_id, recipe_id")
      .order("position");

    if (error !== null) throw new Error(error.message);
    return data.map((row) => ({ cookbookId: row.cookbook_id, recipeId: row.recipe_id }));
  },

  async listCookbookIds(recipeId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("cookbook_id")
      .eq("recipe_id", recipeId);

    if (error !== null) throw new Error(error.message);
    return data.map((row) => row.cookbook_id);
  },

  async add(cookbookId: string, recipeId: string): Promise<void> {
    const { data, error: readError } = await supabase
      .from(TABLE)
      .select("position")
      .eq("cookbook_id", cookbookId)
      .order("position", { ascending: false })
      .limit(1);

    if (readError !== null) throw new Error(readError.message);

    const { error } = await supabase.from(TABLE).insert({
      cookbook_id: cookbookId,
      recipe_id: recipeId,
      position: positionBetween(data[0]?.position ?? "", ""),
    });

    if (error !== null) throw new Error(error.message);
  },

  async remove(cookbookId: string, recipeId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("cookbook_id", cookbookId)
      .eq("recipe_id", recipeId);

    if (error !== null) throw new Error(error.message);
  },
};
