<script setup lang="ts">
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import FileUploadMultipleWithMetadata from "~/components/base/inputs/FileUploadMultipleWithMetadata.vue";
  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import {
    cantidadAccionesClaseSchema,
    nombreClaseAccionSchema,
  } from "../../schemas/clasesAcciones";
  import { useClasesAccionesStore } from "../../stores/useClasesAccionesStore";

  interface Props {
    societyId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    societyId: "",
  });

  const clasesAccionesStore = useClasesAccionesStore();
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex gap-10">
      <!-- Input: Nombre de la Clase de Acción -->
      <TextInputZod
        v-model="clasesAccionesStore.nombreClaseAccion"
        name="nombre_clase_accion"
        label="Nombre de la Clase de Acción"
        placeholder="Escribe la clase aquí"
        :schema="nombreClaseAccionSchema"
      />

      <!-- Input: Cantidad de Acciones suscritas -->
      <NumberInputZod
        v-model="clasesAccionesStore.cantidadAccionesClase"
        name="cantidad_acciones_clase"
        label="Cantidad de Acciones suscritas"
        placeholder="Escribe la cantidad aquí"
        :schema="cantidadAccionesClaseSchema"
      />
    </div>

    <!-- Switch: Con derecho a Voto -->
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col gap-2">
        <p class="font-secondary font-bold text-gray-800 t-t2">Con derecho a Voto</p>
        <p class="font-secondary font-semibold text-gray-400 t-b2">
          Selecciona una de las dos opciones.
        </p>
      </div>
      <SimpleSwitchYesNo v-model="clasesAccionesStore.conDerechoVoto" />
    </div>

    <!-- Switch: Redimibles -->
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col gap-2">
        <p class="font-secondary font-bold text-gray-800 t-t2">Redimibles</p>
        <p class="font-secondary font-semibold text-gray-400 t-b2">
          Selecciona una de las dos opciones.
        </p>
      </div>
      <SimpleSwitchYesNo v-model="clasesAccionesStore.redimiblesClase" />
    </div>

    <!-- Sección colapsable: Otros derechos especiales -->
    <div class="flex flex-col w-full border border-gray-300 rounded-lg">
      <!-- Header con switch -->
      <div class="bg-white p-4 flex items-center justify-between rounded-lg">
        <div class="flex flex-col gap-1">
          <p class="font-secondary font-bold text-gray-800 t-t2">Otros derechos especiales</p>
          <p class="font-secondary font-semibold text-gray-400 t-b2">
            Suba los documentos que acredite los derechos especiales que tendrá esta acción
          </p>
        </div>
        <SimpleSwitchYesNo v-model="clasesAccionesStore.otrosDerechosEspecialesClase" />
      </div>

      <!-- Contenido expandible con v-if -->
      <div
        v-if="clasesAccionesStore.otrosDerechosEspecialesClase"
        class="bg-white p-1 rounded-b-lg"
      >
        <FileUploadMultipleWithMetadata
          v-if="props.societyId"
          :files-metadata="clasesAccionesStore.metadataDerechosEspecialesClase"
          :society-id="props.societyId"
          click-message="Haz click o arrastra tus documentos"
          :max-files="10"
          :max-size-m-b="5"
          format-description=".docx, .pdf, max 5mb"
          custom-icon="heroicons:arrow-up-tray"
          @file-uploaded="clasesAccionesStore.addDerechosEspecialesClaseMetadata"
          @file-removed="clasesAccionesStore.removeDerechosEspecialesClaseMetadata"
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
        <SimpleSwitchYesNo v-model="clasesAccionesStore.obligacionesAdicionalesClase" />
      </div>

      <!-- Contenido expandible con v-if -->
      <div
        v-if="clasesAccionesStore.obligacionesAdicionalesClase"
        class="bg-white p-1 rounded-b-lg"
      >
        <FileUploadMultipleWithMetadata
          v-if="props.societyId"
          :files-metadata="clasesAccionesStore.metadataObligacionesClase"
          :society-id="props.societyId"
          click-message="Haz click o arrastra tus documentos"
          :max-files="10"
          :max-size-m-b="5"
          format-description=".docx, .pdf, max 5mb"
          custom-icon="heroicons:arrow-up-tray"
          @file-uploaded="clasesAccionesStore.addObligacionesClaseMetadata"
          @file-removed="clasesAccionesStore.removeObligacionesClaseMetadata"
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
        <SimpleSwitchYesNo v-model="clasesAccionesStore.comentariosAdicionales" />
      </div>

      <!-- Contenido expandible con v-if -->
      <div v-if="clasesAccionesStore.comentariosAdicionales" class="bg-white p-1 rounded-b-lg">
        <div class="flex flex-col gap-5">
          <!-- Textarea con estilos de Figma -->
          <div
            class="border-2 border-dashed border-primary-200 bg-gray-25 rounded flex flex-col gap-4 min-h-[100px] px-8 py-4"
          >
            <textarea
              v-model="clasesAccionesStore.comentariosAdicionalesTexto"
              :maxlength="200"
              placeholder="Ej. certificado de emisión, acuerdo de directorio, acta de apertura"
              class="flex-1 bg-transparent border-none outline-none resize-none text-gray-700 font-secondary font-semibold t-b2 placeholder:text-gray-400"
              rows="4"
            />
            <!-- Contador de caracteres -->
            <div class="flex justify-end">
              <p class="font-secondary font-semibold text-gray-400 t-b2">
                {{ clasesAccionesStore.comentariosAdicionalesTexto.length }}/200
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
