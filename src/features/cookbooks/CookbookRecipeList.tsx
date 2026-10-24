import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Notice } from "@/components/Notice";
import { ReorderBar } from "@/components/ReorderBar";
import { ReorderableList } from "@/components/ReorderableList";
import { RecipeRow } from "@/features/library/RecipeRow";
import { tokens } from "@/theme/tokens";
import type { CookbookEntry } from "./cookbookEntry";
import { CookbookRecipeActions } from "./CookbookRecipeActions";
import { removalNotice } from "./removalNotice";
import { useReorderCookbookRecipes } from "./useReorderCookbookRecipes";

type CookbookRecipeListProps = {
  cookbookId: string;
  entries: CookbookEntry[];
  /** El libro por defecto no se borra: es donde caen las recetas que no tienen otro. */
  canDeleteCookbook: boolean;
  onOpenRecipe: (recipeId: string) => void;
  onAddToCookbook: (recipeId: string) => void;
  onCookbookDeleted: () => void;
  /** Para releer el libro cuando algo cambia, y si no se ha podido guardar un arrastre. */
  onReload: () => void;
};

/** Las recetas de un libro: se abren tocando y se manejan dejando el dedo encima. */
export function CookbookRecipeList({
  cookbookId,
  entries,
  canDeleteCookbook,
  onOpenRecipe,
  onAddToCookbook,
  onCookbookDeleted,
  onReload,
}: CookbookRecipeListProps) {
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { items, move } = useReorderCookbookRecipes(cookbookId, entries, onReload);

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
          onDone={() => {
            setIsReordering(false);
          }}
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
      {notice !== null && (
        <Notice
          text={notice}
          onDismiss={() => {
            setNotice(null);
          }}
        />
      )}

      {items.map((entry) => (
        <RecipeRow
          key={entry.recipe.id}
          recipe={entry.recipe}
          onPress={() => {
            onOpenRecipe(entry.recipe.id);
          }}
          onOpenActions={() => {
            setNotice(null);
            setChosenId(entry.recipe.id);
          }}
        />
      ))}

      {chosenId !== null && (
        <CookbookRecipeActions
          cookbookId={cookbookId}
          recipeId={chosenId}
          recipeCover={items.find((entry) => entry.recipe.id === chosenId)?.recipe.libraryImage}
          recipeCount={items.length}
          canDeleteCookbook={canDeleteCookbook}
          isOpen
          onClose={() => {
            setChosenId(null);
          }}
          onReorder={() => {
            setChosenId(null);
            setIsReordering(true);
          }}
          onAddToCookbook={() => {
            const recipeId = chosenId;
            setChosenId(null);
            onAddToCookbook(recipeId);
          }}
          onRemoved={(outcome) => {
            setChosenId(null);
            setNotice(removalNotice(outcome, cookbookId));
            onReload();
          }}
          onCoverChanged={() => {
            setChosenId(null);
            onReload();
          }}
          onDeleted={() => {
            setChosenId(null);
            onReload();
          }}
          onCookbookDeleted={() => {
            setChosenId(null);
            onCookbookDeleted();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row },
});
