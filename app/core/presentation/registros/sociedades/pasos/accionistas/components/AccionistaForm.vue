<script setup lang="ts">
  import { Form } from "vee-validate";
  import { computed, reactive, watch } from "vue";
  import { z } from "zod";

  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import {
    DOCUMENT_TYPES,
    personaOptions,
    type AccionistaFormValues,
    type FiduciarioFormValues,
    type PersonaTipoForm,
    type RepresentanteFormValues,
  } from "../types";
  import { tipoFondoOptions } from "~/constants/inputs/tipo-fondos";

  interface Props {
    initialValues?: Partial<AccionistaFormValues>;
    mode?: "create" | "edit";
  }

  const props = withDefaults(defineProps<Props>(), {
    initialValues: undefined,
    mode: "create",
  });

  const emit = defineEmits<{
    (e: "submit", values: AccionistaFormValues): void;
  }>();

  interface RepresentativeState extends Required<RepresentanteFormValues> {
    tipoDocumento: string;
  }

  interface FiduciarioState extends Required<FiduciarioFormValues> {}

  interface FormState {
    currentId?: string;
    personaType: PersonaTipoForm;
    participacionPorcentual: number | null;
    natural: {
      tipoDocumento: string;
      numeroDocumento: string;
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno: string;
      paisEmision: string;
    };
    juridica: {
      tipoDocumento: string;
      numeroDocumento: string;
      razonSocial: string;
      nombreComercial: string;
      direccion: string;
      pais: string;
      distrito: string;
      provincia: string;
      departamento: string;
      constituida: string;
    };
    sucursal: {
      ruc: string;
      nombreSucursal: string;
      partidaRegistral: string;
      oficinaRegistrada: string;
      direccionFiscal: string;
      representante: RepresentativeState;
    };
    fondo: {
      ruc: string;
      razonSocial: string;
      direccion: string;
      tipoFondo: string;
      representante: RepresentativeState;
      fiduciario: FiduciarioState;
    };
    fideicomiso: {
      tieneRuc: string;
      ruc: string;
      razonSocial: string;
      numeroRegistroFideicomiso: string;
      partidaRegistral: string;
      oficinaRegistrada: string;
      direccionFiscal: string;
      representante: RepresentativeState;
      fiduciario: FiduciarioState;
    };
    sucesion: {
      ruc: string;
      razonSocial: string;
      distrito: string;
      provincia: string;
      departamento: string;
      direccion: string;
      representante: RepresentativeState;
    };
  }

  const BOOLEAN_OPTIONS = [
    { id: "true", label: "Sí", value: "true" },
    { id: "false", label: "No", value: "false" },
  ];

  const optionalString = z.string().optional();
  const required = (message: string) => z.string().min(1, message);
  const docSchema = required("Este campo es obligatorio");

  const createRepresentativeState = (): RepresentativeState => ({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    paisEmision: "",
  });

  const createFiduciarioState = (): FiduciarioState => ({
    ruc: "",
    razonSocial: "",
  });

  const createDefaultState = (): FormState => ({
    currentId: undefined,
    personaType: "NATURAL",
    participacionPorcentual: null,
    natural: {
      tipoDocumento: "DNI",
      numeroDocumento: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      paisEmision: "",
    },
    juridica: {
      tipoDocumento: "RUC",
      numeroDocumento: "",
      razonSocial: "",
      nombreComercial: "",
      direccion: "",
      pais: "",
      distrito: "",
      provincia: "",
      departamento: "",
      constituida: "",
    },
    sucursal: {
      ruc: "",
      nombreSucursal: "",
      partidaRegistral: "",
      oficinaRegistrada: "",
      direccionFiscal: "",
      representante: createRepresentativeState(),
    },
    fondo: {
      ruc: "",
      razonSocial: "",
      direccion: "",
      tipoFondo: "CERRADO",
      representante: createRepresentativeState(),
      fiduciario: createFiduciarioState(),
    },
    fideicomiso: {
      tieneRuc: "",
      ruc: "",
      razonSocial: "",
      numeroRegistroFideicomiso: "",
      partidaRegistral: "",
      oficinaRegistrada: "",
      direccionFiscal: "",
      representante: createRepresentativeState(),
      fiduciario: createFiduciarioState(),
    },
    sucesion: {
      ruc: "",
      razonSocial: "",
      distrito: "",
      provincia: "",
      departamento: "",
      direccion: "",
      representante: createRepresentativeState(),
    },
  });

  const form = reactive<FormState>(createDefaultState());

  const cloneRepresentative = (value?: RepresentanteFormValues): RepresentativeState => ({
    nombre: value?.nombre ?? "",
    apellidoPaterno: value?.apellidoPaterno ?? "",
    apellidoMaterno: value?.apellidoMaterno ?? "",
    tipoDocumento: value?.tipoDocumento ?? "DNI",
    numeroDocumento: value?.numeroDocumento ?? "",
    paisEmision: value?.paisEmision ?? "",
  });

  const cloneFiduciario = (value?: FiduciarioFormValues): FiduciarioState => ({
    ruc: value?.ruc ?? "",
    razonSocial: value?.razonSocial ?? "",
  });

  const applyInitialValues = (value?: Partial<AccionistaFormValues>) => {
    Object.assign(form, createDefaultState());
    if (!value) return;

    form.currentId = value.id;
    form.personaType = (value.personaType as PersonaTipoForm) ?? "NATURAL";
    form.participacionPorcentual =
      value.participacionPorcentual === undefined ? null : value.participacionPorcentual;

    switch (form.personaType) {
      case "JURIDICA": {
        const juridica = value as Extract<AccionistaFormValues, { personaType: "JURIDICA" }>;
        Object.assign(form.juridica, {
          tipoDocumento: juridica.tipoDocumento ?? "RUC",
          numeroDocumento: juridica.numeroDocumento ?? "",
          razonSocial: juridica.razonSocial ?? "",
          nombreComercial: juridica.nombreComercial ?? "",
          direccion: juridica.direccion ?? "",
          pais: juridica.pais ?? "",
          distrito: juridica.distrito ?? "",
          provincia: juridica.provincia ?? "",
          departamento: juridica.departamento ?? "",
          constituida: juridica.constituida ?? "",
        });
        break;
      }
      case "SUCURSAL": {
        const sucursal = value as Extract<AccionistaFormValues, { personaType: "SUCURSAL" }>;
        Object.assign(form.sucursal, {
          ruc: sucursal.ruc ?? "",
          nombreSucursal: sucursal.nombreSucursal ?? "",
          partidaRegistral: sucursal.partidaRegistral ?? "",
          oficinaRegistrada: sucursal.oficinaRegistrada ?? "",
          direccionFiscal: sucursal.direccionFiscal ?? "",
          representante: cloneRepresentative(sucursal.representante),
        });
        break;
      }
      case "FONDO_INVERSION": {
        const fondo = value as Extract<AccionistaFormValues, { personaType: "FONDO_INVERSION" }>;
        Object.assign(form.fondo, {
          ruc: fondo.ruc ?? "",
          razonSocial: fondo.razonSocial ?? "",
          direccion: fondo.direccion ?? "",
          tipoFondo: fondo.tipoFondo ?? "CERRADO",
          representante: cloneRepresentative(fondo.representante),
          fiduciario: cloneFiduciario(fondo.fiduciario),
        });
        break;
      }
      case "FIDEICOMISO": {
        const fideicomiso = value as Extract<AccionistaFormValues, { personaType: "FIDEICOMISO" }>;
        Object.assign(form.fideicomiso, {
          tieneRuc: fideicomiso.tieneRuc ?? "",
          ruc: fideicomiso.ruc ?? "",
          razonSocial: fideicomiso.razonSocial ?? "",
          numeroRegistroFideicomiso: fideicomiso.numeroRegistroFideicomiso ?? "",
          partidaRegistral: fideicomiso.partidaRegistral ?? "",
          oficinaRegistrada: fideicomiso.oficinaRegistrada ?? "",
          direccionFiscal: fideicomiso.direccionFiscal ?? "",
          representante: cloneRepresentative(fideicomiso.representante),
          fiduciario: cloneFiduciario(fideicomiso.fiduciario),
        });
        break;
      }
      case "SUCESION_INDIVISA": {
        const sucesion = value as Extract<AccionistaFormValues, { personaType: "SUCESION_INDIVISA" }>;
        Object.assign(form.sucesion, {
          ruc: sucesion.ruc ?? "",
          razonSocial: sucesion.razonSocial ?? "",
          distrito: sucesion.distrito ?? "",
          provincia: sucesion.provincia ?? "",
          departamento: sucesion.departamento ?? "",
          direccion: sucesion.direccion ?? "",
          representante: cloneRepresentative(sucesion.representante),
        });
        break;
      }
      case "NATURAL":
      default: {
        const natural = value as Extract<AccionistaFormValues, { personaType: "NATURAL" }>;
        Object.assign(form.natural, {
          tipoDocumento: natural?.tipoDocumento ?? "DNI",
          numeroDocumento: natural?.numeroDocumento ?? "",
          nombre: natural?.nombre ?? "",
          apellidoPaterno: natural?.apellidoPaterno ?? "",
          apellidoMaterno: natural?.apellidoMaterno ?? "",
          paisEmision: natural?.paisEmision ?? "",
        });
        break;
      }
    }
  };

  applyInitialValues(props.initialValues);

  watch(
    () => props.initialValues,
    (value) => applyInitialValues(value),
    { deep: true }
  );

  const isNatural = computed(() => form.personaType === "NATURAL");
  const isJuridica = computed(() => form.personaType === "JURIDICA");
  const isSucursal = computed(() => form.personaType === "SUCURSAL");
  const isFondo = computed(() => form.personaType === "FONDO_INVERSION");
  const isFideicomiso = computed(() => form.personaType === "FIDEICOMISO");
  const isSucesion = computed(() => form.personaType === "SUCESION_INDIVISA");

  const participacionModel = computed({
    get: () => form.participacionPorcentual ?? 0,
    set: (value: number) => {
      form.participacionPorcentual = Number.isNaN(value) ? null : value;
    },
  });

  const handlePersonaTypeChange = (value: string) => {
    form.personaType = value as PersonaTipoForm;
  };

  const normalizeString = (value?: string | null) => {
    if (value === null || value === undefined) return undefined;
    const trimmed = `${value}`.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  const buildRepresentative = (state: RepresentativeState): RepresentanteFormValues | undefined => {
    const nombre = normalizeString(state.nombre);
    const apellidoPaterno = normalizeString(state.apellidoPaterno);
    const numeroDocumento = normalizeString(state.numeroDocumento);
    if (!nombre && !apellidoPaterno && !numeroDocumento) {
      return undefined;
    }
    return {
      nombre: nombre ?? "",
      apellidoPaterno: apellidoPaterno ?? "",
      apellidoMaterno: normalizeString(state.apellidoMaterno),
      tipoDocumento: state.tipoDocumento || "DNI",
      numeroDocumento: numeroDocumento ?? "",
      paisEmision: normalizeString(state.paisEmision),
    };
  };

  const buildFiduciario = (state: FiduciarioState): FiduciarioFormValues | undefined => {
    const ruc = normalizeString(state.ruc);
    const razonSocial = normalizeString(state.razonSocial);
    if (!ruc && !razonSocial) {
      return undefined;
    }
    return {
      ruc: ruc ?? undefined,
      razonSocial: razonSocial ?? undefined,
    };
  };

  const buildValues = (): AccionistaFormValues => {
    switch (form.personaType) {
      case "JURIDICA":
        return {
          personaType: "JURIDICA",
          id: form.currentId,
          participacionPorcentual: form.participacionPorcentual,
          tipoDocumento: form.juridica.tipoDocumento,
          numeroDocumento: form.juridica.numeroDocumento,
          razonSocial: form.juridica.razonSocial,
          nombreComercial: normalizeString(form.juridica.nombreComercial),
          direccion: normalizeString(form.juridica.direccion),
          pais: normalizeString(form.juridica.pais),
          distrito: normalizeString(form.juridica.distrito),
          provincia: normalizeString(form.juridica.provincia),
          departamento: normalizeString(form.juridica.departamento),
          constituida: form.juridica.constituida || undefined,
        };
      case "SUCURSAL":
        return {
          personaType: "SUCURSAL",
          id: form.currentId,
          participacionPorcentual: form.participacionPorcentual,
          ruc: form.sucursal.ruc,
          nombreSucursal: form.sucursal.nombreSucursal,
          partidaRegistral: normalizeString(form.sucursal.partidaRegistral),
          oficinaRegistrada: normalizeString(form.sucursal.oficinaRegistrada),
          direccionFiscal: normalizeString(form.sucursal.direccionFiscal),
          representante: buildRepresentative(form.sucursal.representante),
        };
      case "FONDO_INVERSION":
        return {
          personaType: "FONDO_INVERSION",
          id: form.currentId,
          participacionPorcentual: form.participacionPorcentual,
          ruc: form.fondo.ruc,
          razonSocial: form.fondo.razonSocial,
          direccion: normalizeString(form.fondo.direccion),
          tipoFondo: form.fondo.tipoFondo || "CERRADO",
          representante: buildRepresentative(form.fondo.representante),
          fiduciario: buildFiduciario(form.fondo.fiduciario),
        };
      case "FIDEICOMISO":
        return {
          personaType: "FIDEICOMISO",
          id: form.currentId,
          participacionPorcentual: form.participacionPorcentual,
          tieneRuc: form.fideicomiso.tieneRuc || undefined,
          ruc: normalizeString(form.fideicomiso.ruc),
          razonSocial: normalizeString(form.fideicomiso.razonSocial),
          numeroRegistroFideicomiso: normalizeString(form.fideicomiso.numeroRegistroFideicomiso),
          partidaRegistral: normalizeString(form.fideicomiso.partidaRegistral),
          oficinaRegistrada: normalizeString(form.fideicomiso.oficinaRegistrada),
          direccionFiscal: normalizeString(form.fideicomiso.direccionFiscal),
          representante: buildRepresentative(form.fideicomiso.representante),
          fiduciario: buildFiduciario(form.fideicomiso.fiduciario),
        };
      case "SUCESION_INDIVISA":
        return {
          personaType: "SUCESION_INDIVISA",
          id: form.currentId,
          participacionPorcentual: form.participacionPorcentual,
          ruc: normalizeString(form.sucesion.ruc),
          razonSocial: form.sucesion.razonSocial,
          distrito: normalizeString(form.sucesion.distrito),
          provincia: normalizeString(form.sucesion.provincia),
          departamento: normalizeString(form.sucesion.departamento),
          direccion: normalizeString(form.sucesion.direccion),
          representante: buildRepresentative(form.sucesion.representante),
        };
      case "NATURAL":
        return {
          personaType: "NATURAL",
          id: form.currentId,
          participacionPorcentual: form.participacionPorcentual,
          tipoDocumento: form.natural.tipoDocumento,
          numeroDocumento: form.natural.numeroDocumento,
          nombre: form.natural.nombre,
          apellidoPaterno: form.natural.apellidoPaterno,
          apellidoMaterno: normalizeString(form.natural.apellidoMaterno),
          paisEmision: normalizeString(form.natural.paisEmision),
        };
      default:
        return {
          personaType: "JURIDICA",
          id: form.currentId,
          participacionPorcentual: form.participacionPorcentual,
          tipoDocumento: form.juridica.tipoDocumento,
          numeroDocumento: form.juridica.numeroDocumento,
          razonSocial: form.juridica.razonSocial,
          nombreComercial: normalizeString(form.juridica.nombreComercial),
          direccion: normalizeString(form.juridica.direccion),
          pais: normalizeString(form.juridica.pais),
          distrito: normalizeString(form.juridica.distrito),
          provincia: normalizeString(form.juridica.provincia),
          departamento: normalizeString(form.juridica.departamento),
          constituida: form.juridica.constituida || undefined,
        };
    }
  };

  const handleSubmit = () => {
    emit("submit", buildValues());
  };
</script>

<template>
  <Form id="accionistas-form" class="space-y-8" @submit="handleSubmit">
    <section class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SelectInputZod
        :model-value="form.personaType"
        name="persona-type"
        label="Tipo de accionista"
        placeholder="Selecciona una opción"
        :options="personaOptions"
        :schema="required('Selecciona un tipo')"
        @update:model-value="handlePersonaTypeChange"
      />

      <NumberInputZod
        v-model="participacionModel"
        name="participacion"
        label="Participación porcentual"
        placeholder="0"
        :schema="z
          .number()
          .min(0, 'Debe ser mayor o igual a 0')
          .max(100, 'Debe ser menor o igual a 100')"
        format="decimal"
        :decimals="2"
        :decimal-factor="1"
      />
    </section>

    <section v-if="isNatural" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SelectInputZod
        v-model="form.natural.tipoDocumento"
        name="natural-tipo-documento"
        label="Tipo de documento"
        placeholder="Selecciona una opción"
        :options="DOCUMENT_TYPES"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.natural.numeroDocumento"
        name="natural-numero-documento"
        label="Número de documento"
        placeholder="Ingresa el número"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.natural.nombre"
        name="natural-nombre"
        label="Nombres"
        placeholder="Ingresa los nombres"
        :schema="required('Ingresa los nombres')"
      />
      <TextInputZod
        v-model="form.natural.apellidoPaterno"
        name="natural-apellido-paterno"
        label="Apellido paterno"
        placeholder="Ingresa el apellido paterno"
        :schema="required('Ingresa el apellido paterno')"
      />
      <TextInputZod
        v-model="form.natural.apellidoMaterno"
        name="natural-apellido-materno"
        label="Apellido materno"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.natural.paisEmision"
        name="natural-pais-emision"
        label="País de emisión"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <section v-if="isJuridica" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SelectInputZod
        v-model="form.juridica.tipoDocumento"
        name="juridica-tipo-documento"
        label="Tipo de documento"
        placeholder="Selecciona una opción"
        :options="DOCUMENT_TYPES"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.juridica.numeroDocumento"
        name="juridica-numero-documento"
        label="Número de documento"
        placeholder="Ingresa el número"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.juridica.razonSocial"
        name="juridica-razon-social"
        label="Razón social"
        placeholder="RAZÓN SOCIAL SAC"
        :schema="required('Ingresa la razón social')"
      />
      <TextInputZod
        v-model="form.juridica.nombreComercial"
        name="juridica-nombre-comercial"
        label="Nombre comercial"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.juridica.direccion"
        name="juridica-direccion"
        label="Dirección"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.juridica.pais"
        name="juridica-pais"
        label="País"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.juridica.distrito"
        name="juridica-distrito"
        label="Distrito"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.juridica.provincia"
        name="juridica-provincia"
        label="Provincia"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.juridica.departamento"
        name="juridica-departamento"
        label="Departamento"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <SelectInputZod
        v-model="form.juridica.constituida"
        name="juridica-constituida"
        label="¿Constituida?"
        placeholder="Selecciona una opción"
        :options="BOOLEAN_OPTIONS"
        :schema="optionalString"
      />
    </section>

    <section v-if="isSucursal" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextInputZod
        v-model="form.sucursal.ruc"
        name="sucursal-ruc"
        label="RUC"
        placeholder="2060..."
        :schema="required('Ingresa el RUC')"
      />
      <TextInputZod
        v-model="form.sucursal.nombreSucursal"
        name="sucursal-nombre"
        label="Nombre de la sucursal"
        placeholder="Ej. Sucursal Norte"
        :schema="required('Ingresa el nombre de la sucursal')"
      />
      <TextInputZod
        v-model="form.sucursal.partidaRegistral"
        name="sucursal-partida"
        label="Partida registral"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.sucursal.oficinaRegistrada"
        name="sucursal-oficina"
        label="Oficina registrada"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.sucursal.direccionFiscal"
        name="sucursal-direccion"
        label="Dirección fiscal"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <section v-if="isSucursal" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextInputZod
        v-model="form.sucursal.representante.nombre"
        name="sucursal-representante-nombre"
        label="Nombre del representante"
        placeholder="Nombre"
        :schema="required('Ingresa el nombre del representante')"
      />
      <TextInputZod
        v-model="form.sucursal.representante.apellidoPaterno"
        name="sucursal-representante-apellido-paterno"
        label="Apellido paterno"
        placeholder="Apellido paterno"
        :schema="required('Ingresa el apellido paterno')"
      />
      <TextInputZod
        v-model="form.sucursal.representante.apellidoMaterno"
        name="sucursal-representante-apellido-materno"
        label="Apellido materno"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <SelectInputZod
        v-model="form.sucursal.representante.tipoDocumento"
        name="sucursal-representante-tipo-documento"
        label="Tipo de documento"
        placeholder="Selecciona una opción"
        :options="DOCUMENT_TYPES"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.sucursal.representante.numeroDocumento"
        name="sucursal-representante-numero-documento"
        label="Número de documento"
        placeholder="Número de documento"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.sucursal.representante.paisEmision"
        name="sucursal-representante-pais"
        label="País de emisión"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <section v-if="isFondo" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextInputZod
        v-model="form.fondo.ruc"
        name="fondo-ruc"
        label="RUC"
        placeholder="2060..."
        :schema="required('Ingresa el RUC del fondo')"
      />
      <TextInputZod
        v-model="form.fondo.razonSocial"
        name="fondo-razon"
        label="Razón social"
        placeholder="Nombre del fondo"
        :schema="required('Ingresa la razón social')"
      />
      <TextInputZod
        v-model="form.fondo.direccion"
        name="fondo-direccion"
        label="Dirección"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <SelectInputZod
        v-model="form.fondo.tipoFondo"
        name="fondo-tipo"
        label="Tipo de fondo"
        placeholder="Selecciona una opción"
        :options="tipoFondoOptions"
        :schema="required('Selecciona el tipo de fondo')"
      />
    </section>

    <section v-if="isFondo" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextInputZod
        v-model="form.fondo.representante.nombre"
        name="fondo-representante-nombre"
        label="Nombre del representante"
        placeholder="Nombre"
        :schema="required('Ingresa el nombre del representante')"
      />
      <TextInputZod
        v-model="form.fondo.representante.apellidoPaterno"
        name="fondo-representante-apellido-paterno"
        label="Apellido paterno"
        placeholder="Apellido paterno"
        :schema="required('Ingresa el apellido paterno')"
      />
      <TextInputZod
        v-model="form.fondo.representante.apellidoMaterno"
        name="fondo-representante-apellido-materno"
        label="Apellido materno"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <SelectInputZod
        v-model="form.fondo.representante.tipoDocumento"
        name="fondo-representante-tipo-documento"
        label="Tipo de documento"
        placeholder="Selecciona una opción"
        :options="DOCUMENT_TYPES"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.fondo.representante.numeroDocumento"
        name="fondo-representante-numero-documento"
        label="Número de documento"
        placeholder="Número de documento"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.fondo.representante.paisEmision"
        name="fondo-representante-pais"
        label="País de emisión"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <section v-if="isFondo" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextInputZod
        v-model="form.fondo.fiduciario.ruc"
        name="fondo-fiduciario-ruc"
        label="RUC del fiduciario"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.fondo.fiduciario.razonSocial"
        name="fondo-fiduciario-razon"
        label="Razón social fiduciario"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <section v-if="isFideicomiso" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SelectInputZod
        v-model="form.fideicomiso.tieneRuc"
        name="fideicomiso-tiene-ruc"
        label="¿Tiene RUC?"
        placeholder="Selecciona una opción"
        :options="BOOLEAN_OPTIONS"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.fideicomiso.ruc"
        name="fideicomiso-ruc"
        label="RUC"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.fideicomiso.razonSocial"
        name="fideicomiso-razon"
        label="Razón social"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.fideicomiso.numeroRegistroFideicomiso"
        name="fideicomiso-registro"
        label="Número de registro del fideicomiso"
        placeholder="REG-2024-..."
        :schema="required('Ingresa el número de registro')"
      />
      <TextInputZod
        v-model="form.fideicomiso.partidaRegistral"
        name="fideicomiso-partida"
        label="Partida registral"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.fideicomiso.oficinaRegistrada"
        name="fideicomiso-oficina"
        label="Oficina registrada"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.fideicomiso.direccionFiscal"
        name="fideicomiso-direccion"
        label="Dirección fiscal"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <section v-if="isFideicomiso" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextInputZod
        v-model="form.fideicomiso.representante.nombre"
        name="fideicomiso-representante-nombre"
        label="Nombre del representante"
        placeholder="Nombre"
        :schema="required('Ingresa el nombre del representante')"
      />
      <TextInputZod
        v-model="form.fideicomiso.representante.apellidoPaterno"
        name="fideicomiso-representante-apellido-paterno"
        label="Apellido paterno"
        placeholder="Apellido paterno"
        :schema="required('Ingresa el apellido paterno')"
      />
      <TextInputZod
        v-model="form.fideicomiso.representante.apellidoMaterno"
        name="fideicomiso-representante-apellido-materno"
        label="Apellido materno"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <SelectInputZod
        v-model="form.fideicomiso.representante.tipoDocumento"
        name="fideicomiso-representante-tipo-documento"
        label="Tipo de documento"
        placeholder="Selecciona una opción"
        :options="DOCUMENT_TYPES"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.fideicomiso.representante.numeroDocumento"
        name="fideicomiso-representante-numero-documento"
        label="Número de documento"
        placeholder="Número de documento"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.fideicomiso.representante.paisEmision"
        name="fideicomiso-representante-pais"
        label="País de emisión"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <section v-if="isFideicomiso" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextInputZod
        v-model="form.fideicomiso.fiduciario.ruc"
        name="fideicomiso-fiduciario-ruc"
        label="RUC del fiduciario"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.fideicomiso.fiduciario.razonSocial"
        name="fideicomiso-fiduciario-razon"
        label="Razón social fiduciario"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <section v-if="isSucesion" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextInputZod
        v-model="form.sucesion.ruc"
        name="sucesion-ruc"
        label="RUC"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.sucesion.razonSocial"
        name="sucesion-razon"
        label="Razón social"
        placeholder="Sucesión de..."
        :schema="required('Ingresa la razón social')"
      />
      <TextInputZod
        v-model="form.sucesion.distrito"
        name="sucesion-distrito"
        label="Distrito"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.sucesion.provincia"
        name="sucesion-provincia"
        label="Provincia"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.sucesion.departamento"
        name="sucesion-departamento"
        label="Departamento"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <TextInputZod
        v-model="form.sucesion.direccion"
        name="sucesion-direccion"
        label="Dirección"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <section v-if="isSucesion" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextInputZod
        v-model="form.sucesion.representante.nombre"
        name="sucesion-representante-nombre"
        label="Nombre del representante"
        placeholder="Nombre"
        :schema="required('Ingresa el nombre del representante')"
      />
      <TextInputZod
        v-model="form.sucesion.representante.apellidoPaterno"
        name="sucesion-representante-apellido-paterno"
        label="Apellido paterno"
        placeholder="Apellido paterno"
        :schema="required('Ingresa el apellido paterno')"
      />
      <TextInputZod
        v-model="form.sucesion.representante.apellidoMaterno"
        name="sucesion-representante-apellido-materno"
        label="Apellido materno"
        placeholder="Opcional"
        :schema="optionalString"
      />
      <SelectInputZod
        v-model="form.sucesion.representante.tipoDocumento"
        name="sucesion-representante-tipo-documento"
        label="Tipo de documento"
        placeholder="Selecciona una opción"
        :options="DOCUMENT_TYPES"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.sucesion.representante.numeroDocumento"
        name="sucesion-representante-numero-documento"
        label="Número de documento"
        placeholder="Número de documento"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.sucesion.representante.paisEmision"
        name="sucesion-representante-pais"
        label="País de emisión"
        placeholder="Opcional"
        :schema="optionalString"
      />
    </section>

    <div class="flex justify-end">
      <button type="submit" class="hidden">Guardar</button>
    </div>
  </Form>
</template>

