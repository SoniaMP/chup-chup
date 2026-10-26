import type { CookTimer } from "./cookTimer";

/** Si ya ha llegado su hora: desde ese momento suena hasta que alguien lo pare. */
export function isTimerDone(timer: CookTimer, now: number): boolean {
  return timer.endsAt <= now;
}
