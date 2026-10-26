import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { signInWithGoogle } from "./signInWithGoogle";

/**
 * «Continuar con Google» y el «o» que lo separa del correo, para entrar y para crear cuenta:
 * con Google es lo mismo, la cuenta se crea la primera vez.
 *
 * De momento solo en la web. En el móvil falta el selector nativo, y un botón que no funciona es
 * peor que ninguno.
 */
export function GoogleSignIn() {
  const colors = useColors();
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (Platform.OS !== "web") return null;

  const continueWithGoogle = async (): Promise<void> => {
    setIsLeaving(true);
    setError(null);
    const result = await signInWithGoogle();
    if (!result.ok) {
      setError(result.error);
      setIsLeaving(false);
    }
  };

  return (
    <View style={styles.block}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isLeaving }}
        disabled={isLeaving}
        onPress={() => {
          void continueWithGoogle();
        }}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.secondary },
          pressed && styles.pressed,
        ]}
      >
        <MaterialCommunityIcons name="google" size={20} color={colors.secondaryForeground} />
        <Text style={[styles.label, { color: colors.secondaryForeground }]}>
          {isLeaving ? "Yendo a Google…" : "Continuar con Google"}
        </Text>
      </Pressable>

      {error !== null && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}

      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text style={[styles.or, { color: colors.mutedForeground }]}>o con tu correo</Text>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: tokens.spacing.row },
  button: {
    height: tokens.touch.primaryButton,
    borderRadius: tokens.radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacing.row,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  error: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.label,
    textAlign: "center",
    marginTop: tokens.spacing.row,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row,
    marginTop: tokens.spacing.block,
  },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  or: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
