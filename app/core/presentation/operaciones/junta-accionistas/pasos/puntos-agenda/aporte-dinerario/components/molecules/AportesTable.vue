<script setup lang="ts">
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { computed, ref } from "vue";
import BaseButton from "~/components/base/buttons/BaseButton.vue";
import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import DataTableDropDown from "~/components/base/tables/DataTableDropDown.vue";
import Table from "~/components/ui/table/Table.vue";
import TableBody from "~/components/ui/table/TableBody.vue";
import TableCell from "~/components/ui/table/TableCell.vue";
import TableHead from "~/components/ui/table/TableHead.vue";
import TableHeader from "~/components/ui/table/TableHeader.vue";
import TableRow from "~/components/ui/table/TableRow.vue";
import AporteModal from "./AporteModal.vue";

interface Aporte {
  id: string;
  accionistaId: string;
  accion: {
    id: string;
    tipo: string;
    nombre?: string;
  };
  tipoMoneda: "PEN" | "USD";
  monto: number;
  fechaContribucion: string;
  accionesPorRecibir: number;
  precioPorAccion: number;
  capitalSocial: number;
  premium: number;
}

interface Aportante {
  id: string;
  person: {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipo: string;
  };
  typeShareholder: "ACCIONISTA" | "NUEVO_APORTANTE";
  aportes: Aporte[];
}

interface Aporte {
  id: string;
  accionistaId: string;
  accion: {
    id: string;
    tipo: string;
    nombre?: string;
  };
  tipoMoneda: "PEN" | "USD";
  monto: number;
  montoConvertido?: number;
  fechaContribucion: string;
  accionesPorRecibir: number;
  precioPorAccion: number;
  capitalSocial: number;
  premium: number;
}

interface Aportante {
  id: string;
  person: {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipo: string;
  };
  typeShareholder: "ACCIONISTA" | "NUEVO_APORTANTE";
  aportes: Aporte[];
}

interface Props {
  aportantes: Aportante[];
  titleMenu?: string;
  totalAcciones?: number; // Total de acciones de la sociedad (desde snapshot)
}

const props = withDefaults(defineProps<Props>(), {
  titleMenu: "Acciones",
  totalAcciones: 0,
});

const emit = defineEmits<{
  (e: "edit", accionistaId: string, aporteId: string): void;
  (e: "delete", aporteId: string): void;
  (e: "add", accionistaId: string): void;
  (e: "refresh"): void;
}>();

const expanded = ref<string[]>([]);

function toggleRow(id: string) {
  if (expanded.value.includes(id)) {
    expanded.value = expanded.value.filter((e) => e !== id);
  } else {
    expanded.value.push(id);
  }
}

function handleEdit(accionistaId: string, aporteId: string) {
  emit("edit", accionistaId, aporteId);
}

function handleDelete(aporteId: string) {
  emit("delete", aporteId);
}

// Obtener nombre del aportante
function getNombreAportante(aportante: Aportante): string {
  const person = aportante.person;
  if (person.tipo === "NATURAL") {
    return `${person.nombre || ""} ${person.apellidoPaterno || ""} ${person.apellidoMaterno || ""}`.trim();
  }
  return person.razonSocial || "Sin nombre";
}

// Obtener total de acciones de un aportante
function getTotalAcciones(aportante: Aportante): number {
  return aportante.aportes.reduce((total, aporte) => total + aporte.accionesPorRecibir, 0);
}

// Obtener porcentaje de participación
function getParticipacion(aportante: Aportante): number {
  const totalAcciones = props.totalAcciones || 1; // Evitar división por 0
  const accionesAportante = getTotalAcciones(aportante);
  return totalAcciones > 0 ? (accionesAportante / totalAcciones) * 100 : 0;
}

// Obtener acciones para el dropdown de una fila específica
function getActionsForRow(accionistaId: string) {
  return [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (aporteId: string) => {
        if (aporteId) handleEdit(accionistaId, aporteId);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (aporteId: string) => {
        if (aporteId) handleDelete(aporteId);
      },
    },
  ];
}

// Formatear fecha
function formatFecha(fecha: string): string {
  if (!fecha) return "—";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Formatear moneda
function formatMoneda(monto: number, tipoMoneda: "PEN" | "USD"): string {
  const symbol = tipoMoneda === "PEN" ? "S/" : "$";
  return `${symbol} ${monto.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Obtener nombre de la acción
function getNombreAccion(aporte: Aporte): string {
  if (aporte.accion.tipo === "COMUN") {
    return "Comunes";
  } else if (aporte.accion.tipo === "PREFERENTE_NO_VOTO") {
    return "Preferentes sin voto";
  } else if (aporte.accion.tipo === "CLASE") {
    return aporte.accion.nombre || "Clase";
  }
  return aporte.accion.nombre || aporte.accion.tipo;
}
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead />
        <TableHead
          class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          Nombre Apellido / Razón Social
        </TableHead>
        <TableHead
          class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          Tipo de Aportante
        </TableHead>
        <TableHead
          class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          N° de Acciones
        </TableHead>
        <TableHead
          class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          % Participación
        </TableHead>
        <TableHead class="h-16" />
      </TableRow>
    </TableHeader>
    <TableHeader v-if="expanded.length > 0">
      <TableRow class="bg-gray-50">
        <TableHead />
        <TableHead />
        <TableHead
          class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16 text-center"
        >
          Tipo de Acción
        </TableHead>
        <TableHead
          class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          Cantidad
        </TableHead>
        <TableHead
          class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          Monto
        </TableHead>
        <TableHead
          class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          Fecha
        </TableHead>
        <TableHead class="h-16" />
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-for="aportante in aportantes" :key="aportante.id">
        <!-- Fila principal -->
        <TableRow>
          <TableCell>
            <BaseButton variant="ghost" @click="toggleRow(aportante.id)">
              <component
                :is="expanded.includes(aportante.id) ? ChevronUp : ChevronDown"
                class="w-5 h-5"
              />
            </BaseButton>
          </TableCell>
          <TableCell
            class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium h-16"
          >
            {{ getNombreAportante(aportante) }}
          </TableCell>
          <TableCell
            class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-medium h-16"
          >
            <span
              :class="[
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
                aportante.typeShareholder === 'NUEVO_APORTANTE'
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'bg-blue-100 text-blue-800 border-blue-300',
              ]"
            >
              {{ aportante.typeShareholder === 'NUEVO_APORTANTE' ? 'NUEVO APORTANTE' : 'ACCIONISTA' }}
            </span>
          </TableCell>
          <TableCell
            class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-medium h-16"
          >
            {{ getTotalAcciones(aportante).toLocaleString() }}
          </TableCell>
          <TableCell
            class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-medium h-16"
          >
            {{ getParticipacion(aportante).toFixed(2) }}%
          </TableCell>
          <TableCell>
            <ActionButton
              variant="secondary"
              size="sm"
              label="Agregar"
              icon="Plus"
              @click="() => emit('add', aportante.id)"
            />
          </TableCell>
        </TableRow>
        <!-- Filas hijas (aportes) -->
        <template v-if="expanded.includes(aportante.id)">
          <TableRow v-for="aporte in aportante.aportes" :key="aporte.id">
            <TableCell />
            <TableCell />
            <TableCell
              class="font-secondary text-gray-600 text-center dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ getNombreAccion(aporte) }}
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 text-center dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ aporte.accionesPorRecibir.toLocaleString() }}
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 text-center dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ formatMoneda(aporte.montoConvertido || aporte.monto, aporte.tipoMoneda) }}
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 text-center dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ formatFecha(aporte.fechaContribucion) }}
            </TableCell>
            <!-- Celda de acciones -->
            <TableCell class="w-12">
              <DataTableDropDown
                :item-id="aporte.id"
                :title-menu="props.titleMenu"
                :actions="getActionsForRow(aportante.id)"
              />
            </TableCell>
          </TableRow>
          <!-- Mensaje si no hay aportes -->
          <TableRow v-if="aportante.aportes.length === 0">
            <TableCell />
            <TableCell colspan="5" class="text-center py-8 text-gray-500">
              No hay aportes registrados para este aportante.
            </TableCell>
          </TableRow>
        </template>
      </template>
    </TableBody>
  </Table>

</template>

