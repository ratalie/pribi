# ❓ DUDAS Y ACLARACIONES: ESTRUCTURA DE REPOSITORIO V3

**Fecha**: 2 de Diciembre 2025  
**Estado**: Preguntas para Aclarar ⏳

---

## ✅ LO QUE SÍ TENGO CLARO

### 1. Endpoints del Repositorio

**✅ Endpoints disponibles en V3 (repo-ai)**:
- `GET /repository/society/{societyId}/nodes/core` - Obtener estructura de carpetas
- `POST /repository/society/nodes/{nodeId}/core` - Subir múltiples archivos
- `POST /repository/society/nodes/{folderId}/documents` - Subir un documento

### 2. Estructura de Carpetas V3

**✅ Cambio principal**:
- **V2.5**: `/core/juntas/aumento capital/aporte dinerario/`
- **V3**: `/core/juntas/{flowId}/` (directo, sin subcarpetas por tipo)

**✅ Todos los documentos van juntos**:
- No se separan por tipo de flujo (aporte dinerario, capitalización, etc.)
- Todos los documentos de una junta van a la misma carpeta

---

## ❓ DUDAS QUE NECESITO ACLARAR

### 1. ¿Cómo obtener el folderId de `/core/juntas/{flowId}/`?

**Pregunta**:
- ¿El backend crea automáticamente la carpeta `/core/juntas/{flowId}/` cuando se crea una junta?
- ¿O necesito buscarla/crearla manualmente usando `GET /repository/society/{societyId}/nodes/core`?

**Ejemplo de lo que necesito**:
```typescript
// ¿Cómo obtengo el folderId de /core/juntas/123/?
const folderId = await obtenerFolderIdJunta(societyId, flowId);
// folderId = 456 (por ejemplo)
```

**Opciones**:
- **Opción A**: El backend crea la carpeta automáticamente al crear la junta
- **Opción B**: Necesito buscarla con `GET /repository/society/{societyId}/nodes/core` filtrando por `path === "/core/juntas/{flowId}/"`
- **Opción C**: Necesito crearla manualmente con `POST /repository/society/nodes/{parentNodeId}/folder`

---

### 2. ¿Hay subcarpetas dentro de `/core/juntas/{flowId}/`?

**Pregunta**:
- ¿Los documentos van TODOS directo a `/core/juntas/{flowId}/`?
- ¿O hay subcarpetas opcionales como:
  - `/core/juntas/{flowId}/documentos generados/`
  - `/core/juntas/{flowId}/puntos de acuerdo/`

**Ejemplo de estructura**:
```
Opción A (TODO directo):
/core/juntas/123/
├── acta.docx
├── convocatoria.docx
├── minuta-aporte-dinerario.docx
└── ...

Opción B (Con subcarpetas):
/core/juntas/123/
├── documentos generados/
│   ├── acta.docx
│   ├── convocatoria.docx
│   └── ...
└── puntos de acuerdo/
    ├── aporte-dinerario/
    │   ├── minuta.docx
    │   └── asiento.docx
    └── nombramiento-directores/
        └── aceptacion.docx
```

**¿Cuál es la estructura real en V3?**

---

### 3. ¿Cómo se relaciona la categorización de la vista con la estructura del repositorio?

**Pregunta**:
- En la vista de descarga, los documentos se muestran categorizados:
  - "Acta Principal"
  - "Detalles de la Junta"
  - "Acuerdos: Aumento de Capital"
  - "Acuerdos: Nombramientos"
  - etc.

- ¿Esta categorización es SOLO visual en la vista?
- ¿O también se refleja en la estructura del repositorio (subcarpetas)?

**Ejemplo**:
```typescript
// Vista muestra:
📄 ACTA PRINCIPAL
   └─ acta.docx

📝 ACUERDOS: AUMENTO DE CAPITAL
   ├─ minuta.docx
   └─ asiento.docx

// ¿En el repositorio?
// Opción A: Todo en /core/juntas/123/ (sin subcarpetas)
// Opción B: Subcarpetas que reflejan las categorías
```

---

### 4. ¿El parámetro `name` en `POST /repository/society/nodes/{nodeId}/core`?

**Pregunta**:
- En V2.5, se usaba `POST /repository/society/nodes/{nodeId}/core?name=Documentos Aporte Dinerario`
- ¿En V3, qué valor debo usar para `name`?
- ¿Es opcional o requerido?

**Ejemplo**:
```typescript
// ¿Qué name usar?
await postFilesToNode(files, folderId, "Documentos Junta 123");
// o
await postFilesToNode(files, folderId, "Documentos Generados");
// o
await postFilesToNode(files, folderId); // sin name
```

---

### 5. ¿Cómo se manejan documentos duplicados?

**Pregunta**:
- Si genero el acta dos veces, ¿se reemplaza o se crea una nueva versión?
- ¿El backend maneja versionado automáticamente?
- ¿O debo validar antes de subir?

**Ejemplo**:
```typescript
// Primera vez: subo acta.docx
// Segunda vez: ¿qué pasa?
// - ¿Se reemplaza?
// - ¿Se crea acta-v2.docx?
// - ¿Se crea nueva versión en el mismo documento?
```

---

### 6. ¿Los endpoints son exactamente los mismos que V2.5?

**Pregunta**:
- ¿Los endpoints `/repository/society/...` son los mismos en V3?
- ¿O hay cambios en la estructura de request/response?
- ¿Necesito usar `/api/v3/...` o sigue siendo `/repository/...`?

**Ejemplo**:
```typescript
// ¿V2.5 y V3 usan los mismos endpoints?
GET /repository/society/{societyId}/nodes/core
POST /repository/society/nodes/{nodeId}/core

// ¿O V3 tiene endpoints diferentes?
GET /api/v3/repository/society/{societyId}/nodes/core
POST /api/v3/repository/society/nodes/{nodeId}/core
```

---

## 📋 RESUMEN DE DUDAS

| # | Pregunta | Prioridad |
|---|----------|-----------|
| 1 | ¿Cómo obtener folderId de `/core/juntas/{flowId}/`? | 🔴 Alta |
| 2 | ¿Hay subcarpetas dentro de `/core/juntas/{flowId}/`? | 🔴 Alta |
| 3 | ¿Categorización es solo visual o también en repositorio? | 🟡 Media |
| 4 | ¿Qué valor usar para parámetro `name`? | 🟡 Media |
| 5 | ¿Cómo se manejan documentos duplicados? | 🟡 Media |
| 6 | ¿Endpoints son exactamente los mismos? | 🟢 Baja |

---

## 🎯 PRÓXIMOS PASOS

1. **Esperar aclaraciones del usuario** sobre estas dudas
2. **Actualizar documentación** con las respuestas
3. **Implementar lógica de repositorio** según las aclaraciones

---

**¿Puedes ayudarme a aclarar estas dudas, mi rey?** 🙏

