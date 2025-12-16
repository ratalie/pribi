import { z } from "zod";

export const tipoMonedaSchema = z.enum(["PEN", "USD"], {
  required_error: "El tipo de moneda es obligatorio",
});

export const montoSchema = z
  .number()
  .min(0.01, "El monto debe ser mayor a 0");

export const fechaContribucionSchema = z.string().nonempty("La fecha del aporte es obligatoria");

export const tasaCambioSchema = z
  .number()
  .min(0.01, "La tasa de cambio debe ser mayor a 0")
  .optional();

export const accionIdSchema = z.string().nonempty("El tipo de acción es obligatorio");

export const accionesPorRecibirSchema = z
  .number()
  .min(1, "La cantidad de acciones a recibir debe ser mayor a 0");

export const precioPorAccionSchema = z
  .number()
  .min(0, "El precio por acción no puede ser negativo");

export const capitalSocialSchema = z
  .number()
  .min(0, "El capital social no puede ser negativo");

export const premiumSchema = z.number().min(0, "La prima no puede ser negativa");

export const reservaSchema = z.number().min(0, "La reserva no puede ser negativa");

export const pagadoCompletamenteSchema = z.boolean().default(true);

export const porcentajePagadoSchema = z
  .number()
  .min(0, "El porcentaje pagado no puede ser negativo")
  .max(100, "El porcentaje pagado no puede ser mayor a 100")
  .optional();

export const totalPasivoSchema = z
  .number()
  .min(0, "El total pasivo no puede ser negativo")
  .optional();

export const comprobantePagoArchivoIdSchema = z.string().optional();



