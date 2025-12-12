<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import CheckboxTable from "~/components/base/tables/checkbox-table/CheckboxTable.vue";
  import type { TableColumn } from "~/components/base/tables/getColumns";
  import { getColumns } from "~/components/base/tables/getColumns";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import type {
    PersonaJuridica,
    PersonaNatural,
  } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  interface ApoderadosTableRow {
    id: string;
    checked: boolean;
    clase_apoderado: string;
    nombre: string;
    tipo_documento: string;
    numero_documento: string;
  }

  const apoderadosHeaders: TableColumn<ApoderadosTableRow>[] = [
    { key: "clase_apoderado", label: "Clase de Apoderado", type: "text" },
    { key: "nombre", label: "Nombre / Razón Social", type: "text" },
    { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
    { key: "numero_documento", label: "Nº de Documento", type: "text" },
  ];

  const columns = getColumns(apoderadosHeaders);

  const snapshotStore = useSnapshotStore();
  const apoderados = ref<ApoderadosTableRow[]>([]);

  function updateCheckedItems(checkedItems: boolean) {
    apoderados.value.forEach((apoderado) => {
      apoderado.checked = checkedItems;
    });
  }

  function getNombreCompletoPersona(persona: PersonaNatural | PersonaJuridica): string {
    if (persona.tipo === "NATURAL") {
      return `${persona.nombre} ${persona.apellidoPaterno} ${
        persona.apellidoMaterno || ""
      }`.trim();
    } else {
      return persona.razonSocial || "";
    }
  }

  onMounted(() => {
    const snapshot = snapshotStore.snapshot;

    if (!snapshot || !snapshot.attorneys || !snapshot.attorneyClasses) {
      console.warn("[RemocionApoderados] No hay snapshot o datos de apoderados disponibles");
      apoderados.value = [];
      return;
    }

    const { attorneys, attorneyClasses } = snapshot;

    // ✅ Filtrar clases excluidas: "Gerente General" y "Otros Apoderados"
    const clasesPermitidas = attorneyClasses.filter(
      (clase) => clase.name !== "Gerente General" && clase.name !== "Otros Apoderados"
    );

    // Crear mapa de clases por ID para búsqueda rápida
    const clasesMap = new Map(clasesPermitidas.map((clase) => [clase.id, clase.name]));

    // Filtrar apoderados que pertenecen a clases permitidas y agrupar
    const apoderadosAgrupados: ApoderadosTableRow[] = [];

    attorneys.forEach((apoderado) => {
      const nombreClase = clasesMap.get(apoderado.claseApoderadoId);

      // Solo incluir si la clase está permitida
      if (nombreClase) {
        apoderadosAgrupados.push({
          id: apoderado.id, //AQUI EVALUAR SI USAR EL APODERADO ID O UN ID NUEVO -->Esteve
          checked: false,
          clase_apoderado: nombreClase,
          nombre: getNombreCompletoPersona(apoderado.persona),
          tipo_documento: apoderado.persona.tipoDocumento,
          numero_documento: apoderado.persona.numeroDocumento,
        });
      } else {
        console.warn(
          `[RemocionApoderados] Apoderado ${apoderado.id} no incluido: claseApoderadoId ${apoderado.claseApoderadoId} no encontrada en clases permitidas`
        );
      }
    });

    // Ordenar por clase de apoderado y luego por nombre
    apoderadosAgrupados.sort((a, b) => {
      if (a.clase_apoderado !== b.clase_apoderado) {
        return a.clase_apoderado.localeCompare(b.clase_apoderado);
      }
      return a.nombre.localeCompare(b.nombre);
    });

    apoderados.value = apoderadosAgrupados;

    console.log("[RemocionApoderados] Apoderados cargados:", {
      total: apoderados.value.length,
      apoderados: apoderados.value,
    });
  });
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Apoderados"
      subtitle="Identifica a los apoderados cuya remoción será evaluada."
    />
    <div class="flex flex-col gap-10">
      <CheckboxTable
        :columns="columns"
        :data="apoderados"
        @update:checked-items="updateCheckedItems"
      />
    </div>
  </SlotWrapper>
</template>
