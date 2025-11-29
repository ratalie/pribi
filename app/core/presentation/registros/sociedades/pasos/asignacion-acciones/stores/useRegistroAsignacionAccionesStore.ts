import { defineStore } from "pinia";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
import { useRegistroAccionistasStore } from "../../../../../../../modules/registro-sociedades/stores/useRegistroAccionistasStore";
import { useRegistroAccionesStore } from "../../acciones/stores/useRegistroAccionesStore";
import { useValorNominalStore } from "../../acciones/stores/useValorNominalStore";
import type {
  AccionDisponible,
  AsignacionAccionista,
  AsignacionAccionistaTableRow,
} from "../types/asignacion-acciones";

interface State {
  asignaciones: AsignacionAccionista[];
}

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

/**
 * Obtiene el nombre de la acción para mostrar en la UI según su tipo
 */
const getNombreAccionParaUI = (tipo: TipoAccionEnum, nombreAccion: string): string => {
  switch (tipo) {
    case TipoAccionEnum.CLASES:
      // Para clases, usar el nombre de la acción (ej: "Clase A", "Clase B")
      return nombreAccion || "Acción sin nombre";
    case TipoAccionEnum.COMUN:
      // Para acciones comunes, mostrar "Comunes"
      return "Comunes";
    case TipoAccionEnum.SIN_DERECHO_A_VOTO:
      // Para preferentes sin voto, mostrar "Preferentes sin voto"
      return "Preferentes sin voto";
    default:
      return nombreAccion || "Acción sin nombre";
  }
};

/**
 * Obtiene posibles nombres que puede tener una acción en las asignaciones
 * Esto ayuda a buscar las acciones asignadas correctamente
 */
const getNombresPosiblesParaBusqueda = (
  tipo: TipoAccionEnum,
  nombreAccion: string
): string[] => {
  const nombres: string[] = [nombreAccion]; // Siempre incluir el nombre original

  switch (tipo) {
    case TipoAccionEnum.COMUN:
      // Las acciones comunes pueden estar guardadas como "Comunes" o "Acciones comunes"
      nombres.push("Comunes", "Acciones comunes", "comunes");
      break;
    case TipoAccionEnum.SIN_DERECHO_A_VOTO:
      // Las preferentes sin voto pueden estar guardadas de varias formas
      nombres.push("Preferentes sin voto", "Preferentes", "Sin derecho a voto");
      break;
    case TipoAccionEnum.CLASES:
      // Para clases, solo usar el nombre original (ej: "Clase A")
      break;
  }

  return nombres;
};

export const useRegistroAsignacionAccionesStore = defineStore("registroAsignacionAcciones", {
  state: (): State => ({
    asignaciones: [],
  }),

  getters: {
    tablaAsignaciones: (state): AsignacionAccionistaTableRow[] => {
      const registroAccionesStore = useRegistroAccionesStore();
      const registroAccionistasStore = useRegistroAccionistasStore();
      const accionesRegistradas = registroAccionesStore.acciones;
      const accionistas = registroAccionistasStore.accionistas;

      // Crear un mapa de asignaciones existentes por ID de accionista
      const asignacionesMap = new Map<string, AsignacionAccionista>();
      state.asignaciones.forEach((asignacion) => {
        asignacionesMap.set(asignacion.id, asignacion);
      });

      // Para cada accionista, crear o usar la asignación existente
      return accionistas.map((accionista) => {
        // Obtener el nombre del accionista según su tipo
        let accionistaNombre = "Accionista desconocido";

        if (accionista.tipoAccionista === "natural") {
          accionistaNombre = `${accionista.nombre} ${accionista.apellidoPaterno} ${accionista.apellidoMaterno}`;
        } else if (accionista.tipoAccionista === "juridica") {
          accionistaNombre = accionista.razonSocial;
        } else if (accionista.tipoAccionista === "sucursal") {
          accionistaNombre = accionista.nombreSucursal;
        } else if (accionista.tipoAccionista === "fideicomisos") {
          accionistaNombre = accionista.identificacionFideicomiso;
        } else {
          accionistaNombre = accionista.razonSocial || "Accionista desconocido";
        }

        // Obtener la asignación existente o crear una nueva vacía
        const asignacion = asignacionesMap.get(accionista.id) || {
          id: accionista.id,
          accionista: accionistaNombre,
          acciones: [],
        };

        const tiposCount = asignacion.acciones.length;
        const tiposText = tiposCount === 1 ? "1 tipo" : `${tiposCount} tipos`;

        return {
          id: asignacion.id,
          accionista: asignacion.accionista,
          tipos: tiposText,
          acciones: asignacion.acciones.map((accion) => {
            // Buscar la acción registrada que coincida con el nombre
            const accionRegistrada = accionesRegistradas.find(
              (a) => a.nombreAccion === accion.tipoAccion
            );

            let claseFormateada = accion.tipoAccion;

            // Si encontramos la acción registrada, usar su tipo para formatear
            if (accionRegistrada) {
              claseFormateada = getNombreAccionParaUI(
                accionRegistrada.tipo,
                accionRegistrada.nombreAccion
              );
            } else {
              // Si no encontramos la acción registrada, intentar inferir el tipo por el nombre
              // Esto es útil para datos legacy o hardcodeados
              const nombreLower = accion.tipoAccion.toLowerCase();

              if (nombreLower.includes("comun") || nombreLower === "comunes") {
                claseFormateada = "Comunes";
              } else if (
                nombreLower.includes("preferente") ||
                nombreLower.includes("sin derecho") ||
                nombreLower.includes("no voto")
              ) {
                claseFormateada = "Preferentes sin voto";
              }
              // Si empieza con "Clase" o parece ser una clase, mantener el nombre original
            }

            return {
              clase: claseFormateada,
              acciones: accion.cantidadAcciones,
              porcentaje: accion.porcentaje,
            };
          }),
        };
      });
    },

    accionesDisponibles: (state): AccionDisponible[] => {
      const registroAccionesStore = useRegistroAccionesStore();
      const accionesRegistradas = registroAccionesStore.acciones;

      // Calcular acciones asignadas por cada tipo desde state.asignaciones (siempre reactivo)
      // Esto asegura que las acciones asignadas se actualicen automáticamente cuando cambia state.asignaciones
      const accionesAsignadasPorTipo = new Map<string, number>();
      state.asignaciones.forEach((asignacion) => {
        asignacion.acciones.forEach((accion) => {
          const actual = accionesAsignadasPorTipo.get(accion.tipoAccion) || 0;
          accionesAsignadasPorTipo.set(accion.tipoAccion, actual + accion.cantidadAcciones);
        });
      });

      // Si hay acciones registradas, usar esas y calcular acciones asignadas dinámicamente
      if (accionesRegistradas.length > 0) {
        return accionesRegistradas.map((accion) => {
          // Obtener el nombre correcto según el tipo de acción
          const nombreParaUI = getNombreAccionParaUI(accion.tipo, accion.nombreAccion);

          // Buscar acciones asignadas por todos los nombres posibles
          const nombresPosibles = getNombresPosiblesParaBusqueda(
            accion.tipo,
            accion.nombreAccion
          );
          let accionesAsignadas = 0;

          for (const nombre of nombresPosibles) {
            const encontradas = accionesAsignadasPorTipo.get(nombre);
            if (encontradas !== undefined) {
              accionesAsignadas += encontradas;
            }
          }

          return {
            id: accion.id,
            nombre: nombreParaUI,
            accionesSuscritas: accion.accionesSuscritas,
            accionesAsignadas,
          };
        });
      }

      // Si no hay acciones registradas, usar datos hardcodeados para acciones suscritas
      // pero calcular acciones asignadas dinámicamente desde state.asignaciones (reactivo)
      const accionesHardcodeadas = new Map<string, number>([
        ["Comunes", 1000],
        ["Preferentes", 5000],
        ["Clase A", 8000],
        ["Clase B", 2000],
      ]);

      // Obtener todos los tipos únicos de las asignaciones y de las acciones hardcodeadas
      const tiposUnicos = Array.from(
        new Set<string>([
          ...accionesHardcodeadas.keys(),
          ...Array.from(accionesAsignadasPorTipo.keys()),
        ])
      );

      // Construir lista de acciones disponibles
      return tiposUnicos.map((tipo, index) => {
        const accionesSuscritasHardcodeadas = accionesHardcodeadas.get(tipo);
        const accionesAsignadas = accionesAsignadasPorTipo.get(tipo) || 0;

        // Si no hay acciones suscritas hardcodeadas para este tipo,
        // usar las acciones asignadas como acciones suscritas (mínimo para mostrar)
        const accionesSuscritas =
          accionesSuscritasHardcodeadas !== undefined
            ? accionesSuscritasHardcodeadas
            : accionesAsignadas || 0;

        return {
          id: (index + 1).toString(),
          nombre: tipo,
          accionesSuscritas,
          accionesAsignadas, // Siempre calculado desde state.asignaciones (reactivo)
        };
      });
    },

    totalAccionesAsignadas: (state): number => {
      let total = 0;
      state.asignaciones.forEach((asignacion) => {
        asignacion.acciones.forEach((accion) => {
          total += accion.cantidadAcciones;
        });
      });
      return total;
    },

    totalAccionesSociedad: (): number => {
      const registroAccionesStore = useRegistroAccionesStore();
      return registroAccionesStore.totalAcciones || 0;
    },

    capitalSocial: (state): number => {
      const valorNominalStore = useValorNominalStore();
      // Calcular el total de acciones asignadas
      let totalAsignadas = 0;
      state.asignaciones.forEach((asignacion) => {
        asignacion.acciones.forEach((accion) => {
          totalAsignadas += accion.cantidadAcciones;
        });
      });
      return totalAsignadas * (valorNominalStore.valor || 0);
    },
  },

  actions: {
    // Agregar una asignación de acción a un accionista
    addAsignacionAccion(
      accionistaId: string,
      payload: Omit<AsignacionAccionista["acciones"][0], "id" | "accionistaId" | "accionista">
    ) {
      const asignacion = this.asignaciones.find((a) => a.id === accionistaId);

      if (!asignacion) {
        // Si el accionista no existe, obtener el nombre desde el store de accionistas
        const registroAccionistasStore = useRegistroAccionistasStore();
        const accionista = registroAccionistasStore.accionistas.find(
          (a) => a.id === accionistaId
        );
        let accionistaNombre = "Accionista desconocido";

        if (accionista) {
          // Obtener el nombre según el tipo de accionista
          if (accionista.tipoAccionista === "natural") {
            accionistaNombre = `${accionista.nombre} ${accionista.apellidoPaterno} ${accionista.apellidoMaterno}`;
          } else if (accionista.tipoAccionista === "juridica") {
            accionistaNombre = accionista.razonSocial;
          } else if (accionista.tipoAccionista === "sucursal") {
            accionistaNombre = accionista.nombreSucursal;
          } else if (accionista.tipoAccionista === "fideicomisos") {
            accionistaNombre = accionista.identificacionFideicomiso;
          } else {
            accionistaNombre = accionista.razonSocial || "Accionista desconocido";
          }
        }

        const nuevoAccionista: AsignacionAccionista = {
          id: accionistaId,
          accionista: accionistaNombre,
          acciones: [
            {
              id: generateId(),
              accionistaId,
              accionista: accionistaNombre,
              tipoAccion: payload.tipoAccion,
              cantidadAcciones: payload.cantidadAcciones,
              porcentaje: payload.porcentaje,
              precioAccion: payload.precioAccion ?? 0,
              capitalSocial: payload.capitalSocial ?? 0,
              prima: payload.prima ?? 0,
              totalmentePagado: payload.totalmentePagado ?? false,
              porcentajePagado: payload.porcentajePagado ?? 0,
              dividendoPasivo: payload.dividendoPasivo ?? 0,
            },
          ],
        };
        this.asignaciones.push(nuevoAccionista);
        this.recalculatePorcentajes();
        return;
      }

      // Verificar si ya existe una asignación de este tipo de acción
      const accionExistente = asignacion.acciones.find(
        (a) => a.tipoAccion === payload.tipoAccion
      );

      if (accionExistente) {
        // Actualizar la asignación existente
        accionExistente.cantidadAcciones = payload.cantidadAcciones;
        accionExistente.porcentaje = payload.porcentaje;
        if (payload.precioAccion !== undefined)
          accionExistente.precioAccion = payload.precioAccion;
        if (payload.capitalSocial !== undefined)
          accionExistente.capitalSocial = payload.capitalSocial;
        if (payload.prima !== undefined) accionExistente.prima = payload.prima;
        if (payload.totalmentePagado !== undefined)
          accionExistente.totalmentePagado = payload.totalmentePagado;
        if (payload.porcentajePagado !== undefined)
          accionExistente.porcentajePagado = payload.porcentajePagado;
        if (payload.dividendoPasivo !== undefined)
          accionExistente.dividendoPasivo = payload.dividendoPasivo;
      } else {
        // Agregar nueva asignación
        asignacion.acciones.push({
          id: generateId(),
          accionistaId,
          accionista: asignacion.accionista,
          tipoAccion: payload.tipoAccion,
          cantidadAcciones: payload.cantidadAcciones,
          porcentaje: payload.porcentaje,
          precioAccion: payload.precioAccion ?? 0,
          capitalSocial: payload.capitalSocial ?? 0,
          prima: payload.prima ?? 0,
          totalmentePagado: payload.totalmentePagado ?? false,
          porcentajePagado: payload.porcentajePagado ?? 0,
          dividendoPasivo: payload.dividendoPasivo ?? 0,
        });
      }

      this.recalculatePorcentajes();
    },

    // Actualizar una asignación de acción específica
    updateAsignacionAccion(
      accionistaId: string,
      accionId: string,
      payload: Partial<
        Omit<AsignacionAccionista["acciones"][0], "id" | "accionistaId" | "accionista">
      >
    ) {
      const asignacion = this.asignaciones.find((a) => a.id === accionistaId);

      if (!asignacion) {
        return;
      }

      const accion = asignacion.acciones.find((a) => a.id === accionId);

      if (!accion) {
        return;
      }

      // Actualizar solo los campos proporcionados
      if (payload.tipoAccion !== undefined) accion.tipoAccion = payload.tipoAccion;
      if (payload.cantidadAcciones !== undefined)
        accion.cantidadAcciones = payload.cantidadAcciones;
      if (payload.precioAccion !== undefined) accion.precioAccion = payload.precioAccion;
      if (payload.capitalSocial !== undefined) accion.capitalSocial = payload.capitalSocial;
      if (payload.prima !== undefined) accion.prima = payload.prima;
      if (payload.totalmentePagado !== undefined)
        accion.totalmentePagado = payload.totalmentePagado;
      if (payload.porcentajePagado !== undefined)
        accion.porcentajePagado = payload.porcentajePagado;
      if (payload.dividendoPasivo !== undefined)
        accion.dividendoPasivo = payload.dividendoPasivo;
      // El porcentaje se recalcula automáticamente, pero si se proporciona, usarlo
      if (payload.porcentaje !== undefined) accion.porcentaje = payload.porcentaje;

      // Recalcular porcentajes después de actualizar (esto sobrescribirá el porcentaje si se proporcionó)
      this.recalculatePorcentajes();
    },

    // Eliminar una asignación de acción específica
    removeAsignacionAccion(accionistaId: string, accionId: string) {
      const asignacion = this.asignaciones.find((a) => a.id === accionistaId);

      if (!asignacion) {
        return;
      }

      asignacion.acciones = asignacion.acciones.filter((a) => a.id !== accionId);

      // Si el accionista ya no tiene acciones, eliminarlo
      if (asignacion.acciones.length === 0) {
        this.asignaciones = this.asignaciones.filter((a) => a.id !== accionistaId);
      }

      this.recalculatePorcentajes();
    },

    // Obtener asignación por ID de accionista
    getAsignacionByAccionistaId(accionistaId: string): AsignacionAccionista | null {
      const asignacion = this.asignaciones.find((a) => a.id === accionistaId);

      if (!asignacion) {
        return null;
      }

      return {
        ...asignacion,
        acciones: asignacion.acciones.map((a) => ({ ...a })),
      };
    },

    // Obtener acción asignada por ID
    getAsignacionAccionById(accionistaId: string, accionId: string) {
      const asignacion = this.asignaciones.find((a) => a.id === accionistaId);

      if (!asignacion) {
        return null;
      }

      const accion = asignacion.acciones.find((a) => a.id === accionId);

      if (!accion) {
        return null;
      }

      return { ...accion };
    },

    // Recalcular porcentajes basados en el total de acciones por tipo
    recalculatePorcentajes() {
      const registroAccionesStore = useRegistroAccionesStore();
      const accionesRegistradas = registroAccionesStore.acciones;

      // Si no hay acciones registradas, usar data hardcodeada para calcular porcentajes
      const totalesPorTipo = new Map<string, number>();
      if (accionesRegistradas.length === 0) {
        totalesPorTipo.set("Comunes", 1000);
        totalesPorTipo.set("Preferentes", 5000);
        totalesPorTipo.set("Clase A", 8000);
        totalesPorTipo.set("Clase B", 2000);
      } else {
        accionesRegistradas.forEach((accion) => {
          totalesPorTipo.set(accion.nombreAccion, accion.accionesSuscritas);
        });
      }

      // Recalcular porcentajes para cada asignación
      this.asignaciones.forEach((asignacion) => {
        asignacion.acciones.forEach((accion) => {
          const totalTipo = totalesPorTipo.get(accion.tipoAccion) || 1;
          accion.porcentaje = (accion.cantidadAcciones / totalTipo) * 100;
        });
      });
    },

    // Limpiar todas las asignaciones
    clearAsignaciones() {
      this.asignaciones = [];
    },

    // Resetear a los datos iniciales
    reset() {
      this.asignaciones = [];
      this.recalculatePorcentajes();
    },

    /**
     * Inicializa las asignaciones desde los accionistas cargados del backend.
     * Crea una entrada vacía para cada accionista, lista para asignar acciones.
     */
    initializeFromAccionistas() {
      const registroAccionistasStore = useRegistroAccionistasStore();
      const accionistas = registroAccionistasStore.accionistas;

      // Crear un mapa de accionistas existentes por ID para no duplicar
      const asignacionesExistentes = new Map<string, AsignacionAccionista>();
      this.asignaciones.forEach((asignacion) => {
        asignacionesExistentes.set(asignacion.id, asignacion);
      });

      // Para cada accionista, crear una asignación si no existe
      accionistas.forEach((accionista) => {
        if (!asignacionesExistentes.has(accionista.id)) {
          // Obtener el nombre del accionista según su tipo
          let accionistaNombre = "Accionista desconocido";

          if (accionista.tipoAccionista === "natural") {
            accionistaNombre = `${accionista.nombre} ${accionista.apellidoPaterno} ${accionista.apellidoMaterno}`;
          } else if (accionista.tipoAccionista === "juridica") {
            accionistaNombre = accionista.razonSocial;
          } else if (accionista.tipoAccionista === "sucursal") {
            accionistaNombre = accionista.nombreSucursal;
          } else if (accionista.tipoAccionista === "fideicomisos") {
            accionistaNombre = accionista.identificacionFideicomiso;
          } else {
            accionistaNombre = accionista.razonSocial || "Accionista desconocido";
          }

          // Crear asignación vacía para este accionista
          const nuevaAsignacion: AsignacionAccionista = {
            id: accionista.id,
            accionista: accionistaNombre,
            acciones: [], // Sin acciones asignadas aún
          };

          this.asignaciones.push(nuevaAsignacion);
        }
      });

      // Remover asignaciones de accionistas que ya no existen
      this.asignaciones = this.asignaciones.filter((asignacion) =>
        accionistas.some((acc) => acc.id === asignacion.id)
      );

      // Recalcular porcentajes después de la inicialización
      this.recalculatePorcentajes();
    },
  },
});
