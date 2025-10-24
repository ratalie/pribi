<script setup lang="ts">
  import type { ButtonVariants } from "~/components/ui/button";
  import Button from "~/components/ui/button/Button.vue";

  interface Props {
    variant?: ButtonVariants["variant"];
  }

  defineProps<Props>();
</script>

<template>
  <Button :variant="variant">
    <slot />
  </Button>
</template>
