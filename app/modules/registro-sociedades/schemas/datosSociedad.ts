import { z } from "zod";

export const razonSocialSchema = z
  .string()
  .nonempty("La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres")
  .refine((s) => /^\p{Lu}/u.test(s), {
    message: "La razón social debe comenzar con mayúscula",
  });
export const tipoSociedadSchema = z.string().nonempty("El tipo de sociedad es obligatorio");

export const fechaInscripcionRucSchema = z.string().nonempty("La fecha de inscripción en el RUC es obligatoria");

export const nombreComercialSchema = z
  .string()
  .nonempty("El nombre comercial es obligatorio")
  .min(2, "El nombre comercial debe tener al menos 2 caracteres");

export const direccionSchema = z
  .string()
  .nonempty("La dirección es obligatoria")
  .min(2, "La dirección debe tener al menos 2 caracteres");

export const distritoSchema = z
  .string()
  .nonempty("El distrito es obligatorio")
  .min(2, "El distrito debe tener al menos 2 caracteres");

export const provinciaSchema = z
  .string()
  .nonempty("La provincia es obligatoria")
  .min(2, "La provincia debe tener al menos 2 caracteres");

export const departamentoSchema = z
  .string()
  .nonempty("El departamento es obligatorio")
  .min(2, "El departamento debe tener al menos 2 caracteres");

export const actividadExteriorSchema = z
  .string()
  .nonempty("La actividad exterior es obligatoria")
  .min(2, "La actividad exterior debe tener al menos 2 caracteres");

export const partidaRegistralSchema = z
  .string()
  .nonempty("La partida registral es obligatoria")
  .min(2, "La partida registral debe tener al menos 2 caracteres");

export const datosSociedadSchema = z.object({
  razonSocial: razonSocialSchema,
  nombreComercial: nombreComercialSchema,
  direccion: direccionSchema,
  distrito: distritoSchema,
  provincia: provinciaSchema,
  departamento: departamentoSchema,
  actividadExterior: actividadExteriorSchema,
  partidaRegistral: partidaRegistralSchema,
  tipoSociedad: tipoSociedadSchema,
  fechaInscripcionRuc: fechaInscripcionRucSchema,
});
