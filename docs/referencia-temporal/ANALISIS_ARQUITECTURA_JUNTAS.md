# 🔍 ANÁLISIS COMPLETO DE ARQUITECTURA DE JUNTAS

## 📊 RESUMEN EJECUTIVO

He estudiado **TODOS** los componentes actuales de Juntas. Aquí está el análisis completo antes de implementar el código.

---

## 1️⃣ PASO 2: DETALLES DE LA JUNTA (ACTUAL)

### **ESTADO ACTUAL:**
✅ **Componente bien estructurado**
✅ **Lógica de negocio correcta**
❌ **NO tiene mock data**
❌ **NO sigue patrón de sincronización de Sociedades**

### **ESTRUCTURA:**

```typescript
/components/flujo-steps/JuntaDetalles.tsx

┌─────────────────────────────────────────────┐
│  TOGGLE: Tipo de Junta                      │
│  [ Junta Universal ]  [ Junta General ]     │
├─────────────────────────────────────────────┤
│  SI UNIVERSAL:                              │
│    - Toggle modalidad (Presencial/Virtual)  │
│    - Dirección O Link (según modalidad)     │
│    - Fecha                                  │
│    - Hora                                   │
├─────────────────────────────────────────────┤
│  SI GENERAL:                                │
│    ┌─────────────────────────────────────┐  │
│    │ PRIMERA CONVOCATORIA               │  │
│    │ - Toggle modalidad                 │  │
│    │ - Dirección O Link                 │  │
│    │ - Fecha                            │  │
│    │ - Hora                             │  │
│    │ ℹ️ Plazo: 30-3 días calendarios    │  │
│    └─────────────────────────────────────┘  │
│                                             │
│    ┌─────────────────────────────────────┐  │
│    │ SEGUNDA CONVOCATORIA               │  │
│    │ - Toggle modalidad                 │  │
│    │ - Dirección O Link                 │  │
│    │ - Fecha                            │  │
│    │ - Hora                             │  │
│    │ ℹ️ Plazo: 30-3 días calendarios    │  │
│    └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### **CAMPOS DEL FORMULARIO:**

**Junta Universal:**
- `modalidadUniversal`: 'presencial' | 'virtual'
- `direccionUniversal`: string (si presencial)
- `linkUniversal`: string (si virtual)
- `fechaUniversal`: string
- `horaUniversal`: string

**Junta General:**
- `modalidadPrimera`: 'presencial' | 'virtual'
- `direccionPrimera`: string
- `linkPrimera`: string
- `fechaPrimera`: string
- `horaPrimera`: string
- `modalidadSegunda`: 'presencial' | 'virtual'
- `direccionSegunda`: string
- `linkSegunda`: string
- `fechaSegunda`: string
- `horaSegunda`: string

### **PATRÓN ACTUAL:**
```typescript
// ❌ NO sigue patrón de Sociedades
const updateField = (field: string, value: any) => {
  setFormData({
    ...formData,
    [field]: value
  });
};
```

### **LO QUE NECESITA:**
1. ✅ Mock data prellenada
2. ✅ Estado local con `useState`
3. ✅ `useEffect` para sincronización en mount
4. ✅ Agrupar en secciones lógicas (ya está bien estructurado)

---

## 2️⃣ PASO 3: INSTALACIÓN DE LA JUNTA (ACTUAL)

### **ESTADO ACTUAL:**
✅ **Componente MUY complejo**
✅ **Tiene mock data (ACCIONISTAS_MOCK)**
✅ **Lógica de negocio avanzada**
❌ **NO sigue patrón de sincronización de Sociedades**
❌ **Mock data hardcodeada dentro del componente**

### **ESTRUCTURA:**

```typescript
/components/flujo-steps/JuntaInstalacion.tsx

┌───────────────────────────────────────────────┐
│  SI JUNTA GENERAL:                            │
│  ┌─────────────────────────────────────────┐  │
│  │ Detalles de Celebración                │  │
│  │ - Select: Primera/Segunda Convocatoria │  │
│  │ - Dirección (auto-completada)          │  │
│  │ - Fecha (auto-completada)              │  │
│  │ - Hora (auto-completada)               │  │
│  └─────────────────────────────────────────┘  │
├───────────────────────────────────────────────┤
│  TABLA DE ASISTENCIA Y REPRESENTACIÓN         │
│  ┌─────────────────────────────────────────┐  │
│  │ ☑️ | Nombre | Tipo | Acciones | % |    │  │
│  │    | Representante | [+ Agregar]       │  │
│  ├─────────────────────────────────────────┤  │
│  │ ☑️ Ana María | Natural | 100 | 20% | - │  │
│  │ ☑️ Inversiones | Jurídica | 200 | 40% │  │
│  │    [Yuli Timoteo] [ℹ️] [⋮]             │  │
│  │ ☑️ Sucursal | Jurídica | 50 | 10% |    │  │
│  │    [José Matías] [ℹ️] [⋮]              │  │
│  │ ☐ Sucesión | Jurídica | 50 | 10% |     │  │
│  │    Requiere representante [+ Agregar]  │  │
│  │ ☑️ Fideicomiso | Jurídica | 100 | 20% │  │
│  │    [Representante] [ℹ️] [⋮]            │  │
│  ├─────────────────────────────────────────┤  │
│  │ TOTAL: 450 acciones | 90%             │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Barra de Progreso: 90% (450/500)            │
├───────────────────────────────────────────────┤
│  PRESIDENTE Y SECRETARIO                      │
│  ┌─────────────────────────────────────────┐  │
│  │ Presidente: [SI/NO Toggle]             │  │
│  │ SI: [Select: Ana María Gómez Torres]   │  │
│  │                                        │  │
│  │ Secretario: [SI/NO Toggle]             │  │
│  │ NO: (sin select)                       │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

### **LÓGICA COMPLEJA:**

**1. Auto-completado desde Paso 2:**
```typescript
useEffect(() => {
  if (tipoJunta === 'general' && convocatoriaSeleccionada) {
    const prefix = convocatoriaSeleccionada === 'primera' ? 'Primera' : 'Segunda';
    const modalidad = formData[`modalidad${prefix}`];
    
    setDetallesCelebracion({
      direccion: modalidad === 'presencial' 
        ? formData[`direccion${prefix}`]
        : formData[`link${prefix}`],
      fecha: formData[`fecha${prefix}`],
      hora: formData[`hora${prefix}`]
    });
  }
}, [convocatoriaSeleccionada, tipoJunta, formData]);
```

**2. Junta Universal vs General:**
- **Universal**: Todos asisten automáticamente (checkboxes disabled)
- **General**: Marcar manualmente la asistencia

**3. Reglas de Asistencia:**
- **Natural**: Puede asistir directamente
- **Jurídica**: Necesita representante asignado ANTES de poder asistir
- **Checkbox disabled** si no cumple requisitos

**4. Cálculos Automáticos:**
- Total de acciones presentes
- Porcentaje de asistencia
- Barra de progreso visual

**5. Presidente/Secretario:**
- Solo pueden ser elegidos de los asistentes
- Si es jurídica, se muestra el nombre del representante en el select

### **DATOS DEL FORMULARIO:**

```typescript
interface FormData {
  // Tipo y convocatoria
  tipoJunta: 'universal' | 'general';
  convocatoriaSeleccionada: 'primera' | 'segunda';
  
  // Asistencias (key = accionistaId, value = boolean)
  asistencias: { [key: string]: boolean };
  
  // Representantes (key = accionistaId, value = nombre representante)
  representantes: { [key: string]: string };
  
  // Autoridades
  presidenteAsistio: boolean;
  presidenteId: string; // ID del accionista o representante
  secretarioAsistio: boolean;
  secretarioId: string;
}
```

### **LO QUE NECESITA:**
1. ✅ Mover mock data a archivo separado (`/data/mockInstalacion.ts`)
2. ✅ Aplicar patrón de sincronización de Sociedades
3. ✅ Mantener toda la lógica compleja (está bien diseñada)

---

## 3️⃣ SIDEBAR DINÁMICO (SingleWizardSidebar)

### **CÓMO FUNCIONA ACTUALMENTE:**

```typescript
/components/SingleWizardSidebar.tsx

interface WizardStep {
  id: string;
  title: string;
  status: 'current' | 'upcoming' | 'completed';
  subSteps?: WizardSubStep[]; // ⭐ SUB-STEPS ESTÁTICOS
}

// Los sub-steps vienen HARDCODEADOS desde flujoSteps.ts
```

### **PROBLEMA:**
```typescript
// En /data/flujoSteps.ts
export const juntaSteps: WizardStep[] = [
  // ...
  {
    id: 'puntos-acuerdo',
    title: 'Puntos de Acuerdo',
    subSteps: [
      // ❌ TODOS los sub-steps hardcodeados
      { id: 'aporte-dinerarios', ... },
      { id: 'remocion-gerente', ... },
      { id: 'nombramiento-gerente', ... },
      // ... 13 sub-steps en total
    ]
  }
];
```

### **LO QUE NECESITAMOS:**

```typescript
// ✅ SUB-STEPS DINÁMICOS generados desde Paso 1

// 1. Paso 1 guarda puntos seleccionados
formData.puntosAgenda = ['aporte-dinerarios', 'remocion-gerente'];

// 2. FlujoStore almacena
dynamicSubSteps = ['aporte-dinerarios', 'remocion-gerente'];

// 3. FlujoWizardView filtra sub-steps
const filteredSubSteps = allSubSteps.filter(sub => 
  dynamicSubSteps.includes(sub.id)
);

// 4. SingleWizardSidebar renderiza SOLO los filtrados
{
  id: 'puntos-acuerdo',
  subSteps: filteredSubSteps // ⭐ DINÁMICO
}
```

---

## 🎯 PLAN DE IMPLEMENTACIÓN

### **FASE 1: COMPLETAR LÓGICA DE SIDEBARS DINÁMICOS** ⭐ CRÍTICO

**Objetivo:** Conectar FlujoStore con FlujoWizardView para que los sub-steps aparezcan/desaparezcan según Paso 1.

**Archivos a modificar:**
1. `/components/FlujoWizardView.tsx`
   - Leer `getDynamicSubSteps()` desde FlujoStore
   - Filtrar sub-steps del Paso 4
   - Pasar a SingleWizardSidebar

**Código:**
```typescript
// En FlujoWizardView.tsx
const { getDynamicSubSteps } = useFlujoStore();
const dynamicSubSteps = getDynamicSubSteps?.() || [];

// Filtrar pasos
const stepsWithDynamicSubSteps = config.steps.map(step => {
  if (step.id === 'puntos-acuerdo' && step.subSteps) {
    return {
      ...step,
      subSteps: step.subSteps.filter(sub => 
        dynamicSubSteps.includes(sub.id)
      )
    };
  }
  return step;
});

// Pasar a sidebar
<SingleWizardSidebar steps={stepsWithDynamicSubSteps} ... />
```

---

### **FASE 2: CREAR MOCK DATA PARA PASO 2**

**Objetivo:** Prelleno automático de Detalles de la Junta.

**Archivo a crear:**
```typescript
// /data/mockDetallesJunta.ts

export const MOCK_DETALLES_JUNTA = {
  tipoJunta: 'general', // 'universal' | 'general'
  
  // Junta Universal
  modalidadUniversal: 'presencial',
  direccionUniversal: 'Av. Larco 1234, Of. 501, Miraflores, Lima',
  linkUniversal: '',
  fechaUniversal: '2024-12-15',
  horaUniversal: '10:00',
  
  // Junta General - Primera Convocatoria
  modalidadPrimera: 'presencial',
  direccionPrimera: 'Av. Larco 1234, Of. 501, Miraflores, Lima',
  linkPrimera: '',
  fechaPrimera: '2024-12-15',
  horaPrimera: '10:00',
  
  // Junta General - Segunda Convocatoria
  modalidadSegunda: 'virtual',
  direccionSegunda: '',
  linkSegunda: 'https://meet.google.com/abc-defg-hij',
  fechaSegunda: '2024-12-22',
  horaSegunda: '15:00'
};
```

---

### **FASE 3: REFACTORIZAR PASO 2**

**Objetivo:** Aplicar patrón de Sociedades.

**Archivo a modificar:**
```typescript
// /components/flujo-steps/JuntaDetallesNew.tsx

export function JuntaDetallesNew({ formData, setFormData }) {
  // 1. Inicialización con mock
  const getInitialData = () => {
    if (formData.detallesJunta && Object.keys(formData.detallesJunta).length > 0) {
      return formData.detallesJunta;
    }
    return MOCK_DETALLES_JUNTA;
  };

  const [localData, setLocalData] = useState(getInitialData);

  // 2. Sincronización en mount
  useEffect(() => {
    if (!formData.detallesJunta || Object.keys(formData.detallesJunta).length === 0) {
      setFormData({ ...formData, detallesJunta: localData });
    }
  }, []);

  // 3. Actualización
  const updateField = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    setFormData({ ...formData, detallesJunta: newData });
  };

  // ... resto del componente (mantener toda la lógica de UI)
}
```

---

### **FASE 4: CREAR MOCK DATA PARA PASO 3**

**Objetivo:** Separar mock data del componente.

**Archivo a crear:**
```typescript
// /data/mockInstalacion.ts

export interface Accionista {
  id: string;
  nombre: string;
  tipo: 'natural' | 'juridica';
  acciones: number;
  porcentaje: number;
}

export const MOCK_ACCIONISTAS: Accionista[] = [
  { 
    id: '1', 
    nombre: 'Ana María Gómez Torres', 
    tipo: 'natural', 
    acciones: 100, 
    porcentaje: 20.00 
  },
  { 
    id: '2', 
    nombre: 'Inversiones del Sur S.A.C.', 
    tipo: 'juridica', 
    acciones: 200, 
    porcentaje: 40.00 
  },
  { 
    id: '3', 
    nombre: 'Sucursal Arequipa - Inversiones del Sur S.A.C.', 
    tipo: 'juridica', 
    acciones: 50, 
    porcentaje: 10.00 
  },
  { 
    id: '4', 
    nombre: 'Sucesión indivisa de Maria Teresa Vega', 
    tipo: 'juridica', 
    acciones: 50, 
    porcentaje: 10.00 
  },
  { 
    id: '5', 
    nombre: 'Fideicomiso "Inversión Inmobiliaria Los Alamos"', 
    tipo: 'juridica', 
    acciones: 100, 
    porcentaje: 20.00 
  }
];

export const MOCK_INSTALACION = {
  // Convocatoria
  convocatoriaSeleccionada: 'primera',
  
  // Asistencias (en junta universal, todos asisten)
  asistencias: {
    '1': true,
    '2': true,
    '3': true,
    '4': false,
    '5': true
  },
  
  // Representantes
  representantes: {
    '2': 'Yuli Timoteo Zambrano',
    '3': 'José Matías Ricas',
    '5': 'Roberto Pérez Gómez'
  },
  
  // Autoridades
  presidenteAsistio: true,
  presidenteId: '1',
  secretarioAsistio: false,
  secretarioId: ''
};
```

---

### **FASE 5: REFACTORIZAR PASO 3**

**Objetivo:** Aplicar patrón de Sociedades (pero mantener toda la lógica compleja).

**Archivo a modificar:**
```typescript
// /components/flujo-steps/JuntaInstalacionNew.tsx

import { MOCK_ACCIONISTAS, MOCK_INSTALACION } from '../../data/mockInstalacion';

export function JuntaInstalacionNew({ formData, setFormData }) {
  const tipoJunta = formData.tipoJunta || 'general';
  
  // 1. Inicialización con mock
  const getInitialAsistencias = () => {
    if (formData.asistencias) {
      return formData.asistencias;
    }
    // Si es junta universal, todos asisten
    if (tipoJunta === 'universal') {
      return MOCK_ACCIONISTAS.reduce((acc, item) => 
        ({ ...acc, [item.id]: true }), {}
      );
    }
    return MOCK_INSTALACION.asistencias;
  };

  const [asistencias, setAsistencias] = useState(getInitialAsistencias);
  const [representantes, setRepresentantes] = useState(
    formData.representantes || MOCK_INSTALACION.representantes
  );
  const [presidenteAsistio, setPresidenteAsistio] = useState(
    formData.presidenteAsistio !== false
  );
  // ... resto de estados

  // 2. Sincronización en mount
  useEffect(() => {
    if (!formData.asistencias) {
      setFormData({
        ...formData,
        asistencias,
        representantes,
        presidenteAsistio,
        presidenteId,
        secretarioAsistio,
        secretarioId
      });
    }
  }, []);

  // 3. Mantener TODA la lógica compleja existente
  // - Auto-completado desde Paso 2
  // - Reglas de asistencia
  // - Cálculos automáticos
  // - etc.

  // ... resto del componente
}
```

---

## 📊 PRIORIDADES

### **AHORA MISMO (LO MÁS CRÍTICO):**

1. **✅ Conectar sidebars dinámicos**
   - Modificar FlujoWizardView para filtrar sub-steps
   - Verificar que aparecen/desaparecen según Paso 1

### **DESPUÉS:**

2. **✅ Crear mock data para Paso 2**
3. **✅ Refactorizar Paso 2 con patrón de Sociedades**
4. **✅ Crear mock data para Paso 3**
5. **✅ Refactorizar Paso 3 con patrón de Sociedades**

---

## 🎯 DECISIONES CLAVE

### **1. ¿Crear archivos New o modificar existentes?**
**RESPUESTA:** Crear archivos `New` (como hicimos con Paso 1).
- Mantener componentes originales como backup
- Seguir nomenclatura `JuntaDetallesNew.tsx`, `JuntaInstalacionNew.tsx`

### **2. ¿Mantener lógica compleja del Paso 3?**
**RESPUESTA:** **SÍ, MANTENER TODO**.
- La lógica de asistencias es correcta
- El auto-completado es útil
- Solo cambiar patrón de sincronización

### **3. ¿Qué hacer con los sub-steps hardcodeados?**
**RESPUESTA:** Mantenerlos en `flujoSteps.ts` pero filtrarlos dinámicamente.
- No eliminar la definición completa
- Filtrar en FlujoWizardView según `dynamicSubSteps`

---

## ✅ SIGUIENTE PASO INMEDIATO

**IMPLEMENTAR CONEXIÓN DE SIDEBARS DINÁMICOS:**

Modificar `/components/FlujoWizardView.tsx` para:
1. Leer `getDynamicSubSteps()` desde FlujoStore
2. Filtrar sub-steps del Paso 4
3. Pasar a SingleWizardSidebar

**Resultado esperado:**
- Paso 1: Seleccionar 3 puntos
- Paso 4: Ver SOLO esos 3 puntos en sidebar
- Deseleccionar 1 punto en Paso 1
- Paso 4: Ver SOLO 2 puntos restantes

---

¿Listo para implementar mi rey? 🚀💜
