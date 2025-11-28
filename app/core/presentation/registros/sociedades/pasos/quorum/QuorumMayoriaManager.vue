<script setup lang="ts">
  import { computed, onMounted, watch } from "vue";
  import { useRoute } from "vue-router";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import { useFlowLayoutNext } from "~/composables/useFlowLayoutNext";
  import {
    useQuorumForm,
    type QuorumNumericField,
  } from "~/core/presentation/registros/sociedades/pasos/quorum/components/forms/useQuorumForm";
  import QuorumRowTable from "~/core/presentation/registros/sociedades/pasos/quorum/components/table/QuorumRow.vue";
  import QuorumTable from "~/core/presentation/registros/sociedades/pasos/quorum/components/table/QuorumTable.vue";
  import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    mode?: EntityModeEnum;
    societyId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: EntityModeEnum.CREAR,
    societyId: "",
  });

  const headersQuorum1 = ["Convocatoria", "Tipo de Quórum", "Reglas"];
  const headersQuorum2 = ["Tipo de Quórum", "Reglas"];

  const route = useRoute();
  // const router = useRouter(); // Ya no es necesario, la navegación la maneja useFlowLayoutNext
  const { withAsyncToast } = useToastFeedback();

  const societyId = computed(
    () => props.societyId || (route.params.id as string | undefined) || ""
  );

  const {
    form,
    load,
    submit,
    setValue,
    isLoading,
    isReadonly,
    errorMessage,
    relationshipErrors,
    hasValidationErrors,
  } = useQuorumForm({
    societyId,
    mode: computed(() => props.mode),
  });

  const formatPercent = (value: number) => clampString(value);

  function clampString(value: number) {
    if (!Number.isFinite(value)) return "0.00";
    return value.toFixed(2);
  }

  // El nextRoute ya no es necesario porque useFlowLayoutNext maneja la navegación automáticamente
  // const nextRoute = computed(() => {
  //   const segments = route.path.split("/");
  //   segments[segments.length - 1] = "acuerdos-societarios";
  //   return segments.join("/");
  // });

  const handlePercentUpdate = (field: QuorumNumericField) => (value: number) => {
    setValue(field, value);
  };

  const handleNext = async () => {
    if (isReadonly.value) {
      // Si es readonly, solo navegar (sin guardar)
      return;
    }

    await withAsyncToast(() => submit(), {
      loading: {
        title: "Guardando quórum…",
        description: "Estamos registrando la configuración en el sistema.",
      },
      success: () => ({
        title: "Quórum guardado",
        description: "La configuración se registró correctamente.",
      }),
      error: (error) => ({
        title: "No pudimos guardar",
        description:
          error instanceof Error
            ? error.message
            : "Revisa los valores e inténtalo nuevamente.",
      }),
    });
    // Nota: La navegación al siguiente paso la maneja automáticamente useFlowLayoutNext
  };

  // Registrar la función handleNext en el store del layout
  // Esto conecta el botón "Siguiente" del layout con nuestra función handleNext
  useFlowLayoutNext(handleNext);

  watch(
    societyId,
    (value) => {
      if (!value) return;
      load();
    },
    { immediate: true }
  );

  onMounted(() => {
    if (societyId.value) {
      load();
    }
  });

  const isPreview = computed(() => isReadonly.value);
  // disableNext ya no es necesario porque el botón está en el layout
</script>

<template>
  <div class="flex flex-col gap-8 p-6 md:p-10">
    <CardTitle
      title="Quórums y Mayorías para Adopción de Acuerdos"
      body="Ingrese los porcentajes mínimos requeridos para la instalación de juntas y toma de acuerdos."
    />

    <p
      v-if="errorMessage"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>

    <div
      v-if="isLoading"
      class="space-y-4 rounded-2xl border border-primary-100 bg-white p-10"
    >
      <div class="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
      <div class="h-32 w-full animate-pulse rounded bg-gray-100" />
      <div class="h-32 w-full animate-pulse rounded bg-gray-100" />
    </div>

    <template v-else>
      <SimpleCard>
        <div class="flex flex-col gap-8">
          <CardTitle title="Quórum mínimo para instalar la junta" body="" />
          <QuorumTable :header-list="headersQuorum1" columns="grid-cols-3">
            <QuorumRowTable
              :is-preview="isPreview"
              convocatoria="Primera"
              quorum-type="Simple"
              ruler="Mínimo"
              :initial-value="formatPercent(form.primeraConvocatoriaSimple)"
              text-body="de acciones con derecho a voto."
              :show-error="relationshipErrors.primeraConvocatoriaSimple"
              :error-limit="form.quorumMinimoSimple"
              @update:number-value="
                (val) => handlePercentUpdate('primeraConvocatoriaSimple')(val)
              "
            />
            <QuorumRowTable
              :is-preview="isPreview"
              convocatoria="Primera"
              quorum-type="Calificado"
              ruler="Mínimo"
              :initial-value="formatPercent(form.primeraConvocatoriaCalificada)"
              text-body="de acciones con derecho a voto."
              :show-error="relationshipErrors.primeraConvocatoriaCalificada"
              :error-limit="form.quorumMinimoCalificado"
              @update:number-value="
                (val) => handlePercentUpdate('primeraConvocatoriaCalificada')(val)
              "
            />
            <QuorumRowTable
              :is-preview="isPreview"
              convocatoria="Segunda"
              quorum-type="Simple"
              ruler="Mínimo"
              :initial-value="formatPercent(form.segundaConvocatoriaSimple)"
              text-body="de acciones con derecho a voto."
              :show-error="relationshipErrors.segundaConvocatoriaSimple"
              :error-limit="form.quorumMinimoSimple"
              @update:number-value="
                (val) => handlePercentUpdate('segundaConvocatoriaSimple')(val)
              "
            />
            <QuorumRowTable
              :is-preview="isPreview"
              convocatoria="Segunda"
              quorum-type="Calificado"
              ruler="Mínimo"
              :initial-value="formatPercent(form.segundaConvocatoriaCalificada)"
              text-body="de acciones con derecho a voto existentes."
              :show-error="relationshipErrors.segundaConvocatoriaCalificada"
              :error-limit="form.quorumMinimoCalificado"
              @update:number-value="
                (val) => handlePercentUpdate('segundaConvocatoriaCalificada')(val)
              "
            />
          </QuorumTable>
        </div>
      </SimpleCard>

      <SimpleCard>
        <div class="flex flex-col gap-8">
          <CardTitle title="Quórum mínimo para tomar acuerdos" body="" />
          <QuorumTable :header-list="headersQuorum2" columns="grid-cols-3">
            <QuorumRowTable
              :is-preview="isPreview"
              quorum-type="Simple"
              ruler="Más del"
              :initial-value="formatPercent(form.quorumMinimoSimple)"
              text-body="de acciones con derecho a voto presentes."
              @update:number-value="(val) => handlePercentUpdate('quorumMinimoSimple')(val)"
            />
            <QuorumRowTable
              :is-preview="isPreview"
              quorum-type="Calificado"
              ruler="Más del"
              :initial-value="formatPercent(form.quorumMinimoCalificado)"
              text-body="de acciones con derecho a voto presentes."
              @update:number-value="
                (val) => handlePercentUpdate('quorumMinimoCalificado')(val)
              "
            />
          </QuorumTable>
        </div>
      </SimpleCard>

      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p v-if="hasValidationErrors && !isReadonly" class="text-sm text-red-600">
          Ajusta los porcentajes para que cada convocatoria sea mayor o igual al quórum mínimo.
        </p>
        <!-- Botones "Restablecer" y "Siguiente" ahora están en el layout (flow-layout.vue) -->
        <!-- Se maneja automáticamente mediante useFlowLayoutNext -->
      </div>
    </template>
  </div>
</template>
