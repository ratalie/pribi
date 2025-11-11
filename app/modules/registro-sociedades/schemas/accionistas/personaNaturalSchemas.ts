import { z } from "zod";

export const tipoDocumentoSchema = z.string().nonempty("El tipo de documento es obligatorio");

export const numeroDocumentoSchema = z
  .string()
  .nonempty("El número de documento es obligatorio")
  .min(8, "Debe tener al menos 8 caracteres");

export const nombreSchema = z
  .string()
  .nonempty("El nombre es obligatorio")
  .min(2, "El nombre debe tener al menos 2 caracteres");

export const apellidoPaternoSchema = z
  .string()
  .nonempty("El apellido paterno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const apellidoMaternoSchema = z
  .string()
  .nonempty("El apellido materno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const paisPasaporteSchema = z.string().optional();

export const estadoCivilSchema = z.string().nonempty("El estado civil es obligatorio");

export const regimenPatrimonialSchema = z.string().optional();

export const conyugeTipoDocumentoSchema = z.string().optional();

export const conyugeNumeroDocumentoSchema = z.string().optional();

export const conyugeNombreSchema = z.string().optional();

export const conyugeApellidoPaternoSchema = z.string().optional();

export const conyugeApellidoMaternoSchema = z.string().optional();

export const conyugePaisPasaporteSchema = z.string().optional();

export const partidaRegistralSchema = z.string().optional();

export const sedeRegistralSchema = z.string().optional();
