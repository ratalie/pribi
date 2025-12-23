<template>
  <div class="min-h-full bg-gray-50">
    <HistorialHeader
      :show-delete-all="sociedades.length > 0"
      :is-loading="isLoading"
      @go-to-test="goToTestPage"
      @create="handleCreate"
      @delete-all="handleDeleteAll"
    />

    <div class="max-w-[1600px] mx-auto px-8 py-10">
      <HistorialTable
        :data="sociedades"
        :is-loading="isLoading"
        :actions="tableActions"
        :get-estado="getEstado"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHistorialSociedades } from "../composables/useHistorialSociedades";
import HistorialHeader from "./organisms/HistorialHeader.vue";
import HistorialTable from "./organisms/HistorialTable.vue";

const {
  sociedades,
  isLoading,
  getEstado,
  goToTestPage,
  handleCreate,
  handleDeleteAll,
  tableActions,
} = useHistorialSociedades();
</script>

