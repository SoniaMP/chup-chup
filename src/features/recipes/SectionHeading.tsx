import { StyleSheet, Text } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export function SectionHeading({ children }: { children: string }) {
  const colors = useColors();
  return <Text style={[styles.heading, { color: colors.foreground }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.sectionHeading,
    marginTop: tokens.spacing.block,
    marginBottom: tokens.spacing.row + 4,
  },
});
