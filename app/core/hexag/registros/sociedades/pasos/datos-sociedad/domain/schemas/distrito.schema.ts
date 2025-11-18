import { z } from "zod";

export const distritoSchema = z
  .string()
  .nonempty("El distrito es obligatorio")
  .min(2, "El distrito debe tener al menos 2 caracteres");

