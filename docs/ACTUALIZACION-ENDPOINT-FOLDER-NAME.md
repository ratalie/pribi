# 📝 Actualización: Endpoint con folderName

## ✅ Cambios Implementados

### Backend Actualizado

El endpoint ahora acepta un parámetro opcional `folderName` en el query string:

```
GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder?folderName={nombre}
```

**Comportamiento**:
- Si se proporciona `folderName`: Crea/obtiene la carpeta con ese nombre directamente
- Si NO se proporciona: Usa `flowId.toString()` como nombre (comportamiento anterior)

---

### Frontend Actualizado

#### 1. Port Actualizado

```typescript
// app/core/hexag/repositorio/domain/ports/repositorio-documentos.repository.ts
obtenerFolderIdJunta(
  structureId: string, 
  flowId: string, 
  folderName?: string  // ← NUEVO: Opcional
): Promise<number>;
```

#### 2. Implementación HTTP Actualizada

```typescript
// app/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository.ts
async obtenerFolderIdJunta(
  structureId: string, 
  flowId: string, 
  folderName?: string
): Promise<number> {
  let url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder`;
  
  // Si se proporciona folderName, agregarlo como query parameter
  if (folderName) {
    url += `?folderName=${encodeURIComponent(folderName)}`;
  }
  
  // ... resto del código
}
```

#### 3. Use Case Simplificado

**ANTES** (2 pasos):
```typescript
// 1. Obtener carpeta con flowId
const folderId = await obtenerFolderIdJunta(structureId, flowId);

// 2. Renombrar carpeta
await actualizarNodo(folderId, { name: fechaJuntaLegible });
```

**AHORA** (1 paso):
```typescript
// 1. Obtener/crear carpeta directamente con el nombre de la fecha
const folderId = await obtenerFolderIdJunta(
  structureId, 
  flowId, 
  fechaJuntaLegible // "20 de diciembre del 2025"
);
```

---

## 🎯 Ventajas

1. **Menos requests**: Un solo request en lugar de dos (obtener + renombrar)
2. **Más eficiente**: El backend crea la carpeta con el nombre correcto desde el inicio
3. **Más simple**: No necesitas renombrar después
4. **Consistente**: El nombre se establece al crear, no después

---

## 📋 Ejemplo de Uso

```typescript
import { useEnviarDocumentosRepositorio } from '~/composables/useEnviarDocumentosRepositorio';

const { enviarDocumentos } = useEnviarDocumentosRepositorio();

// El composable ya maneja todo internamente:
// 1. Obtiene la fecha legible de la junta
// 2. Llama a obtenerFolderIdJunta con folderName
// 3. Sube los documentos directamente a la carpeta

await enviarDocumentos();
```

---

## 🔄 Compatibilidad

- **Retrocompatible**: Si no pasas `folderName`, funciona como antes (usa flowId)
- **Nuevo comportamiento**: Si pasas `folderName`, crea la carpeta con ese nombre directamente

---

## ✅ Resultado

Ahora cuando envíes documentos:
1. Se crea/obtiene la carpeta con el nombre "20 de diciembre del 2025" directamente
2. Los documentos se suben a esa carpeta
3. **NO se crean subcarpetas**
4. **NO se renombra después** (ya viene con el nombre correcto)


