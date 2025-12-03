/**
 * DATA DE PRUEBA PARA TESTS DE SOCIEDADES
 *
 * Archivo centralizado con toda la data que se envía al backend
 * Facilita la revisión y mantenimiento de los tests
 */

import type { DatosSociedadDTO } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/dtos/datos-sociedad.dto";
import type { QuorumDTO } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application/dtos/quorum.dto";
import type { DirectorDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/director.dto";
import type { AsignacionAccionesDTO } from "~/core/hexag/registros/sociedades/pasos/asignacion-acciones/domain/ports/asignacion-acciones.repository";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";

// ========================================
// PASO 1: DATOS DE SOCIEDAD
// ========================================

/**
 * Payload para crear/actualizar datos principales de la sociedad
 *
 * Endpoint: PUT /api/v2/society-profile/{id}/society
 * Documentación: docs/backend/01-detalles-sociedad.md
 */
export function createDatosSociedadPayload(): DatosSociedadDTO {
  return {
    // RUC único (11 dígitos)
    numeroRuc: `2060${Math.floor(Math.random() * 10000000)}`,

    // Tipo societario (enum: S.A.C., S.A., S.R.L., etc.)
    tipoSocietario: "S.A.C.",

    // Datos básicos
    razonSocial: "Tech Solutions SAC",
    nombreComercial: "Tech Solutions",

    // Dirección
    direccion: "Av. Principal 123",
    distrito: "Miraflores",
    provincia: "Lima",
    departamento: "Lima",

    // Fechas (formato: YYYY-MM-DD)
    fechaInscripcionRuc: "2024-01-15",
    fechaEscrituraPublica: "2024-01-10",
    fechaRegistrosPublicos: "2024-01-15",

    // Actividad y registro
    actividadExterior: "Sin actividades en el extranjero",
    partidaRegistral: "12345678",
    oficinaRegistral: "LIM", // Código de 3 letras
  };
}

// ========================================
// PASO 4: ASIGNACIÓN DE ACCIONES
// ========================================

/**
 * Payload para asignar acciones a un accionista
 *
 * Endpoint: POST /api/v2/society-profile/{id}/share-assignment
 * Documentación: docs/backend/04-asignacion-acciones.md
 */
export function createAsignacionPayload(accionistaId: string, accionId: string): any {
  // ✅ Usar any porque el DTO está incompleto
  const cantidadSuscrita = 50;
  const precioPorAccion = 1.0;

  return {
    // IDs (UUIDs generados en frontend)
    id: crypto.randomUUID(),
    accionistaId,
    accionId,

    // Cantidad y precio
    cantidadSuscrita,
    precioPorAccion,

    // ✅ Campos requeridos por el backend (seeds-sociedades.vue línea 500-508)
    capitalSocial: cantidadSuscrita * precioPorAccion, // Calculado
    prima: 0, // Prima por defecto

    // Porcentajes y estado de pago
    porcentajePagadoPorAccion: 100, // 0-100
    totalDividendosPendientes: 0, // >= 0
    pagadoCompletamente: true,
  };
}

// ========================================
// PASO 5: QUÓRUM Y MAYORÍAS
// ========================================

/**
 * Payload para configurar quórums de junta
 *
 * Endpoint: PUT /api/v2/society-profile/{id}/quorum
 * Documentación: docs/backend/08-quorum-mayorias.md
 */
export function createQuorumPayload(): QuorumDTO {
  return {
    // Primera convocatoria
    primeraConvocatoriaSimple: 60, // Porcentaje 0-100
    primeraConvocatoriaCalificada: 75,

    // Segunda convocatoria
    segundaConvocatoriaSimple: 50,
    segundaConvocatoriaCalificada: 65,

    // Quórums mínimos
    quorumMinimoSimple: 30,
    quorumMinimoCalificado: 40,
  };
}

// ========================================
// PASO 6: DIRECTORIO
// ========================================

/**
 * Payload para crear un director
 *
 * Endpoint: POST /api/v2/society-profile/{id}/directorio/directores
 * Documentación: docs/backend/05-directorio.md
 */
export function createDirectorPayload(): DirectorDTO {
  return {
    // IDs (UUIDs generados en frontend)
    id: crypto.randomUUID(),

    // Persona del director
    persona: {
      id: crypto.randomUUID(),
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      numeroDocumento: "12345678",
      tipoDocumento: TipoDocumentosEnum.DNI, // ✅ Usar enum correcto
      paisEmision: "PE",
    },

    // Rol del director
    rolDirector: TipoDirector.TITULAR, // ✅ Usar enum correcto

    // Reemplazo (opcional)
    reemplazaId: null,
  };
}

// ========================================
// PASO 7: APODERADOS
// ========================================

/**
 * Payload para crear una clase de apoderado
 *
 * Endpoint: POST /api/v2/society-profile/{id}/attorney-register/classes
 * Documentación: docs/backend/06-registro-apoderados.md
 *
 * ⚠️ IMPORTANTE: Solo acepta `id` y `nombre`
 */
export function createClaseApoderadoPayload() {
  return {
    // ID único (UUID generado en frontend)
    id: crypto.randomUUID(),

    // Nombre único con timestamp para evitar duplicados
    nombre: `Gerente-${Date.now()}`,

    // ✅ Backend solo acepta estos 2 campos
  };
}

// ========================================
// HELPERS
// ========================================

/**
 * Genera un RUC único válido
 */
export function generateUniqueRUC(): string {
  const randomPart = Math.floor(Math.random() * 10000000);
  return `2060${randomPart.toString().padStart(7, "0")}`;
}

/**
 * Genera un nombre único con timestamp
 */
export function generateUniqueName(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}
