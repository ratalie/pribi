# 📋 Plan de Refactorización: 3 Vistas de Gestión Social

## 🎯 Objetivo

Refactorizar las 3 vistas de gestión social siguiendo el patrón de **selección-agenda**:

- Componentes Vue.js con lógica mínima
- Toda la lógica en composables
- Template limpio y script necesario
- Primero reubicar archivos (están mal ubicados)
- Luego refactorizar al nivel de selección-agenda

---

## 📊 Análisis del Estado Actual

### 1. Pronunciamiento de Gestión Social

**Ubicación actual:**

- Página: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/pronunciamiento-gestion/pronunciamiento.vue`
- Componente: `app/core/presentation/operaciones/junta-accionistas/pasos/pronunciamiento-gestion/CargaResultadosGestionManager.vue` ❌ (mal ubicado)
- Store: `app/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/stores/usePronunciamientoStore.ts` ✅
- Controller: `app/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/composables/usePronunciamientoController.ts` ✅

**Problemas identificados:**

- ❌ Componente `CargaResultadosGestionManager.vue` está en `operaciones/` en lugar de `juntas/puntos-acuerdo/`
- ❌ Página tiene lógica mezclada (computed para IDs, validaciones, toasts)
- ❌ No usa `useJuntasRouteParams` (repetido en cada página)
- ❌ No tiene composable `usePronunciamientoPage` para orquestar todo

**Líneas de código:**

- Página: ~100 líneas (debería ser ~20)
- Componente: ~? líneas (necesita revisión)

---

### 2. Aplicación de Resultados

**Ubicación actual:**

- Página: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aplicacion-resultados/aplicacion.vue`
- Componente: `app/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/components/AplicacionResultadosManager.vue` ✅
- Store: `app/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/stores/useAplicacionResultadosStore.ts` ✅
- Controller: `app/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/composables/useAplicacionResultadosController.ts` ✅

**Problemas identificados:**

- ✅ Componente bien ubicado
- ⚠️ Página está mejor que Pronunciamiento, pero puede mejorarse
- ❌ No usa `useJuntasRouteParams`
- ❌ No tiene composable `useAplicacionResultadosPage` para orquestar todo

**Líneas de código:**

- Página: ~40 líneas (debería ser ~20)

---

### 3. Designación de Auditores Externos

**Ubicación actual:**

- Página: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-auditores/nombramiento.vue`
- Componente: `app/core/presentation/juntas/puntos-acuerdo/delegacion-auditores/components/AuditoresExternosManager.vue` ✅
- Store: `app/core/presentation/juntas/puntos-acuerdo/delegacion-auditores/stores/useAuditoresExternosStore.ts` ✅
- Controller: `app/core/presentation/juntas/puntos-acuerdo/delegacion-auditores/composables/useAuditoresExternosController.ts` ✅

**Problemas identificados:**

- ✅ Componente bien ubicado
- ⚠️ Página está mejor, pero puede seguir el patrón de selección-agenda
- ❌ No usa `useJuntasRouteParams`
- ❌ No tiene composable `useAuditoresExternosPage` para orquestar todo

**Líneas de código:**

- Página: ~40 líneas (debería ser ~20)

---

## 🎨 Patrón de Referencia: Selección de Agenda

### Estructura de Selección-Agenda:

```
app/core/presentation/operaciones/junta-accionistas/pasos/seleccion-agenda/
├── components/
│   ├── organisms/
│   │   ├── PanelSeleccionPuntos.vue
│   │   └── PanelVistaPreviaAgenda.vue
│   ├── molecules/
│   └── atoms/
└── composables/
    ├── useSeleccionAgendaPage.ts          ← Orquesta TODO
    ├── useJuntasRouteParams.ts            ← Reutilizable
    ├── useSeleccionAgendaController.ts    ← Lógica de "Siguiente"
    └── useSeleccionAgendaInitialization.ts ← Inicialización
```

**Página (`index.vue`):**

```vue
<template>
  <section class="h-full flex flex-col">
    <div class="flex gap-6 min-h-0 flex-1">
      <PanelSeleccionPuntos />
      <PanelVistaPreviaAgenda />
    </div>
  </section>
</template>

<script setup lang="ts">
  import PanelSeleccionPuntos from "...";
  import PanelVistaPreviaAgenda from "...";
  import { useSeleccionAgendaPage } from "...";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Solo una línea: orquesta TODO
  useSeleccionAgendaPage();
</script>
```

**Composable `useSeleccionAgendaPage.ts`:**

```typescript
export function useSeleccionAgendaPage() {
  // Obtener IDs de la ruta
  const { societyId, flowId } = useJuntasRouteParams();

  // Controller para el botón "Siguiente"
  const { handleNext } = useSeleccionAgendaController();

  // Inicialización de la vista
  const { initialize } = useSeleccionAgendaInitialization();

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    await handleNext(societyId.value, flowIdNumber.value);
  });

  // Inicializar vista al montar
  onMounted(async () => {
    await initialize();
  });
}
```

---

## 📐 Plan de Refactorización

### **FASE 1: Reubicación de Archivos** 🔄

#### 1.1. Pronunciamiento de Gestión Social

**Mover:**

```
❌ app/core/presentation/operaciones/junta-accionistas/pasos/pronunciamiento-gestion/
   └── CargaResultadosGestionManager.vue

✅ app/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/components/
   └── CargaResultadosGestionManager.vue
```

**Acciones:**

1. Crear directorio `components/` si no existe
2. Mover `CargaResultadosGestionManager.vue`
3. Actualizar import en página

---

### **FASE 2: Crear Composables Reutilizables** 🔧

#### 2.1. Extraer `useJuntasRouteParams` a ubicación compartida

**Crear:**

```
app/core/presentation/juntas/composables/useJuntasRouteParams.ts
```

**Razón:** Ya existe en `seleccion-agenda/`, pero debe estar en ubicación compartida para que todas las vistas lo usen.

**Acciones:**

1. Copiar `useJuntasRouteParams.ts` de `seleccion-agenda/` a `juntas/composables/`
2. Actualizar imports en `seleccion-agenda/` para usar la versión compartida
3. Exportar desde `juntas/composables/index.ts` (si existe)

---

### **FASE 3: Refactorizar Pronunciamiento de Gestión Social** 🎯

#### 3.1. Crear composables

**Crear:**

```
app/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/composables/
├── usePronunciamientoPage.ts              ← Nuevo: Orquesta TODO
├── usePronunciamientoController.ts        ← Mejorar: Extraer lógica de página
└── usePronunciamientoInitialization.ts    ← Nuevo: Inicialización
```

**`usePronunciamientoPage.ts`:**

```typescript
export function usePronunciamientoPage() {
  const { societyId, flowIdNumber } = useJuntasRouteParams();
  const { handleNext } = usePronunciamientoController();
  const { initialize } = usePronunciamientoInitialization();

  useJuntasFlowNext(async () => {
    await handleNext(societyId.value, flowIdNumber.value);
  });

  onMounted(async () => {
    await initialize();
  });
}
```

**`usePronunciamientoController.ts`:**

```typescript
export function usePronunciamientoController() {
  const store = usePronunciamientoStore();
  const { guardarDatos } = usePronunciamientoController(); // Ya existe
  const { toast } = useToast();

  const handleNext = async (societyId: number, flowId: number) => {
    // Validar IDs
    if (!societyId || !flowId) {
      throw new Error("Faltan los IDs de la sociedad o flujo");
    }

    // Validar que se pueda avanzar
    if (!store.validateNextPath) {
      throw new Error("Debes completar todos los campos requeridos...");
    }

    // Guardar
    try {
      await guardarDatos();
      toast({
        variant: "success",
        title: "Éxito",
        description: "Documentos guardados correctamente",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Error al guardar los documentos",
      });
      throw error;
    }
  };

  return { handleNext };
}
```

**`usePronunciamientoInitialization.ts`:**

```typescript
export function usePronunciamientoInitialization() {
  const { societyId, flowIdNumber } = useJuntasRouteParams();
  const { cargarDatos } = usePronunciamientoController();

  const initialize = async () => {
    if (societyId.value && flowIdNumber.value) {
      await cargarDatos();
    }
  };

  return { initialize };
}
```

#### 3.2. Refactorizar página

**Antes:**

```vue
<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { useToast } from "~/components/ui/toast/use-toast";
  // ... más imports
  // ... 50+ líneas de lógica
</script>
```

**Después:**

```vue
<script setup lang="ts">
  import CargaResultadosGestionManager from "...";
  import { usePronunciamientoPage } from "...";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Solo una línea
  usePronunciamientoPage();
</script>
```

---

### **FASE 4: Refactorizar Aplicación de Resultados** 🎯

#### 4.1. Crear composables

**Crear:**

```
app/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/composables/
├── useAplicacionResultadosPage.ts              ← Nuevo
├── useAplicacionResultadosController.ts        ← Mejorar: Extraer lógica
└── useAplicacionResultadosInitialization.ts    ← Nuevo
```

**Estructura similar a Pronunciamiento**

#### 4.2. Refactorizar página

**Antes:**

```vue
<script setup lang="ts">
  const { guardarDatos } = useAplicacionResultadosController();
  useJuntasFlowNext(async () => {
    try {
      await guardarDatos();
    } catch (error: any) {
      console.error("[AplicacionResultados] Error al guardar:", error);
      throw error;
    }
  });
</script>
```

**Después:**

```vue
<script setup lang="ts">
  import AplicacionResultadosManager from "...";
  import { useAplicacionResultadosPage } from "...";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  useAplicacionResultadosPage();
</script>
```

---

### **FASE 5: Refactorizar Designación de Auditores Externos** 🎯

#### 5.1. Crear composables

**Crear:**

```
app/core/presentation/juntas/puntos-acuerdo/delegacion-auditores/composables/
├── useAuditoresExternosPage.ts              ← Nuevo
├── useAuditoresExternosController.ts        ← Mejorar: Ya existe, extraer lógica
└── useAuditoresExternosInitialization.ts    ← Nuevo
```

**Estructura similar a las anteriores**

#### 5.2. Refactorizar página

**Similar a Aplicación de Resultados**

---

## 📋 Checklist de Implementación

### Fase 1: Reubicación

- [ ] Mover `CargaResultadosGestionManager.vue` a ubicación correcta
- [ ] Actualizar imports en página de Pronunciamiento

### Fase 2: Composables Reutilizables

- [ ] Crear `app/core/presentation/juntas/composables/useJuntasRouteParams.ts`
- [ ] Actualizar `seleccion-agenda/` para usar versión compartida
- [ ] Exportar desde `juntas/composables/index.ts` (si existe)

### Fase 3: Pronunciamiento

- [ ] Crear `usePronunciamientoPage.ts`
- [ ] Crear `usePronunciamientoInitialization.ts`
- [ ] Mejorar `usePronunciamientoController.ts` (extraer lógica de página)
- [ ] Refactorizar página `pronunciamiento.vue`

### Fase 4: Aplicación de Resultados

- [ ] Crear `useAplicacionResultadosPage.ts`
- [ ] Crear `useAplicacionResultadosInitialization.ts`
- [ ] Mejorar `useAplicacionResultadosController.ts`
- [ ] Refactorizar página `aplicacion.vue`

### Fase 5: Auditores Externos

- [ ] Crear `useAuditoresExternosPage.ts`
- [ ] Crear `useAuditoresExternosInitialization.ts`
- [ ] Mejorar `useAuditoresExternosController.ts`
- [ ] Refactorizar página `nombramiento.vue`

---

## ⏱️ Tiempo Estimado

| Fase       | Descripción                  | Tiempo        |
| ---------- | ---------------------------- | ------------- |
| **Fase 1** | Reubicación de archivos      | 15 min        |
| **Fase 2** | Composables reutilizables    | 30 min        |
| **Fase 3** | Refactorizar Pronunciamiento | 1-2 horas     |
| **Fase 4** | Refactorizar Aplicación      | 1 hora        |
| **Fase 5** | Refactorizar Auditores       | 1 hora        |
| **TOTAL**  |                              | **4-5 horas** |

---

## ✅ Resultado Esperado

### Antes:

```vue
<!-- Página con 50+ líneas de lógica mezclada -->
<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { useToast } from "...";
  // ... más imports

  const route = useRoute();
  const { toast } = useToast();
  const store = useStore();
  const { guardarDatos } = useController();

  const societyId = computed(() => {
    const param = route.params.societyId;
    // ... 10 líneas de lógica
  });

  const flowId = computed(() => {
    // ... 10 líneas de lógica
  });

  useJuntasFlowNext(async () => {
    // ... 30 líneas de lógica
  });
</script>
```

### Después:

```vue
<!-- Página limpia con solo template y una línea de setup -->
<script setup lang="ts">
  import ComponentManager from "...";
  import { usePage } from "...";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  usePage(); // ✅ Orquesta TODO
</script>
```

---

## 🎯 Beneficios

1. ✅ **Código más limpio**: Páginas con solo template
2. ✅ **Reutilización**: `useJuntasRouteParams` compartido
3. ✅ **Mantenibilidad**: Lógica centralizada en composables
4. ✅ **Consistencia**: Todas las vistas siguen el mismo patrón
5. ✅ **Testabilidad**: Composables fáciles de testear
6. ✅ **Escalabilidad**: Fácil agregar nuevas vistas siguiendo el patrón

---

## 📝 Notas

- **Orden de implementación**: Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5
- **Testing**: Probar cada fase antes de continuar
- **Backward compatibility**: Asegurar que no se rompa funcionalidad existente
- **Documentación**: Actualizar comentarios en código refactorizado
