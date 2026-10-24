import { cookbookCoverPath } from "@/domain/photos/cookbookCoverPath";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { signedPhotoCache } from "@/features/photos/signedPhotoCache";
import { supabaseCookbookCoverStore } from "@/features/photos/supabaseCookbookCoverStore";
import { writeCookbookCover } from "./writeCookbookCover";

/**
 * Pone una foto de la usuaria como portada del libro.
 *
 * Primero el fichero y después la fila, como con las fotos de receta: si la subida falla, el
 * libro sigue con la portada que tenía y no con una que no existe. La ruta no cambia al cambiar
 * de foto, así que hay que olvidar la firma vieja o se seguiría viendo la anterior.
 */
export async function saveCookbookCoverPhoto(
  cookbook: Cookbook,
  base64: string,
): Promise<Cookbook> {
  const path = cookbookCoverPath(cookbook.ownerId, cookbook.id);

  await supabaseCookbookCoverStore.upload(path, base64);
  signedPhotoCache.forget(path);

  return writeCookbookCover(cookbook.id, { library_image: null, cover_photo: path });
}
