<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div class="p-6 border-b border-gray-200">
      <h3
        class="text-lg font-semibold"
        style="
          color: var(--text-primary);
          font-family: var(--font-primary);
        "
      >
        Historial de Juntas
      </h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th
              class="text-left py-4 px-6 text-xs uppercase font-semibold"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              ID
            </th>
            <th
              class="text-left py-4 px-6 text-xs uppercase font-semibold"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              Estado
            </th>
            <th
              class="text-left py-4 px-6 text-xs uppercase font-semibold"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              Paso Actual
            </th>
            <th
              class="text-center py-4 px-6 text-xs uppercase font-semibold"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="junta in juntas"
            :key="junta.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="handleClick(junta.id)"
          >
            <td
              class="py-4 px-6 text-sm font-medium"
              style="
                color: var(--text-primary);
                font-family: var(--font-secondary);
              "
            >
              {{ junta.id }}
            </td>
            <td class="py-4 px-6">
              <EstadoBadge :estado="getEstado(junta)" />
            </td>
            <td
              class="py-4 px-6 text-sm"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              {{ junta.actual || "N/A" }}
            </td>
            <td class="py-4 px-6 text-center">
              <Button
                variant="ghost"
                size="sm"
                @click.stop="handleClick(junta.id)"
              >
                Ver
              </Button>
            </td>
          </tr>
          <tr v-if="juntas.length === 0">
            <td
              colspan="4"
              class="py-8 px-6 text-center text-sm"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              No hay juntas registradas para esta sociedad
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";
import EstadoBadge from "~/core/presentation/shared/components/molecules/EstadoBadge.vue";
import type { EstadoJunta } from "~/core/presentation/operaciones/junta-accionistas/vistas/historial/types/historial.types";

interface Props {
  juntas: JuntaResumenDTO[];
  selectedSocietyId: number | null;
  getEstado: (junta: JuntaResumenDTO) => EstadoJunta;
}

const props = defineProps<Props>();
const router = useRouter();

const handleClick = (juntaId: string) => {
  if (props.selectedSocietyId) {
    router.push(`/operaciones/sociedades/${props.selectedSocietyId}/junta-accionistas/${juntaId}/resumen`);
  }
};
</script>




