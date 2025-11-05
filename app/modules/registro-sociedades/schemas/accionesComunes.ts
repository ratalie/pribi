import { z } from "zod";

export const cantidadAccionesSchema = z
  .string()
  .nonempty("La cantidad de acciones es obligatoria")
  .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Debe ser un número mayor a 0",
  });

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

