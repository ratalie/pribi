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
        Sociedades Registradas
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
              Razón Social
            </th>
            <th
              class="text-left py-4 px-6 text-xs uppercase font-semibold"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              RUC
            </th>
            <th
              class="text-left py-4 px-6 text-xs uppercase font-semibold"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              Tipo
            </th>
            <th
              class="text-center py-4 px-6 text-xs uppercase font-semibold"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="sociedad in sociedades"
            :key="sociedad.idSociety"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="handleClick(sociedad.idSociety)"
          >
            <td
              class="py-4 px-6 text-sm font-medium"
              style="
                color: var(--text-primary);
                font-family: var(--font-secondary);
              "
            >
              {{ sociedad.razonSocial || "Sociedad sin nombre" }}
            </td>
            <td
              class="py-4 px-6 text-sm"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              {{ sociedad.ruc || "N/A" }}
            </td>
            <td
              class="py-4 px-6 text-sm"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              {{ sociedad.tipoSocietario || "N/A" }}
            </td>
            <td class="py-4 px-6 text-center">
              <EstadoBadge :estado="getEstado(sociedad)" />
            </td>
          </tr>
          <tr v-if="sociedades.length === 0">
            <td
              colspan="4"
              class="py-8 px-6 text-center text-sm"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              No hay sociedades registradas aún
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";
import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
import EstadoBadge from "~/core/presentation/shared/components/molecules/EstadoBadge.vue";
import type { EstadoSociedad } from "~/core/presentation/registros/sociedades/vistas/historial/types/historial.types";

interface Props {
  sociedades: SociedadResumenDTO[];
  getEstado: (sociedad: SociedadResumenDTO) => EstadoSociedad;
}

defineProps<Props>();

const emit = defineEmits<{
  "sociedad-click": [id: string];
}>();

const handleClick = (id: string) => {
  emit("sociedad-click", id);
};
</script>




