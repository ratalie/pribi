<script setup lang="ts">
import {
  columns,
  type Payment,
} from "~/components/base/tables/simple-table/columns";
import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";

useHead({
  title: "Sociedades - PROBO",
});

const data = ref<Payment[]>([]);

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "1",
      razon_social: "BANCO BBVA PERU",
      ruc: "12345678901",
      nombre_comercial: "Comercial 1",
      tipo_sociedad: "Sociedad Anónima",
      estado: "Activo",
      amount: "100.00",
    },
    {
      id: "2",
      razon_social: "SHALOM EMPRESARIAL S.A.C.",
      ruc: "10987654321",
      nombre_comercial: "Comercial 2",
      tipo_sociedad: "Sociedad Limitada",
      estado: "Inactivo",
      amount: "250.00",
    },
  ];
}

onMounted(async () => {
  data.value = await getData();
});
</script>

<template>
  <div>
    <PageTitle title-key="pages.sociedades" />

    <SimpleTable :columns="columns" :data="data" />
  </div>
</template>
