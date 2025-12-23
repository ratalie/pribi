<template>
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-[1600px] mx-auto px-8 py-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style="background: linear-gradient(135deg, var(--primary-700), var(--primary-500))"
          >
            <Building2 class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1
              class="text-3xl font-bold mb-1"
              style="
                color: var(--text-primary);
                font-family: var(--font-primary);
              "
            >
              Registro de Sociedades
            </h1>
            <p
              class="text-base"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              Gestiona aquí las sociedades: agrega, edita o elimina fácilmente
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            class="text-primary-700 border-primary-300 hover:bg-primary-50"
            @click="$emit('go-to-test')"
          >
            <TestTube class="h-4 w-4 mr-2" />
            Vista de Test
          </Button>
          <Button
            variant="primary"
            size="md"
            class="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            @click="$emit('create')"
          >
            <Plus class="w-4 h-4" />
            Crear Sociedad
          </Button>
          <Button
            v-if="showDeleteAll"
            variant="destructive"
            size="sm"
            class="text-white"
            :disabled="isLoading"
            @click="$emit('delete-all')"
          >
            <Trash2 class="h-4 w-4 mr-2" />
            Eliminar Todas
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building2, Plus, TestTube, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

interface Props {
  showDeleteAll?: boolean;
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  showDeleteAll: false,
  isLoading: false,
});

defineEmits<{
  "go-to-test": [];
  create: [];
  "delete-all": [];
}>();
</script>

