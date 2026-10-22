import { useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { DragHandle } from "./DragHandle";

type ReorderableListProps<T> = {
  items: T[];
  gap: number;
  keyOf: (item: T) => string;
  renderItem: (item: T, handle: ReactNode) => ReactNode;
  onMove: (from: number, to: number) => void;
};

/** A dónde iría la fila que se está arrastrando si se soltara ahora. */
const targetIndex = (from: number, offset: number, step: number, count: number): number => {
  "worklet";
  if (step <= 0) return from;

  return Math.min(count - 1, Math.max(0, from + Math.round(offset / step)));
};

type RowProps = {
  index: number;
  count: number;
  step: number;
  onMeasure: (height: number) => void;
  dragged: SharedValue<number>;
  offset: SharedValue<number>;
  onMove: (from: number, to: number) => void;
  render: (handle: ReactNode) => ReactNode;
};

function ReorderableRow({ index, count, step, onMeasure, dragged, offset, onMove, render }: RowProps) {
  const style = useAnimatedStyle(() => {
    if (dragged.value === index) {
      return { transform: [{ translateY: offset.value }], zIndex: 2, opacity: 0.95 };
    }
    if (dragged.value === -1) {
      return { transform: [{ translateY: withTiming(0, { duration: 160 }) }], zIndex: 0, opacity: 1 };
    }

    // Las demás filas se apartan para dejar el hueco donde caería la que se arrastra.
    const target = targetIndex(dragged.value, offset.value, step, count);
    const isPushedUp = index > dragged.value && index <= target;
    const isPushedDown = index < dragged.value && index >= target;
    const shift = isPushedUp ? -step : isPushedDown ? step : 0;

    return { transform: [{ translateY: withTiming(shift, { duration: 160 }) }], zIndex: 0, opacity: 1 };
  });

  const drag = Gesture.Pan()
    .onStart(() => {
      dragged.value = index;
      offset.value = 0;
    })
    .onUpdate((event) => {
      offset.value = event.translationY;
    })
    .onEnd(() => {
      const target = targetIndex(index, offset.value, step, count);
      if (target !== index) runOnJS(onMove)(index, target);
    })
    .onFinalize(() => {
      dragged.value = -1;
      offset.value = 0;
    });

  return (
    <Animated.View
      style={style}
      onLayout={(event) => {
        onMeasure(event.nativeEvent.layout.height);
      }}
    >
      {render(
        <GestureDetector gesture={drag}>
          <View style={styles.handle}>
            <DragHandle />
          </View>
        </GestureDetector>,
      )}
    </Animated.View>
  );
}

/**
 * Una lista que se ordena arrastrando por el asa.
 *
 * El asa, y no la fila entera, es lo que arrastra: así la lista se sigue pudiendo desplazar con
 * el dedo. Todas las filas miden lo mismo mientras se reordena, y de ahí sale con una resta
 * dónde cae la que se arrastra, sin ir midiendo vecinas.
 */
export function ReorderableList<T>({
  items,
  gap,
  keyOf,
  renderItem,
  onMove,
}: ReorderableListProps<T>) {
  const dragged = useSharedValue(-1);
  const offset = useSharedValue(0);
  const [rowHeight, setRowHeight] = useState(0);

  return (
    <View style={{ gap }}>
      {items.map((item, index) => (
        <ReorderableRow
          key={keyOf(item)}
          index={index}
          count={items.length}
          step={rowHeight + gap}
          onMeasure={setRowHeight}
          dragged={dragged}
          offset={offset}
          onMove={onMove}
          render={(handle) => renderItem(item, handle)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  handle: { paddingHorizontal: 4, paddingVertical: 10 },
});
