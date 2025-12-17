<script setup lang="ts">
  import { countriesOptions } from "~/constants/inputs/countries-options";
  import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
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
  import { useNombramientoGerentePage } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/composables/useNombramientoGerentePage";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Usar composable para gestión de datos
  const {
    tipoPersona,
    personaNatural,
    personaJuridica,
    representanteLegal,
    isLoading,
    error,
    guardarGerente,
  } = useNombramientoGerentePage();

  const personaOptions = [
    { value: "natural", label: "Persona Natural", description: "" },
    { value: "juridica", label: "Persona Jurídica", description: "" },
  ];

  // ✅ Configurar botón "Siguiente" para guardar gerente (POST o PUT según corresponda)
  useJuntasFlowNext(async () => {
    await guardarGerente();
  });
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Designación"
      subtitle="Registra la propuesta del gerente general y los criterios de evaluación."
    />
    <div class="flex flex-col gap-10">
      <LabeledCardSwitch
        v-model="tipoPersona"
        label="Tipo de persona"
        sub-label="Selecciona Persona Natural o Persona Jurídica."
        :options="personaOptions"
        :columns="2"
        default-value="natural"
      />

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
          />

          <SearchInputZod
            v-if="personaNatural.tipoDocumento === TipoDocumentosEnum.DNI"
            v-model="personaNatural.numeroDocumento"
            name="numero_documento"
            label="Número de documento"
            placeholder="Ingrese número de documento"
            :schema="numeroDocumentoNaturalSchema"
          />

          <TextInputZod
            v-else
            v-model="personaNatural.numeroDocumento"
            name="numero_documento"
            label="Número de documento"
            placeholder="Ingrese número de documento"
            :schema="numeroDocumentoNaturalSchema"
          />

          <SelectInputZod
            v-if="personaNatural.tipoDocumento === TipoDocumentosEnum.PASAPORTE"
            v-model="personaNatural.paisPasaporte"
            name="pais_pasaporte"
            label="País de pasaporte"
            placeholder="Selecciona el país de pasaporte"
            :options="countriesOptions"
            :schema="paisPasaporteNaturalSchema"
          />

          <TextInputZod
            v-model="personaNatural.nombre"
            name="nombre"
            label="Nombres"
            placeholder="Nombres"
            :schema="nombreNaturalSchema"
          />

          <TextInputZod
            v-model="personaNatural.apellidoPaterno"
            name="apellido_paterno"
            label="Apellido paterno"
            placeholder="Apellido paterno"
            :schema="apellidoPaternoNaturalSchema"
          />

          <TextInputZod
            v-model="personaNatural.apellidoMaterno"
            name="apellido_materno"
            label="Apellido materno"
            placeholder="Apellido materno"
            :schema="apellidoMaternoNaturalSchema"
          />
        </div>
      </template>

      <!-- Persona jurídica -->
      <template v-if="tipoPersona === 'juridica'">
        <div class="flex flex-col gap-12">
          <!-- formulario persona juridica -->
          <div class="flex flex-col gap-4">
            <p class="t-h6 text-gray-800 font-semibold font-primary">
              Datos de la persona jurídica
            </p>
            <SimpleCardDropDown>
              <template #title>
                <div class="flex justify-between items-center px-12 py-6">
                  <h1 class="t-t1 text-gray-800 font-bold font-secondary">
                    La empresa se constituyó en Perú
                  </h1>
                  <CustomSwitch
                    :checked="personaJuridica.seConstituyoEnPeru"
                    @update:checked="personaJuridica.seConstituyoEnPeru = $event"
                  />
                </div>
              </template>
              <template #content>
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
                  />

                  <TextInputZod
                    v-model="personaJuridica.razonSocial"
                    name="razon_social"
                    label="Razón Social"
                    placeholder="Razón Social"
                    :schema="razonSocialAccSchema"
                  />

                  <TextInputZod
                    v-model="personaJuridica.nombreComercial"
                    name="nombre_comercial"
                    label="Nombre Comercial"
                    placeholder="Nombre Comercial"
                    :schema="nombreComercialAccSchema"
                  />

                  <TextInputZod
                    v-model="personaJuridica.direccion"
                    name="direccion"
                    label="Dirección"
                    placeholder="Dirección"
                    :schema="direccionAccSchema"
                  />

                  <TextInputZod
                    v-model="personaJuridica.distrito"
                    name="distrito"
                    label="Distrito"
                    placeholder="Distrito"
                    :schema="distritoAccSchema"
                  />

                  <TextInputZod
                    v-model="personaJuridica.provincia"
                    name="provincia"
                    label="Provincia"
                    placeholder="Provincia"
                    :schema="provinciaAccSchema"
                  />

                  <TextInputZod
                    v-model="personaJuridica.departamento"
                    name="departamento"
                    label="Departamento"
                    placeholder="Departamento"
                    :schema="departamentoAccSchema"
                  />
                </div>

                <div v-else class="grid grid-cols-2 gap-12 px-12 py-10">
                  <TextInputZod
                    v-model="personaJuridica.tipoDocumento"
                    name="tipo_documento_extranjero"
                    label="Tipo de Documento"
                    placeholder="Escribe el tipo de documento aquí"
                    :schema="tipoDocumentoAccSchema"
                  />

                  <TextInputZod
                    v-model="personaJuridica.numeroDocumento"
                    name="numero_documento_extranjero"
                    label="Número de Documento"
                    placeholder="Ingresa el número de documento"
                    :schema="numeroDocumentoJurAccSchema"
                  />

                  <TextInputZod
                    v-model="personaJuridica.razonSocial"
                    name="razon_social_extranjero"
                    label="Razón Social"
                    placeholder="Escribe la razón social aquí"
                    :schema="razonSocialAccSchema"
                  />

                  <TextInputZod
                    v-model="personaJuridica.direccion"
                    name="direccion_extranjero"
                    label="Dirección"
                    placeholder="Dirección fiscal"
                    :schema="direccionAccSchema"
                  />

                  <SelectInputZod
                    v-model="personaJuridica.paisOrigen"
                    name="pais_origen_extranjero"
                    label="País"
                    placeholder="Selecciona el país"
                    :options="countriesOptions"
                    :schema="paisOrigenAccSchema"
                  />
                </div>
              </template>
            </SimpleCardDropDown>
          </div>

          <!-- formulario representante legal -->
          <div class="flex flex-col gap-4">
            <p class="t-h6 text-gray-800 font-semibold font-primary">
              Registrar representante
            </p>
            <SimpleCardDropDown>
              <template #title>
                <div class="flex justify-between items-center px-12 py-6">
                  <h1 class="t-t1 text-gray-800 font-bold font-secondary">
                    Registrar representante en la socicedad
                  </h1>
                  <CustomSwitch
                    :checked="personaJuridica.tieneRepresentante"
                    @update:checked="personaJuridica.tieneRepresentante = $event"
                  />
                </div>
              </template>
              <template v-if="personaJuridica.tieneRepresentante" #content>
                <div class="grid grid-cols-2 gap-12 px-12 py-10">
                  <SelectInputZod
                    v-model="representanteLegal.tipoDocumento"
                    name="tipo_documento_representante"
                    label="Tipo de documento"
                    placeholder="Selecciona el tipo de documento"
                    :options="tipoDocumentoOptions"
                    :schema="tipoDocumentoNaturalSchema"
                  />

                  <SearchInputZod
                    v-if="representanteLegal.tipoDocumento === TipoDocumentosEnum.DNI"
                    v-model="representanteLegal.numeroDocumento"
                    name="numero_documento_representante"
                    label="Número de documento"
                    placeholder="Ingrese número de documento"
                    :schema="numeroDocumentoNaturalSchema"
                  />

                  <TextInputZod
                    v-else
                    v-model="representanteLegal.numeroDocumento"
                    name="numero_documento_representante"
                    label="Número de documento"
                    placeholder="Ingrese número de documento"
                    :schema="numeroDocumentoNaturalSchema"
                  />

                  <SelectInputZod
                    v-if="representanteLegal.tipoDocumento === TipoDocumentosEnum.PASAPORTE"
                    v-model="representanteLegal.paisPasaporte"
                    name="pais_pasaporte_representante"
                    label="País de pasaporte"
                    placeholder="Selecciona el país de pasaporte"
                    :options="countriesOptions"
                    :schema="paisPasaporteNaturalSchema"
                  />

                  <TextInputZod
                    v-model="representanteLegal.nombre"
                    name="nombre_representante"
                    label="Nombres"
                    placeholder="Nombres"
                    :schema="nombreNaturalSchema"
                  />

                  <TextInputZod
                    v-model="representanteLegal.apellidoPaterno"
                    name="apellido_paterno_representante"
                    label="Apellido paterno"
                    placeholder="Apellido paterno"
                    :schema="apellidoPaternoNaturalSchema"
                  />

                  <TextInputZod
                    v-model="representanteLegal.apellidoMaterno"
                    name="apellido_materno_representante"
                    label="Apellido materno"
                    placeholder="Apellido materno"
                    :schema="apellidoMaternoNaturalSchema"
                  />
                </div>
              </template>
            </SimpleCardDropDown>
          </div>
        </div>
      </template>
    </div>
  </SlotWrapper>
</template>
