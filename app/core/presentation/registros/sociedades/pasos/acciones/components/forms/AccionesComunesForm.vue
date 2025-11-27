<script setup lang="ts">
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import FileUploadMultipleWithMetadata from "~/components/base/inputs/FileUploadMultipleWithMetadata.vue";
  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
  import { cantidadAccionesSchema, tipoAccionSchema } from "../../schemas/accionesComunes";
  import { useAccionesComunesStore } from "../../stores/useAccionesComunesStore";
  import { tipoAccionesUIEnum } from "../../types/enums/tipoAccionesEnum";

  interface Props {
    societyId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    societyId: "",
  });

  const accionesComunesStore = useAccionesComunesStore();

  const tipoAccionesOptions = [
    {
      id: TipoAccionEnum.COMUN,
      label: tipoAccionesUIEnum.COMUNES,
      value: TipoAccionEnum.COMUN,
    },
    {
      id: TipoAccionEnum.SIN_DERECHO_A_VOTO,
      label: tipoAccionesUIEnum.SIN_DERECHO_A_VOTO,
      value: TipoAccionEnum.SIN_DERECHO_A_VOTO,
    },
  ];
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex gap-10">
      <SelectInputZod
        v-model="accionesComunesStore.tipoAcciones"
        :options="tipoAccionesOptions"
        name="tipo-accion"
        label="Tipo de acción"
        placeholder="Tipo de acción"
        :schema="tipoAccionSchema"
      />

      <!-- Input: Cantidad de Acciones suscritas -->
      <NumberInputZod
        v-model="accionesComunesStore.cantidadAcciones"
        name="cantidad_acciones"
        label="Cantidad de Acciones suscritas"
        placeholder="Escribe la cantidad aquí"
        :schema="cantidadAccionesSchema"
      />
    </div>

    <!-- Switch: Redimibles -->
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col gap-2">
        <p class="font-secondary font-bold text-gray-800 t-t2">Redimibles</p>
        <p class="font-secondary font-semibold text-gray-400 t-b2">
          Selecciona una de las dos opciones.
        </p>
      </div>
      <SimpleSwitchYesNo v-model="accionesComunesStore.redimibles" />
    </div>

    <!-- Sección colapsable: Otros derechos especiales -->
    <div
      v-if="accionesComunesStore.tipoAcciones === TipoAccionEnum.SIN_DERECHO_A_VOTO"
      class="flex flex-col w-full border border-gray-300 rounded-lg"
    >
      <!-- Header con switch -->
      <div class="bg-white p-4 flex items-center justify-between rounded-lg">
        <div class="flex flex-col gap-1">
          <p class="font-secondary font-bold text-gray-800 t-t2">Otros derechos especiales</p>
          <p class="font-secondary font-semibold text-gray-400 t-b2">
            Suba los documentos que acredite los derechos especiales que tendrá esta acción
          </p>
        </div>
        <SimpleSwitchYesNo v-model="accionesComunesStore.otrosDerechosEspeciales" />
      </div>

      <!-- Contenido expandible con v-if -->
      <div
        v-if="accionesComunesStore.otrosDerechosEspeciales"
        class="bg-white p-1 rounded-b-lg"
      >
        <FileUploadMultipleWithMetadata
          v-if="props.societyId"
          :files-metadata="accionesComunesStore.metadataDerechosEspeciales"
          :society-id="props.societyId"
          click-message="Haz click o arrastra tus documentos"
          :max-files="10"
          :max-size-m-b="5"
          format-description=".docx, .pdf, max 5mb"
          custom-icon="heroicons:arrow-up-tray"
          @file-uploaded="accionesComunesStore.addDerechosEspecialesMetadata"
          @file-removed="accionesComunesStore.removeDerechosEspecialesMetadata"
        />
        <p v-else class="text-sm text-gray-500 p-4">
          Se requiere societyId para subir archivos
        </p>
      </div>
    </div>

    <!-- Sección colapsable: Régimen de obligaciones adicionales -->
    <div class="flex flex-col w-full border border-gray-300 rounded-lg">
      <!-- Header con switch -->
      <div class="bg-white p-4 flex items-center justify-between rounded-lg">
        <div class="flex flex-col gap-1">
          <p class="font-secondary font-bold text-gray-800 t-t2">
            Régimen de obligaciones adicionales
          </p>
          <p class="font-secondary font-semibold text-gray-400 t-b2">
            Suba los documentos que acredite las obligaciones adicionales que tendrá esta
            acción
          </p>
        </div>
        <SimpleSwitchYesNo v-model="accionesComunesStore.obligacionesAdicionales" />
      </div>

      <!-- Contenido expandible con v-if -->
      <div
        v-if="accionesComunesStore.obligacionesAdicionales"
        class="bg-white p-1 rounded-b-lg"
      >
        <FileUploadMultipleWithMetadata
          v-if="props.societyId"
          :files-metadata="accionesComunesStore.metadataObligaciones"
          :society-id="props.societyId"
          click-message="Haz click o arrastra tus documentos"
          :max-files="10"
          :max-size-m-b="5"
          format-description=".docx, .pdf, max 5mb"
          custom-icon="heroicons:arrow-up-tray"
          @file-uploaded="accionesComunesStore.addObligacionesMetadata"
          @file-removed="accionesComunesStore.removeObligacionesMetadata"
        />
        <p v-else class="text-sm text-gray-500 p-4">
          Se requiere societyId para subir archivos
        </p>
      </div>
    </div>

    <!-- Sección colapsable: Comentarios adicionales -->
    <div class="flex flex-col w-full border border-gray-300 rounded-lg">
      <!-- Header con switch -->
      <div class="bg-white p-4 flex items-center justify-between rounded-lg">
        <div class="flex flex-col gap-1">
          <p class="font-secondary font-bold text-gray-800 t-t2">Comentarios adicionales</p>
          <p class="font-secondary font-semibold text-gray-400 t-b2">
            Agrega observaciones complementarios relacionados con esta acción.
          </p>
        </div>
        <SimpleSwitchYesNo v-model="accionesComunesStore.comentariosAdicionales" />
      </div>

      <!-- Contenido expandible con v-if -->
      <div
        v-if="accionesComunesStore.comentariosAdicionales"
        class="bg-white p-1 rounded-b-lg"
      >
        <div class="flex flex-col gap-5">
          <!-- Textarea con estilos de Figma -->
          <div
            class="border-2 border-dashed border-primary-200 bg-gray-25 rounded flex flex-col gap-4 min-h-[100px] px-8 py-4"
          >
            <textarea
              v-model="accionesComunesStore.comentariosAdicionalesTexto"
              :maxlength="200"
              placeholder="Ej. certificado de emisión, acuerdo de directorio, acta de apertura"
              class="flex-1 bg-transparent border-none outline-none resize-none text-gray-700 font-secondary font-semibold t-b2 placeholder:text-gray-400"
              rows="4"
            />
            <!-- Contador de caracteres -->
            <div class="flex justify-end">
              <p class="font-secondary font-semibold text-gray-400 t-b2">
                {{ accionesComunesStore.comentariosAdicionalesTexto.length }}/200
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
