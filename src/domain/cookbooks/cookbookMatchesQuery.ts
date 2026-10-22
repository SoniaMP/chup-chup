import { matchesAllWords } from "@/domain/search/matchesAllWords";
import type { Cookbook } from "./cookbook";

/**
 * Si un libro responde a lo que se está buscando, por su nombre.
 *
 * Solo por el nombre: un libro no sale porque una receta suya coincida, porque entonces casi
 * todos saldrían siempre y dejarían de ser un atajo.
 */
export function cookbookMatchesQuery(cookbook: Cookbook, query: string): boolean {
  return matchesAllWords([cookbook.title], query);
}
