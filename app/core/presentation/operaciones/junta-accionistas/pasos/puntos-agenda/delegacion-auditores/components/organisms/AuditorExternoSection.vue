<template>
  <div class="flex flex-col gap-4">
    <p class="t-h5 text-gray-800 font-primary">Auditor Externo</p>
    <SimpleCard>
      <div class="flex flex-col gap-5 w-full">
        <label
          for="nombre-apellidos-auditor"
          class="t-t2 font-secondary text-gray-800 font-bold"
        >
          Nombre y Apellidos
        </label>
        <BaseInput
          id="nombre-apellidos-auditor"
          v-model="store.nombreCompletoAuditor"
          placeholder="Ingrese el nombre aquí"
          size="md"
        />
      </div>
    </SimpleCard>
  </div>
</template>

<script setup lang="ts">
import SimpleCard from "~/components/base/cards/SimpleCard.vue";
import BaseInput from "~/components/base/inputs/text/BaseInput.vue";
import { useAuditoresExternosStore } from "../../stores/useAuditoresExternosStore";

const store = useAuditoresExternosStore();
</script>


