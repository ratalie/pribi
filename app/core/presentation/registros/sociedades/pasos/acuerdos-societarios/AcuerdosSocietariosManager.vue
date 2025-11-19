<script setup lang="ts">
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import FileUploadDragDrop from "~/components/base/inputs/FileUploadDragDrop.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import { useAcuerdosSocietariosController } from "./composables/useAcuerdosSocietariosController";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  const props = defineProps<Props>();

  const { acuerdosSocietariosStore } = useAcuerdosSocietariosController(props.societyId ?? "");
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
                acuerdosSocietariosStore.showEstatutosSociales
                  ? 'text-gray-800 font-semibold'
                  : 'text-gray-500',
              ]"
            >
              Documentos que acrediten los Estatutos Sociales
            </span>
            <CustomSwitch
              :checked="acuerdosSocietariosStore.showEstatutosSociales"
              @update:checked="acuerdosSocietariosStore.showEstatutosSociales = $event"
            />
          </div>
        </template>
        <!-- v-if="showEstatutosSociales" -->
        <template v-if="acuerdosSocietariosStore.showEstatutosSociales" #content>
          <div class="py-12 px-10">
            <FileUploadDragDrop
              v-model="acuerdosSocietariosStore.estatutosSocialesFile"
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
                acuerdosSocietariosStore.showConvenioAccionistas
                  ? 'text-gray-800 font-semibold'
                  : 'text-gray-500',
              ]"
            >
              Documentos que acrediten los Convenios de Accionistas
            </span>
            <CustomSwitch
              :checked="acuerdosSocietariosStore.showConvenioAccionistas"
              @update:checked="acuerdosSocietariosStore.showConvenioAccionistas = $event"
            />
          </div>
        </template>

        <template v-if="acuerdosSocietariosStore.showConvenioAccionistas" #content>
          <div class="py-12 px-10">
            <FileUploadDragDrop
              v-model="acuerdosSocietariosStore.convenioAccionistasFile"
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
                acuerdosSocietariosStore.showAcuerdoTerceros
                  ? 'text-gray-800 font-semibold'
                  : 'text-gray-500',
              ]"
            >
              Documentos que acrediten los Acuerdos de Terceros
            </span>
            <CustomSwitch
              :checked="acuerdosSocietariosStore.showAcuerdoTerceros"
              @update:checked="acuerdosSocietariosStore.showAcuerdoTerceros = $event"
            />
          </div>
        </template>
        <template v-if="acuerdosSocietariosStore.showAcuerdoTerceros" #content>
          <div class="py-12 px-10">
            <FileUploadDragDrop
              v-model="acuerdosSocietariosStore.acuerdoTercerosFile"
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
            acuerdosSocietariosStore.derechoPreferente
              ? 'text-gray-800 font-semibold'
              : 'text-gray-500',
          ]"
        >
          Derecho de adquisición preferente ante fallecimiento del socio.
        </span>
        <CustomSwitch
          :checked="acuerdosSocietariosStore.derechoPreferente"
          @update:checked="acuerdosSocietariosStore.derechoPreferente = $event"
        />
      </SimpleCard>
    </div>
  </div>
</template>
