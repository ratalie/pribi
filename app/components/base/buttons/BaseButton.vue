<script setup lang="ts">
  import type { ButtonVariants } from "~/components/ui/button";
  import Button from "~/components/ui/button/Button.vue";

  interface Props {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
  }

  defineProps<Props>();
</script>

<template>
  <Button :variant="variant" :size="size">
    <slot />
  </Button>
</template>
