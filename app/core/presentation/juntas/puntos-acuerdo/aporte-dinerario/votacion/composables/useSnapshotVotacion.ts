import { computed } from "vue";
import { useSnapshotStore, type ShareholderWithShares } from "~/core/presentation/juntas/stores/snapshot.store";
import type { Shareholder } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";

/**
 * Composable para procesar datos del snapshot relacionados con votación
 * 
 * Proporciona:
 * 1. Accionistas con derecho a voto (filtrados y con acciones)
 * 2. Accionistas totales (con acciones divididas por derecho a voto)
 * 3. Tipos de acciones (con derecho y sin derecho a voto)
 */
export function useSnapshotVotacion() {
  const snapshotStore = useSnapshotStore();

  /**
   * 1. Accionistas con derecho a voto
   * Ya filtrados y con sus acciones y porcentajes calculados
   */
  const accionistasConDerechoVoto = computed<ShareholderWithShares[]>(() => {
    return snapshotStore.accionistasConDerechoVoto;
  });

  /**
   * 2. Accionistas totales con sus acciones divididas
   * Incluye acciones con y sin derecho a voto por accionista
   */
  const accionistasTotales = computed(() => {
    if (!snapshotStore.snapshot) return [];

    const asignaciones = snapshotStore.snapshot.shareAllocations;
    const shareClasses = snapshotStore.snapshot.shareClasses;
    const shareholders = snapshotStore.snapshot.shareholders;

    // Agrupar asignaciones por accionista
    const accionistaMap = new Map<string, {
      shareholder: Shareholder;
      accionesConDerechoVoto: number;
      accionesSinDerechoVoto: number;
      totalAcciones: number;
    }>();

    asignaciones.forEach((asig) => {
      const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);
      const tieneDerechoVoto = shareClass?.conDerechoVoto ?? false;

      if (!accionistaMap.has(asig.accionistaId)) {
        const shareholder = shareholders.find((sh) => sh.id === asig.accionistaId);
        if (shareholder) {
          accionistaMap.set(asig.accionistaId, {
            shareholder,
            accionesConDerechoVoto: 0,
            accionesSinDerechoVoto: 0,
            totalAcciones: 0,
          });
        }
      }

      const current = accionistaMap.get(asig.accionistaId);
      if (current) {
        if (tieneDerechoVoto) {
          current.accionesConDerechoVoto += asig.cantidadSuscrita;
        } else {
          current.accionesSinDerechoVoto += asig.cantidadSuscrita;
        }
        current.totalAcciones += asig.cantidadSuscrita;
      }
    });

    // Calcular totales para porcentajes
    const totalAccionesConVoto = Array.from(accionistaMap.values())
      .reduce((sum, item) => sum + item.accionesConDerechoVoto, 0);
    
    const totalAccionesSinVoto = Array.from(accionistaMap.values())
      .reduce((sum, item) => sum + item.accionesSinDerechoVoto, 0);

    const totalAcciones = totalAccionesConVoto + totalAccionesSinVoto;

    // Calcular porcentajes
    return Array.from(accionistaMap.values()).map((item) => {
      const porcentajeConDerechoVoto = totalAccionesConVoto > 0
        ? (item.accionesConDerechoVoto / totalAccionesConVoto) * 100
        : 0;
      
      const porcentajeSinDerechoVoto = totalAccionesSinVoto > 0
        ? (item.accionesSinDerechoVoto / totalAccionesSinVoto) * 100
        : 0;
      
      const porcentajeTotal = totalAcciones > 0
        ? (item.totalAcciones / totalAcciones) * 100
        : 0;

      return {
        shareholder: item.shareholder,
        accionesConDerechoVoto: item.accionesConDerechoVoto,
        accionesSinDerechoVoto: item.accionesSinDerechoVoto,
        totalAcciones: item.totalAcciones,
        porcentajeParticipacionConVoto: porcentajeConDerechoVoto,
        porcentajeParticipacionSinVoto: porcentajeSinDerechoVoto,
        porcentajeParticipacionTotal: porcentajeTotal,
      };
    });
  });

  /**
   * 3. Tipos de acciones filtrados
   * Separados por con derecho a voto y sin derecho a voto
   */
  const tiposAcciones = computed(() => {
    if (!snapshotStore.snapshot) {
      return {
        conDerechoVoto: [],
        sinDerechoVoto: [],
        todos: [],
      };
    }

    const shareClasses = snapshotStore.snapshot.shareClasses;
    const asignaciones = snapshotStore.snapshot.shareAllocations;

    // Calcular cantidad total por tipo de acción
    const cantidadPorTipo = new Map<string, number>();
    asignaciones.forEach((asig) => {
      const cantidad = cantidadPorTipo.get(asig.accionId) || 0;
      cantidadPorTipo.set(asig.accionId, cantidad + asig.cantidadSuscrita);
    });

    const conDerechoVoto = shareClasses
      .filter((sc) => sc.conDerechoVoto)
      .map((sc) => ({
        ...sc,
        cantidadTotal: cantidadPorTipo.get(sc.id) || 0,
      }));

    const sinDerechoVoto = shareClasses
      .filter((sc) => !sc.conDerechoVoto)
      .map((sc) => ({
        ...sc,
        cantidadTotal: cantidadPorTipo.get(sc.id) || 0,
      }));

    return {
      conDerechoVoto,
      sinDerechoVoto,
      todos: shareClasses.map((sc) => ({
        ...sc,
        cantidadTotal: cantidadPorTipo.get(sc.id) || 0,
      })),
    };
  });

  /**
   * Total de acciones con derecho a voto
   */
  const totalAccionesConDerechoVoto = computed(() => {
    return accionistasConDerechoVoto.value.reduce(
      (sum, a) => sum + a.totalAcciones,
      0
    );
  });

  /**
   * Total de acciones sin derecho a voto
   */
  const totalAccionesSinDerechoVoto = computed(() => {
    return accionistasTotales.value.reduce(
      (sum, a) => sum + a.accionesSinDerechoVoto,
      0
    );
  });

  /**
   * Total de acciones (todas)
   */
  const totalAcciones = computed(() => {
    return totalAccionesConDerechoVoto.value + totalAccionesSinDerechoVoto.value;
  });

  return {
    // 1. Accionistas con derecho a voto (filtrados)
    accionistasConDerechoVoto,
    
    // 2. Accionistas totales (con división de acciones)
    accionistasTotales,
    
    // 3. Tipos de acciones (filtrados)
    tiposAcciones,
    
    // Totales
    totalAccionesConDerechoVoto,
    totalAccionesSinDerechoVoto,
    totalAcciones,
  };
}

