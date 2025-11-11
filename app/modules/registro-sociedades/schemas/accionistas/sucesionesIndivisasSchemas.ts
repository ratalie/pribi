import { z } from "zod";

export const tipoDocumentoSchema = z.string().nonempty("El tipo de documento es obligatorio");

export const numeroDocumentoSchema = z
  .string()
  .nonempty("El número de documento es obligatorio")
  .min(11, "Debe tener al menos 11 caracteres");

export const razonSocialSchema = z
  .string()
  .nonempty("La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres");

export const direccionSchema = z
  .string()
  .nonempty("La dirección es obligatoria")
  .min(5, "La dirección debe tener al menos 5 caracteres");

export const distritoSchema = z.string().nonempty("El distrito es obligatorio");

export const provinciaSchema = z.string().nonempty("La provincia es obligatoria");

export const departamentoSchema = z.string().nonempty("El departamento es obligatorio");
