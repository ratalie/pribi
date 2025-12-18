import { computed, onActivated, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import type {
  PersonJuridicDTO,
  PersonNaturalDTO,
} from "~/core/hexag/juntas/application/dtos/designation-attorney.dto";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import type { ApoderadoRow } from "~/core/presentation/registros/sociedades/pasos/apoderados/types/types";
import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import { useNombramientoApoderadosStore } from "../stores/useNombramientoApoderadosStore";

/**
 * Composable para la página de Nombramiento de Apoderados
 *
 * Responsabilidades:
 * - Cargar datos de apoderados designados
 * - Manejar formulario de persona natural/jurídica (REUTILIZAR de gerente)
 * - Gestionar selección de clase de apoderado
 * - Crear nuevos apoderados cuando se hace clic en "Agregar" (POST)
 * - Listar apoderados disponibles (del snapshot filtrados)
 */
export function useNombramientoApoderadosPage() {
  const route = useRoute();
  const nombramientoStore = useNombramientoApoderadosStore();
  const snapshotStore = useSnapshotStore();
  const personaNaturalStore = usePersonaNaturalStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estado del formulario
  const claseApoderadoSeleccionada = ref<string | null>(null); // ID de la clase
  const tipoPersona = ref<"natural" | "juridica">("natural");
  const isLoading = computed(() => nombramientoStore.status === "loading");
  const error = computed(() => nombramientoStore.errorMessage);

  // Datos del formulario - Persona Natural (REUTILIZAR de gerente)
  const personaNatural = ref({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
  });

  // Datos del formulario - Persona Jurídica (REUTILIZAR de gerente)
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

  // Representante legal (para persona jurídica) (REUTILIZAR de gerente)
  const representanteLegal = ref({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
  });

  /**
   * Obtener opciones de clases de apoderados para el select
   */
  const clasesApoderadosOptions = computed(() => {
    const clases = nombramientoStore.clasesApoderadosDisponibles;
    return clases.map((clase) => ({
      id: clase.id,
      label: clase.name,
      value: clase.id,
    }));
  });

  /**
   * Apoderados disponibles desde snapshot (filtrados)
   */
  const apoderadosDisponibles = computed(() => {
    return nombramientoStore.apoderadosDisponibles;
  });

  /**
   * Apoderados ya designados en esta junta
   */
  const apoderadosDesignados = computed(() => {
    return nombramientoStore.apoderadosDesignados;
  });

  /**
   * Mapear apoderados designados a formato ApoderadoRow para los componentes de tabla
   * Usar ref reactivo (no computed) para que las modificaciones a checked sean reactivas
   */
  const apoderadosMapeados = ref<ApoderadoRow[]>([]);

  /**
   * Función para actualizar apoderados mapeados desde apoderados designados
   */
  function actualizarApoderadosMapeados() {
    const snapshot = snapshotStore.snapshot;
    if (!snapshot || !snapshot.attorneyClasses) {
      apoderadosMapeados.value = [];
      return;
    }

    // Crear mapa de clases por ID para obtener nombres
    const clasesMap = new Map(snapshot.attorneyClasses.map((clase) => [clase.id, clase.name]));

    // Mapear apoderados designados
    const mapeados = apoderadosDesignados.value.map((apoderado) => {
      const nombreClase = clasesMap.get(apoderado.attorneyClassId) || "Sin clase";

      // Obtener datos de la persona
      let nombre = "";
      let tipoDocumento = TipoDocumentosEnum.DNI;
      let numeroDocumento = "";

      if (apoderado.person.type === "NATURAL" && apoderado.person.natural) {
        const natural = apoderado.person.natural;
        nombre = `${natural.firstName} ${natural.lastNamePaternal} ${
          natural.lastNameMaternal || ""
        }`.trim();
        tipoDocumento = natural.typeDocument as TipoDocumentosEnum;
        numeroDocumento = natural.documentNumber;
      } else if (apoderado.person.type === "JURIDIC" && apoderado.person.juridic) {
        const juridic = apoderado.person.juridic;
        nombre = juridic.businessName;
        tipoDocumento = juridic.typeDocument as TipoDocumentosEnum;
        numeroDocumento = juridic.documentNumber;
      }

      // Mantener el estado checked existente si el apoderado ya existe, sino usar isCandidate
      const apoderadoExistente = apoderadosMapeados.value.find((a) => a.id === apoderado.id);
      const checked = apoderadoExistente?.checked ?? (apoderado.isCandidate || false);

      return {
        id: apoderado.id, // ✅ ID del registro de designación
        checked,
        claseApoderadoNombre: nombreClase,
        nombre,
        tipoDocumento,
        numeroDocumento,
      };
    });

    apoderadosMapeados.value = mapeados;
  }

  // Watch para actualizar apoderados mapeados cuando cambian los designados
  watch(
    () => apoderadosDesignados.value,
    () => {
      actualizarApoderadosMapeados();
    },
    { immediate: true, deep: true }
  );

  /**
   * Apoderados normales (excluye "Otros Apoderados")
   */
  const apoderadosNormales = computed<ApoderadoRow[]>(() => {
    return apoderadosMapeados.value.filter(
      (apod) => apod.claseApoderadoNombre !== "Otros Apoderados"
    );
  });

  /**
   * Solo "Otros Apoderados"
   */
  const otrosApoderados = computed<ApoderadoRow[]>(() => {
    return apoderadosMapeados.value.filter(
      (apod) => apod.claseApoderadoNombre === "Otros Apoderados"
    );
  });

  /**
   * Cargar datos de apoderados designados
   *
   * Flujo:
   * 1. Cargar snapshot (necesario para obtener clases y filtrar removidos)
   * 2. GET /designation-attorney para obtener apoderados ya designados
   */
  async function loadData() {
    try {
      // 1. Cargar snapshot (necesario para obtener clases y filtrar removidos)
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. GET /designation-attorney para obtener apoderados ya designados
      await nombramientoStore.loadApoderadosDesignados(societyId.value, flowId.value);

      console.log("[Composable][NombramientoApoderados] Datos cargados:", {
        apoderadosDesignados: nombramientoStore.apoderadosDesignados.length,
        clasesDisponibles: nombramientoStore.clasesApoderadosDisponibles.length,
        apoderadosDisponibles: nombramientoStore.apoderadosDisponibles.length,
      });
    } catch (error: any) {
      console.error("[Composable][NombramientoApoderados] Error al cargar datos:", error);
      // No lanzar error, simplemente dejar datos vacíos
    }
  }

  /**
   * Limpiar formulario después de crear apoderado
   */
  function limpiarFormulario() {
    claseApoderadoSeleccionada.value = null;
    tipoPersona.value = "natural";
    // ✅ Limpiar también el store que usa el modal
    personaNaturalStore.$reset();
  }

  /**
   * Crear nuevo apoderado (POST)
   *
   * Flujo:
   * 1. Validar que haya clase seleccionada
   * 2. Validar datos del formulario
   * 3. Construir DTO de persona
   * 4. POST /designation-attorney
   * 5. Recargar lista de apoderados
   * 6. Limpiar formulario
   */
  async function guardarApoderado(): Promise<void> {
    try {
      // 1. Validar que haya clase seleccionada
      if (!claseApoderadoSeleccionada.value) {
        throw new Error("Por favor, seleccione una clase de apoderado");
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

        // ⚠️ NO incluir campos de cónyuge (no aplica para apoderados/gerentes/directores)
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

        // ⚠️ NO incluir campos de cónyuge (no aplica para apoderados/gerentes/directores)
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
                  // ⚠️ NO incluir campos de cónyuge en representante
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

      // 3. POST /designation-attorney
      console.log(
        "[Composable][NombramientoApoderados] Creando apoderado con clase:",
        claseApoderadoSeleccionada.value
      );
      await nombramientoStore.createApoderado(
        societyId.value,
        flowId.value,
        claseApoderadoSeleccionada.value,
        person
      );

      // 4. Limpiar formulario después de crear
      limpiarFormulario();

      console.log("[Composable][NombramientoApoderados] ✅ Apoderado creado exitosamente");
    } catch (error: any) {
      console.error("[Composable][NombramientoApoderados] Error al guardar apoderado:", error);
      throw error;
    }
  }

  // Watch automático para PUT cuando cambia checkbox
  const previousCheckedState = ref<Map<string, boolean>>(new Map());
  const isInitializing = ref(false);

  // Watch para detectar cambios en checkboxes y hacer PUT
  watch(
    () => apoderadosMapeados.value,
    (newApoderados) => {
      if (isInitializing.value) return;
      if (!societyId.value || !flowId.value) return;

      newApoderados.forEach((apoderado) => {
        const previousChecked = previousCheckedState.value.get(apoderado.id);
        if (previousChecked !== undefined && previousChecked !== apoderado.checked) {
          console.log(
            `[Composable][NombramientoApoderados] Checkbox cambió para apoderado ${apoderado.id}: ${previousChecked} -> ${apoderado.checked}`
          );
          // ✅ PUT automático cuando cambia el checkbox
          const estado = apoderado.checked ? "CANDIDATO" : "DESMARCAR";
          nombramientoStore
            .actualizarEstado(societyId.value, flowId.value, apoderado.id, estado)
            .catch((error) => {
              console.error(
                `[Composable][NombramientoApoderados] Error al actualizar apoderado ${apoderado.id}:`,
                error
              );
              // Revertir el cambio si falla
              apoderado.checked = previousChecked;
            });
        }
        const checkedValue = apoderado.checked !== undefined ? apoderado.checked : false;
        previousCheckedState.value.set(apoderado.id, checkedValue);
      });
    },
    { deep: true }
  );

  // Inicializar estado anterior después de cargar datos
  watch(
    () => apoderadosMapeados.value.length,
    () => {
      if (apoderadosMapeados.value.length > 0 && previousCheckedState.value.size === 0) {
        isInitializing.value = true;
        apoderadosMapeados.value.forEach((a) => {
          const checkedValue = a.checked !== undefined ? a.checked : false;
          previousCheckedState.value.set(a.id, checkedValue);
        });
        // Pequeño delay para que el mapeo se complete
        setTimeout(() => {
          isInitializing.value = false;
        }, 100);
      }
    }
  );

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  // Recargar al activar (si cambia de ruta y vuelve)
  onActivated(() => {
    if (!snapshotStore.snapshot) {
      loadData();
    }
  });

  return {
    // Estado
    claseApoderadoSeleccionada,
    tipoPersona,
    personaNatural,
    personaJuridica,
    representanteLegal,
    isLoading,
    error,
    clasesApoderadosOptions,
    apoderadosDisponibles,
    apoderadosDesignados,

    // ✅ NUEVO: Apoderados mapeados para componentes
    apoderadosNormales,
    otrosApoderados,

    // Métodos
    loadData,
    guardarApoderado,
    limpiarFormulario,
  };
}
