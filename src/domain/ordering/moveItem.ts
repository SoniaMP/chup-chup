/** La lista con un elemento sacado de su sitio y metido en otro. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const rest = items.filter((_, index) => index !== from);
  const moved = items[from];

  if (moved === undefined) return items;

  return [...rest.slice(0, to), moved, ...rest.slice(to)];
}
