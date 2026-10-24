import { describe, expect, it } from "vitest";
import { cookbookFromRow } from "../../src/features/cookbooks/cookbookFromRow";

const row = {
  id: "11111111-1111-4111-8111-111111111111",
  owner_id: "22222222-2222-4222-8222-222222222222",
  collection_id: null,
  title: "Navidad",
  position: "n",
  library_image: null,
  cover_photo: null,
  is_system: false,
};

describe("cookbookFromRow", () => {
  it("pasa la fila a camelCase", () => {
    const cookbook = cookbookFromRow(row);
    expect(cookbook.ownerId).toBe(row.owner_id);
    expect(cookbook.title).toBe("Navidad");
    expect(cookbook.isSystem).toBe(false);
  });

  it("un libro suelto no tiene recetario, no tiene recetario a null", () => {
    expect(cookbookFromRow(row)).not.toHaveProperty("collectionId");
  });

  it("guarda el recetario cuando lo hay", () => {
    const inCollection = cookbookFromRow({
      ...row,
      collection_id: "33333333-3333-4333-8333-333333333333",
    });
    expect(inCollection.collectionId).toBe("33333333-3333-4333-8333-333333333333");
  });

  it("rechaza un libro sin nombre", () => {
    expect(() => cookbookFromRow({ ...row, title: "   " })).toThrow();
  });
});

describe("la portada de un libro", () => {
  it("trae la del catálogo cuando es la que hay", () => {
    expect(cookbookFromRow({ ...row, library_image: "cream-mortar.jpg" }).libraryImage).toBe(
      "cream-mortar.jpg",
    );
  });

  it("trae la foto propia cuando es la que hay", () => {
    expect(cookbookFromRow({ ...row, cover_photo: "owner/book.jpg" }).coverPhoto).toBe(
      "owner/book.jpg",
    );
  });

  it("sin portada, no deja ninguna de las dos claves a null", () => {
    const cookbook = cookbookFromRow(row);

    expect(cookbook).not.toHaveProperty("libraryImage");
    expect(cookbook).not.toHaveProperty("coverPhoto");
  });
});
