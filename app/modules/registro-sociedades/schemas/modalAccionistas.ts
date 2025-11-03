import { z } from "zod";

export const tipoDocumento = z.string().nonempty("El tipo de documento es obligatorio");

export const numeroDocumento = z
  .string()
  .nonempty("El número de documento es obligatorio")
  .min(8, "Debe tener al menos 8 caracteres");

export const nombreAccionista = z
  .string()
  .nonempty("El nombre del accionista es obligatorio")
  .min(2, "El nombre comercial debe tener al menos 2 caracteres");

export const apellidoPaterno = z
  .string()
  .nonempty("El apellido paterno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const apellidoMaterno = z
  .string()
  .nonempty("El apellido materno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const estadoCivil = z.string().nonempty("El estado civil es obligatorio");

export const datosSociedadSchema = z.object({
  tipoDocumento,
  numeroDocumento,
  nombreAccionista,
  apellidoPaterno,
  apellidoMaterno,
  estadoCivil,
});
