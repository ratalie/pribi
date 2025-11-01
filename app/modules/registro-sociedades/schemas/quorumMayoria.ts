import { z } from "zod";

export const porcentajeSchema = z
  .string()
  .nonempty("El porcentaje es obligatorio")
  .refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num <= 100;
    },
    {
      message: "El porcentaje debe ser mayor que 0 y menor o igual a 100",
    }
  );

export const datosSociedadSchema = z.object({
  porcentaje: porcentajeSchema,
});
