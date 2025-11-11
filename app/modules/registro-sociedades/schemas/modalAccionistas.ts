import { z } from "zod";

export const tipoAccionistaSchema = z
  .string()
  .nonempty("El tipo de accionista es obligatorio");
