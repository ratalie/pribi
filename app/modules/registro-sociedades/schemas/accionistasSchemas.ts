import { z } from "zod";

// ============================================================================
// SCHEMAS COMUNES - Utilizados por múltiples tipos de accionistas
// ============================================================================

export const tipoDocumentoAccSchema = z
  .string()
  .nonempty("El tipo de documento es obligatorio");

export const numeroDocumentoAccSchema = z
  .string()
  .nonempty("El número de documento es obligatorio")
  .min(8, "Debe tener al menos 8 caracteres");

export const razonSocialAccSchema = z
  .string()
  .nonempty("La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres");

export const partidaRegistralAccSchema = z
  .string()
  .nonempty("La partida registral es obligatoria");

export const direccionAccSchema = z
  .string()
  .nonempty("La dirección es obligatoria")
  .min(5, "La dirección debe tener al menos 5 caracteres");

export const sedeRegistralAccSchema = z.string().nonempty("La sede registral es obligatoria");

// ============================================================================
// PERSONA NATURAL - Schemas específicos para accionistas personas naturales
// ============================================================================

export const nombreAccSchema = z
  .string()
  .nonempty("El nombre es obligatorio")
  .min(2, "El nombre debe tener al menos 2 caracteres");

export const apellidoPaternoAccSchema = z
  .string()
  .nonempty("El apellido paterno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const apellidoMaternoAccSchema = z
  .string()
  .nonempty("El apellido materno es obligatorio")
  .min(2, "Debe tener al menos 2 caracteres");

export const paisPasaporteAccSchema = z.string().optional();

export const estadoCivilAccSchema = z.string().nonempty("El estado civil es obligatorio");

export const regimenPatrimonialAccSchema = z.string().optional();

// Cónyuge
export const conyugeTipoDocumentoSchema = z.string().optional();
export const conyugeNumeroDocumentoSchema = z.string().optional();
export const conyugeNombreSchema = z.string().optional();
export const conyugeApellidoPaternoSchema = z.string().optional();
export const conyugeApellidoMaternoSchema = z.string().optional();
export const conyugePaisPasaporteSchema = z.string().optional();

// ============================================================================
// PERSONA JURÍDICA - Schemas específicos para accionistas personas jurídicas
// ============================================================================

export const seConstituyoEnPeruAccSchema = z.boolean();

export const numeroDocumentoJurAccSchema = z
  .string()
  .nonempty("El número de documento es obligatorio")
  .min(11, "Debe tener al menos 11 caracteres");

export const nombreComercialAccSchema = z.string().optional();

export const distritoAccSchema = z.string().optional();
export const provinciaAccSchema = z.string().optional();
export const departamentoAccSchema = z.string().optional();
export const paisOrigenAccSchema = z.string().optional();

// ============================================================================
// FIDEICOMISOS - Schemas específicos para accionistas fideicomisos
// ============================================================================

export const tieneRucAccSchema = z.boolean();

export const identificacionFideicomisosAccSchema = z
  .string()
  .nonempty("La identificación del fideicomiso es obligatoria")
  .min(2, "Debe tener al menos 2 caracteres");

export const domicilioFiscalAccSchema = z
  .string()
  .nonempty("El domicilio fiscal es obligatorio")
  .min(5, "El domicilio fiscal debe tener al menos 5 caracteres");

// ============================================================================
// FONDOS DE INVERSIÓN - Schemas específicos para accionistas fondos de inversión
// ============================================================================

export const tipoFondoAccSchema = z.string().nonempty("El tipo de fondo es obligatorio");

// Sociedad Administradora
export const numeroDocumentoSociedadAdministradoraAccSchema = z
  .string()
  .nonempty("El número de documento de la sociedad administradora es obligatorio")
  .min(11, "Debe tener al menos 11 caracteres");

export const tipoDocumentoSociedadAdministradoraAccSchema = z
  .string()
  .nonempty("El tipo de documento de la sociedad administradora es obligatorio");

export const razonSocialSociedadAdministradoraAccSchema = z
  .string()
  .nonempty("La razón social de la sociedad administradora es obligatoria")
  .min(2, "Debe tener al menos 2 caracteres");
