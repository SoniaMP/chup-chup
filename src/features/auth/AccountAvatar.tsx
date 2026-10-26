import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { initialOf } from "@/domain/users/initialOf";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import type { Account } from "./accountFromUser";

type AccountAvatarProps = { account: Account | null; size: number };

/** La foto de Google si la hay y carga; si no, la inicial; y sin nombre, la silueta. */
export function AccountAvatar({ account, size }: AccountAvatarProps) {
  const colors = useColors();
  // Sin conexión, o si Google la niega, se vuelve a la letra en vez de dejar un hueco.
  const [hasPhotoFailed, setHasPhotoFailed] = useState(false);
  const shape = { width: size, height: size, borderRadius: tokens.radius.pill };
  const avatarUrl = account?.avatarUrl ?? null;

  if (avatarUrl !== null && !hasPhotoFailed) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        onError={() => {
          setHasPhotoFailed(true);
        }}
        style={shape}
        accessibilityIgnoresInvertColors
      />
    );
  }

  const initial = initialOf(account?.name ?? null);

  return (
    <View style={[styles.circle, shape, { backgroundColor: colors.secondary }]}>
      {initial === null ? (
        <MaterialIcons name="person" size={size * 0.55} color={colors.secondaryForeground} />
      ) : (
        <Text style={[styles.initial, { fontSize: size * 0.4, color: colors.secondaryForeground }]}>
          {initial}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: "center", justifyContent: "center" },
  initial: { fontFamily: tokens.fontFamily.bodyStrong },
});
