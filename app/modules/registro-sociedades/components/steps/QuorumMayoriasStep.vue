<script setup lang="ts">
  // import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import QuorumRowTable from "~/components/base/tables/quorum-table/QuorumRow.vue";
  import QuorumTable from "~/components/base/tables/quorum-table/QuorumTable.vue";

  interface Props {
    // mode: EntityModeEnum;
    societyId?: string;
  }

  const headersQuorum = ["Tipo de Quorum", "Reglas"];

  defineProps<Props>();

  // TODO: Reemplazar con store real
  const isPreview = ref(false);
  const simpleFirstCall = ref(50.01);
  const qualifiedFirstCall = ref(66.66);
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle
      title="Quorums y Mayorías para Adopción de Acuerdos"
      body="Ingrese los porcentajes mínimos requeridos para la instalación de juntas y toma de acuerdos."
    />

    <SimpleCard>
      <div class="flex flex-col gap-12">
        <CardTitle title="Quórum Mínimo Para Instalar la Junta" body="" />
        <h3 class="font-secondary text-gray-800 font-semibold t-h6">Primera Convocatoria</h3>
        <QuorumTable :header-list="headersQuorum" columns="grid-cols-3">
          <QuorumRowTable
            :is-preview="isPreview"
            quorum-type="Simple"
            ruler="Mínimo"
            :initial-value="simpleFirstCall.toFixed(2)"
            text-body="de acciones con derecho a voto."
            :show-error="simpleFirstCall < 50.01"
            :error-limit="50.01"
            @update:number-value="(value) => (simpleFirstCall = value)"
          />
          <QuorumRowTable
            :is-preview="isPreview"
            quorum-type="Calificado"
            ruler="Mínimo"
            :initial-value="qualifiedFirstCall.toFixed(2)"
            text-body="de acciones con derecho a voto."
            :show-error="qualifiedFirstCall < 66.6"
            :error-limit="66.66"
            @update:number-value="(value) => (qualifiedFirstCall = value)"
          />
        </QuorumTable>

        <h3 class="font-secondary text-gray-800 font-semibold t-h6">Segunda Convocatoria</h3>
        <QuorumTable :header-list="headersQuorum" columns="grid-cols-3">
          <QuorumRowTable :is-preview="isPreview" quorum-type="Simple" />
          <QuorumRowTable
            :is-preview="isPreview"
            quorum-type="Calificado"
            ruler="Mínimo"
            :initial-value="qualifiedFirstCall.toFixed(2)"
            text-body="de acciones con derecho a voto existentes."
            :show-error="qualifiedFirstCall < 66.6"
            :error-limit="66.66"
            @update:number-value="(value) => (qualifiedFirstCall = value)"
          />
        </QuorumTable>
      </div>
    </SimpleCard>

    <SimpleCard>
      <div class="flex flex-col gap-12">
        <CardTitle title="Quórum Mínimo Para Tomar Acuerdos" body="" />
        <QuorumTable :header-list="headersQuorum" columns="grid-cols-3">
          <QuorumRowTable
            :is-preview="isPreview"
            quorum-type="Simple"
            ruler="Más del"
            :initial-value="simpleFirstCall.toFixed(2)"
            text-body="de acciones con derecho a voto presentes."
            :show-error="simpleFirstCall < 50.01"
            :error-limit="50.01"
            @update:number-value="(value) => (simpleFirstCall = value)"
          />
          <QuorumRowTable
            :is-preview="isPreview"
            quorum-type="Calificado"
            ruler="Más del"
            :initial-value="qualifiedFirstCall.toFixed(2)"
            text-body="de acciones con derecho a voto presentes."
            :show-error="qualifiedFirstCall < 66.6"
            :error-limit="66.66"
            @update:number-value="(value) => (qualifiedFirstCall = value)"
          />
        </QuorumTable>
      </div>
    </SimpleCard>
  </div>
</template>
