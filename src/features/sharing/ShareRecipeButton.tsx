import { useEffect, useState } from "react";

import { ActionSheet } from "@/components/ActionSheet";
import { IconButton } from "@/components/IconButton";
import type { Share } from "@/domain/sharing/share";
import { sharedUntil } from "@/domain/sharing/sharedUntil";
import { sendLink } from "./sendLink";
import { shareLink } from "./shareLink";
import { ShareLinkDialog } from "./ShareLinkDialog";
import { supabaseShareStore } from "./supabaseShareStore";

/**
 * Compartir la receta por enlace.
 *
 * La primera vez crea el enlace y abre la hoja de compartir del sistema. Si ya está compartida,
 * el botón abre un menú con las dos únicas cosas que se pueden hacer: mandarlo otra vez, que de
 * paso le da otros treinta días, o dejar de compartir, que lo mata para todo el mundo.
 */
export function ShareRecipeButton({ recipeId, title }: { recipeId: string; title: string }) {
  const [share, setShare] = useState<Share | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  /** El enlace a la vista, cuando no hay hoja de compartir que lo mande. */
  const [shownLink, setShownLink] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    void supabaseShareStore
      .get(recipeId)
      .catch((cause: unknown) => {
        console.warn("No se ha podido saber si la receta está compartida", cause);
        return null;
      })
      .then((found) => {
        if (isCurrent) setShare(found);
      });
    return () => {
      isCurrent = false;
    };
  }, [recipeId]);

  const shareNow = (): void => {
    setIsWorking(true);
    void supabaseShareStore
      .share(recipeId)
      .then(async (fresh) => {
        setShare(fresh);
        const link = shareLink(fresh.token);
        // Si no hay por dónde mandarlo, al menos que se vea: lo que no puede pasar es que
        // tocar el botón parezca que no hace nada.
        if (!(await sendLink(`${title}\n${link}`))) setShownLink(link);
      })
      .catch((cause: unknown) => {
        console.warn("No se ha podido compartir la receta", cause);
      })
      .finally(() => {
        setIsWorking(false);
        setIsOpen(false);
      });
  };

  const stop = (): void => {
    setIsWorking(true);
    void supabaseShareStore
      .stop(recipeId)
      .then(() => {
        setShare(null);
      })
      .catch((cause: unknown) => {
        console.warn("No se ha podido dejar de compartir", cause);
      })
      .finally(() => {
        setIsWorking(false);
        setIsOpen(false);
      });
  };

  const until = share === null ? null : sharedUntil(share.expiresAt);

  return (
    <>
      <IconButton
        name="share"
        label={share === null ? "Compartir la receta" : "Enlace compartido"}
        tone={share === null ? "muted" : "primary"}
        isDisabled={isWorking}
        onPress={() => {
          if (share === null) shareNow();
          else setIsOpen(true);
        }}
      />
      <ActionSheet
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        {...(until === null ? {} : { title: `El enlace vale hasta el ${until}` })}
        actions={[
          { label: "Mandar el enlace otra vez", icon: "share", onPress: shareNow },
          {
            label: "Dejar de compartir",
            icon: "link-off",
            isDestructive: true,
            onPress: stop,
          },
        ]}
      />
      <ShareLinkDialog
        link={shownLink}
        onClose={() => {
          setShownLink(null);
        }}
      />
    </>
  );
}
