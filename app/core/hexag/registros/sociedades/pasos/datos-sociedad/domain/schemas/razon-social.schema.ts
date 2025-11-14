import { z } from "zod";

export const razonSocialSchema = z
  .string()
  .nonempty("La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres")
  .refine((value) => /^\p{Lu}/u.test(value), {
    message: "La razón social debe comenzar con mayúscula",
  });
