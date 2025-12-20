<template>
  <div :id="anchorId" class="flex flex-col gap-4">
    <p class="t-h5 text-gray-800 font-primary">{{ title }}</p>
    <SimpleCard>
      <slot />
    </SimpleCard>
  </div>
</template>

<script setup lang="ts">
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";

  interface Props {
    title: string;
    anchorId?: string;
  }

  defineProps<Props>();
</script>
