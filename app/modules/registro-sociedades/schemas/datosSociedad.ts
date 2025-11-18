import { z } from "zod";

export const rucSchema = z
  .string()
  .nonempty("El RUC es obligatorio")
  .length(11, "El RUC debe tener exactamente 11 dígitos")
  .regex(/^20\d{9}$/, "El RUC debe empezar con 20");

export const razonSocialSchema = z
  .string()
  .nonempty("La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres")
  .refine((s) => /^\p{Lu}/u.test(s), {
    message: "La razón social debe comenzar con mayúscula",
  });

export const tipoSociedadSchema = z.string().nonempty("El tipo de sociedad es obligatorio");

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

const optionalDateSchema = (message: string) =>
  z
    .string()
    .refine(
      (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
      message
    );

const optionalStringSchema = (message: string, minLength = 2) =>
  z
    .string()
    .refine(
      (value) => value === "" || value.trim().length >= minLength,
      message
    );

export const fechaInscripcionRucSchema = optionalDateSchema(
  "La fecha de inscripción de RUC debe tener el formato YYYY-MM-DD"
);

export const actividadExteriorSchema = optionalStringSchema(
  "La actividad exterior debe tener al menos 2 caracteres"
);

export const fechaEscrituraPublicaSchema = optionalDateSchema(
  "La fecha de escritura pública debe tener el formato YYYY-MM-DD"
);

export const fechaRegistrosPublicosSchema = optionalDateSchema(
  "La fecha de registros públicos debe tener el formato YYYY-MM-DD"
);

export const oficinaRegistralSchema = optionalStringSchema(
  "La oficina registral debe seleccionarse"
);

export const partidaRegistralSchema = optionalStringSchema(
  "La partida registral debe tener al menos 2 caracteres"
);

export const datosSociedadSchema = z.object({
  ruc: rucSchema,
  tipoSociedad: tipoSociedadSchema,
  razonSocial: razonSocialSchema,
  nombreComercial: nombreComercialSchema,
  direccion: direccionSchema,
  distrito: distritoSchema,
  provincia: provinciaSchema,
  departamento: departamentoSchema,
  fechaInscripcionRuc: fechaInscripcionRucSchema,
  actividadExterior: actividadExteriorSchema,
  fechaEscrituraPublica: fechaEscrituraPublicaSchema,
  fechaRegistrosPublicos: fechaRegistrosPublicosSchema,
  oficinaRegistral: oficinaRegistralSchema,
  partidaRegistral: partidaRegistralSchema,
});
