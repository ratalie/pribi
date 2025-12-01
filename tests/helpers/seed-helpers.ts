/**
 * Helpers compartidos para tests basados en seeds-sociedades.vue
 * 
 * Estos helpers replican exactamente la lógica del seed para garantizar
 * que los payloads de los tests coincidan con los del seed que funciona.
 */

import type { DatosSociedadDTO } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/dtos/datos-sociedad.dto";
import type { AccionistaDTO } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/dtos/accionista.dto";
import type { AccionPayload } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
import type { QuorumDTO } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application/dtos/quorum.dto";
import type { DirectorioDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/directorio.dto";
import type { DirectorDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/director.dto";
import type { ClaseApoderadoDTO } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/dtos/clase-apoderado.dto";
import type { ApoderadoDTO } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/dtos/apoderado.dto";
import type { Persona } from "~/core/hexag/registros/sociedades/pasos/accionistas/domain/entities/persona.entity";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain/enums/tipo-accion.enum";
import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

// Importar y re-exportar desde utils para mantener compatibilidad
import { generateUUID as _generateUUID, ensureUUID as _ensureUUID } from "@tests/utils/uuid-generator";
export { generateUUID, ensureUUID } from "@tests/utils/uuid-generator";

// Aliases locales para uso interno
const generateUUID = _generateUUID;
const ensureUUID = _ensureUUID;

/**
 * Genera datos de prueba para una sociedad
 * Replica exactamente la función generateTestData del seed
 */
export function generateTestData(index: number) {
  const baseName = `Empresa Test ${index + 1}`;
  // Generar RUC único usando timestamp + índice para evitar duplicados
  const timestamp = Date.now();
  const ruc = `20${String(timestamp % 10000000).padStart(7, "0")}${String(index).padStart(2, "0")}`;

  return {
    datosSociedad: {
      numeroRuc: ruc,
      tipoSocietario: "S.A.C.",
      razonSocial: baseName,
      nombreComercial: `${baseName} S.A.C.`,
      direccion: `Av. Principal ${index + 1}`,
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
      fechaInscripcionRuc: "01-01-2024",
      actividadExterior: "Comercio",
      fechaEscrituraPublica: "01-01-2024",
      fechaRegistrosPublicos: "01-01-2024",
      partidaRegistral: `1234${index}`,
      oficinaRegistral: "Lima",
    } as DatosSociedadDTO,

    accionistas: [
      {
        id: generateUUID(),
        persona: {
          id: generateUUID(),
          tipo: "NATURAL",
          nombre: "Juan",
          apellidoPaterno: "Pérez",
          apellidoMaterno: "García",
          numeroDocumento: String(index * 2 + 1).padStart(8, "0"),
          tipoDocumento: "DNI",
          fechaNacimiento: "01-01-1990",
          nacionalidad: "Peruana",
          estadoCivil: "SOLTERO",
          direccion: "Av. Test 123",
          distrito: "San Isidro",
          provincia: "Lima",
          departamento: "Lima",
        } as Persona,
        participacionPorcentual: 60,
      },
      {
        id: generateUUID(),
        persona: {
          id: generateUUID(),
          tipo: "NATURAL",
          nombre: "María",
          apellidoPaterno: "González",
          apellidoMaterno: "López",
          numeroDocumento: String(index * 2 + 2).padStart(8, "0"),
          tipoDocumento: "DNI",
          fechaNacimiento: "01-01-1992",
          nacionalidad: "Peruana",
          estadoCivil: "SOLTERO",
          direccion: "Av. Test 456",
          distrito: "Miraflores",
          provincia: "Lima",
          departamento: "Lima",
        } as Persona,
        participacionPorcentual: 40,
      },
    ] as AccionistaDTO[],

    accion: {
      id: generateUUID(),
      tipo: TipoAccionEnum.COMUN,
      nombreAccion: "Acción Común",
      accionesSuscritas: 500,
      derechoVoto: true,
      redimible: false,
      otrosDerechosEspeciales: false,
      obligacionesAdicionales: false,
      comentariosAdicionales: false,
    } as AccionPayload,

    quorum: {
      quorumMinimoSimple: 50,
      quorumMinimoCalificado: 60,
      primeraConvocatoriaSimple: 60,
      primeraConvocatoriaCalificada: 60,
      segundaConvocatoriaSimple: 66,
      segundaConvocatoriaCalificada: 66,
    } as QuorumDTO,

    directorio: {
      cantidadDirectores: 3,
      conteoPersonalizado: false,
      minimoDirectores: null,
      maximoDirectores: null,
      inicioMandato: "01-01-2025",
      finMandato: "01-01-2026",
      quorumMinimo: 2,
      mayoria: 2,
      presidenteDesignado: true,
      secretarioAsignado: true,
      reeleccionPermitida: true,
      presidentePreside: true,
      presidenteDesempata: true,
      periodo: "1",
      presidenteId: null,
    } as DirectorioDTO,

    directores: Array.from({ length: 3 }, (_, i) => ({
      id: generateUUID(),
      persona: {
        id: generateUUID(),
        nombre: ["Carlos", "Ana", "Luis"][i],
        apellidoPaterno: ["Rodríguez", "Martínez", "Fernández"][i],
        apellidoMaterno: ["Vargas", "Sánchez", "Torres"][i],
        tipoDocumento: "DNI",
        numeroDocumento: String(index * 10 + i + 10).padStart(8, "0"),
        paisEmision: "PE",
      },
      rolDirector: TipoDirector.TITULAR,
    })) as DirectorDTO[],

    claseApoderado: {
      id: generateUUID(),
      nombre: "Gerente General",
    } as ClaseApoderadoDTO,

    apoderado: {
      id: generateUUID(),
      claseApoderadoId: "",
      persona: {
        id: generateUUID(),
        tipo: "NATURAL",
        nombre: "Roberto",
        apellidoPaterno: "Silva",
        apellidoMaterno: "Mendoza",
        numeroDocumento: String(index * 6 + 6).padStart(8, "0"),
        tipoDocumento: "DNI",
        fechaNacimiento: "01-01-1985",
        nacionalidad: "Peruana",
        estadoCivil: "CASADO",
        direccion: "Av. Gerente 789",
        distrito: "San Isidro",
        provincia: "Lima",
        departamento: "Lima",
      } as Persona,
    } as ApoderadoDTO,
  };
}

/**
 * Genera datos de prueba simplificados para un solo paso
 */
export function generateSimpleTestData() {
  return generateTestData(0);
}

/**
 * Crea un accionista natural de prueba
 */
export function createTestAccionistaNatural(index: number = 0): AccionistaDTO {
  return {
    id: generateUUID(),
    persona: {
      id: generateUUID(),
      tipo: "NATURAL",
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      numeroDocumento: String(index * 2 + 1).padStart(8, "0"),
      tipoDocumento: "DNI",
      fechaNacimiento: "01-01-1990",
      nacionalidad: "Peruana",
      estadoCivil: "SOLTERO",
      direccion: "Av. Test 123",
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
    } as Persona,
    participacionPorcentual: 60,
  };
}

/**
 * Crea un accionista jurídico de prueba
 * Replica exactamente la estructura que el backend espera
 */
export function createTestAccionistaJuridico(index: number = 0): AccionistaDTO {
  return {
    id: generateUUID(),
    persona: {
      id: generateUUID(),
      tipo: "JURIDICA",
      razonSocial: `Empresa Test ${index}`,
      numeroDocumento: `20${String(index).padStart(9, "0")}`, // Usar numeroDocumento, no numeroRuc
      tipoDocumento: "RUC",
      direccion: "Av. Test 123",
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
      constituida: true, // Campo requerido por el backend para personas jurídicas
    } as Persona,
    participacionPorcentual: 40,
  };
}

/**
 * Crea una acción de prueba
 */
export function createTestAccion(
  tipo: TipoAccionEnum = TipoAccionEnum.COMUN,
  accionesSuscritas: number = 500
): AccionPayload {
  // Para acciones preferenciales (SIN_DERECHO_A_VOTO), el derechoVoto debe ser false
  // Para acciones comunes, el derechoVoto debe ser true
  const derechoVoto = tipo === TipoAccionEnum.COMUN;
  
  return {
    id: generateUUID(),
    tipo,
    nombreAccion: tipo === TipoAccionEnum.COMUN ? "Acción Común" : "Acción Preferencial",
    accionesSuscritas,
    derechoVoto,
    redimible: false,
    otrosDerechosEspeciales: false,
    obligacionesAdicionales: false,
    comentariosAdicionales: false,
  };
}

/**
 * Crea un director de prueba
 */
export function createTestDirector(
  index: number = 0,
  rol: TipoDirector = TipoDirector.TITULAR
): DirectorDTO {
  const nombres: string[] = ["Carlos", "Ana", "Luis", "María", "Pedro"];
  const apellidosP: string[] = ["Rodríguez", "Martínez", "Fernández", "García", "López"];
  const apellidosM: string[] = ["Vargas", "Sánchez", "Torres", "González", "Pérez"];

  return {
    id: generateUUID(),
    persona: {
      id: generateUUID(),
      nombre: nombres[index % nombres.length]!,
      apellidoPaterno: apellidosP[index % apellidosP.length]!,
      apellidoMaterno: apellidosM[index % apellidosM.length]!,
      tipoDocumento: TipoDocumentosEnum.DNI,
      numeroDocumento: String(index * 10 + 10).padStart(8, "0"),
      paisEmision: "PE",
    },
    rolDirector: rol,
  };
}

/**
 * Crea un quorum de prueba
 */
export function createTestQuorum(): QuorumDTO {
  return {
    quorumMinimoSimple: 50,
    quorumMinimoCalificado: 60,
    primeraConvocatoriaSimple: 60,
    primeraConvocatoriaCalificada: 60,
    segundaConvocatoriaSimple: 66,
    segundaConvocatoriaCalificada: 66,
  };
}

/**
 * Crea una clase de apoderado de prueba
 */
export function createTestClaseApoderado(): ClaseApoderadoDTO {
  return {
    id: generateUUID(),
    nombre: "Gerente General",
  };
}

/**
 * Crea un apoderado de prueba
 */
export function createTestApoderado(
  claseApoderadoId: string,
  index: number = 0
): ApoderadoDTO {
  return {
    id: generateUUID(),
    claseApoderadoId,
    persona: {
      id: generateUUID(),
      tipo: "NATURAL",
      nombre: "Roberto",
      apellidoPaterno: "Silva",
      apellidoMaterno: "Mendoza",
      numeroDocumento: String(index * 6 + 6).padStart(8, "0"),
      tipoDocumento: "DNI",
      fechaNacimiento: "01-01-1985",
      nacionalidad: "Peruana",
      estadoCivil: "CASADO",
      direccion: "Av. Gerente 789",
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
    } as Persona,
  };
}

/**
 * Limpia todas las sociedades del backend antes de ejecutar tests
 * 
 * ⚠️ IMPORTANTE: Esta función debe ejecutarse en el beforeAll de cada test suite
 * para garantizar un estado limpio antes de comenzar los tests.
 */
export async function clearAllSocieties(): Promise<void> {
  const { SociedadHttpRepository } = await import("~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository");
  const sociedadRepository = new SociedadHttpRepository();
  
  console.log("🧹 Limpiando todas las sociedades del backend...");
  try {
    const allSocieties = await sociedadRepository.list();
    console.log(`   Encontradas ${allSocieties.length} sociedades para eliminar`);
    
    for (const sociedad of allSocieties) {
      try {
        await sociedadRepository.delete(sociedad.idSociety);
        console.log(`   ✅ Eliminada sociedad ${sociedad.idSociety} (${sociedad.razonSocial || 'sin nombre'})`);
      } catch (error: any) {
        // Si la sociedad ya fue eliminada por otro test (404), ignorar silenciosamente
        const statusCode = error?.statusCode ?? error?.response?.status ?? null;
        if (statusCode === 404) {
          console.log(`   ℹ️  Sociedad ${sociedad.idSociety} ya fue eliminada (probablemente por otro test)`);
        } else {
          console.warn(`   ⚠️ No se pudo eliminar sociedad ${sociedad.idSociety}:`, error);
        }
      }
    }
    
    console.log("✅ Limpieza completada\n");
  } catch (error: any) {
    // Si no hay sociedades (404), es normal, no es un error
    const statusCode = error?.statusCode ?? error?.response?.status ?? null;
    if (statusCode === 404) {
      console.log("ℹ️  No hay sociedades para limpiar (backend retornó 404)\n");
    } else {
      console.warn("⚠️ Error al limpiar sociedades:", error);
    }
  }
}

