import { z } from "zod";

export const duracionDirectorioSchema = z
  .string()
  .nonempty("La duración del directorio es obligatoria");
export const fechaInicioDirectorioSchema = z
  .string()
  .nonempty("La fecha de inicio del directorio es obligatoria");

export const fechaFinDirectorioSchema = z
  .string()
  .nonempty("La fecha de fin del directorio es obligatoria");
export const presidenteDirectorioSchema = z
  .string()
  .nonempty("El presidente del directorio es obligatorio");
export const datosSociedadSchema = z.object({
  tipoSociedad: duracionDirectorioSchema,
  fechaInicioDirectorio: fechaInicioDirectorioSchema,
  fechaFinDirectorio: fechaFinDirectorioSchema,
  presidenteDirectorio: presidenteDirectorioSchema,
});
