import { z } from "zod";

export const claseApoderadoSchema = z
  .string()
  .nonempty("El nombre de la clase de apoderado es obligatorio")

export const registroApoderadosSchema = z.object({
  claseApoderado: claseApoderadoSchema,
});
