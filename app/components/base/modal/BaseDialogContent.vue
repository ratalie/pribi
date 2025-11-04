<script setup lang="ts">
  import { cn } from "@/lib/utils";
  import { reactiveOmit } from "@vueuse/core";
  import type { DialogContentEmits, DialogContentProps } from "reka-ui";
  import { DialogContent, DialogPortal, VisuallyHidden, useForwardPropsEmits } from "reka-ui";
  import type { HTMLAttributes } from "vue";
  import DialogDescription from "~/components/ui/dialog/DialogDescription.vue";
  import DialogOverlay from "~/components/ui/dialog/DialogOverlay.vue";
  import DialogTitle from "~/components/ui/dialog/DialogTitle.vue";

  const props = defineProps<
    DialogContentProps & {
      class?: HTMLAttributes["class"];
      a11yTitle?: string;
      a11yDescription?: string;
    }
  >();
  const emits = defineEmits<DialogContentEmits>();

  const delegatedProps = reactiveOmit(props, "class");

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent
      data-slot="dialog-content"
      v-bind="forwarded"
      :aria-describedby="props.a11yDescription ? 'base-dialog-desc' : undefined"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border shadow-lg duration-200 sm:max-w-lg',
          props.class
        )
      "
    >
      <!-- componentes de titulo ocultos para poder los nuestros q son custom -->
      <VisuallyHidden>
        <DialogTitle>{{ props.a11yTitle || "Modal" }}</DialogTitle>
      </VisuallyHidden>
      <VisuallyHidden v-if="props.a11yDescription">
        <DialogDescription id="base-dialog-desc">
          {{ props.a11yDescription }}
        </DialogDescription>
      </VisuallyHidden>
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
