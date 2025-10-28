<script setup lang="ts">
  import { useField } from "vee-validate";
  import { watch } from "vue";
  import type { ZodTypeAny } from "zod";
  import BaseInput from "../BaseInput.vue";

  interface Props {
    name: string;
    modelValue: string;
    label?: string;
    placeholder?: string;
    schema: ZodTypeAny;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

  const validateValue = (value: string) => {
    const res = props.schema.safeParse(value);
    return res.success ? true : res.error.issues[0]?.message ?? "Valor inválido";
  };

  const { value, errorMessage, meta, setTouched } = useField(props.name, validateValue, {
    initialValue: props.modelValue,
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      if (value.value !== newValue) value.value = newValue;
    }
  );

  watch(value, (newValue) => {
    if (props.modelValue !== newValue) emit("update:modelValue", newValue);
  });
</script>

<template>
  <div class="flex w-full justify-end flex-col relative">
    <div class="flex flex-col gap-5 w-full">
      <label v-if="label" :for="name" class="t-t2 font-primary text-gray-900 font-bold">
        {{ label }}
      </label>
      <div class="relative w-full">
        <BaseInput
          :id="name"
          v-model="value"
          type="date"
          :variant="errorMessage ? 'error' : 'default'"
          :size="'md'"
          :placeholder="placeholder"
          class="block"
          @blur="setTouched(true)"
        />
      </div>
    </div>
    <p v-if="meta.touched || errorMessage" class="t-t2 -bottom-7 pl-2 text-red-600 absolute">
      {{ errorMessage }}
    </p>
  </div>
</template>
