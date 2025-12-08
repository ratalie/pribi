# 📚 GUÍA COMPLETA: Repositorio V3 con Backend V2

**Fecha**: 7 de Diciembre 2025  
**Estado**: Guía Completa ✅  
**Contexto**: Integración del repositorio V3 con el sistema V2 (flows-v2)

---

## 🎯 ENTENDIENDO LOS IDs EN V2

### **¿Qué es `structureId`?**

Cuando creas una sociedad en V2:

```http
POST /api/v2/society-profile
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Sociedad creada correctamente.",
  "data": {
    "structureId": 7  // ← Este es el ID de SocietyProfileStructureV2
  }
}
```

**Relación de IDs:**

```
structureId (Int)
  ↓
SocietyProfileStructureV2.id = 7
  ↓
SocietyProfileStructureV2.societyProfileId (UUID)
  ↓
SocietyProfileV2.id = "019af8bf-4626-76a4-a8f2-4df22a11b47d"
```

**Esquema Prisma:**
```prisma
model SocietyProfileStructureV2 {
  id               Int      @id @default(autoincrement())  // ← structureId
  societyProfileId String   @unique @db.Uuid              // ← SocietyProfileV2.id
  // ...
}

model SocietyProfileV2 {
  id        String @id @db.Uuid  // ← UUID de la sociedad
  structure SocietyProfileStructureV2?
  // ...
}
```

---

## 🔍 CÓMO OBTENER `SocietyProfileV2.id` DESDE `structureId`

### **Opción 1: Endpoint GET (Recomendado)**

```typescript
/**
 * Obtiene el SocietyProfileV2.id desde structureId
 */
async function obtenerSocietyProfileIdV2(structureId: number): Promise<string> {
  const response = await fetch(`/api/v2/society-profile/${structureId}`);
  const { data } = await response.json();
  
  // El endpoint debería retornar el societyProfileId
  return data.societyProfileId; // UUID
}
```

**Endpoint necesario:**
```http
GET /api/v2/society-profile/:structureId
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": 7,
    "societyProfileId": "019af8bf-4626-76a4-a8f2-4df22a11b47d",  // ← UUID
    "currentStep": "datos-sociedad",
    // ...
  }
}
```

---

### **Opción 2: Consulta Directa (Si tienes acceso)**

```typescript
// SELECT societyProfileId FROM SocietyProfileStructureV2 WHERE id = structureId
```

---

## 🚨 PROBLEMA: Repositorio V1 vs V2

### **El Problema Completo**

```
V2 (Tu Sistema Actual):
├── structureId (Int) → SocietyProfileStructureV2.id
├── societyProfileId (UUID) → SocietyProfileV2.id
└── flowId (Int) → SocietyGeneralFlowStructureV2.id

Repositorio V1 (Sistema Antiguo):
└── societyId (Int) → SocietyProfile.id
```

**Incompatibilidad:**
- ❌ Repositorio solo acepta `Int` (V1)
- ❌ V2 usa `UUID` (String)
- ❌ No hay relación directa entre V1 y V2

---

## ✅ SOLUCIONES PROPUESTAS

### **Solución 1: Endpoint de Mapeo (RECOMENDADO - Corto Plazo)**

**Crear endpoint en el backend:**

```http
GET /api/v2/society-profile/:structureId/repository-id
```

**Implementación backend:**

```typescript
@Get(':structureId/repository-id')
async getRepositoryId(@Param('structureId', ParseIntPipe) structureId: number) {
  // 1. Obtener SocietyProfileV2.id desde structureId
  const structure = await prisma.societyProfileStructureV2.findUnique({
    where: { id: structureId },
    select: { 
      societyProfileId: true,
      societyProfile: {
        select: {
          displayName: true,
          studyId: true
        }
      }
    }
  });
  
  if (!structure) {
    throw new NotFoundException('Structure not found');
  }
  
  // 2. Buscar o crear SocietyProfile en V1
  let societyV1 = await prisma.societyProfile.findFirst({
    where: {
      displayName: structure.societyProfile.displayName,
      studyId: parseInt(structure.societyProfile.studyId) // ⚠️ Necesitas mapear StudyV2 → Study
    }
  });
  
  // 3. Si no existe, crear uno nuevo
  if (!societyV1) {
    societyV1 = await prisma.societyProfile.create({
      data: {
        displayName: structure.societyProfile.displayName,
        studyId: parseInt(structure.societyProfile.studyId), // ⚠️ Mapeo necesario
        // ... otros campos por defecto
      }
    });
    
    // 4. Crear estructura de carpetas del repositorio
    await frNodeManager.createSocietyRootFolders(societyV1.id, {
      storageLimitInBytes: 1024 * 1024 * 20, // 20 MB
    });
  }
  
  return {
    repositoryId: societyV1.id,  // Int para el repositorio
    societyProfileIdV2: structure.societyProfileId  // UUID de V2
  };
}
```

**Uso en frontend:**

```typescript
/**
 * Obtiene el ID del repositorio V1 desde structureId V2
 */
async function obtenerRepositoryId(structureId: number): Promise<number> {
  const response = await fetch(`/api/v2/society-profile/${structureId}/repository-id`);
  const { repositoryId } = await response.json();
  return repositoryId; // Int para usar con el repositorio
}
```

---

### **Solución 2: Adaptar Repositorio para V2 (LARGO PLAZO)**

**Modificar schema del repositorio:**

```prisma
model Node {
  id          Int      @id @default(autoincrement())
  societyId   Int?     // Para V1 (mantener compatibilidad)
  societyIdV2 String?  @db.Uuid  // Para V2 (nuevo)
  // ...
  
  @@index([societyId])
  @@index([societyIdV2])
}
```

**Modificar endpoints:**

```typescript
// Endpoint que acepta UUID (V2) o Int (V1)
GET /api/v1/repository/society/{societyId}/nodes/core
// societyId puede ser UUID (V2) o Int (V1)
// El backend detecta automáticamente el tipo
```

**⚠️ ESTO REQUIERE:** Cambios significativos en el backend del repositorio.

---

## 📝 IMPLEMENTACIÓN COMPLETA PARA EL FRONTEND

### **Función Principal:**

```typescript
/**
 * Obtiene o crea la carpeta del repositorio para una junta V2
 * 
 * @param structureId - ID de la estructura (SocietyProfileStructureV2.id)
 * @param flowId - ID numérico del flujo/junta (SocietyGeneralFlowStructureV2.id)
 * @returns folderId de la carpeta /core/juntas/{flowId}/
 */
async function obtenerOCrearFolderJuntaV2(
  structureId: number,
  flowId: number
): Promise<number> {
  // 1. Obtener ID del repositorio V1
  const repositoryId = await obtenerRepositoryId(structureId);
  
  // 2. Obtener todos los nodos core de la sociedad
  const response = await fetch(`/api/v1/repository/society/${repositoryId}/nodes/core`);
  const { data: nodes } = await response.json();
  
  // 3. Buscar carpeta padre "/core/juntas/"
  const carpetaJuntas = nodes.find(
    (node: any) => node.path === "/core/juntas/" && node.type === "folder"
  );
  
  if (!carpetaJuntas) {
    throw new Error("Carpeta /core/juntas/ no encontrada. La sociedad debe tener estructura inicial.");
  }
  
  // 4. Buscar carpeta hijo "/core/juntas/{flowId}/"
  const carpetaFlow = nodes.find(
    (node: any) => 
      node.path === `/core/juntas/${flowId}/` && 
      node.type === "folder" &&
      node.parentId === carpetaJuntas.id
  );
  
  // 5. Si existe, retornar su ID
  if (carpetaFlow) {
    return carpetaFlow.id;
  }
  
  // 6. Si NO existe, crearla
  const createResponse = await fetch(
    `/api/v1/repository/society/${repositoryId}/nodes/${carpetaJuntas.id}/folder`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: flowId.toString(),
        description: `Documentos de la junta ${flowId}`
      })
    }
  );
  
  const { data: nuevaCarpeta } = await createResponse.json();
  return nuevaCarpeta.id;
}
```

---

### **Función de Envío de Documentos:**

```typescript
/**
 * Envía documentos al repositorio para una junta V2
 * 
 * @param structureId - ID de la estructura (SocietyProfileStructureV2.id)
 * @param flowId - ID numérico del flujo/junta
 * @param documentos - Array de documentos generados (blobs)
 */
async function enviarDocumentosAlRepositorioV2(
  structureId: number,
  flowId: number,
  documentos: DocumentoGenerado[]
): Promise<void> {
  // 1. Obtener folderId
  const folderId = await obtenerOCrearFolderJuntaV2(structureId, flowId);
  
  // 2. Obtener repositoryId
  const repositoryId = await obtenerRepositoryId(structureId);
  
  // 3. Convertir blobs a Files
  const files = documentos.map(doc => 
    new File([doc.blob], doc.nombre, { type: doc.mimeType })
  );
  
  // 4. Crear FormData
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  
  // 5. Subir todos los archivos
  await fetch(
    `/api/v1/repository/society/${repositoryId}/nodes/${folderId}/upload`,
    {
      method: "POST",
      body: formData,
      // No incluir Content-Type, el navegador lo hará automáticamente
    }
  );
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Backend (URGENTE):**

- [ ] **Crear endpoint:** `GET /api/v2/society-profile/:structureId/repository-id`
  - Obtener `SocietyProfileV2.id` desde `structureId`
  - Buscar `SocietyProfile` (V1) por `displayName` + `studyId`
  - Crear `SocietyProfile` (V1) si no existe
  - Crear estructura de carpetas del repositorio si es nueva
  - Retornar `repositoryId` (Int)

- [ ] **Modificar endpoint:** `GET /api/v2/society-profile/:structureId`
  - Incluir `societyProfileId` en la respuesta

- [ ] **Mapeo StudyV2 → Study:**
  - Crear función para mapear `StudyV2.id` (UUID) → `Study.id` (Int)
  - O incluir `studyId` numérico en la respuesta

### **Frontend:**

- [ ] Implementar función `obtenerRepositoryId(structureId: number)`
- [ ] Implementar función `obtenerOCrearFolderJuntaV2(structureId, flowId)`
- [ ] Implementar función `enviarDocumentosAlRepositorioV2(...)`
- [ ] Manejar errores cuando el mapeo falla
- [ ] Manejar errores cuando la carpeta no existe
- [ ] Probar integración completa

---

## 🎯 RESUMEN DE LO QUE NECESITAS

### **1. Endpoint de Mapeo (Backend)**

```http
GET /api/v2/society-profile/:structureId/repository-id
```

**Retorna:**
```json
{
  "repositoryId": 5,  // Int para usar con el repositorio
  "societyProfileIdV2": "019af8bf-4626-76a4-a8f2-4df22a11b47d"  // UUID de V2
}
```

### **2. Función Helper (Frontend)**

```typescript
async function obtenerRepositoryId(structureId: number): Promise<number> {
  const response = await fetch(`/api/v2/society-profile/${structureId}/repository-id`);
  const { repositoryId } = await response.json();
  return repositoryId;
}
```

### **3. Uso en el Flujo**

```typescript
// Cuando creas una sociedad
const { structureId } = await crearSociedad();
// structureId = 7

// Cuando necesitas usar el repositorio
const repositoryId = await obtenerRepositoryId(structureId);
// repositoryId = 5 (Int para el repositorio)

// Usar repositoryId con endpoints del repositorio
await fetch(`/api/v1/repository/society/${repositoryId}/nodes/core`);
```

---

## 📚 REFERENCIAS

- **Schema Prisma:** `prisma/schema.prisma`
  - `SocietyProfileStructureV2` (línea 1508)
  - `SocietyProfileV2` (línea 1431)
  - `Node` (línea 651)

- **Controller V2:** `src/modules/flows-v2/register-society-profile/0.initiate-registration/presentation/controller/initiate-registration.controller.ts`

- **Repositorio:** `src/modules/file-repository/infrastructure/facades/fr-node-manager.facade.impl.ts`

---

**¿Necesitas ayuda para implementar el endpoint de mapeo en el backend?** 🙏

