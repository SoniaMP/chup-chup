import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";
import { copyLink } from "./copyLink";

type ShareLinkDialogProps = {
  link: string | null;
  onClose: () => void;
};

/**
 * El enlace a la vista, para cuando no hay hoja de compartir que lo mande.
 *
 * Pasa en el navegador por `http`, que es como corre el servidor de desarrollo: ni hoja de
 * compartir ni portapapeles. El enlace sale escrito y seleccionado, que es lo único que funciona
 * en todas partes; el botón de copiar aparece igual y dice si ha podido.
 */
export function ShareLinkDialog({ link, onClose }: ShareLinkDialogProps) {
  const colors = useColors();
  const [copy, setCopy] = useState<"asked" | "done" | "failed">("asked");

  useEffect(() => {
    setCopy("asked");
  }, [link]);

  return (
    <BottomSheet isOpen={link !== null} onClose={onClose}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: colors.foreground }]}>El enlace de la receta</Text>
        <Text style={[styles.line, { color: colors.mutedForeground }]}>
          {copy === "failed"
            ? "Este navegador no deja copiar solo: mantén pulsado el enlace y cópialo a mano."
            : "Mándaselo a quien quieras. Quien lo abra ve la receta, sin cuenta y sin instalar nada."}
        </Text>
        <TextInput
          value={link ?? ""}
          editable={false}
          selectTextOnFocus
          multiline
          style={[
            styles.link,
            webFocusReset,
            { backgroundColor: colors.muted, color: colors.foreground },
          ]}
        />
        <View style={styles.choices}>
          <View style={styles.choice}>
            <SecondaryButton label="Cerrar" onPress={onClose} />
          </View>
          <View style={styles.choice}>
            <PrimaryButton
              label={copy === "done" ? "Copiado" : "Copiar"}
              onPress={() => {
                void copyLink(link ?? "").then((isCopied) => {
                  setCopy(isCopied ? "done" : "failed");
                });
              }}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: tokens.spacing.row + 4, paddingHorizontal: tokens.spacing.row + 4 },
  heading: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  line: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label, lineHeight: 20 },
  link: {
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.row + 4,
    minHeight: tokens.touch.primaryButton,
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.label,
  },
  choices: { flexDirection: "row", gap: tokens.spacing.row },
  choice: { flex: 1 },
});
