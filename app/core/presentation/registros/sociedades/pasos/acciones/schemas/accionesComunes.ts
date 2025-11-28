import { z } from "zod";

export const tipoAccionSchema = z.string().nonempty("El tipo de acción es obligatorio");

export const cantidadAccionesSchema = z
  .number()
  .min(1, "La cantidad de acciones debe ser mayor a 0");

export const redimiblesSchema = z.boolean();

export const otrosDerechosEspecialesSchema = z.boolean();

export const obligacionesAdicionalesSchema = z.boolean();

// Schema completo del formulario
export const accionesComunesFormSchema = z.object({
  cantidad_acciones: cantidadAccionesSchema,
  redimibles: redimiblesSchema,
  otros_derechos_especiales: otrosDerechosEspecialesSchema,
  obligaciones_adicionales: obligacionesAdicionalesSchema,
});
