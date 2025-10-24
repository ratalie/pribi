<script setup lang="ts">
  import type { ButtonVariants } from "~/components/ui/button";
  import Button from "~/components/ui/button/Button.vue";

  interface Props {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    icon?: string;
    iconPosition?: "left" | "right";
    label: string;
  }

  const props = defineProps<Props>();

  const getSizeIcon = () => {
    switch (props.size) {
      case "xl":
        return "size-5";
      default:
        return "size-4";
    }
  };
</script>

<template>
  <Button :variant="variant" :size="size">
    <component
      :is="getIcon(icon)"
      v-if="icon"
      :class="[getSizeIcon(), iconPosition === 'right' ? 'order-2' : 'order-1']"
    />

    <span :class="iconPosition === 'right' ? 'order-1' : 'order-2'">
      {{ label }}
    </span>
  </Button>
</template>
