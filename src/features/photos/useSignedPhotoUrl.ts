import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

const BUCKET = "recipe-photos";
/** Una hora, que es lo que dura una sesión de cocina de sobra. */
const LASTS_SECONDS = 3600;
/** Se vuelve a firmar diez minutos antes de caducar: nunca se enseña una URL muerta. */
const REUSE_MS = (LASTS_SECONDS - 600) * 1000;

const signed = new Map<string, { url: string; at: number }>();

const signUrl = async (path: string): Promise<string> => {
  const fresh = signed.get(path);
  if (fresh !== undefined && Date.now() - fresh.at < REUSE_MS) return fresh.url;

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, LASTS_SECONDS);
  if (error !== null) throw new Error(error.message);

  signed.set(path, { url: data.signedUrl, at: Date.now() });
  return data.signedUrl;
};

/**
 * La URL con la que se puede pintar una foto del bucket privado.
 *
 * Las fotos no son públicas: en la base se guarda la ruta del objeto y aquí se firma para poder
 * enseñarla. La firma caduca, así que se guarda en memoria y se renueva sola; mientras no haya
 * URL, quien llama pinta lo que pintaría si no hubiera foto.
 */
export function useSignedPhotoUrl(path: string | null): string | null {
  const [url, setUrl] = useState<string | null>(() =>
    path === null ? null : (signed.get(path)?.url ?? null),
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
