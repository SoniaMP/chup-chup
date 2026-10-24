import { useState } from "react";

import { ActionSheet, type SheetAction } from "@/components/ActionSheet";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import {
  availableCookbookActions,
  type CookbookAction,
} from "@/domain/cookbooks/cookbookActions";
import { CoverPicker } from "@/features/covers/CoverPicker";
import { saveCookbookCover } from "@/features/covers/saveCookbookCover";
import { saveCookbookCoverPhoto } from "@/features/covers/saveCookbookCoverPhoto";
import { pickPhoto, type PhotoSource } from "@/features/photos/pickPhoto";
import { ConfirmDeleteCookbook } from "./ConfirmDeleteCookbook";
import { RenameCookbookDialog } from "./RenameCookbookDialog";

type CookbookActionsProps = {
  cookbook: Cookbook;
  isOpen: boolean;
  onClose: () => void;
  onRenamed: (cookbook: Cookbook) => void;
  onDeleted: () => void;
  /** Sin esto, el menú no ofrece reordenar: desde dentro del libro no hay nada que ordenar. */
  onReorder?: (() => void) | undefined;
};

const LABELS: Record<CookbookAction, Omit<SheetAction, "onPress">> = {
  rename: { label: "Cambiar nombre", icon: "edit" },
  cover: { label: "Cambiar portada", icon: "image" },
  reorder: { label: "Reordenar libros", icon: "swap-vert" },
  delete: { label: "Eliminar libro", icon: "delete-outline", isDestructive: true },
};

/**
 * Las acciones de un libro: el menú y lo que abre cada una.
 *
 * Vive junto al libro, no en la pantalla, para que se pida igual desde la biblioteca (con los
 * tres puntos de su tarjeta) y desde dentro del propio libro (con los tres puntos de arriba).
 */
export function CookbookActions({
  cookbook,
  isOpen,
  onClose,
  onRenamed,
  onDeleted,
  onReorder,
}: CookbookActionsProps) {
  const [open, setOpen] = useState<CookbookAction | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);

  // Reordenar no abre nada: cierra el menú y deja la lista en modo arrastrar. Las otras dos sí
  // abren un diálogo, y entonces el menú no se "cierra": quien manda la hoja sigue montado,
  // porque cerrarlo desde fuera se llevaría por delante el diálogo que acaba de abrirse.
  const actions = availableCookbookActions(cookbook)
    .filter((action) => action !== "reorder" || onReorder !== undefined)
    .map(
      (action): SheetAction => ({
        ...LABELS[action],
        onPress: () => {
          if (action === "reorder") {
            onClose();
            onReorder?.();
            return;
          }
          setOpen(action);
        },
      }),
    );

  // Al libro por defecto le falta «Eliminar», y una opción que falta sin explicación parece un
  // fallo de la app. Se dice por qué, en vez de dejar el hueco.
  const hint = cookbook.isSystem
    ? "Aquí caen las recetas que no guardas en ningún libro, así que este no se elimina."
    : undefined;

  const close = (): void => {
    setOpen(null);
    setCoverError(null);
    onClose();
  };

  // Salir del selector de fotos sin elegir no es elegir nada: el selector de portadas sigue
  // abierto donde estaba. Y si algo falla —el permiso de la galería, sin ir más lejos— se dice
  // ahí mismo en vez de cerrarlo todo y dejar a la usuaria sin saber qué ha pasado.
  const keep = (work: Promise<Cookbook | null>): void => {
    setCoverError(null);
    void work
      .then((updated) => {
        if (updated === null) return;

        close();
        onRenamed(updated);
      })
      .catch((cause: unknown) => {
        console.warn("No se ha podido poner la portada", cause);
        setCoverError(cause instanceof Error ? cause.message : "No se ha podido poner la portada");
      });
  };

  return (
    <>
      <ActionSheet
        isOpen={isOpen && open === null}
        actions={actions}
        onClose={onClose}
        {...(hint === undefined ? {} : { title: hint })}
      />
      <RenameCookbookDialog
        cookbook={cookbook}
        isOpen={open === "rename"}
        onRenamed={(renamed) => {
          close();
          onRenamed(renamed);
        }}
        onClose={close}
      />
      <CoverPicker
        isOpen={open === "cover"}
        chosenId={cookbook.libraryImage}
        hasPhoto={cookbook.coverPhoto !== undefined}
        {...(coverError === null ? {} : { error: coverError })}
        onChoose={(imageId) => {
          keep(saveCookbookCover(cookbook, imageId));
        }}
        onChoosePhoto={(source: PhotoSource) => {
          keep(
            pickPhoto(source).then((base64) =>
              base64 === null ? null : saveCookbookCoverPhoto(cookbook, base64),
            ),
          );
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
