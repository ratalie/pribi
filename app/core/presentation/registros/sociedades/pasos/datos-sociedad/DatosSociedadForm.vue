<script setup lang="ts">
  import type { DatosSociedadDTO } from "@hexag/registros/sociedades/pasos/datos-sociedad/application";
  import type { SociedadDatosGenerales } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain";
  import {
    actividadExteriorSchema,
    departamentoSchema,
    direccionSchema,
    distritoSchema,
    fechaEscrituraPublicaSchema,
    fechaInscripcionRucSchema,
    fechaRegistrosPublicosSchema,
    nombreComercialSchema,
    oficinaRegistralSchema,
    partidaRegistralSchema,
    provinciaSchema,
    razonSocialSchema,
    rucSchema,
    tipoSociedadSchema,
  } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/schemas";
  import { useDatosSociedad } from "@presentation/registros/sociedades/pasos/datos-sociedad/useDatosSociedad";
  import { useForm } from "vee-validate";
  import { computed, reactive, ref, toRef, watch } from "vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { useFlowLayoutNext } from "~/composables/useFlowLayoutNext";
  import {
    getRegistryOfficeLabel,
    getTypeSocietyLabel,
    normalizeRegistryOfficeCode,
    normalizeTypeSocietyCode,
  } from "~/constants/inputs/enum-helpers";
  import { officeOptions } from "~/constants/inputs/office-options";
  import { societyTypeOptions } from "~/constants/inputs/society-types";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  const REQUIRED_FIELDS: Array<keyof DatosSociedadDTO> = [
    "numeroRuc",
    "tipoSocietario",
    "razonSocial",
    "nombreComercial",
    "direccion",
    "distrito",
    "provincia",
    "departamento",
  ];

  const createEmptyForm = (): DatosSociedadDTO => ({
    idSociety: undefined,
    numeroRuc: "",
    tipoSocietario: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    distrito: "",
    provincia: "",
    departamento: "",
    fechaInscripcionRuc: "",
    actividadExterior: "",
    fechaEscrituraPublica: "",
    fechaRegistrosPublicos: "",
    partidaRegistral: "",
    oficinaRegistral: "",
  });

  interface Props {
    societyId: string;
    mode?: EntityModeEnum;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: EntityModeEnum.CREAR,
  });

  const societyIdRef = toRef(props, "societyId");
  const modeRef = toRef(props, "mode");

  const emit = defineEmits<{
    (
      e: "completion-change",
      payload: { isComplete: boolean; missingFields: Array<keyof DatosSociedadDTO> }
    ): void;
  }>();

  const form = reactive<DatosSociedadDTO>(createEmptyForm());

  const { datos, isLoading, fetch, save } = useDatosSociedad(societyIdRef);

  // Usar useForm para validación programática (se conecta automáticamente al Form más cercano)
  const { validate, setFieldTouched } = useForm();

  const isReadonly = computed(() => modeRef.value === EntityModeEnum.PREVISUALIZAR);

  const societyOptions = societyTypeOptions;
  const officeSelectOptions = officeOptions;

  const tipoSocietarioLabel = computed(() => getTypeSocietyLabel(form.tipoSocietario));
  const oficinaRegistralLabel = computed(() => getRegistryOfficeLabel(form.oficinaRegistral));

  const missingRequiredFields = computed(() =>
    REQUIRED_FIELDS.filter((field) => {
      const value = form[field];
      return typeof value !== "string" || value.trim().length === 0;
    })
  );

  const isComplete = computed(() => missingRequiredFields.value.length === 0);

  function populateForm(value: SociedadDatosGenerales | null) {
    if (!value) {
      Object.assign(form, createEmptyForm());
      return;
    }

    Object.assign(form, {
      idSociety: value.idSociety ?? form.idSociety ?? undefined,
      numeroRuc: value.numeroRuc ?? "",
      tipoSocietario: normalizeTypeSocietyCode(value.tipoSocietario ?? ""),
      razonSocial: value.razonSocial ?? "",
      nombreComercial: value.nombreComercial ?? "",
      direccion: value.direccion ?? "",
      distrito: value.distrito ?? "",
      provincia: value.provincia ?? "",
      departamento: value.departamento ?? "",
      fechaInscripcionRuc: value.fechaInscripcionRuc ?? "",
      actividadExterior: value.actividadExterior ?? "",
      fechaEscrituraPublica: value.fechaEscrituraPublica ?? "",
      fechaRegistrosPublicos: value.fechaRegistrosPublicos ?? "",
      partidaRegistral: value.partidaRegistral ?? "",
      oficinaRegistral: normalizeRegistryOfficeCode(value.oficinaRegistral ?? ""),
    });
  }

  watch(
    () => datos.value,
    (value) => {
      populateForm(value);
    },
    { immediate: true }
  );

  const lastFetchedSocietyId = ref<string | null>(null);

  const fetchDatos = async () => {
    const id = societyIdRef.value;
    if (!id) return;

    try {
      await fetch();
      lastFetchedSocietyId.value = id;
    } catch (err: any) {
      const statusCode = err?.statusCode ?? err?.response?.status;
      if (statusCode !== 404) {
        console.error("[DatosSociedadForm] fetch error", err);
      }
    }
  };

  watch(
    () => societyIdRef.value,
    (value, previous) => {
      if (!value) return;
      if (value === previous && lastFetchedSocietyId.value === value) return;
      fetchDatos();
    },
    { immediate: true }
  );

  const buildPayload = (): DatosSociedadDTO => ({
    ...form,
    idSociety: form.idSociety ?? datos.value?.idSociety ?? undefined,
    tipoSocietario: normalizeTypeSocietyCode(form.tipoSocietario),
    oficinaRegistral: normalizeRegistryOfficeCode(form.oficinaRegistral),
  });

  function handleSearchRuc(ruc: string) {
    console.info("[DatosSociedadForm] buscar RUC", ruc);
  }

  watch(
    [isComplete, missingRequiredFields],
    ([complete, missing]) => {
      emit("completion-change", {
        isComplete: complete,
        missingFields: missing,
      });
    },
    { immediate: true }
  );

  const createdAt = computed(() => {
    if (!isReadonly.value || !datos.value?.createdAt) return "";
    return new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeStyle: "short" }).format(
      new Date(datos.value.createdAt)
    );
  });

  const updatedAt = computed(() => {
    if (!isReadonly.value || !datos.value?.updatedAt) return "";
    return new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeStyle: "short" }).format(
      new Date(datos.value.updatedAt)
    );
  });

  const handleNext = async () => {
    if (isReadonly.value) {
      // Si es readonly, solo navegar (sin guardar)
      return;
    }

    // Lista de nombres de campos del formulario
    const fieldNames = [
      "numero-ruc",
      "tipo-sociedad",
      "razon-social",
      "nombre-comercial",
      "direccion",
      "distrito",
      "provincia",
      "departamento",
      "fecha-inscripcion-ruc",
      "actividad-exterior",
      "fecha-escritura-publica",
      "fecha-registros-publicos",
      "partida-registral",
      "oficina-registral",
    ];

    // Marcar todos los campos como "touched" para que se muestren los errores
    fieldNames.forEach((fieldName) => {
      setFieldTouched(fieldName, true);
    });

    // Validar formulario antes de guardar usando useForm
    const { valid } = await validate();

    if (!valid) {
      // Si la validación falla, no avanzar
      // Los errores ya se muestran en el formulario (ahora que están marcados como touched)
      console.error("[DatosSociedadForm] Validación fallida, no se puede avanzar");
      throw new Error("Validación fallida: Por favor, completa todos los campos requeridos");
    }

    // Si la validación pasa, guardar
    try {
      const result = await save(buildPayload());
      console.log(
        `[DatosSociedadForm] Datos ${
          result === "created" ? "registrados" : "actualizados"
        } correctamente`
      );
      // Nota: La navegación al siguiente paso la maneja automáticamente useFlowLayoutNext
    } catch (err) {
      console.error("[DatosSociedadForm] Error al guardar datos:", err);
      throw err; // Re-lanzar el error para que useFlowLayoutNext no navegue
    }
  };

  useFlowLayoutNext(handleNext);
</script>

<template>
  <div class="bg-white p-14">
    <CardTitle
      title="Datos principales"
      body="Complete todos los datos requeridos."
      class="mb-8"
    />

    <div v-if="isLoading">
      <div class="animate-pulse space-y-6">
        <div class="h-4 w-1/2 rounded bg-gray-200" />
        <div class="grid grid-cols-2 gap-6">
          <div v-for="i in 10" :key="i" class="h-16 rounded bg-gray-100" />
        </div>
      </div>
    </div>

    <div v-else-if="isReadonly" class="space-y-6">
      <dl class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <div>
          <dt class="text-sm font-medium text-gray-500">Número de RUC</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.numeroRuc || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Tipo de sociedad</dt>
          <dd class="mt-1 text-base text-gray-900">{{ tipoSocietarioLabel || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Razón social</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.razonSocial || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Nombre comercial</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.nombreComercial || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Dirección</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.direccion || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Distrito</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.distrito || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Provincia</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.provincia || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Departamento</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.departamento || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Fecha inscripción RUC</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.fechaInscripcionRuc || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Actividad exterior</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.actividadExterior || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Fecha escritura pública</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.fechaEscrituraPublica || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Fecha registros públicos</dt>
          <dd class="mt-1 text-base text-gray-900">
            {{ form.fechaRegistrosPublicos || "—" }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Partida registral</dt>
          <dd class="mt-1 text-base text-gray-900">{{ form.partidaRegistral || "—" }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Oficina registral</dt>
          <dd class="mt-1 text-base text-gray-900">{{ oficinaRegistralLabel || "—" }}</dd>
        </div>
      </dl>

      <div class="mt-6 text-sm text-gray-500">
        <p v-if="createdAt">Creado: {{ createdAt }}</p>
        <p v-if="updatedAt">Última actualización: {{ updatedAt }}</p>
      </div>
    </div>

    <form v-else class="grid grid-cols-2 gap-14" @submit.prevent>
      <SearchInputZod
        v-model="form.numeroRuc"
        name="numero-ruc"
        label="Número de RUC"
        placeholder="Ingrese el número de RUC"
        :schema="rucSchema"
        :is-loading="false"
        @search="handleSearchRuc"
      />

      <SelectInputZod
        v-model="form.tipoSocietario"
        :options="societyOptions"
        name="tipo-sociedad"
        label="Tipo de sociedad"
        placeholder="Tipo de sociedad"
        :schema="tipoSociedadSchema"
      />

      <TextInputZod
        v-model="form.razonSocial"
        name="razon-social"
        label="Razón social"
        placeholder="Razón social"
        :schema="razonSocialSchema"
      />

      <TextInputZod
        v-model="form.nombreComercial"
        name="nombre-comercial"
        label="Nombre comercial"
        placeholder="Nombre comercial"
        :schema="nombreComercialSchema"
      />

      <TextInputZod
        v-model="form.direccion"
        name="direccion"
        label="Dirección"
        placeholder="Dirección"
        :schema="direccionSchema"
      />

      <TextInputZod
        v-model="form.distrito"
        name="distrito"
        label="Distrito"
        placeholder="Distrito"
        :schema="distritoSchema"
      />

      <TextInputZod
        v-model="form.provincia"
        name="provincia"
        label="Provincia"
        placeholder="Provincia"
        :schema="provinciaSchema"
      />

      <TextInputZod
        v-model="form.departamento"
        name="departamento"
        label="Departamento"
        placeholder="Departamento"
        :schema="departamentoSchema"
      />

      <DateInputZod
        v-model="form.fechaInscripcionRuc"
        name="fecha-inscripcion-ruc"
        label="Fecha de inscripción de RUC"
        placeholder="Selecciona la fecha"
        :schema="fechaInscripcionRucSchema"
      />

      <TextInputZod
        v-model="form.actividadExterior"
        name="actividad-exterior"
        label="Actividad exterior"
        placeholder="Actividad exterior"
        :schema="actividadExteriorSchema"
      />

      <DateInputZod
        v-model="form.fechaEscrituraPublica"
        name="fecha-escritura-publica"
        label="Fecha de escritura pública"
        placeholder="Selecciona la fecha"
        :schema="fechaEscrituraPublicaSchema"
      />

      <DateInputZod
        v-model="form.fechaRegistrosPublicos"
        name="fecha-registros-publicos"
        label="Fecha de registros públicos"
        placeholder="Selecciona la fecha"
        :schema="fechaRegistrosPublicosSchema"
      />

      <TextInputZod
        v-model="form.partidaRegistral"
        name="partida-registral"
        label="Partida registral"
        placeholder="Partida registral"
        :schema="partidaRegistralSchema"
      />

      <SelectInputZod
        v-model="form.oficinaRegistral"
        :options="officeSelectOptions"
        name="oficina-registral"
        label="Oficina registral"
        placeholder="Oficina registral"
        :schema="oficinaRegistralSchema"
      />
    </form>
  </div>
</template>
