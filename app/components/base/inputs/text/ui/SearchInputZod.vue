<script setup lang="ts">
  import { useField } from "vee-validate";
  import { watch } from "vue";
  import type { ZodTypeAny } from "zod";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import BaseInput from "../BaseInput.vue";

  interface Props {
    name: string;
    modelValue: string;
    label?: string;
    placeholder?: string;
    schema: ZodTypeAny;
    isLoading?: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: "update:modelValue" | "search", v: string): void;
  }>();

  const validateValue = (value: string) => {
    const res = props.schema.safeParse(value);
    return res.success ? true : res.error.issues[0]?.message ?? "Valor inválido";
  };

  const { value, errorMessage, meta, setTouched, validate } = useField(
    props.name,
    validateValue,
    {
      initialValue: props.modelValue,
    }
  );

  watch(
    () => props.modelValue,
    (newValue) => {
      if (value.value !== newValue) value.value = newValue;
    }
  );

  watch(value, (newValue) => {
    if (props.modelValue !== newValue) emit("update:modelValue", newValue);
  });

  const handleSearch = () => {
    const res = props.schema.safeParse(value.value);
    if (res.success) {
      emit("search", value.value);
    } else {
      //si existe un error de validacion, marcar el campo como tocado y valida
      setTouched(true);
      validate();
    }
  };
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
          variant="default"
          :size="'md'"
          :placeholder="placeholder"
          @blur="setTouched(true)"
        />
        <BaseButton
          type="button"
          variant="secondary"
          class="h-10 w-10 p-0 absolute right-0 top-1/2 -translate-y-1/2 rounded-l-none"
          :disabled="isLoading"
          @click="handleSearch"
        >
          <component
            :is="isLoading ? getIcon('LoaderCircle') : getIcon('Search')"
            v-if="isLoading ? getIcon('LoaderCircle') : getIcon('Search')"
            :class="isLoading ? 'animate-spin' : ''"
          />
        </BaseButton>
      </div>
    </div>
    <p v-if="meta.touched || errorMessage" class="t-t2 -bottom-7 pl-2 text-red-600 absolute">
      {{ errorMessage }}
    </p>
  </div>
</template>
