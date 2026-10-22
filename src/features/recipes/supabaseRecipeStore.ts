import type { Recipe } from "@/domain/recipes/recipe";
import { supabase } from "@/lib/supabase";
import { recipeFromRow } from "./recipeFromRow";
import { rowFromRecipe } from "./rowFromRecipe";

/**
 * Las recetas guardadas, en Supabase.
 *
 * Es el repositorio: las pantallas piden las recetas aquí y no saben de dónde salen. El RLS filtra
 * por `owner_id`, así que ninguna consulta necesita decir de quién son las recetas.
 */
export const supabaseRecipeStore = {
  async list(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error !== null) throw new Error(error.message);
    return data.map(recipeFromRow);
  },

  async getById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase.from("recipes").select("*").eq("id", id).maybeSingle();

    if (error !== null) throw new Error(error.message);
    return data === null ? null : recipeFromRow(data);
  },

  async add(recipe: Recipe): Promise<Recipe> {
    const { data, error } = await supabase
      .from("recipes")
      .insert(rowFromRecipe(recipe))
      .select("*")
      .single();

    if (error !== null) throw new Error(error.message);
    return recipeFromRow(data);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error !== null) throw new Error(error.message);
  },

  async update(recipe: Recipe): Promise<Recipe> {
    const { data, error } = await supabase
      .from("recipes")
      .update(rowFromRecipe(recipe))
      .eq("id", recipe.id)
      .select("*")
      .single();

    if (error !== null) throw new Error(error.message);
    return recipeFromRow(data);
  },
};
