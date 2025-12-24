<template>
  <div class="min-h-full bg-gray-50">
    <HistorialHeader
      :selected-society-id="selectedSocietyId"
      @create="handleCreate"
    />

    <div class="max-w-[1600px] mx-auto px-8 py-10">
      <div class="space-y-6">
        <!-- Selector de Sociedades -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <SociedadSelector
            :sociedades="sociedades"
            :selected-society-id="selectedSocietyId"
            :is-loading="isLoadingSociedades"
            @update:selected-society-id="handleSocietyChange"
          />
        </div>

        <!-- Tabla de Juntas -->
        <HistorialTable
          v-if="selectedSocietyId"
          :data="juntas"
          :is-loading="isLoading"
          :actions="tableActions"
          :get-estado="getEstado"
          :get-fecha-junta="getFechaJunta"
          :get-nombre-junta="getNombreJunta"
          :get-tipo-junta="getTipoJunta"
        />

        <!-- Empty State -->
        <div
          v-else
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
        >
          <History class="w-16 h-16 mx-auto mb-4" style="color: var(--text-muted)" />
          <h3
            class="text-xl font-semibold mb-2"
            style="
              color: var(--text-primary);
              font-family: var(--font-primary);
            "
          >
            Selecciona una sociedad
          </h3>
          <p
            class="text-sm"
            style="
              color: var(--text-muted);
              font-family: var(--font-secondary);
            "
          >
            Elige una sociedad del selector para ver su histórico de juntas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { History } from "lucide-vue-next";
import { useHistorialJuntas } from "../composables/useHistorialJuntas";
import HistorialHeader from "./organisms/HistorialHeader.vue";
import HistorialTable from "./organisms/HistorialTable.vue";
import SociedadSelector from "~/core/presentation/shared/components/molecules/SociedadSelector.vue";

const {
  sociedades,
  juntas,
  isLoading,
  isLoadingSociedades,
  selectedSocietyId,
  getEstado,
  getFechaJunta,
  getNombreJunta,
  getTipoJunta,
  handleSocietyChange,
  handleCreate,
  tableActions,
} = useHistorialJuntas();
</script>




