import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { supabaseCookbookCoverStore } from "@/features/photos/supabaseCookbookCoverStore";
import { writeCookbookCover } from "./writeCookbookCover";

/**
 * Pone una imagen del catálogo como portada, o quita la portada con `null`.
 *
 * Si el libro tenía una foto propia, deja de ser su portada y el fichero se borra: nadie va a
 * volver a mirar la portada que acabas de cambiar, y guardarla sería ir llenando el bucket de
 * fotos que ya no salen en ninguna pantalla.
 */
export async function saveCookbookCover(
  cookbook: Cookbook,
  imageId: string | null,
): Promise<Cookbook> {
  const updated = await writeCookbookCover(cookbook.id, {
    library_image: imageId,
    cover_photo: null,
  });

  if (cookbook.coverPhoto !== undefined) {
    await supabaseCookbookCoverStore.remove([cookbook.coverPhoto]);
  }

  return updated;
}
