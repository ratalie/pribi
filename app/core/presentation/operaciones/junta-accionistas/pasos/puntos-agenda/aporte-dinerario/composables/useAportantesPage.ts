import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

// ========================================
// TIPOS
// ========================================

export type ContributorType = "ACCIONISTA" | "NUEVO_APORTANTE";

/**
 * Permiso de contributor por módulo
 * ✅ Nuevo formato: Permite diferentes permisos por módulo (CASH, CREDIT, etc.)
 */
export interface ContributorPermission {
  id: string;
  shareholderId: string;
  module: "CASH" | "CREDIT" | "NON_CASH" | "ACCOUNTING";
  isContributor: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Person {
  id: string;
  tipo:
    | "NATURAL"
    | "JURIDICA"
    | "SUCURSAL"
    | "FONDO_INVERSION"
    | "FIDEICOMISO"
    | "SUCESION_INDIVISA";
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  paisEmision?: string;
  razonSocial?: string;
  nombreComercial?: string;
  direccion?: string;
  [key: string]: any;
}

export interface Aportante {
  id: string;
  personId?: string;
  typeShareholder: ContributorType | "NUEVO_APORTANTE_CASH" | "NUEVO_APORTANTE_CREDIT";
  isContributor: boolean; // ✅ MANTENER (compatibilidad con backend antiguo)
  status?: boolean;
  contributionModule?: ("CASH" | "CREDIT")[]; // ✅ Siempre array según backend
  contributorPermissions?: ContributorPermission[]; // ✅ NUEVO (opcional, formato nuevo)
  person: Person;
  allocationShare?: Array<{
    id: string;
    action: {
      id: string;
      name: string;
      type: string;
    };
    subscribedSharesQuantity: number;
    percentagePaidPerShare: number;
  }>;
}

// ========================================
// HELPERS - ContributorPermission
// ========================================

/**
 * Obtiene isContributor para un módulo específico
 * ✅ Compatible con ambos formatos (isContributor booleano o contributorPermissions)
 *
 * @param participante - Participante con o sin contributorPermissions
 * @param module - Módulo a verificar ("CASH" | "CREDIT")
 * @returns true si es contributor en el módulo especificado
 */
export function getIsContributorForModule(
  participante: Aportante,
  module: "CASH" | "CREDIT"
): boolean {
  // ✅ 0. Para NUEVO_APORTANTE: inferir módulo desde typeShareholder
  // Si es NUEVO_APORTANTE_CASH y se pregunta por CASH → usar isContributor
  // Si es NUEVO_APORTANTE_CREDIT y se pregunta por CREDIT → usar isContributor
  if (participante.typeShareholder === "NUEVO_APORTANTE_CASH" && module === "CASH") {
    return participante.isContributor === true;
  }
  if (participante.typeShareholder === "NUEVO_APORTANTE_CREDIT" && module === "CREDIT") {
    return participante.isContributor === true;
  }

  // ✅ 1. Si tiene contributorPermissions, buscar permiso específico del módulo
  if (participante.contributorPermissions && participante.contributorPermissions.length > 0) {
    const permission = participante.contributorPermissions.find((p) => p.module === module);

    // Si encontró el permiso específico, usar ese valor
    if (permission !== undefined) {
      return permission.isContributor;
    }

    // ✅ 2. Si NO encontró permiso específico, pero el módulo está en contributionModule
    // y isContributor es true, entonces es contributor para ese módulo
    const modules = Array.isArray(participante.contributionModule)
      ? participante.contributionModule
      : participante.contributionModule
      ? [participante.contributionModule]
      : [];

    const tieneModulo = modules.includes(module) || modules.includes("BOTH");

    if (tieneModulo && participante.isContributor === true) {
      return true;
    }

    // Si no tiene el módulo o isContributor es false, no es contributor
    return false;
  }

  // ✅ 3. Si NO tiene contributorPermissions, usar isContributor (formato antiguo, compatibilidad)
  // Pero verificar que el módulo esté en contributionModule O inferir desde typeShareholder
  const modules = Array.isArray(participante.contributionModule)
    ? participante.contributionModule
    : participante.contributionModule
    ? [participante.contributionModule]
    : [];

  // Si contributionModule está vacío, inferir desde typeShareholder
  if (modules.length === 0) {
    if (participante.typeShareholder === "NUEVO_APORTANTE_CASH" && module === "CASH") {
      return participante.isContributor === true;
    }
    if (participante.typeShareholder === "NUEVO_APORTANTE_CREDIT" && module === "CREDIT") {
      return participante.isContributor === true;
    }
    // Si no coincide el módulo con typeShareholder, no es contributor
    return false;
  }

  const tieneModulo = modules.includes(module) || modules.includes("BOTH");

  return participante.isContributor === true && tieneModulo;
}

/**
 * Obtiene todos los permisos de contributor
 * Útil para debugging o mostrar información detallada
 */
export function getAllContributorPermissions(
  participante: Aportante
): ContributorPermission[] {
  return participante.contributorPermissions || [];
}

/**
 * Composable para la página de Aportantes
 * Centraliza toda la lógica de negocio, carga de datos y manejo de modales
 */
export function useAportantesPage() {
  const route = useRoute();
  const asistenciaStore = useAsistenciaStore();

  const societyId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);

  const aportantes = ref<Aportante[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Modal para agregar/editar
  const isModalOpen = ref(false);
  const isSaving = ref(false);

  interface ApiResponse {
    success: boolean;
    message: string;
    code: number;
    data: Aportante[];
  }

  // ========================================
  // API HELPERS
  // ========================================

  const API_BASE = computed(
    () =>
      `/api/v2/society-profile/${societyId.value}/register-assembly/${flowId.value}/cash-contribution`
  );

  function resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        return new URL(base, origin || "http://localhost:3000").origin;
      } catch {
        continue;
      }
    }
    return "";
  }

  // ========================================
  // FUNCIONES DE CARGA
  // ========================================

  async function fetchAportantes() {
    isLoading.value = true;
    error.value = null;

    try {
      // ✅ 1. Cargar asistencias si no están cargadas
      if (asistenciaStore.asistencias.length === 0) {
        await asistenciaStore.loadAsistencias(Number(societyId.value), Number(flowId.value));
      }

      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      console.debug("[Aportantes] GET request", { url });

      const response = await $fetch<ApiResponse>(url, {
        ...withAuthHeaders(),
        method: "GET",
      });

      console.debug("[Aportantes] GET response", { count: response.data.length });

      // ✅ Helper: Verificar si es participante de Aporte Dinerario
      // contributionModule SIEMPRE viene como array string[] según el backend
      const isAporteDinerarioParticipant = (a: Aportante): boolean => {
        // Si es NUEVO_APORTANTE_CASH, siempre es de aporte dinerario
        if (a.typeShareholder === "NUEVO_APORTANTE_CASH") return true;

        // Si es ACCIONISTA, verificar contributionModule (siempre es array)
        const modules = Array.isArray(a.contributionModule)
          ? a.contributionModule
          : a.contributionModule
          ? [a.contributionModule]
          : [];

        return modules.includes("CASH") || modules.includes("BOTH");
      };

      // ✅ 2. Filtrar por contributionModule (solo CASH o BOTH)
      const participantesAporteDinerario = response.data.filter(isAporteDinerarioParticipant);

      console.debug(
        "[Aportantes] Filtrados por módulo (CASH/BOTH):",
        participantesAporteDinerario.length
      );

      // ✅ 3. Filtrar por asistencia
      // Para ACCIONISTA: verificar en asistencias por personId
      // Para NUEVO_APORTANTE_CASH: siempre incluir (no está en snapshot, es nuevo)
      const participantesFiltrados = participantesAporteDinerario.filter(
        (participante: Aportante) => {
          // Si es NUEVO_APORTANTE_CASH, siempre incluirlo (no tiene asistencia registrada)
          if (
            participante.typeShareholder === "NUEVO_APORTANTE" ||
            participante.typeShareholder === "NUEVO_APORTANTE_CASH"
          ) {
            console.debug(
              "[Aportantes] NUEVO_APORTANTE_CASH incluido:",
              participante.person?.id
            );
            return true;
          }

          // Si es ACCIONISTA, verificar si asistió
          // ✅ personId viene de person.id (no viene en nivel raíz)
          const personId = participante.person?.id;
          if (!personId) {
            console.warn("[Aportantes] Participante sin personId:", participante);
            return false;
          }

          // ✅ Buscar en asistencias: comparar person.id del participante con accionista.person.id de la asistencia
          const asistencia = asistenciaStore.asistencias.find(
            (a) => a.accionista.person?.id === personId || a.accionista.id === personId
          );

          if (!asistencia) {
            console.debug(
              "[Aportantes] No se encontró asistencia para personId:",
              personId,
              "Participante:",
              participante.person?.nombre || participante.person?.razonSocial
            );
            console.debug(
              "[Aportantes] Asistencias disponibles:",
              asistenciaStore.asistencias.length
            );
            if (asistenciaStore.asistencias.length > 0) {
              console.debug(
                "[Aportantes] Primeras asistencias:",
                asistenciaStore.asistencias.slice(0, 2).map((a) => ({
                  accionistaId: a.accionista.id,
                  personId: a.accionista.person?.id,
                  asistio: a.asistio,
                }))
              );
            }
            return false;
          }

          const resultado = asistencia.asistio === true;
          console.debug(
            "[Aportantes] Asistencia encontrada:",
            personId,
            "asistio:",
            asistencia.asistio,
            "→",
            resultado ? "INCLUIDO" : "EXCLUIDO"
          );
          return resultado;
        }
      );

      console.debug("[Aportantes] Filtrados por asistencia:", participantesFiltrados.length);

      // ✅ 4. Mapear participantes, asegurar que NUEVO_APORTANTE_CASH siempre tenga isContributor: true
      // ✅ Asegurar que personId esté disponible desde person.id
      aportantes.value = participantesFiltrados.map((a: Aportante) => {
        // ✅ Extraer personId desde person.id si no existe
        const mapped = {
          ...a,
          personId: a.personId || a.person?.id,
        };

        // ✅ NUEVO_APORTANTE_CASH siempre es contribuyente
        if (mapped.typeShareholder === "NUEVO_APORTANTE_CASH") {
          const nuevoMapped = { ...mapped, isContributor: true };
          console.debug(
            "[Aportantes] NUEVO_APORTANTE_CASH forzado a isContributor: true",
            nuevoMapped.person?.nombre || nuevoMapped.person?.razonSocial,
            {
              typeShareholder: nuevoMapped.typeShareholder,
              isContributor: nuevoMapped.isContributor,
              contributionModule: nuevoMapped.contributionModule,
              contributorPermissions: nuevoMapped.contributorPermissions,
              checkboxCASH: getIsContributorForModule(nuevoMapped, "CASH"),
            }
          );
          return nuevoMapped;
        }

        // ✅ Debug: Verificar estado del checkbox para CASH
        const isContributorCASH = getIsContributorForModule(mapped, "CASH");
        console.debug(
          "[Aportantes] Estado checkbox CASH:",
          mapped.person?.nombre || mapped.person?.razonSocial,
          {
            typeShareholder: mapped.typeShareholder,
            isContributor: mapped.isContributor,
            contributionModule: mapped.contributionModule,
            contributorPermissions: mapped.contributorPermissions,
            isContributorCASH,
          }
        );

        return mapped;
      });
    } catch (err: any) {
      console.error("[Aportantes] Error al cargar:", err);
      error.value = err.message || err.data?.message || "Error al cargar aportantes";
    } finally {
      isLoading.value = false;
    }
  }

  // ========================================
  // FUNCIONES DE ACCIÓN
  // ========================================

  async function toggleAportante(aportante: Aportante) {
    // NUEVO_APORTANTE siempre es contribuidor y no se puede cambiar
    if (
      aportante.typeShareholder === "NUEVO_APORTANTE" ||
      aportante.typeShareholder === "NUEVO_APORTANTE_CASH"
    ) {
      console.debug("[Aportantes] NUEVO_APORTANTE no se puede desmarcar");
      return;
    }

    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      // Body es array de UUIDs (hace toggle automático)
      const body = [aportante.id];

      console.debug("[Aportantes] Toggle", { id: aportante.id, url, body });

      await $fetch(url, {
        ...withAuthHeaders(),
        method: "PATCH",
        body,
      });

      // Recargar datos del backend después del PATCH
      await fetchAportantes();
    } catch (err: any) {
      console.error("[Aportantes] Error al toggle:", err);
      error.value = err.message || "Error al actualizar aportante";
    }
  }

  async function agregarNuevoAportante(payload: { contributor: any }) {
    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      // El backend espera: { id: string, persona: {...} }
      const generateUuid = () => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          return crypto.randomUUID();
        }
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
      };

      const requestPayload = {
        id: generateUuid(),
        persona: payload.contributor, // El backend espera "persona", no "contributor"
      };

      console.debug("[Aportantes] POST nuevo", { requestPayload });

      const response = await $fetch(url, {
        ...withAuthHeaders(),
        method: "POST",
        body: requestPayload,
      });

      console.debug("[Aportantes] POST response", { response });

      // Cerrar modal y recargar
      isModalOpen.value = false;
      await fetchAportantes();

      console.debug("[Aportantes] Datos recargados después de crear:", {
        total: aportantes.value.length,
        nuevoParticipante: aportantes.value.find(
          (a) => a.person?.id === requestPayload.persona?.id
        ),
      });
    } catch (err: any) {
      console.error("[Aportantes] Error al agregar:", err);
      error.value = err.message || "Error al agregar aportante";
    }
  }

  async function eliminarAportante(id: string) {
    if (!confirm("¿Estás seguro de eliminar este aportante?")) return;

    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      // Body es array de UUIDs
      const body = [id];

      console.debug("[Aportantes] DELETE participante", { id, url, body });

      await $fetch(url, {
        ...withAuthHeaders(),
        method: "DELETE",
        body,
      });

      // Recargar lista
      await fetchAportantes();
    } catch (err: any) {
      console.error("[Aportantes] Error al eliminar:", err);
      error.value = err.message || err.data?.message || "Error al eliminar aportante";
    }
  }

  // ========================================
  // COMPUTED - FORMATEO DE DATOS
  // ========================================

  function getTotalAcciones(aportante: Aportante): number {
    if (!aportante.allocationShare || aportante.allocationShare.length === 0) {
      return 0;
    }

    return aportante.allocationShare.reduce(
      (total, allocation) => total + (allocation.subscribedSharesQuantity || 0),
      0
    );
  }

  const totalSeleccionados = computed(() => {
    return aportantes.value.filter((a) => getIsContributorForModule(a, "CASH")).length;
  });

  const totalAcciones = computed(() => {
    return aportantes.value.reduce((sum, a) => sum + getTotalAcciones(a), 0);
  });

  // ========================================
  // NAVEGACIÓN
  // ========================================

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    console.log("🎯 [Aportantes] Handler de Siguiente ejecutado");

    // Validar que haya al menos un aportante seleccionado
    const aportantesSeleccionados = aportantes.value.filter((a) =>
      getIsContributorForModule(a, "CASH")
    );

    if (aportantesSeleccionados.length === 0) {
      const error = new Error("Debe seleccionar al menos un aportante para continuar");
      console.error("❌ [Aportantes] Error de validación:", error.message);
      throw error;
    }

    console.log(
      "✅ [Aportantes] Validación exitosa:",
      aportantesSeleccionados.length,
      "aportantes seleccionados"
    );
  });

  // ========================================
  // LIFECYCLE
  // ========================================

  onMounted(async () => {
    // ✅ Cargar asistencias primero
    try {
      await asistenciaStore.loadAsistencias(Number(societyId.value), Number(flowId.value));
    } catch (err) {
      console.error("[Aportantes] Error al cargar asistencias:", err);
    }

    // Luego cargar participantes (que ya filtrará por asistencia)
    await fetchAportantes();
  });

  return {
    // Estado
    aportantes,
    isLoading,
    error,
    totalSeleccionados,
    totalAcciones,
    // Modal
    isModalOpen,
    isSaving,
    // Funciones
    toggleAportante,
    agregarNuevoAportante,
    eliminarAportante,
    fetchAportantes,
  };
}
