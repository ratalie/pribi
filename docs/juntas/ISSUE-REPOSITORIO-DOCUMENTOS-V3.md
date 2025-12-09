# 📋 ISSUE: IMPLEMENTACIÓN DE REPOSITORIO DE DOCUMENTOS V3

**Fecha**: 8 de Diciembre 2025  
**Estado**: 📝 DOCUMENTADO - Pendiente de Implementación  
**Prioridad**: ALTA  
**Objetivo**: Hacer funcional el envío de documentos al repositorio desde la vista de descarga

---

## 🎯 OBJETIVO PRINCIPAL

**Hacer funcional la vista de documentos** para que los documentos generados se envíen automáticamente al repositorio siguiendo las reglas de negocio establecidas.

### Estado Actual

- ✅ **Vista de documentos generados**: Funcional y visualmente completa
- ✅ **Generación de documentos**: Funcional (acta, convocatoria, minuta, certificado, etc.)
- ✅ **Descarga individual**: Funcional
- ❌ **Envío al repositorio**: Hardcodeado, necesita reglas de negocio
- ❌ **Checkbox repositorio**: Deshabilitado

### Estado Deseado

- ✅ **Vista de documentos generados**: Mantener funcional
- ✅ **Generación de documentos**: Mantener funcional
- ✅ **Descarga individual**: Mantener funcional
- ✅ **Envío al repositorio**: Funcional con reglas de negocio
- ✅ **Checkbox repositorio**: Habilitado y funcional

---

## 📚 REFERENCIAS

### 1. Análisis Completo V2.5 - Repositorio

**Documento**: `docs/juntas/ANALISIS-V25-REPOSITORIO-COMPLETO.md` ⭐ **REFERENCIA PRINCIPAL**

- ✅ **Flujo completo de envío al repositorio en V2.5**
- ✅ **Vista del repositorio y cómo se muestran documentos por sociedad**
- ✅ **Repositorio V3 (Google Drive clone) y sus funcionalidades**
- ✅ **Archivos de V2.5 a revisar constantemente**
- ✅ **Diferencias V2.5 → V3**
- ✅ **Plan de implementación completo**

### 2. Flujo de Creación - Sociedades y Juntas

**Documento**: `docs/general/FLUJO-CREACION-SOCIEDADES-Y-JUNTAS.md`

- ✅ **Flujo completo de creación de sociedades**
- ✅ **Flujo completo de creación de juntas**
- ✅ **Mapeo de IDs**: `structureId` = `societyId`, `flowStructureId` = `flowId`
- ✅ **Rutas y navegación**
- ✅ **Ejemplos de código**

### 3. Backend - Endpoints V2 del Repositorio

**Documento**: `docs/backend/repositorio/GUIA-COMPLETA-ENDPOINTS-V2.md`

#### Endpoints Disponibles para Juntas

1. **Obtener o crear carpeta de junta (RECOMENDADO)**

   ```http
   GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder
   ```

   - ✅ **Obtiene o crea automáticamente** `/core/juntas/{flowId}/`
   - ✅ Si no existe `core`, lanza error
   - ✅ Si no existe `juntas`, la crea automáticamente
   - ✅ Si no existe la carpeta de la junta, la crea automáticamente
   - **Respuesta**: `{ "data": { "id": 456, "name": "123", "path": "/core/juntas/123/" } }`

2. **Obtener solo el folderId de junta (ALTERNATIVA)**

   ```http
   GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder-id
   ```

   - **Respuesta**: `{ "data": { "folderId": 456 } }`

3. **Subir múltiples documentos core**

   ```http
   POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core?name={nombre}
   ```

   - Parámetro `name`: `"Documentos Juntas: {Fecha de la Junta}"`
   - Body: `FormData` con múltiples archivos
   - **Formato FormData**: Cada archivo con key = `file.size.toString()`

4. **Obtener estructura de carpetas (ALTERNATIVA - no recomendada)**
   ```http
   GET /api/v2/repository/society-profile/:structureId/nodes/core
   ```
   - Retorna todos los nodos core
   - Necesitas buscar manualmente la carpeta `/core/juntas/{flowId}/`

#### IDs Importantes

**En V3 (Frontend)**:

- **`societyId`** (string): ID de la sociedad desde la ruta

  - Se obtiene de: `route.params.societyId`
  - Composable: `useJuntasNavbarRoutes().societyId`
  - Ejemplo: `"30"` o `"5"`

- **`flowId`** (string): ID del flujo/junta desde la ruta
  - Se obtiene de: `route.params.flowId`
  - Composable: `useJuntasNavbarRoutes().flowId`
  - Ejemplo: `"123"` o `"7"`

**En V2 (Backend)**:

- **`structureId`** (string/number): ID de la estructura de la sociedad (V2)
  - ✅ **CONFIRMADO**: `structureId` = `societyId` (son el mismo valor)
  - Cuando se crea una sociedad, el backend retorna `structureId`
  - Este valor se usa directamente como `societyId` en las rutas
  - **No hay conversión ni mapeo adicional**

**⚠️ IMPORTANTE**: `structureId` y `societyId` son el mismo valor. Se pueden usar indistintamente.

---

### 2. Versión 2.5 - Código y Comportamiento

**Documento**: `docs/version 2.5/V25-CONEXION-REPOSITORIO-V2-V3.md`

#### Comportamiento en V2.5

1. **Envío Automático con `watch()`**

   - El `watch(listDocument)` se activa cuando se generan documentos
   - Envía automáticamente al repositorio sin intervención del usuario
   - Combina documentos generados + documentos del flujo (ej: Asientos contables)

2. **Estructura de Carpetas por Flujo (V2.5)**

   ```
   /core/juntas/aumento capital/aporte dinerario/
   /core/juntas/aumento capital/capitalización de créditos/
   /core/juntas/designación y/o remoción/directores/
   /core/juntas/designación y/o remoción/gerentes y/o apoderados/
   /core/juntas/estados financieros y reparto de dividendos/
   ```

3. **Estructura de Carpetas V3 (NUEVA)**

   ```
   /core/juntas/{flowId}/
   ```

   - ✅ **Todos los documentos juntos** (no por tipo de flujo)
   - ✅ **Una carpeta por junta** (no por tipo de flujo)

4. **Flujo de Envío V2.5**

   ```typescript
   // 1. Generar documentos
   const result = await generateAporteDinerarioDocumentsV2({...});
   listDocument.value = result.results;

   // 2. Watch automático se activa
   watch(listDocument, async (newVal) => {
     // 2.1. Obtener pathName y folderName por flowId
     const { pathName, folderName } = getPathNameAndFolderNameByFlow(flowId);

     // 2.2. Obtener folderId del repositorio
     const folderId = await handleGetNodeIdByFlow({
       societyId: society.value.id,
       folderPath: pathName,  // "/core/juntas/aumento capital/"
       folderName: folderName, // "aporte dinerario"
     });

     // 2.3. Filtrar documentos exitosos
     const successfulDocuments = newVal.filter(doc => doc.status === "fulfilled");

     // 2.4. Obtener documentos adicionales del flujo
     const documentsFromFlow = await getDocumentsFromFlowAD(societyId, flowId);

     // 2.5. Combinar todos los documentos
     const allDocuments = [...successfulDocuments, ...documentsFromFlow];

     // 2.6. Enviar al repositorio
     await handleSaveToBackend({
       listDocument: allDocuments,
       folderId: folderId,
       nameFlowToDocument: "Documentos Aporte Dinerario",
     });
   });
   ```

5. **Código V2.5 - Composable de Repositorio**

   **Ubicación**: `src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts`

   ```typescript
   // 1. Obtener folderId por flujo
   const handleGetNodeIdByFlow = async (baseData: IBaseDataToGetNode) => {
     // GET /repository/society/{societyId}/nodes/core
     const folders = await getNodeBySociety(baseData.societyId);

     // Buscar folder por path + name
     const folderId =
       folders.data.find(
         (folder) => folder.path === baseData.folderPath && folder.name === baseData.folderName
       )?.id || 0;

     return folderId;
   };

   // 2. Enviar documentos al repositorio
   const handleSaveToBackend = async (baseData: IBaseDataToSaveDocument) => {
     // Convertir blobs a Files
     const files: File[] = baseData.listDocument.map((doc) => {
       return new File([doc.value.blob], doc.value.nameFile, {
         type: getCorrectMimeType(doc.value.nameFile, doc.value.blob.type),
       });
     });

     // POST /repository/society/nodes/{nodeId}/core?name={nombre}
     await postFilesToNode(files, baseData.folderId.toString(), baseData.nameFlowToDocument);
   };

   // 3. Mapeo de flujos a carpetas
   const getPathNameAndFolderNameByFlow = (flowId: FlowsByIdEnum) => {
     switch (flowId) {
       case FlowsByIdEnum.APORTE_DINERARIO:
         return {
           pathName: "/core/juntas/aumento capital/",
           folderName: "aporte dinerario",
         };
       // ... más casos
     }
   };
   ```

6. **Endpoints V2.5 (V1 Backend)**

   ```typescript
   // Obtener nodos
   GET /repository/society/{societyId}/nodes/core

   // Subir documentos
   POST /repository/society/nodes/{nodeId}/core?name={nombre}
   ```

7. **Endpoints V2 (Nuevo Backend)**

   ```typescript
   // Obtener/crear carpeta de junta (RECOMENDADO)
   GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder

   // Subir documentos
   POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core?name={nombre}
   ```

---

### 3. Proyecto Actual - Estado

**Documento**: `docs/juntas/GUIA-COMPLETA-REPOSITORIO-DOCUMENTOS-V3.md`

#### Estructura Actual

```
app/core/hexag/documentos/
├── domain/
│   ├── entities/
│   │   └── documento.entity.ts          ✅
│   ├── enums/
│   │   ├── tipo-documento.enum.ts      ✅
│   │   └── categoria-documento.enum.ts ✅
│   └── ports/
│       └── download-data.repository.ts  ✅
├── application/
│   ├── dtos/
│   │   └── download-data.dto.ts         ✅
│   └── use-cases/
│       ├── generate-acta.use-case.ts    ✅
│       ├── generate-convocatoria.use-case.ts ✅
│       ├── generate-minuta.use-case.ts  ✅
│       ├── generate-certificado.use-case.ts ✅
│       └── generate-all-documentos.use-case.ts ✅
└── infrastructure/
    ├── mappers/
    │   ├── acta-data.mapper.ts          ✅
    │   ├── convocatoria-data.mapper.ts  ✅
    │   ├── minuta-data.mapper.ts        ✅
    │   └── certificado-data.mapper.ts   ✅
    ├── processors/
    │   └── docxtemplater-processor.ts  ✅
    └── repositories/
        ├── template.http.repository.ts  ✅
        └── download-data.http.repository.ts ✅
```

#### Vista Actual

**Componente**: `app/components/juntas/documentos/JuntaDocumentosGenerados.vue`

**Estado**:

- ✅ Genera documentos correctamente
- ✅ Muestra documentos por categoría
- ✅ Permite descarga individual
- ❌ Checkbox repositorio deshabilitado
- ❌ No hay lógica de envío al repositorio

---

## 🔍 ANÁLISIS DE REQUERIMIENTOS

### 1. Reglas de Negocio a Establecer

#### 1.1. Dónde se Envían los Documentos

**Juntas de Accionistas**:

- **Ruta**: `/core/juntas/{flowId}/`
- **Nombre de carpeta**: `"Documentos Juntas: {Fecha de la Junta}"`
- **Ejemplo**: `"Documentos Juntas: 15 de enero de 2025"`

**Registros/Sociedades/Acciones**:

- **Ruta**: `/core/registros/sociedades/acciones/`
- **Documentos**: `otroDerechoEspecialDoc`, `regimenObligacionesDoc`
- **Endpoint**: `POST /api/v2/society-profile/{societyId}/actions`

**Registros/Sociedades/Acuerdos Especiales**:

- **Ruta**: `/core/registros/sociedades/acuerdos/`
- **Documentos**: `estatutosSociales`, `convenioAccionistas`, `acuerdoTerceros`
- **Endpoint**: `POST /api/v2/society-profile/{societyId}/corporate-agreements`

**Registros/Sociedades/Facultades**:

- **Ruta**: `/core/registros/sociedades/régimen de facultades/`
- **Documentos**: `fileDocument` de cada representante
- **Endpoint**: `POST /api/v2/society-profile/{societyId}/attorney-registry`

#### 1.2. Cómo se Envían los Documentos

**Juntas de Accionistas**:

- **Envío**: Todos los documentos de golpe (no por flujo individual)
- **Endpoint**: `POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core?name={nombre}`
- **Body**: `FormData` con todos los documentos

**Registros**:

- **Envío**: Individual por cada tipo de documento
- **Endpoints**: Específicos por tipo (actions, corporate-agreements, attorney-registry)

#### 1.3. Cuándo se Envían los Documentos

**Juntas de Accionistas**:

- **V2.5**: Automáticamente al terminar la junta (según tipo de flujo)
- **V3**: Manualmente cuando el usuario hace click en el checkbox "Enviar automáticamente al Repositorio Documental"
- **Comportamiento**: Si el checkbox está marcado, se envían automáticamente después de generar

**Registros**:

- **V2.5**: Automáticamente al guardar
- **V3**: Mantener el mismo comportamiento

---

### 2. Sistema de Documentos Societarios (Clone de Google Drive)

**Ubicación**: `app/core/hexag/repositorio/almacenamiento/`

#### Funcionalidad Actual

- ✅ **Listar documentos**: `listDocumentos(sociedadId, parentId)`
- ✅ **Crear carpeta**: `createCarpeta(sociedadId, nombre, parentId)`
- ✅ **Subir documento**: `uploadDocumento(sociedadId, file, parentId)`
- ✅ **Descargar documento**: `downloadDocumento(sociedadId, documentoId)`

#### Endpoints Actuales

```typescript
// Listar documentos
GET / api / v2 / repositorio / { sociedadId } / almacenamiento / documentos;

// Crear carpeta
POST / api / v2 / repositorio / { sociedadId } / almacenamiento / carpetas;

// Subir documento
POST / api / v2 / repositorio / { sociedadId } / almacenamiento / documentos / upload;

// Descargar documento
GET /
  api /
  v2 /
  repositorio /
  { sociedadId } /
  almacenamiento /
  documentos /
  { documentoId } /
  download;
```

#### Relación con Repositorio V2

**Pregunta**: ¿Son el mismo sistema o sistemas diferentes?

**Análisis**:

- El sistema de almacenamiento parece ser un sistema diferente
- El repositorio V2 usa endpoints `/api/v2/repository/...`
- El almacenamiento usa endpoints `/api/v2/repositorio/...`

**Necesidad**: Entender si:

1. Son sistemas separados que se complementan
2. Son el mismo sistema con diferentes endpoints
3. Uno es wrapper del otro

---

## 📋 TAREAS A IMPLEMENTAR

### Fase 1: Mapeo y Entendimiento

- [x] **1.1. Revisar Backend** ✅

  - [x] Endpoints V2 del repositorio documentados
  - [x] Endpoint de juntas confirmado: `GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder`
  - [x] **CONFIRMADO**: `structureId` = `societyId` (son el mismo valor)

- [x] **1.2. Revisar V2.5** ✅

  - [x] Flujo de envío automático con `watch()` entendido
  - [x] Estructura de carpetas por flujo documentada
  - [x] Cómo se combinaban documentos (generados + del flujo) entendido
  - [x] Código de `useSaveDocumentsByFlow` revisado

- [x] **1.3. Revisar Proyecto Actual** ✅
  - [x] `societyId` y `flowId` se obtienen de `useJuntasNavbarRoutes()`
  - [x] Generación de documentos funcional
  - [x] No existe lógica de envío al repositorio (solo descarga)

### Fase 2: Arquitectura Hexagonal

- [ ] **2.1. Crear Domain Layer**

  - [ ] `domain/entities/repositorio-node.entity.ts` - Entidad de nodo del repositorio
  - [ ] `domain/ports/repositorio.repository.ts` - Contrato del repositorio

- [ ] **2.2. Crear Application Layer**

  - [ ] `application/dtos/repositorio.dto.ts` - DTOs de request/response
  - [ ] `application/use-cases/obtener-folder-junta.use-case.ts` - Obtener o crear carpeta de junta
  - [ ] `application/use-cases/enviar-documentos-repositorio.use-case.ts` - Enviar documentos al repositorio

- [ ] **2.3. Crear Infrastructure Layer**
  - [ ] `infrastructure/repositories/repositorio.http.repository.ts` - Implementación HTTP
  - [ ] `infrastructure/mappers/repositorio.mapper.ts` - Mappers DTO ↔ Entidad

### Fase 3: Integración con Vista

- [ ] **3.1. Habilitar Checkbox**

  - [ ] Habilitar checkbox "Enviar automáticamente al Repositorio Documental" en `JuntaDocumentosGenerados.vue`
  - [ ] Agregar estado reactivo: `const enviarAlRepositorio = ref(false)`
  - [ ] Conectar con lógica de envío

- [ ] **3.2. Implementar Lógica de Envío**

  - [ ] Crear use case: `enviar-documentos-repositorio.use-case.ts`
  - [ ] Integrar con `generate-all-documentos.use-case.ts`
  - [ ] Agregar `watch()` o botón para enviar cuando checkbox esté marcado
  - [ ] Manejar errores y mostrar feedback (toast/notificación)

- [ ] **3.3. Obtener Fecha de la Junta** ✅
  - [x] Ya tenemos `downloadData.value?.meetingDetails?.firstCall?.dateFormatted`
  - [x] Formato: "8 de diciembre de 2025"
  - [ ] Usar en nombre de carpeta: `"Documentos Juntas: {fecha}"`

### Fase 4: Reglas de Negocio

- [ ] **4.1. Establecer Rutas**

  - [ ] Juntas: `/core/juntas/{flowId}/`
  - [ ] Registros/Acciones: `/core/registros/sociedades/acciones/`
  - [ ] Registros/Acuerdos: `/core/registros/sociedades/acuerdos/`
  - [ ] Registros/Facultades: `/core/registros/sociedades/régimen de facultades/`

- [ ] **4.2. Establecer Nombres de Carpetas**

  - [ ] Juntas: `"Documentos Juntas: {Fecha de la Junta}"`
  - [ ] Registros: Según tipo de documento

- [ ] **4.3. Establecer Comportamiento de Duplicados**
  - [ ] Reemplazar documentos duplicados (no versionado)
  - [ ] No crear `acta-v2.docx`, solo reemplazar `acta.docx`

### Fase 5: Testing y Validación

- [ ] **5.1. Testing Manual**

  - [ ] Generar documentos de una junta
  - [ ] Marcar checkbox de repositorio
  - [ ] Verificar que se envían correctamente
  - [ ] Verificar estructura de carpetas en el repositorio

- [ ] **5.2. Validación de Reglas**
  - [ ] Verificar que los documentos van a la carpeta correcta
  - [ ] Verificar que el nombre de carpeta es correcto
  - [ ] Verificar que los duplicados se reemplazan

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### 1. Obtener IDs del Contexto (V3)

```typescript
// Opción 1: Del composable (RECOMENDADO)
import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";

const { societyId, flowId } = useJuntasNavbarRoutes();
// societyId: string | undefined (ej: "30")
// flowId: string | undefined (ej: "123")

// Opción 2: De la ruta directamente
const route = useRoute();
const societyId = route.params.societyId as string; // "30"
const flowId = route.params.flowId as string; // "123"

// ⚠️ IMPORTANTE: Necesitamos convertir a number para algunos endpoints
const societyIdNumber = Number(societyId); // 30
const flowIdNumber = Number(flowId); // 123
```

### 1.1. Obtener structureId (CONFIRMADO ✅)

```typescript
// ✅ CONFIRMADO: structureId = societyId (son el mismo valor)

// Opción 1: Usar directamente societyId (RECOMENDADO)
const structureId = societyId; // "7" → "7"

// Opción 2: Convertir a number si el endpoint lo requiere
const structureIdNumber = Number(societyId); // "7" → 7

// Ejemplo completo:
const { societyId, flowId } = useJuntasNavbarRoutes();
// societyId = "7", flowId = "2"

// Usar directamente en endpoints del repositorio
const folderResponse = await $fetch(
  `/api/v2/repository/society-profile/${societyId}/juntas/${flowId}/folder`
);
// ✅ Funciona porque societyId = structureId
```

### 2. Obtener o Crear Carpeta de Junta (V2)

```typescript
// Opción 1: Obtener carpeta completa (RECOMENDADO)
const folderResponse = await $fetch<{
  success: boolean;
  data: {
    id: number;
    name: string;
    path: string;
  };
}>(`/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder`, {
  ...withAuthHeaders(),
});

const folderId = folderResponse.data.id; // 456
const folderPath = folderResponse.data.path; // "/core/juntas/123/"

// Opción 2: Solo obtener folderId (ALTERNATIVA)
const folderIdResponse = await $fetch<{
  success: boolean;
  data: { folderId: number };
}>(`/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder-id`, {
  ...withAuthHeaders(),
});

const folderId = folderIdResponse.data.folderId; // 456
```

**⚠️ NOTA**: Este endpoint crea automáticamente:

- La carpeta `core` si no existe (pero lanza error si no existe)
- La carpeta `juntas` si no existe
- La carpeta `{flowId}` si no existe

### 3. Preparar Documentos para Envío

```typescript
// Convertir Documento[] (entidades) a Files
const files: File[] = documentos.map((doc) => {
  const mimeType =
    doc.mimeType || "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return new File([doc.blob], doc.nombre, {
    type: mimeType,
  });
});

// Crear FormData (igual que V2.5)
const formData = new FormData();
for (const file of files) {
  // ⚠️ IMPORTANTE: Key = file.size.toString() (igual que V2.5)
  formData.append(file.size.toString(), file, file.name);
}
```

**Nota**: El formato de FormData es igual que V2.5. Cada archivo se agrega con su tamaño como key.

### 4. Obtener Fecha de la Junta

```typescript
// Opción 1: Del store de downloadData (YA TENEMOS)
import { useDownloadData } from "~/composables/useDownloadData";

const { downloadData } = useDownloadData();
const fechaJunta = downloadData.value?.meetingDetails?.firstCall?.dateFormatted;
// Ejemplo: "8 de diciembre de 2025"

// Opción 2: Formatear desde Date
function formatearFecha(fecha: string | Date): string {
  const date = typeof fecha === "string" ? new Date(fecha) : fecha;
  const opciones: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("es-PE", opciones);
}

// Usar en nombre de carpeta
const nombreCarpeta = `Documentos Juntas: ${fechaJunta}`;
// Ejemplo: "Documentos Juntas: 8 de diciembre de 2025"
```

### 5. Enviar Documentos (V2)

```typescript
// Subir todos los archivos
await $fetch(`/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/core`, {
  ...withAuthHeaders(),
  method: "POST",
  body: formData,
  params: {
    name: nombreCarpeta, // "Documentos Juntas: 8 de diciembre de 2025"
  },
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

**Nota**: El endpoint es similar a V2.5, solo cambia:

- V2.5: `POST /repository/society/nodes/{nodeId}/core`
- V2: `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/core`

---

## ❓ DUDAS Y PREGUNTAS

### 1. Mapeo de IDs (RESUELTO ✅)

- ✅ **`structureId` = `societyId`** (son el mismo valor)

  - Cuando se crea una sociedad, el backend retorna `structureId`
  - Este valor se usa directamente como `societyId` en las rutas
  - No hay conversión ni mapeo adicional

- ✅ **`flowStructureId` = `flowId`** (son el mismo valor)
  - Cuando se crea una junta, el backend retorna `flowStructureId`
  - Este valor se usa directamente como `flowId` en las rutas
  - No hay conversión ni mapeo adicional

**Documentación**: Ver `docs/general/FLUJO-CREACION-SOCIEDADES-Y-JUNTAS.md`

### 2. Sistema de Almacenamiento vs Repositorio

- ❓ ¿Son el mismo sistema o sistemas diferentes?
  - Repositorio V2: `/api/v2/repository/...`
  - Almacenamiento: `/api/v2/repositorio/...` (diferente path)
- ❓ ¿Debemos usar endpoints del repositorio V2 o del almacenamiento?

**Acción**: Revisar si el sistema de almacenamiento es un wrapper o sistema diferente.

### 3. Estructura de Carpetas (RESUELTO)

- ✅ **El endpoint `GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder` crea automáticamente las carpetas padre**
- ✅ No necesitamos crear manualmente `/core/juntas/`

### 4. Registros (FUERA DE SCOPE)

- ℹ️ Los documentos de registros (acciones, acuerdos, facultades) se envían automáticamente al guardar
- ℹ️ No necesitan checkbox/opción manual
- ℹ️ **NO es parte de este issue** (solo juntas)

### 5. Duplicados (CONFIRMADO)

- ✅ **Los documentos duplicados se reemplazan automáticamente**
- ✅ No hay versionado
- ✅ No necesitamos verificar si existe antes de subir

---

## ✅ CHECKLIST FINAL

### Antes de Empezar

- [ ] Revisar documentación del backend
- [ ] Revisar documentación de V2.5
- [ ] Revisar estado actual del proyecto
- [ ] Resolver dudas con el equipo

### Durante la Implementación

- [ ] Seguir arquitectura hexagonal
- [ ] Crear tests unitarios (opcional)
- [ ] Documentar código
- [ ] Validar con el equipo

### Después de la Implementación

- [ ] Testing manual completo
- [ ] Validar reglas de negocio
- [ ] Documentar cambios
- [ ] Actualizar documentación

---

## 📝 NOTAS ADICIONALES

### Carpetas Personalizadas y Repositorio AI

**Estado**: NO implementado en esta fase

- ❌ Virtual Nodes (carpetas personalizadas)
- ❌ Conversations (chat IA)
- ❌ Repositorio AI

**Nota**: Estas funcionalidades se implementarán en fases futuras.

### Versionado de Documentos

**Estado**: NO implementado en esta fase

- ❌ Historial de versiones
- ❌ Descarga de versiones anteriores
- ❌ Revertir a versión anterior

**Nota**: Los documentos duplicados se reemplazan, no se versionan.

---

## 📊 RESUMEN: LO QUE SABEMOS Y LO QUE FALTA

### ✅ LO QUE YA SABEMOS (Claro)

1. **Código V2.5**:

   - ✅ Flujo completo de envío con `watch()`
   - ✅ Cómo convertir blobs a Files
   - ✅ Formato de FormData (key = file.size.toString())
   - ✅ Cómo combinar documentos generados + del flujo

2. **Endpoints V2**:

   - ✅ `GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder` - Obtener/crear carpeta
   - ✅ `POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core?name={nombre}` - Subir documentos

3. **Obtener IDs en V3**:

   - ✅ `societyId` y `flowId` desde `useJuntasNavbarRoutes()`
   - ✅ Fecha de la junta desde `downloadData.value?.meetingDetails?.firstCall?.dateFormatted`

4. **Reglas de Negocio**:
   - ✅ Todos los documentos van a `/core/juntas/{flowId}/`
   - ✅ Nombre de carpeta: `"Documentos Juntas: {Fecha de la Junta}"`
   - ✅ Duplicados se reemplazan automáticamente

### ❓ LO QUE FALTA CONFIRMAR (1 duda principal)

1. **Mapeo `societyId` → `structureId`**:
   - ❓ ¿Son el mismo valor?
   - ❓ ¿Viene en el store de la sociedad?
   - ❓ ¿Hay un endpoint de mapeo?

### 📝 EJEMPLO COMPLETO DE IMPLEMENTACIÓN

Basado en el código V2.5, aquí está cómo debería verse en V3:

```typescript
// app/composables/juntas/useEnviarDocumentosRepositorio.ts
import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";
import { useDownloadData } from "~/composables/useDownloadData";
import { useDocumentosGeneradosStore } from "~/core/presentation/juntas/documentos/stores/documentos-generados.store";

export const useEnviarDocumentosRepositorio = () => {
  const { societyId, flowId } = useJuntasNavbarRoutes();
  const { downloadData } = useDownloadData();
  const documentosStore = useDocumentosGeneradosStore();

  const isUploading = ref(false);
  const errorMessage = ref<string | null>(null);

  // ✅ CONFIRMADO: structureId = societyId (son el mismo valor)
  const structureId = computed(() => {
    return societyId.value; // "7" → "7"
  });

  // Obtener fecha de la junta
  const fechaJunta = computed(() => {
    return downloadData.value?.meetingDetails?.firstCall?.dateFormatted || "";
  });

  // Enviar documentos al repositorio
  const enviarDocumentos = async () => {
    if (!structureId.value || !flowId.value) {
      throw new Error("No se encontraron structureId o flowId");
    }

    if (!fechaJunta.value) {
      throw new Error("No se encontró la fecha de la junta");
    }

    const documentos = documentosStore.documentos;
    if (documentos.length === 0) {
      throw new Error("No hay documentos para enviar");
    }

    isUploading.value = true;
    errorMessage.value = null;

    try {
      // 1. Obtener/crear carpeta de junta
      const folderResponse = await $fetch<{
        success: boolean;
        data: { id: number; path: string };
      }>(
        `/api/v2/repository/society-profile/${structureId.value}/juntas/${flowId.value}/folder`,
        { ...withAuthHeaders() }
      );

      const folderId = folderResponse.data.id;

      // 2. Convertir documentos a Files
      const files: File[] = documentos.map((doc) => {
        return new File([doc.blob], doc.nombre, {
          type:
            doc.mimeType ||
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
      });

      // 3. Crear FormData
      const formData = new FormData();
      for (const file of files) {
        formData.append(file.size.toString(), file, file.name);
      }

      // 4. Construir nombre de carpeta
      const nombreCarpeta = `Documentos Juntas: ${fechaJunta.value}`;

      // 5. Subir documentos
      await $fetch(
        `/api/v2/repository/society-profile/${structureId.value}/nodes/${folderId}/core`,
        {
          ...withAuthHeaders(),
          method: "POST",
          body: formData,
          params: {
            name: nombreCarpeta,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 6. Mostrar éxito
      useToast().success("Documentos enviados al repositorio correctamente");
    } catch (error: any) {
      console.error("Error enviando documentos al repositorio:", error);
      errorMessage.value = error.message || "Error al enviar documentos";
      useToast().error(errorMessage.value);
      throw error;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    isUploading,
    errorMessage,
    enviarDocumentos,
  };
};
```

**Integración en el componente**:

```vue
<!-- app/components/juntas/documentos/JuntaDocumentosGenerados.vue -->
<script setup lang="ts">
  // ... imports existentes

  const { enviarDocumentos, isUploading } = useEnviarDocumentosRepositorio();
  const enviarAlRepositorio = ref(false);

  // Watch para enviar automáticamente cuando checkbox esté marcado
  watch(
    [() => documentos.value.length, () => enviarAlRepositorio.value],
    async ([docCount, shouldSend]) => {
      if (docCount > 0 && shouldSend && !isUploading.value) {
        try {
          await enviarDocumentos();
        } catch (error) {
          console.error("Error en envío automático:", error);
        }
      }
    }
  );
</script>

<template>
  <!-- ... contenido existente -->

  <!-- Checkbox Repositorio (HABILITADO) -->
  <div class="bg-white border rounded-xl p-6">
    <div class="flex items-start gap-3">
      <input
        v-model="enviarAlRepositorio"
        type="checkbox"
        id="sendToRepo"
        class="mt-1 w-4 h-4 rounded"
        style="accent-color: var(--primary-800)"
      />
      <label for="sendToRepo" class="text-sm">
        <span style="font-weight: 600">Enviar automáticamente al Repositorio Documental</span>
      </label>
    </div>
  </div>
</template>
```

---

**¿Todo claro para empezar, mi rey?** 🚀💪
