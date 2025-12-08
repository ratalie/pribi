# ❓ DUDAS ESPECÍFICAS: REPOSITORIO V3 - DOCUMENTOS DE JUNTAS

**Fecha**: 2 de Diciembre 2025  
**Estado**: ✅ **TODAS ACLARADAS** - Ver `GUIA-COMPLETA-REPOSITORIO-DOCUMENTOS-V3.md`  
**Contexto**: Implementación de generación y envío de documentos de juntas

---

## ✅ LO QUE SÍ TENGO CLARO

### 1. Endpoints del Repositorio (repo-ai)

**✅ Endpoints disponibles en V3**:

- `GET /repository/society/{societyId}/nodes/core` - Obtener estructura de carpetas
- `POST /repository/society/nodes/{nodeId}/core` - Subir múltiples archivos
- `POST /repository/society/nodes/{folderId}/documents` - Subir un documento

**✅ Base URL**: Los endpoints provienen de "repo-ai" y ya están disponibles en V3.

---

### 2. Estructura de Carpetas V3

**✅ Cambio principal**:

- **V2.5**: `/core/juntas/aumento capital/aporte dinerario/`
- **V3**: `/core/juntas/{flowId}/` (directo, sin subcarpetas por tipo)

**✅ Todos los documentos van juntos**:

- No se separan por tipo de flujo (aporte dinerario, capitalización, etc.)
- No se separan por tipo de punto de agenda
- **TODOS los documentos de una junta van a la misma carpeta**: `/core/juntas/{flowId}/`

**Ejemplo**:

```
/core/juntas/123/
├── acta.docx
├── convocatoria.docx
├── proxy-natural.docx
├── proxy-juridica.docx
├── certificacion.docx
├── lista-asistencia.docx
├── minuta-aporte-dinerario.docx
├── asiento-aporte-dinerario.docx
├── certificado-juan-perez.docx
├── certificado-maria-garcia.docx
├── aceptacion-director-1.docx
└── aceptacion-director-2.docx
```

---

## ❓ MIS DUDAS ESPECÍFICAS

### 🔴 Duda 1: ¿Cómo obtener el `folderId` de `/core/juntas/{flowId}/`?

**Pregunta crítica**:

- ¿El backend crea automáticamente la carpeta `/core/juntas/{flowId}/` cuando se crea una junta?
- ¿O necesito buscarla/crearla manualmente?

**Lo que necesito implementar**:

```typescript
async function obtenerFolderIdJunta(societyId: number, flowId: number): Promise<number> {
  // ¿Cómo obtengo el folderId de /core/juntas/123/?
  // Opción A: El backend ya la creó → Buscarla
  // Opción B: El backend NO la creó → Crearla
  // Opción C: Otro método
}
```

**Opciones que veo**:

**Opción A**: Buscar carpeta existente

```typescript
const folders = await getNodeBySociety(societyId);
const folderId = folders.data.find(
  (f) => f.path === `/core/juntas/${flowId}/` && f.type === "folder"
)?.id;
```

**Opción B**: Crear carpeta si no existe

```typescript
// 1. Buscar carpeta padre "/core/juntas/"
const parentFolder = folders.data.find(
  (f) => f.path === "/core/juntas/" && f.type === "folder"
);

// 2. Crear carpeta hijo "/core/juntas/{flowId}/"
const newFolder = await createFolder(parentFolder.id, flowId.toString());
```

**Opción C**: El backend la crea automáticamente

```typescript
// Solo buscar, nunca crear
const folderId = await buscarFolderJunta(societyId, flowId);
```

**¿Cuál es la opción correcta?** 🤔

---

### 🔴 Duda 2: ¿Los documentos van TODOS directo a `/core/juntas/{flowId}/`?

**Pregunta**:

- ¿Los documentos van TODOS directo a `/core/juntas/{flowId}/`?
- ¿O hay subcarpetas opcionales?

**Estructura que entiendo (según tu aclaración)**:

```
/core/juntas/{flowId}/
├── acta.docx                    ← Acta principal
├── convocatoria.docx            ← Documento no-punto
├── proxy-natural.docx           ← Documento no-punto
├── certificacion.docx           ← Documento no-punto
├── minuta-aporte-dinerario.docx ← Documento por punto
├── asiento-aporte-dinerario.docx ← Documento por punto
├── aceptacion-director-1.docx   ← Documento por punto
└── ... (todos juntos)
```

**¿Es correcto esto?** ✅

---

### 🟡 Duda 3: ¿El parámetro `name` en `POST /repository/society/nodes/{nodeId}/core`?

**Pregunta**:

- En V2.5, se usaba `POST /repository/society/nodes/{nodeId}/core?name=Documentos Aporte Dinerario`
- ¿En V3, qué valor debo usar para `name`?
- ¿Es opcional o requerido?

**Ejemplo de código**:

```typescript
// ¿Qué name usar?
await postFilesToNode(
  files,
  folderId,
  "Documentos Junta 123" // ← ¿Este?
);
// o
await postFilesToNode(
  files,
  folderId,
  "Documentos Generados" // ← ¿Este?
);
// o
await postFilesToNode(
  files,
  folderId // ← ¿Sin name?
);
```

**¿Qué valor debo usar?** 🤔

---

### 🟡 Duda 4: ¿Cómo se manejan documentos duplicados?

**Pregunta**:

- Si genero el acta dos veces, ¿qué pasa?
- ¿Se reemplaza el archivo anterior?
- ¿Se crea una nueva versión?
- ¿Se crea un archivo con nombre diferente (ej: `acta-v2.docx`)?

**Escenario**:

```typescript
// Primera vez: genero y subo acta.docx
await generarYSubirActa(societyId, flowId);
// → /core/juntas/123/acta.docx

// Segunda vez: genero y subo acta.docx (mismo nombre)
await generarYSubirActa(societyId, flowId);
// → ¿Qué pasa?
// Opción A: Se reemplaza acta.docx
// Opción B: Se crea acta-v2.docx
// Opción C: El backend maneja versionado automáticamente
// Opción D: Error porque ya existe
```

**¿Cuál es el comportamiento esperado?** 🤔

---

### 🟢 Duda 5: ¿Los endpoints son exactamente los mismos que V2.5?

**Pregunta**:

- ¿Los endpoints `/repository/society/...` son los mismos en V3?
- ¿O hay cambios en la estructura de request/response?

**Endpoints que voy a usar**:

```typescript
// ¿Son estos los correctos?
GET / repository / society / { societyId } / nodes / core;
POST / repository / society / nodes / { nodeId } / core;
POST / repository / society / nodes / { folderId } / documents;
```

**¿O hay endpoints diferentes en V3?** 🤔

---

### 🟢 Duda 6: ¿Categorización es solo visual?

**Pregunta**:

- En la vista de descarga, los documentos se muestran categorizados:

  - "Acta Principal"
  - "Detalles de la Junta"
  - "Acuerdos: Aumento de Capital"
  - "Acuerdos: Nombramientos"
  - etc.

- ¿Esta categorización es SOLO visual en la vista?
- ¿O también se refleja en la estructura del repositorio (subcarpetas)?

**Entiendo que**:

- ✅ Categorización es SOLO visual (para organizar en la vista)
- ✅ En el repositorio, TODO va a `/core/juntas/{flowId}/` (sin subcarpetas)

**¿Es correcto?** ✅

---

## 📋 RESUMEN DE DUDAS

| #   | Pregunta                                                  | Prioridad    | Estado                                               |
| --- | --------------------------------------------------------- | ------------ | ---------------------------------------------------- |
| 1   | ¿Cómo obtener folderId de `/core/juntas/{flowId}/`?       | 🔴 **ALTA**  | ✅ **ACLARADO** - Buscar con GET, crear si no existe |
| 2   | ¿Documentos van TODOS directo a `/core/juntas/{flowId}/`? | 🔴 **ALTA**  | ✅ **CONFIRMADO** - Sí, todos directo                |
| 3   | ¿Qué valor usar para parámetro `name`?                    | 🟡 **MEDIA** | ✅ **ACLARADO** - `"Documentos Juntas: {Fecha}"`     |
| 4   | ¿Cómo se manejan documentos duplicados?                   | 🟡 **MEDIA** | ✅ **ACLARADO** - Se reemplazan                      |
| 5   | ¿Endpoints son exactamente los mismos?                    | 🟢 **BAJA**  | ✅ **CONFIRMADO** - Sí, de repo-ai                   |
| 6   | ¿Categorización es solo visual?                           | 🟢 **BAJA**  | ✅ **CONFIRMADO** - Sí, solo visual                  |

---

## ✅ RESPUESTAS ACLARADAS

### 1. ¿Cómo obtener folderId?

**Respuesta**:

- Buscar carpeta con `GET /repository/society/{societyId}/nodes/core`
- Filtrar por `path === "/core/juntas/{flowId}/"`
- Si no existe, crearla con `POST /repository/society/nodes/{parentNodeId}/folder`

### 2. ¿Documentos van TODOS directo?

**Respuesta**: ✅ **SÍ**, todos van directo a `/core/juntas/{flowId}/`

### 3. ¿Qué valor usar para `name`?

**Respuesta**: `"Documentos Juntas: {Fecha de la Junta}"`

- Ejemplo: `"Documentos Juntas: 15 de enero de 2025"`
- Solo la fecha, nada más

### 4. ¿Cómo se manejan duplicados?

**Respuesta**: Se reemplazan. No hay versionado automático.

### 5. ¿Endpoints son exactamente los mismos?

**Respuesta**: ✅ **SÍ**, provienen de repo-ai y están disponibles en V3

### 6. ¿Categorización es solo visual?

**Respuesta**: ✅ **SÍ**, solo visual en la vista. No se refleja en el repositorio.

---

## 🎯 LO QUE NECESITO PARA IMPLEMENTAR

### Función Principal que Necesito

```typescript
/**
 * Obtiene o crea la carpeta del repositorio para una junta
 * @param societyId - ID de la sociedad
 * @param flowId - ID del flujo/junta
 * @returns folderId de la carpeta /core/juntas/{flowId}/
 */
async function obtenerFolderIdJunta(societyId: number, flowId: number): Promise<number> {
  // ¿Cómo implementar esto?
  // 1. ¿Buscar carpeta existente?
  // 2. ¿Crear carpeta si no existe?
  // 3. ¿El backend ya la creó automáticamente?
}
```

### Función de Envío que Necesito

```typescript
/**
 * Envía todos los documentos generados al repositorio
 * @param societyId - ID de la sociedad
 * @param flowId - ID del flujo/junta
 * @param documentos - Array de documentos generados (blobs)
 */
async function enviarDocumentosAlRepositorio(
  societyId: number,
  flowId: number,
  documentos: DocumentoGenerado[]
): Promise<void> {
  // 1. Obtener folderId
  const folderId = await obtenerFolderIdJunta(societyId, flowId);

  // 2. Convertir blobs a Files
  const files = documentos.map(
    (doc) => new File([doc.blob], doc.nombre, { type: doc.mimeType })
  );

  // 3. Subir todos los archivos
  await postFilesToNode(
    files,
    folderId,
    "¿Qué name usar aquí?" // ← Duda 3
  );
}
```

---

## ✅ PRÓXIMOS PASOS

1. **Esperar tus aclaraciones** sobre estas dudas específicas
2. **Actualizar documentación** con las respuestas
3. **Implementar funciones** según las aclaraciones
4. **Probar integración** con el repositorio

---

## 📚 DOCUMENTACIÓN COMPLETA

**Todas las dudas han sido aclaradas**. Ver documentación completa en:

👉 **`docs/juntas/GUIA-COMPLETA-REPOSITORIO-DOCUMENTOS-V3.md`**

Este documento incluye:

- ✅ Cómo obtener `societyId` y `flowId`
- ✅ Estructura completa del repositorio
- ✅ Endpoints y cómo usarlos
- ✅ Flujo completo de envío
- ✅ Implementación técnica con código
- ✅ Manejo de duplicados
- ✅ Ejemplos de código completos

---

**¡Todo claro ahora, mi rey!** 🚀💪
