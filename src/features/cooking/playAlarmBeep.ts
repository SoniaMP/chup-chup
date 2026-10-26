import { Platform } from "react-native";

type AudioContextConstructor = typeof AudioContext;

/** Tres pitidos cortos y agudos, que se oyen por encima de una sartén. */
const BEEPS_AT = [0, 0.25, 0.5];
const BEEP_SECONDS = 0.18;
const PITCH_HZ = 880;

let context: AudioContext | null = null;

const audioContextClass = (): AudioContextConstructor | undefined =>
  typeof window === "undefined"
    ? undefined
    : (window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext);

/**
 * Un «bip, bip, bip» de alarma, generado por el navegador: no hace falta ningún fichero de
 * sonido. Solo en la web; en el móvil la alarma de verdad será la del reloj del sistema.
 *
 * El navegador solo deja sonar audio a una página con la que se ha interactuado, y en el modo
 * cocina ya se ha tocado el play del temporizador, así que se da por hecho.
 */
export function playAlarmBeep(): void {
  const AudioContextClass = Platform.OS === "web" ? audioContextClass() : undefined;
  if (AudioContextClass === undefined) return;

  context ??= new AudioContextClass();
  void context.resume();
  const start = context.currentTime;

  for (const offset of BEEPS_AT) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = PITCH_HZ;
    gain.gain.setValueAtTime(0.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(0.5, start + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + BEEP_SECONDS);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start + offset);
    oscillator.stop(start + offset + BEEP_SECONDS + 0.02);
  }
}
