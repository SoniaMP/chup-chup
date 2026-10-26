import { Platform, StyleSheet, Text, View } from "react-native";

import type { CookTimer } from "@/domain/cooking/cookTimer";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { CookTimerRow } from "./CookTimerRow";

type CookTimersStripProps = {
  timers: CookTimer[];
  now: number;
  onAdjust: (id: string, minutes: number) => void;
  onDismiss: (id: string) => void;
};

/**
 * Los temporizadores en marcha, arriba: «Lentejas · 32:10 − + ×». Siguen corriendo aunque se
 * cambie de paso, que es justo para lo que están: las lentejas no esperan al sofrito.
 */
export function CookTimersStrip({ timers, now, onAdjust, onDismiss }: CookTimersStripProps) {
  const colors = useColors();
  if (timers.length === 0) return null;

  return (
    <View style={styles.strip}>
      {timers.map((timer) => (
        <CookTimerRow
          key={timer.id}
          timer={timer}
          now={now}
          onAdjust={(minutes) => {
            onAdjust(timer.id, minutes);
          }}
          onDismiss={() => {
            onDismiss(timer.id);
          }}
        />
      ))}
      {Platform.OS === "web" && (
        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          En la web, el aviso solo suena con esta pestaña abierta.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { gap: tokens.spacing.row / 2, marginBottom: tokens.spacing.row },
  note: { fontFamily: tokens.fontFamily.body, fontSize: 12 },
});
