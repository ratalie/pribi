# ⚡ Flow System: Guía Visual Rápida (1 Página)

## 🎯 Sistema en 30 Segundos

```
┌─────────────────────────────────────────────────────┐
│  PROBLEMA: Necesito manejar flujos multi-paso       │
│  SOLUCIÓN: DDD Hexagonal + OOP + Objetos Agrupados  │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitectura (4 Capas)

```
    PRESENTATION (Vue)
         ↓ usa
    APPLICATION (Composables)
         ↓ orquesta
    DOMAIN (Clases OOP) ← NÚCLEO
         ↑ persiste
    INFRASTRUCTURE (Pinia + LocalStorage)
```

---

## 📦 Objetos Principales

### 1. FlowItem (Entity)

```typescript
const item = new FlowItem(
  new FlowIdentity("id", "Label"), // ¿Quién soy?
  new FlowHierarchy(1, 1), // ¿Dónde estoy?
  FlowNavigation.fromPath("/path") // ¿Cómo navego?
);
```

### 2. FlowConfig (Aggregate Root)

```typescript
const config = new FlowConfig("registro", "Registro", "sequential", [item1, item2, item3]);

config.getNextItem("item1"); // ← Navegación automática
```

### 3. useFlowNavigation (Composable)

```typescript
const { currentItem, nextItem, goNext } = useFlowNavigation(config);
```

---

## 🎨 Objetos Agrupados

```typescript
❌ ANTES (Plano)
interface FlowItem {
  id, label, level, order, path, href, ...
}

✅ AHORA (Agrupado)
class FlowItem {
  identity: { id, label, icon }
  hierarchy: { level, order, parentId }
  navigation: { path, href }
}
```

---

## 🛠️ Implementación (3 Pasos)

### PASO 1: Leer (50 min)

1. `FLOW_SYSTEM_INDEX.md` (5 min)
2. `FLOW_SYSTEM_DDD_HEXAGONAL_OOP.md` (30 min)
3. `FLOW_SYSTEM_ARQUITECTURA_VISUAL.md` (20 min)

### PASO 2: Crear Domain (4 horas)

```bash
# Crear carpetas
mkdir -p app/modules/flow-system/domain/value-objects

# Crear Value Objects
touch FlowIdentity.ts    # 1 hora
touch FlowHierarchy.ts   # 1 hora
touch FlowNavigation.ts  # 1 hora

# Crear Entities
touch FlowItem.ts        # 2 horas
```

### PASO 3: Crear Flujo (3 horas)

```typescript
// config/flows/registro.flow.ts
export function getRegistroFlow(): FlowConfig {
  const item1 = new FlowItem(...);
  const item2 = new FlowItem(...);
  // ... 10 items total

  return new FlowConfig("registro", "Registro", "sequential", [
    item1, item2, ..., item10
  ]);
}
```

---

## ✅ Ventajas Clave

| Ventaja        | Cómo                           |
| -------------- | ------------------------------ |
| **Type-Safe**  | TypeScript + Clases            |
| **Validación** | Constructor valida             |
| **Navegación** | Automática con `getNextItem()` |
| **Testeable**  | Cada capa independiente        |
| **Mantenible** | Separación de capas            |

---

## 📊 Plan Completo (22 horas)

| Fase | Qué           | Tiempo |
| ---- | ------------- | ------ |
| 1    | Setup         | 1h     |
| 2    | Value Objects | 2h     |
| 3    | Entities      | 2h     |
| 4    | Flujos        | 3h     |
| 5    | Composables   | 3h     |
| 6    | Store         | 2h     |
| 7    | UI            | 4h     |
| 8    | Integración   | 2h     |
| 9    | Tests         | 2h     |
| 10   | Docs          | 1h     |

Ver [`FLOW_SYSTEM_TODO_COMPLETO.md`](./FLOW_SYSTEM_TODO_COMPLETO.md) para detalles.

---

## 🎓 Documentos

| Doc                                                   | Para         |
| ----------------------------------------------------- | ------------ |
| [`INDEX`](./FLOW_SYSTEM_INDEX.md)                     | Empezar aquí |
| [`DDD_HEXAGONAL`](./FLOW_SYSTEM_DDD_HEXAGONAL_OOP.md) | Teoría       |
| [`VISUAL`](./FLOW_SYSTEM_ARQUITECTURA_VISUAL.md)      | Diagramas    |
| [`PRACTICA`](./FLOW_SYSTEM_GUIA_PRACTICA_INICIO.md)   | Implementar  |
| [`TODO`](./FLOW_SYSTEM_TODO_COMPLETO.md)              | Checklist    |
| [`OBJETOS`](./FLOW_SYSTEM_OBJETOS_REALES.md)          | Referencia   |
| [`RESUMEN`](./FLOW_SYSTEM_RESUMEN_EJECUTIVO.md)       | Overview     |

---

## 🚀 Comando para Empezar

```bash
cd app
mkdir -p modules/flow-system/domain/value-objects
code modules/flow-system/domain/value-objects/FlowIdentity.ts
```

---

## 💡 Concepto Clave

```
FlowConfig contiene FlowItems
    │
    │ FlowItem compuesto de Value Objects
    │
    ├─ FlowIdentity (id, label, icon)
    ├─ FlowHierarchy (level, order, parentId)
    └─ FlowNavigation (path, href)

Navegación automática:
  config.getNextItem(currentId) → nextItem
```

---

## 🎯 Resultado Final

```
✅ Flujos multi-paso funcionales
✅ Navegación Anterior/Siguiente automática
✅ Progreso tracking (X de Y)
✅ Persistencia localStorage
✅ Type-safe + Validación
✅ Testeable + Mantenible
```

---

**¡Listo para empezar!** 🚀

→ Abre [`FLOW_SYSTEM_INDEX.md`](./FLOW_SYSTEM_INDEX.md) ahora
