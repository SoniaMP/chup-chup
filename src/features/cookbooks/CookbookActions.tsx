import { useState } from "react";

import { ActionSheet, type SheetAction } from "@/components/ActionSheet";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import {
  availableCookbookActions,
  type CookbookAction,
} from "@/domain/cookbooks/cookbookActions";
import { ConfirmDeleteCookbook } from "./ConfirmDeleteCookbook";
import { RenameCookbookDialog } from "./RenameCookbookDialog";

type CookbookActionsProps = {
  cookbook: Cookbook;
  isOpen: boolean;
  onClose: () => void;
  onRenamed: (cookbook: Cookbook) => void;
  onDeleted: () => void;
};

const LABELS: Record<CookbookAction, Omit<SheetAction, "onPress">> = {
  rename: { label: "Cambiar nombre", icon: "edit" },
  delete: { label: "Eliminar libro", icon: "delete-outline", isDestructive: true },
};

/**
 * Las acciones de un libro: el menú y lo que abre cada una.
 *
 * Vive junto al libro, no en la pantalla, para que se pida igual desde la biblioteca (dejando
 * el dedo encima) y desde el propio libro (con el botón de los tres puntos).
 */
export function CookbookActions({
  cookbook,
  isOpen,
  onClose,
  onRenamed,
  onDeleted,
}: CookbookActionsProps) {
  const [open, setOpen] = useState<CookbookAction | null>(null);

  const actions = availableCookbookActions(cookbook).map(
    (action): SheetAction => ({
      ...LABELS[action],
      onPress: () => {
        onClose();
        setOpen(action);
      },
    }),
  );

  const close = (): void => {
    setOpen(null);
  };

  return (
    <>
      <ActionSheet isOpen={isOpen && open === null} actions={actions} onClose={onClose} />
      <RenameCookbookDialog
        cookbook={cookbook}
        isOpen={open === "rename"}
        onRenamed={(renamed) => {
          close();
          onRenamed(renamed);
        }}
        onClose={close}
      />
      <ConfirmDeleteCookbook
        cookbookId={cookbook.id}
        isOpen={open === "delete"}
        onDeleted={() => {
          close();
          onDeleted();
        }}
        onClose={close}
      />
    </>
  );
}
