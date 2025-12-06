# 📊 ANÁLISIS VISUAL: Juntas vs Registro de Sociedades

**Fecha:** 2025-01-05  
**Objetivo:** Documentar diferencias visuales y proponer componentes de Sociedades para reutilizar en Juntas

---

## 🎯 RESUMEN EJECUTIVO

**Situación actual:**
- ✅ Juntas (Pasos 1, 2, 3) están **funcionalmente conectadas** al backend
- ❌ Juntas **visualmente NO tienen la esencia de ProBO** (no se ve profesional como Sociedades)
- ✅ Sociedades tiene componentes reutilizables y bien diseñados

**Objetivo:**
- Reutilizar componentes de Sociedades en Juntas
- Lograr consistencia visual en toda la app
- Específicamente: Tabla de Asistencia debe verse como Tabla de Asignación de Acciones

---

## 📋 PARTE 1: COMPONENTES DE SOCIEDADES (Referencia)

### **1.1 Tabla de Asignación de Acciones** 
**Ubicación:** `app/core/presentation/registros/sociedades/pasos/asignacion-acciones/components/tables/AsignationTable.vue`

#### **Componentes UI usados:**

| Componente | Ubicación | Uso |
|-----------|-----------|-----|
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `~/components/ui/table/` | Estructura de tabla (shadcn/ui) |
| `ActionButton` | `~/components/base/buttons/composite/ActionButton.vue` | Botón "Asignar" (variant="secondary", icon="Plus") |
| `DataTableDropDown` | `~/components/base/tables/DataTableDropDown.vue` | 3 puntitos para Editar/Eliminar |
| `BaseButton` | `~/components/base/buttons/BaseButton.vue` | Botón de expandir/colapsar |
| `ChevronDown`, `ChevronUp` | `lucide-vue-next` | Iconos de expansión |

#### **Estructura visual:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Accionista          │ Tipos │ Acciones │ Participación │ ACCIÓN │
├─────────────────────────────────────────────────────────────────┤
│ ▼ Juan Pérez        │   2   │   1000   │    50%        │ Asignar│ ← Botón ActionButton
│   └─ Clase A        │       │    600   │    30%        │  ⋮     │ ← DataTableDropDown
│   └─ Clase B        │       │    400   │    20%        │  ⋮     │
├─────────────────────────────────────────────────────────────────┤
│ ▶ María López       │   1   │    500   │    25%        │ Asignar│
└─────────────────────────────────────────────────────────────────┘
```

#### **Props del botón "Asignar":**
```vue
<ActionButton
  variant="secondary"
  size="sm"
  label="Asignar"
  icon="Plus"
  @click="openModal(row.id)"
/>
```

#### **Props del dropdown (3 puntitos):**
```vue
<DataTableDropDown
  :item-id="accion.id"
  :title-menu="'Acciones'"
  :actions="[
    { label: 'Editar', icon: 'SquarePen', onClick: handleEdit },
    { label: 'Eliminar', icon: 'Trash2', onClick: handleDelete }
  ]"
/>
```

---

### **1.2 Otros Componentes Reutilizables de Sociedades:**

| Componente | Ubicación | Uso en Sociedades | Potencial para Juntas |
|-----------|-----------|-------------------|----------------------|
| `SimpleCard` | `~/components/base/cards/SimpleCard.vue` | Contenedor de secciones | ✅ Ya se usa en Juntas |
| `CardTitle` | `~/components/base/cards/CardTitle.vue` | Títulos de secciones | ✅ Ya se usa en Juntas |
| `BaseModal` | `~/components/base/modal/BaseModal.vue` | Modales (tamaño "lg") | ✅ Usar para modal de representante |
| `PersonaNaturalForm` | `~/components/composite/forms/PersonaNaturalForm.vue` | Formulario de persona natural | ✅ Reutilizar para representantes |
| `SelectInputZod` | `~/components/base/inputs/text/ui/SelectInputZod.vue` | Selects con validación Zod | ✅ Ya se usa en Juntas |
| `TextInputZod` | `~/components/base/inputs/text/ui/TextInputZod.vue` | Inputs de texto con validación | ✅ Ya se usa en Juntas |

---

## 📋 PARTE 2: COMPONENTES ACTUALES EN JUNTAS (Instalación - Asistencia)

### **2.1 Tabla de Asistencia Actual**
**Ubicación:** `app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/AsistenciaRepresentacionSection.vue`

#### **Componentes UI usados actualmente:**

| Componente | Estado | Observación |
|-----------|--------|-------------|
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | ✅ Correcto | Mismo que Sociedades |
| `<input type="checkbox">` nativo | ⚠️ Básico | Funciona, pero podría usar componente custom |
| `SelectInputZod` | ✅ Correcto | Para selector de representante |
| **NO tiene botón "Agregar"** | ❌ **FALTA** | **Necesita ActionButton** |
| **NO tiene 3 puntitos** | ❌ **FALTA** | **Necesita DataTableDropDown** |

#### **Estructura visual actual:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ ☑ │ Nombre         │ Tipo  │ Acciones │ % Part. │ Representado por │
├──────────────────────────────────────────────────────────────────────┤
│ ☑ │ Juan Pérez     │ NAT   │   1000   │  50%    │ Ninguno ▼       │
│ ☑ │ María López    │ NAT   │    500   │  25%    │ Ninguno ▼       │
│ ☐ │ Empresa XYZ    │ JUR   │    500   │  25%    │ Ninguno ▼       │
└──────────────────────────────────────────────────────────────────────┘
```

**❌ Problemas visuales:**
1. No hay botón "Agregar Representante" (como "Asignar" en Sociedades)
2. No hay opciones de Editar/Eliminar (3 puntitos)
3. El selector "Ninguno ▼" aparece siempre (incluso cuando no asistió)
4. No hay separación visual clara entre acciones primarias y secundarias

---

## 🎨 PARTE 3: PROPUESTA VISUAL (Tabla de Asistencia como Asignación de Acciones)

### **3.1 Nueva Estructura Visual Propuesta:**

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ ☑ │ Nombre           │ Tipo │ Acciones │ % Part. │ Representado por │ ACCIÓN  │
├───────────────────────────────────────────────────────────────────────────────┤
│ ☑ │ Juan Pérez       │ NAT  │   1000   │  50%    │ —                │ Agregar │ ← ActionButton
│ ☑ │ María López      │ NAT  │    500   │  25%    │ Pedro Gómez      │   ⋮     │ ← DataTableDropDown (Editar/Eliminar)
│ ☐ │ Empresa XYZ      │ JUR  │    500   │  25%    │ —                │   —     │ ← No asistió, no puede agregar
└───────────────────────────────────────────────────────────────────────────────┘
```

### **3.2 Lógica de Botones/Acciones:**

| Condición | Botón/Dropdown | Acción |
|-----------|----------------|--------|
| ✅ Asistió + Sin representante | **Botón "Agregar"** | Abre modal para crear/asignar representante |
| ✅ Asistió + Con representante | **Dropdown (⋮)** | Editar / Eliminar representante |
| ❌ NO asistió | **Vacío (—)** | No puede tener representante |

### **3.3 Cambios Específicos:**

#### **A) Agregar botón "Agregar Representante":**
```vue
<!-- Cuando asistió y NO tiene representante -->
<TableCell>
  <ActionButton
    v-if="asistencia.asistio && !asistencia.representadoPorId"
    variant="secondary"
    size="sm"
    label="Agregar"
    icon="Plus"
    @click="openRepresentanteModal(asistencia.id)"
  />
</TableCell>
```

#### **B) Agregar dropdown (3 puntitos) cuando ya tiene representante:**
```vue
<!-- Cuando asistió y YA tiene representante -->
<TableCell class="w-12">
  <DataTableDropDown
    v-if="asistencia.asistio && asistencia.representadoPorId"
    :item-id="asistencia.id"
    :title-menu="'Representante'"
    :actions="[
      { label: 'Editar', icon: 'SquarePen', onClick: handleEditRepresentante },
      { label: 'Eliminar', icon: 'Trash2', onClick: handleDeleteRepresentante }
    ]"
  />
</TableCell>
```

#### **C) Mostrar nombre del representante en columna "Representado por":**
```vue
<TableCell class="h-16">
  <span v-if="asistencia.representadoPorNombre" class="text-gray-700 font-medium">
    {{ asistencia.representadoPorNombre }}
  </span>
  <span v-else class="text-gray-400 italic">—</span>
</TableCell>
```

---

## 📊 PARTE 4: PLAN DE EVALUACIÓN VISUAL (Pasos 1, 2, 3 de Juntas)

### **4.1 Paso 1: Detalles de la Junta (Paso 0)**
**Ubicación:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/detalles/index.vue`

#### **Componentes actuales:**
- `SimpleCard` ✅
- `CardTitle` ✅
- `SelectInputZod` ✅
- `RadioInputZod` ✅

#### **Estado visual:**
- ✅ **Bien diseñado**, usa componentes correctos
- ✅ Consistente con Sociedades

#### **Recomendaciones:**
- ✅ **No requiere cambios visuales**

---

### **4.2 Paso 2: Selección de Agenda (Paso 1)**
**Ubicación:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/seleccion-agenda/index.vue`

#### **Componentes actuales:**
- `SimpleCard` ✅
- `CardTitle` ✅
- Checkboxes nativos ⚠️

#### **Estado visual:**
- ⚠️ **Funcional pero básico**
- Falta visual más profesional para los puntos de agenda

#### **Recomendaciones:**
1. **Usar `Badge` para categorías de puntos:**
   ```vue
   <Badge variant="secondary">{{ punto.categoria }}</Badge>
   ```

2. **Usar `Switch` en lugar de checkbox nativo** (como en Sociedades):
   ```vue
   <Switch v-model="punto.seleccionado" />
   ```

3. **Agregar iconos a cada punto** (como en Sociedades):
   ```vue
   <component :is="getIcon(punto.icono)" class="w-5 h-5" />
   ```

**Componente de referencia:** `app/core/presentation/registros/sociedades/pasos/datos/components/forms/DatosBasicosForm.vue` (usa Switches)

---

### **4.3 Paso 3: Instalación de la Junta (Paso 2)**
**Ubicación:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion/index.vue`

#### **Componentes actuales:**

**Mesa Directiva:**
- `SelectInputZod` ✅
- `Switch` ✅
- `SimpleCard` ✅

**Asistencia y Representación:**
- `Table` (shadcn/ui) ✅
- Checkbox nativo ⚠️
- **NO tiene botón "Agregar"** ❌
- **NO tiene 3 puntitos** ❌

#### **Estado visual:**
- ✅ **Mesa Directiva:** Bien diseñada
- ❌ **Tabla de Asistencia:** NO se ve profesional (ver PARTE 3)

#### **Recomendaciones:**
1. **Implementar propuesta de PARTE 3** (tabla como Asignación de Acciones)
2. **Agregar modal de representante** (reutilizar `PersonaNaturalForm`)
3. **Usar `DataTableDropDown`** para Editar/Eliminar

---

## 🎯 PARTE 5: CHECKLIST DE COMPONENTES A REUTILIZAR

### **✅ Componentes de Sociedades para Juntas:**

| Componente | Ubicación | Usar en | Prioridad |
|-----------|-----------|---------|-----------|
| `ActionButton` | `~/components/base/buttons/composite/ActionButton.vue` | Tabla de Asistencia (botón "Agregar") | 🔴 Alta |
| `DataTableDropDown` | `~/components/base/tables/DataTableDropDown.vue` | Tabla de Asistencia (Editar/Eliminar) | 🔴 Alta |
| `PersonaNaturalForm` | `~/components/composite/forms/PersonaNaturalForm.vue` | Modal de Representante | 🔴 Alta |
| `BaseModal` | `~/components/base/modal/BaseModal.vue` | Modal de Representante | 🔴 Alta |
| `Switch` | `~/components/ui/switch/` | Selección de Agenda (reemplazar checkboxes) | 🟡 Media |
| `Badge` | `~/components/ui/badge/` | Categorías de Puntos de Agenda | 🟡 Media |
| `Separator` | `~/components/ui/separator/` | Separadores visuales | 🟢 Baja |

---

## 📝 PARTE 6: RECOMENDACIONES DE YULL (Usuario)

> **Yull dice:** "La tabla de asistencia debería poder ver el botón de agregar y opciones (tres puntitos), como se ve en asignación de acciones."

### **Implementación recomendada:**

1. **Tabla de Asistencia:**
   - ✅ Reutilizar `ActionButton` (botón "Agregar")
   - ✅ Reutilizar `DataTableDropDown` (3 puntitos)
   - ✅ Lógica condicional: Mostrar botón o dropdown según si tiene representante

2. **Modal de Representante:**
   - ✅ Reutilizar `BaseModal` (tamaño "lg")
   - ✅ Reutilizar `PersonaNaturalForm` (formulario de persona natural)
   - ✅ Al guardar: Crear persona → Asignar UUID al attendance

3. **Store:**
   - ✅ Ya existe `useAsistenciaStore`
   - ✅ Ya tiene método `updateAsistencia()`
   - ⚠️ Falta agregar método `asignarRepresentante()`

---

## 🚀 PARTE 7: PLAN DE IMPLEMENTACIÓN (Priorizado)

### **Fase 1: Funcionalidad Crítica** (Ahora)

1. ✅ **Crear modal de representante** (reutilizar componentes)
2. ✅ **Agregar botón "Agregar"** en tabla de asistencia
3. ✅ **Agregar dropdown (⋮)** en tabla de asistencia
4. ✅ **Integrar con backend** (PUT /attendance con representedById)

**Tiempo estimado:** 3-4 horas

---

### **Fase 2: Mejoras Visuales** (Después)

1. ⚠️ **Mejorar Selección de Agenda:**
   - Reemplazar checkboxes con `Switch`
   - Agregar `Badge` para categorías
   - Agregar iconos a puntos de agenda

2. ⚠️ **Mejorar Tabla de Asistencia:**
   - Agregar animaciones de hover
   - Mejorar feedback visual al marcar/desmarcar
   - Agregar tooltip explicativo

**Tiempo estimado:** 2-3 horas

---

### **Fase 3: Refactorización DDD** (Futuro)

1. ⚠️ **Crear arquitectura hexagonal completa para Representantes:**
   ```
   app/core/hexag/juntas/representantes/
   ├── domain/
   ├── application/
   └── infrastructure/
   ```

2. ⚠️ **Crear store DDD:** `useRepresentantesStore`

**Tiempo estimado:** 6-8 horas

---

## 📚 PARTE 8: REFERENCIAS DE CÓDIGO

### **8.1 Tabla de Asignación de Acciones (Referencia completa):**
```
app/core/presentation/registros/sociedades/pasos/asignacion-acciones/
├── components/
│   ├── tables/
│   │   └── AsignationTable.vue        ← REFERENCIA PRINCIPAL
│   └── modals/
│       └── AsignarAccionesModal.vue   ← Modal de referencia
├── stores/
│   └── useRegistroAsignacionAccionesStore.ts
└── types/
    └── asignacion-acciones.ts
```

### **8.2 Componentes UI Base (Reutilizables):**
```
app/components/
├── base/
│   ├── buttons/
│   │   └── composite/ActionButton.vue
│   └── tables/
│       └── DataTableDropDown.vue
├── composite/
│   └── forms/
│       └── PersonaNaturalForm.vue
└── ui/
    ├── table/                          ← shadcn/ui
    ├── switch/                         ← shadcn/ui
    └── badge/                          ← shadcn/ui
```

### **8.3 Tabla de Asistencia (A modificar):**
```
app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/
└── components/
    └── AsistenciaRepresentacionSection.vue  ← MODIFICAR AQUÍ
```

---

## ✅ CONCLUSIÓN

**Resumen:**

1. ✅ **Sociedades tiene componentes profesionales** y reutilizables
2. ❌ **Juntas NO usa estos componentes** (excepto algunos básicos)
3. ✅ **Propuesta:** Reutilizar `ActionButton` + `DataTableDropDown` en Tabla de Asistencia
4. ✅ **Prioridad:** Implementar Fase 1 (funcionalidad crítica) AHORA
5. ⚠️ **Futuro:** Fases 2 y 3 (mejoras visuales y DDD)

**Próximos pasos inmediatos:**

1. Implementar botón "Agregar Representante" (ActionButton)
2. Implementar dropdown (⋮) para Editar/Eliminar (DataTableDropDown)
3. Crear modal de representante (BaseModal + PersonaNaturalForm)
4. Integrar con backend (PUT /attendance)

---

**¿Procedemos con la implementación de Fase 1?** 🚀



