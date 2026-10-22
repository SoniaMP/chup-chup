import { localStructureRecipe } from "./localStructureRecipe";
import type { ParsedRecipe } from "./parseStructuredRecipe";

/** Lo que tarda el sustituto local en fingir que piensa, para ver la pantalla de espera. */
const PRETEND_DELAY_MS = 900;

/**
 * El único sitio por el que la app pide estructurar un texto libre.
 *
 * Hoy responde un sustituto local. En el paso 3 esta función llamará a la Edge Function y
 * ninguna pantalla se entera: la firma y el tipo de respuesta son los definitivos.
 */
export async function structureRecipe(rawInput: string): Promise<ParsedRecipe> {
  await new Promise((resolve) => setTimeout(resolve, PRETEND_DELAY_MS));
  return localStructureRecipe(rawInput);
}
