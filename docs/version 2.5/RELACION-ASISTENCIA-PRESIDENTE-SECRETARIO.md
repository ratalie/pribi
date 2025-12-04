# 🔗 RELACIÓN: Tabla Asistencia ↔ Presidente/Secretario

**Documento Visual Rápido**  
**Para migración a Nuxt 4**

---

## 🎯 CONCEPTO CLAVE

```
La tabla de ASISTENCIA es la FUENTE DE DATOS
para el formulario de PRESIDENTE Y SECRETARIO
```

---

## 📊 FLUJO VISUAL COMPLETO

```
┌─────────────────────────────────────────────────────────────┐
│                   PASO 3: INSTALACIÓN                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  1️⃣ TABLA DE ASISTENCIA (useTablePoderes)                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✓ | Ana García     | NAT | 100 | 20% | -            │  │
│  │ ✓ | Inversiones SA | JUR | 200 | 40% | José Matos   │  │
│  │ ✓ | Sucursal Chile | SUC | 150 | 30% | María Torres │  │
│  │   | Pedro Ruiz     | NAT |  50 | 10% | -            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Variables del Store:                                        │
│  - asistencia: DataTableAccionist[] ← ARRAY PRINCIPAL       │
│  - faltaQuorum: boolean                                      │
└─────────────────────────────────────────────────────────────┘
                        ↓
                        ↓ TRANSFORMACIÓN
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  2️⃣ CÁLCULO DE QUÓRUM (automático)                         │
│                                                              │
│  Total acciones: 500                                         │
│  Acciones presentes: 450 (Ana + Inversiones + Sucursal)    │
│  Porcentaje: 90%                                             │
│  Estado: ✓ QUÓRUM ALCANZADO                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
                        ↓ CONSTRUCCIÓN DE OPCIONES
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  3️⃣ LISTA DE CANDIDATOS (derivada de tabla)                │
│                                                              │
│  Candidatos disponibles para Presidente/Secretario:         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. Ana García (accionista natural)                   │  │
│  │ 2. Inversiones SA (empresa)                          │  │
│  │ 3. José Matos (representa a Inversiones SA)          │  │
│  │ 4. Sucursal Chile (sucursal)                         │  │
│  │ 5. María Torres (representa a Sucursal Chile)        │  │
│  │ 6. Otro (especificar)                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ❌ Pedro Ruiz NO aparece (no marcó asistencia)             │
└─────────────────────────────────────────────────────────────┘
                        ↓
                        ↓ GUARDADO EN STORE
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  4️⃣ STORE PRESIDENTE/SECRETARIO (usePresidentSecretaryStore)│
│                                                              │
│  Variables:                                                  │
│  - optionShareholders: OptionShareholder[] ← DE TABLA       │
│  - presidentSelect: number | null                            │
│  - secretarySelect: number | null                            │
└─────────────────────────────────────────────────────────────┘
                        ↓
                        ↓ RENDERIZADO
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  5️⃣ FORMULARIO (Vista UI)                                   │
│                                                              │
│  ┌────────────────────────────┬───────────────────────────┐ │
│  │ Presidente:                │ Secretario:               │ │
│  │ [Seleccionar... ▼]         │ [Seleccionar... ▼]        │ │
│  │  - Ana García              │  - Ana García             │ │
│  │  - Inversiones SA          │  - Inversiones SA         │ │
│  │  - José Matos (rep...)     │  - José Matos (rep...)    │ │
│  │  - Sucursal Chile          │  - Sucursal Chile         │ │
│  │  - María Torres (rep...)   │  - María Torres (rep...)  │ │
│  │  - Otro                    │  - Otro                   │ │
│  └────────────────────────────┴───────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 CÓDIGO: De Tabla a Dropdown

### 1. Store de Asistencia (Fuente)

```typescript
// src/store/juntas/useTablaPoderes.ts
export const useTablePoderes = defineStore("tablePoderes", {
  state: () => ({
    asistencia: [
      {
        id: 1,
        name: "Ana García",
        typePerson: "NATURAL",
        present: true,          // ← ✓ Marcado
        actions: 100,
        percentage: 20,
        representedBy: undefined
      },
      {
        id: 2,
        name: "Inversiones SA",
        typePerson: "JURIDICA",
        present: true,          // ← ✓ Marcado
        actions: 200,
        percentage: 40,
        representedBy: {
          firstName: "José",
          lastNamePaternal: "Matos",
          lastNameMaternal: "López",
          documentNumber: "12345678"
        }
      },
      {
        id: 3,
        name: "Pedro Ruiz",
        typePerson: "NATURAL",
        present: false,         // ← ❌ NO marcado
        actions: 50,
        percentage: 10,
        representedBy: undefined
      }
    ]
  })
});
```

### 2. Construcción de Opciones

```typescript
// En el componente de Presidente/Secretario
import { useTablePoderes } from "@/store/juntas/useTablaPoderes";
import { usePresidentSecretaryStore } from "@/components/Views/DesignacionPresidenteSecretario/usePresidentSecretary.store";

const storeTable = useTablePoderes();
const presidentSecretaryStore = usePresidentSecretaryStore();

// 🔥 FUNCIÓN CLAVE: Convierte tabla → opciones dropdown
const buildCandidatesFromAsistencia = () => {
  const options = [];

  storeTable.asistencia.forEach((asistente) => {
    // ✅ REGLA 1: Solo incluir a los que ASISTIERON
    if (!asistente.present) return;

    // ✅ REGLA 2: Agregar al accionista/empresa
    options.push({
      value: asistente.accionistDetailsId,
      label: asistente.name,
      type: 'accionista'
    });

    // ✅ REGLA 3: Si tiene representante, agregarlo TAMBIÉN
    if (asistente.representedBy) {
      const repName = `${asistente.representedBy.firstName} ${asistente.representedBy.lastNamePaternal} ${asistente.representedBy.lastNameMaternal}`;
      
      options.push({
        value: asistente.accionistDetailsId * -1, // ID negativo para diferenciar
        label: `${repName} (representa a ${asistente.name})`,
        type: 'representante'
      });
    }
  });

  // ✅ REGLA 4: Agregar opción "Otro" al final
  options.push({
    value: -1,
    label: "Otro (especificar)",
    type: 'otro'
  });

  return options;
};

// Guardar en el store de presidente/secretario
onMounted(() => {
  const candidates = buildCandidatesFromAsistencia();
  presidentSecretaryStore.setShareholders(candidates);
});
```

### 3. Store de Presidente/Secretario (Destino)

```typescript
// src/components/Views/DesignacionPresidenteSecretario/usePresidentSecretary.store.ts
export const usePresidentSecretaryStore = defineStore("storePresidentSecretary", {
  state: () => ({
    // ← AQUÍ SE GUARDAN LAS OPCIONES CONSTRUIDAS
    optionShareholders: [] as OptionShareholder[],
    
    presidentSelect: null,
    secretarySelect: null,
    otherPresident: "",
    otherSecretary: "",
  }),

  actions: {
    // Método para guardar las opciones desde la tabla
    setShareholders(shareholders: OptionShareholder[]) {
      this.optionShareholders = shareholders;
    }
  },

  getters: {
    // Obtener nombre del presidente seleccionado
    getPresident(): { name: string; type: string } {
      if (this.presidentSelect && this.presidentSelect > 0) {
        const shareholder = this.optionShareholders.find(
          (sh) => sh.value === this.presidentSelect
        );
        return { 
          name: shareholder?.label || "", 
          type: "shareholder" 
        };
      }

      if (this.presidentSelect === -1 && this.otherPresident.trim() !== "") {
        return { 
          name: this.otherPresident, 
          type: "other" 
        };
      }

      return { name: "", type: "" };
    }
  }
});
```

---

## 📋 TABLA COMPARATIVA: Tipos de Candidatos

| Tipo | Origen en Tabla | Condición | ID en Dropdown |
|------|-----------------|-----------|----------------|
| **Accionista Natural** | `typePerson: "NATURAL"` | `present: true` | `accionistDetailsId` positivo |
| **Empresa/Jurídica** | `typePerson: "JURIDICA"` | `present: true` | `accionistDetailsId` positivo |
| **Representante** | `representedBy` no null | Accionista con `present: true` | `accionistDetailsId` negativo |
| **Otro** | Manual | Siempre disponible | `-1` |

---

## 🎬 EJEMPLO COMPLETO: Flujo Real

### Situación Inicial

```typescript
// Estado de la tabla de asistencia
useTablePoderes().asistencia = [
  {
    id: 1,
    name: "Ana García",
    typePerson: "NATURAL",
    present: true,  // ✓
    actions: 100,
    representedBy: undefined
  },
  {
    id: 2,
    name: "Inversiones SA",
    typePerson: "JURIDICA",
    present: true,  // ✓
    actions: 200,
    representedBy: {
      firstName: "José",
      lastNamePaternal: "Matos",
      lastNameMaternal: "López"
    }
  },
  {
    id: 3,
    name: "Pedro Ruiz",
    typePerson: "NATURAL",
    present: false,  // ❌ NO asistió
    actions: 50,
    representedBy: undefined
  }
];
```

### Transformación

```typescript
// Resultado de buildCandidatesFromAsistencia()
const candidates = [
  {
    value: 1,      // ID de Ana
    label: "Ana García",
    type: "accionista"
  },
  {
    value: 2,      // ID de Inversiones SA
    label: "Inversiones SA",
    type: "accionista"
  },
  {
    value: -2,     // ID negativo (indica representante)
    label: "José Matos López (representa a Inversiones SA)",
    type: "representante"
  },
  {
    value: -1,
    label: "Otro (especificar)",
    type: "otro"
  }
  // ❌ Pedro Ruiz NO aparece porque present: false
];
```

### Guardado en Store

```typescript
usePresidentSecretaryStore().optionShareholders = candidates;
```

### Usuario Selecciona

```vue
<template>
  <div>
    <select v-model="presidentSecretaryStore.presidentSelect">
      <option :value="null">Seleccionar...</option>
      <option 
        v-for="option in presidentSecretaryStore.optionShareholders" 
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    
    <!-- Si selecciona "Otro", mostrar input -->
    <input 
      v-if="presidentSecretaryStore.presidentSelect === -1"
      v-model="presidentSecretaryStore.otherPresident"
      placeholder="Especificar nombre..."
    />
  </div>
</template>
```

### Datos Guardados

```typescript
// Usuario seleccionó "José Matos López"
presidentSecretaryStore.presidentSelect = -2;  // ID negativo

// Al guardar en backend:
{
  presidentPersonType: "SHAREHOLDER",
  presidentAccionistId: 2,  // ID de Inversiones SA (representado)
  // El backend interpreta que José Matos es el representante
}
```

---

## 🔑 RELACIÓN CON PRESIDENTE/SECRETARIO

### Caso 1: Sociedad SIN Directorio

```
┌─────────────────────────────────────────────────────────┐
│  TABLA DE ASISTENCIA                                    │
│  [✓] Ana García (100 acciones)                          │
│  [✓] Inversiones SA - rep: José Matos (200 acciones)   │
│  [ ] Pedro Ruiz (50 acciones)                           │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  CANDIDATOS PARA PRESIDENTE/SECRETARIO                  │
│  1. Ana García                                          │
│  2. Inversiones SA                                      │
│  3. José Matos (representa a Inversiones SA)            │
│  4. Otro                                                │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  FORMULARIO                                             │
│  Presidente: [José Matos ▼]  ← Seleccionado            │
│  Secretario: [Ana García ▼]  ← Seleccionado            │
└─────────────────────────────────────────────────────────┘
```

### Caso 2: Sociedad CON Directorio

```
┌─────────────────────────────────────────────────────────┐
│  DIRECTORIO (desde appStore)                            │
│  Presidente: Cristian Huamán                            │
│  Secretario: Luis Pérez                                 │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  TABLA DE ASISTENCIA                                    │
│  [✓] Inversiones SA - rep: José Matos                   │
│  [✓] Holdings Corp - rep: María Torres                  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  FORMULARIO CON DIRECTORIO                              │
│                                                          │
│  Presidente:                                            │
│  ¿Asistió Cristian Huamán? [SI] [NO] ← Toggle          │
│                                                          │
│  Si NO asistió:                                         │
│  [Seleccionar... ▼]                                     │
│    - José Matos (rep de Inversiones)                    │
│    - María Torres (rep de Holdings)                     │
│    - Otro                                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🚨 VALIDACIONES IMPORTANTES

### 1. Personas Jurídicas DEBEN tener Representante

```typescript
// Antes de pasar al formulario de Presidente/Secretario
const validateBeforeContinue = () => {
  const storeTable = useTablePoderes();

  if (!storeTable.validateJuridicPersonRepresented) {
    toast.error(
      "Todas las personas jurídicas que asistieron deben tener representante"
    );
    return false;
  }

  return true;
};
```

### 2. Solo Presentes pueden ser Presidente/Secretario

```typescript
// La función buildCandidatesFromAsistencia() ya filtra automáticamente
// Solo incluye: asistente.present === true
```

### 3. No Repetir Presidente y Secretario

```typescript
// Validación en el componente
const validateSelection = () => {
  if (presidentSecretaryStore.presidentSelect === presidentSecretaryStore.secretarySelect) {
    toast.error("El presidente y secretario deben ser personas diferentes");
    return false;
  }
  return true;
};
```

---

## 📦 MIGRACIÓN A NUXT 4

### Estructura Hexagonal para Presidente/Secretario

```
app/core/hexag/juntas/autoridades/
├── domain/
│   ├── entities/
│   │   └── autoridad.entity.ts
│   └── ports/
│       └── autoridades.repository.ts
│
├── application/
│   ├── dtos/
│   │   └── designar-autoridades.dto.ts
│   └── use-cases/
│       ├── build-candidates.use-case.ts  ← Construye desde tabla
│       └── designar-autoridades.use-case.ts
│
└── infrastructure/
    ├── mappers/
    │   └── autoridad.mapper.ts
    └── repositories/
        ├── autoridades.http.repository.ts
        └── autoridades.msw.repository.ts
```

### Use Case: Construir Candidatos

```typescript
// app/core/hexag/juntas/autoridades/application/use-cases/build-candidates.use-case.ts
export class BuildCandidatesUseCase {
  execute(asistentes: Asistente[]): Candidato[] {
    const candidates: Candidato[] = [];

    asistentes.forEach((asistente) => {
      // ✅ Regla: Solo presentes
      if (!asistente.asistio) return;

      // Agregar accionista
      candidates.push({
        id: asistente.accionistaId,
        nombre: asistente.nombre,
        tipo: 'ACCIONISTA'
      });

      // Si tiene representante, agregarlo
      if (asistente.representante) {
        candidates.push({
          id: asistente.accionistaId * -1,
          nombre: `${asistente.representante.nombres} ${asistente.representante.apellidoPaterno}`,
          tipo: 'REPRESENTANTE',
          representa: asistente.nombre
        });
      }
    });

    // Agregar "Otro"
    candidates.push({
      id: -1,
      nombre: "Otro (especificar)",
      tipo: 'OTRO'
    });

    return candidates;
  }
}
```

---

## ✅ CHECKLIST PARA MIGRACIÓN

### Tabla de Asistencia

- [ ] Crear entidad `Asistente` en Domain Layer
- [ ] Crear entidad `Representante` en Domain Layer
- [ ] Crear DTOs bidireccionales
- [ ] Implementar `AsignarRepresentanteUseCase`
- [ ] Crear repositories HTTP + MSW
- [ ] Migrar store `useTablaPoderes` a Option API

### Presidente/Secretario

- [ ] Crear entidad `Autoridad` en Domain Layer
- [ ] Crear entidad `Candidato` en Domain Layer
- [ ] Implementar `BuildCandidatesUseCase` ← **CLAVE**
- [ ] Implementar `DesignarAutoridadesUseCase`
- [ ] Crear repositories HTTP + MSW
- [ ] Migrar store `usePresidentSecretaryStore` a Option API

### Integración

- [ ] Crear composable `useAutoridadesCandidates` que:
  - Observe cambios en `useTablePoderes().asistencia`
  - Ejecute `BuildCandidatesUseCase` automáticamente
  - Actualice `usePresidentSecretaryStore().optionShareholders`
- [ ] Validar que personas jurídicas tengan representante
- [ ] Validar que presidente ≠ secretario

---

## 🎓 RESUMEN PARA EL DESARROLLADOR

### Lo MÁS Importante

1. **Tabla de Asistencia es la FUENTE** de datos para Presidente/Secretario
2. **Solo los presentes** aparecen como candidatos
3. **Representantes se agregan** como opciones adicionales
4. **Store de Presidente/Secretario** recibe las opciones procesadas
5. **Construcción de opciones** se hace con `buildCandidatesFromAsistencia()`

### Variables Clave

```typescript
// FUENTE
useTablePoderes().asistencia: DataTableAccionist[]

// DESTINO
usePresidentSecretaryStore().optionShareholders: OptionShareholder[]
```

### Función de Transformación

```typescript
buildCandidatesFromAsistencia(): OptionShareholder[]
```

---

**Última actualización**: Diciembre 2025  
**Para**: Migración a Nuxt 4 (Arquitectura Hexagonal)

