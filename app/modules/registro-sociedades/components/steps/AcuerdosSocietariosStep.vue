<script setup lang="ts">
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import FileUploadDragDrop from "~/components/base/inputs/FileUploadDragDrop.vue";
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }
  const uploadedFile = ref<File | null>(null);
  const showEstatutosSociales = ref(false);
  const showConvenioAccionistas = ref(false);
  const showAcuerdoTerceros = ref(false);
  const derechoPreferente = ref(false);

  defineProps<Props>();
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle
      title="Acuerdos Societarios Especiales"
      body="Complete todos los campos requeridos."
    />
    <div class="flex flex-col gap-8">
      <span class="t-h5 text-gray-800 font-medium font-primary">Estatutos Sociales</span>
      <SimpleCardDropDown>
        <template #title>
          <div class="flex justify-between gap-2 py-12 px-10">
            <span
              :class="[
                't-t1 text-gray-600 font-medium font-secondary',
                showEstatutosSociales ? 'text-gray-800 font-semibold' : 'text-gray-500',
              ]"
            >
              Documentos que acrediten los Estatutos Sociales
            </span>
            <CustomSwitch
              :checked="showEstatutosSociales"
              @update:checked="showEstatutosSociales = $event"
            />
          </div>
        </template>
        <!-- v-if="showEstatutosSociales" -->
        <template v-if="showEstatutosSociales" #content>
          <div class="py-12 px-10">
            <FileUploadDragDrop
              v-model="uploadedFile"
              variant="default"
              click-message="Haz click"
              drag-message="o arrastra el documento"
              format-description=".docx, .pdf (max 5 MB)"
            />
          </div>
        </template>
      </SimpleCardDropDown>

      <span class="t-h5 text-gray-800 font-medium font-primary">Convenio de Accionistas</span>
      <SimpleCardDropDown>
        <template #title>
          <div class="flex justify-between gap-2 py-12 px-10">
            <span
              :class="[
                't-t1 text-gray-600 font-medium font-secondary',
                showConvenioAccionistas ? 'text-gray-800 font-semibold' : 'text-gray-500',
              ]"
            >
              Documentos que acrediten los Convenios de Accionistas
            </span>
            <CustomSwitch
              :checked="showConvenioAccionistas"
              @update:checked="showConvenioAccionistas = $event"
            />
          </div>
        </template>

        <template v-if="showConvenioAccionistas" #content>
          <div class="py-12 px-10">
            <FileUploadDragDrop
              v-model="uploadedFile"
              variant="default"
              click-message="Haz click"
              drag-message="o arrastra el documento"
              format-description=".docx, .pdf (max 5 MB)"
            />
          </div>
        </template>
      </SimpleCardDropDown>

      <span class="t-h5 text-gray-800 font-medium font-primary">Acuerdo de Terceros</span>
      <SimpleCardDropDown>
        <template #title>
          <div class="flex justify-between gap-2 py-12 px-10">
            <span
              :class="[
                't-t1 text-gray-600 font-medium font-secondary',
                showAcuerdoTerceros ? 'text-gray-800 font-semibold' : 'text-gray-500',
              ]"
            >
              Documentos que acrediten los Acuerdos de Terceros
            </span>
            <CustomSwitch
              :checked="showAcuerdoTerceros"
              @update:checked="showAcuerdoTerceros = $event"
            />
          </div>
        </template>
        <template v-if="showAcuerdoTerceros" #content>
          <div class="py-12 px-10">
            <FileUploadDragDrop
              v-model="uploadedFile"
              variant="default"
              click-message="Haz click"
              drag-message="o arrastra el documento"
              format-description=".docx, .pdf (max 5 MB)"
            />
          </div>
        </template>
      </SimpleCardDropDown>

      <span class="t-h5 text-gray-800 font-medium font-primary">Tipo de persona</span>
      <SimpleCard class="flex! flex-row! justify-between!">
        <span
          :class="[
            't-t1 text-gray-500 font-secondary',
            derechoPreferente ? 'text-gray-800 font-semibold' : 'text-gray-500',
          ]"
        >
          Derecho de adquisición preferente ante fallecimiento del socio.
        </span>
        <CustomSwitch
          :checked="derechoPreferente"
          @update:checked="derechoPreferente = $event"
        />
      </SimpleCard>
    </div>
  </div>
</template>
