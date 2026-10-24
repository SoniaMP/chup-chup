const REPLACEMENTS: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Deja un texto de la usuaria listo para meterlo en una página.
 *
 * El visor pinta lo que ella escribió, así que un ingrediente llamado `<script>` no puede llegar
 * entero a la página de nadie. Se escapa siempre, aunque el texto parezca inofensivo: decidir
 * cuándo hace falta es justo donde se cuelan los fallos.
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => REPLACEMENTS[character] ?? character);
}
