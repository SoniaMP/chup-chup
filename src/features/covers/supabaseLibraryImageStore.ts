import { supabase } from "@/lib/supabase";
import type { LibraryImage } from "./libraryImage";

const BUCKET = "library-images";
const SMALL = "-small";
const IMAGES = /\.(jpg|jpeg|png|webp)$/i;

const publicUrl = (file: string): string =>
  supabase.storage.from(BUCKET).getPublicUrl(file).data.publicUrl;

/**
 * El catálogo de imágenes del proyecto, en un bucket público.
 *
 * No hay tabla que lo liste: el bucket es la lista, ordenada por nombre de fichero. Cada imagen
 * son dos ficheros, `limones-01.jpg` y `limones-01-small.jpg`, y aquí se juntan en una sola cosa.
 * El identificador es el nombre del fichero grande, con su extensión, para no atarnos a un
 * formato: el día que haya WebP conviven sin migrar nada.
 */
export const supabaseLibraryImageStore = {
  async list(): Promise<LibraryImage[]> {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { sortBy: { column: "name", order: "asc" } });

    if (error !== null) throw new Error(error.message);

    return data
      .filter((file) => IMAGES.test(file.name) && !file.name.includes(SMALL))
      .map((file) => supabaseLibraryImageStore.byId(file.name));
  },

  /** La misma imagen a partir de su identificador, sin preguntar al servidor. */
  byId(id: string): LibraryImage {
    return {
      id,
      url: publicUrl(id),
      smallUrl: publicUrl(id.replace(IMAGES, (extension) => `${SMALL}${extension}`)),
    };
  },
};
