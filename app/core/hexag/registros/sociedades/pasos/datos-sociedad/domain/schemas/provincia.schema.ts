import { z } from "zod";

export const provinciaSchema = z
  .string()
  .nonempty("La provincia es obligatoria")
  .min(2, "La provincia debe tener al menos 2 caracteres");

