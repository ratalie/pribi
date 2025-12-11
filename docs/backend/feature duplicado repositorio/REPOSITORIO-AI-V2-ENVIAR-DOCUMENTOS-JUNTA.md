# 📁 Repositorio AI V2 - Enviar Documentos a Carpeta de Junta

**Versión:** 2.0  
**Fecha:** 2025-01-XX

---

## 📋 PROBLEMA

Cuando envías documentos desde el frontend, necesitas:
1. **Enviar documentos a una carpeta de junta específica** (ej: "20-12-2024")
2. **Si la carpeta no existe, que se cree automáticamente**
3. **Identificar la carpeta por nombre personalizado** en lugar de solo por flowId

---

## ✅ SOLUCIÓN

### **Paso 1: Obtener o Crear Carpeta de Junta**

Antes de subir documentos, primero obtén o crea la carpeta de junta con el nombre que necesites:

```typescript
// Endpoint: GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder?folderName={nombre}

const getOrCreateJuntaFolder = async (
  structureId: number,
  flowId: number,
  folderName?: string // Nombre personalizado (ej: "20-12-2024")
): Promise<FolderNode> => {
  const url = `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder`;
  const params = folderName ? `?folderName=${encodeURIComponent(folderName)}` : '';

  const response = await fetch(`${url}${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  return result.data; // { id, name, code, parentId, ... }
};
```

**Ejemplo de uso:**

```typescript
// Opción 1: Usar nombre personalizado
const folder = await getOrCreateJuntaFolder(
  structureId,
  flowId,
  '20-12-2024' // Nombre personalizado
);
// Si no existe, se crea automáticamente con este nombre

// Opción 2: Usar flowId como nombre (comportamiento por defecto)
const folder = await getOrCreateJuntaFolder(
  structureId,
  flowId
  // Sin folderName, usa flowId.toString() como nombre
);
```

**Response:**

```typescript
{
  success: true,
  message: "Carpeta de junta \"20-12-2024\" obtenida o creada exitosamente",
  data: {
    id: 34,
    code: "809b2bac-7fd2-4a64-aae1-445ff43f1f26",
    name: "20-12-2024", // ← Nombre personalizado
    parentId: 5,
    type: 1, // Carpeta
    path: "/core/juntas/",
    isCore: true,
    // ... más campos
  }
}
```

---

### **Paso 2: Subir Documentos a la Carpeta**

Una vez que tienes el `id` de la carpeta, sube los documentos:

```typescript
const uploadDocumentToJunta = async (
  structureId: number,
  folderId: number, // ID de la carpeta obtenida en el paso 1
  file: File
): Promise<UploadFileResponse> => {
  const formData = new FormData();
  const fileFieldUUID = crypto.randomUUID();
  formData.append(fileFieldUUID, file);

  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents`,
    {
      method: 'POST',
      headers: {
        'x-file-size': file.size.toString(),
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return response.json();
};
```

---

## 🔄 FLUJO COMPLETO

### **Ejemplo Completo: Subir Documentos a Junta con Verificación de Duplicados** ⭐ **MEJORADO**

```typescript
// 1. Obtener o crear carpeta de junta con nombre personalizado
const folder = await getOrCreateJuntaFolder(
  structureId,
  flowId,
  '20-12-2024' // Nombre de la junta
);

console.log('Carpeta ID:', folder.id); // Ej: 34

// 2. Verificar duplicados y subir documentos
const files = [file1, file2, file3];

for (const file of files) {
  // Verificar si el documento ya existe
  const checkResult = await checkDocumentDuplicate(
    structureId,
    folder.id,
    file.name
  );

  if (checkResult.exists) {
    // Mostrar opciones al usuario
    const userChoice = await showDuplicateModal({
      fileName: file.name,
      existingDocument: checkResult.document,
    });

    if (userChoice === 'crear-nueva-version') {
      // Crear nueva versión del documento existente
      await uploadNewVersion(
        checkResult.document!.documentCode,
        file
      );
    } else if (userChoice === 'cancelar') {
      console.log(`Documento ${file.name} cancelado por el usuario`);
      continue;
    }
  } else {
    // No existe, subir normalmente
    const result = await uploadDocumentToJunta(
      structureId,
      folder.id,
      file
    );
    console.log('Documento subido:', result.data.node.name);
  }
}
```

### **Función Helper: Verificar Duplicado**

```typescript
const checkDocumentDuplicate = async (
  structureId: number,
  folderId: number,
  fileName: string
): Promise<{
  exists: boolean;
  document: any | null;
}> => {
  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents/check?fileName=${encodeURIComponent(fileName)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();
  return result.data;
};
```

---

## 📝 COMPOSABLE NUXT 4

```typescript
// composables/useJuntaDocuments.ts
export const useJuntaDocuments = () => {
  const { token } = useAuth();
  const route = useRoute();
  
  const structureId = computed(() => 
    Number(route.params.structureId)
  );

  const getOrCreateJuntaFolder = async (
    flowId: number,
    folderName?: string
  ) => {
    const url = `/api/v2/repository/society-profile/${structureId.value}/juntas/${flowId}/folder`;
    const params = folderName ? `?folderName=${encodeURIComponent(folderName)}` : '';

    const response = await fetch(`${url}${params}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
      },
    });

    const result = await response.json();
    return result.data;
  };

  const uploadToJunta = async (
    folderId: number,
    file: File
  ) => {
    const formData = new FormData();
    const fileFieldUUID = crypto.randomUUID();
    formData.append(fileFieldUUID, file);

    const response = await fetch(
      `/api/v2/repository/society-profile/${structureId.value}/nodes/${folderId}/documents`,
      {
        method: 'POST',
        headers: {
          'x-file-size': file.size.toString(),
          'Authorization': `Bearer ${token.value}`,
        },
        body: formData,
      }
    );

    return response.json();
  };

  const checkDuplicate = async (
    folderId: number,
    fileName: string
  ) => {
    const response = await fetch(
      `/api/v2/repository/society-profile/${structureId.value}/nodes/${folderId}/documents/check?fileName=${encodeURIComponent(fileName)}`,
      {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      }
    );

    const result = await response.json();
    return result.data; // { exists: boolean, document: {...} | null }
  };

  const uploadMultipleToJunta = async (
    flowId: number,
    files: File[],
    folderName?: string,
    options?: {
      checkDuplicates?: boolean; // Verificar duplicados antes de subir
      onDuplicate?: (fileName: string, existingDoc: any) => Promise<'crear-version' | 'cancelar'>;
    }
  ) => {
    // 1. Obtener o crear carpeta
    const folder = await getOrCreateJuntaFolder(flowId, folderName);

    // 2. Verificar duplicados si está habilitado
    if (options?.checkDuplicates) {
      const checks = await Promise.all(
        files.map(file => checkDuplicate(folder.id, file.name))
      );

      const duplicates = files.filter((file, index) => checks[index].exists);
      const newFiles = files.filter((file, index) => !checks[index].exists);

      // Manejar duplicados
      if (duplicates.length > 0 && options.onDuplicate) {
        for (let i = 0; i < duplicates.length; i++) {
          const file = duplicates[i];
          const checkResult = checks[files.indexOf(file)];
          const choice = await options.onDuplicate(file.name, checkResult.document);

          if (choice === 'crear-version') {
            // Agregar a la lista para crear nueva versión
            // (requiere implementar uploadNewVersion)
          }
          // Si cancela, no se agrega a ninguna lista
        }
      }
    }

    // 3. Subir archivos nuevos
    const results = await Promise.all(
      files.map(file => uploadToJunta(folder.id, file))
    );

    return {
      folder,
      results,
    };
  };

  return {
    getOrCreateJuntaFolder,
    uploadToJunta,
    uploadMultipleToJunta,
    checkDuplicate,
  };
};
```

---

## 🎯 CASOS DE USO

### **Caso 1: Subir Documentos a Junta con Fecha**

```typescript
const { uploadMultipleToJunta } = useJuntaDocuments();

// Obtener fecha actual en formato DD-MM-YYYY
const today = new Date();
const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
// Ej: "20-12-2024"

// Subir documentos
const result = await uploadMultipleToJunta(
  flowId,
  selectedFiles,
  dateStr // "20-12-2024"
);
```

### **Caso 2: Subir Documentos a Junta Específica**

```typescript
const { uploadMultipleToJunta } = useJuntaDocuments();

// Subir a junta con nombre específico
const result = await uploadMultipleToJunta(
  flowId,
  selectedFiles,
  'Junta Extraordinaria 2024'
);
```

### **Caso 3: Usar flowId como Nombre (Comportamiento por Defecto)**

```typescript
const { uploadMultipleToJunta } = useJuntaDocuments();

// No pasar folderName, usa flowId.toString()
const result = await uploadMultipleToJunta(
  flowId,
  selectedFiles
  // Sin folderName, usa "123" (si flowId = 123)
);
```

---

## 🔍 ENDPOINTS DISPONIBLES

### **1. Obtener o Crear Carpeta de Junta**

```typescript
GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder?folderName={nombre}
```

**Query Parameters:**
- `folderName` (opcional): Nombre personalizado para la carpeta. Si no se proporciona, usa `flowId.toString()`.

**Response:**
```typescript
{
  success: true,
  message: "Carpeta de junta \"{nombre}\" obtenida o creada exitosamente",
  data: {
    id: number,
    name: string, // Nombre de la carpeta
    code: string, // UUID
    parentId: number,
    type: 1, // Carpeta
    path: string,
    isCore: true,
    // ... más campos
  }
}
```

### **2. Obtener Solo el ID de la Carpeta**

```typescript
GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder-id?folderName={nombre}
```

**Response:**
```typescript
{
  success: true,
  message: "Folder ID de junta {flowId} obtenido exitosamente",
  data: {
    folderId: number
  }
}
```

### **3. Verificar Documento Duplicado** ⭐ **NUEVO**

```typescript
GET /api/v2/repository/society-profile/:structureId/nodes/:folderId/documents/check?fileName={nombre}
```

**Query Parameters:**
- `fileName` (requerido): Nombre exacto del archivo a verificar (case-sensitive)

**Response:**
```typescript
{
  success: true,
  code: 200,
  message: "Document duplicate check completed successfully",
  data: {
    exists: true, // o false
    document: {
      // Información del documento si existe
      versionCode: string,
      documentCode: string,
      title: string,
      latestVersion: {
        versionCode: string,
        versionNumber: number,
        createdAt: string,
        sizeInBytes: number
      },
      // ... más campos
    } | null // null si no existe
  }
}
```

**Ejemplo:**
```typescript
const checkResult = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents/check?fileName=${encodeURIComponent('acta.docx')}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

const { data } = await checkResult.json();

if (data.exists) {
  console.log('Documento ya existe:', data.document);
  // Mostrar opciones: crear nueva versión o cancelar
} else {
  console.log('Documento no existe, puede subirse');
}
```

### **4. Subir Documento a Carpeta**

```typescript
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents
```

**Parámetros:**
- `structureId`: ID de la estructura de la sociedad
- `parentNodeId`: ID de la carpeta de junta (obtenido del paso 1)

---

## 🚀 EJEMPLO COMPLETO EN COMPONENTE VUE

```vue
<template>
  <div>
    <input
      type="file"
      multiple
      @change="handleFileSelect"
    />
    
    <input
      v-model="folderName"
      type="text"
      placeholder="Nombre de la junta (ej: 20-12-2024)"
    />
    
    <button @click="uploadFiles" :disabled="!selectedFiles.length">
      Subir a Junta
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useJuntaDocuments } from '@/composables/useJuntaDocuments';

const props = defineProps<{
  flowId: number;
}>();

const { uploadMultipleToJunta } = useJuntaDocuments();
const selectedFiles = ref<File[]>([]);
const folderName = ref<string>('');
const isUploading = ref(false);

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  selectedFiles.value = Array.from(input.files || []);
};

const uploadFiles = async () => {
  try {
    isUploading.value = true;
    
    const result = await uploadMultipleToJunta(
      props.flowId,
      selectedFiles.value,
      folderName.value || undefined // Si está vacío, usa flowId
    );
    
    console.log('Carpeta creada/obtenida:', result.folder);
    console.log('Documentos subidos:', result.results);
    
    toast.success('Documentos subidos correctamente');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al subir documentos');
  } finally {
    isUploading.value = false;
  }
};
</script>
```

---

## 📌 NOTAS IMPORTANTES

1. **Si no proporcionas `folderName`**, el sistema usa `flowId.toString()` como nombre de carpeta.

2. **La carpeta se crea automáticamente** si no existe, no necesitas verificar antes.

3. **El path siempre será** `/core/juntas/{nombre}/` independientemente del nombre que uses.

4. **Puedes usar cualquier nombre** para la carpeta (fechas, nombres descriptivos, etc.).

5. **El `folderId` es lo que necesitas** para subir documentos, no el nombre.

---

## 🔄 PARA GOOGLE DRIVE CLONE

El mismo patrón se aplica para Google Drive:

```typescript
// 1. Obtener o crear carpeta de junta
const folder = await getOrCreateJuntaFolder(
  structureId,
  flowId,
  '20-12-2024'
);

// 2. Subir documentos (mismo endpoint)
const result = await uploadDocumentToJunta(
  structureId,
  folder.id,
  file
);
```

**No hay diferencia en el proceso**, solo cambia la UI del frontend.

---

**¡Listo para usar, mi rey!** 🚀💪


