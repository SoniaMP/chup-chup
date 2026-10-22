import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

import { recipeSchema, type Recipe } from "@/domain/recipes/recipe";

const KEY = "recetario.recipes";
const storedRecipesSchema = z.array(recipeSchema);

const readAll = async (): Promise<Recipe[]> => {
  const stored = await AsyncStorage.getItem(KEY);
  if (stored === null) return [];

  const parsed = storedRecipesSchema.safeParse(JSON.parse(stored));
  return parsed.success ? parsed.data : [];
};

/**
 * Las recetas guardadas, hoy en el propio dispositivo.
 *
 * Es el repositorio que en el paso 2 pasa a hablar con Supabase: las pantallas piden las
 * recetas aquí y no saben de dónde salen.
 */
export const localRecipeStore = {
  async list(): Promise<Recipe[]> {
    const recipes = await readAll();
    return recipes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getById(id: string): Promise<Recipe | null> {
    const recipes = await readAll();
    return recipes.find((recipe) => recipe.id === id) ?? null;
  },

  async add(recipe: Recipe): Promise<void> {
    const recipes = await readAll();
    await AsyncStorage.setItem(KEY, JSON.stringify([...recipes, recipe]));
  },
};
