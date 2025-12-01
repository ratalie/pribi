# 📘 DOCUMENTACIÓN: SISTEMA WIZARD SIDEBAR PARA JUNTAS DE ACCIONISTAS

## 🎯 RESUMEN EJECUTIVO

Este documento describe la arquitectura completa del sistema de **Wizard Sidebar Doble** implementado para el flujo de **Juntas de Accionistas** en PROBO. El sistema permite navegación paso a paso con sub-pasos dinámicos, barra de progreso, vista previa en tiempo real, y acciones de guardado/restauración.

---

## 📐 ARQUITECTURA DEL SISTEMA

### **COMPONENTES PRINCIPALES**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO WIZARD VIEW                             │
│                  (FlujoWizardView.tsx)                          │
└──────┬──────────────────────────────────────────────────────────┘
       │
       ├── 📁 SIDEBAR IZQUIERDO (SingleWizardSidebar / DoubleWizardSidebar)
       │   ├── Header (Título + Ícono + Progreso)
       │   ├── Barra de Progreso (Visual %)
       │   └── Lista de Pasos con Estado (current/completed/upcoming)
       │
       ├── 📄 CONTENIDO CENTRAL
       │   ├── Header (Salir + Título + Descripción)
       │   ├── Acciones (Guardar + Restablecer)
       │   └── Formulario del Paso Actual
       │
       └── 📋 SIDEBAR DERECHO (Opcional - Solo si tiene sub-steps)
           ├── Header (Título del Paso)
           ├── Categorías Colapsables (Acordeones)
           └── Lista de Sub-pasos Dinámicos
```

---

## 🧩 COMPONENTES DETALLADOS

### **1. DOUBLE WIZARD SIDEBAR** (`DoubleWizardSidebar.tsx`)

**Propósito:** Renderiza dos sidebars simultáneos - uno para pasos principales y otro para sub-pasos agrupados por categoría.

#### **📦 INTERFACES**

```typescript
export interface WizardSubStep {
  id: string;                    // Identificador único del sub-paso
  title: string;                 // Título mostrado
  category?: string;             // Categoría para agrupación
  status?: 'current' | 'upcoming' | 'completed';
}

export interface WizardStep {
  id: string;                    // Identificador único del paso
  title: string;                 // Título del paso
  description?: string;          // Descripción opcional
  status?: 'current' | 'upcoming' | 'completed';
  subSteps?: WizardSubStep[];   // Sub-pasos opcionales
}

interface DoubleWizardSidebarProps {
  steps: WizardStep[];           // Array de pasos principales
  currentStepId: string;         // ID del paso actual
  currentSubStepId?: string;     // ID del sub-paso actual (opcional)
  onStepClick?: (stepId: string) => void;
  onSubStepClick?: (subStepId: string) => void;
  title: string;                 // Título del wizard (ej: "Crear Junta")
  icon: React.ComponentType<{ className?: string }>;
  progress: { current: number; total: number };
}
```

#### **🎨 ESTRUCTURA VISUAL**

```
┌─────────────────┬──────────────────┐
│ SIDEBAR IZQ     │ SIDEBAR DER      │
│ (320px)         │ (320px)          │
├─────────────────┼──────────────────┤
│ ┌─────────────┐ │ Puntos de Acuerdo│
│ │ 🔷 Crear    │ │                  │
│ │    Junta    │ │ ▼ Aumento Cap... │
│ │ Paso 1 de 6 │ │   ○ Aportes $    │
│ └─────────────┘ │   ○ Aporte no $  │
│                 │   ○ Capitaliz... │
│ [████░░] 17%    │                  │
│                 │ ▼ Remoción       │
│ ● Puntos Agenda │   ○ Remoción...  │
│ ○ Detalles      │   ○ Remoción...  │
│ ○ Instalación   │                  │
│ ○ Puntos Acuer. │ ▼ Nombramiento   │
│ ○ Resumen       │   ○ Nombram...   │
│ ○ Documentos    │                  │
└─────────────────┴──────────────────┘
```

#### **⚙️ LÓGICA DE AGRUPACIÓN AUTOMÁTICA**

Los sub-pasos se agrupan automáticamente por categoría según palabras clave en el título:

```typescript
const getGroupedSubSteps = (subSteps: WizardSubStep[]) => {
  const categories: { [key: string]: WizardSubStep[] } = {};
  
  subSteps.forEach(subStep => {
    let category = 'General';
    
    // Detección automática de categorías
    if (subStep.title.includes('aumento') || 
        subStep.title.includes('aporte') || 
        subStep.title.includes('capitalización')) {
      category = 'Aumento de Capital';
    } 
    else if (subStep.title.includes('remoción')) {
      category = 'Remoción';
    } 
    else if (subStep.title.includes('nombramiento')) {
      category = 'Nombramiento';
    }
    else if (subStep.title.includes('gestión') ||
             subStep.title.includes('pronunciamiento') ||
             subStep.title.includes('auditores')) {
      category = 'Gestión Social y Resultados Económicos';
    }
    
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(subStep);
  });
  
  return categories;
};
```

#### **🔵 ESTADOS DE PASO (Step States)**

Cada paso puede tener 3 estados visuales:

| Estado | Visual | Descripción |
|--------|--------|-------------|
| **completed** | ✅ Círculo morado con check | Paso completado |
| **current** | 🔵 Círculo con borde morado + punto | Paso actual |
| **upcoming** | ⚪ Círculo gris vacío | Paso pendiente |

**Código de estilos:**

```typescript
const getCircleStyle = () => {
  if (status === 'completed') {
    return {
      backgroundColor: 'var(--primary-700)',  // Morado
      borderColor: 'var(--primary-700)',
      color: 'white'
    };
  }
  if (status === 'current' || isCurrent) {
    return {
      backgroundColor: 'white',
      borderColor: 'var(--primary-700)',      // Borde morado
      borderWidth: '2px',
      color: 'var(--primary-700)'
    };
  }
  return {
    backgroundColor: 'white',
    borderColor: 'var(--gray-300)',           // Gris
    borderWidth: '2px',
    color: 'var(--gray-400)'
  };
};
```

---

### **2. WIZARD RIGHT SIDEBAR** (`WizardRightSidebar.tsx`)

**Propósito:** Sidebar derecho opcional para mostrar secciones o vista previa del paso actual.

#### **📦 INTERFACES**

```typescript
export interface SectionItem {
  id: string;
  title: string;
  description?: string;
  status?: 'current' | 'upcoming' | 'completed';
}

interface WizardRightSidebarProps {
  sections: SectionItem[];
  currentSectionId: string;
  onSectionClick: (sectionId: string) => void;
  title?: string;  // Default: "Secciones"
}
```

#### **🎨 ESTRUCTURA**

```
┌──────────────────────┐
│   VISTA PREVIA       │  ← Header
├──────────────────────┤
│                      │
│ Agenda (0 puntos)    │  ← Título
│                      │
│  📄                  │
│  No hay puntos       │  ← Empty State
│  seleccionados       │
│                      │
└──────────────────────┘
```

**Ancho fijo:** `360px`

---

### **3. FLUJO WIZARD VIEW** (`FlujoWizardView.tsx`)

**Propósito:** Componente contenedor que orquesta todo el sistema de wizard.

#### **📦 CONFIGURACIÓN**

```typescript
interface FlujoWizardConfig {
  title: string;                    // "Crear Junta"
  icon: React.ComponentType;        // Ícono del flujo
  steps: WizardStep[];              // Array de pasos
  modo?: ModoVista;                 // 'CREAR' | 'EDITAR' | 'VER'
  registroId?: string;              // ID del registro (para editar)
  onBack: () => void;               // Callback al salir
  onComplete: (registroId: string) => void;  // Callback al completar
}
```

#### **🔄 SISTEMA DE SUB-STEPS DINÁMICOS**

**El problema que resuelve:**
En el flujo de Juntas, el **Paso 4 (Puntos de Acuerdo)** debe mostrar SOLO los sub-pasos que corresponden a los checkboxes seleccionados en el **Paso 1 (Puntos de Agenda)**.

**Solución implementada:**

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

**Ejemplo de flujo:**

```
Paso 1: Usuario selecciona checkboxes
  ✅ Aportes dinerarios
  ✅ Nombramiento de gerente general
  ⬜ Remoción de directores

↓ (se guarda en FlujoStore)

Paso 4: Se muestran SOLO los sub-steps correspondientes
  - Sidebar derecho aparece con:
    ▼ Aumento de Capital
      ○ Aportes dinerarios
    ▼ Nombramiento
      ○ Nombramiento de gerente general
```

---

## 🎯 LAYOUT COMPLETO DEL WIZARD

### **ESTRUCTURA HTML/CSS**

```typescript
<div className="flex h-screen overflow-hidden">
  {/* SIDEBAR IZQUIERDO */}
  <SingleWizardSidebar
    steps={stepsWithStatus}
    currentStepId={currentStep.id}
    currentSubStepId={currentSubStepId}
    onStepClick={handleStepClick}
    onSubStepClick={handleSubStepClick}
    title="Crear Junta"
    icon={UsersIcon}
    progress={{ current: 1, total: 6 }}
  />

  {/* CONTENIDO CENTRAL + SIDEBAR DERECHO */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* HEADER SUPERIOR */}
    <div className="bg-white border-b px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Izquierda: Salir + Título */}
        <div className="flex items-center gap-4">
          <Button onClick={onBack}>
            <ArrowLeft /> Salir
          </Button>
          <div>
            <h1>Puntos de Agenda</h1>
            <p>Selecciona los puntos a incluir...</p>
          </div>
        </div>
        
        {/* Derecha: Acciones */}
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save /> Guardar Cambios
          </Button>
          <Button onClick={handleReset}>
            <RotateCcw /> Restablecer
          </Button>
        </div>
      </div>
    </div>

    {/* CONTENIDO DEL PASO */}
    <div className="flex-1 overflow-hidden">
      {hasRightSidebar ? (
        // Con sidebar derecho
        <div className="flex h-full">
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {/* Contenido del formulario */}
          </div>
          <WizardRightSidebar {...} />
        </div>
      ) : (
        // Sin sidebar derecho
        <div className="overflow-y-auto px-8 py-6">
          {/* Contenido del formulario */}
        </div>
      )}
    </div>

    {/* FOOTER: NAVEGACIÓN */}
    <div className="bg-white border-t px-8 py-4">
      <div className="flex items-center justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          <ArrowLeft /> Anterior
        </Button>
        <span>Paso {currentStepIndex + 1} de {steps.length}</span>
        <Button onClick={handleNext} disabled={isLastStep}>
          Siguiente <ArrowRight />
        </Button>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 ESTILOS Y COLORES

### **PALETA DE COLORES USADA**

```css
/* Primary - Morado PROBO */
--primary-700: #553ADE    /* Botones, bordes activos */
--primary-800: #3C28A4    /* Sidebar activo */
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

/* Radius */
--radius-large: 24px      /* Cards grandes */
--radius-medium: 16px     /* Botones, inputs */
```

### **BARRA DE PROGRESO**

```typescript
{/* Barra de progreso */}
<div className="h-2 rounded-full overflow-hidden bg-gray-200">
  <div
    className="h-full transition-all duration-300"
    style={{
      width: `${(progress.current / progress.total) * 100}%`,
      backgroundColor: 'var(--primary-700)'
    }}
  />
</div>
<p className="text-xs mt-2 text-right text-gray-500">
  {Math.round((progress.current / progress.total) * 100)}% completado
</p>
```

**Resultado visual:**
```
[████████████░░░░░░░░] 17% completado
```

---

## 🔄 FLUJO DE DATOS

### **ESTADO GLOBAL (FlujoStore)**

```typescript
// contexts/FlujoContext.tsx
interface FlujoStore {
  // Sub-steps dinámicos seleccionados en Paso 1
  selectedSubSteps: string[];
  
  // Obtener sub-steps para Paso 4
  getDynamicSubSteps: () => string[];
  
  // Actualizar sub-steps cuando cambian los checkboxes
  updateDynamicSubSteps: (subStepIds: string[]) => void;
}
```

### **ESTADO LOCAL (FlujoWizardView)**

```typescript
const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [currentSubStepId, setCurrentSubStepId] = useState<string>();
const [currentSectionId, setCurrentSectionId] = useState('configuracion');
const [formData, setFormData] = useState<any>({});
const [savedFormData, setSavedFormData] = useState<any>({});
const [sendToRepository, setSendToRepository] = useState(true);
```

### **CICLO DE VIDA**

```
1. Usuario entra al wizard
   ↓
2. Se carga FlujoWizardView con configuración
   ↓
3. Se renderiza SingleWizardSidebar con pasos
   ↓
4. Usuario interactúa con Paso 1 (Puntos de Agenda)
   ✅ Selecciona "Aportes dinerarios"
   ✅ Selecciona "Nombramiento de gerente"
   ↓
5. Se llama a updateDynamicSubSteps(['aporte-dinerarios', 'nombramiento-gerente'])
   ↓
6. Se guarda en FlujoStore
   ↓
7. Usuario navega al Paso 4 (Puntos de Acuerdo)
   ↓
8. stepsWithDynamicSubSteps filtra los sub-steps
   ↓
9. Se renderiza DoubleWizardSidebar con sidebar derecho
   ↓
10. Sidebar derecho muestra SOLO los sub-steps seleccionados
```

---

## 🛠️ FUNCIONES PRINCIPALES

### **handleNext()**
```typescript
const handleNext = () => {
  if (!isLastStep) {
    setCurrentStepIndex(currentStepIndex + 1);
    setCurrentSubStepId(undefined); // Reset sub-step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
```

### **handlePrev()**
```typescript
const handlePrev = () => {
  if (!isFirstStep) {
    setCurrentStepIndex(currentStepIndex - 1);
    setCurrentSubStepId(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
```

### **handleSave()**
```typescript
const handleSave = () => {
  setSavedFormData({ ...formData }); // Snapshot
  toast.success('Cambios guardados correctamente');
};
```

### **handleReset()**
```typescript
const handleReset = () => {
  setFormData({ ...savedFormData }); // Restaurar
  toast.info('Formulario restablecido al último guardado');
};
```

### **handleComplete()**
```typescript
const handleComplete = () => {
  const finalData = {
    ...formData,
    sendToRepository,
    completedAt: new Date().toISOString()
  };
  const registroId = config.modo === 'EDITAR' 
    ? actualizarSociedad(config.registroId, finalData)
    : crearSociedad(finalData);
  config.onComplete(registroId);
  toast.success('Flujo completado y guardado exitosamente');
};
```

### **handleStepClick()**
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

### **handleSubStepClick()**
```typescript
const handleSubStepClick = (subStepId: string) => {
  const puntosAcuerdoIndex = config.steps.findIndex(s => s.id === 'puntos-acuerdo');
  
  // Navegar al paso correcto si no estamos ahí
  if (puntosAcuerdoIndex !== -1 && currentStepIndex !== puntosAcuerdoIndex) {
    setCurrentStepIndex(puntosAcuerdoIndex);
  }
  
  setCurrentSubStepId(subStepId);
};
```

---

## 📋 EJEMPLO DE CONFIGURACIÓN COMPLETA

```typescript
// Configuración para Junta de Accionistas
const juntaWizardConfig: FlujoWizardConfig = {
  title: "Crear Junta",
  icon: Users,
  modo: 'CREAR',
  steps: [
    {
      id: 'puntos-agenda',
      title: 'Puntos de Agenda',
      description: 'Selecciona los puntos a incluir en la junta',
      subSteps: []  // Sin sub-steps
    },
    {
      id: 'detalles',
      title: 'Detalles de la Junta',
      description: 'Completa la información de la junta',
      subSteps: []
    },
    {
      id: 'instalacion',
      title: 'Instalación de la Junta',
      description: 'Registra representante, asistencia y autoridades',
      subSteps: []
    },
    {
      id: 'puntos-acuerdo',
      title: 'Puntos de Acuerdo',
      description: 'Completa las acciones y decisiones adoptadas',
      subSteps: [  // ⭐ Sub-steps completos (se filtrarán dinámicamente)
        {
          id: 'aporte-dinerarios',
          title: 'Aportes dinerarios',
          category: 'Aumento de Capital'
        },
        {
          id: 'aporte-no-dinerarios',
          title: 'Aporte no dinerario',
          category: 'Aumento de Capital'
        },
        {
          id: 'capitalizacion-creditos',
          title: 'Capitalización de créditos',
          category: 'Aumento de Capital'
        },
        {
          id: 'remocion-gerente',
          title: 'Remoción de gerente general',
          category: 'Remoción'
        },
        {
          id: 'remocion-apoderados',
          title: 'Remoción de apoderados',
          category: 'Remoción'
        },
        {
          id: 'remocion-directores',
          title: 'Remoción de directores',
          category: 'Remoción'
        },
        {
          id: 'nombramiento-gerente',
          title: 'Nombramiento de gerente general',
          category: 'Nombramiento'
        },
        {
          id: 'nombramiento-apoderados',
          title: 'Nombramiento de apoderados',
          category: 'Nombramiento'
        },
        {
          id: 'nombramiento-directores',
          title: 'Nombramiento de directores',
          category: 'Nombramiento'
        },
        {
          id: 'nombramiento-nuevo-directorio',
          title: 'Nombramiento del nuevo directorio',
          category: 'Nombramiento'
        },
        {
          id: 'pronunciamiento-gestion',
          title: 'Pronunciamiento de la gestión social y resultados económicos',
          category: 'Gestión Social y Resultados Económicos'
        },
        {
          id: 'aplicacion-resultados',
          title: 'Aplicación de resultados',
          category: 'Gestión Social y Resultados Económicos'
        },
        {
          id: 'designacion-auditores',
          title: 'Designación y/o delegación en el directorio de la designación de auditores externos',
          category: 'Gestión Social y Resultados Económicos'
        }
      ]
    },
    {
      id: 'resumen',
      title: 'Resumen',
      description: 'Visualiza un resumen de los datos',
      subSteps: []
    },
    {
      id: 'documentos',
      title: 'Documentos Generados',
      description: 'Visualiza o descarga los documentos finales',
      subSteps: []
    }
  ],
  onBack: () => navigate('/juntas'),
  onComplete: (registroId) => {
    navigate(`/juntas/${registroId}`);
  }
};

// Uso
<FlujoWizardView config={juntaWizardConfig} />
```

---

## 🚀 CÓMO RECONSTRUIR EL SISTEMA

### **PASO 1: Crear DoubleWizardSidebar.tsx**

1. Copiar `/components/DoubleWizardSidebar.tsx`
2. Ajustar interfaces si es necesario
3. Personalizar lógica de agrupación de categorías

### **PASO 2: Crear WizardRightSidebar.tsx**

1. Copiar `/components/WizardRightSidebar.tsx`
2. Ajustar ancho si es necesario (default: 360px)
3. Personalizar empty state

### **PASO 3: Crear FlujoWizardView.tsx**

1. Copiar `/components/FlujoWizardView.tsx`
2. Configurar pasos en `config.steps`
3. Implementar `renderStepContent()` para cada paso
4. Conectar con FlujoStore

### **PASO 4: Configurar FlujoStore**

```typescript
// contexts/FlujoContext.tsx
const useFlujoStore = create<FlujoStore>((set, get) => ({
  selectedSubSteps: [],
  
  getDynamicSubSteps: () => get().selectedSubSteps,
  
  updateDynamicSubSteps: (subStepIds: string[]) => {
    set({ selectedSubSteps: subStepIds });
  }
}));
```

### **PASO 5: Conectar Paso 1 con Store**

```typescript
// En JuntaPuntosAgenda.tsx
const { updateDynamicSubSteps } = useFlujoStore();

const handleCheckboxChange = (pointId: string, checked: boolean) => {
  // Actualizar checkboxes locales
  const newPoints = checked 
    ? [...selectedPoints, pointId]
    : selectedPoints.filter(id => id !== pointId);
  
  setSelectedPoints(newPoints);
  
  // ⭐ Actualizar sub-steps dinámicos en Store
  updateDynamicSubSteps(newPoints);
};
```

### **PASO 6: Usar el Wizard**

```typescript
// En tu componente padre
import { FlujoWizardView } from './components/FlujoWizardView';

const juntaConfig = {
  title: "Crear Junta",
  icon: Users,
  steps: [...],
  onBack: () => navigate('/juntas'),
  onComplete: (id) => navigate(`/juntas/${id}`)
};

return <FlujoWizardView config={juntaConfig} />;
```

---

## ✅ CHECKLIST DE FUNCIONALIDADES

- ✅ Sidebar izquierdo con pasos principales
- ✅ Barra de progreso visual con porcentaje
- ✅ Estados de paso (current/completed/upcoming)
- ✅ Navegación entre pasos con click
- ✅ Sidebar derecho para sub-pasos (opcional)
- ✅ Sub-pasos agrupados por categoría
- ✅ Categorías colapsables (acordeones)
- ✅ Sub-steps dinámicos basados en selección de Paso 1
- ✅ Header con título y descripción del paso
- ✅ Botón "Salir" para abandonar wizard
- ✅ Botón "Guardar Cambios" (snapshot)
- ✅ Botón "Restablecer" (restaurar último guardado)
- ✅ Footer con navegación (Anterior/Siguiente)
- ✅ Indicador "Paso X de Y"
- ✅ Scroll independiente por área
- ✅ Responsive layout
- ✅ Animaciones de transición
- ✅ Toast notifications
- ✅ Modo CREAR/EDITAR/VER
- ✅ Integración con FlujoStore

---

## 🎓 CONCEPTOS CLAVE

### **1. SUB-STEPS DINÁMICOS**
Los sub-steps del Paso 4 se generan dinámicamente basados en las selecciones del Paso 1.

### **2. SNAPSHOT/RESTORE**
Sistema de guardado temporal que permite deshacer cambios sin perder el progreso guardado.

### **3. CATEGORÍAS AUTO-DETECTADAS**
Los sub-steps se agrupan automáticamente por categoría según palabras clave en el título.

### **4. NAVEGACIÓN CONDICIONAL**
Solo se puede navegar a pasos previos o al paso actual, no a pasos futuros.

### **5. ESTADO COMPARTIDO**
El estado global (FlujoStore) coordina la comunicación entre pasos distantes.

---

## 🐛 TROUBLESHOOTING

### **Problema: Sub-steps no aparecen en Paso 4**
**Solución:** Verificar que `updateDynamicSubSteps()` se llame en Paso 1 cuando cambian los checkboxes.

### **Problema: Sidebar derecho no se muestra**
**Solución:** Verificar que `currentSubStepId` esté definido y que el paso actual tenga `subSteps`.

### **Problema: Barra de progreso no avanza**
**Solución:** Verificar que `progress.current` se actualice correctamente con `currentStepIndex + 1`.

### **Problema: "Restablecer" no funciona**
**Solución:** Verificar que `handleSave()` se llame antes para crear un snapshot en `savedFormData`.

---

## 📚 ARCHIVOS RELACIONADOS

```
/components/
  ├── DoubleWizardSidebar.tsx       ⭐ Sidebar doble (izq + der)
  ├── SingleWizardSidebar.tsx       📝 Sidebar simple (solo izq)
  ├── WizardRightSidebar.tsx        📋 Sidebar derecho standalone
  ├── FlujoWizardView.tsx           🎯 Contenedor principal
  ├── WizardStepper.tsx             🔢 Stepper alternativo
  └── flujo-steps/
      ├── JuntaPuntosAgenda.tsx     📌 Paso 1 (define sub-steps)
      ├── JuntaDetalles.tsx         📄 Paso 2
      ├── JuntaInstalacion.tsx      🏛️ Paso 3
      ├── GenericSubStepFlow.tsx    🔄 Paso 4 (usa sub-steps dinámicos)
      ├── JuntaResumenFinal.tsx     📊 Paso 5
      └── DocumentosGenerados.tsx   📑 Paso 6

/contexts/
  └── FlujoContext.tsx              💾 Estado global (FlujoStore)

/types/
  └── flujos.types.ts               📐 Tipos TypeScript
```

---

## 🎯 MEJORAS FUTURAS

- [ ] Persistencia en localStorage/sessionStorage
- [ ] Validación de paso antes de avanzar
- [ ] Animaciones entre transiciones de pasos
- [ ] Modo oscuro (dark mode)
- [ ] Exportar progreso a PDF
- [ ] Atajos de teclado (Ctrl+S para guardar, etc.)
- [ ] Indicador de cambios no guardados
- [ ] Confirmación antes de salir con cambios pendientes
- [ ] Drag & drop para reordenar sub-steps
- [ ] Vista previa en tiempo real en sidebar derecho

---

## 👨‍💻 AUTOR

**Sistema creado para:** PROBO - Plataforma SaaS Legal  
**Módulo:** Juntas de Accionistas  
**Versión:** 1.0  
**Fecha:** 2024

---

## 📄 LICENCIA

Documentación interna - Todos los derechos reservados © PROBO

---

**🎉 ¡FIN DE LA DOCUMENTACIÓN!**

Para dudas o soporte, consultar al equipo de desarrollo.
