/** "Limón" y "limon" son la misma búsqueda: fuera mayúsculas y fuera tildes. */
const normalize = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Si todas las palabras de la búsqueda aparecen en alguno de los textos.
 *
 * No tienen que estar en el mismo: "pollo limon" encuentra lo que se llama "Pollo al horno" y
 * lleva limón entre los ingredientes. Una búsqueda vacía la cumple todo.
 */
export function matchesAllWords(haystacks: string[], query: string): boolean {
  const words = normalize(query)
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (words.length === 0) return true;

  const texts = haystacks.map(normalize);

  return words.every((word) => texts.some((text) => text.includes(word)));
}
