import { z } from "zod";

export const tipoAccionistaSchema = z
  .string()
  .nonempty("El tipo de accionista es obligatorio");

/*TODO: modal PersonNaturalForm. luego unificar schemas */

export const tipoDocumentoSchema = z.string().nonempty("El tipo de documento es obligatorio");

export const numeroDocumentoSchema = z
  .string()
  .nonempty("El número de documento es obligatorio")
  .min(8, "Debe tener al menos 8 caracteres");

export const nombreAccionistaSchema = z
  .string()
  .nonempty("El nombre del accionista es obligatorio")
  .min(2, "El nombre comercial debe tener al menos 2 caracteres");

export const apellidoPaternoSchema = z
  .string()
  .nonempty("El apellido paterno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const apellidoMaternoSchema = z
  .string()
  .nonempty("El apellido materno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const estadoCivilSchema = z.string().nonempty("El estado civil es obligatorio");

export const datosSociedadSchema = z.object({
  tipoDocumentoSchema,
  numeroDocumentoSchema,
  nombreAccionistaSchema,
  apellidoPaternoSchema,
  apellidoMaternoSchema,
  estadoCivilSchema,
});
