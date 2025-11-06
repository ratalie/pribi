<script setup lang="ts">
  import { Form } from "vee-validate";
  import Dialog from "~/components/ui/dialog/Dialog.vue";
  import BaseDialogContent from "./BaseDialogContent.vue";

  interface Props {
    modelValue?: boolean;
    size?: "sm" | "md" | "lg";
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    size: "lg",
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit" | "invalidSubmit"): void;
  }>();

  const getSizeClasses = () => {
    switch (props.size) {
      case "sm":
        return "min-w-[400px]";
      case "md":
        return "min-w-[521px]";
      case "lg":
        return "min-w-[1042px]";
    }
  };

  const onOpenChange = (open: boolean) => {
    emit("update:modelValue", open);
    if (!open) emit("close");
  };
</script>

<template>
  <Dialog :open="modelValue" @update:open="onOpenChange">
    <BaseDialogContent :class="['flex flex-col max-h-[800px]', getSizeClasses()]">
      <Form @submit="emit('submit')" @invalid-submit="emit('invalidSubmit')">
        <div class="flex-1 min-h-0 max-h-[718px] px-14 py-16 overflow-auto">
          <slot />
        </div>

        <div class="flex items-center gap-3 h-[92px] min-h-[92px] shrink-0 border-t">
          <slot name="footer" />
        </div>
      </Form>
    </BaseDialogContent>
  </Dialog>
</template>
