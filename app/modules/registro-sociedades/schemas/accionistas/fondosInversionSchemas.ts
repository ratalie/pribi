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

export const tipoFondoSchema = z.string().nonempty("El tipo de fondo es obligatorio");

export const numeroDocumentoSociedadAdministradoraSchema = z
  .string()
  .nonempty("El número de documento de la sociedad administradora es obligatorio")
  .min(11, "Debe tener al menos 11 caracteres");

export const tipoDocumentoSociedadAdministradoraSchema = z
  .string()
  .nonempty("El tipo de documento de la sociedad administradora es obligatorio");

export const razonSocialSociedadAdministradoraSchema = z
  .string()
  .nonempty("La razón social de la sociedad administradora es obligatoria")
  .min(2, "Debe tener al menos 2 caracteres");
