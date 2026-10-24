import type { Share } from "@/domain/sharing/share";
import { supabase } from "@/lib/supabase";

type Row = { recipe_id: string; token: string; expires_at: string };

const shareFromRow = (row: Row): Share => ({
  recipeId: row.recipe_id,
  token: row.token,
  expiresAt: row.expires_at,
});

/**
 * Los enlaces compartidos, en Supabase.
 *
 * Un enlace por receta. Volver a compartir no genera otro: le da otros treinta días al mismo, y
 * así el que mandaste hace un mes sigue abriéndose. Dejar de compartir borra la fila y el enlace
 * muere para todo el mundo a la vez.
 */
export const supabaseShareStore = {
  async get(recipeId: string): Promise<Share | null> {
    const { data, error } = await supabase
      .from("recipe_shares")
      .select("recipe_id, token, expires_at")
      .eq("recipe_id", recipeId)
      .maybeSingle();

    if (error !== null) throw new Error(error.message);
    return data === null ? null : shareFromRow(data);
  },

  /** Comparte o renueva. Los treinta días los pone la base de datos, no el móvil. */
  async share(recipeId: string): Promise<Share> {
    const { data, error } = await supabase.rpc("share_recipe", { recipe: recipeId });

    if (error !== null) throw new Error(error.message);
    return shareFromRow(data);
  },

  async stop(recipeId: string): Promise<void> {
    const { error } = await supabase.from("recipe_shares").delete().eq("recipe_id", recipeId);

    if (error !== null) throw new Error(error.message);
  },
};
