import { defineStore } from "pinia";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
import {
  CreateAsignacionAccionUseCase,
  DeleteAsignacionAccionUseCase,
  GetAsignacionAccionUseCase,
  UpdateAsignacionAccionUseCase,
} from "~/core/hexag/registros/sociedades/pasos/asignacion-acciones/application";
import { AsignacionAccionHttpRepository } from "~/core/hexag/registros/sociedades/pasos/asignacion-acciones/infrastructure";
import { useRegistroAccionistasStore } from "../../../../../../../modules/registro-sociedades/stores/useRegistroAccionistasStore";
import { useRegistroAccionesStore } from "../../acciones/stores/useRegistroAccionesStore";
import { useValorNominalStore } from "../../acciones/stores/useValorNominalStore";
import { AsignacionAccionPresentationMapper } from "../mappers/asignacion-accion-presentation.mapper";
import type {
  AccionDisponible,
  AsignacionAccionista,
  AsignacionAccionistaTableRow,
} from "../types/asignacion-acciones";

// Instancias de repository y use cases
const repository = new AsignacionAccionHttpRepository();
const getUseCase = new GetAsignacionAccionUseCase(repository);
const createUseCase = new CreateAsignacionAccionUseCase(repository);
const updateUseCase = new UpdateAsignacionAccionUseCase(repository);
const deleteUseCase = new DeleteAsignacionAccionUseCase(repository);

interface State {
  asignaciones: AsignacionAccionista[];
  // Mapa para guardar accionId cuando el backend no lo devuelve
  // Key: asignacionId, Value: accionId
  asignacionAccionIdMap: Map<string, string>;
}

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

export const useRegistroAsignacionAccionesStore = defineStore("registroAsignacionAcciones", {
  state: (): State => ({
    asignaciones: [],
    asignacionAccionIdMap: new Map<string, string>(),
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
            // Buscar la acción registrada que coincida con el ID
            const accionRegistrada = accionesRegistradas.find((a) => a.id === accion.accionId);

            let claseFormateada = "Acción desconocida";

            // Si encontramos la acción registrada, usar su tipo para formatear
            if (accionRegistrada) {
              claseFormateada = getNombreAccionParaUI(
                accionRegistrada.tipo,
                accionRegistrada.nombreAccion
              );
            }

            return {
              id: accion.id, // ID de la asignación necesario para editar/eliminar
              clase: claseFormateada,
              acciones: accion.cantidadSuscrita,
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
          const actual = accionesAsignadasPorTipo.get(accion.accionId) || 0;
          accionesAsignadasPorTipo.set(accion.accionId, actual + accion.cantidadSuscrita);
        });
      });

      // Si hay acciones registradas, usar esas y calcular acciones asignadas dinámicamente
      if (accionesRegistradas.length > 0) {
        return accionesRegistradas.map((accion) => {
          // Obtener el nombre correcto según el tipo de acción
          const nombreParaUI = getNombreAccionParaUI(accion.tipo, accion.nombreAccion);
          const accionesAsignadas = accionesAsignadasPorTipo.get(accion.id) || 0;

          return {
            id: accion.id,
            nombre: nombreParaUI,
            accionesSuscritas: accion.accionesSuscritas,
            accionesAsignadas,
          };
        });
      }

      // Si no hay acciones registradas, devolver array vacío
      // No mostrar datos hardcodeados cuando el backend devuelve un array vacío
      return [];
    },

    totalAccionesAsignadas: (state): number => {
      let total = 0;
      state.asignaciones.forEach((asignacion) => {
        asignacion.acciones.forEach((accion) => {
          total += accion.cantidadSuscrita;
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
          totalAsignadas += accion.cantidadSuscrita;
        });
      });
      return totalAsignadas * (valorNominalStore.valor || 0);
    },
  },

  actions: {
    /**
     * Carga las asignaciones desde el backend
     */
    async loadAsignaciones(societyProfileId: string) {
      try {
        const entities = await getUseCase.execute(societyProfileId);
        if (!entities || entities.length === 0) {
          this.asignaciones = [];
          return;
        }

        // Obtener nombres de accionistas
        const registroAccionistasStore = useRegistroAccionistasStore();
        const accionistaNombreMap = new Map<string, string>();

        registroAccionistasStore.accionistas.forEach((accionista) => {
          let nombre = "Accionista desconocido";
          if (accionista.tipoAccionista === "natural") {
            nombre = `${accionista.nombre} ${accionista.apellidoPaterno} ${accionista.apellidoMaterno}`;
          } else if (accionista.tipoAccionista === "juridica") {
            nombre = accionista.razonSocial;
          } else if (accionista.tipoAccionista === "sucursal") {
            nombre = accionista.nombreSucursal;
          } else if (accionista.tipoAccionista === "fideicomisos") {
            nombre = accionista.identificacionFideicomiso;
          } else {
            nombre = accionista.razonSocial || "Accionista desconocido";
          }
          accionistaNombreMap.set(accionista.id, nombre);
        });

        // Convertir entities a formato del store
        const asignacionesStore = AsignacionAccionPresentationMapper.domainListToStore(
          entities,
          accionistaNombreMap
        );

        // Si alguna asignación no tiene accionId, intentar obtenerlo del mapa local
        asignacionesStore.forEach((asignacion) => {
          if (!asignacion.accionId || asignacion.accionId.trim() === "") {
            const accionIdFromMap = this.asignacionAccionIdMap.get(asignacion.id);
            if (accionIdFromMap) {
              asignacion.accionId = accionIdFromMap;
              console.log(
                `[loadAsignaciones] ✅ Recuperado accionId del mapa local para asignación ${asignacion.id}: ${accionIdFromMap}`
              );
            } else {
              console.warn(
                `[loadAsignaciones] ⚠️ Asignación ${asignacion.id} no tiene accionId y no está en el mapa local`,
                asignacion
              );
            }
          } else {
            // Si tiene accionId, guardarlo en el mapa para futuras referencias
            this.asignacionAccionIdMap.set(asignacion.id, asignacion.accionId);
          }
        });

        // Agrupar por accionista
        const asignacionesPorAccionista = new Map<string, AsignacionAccionista>();

        asignacionesStore.forEach((accion) => {
          let asignacion = asignacionesPorAccionista.get(accion.accionistaId);
          if (!asignacion) {
            asignacion = {
              id: accion.accionistaId,
              accionista: accion.accionista,
              acciones: [],
            };
            asignacionesPorAccionista.set(accion.accionistaId, asignacion);
          }
          asignacion.acciones.push(accion);
        });

        // Convertir Map a Array
        this.asignaciones = Array.from(asignacionesPorAccionista.values());

        // Recalcular porcentajes
        this.recalculatePorcentajes();
      } catch (error) {
        console.error(
          "[useRegistroAsignacionAccionesStore] Error al cargar asignaciones:",
          error
        );
        this.asignaciones = [];
        throw error;
      }
    },

    /**
     * Crea una nueva asignación de acción en el backend y la agrega al estado local
     */
    async addAsignacionAccion(
      societyProfileId: string,
      accionistaId: string,
      payload: Omit<
        AsignacionAccionista["acciones"][0],
        "id" | "accionistaId" | "accionista" | "porcentaje"
      >
    ) {
      try {
        // Validar que accionId esté presente
        if (!payload.accionId || payload.accionId.trim() === "") {
          throw new Error("El accionId es requerido para crear una asignación");
        }

        // Convertir payload del store a DTO
        const dto = AsignacionAccionPresentationMapper.storeToDTOCreate({
          ...payload,
          accionistaId,
        });

        // Crear en el backend
        const entity = await createUseCase.execute(societyProfileId, dto);

        // Obtener nombre del accionista
        const registroAccionistasStore = useRegistroAccionistasStore();
        const accionista = registroAccionistasStore.accionistas.find(
          (a) => a.id === accionistaId
        );
        let accionistaNombre = "Accionista desconocido";

        if (accionista) {
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

        // Guardar el accionId en el mapa local (el backend no lo devuelve)
        if (payload.accionId) {
          this.asignacionAccionIdMap.set(entity.id, payload.accionId);
        }

        // Convertir entity a formato del store
        // Si el backend no devolvió accionId, usar el del payload
        const entityWithAccionId = {
          ...entity,
          accionId:
            entity.accionId ||
            payload.accionId ||
            this.asignacionAccionIdMap.get(entity.id) ||
            "",
        };
        const accionStore = AsignacionAccionPresentationMapper.domainToStore(
          entityWithAccionId,
          accionistaNombre
        );

        // Buscar o crear asignación del accionista
        let asignacion = this.asignaciones.find((a) => a.id === accionistaId);
        if (!asignacion) {
          asignacion = {
            id: accionistaId,
            accionista: accionistaNombre,
            acciones: [],
          };
          this.asignaciones.push(asignacion);
        }

        // Verificar si ya existe una asignación de este tipo de acción
        const accionExistente = asignacion.acciones.find(
          (a) => a.accionId === payload.accionId
        );

        if (accionExistente) {
          // Actualizar la asignación existente con los datos del backend
          Object.assign(accionExistente, accionStore);
        } else {
          // Agregar nueva asignación
          asignacion.acciones.push(accionStore);
        }

        // Recalcular porcentajes
        this.recalculatePorcentajes();
      } catch (error) {
        console.error(
          "[useRegistroAsignacionAccionesStore] Error al crear asignación:",
          error
        );
        throw error;
      }
    },

    /**
     * Actualiza una asignación de acción en el backend y en el estado local
     */
    async updateAsignacionAccion(
      societyProfileId: string,
      accionistaId: string,
      accionId: string,
      payload: Partial<
        Omit<
          AsignacionAccionista["acciones"][0],
          "id" | "accionistaId" | "accionista" | "porcentaje"
        >
      >
    ) {
      try {
        const asignacion = this.asignaciones.find((a) => a.id === accionistaId);
        if (!asignacion) {
          throw new Error(`No se encontró la asignación para el accionista ${accionistaId}`);
        }

        const accion = asignacion.acciones.find((a) => a.id === accionId);
        if (!accion) {
          throw new Error(
            `No se encontró la acción ${accionId} para el accionista ${accionistaId}`
          );
        }

        // Combinar datos existentes con los nuevos
        const accionActualizada = {
          ...accion,
          ...payload,
        };

        // Convertir a DTO
        const dto = AsignacionAccionPresentationMapper.storeToDTO(accionActualizada);

        // Actualizar en el backend
        const entity = await updateUseCase.execute(societyProfileId, accionId, dto);

        // Actualizar en el estado local con los datos del backend
        Object.assign(
          accion,
          AsignacionAccionPresentationMapper.domainToStore(entity, accion.accionista)
        );

        // Recalcular porcentajes
        this.recalculatePorcentajes();
      } catch (error) {
        console.error(
          "[useRegistroAsignacionAccionesStore] Error al actualizar asignación:",
          error
        );
        throw error;
      }
    },

    /**
     * Elimina una asignación de acción del backend y del estado local
     */
    async removeAsignacionAccion(
      societyProfileId: string,
      accionistaId: string,
      accionId: string
    ) {
      try {
        // Eliminar en el backend
        await deleteUseCase.execute(societyProfileId, accionId);

        // Eliminar del estado local
        const asignacion = this.asignaciones.find((a) => a.id === accionistaId);
        if (asignacion) {
          asignacion.acciones = asignacion.acciones.filter((a) => a.id !== accionId);

          // Si el accionista ya no tiene acciones, eliminarlo
          if (asignacion.acciones.length === 0) {
            this.asignaciones = this.asignaciones.filter((a) => a.id !== accionistaId);
          }
        }

        // Recalcular porcentajes
        this.recalculatePorcentajes();
      } catch (error) {
        console.error(
          "[useRegistroAsignacionAccionesStore] Error al eliminar asignación:",
          error
        );
        throw error;
      }
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
          const accionRegistrada = accionesRegistradas.find((a) => a.id === accion.accionId);
          const totalTipo = accionRegistrada
            ? accionRegistrada.accionesSuscritas
            : totalesPorTipo.get(accion.accionId) || 1;
          accion.porcentaje = (accion.cantidadSuscrita / totalTipo) * 100;
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
