import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { cookbookFromRow } from "@/features/cookbooks/cookbookFromRow";
import { supabase } from "@/lib/supabase";

type CoverColumns = { library_image: string | null; cover_photo: string | null };

/**
 * Deja la portada del libro en lo que diga, y solo en eso.
 *
 * Las dos columnas se escriben siempre juntas, nunca una sola: es lo que hace imposible que un
 * libro acabe con la imagen del catálogo y una foto propia a la vez.
 */
export async function writeCookbookCover(
  cookbookId: string,
  cover: CoverColumns,
): Promise<Cookbook> {
  const { data, error } = await supabase
    .from("cookbooks")
    .update(cover)
    .eq("id", cookbookId)
    .select("*")
    .single();

  if (error !== null) throw new Error(error.message);
  return cookbookFromRow(data);
}
