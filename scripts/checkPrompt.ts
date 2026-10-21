/**
 * Graba los fixtures del prompt de estructuración.
 *
 * Es una herramienta de desarrollo, no parte de la app: `npm test` no la ejecuta nunca, y por eso
 * los tests son deterministas y gratis. Esto sí llama al modelo de verdad, así que **cuesta
 * dinero** y necesita credenciales (`ANTHROPIC_API_KEY`, o `ant auth login`).
 *
 *   npm run record:fixtures                      graba los que falten
 *   npm run record:fixtures -- --all             regraba todos
 *   npm run record:fixtures -- sponge-cake-vague-amounts   solo uno
 *   MODEL=claude-haiku-5-5 npm run record:fixtures -- --all   con otro modelo
 *
 * El reintento y el repliegue ante un rechazo del modelo no van aquí: viven en la Edge Function
 * del paso 3, que es el camino real de la app.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { structuredRecipeSchema } from "../src/domain/recipes/structuredRecipe";
import { STRUCTURE_RECIPE_PROMPT } from "../src/features/ai/structureRecipePrompt";

const INPUTS_DIR = join(import.meta.dirname, "../tests/fixtures/inputs");
const OUTPUTS_DIR = join(import.meta.dirname, "../tests/fixtures/outputs");
/** Cambiable para comparar modelos contra los mismos textos: MODEL=claude-haiku-5-5 npm run … */
const MODEL = process.env.MODEL ?? "claude-opus-5-5";

const client = new Anthropic();

const structureRecipe = async (text: string) => {
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16_000,
    system: STRUCTURE_RECIPE_PROMPT,
    output_config: {
      effort: "medium",
      format: zodOutputFormat(structuredRecipeSchema),
    },
    messages: [{ role: "user", content: text }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("El modelo ha rechazado la petición");
  }
  if (response.parsed_output === null) {
    throw new Error("La respuesta no cumple el esquema de receta");
  }
  return response.parsed_output;
};

const fixturesToRecord = (args: string[]): string[] => {
  const all = args.includes("--all");
  const requested = args.filter((arg) => !arg.startsWith("--"));
  return readdirSync(INPUTS_DIR)
    .filter((file) => file.endsWith(".txt"))
    .map((file) => basename(file, ".txt"))
    .filter((name) => (requested.length > 0 ? requested.includes(name) : true))
    .filter((name) => all || requested.length > 0 || !existsSync(join(OUTPUTS_DIR, `${name}.json`)))
    .sort();
};

const recordFixtures = async (names: string[]): Promise<void> => {
  console.log(`Grabando ${names.length} fixture(s) con ${MODEL}…\n`);
  for (const name of names) {
    const text = readFileSync(join(INPUTS_DIR, `${name}.txt`), "utf-8").trim();
    process.stdout.write(`  ${name} … `);
    const recipe = await structureRecipe(text);
    writeFileSync(join(OUTPUTS_DIR, `${name}.json`), `${JSON.stringify(recipe, null, 2)}\n`);
    console.log(`${recipe.ingredients.length} ingredientes, ${recipe.steps.length} pasos`);
  }
  console.log("\nListo. Ejecuta `npm test` para comprobarlos.");
};

const names = fixturesToRecord(process.argv.slice(2));
if (names.length === 0) {
  console.log("Nada que grabar. Usa --all para regrabar todos los fixtures.");
} else {
  try {
    await recordFixtures(names);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("authentication")) {
      console.error("\n\nNo hay credenciales. Exporta tu clave y vuelve a intentarlo:");
      console.error("  export ANTHROPIC_API_KEY=sk-ant-...\n");
      process.exit(1);
    }
    console.error(`\n\nHa fallado: ${message}\n`);
    process.exit(1);
  }
}
