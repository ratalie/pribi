import { z } from "zod";

export const porcentajeSchema = z.string();
export const datosSociedadSchema = z.object({
  porcentaje: porcentajeSchema,
});
