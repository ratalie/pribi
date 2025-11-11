import { z } from "zod";

export const seConstituyoEnPeruJuridicaSchema = z.boolean();

export const tipoDocumentoJuridicaSchema = z
  .string()
  .nonempty("El tipo de documento es obligatorio");

export const numeroDocumentoJuridicaSchema = z
  .string()
  .nonempty("El número de documento es obligatorio")
  .min(11, "Debe tener al menos 11 caracteres");

export const razonSocialJuridicaSchema = z
  .string()
  .nonempty("La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres");

export const nombreComercialJuridicaSchema = z.string().optional();

export const direccionJuridicaSchema = z
  .string()
  .nonempty("La dirección es obligatoria")
  .min(5, "La dirección debe tener al menos 5 caracteres");

export const distritoJuridicaSchema = z.string().optional();

export const provinciaJuridicaSchema = z.string().optional();

export const departamentoJuridicaSchema = z.string().optional();

export const paisOrigenJuridicaSchema = z.string().optional();
