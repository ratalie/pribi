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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

/**
 * VISTA: Aportantes para Aporte Dinerario
 * 
 * Muestra tabla de accionistas existentes + permite agregar nuevos aportantes.
 * - EXISTENTES: Solo se seleccionan con checkbox
 * - NUEVOS: Se pueden editar/eliminar
 * 
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/assembly/:flowId/participants
 * - PUT /api/v2/society-profile/:societyId/assembly/:flowId/participants/:id/contributor
 * - POST /api/v2/society-profile/:societyId/assembly/:flowId/participants
 * - DELETE /api/v2/society-profile/:societyId/assembly/:flowId/participants/:id
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

// ========================================
// TIPOS
// ========================================

type PersonType = "NATURAL" | "JURIDICA" | "SUCURSAL" | "FONDO_INVERSION" | "FIDEICOMISO" | "SUCESION_INDIVISA";
type ContributorType = "ACCIONISTA" | "NUEVO_APORTANTE";

interface PersonaNatural {
  type: "NATURAL";
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  typeDocument: string;
  documentNumber: string;
}

interface PersonaJuridica {
  type: "JURIDICA";
  ruc: string;
  legalName: string;
  commercialName?: string;
  address: string;
}

interface AllocationShare {
  id: string;
  action: {
    id: string;
    name: string;
    type: string;
  };
  subscribedSharesQuantity: number;
  percentagePaidPerShare: number;
}

interface Aportante {
  id: string;
  contributorType: ContributorType;
  isContributor: boolean;
  isPresent: boolean;
  contributor: PersonaNatural | PersonaJuridica | any;
  allocationShare: AllocationShare[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    contributors: Aportante[];
  };
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
const isEditMode = ref(false);
const editingId = ref<string | null>(null);
const formData = ref({
  type: "NATURAL" as PersonType,
  // Persona Natural
  firstName: "",
  lastNamePaternal: "",
  lastNameMaternal: "",
  typeDocument: "DNI",
  documentNumber: "",
  // Persona Jurídica
  ruc: "",
  legalName: "",
  commercialName: "",
  address: "",
});

// ========================================
// API HELPERS
// ========================================

const API_BASE = computed(
  () => `/api/v2/society-profile/${societyId.value}/assembly/${flowId.value}`
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

    console.debug("[Aportantes] GET response", { count: response.data.contributors.length });

    aportantes.value = response.data.contributors;
  } catch (err: any) {
    console.error("[Aportantes] Error al cargar:", err);
    error.value = "Error al cargar aportantes";
  } finally {
    isLoading.value = false;
  }
}

async function toggleAportante(aportante: Aportante) {
  try {
    const baseUrl = resolveBaseUrl();
    const url = `${baseUrl}${API_BASE.value}/participants/${aportante.id}/contributor`;
    
    const newValue = !aportante.isContributor;

    console.debug("[Aportantes] Toggle", { id: aportante.id, newValue });

    await $fetch(url, {
      ...withAuthHeaders(),
      method: "PUT",
      body: { isContributor: newValue },
    });

    // Actualizar localmente
    aportante.isContributor = newValue;
  } catch (err: any) {
    console.error("[Aportantes] Error al toggle:", err);
    error.value = "Error al actualizar aportante";
  }
}

async function agregarNuevoAportante() {
  try {
    const baseUrl = resolveBaseUrl();
    const url = `${baseUrl}${API_BASE.value}/participants`;

    const contributorData =
      formData.value.type === "NATURAL"
        ? {
            type: "NATURAL",
            typeDocument: formData.value.typeDocument,
            documentNumber: formData.value.documentNumber,
            firstName: formData.value.firstName,
            lastNamePaternal: formData.value.lastNamePaternal,
            lastNameMaternal: formData.value.lastNameMaternal,
          }
        : {
            type: "JURIDICA",
            ruc: formData.value.ruc,
            legalName: formData.value.legalName,
            commercialName: formData.value.commercialName,
            address: formData.value.address,
          };

    const payload = {
      contributors: [
        {
          contributorType: "NUEVO_APORTANTE",
          isContributor: true,
          contributor: contributorData,
        },
      ],
    };

    console.debug("[Aportantes] POST nuevo", { payload });

    await $fetch(url, {
      ...withAuthHeaders(),
      method: "POST",
      body: payload,
    });

    // Cerrar modal y recargar
    isModalOpen.value = false;
    resetForm();
    await fetchAportantes();
  } catch (err: any) {
    console.error("[Aportantes] Error al agregar:", err);
    error.value = "Error al agregar aportante";
  }
}

async function eliminarAportante(id: string) {
  if (!confirm("¿Estás seguro de eliminar este aportante?")) return;

  try {
    const baseUrl = resolveBaseUrl();
    const url = `${baseUrl}${API_BASE.value}/participants/${id}`;

    console.debug("[Aportantes] DELETE", { id });

    await $fetch(url, {
      ...withAuthHeaders(),
      method: "DELETE",
    });

    // Recargar lista
    await fetchAportantes();
  } catch (err: any) {
    console.error("[Aportantes] Error al eliminar:", err);
    error.value = "Error al eliminar aportante";
  }
}

function resetForm() {
  formData.value = {
    type: "NATURAL",
    firstName: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    typeDocument: "DNI",
    documentNumber: "",
    ruc: "",
    legalName: "",
    commercialName: "",
    address: "",
  };
  isEditMode.value = false;
  editingId.value = null;
}

// ========================================
// COMPUTED - FORMATEO DE DATOS
// ========================================

function getNombre(aportante: Aportante): string {
  const contributor = aportante.contributor;
  
  if (contributor.type === "NATURAL") {
    return `${contributor.firstName} ${contributor.lastNamePaternal} ${contributor.lastNameMaternal}`;
  }
  
  if (contributor.type === "JURIDICA") {
    return contributor.legalName;
  }

  // Otros tipos
  return contributor.legalName || contributor.firstName || "Sin nombre";
}

function getTotalAcciones(aportante: Aportante): number {
  if (!aportante.allocationShare || aportante.allocationShare.length === 0) {
    return 0;
  }

  return aportante.allocationShare.reduce(
    (total, allocation) => total + allocation.subscribedSharesQuantity,
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
                :checked="aportante.isContributor"
                @update:checked="toggleAportante(aportante)"
              />
            </td>

            <!-- Nombre / Razón Social -->
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ getNombre(aportante) }}
              </div>
              <div class="text-xs text-gray-500">
                {{ aportante.contributor.typeDocument || "RUC" }}:
                {{ aportante.contributor.documentNumber || aportante.contributor.ruc }}
              </div>
            </td>

            <!-- Tipo de Aportante -->
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
                  getTipoBadgeClass(aportante.contributorType),
                ]"
              >
                {{ aportante.contributorType }}
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
              <DropdownMenu v-if="aportante.contributorType === 'NUEVO_APORTANTE'">
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
    <Dialog v-model:open="isModalOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {{ isEditMode ? "Editar" : "Agregar" }} Aportante
          </DialogTitle>
          <DialogDescription>
            Completa la información del nuevo aportante
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <!-- Selector de Tipo de Persona -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Tipo de Persona</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input
                  v-model="formData.type"
                  type="radio"
                  value="NATURAL"
                  class="h-4 w-4 text-primary-600"
                />
                <span class="text-sm">Persona Natural</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="formData.type"
                  type="radio"
                  value="JURIDICA"
                  class="h-4 w-4 text-primary-600"
                />
                <span class="text-sm">Persona Jurídica</span>
              </label>
            </div>
          </div>

          <!-- Formulario Persona Natural -->
          <div v-if="formData.type === 'NATURAL'" class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-sm font-medium">Tipo de Documento</label>
                <select
                  v-model="formData.typeDocument"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">Carné de Extranjería</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">N.º de Documento</label>
                <input
                  v-model="formData.documentNumber"
                  type="text"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="12345678"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium">Nombres</label>
              <input
                v-model="formData.firstName"
                type="text"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Juan Carlos"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-sm font-medium">Apellido Paterno</label>
                <input
                  v-model="formData.lastNamePaternal"
                  type="text"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Pérez"
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">Apellido Materno</label>
                <input
                  v-model="formData.lastNameMaternal"
                  type="text"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="García"
                />
              </div>
            </div>
          </div>

          <!-- Formulario Persona Jurídica -->
          <div v-else class="space-y-3">
            <div class="space-y-1">
              <label class="text-sm font-medium">RUC</label>
              <input
                v-model="formData.ruc"
                type="text"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="20123456789"
                maxlength="11"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium">Razón Social</label>
              <input
                v-model="formData.legalName"
                type="text"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Inversiones del Sur S.A.C."
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium">Nombre Comercial (opcional)</label>
              <input
                v-model="formData.commercialName"
                type="text"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Inversiones del Sur"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium">Dirección</label>
              <input
                v-model="formData.address"
                type="text"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Av. Principal 123, San Isidro"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isModalOpen = false">
            Cancelar
          </Button>
          <Button variant="primary" @click="agregarNuevoAportante">
            {{ isEditMode ? "Guardar Cambios" : "Agregar Aportante" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
