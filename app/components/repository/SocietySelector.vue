<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, ChevronDown, Check } from "lucide-vue-next";
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
import { storeToRefs } from "pinia";
import { computed, onMounted, watch } from "vue";

const sociedadHistorialStore = useSociedadHistorialStore();
const repositorioDashboardStore = useRepositorioDashboardStore();
const { sociedades } = storeToRefs(sociedadHistorialStore);

// Cargar sociedades al montar
onMounted(async () => {
  if (sociedades.value.length === 0) {
    await sociedadHistorialStore.cargarHistorial();
  }
});

// Mapear SociedadResumenDTO a formato del repositorio
const sociedadesMapeadas = computed(() => {
  return sociedades.value.map((sociedad) => ({
    id: sociedad.idSociety,
    nombre: sociedad.razonSocial || "Sociedad sin nombre",
    rut: sociedad.ruc || "",
    tipo: sociedad.tipoSocietario || "",
    activa: sociedad.estado === "completo", // Considerar activa si está completa
  }));
});

// Sociedad seleccionada del store del repositorio
const sociedadSeleccionada = computed(() => repositorioDashboardStore.sociedadSeleccionada);

// Seleccionar sociedad
const seleccionarSociedad = async (sociedad: typeof sociedadesMapeadas.value[0]) => {
  await repositorioDashboardStore.seleccionarSociedad(sociedad.id);
};
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center justify-between">
      <div>
        <p
          class="text-sm mb-2"
          :style="{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
          }"
        >
          Gestionando repositorio de
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button
              class="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border hover:shadow-md transition-all group"
              :style="{ borderColor: 'var(--border-light)' }"
            >
              <!-- Icono Building2 con fondo morado -->
              <div
                class="p-2 rounded-lg"
                style="background-color: #EEF2FF"
              >
                <Building2
                  class="w-6 h-6"
                  :style="{ color: 'var(--primary-700)' }"
                />
              </div>

              <!-- Info de sociedad -->
              <div
                v-if="sociedadSeleccionada"
                class="text-left"
              >
                <p
                  class="text-lg"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 600,
                  }"
                >
                  {{ sociedadSeleccionada.nombre }}
                </p>
                <p
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  RUT: {{ sociedadSeleccionada.rut }} • {{ sociedadSeleccionada.tipo }}
                </p>
              </div>
              <div
                v-else
                class="text-left"
              >
                <p
                  class="text-lg"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Seleccionar sociedad...
                </p>
              </div>

              <!-- Chevron -->
              <ChevronDown
                class="w-5 h-5 ml-2 group-hover:translate-y-0.5 transition-transform"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            class="w-[400px]"
            :style="{
              fontFamily: 'var(--font-secondary)',
              backgroundColor: 'white',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '8px',
            }"
          >
            <!-- Header -->
            <div class="px-3 py-2 mb-2">
              <p
                class="text-xs"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Seleccionar sociedad
              </p>
            </div>

            <!-- Sociedades Activas -->
            <template
              v-for="sociedad in sociedadesMapeadas.filter((s) => s.activa)"
              :key="sociedad.id"
            >
              <DropdownMenuItem
                class="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                @click="seleccionarSociedad(sociedad)"
              >
                <!-- Icono -->
                <div
                  class="p-2 rounded-lg flex-shrink-0"
                  :style="{
                    backgroundColor:
                      sociedadSeleccionada?.id === sociedad.id
                        ? '#EEF2FF'
                        : '#F9FAFB',
                  }"
                >
                  <Building2
                    class="w-5 h-5"
                    :style="{
                      color:
                        sociedadSeleccionada?.id === sociedad.id
                          ? 'var(--primary-700)'
                          : 'var(--text-muted)',
                    }"
                  />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm truncate"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight:
                        sociedadSeleccionada?.id === sociedad.id ? 600 : 400,
                    }"
                  >
                    {{ sociedad.nombre }}
                  </p>
                  <p
                    class="text-xs"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    RUT: {{ sociedad.rut }} • {{ sociedad.tipo }}
                  </p>
                </div>

                <!-- Check si está seleccionada -->
                <Check
                  v-if="sociedadSeleccionada?.id === sociedad.id"
                  class="w-5 h-5 flex-shrink-0"
                  :style="{ color: 'var(--primary-700)' }"
                />
              </DropdownMenuItem>
            </template>

            <!-- Separator -->
            <DropdownMenuSeparator
              v-if="sociedadesMapeadas.some((s) => !s.activa)"
              :style="{
                backgroundColor: 'var(--border-light)',
                margin: '8px 0',
              }"
            />

            <!-- Sociedades Inactivas -->
            <template v-if="sociedadesMapeadas.some((s) => !s.activa)">
              <div class="px-3 py-2">
                <p
                  class="text-xs"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Sociedades inactivas
                </p>
              </div>
              <template
                v-for="sociedad in sociedadesMapeadas.filter((s) => !s.activa)"
                :key="sociedad.id"
              >
                <DropdownMenuItem
                  class="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-60"
                  @click="seleccionarSociedad(sociedad)"
                >
                  <!-- Mismo formato pero con opacity-60 -->
                  <div
                    class="p-2 rounded-lg flex-shrink-0"
                    style="background-color: #F9FAFB"
                  >
                    <Building2
                      class="w-5 h-5"
                      :style="{ color: 'var(--text-muted)' }"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm truncate"
                      :style="{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-secondary)',
                      }"
                    >
                      {{ sociedad.nombre }}
                    </p>
                    <p
                      class="text-xs"
                      :style="{
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-secondary)',
                      }"
                    >
                      RUT: {{ sociedad.rut }} • {{ sociedad.tipo }}
                    </p>
                  </div>
                </DropdownMenuItem>
              </template>
            </template>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>

