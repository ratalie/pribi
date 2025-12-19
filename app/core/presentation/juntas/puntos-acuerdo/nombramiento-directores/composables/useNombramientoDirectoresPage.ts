import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import type {
  PersonJuridicDTO,
  PersonNaturalDTO,
} from "~/core/hexag/juntas/application/dtos/designation-attorney.dto";
import type { DesignationDirectorResponseDTO } from "~/core/hexag/juntas/application/dtos/designation-director.dto";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import { useNombramientoDirectoresStore } from "../stores/useNombramientoDirectoresStore";

/**
 * Tipo para datos de director en la UI
 */
export interface DirectorRow {
  id: string; // ID del registro de designación (DesignationDirectorResponseDTO.id)
  directorId: string; // ID del director (DesignationDirectorResponseDTO.directorId)
  directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  isCandidate: boolean;
  replacesId: string | null;
  esDelSnapshot?: boolean; // ✅ Flag para identificar si viene del snapshot (read-only)
}

/**
 * Composable para la página de Nombramiento de Directores
 *
 * Responsabilidades:
 * - Cargar datos de directores designados
 * - Manejar formulario de persona natural/jurídica (REUTILIZAR de apoderados)
 * - Crear nuevos directores cuando se hace clic en "Agregar" (POST)
 * - Filtrar y mapear directores para UI (TITULARES, SUPLENTES, ALTERNOS)
 */
export function useNombramientoDirectoresPage() {
  const route = useRoute();
  const nombramientoStore = useNombramientoDirectoresStore();
  const snapshotStore = useSnapshotStore();
  const personaNaturalStore = usePersonaNaturalStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estado del formulario
  const tipoPersona = ref<"natural" | "juridica">("natural");
  const directorRoleSeleccionado = ref<"TITULAR" | "SUPLENTE" | "ALTERNO" | null>(null);
  const isLoading = computed(() => nombramientoStore.status === "loading");
  const error = computed(() => nombramientoStore.errorMessage);

  // Datos del formulario - Persona Natural (REUTILIZAR de apoderados)
  const personaNatural = ref({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
  });

  // Datos del formulario - Persona Jurídica (REUTILIZAR de apoderados)
  const personaJuridica = ref({
    seConstituyoEnPeru: true,
    tipoDocumento: "",
    numeroDocumento: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    distrito: "",
    provincia: "",
    departamento: "",
    paisOrigen: "",
    tieneRepresentante: false,
  });

  // Representante legal (para persona jurídica)
  const representanteLegal = ref({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
  });

  /**
   * Mapear directores designados a formato DirectorRow para los componentes de tabla
   */
  const directoresMapeados = ref<DirectorRow[]>([]);

  /**
   * Función para actualizar directores mapeados desde todos los directores (snapshot + designados)
   */
  function actualizarDirectoresMapeados() {
    // ✅ Obtener directores del snapshot y designados por separado
    const directoresDelSnapshot = nombramientoStore.directoresDisponiblesDelSnapshot;
    const directoresDesignados = nombramientoStore.directoresDesignados;

    console.log("[Composable][actualizarDirectoresMapeados] Iniciando mapeo:", {
      directoresDelSnapshot: directoresDelSnapshot.length,
      directoresDesignados: directoresDesignados.length,
    });

    // Obtener IDs de directores designados (nuevos) para distinguirlos
    const idsDesignados = new Set(directoresDesignados.map((d) => d.directorId));

    // Crear un tipo temporal con el flag
    type DirectorConFlag = DesignationDirectorResponseDTO & { _isFromSnapshot: boolean };

    // Combinar snapshot (marcados como esDelSnapshot: true) + designados (marcados como esDelSnapshot: false)
    // ⚠️ IMPORTANTE: Primero snapshot, luego designados (los designados tienen prioridad en la deduplicación)
    const todosDirectores: DirectorConFlag[] = [
      // Directores del snapshot (marcar como esDelSnapshot: true)
      ...directoresDelSnapshot.map((director) => ({
        ...director,
        _isFromSnapshot: true as const, // Flag temporal para identificar origen
      })),
      // Directores designados (marcar como esDelSnapshot: false)
      ...directoresDesignados.map((director) => ({
        ...director,
        _isFromSnapshot: false as const, // Flag temporal para identificar origen
      })),
    ];

    // Deduplicar por directorId (preferir designados sobre snapshot si hay duplicados)
    const mapa = new Map<string, DirectorConFlag>();
    todosDirectores.forEach((director) => {
      const existing = mapa.get(director.directorId);
      // Si no existe, agregarlo
      // Si existe y es del snapshot, reemplazar con el designado (porque los designados vienen después)
      // Esto asegura que si un director está tanto en snapshot como designado, se use el designado
      if (!existing || existing._isFromSnapshot) {
        mapa.set(director.directorId, director);
      }
    });

    const mapeados = Array.from(mapa.values()).map((director) => {
      // Construir nombre completo desde los datos de persona del backend
      const nombre = `${director.person.nombre} ${director.person.apellidoPaterno} ${
        director.person.apellidoMaterno || ""
      }`.trim();

      // ✅ Identificar si viene del snapshot (usar el flag temporal _isFromSnapshot)
      const esDelSnapshot = director._isFromSnapshot === true;

      const rowMapeado = {
        id: director.id, // ✅ ID del registro de designación (o directorId si es del snapshot)
        directorId: director.directorId, // ✅ ID del director
        directorRole: director.directorRole,
        nombre, // Nombre completo formateado
        tipoDocumento: director.person.tipoDocumento,
        numeroDocumento: director.person.numeroDocumento,
        isCandidate: director.isCandidate,
        replacesId: director.replacesId,
        esDelSnapshot, // ✅ Flag para identificar si viene del snapshot (read-only)
      };

      // ✅ Debug: Log para verificar el flag esDelSnapshot en el composable
      console.log(
        `[Composable][actualizarDirectoresMapeados] Director: ${nombre}, esDelSnapshot: ${esDelSnapshot}, _isFromSnapshot: ${director._isFromSnapshot}`
      );

      return rowMapeado;
    });

    directoresMapeados.value = mapeados;
  }

  // Watch para actualizar directores mapeados cuando cambian los designados o el snapshot
  watch(
    [
      () => nombramientoStore.directoresDesignados,
      () => nombramientoStore.directoresDisponiblesDelSnapshot,
    ],
    () => {
      console.log(
        "[Composable][NombramientoDirectores] Watch detectó cambios, actualizando directores mapeados"
      );
      actualizarDirectoresMapeados();
    },
    { immediate: true, deep: true }
  );

  /**
   * Directores titulares
   */
  const directoresTitulares = computed<DirectorRow[]>(() => {
    return directoresMapeados.value.filter((d) => d.directorRole === "TITULAR");
  });

  /**
   * Directores suplentes y alternos
   */
  const directoresSuplentesAlternos = computed<DirectorRow[]>(() => {
    return directoresMapeados.value.filter(
      (d) => d.directorRole === "SUPLENTE" || d.directorRole === "ALTERNO"
    );
  });

  /**
   * Cargar datos de directores designados
   *
   * Flujo:
   * 1. Cargar snapshot (necesario para datos de referencia)
   * 2. GET /designation-director para obtener directores ya designados
   */
  async function loadData() {
    try {
      // 1. Cargar snapshot
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. GET /designation-director para obtener directores ya designados
      await nombramientoStore.loadDirectoresDesignados(societyId.value, flowId.value);

      console.log("[Composable][NombramientoDirectores] Datos cargados:", {
        directoresDesignados: nombramientoStore.directoresDesignados.length,
        directoresDelSnapshot: nombramientoStore.directoresDisponiblesDelSnapshot.length,
        todosLosDirectores: nombramientoStore.todosLosDirectores.length,
        titulares: nombramientoStore.directoresTitulares.length,
        suplentes: nombramientoStore.directoresSuplentes.length,
        alternos: nombramientoStore.directoresAlternos.length,
      });
    } catch (error: any) {
      console.error("[Composable][NombramientoDirectores] Error al cargar datos:", error);
      // No lanzar error, simplemente dejar datos vacíos
    }
  }

  /**
   * Limpiar formulario después de crear director
   */
  function limpiarFormulario() {
    directorRoleSeleccionado.value = null;
    tipoPersona.value = "natural";
    // ✅ Limpiar también el store que usa el modal
    personaNaturalStore.$reset();
  }

  /**
   * Crear nuevo director (POST)
   *
   * Flujo:
   * 1. Validar que haya rol seleccionado
   * 2. Validar datos del formulario
   * 3. Construir DTO de persona
   * 4. POST /designation-director
   * 5. Recargar lista de directores
   * 6. Limpiar formulario
   */
  async function guardarDirector(
    directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO",
    replacesId?: string | null
  ): Promise<void> {
    try {
      // 1. Validar que haya rol seleccionado
      if (!directorRole) {
        throw new Error("Por favor, seleccione un rol de director");
      }

      // 2. Validar y construir DTO de persona
      let person: PersonNaturalDTO | PersonJuridicDTO;

      if (tipoPersona.value === "natural") {
        // ✅ Leer datos desde personaNaturalStore (que usa el modal)
        // Validar campos requeridos
        if (
          !personaNaturalStore.tipoDocumento ||
          !personaNaturalStore.numeroDocumento ||
          !personaNaturalStore.nombre ||
          !personaNaturalStore.apellidoPaterno
        ) {
          throw new Error("Por favor, complete todos los campos requeridos");
        }

        person = {
          typeDocument: personaNaturalStore.tipoDocumento || "",
          documentNumber: personaNaturalStore.numeroDocumento || "",
          issuingCountry:
            personaNaturalStore.tipoDocumento === TipoDocumentosEnum.PASAPORTE
              ? personaNaturalStore.paisPasaporte || null
              : null,
          firstName: personaNaturalStore.nombre || "",
          lastNamePaternal: personaNaturalStore.apellidoPaterno || "",
          lastNameMaternal: personaNaturalStore.apellidoMaterno || "",
        };
      } else {
        // Validar campos requeridos
        if (
          !personaJuridica.value.tipoDocumento ||
          !personaJuridica.value.numeroDocumento ||
          !personaJuridica.value.razonSocial
        ) {
          throw new Error("Por favor, complete todos los campos requeridos");
        }

        person = {
          typeDocument: personaJuridica.value.tipoDocumento || "",
          documentNumber: personaJuridica.value.numeroDocumento || "",
          issuingCountry: personaJuridica.value.paisOrigen || null,
          businessName: personaJuridica.value.razonSocial || "",
          commercialName: personaJuridica.value.nombreComercial || "",
          address: personaJuridica.value.direccion || "",
          district: personaJuridica.value.distrito || "",
          province: personaJuridica.value.provincia || "",
          department: personaJuridica.value.departamento || "",
          countryOfOrigin: personaJuridica.value.paisOrigen || null,
          representative:
            personaJuridica.value.tieneRepresentante &&
            representanteLegal.value.nombre &&
            representanteLegal.value.apellidoPaterno
              ? {
                  typeDocument: representanteLegal.value.tipoDocumento || "",
                  documentNumber: representanteLegal.value.numeroDocumento || "",
                  issuingCountry:
                    representanteLegal.value.tipoDocumento === "PASAPORTE"
                      ? representanteLegal.value.paisPasaporte || null
                      : null,
                  firstName: representanteLegal.value.nombre || "",
                  lastNamePaternal: representanteLegal.value.apellidoPaterno || "",
                  lastNameMaternal: representanteLegal.value.apellidoMaterno || "",
                }
              : null,
        };
      }

      // 3. POST /designation-director
      await nombramientoStore.createDirector(
        societyId.value,
        flowId.value,
        directorRole,
        person,
        replacesId
      );

      console.log("[Composable][NombramientoDirectores] ✅ Director creado exitosamente");

      // 4. Limpiar formulario (no se hace automáticamente, se hace en la vista)
      // limpiarFormulario();
    } catch (error: any) {
      console.error("[Composable][NombramientoDirectores] Error al guardar director:", error);
      throw error;
    }
  }

  return {
    // Estado
    tipoPersona,
    personaNatural,
    personaJuridica,
    representanteLegal,
    isLoading,
    error,
    directoresTitulares,
    directoresSuplentesAlternos,

    // Store
    nombramientoStore,

    // Métodos
    loadData,
    guardarDirector,
    limpiarFormulario,
  };
}
