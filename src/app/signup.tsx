import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Logo } from "@/components/Logo";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { signUpIssue } from "@/domain/users/signUpIssue";
import { AuthField } from "@/features/auth/AuthField";
import { signUp } from "@/features/auth/signUp";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function SignUpScreen() {
  const colors = useColors();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWaitingForEmail, setIsWaitingForEmail] = useState(false);

  const create = async (): Promise<void> => {
    const issue = signUpIssue({ email, password });
    if (issue !== null) {
      setError(issue);
      return;
    }

    setIsCreating(true);
    setError(null);
    try {
      const result = await signUp(email, password, name);
      if (!result.ok) setError(result.error);
      // Con sesión abierta no hay que hacer nada: la navegación va detrás de la sesión.
      else if (result.needsConfirmation) setIsWaitingForEmail(true);
    } finally {
      setIsCreating(false);
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
          <View style={styles.brand}>
            <Logo size={96} />
          </View>

          {isWaitingForEmail ? (
            <>
              <Text style={[styles.title, { color: colors.foreground }]}>Ya casi</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                Te hemos enviado un correo a {email.trim()}. Ábrelo para confirmar la cuenta y
                vuelve aquí a entrar.
              </Text>
              <PrimaryButton
                label="Ir a entrar"
                onPress={() => {
                  router.replace("/login");
                }}
              />
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.foreground }]}>Crear cuenta</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                Para tener tus recetas en cualquier cocina.
              </Text>

              <AuthField label="NOMBRE (OPCIONAL)" value={name} onChangeText={setName} mode="name" />
              <AuthField label="CORREO" value={email} onChangeText={setEmail} mode="email" />
              <AuthField
                label="CONTRASEÑA"
                value={password}
                onChangeText={setPassword}
                mode="password"
                isNewPassword
              />

              <PrimaryButton
                label={isCreating ? "Creando…" : "Crear cuenta"}
                isDisabled={isCreating}
                onPress={() => {
                  void create();
                }}
              />

              {error !== null && (
                <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
              )}

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  router.replace("/login");
                }}
                style={styles.link}
              >
                <Text style={[styles.linkText, { color: colors.primary }]}>
                  ¿Ya tienes cuenta? Entrar
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: "center", marginBottom: tokens.spacing.row },
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
    lineHeight: 24,
    marginBottom: tokens.spacing.block,
  },
  error: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.label,
    textAlign: "center",
    marginTop: tokens.spacing.row + 4,
  },
  link: { alignItems: "center", marginTop: tokens.spacing.block },
  linkText: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
