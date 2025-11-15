import { z } from "zod";

export const claseApoderadoSchema = z.object({
  nombre: z
    .string({ required_error: "Ingresa un nombre para la clase." })
    .min(1, "El nombre de la clase es obligatorio."),
});

export type ClaseApoderadoForm = z.infer<typeof claseApoderadoSchema>;


