<template>
  <SlotWrapper>
    <div class="flex items-center gap-2">
      <TitleH2
        title="Designación de auditores externo"
        subtitle="Decida si la sociedad contará con auditores externos y cómo se designarán."
        title-color="text-primary-800"
      />
      <Switch v-model="tieneAuditores" />
      <VDropdownComponent
        message-dropdown="Puede activar o desactivar este paso según la preferencia de la sociedad. Si no se desea tratar, manténgalo desactivado."
        :button-add-visible="true"
      />
    </div>

    <div
      v-if="!tieneAuditores"
      class="flex flex-col w-full h-auto items-center justify-center self-center overflow-hidden"
    >
      <img :src="noAuditoresImage" alt="No auditores" class="w-64 h-48 object-contain mb-8" />
      <p class="t-t1 text-gray-600 font-primary text-center font-semibold mb-1">
        Este paso está desactivado
      </p>
      <p class="t-b2 text-gray-400 font-secondary text-center">
        Si decides incluirlo, puedes activarlo en la parte superior.
      </p>
    </div>

    <div v-else class="flex flex-col gap-10">
      <div class="flex flex-col gap-4">
        <p class="t-h5 text-gray-800 font-primary">Responsables de la designación</p>
        <div class="flex gap-8">
          <div
            v-for="responsable in responsables"
            :key="responsable.id"
            @click="responsableSeleccionado = responsable.id"
            :class="[
              'relative w-full rounded-xl border-2 p-6 cursor-pointer transition-all duration-200',
              'flex items-center justify-between',
              responsableSeleccionado === responsable.id
                ? 'border-primary-700 shadow-md bg-primary-25'
                : 'border-gray-200 hover:border-primary-300 bg-white',
            ]"
          >
            <!-- Contenido de texto -->
            <h3
              :class="[
                't-2 font-semibold font-secondary',
                responsableSeleccionado === responsable.id
                  ? 'text-primary-700'
                  : 'text-gray-800',
              ]"
            >
              {{ responsable.title }}
            </h3>
            <!-- Checkmark circular -->
            <div
              :class="[
                'shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
                responsableSeleccionado === responsable.id
                  ? 'bg-primary-700'
                  : 'bg-white border-2 border-gray-400',
              ]"
            >
              <svg
                v-if="responsableSeleccionado === responsable.id"
                class="w-2.5 h-2.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Auditor Externo (solo si se selecciona Junta de accionistas) -->
      <div v-if="responsableSeleccionado === 'junta'" class="flex flex-col gap-4">
        <p class="t-h5 text-gray-800 font-primary">Auditor Externo</p>
        <SimpleCard>
          <div class="flex flex-col gap-5 w-full">
            <label
              for="nombre-apellidos-auditor"
              class="t-t2 font-secondary text-gray-800 font-bold"
            >
              Nombre y Apellidos
            </label>
            <BaseInput
              id="nombre-apellidos-auditor"
              v-model="nombreAuditor"
              placeholder="Ingrese el nombre aquí"
              size="md"
            />
          </div>
        </SimpleCard>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import noAuditoresImage from "~/assets/img/no-directorio.jpeg";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import BaseInput from "~/components/base/inputs/text/BaseInput.vue";
  import Switch from "~/components/ui/switch/Switch.vue";
  import VDropdownComponent from "~/components/VDropdownComponent.vue";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const tieneAuditores = ref(false);
  const responsableSeleccionado = ref("");
  const nombreAuditor = ref("");

  const responsables = [
    {
      id: "junta",
      title: "Junta de accionistas",
    },
    {
      id: "directorio",
      title: "Directorio",
    },
  ];
</script>
