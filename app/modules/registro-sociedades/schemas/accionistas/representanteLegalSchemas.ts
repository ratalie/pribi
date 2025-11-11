import { z } from "zod";

export const tieneRepresentanteSchema = z.boolean();

export const representanteTipoDocumentoSchema = z.string().optional();

export const representanteNumeroDocumentoSchema = z.string().optional();

export const representanteNombreSchema = z.string().optional();

export const representanteApellidoPaternoSchema = z.string().optional();

export const representanteApellidoMaternoSchema = z.string().optional();

export const representantePaisPasaporteSchema = z.string().optional();
