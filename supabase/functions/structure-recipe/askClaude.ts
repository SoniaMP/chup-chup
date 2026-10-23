import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

import {
  structuredRecipeSchema,
  type StructuredRecipe,
} from "../../../src/domain/recipes/structuredRecipe.ts";
import { STRUCTURE_RECIPE_PROMPT } from "../../../src/features/ai/structureRecipePrompt.ts";

export type StructuredAnswer =
  | { ok: true; value: StructuredRecipe }
  | { ok: false; error: string };

/** El modelo de cada día y el de rescate, que solo entra cuando el primero no cumple. */
const MODEL = Deno.env.get("AI_MODEL") ?? "claude-haiku-5-5";
const BACKUP_MODEL = Deno.env.get("AI_BACKUP_MODEL") ?? "claude-sonnet-5-5";

const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") ?? "" });

// El prompt no cambia entre llamadas, así que se marca para que el proveedor lo cachee: es la
// parte más larga de lo que se envía y la que se repite siempre igual.
const system = [
  {
    type: "text" as const,
    text: STRUCTURE_RECIPE_PROMPT,
    cache_control: { type: "ephemeral" as const },
  },
];

const askOnce = async (model: string, rawInput: string): Promise<StructuredRecipe | null> => {
  const response = await client.messages.parse({
    model,
    max_tokens: 16_000,
    system,
    output_config: { effort: "medium", format: zodOutputFormat(structuredRecipeSchema) },
    messages: [{ role: "user", content: rawInput }],
  });

  if (response.stop_reason === "refusal") return null;
  return response.parsed_output;
};

/**
 * Pasa a limpio el texto libre, con un segundo intento en el modelo bueno.
 *
 * El reintento no es solo por si acaso: es la red de calidad. Lo normal lo resuelve el modelo
 * barato, y cuando la respuesta no cumple el esquema se paga el caro, que es cuando hace falta.
 */
export async function askClaude(rawInput: string): Promise<StructuredAnswer> {
  const first = await askOnce(MODEL, rawInput);
  if (first !== null) return { ok: true, value: first };

  const second = await askOnce(BACKUP_MODEL, rawInput);
  if (second !== null) return { ok: true, value: second };

  return { ok: false, error: "No hemos sabido entender esta receta. Prueba a contarla otra vez." };
}
