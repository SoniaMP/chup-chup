import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { AuthField } from "@/features/auth/AuthField";
import { signIn } from "@/features/auth/signIn";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function LoginScreen() {
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEntering, setIsEntering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enter = async (): Promise<void> => {
    setIsEntering(true);
    setError(null);
    try {
      const result = await signIn(email, password);
      if (!result.ok) setError(result.error);
    } finally {
      setIsEntering(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding" style={styles.fill}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.foreground }]}>Recetario</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Tus recetas, siempre contigo.
          </Text>

          <AuthField label="CORREO" value={email} onChangeText={setEmail} mode="email" />
          <AuthField
            label="CONTRASEÑA"
            value={password}
            onChangeText={setPassword}
            mode="password"
          />

          <PrimaryButton
            label={isEntering ? "Entrando…" : "Entrar"}
            isDisabled={isEntering || email.trim().length === 0 || password.length === 0}
            onPress={() => {
              void enter();
            }}
          />

          {error !== null && (
            <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", paddingBottom: tokens.spacing.block },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
    marginBottom: tokens.spacing.row / 2,
  },
  subtitle: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    marginBottom: tokens.spacing.block,
  },
  error: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.label,
    textAlign: "center",
    marginTop: tokens.spacing.row + 4,
  },
});
