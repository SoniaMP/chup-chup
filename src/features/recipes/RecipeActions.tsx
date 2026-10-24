import { useState } from "react";

import { ActionSheet, type SheetAction } from "@/components/ActionSheet";
import type { RecipeAction } from "@/domain/recipes/recipeActions";
import { CoverPicker } from "@/features/covers/CoverPicker";
import { saveRecipeCover } from "@/features/covers/saveRecipeCover";
import { ConfirmDeleteRecipe } from "./ConfirmDeleteRecipe";
import { recipeActionLabels } from "./recipeActionLabels";

/** Fuera de un libro no hay nada que reordenar ni de dónde quitarla: quedan estas tres. */
const ACTIONS: RecipeAction[] = ["cover", "addToCookbook", "delete"];

type RecipeActionsProps = {
  recipeId: string;
  /** La portada que lleva ahora, para marcarla en el selector y poder quitarla. */
  recipeCover: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onAddToCookbook: () => void;
  onCoverChanged: () => void;
  onDeleted: () => void;
};

/** Lo que se puede hacer con una receta donde no hay libro: en los resultados de filtrar. */
export function RecipeActions({
  recipeId,
  recipeCover,
  isOpen,
  onClose,
  onAddToCookbook,
  onCoverChanged,
  onDeleted,
}: RecipeActionsProps) {
  const [asked, setAsked] = useState<"recipe" | "cover" | null>(null);

  // Lo que abre un diálogo no cierra el menú desde fuera: si el padre deja de pintar esto, el
  // diálogo se va con él y no llega a verse.
  const run = (action: RecipeAction): void => {
    if (action === "delete") {
      setAsked("recipe");
      return;
    }
    if (action === "cover") {
      setAsked("cover");
      return;
    }

    onClose();
    onAddToCookbook();
  };

  const close = (): void => {
    setAsked(null);
    onClose();
  };

  const actions = ACTIONS.map(
    (action): SheetAction => ({
      ...recipeActionLabels[action],
      onPress: () => {
        run(action);
      },
    }),
  );

  return (
    <>
      <ActionSheet isOpen={isOpen && asked === null} actions={actions} onClose={onClose} />
      <CoverPicker
        isOpen={asked === "cover"}
        chosenId={recipeCover}
        onChoose={(imageId) => {
          void saveRecipeCover(recipeId, imageId)
            .catch((cause: unknown) => {
              console.warn("No se ha podido poner la portada", cause);
            })
            .finally(() => {
              close();
              onCoverChanged();
            });
        }}
        onClose={close}
      />
      <ConfirmDeleteRecipe
        recipeId={recipeId}
        isOpen={asked === "recipe"}
        onDeleted={() => {
          close();
          onDeleted();
        }}
        onClose={close}
      />
    </>
  );
}
