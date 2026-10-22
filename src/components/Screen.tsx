import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/**
 * Page frame: the safe area plus our own margins, so the top of a screen is
 * never flush against the status bar or the browser window.
 */
export function Screen({ children }: { children: ReactNode }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + tokens.spacing.gutter,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: tokens.spacing.gutter },
});
