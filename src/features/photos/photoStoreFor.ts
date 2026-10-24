import { supabase } from "@/lib/supabase";

const TYPE = "image/jpeg";

/**
 * Pasa el base64 que devuelve el selector a los bytes que espera Storage.
 *
 * Va en base64 y no como fichero porque es lo único que se comporta igual en el móvil y en el
 * navegador: en React Native, leer un `file://` como blob no da los mismos resultados.
 */
const bytesFrom = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);

  return bytes;
};

/**
 * Subir y borrar fotos de un bucket privado, donde cada cual solo entra en su carpeta.
 *
 * Es el mismo trabajo para las fotos de receta y para las portadas de libro, y lo único que
 * cambia entre las dos es el bucket, así que se dice aquí una vez.
 */
export function photoStoreFor(bucket: string) {
  return {
    async upload(path: string, base64: string): Promise<void> {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, bytesFrom(base64), { contentType: TYPE, upsert: true });

      if (error !== null) throw new Error(error.message);
    },

    async remove(paths: string[]): Promise<void> {
      if (paths.length === 0) return;

      const { error } = await supabase.storage.from(bucket).remove(paths);
      if (error !== null) throw new Error(error.message);
    },
  };
}
