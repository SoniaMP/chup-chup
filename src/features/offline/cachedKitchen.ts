import { z } from "zod";

import { cookbookSchema, type Cookbook } from "@/domain/cookbooks/cookbook";
import { savedRecipeSchema, type SavedRecipe } from "@/domain/recipes/savedRecipe";
import { currentOwnerId } from "@/features/auth/currentOwnerId";
import type { CookbookEntry } from "@/features/cookbooks/cookbookEntry";
import { entriesFromPlacements } from "@/features/cookbooks/entriesFromPlacements";
import type { Placement } from "@/features/cookbooks/placement";
import { localCache } from "./localCache";

const RECIPES = "recipes";
const COOKBOOKS = "cookbooks";
const PLACEMENTS = "membership";

const recipesSchema = z.array(savedRecipeSchema);
const cookbooksSchema = z.array(cookbookSchema);
const placementsSchema = z.array(
  z.object({ cookbookId: z.uuid(), recipeId: z.uuid(), position: z.string().min(1) }),
);

const read = async <T>(what: string, schema: z.ZodType<T>): Promise<T | null> => {
  const ownerId = await currentOwnerId().catch(() => null);
  return ownerId === null ? null : localCache.read(ownerId, what, schema);
};

/**
 * La cocina guardada en el móvil, leída por piezas.
 *
 * Las pantallas de detalle no guardan nada suyo: se sirven de lo que dejó la pantalla principal,
 * que es la que escribe la copia. Así no hay dos copias de la misma receta que puedan discrepar.
 */
export const cachedKitchen = {
  what: { recipes: RECIPES, cookbooks: COOKBOOKS, placements: PLACEMENTS },
  schema: { recipes: recipesSchema, cookbooks: cookbooksSchema, placements: placementsSchema },

  recipes: (): Promise<SavedRecipe[] | null> => read(RECIPES, recipesSchema),

  async recipe(id: string): Promise<SavedRecipe | null> {
    const kept = await read(RECIPES, recipesSchema);
    return kept?.find((recipe) => recipe.id === id) ?? null;
  },

  async cookbook(id: string): Promise<Cookbook | null> {
    const kept = await read(COOKBOOKS, cookbooksSchema);
    return kept?.find((cookbook) => cookbook.id === id) ?? null;
  },

  /** Las recetas de un libro, armadas con las dos mitades que hay guardadas. */
  async entries(cookbookId: string): Promise<CookbookEntry[] | null> {
    const placements: Placement[] | null = await read(PLACEMENTS, placementsSchema);
    const recipes = await read(RECIPES, recipesSchema);

    if (placements === null || recipes === null) return null;
    return entriesFromPlacements(placements, recipes, cookbookId);
  },
};
