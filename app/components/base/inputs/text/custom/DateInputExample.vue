<!-- app/components/base/inputs/text/custom/DateInputExample.vue -->
<script setup lang="ts">
import DateInput from "@/components/base/inputs/text/ui/DateInput.vue";
import { ref } from "vue";

// 👇 Estados reactivos para los ejemplos
const fechaNacimiento = ref("");
const fechaInicio = ref("");
const fechaFin = ref("");

// 👇 Fechas límite
const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
const hace18Anos = new Date();
hace18Anos.setFullYear(hace18Anos.getFullYear() - 18);
const fechaMinima = hace18Anos.toISOString().split("T")[0];

// 👇 Manejadores de eventos
const handleFechaNacimientoChange = (value: string) => {
  console.log("Fecha de nacimiento seleccionada:", value);
};

const handleFechaInicioChange = (value: string) => {
  console.log("Fecha de inicio seleccionada:", value);
};

const handleFechaFinChange = (value: string) => {
  console.log("Fecha de fin seleccionada:", value);
};
</script>

<template>
  <div class="space-y-6 p-6 max-w-2xl">
    <h2 class="text-2xl font-bold">Ejemplos de DateInput</h2>

    <!-- 👇 Ejemplo 1: Fecha de nacimiento (requerida, con límites) -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">1. Fecha de Nacimiento</h3>
      <p class="text-sm text-gray-600">
        Campo requerido con fecha mínima (hace 18 años) y máxima (hoy)
      </p>
      <DateInput
        v-model="fechaNacimiento"
        label="Fecha de Nacimiento"
        placeholder="Selecciona tu fecha de nacimiento"
        :required="true"
        :min-date="fechaMinima"
        :max-date="hoy"
        date-format="dd/MM/yyyy"
        @input="handleFechaNacimientoChange"
      />
      <p class="text-xs text-gray-500">
        Valor: {{ fechaNacimiento || "No seleccionado" }}
      </p>
    </div>

    <!-- 👇 Ejemplo 2: Fecha de inicio (opcional) -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">2. Fecha de Inicio</h3>
      <p class="text-sm text-gray-600">
        Campo opcional sin restricciones de fecha
      </p>
      <DateInput
        v-model="fechaInicio"
        label="Fecha de Inicio"
        placeholder="Selecciona una fecha de inicio"
        :required="false"
        date-format="dd/MM/yyyy"
        @input="handleFechaInicioChange"
      />
      <p class="text-xs text-gray-500">
        Valor: {{ fechaInicio || "No seleccionado" }}
      </p>
    </div>

    <!-- 👇 Ejemplo 3: Fecha de fin (con fecha mínima dinámica) -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">3. Fecha de Fin</h3>
      <p class="text-sm text-gray-600">
        Campo con fecha mínima basada en la fecha de inicio
      </p>
      <DateInput
        v-model="fechaFin"
        label="Fecha de Fin"
        placeholder="Selecciona una fecha de fin"
        :required="false"
        :min-date="fechaInicio || undefined"
        date-format="dd/MM/yyyy"
        @input="handleFechaFinChange"
      />
      <p class="text-xs text-gray-500">
        Valor: {{ fechaFin || "No seleccionado" }}
      </p>
    </div>

    <!-- 👇 Ejemplo 4: Estados de validación -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">4. Estados de Validación</h3>
      <p class="text-sm text-gray-600">Diferentes variantes visuales</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateInput
          label="Estado Normal"
          placeholder="Estado normal"
          variant="default"
        />

        <DateInput
          label="Estado Error"
          placeholder="Estado error"
          variant="error"
          :required="true"
        />

        <DateInput
          label="Estado Success"
          placeholder="Estado success"
          variant="success"
        />
      </div>
    </div>

    <!-- 👇 Ejemplo 5: Diferentes tamaños -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">5. Diferentes Tamaños</h3>
      <p class="text-sm text-gray-600">Pequeño, mediano y grande</p>

      <div class="space-y-4">
        <DateInput label="Tamaño Pequeño" placeholder="Tamaño sm" size="sm" />

        <DateInput
          label="Tamaño Mediano"
          placeholder="Tamaño md (por defecto)"
          size="md"
        />

        <DateInput label="Tamaño Grande" placeholder="Tamaño lg" size="lg" />
      </div>
    </div>

    <!-- 👇 Resumen de valores -->
    <div class="mt-8 p-4 bg-gray-100 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">Resumen de Valores</h3>
      <div class="space-y-1 text-sm">
        <p>
          <strong>Fecha de Nacimiento:</strong>
          {{ fechaNacimiento || "No seleccionado" }}
        </p>
        <p>
          <strong>Fecha de Inicio:</strong>
          {{ fechaInicio || "No seleccionado" }}
        </p>
        <p>
          <strong>Fecha de Fin:</strong> {{ fechaFin || "No seleccionado" }}
        </p>
      </div>
    </div>
  </div>
</template>
