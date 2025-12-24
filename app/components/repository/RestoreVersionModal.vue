<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-vue-next";

interface Props {
  isOpen: boolean;
  versionNumber: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const handleCancel = () => {
  emit("close");
};

const handleConfirm = () => {
  emit("confirm");
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => !val && handleCancel()">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <AlertTriangle class="w-5 h-5 text-amber-500" />
          Restaurar Esta Versión
        </DialogTitle>
        <DialogDescription class="pt-4">
          <p class="text-base">
            Esto restaurará el documento a la <strong>Versión {{ versionNumber }}</strong> y
            creará una nueva versión basada en el contenido de esa versión anterior.
          </p>
          <p class="text-sm text-gray-600 mt-3">
            Las versiones posteriores a la {{ versionNumber }} seguirán existiendo en el
            historial, pero la versión actual será reemplazada por el contenido de la
            versión {{ versionNumber }}.
          </p>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter class="gap-2 sm:gap-0">
        <Button variant="outline" @click="handleCancel">
          Cancelar
        </Button>
        <Button variant="default" @click="handleConfirm">
          Restaurar esta versión
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>


