<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import FileUploadDragDrop from "~/components/base/inputs/FileUploadDragDrop.vue";
  // import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    // mode: EntityModeEnum;
    societyId?: string;
  }
  const uploadedFile = ref<File | null>(null);

  defineProps<Props>();
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle
      title="Acuerdos Societarios Especiales"
      body="Complete todos los campos requeridos."
    />
    <SimpleCard>
      <CardTitle title="Estatutos Sociales" body="Complete todos los campos requeridos." />
      <FileUploadDragDrop
        v-model="uploadedFile"
        variant="default"
        click-message="Haz click"
        drag-message="o arrastra el documento"
        format-description=".docx, .pdf (max 5 MB)"
      />
    </SimpleCard>
    <SimpleCard>
      <CardTitle
        title="Convenio de Accionistas"
        body="Complete todos los campos requeridos."
      />
      <FileUploadDragDrop
        v-model="uploadedFile"
        variant="default"
        click-message="Haz click"
        drag-message="o arrastra el documento"
        format-description=".docx, .pdf (max 5 MB)"
      />
    </SimpleCard>

    <SimpleCard>
      <CardTitle title="Acuerdo de Terceros" body="Complete todos los campos requeridos." />
      <FileUploadDragDrop
        v-model="uploadedFile"
        variant="default"
        click-message="Haz click"
        drag-message="o arrastra el documento"
        format-description=".docx, .pdf (max 5 MB)"
      />
    </SimpleCard>

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
</template>
