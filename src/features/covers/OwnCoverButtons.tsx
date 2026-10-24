import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { PhotoSource } from "@/features/photos/pickPhoto";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const SOURCES = [
  { source: "camera", icon: "photo-camera", label: "Hacer una foto" },
  { source: "library", icon: "photo-library", label: "Elegir de la galería" },
] as const;

/** Las dos formas de poner una foto tuya de portada, encima del catálogo. */
export function OwnCoverButtons({ onChoose }: { onChoose: (source: PhotoSource) => void }) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      {SOURCES.map(({ source, icon, label }) => (
        <Pressable
          key={source}
          accessibilityRole="button"
          onPress={() => {
            onChoose(source);
          }}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.muted },
            pressed && styles.pressed,
          ]}
        >
          <MaterialIcons name={icon} size={20} color={colors.foreground} />
          <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: tokens.spacing.row },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacing.row - 2,
    height: tokens.touch.headerButton,
    borderRadius: tokens.radius.pill,
  },
  pressed: { opacity: 0.8 },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
});
