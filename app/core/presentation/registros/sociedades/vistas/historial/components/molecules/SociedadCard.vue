<template>
  <div class="flex items-center gap-3">
    <div class="flex flex-col">
      <span
        class="font-semibold"
        style="color: var(--text-primary); font-family: var(--font-primary)"
      >
        {{ razonSocialLimpia || "Sociedad sin nombre" }}
      </span>
      <span
        v-if="nombreComercialLimpio && nombreComercialLimpio !== razonSocialLimpia"
        class="text-xs mt-0.5"
        style="color: var(--text-muted); font-family: var(--font-secondary)"
      >
        {{ nombreComercialLimpio }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  interface Props {
    razonSocial: string;
    nombreComercial?: string;
  }

  const props = defineProps<Props>();

  // Limpiar razón social para evitar duplicación del tipo
  const razonSocialLimpia = computed(() => {
    if (!props.razonSocial) return "Sociedad sin nombre";
    // Si la razón social ya incluye el tipo (S.A.C., S.A., etc.), dejarla tal cual
    // Solo limpiar espacios extra
    return props.razonSocial.trim();
  });

  // Limpiar nombre comercial - si es igual a razón social o contiene duplicación, no mostrarlo
  const nombreComercialLimpio = computed(() => {
    if (!props.nombreComercial) return null;
    
    const razonLimpia = razonSocialLimpia.value.toLowerCase().trim();
    const nombreLimpio = props.nombreComercial.trim();
    const nombreLower = nombreLimpio.toLowerCase();
    
    // Si el nombre comercial es igual a la razón social, no mostrarlo
    if (nombreLower === razonLimpia) return null;
    
    // Si el nombre comercial contiene la razón social completa, solo mostrar la diferencia
    if (nombreLower.includes(razonLimpia) && nombreLower.length > razonLimpia.length) {
      // Si es básicamente lo mismo con algo extra, no mostrarlo
      return null;
    }
    
    return nombreLimpio;
  });
</script>
