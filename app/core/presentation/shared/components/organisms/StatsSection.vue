<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <StatCard
      v-for="stat in stats"
      :key="stat.label"
      :label="stat.label"
      :value="stat.value"
      :icon="stat.icon"
      :color="stat.color"
    />
  </div>
</template>

<script setup lang="ts">
import StatCard from "../molecules/StatCard.vue";
import type { Stat } from "../../types/stat.types";

interface Props {
  stats: Stat[];
}

defineProps<Props>();
</script>




