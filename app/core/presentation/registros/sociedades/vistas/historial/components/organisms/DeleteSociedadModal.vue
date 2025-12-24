<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="text-xl font-semibold">
          Confirmar eliminación
        </DialogTitle>
        <DialogDescription class="text-base mt-2">
          <div class="space-y-3">
            <p>
              ¿Estás seguro de que deseas eliminar la sociedad
              <strong class="text-primary-700">{{ razonSocial }}</strong>?
            </p>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-sm text-yellow-800">
                <strong>Advertencia:</strong> Esta acción eliminará todos los datos asociados a esta sociedad, incluyendo:
              </p>
              <ul class="list-disc list-inside mt-2 text-sm text-yellow-700 space-y-1">
                <li>Datos de la sociedad</li>
                <li>Accionistas y asignaciones</li>
                <li>Directorio y apoderados</li>
                <li>Juntas de accionistas relacionadas</li>
                <li>Todos los documentos generados</li>
              </ul>
              <p class="text-sm font-semibold text-yellow-800 mt-3">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2">
        <Button
          variant="outline"
          :disabled="isLoading"
          @click="handleClose"
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          :disabled="isLoading"
          @click="handleConfirm"
        >
          <LoaderCircle
            v-if="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          />
          Eliminar Sociedad
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  razonSocial: string;
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const handleClose = () => {
  emit("update:isOpen", false);
  emit("cancel");
};

const handleConfirm = () => {
  emit("confirm");
};
</script>

