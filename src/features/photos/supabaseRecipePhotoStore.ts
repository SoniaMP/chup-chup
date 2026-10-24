import { photoStoreFor } from "./photoStoreFor";

/** Las fotos de las recetas, en su bucket privado. */
export const supabaseRecipePhotoStore = photoStoreFor("recipe-photos");
