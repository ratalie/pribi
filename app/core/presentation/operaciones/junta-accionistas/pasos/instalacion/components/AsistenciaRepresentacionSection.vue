<script setup lang="ts">
import { computed, ref, watch } from "vue";
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
import { Button } from "~/components/ui/button";
import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import DataTableDropDown from "~/components/base/tables/DataTableDropDown.vue";
import { TipoJunta } from "~/core/hexag/juntas/domain/enums/tipo-junta.enum";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import RepresentanteModal from "./RepresentanteModal.vue";
import RepresentanteInfo from "./RepresentanteInfo.vue";

interface Props {
  societyId: number;
  flowId: string;
}

const props = defineProps<Props>();

// ========================================
// STORES (ORIGINALES que funcionaban)
// ========================================
const meetingDetailsStore = useMeetingDetailsStore();
const asistenciaStore = useAsistenciaStore();
const { asistenciasEnriquecidas, totalAcciones, accionesPresentes } = storeToRefs(asistenciaStore);

// ========================================
// STATE
// ========================================
const isRepresentanteModalOpen = ref(false);
const selectedAccionistaId = ref<string | null>(null);

// Acciones para el menú de representante (DataTableDropDown)
const representanteActions = computed(() => [
  {
    label: "Editar",
    icon: "SquarePen",
    onClick: (id: string) => openRepresentanteModal(id),
  },
  {
    label: "Eliminar",
    icon: "Trash2",
    onClick: (id: string) => removeRepresentante(id),
  },
]);

// ========================================
// COMPUTED
// ========================================

/**
 * Tipo de junta (para checkbox behavior)
 */
const tipoJunta = computed(() => meetingDetailsStore.meetingDetails?.tipoJunta);

/**
 * Si es universal, todos asisten automáticamente
 */
const isUniversal = computed(() => tipoJunta.value === TipoJunta.UNIVERSAL);

/**
 * Porcentaje de participación total
 */
const porcentajeTotal = computed(() => {
  if (totalAcciones.value === 0) return 0;
  return (accionesPresentes.value / totalAcciones.value) * 100;
});

// ========================================
// METHODS
// ========================================

/**
 * Toggle asistencia de un accionista
 */
async function toggleAsistencia(registroId: string) {
  // Si es universal, no permitir toggle
  if (isUniversal.value) return;

  try {
    await asistenciaStore.toggleAsistencia(props.societyId, Number(props.flowId), registroId);
  } catch (error) {
    console.error("[AsistenciaSection] Error al toggle asistencia:", error);
  }
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
async function saveRepresentante(representanteData: any) {
  if (!selectedAccionistaId.value) return;

  console.log("[AsistenciaSection] Guardando representante:", {
    accionistaId: selectedAccionistaId.value,
    representanteData,
  });

  try {
    // TODO: Aquí debería:
    // 1. Crear la persona representante en el backend
    // 2. Actualizar la asistencia con representadoPorId
    // Por ahora, solo cerramos el modal
    
    console.log("✅ [AsistenciaSection] Representante guardado (mock)");
    closeRepresentanteModal();
  } catch (error) {
    console.error("❌ [AsistenciaSection] Error al guardar representante:", error);
  }
}

/**
 * Remover representante
 */
async function removeRepresentante(accionistaId: string) {
  console.log("[AsistenciaSection] Removiendo representante:", accionistaId);
  
  try {
    await asistenciaStore.eliminarRepresentante(
      props.societyId,
      Number(props.flowId),
      accionistaId
    );
    console.log("✅ [AsistenciaSection] Representante removido");
  } catch (error) {
    console.error("❌ [AsistenciaSection] Error al remover representante:", error);
  }
}


/**
 * Obtener clases CSS para el tipo de accionista (mismo estilo que Sociedades)
 */
function getTipoClasses(tipo: string): string {
  const variants: Record<string, string> = {
    NATURAL: "px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium",
    JURIDICA: "px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium",
    SUCURSAL: "px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium",
    SUCESIONES_INDIVISAS: "px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium",
    FIDEICOMISOS: "px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-medium",
  };
  return variants[tipo] || "px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium";
}

/**
 * Tipos que requieren representante obligatorio cuando asistio=true
 */
const TIPOS_CON_REPRESENTANTE_OBLIGATORIO = [
  "JURIDICA",
  "SUCURSAL",
  "FONDO_INVERSION",
  "FIDEICOMISO",
  "SUCESION_INDIVISA",
] as const;

/**
 * ¿Requiere representante obligatorio? (cuando asistio=true)
 */
function requiereRepresentanteObligatorio(tipo: string): boolean {
  return TIPOS_CON_REPRESENTANTE_OBLIGATORIO.includes(tipo as any);
}

/**
 * ¿Requiere representante? (FIDEICOMISOS, SUCESIONES_INDIVISAS) - Legacy
 * @deprecated Usar requiereRepresentanteObligatorio
 */
function requiereRepresentante(tipo: string): boolean {
  return requiereRepresentanteObligatorio(tipo);
}

// Acciones del menú de representante (DataTableDropDown con 3 puntos)
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
          
          <!-- Nueva columna para botones -->
          <TableHead class="w-12 h-16" />
        </TableRow>
      </TableHeader>
        
        <TableBody>
          <!-- Mensaje si no hay datos -->
          <TableRow v-if="asistenciasEnriquecidas.length === 0">
            <TableCell colspan="7" class="text-center py-6 text-slate-500">
              Aún no se ha registrado ninguna asistencia
            </TableCell>
          </TableRow>

          <!-- Filas de accionistas -->
          <TableRow 
            v-for="asistencia in asistenciasEnriquecidas" 
            :key="asistencia.id"
            :class="asistencia.asistio ? 'bg-primary-50/30' : ''"
          >
            <!-- Checkbox de asistencia -->
            <TableCell class="text-center">
              <Checkbox
                :model-value="asistencia.asistio"
                :checked="asistencia.asistio"
                :disabled="isUniversal"
                @update:checked="() => toggleAsistencia(asistencia.id)"
              />
              <!-- DEBUG -->
              <span class="text-xs text-gray-400 ml-2">
                {{ asistencia.asistio ? "✓" : "○" }}
              </span>
            </TableCell>
            
            <!-- Nombre -->
            <TableCell class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium h-16">
              {{ asistencia.nombreCompleto }}
            </TableCell>
            
            <!-- Tipo (Badge style como Sociedades) -->
            <TableCell class="text-center h-16">
              <span :class="getTipoClasses(asistencia.tipoPersona)">
                {{ asistencia.tipoPersona }}
              </span>
            </TableCell>
            
            <!-- Acciones -->
            <TableCell class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-medium h-16">
              {{ asistencia.accionesConDerechoVoto }}
            </TableCell>
            
            <!-- Porcentaje -->
            <TableCell class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-medium h-16">
              {{ asistencia.porcentajeParticipacion.toFixed(2) }}%
            </TableCell>
            
            <!-- Representado por (Columna 1: Nombre o mensaje) -->
            <TableCell class="h-16">
              <!-- CASO 1: Asistió -->
              <template v-if="asistencia.asistio">
                <template v-if="asistencia.representadoPorId">
                  <!-- Ya tiene representante: mostrar nombre -->
                  <RepresentanteInfo
                    :accionista-id="asistencia.id"
                    :representante-id="asistencia.representadoPorId"
                  />
                </template>
                <template v-else-if="requiereRepresentanteObligatorio(asistencia.tipoPersona)">
                  <!-- Requiere representante obligatorio -->
                  <span class="t-b2 font-secondary text-red-600 italic font-semibold">
                    ⚠️ Requiere representante
                  </span>
                </template>
                <template v-else>
                  <!-- No requiere -->
                  <span class="t-t2 font-secondary text-gray-500">—</span>
                </template>
              </template>
              
              <!-- CASO 2: NO Asistió - Mostrar mensaje -->
              <template v-else>
                <span class="t-t2 font-secondary text-gray-500">—</span>
              </template>
            </TableCell>
            
            <!-- Acciones (Columna 2: Botón Agregar o DataTableDropDown) -->
            <TableCell class="h-16 text-right">
              <div class="flex justify-end">
                <!-- Si tiene representante: mostrar DataTableDropDown (3 puntos) -->
                <template v-if="asistencia.representadoPorId">
                  <DataTableDropDown
                    :item-id="asistencia.id"
                    title-menu="Acciones"
                    :actions="representanteActions"
                    icon-type="vertical"
                  />
                </template>
                
                <!-- Si NO tiene representante Y asistió: mostrar botón Agregar -->
                <template v-else-if="asistencia.asistio">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    @click="openRepresentanteModal(asistencia.id)"
                  >
                    Agregar
                  </Button>
                </template>
                
                <!-- Si NO asistió: no mostrar nada -->
              </div>
            </TableCell>
          </TableRow>
          
          <!-- Fila de totales -->
          <TableRow v-if="asistenciasEnriquecidas.length > 0" class="bg-gray-50 border-t-2 border-gray-300">
            <TableCell />
            <TableCell class="font-secondary text-gray-800 t-t2 font-bold h-16">
              Total de acciones presentes
            </TableCell>
            <TableCell />
            <TableCell class="font-secondary text-gray-800 text-center t-t2 font-bold h-16">
              {{ accionesPresentes }}
            </TableCell>
            <TableCell class="font-secondary text-gray-800 text-center t-t2 font-bold h-16">
              {{ porcentajeTotal.toFixed(2) }}%
            </TableCell>
            <TableCell />
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
