<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import CardTitle from "~/components/base/cards/CardTitle.vue";
import SimpleCard from "~/components/base/cards/SimpleCard.vue";
import Table from "~/components/ui/table/Table.vue";
import TableHeader from "~/components/ui/table/TableHeader.vue";
import TableBody from "~/components/ui/table/TableBody.vue";
import TableRow from "~/components/ui/table/TableRow.vue";
import TableHead from "~/components/ui/table/TableHead.vue";
import TableCell from "~/components/ui/table/TableCell.vue";
import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import { TipoJunta } from "~/core/hexag/juntas/domain/enums/tipo-junta.enum";
import { useMeetingDetailsStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/detalles/stores/meeting-details.store";
import { useAsistenciaStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/stores/asistencia.store";
import RepresentanteModal from "./RepresentanteModal.vue";
import RepresentanteInfo from "./RepresentanteInfo.vue";

interface Props {
  societyId: number;
  flowId: string;
}

const props = defineProps<Props>();

// ========================================
// STORES
// ========================================
const meetingDetailsStore = useMeetingDetailsStore();
const asistenciaStore = useAsistenciaStore();
const { asistentes, representantes } = storeToRefs(asistenciaStore);

// ========================================
// STATE
// ========================================
const isRepresentanteModalOpen = ref(false);
const selectedAccionistaId = ref<string | null>(null);

// ========================================
// COMPUTED
// ========================================

/**
 * Tipo de junta (para checkbox behavior)
 */
const tipoJunta = computed(() => meetingDetailsStore.tipoJunta);

/**
 * Si es universal, todos asisten automáticamente
 */
const isUniversal = computed(() => tipoJunta.value === TipoJunta.UNIVERSAL);

/**
 * Accionistas enriquecidos con asistencia y representación
 */
const accionistasEnriquecidos = computed(() => {
  // TODO: Obtener del snapshot/store de accionistas
  // Por ahora, datos mock para estructura
  return [
    {
      id: "acc-1",
      nombre: "Ana María Gómez Torres",
      tipo: "NATURAL",
      acciones: 100,
      porcentaje: 20.0,
      requiereRepresentante: false,
    },
    {
      id: "acc-2",
      nombre: "Inversiones del Sur S.A.C.",
      tipo: "JURIDICA",
      acciones: 200,
      porcentaje: 40.0,
      requiereRepresentante: false,
    },
    {
      id: "acc-3",
      nombre: "Sucursal Arequipa - Inversiones del Sur S.A.C.",
      tipo: "SUCURSAL",
      acciones: 50,
      porcentaje: 10.0,
      requiereRepresentante: false,
    },
    {
      id: "acc-4",
      nombre: "Sucesión Indivisa de María Torres Vega",
      tipo: "SUCESIONES INDIVISAS",
      acciones: 50,
      porcentaje: 10.0,
      requiereRepresentante: true,
    },
    {
      id: "acc-5",
      nombre: 'Fideicomiso "Inversión Inmobiliaria Los Álamos"',
      tipo: "FIDEICOMISOS",
      acciones: 100,
      porcentaje: 20.0,
      requiereRepresentante: true,
    },
  ].map((acc) => ({
    ...acc,
    asistio: isUniversal.value ? true : (asistentes.value.some((a: any) => a.accionistaId === acc.id)),
    representante: representantes.value.find((r: any) => r.accionistaId === acc.id),
  }));
});

/**
 * Total de acciones presentes
 */
const totalAccionesPresentes = computed(() => {
  return accionistasEnriquecidos.value
    .filter((a) => a.asistio)
    .reduce((sum, a) => sum + a.acciones, 0);
});

/**
 * Total de acciones
 */
const totalAcciones = computed(() => {
  return accionistasEnriquecidos.value.reduce((sum, a) => sum + a.acciones, 0);
});

/**
 * Porcentaje de participación total
 */
const porcentajeTotal = computed(() => {
  if (totalAcciones.value === 0) return 0;
  return (totalAccionesPresentes.value / totalAcciones.value) * 100;
});

// ========================================
// METHODS
// ========================================

/**
 * Toggle asistencia de un accionista
 */
function toggleAsistencia(accionistaId: string) {
  // Si es universal, no permitir toggle
  if (isUniversal.value) return;

  asistenciaStore.markAsistente(accionistaId, {});
}

/**
 * Abrir modal para agregar representante
 */
function openRepresentanteModal(accionistaId: string) {
  selectedAccionistaId.value = accionistaId;
  isRepresentanteModalOpen.value = true;
}

/**
 * Cerrar modal
 */
function closeRepresentanteModal() {
  isRepresentanteModalOpen.value = false;
  selectedAccionistaId.value = null;
}

/**
 * Guardar representante
 */
function saveRepresentante(representanteData: any) {
  if (!selectedAccionistaId.value) return;

  // Guardar en store
  asistenciaStore.markAsistente(selectedAccionistaId.value, {
    representante: representanteData,
  });

  closeRepresentanteModal();
}

/**
 * Remover representante
 */
function removeRepresentante(accionistaId: string) {
  asistenciaStore.removeAsistente(accionistaId);
}

/**
 * Obtener clases CSS para el tipo de accionista (mismo estilo que Sociedades)
 */
function getTipoClasses(tipo: string): string {
  const variants: Record<string, string> = {
    NATURAL: "px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium",
    JURIDICA: "px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium",
    SUCURSAL: "px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium",
    "SUCESIONES INDIVISAS": "px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium",
    FIDEICOMISOS: "px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-medium",
  };
  return variants[tipo] || "px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium";
}
</script>

<template>
  <SimpleCard>
    <CardTitle
      title="Asistencia y Representación en la Junta"
      body="Marque la asistencia de los socios y agregue representantes si es que se requiere."
    />

    <!-- TABLA DE ASISTENCIA -->
    <div class="overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <!-- Checkbox header (vacío) -->
            <TableHead class="w-12" />
            
            <TableHead class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16">
              Nombre Apellido / Razón Social
            </TableHead>
            
            <TableHead class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16">
              Tipo de Accionista
            </TableHead>
            
            <TableHead class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16">
              Acciones con derecho a voto
            </TableHead>
            
            <TableHead class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16">
              Porcentaje de Participación
            </TableHead>
            
            <TableHead class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16">
              Representado por
            </TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          <!-- Filas de accionistas -->
          <TableRow v-for="accionista in accionistasEnriquecidos" :key="accionista.id">
            <!-- Checkbox de asistencia -->
            <TableCell class="text-center">
              <Checkbox
                :checked="accionista.asistio"
                :disabled="isUniversal"
                @update:checked="toggleAsistencia(accionista.id)"
              />
            </TableCell>
            
            <!-- Nombre -->
            <TableCell class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium h-16">
              {{ accionista.nombre }}
            </TableCell>
            
            <!-- Tipo (Badge style como Sociedades) -->
            <TableCell class="text-center h-16">
              <span :class="getTipoClasses(accionista.tipo)">
                {{ accionista.tipo }}
              </span>
            </TableCell>
            
            <!-- Acciones -->
            <TableCell class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-medium h-16">
              {{ accionista.acciones }}
            </TableCell>
            
            <!-- Porcentaje -->
            <TableCell class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-medium h-16">
              {{ accionista.porcentaje.toFixed(2) }}%
            </TableCell>
            
            <!-- Representado por -->
            <TableCell class="h-16">
              <!-- Si tiene representante -->
              <RepresentanteInfo
                v-if="accionista.representante"
                :representante="accionista.representante"
                @edit="openRepresentanteModal(accionista.id)"
                @remove="removeRepresentante(accionista.id)"
              />
              
              <!-- Si requiere representante pero no tiene -->
              <div v-else-if="accionista.requiereRepresentante" class="flex items-center gap-2">
                <span class="t-t2 font-secondary text-purple-600 font-medium">
                  Requiere representante
                </span>
                <ActionButton
                  variant="secondary"
                  size="sm"
                  label="Agregar"
                  icon="Plus"
                  @click="openRepresentanteModal(accionista.id)"
                />
              </div>
              
              <!-- Si NO requiere representante (es Natural, etc.) -->
              <div v-else class="flex items-center gap-2">
                <span class="t-t2 font-secondary text-gray-500">—</span>
                <ActionButton
                  variant="ghost"
                  size="sm"
                  label="Agregar"
                  icon="Plus"
                  @click="openRepresentanteModal(accionista.id)"
                />
              </div>
            </TableCell>
          </TableRow>
          
          <!-- Fila de totales -->
          <TableRow class="bg-gray-50 border-t-2 border-gray-300">
            <TableCell />
            <TableCell class="font-secondary text-gray-800 t-t2 font-bold h-16">
              Total de acciones presentes
            </TableCell>
            <TableCell />
            <TableCell class="font-secondary text-gray-800 text-center t-t2 font-bold h-16">
              {{ totalAccionesPresentes }}
            </TableCell>
            <TableCell class="font-secondary text-gray-800 text-center t-t2 font-bold h-16">
              {{ porcentajeTotal.toFixed(2) }}%
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- MODAL DE REPRESENTANTE -->
    <RepresentanteModal
      :is-open="isRepresentanteModalOpen"
      :accionista-id="selectedAccionistaId"
      @close="closeRepresentanteModal"
      @save="saveRepresentante"
    />
  </SimpleCard>
</template>

