<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Pencil, Trash2, Plus } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import AportanteModal from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportanteModal.vue";

/**
 * VISTA: Aportantes para Aporte Dinerario
 * 
 * Muestra tabla de accionistas existentes + permite agregar nuevos aportantes.
 * - EXISTENTES: Solo se seleccionan con checkbox
 * - NUEVOS: Se pueden editar/eliminar
 * 
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/participants
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/participants/:id/contributor
 * - POST /api/v2/society-profile/:societyId/register-assembly/:flowId/participants
 * - DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/participants/:id
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

// ========================================
// TIPOS
// ========================================

type ContributorType = "ACCIONISTA" | "NUEVO_APORTANTE";

interface Person {
  id: string;
  tipo: "NATURAL" | "JURIDICA" | "SUCURSAL" | "FONDO_INVERSION" | "FIDEICOMISO" | "SUCESION_INDIVISA";
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  paisEmision?: string;
  razonSocial?: string;
  nombreComercial?: string;
  direccion?: string;
  [key: string]: any; // Para otros campos de otros tipos
}

interface Aportante {
  id: string;
  personId?: string;
  typeShareholder: ContributorType;
  isContributor: boolean;
  status?: boolean;
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

interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: Aportante[]; // ✅ El backend devuelve array directamente
}

// ========================================
// COMPOSABLES Y ESTADO
// ========================================

const route = useRoute();

const societyId = computed(() => route.params.societyId as string);
const flowId = computed(() => route.params.flowId as string);

const aportantes = ref<Aportante[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Modal para agregar/editar
const isModalOpen = ref(false);
const isSaving = ref(false);

// ========================================
// API HELPERS
// ========================================

const API_BASE = computed(
  () => `/api/v2/society-profile/${societyId.value}/register-assembly/${flowId.value}`
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

async function fetchAportantes() {
  isLoading.value = true;
  error.value = null;

  try {
    const baseUrl = resolveBaseUrl();
    const url = `${baseUrl}${API_BASE.value}/participants`;
    
    console.debug("[Aportantes] GET request", { url });

    const response = await $fetch<ApiResponse>(url, {
      ...withAuthHeaders(),
      method: "GET",
    });

    console.debug("[Aportantes] GET response RAW:", response);
    console.debug("[Aportantes] GET response type:", typeof response);
    console.debug("[Aportantes] GET response.data:", response.data);
    console.debug("[Aportantes] GET response.data type:", typeof response.data);
    console.debug("[Aportantes] GET response.data isArray:", Array.isArray(response.data));

    // ✅ El backend devuelve: { success: true, message: "...", code: 200, data: [...] }
    // $fetch ya parsea el JSON, así que response.data es el array directamente
    if (!response.data || !Array.isArray(response.data)) {
      console.error("[Aportantes] Response.data no es un array:", response.data);
      throw new Error("Formato de respuesta inválido del backend");
    }

    console.debug("[Aportantes] GET response", { count: response.data.length });

    // ✅ El backend ya devuelve solo los participantes (que asistieron)
    // No necesitamos filtrar por isPresent porque el endpoint ya lo hace
    aportantes.value = response.data.map((a: Aportante) => {
      // ✅ NUEVO_APORTANTE siempre debe tener isContributor: true
      if (a.typeShareholder === "NUEVO_APORTANTE") {
        return { ...a, isContributor: true };
      }
      return a;
    });
  } catch (err: any) {
    console.error("[Aportantes] Error al cargar:", err);
    console.error("[Aportantes] Error details:", {
      message: err.message,
      statusCode: err.statusCode,
      status: err.status,
      data: err.data,
      response: err.response,
    });
    error.value = err.message || err.data?.message || "Error al cargar aportantes";
  } finally {
    isLoading.value = false;
  }
}

async function toggleAportante(aportante: Aportante) {
  // ✅ NUEVO_APORTANTE siempre es contribuidor y no se puede cambiar
  if (aportante.typeShareholder === "NUEVO_APORTANTE") {
    console.debug("[Aportantes] NUEVO_APORTANTE no se puede desmarcar");
    return;
  }

  try {
    const baseUrl = resolveBaseUrl();
    // ✅ CORRECTO: PATCH /participants (sin UUID en URL, sin /contributor)
    const url = `${baseUrl}${API_BASE.value}/participants`;
    
    // ✅ CORRECTO: Body es array de UUIDs (hace toggle automático)
    const body = [aportante.id];

    console.debug("[Aportantes] Toggle", { id: aportante.id, url, body });

    await $fetch(url, {
      ...withAuthHeaders(),
      method: "PATCH", // ✅ PATCH, no PUT
      body, // ✅ Array de UUIDs, no objeto
    });

    // ✅ Recargar datos del backend después del PATCH
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

    // ✅ El backend espera: { id: string, persona: {...} }
    const generateUuid = () => {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    };

    const requestPayload = {
      id: generateUuid(),
      persona: payload.contributor, // ✅ El backend espera "persona", no "contributor"
    };

    console.debug("[Aportantes] POST nuevo", { requestPayload });

    await $fetch(url, {
      ...withAuthHeaders(),
      method: "POST",
      body: requestPayload,
    });

    // Cerrar modal y recargar
    isModalOpen.value = false;
    await fetchAportantes();
  } catch (err: any) {
    console.error("[Aportantes] Error al agregar:", err);
    error.value = err.message || "Error al agregar aportante";
  }
}

async function eliminarAportante(id: string) {
  if (!confirm("¿Estás seguro de eliminar este aportante?")) return;

  try {
    const baseUrl = resolveBaseUrl();
    // ✅ CORRECTO: DELETE /participants (sin UUID en URL)
    const url = `${baseUrl}${API_BASE.value}/participants`;
    
    // ✅ CORRECTO: Body es array de UUIDs
    const body = [id];

    console.debug("[Aportantes] DELETE participante", { id, url, body });

    await $fetch(url, {
      ...withAuthHeaders(),
      method: "DELETE",
      body, // ✅ Array de UUIDs en el body
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

function getNombre(aportante: Aportante): string {
  const person = aportante.person;
  
  if (person.tipo === "NATURAL") {
    return `${person.nombre || ""} ${person.apellidoPaterno || ""} ${person.apellidoMaterno || ""}`.trim();
  }
  
  if (person.tipo === "JURIDICA" || person.tipo === "SUCURSAL" || person.tipo === "SUCESION_INDIVISA" || person.tipo === "FIDEICOMISO" || person.tipo === "FONDO_INVERSION") {
    return person.razonSocial || person.nombreComercial || "Sin nombre";
  }

  return "Sin nombre";
}

function getTotalAcciones(aportante: Aportante): number {
  if (!aportante.allocationShare || aportante.allocationShare.length === 0) {
    return 0;
  }

  return aportante.allocationShare.reduce(
    (total, allocation) => total + (allocation.subscribedSharesQuantity || 0),
    0
  );
}

function getParticipacion(aportante: Aportante): string {
  // Calcular % basado en el total de acciones de todos los aportantes
  const totalGeneral = aportantes.value.reduce(
    (sum, a) => sum + getTotalAcciones(a),
    0
  );

  const accionesAportante = getTotalAcciones(aportante);

  if (totalGeneral === 0) return "0.00";

  const porcentaje = (accionesAportante / totalGeneral) * 100;
  return porcentaje.toFixed(2);
}

function getTipoBadgeClass(type: ContributorType): string {
  return type === "ACCIONISTA"
    ? "bg-primary-100 text-primary-700 border-primary-300"
    : "bg-purple-100 text-purple-700 border-purple-300";
}

// ========================================
// NAVEGACIÓN
// ========================================

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  console.log("🎯 [Aportantes] Handler de Siguiente ejecutado");
  
  // Validar que haya al menos un aportante seleccionado
  const aportantesSeleccionados = aportantes.value.filter((a) => a.isContributor);
  
  if (aportantesSeleccionados.length === 0) {
    const error = new Error("Debe seleccionar al menos un aportante para continuar");
    console.error("❌ [Aportantes] Error de validación:", error.message);
    throw error;
  }
  
  console.log("✅ [Aportantes] Validación exitosa:", aportantesSeleccionados.length, "aportantes seleccionados");
  // No es necesario guardar nada aquí, los datos ya están en el backend
});

// ========================================
// LIFECYCLE
// ========================================

onMounted(async () => {
  await fetchAportantes();
});
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Selección de Aportantes</h2>
        <p class="mt-1 text-sm text-gray-600">
          Selecciona quiénes participarán en el aumento de capital por aporte dinerario
        </p>
      </div>

      <Button @click="isModalOpen = true" size="default" variant="primary">
        <Plus class="mr-2 h-4 w-4" />
        Agregar Aportante
      </Button>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600"
    >
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-600">Cargando aportantes...</p>
      </div>
    </div>

    <!-- Tabla -->
    <div v-else class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-12 px-6 py-3"></th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Nombre Apellido / Razón Social
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Tipo de Aportante
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              N.º de acciones
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              % Participación
            </th>
            <th class="w-16 px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="aportante in aportantes"
            :key="aportante.id"
            :class="[
              'transition-colors',
              aportante.isContributor ? 'bg-primary-50/40' : 'hover:bg-gray-50',
            ]"
          >
            <!-- Checkbox -->
            <td class="px-6 py-4">
              <Checkbox
                :model-value="aportante.isContributor"
                :disabled="aportante.typeShareholder === 'NUEVO_APORTANTE'"
                @update:model-value="(value: boolean | 'indeterminate') => {
                  // Solo permitir toggle si NO es NUEVO_APORTANTE
                  if (aportante.typeShareholder !== 'NUEVO_APORTANTE' && typeof value === 'boolean') {
                    aportante.isContributor = value;
                    toggleAportante(aportante);
                  } else {
                    // Forzar a true si es NUEVO_APORTANTE (no debería llegar aquí por disabled)
                    aportante.isContributor = true;
                  }
                }"
              />
            </td>

            <!-- Nombre / Razón Social -->
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ getNombre(aportante) }}
              </div>
              <div class="text-xs text-gray-500">
                {{ aportante.person.tipoDocumento || "RUC" }}:
                {{ aportante.person.numeroDocumento }}
              </div>
            </td>

            <!-- Tipo de Aportante -->
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
                  getTipoBadgeClass(aportante.typeShareholder),
                ]"
              >
                {{ aportante.typeShareholder === 'NUEVO_APORTANTE' ? 'NUEVO APORTANTE' : 'ACCIONISTA' }}
              </span>
            </td>

            <!-- N.º de acciones -->
            <td class="px-6 py-4 text-right text-sm text-gray-900">
              {{ getTotalAcciones(aportante).toLocaleString() }}
            </td>

            <!-- % Participación -->
            <td class="px-6 py-4 text-right text-sm text-gray-900">
              {{ getParticipacion(aportante) }}%
            </td>

            <!-- Acciones (solo para NUEVOS) -->
            <td class="px-6 py-4">
              <DropdownMenu v-if="aportante.typeShareholder === 'NUEVO_APORTANTE'">
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                    <span class="sr-only">Abrir menú</span>
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="() => {}">
                    <Pencil class="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="text-red-600"
                    @click="eliminarAportante(aportante.id)"
                  >
                    <Trash2 class="mr-2 h-4 w-4" />
                    Borrar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="aportantes.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="text-sm text-gray-500">
                No hay aportantes disponibles. Agrega el primer aportante para comenzar.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Resumen -->
    <div class="rounded-lg border border-primary-200 bg-primary-50/30 p-4">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          <span class="font-medium">Total de aportantes seleccionados:</span>
          <span class="ml-2 font-bold text-primary-700">
            {{ aportantes.filter((a) => a.isContributor).length }}
          </span>
        </div>
        <div class="text-sm text-gray-700">
          <span class="font-medium">Total de acciones:</span>
          <span class="ml-2 font-bold text-primary-700">
            {{ aportantes.reduce((sum, a) => sum + getTotalAcciones(a), 0).toLocaleString() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal: Agregar Nuevo Aportante -->
    <AportanteModal
      v-model="isModalOpen"
      mode="create"
      :is-saving="isSaving"
      @submit="agregarNuevoAportante"
      @close="isModalOpen = false"
    />
  </div>
</template>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
