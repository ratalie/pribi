import { z } from "zod";

export const nombreTipoFacultadSchema = z
  .string()
  .nonempty("El nombre de la facultad es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const tipoFacultadSchema = z.object({
  nombreTipoFacultad: nombreTipoFacultadSchema,
});
