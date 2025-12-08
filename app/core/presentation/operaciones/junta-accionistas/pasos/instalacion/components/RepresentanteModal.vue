<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
import { z } from "zod";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

interface Props {
  isOpen: boolean;
  accionistaId: string | null;
  representanteData?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string | null;
  } | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  save: [representante: any];
}>();

// ========================================
// STATE
// ========================================
const formData = ref({
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  tipoDocumento: TipoDocumentosEnum.DNI,
  numeroDocumento: "",
});

// ========================================
// SCHEMAS (mismos que Sociedades)
// ========================================
const nombreSchema = z.string().min(2, "Mínimo 2 caracteres");
const apellidoSchema = z.string().min(2, "Mínimo 2 caracteres");
const numeroDocumentoSchema = z.string().min(8, "Documento inválido");

const tipoDocumentoOptions = [
  { id: 1, value: TipoDocumentosEnum.DNI, label: "DNI" },
  { id: 2, value: TipoDocumentosEnum.RUC, label: "RUC" },
  { id: 3, value: TipoDocumentosEnum.PASAPORTE, label: "Pasaporte" },
  { id: 4, value: TipoDocumentosEnum.CARNET_DE_EXTRANJERIA, label: "Carnet de Extranjería" },
];

// ========================================
// METHODS
// ========================================

/**
 * Guardar representante
 */
async function handleSave() {
  console.log("[RepresentanteModal] Guardando representante:", {
    accionistaId: props.accionistaId,
    formData: formData.value,
  });

  try {
    // TODO: Implementar guardado en backend
    // 1. Crear persona en backend
    // 2. Actualizar attendance con representedById
    
    emit("save", { ...formData.value });
    handleCancel();
    
    console.log("✅ [RepresentanteModal] Representante guardado");
  } catch (error) {
    console.error("❌ [RepresentanteModal] Error:", error);
  }
}

/**
 * Cancelar
 */
function handleCancel() {
  resetForm();
  emit("close");
}

/**
 * Reset form
 */
function resetForm() {
  formData.value = {
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    tipoDocumento: TipoDocumentosEnum.DNI,
    numeroDocumento: "",
  };
}

// Cargar datos cuando se abre el modal (para editar)
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.representanteData) {
    // Modo editar: cargar datos existentes
    // Convertir string a TipoDocumentosEnum si es necesario
    const tipoDoc = props.representanteData.tipoDocumento as TipoDocumentosEnum || TipoDocumentosEnum.DNI;
    formData.value = {
      nombre: props.representanteData.nombre || "",
      apellidoPaterno: props.representanteData.apellidoPaterno || "",
      apellidoMaterno: props.representanteData.apellidoMaterno || "",
      tipoDocumento: tipoDoc,
      numeroDocumento: props.representanteData.numeroDocumento || "",
    };
  } else if (!isOpen) {
    // Cerrar: resetear formulario
    resetForm();
  }
});
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => !val && emit('close')">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle class="t-h4 font-primary text-gray-800 font-semibold">
          {{ representanteData ? 'Editar Representante' : 'Agregar Representante' }}
        </DialogTitle>
        <DialogDescription class="t-t1 font-secondary text-gray-600">
          {{ representanteData ? 'Modifica los datos del representante.' : 'Registra quién será el representante.' }}
        </DialogDescription>
      </DialogHeader>

      <!-- FORMULARIO (mismos estilos que Sociedades) -->
      <div class="grid grid-cols-2 gap-6 py-6">
        <SelectInputZod
          v-model="formData.tipoDocumento"
          name="tipo_documento"
          label="Tipo de documento"
          placeholder="Selecciona el tipo de documento"
          :options="tipoDocumentoOptions"
          :schema="z.string()"
        />

        <SearchInputZod
          v-model="formData.numeroDocumento"
          name="numero_documento"
          label="Número de documento"
          placeholder="Ingrese número de documento"
          :schema="numeroDocumentoSchema"
        />

        <TextInputZod
          v-model="formData.nombre"
          name="nombre"
          label="Nombres"
          placeholder="Nombres"
          :schema="nombreSchema"
        />

        <TextInputZod
          v-model="formData.apellidoPaterno"
          name="apellido_paterno"
          label="Apellido paterno"
          placeholder="Apellido paterno"
          :schema="apellidoSchema"
        />

        <div class="col-span-2">
          <TextInputZod
            v-model="formData.apellidoMaterno"
            name="apellido_materno"
            label="Apellido materno"
            placeholder="Apellido materno"
            :schema="apellidoSchema"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleCancel">
          Cancelar
        </Button>
        <Button type="button" @click="handleSave">
          {{ representanteData ? 'Guardar cambios' : 'Agregar' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

