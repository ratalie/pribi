import { z } from "zod";

export const tipoAccionistaSchema = z
  .string()
  .nonempty("El tipo de accionista es obligatorio");

export const tipoDocumentoSchema = z.string().nonempty("El tipo de documento es obligatorio");

export const numeroRucSchema = z
  .string()
  .nonempty("El número de RUC es obligatorio")
  .min(11, "Debe tener al menos 11 caracteres");

export const numeroDocumentoSchema = z
  .string()
  .nonempty("El número de documento es obligatorio");

export const razonSocialSchema = z.string().nonempty("La razón social es obligatoria");

export const nombreComercialSchema = z.string();

export const provinciaSchema = z.string().nonempty("La provincia es obligatoria");

export const departamentoSchema = z.string().nonempty("El departamento es obligatorio");

export const distritoSchema = z.string().nonempty("El distrito es obligatorio");

export const direccionSchema = z.string().nonempty("La dirección es obligatoria");

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

export const paisSchema = z.string().nonempty("El país es obligatorio");

export const datosSociedadSchema = z.object({
  tipoDocumentoSchema,
  numeroRucSchema,
  razonSocialSchema,
  nombreComercialSchema,
  provinciaSchema,
  departamentoSchema,
  distritoSchema,
  direccionSchema,
  numeroDocumentoSchema,
  paisSchema,
});
