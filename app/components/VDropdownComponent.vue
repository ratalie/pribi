<script lang="ts" setup>
  import { Check, Info } from "lucide-vue-next";

  interface Props {
    messageDropdown: string;
    titleDropdown?: string;
    isPreview?: boolean;
    buttonAddVisible?: boolean;
    tooltipClass?: string;
    isDisabled?: boolean;
    position?: string;
    containerClass?: string;
    titleClass?: string;
    messageClass?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    titleDropdown: undefined,
    isPreview: false,
    buttonAddVisible: true,
    tooltipClass: undefined,
    position: "right",
    containerClass: undefined,
    titleClass: undefined,
    messageClass: undefined,
  });
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits(["close"]);
</script>

<template>
  <VDropdown :placement="props.position" :distance="8" :triggers="['click']">
    <!-- Trigger del popper -->
    <button
      class="flex items-center gap-1"
      :disabled="props.isPreview"
      :class="$attrs.class"
      @click.stop
    >
      <Info
        :size="14"
        :class="[
          props.isDisabled ? ' opacity-50 text-gray-800' : 'cursor-pointer text-primary-700',
        ]"
      />
    </button>

    <!-- Contenido del popper -->
    <template #popper="{ hide }">
      <div
        :class="[
          'rounded-[4px] p-4 flex flex-col justify-between shadow-tooltip gap-4',
          props.tooltipClass ?? 'w-[215px]',
          props.containerClass ?? 'bg-white',
        ]"
        @click.stop
      >
        <p
          v-if="props.titleDropdown"
          :class="[
            't-t2 font-primary font-semibold text-gray-500 leading-snug',
            props.titleClass,
          ]"
        >
          {{ props.titleDropdown }}
        </p>
        <p :class="['t-t2 text-gray-500 font-secondary leading-snug', props.messageClass]">
          {{ props.messageDropdown }}
        </p>

        <!-- Botón Entendido -->
        <button
          v-if="props.buttonAddVisible"
          class="text-primary-600 t-t2 flex gap-2 items-center font-bold font-primary self-end"
          @click.stop="
            hide();
            emit('close');
          "
        >
          <Check :size="16" />
          Entendido
        </button>
      </div>
    </template>
  </VDropdown>
</template>
