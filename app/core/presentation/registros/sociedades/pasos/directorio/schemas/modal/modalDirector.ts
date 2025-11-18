import { z } from "zod";

export const tipoDirectorSchema = z.string().nonempty("El tipo de director es obligatorio");

export const reemplazoAsignadoSchema = z
  .string()
  .nonempty("Debes seleccionar un director titular de reemplazo");

export const datosSociedadSchema = z.object({
  tipoDirectorSchema,
});
