import { z } from "zod";

export const selectFacultadSchema = z.string().nonempty("La facultad es obligatoria");

export const facultadApoderadoSchema = z.object({
  facultad: selectFacultadSchema,
});
