import { z } from "zod";

export const selectFacultadSchema = z.string().nonempty("La facultad es obligatoria");

export const fechaInicioSchema = z.string().nonempty("La fecha de inicio es obligatoria");
export const fechaFinSchema = z.string().nonempty("La fecha de fin es obligatoria");

export const facultadApoderadoSchema = z.object({
  facultad: selectFacultadSchema,
  fechaInicio: fechaInicioSchema,
  fechaFin: fechaFinSchema,
});
