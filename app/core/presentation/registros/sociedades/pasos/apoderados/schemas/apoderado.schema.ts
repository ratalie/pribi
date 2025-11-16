import { z } from "zod";

export const apoderadoFieldSchemas = {
  claseApoderadoId: z
    .string({ required_error: "Selecciona una clase" })
    .min(1, "Selecciona una clase"),
  personaId: z.string().optional(),
  tipoDocumento: z.string({ required_error: "Selecciona el tipo de documento." }).min(1),
  numeroDocumento: z.string({ required_error: "Ingresa el documento." }).min(6),
  nombre: z.string({ required_error: "Ingresa el nombre." }).min(1),
  apellidoPaterno: z.string({ required_error: "Ingresa el apellido paterno." }).min(1),
  apellidoMaterno: z.string().optional(),
  paisEmision: z.string().optional(),
};

export const apoderadoSchema = z.object(apoderadoFieldSchemas);

export type ApoderadoForm = z.infer<typeof apoderadoSchema>;


