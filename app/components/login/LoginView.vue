<script setup lang="ts">
import BackgroundPattern from "./BackgroundPattern.vue";
import LeftSection from "./LeftSection.vue";
import RightSection from "./RightSection.vue";

/**
 * LoginView - Componente Principal
 *
 * Estructura modular:
 * - Sección A (Izquierda): LeftSection
 *   - X: HeaderSection (título, descripción)
 *   - Y: VisibilitySection (slider de features)
 * - Sección B (Derecha): RightSection (formulario de login)
 * - Background: BackgroundPattern (fondo animado)
 *
 * Cada componente es completamente independiente y puede editarse sin afectar a los demás
 */
</script>

<template>
  <div class="min-h-screen flex relative">
    <!-- SECCIÓN A: Left Section (Contenido promocional) -->
    <div class="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
      <!-- Background Pattern - Aislado -->
      <BackgroundPattern />

      <!-- Left Section Content -->
      <LeftSection />
    </div>

    <!-- SECCIÓN B: Right Section (Formulario de Login) -->
    <div class="w-full lg:w-1/2 xl:w-2/5 relative">
      <!-- Background para mobile -->
      <div class="lg:hidden absolute inset-0 -z-10">
        <BackgroundPattern />
      </div>
      <RightSection />
    </div>
  </div>
</template>

