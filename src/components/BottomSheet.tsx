import { type ReactNode, useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const ENTERS_IN = 240;
const LEAVES_IN = 180;
/** Lo que se desplaza mientras no se ha medido: más que cualquier hoja, para que empiece fuera. */
const UNMEASURED = 600;
/** Cuánto hay que bajarla, de su propia altura, para que se cierre al soltar. */
const CLOSES_AT = 0.3;
/** O un manotazo hacia abajo, aunque no haya recorrido tanto, en puntos por segundo. */
const FLICK = 800;

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * El panel que sube desde abajo: el sitio donde esta app pregunta y ofrece acciones.
 *
 * El fondo oscuro aparece de golpe y solo sube el panel. Con la animación del `Modal`, que mueve
 * las dos cosas a la vez, parecía que la hoja empujaba la pantalla hacia arriba. Por eso se anima
 * aquí: el `Modal` se queda quieto y la hoja entra y sale sola, y para que la salida se vea el
 * `Modal` sigue montado hasta que termina.
 *
 * Se cierra tocando fuera o **arrastrando la pestaña hacia abajo**, como en cualquier hoja del
 * móvil, y deja libre la franja de abajo del teléfono para que el último botón no quede debajo de
 * la barra del sistema.
 *
 * La pestaña, y no la hoja entera, porque dentro puede haber una lista que se desplaza —el
 * selector de portadas— y los dos gestos se pelearían por el mismo dedo.
 */
export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(isOpen);
  const [height, setHeight] = useState(UNMEASURED);
  /** 1 es fuera de la pantalla, por abajo; 0 es puesta. */
  const away = useSharedValue(1);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      away.value = withTiming(0, { duration: ENTERS_IN, easing: Easing.out(Easing.cubic) });
      return;
    }

    away.value = withTiming(1, { duration: LEAVES_IN, easing: Easing.in(Easing.cubic) }, (done) => {
      if (done === true) runOnJS(setIsMounted)(false);
    });
  }, [isOpen, away]);

  const slide = useAnimatedStyle(() => ({ transform: [{ translateY: away.value * height }] }));

  const drag = Gesture.Pan()
    .onUpdate((event) => {
      // Solo hacia abajo: tirar hacia arriba no estira la hoja.
      away.value = Math.max(0, event.translationY / height);
    })
    .onEnd((event) => {
      if (event.translationY > height * CLOSES_AT || event.velocityY > FLICK) {
        // Cerrar de verdad lo hace el efecto de arriba, que la termina de bajar desde donde esté.
        runOnJS(onClose)();
        return;
      }

      away.value = withTiming(0, { duration: ENTERS_IN, easing: Easing.out(Easing.cubic) });
    });

  return (
    <Modal visible={isMounted} transparent animationType="none" onRequestClose={onClose}>
      {/* Los gestos no llegan dentro de un Modal si no cuelgan de su propia raíz. */}
      <GestureHandlerRootView style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          onPress={onClose}
          style={styles.backdrop}
        />
        <Animated.View
          onLayout={(event) => {
            setHeight(event.nativeEvent.layout.height);
          }}
          style={[
            styles.panel,
            slide,
            { backgroundColor: colors.card, paddingBottom: insets.bottom + tokens.spacing.gutter },
          ]}
        >
          <GestureDetector gesture={drag}>
            <View style={styles.gripArea}>
              <View style={[styles.grip, { backgroundColor: colors.border }]} />
            </View>
          </GestureDetector>
          {children}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(44, 26, 20, 0.45)",
  },
  panel: {
    borderTopLeftRadius: tokens.radius.xxxl,
    borderTopRightRadius: tokens.radius.xxxl,
    paddingTop: tokens.spacing.row + 4,
    paddingHorizontal: tokens.spacing.row,
  },
  /** Ancha y con aire alrededor: es lo que hay que agarrar para bajarla. */
  gripArea: {
    alignItems: "center",
    paddingVertical: tokens.spacing.row,
    marginTop: -tokens.spacing.row,
    marginBottom: tokens.spacing.row - 4,
  },
  grip: { width: 44, height: 4, borderRadius: tokens.radius.pill },
});
