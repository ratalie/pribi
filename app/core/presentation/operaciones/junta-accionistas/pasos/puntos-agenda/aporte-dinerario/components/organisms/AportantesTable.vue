<template>
  <div
    v-if="!isLoading && !error"
    class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="w-12 px-6 py-3"></th>
          <th
            class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            Nombre Apellido / Razón Social
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            Tipo de Aportante
          </th>
          <th
            class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            N.º de acciones
          </th>
          <th
            class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            % Participación
          </th>
          <th class="w-16 px-6 py-3"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="aportante in aportantes"
          :key="aportante.id"
          :class="[
            'transition-colors',
            getIsContributorForModule(aportante, module)
              ? 'bg-primary-50/40'
              : 'hover:bg-gray-50',
          ]"
        >
          <!-- Checkbox -->
          <td class="px-6 py-4">
            <Checkbox
              :model-value="getIsContributorForModule(aportante, module)"
              :disabled="isNuevoAportante(aportante.typeShareholder)"
              @update:model-value="(value: boolean | 'indeterminate') => {
                if (!isNuevoAportante(aportante.typeShareholder) && typeof value === 'boolean') {
                  $emit('toggle', aportante);
                }
              }"
            />
          </td>

          <!-- Nombre / Razón Social -->
          <td class="px-6 py-4">
            <div class="text-sm font-medium text-gray-900">
              {{ getNombre(aportante) }}
            </div>
            <div class="text-xs text-gray-500">
              {{ aportante.person.tipoDocumento || "RUC" }}:
              {{ aportante.person.numeroDocumento }}
            </div>
          </td>

          <!-- Tipo de Aportante -->
          <td class="px-6 py-4">
            <span
              :class="[
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
                getTipoBadgeClass(aportante.typeShareholder),
              ]"
            >
              {{
                isNuevoAportante(aportante.typeShareholder) ? "NUEVO APORTANTE" : "ACCIONISTA"
              }}
            </span>
          </td>

          <!-- N.º de acciones -->
          <td class="px-6 py-4 text-right text-sm text-gray-900">
            {{ getTotalAcciones(aportante).toLocaleString() }}
          </td>

          <!-- % Participación -->
          <td class="px-6 py-4 text-right text-sm text-gray-900">
            {{ getParticipacion(aportante) }}%
          </td>

          <!-- Acciones (solo para NUEVOS) -->
          <td class="px-6 py-4">
            <DropdownMenu v-if="isNuevoAportante(aportante.typeShareholder)">
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                  <span class="sr-only">Abrir menú</span>
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="$emit('edit', aportante)">
                  <Pencil class="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem class="text-red-600" @click="$emit('delete', aportante.id)">
                  <Trash2 class="mr-2 h-4 w-4" />
                  Borrar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-if="aportantes.length === 0">
          <td colspan="6" class="px-6 py-12 text-center">
            <div class="text-sm text-gray-500">
              No hay aportantes disponibles. Agrega el primer aportante para comenzar.
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { Pencil, Trash2 } from "lucide-vue-next";
  import { Button } from "~/components/ui/button";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu";
  import type { Acreedor } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useAcreedoresPage";
  import { getIsContributorForModule as getIsContributorForModuleAcreedores } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useAcreedoresPage";
  import type { Aportante, ContributorType } from "../../composables/useAportantesPage";
  import { getIsContributorForModule as getIsContributorForModuleAportantes } from "../../composables/useAportantesPage";

  // Tipo genérico que acepta Aportante o Acreedor (misma estructura)
  type Participante = Aportante | Acreedor;

  interface Props {
    aportantes: Participante[];
    isLoading: boolean;
    error: string | null;
    module?: "CASH" | "CREDIT"; // ✅ Módulo para determinar qué función usar
  }

  const props = withDefaults(defineProps<Props>(), {
    module: "CASH", // ✅ Por defecto CASH (aporte dinerario)
  });

  defineEmits<{
    toggle: [participante: Participante];
    edit: [participante: Participante];
    delete: [id: string];
  }>();

  // ✅ Función genérica para obtener isContributor según el módulo
  function getIsContributorForModule(
    participante: Participante,
    module: "CASH" | "CREDIT"
  ): boolean {
    if (module === "CREDIT") {
      // Para CREDIT, usar la función de acreedores
      return getIsContributorForModuleAcreedores(participante as Acreedor, module);
    } else {
      // Para CASH, usar la función de aportantes
      return getIsContributorForModuleAportantes(participante as Aportante, module);
    }
  }

  // ✅ Verificar si es nuevo aportante (según el módulo)
  function isNuevoAportante(
    typeShareholder: ContributorType | "NUEVO_APORTANTE_CASH" | "NUEVO_APORTANTE_CREDIT"
  ): boolean {
    if (props.module === "CREDIT") {
      return (
        typeShareholder === "NUEVO_APORTANTE" || typeShareholder === "NUEVO_APORTANTE_CREDIT"
      );
    } else {
      return (
        typeShareholder === "NUEVO_APORTANTE" || typeShareholder === "NUEVO_APORTANTE_CASH"
      );
    }
  }

  function getNombre(aportante: Participante): string {
    const person = aportante.person;

    switch (person.tipo) {
      case "NATURAL":
        return `${person.nombre || ""} ${person.apellidoPaterno || ""} ${
          person.apellidoMaterno || ""
        }`.trim();

      case "JURIDICA":
      case "FONDO_INVERSION":
      case "FIDEICOMISO":
      case "SUCESION_INDIVISA":
        return person.razonSocial || "Sin nombre";

      case "SUCURSAL":
        // ✅ SUCURSAL usa nombreSucursal, NO razonSocial
        return (person as any).nombreSucursal || "Sin nombre";

      default:
        return "Sin nombre";
    }
  }

  function getTotalAcciones(aportante: Participante): number {
    if (!aportante.allocationShare || aportante.allocationShare.length === 0) {
      return 0;
    }

    return aportante.allocationShare.reduce(
      (total, allocation) => total + (allocation.subscribedSharesQuantity || 0),
      0
    );
  }

  function getParticipacion(aportante: Participante): string {
    // Calcular % basado en el total de acciones de todos los aportantes
    const totalGeneral = props.aportantes.reduce((sum, a) => sum + getTotalAcciones(a), 0);

    const accionesAportante = getTotalAcciones(aportante);

    if (totalGeneral === 0) return "0.00";

    const porcentaje = (accionesAportante / totalGeneral) * 100;
    return porcentaje.toFixed(2);
  }

  function getTipoBadgeClass(
    type: ContributorType | "NUEVO_APORTANTE_CASH" | "NUEVO_APORTANTE_CREDIT"
  ): string {
    return type === "ACCIONISTA"
      ? "bg-primary-100 text-primary-700 border-primary-300"
      : "bg-purple-100 text-purple-700 border-purple-300";
  }
</script>
