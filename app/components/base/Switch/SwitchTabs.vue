<script setup lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

  interface Props {
    opcionA: string;
    opcionB: string;
    variant?: "default" | "primary";
    isDisabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "default",
    isDisabled: false,
  });

  const modelValue = defineModel<string>({ default: "opcion-a" });

  const handleUpdate = (value: string | number) => {
    // Bloquear la actualización si está deshabilitado
    if (props.isDisabled) {
      return;
    }
    modelValue.value = String(value);
  };
</script>

<template>
  <Tabs
    class="w-full! rounded-full!"
    :model-value="modelValue"
    default-value="opcion-a"
    @update:model-value="handleUpdate"
  >
    <TabsList
      :class="[
        'w-full rounded-full h-[48px] p-[6px]',
        props.variant === 'primary' ? 'bg-primary-700' : 'bg-gray-100',
        props.isDisabled ? 'cursor-not-allowed' : '',
      ]"
    >
      <TabsTrigger
        value="opcion-a"
        :disabled="props.isDisabled"
        :class="[
          'rounded-full',
          props.variant === 'primary'
            ? 'data-[state=active]:bg-primary-500 data-[state=active]:text-white text-gray-300'
            : 'data-[state=active]:bg-primary-75 data-[state=active]:text-primary-700 text-gray-600',
          props.isDisabled ? 'cursor-not-allowed' : '',
        ]"
      >
        {{ props.opcionA }}
      </TabsTrigger>
      <TabsTrigger
        value="opcion-b"
        :disabled="props.isDisabled"
        :class="[
          'rounded-full',
          props.variant === 'primary'
            ? 'data-[state=active]:bg-primary-500 data-[state=active]:text-white text-gray-300'
            : 'data-[state=active]:bg-primary-75 data-[state=active]:text-primary-700 text-gray-600',
          props.isDisabled ? 'cursor-not-allowed' : '',
        ]"
      >
        {{ props.opcionB }}
      </TabsTrigger>
    </TabsList>
    <TabsContent value="opcion-a">
      <slot name="opcion-a" />
    </TabsContent>
    <TabsContent value="opcion-b">
      <slot name="opcion-b" />
    </TabsContent>
  </Tabs>
</template>
