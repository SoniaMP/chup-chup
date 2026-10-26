/** «1 persona», «6 personas». */
export function peopleText(servings: number): string {
  return servings === 1 ? "1 persona" : `${String(servings)} personas`;
}
