<script setup lang="ts">
  import { cn } from "@/lib/utils";
  import { reactiveOmit } from "@vueuse/core";
  import { Check } from "lucide-vue-next";
  import type { CheckboxRootEmits, CheckboxRootProps } from "reka-ui";
  import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from "reka-ui";
  import type { HTMLAttributes } from "vue";

  interface Props extends CheckboxRootProps {
    class?: HTMLAttributes["class"];
    isDisabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isDisabled: false,
  });

  const emits = defineEmits<CheckboxRootEmits>();

  const delegatedProps = reactiveOmit(props, "class", "isDisabled");

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <CheckboxRoot
    data-slot="checkbox"
    v-bind="forwarded"
    :disabled="props.isDisabled"
    :class="
      cn(
        'peer border-gray-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border-2 shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="grid place-content-center text-current transition-none"
    >
      <slot>
        <Check class="size-3.5" stroke-width="3" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
