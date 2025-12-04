<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CardTitle from "~/components/base/cards/CardTitle.vue";
import SimpleCard from "~/components/base/cards/SimpleCard.vue";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
import { z } from "zod";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

interface Props {
  societyId: number;
  flowId: string;
}

const props = defineProps<Props>();

// ========================================
// STORES (ORIGINALES)
// ========================================
const meetingDetailsStore = useMeetingDetailsStore();
const asistenciaStore = useAsistenciaStore();
const snapshotStore = useSnapshotStore();

// ========================================
// STATE
// ========================================
const presidenteAsistio = ref(true);
const secretarioAsistio = ref(true);

// ========================================
// COMPUTED
// ========================================

/**
 * Presidente y secretario desde meeting details
 */
const presidenteId = computed(() => meetingDetailsStore.meetingDetails?.presidenteId || "");
const secretarioId = computed(() => meetingDetailsStore.meetingDetails?.secretarioId || "");

/**
 * Nombres desde el directorio (si existe)
 */
const presidenteNombre = computed(() => {
  // TODO: Buscar en snapshot.directorio por presidenteId
  return presidenteId.value || "Cristian Robert Huamán García";
});

const secretarioNombre = computed(() => {
  // TODO: Buscar en snapshot.directorio por secretarioId
  return secretarioId.value || "";
});

/**
 * Opciones de asistentes presentes (para reemplazo)
 */
const asistentesOptions = computed(() => {
  return asistenciaStore.asistenciasEnriquecidas
    .filter((a) => a.asistio)
    .map((a, index) => ({
      id: index + 1,
      value: a.id,
      label: a.nombreCompleto,
    }));
});

/**
 * ¿Tiene directorio configurado?
 */
const tieneDirectorio = computed(() => {
  return !!snapshotStore.directorio;
});

// ========================================
// REFS PARA REEMPLAZOS
// ========================================
const presidenteReemplazo = ref("");
const secretarioReemplazo = ref("");

// ========================================
// METHODS
// ========================================

/**
 * Actualizar mesa directiva en meeting details
 */
async function updateMesaDirectiva() {
  try {
    // Actualizar en el store
    await meetingDetailsStore.patchMeetingDetails({
      presidenteAsistio: presidenteAsistio.value,
      secretarioAsistio: secretarioAsistio.value,
      // TODO: Agregar IDs de reemplazos si no asistieron
    });
    
    console.log("[MesaDirectiva] Actualizado:", {
      presidenteAsistio: presidenteAsistio.value,
      secretarioAsistio: secretarioAsistio.value,
    });
  } catch (error) {
    console.error("[MesaDirectiva] Error al actualizar:", error);
  }
}

/**
 * Watch changes para auto-save
 */
watch([presidenteAsistio, secretarioAsistio], () => {
  updateMesaDirectiva();
});
</script>

<template>
  <SimpleCard>
    <CardTitle
      title="Presidente y Secretario de la Junta"
      body="Elija al Presidente y al Secretario de la junta."
    />

    <!-- GRID DE 2 COLUMNAS -->
    <div class="grid grid-cols-2 gap-6">
      <!-- ========================================
           PRESIDENTE DE LA JUNTA
           ======================================== -->
      <div class="flex flex-col gap-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <!-- Header con Switch -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-1">
            <Label class="t-t2 font-secondary text-gray-800 font-bold">
              Presidente de la Junta
            </Label>
            <span class="t-b2 text-gray-600 font-secondary">
              {{ presidenteAsistio ? "Asistió" : "No Asistió" }}
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="t-t2 font-secondary text-gray-600">
              {{ presidenteAsistio ? "SI" : "NO" }}
            </span>
            <Switch v-model:checked="presidenteAsistio" />
          </div>
        </div>

        <!-- Si asistió: Mostrar nombre (readonly) -->
        <div v-if="presidenteAsistio" class="flex flex-col gap-2">
          <Label class="t-t2 font-secondary text-gray-700">
            Nombre completo
          </Label>
          <Input
            :value="presidenteNombre"
            disabled
            class="bg-white"
          />
          <span v-if="tieneDirectorio" class="t-b3 text-gray-500 font-secondary">
            Presidente del Directorio (configurado en Paso 5 de Sociedades)
          </span>
        </div>

        <!-- Si NO asistió: Selector de reemplazo -->
        <div v-else class="flex flex-col gap-2">
          <SelectInputZod
            v-model="presidenteReemplazo"
            name="presidente_reemplazo"
            label="Seleccionar reemplazo"
            placeholder="Seleccionar accionista o representante"
            :options="asistentesOptions"
            :schema="z.string().min(1, 'Debe seleccionar un reemplazo')"
          />
          <span class="t-b3 text-gray-500 font-secondary">
            Solo accionistas o representantes presentes
          </span>
        </div>
      </div>

      <!-- ========================================
           SECRETARIO DE LA JUNTA
           ======================================== -->
      <div class="flex flex-col gap-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <!-- Header con Switch -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-1">
            <Label class="t-t2 font-secondary text-gray-800 font-bold">
              Secretario de la Junta
            </Label>
            <span class="t-b2 text-gray-600 font-secondary">
              {{ secretarioAsistio ? "Asistió" : "No Asistió" }}
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="t-t2 font-secondary text-gray-600">
              {{ secretarioAsistio ? "SI" : "NO" }}
            </span>
            <Switch v-model:checked="secretarioAsistio" />
          </div>
        </div>

        <!-- Si asistió: Mostrar nombre o selector -->
        <div v-if="secretarioAsistio" class="flex flex-col gap-2">
          <Label class="t-t2 font-secondary text-gray-700">
            Nombre completo
          </Label>
          
          <!-- Si tiene secretario del directorio -->
          <Input
            v-if="tieneDirectorio && secretarioNombre"
            :value="secretarioNombre"
            disabled
            class="bg-white"
          />
          
          <!-- Si NO tiene secretario, selector manual -->
          <SelectInputZod
            v-else
            v-model="secretarioId"
            name="secretario_id"
            label=""
            placeholder="Seleccionar accionista o representante"
            :options="asistentesOptions"
            :schema="z.string()"
          />
          
          <span v-if="tieneDirectorio && secretarioNombre" class="t-b3 text-gray-500 font-secondary">
            Secretario del Directorio (si está configurado)
          </span>
        </div>

        <!-- Si NO asistió: Selector de reemplazo -->
        <div v-else class="flex flex-col gap-2">
          <SelectInputZod
            v-model="secretarioReemplazo"
            name="secretario_reemplazo"
            label="Seleccionar reemplazo"
            placeholder="Seleccionar accionista o representante"
            :options="asistentesOptions"
            :schema="z.string().min(1, 'Debe seleccionar un reemplazo')"
          />
          <span class="t-b3 text-gray-500 font-secondary">
            Solo accionistas o representantes presentes
          </span>
        </div>
      </div>
    </div>
  </SimpleCard>
</template>
