import { z } from "zod";

export const tipoAccionSchema = z.string().nonempty("El tipo de acción es obligatorio");

export const cantidadAccionesSuscritasSchema = z
  .number()
  .min(1, "La cantidad de acciones suscritas debe ser mayor a 0");

// Campos opcionales que pueden ser 0 (no requeridos, pero si están presentes deben ser >= 0)
export const precioAccionSchema = z
  .number()
  .min(0, "El precio de la acción no puede ser negativo");

export const capitalSocialSchema = z
  .number()
  .min(0, "El capital social no puede ser negativo");

export const primaSchema = z.number().min(0, "La prima no puede ser negativa");

export const totalmentePagadoSchema = z.boolean().default(false);

// Campos condicionales que solo se validan cuando totalmentePagado es true
// Usamos min(0) para permitir 0, pero estos campos solo se muestran cuando totalmentePagado es true
export const porcentajePagadoSchema = z
  .number()
  .min(0, "El porcentaje pagado no puede ser negativo")
  .max(100, "El porcentaje pagado no puede ser mayor a 100");

export const dividendoPasivoSchema = z
  .number()
  .min(0, "El dividendo pasivo no puede ser negativo");
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
