# 📚 GUÍA COMPLETA: REPOSITORIO DE DOCUMENTOS DE JUNTAS V3

**Fecha**: 2 de Diciembre 2025  
**Estado**: Documentación Completa ✅  
**Versión**: V3 (Probo Frontend v3-area-2)

---

## 📋 ÍNDICE

1. [Contexto y Principios](#contexto)
2. [IDs Responsables: societyId y flowId](#ids-responsables)
3. [Estructura del Repositorio](#estructura-repositorio)
4. [Endpoints del Repositorio](#endpoints)
5. [Flujo Completo de Envío](#flujo-completo)
6. [Implementación Técnica](#implementacion)
7. [Manejo de Duplicados](#duplicados)
8. [Ejemplos de Código](#ejemplos)

---

## 1️⃣ <a id="contexto"></a>CONTEXTO Y PRINCIPIOS

### Principio Fundamental

**Todos los documentos de una junta van a la misma carpeta**:

```
/core/juntas/{flowId}/
```

**NO hay subcarpetas por tipo**:

- ❌ NO: `/core/juntas/aumento capital/aporte dinerario/`
- ❌ NO: `/core/juntas/{flowId}/documentos generados/`
- ❌ NO: `/core/juntas/{flowId}/puntos de acuerdo/`
- ✅ SÍ: `/core/juntas/{flowId}/` (directo, todos juntos)

### Categorización

**La categorización es SOLO visual en la vista**:

- "Acta Principal"
- "Detalles de la Junta"
- "Acuerdos: Aumento de Capital"
- "Acuerdos: Nombramientos"
- etc.

**NO se refleja en la estructura del repositorio**. Todos los documentos van a la misma carpeta.

---

## 2️⃣ <a id="ids-responsables"></a>IDS RESPONSABLES: societyId Y flowId

### ¿Qué son?

**`societyId`**: ID de la sociedad creada

- Se obtiene cuando se crea/selecciona una sociedad
- Indica para qué sociedad se envían los documentos

**`flowId`**: ID del flujo/junta

- Se obtiene cuando se inicia una junta
- Indica qué junta específica se está procesando

### ¿Cómo se obtienen?

**Del flujo de navegación**:

```typescript
// Ejemplo de ruta:
/operaciones/acddeeioss / { societyId } / junta - accionistas / { flowId } / descargar;

// Extracción:
const societyId = route.params.societyId; // "5"
const flowId = route.params.flowId; // "123"
```

**Del store/composable**:

```typescript
// Usando composable de navegación
const { societyId, flowId } = useJuntasNavbarRoutes();

// O del store
const juntasFlowStore = useJuntasFlowStore();
const flowId = juntasFlowStore.currentFlowId;
const societyId = juntasFlowStore.currentSocietyId;
```

### Responsabilidad

**Estos IDs son responsables que indican**:

- **`societyId`**: Para qué sociedad se envían los documentos
- **`flowId`**: Qué junta específica se está procesando

**Ejemplo**:

```typescript
// Junta #123 de la Sociedad #5
const societyId = 5;
const flowId = 123;

// Carpeta destino:
// /core/juntas/123/
// (dentro del repositorio de la sociedad 5)
```

---

## 3️⃣ <a id="estructura-repositorio"></a>ESTRUCTURA DEL REPOSITORIO

### Estructura V3

```
/core/
└── juntas/
    ├── {flowId}/                    ← Carpeta por junta
    │   ├── acta.docx
    │   ├── convocatoria.docx
    │   ├── proxy-natural.docx
    │   ├── proxy-juridica.docx
    │   ├── certificacion.docx
    │   ├── lista-asistencia.docx
    │   ├── minuta-aporte-dinerario.docx
    │   ├── asiento-aporte-dinerario.docx
    │   ├── certificado-juan-perez.docx
    │   ├── certificado-maria-garcia.docx
    │   ├── aceptacion-director-1.docx
    │   └── aceptacion-director-2.docx
    │
    ├── {flowId2}/                   ← Otra junta
    │   └── ...
    │
    └── {flowId3}/                   ← Otra junta
        └── ...
```

### Características

1. **Una carpeta por junta**: `/core/juntas/{flowId}/`
2. **Todos los documentos juntos**: Sin subcarpetas
3. **Nombres descriptivos**: Los nombres de archivo indican el tipo de documento

---

## 4️⃣ <a id="endpoints"></a>ENDPOINTS DEL REPOSITORIO

### Endpoints Disponibles (repo-ai)

**Base URL**: Los endpoints provienen de "repo-ai" y están disponibles en V3.

#### 1. Obtener estructura de carpetas

```typescript
GET / repository / society / { societyId } / nodes / core;
```

**Propósito**: Obtener todos los nodos (folders) de una sociedad.

**Request**:

```typescript
GET / repository / society / 5 / nodes / core;
```

**Response**:

```typescript
{
  ok: true,
  data: [
    {
      id: 456,
      name: "123",                    // ← flowId como nombre
      path: "/core/juntas/123/",     // ← path con flowId
      type: "folder",
      // ... más campos
    },
    {
      id: 789,
      name: "124",
      path: "/core/juntas/124/",
      type: "folder",
    },
    // ... más folders
  ]
}
```

#### 2. Subir múltiples archivos

```typescript
POST /repository/society/nodes/{nodeId}/core?name={nombre}
```

**Propósito**: Subir múltiples archivos a un folder del repositorio.

**Request**:

```typescript
POST /repository/society/nodes/456/core?name=Documentos Juntas: 15 de enero de 2025
Content-Type: multipart/form-data

FormData:
  - "12345": File (blob convertido a File)
  - "67890": File
  - "11111": File
```

**Parámetro `name`**:

- **Formato**: `"Documentos Juntas: {Fecha de la Junta}"`
- **Ejemplo**: `"Documentos Juntas: 15 de enero de 2025"`
- **Solo la fecha**: Nada más, solo la fecha de la junta

**Response**:

```typescript
{
  ok: true,
  message: "Archivos subidos exitosamente",
  data: {
    uploadedFiles: [
      { fileId: 1, fileName: "acta.docx" },
      { fileId: 2, fileName: "convocatoria.docx" },
      // ...
    ]
  }
}
```

#### 3. Subir un documento

```typescript
POST / repository / society / nodes / { folderId } / documents;
```

**Propósito**: Subir un solo documento a un folder (alternativa al endpoint anterior).

**Request**:

```typescript
POST /repository/society/nodes/456/documents
Content-Type: multipart/form-data

FormData:
  - {uuid}: File
```

---

## 5️⃣ <a id="flujo-completo"></a>FLUJO COMPLETO DE ENVÍO

### Paso a Paso

```
1. Usuario completa todos los pasos de la junta
   │
   ├─ 2. Usuario hace click en "Descargar Documentos"
   │     │
   │     ├─ 3. Generar todos los documentos
   │     │     │
   │     │     ├─ 3.1. Generar Acta (con todos los puntos)
   │     │     ├─ 3.2. Generar Documentos No-Punto
   │     │     │        (convocatoria, proxy, certificación, lista)
   │     │     └─ 3.3. Generar Documentos por Punto
   │     │              (minuta, asiento, certificados, aceptaciones, etc.)
   │     │
   │     ├─ 4. Obtener folderId de /core/juntas/{flowId}/
   │     │     │
   │     │     ├─ 4.1. GET /repository/society/{societyId}/nodes/core
   │     │     ├─ 4.2. Buscar carpeta con path === "/core/juntas/{flowId}/"
   │     │     └─ 4.3. Si no existe, crearla
   │     │
   │     ├─ 5. Preparar archivos para envío
   │     │     │
   │     │     ├─ 5.1. Convertir blobs a Files
   │     │     ├─ 5.2. Obtener fecha de la junta
   │     │     └─ 5.3. Construir nombre: "Documentos Juntas: {fecha}"
   │     │
   │     └─ 6. Subir todos los archivos
   │           │
   │           └─ POST /repository/society/nodes/{folderId}/core?name={nombre}
   │
   └─ 7. Mostrar éxito y permitir descarga
```

### Flujo Detallado

#### Paso 1: Obtener IDs

```typescript
// Del contexto de navegación
const route = useRoute();
const societyId = Number(route.params.societyId); // 5
const flowId = Number(route.params.flowId); // 123
```

#### Paso 2: Generar Documentos

```typescript
// Generar todos los documentos
const documentos = await generateAllDocumentosUseCase.execute({
  societyId,
  flowId,
});

// Resultado:
// [
//   { nombre: "acta.docx", blob: Blob, mimeType: "application/vnd..." },
//   { nombre: "convocatoria.docx", blob: Blob, ... },
//   { nombre: "minuta-aporte-dinerario.docx", blob: Blob, ... },
//   // ... más documentos
// ]
```

#### Paso 3: Obtener folderId

```typescript
// Obtener estructura de carpetas
const response = await $fetch<{ data: Node[] }>(
  `/repository/society/${societyId}/nodes/core`,
  { ...withAuthHeaders() }
);

// Buscar carpeta de la junta
const folder = response.data.find(
  (node) => node.path === `/core/juntas/${flowId}/` && node.type === "folder"
);

let folderId: number;

if (folder) {
  // Carpeta existe
  folderId = folder.id;
} else {
  // Carpeta no existe → Crearla
  // 1. Buscar carpeta padre "/core/juntas/"
  const parentFolder = response.data.find(
    (node) => node.path === "/core/juntas/" && node.type === "folder"
  );

  // 2. Crear carpeta hijo
  const newFolder = await $fetch<{ data: { id: number } }>(
    `/repository/society/${societyId}/nodes/${parentFolder.id}/folder`,
    {
      ...withAuthHeaders(),
      method: "POST",
      body: {
        name: flowId.toString(),
        description: `Documentos de la junta ${flowId}`,
      },
    }
  );

  folderId = newFolder.data.id;
}
```

#### Paso 4: Preparar Archivos

```typescript
// Obtener fecha de la junta (del store o API)
const fechaJunta = await obtenerFechaJunta(societyId, flowId);
// Ejemplo: "15 de enero de 2025"

// Construir nombre
const nombreCarpeta = `Documentos Juntas: ${fechaJunta}`;

// Convertir blobs a Files
const files: File[] = documentos.map((doc) => {
  return new File([doc.blob], doc.nombre, {
    type:
      doc.mimeType ||
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
});
```

#### Paso 5: Subir Archivos

```typescript
// Subir todos los archivos
const formData = new FormData();

// Agregar cada archivo con su tamaño como key
for (const file of files) {
  formData.append(file.size.toString(), file, file.name);
}

// Subir
await $fetch(`/repository/society/nodes/${folderId}/core`, {
  ...withAuthHeaders(),
  method: "POST",
  body: formData,
  params: {
    name: nombreCarpeta, // "Documentos Juntas: 15 de enero de 2025"
  },
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

---

## 6️⃣ <a id="implementacion"></a>IMPLEMENTACIÓN TÉCNICA

### Función Principal

```typescript
/**
 * Obtiene o crea la carpeta del repositorio para una junta
 * @param societyId - ID de la sociedad
 * @param flowId - ID del flujo/junta
 * @returns folderId de la carpeta /core/juntas/{flowId}/
 */
async function obtenerFolderIdJunta(societyId: number, flowId: number): Promise<number> {
  // 1. Obtener estructura de carpetas
  const response = await $fetch<{ data: Node[] }>(
    `/repository/society/${societyId}/nodes/core`,
    { ...withAuthHeaders() }
  );

  // 2. Buscar carpeta de la junta
  const folder = response.data.find(
    (node) => node.path === `/core/juntas/${flowId}/` && node.type === "folder"
  );

  if (folder) {
    // Carpeta existe → Retornar ID
    return folder.id;
  }

  // 3. Carpeta no existe → Crearla
  // 3.1. Buscar carpeta padre "/core/juntas/"
  const parentFolder = response.data.find(
    (node) => node.path === "/core/juntas/" && node.type === "folder"
  );

  if (!parentFolder) {
    throw new Error("No se encontró la carpeta padre /core/juntas/");
  }

  // 3.2. Crear carpeta hijo
  const newFolder = await $fetch<{ data: { id: number } }>(
    `/repository/society/${societyId}/nodes/${parentFolder.id}/folder`,
    {
      ...withAuthHeaders(),
      method: "POST",
      body: {
        name: flowId.toString(),
        description: `Documentos de la junta ${flowId}`,
      },
    }
  );

  return newFolder.data.id;
}
```

### Función de Envío

```typescript
/**
 * Envía todos los documentos generados al repositorio
 * @param societyId - ID de la sociedad
 * @param flowId - ID del flujo/junta
 * @param documentos - Array de documentos generados (blobs)
 * @param fechaJunta - Fecha de la junta (formato: "15 de enero de 2025")
 */
async function enviarDocumentosAlRepositorio(
  societyId: number,
  flowId: number,
  documentos: DocumentoGenerado[],
  fechaJunta: string
): Promise<void> {
  // 1. Obtener folderId
  const folderId = await obtenerFolderIdJunta(societyId, flowId);

  // 2. Construir nombre de carpeta
  const nombreCarpeta = `Documentos Juntas: ${fechaJunta}`;

  // 3. Convertir blobs a Files
  const files: File[] = documentos.map((doc) => {
    const mimeType =
      doc.mimeType ||
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return new File([doc.blob], doc.nombre, { type: mimeType });
  });

  // 4. Crear FormData
  const formData = new FormData();
  for (const file of files) {
    formData.append(file.size.toString(), file, file.name);
  }

  // 5. Subir archivos
  await $fetch(`/repository/society/nodes/${folderId}/core`, {
    ...withAuthHeaders(),
    method: "POST",
    body: formData,
    params: {
      name: nombreCarpeta,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
```

### Interface de Documento

```typescript
interface DocumentoGenerado {
  nombre: string; // "acta.docx"
  blob: Blob; // Blob del archivo generado
  mimeType?: string; // "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  categoria: string; // "ACTA_PRINCIPAL", "DETALLES_JUNTA", "POR_PUNTO", etc.
  puntoAcuerdoId?: string; // Si pertenece a un punto específico
}
```

### Interface de Node

```typescript
interface Node {
  id: number;
  name: string;
  path: string; // "/core/juntas/123/"
  type: "folder" | "document";
  // ... más campos
}
```

---

## 7️⃣ <a id="duplicados"></a>MANEJO DE DUPLICADOS

### Regla

**Si se genera el mismo documento dos veces, se reemplaza**.

**Ejemplo**:

```typescript
// Primera vez: genero y subo acta.docx
await enviarDocumentosAlRepositorio(societyId, flowId, [acta], fechaJunta);
// → /core/juntas/123/acta.docx (creado)

// Segunda vez: genero y subo acta.docx (mismo nombre)
await enviarDocumentosAlRepositorio(societyId, flowId, [acta], fechaJunta);
// → /core/juntas/123/acta.docx (reemplazado)
```

### Comportamiento

- ✅ **Se reemplaza**: El archivo anterior se sobrescribe
- ❌ **NO se crea versión nueva**: No hay `acta-v2.docx`
- ❌ **NO hay error**: No falla si el archivo ya existe
- ❌ **NO hay versionado automático**: El backend no maneja versionado

### Implicaciones

**Si el usuario genera documentos dos veces**:

- Los documentos se reemplazarán con los nuevos
- No hay historial de versiones anteriores
- El último documento generado es el que queda

---

## 8️⃣ <a id="ejemplos"></a>EJEMPLOS DE CÓDIGO

### Ejemplo Completo: Generar y Enviar Documentos

```typescript
import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";
import { generateAllDocumentosUseCase } from "~/core/hexag/documentos/application/use-cases/generate-all-documentos.use-case";
import {
  obtenerFolderIdJunta,
  enviarDocumentosAlRepositorio,
} from "~/core/hexag/documentos/infrastructure/repositories/documento.repository";

export async function handleGenerarYEnviarDocumentos() {
  // 1. Obtener IDs del contexto
  const { societyId, flowId } = useJuntasNavbarRoutes();

  if (!societyId || !flowId) {
    throw new Error("No se encontraron societyId o flowId");
  }

  // 2. Obtener fecha de la junta (del store o API)
  const fechaJunta = await obtenerFechaJunta(Number(societyId), Number(flowId));
  // Ejemplo: "15 de enero de 2025"

  // 3. Generar todos los documentos
  const documentos = await generateAllDocumentosUseCase.execute({
    societyId: Number(societyId),
    flowId: Number(flowId),
  });

  // 4. Enviar al repositorio
  await enviarDocumentosAlRepositorio(
    Number(societyId),
    Number(flowId),
    documentos,
    fechaJunta
  );

  // 5. Mostrar éxito
  useToast().success("Documentos generados y enviados al repositorio correctamente");
}
```

### Ejemplo: Obtener Fecha de la Junta

```typescript
/**
 * Obtiene la fecha de la junta desde el store o API
 */
async function obtenerFechaJunta(societyId: number, flowId: number): Promise<string> {
  // Opción 1: Del store
  const juntasFlowStore = useJuntasFlowStore();
  const detallesJunta = juntasFlowStore.detallesJunta;

  if (detallesJunta?.fecha) {
    return formatearFecha(detallesJunta.fecha);
  }

  // Opción 2: De la API
  const response = await $fetch<{ data: { fecha: string } }>(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/details`,
    { ...withAuthHeaders() }
  );

  return formatearFecha(response.data.fecha);
}

/**
 * Formatea la fecha al formato requerido
 */
function formatearFecha(fecha: string | Date): string {
  const date = typeof fecha === "string" ? new Date(fecha) : fecha;

  const opciones: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("es-PE", opciones);
  // Ejemplo: "15 de enero de 2025"
}
```

### Ejemplo: Integración en el Composable

```typescript
// composables/useDocumentosJunta.ts
export const useDocumentosJunta = () => {
  const route = useRoute();
  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  const generarYEnviar = async () => {
    if (!societyId.value || !flowId.value) {
      throw new Error("No se encontraron societyId o flowId");
    }

    // 1. Generar documentos
    const documentos = await generateAllDocumentosUseCase.execute({
      societyId: societyId.value,
      flowId: flowId.value,
    });

    // 2. Obtener fecha
    const fechaJunta = await obtenerFechaJunta(societyId.value, flowId.value);

    // 3. Enviar al repositorio
    await enviarDocumentosAlRepositorio(societyId.value, flowId.value, documentos, fechaJunta);

    return documentos;
  };

  return {
    generarYEnviar,
  };
};
```

---

## ✅ RESUMEN

### Principios Clave

1. **IDs Responsables**: `societyId` y `flowId` se obtienen del flujo de navegación
2. **Estructura Simple**: Todos los documentos van a `/core/juntas/{flowId}/`
3. **Nombre de Carpeta**: `"Documentos Juntas: {Fecha de la Junta}"`
4. **Duplicados**: Se reemplazan (no hay versionado)
5. **Categorización**: Solo visual, no se refleja en el repositorio

### Endpoints

- `GET /repository/society/{societyId}/nodes/core` - Obtener estructura
- `POST /repository/society/nodes/{nodeId}/core?name={nombre}` - Subir archivos

### Flujo

1. Obtener `societyId` y `flowId` del contexto
2. Generar todos los documentos
3. Obtener/crear carpeta `/core/juntas/{flowId}/`
4. Preparar archivos y nombre de carpeta
5. Subir todos los archivos

---

**¿Todo claro ahora, mi rey?** 🚀💪
