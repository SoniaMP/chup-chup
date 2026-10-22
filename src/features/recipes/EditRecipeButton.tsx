import { useRouter } from "expo-router";

import { IconButton } from "@/components/IconButton";
import { draftFromRecipe } from "@/domain/recipes/draftFromRecipe";
import type { Recipe } from "@/domain/recipes/recipe";
import { draftStore } from "@/features/drafts/draftStore";

/** Abre la receta en el mismo formulario de la revisión, pero para cambiarla. */
export function EditRecipeButton({ recipe }: { recipe: Recipe }) {
  const router = useRouter();

  const edit = async (): Promise<void> => {
    const draftId = await draftStore.create(draftFromRecipe(recipe));
    router.push({ pathname: "/review", params: { draftId, recipeId: recipe.id } });
  };

  return (
    <IconButton
      name="edit"
      label="Editar la receta"
      onPress={() => {
        void edit();
      }}
    />
  );
}
