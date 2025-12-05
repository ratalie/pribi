import { z } from "zod";

export const accionIdSchema = z.string().nonempty("El tipo de acción es obligatorio");

export const cantidadSuscritaSchema = z
  .number()
  .min(1, "La cantidad de acciones suscritas debe ser mayor a 0");

// Campos opcionales que pueden ser 0 (no requeridos, pero si están presentes deben ser >= 0)
export const precioPorAccionSchema = z
  .number()
  .min(0, "El precio de la acción no puede ser negativo");

export const capitalSocialSchema = z
  .number()
  .min(0, "El capital social no puede ser negativo");

export const primaSchema = z.number().min(0, "La prima no puede ser negativa");

export const pagadoCompletamenteSchema = z.boolean().default(false);

// Campos condicionales que solo se validan cuando pagadoCompletamente es true
// Usamos min(0) para permitir 0, pero estos campos solo se muestran cuando pagadoCompletamente es true
export const porcentajePagadoPorAccionSchema = z
  .number()
  .min(0, "El porcentaje pagado no puede ser negativo")
  .max(100, "El porcentaje pagado no puede ser mayor a 100");

export const dividendoPasivoTotalSchema = z
  .number()
  .min(0, "El dividendo pasivo no puede ser negativo");

export const datosAsignacionAccionesSchema = z.object({
  accion_id: accionIdSchema,
  cantidad_suscrita: cantidadSuscritaSchema,
  precio_por_accion: precioPorAccionSchema,
  capital_social: capitalSocialSchema,
  prima: primaSchema,
  pagado_completamente: pagadoCompletamenteSchema,
  porcentaje_pagado_por_accion: porcentajePagadoPorAccionSchema,
  total_dividendos_pendientes: dividendoPasivoTotalSchema,
});
