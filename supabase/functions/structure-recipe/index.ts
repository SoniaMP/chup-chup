import { askClaude, type StructuredAnswer } from "./askClaude.ts";
import { claimDailyUse } from "./claimDailyUse.ts";
import { releaseDailyUse } from "./releaseDailyUse.ts";
import { admin } from "./supabaseAdmin.ts";

/** Un texto más largo que esto no es una receta escrita deprisa, es otra cosa. */
const MAX_INPUT = 6_000;

// `supabase-js` manda más cabeceras de las que uno imagina (`apikey`, `x-client-info`): si no
// están permitidas, el navegador ni siquiera llega a hacer la petición y lo llama error de CORS.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, x-client-info, x-supabase-api-version, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

/**
 * Lo que no ha salido bien viaja como respuesta normal, no como error HTTP.
 *
 * Así la app puede contar el motivo en vez de enseñar "algo ha fallado": el 500 se reserva para
 * lo que de verdad se ha roto.
 */
const answer = (body: StructuredAnswer, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

/** De quién es la sesión que llama, comprobada contra el servidor y no contra lo que diga el cuerpo. */
const ownerFromRequest = async (request: Request): Promise<string | null> => {
  const authorization = request.headers.get("Authorization");
  if (authorization === null) return null;

  const { data } = await admin.auth.getUser(authorization.replace("Bearer ", ""));
  return data.user?.id ?? null;
};

const rawInputFrom = async (request: Request): Promise<string | null> => {
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null) return null;

  const rawInput = (body as { rawInput?: unknown }).rawInput;
  return typeof rawInput === "string" ? rawInput.trim() : null;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const ownerId = await ownerFromRequest(request);
  if (ownerId === null) {
    return answer({ ok: false, error: "Hay que haber entrado para usar esto." }, 401);
  }

  const rawInput = await rawInputFrom(request);
  if (rawInput === null || rawInput === "") {
    return answer({ ok: false, error: "No has escrito nada que pasar a limpio." });
  }
  if (rawInput.length > MAX_INPUT) {
    return answer({ ok: false, error: "Esta receta es demasiado larga. Pártela en dos." });
  }

  // El intento se apunta antes de llamar al modelo, para que nadie pueda pedir mil a la vez, y
  // se devuelve si no sale receta: del cupo solo descuentan los aciertos.
  let hasClaimed = false;

  try {
    if (!(await claimDailyUse(ownerId))) {
      return answer({ ok: false, error: "Hoy ya has estructurado todas tus recetas. Vuelve mañana." });
    }
    hasClaimed = true;

    const structured = await askClaude(rawInput);
    if (!structured.ok) await releaseDailyUse(ownerId);

    return answer(structured);
  } catch (cause) {
    console.error("No se ha podido estructurar la receta", cause);
    if (hasClaimed) await releaseDailyUse(ownerId);

    return answer({ ok: false, error: "No hemos podido hablar con la IA. Inténtalo otra vez." }, 502);
  }
});
