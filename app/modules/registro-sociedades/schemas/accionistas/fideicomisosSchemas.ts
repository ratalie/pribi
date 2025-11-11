import { z } from "zod";

export const tieneRucSchema = z.boolean();

export const identificacionFideicomisosSchema = z
  .string()
  .nonempty("La identificación del fideicomiso es obligatoria")
  .min(2, "Debe tener al menos 2 caracteres");

export const partidaRegistralSchema = z
  .string()
  .nonempty("La partida registral es obligatoria");

export const sedeRegistralSchema = z.string().nonempty("La sede registral es obligatoria");

export const domicilioFiscalSchema = z
  .string()
  .nonempty("El domicilio fiscal es obligatorio")
  .min(5, "El domicilio fiscal debe tener al menos 5 caracteres");

export const numeroDocumentoSchema = z.string().optional();

export const tipoDocumentoSchema = z.string().optional();

export const razonSocialSchema = z.string().optional();
