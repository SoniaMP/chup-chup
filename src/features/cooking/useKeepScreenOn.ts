import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect, useState } from "react";

const TAG = "recetario.cooking";

/**
 * Mantiene la pantalla encendida mientras se cocina, y dice si lo ha conseguido.
 *
 * El candado del navegador solo existe en contexto seguro (https o localhost), así que entrando
 * por IP no hay nada que encender. Solo se suelta lo que se ha llegado a coger: soltar un candado
 * que no existe es lo que lanzaba "The wake lock with tag … has not activated yet".
 */
export function useKeepScreenOn(): boolean {
  const [isScreenKeptOn, setIsScreenKeptOn] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    let isLocked = false;

    void activateKeepAwakeAsync(TAG)
      .then(() => {
        isLocked = true;
        if (isCurrent) setIsScreenKeptOn(true);
      })
      .catch(() => {
        if (isCurrent) setIsScreenKeptOn(false);
      });

    return () => {
      isCurrent = false;
      if (isLocked) void deactivateKeepAwake(TAG).catch(() => undefined);
    };
  }, []);

  return isScreenKeptOn;
}
