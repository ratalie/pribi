<template>
  <SlotWrapper>
    <div class="flex flex-col gap-10">
      <!-- Switch y subtítulo -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <p class="t-h5 text-primary-800 font-primary font-semibold">
            Configurar cantidad de directores
          </p>
          <Switch v-model="configurarDirectorio" />
          <VDropdownComponent
            message-dropdown="Activa o desactiva la votación para la configuración del directorio. Si se activa, se creará una sesión de votación para aprobar esta configuración."
            :button-add-visible="true"
          />
        </div>
        <p class="t-b2 text-gray-600 font-secondary">
          Establece la cantidad de directores del directorio para esta junta.
        </p>
      </div>

      <!-- Estado vacío cuando el switch está en false -->
      <DirectorioEmptyState v-if="!configurarDirectorio" />

      <!-- Formulario cuando el switch está en true -->
      <SimpleCard v-if="configurarDirectorio">
        <Form :validation-schema="schema" @submit="handleSubmit">
          <div class="flex flex-col gap-4">
            <SelectInputZod
              v-model="form.cantidadDirectores"
              name="cantidad-directores"
              label="Cantidad de Directores"
              placeholder="Seleccione la cantidad"
              :options="cantidadDirectoresOptions"
              :schema="cantidadDirectoresSchema"
            />
          </div>
        </Form>
      </SimpleCard>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { z } from "zod";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import Switch from "~/components/ui/switch/Switch.vue";
  import VDropdownComponent from "~/components/VDropdownComponent.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { useDirectoryConfigurationStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/stores/useDirectoryConfigurationStore";
  import DirectorioEmptyState from "~/core/presentation/registros/sociedades/pasos/directorio/components/DirectorioEmptyState.vue";
  import type { TypeOption } from "~/types/TypeOptions";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const directoryConfigStore = useDirectoryConfigurationStore();

  // Estado del switch (default: false)
  const configurarDirectorio = ref(false);

  // Formulario
  const form = ref({
    cantidadDirectores: "" as string | number,
  });

  // Opciones para Cantidad de Directores
  const cantidadDirectoresOptions: TypeOption[] = [
    { id: 1, label: "3", name: "3", value: "3", acronimo: "3" },
    { id: 2, label: "4", name: "4", value: "4", acronimo: "4" },
    { id: 3, label: "5", name: "5", value: "5", acronimo: "5" },
    { id: 4, label: "6", name: "6", value: "6", acronimo: "6" },
    { id: 5, label: "7", name: "7", value: "7", acronimo: "7" },
  ];

  // Schemas de validación
  const cantidadDirectoresSchema = z
    .string()
    .min(1, "La cantidad de directores es obligatoria");

  const schema = z.object({
    cantidadDirectores: cantidadDirectoresSchema,
  });

  // Cargar configuración existente si hay
  onMounted(async () => {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    if (societyId && flowId) {
      try {
        await directoryConfigStore.loadConfiguration(societyId, flowId);

        // Si hay configuración cargada, prellenar el formulario
        if (directoryConfigStore.configuration) {
          const config = directoryConfigStore.configuration;

          // Prellenar cantidadDirectores si existe
          if (config.cantidadDirectores) {
            form.value.cantidadDirectores = String(config.cantidadDirectores);
            // Si hay cantidad configurada, activar el switch
            configurarDirectorio.value = true;
          }
        }
      } catch (error: any) {
        // Si no existe configuración (404), es normal
        if (error?.statusCode === 404 || error?.status === 404) {
          console.debug("[Cantidad.vue] No hay configuración previa (404)");
        } else {
          console.error("[Cantidad.vue] Error al cargar configuración:", error);
        }
      }
    }
  });

  // Handler para submit - se ejecuta cuando se hace click en "Siguiente"
  const handleSubmit = async () => {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    if (!societyId || !flowId) {
      console.error("[Cantidad.vue] Faltan parámetros de ruta");
      return;
    }

    try {
      // Preparar el DTO para enviar al backend
      const dto: {
        cantidadDirectores?: number;
        configurarDirectorio?: boolean;
      } = {};

      // Solo enviar cantidadDirectores si el switch está activo y hay un valor
      if (configurarDirectorio.value && form.value.cantidadDirectores) {
        dto.cantidadDirectores = Number(form.value.cantidadDirectores);
      }

      // Siempre enviar configurarDirectorio para activar/desactivar la votación
      dto.configurarDirectorio = configurarDirectorio.value;

      console.debug("[Cantidad.vue] Enviando configuración:", dto);

      // Actualizar configuración en el backend
      await directoryConfigStore.updateConfiguration(societyId, flowId, dto);

      console.debug("[Cantidad.vue] Configuración actualizada correctamente");
    } catch (error: any) {
      console.error("[Cantidad.vue] Error al actualizar configuración:", error);
      throw error; // Re-lanzar para que useFlowLayoutNext pueda manejarlo
    }
  };

  // Conectar el botón "Siguiente" del layout
  useJuntasFlowNext(handleSubmit);
</script>
