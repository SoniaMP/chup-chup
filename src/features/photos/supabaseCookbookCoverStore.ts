import { photoStoreFor } from "./photoStoreFor";

/** Las portadas propias de los libros, en su bucket privado. */
export const supabaseCookbookCoverStore = photoStoreFor("cookbook-covers");
