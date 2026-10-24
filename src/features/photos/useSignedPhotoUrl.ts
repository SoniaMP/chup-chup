import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { signedPhotoCache } from "./signedPhotoCache";

const BUCKET = "recipe-photos";

const signUrl = async (path: string): Promise<string> => {
  const fresh = signedPhotoCache.fresh(path);
  if (fresh !== null) return fresh;

  const { data, error } = await supabase.storage
    .from(BUCKET)
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
export function useSignedPhotoUrl(path: string | null): string | null {
  const [url, setUrl] = useState<string | null>(() =>
    path === null ? null : signedPhotoCache.fresh(path),
  );

  useEffect(() => {
    if (path === null) {
      setUrl(null);
      return;
    }

    let isCurrent = true;
    void signUrl(path)
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
  }, [path]);

  return url;
}
