import { describe, expect, it } from "vitest";

import { positionForMove } from "@/domain/ordering/positionForMove";

const positions = ["b", "d", "f", "h"];

const sortedAfterMove = (from: number, to: number): string[] => {
  const moved = positionForMove(positions, from, to);
  const rest = positions.filter((_, index) => index !== from);

  return [...rest.slice(0, to), moved, ...rest.slice(to)].slice().sort();
};

describe("positionForMove", () => {
  it("places a row between its new neighbours", () => {
    const moved = positionForMove(positions, 0, 2);

    expect(moved > "f").toBe(true);
    expect(moved < "h").toBe(true);
  });

  it("places a row dragged to the top before everything", () => {
    expect(positionForMove(positions, 3, 0) < "b").toBe(true);
  });

  it("places a row dragged to the bottom after everything", () => {
    expect(positionForMove(positions, 0, 3) > "h").toBe(true);
  });

  it("keeps the list in the order it was dropped in", () => {
    const rest = positions.filter((_, index) => index !== 1);
    const expected = [...rest.slice(0, 3), positionForMove(positions, 1, 3)];

    expect(sortedAfterMove(1, 3)).toEqual(expected);
  });

  it("leaves a row where it was when it does not move", () => {
    const moved = positionForMove(positions, 2, 2);

    expect(moved > "d").toBe(true);
    expect(moved < "h").toBe(true);
  });
});
