import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** Vuelve a la pantalla anterior, o a Mi cocina si no hay ninguna. */
export function BackButton() {
  const colors = useColors();
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver"
      onPress={() => {
        // Si se ha entrado directo a esta pantalla no hay pila que deshacer: a Mi cocina.
        if (router.canGoBack()) router.back();
        else router.replace("/");
      }}
      style={[styles.button, { backgroundColor: colors.muted }]}
    >
      <Text style={[styles.arrow, { color: colors.foreground }]}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: tokens.touch.headerButton,
    height: tokens.touch.headerButton,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: { fontFamily: tokens.fontFamily.body, fontSize: 20, lineHeight: 24 },
});
