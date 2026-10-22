import { IconButton } from "@/components/IconButton";
import type { Recipe } from "@/domain/recipes/recipe";
import { saveRecipeFavorite } from "./saveRecipeFavorite";

type FavoriteButtonProps = {
  recipe: Recipe;
  onChange: (recipe: Recipe) => void;
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
