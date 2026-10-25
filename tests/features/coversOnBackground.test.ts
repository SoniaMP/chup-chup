import { describe, expect, it } from "vitest";

import { coversOnBackground } from "@/features/covers/coversOnBackground";
import type { LibraryImage } from "@/features/covers/libraryImage";

const image = (id: string): LibraryImage => ({ id, url: `big/${id}`, smallUrl: `small/${id}` });

const catalogue = [
  image("brown-pot.jpg"),
  image("cream-pot.jpg"),
  image("cream-jars.jpg"),
  image("olive-jars.jpg"),
];

describe("coversOnBackground", () => {
  it("gives back the whole catalogue when no colour is chosen", () => {
    expect(coversOnBackground(catalogue, null)).toHaveLength(4);
  });

  it("keeps only the ones drawn on the chosen background", () => {
    const found = coversOnBackground(catalogue, "cream").map((cover) => cover.id);

    expect(found).toEqual(["cream-pot.jpg", "cream-jars.jpg"]);
  });

  it("does not take a background whose name merely starts the same", () => {
    expect(coversOnBackground([image("creamy-pot.jpg")], "cream")).toEqual([]);
  });

  it("gives back nothing when that colour is not in the catalogue yet", () => {
    expect(coversOnBackground(catalogue, "terracotta")).toEqual([]);
  });
});
