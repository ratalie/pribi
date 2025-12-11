<script setup lang="ts">
  import { countriesOptions } from "~/constants/inputs/countries-options";
  import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
  import type { PersonaJuridica, PersonaNatural } from "~/core/hexag/juntas/application/dtos";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import {
    apellidoMaternoNaturalSchema,
    apellidoPaternoNaturalSchema,
    nombreNaturalSchema,
    numeroDocumentoNaturalSchema,
    paisPasaporteNaturalSchema,
    tipoDocumentoNaturalSchema,
  } from "~/schemas/PersonaNatural";
  import {
    departamentoAccSchema,
    direccionAccSchema,
    distritoAccSchema,
    nombreComercialAccSchema,
    numeroDocumentoJurAccSchema,
    paisOrigenAccSchema,
    provinciaAccSchema,
    razonSocialAccSchema,
    tipoDocumentoAccSchema,
  } from "~/schemas/registro-sociedades/accionistasSchemas";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const snapshotStore = useSnapshotStore();

  const personaNaturalDefaultValues = {
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
  };

  const personaJuridicaDefaultValues = {
    seConstituyoEnPeru: true,
    tipoDocumento: "",
    numeroDocumento: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    distrito: "",
    provincia: "",
    departamento: "",
    paisOrigen: "",
    tieneRepresentante: false,
  };

  const tipoPersona = ref<"natural" | "juridica">("natural");

  const personaNatural = ref(personaNaturalDefaultValues);
  const personaJuridica = ref(personaJuridicaDefaultValues);

  const mapPersonNatural = (persona: PersonaNatural) => {
    return {
      tipoDocumento: persona.tipoDocumento,
      numeroDocumento: persona.numeroDocumento,
      nombre: persona.nombre,
      apellidoPaterno: persona.apellidoPaterno,
      apellidoMaterno: persona.apellidoMaterno,
      paisPasaporte: persona.paisEmision ?? "",
    };
  };

  const mapPersonJuridica = (persona: PersonaJuridica) => {
    return {
      seConstituyoEnPeru: persona.constituida,
      tipoDocumento: persona.tipoDocumento,
      numeroDocumento: persona.numeroDocumento,
      razonSocial: persona.razonSocial,
      nombreComercial: persona.nombreComercial ?? "",
      direccion: persona.direccion,
      distrito: persona.distrito ?? "",
      provincia: persona.provincia ?? "",
      departamento: persona.departamento ?? "",
      paisOrigen: persona.pais ?? "",
      tieneRepresentante: false,
    };
  };

  onMounted(() => {
    if (snapshotStore.snapshot) {
      const gerenteGeneral = snapshotStore.snapshot.gerenteGeneral;

      if (gerenteGeneral) {
        if (gerenteGeneral.persona.tipo === "NATURAL") {
          tipoPersona.value = "natural";
          personaNatural.value = mapPersonNatural(gerenteGeneral.persona);
        } else {
          tipoPersona.value = "juridica";
          personaJuridica.value = mapPersonJuridica(gerenteGeneral.persona);
        }
      }
    }
  });
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Detalle de Remoción"
      subtitle="Registra los datos del gerente a remover y las razones que sustentan la decisión."
    />
    <div class="flex flex-col gap-10">
      <!-- Persona natural -->
      <template v-if="tipoPersona === 'natural'">
        <div class="grid grid-cols-2 gap-12">
          <SelectInputZod
            v-model="personaNatural.tipoDocumento"
            name="tipo_documento"
            label="Tipo de documento"
            placeholder="Selecciona el tipo de documento"
            :options="tipoDocumentoOptions"
            :schema="tipoDocumentoNaturalSchema"
            :is-disabled="true"
          />

          <SearchInputZod
            v-if="personaNatural.tipoDocumento === TipoDocumentosEnum.DNI"
            v-model="personaNatural.numeroDocumento"
            name="numero_documento"
            label="Número de documento"
            placeholder="Ingrese número de documento"
            :schema="numeroDocumentoNaturalSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-else
            v-model="personaNatural.numeroDocumento"
            name="numero_documento"
            label="Número de documento"
            placeholder="Ingrese número de documento"
            :schema="numeroDocumentoNaturalSchema"
            :is-disabled="true"
          />

          <SelectInputZod
            v-if="personaNatural.tipoDocumento === TipoDocumentosEnum.PASAPORTE"
            v-model="personaNatural.paisPasaporte"
            name="pais_pasaporte"
            label="País de pasaporte"
            placeholder="Selecciona el país de pasaporte"
            :options="countriesOptions"
            :schema="paisPasaporteNaturalSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaNatural.nombre"
            name="nombre"
            label="Nombres"
            placeholder="Nombres"
            :schema="nombreNaturalSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaNatural.apellidoPaterno"
            name="apellido_paterno"
            label="Apellido paterno"
            placeholder="Apellido paterno"
            :schema="apellidoPaternoNaturalSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaNatural.apellidoMaterno"
            name="apellido_materno"
            label="Apellido materno"
            placeholder="Apellido materno"
            :schema="apellidoMaternoNaturalSchema"
            :is-disabled="true"
          />
        </div>
      </template>

      <template v-if="tipoPersona === 'juridica'">
        <div
          v-if="personaJuridica.seConstituyoEnPeru"
          class="grid grid-cols-2 gap-12 px-12 py-10"
        >
          <SearchInputZod
            v-model="personaJuridica.numeroDocumento"
            name="numero_ruc"
            label="Número de RUC"
            placeholder="Ingresa el número de RUC"
            :schema="numeroDocumentoJurAccSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaJuridica.razonSocial"
            name="razon_social"
            label="Razón Social"
            placeholder="Razón Social"
            :schema="razonSocialAccSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaJuridica.nombreComercial"
            name="nombre_comercial"
            label="Nombre Comercial"
            placeholder="Nombre Comercial"
            :schema="nombreComercialAccSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaJuridica.direccion"
            name="direccion"
            label="Dirección"
            placeholder="Dirección"
            :schema="direccionAccSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaJuridica.distrito"
            name="distrito"
            label="Distrito"
            placeholder="Distrito"
            :schema="distritoAccSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaJuridica.provincia"
            name="provincia"
            label="Provincia"
            placeholder="Provincia"
            :schema="provinciaAccSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaJuridica.departamento"
            name="departamento"
            label="Departamento"
            placeholder="Departamento"
            :schema="departamentoAccSchema"
            :is-disabled="true"
          />
        </div>

        <div v-else class="grid grid-cols-2 gap-12 px-12 py-10">
          <TextInputZod
            v-model="personaJuridica.tipoDocumento"
            name="tipo_documento_extranjero"
            label="Tipo de Documento"
            placeholder="Escribe el tipo de documento aquí"
            :schema="tipoDocumentoAccSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaJuridica.numeroDocumento"
            name="numero_documento_extranjero"
            label="Número de Documento"
            placeholder="Ingresa el número de documento"
            :schema="numeroDocumentoJurAccSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaJuridica.razonSocial"
            name="razon_social_extranjero"
            label="Razón Social"
            placeholder="Escribe la razón social aquí"
            :schema="razonSocialAccSchema"
            :is-disabled="true"
          />

          <TextInputZod
            v-model="personaJuridica.direccion"
            name="direccion_extranjero"
            label="Dirección"
            placeholder="Dirección fiscal"
            :schema="direccionAccSchema"
            :is-disabled="true"
          />

          <SelectInputZod
            v-model="personaJuridica.paisOrigen"
            name="pais_origen_extranjero"
            label="País"
            placeholder="Selecciona el país"
            :options="countriesOptions"
            :schema="paisOrigenAccSchema"
            :is-disabled="true"
          />
        </div>
      </template>
    </div>
  </SlotWrapper>
</template>
