import type { SheetAction } from "@/components/ActionSheet";
import type { RecipeAction } from "@/domain/recipes/recipeActions";

/**
 * Cómo se llama y con qué icono sale cada acción de una receta.
 *
 * Están aquí y no en cada menú porque una receta se maneja desde dos sitios, dentro de un libro y
 * en los resultados de filtrar, y «Borrar receta» tiene que decirse igual en los dos.
 */
export const recipeActionLabels: Record<RecipeAction, Omit<SheetAction, "onPress">> = {
  reorder: { label: "Reordenar recetas", icon: "swap-vert" },
  cover: { label: "Cambiar portada", icon: "image" },
  addToCookbook: { label: "Añadir a otro libro", icon: "library-add" },
  removeFromCookbook: { label: "Quitar de este libro", icon: "playlist-remove" },
  delete: { label: "Borrar receta", icon: "delete-outline", isDestructive: true },
  deleteCookbook: { label: "Eliminar libro", icon: "delete-sweep", isDestructive: true },
};
