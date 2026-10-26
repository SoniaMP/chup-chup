import { IconButton } from "@/components/IconButton";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { useOpenRecipeEditor } from "./useOpenRecipeEditor";

/** El lápiz de la cabecera de una receta. */
export function EditRecipeButton({ recipe }: { recipe: SavedRecipe }) {
  const openEditor = useOpenRecipeEditor();

  return (
    <IconButton
      name="edit"
      label="Editar la receta"
      onPress={() => {
        void openEditor(recipe);
      }}
    />
  );
}
