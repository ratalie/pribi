import { z } from "zod";

export const departamentoSchema = z
  .string()
  .nonempty("El departamento es obligatorio")
  .min(2, "El departamento debe tener al menos 2 caracteres");
