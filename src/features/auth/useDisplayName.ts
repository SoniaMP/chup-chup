import { useAccount } from "./useAccount";

/** El nombre de quien ha entrado, para firmar lo suyo. */
export function useDisplayName(): string | null {
  return useAccount()?.name ?? null;
}
