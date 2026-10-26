/**
 * Adónde vuelve el navegador después de elegir la cuenta de Google.
 *
 * Siempre a la raíz del sitio, sin la ruta ni lo que hubiera detrás: la sesión se lee del
 * fragmento que añade Supabase, y la navegación ya manda a la cocina en cuanto la hay. Es la
 * misma dirección que tiene que estar en «Redirect URLs» de Supabase.
 */
export function oauthReturnUrl(currentUrl: string): string {
  return new URL(currentUrl).origin;
}
