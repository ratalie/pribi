<script setup lang="ts">
  import { TrendingUp, Clock } from "lucide-vue-next";

  interface Props {
    ahorroEstimado?: number;
    isPlaceholder?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isPlaceholder: true,
  });
</script>

<template>
  <div
    class="bg-gradient-to-br from-primary-50 to-primary-100/50 border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
    style="
      border-color: var(--primary-200);
      border-radius: var(--radius-large);
    "
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          style="background-color: var(--primary-100)"
        >
          <TrendingUp class="w-5 h-5" style="color: var(--primary-700)" />
        </div>
        <h3
          class="text-sm font-semibold"
          style="
            color: var(--text-primary);
            font-family: var(--font-primary);
          "
        >
          Ahorro Estimado
        </h3>
      </div>
      <div
        v-if="props.isPlaceholder"
        class="px-2 py-1 rounded-full text-xs font-medium"
        style="
          background-color: var(--primary-100);
          color: var(--primary-700);
          font-family: var(--font-secondary);
        "
      >
        <Clock class="w-3 h-3 inline mr-1" />
        Próximamente
      </div>
    </div>

    <!-- Value -->
    <div v-if="!props.isPlaceholder && props.ahorroEstimado">
      <p
        class="text-3xl mb-1"
        style="
          color: var(--primary-800);
          font-family: var(--font-primary);
          font-weight: 700;
        "
      >
        S/ {{ props.ahorroEstimado.toLocaleString("es-PE") }}
      </p>
      <p
        class="text-xs"
        style="
          color: var(--text-muted);
          font-family: var(--font-secondary);
        "
      >
        Ahorro acumulado este año
      </p>
    </div>

    <!-- Placeholder Content -->
    <div v-else>
      <p
        class="text-2xl mb-2"
        style="
          color: var(--text-muted);
          font-family: var(--font-primary);
          font-weight: 600;
        "
      >
        --
      </p>
      <p
        class="text-xs"
        style="
          color: var(--text-muted);
          font-family: var(--font-secondary);
        "
      >
        El cálculo de ahorro estará disponible próximamente
      </p>
    </div>
  </div>
</template>




