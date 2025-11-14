import { z } from "zod";

export const porcentajeSchema = z
  .string()
  .refine((value) => value.trim().length > 0, {
    message: "Ingresa un valor",
  })
  .refine((value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric >= 0 && numeric <= 100;
  }, "El porcentaje debe estar entre 0% y 100%");

export const datosSociedadSchema = z.object({
  porcentaje: porcentajeSchema,
});
