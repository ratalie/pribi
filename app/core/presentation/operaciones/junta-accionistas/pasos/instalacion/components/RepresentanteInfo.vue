<script setup lang="ts">
import { Info, MoreVertical } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface Props {
  representante: {
    nombre: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    numeroDocumento?: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [];
  remove: [];
}>();

const nombreCompleto = computed(() => {
  if (!props.representante) return "";
  const { nombre, apellidoPaterno, apellidoMaterno } = props.representante;
  return `${nombre} ${apellidoPaterno || ""} ${apellidoMaterno || ""}`.trim();
});
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Nombre del representante -->
    <span class="t-t2 font-secondary text-gray-700 font-medium">
      {{ nombreCompleto }}
    </span>
    
    <!-- Botón de info (opcional) -->
    <Button variant="ghost" size="xs" class="h-6 w-6 p-0">
      <Info class="h-4 w-4 text-gray-500" />
    </Button>
    
    <!-- Menú de acciones -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="xs" class="h-6 w-6 p-0">
          <MoreVertical class="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="emit('edit')">
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem @click="emit('remove')" class="text-red-600">
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

