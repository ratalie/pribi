<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { z } from "zod";
import { Upload } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
import { useAportesStore } from "../../../stores/useAportesStore";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import {
  accionIdSchema,
  accionesPorRecibirSchema,
  capitalSocialSchema,
  fechaContribucionSchema,
  montoSchema,
  premiumSchema,
  precioPorAccionSchema,
  reservaSchema,
  tasaCambioSchema,
  tipoMonedaSchema,
  totalPasivoSchema,
  porcentajePagadoSchema,
} from "../../../schemas/modalAporte";
import { UploadFileUseCase } from "~/core/shared/infrastructure/file-storage/application/use-cases/upload-file.use-case";
import { AwsFileStorageRepository } from "~/core/shared/infrastructure/file-storage/infrastructure/repositories/aws-file-storage.repository";
import { useRoute } from "vue-router";

interface Props {
  mode?: "crear" | "editar";
  accionistaId?: string | null;
  aporteId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "crear",
  accionistaId: null,
  aporteId: null,
});

const route = useRoute();
const aportesStore = useAportesStore();
const snapshotStore = useSnapshotStore();

// Obtener societyId del route
const societyId = computed(() => route.params.societyId as string);

// Repository y use case para subir archivos
const fileRepository = new AwsFileStorageRepository();
const uploadFileUseCase = new UploadFileUseCase(fileRepository);

// Estado para el archivo
const comprobanteFile = ref<File | null>(null);
const isUploadingFile = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Watcher para resetear campos cuando pagadoCompletamente cambia a true
watch(
  () => aportesStore.pagadoCompletamente,
  (newValue) => {
    if (newValue === true) {
      aportesStore.porcentajePagado = 0;
      aportesStore.totalPasivo = 0;
    }
  }
);

// Watcher para calcular montoConvertido cuando cambia monto o tasaCambio (si es USD)
watch(
  [() => aportesStore.monto, () => aportesStore.tasaCambio, () => aportesStore.tipoMoneda],
  ([monto, tasaCambio, tipoMoneda]) => {
    if (tipoMoneda === "USD" && tasaCambio > 0) {
      aportesStore.montoConvertido = monto * tasaCambio;
    } else if (tipoMoneda === "PEN") {
      aportesStore.montoConvertido = monto;
      aportesStore.tasaCambio = 1.0;
    }
  },
  { immediate: true }
);

// Watcher para calcular precioPorAccion cuando cambia monto o accionesPorRecibir
watch(
  [() => aportesStore.montoConvertido, () => aportesStore.accionesPorRecibir],
  ([montoConvertido, accionesPorRecibir]) => {
    if (accionesPorRecibir > 0 && montoConvertido > 0) {
      aportesStore.precioPorAccion = montoConvertido / accionesPorRecibir;
    }
  }
);

// Obtener opciones de acciones desde el snapshot
const accionesOptions = computed(() => {
  if (!snapshotStore.snapshot?.shareClasses) return [];

  return snapshotStore.snapshot.shareClasses.map((shareClass) => {
    let label = "";
    if (shareClass.tipo === "COMUN") {
      label = "Comunes";
    } else if (shareClass.tipo === "PREFERENTE_NO_VOTO") {
      label = "Preferentes sin voto";
    } else {
      // Para clases personalizadas, usar el nombre si existe
      label = shareClass.nombre || `Clase ${shareClass.tipo}`;
    }

    return {
      id: shareClass.id,
      value: shareClass.id,
      label,
    };
  });
});

// Obtener valor nominal desde el snapshot
const valorNominal = computed(() => {
  return snapshotStore.snapshot?.nominalValue || 0;
});

// Watcher para calcular capitalSocial y premium cuando cambian accionesPorRecibir o montoConvertido
watch(
  [() => aportesStore.accionesPorRecibir, () => valorNominal.value, () => aportesStore.montoConvertido],
  ([accionesPorRecibir, valorNom, montoConvertido]) => {
    if (accionesPorRecibir > 0 && valorNom > 0) {
      aportesStore.capitalSocial = accionesPorRecibir * valorNom;
      aportesStore.premium = Math.max(0, montoConvertido - aportesStore.capitalSocial);
    }
  }
);

// Watcher para calcular porcentajePagado y totalPasivo cuando NO está pagado completamente
watch(
  [() => aportesStore.pagadoCompletamente, () => aportesStore.montoConvertido, () => aportesStore.capitalSocial],
  ([pagadoCompletamente, montoConvertido, capitalSocial]) => {
    if (!pagadoCompletamente && montoConvertido > 0 && capitalSocial > 0) {
      // Calcular porcentaje pagado basado en el monto pagado vs capital social
      const montoPagado = montoConvertido; // Por ahora, asumimos que el monto es lo pagado
      aportesStore.porcentajePagado = Math.min(100, (montoPagado / capitalSocial) * 100);
      
      // Dividendo pasivo = capital social - monto pagado
      aportesStore.totalPasivo = Math.max(0, capitalSocial - montoPagado);
    } else if (pagadoCompletamente) {
      aportesStore.porcentajePagado = 100;
      aportesStore.totalPasivo = 0;
    }
  }
);

// Manejar selección de archivo
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  comprobanteFile.value = file;
  isUploadingFile.value = true;

  try {
    const uploadResponse = await uploadFileUseCase.execute(societyId.value, file);
    if (uploadResponse.data?.fileId) {
      aportesStore.comprobantePagoArchivoId = uploadResponse.data.fileId;
      aportesStore.comprobantePagoFile = file;
    }
  } catch (error) {
    console.error("[AporteForm] Error al subir archivo:", error);
  } finally {
    isUploadingFile.value = false;
  }
};

// Abrir selector de archivos
const openFilePicker = () => {
  fileInputRef.value?.click();
};

// Eliminar archivo
const removeFile = () => {
  comprobanteFile.value = null;
  aportesStore.comprobantePagoArchivoId = "";
  aportesStore.comprobantePagoFile = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

// Nombre del archivo seleccionado
const fileName = computed(() => {
  return comprobanteFile.value?.name || "";
});
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- Selector de Moneda (Top Right) -->
    <div class="flex justify-end gap-2">
      <Button
        :variant="aportesStore.tipoMoneda === 'PEN' ? 'primary' : 'outline'"
        size="sm"
        @click="aportesStore.tipoMoneda = 'PEN'"
      >
        Soles (S/)
      </Button>
      <Button
        :variant="aportesStore.tipoMoneda === 'USD' ? 'primary' : 'outline'"
        size="sm"
        @click="aportesStore.tipoMoneda = 'USD'"
      >
        Dólares ($)
      </Button>
    </div>

    <!-- Sección 1: Datos del Aporte -->
    <div class="flex flex-col gap-6">
      <h3 class="t-h4 font-primary text-gray-800 font-semibold">Datos del Aporte</h3>
      
      <div class="grid grid-cols-2 gap-12">
        <DateInputZod
          v-model="aportesStore.fechaContribucion"
          name="fecha_contribucion"
          label="Fecha del Aporte"
          placeholder="DD/MM/AAAA"
          :schema="fechaContribucionSchema"
        />
        
        <template v-if="aportesStore.tipoMoneda === 'PEN'">
          <NumberInputZod
            v-model="aportesStore.monto"
            name="monto_soles"
            label="Monto en Soles"
            placeholder="S/ Escribe aquí el monto"
            currency="PEN"
            format="decimal"
            :schema="montoSchema"
          />
        </template>
        
        <template v-else>
          <NumberInputZod
            v-model="aportesStore.tasaCambio"
            name="tasa_cambio"
            label="Tipo de Cambio"
            placeholder="S/ Escribe el tipo de cambio aquí"
            currency="PEN"
            format="decimal"
            :schema="tasaCambioSchema"
          />
          <NumberInputZod
            v-model="aportesStore.monto"
            name="monto_dolares"
            label="Monto en Dólares"
            placeholder="$ Escribe aquí el monto"
            currency="USD"
            format="decimal"
            :schema="montoSchema"
          />
          <NumberInputZod
            :model-value="aportesStore.montoConvertido"
            name="monto_convertido"
            label="Monto en Soles"
            placeholder="S/ Monto en Soles"
            currency="PEN"
            format="decimal"
            :schema="z.number().optional()"
            :disabled="true"
          />
        </template>
      </div>

      <!-- Comprobante de pago -->
      <div class="flex flex-col gap-2">
        <label class="t-t2 font-secondary text-gray-800 font-bold">
          Comprobante de pago del aporte
        </label>
        <div class="flex items-center gap-3">
          <div class="flex-1 border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2">
            <Upload class="w-4 h-4 text-gray-500" />
            <span v-if="fileName" class="text-sm text-gray-700">{{ fileName }}</span>
            <span v-else class="text-sm text-gray-500">Seleccionar</span>
          </div>
          <Button variant="primary" size="sm" @click="openFilePicker">
            Elegir archivo
          </Button>
          <input
            ref="fileInputRef"
            type="file"
            class="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            @change="handleFileSelect"
          />
          <Button
            v-if="fileName"
            variant="ghost"
            size="sm"
            @click="removeFile"
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>

    <!-- Sección 2: Detalles de las acciones -->
    <div class="flex flex-col gap-6">
      <h3 class="t-h4 font-primary text-gray-800 font-semibold">Detalles de las acciones</h3>
      
      <div class="grid grid-cols-2 gap-12">
        <SelectInputZod
          v-model="aportesStore.accionId"
          name="tipo_accion"
          label="Tipo de Acción"
          placeholder="Elegir tipo de acción"
          :options="accionesOptions"
          :schema="accionIdSchema"
        />
        
        <NumberInputZod
          v-model="aportesStore.accionesPorRecibir"
          name="acciones_por_recibir"
          label="Cantidad de Acciones a Recibir"
          placeholder="Escribe la cantidad aquí"
          :schema="accionesPorRecibirSchema"
        />
        
        <NumberInputZod
          :model-value="aportesStore.precioPorAccion"
          name="precio_por_accion"
          label="Precio pagado por acción"
          placeholder="S/ Precio Pagado por Acción"
          currency="PEN"
          format="decimal"
          :schema="precioPorAccionSchema"
          :disabled="true"
        />
      </div>
    </div>

    <!-- Sección 3: Pago del Capital Social -->
    <div class="flex flex-col gap-6">
      <h3 class="t-h4 font-primary text-gray-800 font-semibold">Pago del Capital Social</h3>
      
      <div class="grid grid-cols-2 gap-12">
        <NumberInputZod
          :model-value="aportesStore.capitalSocial"
          name="capital_social"
          label="Capital Social"
          placeholder="S/ Capital Social"
          currency="PEN"
          format="decimal"
          :schema="capitalSocialSchema"
          :disabled="true"
        />
        
        <NumberInputZod
          :model-value="aportesStore.premium"
          name="premium"
          label="Prima"
          placeholder="S/ Prima"
          currency="PEN"
          format="decimal"
          :schema="premiumSchema"
          :disabled="true"
        />
        
        <div class="flex justify-between gap-2 col-span-2">
          <div class="flex flex-col gap-2">
            <label class="t-t2 font-secondary text-gray-800 font-bold">
              ¿Todas las Acciones han sido pagadas al 100%?
            </label>
            <span class="t-b2 text-gray-500 font-secondary">
              Selecciona una de las dos opciones.
            </span>
          </div>
          <SimpleSwitchYesNo v-model="aportesStore.pagadoCompletamente" label="" />
        </div>
        
        <NumberInputZod
          v-if="!aportesStore.pagadoCompletamente"
          :model-value="aportesStore.porcentajePagado"
          name="porcentaje_pagado"
          label="Porcentaje Pagado por Acción"
          placeholder="% Porcentaje Pagado por Acción"
          :schema="porcentajePagadoSchema || z.number().optional()"
          :disabled="true"
        />
        
        <NumberInputZod
          v-if="!aportesStore.pagadoCompletamente"
          :model-value="aportesStore.totalPasivo"
          name="total_pasivo"
          label="Dividendo Pasivo Total"
          placeholder="% Dividendo Pasivo Total"
          :schema="totalPasivoSchema || z.number().optional()"
          :disabled="true"
        />
      </div>
    </div>
  </div>
</template>

