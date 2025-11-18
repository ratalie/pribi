<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, ref, watch } from "vue";
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import SwitchTabs from "~/components/base/Switch/SwitchTabs.vue";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { useAccionesComunesStore } from "../../stores/useAccionesComunesStore";
  import { useClasesAccionesStore } from "../../stores/useClasesAccionesStore";
  import { useRegistroAccionesStore } from "../../stores/useRegistroAccionesStore";
  import { useValorNominalStore } from "../../stores/useValorNominalStore";
  import type { AccionRegistro } from "../../types/acciones";
  import AccionesComunesForm from "../forms/AccionesComunesForm.vue";
  import ClasesAccionesForm from "../forms/ClasesAccionesForm.vue";

  interface Props {
    modelValue?: boolean;
    mode?: "crear" | "editar";
    accionId?: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "crear",
    accionId: null,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const accionesComunesStore = useAccionesComunesStore();
  const clasesAccionesStore = useClasesAccionesStore();
  const registroAccionesStore = useRegistroAccionesStore();
  const valorNominalStore = useValorNominalStore();

  const activeTab = ref<"opcion-a" | "opcion-b">("opcion-a");
  const submitLabel = computed(() => (props.mode === "editar" ? "Editar" : "Guardar"));
  const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const valorNominalDisplay = computed(() =>
    currencyFormatter.format(valorNominalStore.valor || 0)
  );

  const isSubmitDisabled = computed(() => {
    if (activeTab.value === "opcion-b") {
      return (
        !clasesAccionesStore.nombreClaseAccion.trim() ||
        clasesAccionesStore.cantidadAccionesClase <= 0 ||
        valorNominalStore.valor <= 0
      );
    }

    return accionesComunesStore.cantidadAcciones <= 0 || valorNominalStore.valor <= 0;
  });

  const resetForms = () => {
    accionesComunesStore.$reset();
    clasesAccionesStore.$reset();
    activeTab.value = "opcion-a";
  };

  const populateFromAccion = (accion: AccionRegistro) => {
    if (accion.tipo === "clase") {
      activeTab.value = "opcion-b";
      clasesAccionesStore.$patch({
        nombreClaseAccion: accion.descripcion,
        cantidadAccionesClase: accion.accionesSuscritas,
        conDerechoVoto: accion.derechoVoto,
        redimiblesClase: accion.redimibles,
        otrosDerechosEspecialesClase: accion.derechosEspeciales,
        obligacionesAdicionalesClase: accion.obligacionesAdicionales,
        archivosDerechosEspecialesClase: [...accion.archivosDerechosEspeciales],
        archivosObligacionesClase: [...accion.archivosObligaciones],
      });
      return;
    }

    activeTab.value = "opcion-a";
    accionesComunesStore.$patch({
      cantidadAcciones: accion.accionesSuscritas,
      redimibles: accion.redimibles,
      otrosDerechosEspeciales: accion.derechosEspeciales,
      obligacionesAdicionales: accion.obligacionesAdicionales,
      archivosDerechosEspeciales: [...accion.archivosDerechosEspeciales],
      archivosObligaciones: [...accion.archivosObligaciones],
    });
  };

  watch(
    () => ({
      isOpen: modelValue.value,
      mode: props.mode,
      accionId: props.accionId,
    }),
    ({ isOpen, mode, accionId }) => {
      if (!isOpen) {
        resetForms();
        return;
      }

      resetForms();

      if (mode === "editar" && accionId) {
        const accion = registroAccionesStore.getAccionById(accionId);

        if (accion) {
          populateFromAccion(accion);
        }
      }
    },
    { immediate: true }
  );

  const handleCancel = () => {
    resetForms();
    emits("close");
    modelValue.value = false;
  };

  const buildPayload = () => {
    if (activeTab.value === "opcion-b") {
      const formData = clasesAccionesStore.getFormData();

      return {
        tipo: "clase" as const,
        descripcion: formData.nombreClaseAccion.trim() || "Clase sin nombre",
        accionesSuscritas: formData.cantidadAccionesClase,
        derechoVoto: formData.conDerechoVoto,
        redimibles: formData.redimiblesClase,
        derechosEspeciales: formData.otrosDerechosEspecialesClase,
        obligacionesAdicionales: formData.obligacionesAdicionalesClase,
        archivosDerechosEspeciales: [...formData.archivosDerechosEspecialesClase],
        archivosObligaciones: [...formData.archivosObligacionesClase],
      };
    }

    const formData = accionesComunesStore.getFormData();

    return {
      tipo: "comun" as const,
      descripcion: "Acciones comunes",
      accionesSuscritas: formData.cantidadAcciones,
      derechoVoto: true,
      redimibles: formData.redimibles,
      derechosEspeciales: formData.otrosDerechosEspeciales,
      obligacionesAdicionales: formData.obligacionesAdicionales,
      archivosDerechosEspeciales: [...formData.archivosDerechosEspeciales],
      archivosObligaciones: [...formData.archivosObligaciones],
    };
  };

  const handleSave = async () => {
    if (isSubmitDisabled.value) {
      return;
    }

    const payload = buildPayload();

    if (props.mode === "editar" && props.accionId) {
      const existente = registroAccionesStore.getAccionById(props.accionId);

      if (!existente) {
        return;
      }

      registroAccionesStore.updateAccion({
        ...existente,
        ...payload,
        id: props.accionId,
      });
    } else {
      registroAccionesStore.addAccion(payload);
    }

    resetForms();
    emits("submit");
    emits("close");
    modelValue.value = false;
  };

  const handleInvalidSubmit = () => {
    console.log("Formulario inválido");
  };
</script>

<template>
  <BaseModal
    v-model="modelValue"
    size="lg"
    @close="handleCancel"
    @submit="handleSave"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-12">
      <CardTitle :title="props.mode === 'editar' ? 'Editar Acción' : 'Agregar Acción'">
        <template #actions>
          <!-- valor nominal -->
          <BaseButton type="button" variant="pill" class="h-11">
            <img :src="IconCoin" alt="Valor Nominal" />
            <p class="font-bold">
              Valor Nominal:
              <span class="font-bold">{{ valorNominalDisplay }}</span>
            </p>
          </BaseButton>
        </template>
      </CardTitle>

      <!-- Tabs para cambiar entre formularios -->
      <SwitchTabs
        v-model="activeTab"
        opcion-a="Comunes"
        opcion-b="Clases de Acciones"
        variant="default"
      >
        <template #opcion-a>
          <div class="pt-10">
            <AccionesComunesForm />
          </div>
        </template>
        <template #opcion-b>
          <div class="pt-10">
            <ClasesAccionesForm />
          </div>
        </template>
      </SwitchTabs>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleCancel"
        />

        <ActionButton
          type="submit"
          variant="primary"
          :label="submitLabel"
          size="md"
          :is-disabled="isSubmitDisabled"
        />
      </div>
    </template>
  </BaseModal>
</template>
