import { StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { SecondaryButton } from "@/components/SecondaryButton";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import type { Account } from "./accountFromUser";
import { AccountAvatar } from "./AccountAvatar";
import { signOut } from "./signOut";

type AccountSheetProps = { account: Account | null; isOpen: boolean; onClose: () => void };

/**
 * Quién ha entrado y la salida. Sin pantalla de ajustes mientras no haya ajustes: cuando llegue
 * el primero, crece esta hoja.
 */
export function AccountSheet({ account, isOpen, onClose }: AccountSheetProps) {
  const colors = useColors();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View style={styles.body}>
        <View style={styles.who}>
          <AccountAvatar account={account} size={56} />
          <View style={styles.lines}>
            {account?.name != null && (
              <Text style={[styles.name, { color: colors.foreground }]}>{account.name}</Text>
            )}
            {account?.email != null && (
              <Text style={[styles.email, { color: colors.mutedForeground }]}>{account.email}</Text>
            )}
          </View>
        </View>
        {/* Sin confirmación: abrir la hoja ya es el primer paso, y volver a entrar es un toque. */}
        <SecondaryButton
          label="Cerrar sesión"
          onPress={() => {
            void signOut();
          }}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: tokens.spacing.block, paddingHorizontal: tokens.spacing.row + 4 },
  who: { flexDirection: "row", alignItems: "center", gap: tokens.spacing.row + 4 },
  lines: { flex: 1, gap: 2 },
  name: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  email: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
