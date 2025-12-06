<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useAportesManagerStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportes/stores/useAportesManagerStore";
import { useAportesStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportes/stores/useAportesStore";
import AportesTable from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportes/components/tables/AportesTable.vue";
import AporteModal from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportes/components/modals/AporteModal.vue";
import { Coins } from "lucide-vue-next";

/**
 * Página: Aportes (Sub-sección de Aporte Dinerario)
 * 
 * Muestra tabla de aportantes que son contribuyentes (isContributor: true)
 * y permite agregar/editar/eliminar aportes para cada uno.
 * 
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/participants (para obtener aportantes)
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions (para obtener aportes)
 * - POST /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions (para crear aporte)
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions (para actualizar aporte)
 * - DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions (para eliminar aporte)
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

// ========================================
// TIPOS
// ========================================

interface Person {
  id: string;
  tipo: "NATURAL" | "JURIDICA" | "SUCURSAL" | "FONDO_INVERSION" | "FIDEICOMISO" | "SUCESION_INDIVISA";
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial?: string;
  [key: string]: any;
}

interface Aportante {
  id: string;
  personId?: string;
  typeShareholder: "ACCIONISTA" | "NUEVO_APORTANTE";
  isContributor: boolean;
  person: Person;
  aportes?: Array<{
    id: string;
    accionistaId: string;
    accion: { id: string; tipo: string; nombre?: string };
    tipoMoneda: "PEN" | "USD";
    monto: number;
    montoConvertido?: number;
    fechaContribucion: string;
    accionesPorRecibir: number;
    precioPorAccion: number;
    capitalSocial: number;
    premium: number;
  }>;
}

interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: Aportante[];
}

// ========================================
// COMPOSABLES Y ESTADO
// ========================================

const route = useRoute();
const snapshotStore = useSnapshotStore();
const aportesManagerStore = useAportesManagerStore();
const aportesStore = useAportesStore();

const societyId = computed(() => route.params.societyId as string);
const flowId = computed(() => route.params.flowId as string);

const aportantes = ref<Aportante[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Modal
const isModalOpen = ref(false);
const modalMode = ref<"crear" | "editar">("crear");
const selectedAccionistaId = ref<string | null>(null);
const selectedAporteId = ref<string | null>(null);

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

// ========================================
// FUNCIONES DE CARGA
// ========================================

async function fetchAportantes() {
  isLoading.value = true;
  error.value = null;

  try {
    const baseUrl = resolveBaseUrl();
    const url = `${baseUrl}${API_BASE.value}/participants`;

    const response = await $fetch<ApiResponse>(url, {
      ...withAuthHeaders(),
      method: "GET",
    });

    // ✅ Filtrar solo los que son contribuyentes (isContributor: true)
    // ✅ NUEVO_APORTANTE siempre debe tener isContributor: true
    aportantes.value = response.data
      .filter((a: Aportante) => a.isContributor === true)
      .map((a: Aportante) => {
        if (a.typeShareholder === "NUEVO_APORTANTE") {
          return { ...a, isContributor: true };
        }
        return a;
      });
  } catch (err: any) {
    console.error("[Aportes] Error al cargar aportantes:", err);
    error.value = err.message || err.data?.message || "Error al cargar aportantes";
  } finally {
    isLoading.value = false;
  }
}

async function loadData() {
  try {
    // Cargar snapshot para obtener valor nominal y shareClasses
    await snapshotStore.loadSnapshot(Number(societyId.value), Number(flowId.value));
    
    // Cargar aportantes
    await fetchAportantes();
    
    // Cargar aportes
    await aportesManagerStore.loadAportes(societyId.value, flowId.value);
  } catch (err: any) {
    console.error("[Aportes] Error al cargar datos:", err);
    error.value = err.message || "Error al cargar datos";
  }
}

// ========================================
// FUNCIONES DEL MODAL
// ========================================

function openModalForAdd(accionistaId: string) {
  selectedAccionistaId.value = accionistaId;
  selectedAporteId.value = null;
  modalMode.value = "crear";
  aportesStore.$reset();
  isModalOpen.value = true;
}

function openModalForEdit(accionistaId: string, aporteId: string) {
  selectedAccionistaId.value = accionistaId;
  selectedAporteId.value = aporteId;
  modalMode.value = "editar";
  
  // Cargar datos del aporte en el store
  const aporte = aportesManagerStore.aportes.find((a) => a.id === aporteId);
  if (aporte) {
    aportesStore.tipoMoneda = aporte.tipoMoneda;
    aportesStore.monto = aporte.monto;
    aportesStore.fechaContribucion = aporte.fechaContribucion?.split("T")[0] || ""; // Formato YYYY-MM-DD
    aportesStore.tasaCambio = aporte.tasaCambio || 1.0;
    aportesStore.montoConvertido = aporte.montoConvertido || aporte.monto;
    aportesStore.accionId = aporte.accion.id;
    aportesStore.accionesPorRecibir = aporte.accionesPorRecibir;
    aportesStore.precioPorAccion = aporte.precioPorAccion;
    aportesStore.pagadoCompletamente = aporte.pagadoCompletamente;
    aportesStore.porcentajePagado = aporte.porcentajePagado || 0;
    aportesStore.totalPasivo = aporte.totalPasivo || 0;
    aportesStore.capitalSocial = aporte.capitalSocial;
    aportesStore.premium = aporte.premium;
    aportesStore.reserva = aporte.reserva || 0;
    aportesStore.comprobantePagoArchivoId = aporte.comprobantePagoArchivoId || "";
  }
  
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedAccionistaId.value = null;
  selectedAporteId.value = null;
  aportesStore.$reset();
}

async function handleSaveAporte() {
  if (!selectedAccionistaId.value) return;

  try {
    const formData = aportesStore.getFormData();
    
    // Generar UUID para el aporte
    const generateUuid = () => {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    };

    // Formatear fecha a YYYY-MM-DD si viene en otro formato
    let fechaFormateada = formData.fechaContribucion;
    if (fechaFormateada.includes("/")) {
      // Si viene en formato DD/MM/YYYY, convertir a YYYY-MM-DD
      const [day, month, year] = fechaFormateada.split("/");
      fechaFormateada = `${year}-${month}-${day}`;
    }

    // Construir payload base
    const payload: any = {
      id: modalMode.value === "editar" && selectedAporteId.value 
        ? selectedAporteId.value 
        : generateUuid(),
      accionistaId: selectedAccionistaId.value,
      accionId: formData.accionId,
      tipoMoneda: formData.tipoMoneda,
      monto: formData.monto,
      fechaContribucion: fechaFormateada,
      tasaCambio: formData.tipoMoneda === "USD" ? formData.tasaCambio : 1.0,
      montoConvertido: formData.montoConvertido || formData.monto,
      accionesPorRecibir: formData.accionesPorRecibir,
      precioPorAccion: formData.precioPorAccion,
      pagadoCompletamente: formData.pagadoCompletamente,
      porcentajePagado: formData.pagadoCompletamente ? 100 : (formData.porcentajePagado || 0),
      totalPasivo: formData.pagadoCompletamente ? 0 : (formData.totalPasivo || 0),
      capitalSocial: formData.capitalSocial,
      premium: formData.premium,
      reserva: formData.reserva || 0,
    };

    // ✅ Solo incluir comprobantePagoArchivoId si tiene un valor válido (no vacío)
    if (formData.comprobantePagoArchivoId && formData.comprobantePagoArchivoId.trim() !== "") {
      payload.comprobantePagoArchivoId = formData.comprobantePagoArchivoId;
    }

    if (modalMode.value === "editar" && selectedAporteId.value) {
      await aportesManagerStore.updateAporte(
        societyId.value,
        flowId.value,
        selectedAporteId.value,
        payload
      );
    } else {
      await aportesManagerStore.createAporte(societyId.value, flowId.value, payload);
    }

    closeModal();
  } catch (err: any) {
    console.error("[Aportes] Error al guardar aporte:", err);
    error.value = err.message || "Error al guardar aporte";
  }
}

async function handleDeleteAporte(aporteId: string) {
  if (!confirm("¿Estás seguro de eliminar este aporte?")) return;

  try {
    await aportesManagerStore.deleteAportes(societyId.value, flowId.value, [aporteId]);
  } catch (err: any) {
    console.error("[Aportes] Error al eliminar aporte:", err);
    error.value = err.message || "Error al eliminar aporte";
  }
}

// ========================================
// COMPUTED
// ========================================

// Valor nominal desde el snapshot
const valorNominal = computed(() => {
  return snapshotStore.snapshot?.nominalValue || 0;
});

// Total de acciones desde el snapshot
const totalAcciones = computed(() => {
  if (!snapshotStore.snapshot?.shareAllocations) return 0;
  return snapshotStore.snapshot.shareAllocations.reduce(
    (total, allocation) => total + allocation.cantidadSuscrita,
    0
  );
});

// Aportantes con sus aportes agrupados
const aportantesConAportes = computed(() => {
  // Agregar propiedad aportes vacía a cada aportante si no existe
  const aportantesConAportesProp = aportantes.value.map((a) => ({
    ...a,
    aportes: a.aportes || [],
  }));
  return aportesManagerStore.tablaAportes(aportantesConAportesProp);
});

// ========================================
// LIFECYCLE
// ========================================

onMounted(() => {
  loadData();
});
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Aportes"
      subtitle="Registra los aportes dinerarios realizados por los aportantes."
    />
    
    <!-- Valor Nominal (Top Right) -->
    <div class="flex justify-end mb-6">
      <div class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <Coins class="w-5 h-5 text-yellow-600" />
        <span class="t-t2 font-secondary text-gray-800 font-semibold">
          Valor Nominal: S/ {{ valorNominal.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-10">
      <!-- Error -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600">Cargando aportes...</p>
        </div>
      </div>

      <!-- Tabla -->
      <AportesTable
        v-else
        :aportantes="aportantesConAportes"
        :total-acciones="totalAcciones"
        title-menu="Acciones"
        @add="openModalForAdd"
        @edit="openModalForEdit"
        @delete="handleDeleteAporte"
      />
    </div>

    <!-- Modal de Aporte -->
    <AporteModal
      v-model="isModalOpen"
      :mode="modalMode"
      :accionista-id="selectedAccionistaId"
      :aporte-id="selectedAporteId"
      :society-id="societyId"
      :flow-id="flowId"
      @close="closeModal"
      @submit="handleSaveAporte"
    />
  </SlotWrapper>
</template>
