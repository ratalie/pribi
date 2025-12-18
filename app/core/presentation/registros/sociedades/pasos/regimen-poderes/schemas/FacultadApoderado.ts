import { z } from "zod";

export const selectFacultadSchema = z.string().nonempty("La facultad es obligatoria");

export const fechaInicioSchema = z.string().nonempty("La fecha de inicio es obligatoria");
export const fechaFinSchema = z.string().nonempty("La fecha de fin es obligatoria");
export const selectMonedaSchema = z.string().nonempty("La moneda es obligatoria");

export const montoDesdeSchema = z.number().min(0, "El monto debe ser mayor a 0");
export const montoHastaSchema = z.number().min(0, "El monto debe ser mayor a 0");
export const selectTipoMontoSchema = z.string().nonempty("El tipo de monto es obligatorio");

export const selectTipoFirmaSchema = z.string().nonempty("El tipo de firma es obligatorio");

export const selectCantidadFirmantesSchema = z
  .string()
  .nonempty("La cantidad de firmantes es obligatoria");

export const cantidadFirmantesLibreSchema = z
  .number()
  .int("La cantidad debe ser un número entero")
  .min(1, "La cantidad debe ser mayor a 0");

export const selectGrupoFirmantesSchema = z
  .string()
  .nonempty("El grupo de firmantes es obligatorio");

export const facultadApoderadoSchema = z.object({
  facultad: selectFacultadSchema,
  fechaInicio: fechaInicioSchema,
  fechaFin: fechaFinSchema,
  moneda: selectMonedaSchema,
  desde: montoDesdeSchema,
  hasta: montoHastaSchema,
  tipoMonto: selectTipoMontoSchema,
  tipoFirma: selectTipoFirmaSchema,
});
