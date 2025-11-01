import { z } from "zod";

export const porcentajeSchema = z
  .string()
  .nonempty("")
  .refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num <= 100;
    },
    {
      message: "",
    }
  );

export const datosSociedadSchema = z.object({
  porcentaje: porcentajeSchema,
});
