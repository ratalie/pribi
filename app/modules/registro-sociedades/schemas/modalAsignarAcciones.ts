import { z } from "zod";

export const tipoAccionSchema = z
  .string()
  .nonempty("El tipo de acción es obligatorio");

export const cantidadAccionesSuscritasSchema = z.string().nonempty("La cantidad de acciones suscritas es obligatoria");

export const precioAccionSchema = z
  .string()
  .nonempty("El precio de la acción es obligatorio");

export const capitalSocialSchema = z
  .string() 
  .nonempty("El capital social es obligatorio");

export const primaSchema = z
  .string()
  .nonempty("El apellido paterno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const totalmentePagadoSchema = z
  .boolean().default(false);

export const porcentajePagadoSchema = z.string().nonempty("El porcentaje pagado es obligatorio");

export const dividendoPasivoSchema = z.string().nonempty("El dividendo pasivo es obligatorio");
export const datosAsignacionAccionesSchema = z.object({
  tipoAccionSchema,
  cantidadAccionesSuscritasSchema,
  precioAccionSchema,
  capitalSocialSchema,
  primaSchema,
  totalmentePagadoSchema,
  porcentajePagadoSchema,
  dividendoPasivoSchema,
});
