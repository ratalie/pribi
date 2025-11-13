import { defineStore } from "pinia";
import { useValorNominalStore } from "~/stores/useValorNominalStore";
import type {
  AccionDisponible,
  AsignacionAccionista,
  AsignacionAccionistaTableRow,
} from "../types/asignacion-acciones";
import { useRegistroAccionesStore } from "./useRegistroAccionesStore";
import { useRegistroAccionistasStore } from "./useRegistroAccionistasStore";

interface State {
  asignaciones: AsignacionAccionista[];
}

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Data hardcodeada inicial
const initialAsignaciones: AsignacionAccionista[] = [
  {
    id: "1",
    accionista: "Carlos Andrés Ramírez Torres",
    acciones: [
      {
        id: "1-1",
        accionistaId: "1",
        accionista: "Carlos Andrés Ramírez Torres",
        tipoAccion: "Clase A",
        cantidadAcciones: 30,
        porcentaje: 10.5,
        precioAccion: 100.0,
        capitalSocial: 3000.0,
        prima: 500.0,
        totalmentePagado: true,
        porcentajePagado: 80.0,
        dividendoPasivo: 600.0,
      },
      {
        id: "1-2",
        accionistaId: "1",
        accionista: "Carlos Andrés Ramírez Torres",
        tipoAccion: "Clase B",
        cantidadAcciones: 20,
        porcentaje: 3.79,
        precioAccion: 150.0,
        capitalSocial: 3000.0,
        prima: 300.0,
        totalmentePagado: false,
        porcentajePagado: 0,
        dividendoPasivo: 0,
      },
    ],
  },
  {
    id: "2",
    accionista: "María Fernanda López García",
    acciones: [
      {
        id: "2-1",
        accionistaId: "2",
        accionista: "María Fernanda López García",
        tipoAccion: "Comunes",
        cantidadAcciones: 50,
        porcentaje: 5.0,
        precioAccion: 200.0,
        capitalSocial: 10000.0,
        prima: 1000.0,
        totalmentePagado: true,
        porcentajePagado: 100.0,
        dividendoPasivo: 0,
      },
    ],
  },
  {
    id: "3",
    accionista: "Juan Pablo Martínez Sánchez",
    acciones: [
      {
        id: "3-1",
        accionistaId: "3",
        accionista: "Juan Pablo Martínez Sánchez",
        tipoAccion: "Preferentes",
        cantidadAcciones: 40,
        porcentaje: 4.0,
        precioAccion: 120.0,
        capitalSocial: 4800.0,
        prima: 600.0,
        totalmentePagado: true,
        porcentajePagado: 90.0,
        dividendoPasivo: 480.0,
      },
      {
        id: "3-2",
        accionistaId: "3",
        accionista: "Juan Pablo Martínez Sánchez",
        tipoAccion: "Clase A",
        cantidadAcciones: 25,
        porcentaje: 8.79,
        precioAccion: 100.0,
        capitalSocial: 2500.0,
        prima: 250.0,
        totalmentePagado: false,
        porcentajePagado: 0,
        dividendoPasivo: 0,
      },
      {
        id: "3-3",
        accionistaId: "3",
        accionista: "Juan Pablo Martínez Sánchez",
        tipoAccion: "Clase B",
        cantidadAcciones: 15,
        porcentaje: 2.5,
        precioAccion: 150.0,
        capitalSocial: 2250.0,
        prima: 225.0,
        totalmentePagado: true,
        porcentajePagado: 75.0,
        dividendoPasivo: 337.5,
      },
    ],
  },
];

export const useRegistroAsignacionAccionesStore = defineStore("registroAsignacionAcciones", {
  state: (): State => ({
    asignaciones: [...initialAsignaciones],
  }),

  getters: {
    tablaAsignaciones: (state): AsignacionAccionistaTableRow[] => {
      return state.asignaciones.map((asignacion) => {
        const tiposCount = asignacion.acciones.length;
        const tiposText = tiposCount === 1 ? "1 tipo" : `${tiposCount} tipos`;

        return {
          id: asignacion.id,
          accionista: asignacion.accionista,
          tipos: tiposText,
          acciones: asignacion.acciones.map((accion) => ({
            clase: accion.tipoAccion,
            acciones: accion.cantidadAcciones,
            porcentaje: accion.porcentaje,
          })),
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
        return accionesRegistradas.map((accion) => ({
          id: accion.id,
          nombre: accion.descripcion,
          accionesSuscritas: accion.accionesSuscritas,
          accionesAsignadas: accionesAsignadasPorTipo.get(accion.descripcion) || 0,
        }));
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
          totalesPorTipo.set(accion.descripcion, accion.accionesSuscritas);
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
      this.asignaciones = [...initialAsignaciones];
      this.recalculatePorcentajes();
    },
  },
});
