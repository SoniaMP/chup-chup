import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  mode: "email" | "password" | "name";
  /** Qué contraseña espera el navegador: la de entrar o una nueva. */
  isNewPassword?: boolean;
};

/** Un campo de entrar o registrarse, con su etiqueta y el borde que se enciende al escribir. */
export function AuthField({ label, value, onChangeText, mode, isNewPassword = false }: AuthFieldProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = mode === "password";
  const isName = mode === "name";

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        autoCapitalize={isName ? "words" : "none"}
        autoCorrect={false}
        keyboardType={isPassword || isName ? "default" : "email-address"}
        secureTextEntry={isPassword}
        autoComplete={
          isName ? "name" : isPassword ? (isNewPassword ? "new-password" : "current-password") : "email"
        }
        style={[
          styles.input,
          webFocusReset,
          {
            backgroundColor: colors.card,
            borderColor: isFocused ? colors.primary : colors.border,
            color: colors.foreground,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: tokens.spacing.gutter },
  label: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.label,
    marginBottom: tokens.spacing.row,
  },
  input: {
    height: tokens.touch.primaryButton,
    borderRadius: tokens.radius.xl,
    borderWidth: 2,
    paddingHorizontal: tokens.spacing.gutter,
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
  },
});
