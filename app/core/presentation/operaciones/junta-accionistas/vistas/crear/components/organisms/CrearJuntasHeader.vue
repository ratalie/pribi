<template>
  <VistaHeader
    :icon="Users"
    title="Crear Nueva Junta de Accionistas"
    description="Inicia el proceso guiado para crear una nueva junta de accionistas"
  >
    <template #right>
      <Button
        variant="primary"
        size="lg"
        class="shadow-lg hover:shadow-xl transition-all font-semibold px-8 py-2.5"
        :disabled="isSubmitting || !canStart"
        @click="handleStartFlow"
        style="
          background: linear-gradient(135deg, var(--primary-800), var(--primary-600));
          font-family: var(--font-secondary);
          font-weight: 600;
        "
      >
        <LoaderCircle v-if="isSubmitting" class="mr-2 h-5 w-5 animate-spin" />
        <Play v-else class="mr-2 h-5 w-5" />
        Iniciar Proceso
      </Button>
    </template>
  </VistaHeader>
</template>

<script setup lang="ts">
  import { Users, Play, LoaderCircle } from "lucide-vue-next";
  import VistaHeader from "~/core/presentation/shared/components/VistaHeader.vue";
  import { Button } from "@/components/ui/button";

  interface Props {
    isSubmitting: boolean;
    canStart: boolean;
  }

  defineProps<Props>();

  const emit = defineEmits<{
    start: [];
  }>();

  const handleStartFlow = () => {
    emit("start");
  };
</script>
