import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { buckets } from "./buckets";
import { signedPhotoCache } from "./signedPhotoCache";

// La caché se guarda por ruta y no por bucket más ruta: las rutas de los dos buckets tienen
// forma distinta —receta es "<dueña>/<receta>/<cual>.jpg" y portada "<dueña>/<libro>.jpg"—, así
// que no se pisan, y olvidar una firma sigue siendo decir una sola cosa.
const signUrl = async (path: string, bucket: string): Promise<string> => {
  const fresh = signedPhotoCache.fresh(path);
  if (fresh !== null) return fresh;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, signedPhotoCache.lastsSeconds);

  if (error !== null) throw new Error(error.message);

  signedPhotoCache.keep(path, data.signedUrl);
  return data.signedUrl;
};

/**
 * La URL con la que se puede pintar una foto del bucket privado.
 *
 * Las fotos no son públicas: en la base se guarda la ruta del objeto y aquí se firma para poder
 * enseñarla. Mientras no hay URL, quien llama pinta lo que pintaría si no hubiera foto.
 */
export function useSignedPhotoUrl(
  path: string | null,
  bucket: string = buckets.recipePhotos,
): string | null {
  const [url, setUrl] = useState<string | null>(() =>
    path === null ? null : signedPhotoCache.fresh(path),
  );
  // La ruta de una foto no cambia al cambiarla, así que esto es lo único que avisa de que hay
  // que volver a firmar: sin ello se seguiría viendo la foto anterior hasta volver a entrar.
  const [changes, setChanges] = useState(0);

  useEffect(
    () =>
      signedPhotoCache.watch(() => {
        setChanges((count) => count + 1);
      }),
    [],
  );

  useEffect(() => {
    if (path === null) {
      setUrl(null);
      return;
    }

    let isCurrent = true;
    void signUrl(path, bucket)
      .catch((cause: unknown) => {
        console.warn("No se ha podido firmar la foto", cause);
        return null;
      })
      .then((fresh) => {
        if (isCurrent) setUrl(fresh);
      });

    return () => {
      isCurrent = false;
    };
  }, [path, bucket, changes]);

  return url;
}
