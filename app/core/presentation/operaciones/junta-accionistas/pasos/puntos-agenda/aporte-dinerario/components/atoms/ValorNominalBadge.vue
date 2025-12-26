<template>
  <div class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
    <Coins class="w-5 h-5 text-yellow-600" />
    <span class="t-t2 font-secondary text-gray-800 font-semibold">
      Valor Nominal: S/
      {{
        valorNominal.toLocaleString("es-PE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import { Coins } from "lucide-vue-next";

  interface Props {
    valorNominal: number;
  }

  defineProps<Props>();
</script>




