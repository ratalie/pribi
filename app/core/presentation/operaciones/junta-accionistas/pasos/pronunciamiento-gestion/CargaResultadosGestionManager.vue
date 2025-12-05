<script setup lang="ts">
  import { ref } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import FileUploadDragDrop from "~/components/base/inputs/FileUploadDragDrop.vue";
  import BaseInput from "~/components/base/inputs/text/BaseInput.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";

  // Estados para los switches
  const memoriaAnualEnabled = ref(false);

  // Estados financieros por defecto
  const estadosFinancieros = ref([
    { id: 1, nombre: "Balance General", enabled: false },
    { id: 2, nombre: "Estado de resultados", enabled: false },
  ]);

  // Estado del modal
  const isModalOpen = ref(false);
  const nombreEstadoFinanciero = ref("");

  // Función para abrir el modal
  const agregarEstadoFinanciero = () => {
    isModalOpen.value = true;
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    isModalOpen.value = false;
    nombreEstadoFinanciero.value = "";
  };

  // Función para crear el nuevo estado financiero
  const crearEstadoFinanciero = () => {
    if (!nombreEstadoFinanciero.value.trim()) {
      return;
    }

    const nuevoId = Math.max(...estadosFinancieros.value.map((e) => e.id), 0) + 1;
    estadosFinancieros.value.push({
      id: nuevoId,
      nombre: nombreEstadoFinanciero.value.trim(),
      enabled: false,
    });

    cerrarModal();
  };
</script>

<template>
  <div class="flex flex-col gap-10">
    <!-- Memoria Anual -->
    <div class="flex flex-col gap-4">
      <p class="t-h5 text-gray-800 font-primary">Memoria Anual</p>
      <SimpleCardDropDown variant="sm">
        <template #title>
          <div class="flex justify-between gap-2 items-center">
            <span
              :class="[
                't-t1 text-gray-600 font-medium font-secondary',
                memoriaAnualEnabled ? 'text-gray-800 font-semibold' : 'text-gray-500',
              ]"
            >
              Suba los documentos que acredite la memoria anual
            </span>
            <SimpleSwitchYesNo v-model="memoriaAnualEnabled" />
          </div>
        </template>
        <template v-if="memoriaAnualEnabled" #content>
          <FileUploadDragDrop
            variant="default"
            click-message="Haz click"
            drag-message="o arrastra tus documentos"
            format-description="– máx. 5 MB (.pdf, .docx, .xlsx)"
          />
        </template>
      </SimpleCardDropDown>
    </div>

    <!-- Estados Financieros -->
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <p class="t-h5 text-gray-800 font-primary">Estados Financieros</p>
        <ActionButton
          label="Agregar otro estado financiero"
          variant="secondary"
          icon="Plus"
          icon-position="left"
          class="py-[16px] px-[24px]"
          @click="agregarEstadoFinanciero"
        />
      </div>

      <SimpleCard>
        <div class="flex flex-col gap-6">
          <div
            v-for="estado in estadosFinancieros"
            :key="estado.id"
            class="flex flex-col gap-4"
          >
            <p class="t-h6 text-gray-800 font-secondary">{{ estado.nombre }}</p>
            <SimpleCardDropDown variant="sm">
              <template #title>
                <div class="flex justify-between gap-2 items-center">
                  <span
                    :class="[
                      't-t1 text-gray-600 font-medium font-secondary',
                      estado.enabled ? 'text-gray-800 font-semibold' : 'text-gray-500',
                    ]"
                  >
                    Suba los documentos que acredite el {{ estado.nombre.toLowerCase() }}
                  </span>
                  <SimpleSwitchYesNo v-model="estado.enabled" />
                </div>
              </template>
              <template v-if="estado.enabled" #content>
                <FileUploadDragDrop
                  variant="default"
                  click-message="Haz click"
                  drag-message="o arrastra tus documentos"
                  format-description="– máx. 5 MB (.pdf, .docx, .xlsx)"
                />
              </template>
            </SimpleCardDropDown>
          </div>
        </div>
      </SimpleCard>
    </div>

    <!-- Modal para agregar estado financiero -->
    <BaseModal
      v-model="isModalOpen"
      size="xs"
      @close="cerrarModal"
      @submit="crearEstadoFinanciero"
    >
      <div class="flex flex-col gap-6">
        <CardTitle
          title="Agregar Estado Financiero"
          body="Ingresa el nombre del estado financiero."
        />

        <div class="flex flex-col gap-2">
          <p class="t-t2 text-gray-800 font-secondary">Estado Financiero</p>
          <BaseInput
            id="estado-financiero-input"
            v-model="nombreEstadoFinanciero"
            placeholder="Estado de Flujo Efectivo"
            size="md"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-center gap-3 w-full">
          <ActionButton
            variant="primary_outline"
            label="Cancelar"
            size="md"
            @click="cerrarModal"
          />
          <ActionButton
            type="submit"
            variant="primary"
            label="Crear"
            size="md"
            :is-disabled="!nombreEstadoFinanciero.trim()"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>
