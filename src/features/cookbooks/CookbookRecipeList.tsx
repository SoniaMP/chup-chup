import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Notice } from "@/components/Notice";
import { ReorderBar } from "@/components/ReorderBar";
import { ReorderableList } from "@/components/ReorderableList";
import { RecipeRow } from "@/features/library/RecipeRow";
import { tokens } from "@/theme/tokens";
import type { CookbookEntry } from "./cookbookEntry";
import { CookbookRecipeActions, type RemoveOutcome } from "./CookbookRecipeActions";
import { useReorderCookbookRecipes } from "./useReorderCookbookRecipes";

type CookbookRecipeListProps = {
  cookbookId: string;
  entries: CookbookEntry[];
  onOpenRecipe: (recipeId: string) => void;
  onAddToCookbook: (recipeId: string) => void;
  /** Para releer el libro cuando algo cambia, y si no se ha podido guardar un arrastre. */
  onReload: () => void;
};

const noticeFor = (outcome: RemoveOutcome, cookbookId: string): string | null => {
  if (outcome.kind === "failed") return "No se ha podido quitar del libro. Inténtalo otra vez.";
  if (outcome.kind === "removed") return null;

  // Era su único libro: ninguna receta puede quedarse sin ninguno.
  return outcome.cookbook.id === cookbookId
    ? "Esta receta solo estaba aquí, así que se queda: ninguna receta puede quedarse sin libro."
    : `Era su único libro, así que se ha ido a «${outcome.cookbook.title}».`;
};

/** Las recetas de un libro: se abren tocando y se manejan dejando el dedo encima. */
export function CookbookRecipeList({
  cookbookId,
  entries,
  onOpenRecipe,
  onAddToCookbook,
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
          onLongPress={() => {
            setNotice(null);
            setChosenId(entry.recipe.id);
          }}
        />
      ))}

      {chosenId !== null && (
        <CookbookRecipeActions
          cookbookId={cookbookId}
          recipeId={chosenId}
          recipeCount={items.length}
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
            setNotice(noticeFor(outcome, cookbookId));
            onReload();
          }}
          onDeleted={() => {
            setChosenId(null);
            onReload();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row },
});
