import { z } from "zod";

export const tipoDocumentoSchema = z.string().nonempty("El tipo de documento es obligatorio");

export const numeroDocumentoSchema = z
  .string()
  .nonempty("El número de documento es obligatorio")
  .min(11, "Debe tener al menos 11 caracteres");

export const nombreSucursalSchema = z
  .string()
  .nonempty("El nombre de la sucursal es obligatorio")
  .min(2, "El nombre de la sucursal debe tener al menos 2 caracteres");

export const partidaRegistralSchema = z
  .string()
  .nonempty("La partida registral es obligatoria");

export const sedeRegistralSchema = z.string().nonempty("La sede registral es obligatoria");

export const domicilioFiscalSchema = z
  .string()
  .nonempty("El domicilio fiscal es obligatorio")
  .min(5, "El domicilio fiscal debe tener al menos 5 caracteres");
