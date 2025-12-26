<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Selector de Sociedades -->
      <SocietySelector />
      
      <!-- Dashboard -->
      <RepositoryDashboard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RepositoryDashboard } from "@/components/repository";
import SocietySelector from "~/components/repository/SocietySelector.vue";

useHead({
  title: "Dashboard - Repositorio - PROBO",
});
</script>

