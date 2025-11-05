import { z } from "zod";

export const nombreClaseAccionSchema = z
  .string()
  .nonempty("El nombre de la clase de acción es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const cantidadAccionesClaseSchema = z
  .number()
  .min(1, "La cantidad de acciones debe ser mayor a 0");

export const conDerechoVotoSchema = z.boolean();

export const redimiblesClaseSchema = z.boolean();

export const otrosDerechosEspecialesClaseSchema = z.boolean();

export const obligacionesAdicionalesClaseSchema = z.boolean();

// Schema completo del formulario
export const clasesAccionesFormSchema = z.object({
  nombre_clase_accion: nombreClaseAccionSchema,
  cantidad_acciones_clase: cantidadAccionesClaseSchema,
  con_derecho_voto: conDerechoVotoSchema,
  redimibles_clase: redimiblesClaseSchema,
  otros_derechos_especiales_clase: otrosDerechosEspecialesClaseSchema,
  obligaciones_adicionales_clase: obligacionesAdicionalesClaseSchema,
});
