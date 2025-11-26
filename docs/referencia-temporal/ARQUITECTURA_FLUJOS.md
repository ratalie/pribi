# 🏗️ ARQUITECTURA DE FLUJOS - SISTEMA PROBO

## 📋 RESUMEN EJECUTIVO

Esta arquitectura permite gestionar completamente el ciclo de vida de los flujos (Sociedades, Juntas, Sucursales, Directorios) con las siguientes capacidades:

1. ✅ **CREAR** - Nuevo registro con wizard paso a paso
2. ✅ **EDITAR** - Cargar datos existentes en el wizard
3. ✅ **VISUALIZAR** - Vista de resumen sin progress bar (solo lectura)
4. ✅ **LISTAR** - Historial de todos los registros
5. ✅ **ELIMINAR** - Borrar registros

---

## 🗂️ ESTRUCTURA DE ARCHIVOS

```
/types/
  └── flujos.types.ts          # Definiciones TypeScript de todos los datos

/contexts/
  └── FlujoContext.tsx          # Context API para estado global

/components/
  ├── HistorialSociedades.tsx   # Lista de sociedades con acciones
  ├── VisualizarSociedad.tsx    # Vista resumen (solo lectura)
  ├── FlujoWizardView.tsx       # Wizard multi-paso (EXISTENTE)
  └── DocumentosGenerados.tsx   # Pantalla final de documentos

/data/
  └── mockData.ts               # Datos de ejemplo (EXISTENTE)
```

---

## 🔄 FLUJO DE NAVEGACIÓN

### 1️⃣ CREAR NUEVA SOCIEDAD

```
HistorialSociedades
  ↓ (click "Nueva Sociedad")
FlujoWizardView (modo: CREAR)
  ↓ (completa 10 pasos)
DocumentosGenerados
  ↓ (click "Ir a mis Sociedades")
HistorialSociedades
```

### 2️⃣ EDITAR SOCIEDAD EXISTENTE

```
HistorialSociedades
  ↓ (click menú → "Editar")
FlujoWizardView (modo: EDITAR, datos precargados)
  ↓ (modifica pasos)
DocumentosGenerados
  ↓ (click "Ir a mis Sociedades")
HistorialSociedades
```

### 3️⃣ VISUALIZAR SOCIEDAD

```
HistorialSociedades
  ↓ (click menú → "Visualizar")
VisualizarSociedad (resumen sin progress bar)
  ↓ (click "Editar" - opcional)
FlujoWizardView (modo: EDITAR)
```

---

## 📦 ESTRUCTURA DE DATOS

### Objeto Completo de Sociedad

```typescript
interface SociedadData {
  // Metadatos
  id: string;                    // "SOC-1732234567890"
  estado: EstadoFlujo;           // "COMPLETO" | "EN_PROCESO" | "BORRADOR"
  fechaCreacion: string;         // ISO 8601
  fechaModificacion: string;     // ISO 8601
  
  // Datos de los 10 pasos
  datosPrincipales?: DatosPrincipales;
  accionistas?: Accionista[];
  capitalAcciones?: CapitalAcciones;
  asignacionAcciones?: AsignacionAccion[];
  directorio?: Miembro[];
  apoderados?: Apoderado[];
  regimenFacultades?: RegimenFacultades;
  quorumsMayorias?: QuorumsMayorias;
  acuerdosSocietarios?: AcuerdoSocietario[];
  
  // Documentos generados
  documentosGenerados?: Documento[];
}
```

### Estados del Flujo

- **BORRADOR**: Se creó pero no se completó
- **EN_PROCESO**: Se está editando actualmente
- **COMPLETO**: Se finalizó y generó documentos

---

## 🔧 INTEGRACIÓN CON APP.TSX

### Paso 1: Envolver en Provider

```tsx
// App.tsx
import { FlujoProvider } from './contexts/FlujoContext';

function App() {
  return (
    <FlujoProvider>
      {/* Tu app aquí */}
    </FlujoProvider>
  );
}
```

### Paso 2: Controlar Navegación

```tsx
// App.tsx o componente principal de Sociedades
import { useState } from 'react';
import { HistorialSociedades } from './components/HistorialSociedades';
import { FlujoWizardView } from './components/FlujoWizardView';
import { VisualizarSociedad } from './components/VisualizarSociedad';
import { useFlujoStore } from './contexts/FlujoContext';

export function SociedadesModule() {
  const { modoActual, registroEnEdicion } = useFlujoStore();
  const [vista, setVista] = useState<'historial' | 'wizard' | 'visualizar'>('historial');

  // CASO 1: Mostrar Historial
  if (vista === 'historial') {
    return (
      <HistorialSociedades
        onCrearNueva={() => setVista('wizard')}
        onEditar={() => setVista('wizard')}
        onVisualizar={() => setVista('visualizar')}
      />
    );
  }

  // CASO 2: Mostrar Wizard (Crear o Editar)
  if (vista === 'wizard') {
    return (
      <FlujoWizardView
        modo={modoActual}
        registroId={registroEnEdicion || undefined}
        onComplete={() => setVista('historial')}
        onCancel={() => setVista('historial')}
      />
    );
  }

  // CASO 3: Visualizar Resumen
  if (vista === 'visualizar' && registroEnEdicion) {
    return (
      <VisualizarSociedad
        registroId={registroEnEdicion}
        onVolver={() => setVista('historial')}
        onEditar={() => setVista('wizard')}
      />
    );
  }

  return null;
}
```

---

## 🔨 MODIFICACIONES A COMPONENTES EXISTENTES

### 1. FlujoWizardView.tsx

**ANTES:**
```tsx
const [formData, setFormData] = useState({});
```

**DESPUÉS:**
```tsx
import { useFlujoStore } from '../contexts/FlujoContext';

export function FlujoWizardView({ modo, registroId }: WizardProps) {
  const { obtenerSociedad, crearSociedad, actualizarSociedad } = useFlujoStore();
  
  // Si es modo EDITAR, cargar datos existentes
  const sociedadExistente = modo === 'EDITAR' && registroId 
    ? obtenerSociedad(registroId) 
    : null;
  
  const [formData, setFormData] = useState(
    sociedadExistente ? {
      datosPrincipales: sociedadExistente.datosPrincipales,
      accionistas: sociedadExistente.accionistas,
      capitalAcciones: sociedadExistente.capitalAcciones,
      // ... resto de datos
    } : {}
  );
  
  // Al finalizar el wizard
  const handleComplete = () => {
    if (modo === 'EDITAR' && registroId) {
      actualizarSociedad(registroId, {
        ...formData,
        estado: 'COMPLETO'
      });
    } else {
      crearSociedad({
        ...formData,
        estado: 'COMPLETO'
      });
    }
  };
}
```

### 2. Cada Paso del Wizard

Los pasos NO necesitan cambios. Siguen recibiendo `formData` y `setFormData` como antes.

```tsx
// SociedadDatosPrincipales.tsx - SIN CAMBIOS
interface SociedadDatosPrincipalesProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function SociedadDatosPrincipales({ formData, setFormData }: ...) {
  // Funciona exactamente igual
}
```

---

## 📊 CASOS DE USO

### Caso A: Usuario crea nueva sociedad

1. Usuario hace click en "Nueva Sociedad"
2. `setModo('CREAR')` + `setRegistroEnEdicion(null)`
3. Se muestra `FlujoWizardView` con datos vacíos
4. Usuario completa los 10 pasos
5. Al finalizar: `crearSociedad(formData)`
6. Se genera ID: `SOC-1732234567890`
7. Se guarda en el store
8. Se muestra `DocumentosGenerados`
9. Usuario vuelve al historial

### Caso B: Usuario edita sociedad existente

1. Usuario hace click en menú → "Editar" de la sociedad `SOC-123`
2. `setModo('EDITAR')` + `setRegistroEnEdicion('SOC-123')`
3. Se muestra `FlujoWizardView` con datos precargados
4. Usuario modifica el paso 6 (Apoderados)
5. Al finalizar: `actualizarSociedad('SOC-123', formData)`
6. Se actualiza `fechaModificacion`
7. Se muestra `DocumentosGenerados` (con opción "Ver documentos actuales")
8. Usuario vuelve al historial

### Caso C: Usuario visualiza sociedad

1. Usuario hace click en menú → "Visualizar" de la sociedad `SOC-123`
2. `setModo('VISUALIZAR')` + `setRegistroEnEdicion('SOC-123')`
3. Se muestra `VisualizarSociedad` (resumen sin progress bar)
4. Usuario puede ver todos los datos en formato resumen
5. Si hace click en "Editar", va al `FlujoWizardView` en modo EDITAR

---

## 🎯 BENEFICIOS DE ESTA ARQUITECTURA

✅ **Separación de Responsabilidades**
- `FlujoContext`: Manejo de estado global
- `HistorialSociedades`: Listado y acciones
- `FlujoWizardView`: Crear/Editar
- `VisualizarSociedad`: Solo lectura

✅ **Reutilización**
- Mismo wizard para crear y editar
- Mismo store para todos los flujos

✅ **Escalabilidad**
- Agregar Juntas/Sucursales/Directorios es copiar la estructura
- Fácil agregar nuevos pasos al wizard

✅ **Persistencia**
- Context mantiene datos en memoria
- Fácil migrar a localStorage/Supabase después

✅ **Type Safety**
- TypeScript en todos los datos
- IntelliSense completo

---

## 🚀 PRÓXIMOS PASOS

### Fase 1: Implementación Base ✅
- [x] Tipos de datos
- [x] Context API
- [x] Historial de Sociedades
- [x] Visualizar Sociedad
- [ ] Integrar con FlujoWizardView

### Fase 2: Persistencia
- [ ] Guardar en localStorage
- [ ] Sincronizar con Supabase

### Fase 3: Otros Flujos
- [ ] Historial de Juntas
- [ ] Historial de Sucursales
- [ ] Historial de Directorios

### Fase 4: Funcionalidades Avanzadas
- [ ] Búsqueda y filtros
- [ ] Exportar a PDF
- [ ] Duplicar registros
- [ ] Historial de cambios (audit log)

---

## 🔍 EJEMPLO COMPLETO DE INTEGRACIÓN

```tsx
// App.tsx
import { useState } from 'react';
import { FlujoProvider, useFlujoStore } from './contexts/FlujoContext';
import { HistorialSociedades } from './components/HistorialSociedades';
import { FlujoWizardView } from './components/FlujoWizardView';
import { VisualizarSociedad } from './components/VisualizarSociedad';

function SociedadesApp() {
  const { modoActual, registroEnEdicion } = useFlujoStore();
  const [vista, setVista] = useState<'historial' | 'wizard' | 'visualizar'>('historial');

  if (vista === 'historial') {
    return (
      <HistorialSociedades
        onCrearNueva={() => setVista('wizard')}
        onEditar={() => setVista('wizard')}
        onVisualizar={() => setVista('visualizar')}
      />
    );
  }

  if (vista === 'wizard') {
    return (
      <FlujoWizardView
        modo={modoActual}
        registroId={registroEnEdicion || undefined}
        onComplete={() => setVista('historial')}
        onCancel={() => setVista('historial')}
      />
    );
  }

  if (vista === 'visualizar' && registroEnEdicion) {
    return (
      <VisualizarSociedad
        registroId={registroEnEdicion}
        onVolver={() => setVista('historial')}
        onEditar={() => setVista('wizard')}
      />
    );
  }

  return null;
}

export default function App() {
  return (
    <FlujoProvider>
      <SociedadesApp />
    </FlujoProvider>
  );
}
```

---

## 📝 NOTAS IMPORTANTES

1. **Mock Data Inicial**: Puedes usar `generarSociedadMock()` para crear datos de prueba
2. **Estado del Flujo**: El estado se actualiza automáticamente (BORRADOR → EN_PROCESO → COMPLETO)
3. **Documentos Generados**: Se adjuntan al objeto cuando se completa el flujo
4. **Fechas**: Usar formato ISO 8601 para facilitar ordenamiento
5. **IDs**: Usar prefijo según tipo (SOC-, JUN-, SUC-, DIR-)

---

¿Preguntas o dudas sobre la arquitectura? ¡Estoy aquí para ayudarte! 🚀
