import { useState } from "react";

import { ActionSheet, type SheetAction } from "@/components/ActionSheet";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { availableRecipeActions, type RecipeAction } from "@/domain/recipes/recipeActions";
import { ConfirmDeleteRecipe } from "@/features/recipes/ConfirmDeleteRecipe";
import { ConfirmDeleteCookbook } from "./ConfirmDeleteCookbook";
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
  canDeleteCookbook: boolean;
  isOpen: boolean;
  onClose: () => void;
  onReorder: () => void;
  onAddToCookbook: () => void;
  onRemoved: (outcome: RemoveOutcome) => void;
  onDeleted: () => void;
  onCookbookDeleted: () => void;
};

const LABELS: Record<RecipeAction, Omit<SheetAction, "onPress">> = {
  reorder: { label: "Reordenar recetas", icon: "swap-vert" },
  addToCookbook: { label: "Añadir a otro libro", icon: "library-add" },
  removeFromCookbook: { label: "Quitar de este libro", icon: "playlist-remove" },
  delete: { label: "Borrar receta", icon: "delete-outline", isDestructive: true },
  deleteCookbook: { label: "Eliminar libro", icon: "delete-sweep", isDestructive: true },
};

/** Lo que se puede hacer con una receta sin salir del libro. */
export function CookbookRecipeActions({
  cookbookId,
  recipeId,
  recipeCount,
  canDeleteCookbook,
  isOpen,
  onClose,
  onReorder,
  onAddToCookbook,
  onRemoved,
  onDeleted,
  onCookbookDeleted,
}: CookbookRecipeActionsProps) {
  const [asked, setAsked] = useState<"recipe" | "cookbook" | null>(null);

  const remove = async (): Promise<void> => {
    try {
      const fallback = await removeRecipeFromCookbook(cookbookId, recipeId);
      onRemoved(fallback === null ? { kind: "removed" } : { kind: "refiled", cookbook: fallback });
    } catch (cause) {
      console.warn("No se ha podido sacar la receta del libro", cause);
      onRemoved({ kind: "failed" });
    }
  };

  // Lo que abre un diálogo no cierra el menú desde fuera: si el padre deja de pintar esto, el
  // diálogo se va con él y no llega a verse.
  const run = (action: RecipeAction): void => {
    if (action === "delete" || action === "deleteCookbook") {
      setAsked(action === "delete" ? "recipe" : "cookbook");
      return;
    }

    onClose();
    if (action === "reorder") onReorder();
    if (action === "addToCookbook") onAddToCookbook();
    if (action === "removeFromCookbook") void remove();
  };

  const close = (): void => {
    setAsked(null);
    onClose();
  };

  const actions = availableRecipeActions({ recipeCount, canDeleteCookbook }).map(
    (action): SheetAction => ({
      ...LABELS[action],
      onPress: () => {
        run(action);
      },
    }),
  );

  return (
    <>
      <ActionSheet isOpen={isOpen && asked === null} actions={actions} onClose={onClose} />
      <ConfirmDeleteRecipe
        recipeId={recipeId}
        isOpen={asked === "recipe"}
        onDeleted={() => {
          close();
          onDeleted();
        }}
        onClose={close}
      />
      <ConfirmDeleteCookbook
        cookbookId={cookbookId}
        isOpen={asked === "cookbook"}
        onDeleted={() => {
          close();
          onCookbookDeleted();
        }}
        onClose={close}
      />
    </>
  );
}
