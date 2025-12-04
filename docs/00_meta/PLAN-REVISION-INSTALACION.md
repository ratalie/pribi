# 🔍 PLAN DE REVISIÓN - Página de Instalación No Renderiza

**Problema**: `TypeError: Cannot read properties of undefined (reading 'value')`  
**Objetivo**: Identificar y corregir el error para que la página renderice

---

## 📊 PASO 1: Identificar Stores Duplicados

### Stores ORIGINALES (funcionan):
```
app/core/presentation/juntas/stores/
├── asistencia.store.ts ✅ FUNCIONABA
├── meeting-details.store.ts ✅ FUNCIONABA
├── agenda-items.store.ts ✅ FUNCIONABA
├── snapshot.store.ts ✅ FUNCIONABA
└── junta-historial.store.ts
```

### Stores NUEVOS (creé yo, conflictuan):
```
app/core/presentation/operaciones/junta-accionistas/pasos/
├── detalles/stores/meeting-details.store.ts ❌ DUPLICADO
├── instalacion/stores/asistencia.store.ts ❌ DUPLICADO
└── seleccion-agenda/stores/agenda-items.store.ts ❌ DUPLICADO
```

**PROBLEMA**: Los componentes están importando los stores NUEVOS (que están mal)

---

## 📊 PASO 2: Ver Imports Actuales

### AsistenciaRepresentacionSection.vue:
```typescript
// ❌ IMPORTANDO STORE NUEVO (mal)
import { useAsistenciaStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/stores/asistencia.store";
import { useMeetingDetailsStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/detalles/stores/meeting-details.store";
```

### DEBERÍA SER:
```typescript
// ✅ IMPORTAR STORE ORIGINAL (bien)
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
```

---

## 📊 PASO 3: Ver Estructura del Store Original

```typescript
// app/core/presentation/juntas/stores/asistencia.store.ts
export const useAsistenciaStore = defineStore("asistencia", {
  state: () => ({
    asistencias: [],              // Array de Asistencia
    asistenciasEnriquecidas: [],  // Con datos del snapshot
    quorumEstado: null,           // Estado del quorum
    loading: false,
  }),
  
  getters: {
    // ... getters que funcionan
  },
  
  actions: {
    loadAsistencias(societyId, flowId) { ... },
    toggleAsistencia(societyId, flowId, registroId) { ... },
    // ... acciones que funcionan
  }
});
```

---

## 📊 PASO 4: Plan de Corrección

### ACCIÓN 1: Eliminar stores duplicados
```bash
rm app/core/presentation/operaciones/junta-accionistas/pasos/detalles/stores/meeting-details.store.ts
rm app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/stores/asistencia.store.ts
rm app/core/presentation/operaciones/junta-accionistas/pasos/seleccion-agenda/stores/agenda-items.store.ts
```

### ACCIÓN 2: Actualizar imports en componentes
```typescript
// En TODOS los componentes nuevos:
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
```

### ACCIÓN 3: Actualizar componentes para usar estructura correcta
```typescript
// Ver qué estructura tiene asistenciasEnriquecidas en el store original
const { asistenciasEnriquecidas } = storeToRefs(asistenciaStore);

// Usar directamente sin transformar
<TableRow v-for="accionista in asistenciasEnriquecidas" :key="accionista.id">
```

### ACCIÓN 4: Probar
```bash
npm run dev
# Recargar navegador
# Verificar consola
```

---

## 🎯 RESULTADO ESPERADO

Después de las correcciones:
- ✅ Página renderiza sin errores
- ✅ Tabla muestra accionistas del snapshot
- ✅ Checkboxes funcionan
- ✅ Modales se abren

---

**¿Procedo con las correcciones mi rey?**

