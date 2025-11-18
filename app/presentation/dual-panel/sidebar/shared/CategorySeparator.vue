<script setup lang="ts">
interface Props {
  label: string;
  marginBottom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  marginBottom: 8,
});

const separatorStyle = computed(() => ({
  marginBottom: `${props.marginBottom}px`,
}));
</script>

<template>
  <div class="ml-[35px]" :style="separatorStyle">
    <h4 class="font-secondary text-xs font-medium leading-[1.5] text-[#676472]">
      {{ label }}
    </h4>
  </div>
</template>
