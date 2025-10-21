
```vue
// InputTextCustomisableWithIcon
<template>
  <div class="flex flex-col gap-spc-5 pb-7 relative">
    <div class="flex flex-col gap-4">
      <HeaderInputText :title="title" :body="body || ''" :disabled-body="isDisabled" />
      <div class="relative w-full">
        <input
          type="text"
          :value="valueInput"
          :id="idx"
          @input="handleInput"
          :disabled="isDisabled"
          :placeholder="placeholder"
          @blur="handleBlur"
          :class="[
            'w-full',
            'px-4 py-spc-14',
            'border rounded-lg border-layout-gray-700',
            'text-t2 text-layout-gray-700 font-semibold font-secondary',
            'focus:outline focus:outline-2 focus:outline-violet-600 focus:outline-offset-4 focus:ring-1 focus:ring-layout-gray-500 focus:border-layout-gray-500',
            isMessageError ? '!border-red-500' : '',
            inputClass,
            isDisabled ? '!bg-layout-gray-200' : 'bg-inherit',
          ]"
        />
        <button
          v-if="!isDisabled"
          :disabled="isLoading"
          class="w-spc-43 h-spc-42 rounded-r-lg bg-layout-gray-900 absolute right-0 top-0 flex justify-center items-center disabled:opacity-70"
          @click="handleClick"
        >
          <SearchIcons v-if="!isLoading" />
          <LoaderIcon v-else :style="{ stroke: '#FFFFFF' }" />
        </button>
      </div>
    </div>
    <Transition name="fade">
      <p
        v-if="isMessageError"
        class="pl-2 -bottom-0.5 text-b1 text-red-600 absolute font-primary"
      >
        {{ errorMessage }}
      </p>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import { ValidateFormInputText } from "./input-text.interface";
  import { useInputTextValidation } from "./input-text";
  import HeaderInputText from "./HeaderInputText.vue";
  import { ref, watch } from "vue";
  import SearchIcons from "@/assets/vueIcons/SearchIcons.vue";
  import LoaderIcon from "@/assets/vueIcons/LoaderIcon.vue";

  interface Props {
    modelValue: string;
    inputClass?: string;
    placeholder?: string;
    idx?: string;
    isDisabled?: boolean;
    title: string;
    body?: string;
    onChange?: (value: string) => void;
    validateInputForm?: (value: string) => ValidateFormInputText;
    handleSearch: (value: string) => Promise<void>;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(["update:modelValue"]);

  const valueInput = ref<string>(props.modelValue);
  const isLoading = ref<boolean>(false);

  const { isMessageError, errorMessage, validateForm } = useInputTextValidation(
    () => props.modelValue,
    props.validateInputForm
  );

  // handleInput
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target) return;
    valueInput.value = target.value;
    emit("update:modelValue", target.value);
  };

  const handleBlur = () => {
    validateForm();
  };

  const handleClick = async () => {
    // valueInput = empty
    if (!valueInput.value.trim()) return;

    try {
      isLoading.value = true;
      await props.handleSearch(valueInput.value);
    } catch (error) {
      console.error("Error en handleSearch:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // input = [0-9]
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue === "" || newValue === null) {
        valueInput.value = "";
      } else if (newValue) {
        valueInput.value = newValue.replace(/[^0-9]/g, "");
      }
    }
  );
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>

```


