<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCardAcuerdos from "~/components/base/cards/SimpleCardAcuerdos.vue";
  import FileUploadDragDrop from "~/components/base/inputs/FileUploadDragDrop.vue";
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  // import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    // mode: EntityModeEnum;
    societyId?: string;
  }
  const uploadedFile = ref<File | null>(null);
  const showEstatutosSociales = ref(false);
  const showConvenioAccionistas = ref(false);
  const showAcuerdoTerceros = ref(false);

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
      <SimpleCardAcuerdos>
        <template #title>
          <div class="flex justify-between gap-2">
            <span class="t-t1 text-gray-600 font-medium font-secondary">
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
          <FileUploadDragDrop
            v-model="uploadedFile"
            variant="default"
            click-message="Haz click"
            drag-message="o arrastra el documento"
            format-description=".docx, .pdf (max 5 MB)"
          />
        </template>
      </SimpleCardAcuerdos>

      <span class="t-h5 text-gray-800 font-medium font-primary">Convenio de Accionistas</span>
      <SimpleCardAcuerdos>
        <template #title>
          <div class="flex justify-between gap-2">
            <span class="t-t1 text-gray-600 font-medium font-secondary">
              Documentos que acrediten los Convenios de Accionistas
            </span>
            <CustomSwitch
              :checked="showConvenioAccionistas"
              @update:checked="showConvenioAccionistas = $event"
            />
          </div>
        </template>
  
        <template v-if="showConvenioAccionistas" #content>
          <FileUploadDragDrop
            v-model="uploadedFile"
            variant="default"
            click-message="Haz click"
            drag-message="o arrastra el documento"
            format-description=".docx, .pdf (max 5 MB)"
          />
        </template>
      </SimpleCardAcuerdos>
      
      <span class="t-h5 text-gray-800 font-medium font-primary">Acuerdo de Terceros</span>
      <SimpleCardAcuerdos>
        <template #title>
          <div class="flex justify-between gap-2">
            <span class="t-t1 text-gray-600 font-medium font-secondary">
              Documentos que acrediten los Acuerdos de Terceros
            </span>
            <CustomSwitch
              :checked="showAcuerdoTerceros"
              @update:checked="showAcuerdoTerceros = $event"
            />
          </div>
        </template>
        <template v-if="showAcuerdoTerceros" #content>
          <FileUploadDragDrop
            v-model="uploadedFile"
            variant="default"
            click-message="Haz click"
            drag-message="o arrastra el documento"
            format-description=".docx, .pdf (max 5 MB)"
          />
        </template>
      </SimpleCardAcuerdos>
      
      <div class="flex gap-2">
        <span class="t-t1 text-gray-800 font-medium flex flex-col gap-2">
          Tipo de persona
          <span class="t-t1 text-gray-500 font-secondary">
            Derecho de adquisición preferente ante fallecimiento del socio.
          </span>
        </span>
        <div class="flex gap-2">
          <ActionButton label="Sí" size="xs" variant="secondary_outline" />
          <ActionButton label="No" size="xs" variant="secondary_outline" />
        </div>
      </div>
    </div>
  </div>
</template>
