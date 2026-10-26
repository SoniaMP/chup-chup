import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { Vibration } from "react-native";

import { adjustedTimer, type CookTimer } from "@/domain/cooking/cookTimer";
import { isTimerDone } from "@/domain/cooking/isTimerDone";
import { randomUuid } from "@/lib/randomUuid";
import { playAlarmBeep } from "./playAlarmBeep";

const TICK_MS = 1000;
const MINUTE_MS = 60_000;
/** Cada cuánto vuelve a pitar mientras nadie la para. */
const BEEP_EVERY_MS = 2500;
/** Vibra medio segundo, para medio segundo, y vuelta a empezar. */
const VIBRATION = [0, 500, 500];

type CookTimers = {
  timers: CookTimer[];
  now: number;
  startTimer: (label: string, minutes: number) => void;
  adjustTimer: (id: string, minutes: number) => void;
  dismissTimer: (id: string) => void;
};

/**
 * Los temporizadores del modo cocina: varios a la vez, cada uno con su cuenta atrás.
 *
 * Viven en la pantalla, así que solo cuentan con ella abierta: en la web es todo lo que hay, y en
 * Android la alarma con el móvil bloqueado será la del reloj del sistema. Al acabar, la voz lo dice
 * una vez y luego **suena hasta que alguien lo pare**: pitidos cada pocos segundos y vibración en
 * bucle. Un aviso que suena una sola vez no sirve si estás en el salón. Parar es quitarlo de la
 * franja; sumarle un minuto también lo calla, y vuelve a sonar cuando acabe ese minuto.
 */
export function useCookTimers(language: string): CookTimers {
  const [timers, setTimers] = useState<CookTimer[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const announced = useRef(new Set<string>());
  const hasTimers = timers.length > 0;

  useEffect(() => {
    if (!hasTimers) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, TICK_MS);
    return () => {
      clearInterval(interval);
    };
  }, [hasTimers]);

  useEffect(() => {
    for (const timer of timers) {
      const isDone = isTimerDone(timer, now);
      if (!isDone) announced.current.delete(timer.id);
      if (!isDone || announced.current.has(timer.id)) continue;

      announced.current.add(timer.id);
      Speech.speak(`${timer.label}: ya está el tiempo.`, { language });
    }
  }, [timers, now, language]);

  const isRinging = timers.some((timer) => isTimerDone(timer, now));

  useEffect(() => {
    if (!isRinging) return;

    Vibration.vibrate(VIBRATION, true);
    playAlarmBeep();
    const interval = setInterval(playAlarmBeep, BEEP_EVERY_MS);
    return () => {
      clearInterval(interval);
      Vibration.cancel();
    };
  }, [isRinging]);

  return {
    timers,
    now,
    startTimer: (label, minutes) => {
      const startedAt = Date.now();
      setNow(startedAt);
      setTimers((current) => [
        ...current,
        { id: randomUuid(), label, endsAt: startedAt + minutes * MINUTE_MS },
      ]);
    },
    adjustTimer: (id, minutes) => {
      const at = Date.now();
      setNow(at);
      setTimers((current) =>
        current.map((timer) => (timer.id === id ? adjustedTimer(timer, minutes, at) : timer)),
      );
    },
    dismissTimer: (id) => {
      setTimers((current) => current.filter((timer) => timer.id !== id));
    },
  };
}
