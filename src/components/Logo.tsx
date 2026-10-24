import { Image, StyleSheet } from "react-native";

// El mismo fichero que da el icono de la app: una sola imagen para una sola marca.
import logo from "../../assets/logo.png";
import { tokens } from "@/theme/tokens";

/** La marca de la app: el gorro con el tenedor y la cuchara. */
export function Logo({ size }: { size: number }) {
  return (
    <Image
      source={logo}
      style={[styles.logo, { width: size, height: size }]}
      accessibilityIgnoresInvertColors
    />
  );
}

const styles = StyleSheet.create({
  logo: { borderRadius: tokens.radius.card },
});
