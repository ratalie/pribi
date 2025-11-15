import { z } from "zod";

const isoDateSchema = z
  .string({ required_error: "Selecciona una fecha." })
  .refine((value) => !Number.isNaN(Date.parse(value)), { message: "Fecha inválida." });

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
  terminoCargo: z.enum(["INDEFINIDO", "DETERMINADO"], {
    required_error: "Selecciona el término del cargo.",
  }),
  fechaInicio: isoDateSchema,
  fechaFin: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Fecha inválida.",
    }),
};

export const apoderadoSchema = z.object(apoderadoFieldSchemas).superRefine((data, ctx) => {
  if (data.terminoCargo === "DETERMINADO" && !data.fechaFin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["fechaFin"],
      message: "Selecciona la fecha fin para cargos determinados.",
    });
  }
});

export type ApoderadoForm = z.infer<typeof apoderadoSchema>;

export const terminoCargoOptions = [
  { id: "INDEFINIDO", value: "INDEFINIDO", label: "Indefinido" },
  { id: "DETERMINADO", value: "DETERMINADO", label: "Determinado" },
];


