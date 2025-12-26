<script setup lang="ts">
  import { Upload } from "lucide-vue-next";
  import { computed, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import { z } from "zod";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import { Button } from "~/components/ui/button";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import { useCapitalizacionesStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/stores/useCapitalizacionesStore";
  import { UploadFileUseCase } from "~/core/shared/infrastructure/file-storage/application/use-cases/upload-file.use-case";
  import { AwsFileStorageRepository } from "~/core/shared/infrastructure/file-storage/infrastructure/repositories/aws-file-storage.repository";
  import {
    accionIdSchema,
    accionesPorRecibirSchema,
    capitalSocialSchema,
    fechaContribucionSchema,
    montoSchema,
    porcentajePagadoSchema,
    precioPorAccionSchema,
    premiumSchema,
    tasaCambioSchema,
    totalPasivoSchema,
  } from "../../schemas/modalAporte";
  import { useAportesStore } from "../../stores/useAportesStore";

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
  const capitalizacionesStore = useCapitalizacionesStore();
  const snapshotStore = useSnapshotStore();

  // ✅ Detectar si estamos en capitalización de créditos
  const isCapitalizacion = computed(() => {
    return route.path.includes("capitalizacion-creditos");
  });

  // ✅ Computed properties individuales para v-model (necesario porque v-model no puede usar computed directamente)
  const tipoMoneda = computed({
    get: () =>
      isCapitalizacion.value ? capitalizacionesStore.tipoMoneda : aportesStore.tipoMoneda,
    set: (value) => {
      if (isCapitalizacion.value) {
        capitalizacionesStore.tipoMoneda = value;
      } else {
        aportesStore.tipoMoneda = value;
      }
    },
  });

  const fechaContribucion = computed({
    get: () =>
      isCapitalizacion.value
        ? capitalizacionesStore.fechaContribucion
        : aportesStore.fechaContribucion,
    set: (value) => {
      if (isCapitalizacion.value) {
        capitalizacionesStore.fechaContribucion = value;
      } else {
        aportesStore.fechaContribucion = value;
      }
    },
  });

  const monto = computed({
    get: () => (isCapitalizacion.value ? capitalizacionesStore.monto : aportesStore.monto),
    set: (value) => {
      if (isCapitalizacion.value) {
        capitalizacionesStore.monto = value;
      } else {
        aportesStore.monto = value;
      }
    },
  });

  const tasaCambio = computed({
    get: () =>
      isCapitalizacion.value ? capitalizacionesStore.tasaCambio : aportesStore.tasaCambio,
    set: (value) => {
      if (isCapitalizacion.value) {
        capitalizacionesStore.tasaCambio = value;
      } else {
        aportesStore.tasaCambio = value;
      }
    },
  });

  const accionId = computed({
    get: () =>
      isCapitalizacion.value ? capitalizacionesStore.accionId : aportesStore.accionId,
    set: (value) => {
      if (isCapitalizacion.value) {
        capitalizacionesStore.accionId = value;
      } else {
        aportesStore.accionId = value;
      }
    },
  });

  const accionesPorRecibir = computed({
    get: () =>
      isCapitalizacion.value
        ? capitalizacionesStore.accionesPorRecibir
        : aportesStore.accionesPorRecibir,
    set: (value) => {
      if (isCapitalizacion.value) {
        capitalizacionesStore.accionesPorRecibir = value;
      } else {
        aportesStore.accionesPorRecibir = value;
      }
    },
  });

  const pagadoCompletamente = computed({
    get: () =>
      isCapitalizacion.value
        ? capitalizacionesStore.pagadoCompletamente
        : aportesStore.pagadoCompletamente,
    set: (value) => {
      if (isCapitalizacion.value) {
        capitalizacionesStore.pagadoCompletamente = value;
      } else {
        aportesStore.pagadoCompletamente = value;
      }
    },
  });

  // ✅ Helper para obtener el store correcto (para watchers y otras operaciones)
  const getCurrentStore = () => {
    return isCapitalizacion.value ? capitalizacionesStore : aportesStore;
  };

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
    () => {
      const store = getCurrentStore();
      return store.pagadoCompletamente;
    },
    (newValue) => {
      if (newValue === true) {
        const store = getCurrentStore();
        store.porcentajePagado = 0;
        store.totalPasivo = 0;
      }
    }
  );

  // Watcher para calcular montoConvertido cuando cambia monto o tasaCambio (si es USD)
  watch(
    () => {
      const store = getCurrentStore();
      return [store.monto, store.tasaCambio, store.tipoMoneda];
    },
    ([monto, tasaCambio, tipoMoneda]) => {
      const store = getCurrentStore();
      if (tipoMoneda === "USD" && tasaCambio > 0) {
        store.montoConvertido = monto * tasaCambio;
      } else if (tipoMoneda === "PEN") {
        store.montoConvertido = monto;
        store.tasaCambio = 1.0;
      }
    },
    { immediate: true }
  );

  // Watcher para calcular precioPorAccion cuando cambia monto o accionesPorRecibir
  watch(
    () => {
      const store = getCurrentStore();
      return [store.montoConvertido, accionesPorRecibir.value];
    },
    ([montoConvertido, accionesPorRecibirVal]) => {
      if (accionesPorRecibirVal > 0 && montoConvertido > 0) {
        const store = getCurrentStore();
        store.precioPorAccion = montoConvertido / accionesPorRecibirVal;
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
    () => {
      const store = getCurrentStore();
      return [accionesPorRecibir.value, valorNominal.value, store.montoConvertido];
    },
    ([accionesPorRecibirVal, valorNom, montoConvertido]) => {
      if (accionesPorRecibirVal > 0 && valorNom > 0) {
        const store = getCurrentStore();
        store.capitalSocial = accionesPorRecibirVal * valorNom;
        store.premium = Math.max(0, montoConvertido - store.capitalSocial);
      }
    }
  );

  // Watcher para calcular porcentajePagado y totalPasivo cuando NO está pagado completamente
  watch(
    () => {
      const store = getCurrentStore();
      return [pagadoCompletamente.value, store.montoConvertido, store.capitalSocial];
    },
    ([pagadoCompletamenteVal, montoConvertido, capitalSocial]) => {
      const store = getCurrentStore();
      if (!pagadoCompletamenteVal && montoConvertido > 0 && capitalSocial > 0) {
        // Calcular porcentaje pagado basado en el monto pagado vs capital social
        const montoPagado = montoConvertido; // Por ahora, asumimos que el monto es lo pagado
        store.porcentajePagado = Math.min(100, (montoPagado / capitalSocial) * 100);

        // Dividendo pasivo = capital social - monto pagado
        store.totalPasivo = Math.max(0, capitalSocial - montoPagado);
      } else if (pagadoCompletamenteVal) {
        store.porcentajePagado = 100;
        store.totalPasivo = 0;
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
        const store = getCurrentStore();
        store.comprobantePagoArchivoId = uploadResponse.data.fileId;
        store.comprobantePagoFile = file;
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
    const store = getCurrentStore();
    store.comprobantePagoArchivoId = "";
    store.comprobantePagoFile = null;
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
        :variant="tipoMoneda === 'PEN' ? 'primary' : 'outline'"
        size="sm"
        @click="tipoMoneda = 'PEN'"
      >
        Soles (S/)
      </Button>
      <Button
        :variant="tipoMoneda === 'USD' ? 'primary' : 'outline'"
        size="sm"
        @click="tipoMoneda = 'USD'"
      >
        Dólares ($)
      </Button>
    </div>

    <!-- Sección 1: Datos del Aporte -->
    <div class="flex flex-col gap-6">
      <h3 class="t-h4 font-primary text-gray-800 font-semibold">Datos del Aporte</h3>

      <div class="grid grid-cols-2 gap-12">
        <DateInputZod
          v-model="fechaContribucion"
          name="fecha_contribucion"
          label="Fecha del Aporte"
          placeholder="DD/MM/AAAA"
          :schema="fechaContribucionSchema"
        />

        <template v-if="tipoMoneda === 'PEN'">
          <NumberInputZod
            v-model="monto"
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
            v-model="tasaCambio"
            name="tasa_cambio"
            label="Tipo de Cambio"
            placeholder="S/ Escribe el tipo de cambio aquí"
            currency="PEN"
            format="decimal"
            :schema="tasaCambioSchema"
          />
          <NumberInputZod
            v-model="monto"
            name="monto_dolares"
            label="Monto en Dólares"
            placeholder="$ Escribe aquí el monto"
            currency="USD"
            format="decimal"
            :schema="montoSchema"
          />
          <NumberInputZod
            :model-value="getCurrentStore().montoConvertido"
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
          <div
            class="flex-1 border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2"
          >
            <Upload class="w-4 h-4 text-gray-500" />
            <span v-if="fileName" class="text-sm text-gray-700">{{ fileName }}</span>
            <span v-else class="text-sm text-gray-500">Seleccionar</span>
          </div>
          <Button variant="primary" size="sm" @click="openFilePicker">Elegir archivo</Button>
          <input
            ref="fileInputRef"
            type="file"
            class="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            @change="handleFileSelect"
          />
          <Button v-if="fileName" variant="ghost" size="sm" @click="removeFile">
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
          v-model="accionId"
          name="tipo_accion"
          label="Tipo de Acción"
          placeholder="Elegir tipo de acción"
          :options="accionesOptions"
          :schema="accionIdSchema"
        />

        <NumberInputZod
          v-model="accionesPorRecibir"
          name="acciones_por_recibir"
          label="Cantidad de Acciones a Recibir"
          placeholder="Escribe la cantidad aquí"
          :schema="accionesPorRecibirSchema"
        />

        <NumberInputZod
          :model-value="getCurrentStore().precioPorAccion"
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
          :model-value="getCurrentStore().capitalSocial"
          name="capital_social"
          label="Capital Social"
          placeholder="S/ Capital Social"
          currency="PEN"
          format="decimal"
          :schema="capitalSocialSchema"
          :disabled="true"
        />

        <NumberInputZod
          :model-value="getCurrentStore().premium"
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
          <SimpleSwitchYesNo v-model="pagadoCompletamente" label="" />
        </div>

        <NumberInputZod
          v-if="!pagadoCompletamente"
          :model-value="getCurrentStore().porcentajePagado"
          name="porcentaje_pagado"
          label="Porcentaje Pagado por Acción"
          placeholder="% Porcentaje Pagado por Acción"
          :schema="porcentajePagadoSchema || z.number().optional()"
          :disabled="true"
        />

        <NumberInputZod
          v-if="!pagadoCompletamente"
          :model-value="getCurrentStore().totalPasivo"
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
