import { recipePhotoPath } from "@/domain/photos/recipePhotoPath";
import type { Recipe } from "@/domain/recipes/recipe";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { currentOwnerId } from "@/features/auth/currentOwnerId";
import { supabase } from "@/lib/supabase";
import { recipeFromRow } from "./recipeFromRow";
import { rowFromRecipe } from "./rowFromRecipe";
import { rowFromSavedRecipe } from "./rowFromSavedRecipe";
import { savedRecipeFromRow } from "./savedRecipeFromRow";

/** Lo guardado con su receta dentro: es lo que las pantallas leen como una sola cosa. */
const WITH_RECIPE = "*, recipes (*)";

/**
 * Las recetas de la cocina, en Supabase.
 *
 * Son dos tablas: `recipes` es el contenido, de quien lo escribió, y `saved_recipes` es lo que
 * cada cocinera tiene guardado y lo que ha hecho con ello. **Tu cocina es lo que has guardado**,
 * así que todo lo que se lee sale de ahí. El RLS filtra por `owner_id` y ninguna consulta
 * necesita decir de quién es.
 */
export const supabaseRecipeStore = {
  async list(): Promise<SavedRecipe[]> {
    const { data, error } = await supabase
      .from("saved_recipes")
      .select(WITH_RECIPE)
      .order("saved_at", { ascending: false });

    if (error !== null) throw new Error(error.message);
    return data.map(savedRecipeFromRow);
  },

  async getById(id: string): Promise<SavedRecipe | null> {
    const { data, error } = await supabase
      .from("saved_recipes")
      .select(WITH_RECIPE)
      .eq("recipe_id", id)
      .maybeSingle();

    if (error !== null) throw new Error(error.message);
    return data === null ? null : savedRecipeFromRow(data);
  },

  /**
   * Guarda una receta nueva: el contenido y, acto seguido, su sitio en la cocina de quien la
   * escribe.
   *
   * Son dos inserciones y desde el cliente no hay transacción. Si la segunda falla, se borra la
   * primera: una receta que no está en ninguna cocina no la ve nadie y solo estorba.
   */
  async add(saved: SavedRecipe): Promise<SavedRecipe> {
    const { error } = await supabase.from("recipes").insert(rowFromRecipe(saved));
    if (error !== null) throw new Error(error.message);

    const written = await supabase
      .from("saved_recipes")
      .insert(rowFromSavedRecipe(saved))
      .select(WITH_RECIPE)
      .single();

    if (written.error !== null) {
      await supabase.from("recipes").delete().eq("id", saved.id);
      throw new Error(written.error.message);
    }

    return savedRecipeFromRow(written.data);
  },

  /**
   * Borra la receta y, después, sus fotos.
   *
   * Primero la fila: si falla, no se ha perdido nada. Las fotos van después y su borrado no puede
   * tumbar la operación —la receta ya no está, que es lo que se pedía—, pero se avisa, porque una
   * foto que se queda sola no la ve nadie y ocupa sitio.
   */
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error !== null) throw new Error(error.message);

    try {
      const ownerId = await currentOwnerId();
      await supabase.storage
        .from("recipe-photos")
        .remove([
          recipePhotoPath(ownerId, id, "original"),
          recipePhotoPath(ownerId, id, "enhanced"),
        ]);
    } catch (cause) {
      console.warn("La receta se ha borrado, pero sus fotos siguen en el almacén", cause);
    }
  },

  /** Cambia el contenido de la receta. Lo personal no se toca aquí: tiene su propio guardado. */
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

  /**
   * Cambia lo que es de quien la tiene guardada: la nota, la estrella y la portada.
   *
   * Se escribe la fila entera aunque `recipe_id` y `saved_at` no cambien: son los mismos valores
   * que ya hay, y así no hay dos sitios que decidan qué columnas son personales.
   */
  async savePersonal(saved: SavedRecipe): Promise<SavedRecipe> {
    const { data, error } = await supabase
      .from("saved_recipes")
      .update(rowFromSavedRecipe(saved))
      .eq("recipe_id", saved.id)
      .select(WITH_RECIPE)
      .single();

    if (error !== null) throw new Error(error.message);
    return savedRecipeFromRow(data);
  },
};
