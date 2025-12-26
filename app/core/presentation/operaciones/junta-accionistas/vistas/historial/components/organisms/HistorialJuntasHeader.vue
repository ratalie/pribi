<template>
  <VistaHeader :icon="FileText" :title="title" :description="description">
    <template #right>
      <div class="flex items-center gap-3">
        <ActionButton
          variant="primary"
          size="lg"
          label="Agregar Junta"
          :icon="Plus"
          button-class="shadow-lg hover:shadow-xl transition-all font-semibold px-8 py-2.5"
          icon-class="h-5 w-5"
          label-class="ml-2"
          @click="$emit('create')"
        />
      </div>
    </template>
  </VistaHeader>
</template>

<script setup lang="ts">
  import { FileText, Plus } from "lucide-vue-next";
  import VistaHeader from "~/core/presentation/shared/components/VistaHeader.vue";
  import ActionButton from "~/core/presentation/shared/components/molecules/ActionButton.vue";

  interface Props {
    title: string;
    description: string;
  }

  defineProps<Props>();

  defineEmits<{
    create: [];
  }>();
</script>


