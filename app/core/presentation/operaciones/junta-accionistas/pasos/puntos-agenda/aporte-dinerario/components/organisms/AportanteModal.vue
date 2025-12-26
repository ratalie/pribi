<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { computed, ref, watch } from "vue";

import type {
  Persona,
  PersonaFideicomiso,
  PersonaFondoInversion,
  PersonaJuridica,
  PersonaNatural,
  PersonaSucesionIndivisa,
  PersonaSucursal,
  Representante,
} from "@hexag/registros/sociedades/pasos/accionistas/domain";
import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import CardTitle from "~/components/base/cards/CardTitle.vue";
import CascadeSelectInputZod from "~/components/base/inputs/text/ui/CascadeSelectInputZod.vue";
import BaseModal from "~/components/base/modal/BaseModal.vue";
import { accionistaTypes } from "~/constants/inputs/accionista-types";
import {
  usePersonaNaturalStore,
  type PersonaNaturalState as RepresentanteState,
} from "~/stores/usePersonaNaturalStore";
import { TipoFondoEnum } from "~/types/enums/TipoFondoEnum";
import { tipoAccionistaSchema } from "~/core/presentation/registros/sociedades/pasos/accionistas/schemas/modalAccionistas";
import { useAccionistaFideicomisosStore } from "~/core/presentation/registros/sociedades/pasos/accionistas/stores/forms/useAccionistaFideicomisosStore";
import { useAccionistaFondosInversionStore } from "~/core/presentation/registros/sociedades/pasos/accionistas/stores/forms/useAccionistaFondosInversionStore";
import { useAccionistaJuridicoStore } from "~/core/presentation/registros/sociedades/pasos/accionistas/stores/forms/useAccionistaJuridicoStore";
import {
  useAccionistaNaturalStore,
  type AccionistaNaturalState,
} from "~/core/presentation/registros/sociedades/pasos/accionistas/stores/forms/useAccionistaNaturalStore";
import { useAccionistaSucesionesIndivisasStore } from "~/core/presentation/registros/sociedades/pasos/accionistas/stores/forms/useAccionistaSucesionesIndivisasStore";
import { useAccionistaSucursalStore } from "~/core/presentation/registros/sociedades/pasos/accionistas/stores/forms/useAccionistaSucursalStore";
import { TipoAccionistaEnum } from "~/core/presentation/registros/sociedades/pasos/accionistas/types/enums/TipoAccionistaEnum";
import AccionistaJuridicoForm from "~/core/presentation/registros/sociedades/pasos/accionistas/components/forms/AccionistaJuridicoForm.vue";
import AccionistaNaturalForm from "~/core/presentation/registros/sociedades/pasos/accionistas/components/forms/AccionistaNaturalForm.vue";
import AccionistaSucursalForm from "~/core/presentation/registros/sociedades/pasos/accionistas/components/forms/AccionistaSucursalForm.vue";
import FideicomisosForm from "~/core/presentation/registros/sociedades/pasos/accionistas/components/forms/FideicomisosForm.vue";
import FondosInversionForm from "~/core/presentation/registros/sociedades/pasos/accionistas/components/forms/FondosInversionForm.vue";
import SucesionesIndivisasForm from "~/core/presentation/registros/sociedades/pasos/accionistas/components/forms/SucesionesIndivisasForm.vue";

interface Props {
  modelValue: boolean;
  mode?: "create" | "edit";
  isSaving?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "create",
  isSaving: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", payload: { contributor: Persona }): void;
  (e: "close"): void;
}>();

const isOpen = useVModel(props, "modelValue", emit);

const tipoAccionista = ref<TipoAccionistaEnum>(TipoAccionistaEnum.NATURAL);
const personaId = ref<string | null>(null);

const generateUuid = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

const naturalStore = useAccionistaNaturalStore();
const juridicaStore = useAccionistaJuridicoStore();
const sucursalStore = useAccionistaSucursalStore();
const sucesionStore = useAccionistaSucesionesIndivisasStore();
const fideicomisoStore = useAccionistaFideicomisosStore();
const fondoStore = useAccionistaFondosInversionStore();
const representanteStore = usePersonaNaturalStore();

const storeMap: Record<TipoAccionistaEnum, () => { $reset: () => void; $state: any }> = {
  [TipoAccionistaEnum.NATURAL]: () => naturalStore,
  [TipoAccionistaEnum.JURIDICA]: () => juridicaStore,
  [TipoAccionistaEnum.SUCURSAL]: () => sucursalStore,
  [TipoAccionistaEnum.SUCESIONES_INDIVISAS]: () => sucesionStore,
  [TipoAccionistaEnum.FIDEICOMISOS]: () => fideicomisoStore,
  [TipoAccionistaEnum.FONDOS_INVERSION]: () => fondoStore,
};

const title = computed(() =>
  props.mode === "create" ? "Agregar Aportante" : "Editar Aportante"
);

const currentFormComponent = computed(() => {
  switch (tipoAccionista.value) {
    case TipoAccionistaEnum.NATURAL:
      return AccionistaNaturalForm;
    case TipoAccionistaEnum.JURIDICA:
      return AccionistaJuridicoForm;
    case TipoAccionistaEnum.SUCURSAL:
      return AccionistaSucursalForm;
    case TipoAccionistaEnum.SUCESIONES_INDIVISAS:
      return SucesionesIndivisasForm;
    case TipoAccionistaEnum.FIDEICOMISOS:
      return FideicomisosForm;
    case TipoAccionistaEnum.FONDOS_INVERSION:
    default:
      return FondosInversionForm;
  }
});

const resetStores = () => {
  naturalStore.$reset();
  juridicaStore.$reset();
  sucursalStore.$reset();
  sucesionStore.$reset();
  fideicomisoStore.$reset();
  fondoStore.$reset();
  representanteStore.$reset();
  personaId.value = null; // ✅ Resetear UUID al cerrar
};

watch(
  () => tipoAccionista.value,
  (value, previous) => {
    if (value !== previous) {
      const getter = storeMap[value];
      if (getter) {
        getter().$reset();
      }
      representanteStore.$reset();
    }
  }
);

const buildRepresentante = (): Representante | undefined => {
  if (!representanteStore.numeroDocumento) return undefined;
  return {
    nombre: representanteStore.nombre,
    apellidoPaterno: representanteStore.apellidoPaterno,
    apellidoMaterno: representanteStore.apellidoMaterno || undefined,
    tipoDocumento: representanteStore.tipoDocumento || "DNI",
    numeroDocumento: representanteStore.numeroDocumento,
    paisEmision: representanteStore.paisPasaporte || undefined,
  };
};

const buildPersona = (): Persona | null => {
  const trim = (value?: string | null) => {
    if (!value) return undefined;
    const t = value.trim();
    return t.length > 0 ? t : undefined;
  };

  const assignId = <T extends Persona>(persona: T): T => {
    // ✅ Generar UUID si no existe
    const uuid = personaId.value || generateUuid();
    persona.id = uuid;
    personaId.value = uuid;
    return persona;
  };

  switch (tipoAccionista.value) {
      case TipoAccionistaEnum.NATURAL:
      if (
        !naturalStore.numeroDocumento ||
        !naturalStore.nombre ||
        !naturalStore.apellidoPaterno
      ) {
        return null;
      }
      return assignId({
        tipo: "NATURAL",
        nombre: naturalStore.nombre,
        apellidoPaterno: naturalStore.apellidoPaterno,
        apellidoMaterno: trim(naturalStore.apellidoMaterno),
        tipoDocumento: naturalStore.tipoDocumento || "DNI",
        numeroDocumento: naturalStore.numeroDocumento,
        paisEmision: trim(naturalStore.paisPasaporte),
      } as PersonaNatural);
    case TipoAccionistaEnum.JURIDICA:
      if (!juridicaStore.numeroDocumento || !juridicaStore.razonSocial) {
        return null;
      }
      return assignId({
        tipo: "JURIDICA",
        tipoDocumento: juridicaStore.seConstituyoEnPeru
          ? "RUC"
          : juridicaStore.tipoDocumento || "RUC",
        numeroDocumento: juridicaStore.numeroDocumento,
        razonSocial: juridicaStore.razonSocial,
        nombreComercial: trim(juridicaStore.nombreComercial),
        direccion: trim(juridicaStore.direccion),
        distrito: trim(juridicaStore.distrito),
        provincia: trim(juridicaStore.provincia),
        departamento: trim(juridicaStore.departamento),
        pais: trim(juridicaStore.paisOrigen),
        constituida: juridicaStore.seConstituyoEnPeru,
      } as PersonaJuridica);
    case TipoAccionistaEnum.SUCURSAL:
      if (!sucursalStore.numeroDocumento || !sucursalStore.nombreSucursal) {
        return null;
      }
      return assignId({
        tipo: "SUCURSAL",
        ruc: sucursalStore.numeroDocumento,
        nombreSucursal: sucursalStore.nombreSucursal,
        partidaRegistral: trim(sucursalStore.partidaRegistral),
        oficinaRegistrada: trim(sucursalStore.sedeRegistral),
        direccionFiscal: trim(sucursalStore.domicilioFiscal),
        representante: sucursalStore.tieneRepresentante ? buildRepresentante() : undefined,
      } as PersonaSucursal);
    case TipoAccionistaEnum.SUCESIONES_INDIVISAS:
      if (!sucesionStore.numeroDocumento || !sucesionStore.razonSocial) {
        return null;
      }
      return assignId({
        tipo: "SUCESION_INDIVISA",
        ruc: sucesionStore.numeroDocumento,
        razonSocial: sucesionStore.razonSocial,
        distrito: trim(sucesionStore.distrito),
        provincia: trim(sucesionStore.provincia),
        departamento: trim(sucesionStore.departamento),
        direccion: trim(sucesionStore.direccion),
        representante: sucesionStore.tieneRepresentante ? buildRepresentante() : undefined,
      } as PersonaSucesionIndivisa);
    case TipoAccionistaEnum.FIDEICOMISOS:
      return assignId({
        tipo: "FIDEICOMISO",
        tieneRuc: fideicomisoStore.tieneRuc,
        ruc: trim(fideicomisoStore.numeroDocumento),
        razonSocial: trim(fideicomisoStore.razonSocial),
        numeroRegistroFideicomiso: trim(fideicomisoStore.identificacionFideicomiso),
        partidaRegistral: trim(fideicomisoStore.partidaRegistral),
        oficinaRegistrada: trim(fideicomisoStore.sedeRegistral),
        direccionFiscal: trim(fideicomisoStore.domicilioFiscal),
        representante: fideicomisoStore.tieneRepresentante
          ? buildRepresentante()
          : undefined,
        fiduciario:
          fideicomisoStore.numeroDocumentoFiduciaria ||
          fideicomisoStore.razonSocialFiduciaria
            ? {
                ruc: trim(fideicomisoStore.numeroDocumentoFiduciaria),
                razonSocial: trim(fideicomisoStore.razonSocialFiduciaria),
              }
            : undefined,
      } as PersonaFideicomiso);
    case TipoAccionistaEnum.FONDOS_INVERSION:
      if (!fondoStore.numeroDocumento || !fondoStore.razonSocial) {
        return null;
      }
      return assignId({
        tipo: "FONDO_INVERSION",
        ruc: fondoStore.numeroDocumento,
        razonSocial: fondoStore.razonSocial,
        direccion: trim(fondoStore.direccion),
        tipoFondo: fondoStore.tipoFondo || "CERRADO",
        representante: fondoStore.tieneRepresentante ? buildRepresentante() : undefined,
        fiduciario:
          fondoStore.numeroDocumentoSociedadAdministradora ||
          fondoStore.razonSocialSociedadAdministradora
            ? {
                ruc: trim(fondoStore.numeroDocumentoSociedadAdministradora),
                razonSocial: trim(fondoStore.razonSocialSociedadAdministradora),
              }
            : undefined,
      } as PersonaFondoInversion);
    default:
      return null;
  }
};

const handleSubmit = () => {
  const persona = buildPersona();
  if (!persona) {
    console.warn("[AportanteModal] No se pudo construir el payload del aportante.");
    return;
  }

  const payload = {
    contributor: persona,
  };

  emit("submit", payload);
};

const handleClose = () => {
  emit("close");
  resetStores();
  isOpen.value = false;
};
</script>

<template>
  <BaseModal v-model="isOpen" size="lg" @close="handleClose">
    <div class="flex flex-col gap-12">
      <CardTitle :title="title" body="Completa la información del aportante.">
        <template #actions>
          <div class="w-[340px]">
            <CascadeSelectInputZod
              v-model="tipoAccionista"
              name="tipo_aportante"
              label="Tipo de aportante"
              placeholder="Selecciona un tipo"
              :options="accionistaTypes"
              :schema="tipoAccionistaSchema"
            />
          </div>
        </template>
      </CardTitle>

      <component :is="currentFormComponent" :key="tipoAccionista" />
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleClose"
        />
        <ActionButton
          :label="mode === 'create' ? 'Agregar Aportante' : 'Guardar Cambios'"
          size="md"
          :is-loading="isSaving"
          type="button"
          @click="handleSubmit"
        />
      </div>
    </template>
  </BaseModal>
</template>

