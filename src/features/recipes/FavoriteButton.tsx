import { IconButton } from "@/components/IconButton";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { saveRecipeFavorite } from "./saveRecipeFavorite";

type FavoriteButtonProps = {
  recipe: SavedRecipe;
  onChange: (recipe: SavedRecipe) => void;
};

/** El corazón de la receta: lleno y en terracota cuando es favorita. */
export function FavoriteButton({ recipe, onChange }: FavoriteButtonProps) {
  return (
    <IconButton
      name={recipe.isFavorite ? "favorite" : "favorite-border"}
      label={recipe.isFavorite ? "Quitar de favoritas" : "Guardar en favoritas"}
      tone={recipe.isFavorite ? "primary" : "muted"}
      onPress={() => {
        void saveRecipeFavorite(recipe).then(onChange);
      }}
    />
  );
}
