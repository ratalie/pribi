<script setup lang="ts">
  import Dialog from "~/components/ui/dialog/Dialog.vue";
  import BaseDialogContent from "./BaseDialogContent.vue";

  interface Props {
    modelValue?: boolean;
    size?: "md" | "lg";
  }

  withDefaults(defineProps<Props>(), {
    modelValue: false,
    size: "md",
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close"): void;
  }>();

  const onOpenChange = (open: boolean) => {
    emit("update:modelValue", open);
    if (!open) emit("close");
  };
</script>

<template>
  <Dialog :open="modelValue" @update:open="onOpenChange">
    <BaseDialogContent class="flex flex-col min-w-[1042px] max-h-[800px]">
      <div class="flex-1 min-h-0 px-14 py-16 overflow-auto">
        <slot />
      </div>

      <div class="flex items-center gap-3 h-[92px] min-h-[92px] shrink-0 border-t">
        <slot name="footer" />
      </div>
    </BaseDialogContent>
  </Dialog>
</template>
