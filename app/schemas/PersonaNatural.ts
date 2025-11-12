import { z } from "zod";

export const tipoDocumentoNaturalSchema = z
  .string()
  .nonempty("El tipo de documento es obligatorio");

export const numeroDocumentoNaturalSchema = z
  .string()
  .nonempty("El número de documento es obligatorio")
  .min(8, "Debe tener al menos 8 caracteres");

export const nombreNaturalSchema = z
  .string()
  .nonempty("El nombre es obligatorio")
  .min(2, "El nombre debe tener al menos 2 caracteres");

export const apellidoPaternoNaturalSchema = z
  .string()
  .nonempty("El apellido paterno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const apellidoMaternoNaturalSchema = z
  .string()
  .nonempty("El apellido materno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const paisPasaporteNaturalSchema = z.string().optional();
