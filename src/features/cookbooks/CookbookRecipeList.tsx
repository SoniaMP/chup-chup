import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { ReorderBar } from "@/components/ReorderBar";
import { ReorderableList } from "@/components/ReorderableList";
import { RecipeRow } from "@/features/library/RecipeRow";
import { tokens } from "@/theme/tokens";
import type { CookbookEntry } from "./cookbookEntry";
import { useReorderCookbookRecipes } from "./useReorderCookbookRecipes";

type CookbookRecipeListProps = {
  cookbookId: string;
  entries: CookbookEntry[];
  isReordering: boolean;
  onOpenRecipe: (recipeId: string) => void;
  onDoneReordering: () => void;
  /** Para releer el libro si no se ha podido guardar un arrastre. */
  onFailed: () => void;
};

/** Las recetas de un libro: se abren tocando y se ordenan desde el botón de la cabecera. */
export function CookbookRecipeList({
  cookbookId,
  entries,
  isReordering,
  onOpenRecipe,
  onDoneReordering,
  onFailed,
}: CookbookRecipeListProps) {
  const { items, move } = useReorderCookbookRecipes(cookbookId, entries, onFailed);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Este libro está vacío"
        line="Las recetas se añaden desde la propia receta, con «Añadir a un libro»."
      />
    );
  }

  if (isReordering) {
    return (
      <View>
        <ReorderBar
          hint="Arrastra las recetas por el asa para ponerlas en orden."
          onDone={onDoneReordering}
        />
        <ReorderableList
          items={items}
          gap={tokens.spacing.row}
          keyOf={(entry) => entry.recipe.id}
          onMove={move}
          renderItem={(entry, handle) => (
            <RecipeRow
              recipe={entry.recipe}
              onPress={() => {
                onOpenRecipe(entry.recipe.id);
              }}
              handle={handle}
            />
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {items.map((entry) => (
        <RecipeRow
          key={entry.recipe.id}
          recipe={entry.recipe}
          onPress={() => {
            onOpenRecipe(entry.recipe.id);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row },
});
