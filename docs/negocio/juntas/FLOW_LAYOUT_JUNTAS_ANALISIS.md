# 🎨 Flow Layout Juntas - Análisis Completo (UI/UX/Funcionalidad)

## 🎯 Objetivo

Documentar el **sistema de sidebar y navegación** del flow layout de Juntas de Accionistas basado en el análisis de `probo-figma-ai` (React/TSX) para adaptarlo a Nuxt/Vue.

---

## 📐 Arquitectura del Sistema

### **Sistema de 3 Niveles de Navegación**

```
┌─────────────────────────────────────────────────────────────┐
│  NIVEL 1: PASOS PRINCIPALES (Sidebar Izquierdo)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Puntos de Agenda                                  │   │
│  │ 2. Detalles de la Junta                              │   │
│  │ 3. Instalación de la Junta                           │   │
│  │ 4. Puntos de Acuerdo ▾                               │   │
│  │    ├─ Sub-step 1                                     │   │
│  │    ├─ Sub-step 2                                     │   │
│  │    └─ Sub-step 3                                     │   │
│  │ 5. Resumen                                           │   │
│  │ 6. Documentos Generados                              │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  NIVEL 2: SUB-STEPS (Dentro del Paso 4)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Solo visible cuando estás en Paso 4                  │   │
│  │ Se muestran agrupados por categoría:                 │   │
│  │   ▼ Aumento de Capital                               │   │
│  │     ○ Aportes dinerarios                             │   │
│  │     ○ Aporte no dinerario                            │   │
│  │   ▼ Remoción                                         │   │
│  │     ○ Remoción de gerente                            │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  NIVEL 3: SECCIONES (Sidebar Derecho)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Solo visible cuando estás en un SUB-STEP              │   │
│  │ Ejemplo: "Aporte Dinerario" tiene 4 secciones:       │   │
│  │   ● 1. Selección de Aportantes                       │   │
│  │   ○ 2. Aportes Dinerarios                            │   │
│  │   ○ 3. Votación                                      │   │
│  │   ○ 4. Resumen                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes Principales

### **1. SingleWizardSidebar (Sidebar Izquierdo)**

**Propósito**: Navegación principal entre pasos y sub-pasos.

**Ubicación en probo-figma-ai**: `src/components/SingleWizardSidebar.tsx`

**Props**:
```typescript
interface SingleWizardSidebarProps {
  steps: WizardStep[];              // Array de pasos principales
  currentStepId: string;            // ID del paso actual
  currentSubStepId?: string;        // ID del sub-paso actual (opcional)
  onStepClick?: (stepId: string) => void;
  onSubStepClick?: (subStepId: string) => void;
  title: string;                    // "Crear Junta"
  icon: React.ComponentType;        // Ícono del flujo
  progress: { current: number; total: number };
}
```

**Estructura Visual**:
```
┌─────────────────────────┐
│ 🔷 Crear Junta          │  ← Header con ícono y título
│ Paso 1 de 6             │
├─────────────────────────┤
│ [████░░░░] 17%          │  ← Barra de progreso
│ 17% completado          │
├─────────────────────────┤
│ ● Puntos de Agenda      │  ← Paso completado (check morado)
│ ○ Detalles              │  ← Paso pendiente (círculo gris)
│ ○ Instalación           │
│ ○ Puntos de Acuerdo ▾   │  ← Paso con sub-steps (expandible)
│   ▼ Aumento de Capital  │  ← Categoría expandida
│     ○ Aportes dinerarios│  ← Sub-step
│     ○ Aporte no diner.  │
│   ▼ Remoción            │
│     ○ Remoción gerente  │
│ ○ Resumen               │
│ ○ Documentos            │
└─────────────────────────┘
```

**Características**:
- ✅ Ancho fijo: `320px` (w-80)
- ✅ Scroll vertical si hay muchos pasos
- ✅ Estados visuales: `completed`, `current`, `upcoming`
- ✅ Sub-steps agrupados por categoría
- ✅ Categorías expandibles/colapsables
- ✅ Líneas conectoras entre pasos

**Estados de Paso**:
- **completed**: Círculo morado con check ✅
- **current**: Círculo con borde morado y punto 🔵
- **upcoming**: Círculo gris vacío ⚪

---

### **2. WizardRightSidebar (Sidebar Derecho)**

**Propósito**: Navegación entre secciones dentro de un sub-step.

**Ubicación en probo-figma-ai**: `src/components/WizardRightSidebar.tsx`

**Props**:
```typescript
interface WizardRightSidebarProps {
  sections: SectionItem[];          // Array de secciones
  currentSectionId: string;         // ID de la sección actual
  onSectionClick: (sectionId: string) => void;
  title?: string;                   // "Secciones" (default)
}
```

**Estructura Visual**:
```
┌─────────────────────────┐
│ SECCIONES               │  ← Header
├─────────────────────────┤
│ ● 1. Selección          │  ← Sección activa (morado)
│    Aportantes           │
│                         │
│ ○ 2. Aportes            │  ← Sección pendiente (gris)
│    Dinerarios           │
│                         │
│ ○ 3. Votación           │
│                         │
│ ○ 4. Resumen            │
└─────────────────────────┘
```

**Características**:
- ✅ Ancho fijo: `360px` (w-[360px])
- ✅ Solo visible cuando `hasRightSidebar === true`
- ✅ Línea vertical conectora entre secciones
- ✅ Estados: `completed`, `current`, `upcoming`

**Cuándo se muestra**:
```typescript
// En FlujoWizardView.tsx
const hasRightSidebar = !!currentSubStepId;

// Solo aparece cuando estás en un sub-step del Paso 4
```

---

### **3. FlujoWizardView (Contenedor Principal)**

**Propósito**: Orquesta todo el sistema de wizard.

**Ubicación en probo-figma-ai**: `src/components/FlujoWizardView.tsx`

**Estructura HTML**:
```typescript
<div className="flex h-screen overflow-hidden">
  {/* SIDEBAR IZQUIERDO */}
  <SingleWizardSidebar {...} />

  {/* CONTENIDO CENTRAL + SIDEBAR DERECHO */}
  <div className="flex-1 flex flex-col">
    {/* HEADER */}
    <div className="bg-white border-b px-8 py-4">
      <Button onClick={onBack}>Salir</Button>
      <h1>{currentStep.title}</h1>
      <Button onClick={handleSave}>Guardar</Button>
    </div>

    {/* CONTENIDO */}
    <div className="flex-1 overflow-hidden">
      {hasRightSidebar ? (
        <div className="flex h-full">
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {/* Formulario */}
          </div>
          <WizardRightSidebar {...} />
        </div>
      ) : (
        <div className="overflow-y-auto px-8 py-6">
          {/* Formulario */}
        </div>
      )}
    </div>

    {/* FOOTER */}
    <div className="bg-white border-t px-8 py-4">
      <Button onClick={handlePrev}>Anterior</Button>
      <span>Paso {current} de {total}</span>
      <Button onClick={handleNext}>Siguiente</Button>
    </div>
  </div>
</div>
```

---

## 🔄 Sistema de Sub-Steps Dinámicos

### **Problema que Resuelve**

En el flujo de Juntas, el **Paso 4 (Puntos de Acuerdo)** debe mostrar **SOLO** los sub-pasos que corresponden a los checkboxes seleccionados en el **Paso 1 (Puntos de Agenda)**.

### **Solución Implementada**

```typescript
// 1. Obtener sub-steps seleccionados desde el Store
const dynamicSubSteps = getDynamicSubSteps?.() || [];

// 2. Filtrar steps para incluir solo sub-steps seleccionados
const stepsWithDynamicSubSteps = config.steps.map(step => {
  if (step.id === 'puntos-acuerdo' && step.subSteps) {
    // Si NO hay puntos seleccionados
    if (dynamicSubSteps.length === 0) {
      return {
        ...step,
        subSteps: []  // Sin sub-steps
      };
    }
    
    // Si hay puntos seleccionados, filtrar
    return {
      ...step,
      subSteps: step.subSteps.filter(subStep => 
        dynamicSubSteps.includes(subStep.id)
      )
    };
  }
  return step;
});
```

### **Flujo Completo**

```
1. Usuario en Paso 1 (Puntos de Agenda)
   ✅ Selecciona checkbox "Aportes dinerarios"
   ✅ Selecciona checkbox "Nombramiento de gerente"
   ⬜ No selecciona "Remoción de directores"
   ↓
2. Se guarda en FlujoStore
   dynamicSubSteps = ['aporte-dinerarios', 'nombramiento-gerente']
   ↓
3. Usuario navega al Paso 4 (Puntos de Acuerdo)
   ↓
4. FlujoWizardView filtra sub-steps
   stepsWithDynamicSubSteps = [
     ...,
     {
       id: 'puntos-acuerdo',
       subSteps: [
         { id: 'aporte-dinerarios', ... },  // ✅ Incluido
         { id: 'nombramiento-gerente', ... }, // ✅ Incluido
         // ❌ 'remocion-directores' NO incluido
       ]
     }
   ]
   ↓
5. SingleWizardSidebar renderiza SOLO los filtrados
   ▼ Aumento de Capital
     ○ Aportes dinerarios
   ▼ Nombramiento
     ○ Nombramiento de gerente
   // ❌ "Remoción de directores" NO aparece
```

---

## 📋 Configuración de Pasos

### **Estructura de Datos**

```typescript
// src/data/flujoSteps.ts
export interface WizardStep {
  id: string;                    // 'puntos-agenda'
  title: string;                 // 'Puntos de Agenda'
  description?: string;          // 'Selecciona los puntos...'
  status?: 'current' | 'upcoming' | 'completed';
  subSteps?: WizardSubStep[];    // Opcional
}

export interface WizardSubStep {
  id: string;                    // 'aporte-dinerarios'
  title: string;                 // 'Aporte Dinerario'
  category?: string;             // 'Aumento de Capital'
  status?: 'current' | 'upcoming' | 'completed';
}
```

### **Configuración para Juntas**

```typescript
export const juntaSteps: WizardStep[] = [
  {
    id: 'puntos-agenda',
    title: 'Puntos de Agenda',
    description: 'Selecciona los puntos a incluir en la junta',
  },
  {
    id: 'detalles-junta',
    title: 'Detalles de la Junta',
    description: 'Completa la información de la Junta',
  },
  {
    id: 'instalacion',
    title: 'Instalación de la Junta',
    description: 'Registra representante, asistencia y autoridades',
  },
  {
    id: 'puntos-acuerdo',
    title: 'Puntos de Acuerdo',
    description: 'Completa las acciones y decisiones adoptadas',
    subSteps: [
      // CATEGORÍA: Aumento de Capital
      {
        id: 'aporte-dinerarios',
        title: 'Aporte Dinerario',
        category: 'Aumento de Capital',
      },
      {
        id: 'aporte-no-dinerario',
        title: 'Aporte no Dinerario',
        category: 'Aumento de Capital',
      },
      {
        id: 'capitalizacion-creditos',
        title: 'Capitalización de Créditos',
        category: 'Aumento de Capital',
      },
      
      // CATEGORÍA: Remoción
      {
        id: 'remocion-gerente',
        title: 'Remoción de Gerente General',
        category: 'Remoción',
      },
      {
        id: 'remocion-apoderados',
        title: 'Remoción de Apoderados',
        category: 'Remoción',
      },
      {
        id: 'remocion-directores',
        title: 'Remoción de Directores',
        category: 'Remoción',
      },
      
      // CATEGORÍA: Nombramiento
      {
        id: 'nombramiento-gerente',
        title: 'Nombramiento de Gerente General',
        category: 'Nombramiento',
      },
      {
        id: 'nombramiento-apoderados',
        title: 'Nombramiento de Apoderados',
        category: 'Nombramiento',
      },
      {
        id: 'nombramiento-directores',
        title: 'Nombramiento de Directores',
        category: 'Nombramiento',
      },
      {
        id: 'nombramiento-nuevo-directorio',
        title: 'Nombramiento del Nuevo Directorio',
        category: 'Nombramiento',
      },
      
      // CATEGORÍA: Gestión Social
      {
        id: 'pronunciamiento-gestion',
        title: 'Pronunciamiento de la Gestión Social...',
        category: 'Gestión Social y Resultados Económicos',
      },
      {
        id: 'aplicacion-resultados',
        title: 'Aplicación de Resultados',
        category: 'Gestión Social y Resultados Económicos',
      },
      {
        id: 'delegacion-auditores',
        title: 'Designación y/o Delegación...',
        category: 'Gestión Social y Resultados Económicos',
      },
    ]
  },
  {
    id: 'resumen',
    title: 'Resumen',
    description: 'Visualiza un resumen de los datos',
  },
  {
    id: 'documentos-generados',
    title: 'Documentos Generados',
    description: 'Visualiza o descarga los documentos finales',
  },
];
```

---

## 🛣️ Sistema de Rutas

### **Estructura de Rutas en Nuxt**

```
/operaciones/junta-accionistas/
├── dashboard.vue                    # Lista de juntas
├── crear.vue                        # Crear nueva junta
├── [id]/
│   ├── seleccion-agenda/
│   │   ├── index.vue               # Paso 1: Puntos de Agenda
│   │   └── paso-1.vue              # (alternativa)
│   ├── detalles-junta/
│   │   └── index.vue               # Paso 2: Detalles
│   ├── instalacion/
│   │   ├── index.vue               # Paso 3: Instalación
│   │   └── paso-2.vue              # (alternativa)
│   ├── puntos-acuerdo/
│   │   ├── index.vue               # Paso 4: Lista de sub-steps
│   │   ├── aporte-dinerario/
│   │   │   ├── index.vue           # Sub-step: Aporte Dinerario
│   │   │   ├── seleccion-aportantes.vue  # Sección 1
│   │   │   ├── aportes.vue         # Sección 2
│   │   │   ├── votacion.vue        # Sección 3
│   │   │   └── resumen.vue         # Sección 4
│   │   ├── nombramiento-gerente/
│   │   │   ├── index.vue           # Sub-step: Nombramiento
│   │   │   ├── nombramiento.vue    # Sección 1
│   │   │   ├── votacion.vue       # Sección 2
│   │   │   └── resumen.vue        # Sección 3
│   │   └── ... (otros sub-steps)
│   ├── resumen/
│   │   └── index.vue               # Paso 5: Resumen
│   └── descargar.vue               # Paso 6: Documentos
```

### **Configuración de Layout**

```typescript
// app/pages/operaciones/junta-accionistas/[id]/seleccion-agenda/index.vue
definePageMeta({
  layout: "flow-layout-juntas",
  // O alternativamente:
  // flowLayoutJuntas: true,
});
```

---

## 🎨 Estilos y Variables CSS

### **Paleta de Colores**

```css
/* Primary - Morado PROBO */
--primary-700: #553ADE    /* Botones, bordes activos */
--primary-800: #3C28A4    /* Sidebar activo */
--primary-500: #7C5DF0    /* Gradientes */
--primary-50: #F1EEFF     /* Background hover */

/* Grays */
--gray-200: #D9D8DC       /* Bordes */
--gray-300: #C6C5CA       /* Bordes heavy */
--gray-400: #B3B1B8       /* Texto deshabilitado */
--gray-500: #8D8A95       /* Texto muted */

/* Text */
--text-primary: #110C22   /* Títulos */
--text-secondary: #4F4B5C /* Descripciones */
--text-muted: #8D8A95     /* Placeholders */

/* Backgrounds */
--bg-muted: #F8F8F8       /* Fondo general */
--bg-default: #FFFFFF     /* Cards, modales */

/* Borders */
--border-default: #E5E4E8  /* Bordes estándar */
--border-light: #F0EFF4   /* Bordes sutiles */

/* Radius */
--radius-large: 24px      /* Cards grandes */
--radius-medium: 16px     /* Botones, inputs */
--radius-small: 8px       /* Badges, chips */
```

### **Tipografía**

```css
--font-primary: 'Inter', sans-serif;      /* Títulos */
--font-secondary: 'Inter', sans-serif;   /* Texto general */
```

---

## 🔄 Funcionalidades Clave

### **1. Navegación entre Pasos**

```typescript
const handleStepClick = (stepId: string) => {
  const index = config.steps.findIndex(s => s.id === stepId);
  // Solo permitir navegar a pasos previos o actual
  if (index !== -1 && index <= currentStepIndex) {
    setCurrentStepIndex(index);
    setCurrentSubStepId(undefined);
  }
};
```

**Regla**: Solo puedes navegar a pasos que ya completaste o al paso actual.

### **2. Navegación entre Sub-Steps**

```typescript
const handleSubStepClick = (subStepId: string) => {
  const puntosAcuerdoIndex = config.steps.findIndex(s => s.id === 'puntos-acuerdo');
  
  // Si no estamos en "Puntos de Acuerdo", navegar ahí primero
  if (puntosAcuerdoIndex !== -1 && currentStepIndex !== puntosAcuerdoIndex) {
    setCurrentStepIndex(puntosAcuerdoIndex);
  }
  
  // Luego establecer el sub-step
  setCurrentSubStepId(subStepId);
};
```

### **3. Navegación entre Secciones**

```typescript
const handleSectionClick = (sectionId: string) => {
  setCurrentSectionId(sectionId);
  // Scroll al inicio del formulario
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

### **4. Guardado y Restablecimiento**

```typescript
const handleSave = () => {
  setSavedFormData({ ...formData }); // Snapshot
  toast.success('Cambios guardados correctamente');
};

const handleReset = () => {
  setFormData({ ...savedFormData }); // Restaurar
  toast.info('Formulario restablecido al último guardado');
};
```

---

## 📊 Mapeo de Rutas a Pasos

| Ruta | Paso | Sub-Step | Sección |
|------|------|----------|---------|
| `/seleccion-agenda` | 1 | - | - |
| `/detalles-junta` | 2 | - | - |
| `/instalacion` | 3 | - | - |
| `/puntos-acuerdo` | 4 | - | - |
| `/puntos-acuerdo/aporte-dinerario` | 4 | `aporte-dinerarios` | `seleccion-aportantes` |
| `/puntos-acuerdo/aporte-dinerario/aportes` | 4 | `aporte-dinerarios` | `aportes` |
| `/puntos-acuerdo/aporte-dinerario/votacion` | 4 | `aporte-dinerarios` | `votacion` |
| `/puntos-acuerdo/aporte-dinerario/resumen` | 4 | `aporte-dinerarios` | `resumen` |
| `/puntos-acuerdo/nombramiento-gerente` | 4 | `nombramiento-gerente` | `nombramiento` |
| `/puntos-acuerdo/nombramiento-gerente/votacion` | 4 | `nombramiento-gerente` | `votacion` |
| `/resumen` | 5 | - | - |
| `/descargar` | 6 | - | - |

---

## 🎯 Adaptación a Nuxt/Vue

### **Componentes a Crear**

1. **`SingleWizardSidebar.vue`**
   - Equivalente a `SingleWizardSidebar.tsx`
   - Props similares
   - Lógica de estados (completed, current, upcoming)

2. **`WizardRightSidebar.vue`**
   - Equivalente a `WizardRightSidebar.tsx`
   - Props similares
   - Solo visible cuando `hasRightSidebar === true`

3. **`FlowLayoutJuntas.vue`**
   - Equivalente a `FlujoWizardView.tsx`
   - Layout para páginas de juntas
   - Orquesta sidebars y contenido

### **Store a Crear**

```typescript
// stores/juntas-flow.store.ts
export const useJuntasFlowStore = defineStore('juntas-flow', {
  state: () => ({
    selectedSubSteps: [] as string[],  // Sub-steps seleccionados en Paso 1
    currentStepId: '',
    currentSubStepId: '',
    currentSectionId: '',
  }),
  getters: {
    getDynamicSubSteps: (state) => state.selectedSubSteps,
  },
  actions: {
    updateDynamicSubSteps(subStepIds: string[]) {
      this.selectedSubSteps = subStepIds;
    },
  },
});
```

### **Configuración de Pasos**

```typescript
// config/flows/juntas-steps.ts
export const juntaSteps: WizardStep[] = [
  // ... (igual que en probo-figma-ai)
];
```

---

## 📝 Resumen

| Aspecto | Estado |
|---------|--------|
| **Sidebar Izquierdo** | ✅ Documentado (SingleWizardSidebar) |
| **Sidebar Derecho** | ✅ Documentado (WizardRightSidebar) |
| **Sistema Dinámico** | ✅ Documentado (filtrado de sub-steps) |
| **Rutas** | ✅ Documentado (estructura Nuxt) |
| **Estilos** | ✅ Documentado (variables CSS) |
| **Funcionalidades** | ✅ Documentado (navegación, guardado) |
| **Adaptación Nuxt** | 🔜 Pendiente de implementación |

---

**Siguiente**: Crear plan de implementación de Juntas basado en toda esta documentación

