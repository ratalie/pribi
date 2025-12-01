# 📊 DOCUMENTACIÓN TÉCNICA: FLUJO DE NAVEGACIÓN DE JUNTAS

**Fecha:** 1 de Diciembre 2025  
**Autor:** Asistente IA  
**Para:** Arquitectura DDD Hexagonal  
**Componente:** DocumentosGeneradosView.tsx

---

## 🎯 OBJETIVO

Documentar el flujo completo de navegación jerárquica para juntas, explicando:
- Variables de estado involucradas
- Cómo se obtienen los datos del snapshot
- Estructura de datos
- Flujo de navegación paso a paso
- Cómo se extrae la información de una junta específica

---

## 📐 ARQUITECTURA GENERAL

### **Patrón de Navegación:**

```
ESTADO (currentPath) → LÓGICA (getCurrentData) → VISTA (folders/files)
         ↓                        ↓                        ↓
   Array de IDs          Obtiene snapshot           Renderiza UI
```

### **Flujo de Datos:**

```typescript
// 1. ESTADO
const [currentPath, setCurrentPath] = useState<string[]>([]);
// currentPath = ['operaciones', 'junta-accionistas', 'junta-1']
//                    ↓                ↓                  ↓
//                  Nivel 1         Nivel 2           Nivel 3

// 2. SNAPSHOT (Fuente de datos)
import { documentosGenerados } from '../../data/mockDataRepository';

// 3. EXTRACCIÓN
const getCurrentData = () => {
  // Lógica que lee currentPath y retorna datos del snapshot
};

// 4. VISTA
const { folders, files } = getCurrentData();
```

---

## 🗂️ ESTRUCTURA DE DATOS (SNAPSHOT)

### **Interfaz de Junta:**

```typescript
interface Junta {
  id: string;              // Identificador único
  name: string;            // Nombre visible
  descripcion: string;     // Descripción de la junta
  fecha: Date;             // Fecha de realización
  documentos: Documento[]; // Array de documentos de la junta
}
```

### **Datos del Snapshot (mockDataRepository.ts):**

```typescript
export const documentosGenerados = {
  registros: {
    sociedades: { /* ... */ },
    sucursales: [ /* ... */ ]
  },
  operaciones: {
    juntaAccionistas: {
      juntas: [
        {
          id: 'junta-1',
          name: 'Junta de Accionistas del 13/12/2024',
          descripcion: 'Junta Anual del 2024',
          fecha: new Date('2024-12-13'),
          documentos: [
            {
              id: 'dg-j-1-1',
              name: 'Acta Junta Ordinaria',
              type: 'pdf',
              dateCreated: new Date('2024-12-13'),
              size: 298000,
              folderId: 'junta-1'
            },
            {
              id: 'dg-j-1-2',
              name: 'Citación y Agenda',
              type: 'pdf',
              dateCreated: new Date('2024-12-10'),
              size: 145000,
              folderId: 'junta-1'
            }
          ]
        },
        {
          id: 'junta-2',
          name: 'Junta de Accionistas del 20/11/2024',
          descripcion: 'Junta Extraordinaria',
          fecha: new Date('2024-11-20'),
          documentos: [
            {
              id: 'dg-j-2-1',
              name: 'Acta Junta Extraordinaria',
              type: 'pdf',
              dateCreated: new Date('2024-11-20'),
              size: 312000,
              folderId: 'junta-2'
            }
          ]
        },
        {
          id: 'junta-3',
          name: 'Junta de Accionistas del 05/10/2024',
          descripcion: 'Junta Ordinaria del Q3',
          fecha: new Date('2024-10-05'),
          documentos: [
            {
              id: 'dg-j-3-1',
              name: 'Acta Junta Ordinaria Q3',
              type: 'pdf',
              dateCreated: new Date('2024-10-05'),
              size: 287000,
              folderId: 'junta-3'
            }
          ]
        }
      ]
    },
    directorio: [ /* ... */ ]
  }
};
```

### **Diagrama de Estructura:**

```
documentosGenerados
├── registros
│   ├── sociedades
│   └── sucursales
└── operaciones
    ├── juntaAccionistas
    │   └── juntas: Array<Junta>
    │       ├── [0] junta-1 (13/12/2024)
    │       │   └── documentos: [Acta, Citación]
    │       ├── [1] junta-2 (20/11/2024)
    │       │   └── documentos: [Acta]
    │       └── [2] junta-3 (05/10/2024)
    │           └── documentos: [Acta Q3]
    └── directorio
```

---

## 🔄 VARIABLES DE ESTADO

### **1. currentPath (Array de Strings)**

**Propósito:** Mantener el historial de navegación jerárquica.

**Tipo:**
```typescript
const [currentPath, setCurrentPath] = useState<string[]>([]);
```

**Estados Posibles:**

```typescript
// NIVEL 0: Raíz
currentPath = []
// Vista: [Registros, Operaciones]

// NIVEL 1: Dentro de Operaciones
currentPath = ['operaciones']
// Vista: [Junta de Accionistas, Directorio]

// NIVEL 2: Dentro de Junta de Accionistas
currentPath = ['operaciones', 'junta-accionistas']
// Vista: [Junta del 13/12/2024, Junta del 20/11/2024, Junta del 05/10/2024]

// NIVEL 3: Dentro de una Junta Específica
currentPath = ['operaciones', 'junta-accionistas', 'junta-1']
// Vista: [Acta Junta Ordinaria, Citación y Agenda]
```

### **2. juntaInfo (Objeto o Null)**

**Propósito:** Almacenar información de la junta cuando se muestra el modal de un documento.

**Tipo:**
```typescript
interface JuntaInfo {
  nombre: string;       // "Junta de Accionistas del 13/12/2024"
  fecha: string;        // "Junta Anual del 2024"
  descripcion: string;  // "Documentos generados de la Junta..."
  sociedad: string;     // "Tech Innovations SpA"
}

const [juntaInfo, setJuntaInfo] = useState<JuntaInfo | null>(null);
```

**Estados Posibles:**

```typescript
// Estado inicial o fuera de contexto de junta
juntaInfo = null

// Cuando se abre el modal de un documento de junta
juntaInfo = {
  nombre: 'Junta de Accionistas del 13/12/2024',
  fecha: 'Junta Anual del 2024',
  descripcion: 'Documentos generados de la Junta de Accionistas del 13/12/2024',
  sociedad: 'Tech Innovations SpA'
}
```

### **3. selectedDocument (Objeto o Null)**

**Propósito:** Almacenar el documento seleccionado para mostrar en el modal.

**Tipo:**
```typescript
const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
```

### **4. infoModalOpen (Boolean)**

**Propósito:** Controlar la visibilidad del modal de información.

**Tipo:**
```typescript
const [infoModalOpen, setInfoModalOpen] = useState(false);
```

---

## 🎬 FLUJO COMPLETO DE NAVEGACIÓN (PASO A PASO)

### **ESCENARIO 1: Lista de Juntas → Detalles de Junta Específica**

#### **PASO 1: Usuario en Raíz**

**Estado:**
```typescript
currentPath = []
```

**Vista Renderizada:**
```
📁 Registros
📁 Operaciones
```

**Código de Obtención:**
```typescript
const getCurrentData = () => {
  if (currentPath.length === 0) {
    // ✅ NIVEL RAÍZ
    return {
      folders: [
        { id: 'registros', name: 'Registros', type: 'folder' },
        { id: 'operaciones', name: 'Operaciones', type: 'folder' }
      ],
      files: []
    };
  }
  // ...
}
```

---

#### **PASO 2: Click en "Operaciones"**

**Acción del Usuario:**
```typescript
// Al hacer click en la carpeta "Operaciones"
onClick={() => navigateToFolder('operaciones')}
```

**Función Ejecutada:**
```typescript
const navigateToFolder = (folderId: string) => {
  setCurrentPath([...currentPath, folderId]);
  // currentPath cambia de [] a ['operaciones']
};
```

**Nuevo Estado:**
```typescript
currentPath = ['operaciones']
```

**Vista Renderizada:**
```
📁 Junta de Accionistas
📁 Directorio
```

**Código de Obtención:**
```typescript
const getCurrentData = () => {
  // ...
  
  if (currentPath[0] === 'operaciones' && currentPath.length === 1) {
    // ✅ NIVEL 1: Dentro de Operaciones
    return {
      folders: [
        { id: 'junta-accionistas', name: 'Junta de Accionistas', type: 'folder' },
        { id: 'directorio', name: 'Directorio', type: 'folder' }
      ],
      files: []
    };
  }
  
  // ...
}
```

---

#### **PASO 3: Click en "Junta de Accionistas"**

**Acción del Usuario:**
```typescript
onClick={() => navigateToFolder('junta-accionistas')}
```

**Función Ejecutada:**
```typescript
const navigateToFolder = (folderId: string) => {
  setCurrentPath([...currentPath, folderId]);
  // currentPath cambia de ['operaciones'] a ['operaciones', 'junta-accionistas']
};
```

**Nuevo Estado:**
```typescript
currentPath = ['operaciones', 'junta-accionistas']
```

**Vista Renderizada:**
```
📁 Junta de Accionistas del 13/12/2024
📁 Junta de Accionistas del 20/11/2024
📁 Junta de Accionistas del 05/10/2024
```

**Código de Obtención:**
```typescript
const getCurrentData = () => {
  // ...
  
  if (currentPath[0] === 'operaciones' && 
      currentPath[1] === 'junta-accionistas' && 
      currentPath.length === 2) {
    // ✅ NIVEL 2: Lista de Juntas
    
    // OBTENCIÓN DEL SNAPSHOT:
    return {
      folders: documentosGenerados.operaciones.juntaAccionistas.juntas.map(junta => ({
        id: junta.id,              // 'junta-1', 'junta-2', 'junta-3'
        name: junta.name,          // 'Junta de Accionistas del 13/12/2024'
        type: 'folder',
        descripcion: junta.descripcion  // 'Junta Anual del 2024'
      })),
      files: []
    };
  }
  
  // ...
}
```

**Detalle de Extracción:**
```typescript
// SNAPSHOT ORIGINAL:
documentosGenerados.operaciones.juntaAccionistas.juntas
// = [
//     { id: 'junta-1', name: 'Junta del 13/12/2024', ... },
//     { id: 'junta-2', name: 'Junta del 20/11/2024', ... },
//     { id: 'junta-3', name: 'Junta del 05/10/2024', ... }
//   ]

// TRANSFORMACIÓN con .map():
juntas.map(junta => ({
  id: junta.id,
  name: junta.name,
  type: 'folder',
  descripcion: junta.descripcion
}))

// RESULTADO:
// [
//   { id: 'junta-1', name: 'Junta del 13/12/2024', type: 'folder', descripcion: '...' },
//   { id: 'junta-2', name: 'Junta del 20/11/2024', type: 'folder', descripcion: '...' },
//   { id: 'junta-3', name: 'Junta del 05/10/2024', type: 'folder', descripcion: '...' }
// ]
```

---

#### **PASO 4: Click en "Junta del 13/12/2024"**

**Acción del Usuario:**
```typescript
onClick={() => navigateToFolder('junta-1')}
```

**Función Ejecutada:**
```typescript
const navigateToFolder = (folderId: string) => {
  setCurrentPath([...currentPath, folderId]);
  // currentPath cambia de ['operaciones', 'junta-accionistas'] 
  // a ['operaciones', 'junta-accionistas', 'junta-1']
};
```

**Nuevo Estado:**
```typescript
currentPath = ['operaciones', 'junta-accionistas', 'junta-1']
//                  ↓                ↓                  ↓
//              Nivel 1          Nivel 2           Nivel 3
//            (Operaciones) (Junta Accionistas)  (ID Junta)
```

**Vista Renderizada:**
```
📄 Acta Junta Ordinaria
📄 Citación y Agenda
```

**Código de Obtención:**
```typescript
const getCurrentData = () => {
  // ...
  
  if (currentPath[0] === 'operaciones' && 
      currentPath[1] === 'junta-accionistas' && 
      currentPath.length === 3) {
    // ✅ NIVEL 3: Documentos de Junta Específica
    
    // 1. EXTRAER ID DE LA JUNTA DEL PATH
    const juntaId = currentPath[2];  // 'junta-1'
    
    // 2. BUSCAR LA JUNTA EN EL SNAPSHOT
    const junta = documentosGenerados.operaciones.juntaAccionistas.juntas.find(
      j => j.id === juntaId
    );
    // junta = {
    //   id: 'junta-1',
    //   name: 'Junta de Accionistas del 13/12/2024',
    //   descripcion: 'Junta Anual del 2024',
    //   fecha: Date('2024-12-13'),
    //   documentos: [...]
    // }
    
    // 3. RETORNAR DOCUMENTOS DE LA JUNTA
    return {
      folders: [],
      files: junta?.documentos || []
      // files = [
      //   { id: 'dg-j-1-1', name: 'Acta Junta Ordinaria', ... },
      //   { id: 'dg-j-1-2', name: 'Citación y Agenda', ... }
      // ]
    };
  }
  
  // ...
}
```

**Detalle de Extracción con .find():**
```typescript
// ARRAY DE JUNTAS:
const juntas = documentosGenerados.operaciones.juntaAccionistas.juntas;
// [
//   { id: 'junta-1', ... },
//   { id: 'junta-2', ... },
//   { id: 'junta-3', ... }
// ]

// ID EXTRAÍDO DEL PATH:
const juntaId = currentPath[2];  // 'junta-1'

// BÚSQUEDA CON .find():
const junta = juntas.find(j => j.id === juntaId);
//            ↓
//    Compara cada junta.id con 'junta-1'
//    Retorna la primera que coincida

// RESULTADO:
junta = {
  id: 'junta-1',
  name: 'Junta de Accionistas del 13/12/2024',
  descripcion: 'Junta Anual del 2024',
  fecha: Date('2024-12-13'),
  documentos: [
    { id: 'dg-j-1-1', name: 'Acta Junta Ordinaria', type: 'pdf', ... },
    { id: 'dg-j-1-2', name: 'Citación y Agenda', type: 'pdf', ... }
  ]
}

// EXTRACCIÓN DE DOCUMENTOS:
const files = junta?.documentos || [];
// files = [
//   { id: 'dg-j-1-1', name: 'Acta Junta Ordinaria', ... },
//   { id: 'dg-j-1-2', name: 'Citación y Agenda', ... }
// ]
```

---

### **ESCENARIO 2: Mostrar Información de Junta en Modal**

#### **PASO 5: Click Derecho en "Acta Junta Ordinaria"**

**Acción del Usuario:**
```typescript
onClick={() => showDocumentInfo(documento)}
// documento = { id: 'dg-j-1-1', name: 'Acta Junta Ordinaria', ... }
```

**Función Ejecutada:**
```typescript
const showDocumentInfo = (doc: any) => {
  // 1. GUARDAR DOCUMENTO SELECCIONADO
  setSelectedDocument(doc);
  
  // 2. VERIFICAR SI ESTAMOS EN CONTEXTO DE JUNTA
  if (currentPath[0] === 'operaciones' && 
      currentPath[1] === 'junta-accionistas' && 
      currentPath.length === 3) {
    // ✅ SÍ ESTAMOS EN UNA JUNTA ESPECÍFICA
    
    // 3. EXTRAER ID DE LA JUNTA
    const juntaId = currentPath[2];  // 'junta-1'
    
    // 4. BUSCAR LA JUNTA EN EL SNAPSHOT
    const junta = documentosGenerados.operaciones.juntaAccionistas.juntas.find(
      j => j.id === juntaId
    );
    
    // 5. SI SE ENCONTRÓ LA JUNTA, EXTRAER INFORMACIÓN
    if (junta) {
      setJuntaInfo({
        nombre: junta.name,           // 'Junta de Accionistas del 13/12/2024'
        fecha: junta.descripcion,     // 'Junta Anual del 2024'
        descripcion: `Documentos generados de la ${junta.name}`,
        sociedad: 'Tech Innovations SpA'  // Hardcoded (debería venir del snapshot)
      });
    }
  }
  
  // 6. ABRIR MODAL
  setInfoModalOpen(true);
};
```

**Estados Resultantes:**
```typescript
// selectedDocument:
{
  id: 'dg-j-1-1',
  name: 'Acta Junta Ordinaria',
  type: 'pdf',
  dateCreated: Date('2024-12-13'),
  size: 298000,
  folderId: 'junta-1'
}

// juntaInfo:
{
  nombre: 'Junta de Accionistas del 13/12/2024',
  fecha: 'Junta Anual del 2024',
  descripcion: 'Documentos generados de la Junta de Accionistas del 13/12/2024',
  sociedad: 'Tech Innovations SpA'
}

// infoModalOpen:
true
```

**Vista del Modal:**
```
┌────────────────────────────────────────┐
│ ℹ️  Información del Documento          │
├────────────────────────────────────────┤
│ Nombre: Acta Junta Ordinaria           │
│ Tamaño: 298 KB                         │
│ Fecha: 13 Dic 2024                     │
├────────────────────────────────────────┤
│ 📋 Información de la Junta             │
├────────────────────────────────────────┤
│ Junta: Junta de Accionistas del        │
│        13/12/2024                      │
│ Fecha: Junta Anual del 2024            │
│ Sociedad: Tech Innovations SpA         │
└────────────────────────────────────��───┘
```

---

## 🔍 EXTRACCIÓN DE DATOS DEL SNAPSHOT (DESGLOSE DETALLADO)

### **Método 1: .map() para Lista de Juntas**

**Objetivo:** Transformar array de juntas en array de carpetas visuales.

**Código:**
```typescript
const folders = documentosGenerados.operaciones.juntaAccionistas.juntas.map(junta => ({
  id: junta.id,
  name: junta.name,
  type: 'folder' as const,
  descripcion: junta.descripcion
}));
```

**Paso a Paso:**
```typescript
// ENTRADA (snapshot):
documentosGenerados.operaciones.juntaAccionistas.juntas = [
  {
    id: 'junta-1',
    name: 'Junta de Accionistas del 13/12/2024',
    descripcion: 'Junta Anual del 2024',
    fecha: Date('2024-12-13'),
    documentos: [...]
  },
  {
    id: 'junta-2',
    name: 'Junta de Accionistas del 20/11/2024',
    descripcion: 'Junta Extraordinaria',
    fecha: Date('2024-11-20'),
    documentos: [...]
  }
]

// TRANSFORMACIÓN:
.map(junta => {
  // ITERACIÓN 1:
  // junta = { id: 'junta-1', name: 'Junta del 13/12/2024', ... }
  // Retorna: { id: 'junta-1', name: 'Junta del 13/12/2024', type: 'folder', descripcion: '...' }
  
  // ITERACIÓN 2:
  // junta = { id: 'junta-2', name: 'Junta del 20/11/2024', ... }
  // Retorna: { id: 'junta-2', name: 'Junta del 20/11/2024', type: 'folder', descripcion: '...' }
})

// SALIDA (folders para renderizar):
folders = [
  { id: 'junta-1', name: 'Junta del 13/12/2024', type: 'folder', descripcion: 'Junta Anual del 2024' },
  { id: 'junta-2', name: 'Junta del 20/11/2024', type: 'folder', descripcion: 'Junta Extraordinaria' }
]
```

**Diagrama de Flujo:**
```
SNAPSHOT (juntas array)
         ↓
    .map(junta => {...})
         ↓
    Itera cada junta
         ↓
    Extrae: id, name, type, descripcion
         ↓
    Crea nuevo objeto
         ↓
    RESULTADO (folders array)
```

---

### **Método 2: .find() para Junta Específica**

**Objetivo:** Encontrar una junta específica por su ID.

**Código:**
```typescript
const juntaId = currentPath[2];  // 'junta-1'
const junta = documentosGenerados.operaciones.juntaAccionistas.juntas.find(
  j => j.id === juntaId
);
```

**Paso a Paso:**
```typescript
// ENTRADA:
const juntas = [
  { id: 'junta-1', name: '...', documentos: [...] },
  { id: 'junta-2', name: '...', documentos: [...] },
  { id: 'junta-3', name: '...', documentos: [...] }
]

// ID BUSCADO:
const juntaId = 'junta-1'

// BÚSQUEDA:
.find(j => {
  // ITERACIÓN 1:
  // j = { id: 'junta-1', ... }
  // j.id === juntaId  →  'junta-1' === 'junta-1'  →  true
  // ✅ ENCONTRADO! Retorna este objeto
  
  // (Las iteraciones 2 y 3 no se ejecutan porque ya se encontró)
})

// SALIDA:
junta = { id: 'junta-1', name: 'Junta del 13/12/2024', documentos: [...] }
```

**Diagrama de Flujo:**
```
ENTRADA: juntaId = 'junta-1'
         ↓
    .find(j => j.id === juntaId)
         ↓
    Itera hasta encontrar coincidencia
         ↓
    j.id === 'junta-1'? → SÍ
         ↓
    Retorna ese objeto
         ↓
    RESULTADO: junta completa
```

---

### **Método 3: Extracción de Documentos**

**Objetivo:** Obtener documentos de una junta encontrada.

**Código:**
```typescript
const files = junta?.documentos || [];
```

**Paso a Paso:**
```typescript
// JUNTA ENCONTRADA:
junta = {
  id: 'junta-1',
  name: 'Junta de Accionistas del 13/12/2024',
  descripcion: 'Junta Anual del 2024',
  fecha: Date('2024-12-13'),
  documentos: [
    { id: 'dg-j-1-1', name: 'Acta Junta Ordinaria', type: 'pdf', size: 298000 },
    { id: 'dg-j-1-2', name: 'Citación y Agenda', type: 'pdf', size: 145000 }
  ]
}

// EXTRACCIÓN:
junta?.documentos
  ↓
  ¿junta existe? → SÍ
  ↓
  junta.documentos = [
    { id: 'dg-j-1-1', name: 'Acta Junta Ordinaria', ... },
    { id: 'dg-j-1-2', name: 'Citación y Agenda', ... }
  ]

// RESULTADO:
files = [
  { id: 'dg-j-1-1', name: 'Acta Junta Ordinaria', type: 'pdf', size: 298000 },
  { id: 'dg-j-1-2', name: 'Citación y Agenda', type: 'pdf', size: 145000 }
]
```

**Operador ?. (Optional Chaining):**
```typescript
// SIN Optional Chaining:
const files = junta ? junta.documentos : [];
// Si junta es null/undefined → []
// Si junta existe → junta.documentos

// CON Optional Chaining:
const files = junta?.documentos || [];
// Equivalente pero más corto
```

---

## 📊 DIAGRAMA DE FLUJO VISUAL COMPLETO

### **Flujo de Navegación:**

```
┌─────────────────────────────────────────────────────────────────┐
│                         RAÍZ (Nivel 0)                          │
│                     currentPath = []                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│           📁 Registros          📁 Operaciones                 │
│                                       ↓                         │
│                                   Click aquí                    │
└─────────────────────────────────────────────────────────────────┘
                                      ↓
                    navigateToFolder('operaciones')
                                      ↓
                    currentPath = ['operaciones']
                                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    OPERACIONES (Nivel 1)                        │
│                currentPath = ['operaciones']                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    📁 Junta de Accionistas          📁 Directorio              │
│              ↓                                                  │
│          Click aquí                                             │
└─────────────────────────────────────────────────────────────────┘
                                      ↓
              navigateToFolder('junta-accionistas')
                                      ↓
          currentPath = ['operaciones', 'junta-accionistas']
                                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                JUNTA DE ACCIONISTAS (Nivel 2)                   │
│       currentPath = ['operaciones', 'junta-accionistas']        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OBTENCIÓN DEL SNAPSHOT:                                        │
│  documentosGenerados.operaciones.juntaAccionistas.juntas        │
│          .map(junta => ({ id, name, type, descripcion }))       │
│                                                                 │
│  📁 Junta del 13/12/2024 (junta-1)                             │
│  📁 Junta del 20/11/2024 (junta-2)                             │
│  📁 Junta del 05/10/2024 (junta-3)                             │
│              ↓                                                  │
│          Click en junta-1                                       │
└─────────────────────────────────────────────────────────────────┘
                                      ↓
                  navigateToFolder('junta-1')
                                      ↓
      currentPath = ['operaciones', 'junta-accionistas', 'junta-1']
                                      ↓
┌─────────────────────────────────────────────────────────────────┐
│              DOCUMENTOS DE JUNTA (Nivel 3)                      │
│  currentPath = ['operaciones', 'junta-accionistas', 'junta-1']  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EXTRACCIÓN DEL SNAPSHOT:                                       │
│  1. juntaId = currentPath[2] = 'junta-1'                        │
│  2. junta = juntas.find(j => j.id === juntaId)                  │
│  3. files = junta.documentos                                    │
│                                                                 │
│  📄 Acta Junta Ordinaria (dg-j-1-1)                            │
│  📄 Citación y Agenda (dg-j-1-2)                               │
│              ↓                                                  │
│          Click derecho en documento                             │
└─────────────────────────────────────────────────────────────────┘
                                      ↓
                  showDocumentInfo(documento)
                                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                     MODAL DE INFORMACIÓN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EXTRACCIÓN DE INFORMACIÓN DE JUNTA:                            │
│  1. juntaId = currentPath[2] = 'junta-1'                        │
│  2. junta = juntas.find(j => j.id === juntaId)                  │
│  3. setJuntaInfo({                                              │
│       nombre: junta.name,                                       │
│       fecha: junta.descripcion,                                 │
│       descripcion: `Documentos generados de la ${junta.name}`,  │
│       sociedad: 'Tech Innovations SpA'                          │
│    })                                                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ℹ️  Información del Documento                             │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Nombre: Acta Junta Ordinaria                              │ │
│  │ Tamaño: 298 KB                                            │ │
│  │ Fecha: 13 Dic 2024                                        │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 📋 Información de la Junta                                │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Junta: Junta de Accionistas del 13/12/2024               │ │
│  │ Fecha: Junta Anual del 2024                               │ │
│  │ Sociedad: Tech Innovations SpA                            │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 MAPEO PARA ARQUITECTURA DDD HEXAGONAL

### **Capa de Dominio (Domain Layer):**

```typescript
// ENTIDADES (Entities)
interface Junta {
  id: JuntaId;              // Value Object
  nombre: string;
  descripcion: string;
  fecha: Date;
  documentos: Documento[];
}

interface Documento {
  id: DocumentoId;          // Value Object
  nombre: string;
  tipo: TipoDocumento;      // Enum
  fechaCreacion: Date;
  tamaño: number;
  juntaId: JuntaId;
}

// VALUE OBJECTS
type JuntaId = string;
type DocumentoId = string;

enum TipoDocumento {
  PDF = 'pdf',
  DOCX = 'docx',
  XLSX = 'xlsx'
}
```

### **Capa de Aplicación (Application Layer):**

```typescript
// USE CASES (Casos de Uso)

// 1. Obtener Lista de Juntas
interface ObtenerListaJuntasUseCase {
  execute(): Promise<Junta[]>;
}

// 2. Obtener Documentos de Junta
interface ObtenerDocumentosJuntaUseCase {
  execute(juntaId: JuntaId): Promise<Documento[]>;
}

// 3. Obtener Detalles de Junta
interface ObtenerDetallesJuntaUseCase {
  execute(juntaId: JuntaId): Promise<JuntaDetalles>;
}

// DTO (Data Transfer Object)
interface JuntaDetalles {
  junta: Junta;
  sociedad: Sociedad;
  totalDocumentos: number;
}
```

### **Capa de Infraestructura (Infrastructure Layer):**

```typescript
// REPOSITORIO (Repository Pattern)
interface JuntaRepository {
  findAll(): Promise<Junta[]>;
  findById(id: JuntaId): Promise<Junta | null>;
  findDocumentosByJuntaId(juntaId: JuntaId): Promise<Documento[]>;
}

// IMPLEMENTACIÓN (en nuestro caso, con mock data)
class JuntaMockRepository implements JuntaRepository {
  async findAll(): Promise<Junta[]> {
    // Equivalente a:
    return documentosGenerados.operaciones.juntaAccionistas.juntas;
  }
  
  async findById(id: JuntaId): Promise<Junta | null> {
    // Equivalente a:
    return documentosGenerados.operaciones.juntaAccionistas.juntas.find(
      j => j.id === id
    ) || null;
  }
  
  async findDocumentosByJuntaId(juntaId: JuntaId): Promise<Documento[]> {
    // Equivalente a:
    const junta = await this.findById(juntaId);
    return junta?.documentos || [];
  }
}
```

### **Capa de Presentación (Presentation Layer):**

```typescript
// VIEW MODEL
interface JuntaViewModel {
  id: string;
  nombre: string;
  descripcion: string;
  cantidadDocumentos: number;
}

// PRESENTER
class JuntaPresenter {
  toViewModel(junta: Junta): JuntaViewModel {
    return {
      id: junta.id,
      nombre: junta.nombre,
      descripcion: junta.descripcion,
      cantidadDocumentos: junta.documentos.length
    };
  }
  
  toViewModelList(juntas: Junta[]): JuntaViewModel[] {
    return juntas.map(j => this.toViewModel(j));
  }
}

// COMPONENTE REACT (Vista)
function JuntasListView() {
  // Usa el Use Case a través de un hook
  const { juntas, loading } = useObtenerJuntas();
  
  return (
    <div>
      {juntas.map(junta => (
        <JuntaCard key={junta.id} junta={junta} />
      ))}
    </div>
  );
}
```

---

## 🔄 EQUIVALENCIAS: CÓDIGO ACTUAL → DDD HEXAGONAL

### **Navegación Actual:**

```typescript
// CÓDIGO ACTUAL (Frontend directo)
const navigateToFolder = (folderId: string) => {
  setCurrentPath([...currentPath, folderId]);
};

const juntaId = currentPath[2];
const junta = documentosGenerados.operaciones.juntaAccionistas.juntas.find(
  j => j.id === juntaId
);
```

### **Equivalente en DDD Hexagonal:**

```typescript
// ARQUITECTURA DDD HEXAGONAL

// 1. USE CASE (Application Layer)
class ObtenerDocumentosJuntaUseCase {
  constructor(private juntaRepository: JuntaRepository) {}
  
  async execute(juntaId: JuntaId): Promise<Documento[]> {
    const junta = await this.juntaRepository.findById(juntaId);
    
    if (!junta) {
      throw new JuntaNoEncontradaError(juntaId);
    }
    
    return junta.documentos;
  }
}

// 2. REPOSITORY (Infrastructure Layer)
class JuntaRepositoryImpl implements JuntaRepository {
  async findById(id: JuntaId): Promise<Junta | null> {
    // Aquí iría la llamada a la API o base de datos
    // En nuestro caso, mock data:
    return documentosGenerados.operaciones.juntaAccionistas.juntas.find(
      j => j.id === id
    ) || null;
  }
}

// 3. PRESENTACIÓN (Presentation Layer)
function DocumentosJuntaView({ juntaId }: Props) {
  const obtenerDocumentosUseCase = useInjection<ObtenerDocumentosJuntaUseCase>(
    'ObtenerDocumentosJuntaUseCase'
  );
  
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  
  useEffect(() => {
    obtenerDocumentosUseCase.execute(juntaId)
      .then(docs => setDocumentos(docs))
      .catch(error => console.error(error));
  }, [juntaId]);
  
  return (
    <div>
      {documentos.map(doc => (
        <DocumentoCard key={doc.id} documento={doc} />
      ))}
    </div>
  );
}
```

---

## 📋 RESUMEN PARA ARQUITECTURA DDD

### **Variables Clave:**

| Variable | Tipo | Propósito | Capa DDD |
|----------|------|-----------|----------|
| `currentPath` | `string[]` | Historial de navegación | Presentation (State) |
| `juntaId` | `string` | ID de junta específica | Domain (Value Object) |
| `junta` | `Junta` | Entidad junta completa | Domain (Entity) |
| `documentos` | `Documento[]` | Lista de documentos | Domain (Entity collection) |
| `juntaInfo` | `JuntaInfo` | Info para modal | Presentation (ViewModel) |

### **Operaciones de Snapshot:**

| Operación | Método | Resultado | Equivalente DDD |
|-----------|--------|-----------|-----------------|
| Lista de juntas | `.map()` | `Junta[]` → `Folder[]` | `Repository.findAll()` + `Presenter.toViewModelList()` |
| Junta específica | `.find()` | `Junta` o `undefined` | `Repository.findById()` |
| Documentos de junta | `.documentos` | `Documento[]` | `Repository.findDocumentosByJuntaId()` |

### **Flujo de Datos:**

```
SNAPSHOT (Mock Data)
        ↓
    REPOSITORY (Infrastructure)
        ↓
    USE CASE (Application)
        ↓
    PRESENTER (Presentation)
        ↓
    VIEW MODEL (Presentation)
        ↓
    COMPONENTE REACT (UI)
```

---

## 🎯 CONCLUSIÓN

El flujo de navegación de juntas se basa en:

1. **Estado de navegación** (`currentPath`) que actúa como historial
2. **Extracción del snapshot** usando `.map()` y `.find()`
3. **Transformación de datos** para la vista
4. **Contexto de junta** para mostrar información adicional en modales

Para DDD hexagonal, mapea:
- **currentPath** → Presentation Layer (State)
- **documentosGenerados** → Infrastructure Layer (Repository)
- **getCurrentData()** → Application Layer (Use Case)
- **Transformaciones** → Presentation Layer (Presenter/ViewModel)

---

**¡LISTO MI REY!** Esta documentación tiene TODO lo que la otra IA necesita para entender el flujo. 🚀
