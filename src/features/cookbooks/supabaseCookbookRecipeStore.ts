import { positionBetween } from "@/domain/ordering/positionBetween";
import { savedRecipeFromRow } from "@/features/recipes/savedRecipeFromRow";
import { supabase } from "@/lib/supabase";
import type { CookbookEntry } from "./cookbookEntry";

const TABLE = "cookbook_recipes";

/**
 * Qué recetas hay en cada libro, y en qué orden.
 *
 * Borrar un libro no borra recetas y borrar una receta la saca de todos sus libros: eso lo hacen
 * las claves foráneas en cascada, no esta capa.
 */
export const supabaseCookbookRecipeStore = {
  /** Las recetas del libro con su sitio dentro de él, que es lo que hace falta para moverlas. */
  async listEntries(cookbookId: string): Promise<CookbookEntry[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("position, recipes (*, saved_recipes (*))")
      .eq("cookbook_id", cookbookId)
      .order("position");

    if (error !== null) throw new Error(error.message);

    return data.map((row) => {
      // Estar en un libro tuyo y estar en tu cocina son la misma cosa: si falta la fila de
      // guardado, lo que hay es un fallo, y se dice.
      const [saved] = row.recipes.saved_recipes;
      if (saved === undefined) throw new Error(`La receta ${row.recipes.id} no está en tu cocina`);

      return {
        recipe: savedRecipeFromRow({ ...saved, recipes: row.recipes }),
        position: row.position,
      };
    });
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

  /** Cambia el sitio de una receta dentro de un libro, sin tocar su sitio en los demás. */
  async move(cookbookId: string, recipeId: string, position: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update({ position })
      .eq("cookbook_id", cookbookId)
      .eq("recipe_id", recipeId);

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
