/**
 * La dirección pública de una receta compartida.
 *
 * Con dominio propio es `https://chup-chup.es/r/<testigo>`: nginx la traduce por detrás a la Edge
 * Function, así que el testigo no cambia y mudarse de dominio es tocar una variable, no reescribir
 * los enlaces que ya andan por ahí.
 *
 * Sin dominio —en desarrollo, o antes de desplegar— se cae a la dirección de la propia función,
 * que funciona pero se lee como texto plano: `*.supabase.co` no sirve HTML.
 */
export function sharedRecipeUrl(token: string, shareBase: string, functionsBase: string): string {
  const safe = encodeURIComponent(token);
  if (shareBase === "") return `${functionsBase}/functions/v1/shared-recipe?t=${safe}`;

  return `${shareBase.replace(/\/+$/, "")}/r/${safe}`;
}
