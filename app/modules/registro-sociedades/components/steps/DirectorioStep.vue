<script setup lang="ts">
  import noDirectorioImage from "~/assets/img/no-directorio.jpeg";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import NumberInputStepper from "~/components/base/inputs/number/NumberInputStepper.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import SwitchTabs from "~/components/base/Switch/SwitchTabs.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import Switch from "~/components/ui/switch/Switch.vue";
  import VDropdownComponent from "~/components/VDropdownComponent.vue";
  import {
    duracionDirectorioSchema,
    fechaFinDirectorioSchema,
    fechaInicioDirectorioSchema,
    presidenteDirectorioSchema,
  } from "~/modules/registro-sociedades/schemas/directorio";
  import type { TypeOption } from "~/types/TypeOptions";

  // import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    // mode: EntityModeEnum;
    societyId?: string;
  }

  defineProps<Props>();

  // Opciones para duración del directorio
  const termOptions: TypeOption[] = [
    {
      id: 1,
      label: "1 año",
      name: "1 año",
      value: "1",
      acronimo: "1",
    },
    {
      id: 2,
      label: "2 años",
      name: "2 años",
      value: "2",
      acronimo: "2",
    },
    {
      id: 3,
      label: "3 años",
      name: "3 años",
      value: "3",
      acronimo: "3",
    },
  ];

  // Opciones para presidente del directorio (directores)
  const presidenteOptions: TypeOption[] = [
    {
      id: 1,
      label: "Diego Alonso Santoro Velez",
      name: "Diego Alonso Santoro Velez",
      value: "Diego Alonso Santoro Velez",
      acronimo: "DASV",
    },
    {
      id: 2,
      label: "Nayla Lucía Cornejo Bastidas",
      name: "Nayla Lucía Cornejo Bastidas",
      value: "Nayla Lucía Cornejo Bastidas",
      acronimo: "NLCB",
    },
  ];

  // Interfaz para los directores
  interface DirectorRow {
    id: string;
    nombres_apellidos: string;
    tipo_documento: string;
    numero_documento: string;
    tipo_director: string;
    reemplazo_asignado: string;
  }

  // Columnas de la tabla de directores
  const directoresColumns: TableColumn<DirectorRow>[] = [
    { key: "nombres_apellidos", label: "Nombres y Apellidos", type: "text" },
    { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
    { key: "numero_documento", label: "Nº de Documento", type: "text" },
    { key: "tipo_director", label: "Tipo de Director", type: "text" },
    { key: "reemplazo_asignado", label: "Reemplazo asignado", type: "text" },
  ];

  const directoresColumnsDef = getColumns(directoresColumns);

  // Datos de los directores
  const directoresData = ref<DirectorRow[]>([
    {
      id: "1",
      nombres_apellidos: "Diego Alonso Santoro Velez",
      tipo_documento: "DNI",
      numero_documento: "70124567",
      tipo_director: "Titular",
      reemplazo_asignado: "Ninguno",
    },
    {
      id: "2",
      nombres_apellidos: "Nayla Lucía Cornejo Bastidas",
      tipo_documento: "Pasaporte",
      numero_documento: "EB12-934",
      tipo_director: "Titular",
      reemplazo_asignado: "Ninguno",
    },
  ]);

  // Acciones para el menú de opciones
  const directoresActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (id: string) => {
        console.log("Editar", id);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (id: string) => {
        console.log("Eliminar", id);
      },
    },
  ];

  // Datos del formulario
  const form = ref({
    cantidadDirectores: "",
    cantidadPersonalizado: false,
    duracionDirectorio: "",
    fechaInicioDirectorio: "",
    fechaFinDirectorio: "",
    quorumMinimo: "",
    quorumMayoria: "",
    nombraPresidente: "opcion-a",
    ejerceSecretaria: "opcion-a",
    reeleccionDirectores: false,
    presideJuntas: "opcion-a",
    votoDirimente: "opcion-a",
    presidenteDirectorio: "",
  });

  const tieneDirectorio = ref(true);

  // Manejador de envío
  const handleSubmit = () => {
    console.log("Formulario enviado:", form.value);
  };

  const handleInvalidSubmit = (ctx: any) => {
    // ctx.errors contiene los errores de validación
    // Puedes mostrar un toast, alert, o log
    console.log("Errores en el formulario:", ctx.errors);
    // O usa tu sistema de notificaciones/toast aquí
  };
</script>

<template>
  <div :class="tieneDirectorio ? '' : 'h-full'">
    <div class="h-full p-14 flex flex-col gap-12">
      <CardTitle title="Directorio" body="Complete todos los campos requeridos.">
        <template #switch>
          <Switch v-model="tieneDirectorio" />
          <VDropdownComponent
            message-dropdown="Este paso es opcional. Puedes activar o desactivar el Directorio según corresponda a tu sociedad. Para las S.A., el Directorio está siempre activo."
            :button-add-visible="true"
          />
        </template>
      </CardTitle>
      <SimpleCard v-if="tieneDirectorio">
        <CardTitle title="Configuracion del Directorio" body="" />

        <Form
          class="grid grid-cols-2 gap-14 w-full"
          @submit="handleSubmit"
          @invalid-submit="handleInvalidSubmit"
        >
          <!-- Primera columna: NumberInputStepper -->
          <div class="flex flex-col gap-2">
            <label
              for="cantidad-directores"
              class="t-t2 font-secondary text-gray-800 font-bold"
            >
              Cantidad de directores
            </label>
            <NumberInputStepper
              id="cantidad-directores"
              v-model="form.cantidadDirectores"
              :min="3"
              :max="9"
              placeholder="3"
              size="large"
            />
            <p class="t-t2 text-gray-500 font-secondary">Valor mínimo: {{ 3 }}.</p>
          </div>

          <!-- Segunda columna: Checkbox -->
          <div class="flex items-center gap-2">
            <Checkbox id="cantidad-personalizado" v-model="form.cantidadPersonalizado" />
            <label
              for="cantidad-personalizado"
              class="t-t2 font-secondary text-gray-800 font-medium cursor-pointer"
            >
              Definir cantidad personalizada
            </label>
          </div>

          <div class="flex gap-2">
            <SelectInputZod
              v-model="form.duracionDirectorio"
              :options="termOptions"
              name="duracion-directorio"
              label="Duración del Directorio"
              placeholder="Duración del Directorio"
              :schema="duracionDirectorioSchema"
            />
          </div>
          <div />
          <div class="flex gap-2">
            <DateInputZod
              v-model="form.fechaInicioDirectorio"
              name="fecha-inicio-directorio"
              label="Fecha de Inicio del Directorio"
              placeholder="Ingrese la fecha de inicio del directorio"
              :schema="fechaInicioDirectorioSchema"
            />
          </div>
          <div class="flex gap-2">
            <DateInputZod
              v-model="form.fechaFinDirectorio"
              name="fecha-fin-directorio"
              label="Fecha de Fin del Directorio"
              placeholder="Ingrese la fecha de fin del directorio"
              :schema="fechaFinDirectorioSchema"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="quorum-minimo" class="t-t2 font-secondary text-gray-800 font-bold">
              Quorum mínimo de asistencia
            </label>
            <NumberInputStepper
              id="quorum-minimo"
              v-model="form.quorumMinimo"
              :min="3"
              :max="100"
              placeholder="0"
              size="large"
            />
            <p class="t-t2 text-gray-500 font-secondary">
              Mínimo requerido: la mitad más uno de sus miembros.
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <label for="quorum-mayoria" class="t-t2 font-secondary text-gray-800 font-bold">
              Mayoría para aprobar acuerdos
            </label>
            <NumberInputStepper
              id="quorum-mayoria"
              v-model="form.quorumMayoria"
              :min="3"
              :max="100"
              placeholder="0"
              size="large"
            />
            <p class="t-t2 text-gray-500 font-secondary">
              Mínimo requerido: la mitad más uno de los participantes.
            </p>
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label
                for="nombra-presidente"
                class="t-t2 font-secondary text-gray-800 font-bold"
              >
                ¿Quién nombra al Presidente del Directorio?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SwitchTabs
              v-model="form.nombraPresidente"
              opcion-a="El Directorio"
              opcion-b="La Asamblea de Accionistas"
              variant="default"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label
                for="ejerce-secretaria"
                class="t-t2 font-secondary text-gray-800 font-bold"
              >
                ¿Quién ejercerá la secretaria de las juntas de accionistas?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SwitchTabs
              v-model="form.ejerceSecretaria"
              opcion-a="El Gerente General"
              opcion-b="La Junta de Accionistas lo designa"
              variant="default"
            />
          </div>

          <div class="flex justify-between gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label
                for="reeleccion-directores"
                class="t-t2 font-secondary text-gray-800 font-bold"
              >
                ¿Los directores pueden ser reelegidos?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SimpleSwitchYesNo v-model="form.reeleccionDirectores" label="" />
          </div>
        </Form>
      </SimpleCard>

      <SimpleCard v-if="tieneDirectorio">
        <CardTitle title="Presidente del Directorio" body="" />

        <Form
          class="flex flex-col gap-14 w-full"
          @submit="handleSubmit"
          @invalid-submit="handleInvalidSubmit"
        >
          <div class="flex justify-between gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label for="preside-juntas" class="t-t2 font-secondary text-gray-800 font-bold">
                ¿El presidente del Directorio preside las juntas de accionistas?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SimpleSwitchYesNo v-model="form.presideJuntas" label="" />
          </div>

          <div class="flex justify-between gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label for="voto-dirimente" class="t-t2 font-secondary text-gray-800 font-bold">
                ¿El presidente del Directorio tiene voto dirimente?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SimpleSwitchYesNo v-model="form.votoDirimente" label="" />
          </div>

          <div class="flex flex-col gap-2 w-1/2">
            <SelectInputZod
              v-model="form.presidenteDirectorio"
              :options="presidenteOptions"
              name="presidente-directorio"
              label="Presidente del Directorio"
              placeholder="Seleccionar"
              :schema="presidenteDirectorioSchema"
            />
            <!-- :is-disabled="true" -->
            <span class="t-b2 text-gray-500 font-secondary">
              Este campo se habilita al registrar al menos un director titular.
            </span>
          </div>
        </Form>
      </SimpleCard>

      <SimpleCard v-if="tieneDirectorio">
        <CardTitle title="Directores" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar Director"
              size="xl"
              icon="UserRoundPlus"
            />
          </template>
        </CardTitle>
        <SimpleTable
          :columns="directoresColumnsDef"
          :data="directoresData"
          title-menu="Acciones"
          :actions="directoresActions"
        />
      </SimpleCard>

      <div
        v-else
        class="flex flex-col w-full h-full items-center justify-center self-center "
      >
        <img
          :src="noDirectorioImage"
          alt="No directorio"
          class="w-52 h-40 object-contain mb-8"
        />
        <p class="t-t1 text-gray-600 font-primary text-center font-semibold mb-1">
          Este paso está desactivado
        </p>
        <p class="t-b2 text-gray-400 font-secondary text-center">
          Si decides incluir un Directorio, puedes activarlo en la parte superior.
        </p>
      </div>
    </div>
  </div>
</template>
