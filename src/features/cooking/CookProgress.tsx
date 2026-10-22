import { StyleSheet, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** Una barra por paso: las de los pasos ya pasados van en terracota. */
export function CookProgress({ total, current }: { total: number; current: number }) {
  const colors = useColors();

  return (
    <View style={styles.bar}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            { backgroundColor: index <= current ? colors.primary : colors.muted },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", gap: 4 },
  segment: { flex: 1, height: 6, borderRadius: tokens.radius.pill },
});
