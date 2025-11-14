import { z } from "zod";

export const nombreComercialSchema = z
  .string()
  .nonempty("El nombre comercial es obligatorio")
  .min(2, "El nombre comercial debe tener al menos 2 caracteres");
