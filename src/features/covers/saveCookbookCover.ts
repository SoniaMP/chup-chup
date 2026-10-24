import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { cookbookFromRow } from "@/features/cookbooks/cookbookFromRow";
import { supabase } from "@/lib/supabase";

/** Pone o quita la portada de un libro. `null` la quita y vuelve el degradado. */
export async function saveCookbookCover(
  cookbookId: string,
  imageId: string | null,
): Promise<Cookbook> {
  const { data, error } = await supabase
    .from("cookbooks")
    .update({ library_image: imageId })
    .eq("id", cookbookId)
    .select("*")
    .single();

  if (error !== null) throw new Error(error.message);
  return cookbookFromRow(data);
}
