import type { AsistenciaJuntaQueryDto } from '../../../application/dtos/asistencia.dto';
import { getRecord, putRecord } from '~/core/hexag/registros/shared/mock-database';

/**
 * Estado mock para asistencias
 * 
 * Se inicializa automáticamente al crear una junta (en snapshot)
 * con un registro por cada accionista
 */

interface AsistenciaState {
  asistencias: AsistenciaJuntaQueryDto[];
}

const STORE_NAME = 'asistencias';

/**
 * Obtiene asistencias mock para una junta
 */
export async function getAsistenciasMock(
  societyId: number,
  flowId: number
): Promise<AsistenciaJuntaQueryDto[]> {
  const key = `${societyId}-${flowId}`;
  const state = await getRecord<AsistenciaState>(STORE_NAME, key);
  
  return state?.asistencias || [];
}

/**
 * Actualiza un registro de asistencia mock
 */
export async function updateAsistenciaMock(
  societyId: number,
  flowId: number,
  registroId: string,
  asistio: boolean,
  representadoPorId?: string
): Promise<void> {
  const key = `${societyId}-${flowId}`;
  const state = await getRecord<AsistenciaState>(STORE_NAME, key);
  
  if (!state || !state.asistencias) {
    throw new Error('No se encontraron registros de asistencia');
  }
  
  const index = state.asistencias.findIndex((a) => a.id === registroId);
  if (index === -1) {
    throw new Error(`Registro ${registroId} no encontrado`);
  }
  
  const registro = state.asistencias[index];
  if (!registro) {
    throw new Error(`Registro ${registroId} no encontrado`);
  }
  
  // Actualizar el registro  
  registro.asistio = asistio;
  registro.representadoPorId = representadoPorId || null;
  
  // Guardar
  await putRecord(STORE_NAME, { key, asistencias: state.asistencias });
}

/**
 * Inicializa registros de asistencia desde el snapshot
 * Se llama automáticamente al crear una junta
 */
export async function initAsistenciasMockFromSnapshot(
  societyId: number,
  flowId: number,
  snapshot: any
): Promise<void> {
  const key = `${societyId}-${flowId}`;
  
  // Calcular accionistas con derecho a voto
  const asignaciones = snapshot.shareAllocations || [];
  const shareClasses = snapshot.shareClasses || [];
  const shareholders = snapshot.shareholders || [];
  
  // Agrupar por accionista
  const accionistaMap = new Map<string, {
    shareholder: any;
    acciones: number;
  }>();
  
  asignaciones.forEach((asig: any) => {
    const shareClass = shareClasses.find((sc: any) => sc.id === asig.accionId);
    
    // Solo contar acciones con derecho a voto
    if (shareClass?.conDerechoVoto) {
      if (!accionistaMap.has(asig.accionistaId)) {
        const shareholder = shareholders.find((sh: any) => sh.id === asig.accionistaId);
        accionistaMap.set(asig.accionistaId, {
          shareholder,
          acciones: 0,
        });
      }
      
      const current = accionistaMap.get(asig.accionistaId);
      if (current) {
        current.acciones += asig.cantidadSuscrita;
      }
    }
  });
  
  // Calcular total de acciones con voto
  const totalAccionesConVoto = Array.from(accionistaMap.values())
    .reduce((sum, item) => sum + item.acciones, 0);
  
  // Crear registros de asistencia
  const asistencias: AsistenciaJuntaQueryDto[] = Array.from(accionistaMap.values()).map((item, index) => {
    const porcentaje = (item.acciones / totalAccionesConVoto) * 100;
    
    return {
      id: `asist-${societyId}-${flowId}-${index}`,
      configJuntaId: snapshot.meetingConfigId || `config-${flowId}`,
      accionista: item.shareholder,
      accionesConDerechoVoto: item.acciones,
      porcentajeParticipacion: porcentaje,
      asistio: false,  // Por defecto nadie asiste
      representadoPorId: null,
      esRepresentante: false,
      representante: null,
    };
  });
  
  // Guardar
  await putRecord(STORE_NAME, { key, asistencias });
  
  console.debug('[MSW][AsistenciaState] Asistencias inicializadas', {
    societyId,
    flowId,
    count: asistencias.length,
  });
}

