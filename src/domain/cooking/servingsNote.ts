import { peopleText } from "./peopleText";

/**
 * La línea que aparece bajo el selector cuando se cambian las raciones, para que se vea que las
 * cantidades se han recalculado y que la receta sigue intacta. Sin cambios no dice nada.
 */
export function servingsNote(chosen: number, original: number): string | null {
  if (chosen === original) return null;
  return `Cantidades ajustadas para ${peopleText(chosen)}. La receta original es para ${peopleText(original)}.`;
}
