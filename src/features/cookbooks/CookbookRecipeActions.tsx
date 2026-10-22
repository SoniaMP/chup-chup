import { useState } from "react";

import { ActionSheet, type SheetAction } from "@/components/ActionSheet";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { availableRecipeActions, type RecipeAction } from "@/domain/recipes/recipeActions";
import { ConfirmDeleteRecipe } from "@/features/recipes/ConfirmDeleteRecipe";
import { removeRecipeFromCookbook } from "./removeRecipeFromCookbook";

/** Cómo ha acabado el intento de sacar la receta del libro. */
export type RemoveOutcome =
  | { kind: "removed" }
  | { kind: "refiled"; cookbook: Cookbook }
  | { kind: "failed" };

type CookbookRecipeActionsProps = {
  cookbookId: string;
  recipeId: string;
  recipeCount: number;
  isOpen: boolean;
  onClose: () => void;
  onReorder: () => void;
  onAddToCookbook: () => void;
  onRemoved: (outcome: RemoveOutcome) => void;
  onDeleted: () => void;
};

const LABELS: Record<RecipeAction, Omit<SheetAction, "onPress">> = {
  reorder: { label: "Reordenar recetas", icon: "swap-vert" },
  addToCookbook: { label: "Añadir a otro libro", icon: "library-add" },
  removeFromCookbook: { label: "Quitar de este libro", icon: "playlist-remove" },
  delete: { label: "Borrar receta", icon: "delete-outline", isDestructive: true },
};

/** Lo que se puede hacer con una receta sin salir del libro. */
export function CookbookRecipeActions({
  cookbookId,
  recipeId,
  recipeCount,
  isOpen,
  onClose,
  onReorder,
  onAddToCookbook,
  onRemoved,
  onDeleted,
}: CookbookRecipeActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = async (): Promise<void> => {
    try {
      const fallback = await removeRecipeFromCookbook(cookbookId, recipeId);
      onRemoved(fallback === null ? { kind: "removed" } : { kind: "refiled", cookbook: fallback });
    } catch (cause) {
      console.warn("No se ha podido sacar la receta del libro", cause);
      onRemoved({ kind: "failed" });
    }
  };

  const run = (action: RecipeAction): void => {
    onClose();
    if (action === "reorder") onReorder();
    if (action === "addToCookbook") onAddToCookbook();
    if (action === "removeFromCookbook") void remove();
    if (action === "delete") setIsDeleting(true);
  };

  const actions = availableRecipeActions(recipeCount).map(
    (action): SheetAction => ({
      ...LABELS[action],
      onPress: () => {
        run(action);
      },
    }),
  );

  return (
    <>
      <ActionSheet isOpen={isOpen && !isDeleting} actions={actions} onClose={onClose} />
      <ConfirmDeleteRecipe
        recipeId={recipeId}
        isOpen={isDeleting}
        onDeleted={() => {
          setIsDeleting(false);
          onDeleted();
        }}
        onClose={() => {
          setIsDeleting(false);
        }}
      />
    </>
  );
}
