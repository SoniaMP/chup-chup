import * as Speech from "expo-speech";
import { useEffect, useState } from "react";

/**
 * La voz del modo cocina: una vez encendida se queda leyendo, y cada texto nuevo (el paso al que
 * se llega) se lee solo, cortando el anterior.
 *
 * Al apagarla, al cambiar de texto o al salir del modo cocina se calla: la limpieza del efecto es
 * la que corta. Empieza siempre apagada y no se guarda.
 */
export function useReadAloud(
  text: string,
  language: string,
): { isReading: boolean; toggleReading: () => void } {
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (!isReading) return;

    Speech.speak(text, { language });
    return () => {
      void Speech.stop();
    };
  }, [isReading, text, language]);

  return {
    isReading,
    toggleReading: () => {
      setIsReading((current) => !current);
    },
  };
}
