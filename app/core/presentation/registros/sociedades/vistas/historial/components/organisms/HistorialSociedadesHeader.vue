<template>
  <VistaHeader
    :icon="FileText"
    title="Registro de Sociedades"
    description="Gestiona aquí las sociedades: agrega, edita o elimina fácilmente"
  >
    <template #right>
      <div class="flex items-center gap-3">
        <ActionButton
          variant="primary"
          size="md"
          label="Crear Sociedad"
          :icon="Plus"
          button-class="shadow-md hover:shadow-lg transition-all"
          icon-class="h-4 w-4"
          label-class="ml-2"
          @click="$emit('create')"
        />
        <ActionButton
          v-if="showDeleteAll"
          variant="destructive"
          size="sm"
          label="Eliminar Todas"
          :icon="Trash2"
          button-class="text-white transition-colors"
          icon-class="h-4 w-4"
          label-class="ml-2"
          :disabled="isLoading"
          @click="$emit('delete-all')"
        />
      </div>
    </template>
  </VistaHeader>
</template>

<script setup lang="ts">
  import { FileText, Plus, Trash2 } from "lucide-vue-next";
  import VistaHeader from "~/core/presentation/shared/components/VistaHeader.vue";
  import ActionButton from "~/core/presentation/shared/components/molecules/ActionButton.vue";

  interface Props {
    showDeleteAll?: boolean;
    isLoading?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    showDeleteAll: false,
    isLoading: false,
  });

  defineEmits<{
    create: [];
    "delete-all": [];
  }>();
</script>




