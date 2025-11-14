import { z } from "zod";

export const direccionSchema = z
  .string()
  .nonempty("La dirección es obligatoria")
  .min(2, "La dirección debe tener al menos 2 caracteres");

