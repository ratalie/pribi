<script setup lang="ts">
  import ProboIcon from "~/components/base/ProboIcon.vue";

  interface Props {
    title: string;
    progress: { current: number; total: number };
    icon?: string;
  }

  defineProps<Props>();
</script>

<template>
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-[linear-gradient(135deg,#7257FF_0%,#2E2078_100%)] shadow-[0_0_6px_rgba(114,87,255,0.35)]"
    >
      <ProboIcon :name="icon || 'Users'" class="w-6 h-6 text-white" />
    </div>
    <div>
      <h3 class="text-sm font-primary font-semibold text-gray-900">
        {{ title }}
      </h3>
      <p class="text-xs font-secondary text-gray-600">
        Paso {{ progress.current }} de {{ progress.total }}
      </p>
    </div>
  </div>
</template>
