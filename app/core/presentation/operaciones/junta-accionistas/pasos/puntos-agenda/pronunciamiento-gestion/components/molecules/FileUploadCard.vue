<template>
  <SimpleCardDropDown variant="sm">
    <template #title>
      <div class="flex justify-between gap-2 items-center">
        <span
          :class="[
            't-t1 text-gray-600 font-medium font-secondary',
            enabled ? 'text-gray-800 font-semibold' : 'text-gray-500',
          ]"
        >
          {{ title }}
          <span v-if="enabled && files.length > 0" class="ml-2 text-primary-600">
            ({{ files.length }} archivo{{ files.length !== 1 ? "s" : "" }})
          </span>
        </span>
        <SimpleSwitchYesNo :model-value="enabled" @update:model-value="$emit('toggle')" />
      </div>
    </template>
    <template v-if="enabled" #content>
      <FileUploadMultipleWithMetadata
        v-if="societyId"
        :society-id="societyId"
        :files-metadata="files"
        :click-message="clickMessage"
        :max-files="maxFiles"
        :max-size-m-b="maxSizeMB"
        :format-description="formatDescription"
        :custom-icon="customIcon"
        @file-uploaded="$emit('file-uploaded', $event)"
        @file-removed="$emit('file-removed', $event)"
      />
      <p v-else class="text-sm text-gray-500 p-4">Se requiere societyId para subir archivos</p>
    </template>
  </SimpleCardDropDown>
</template>

<script setup lang="ts">
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import FileUploadMultipleWithMetadata from "~/components/base/inputs/FileUploadMultipleWithMetadata.vue";
  import type { FileMetadata } from "../../stores/usePronunciamientoStore";

  interface Props {
    title: string;
    enabled: boolean;
    files: FileMetadata[];
    societyId?: string;
    clickMessage?: string;
    maxFiles?: number;
    maxSizeMB?: number;
    formatDescription?: string;
    customIcon?: string;
  }

  withDefaults(defineProps<Props>(), {
    clickMessage: "Haz click o arrastra tus documentos",
    maxFiles: 10,
    maxSizeMB: 5,
    formatDescription: ".pdf, .docx, .xlsx, max 5mb",
    customIcon: "heroicons:arrow-up-tray",
  });

  defineEmits<{
    toggle: [];
    "file-uploaded": [metadata: FileMetadata];
    "file-removed": [fileId: string];
  }>();
</script>
