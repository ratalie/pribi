<script setup lang="ts">
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { useVModel } from "@vueuse/core";
  import clsx from "clsx";
  import { ChevronDown } from "lucide-vue-next";

  export interface CascadeSelectOption {
    id: string | number;
    value: string | number;
    label: string;
    icon?: string; // Nombre del ícono Lucide
    disabled?: boolean;
    children?: CascadeSelectOption[];
  }

  interface Props {
    id: string;
    modelValue: string;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    placeholder?: string;
    customClasses?: string;
    options?: CascadeSelectOption[];
    isDisabled?: boolean;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", payload: string | number): void;
    (e: "blur"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const isOpen = ref(false);

  // Encontrar la opción seleccionada (incluyendo en children)
  const selectedOption = computed(() => {
    const findOption = (options: CascadeSelectOption[]): CascadeSelectOption | null => {
      for (const option of options) {
        if (option.value.toString() === modelValue.value) {
          return option;
        }
        if (option.children) {
          const found = findOption(option.children);
          if (found) return found;
        }
      }
      return null;
    };
    return props.options ? findOption(props.options) : null;
  });

  const displayValue = computed(() => {
    return selectedOption.value?.label || props.placeholder || "Seleccionar...";
  });

  const triggerClasses = computed(() =>
    clsx(
      // Estilos base
      "w-full flex items-center justify-between !border-gray-500 bg-background",
      "rounded-md border px-3 py-2 text-sm font-secondary",
      "focus:outline-none focus:ring-2 focus:ring-[var(--color-outline-ring)] focus:ring-offset-2",
      "transition-colors",

      // Placeholder vs valor seleccionado
      !selectedOption.value && "text-gray-400",
      selectedOption.value && "text-gray-700",

      // Variantes
      props.variant === "error" && "!border-red-500 focus:!border-red-500 focus:!ring-red-500",
      props.variant === "success" &&
        "!border-green-500 focus:!border-green-500 focus:!ring-green-500",

      // Tamaños
      props.size === "sm" && "h-8 text-xs",
      props.size === "md" && "!h-[40px] text-sm",
      props.size === "lg" && "h-12 text-base",

      // Deshabilitado
      props.isDisabled &&
        "disabled:!bg-gray-200 disabled:!cursor-not-allowed disabled:!opacity-100 cursor-not-allowed opacity-60",

      props.customClasses
    )
  );

  const handleSelect = (value: string | number) => {
    modelValue.value = value.toString();
    isOpen.value = false;
    emits("blur");
  };

  const handleOpenChange = (open: boolean) => {
    isOpen.value = open;
    if (!open) {
      emits("blur");
    }
  };
</script>

<template>
  <DropdownMenu v-model:open="isOpen" @update:open="handleOpenChange">
    <DropdownMenuTrigger :id="props.id" :class="triggerClasses" :disabled="props.isDisabled">
      <span class="flex-1 text-left truncate">{{ displayValue }}</span>
      <ChevronDown
        :class="[
          'size-4 shrink-0 transition-transform',
          isOpen && 'rotate-180',
          props.isDisabled && 'opacity-50',
        ]"
      />
    </DropdownMenuTrigger>

    <DropdownMenuContent
      class="w-(--reka-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto"
      align="start"
    >
      <template v-for="option in props.options" :key="option.id">
        <!-- Opción simple (sin children) -->
        <DropdownMenuItem
          v-if="!option.children || option.children.length === 0"
          class="flex items-center gap-3 px-4 py-2 cursor-pointer font-secondary text-gray-700 text-sm hover:bg-primary-50 focus:bg-primary-50"
          :class="{
            'bg-primary-50': modelValue === option.value.toString(),
            'opacity-50 cursor-not-allowed': option.disabled,
          }"
          :disabled="option.disabled"
          @click="!option.disabled && handleSelect(option.value)"
        >
          <component
            :is="getIcon(option.icon)"
            v-if="option.icon"
            class="size-4 shrink-0 text-gray-700"
          />
          <span>{{ option.label }}</span>
        </DropdownMenuItem>

        <!-- Opción con submenú -->
        <DropdownMenuSub v-else>
          <DropdownMenuSubTrigger
            class="flex items-center gap-3 px-4 py-2 cursor-pointer font-secondary text-gray-700 text-sm hover:bg-primary-50 focus:bg-primary-50"
            :class="{
              'opacity-50 cursor-not-allowed': option.disabled,
            }"
            :disabled="option.disabled"
          >
            <component
              :is="getIcon(option.icon)"
              v-if="option.icon"
              class="size-4 shrink-0 text-gray-700"
            />
            <span>{{ option.label }}</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent class="max-h-[200px] overflow-y-auto">
            <DropdownMenuItem
              v-for="child in option.children"
              :key="child.id"
              class="flex items-center gap-3 px-4 py-2 cursor-pointer font-secondary text-gray-700 text-sm hover:bg-primary-50 focus:bg-primary-50"
              :class="{
                'bg-primary-50': modelValue === child.value.toString(),
                'opacity-50 cursor-not-allowed': child.disabled,
              }"
              :disabled="child.disabled"
              @click="!child.disabled && handleSelect(child.value)"
            >
              <component
                :is="getIcon(child.icon)"
                v-if="child.icon"
                class="size-4 shrink-0 text-gray-700"
              />
              <span>{{ child.label }}</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
