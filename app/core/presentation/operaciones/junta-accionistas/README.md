# 🏛️ Presentation Layer - Junta de Accionistas

## 📁 Estructura

```
app/core/presentation/operaciones/junta-accionistas/
├── README.md
├── components/                 ← Componentes compartidos entre pasos
├── composables/                ← Controllers compartidos
├── stores/                     ← Stores globales de juntas
└── pasos/                      ← ⭐ Cada paso es un submódulo
    ├── seleccion-agenda/       ← PASO 1: Selección de Agenda
    │   ├── components/         # Componentes Vue específicos
    │   ├── stores/             # Pinia stores (Option API)
    │   ├── composables/        # Controllers & composables
    │   ├── types/              # Tipos UI específicos
    │   └── mappers/            # FormData ↔ DTO/Entity
    ├── detalles/               ← PASO 2: Detalles de la Junta
    │   ├── components/
    │   ├── stores/
    │   ├── composables/
    │   ├── types/
    │   └── mappers/
    └── instalacion/            ← PASO 3: Instalación de la Junta
        ├── components/
        ├── stores/
        ├── composables/
        ├── types/
        └── mappers/
```

## 🔄 Flujo de Datos

```
Pages (Vue) 
  ↓
Composables (Controllers)
  ↓
Stores (Pinia - Option API)
  ↓
Use Cases (Application Layer)
  ↓
Repositories (Infrastructure Layer)
  ↓
Backend / MSW
```

## 📋 Reglas

1. **Stores SIEMPRE con Option API** (NO Composition API)
2. **Composables** gestionan el ciclo de vida de los componentes
3. **Mappers** son OPCIONALES (solo si FormData ≠ DTO)
4. **Types** solo para tipos específicos de UI (no duplicar Domain)

## 🎯 Cada Paso Tiene:

### ✅ Components
- Componentes Vue reutilizables
- Forms, Modals, Cards, Tables
- Validación con schemas (Zod)

### ✅ Stores (Pinia - Option API)
```typescript
export const useXStore = defineStore("x", {
  state: () => ({ ... }),
  actions: { ... },
  getters: { ... }
});
```

### ✅ Composables (Controllers)
```typescript
export function useXController(societyId, flowId) {
  const store = useXStore();
  
  onMounted(async () => {
    await store.load(societyId, flowId);
  });
  
  return {
    // ... expose what components need
  };
}
```

### ✅ Types
- Tipos específicos de UI
- Opciones de select
- Estados de formularios

### ✅ Mappers (OPCIONAL)
```typescript
// Solo si FormData es diferente a DTO
export class XPresentationMapper {
  static toDTO(formData: FormData): XDTO { ... }
  static toFormData(dto: XDTO): FormData { ... }
}
```

---

## 📚 Referencias

- Arquitectura Hexagonal: `app/core/hexag/juntas/README.md`
- Testing: `docs/00_meta/testing/GUIA-TESTING-JUNTAS.md`
- Ejemplo completo: `app/core/presentation/registros/sociedades/`

