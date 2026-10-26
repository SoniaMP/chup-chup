import * as Speech from "expo-speech";
import { useEffect, useState } from "react";

/**
 * La voz del modo cocina. Encendida, se queda leyendo: cada texto nuevo (el paso al que se llega)
 * se lee solo, cortando el anterior.
 *
 * El botón enseña lo que pasa ahora, no el modo: mientras habla es pausa, y pausa la apaga; cuando
 * termina vuelve a ser play, y play repite el paso sin apagar nada. Al salir del modo cocina se
 * calla, porque la limpieza del efecto es la que corta. Empieza siempre apagada y no se guarda.
 */
export function useReadAloud(
  text: string,
  language: string,
): { isSpeaking: boolean; toggleReading: () => void } {
  const [isOn, setIsOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [replays, setReplays] = useState(0);

  useEffect(() => {
    if (!isOn) return;

    // Al cortar una frase para empezar otra, su aviso de parada llega tarde: solo cuenta el de
    // la frase que sigue sonando.
    let isCurrent = true;
    const finish = (): void => {
      if (isCurrent) setIsSpeaking(false);
    };

    setIsSpeaking(true);
    Speech.speak(text, { language, onDone: finish, onStopped: finish, onError: finish });

    return () => {
      isCurrent = false;
      setIsSpeaking(false);
      void Speech.stop();
    };
  }, [isOn, text, language, replays]);

  return {
    isSpeaking,
    toggleReading: () => {
      if (isSpeaking) setIsOn(false);
      else if (isOn) setReplays((count) => count + 1);
      else setIsOn(true);
    },
  };
}
