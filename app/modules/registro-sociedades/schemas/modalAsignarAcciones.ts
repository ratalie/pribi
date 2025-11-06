import { z } from "zod";

export const tipoAccionSchema = z
  .string()
  .nonempty("El tipo de acción es obligatorio");

export const cantidadAccionesSuscritasSchema = z.number().min(1, "La cantidad de acciones suscritas debe ser mayor a 0");

export const precioAccionSchema = z
  .number()
  .min(1, "El precio de la acción debe ser mayor a 0");

export const capitalSocialSchema = z
  .number() 
  .min(1, "El capital social debe ser mayor a 0");

export const primaSchema = z
  .number()
  .min(1, "La prima debe ser mayor a 0");

export const totalmentePagadoSchema = z
  .boolean().default(false);

export const porcentajePagadoSchema = z.number().min(1, "El porcentaje pagado debe ser mayor a 0");

export const dividendoPasivoSchema = z.number().min(1, "El dividendo pasivo debe ser mayor a 0");
export const datosAsignacionAccionesSchema = z.object({
  tipo_accion: tipoAccionSchema,
  cantidad_acciones_suscritas: cantidadAccionesSuscritasSchema,
  precio_accion: precioAccionSchema,
  capital_social: capitalSocialSchema,
  prima: primaSchema,
  totalmente_pagado: totalmentePagadoSchema,
  porcentaje_pagado: porcentajePagadoSchema,
  dividendo_pasivo: dividendoPasivoSchema,
});
