import type { Ingredient } from "../../../src/domain/recipes/ingredient.ts";
import type { Step } from "../../../src/domain/recipes/step.ts";
import { isShareExpired } from "../../../src/domain/sharing/isShareExpired.ts";
import { linkGoneHtml } from "../../../src/domain/sharing/linkGoneHtml.ts";
import { recipeViewerHtml } from "../../../src/domain/sharing/recipeViewerHtml.ts";
import { sharedRecipeFrom } from "../../../src/domain/sharing/sharedRecipe.ts";
import { displayName } from "../../../src/domain/users/displayName.ts";
import { admin } from "./supabaseAdmin.ts";

/** Lo que vive la firma de la foto. Lo mismo que dentro de la app: una sesión de cocina. */
const PHOTO_LASTS_SECONDS = 3600;

const page = (html: string, status: number): Response =>
  new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Que no se quede en ninguna caché de por medio: el enlace se puede retirar en cualquier
      // momento y una copia cacheada seguiría enseñando la receta.
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });

/** Con qué nombre se firma la receta. Si no se puede saber, la página sale sin firma. */
const authorOf = async (ownerId: string): Promise<string | null> => {
  const { data, error } = await admin.auth.admin.getUserById(ownerId);
  if (error !== null || data.user === null) return null;

  const name = data.user.user_metadata["name"];
  return displayName({
    ...(data.user.email === undefined ? {} : { email: data.user.email }),
    ...(typeof name === "string" ? { name } : {}),
  });
};

/** La foto, firmada para un rato. El bucket es privado: la página no puede llevar la ruta. */
const photoOf = async (path: string | null): Promise<string | undefined> => {
  if (path === null) return undefined;

  const { data, error } = await admin.storage
    .from("recipe-photos")
    .createSignedUrl(path, PHOTO_LASTS_SECONDS);

  return error === null ? data.signedUrl : undefined;
};

/**
 * El visor de una receta compartida: una página y nada más.
 *
 * Es pública a propósito —quien recibe el enlace no tiene por qué tener cuenta—, así que se abre
 * sin testigo de sesión (`verify_jwt = false` en `config.toml`). Lo que decide si se enseña algo
 * es el testigo del enlace, y lo que decide qué campos salen es `sharedRecipeFrom`, nunca esta
 * función: aquí no se elige nada, se sirve.
 */
Deno.serve(async (request: Request): Promise<Response> => {
  const token = new URL(request.url).searchParams.get("t") ?? "";
  if (token === "") return page(linkGoneHtml(), 404);

  const { data: share } = await admin
    .from("recipe_shares")
    .select("recipe_id, owner_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (share === null || isShareExpired(share.expires_at, new Date())) {
    return page(linkGoneHtml(), 404);
  }

  const { data: recipe } = await admin
    .from("recipes")
    .select(
      "title, locale, servings, prep_min, cook_min, ingredients, steps, photo_original, photo_enhanced, photo_active",
    )
    .eq("id", share.recipe_id)
    .maybeSingle();

  if (recipe === null) return page(linkGoneHtml(), 404);

  const active =
    recipe.photo_active === "enhanced" ? (recipe.photo_enhanced ?? recipe.photo_original) : recipe.photo_original;

  const shared = sharedRecipeFrom(
    {
      title: recipe.title,
      locale: recipe.locale,
      servings: recipe.servings ?? undefined,
      prepMin: recipe.prep_min ?? undefined,
      cookMin: recipe.cook_min ?? undefined,
      // Salen del `jsonb` tal y como los guardó la app, que es la que los validó al escribirlos.
      ingredients: recipe.ingredients as Ingredient[],
      steps: recipe.steps as Step[],
    },
    await authorOf(share.owner_id),
    await photoOf(active),
  );

  return page(recipeViewerHtml(shared), 200);
});
