import { describe, expect, it } from "vitest";

import { coverFor } from "@/domain/covers/coverFor";

describe("coverFor", () => {
  it("shows nothing when there is nothing", () => {
    expect(coverFor({})).toEqual({ kind: "none" });
  });

  it("shows the catalogue image when there is no photo of your own", () => {
    expect(coverFor({ libraryImage: "lemons-01" })).toEqual({ kind: "library", id: "lemons-01" });
  });

  it("prefers your own photo over the catalogue", () => {
    const cover = coverFor({ libraryImage: "lemons-01", photoOriginal: "https://photos/mine.jpg" });

    expect(cover).toEqual({ kind: "photo", url: "https://photos/mine.jpg" });
  });

  it("uses the enhanced photo when that is the active one", () => {
    const cover = coverFor({
      photoOriginal: "https://photos/mine.jpg",
      photoEnhanced: "https://photos/better.jpg",
      photoActive: "enhanced",
    });

    expect(cover).toEqual({ kind: "photo", url: "https://photos/better.jpg" });
  });

  it("falls back to the original when the enhanced one is not there yet", () => {
    const cover = coverFor({ photoOriginal: "https://photos/mine.jpg", photoActive: "enhanced" });

    expect(cover).toEqual({ kind: "photo", url: "https://photos/mine.jpg" });
  });

  it("ignores an empty catalogue identifier", () => {
    expect(coverFor({ libraryImage: "" })).toEqual({ kind: "none" });
  });
});
