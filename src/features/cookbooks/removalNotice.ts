import type { RemoveOutcome } from "./CookbookRecipeActions";

/**
 * Qué contarle a la usuaria después de sacar una receta del libro.
 *
 * Nada cuando el resultado se ve solo: la receta desaparece de la lista y ya está. Si ha tenido
 * que recolocarse, o si ni siquiera ha salido, hay que decirlo.
 */
export function removalNotice(outcome: RemoveOutcome, cookbookId: string): string | null {
  if (outcome.kind === "failed") return "No se ha podido quitar del libro. Inténtalo otra vez.";
  if (outcome.kind === "removed") return null;

  return outcome.cookbook.id === cookbookId
    ? "Esta receta solo estaba aquí, así que se queda: ninguna receta puede quedarse sin libro."
    : `Era su único libro, así que se ha ido a «${outcome.cookbook.title}».`;
}
