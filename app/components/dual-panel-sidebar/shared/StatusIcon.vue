<script setup lang="ts">
  /**
   * StatusIcon - Icono de estado con línea conectora
   * Basado en CheckIcon de Registro de Sociedades pero mejorado
   *
   * Soporta 5 estados: completed, current, empty, locked, error
   */

  type Status =
    | "completed"
    | "current"
    | "empty"
    | "locked"
    | "error"
    | "optional"
    | "in-progress";

  interface Props {
    status?: Status;
    isFinalItem?: boolean;
    showLine?: boolean;
    size?: "large" | "small"; // large: 24px (nivel 0-2), small: 20px (nivel 3-4)
    level?: number; // Nivel del item (para auto-determinar tamaño)
    connectorGap?: number; // Espacio extra para extender la línea
  }

  const props = withDefaults(defineProps<Props>(), {
    status: "empty",
    isFinalItem: false,
    showLine: true,
    size: "large",
    level: 0,
    connectorGap: 0,
  });

  // Auto-determinar tamaño según nivel si no se especifica
  const iconSize = computed(() => {
    // Si se especificó size explícitamente, usar ese
    if (props.size === "small") return "small";

    // Si hay level, determinar automáticamente
    if (props.level !== undefined) {
      // Nivel 0-1: círculos grandes (24px)
      if (props.level <= 1) return "large";
      // Nivel 2+: círculos pequeños (20px) como en referencia v0
      return "small";
    }

    // Default: large
    return "large";
  });

  // Clases para el círculo según tamaño
  const circleClasses = computed(() => {
    return iconSize.value === "large" ? "w-6 h-6" : "w-5 h-5";
  });

  // Tamaño del punto interior
  const dotClasses = computed(() => {
    return iconSize.value === "large" ? "w-2 h-2" : "w-1.5 h-1.5";
  });

  // Tamaño del icono (check, lock, X)
  const iconWidth = computed(() => {
    return iconSize.value === "large" ? "20" : "16";
  });

  const iconHeight = computed(() => {
    return iconSize.value === "large" ? "20" : "16";
  });

  // Estilo inline para la línea conectora según estado
  const lineStyle = computed(() => {
    let bgColor = "var(--sidebar-empty)";

    switch (props.status) {
      case "completed":
      case "current":
      case "in-progress":
        bgColor = "var(--sidebar-primary)";
        break;
      case "optional":
        bgColor = "var(--sidebar-optional)";
        break;
      case "error":
        bgColor = "var(--sidebar-error)";
        break;
      default:
        bgColor = "var(--sidebar-border)";
    }

    return { backgroundColor: bgColor };
  });

  const connectorGapValue = computed(() => Math.max(props.connectorGap ?? 0, 0));
  const connectorColor = computed(
    () => lineStyle.value.backgroundColor ?? "var(--sidebar-border)"
  );

  // 🐛 DEBUG: Deshabilitado para reducir ruido en consola
  // watchEffect(() => {
  //   if (props.connectorGap > 0) {
  //     console.log(`[StatusIcon] Connector:`, {
  //       level: props.level,
  //       connectorGap: props.connectorGap,
  //       connectorGapValue: connectorGapValue.value,
  //       isFinalItem: props.isFinalItem,
  //       showLine: props.showLine,
  //       calculatedHeight: `calc(100% + ${connectorGapValue.value}px)`,
  //     });
  //   }
  // });
</script>

<template>
  <div class="flex flex-col items-center relative">
    <!-- Completado: círculo azul con check blanco -->
    <div
      v-if="status === 'completed'"
      :class="[circleClasses, 'flex items-center justify-center border-2 rounded-full']"
      style="
        background-color: var(--sidebar-completed);
        border-color: var(--sidebar-completed);
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="text-white"
        :width="iconWidth"
        :height="iconHeight"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- Actual: círculo azul con punto -->
    <div
      v-else-if="status === 'current' || status === 'in-progress'"
      :class="[
        circleClasses,
        'flex items-center justify-center border-2 rounded-full bg-white',
      ]"
      style="border-color: var(--sidebar-current)"
    >
      <span
        :class="[dotClasses, 'rounded-full']"
        style="background-color: var(--sidebar-current)"
      />
    </div>

    <!-- Bloqueado: círculo gris con candado -->
    <div
      v-else-if="status === 'locked'"
      :class="[
        circleClasses,
        'flex items-center justify-center border-2 rounded-full bg-white',
      ]"
      style="border-color: var(--sidebar-locked)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="text-gray-400"
        :width="iconSize === 'large' ? '16' : '14'"
        :height="iconSize === 'large' ? '16' : '14'"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          d="M10 2a5 5 0 0 0-5 5v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H7V7a3 3 0 0 1 5.905-.75a1 1 0 0 0 1.937-.5A5.002 5.002 0 0 0 10 2"
        />
      </svg>
    </div>

    <!-- Opcional: círculo con borde punteado -->
    <div
      v-else-if="status === 'optional'"
      :class="[
        circleClasses,
        'flex items-center justify-center border-2 rounded-full bg-white',
      ]"
      style="border-color: var(--sidebar-optional); border-style: dashed"
    />

    <!-- Error: círculo rojo con X blanca -->
    <div
      v-else-if="status === 'error'"
      :class="[circleClasses, 'flex items-center justify-center border-2 rounded-full']"
      style="background-color: var(--sidebar-error); border-color: var(--sidebar-error)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="text-white"
        :width="iconWidth"
        :height="iconHeight"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10L4.293 5.707a1 1 0 0 1 0-1.414"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- Vacío: círculo gris vacío -->
    <div
      v-else
      :class="[
        circleClasses,
        'flex items-center justify-center border-2 rounded-full bg-white',
      ]"
      style="border-color: var(--sidebar-empty)"
    />

    <!-- Línea conectora vertical - POSICIÓN ABSOLUTA para no empujar elementos -->
    <div
      v-if="!isFinalItem && showLine"
      class="absolute transition-colors duration-300"
      :style="{
        backgroundColor: connectorColor,
        width: '2px',
        height: connectorGapValue > 0 ? `${connectorGapValue}px` : '32px',
        top: iconSize === 'large' ? '30px' : '26px', // Círculo (24px o 20px) + gap (6px)
        left: '50%',
        marginLeft: '-1px', // Centra exactamente (2px / 2)
      }"
      :data-connector-gap="connectorGapValue"
      :data-level="level"
    />
  </div>
</template>
