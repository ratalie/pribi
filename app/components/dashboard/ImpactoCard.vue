<script setup lang="ts">
  import { computed } from "vue";
  import { ArrowRight, TrendingUp, TrendingDown } from "lucide-vue-next";

  interface Props {
    label: string;
    valorAntes: string | number;
    valorDespues: string | number;
    incremento?: number; // Porcentaje
    color?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    color: "var(--primary-700)",
  });

  const isPositive = computed(() => {
    if (props.incremento === undefined) return null;
    return props.incremento > 0;
  });
</script>

<template>
  <div
    class="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all"
    style="
      border-color: var(--border-default);
      border-radius: var(--radius-large);
    "
  >
    <!-- Label -->
    <p
      class="text-sm mb-4"
      style="
        color: var(--text-secondary);
        font-family: var(--font-secondary);
        font-weight: 500;
      "
    >
      {{ props.label }}
    </p>

    <!-- Valores -->
    <div class="flex items-center gap-4">
      <!-- Antes -->
      <div class="flex-1">
        <p
          class="text-xs mb-1"
          style="
            color: var(--text-muted);
            font-family: var(--font-secondary);
          "
        >
          Antes
        </p>
        <p
          class="text-xl"
          style="
            color: var(--text-primary);
            font-family: var(--font-primary);
            font-weight: 600;
          "
        >
          {{ props.valorAntes }}
        </p>
      </div>

      <!-- Arrow -->
      <ArrowRight class="w-5 h-5 flex-shrink-0" style="color: var(--text-muted)" />

      <!-- Después -->
      <div class="flex-1">
        <p
          class="text-xs mb-1"
          style="
            color: var(--text-muted);
            font-family: var(--font-secondary);
          "
        >
          Después
        </p>
        <div class="flex items-center gap-2">
          <p
            class="text-xl"
            :style="{
              color: isPositive === true ? '#10B981' : isPositive === false ? '#EF4444' : 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
            }"
          >
            {{ props.valorDespues }}
          </p>
          <div
            v-if="props.incremento !== undefined"
            class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            :style="{
              backgroundColor: isPositive ? '#10B98120' : '#EF444420',
              color: isPositive ? '#10B981' : '#EF4444',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            <TrendingUp
              v-if="isPositive"
              class="w-3 h-3"
            />
            <TrendingDown
              v-else
              class="w-3 h-3"
            />
            {{ isPositive ? "+" : "" }}{{ props.incremento }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

