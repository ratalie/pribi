<template>
  <div
    class="mb-6 rounded-xl border bg-yellow-50 p-6 shadow-sm"
    style="border-color: #fbbf24; border-width: 2px"
  >
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg font-semibold" style="color: #92400e">
        🐛 Debug: Datos de Votación Directores
      </h3>
      <button
        @click="isExpanded = !isExpanded"
        class="rounded px-3 py-1 text-sm font-medium transition-colors"
        style="background-color: #fbbf24; color: #78350f"
      >
        {{ isExpanded ? "Ocultar" : "Mostrar" }}
      </button>
    </div>

    <div v-if="isExpanded" class="space-y-6">
      <!-- Resumen General -->
      <div class="rounded-lg border bg-white p-4" style="border-color: var(--border-default)">
        <h4 class="mb-3 font-semibold" style="color: var(--text-primary)">Resumen General</h4>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p class="text-xs" style="color: var(--text-muted)">Status Store</p>
            <p class="text-sm font-medium" style="color: var(--text-primary)">
              {{ votacionStore.status }}
            </p>
          </div>
          <div>
            <p class="text-xs" style="color: var(--text-muted)">Tiene Votación</p>
            <p class="text-sm font-medium" style="color: var(--text-primary)">
              {{ votacionStore.hasVotacion ? "✅ Sí" : "❌ No" }}
            </p>
          </div>
          <div>
            <p class="text-xs" style="color: var(--text-muted)">Modo Votación</p>
            <p class="text-sm font-medium" style="color: var(--text-primary)">
              {{ sesionVotacion?.modo || "N/A" }}
            </p>
          </div>
          <div>
            <p class="text-xs" style="color: var(--text-muted)">Método Detectado</p>
            <p class="text-sm font-medium" style="color: var(--text-primary)">
              {{ metodoVotacion || "N/A" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Datos Crudos del Backend -->
      <div class="rounded-lg border bg-white p-4" style="border-color: var(--border-default)">
        <h4 class="mb-3 font-semibold" style="color: var(--text-primary)">
          📦 Datos Crudos del Backend (sesionVotacion)
        </h4>
        <div class="max-h-96 overflow-auto rounded bg-gray-50 p-3">
          <pre class="text-xs" style="color: var(--text-primary)">{{
            JSON.stringify(sesionVotacion, null, 2)
          }}</pre>
        </div>
      </div>

      <!-- Items de Votación -->
      <div class="rounded-lg border bg-white p-4" style="border-color: var(--border-default)">
        <h4 class="mb-3 font-semibold" style="color: var(--text-primary)">
          📋 Items de Votación ({{ itemsVotacion.length }})
        </h4>
        <div
          v-if="itemsVotacion.length === 0"
          class="text-sm"
          style="color: var(--text-muted)"
        >
          No hay items de votación
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="(item, index) in itemsVotacion"
            :key="item.id"
            class="rounded-lg border p-4"
            style="border-color: var(--border-light); background-color: var(--bg-muted)"
          >
            <div class="mb-2 flex items-center justify-between">
              <h5 class="font-medium" style="color: var(--text-primary)">
                Item {{ index + 1 }}: {{ item.label }}
              </h5>
              <span
                class="rounded px-2 py-1 text-xs font-medium"
                style="background-color: #dbeafe; color: #1e40af"
              >
                {{ item.tipoAprobacion }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-xs" style="color: var(--text-muted)">ID</p>
                <p class="font-mono text-xs" style="color: var(--text-primary)">
                  {{ item.id }}
                </p>
              </div>
              <div>
                <p class="text-xs" style="color: var(--text-muted)">Persona ID</p>
                <p class="font-mono text-xs" style="color: var(--text-primary)">
                  {{ item.personaId || "N/A" }}
                </p>
              </div>
              <div>
                <p class="text-xs" style="color: var(--text-muted)">Orden</p>
                <p class="text-xs" style="color: var(--text-primary)">{{ item.orden }}</p>
              </div>
              <div>
                <p class="text-xs" style="color: var(--text-muted)">Total Votos</p>
                <p class="text-xs font-medium" style="color: var(--text-primary)">
                  {{ totalVotosPorItem(item) }}
                </p>
              </div>
            </div>

            <!-- Votos del Item -->
            <div class="mt-3">
              <p class="mb-2 text-xs font-medium" style="color: var(--text-secondary)">
                Votos ({{ item.votos.length }}):
              </p>
              <div
                v-if="item.votos.length === 0"
                class="text-xs"
                style="color: var(--text-muted)"
              >
                No hay votos registrados
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="(voto, vIndex) in item.votos"
                  :key="voto.id || vIndex"
                  class="rounded border p-2 text-xs"
                  style="border-color: var(--border-light); background-color: white"
                >
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <p class="text-xs" style="color: var(--text-muted)">Accionista ID</p>
                      <p class="font-mono text-xs" style="color: var(--text-primary)">
                        {{ voto.accionistaId }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs" style="color: var(--text-muted)">Valor</p>
                      <p class="text-xs font-semibold" style="color: var(--primary-700)">
                        {{ voto.valor }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Candidatos del Controller -->
      <div class="rounded-lg border bg-white p-4" style="border-color: var(--border-default)">
        <h4 class="mb-3 font-semibold" style="color: var(--text-primary)">
          👥 Candidatos del Controller ({{ candidatos.length }})
        </h4>
        <div v-if="candidatos.length === 0" class="text-sm" style="color: var(--text-muted)">
          No hay candidatos
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(candidato, index) in candidatos"
            :key="candidato.person?.id || index"
            class="rounded border p-3 text-sm"
            style="border-color: var(--border-light); background-color: var(--bg-muted)"
          >
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs" style="color: var(--text-muted)">Nombre Completo</p>
                <p class="font-medium" style="color: var(--text-primary)">
                  {{ getNombreCompleto(candidato) }}
                </p>
              </div>
              <div>
                <p class="text-xs" style="color: var(--text-muted)">Persona ID</p>
                <p class="font-mono text-xs" style="color: var(--text-primary)">
                  {{ candidato.person?.id || "N/A" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Votantes -->
      <div class="rounded-lg border bg-white p-4" style="border-color: var(--border-default)">
        <h4 class="mb-3 font-semibold" style="color: var(--text-primary)">
          🗳️ Votantes ({{ votantes.length }})
        </h4>
        <div v-if="votantes.length === 0" class="text-sm" style="color: var(--text-muted)">
          No hay votantes
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(votante, index) in votantes"
            :key="index"
            class="rounded border p-3 text-sm"
            style="border-color: var(--border-light); background-color: var(--bg-muted)"
          >
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs" style="color: var(--text-muted)">Nombre</p>
                <p class="font-medium" style="color: var(--text-primary)">
                  {{ votante.nombreCompleto }}
                </p>
              </div>
              <div>
                <p class="text-xs" style="color: var(--text-muted)">Acciones con Voto</p>
                <p class="font-medium" style="color: var(--text-primary)">
                  {{ votante.accionesConDerechoVoto }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import type { useVotacionDirectoresController } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion/composables/useVotacionDirectoresController";
  import { useVotacionDirectoresStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion/stores/useVotacionDirectoresStore";

  interface Props {
    controller: ReturnType<typeof useVotacionDirectoresController>;
    metodoVotacion?: string;
  }

  const props = defineProps<Props>();

  const isExpanded = ref(true);
  const votacionStore = useVotacionDirectoresStore();

  const sesionVotacion = computed(() => votacionStore.sesionVotacion);
  const itemsVotacion = computed(() => votacionStore.itemsVotacion);
  const candidatos = computed(() => props.controller?.candidatos?.value || []);
  const votantes = computed(() => props.controller?.votantes?.value || []);

  function totalVotosPorItem(item: any): number {
    if (!item.votos || item.votos.length === 0) return 0;
    return item.votos.reduce((sum: number, voto: any) => sum + (voto.valor || 0), 0);
  }

  function getNombreCompleto(candidato: any): string {
    if (!candidato?.person) return "N/A";
    const p = candidato.person;
    return `${p.nombre || ""} ${p.apellidoPaterno || ""} ${p.apellidoMaterno || ""}`.trim();
  }
</script>
