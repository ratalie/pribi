<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, ref, watch } from "vue";

  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import CascadeSelectInputZod from "~/components/base/inputs/text/ui/CascadeSelectInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { accionistaTypes } from "~/constants/inputs/accionista-types";
import { tipoAccionistaSchema } from "../schemas/modalAccionistas";
import { TipoAccionistaEnum } from "../types/enums/TipoAccionistaEnum";
  import AccionistaNaturalForm from "./forms/AccionistaNaturalForm.vue";
  import AccionistaJuridicoForm from "./forms/AccionistaJuridicoForm.vue";
  import AccionistaSucursalForm from "./forms/AccionistaSucursalForm.vue";
  import SucesionesIndivisasForm from "./forms/SucesionesIndivisasForm.vue";
  import FideicomisosForm from "./forms/FideicomisosForm.vue";
  import FondosInversionForm from "./forms/FondosInversionForm.vue";
import {
  useAccionistaNaturalStore,
  type AccionistaNaturalState,
} from "../stores/forms/useAccionistaNaturalStore";
import {
  useAccionistaJuridicoStore,
  type AccionistaJuridicoState,
} from "../stores/forms/useAccionistaJuridicoStore";
import {
  useAccionistaSucursalStore,
  type AccionistaSucursalState,
} from "../stores/forms/useAccionistaSucursalStore";
import {
  useAccionistaSucesionesIndivisasStore,
  type AccionistaSucesionesIndivisasState,
} from "../stores/forms/useAccionistaSucesionesIndivisasStore";
import {
  useAccionistaFideicomisosStore,
  type AccionistaFideicomisosState,
} from "../stores/forms/useAccionistaFideicomisosStore";
import {
  useAccionistaFondosInversionStore,
  type AccionistaFondosInversionState,
} from "../stores/forms/useAccionistaFondosInversionStore";
import {
  usePersonaNaturalStore,
  type PersonaNaturalState as RepresentanteState,
} from "~/stores/usePersonaNaturalStore";
  import type { AccionistaDTO } from "@hexag/registros/sociedades/pasos/accionistas/application";
  import type {
    Persona,
    PersonaFideicomiso,
    PersonaFondoInversion,
    PersonaJuridica,
    PersonaNatural,
    PersonaSucursal,
    PersonaSucesionIndivisa,
    Representante,
  } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import type { Accionista } from "@hexag/registros/sociedades/pasos/accionistas/domain/entities/accionista.entity";

  interface Props {
    modelValue: boolean;
    mode?: "create" | "edit";
    isSaving?: boolean;
    initialAccionista?: Accionista | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "create",
    isSaving: false,
    initialAccionista: null,
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", payload: AccionistaDTO): void;
    (e: "close"): void;
  }>();

  const isOpen = useVModel(props, "modelValue", emit);

  const tipoAccionista = ref<TipoAccionistaEnum>(TipoAccionistaEnum.NATURAL);
  const personaId = ref<string | null>(null);
  const accionistaId = ref<string | null>(null);

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
    props.mode === "create" ? "Agregar accionista" : "Editar accionista"
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
  };

  const personaTipoToAccionista = (persona?: Persona): TipoAccionistaEnum => {
    switch (persona?.tipo) {
      case "JURIDICA":
        return TipoAccionistaEnum.JURIDICA;
      case "SUCURSAL":
        return TipoAccionistaEnum.SUCURSAL;
      case "SUCESION_INDIVISA":
        return TipoAccionistaEnum.SUCESIONES_INDIVISAS;
      case "FIDEICOMISO":
        return TipoAccionistaEnum.FIDEICOMISOS;
      case "FONDO_INVERSION":
        return TipoAccionistaEnum.FONDOS_INVERSION;
      case "NATURAL":
      default:
        return TipoAccionistaEnum.NATURAL;
    }
  };

  const patchRepresentante = (representante?: Representante | null) => {
    if (!representante) return;
    representanteStore.$patch((state) => {
      state.tipoDocumento = (representante.tipoDocumento ?? "") as RepresentanteState["tipoDocumento"];
      state.numeroDocumento = representante.numeroDocumento ?? "";
      state.nombre = representante.nombre ?? "";
      state.apellidoPaterno = representante.apellidoPaterno ?? "";
      state.apellidoMaterno = representante.apellidoMaterno ?? "";
      state.paisPasaporte = representante.paisEmision ?? "";
    });
  };

  const hydrateStoresFromPersona = (persona?: Persona | null) => {
    resetStores();
    if (!persona) {
      tipoAccionista.value = TipoAccionistaEnum.NATURAL;
      personaId.value = null;
      accionistaId.value = null;
      return;
    }

    personaId.value = persona.id ?? null;
    tipoAccionista.value = personaTipoToAccionista(persona);

    switch (persona.tipo) {
      case "NATURAL": {
        const naturalPersona = persona as PersonaNatural;
        naturalStore.$patch((state) => {
          state.tipoDocumento = (naturalPersona.tipoDocumento ?? "") as AccionistaNaturalState["tipoDocumento"];
          state.numeroDocumento = naturalPersona.numeroDocumento ?? "";
          state.nombre = naturalPersona.nombre ?? "";
          state.apellidoPaterno = naturalPersona.apellidoPaterno ?? "";
          state.apellidoMaterno = naturalPersona.apellidoMaterno ?? "";
          state.paisPasaporte = naturalPersona.paisEmision ?? "";
        });
        break;
      }
      case "JURIDICA": {
        const juridicaPersona = persona as PersonaJuridica;
        juridicaStore.$patch((state) => {
          state.seConstituyoEnPeru = juridicaPersona.constituida ?? true;
          state.tipoDocumento = juridicaPersona.tipoDocumento ?? "RUC";
          state.numeroDocumento = juridicaPersona.numeroDocumento ?? "";
          state.razonSocial = juridicaPersona.razonSocial ?? "";
          state.nombreComercial = juridicaPersona.nombreComercial ?? "";
          state.direccion = juridicaPersona.direccion ?? "";
          state.distrito = juridicaPersona.distrito ?? "";
          state.provincia = juridicaPersona.provincia ?? "";
          state.departamento = juridicaPersona.departamento ?? "";
          state.paisOrigen = juridicaPersona.pais ?? "";
        });
        break;
      }
      case "SUCURSAL": {
        const sucursalPersona = persona as PersonaSucursal;
        sucursalStore.$patch((state) => {
          state.tipoDocumento = "RUC";
          state.numeroDocumento = sucursalPersona.ruc ?? "";
          state.nombreSucursal = sucursalPersona.nombreSucursal ?? "";
          state.partidaRegistral = sucursalPersona.partidaRegistral ?? "";
          state.sedeRegistral = sucursalPersona.oficinaRegistrada ?? "";
          state.domicilioFiscal = sucursalPersona.direccionFiscal ?? "";
          state.tieneRepresentante = Boolean(sucursalPersona.representante);
        });
        patchRepresentante(sucursalPersona.representante ?? null);
        break;
      }
      case "SUCESION_INDIVISA": {
        const sucesionPersona = persona as PersonaSucesionIndivisa;
        sucesionStore.$patch((state) => {
          state.tipoDocumento = "RUC";
          state.numeroDocumento = sucesionPersona.ruc ?? "";
          state.razonSocial = sucesionPersona.razonSocial ?? "";
          state.direccion = sucesionPersona.direccion ?? "";
          state.distrito = sucesionPersona.distrito ?? "";
          state.provincia = sucesionPersona.provincia ?? "";
          state.departamento = sucesionPersona.departamento ?? "";
          state.tieneRepresentante = Boolean(sucesionPersona.representante);
        });
        patchRepresentante(sucesionPersona.representante ?? null);
        break;
      }
      case "FIDEICOMISO": {
        const fideicomisoPersona = persona as PersonaFideicomiso;
        fideicomisoStore.$patch((state) => {
          state.tieneRuc = fideicomisoPersona.tieneRuc ?? false;
          state.numeroDocumento = fideicomisoPersona.ruc ?? "";
          state.tipoDocumento = fideicomisoPersona.tieneRuc ? "RUC" : "";
          state.razonSocial = fideicomisoPersona.razonSocial ?? "";
          state.identificacionFideicomiso = fideicomisoPersona.numeroRegistroFideicomiso ?? "";
          state.partidaRegistral = fideicomisoPersona.partidaRegistral ?? "";
          state.sedeRegistral = fideicomisoPersona.oficinaRegistrada ?? "";
          state.domicilioFiscal = fideicomisoPersona.direccionFiscal ?? "";
          state.numeroDocumentoFiduciaria = fideicomisoPersona.fiduciario?.ruc ?? "";
          state.tipoDocumentoFiduciaria = fideicomisoPersona.fiduciario?.ruc ? "RUC" : "";
          state.razonSocialFiduciaria = fideicomisoPersona.fiduciario?.razonSocial ?? "";
          state.tieneRepresentante = Boolean(fideicomisoPersona.representante);
        });
        patchRepresentante(fideicomisoPersona.representante ?? null);
        break;
      }
      case "FONDO_INVERSION": {
        const fondoPersona = persona as PersonaFondoInversion;
        fondoStore.$patch((state) => {
          state.tipoDocumento = "RUC";
          state.numeroDocumento = fondoPersona.ruc ?? "";
          state.razonSocial = fondoPersona.razonSocial ?? "";
          state.direccion = fondoPersona.direccion ?? "";
          state.tipoFondo = fondoPersona.tipoFondo ?? "";
          state.numeroDocumentoSociedadAdministradora = fondoPersona.fiduciario?.ruc ?? "";
          state.tipoDocumentoSociedadAdministradora = fondoPersona.fiduciario?.ruc ? "RUC" : "";
          state.razonSocialSociedadAdministradora = fondoPersona.fiduciario?.razonSocial ?? "";
          state.tieneRepresentante = Boolean(fondoPersona.representante);
        });
        patchRepresentante(fondoPersona.representante ?? null);
        break;
      }
    }
  };

  watch(
    () => props.initialAccionista,
    (value) => {
      personaId.value = value?.persona.id ?? null;
      accionistaId.value = value?.id ?? null;
      hydrateStoresFromPersona(value?.persona ?? null);
    },
    { immediate: true }
  );

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
      if (personaId.value) {
        persona.id = personaId.value;
      }
      return persona;
    };

    switch (tipoAccionista.value) {
      case TipoAccionistaEnum.NATURAL:
        if (!naturalStore.numeroDocumento || !naturalStore.nombre || !naturalStore.apellidoPaterno) {
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
          tipoDocumento: juridicaStore.seConstituyoEnPeru ? "RUC" : juridicaStore.tipoDocumento || "RUC",
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
          representante: fideicomisoStore.tieneRepresentante ? buildRepresentante() : undefined,
          fiduciario:
            fideicomisoStore.numeroDocumentoFiduciaria || fideicomisoStore.razonSocialFiduciaria
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
      console.warn("[AccionistaModal] No se pudo construir el payload del accionista.");
      return;
    }

    const ensureUuid = (value?: string | null) => (value && value.length > 0 ? value : generateUuid());

    const personaIdValue = ensureUuid(persona.id ?? personaId.value ?? props.initialAccionista?.persona.id ?? null);
    persona.id = personaIdValue;
    personaId.value = personaIdValue;

    const accionistaUuid = ensureUuid(props.initialAccionista?.id ?? accionistaId.value);
    accionistaId.value = accionistaUuid;

    const payload: AccionistaDTO = {
      id: accionistaUuid,
      persona,
    };

    emit("submit", payload);
  };

  const handleClose = () => {
    emit("close");
    resetStores();
    personaId.value = null;
    accionistaId.value = null;
    isOpen.value = false;
  };
</script>

<template>
  <BaseModal v-model="isOpen" size="lg" @close="handleClose">
    <div class="flex flex-col gap-8">
      <CardTitle :title="title" body="Completa la información solicitada.">
        <template #actions>
          <div class="w-[340px]">
            <CascadeSelectInputZod
              v-model="tipoAccionista"
              name="tipo_accionista"
              label="Tipo de accionista"
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
      <div class="flex w-full flex-col gap-3 border-t border-slate-200 pt-4 md:flex-row md:justify-end">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          class="w-full md:w-auto"
          @click="handleClose"
        />
        <ActionButton
          :label="mode === 'create' ? 'Guardar' : 'Actualizar'"
          size="md"
          :is-loading="isSaving"
          class="w-full md:w-auto"
          type="button"
          @click="handleSubmit"
        />
      </div>
    </template>
  </BaseModal>
</template>

