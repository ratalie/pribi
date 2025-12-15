# 📋 Plan Completo de Refactorización - 3 Vistas Individuales

## 🎯 Objetivo

Refactorizar las 3 vistas individuales (NO votación) siguiendo el patrón de `seleccion-agenda`:

- Componentes Vue.js con lógica mínima
- Toda la lógica en composables
- Template limpio y script necesario

---

## 📐 Patrón de Referencia: `seleccion-agenda`

### Estructura:

```
composables/
├── usePage.ts              ← Orquesta TODO (nuevo)
├── useInitialization.ts    ← Inicialización (nuevo)
└── useController.ts        ← Mejorar: usar useJuntasRouteParams
```

### Página final:

```vue
<script setup lang="ts">
  import ComponentManager from "...";
  import { usePage } from "...";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  usePage(); // ✅ Solo una línea
</script>
```

---

## 🔧 Plan de Implementación

### **VISTA 1: Pronunciamiento de Gestión Social**

#### 1.1. Crear `usePronunciamientoPage.ts`

- Obtener IDs con `useJuntasRouteParams`
- Configurar botón "Siguiente" con `useJuntasFlowNext`
- Inicializar vista al montar

#### 1.2. Crear `usePronunciamientoInitialization.ts`

- Cargar datos desde backend usando `usePronunciamientoController().cargarDatos()`
- Manejar errores de carga

#### 1.3. Mejorar `usePronunciamientoController.ts`

- **Eliminar**: computed de `societyId` y `flowId` (usar `useJuntasRouteParams`)
- **Extraer**: Lógica de validación y toasts del handler "Siguiente" a método `handleNext`
- **Mantener**: `cargarDatos()` y `guardarDatos()` (ya están bien)

#### 1.4. Refactorizar página `pronunciamiento.vue`

- Eliminar toda la lógica
- Solo template + `usePronunciamientoPage()`

---

### **VISTA 2: Aplicación de Resultados**

#### 2.1. Crear `useAplicacionResultadosPage.ts`

- Similar a Pronunciamiento

#### 2.2. Crear `useAplicacionResultadosInitialization.ts`

- Similar a Pronunciamiento

#### 2.3. Mejorar `useAplicacionResultadosController.ts`

- **Eliminar**: computed de `societyId` y `flowId`
- **Extraer**: Lógica de validación a método `handleNext`
- **Mantener**: `cargarDatos()` y `guardarDatos()`

#### 2.4. Refactorizar página `aplicacion.vue`

- Eliminar lógica
- Solo template + `useAplicacionResultadosPage()`

---

### **VISTA 3: Designación de Auditores Externos**

#### 3.1. Crear `useAuditoresExternosPage.ts`

- Similar a las anteriores

#### 3.2. Crear `useAuditoresExternosInitialization.ts`

- Similar a las anteriores

#### 3.3. Mejorar `useAuditoresExternosController.ts`

- **Eliminar**: computed de `societyId` y `flowId`
- **Extraer**: Lógica de validación a método `handleNext`
- **Mantener**: `cargarDatos()` y `guardarDatos()`

#### 3.4. Refactorizar página `nombramiento.vue`

- Eliminar lógica
- Solo template + `useAuditoresExternosPage()`

---

## 📝 Checklist de Implementación

### Pronunciamiento

- [ ] Crear `usePronunciamientoPage.ts`
- [ ] Crear `usePronunciamientoInitialization.ts`
- [ ] Mejorar `usePronunciamientoController.ts` (usar `useJuntasRouteParams`, extraer `handleNext`)
- [ ] Refactorizar página `pronunciamiento.vue`

### Aplicación de Resultados

- [ ] Crear `useAplicacionResultadosPage.ts`
- [ ] Crear `useAplicacionResultadosInitialization.ts`
- [ ] Mejorar `useAplicacionResultadosController.ts` (usar `useJuntasRouteParams`, extraer `handleNext`)
- [ ] Refactorizar página `aplicacion.vue`

### Auditores Externos

- [ ] Crear `useAuditoresExternosPage.ts`
- [ ] Crear `useAuditoresExternosInitialization.ts`
- [ ] Mejorar `useAuditoresExternosController.ts` (usar `useJuntasRouteParams`, extraer `handleNext`)
- [ ] Refactorizar página `nombramiento.vue`

---

## ⏱️ Tiempo Estimado

| Vista           | Tiempo          |
| --------------- | --------------- |
| Pronunciamiento | 30-40 min       |
| Aplicación      | 20-30 min       |
| Auditores       | 20-30 min       |
| **TOTAL**       | **1.5-2 horas** |

---

## ✅ Resultado Final

### Antes:

```vue
<script setup lang="ts">
  // 50-100 líneas de lógica mezclada
  const route = useRoute();
  const societyId = computed(() => {
    /* ... */
  });
  const flowId = computed(() => {
    /* ... */
  });
  useJuntasFlowNext(async () => {
    /* ... 30 líneas ... */
  });
</script>
```

### Después:

```vue
<script setup lang="ts">
  import ComponentManager from "...";
  import { usePage } from "...";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  usePage(); // ✅ Solo una línea
</script>
```

