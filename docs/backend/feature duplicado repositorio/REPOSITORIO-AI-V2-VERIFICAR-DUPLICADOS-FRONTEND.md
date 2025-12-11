# 🔍 Verificación de Documentos Duplicados - Guía Frontend

**Versión:** 2.0  
**Fecha:** 2025-12-11  
**Estado:** ✅ **Implementado y Documentado**

---

## 📋 ÍNDICE

1. [Descripción General](#descripcion-general)
2. [Endpoint](#endpoint)
3. [Ejemplos de Uso](#ejemplos-uso)
4. [Integración en Flujo de Subida](#integracion-flujo)
5. [Componente Vue Completo](#componente-vue)
6. [Composable Nuxt 4](#composable-nuxt)

---

## 1️⃣ <a id="descripcion-general"></a>DESCRIPCIÓN GENERAL

El endpoint de verificación de duplicados permite **verificar si un documento con un nombre específico ya existe en una carpeta** antes de subirlo. Esto es útil para:

- ✅ **Evitar sobrescribir documentos sin avisar**
- ✅ **Dar control al usuario** sobre qué hacer con duplicados
- ✅ **Mostrar información** del documento existente (versión, fecha, tamaño)
- ✅ **Mejorar UX** evitando sorpresas

---

## 2️⃣ <a id="endpoint"></a>ENDPOINT

### **URL**

```
GET /api/v2/repository/society-profile/:structureId/nodes/:folderId/documents/check?fileName={nombre}
```

### **Parámetros**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `structureId` | `number` | ✅ Sí | ID de la estructura de la sociedad (V2) |
| `folderId` | `number` | ✅ Sí | ID de la carpeta donde buscar |
| `fileName` | `string` | ✅ Sí | Nombre exacto del archivo (case-sensitive) |

### **Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

### **Response (Documento Existe)**

```typescript
{
  success: true,
  code: 200,
  message: "Document duplicate check completed successfully",
  data: {
    exists: true,
    document: {
      versionCode: "123e4567-e89b-12d3-a456-426614174000",
      documentCode: "123e4567-e89b-12d3-a456-426614174001",
      userId: 1,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      sizeInBytes: 79784,
      createdAt: "2025-12-11T10:00:00.000Z",
      updatedAt: "2025-12-11T10:00:00.000Z",
      title: "acta-junta-universal.docx",
      node: {
        id: 123,
        code: "abc-123-def",
        name: "acta-junta-universal.docx",
        parentId: 26,
        path: "/core/juntas/11 de diciembre del 2025/",
        type: 0,
        createdAt: "2025-12-11T10:00:00.000Z",
        updatedAt: "2025-12-11T10:00:00.000Z"
      },
      user: {
        id: 1,
        email: "user@example.com"
      },
      latestVersion: {
        versionCode: "123e4567-e89b-12d3-a456-426614174000",
        versionNumber: 1,
        createdAt: "2025-12-11T10:00:00.000Z",
        sizeInBytes: 79784
      }
    }
  }
}
```

### **Response (Documento NO Existe)**

```typescript
{
  success: true,
  code: 200,
  message: "Document duplicate check completed successfully",
  data: {
    exists: false,
    document: null
  }
}
```

---

## 3️⃣ <a id="ejemplos-uso"></a>EJEMPLOS DE USO

### **Ejemplo 1: Verificación Simple**

```typescript
const checkDocumentDuplicate = async (
  structureId: number,
  folderId: number,
  fileName: string
): Promise<{ exists: boolean; document: any | null }> => {
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

// Uso
const result = await checkDocumentDuplicate(
  structureId,
  folderId,
  'acta-junta-universal.docx'
);

if (result.exists) {
  console.log('Documento ya existe:', result.document);
} else {
  console.log('Documento no existe, puede subirse');
}
```

### **Ejemplo 2: Verificar Múltiples Documentos**

```typescript
const checkMultipleDuplicates = async (
  structureId: number,
  folderId: number,
  fileNames: string[]
): Promise<Map<string, { exists: boolean; document: any | null }>> => {
  const checks = await Promise.all(
    fileNames.map(fileName =>
      checkDocumentDuplicate(structureId, folderId, fileName)
    )
  );

  const result = new Map();
  fileNames.forEach((fileName, index) => {
    result.set(fileName, checks[index]);
  });

  return result;
};

// Uso
const files = ['acta.docx', 'minuta.docx', 'resolucion.pdf'];
const duplicates = await checkMultipleDuplicates(
  structureId,
  folderId,
  files
);

duplicates.forEach((check, fileName) => {
  if (check.exists) {
    console.log(`${fileName} ya existe`);
  }
});
```

### **Ejemplo 3: Verificar Antes de Subir**

```typescript
const uploadWithDuplicateCheck = async (
  structureId: number,
  folderId: number,
  file: File
): Promise<void> => {
  // 1. Verificar duplicado
  const checkResult = await checkDocumentDuplicate(
    structureId,
    folderId,
    file.name
  );

  if (checkResult.exists) {
    // 2. Mostrar modal al usuario
    const userChoice = await showDuplicateModal({
      fileName: file.name,
      existingDocument: checkResult.document,
      options: [
        'Crear nueva versión',
        'Cancelar'
      ]
    });

    if (userChoice === 'crear-nueva-version') {
      // 3. Subir como nueva versión
      await uploadNewVersion(
        checkResult.document!.documentCode,
        file
      );
    }
    // Si cancela, no hacer nada
  } else {
    // 4. No existe, subir normalmente
    await uploadFile(structureId, folderId, file);
  }
};
```

---

## 4️⃣ <a id="integracion-flujo"></a>INTEGRACIÓN EN FLUJO DE SUBIDA

### **Flujo Completo con Verificación de Duplicados**

```typescript
const uploadDocumentsToJunta = async (
  structureId: number,
  flowId: number,
  files: File[],
  folderName?: string
) => {
  // 1. Obtener o crear carpeta de junta
  const folder = await getOrCreateJuntaFolder(
    structureId,
    flowId,
    folderName
  );

  // 2. Verificar duplicados para todos los archivos
  const duplicateChecks = await Promise.all(
    files.map(file =>
      checkDocumentDuplicate(structureId, folder.id, file.name)
    )
  );

  // 3. Separar archivos nuevos y duplicados
  const newFiles: File[] = [];
  const duplicateFiles: Array<{
    file: File;
    existingDocument: any;
  }> = [];

  files.forEach((file, index) => {
    const check = duplicateChecks[index];
    if (check.exists) {
      duplicateFiles.push({
        file,
        existingDocument: check.document!,
      });
    } else {
      newFiles.push(file);
    }
  });

  // 4. Subir archivos nuevos directamente
  const newFileResults = await Promise.all(
    newFiles.map(file =>
      uploadFile(structureId, folder.id, file)
    )
  );

  // 5. Manejar duplicados (mostrar modal, etc.)
  const duplicateResults = [];
  for (const { file, existingDocument } of duplicateFiles) {
    const userChoice = await showDuplicateModal({
      fileName: file.name,
      existingDocument,
    });

    if (userChoice === 'crear-nueva-version') {
      const result = await uploadNewVersion(
        existingDocument.documentCode,
        file
      );
      duplicateResults.push(result);
    }
    // Si cancela, no se agrega nada
  }

  return {
    folder,
    newFiles: newFileResults,
    duplicateFiles: duplicateResults,
  };
};
```

---

## 5️⃣ <a id="componente-vue"></a>COMPONENTE VUE COMPLETO

```vue
<template>
  <div class="document-upload">
    <input
      type="file"
      multiple
      @change="handleFileSelect"
      ref="fileInput"
    />

    <button @click="handleUpload" :disabled="isUploading">
      {{ isUploading ? 'Subiendo...' : 'Subir Documentos' }}
    </button>

    <!-- Lista de documentos con estado de duplicados -->
    <div v-if="filesWithStatus.length > 0" class="files-list">
      <div
        v-for="item in filesWithStatus"
        :key="item.file.name"
        class="file-item"
        :class="{ duplicate: item.isDuplicate }"
      >
        <span>{{ item.file.name }}</span>
        <span v-if="item.isDuplicate" class="badge duplicate-badge">
          ⚠️ Duplicado
        </span>
        <span v-else class="badge new-badge">
          ✅ Nuevo
        </span>
      </div>
    </div>

    <!-- Modal de duplicado -->
    <DuplicateModal
      v-if="showDuplicateModal"
      :document="duplicateDocument"
      :fileName="duplicateFileName"
      @create-version="handleCreateVersion"
      @cancel="handleCancelDuplicate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useJuntaDocuments } from '@/composables/useJuntaDocuments';

const props = defineProps<{
  structureId: number;
  flowId: number;
  folderName?: string;
}>();

const { getOrCreateJuntaFolder, uploadToJunta, checkDuplicate } = useJuntaDocuments();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);
const filesWithStatus = ref<Array<{
  file: File;
  isDuplicate: boolean;
  existingDocument?: any;
}>>([]);
const isUploading = ref(false);
const showDuplicateModal = ref(false);
const duplicateDocument = ref<any>(null);
const duplicateFileName = ref<string>('');

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  selectedFiles.value = Array.from(input.files || []);
  checkDuplicates();
};

const checkDuplicates = async () => {
  if (selectedFiles.value.length === 0) return;

  // 1. Obtener carpeta
  const folder = await getOrCreateJuntaFolder(
    props.flowId,
    props.folderName
  );

  // 2. Verificar duplicados
  const checks = await Promise.all(
    selectedFiles.value.map(file =>
      checkDuplicate(folder.id, file.name)
    )
  );

  // 3. Actualizar estado
  filesWithStatus.value = selectedFiles.value.map((file, index) => ({
    file,
    isDuplicate: checks[index].exists,
    existingDocument: checks[index].document || undefined,
  }));
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;

  isUploading.value = true;

  try {
    // 1. Obtener carpeta
    const folder = await getOrCreateJuntaFolder(
      props.flowId,
      props.folderName
    );

    // 2. Separar archivos nuevos y duplicados
    const newFiles = filesWithStatus.value.filter(item => !item.isDuplicate);
    const duplicateFiles = filesWithStatus.value.filter(item => item.isDuplicate);

    // 3. Subir archivos nuevos
    for (const item of newFiles) {
      await uploadToJunta(folder.id, item.file);
    }

    // 4. Manejar duplicados
    for (const item of duplicateFiles) {
      duplicateDocument.value = item.existingDocument;
      duplicateFileName.value = item.file.name;
      showDuplicateModal.value = true;
      
      // Esperar decisión del usuario (se maneja en el modal)
    }

    // 5. Limpiar
    selectedFiles.value = [];
    filesWithStatus.value = [];
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (error) {
    console.error('Error al subir documentos:', error);
  } finally {
    isUploading.value = false;
  }
};

const handleCreateVersion = async () => {
  // Implementar lógica para crear nueva versión
  showDuplicateModal.value = false;
};

const handleCancelDuplicate = () => {
  showDuplicateModal.value = false;
};
</script>

<style scoped>
.file-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  margin: 4px 0;
  border-radius: 4px;
}

.file-item.duplicate {
  background-color: #fff3cd;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.duplicate-badge {
  background-color: #ffc107;
  color: #000;
}

.new-badge {
  background-color: #28a745;
  color: #fff;
}
</style>
```

---

## 6️⃣ <a id="composable-nuxt"></a>COMPOSABLE NUXT 4

```typescript
// composables/useDocumentDuplicates.ts
import { useAuth } from '@/composables/useAuth';

export const useDocumentDuplicates = () => {
  const { token } = useAuth();
  const route = useRoute();

  const structureId = computed(() =>
    Number(route.params.structureId)
  );

  /**
   * Verifica si un documento existe en una carpeta
   */
  const checkDuplicate = async (
    folderId: number,
    fileName: string
  ): Promise<{
    exists: boolean;
    document: any | null;
  }> => {
    const response = await fetch(
      `/api/v2/repository/society-profile/${structureId.value}/nodes/${folderId}/documents/check?fileName=${encodeURIComponent(fileName)}`,
      {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al verificar duplicado');
    }

    const result = await response.json();
    return result.data;
  };

  /**
   * Verifica múltiples documentos en paralelo
   */
  const checkMultipleDuplicates = async (
    folderId: number,
    fileNames: string[]
  ): Promise<Map<string, { exists: boolean; document: any | null }>> => {
    const checks = await Promise.all(
      fileNames.map(fileName => checkDuplicate(folderId, fileName))
    );

    const result = new Map();
    fileNames.forEach((fileName, index) => {
      result.set(fileName, checks[index]);
    });

    return result;
  };

  /**
   * Verifica y filtra archivos duplicados
   */
  const filterDuplicates = async (
    folderId: number,
    files: File[]
  ): Promise<{
    newFiles: File[];
    duplicateFiles: Array<{
      file: File;
      existingDocument: any;
    }>;
  }> => {
    const checks = await Promise.all(
      files.map(file => checkDuplicate(folderId, file.name))
    );

    const newFiles: File[] = [];
    const duplicateFiles: Array<{
      file: File;
      existingDocument: any;
    }> = [];

    files.forEach((file, index) => {
      const check = checks[index];
      if (check.exists) {
        duplicateFiles.push({
          file,
          existingDocument: check.document!,
        });
      } else {
        newFiles.push(file);
      }
    });

    return { newFiles, duplicateFiles };
  };

  return {
    checkDuplicate,
    checkMultipleDuplicates,
    filterDuplicates,
  };
};
```

---

## 📝 NOTAS IMPORTANTES

1. **Case-Sensitive**: La búsqueda es case-sensitive. `"Acta.docx"` y `"acta.docx"` son considerados diferentes.

2. **Búsqueda Recursiva**: La búsqueda incluye subcarpetas. Si buscas en `/core/juntas/`, también buscará en `/core/juntas/subcarpeta/`.

3. **Última Versión**: Si un documento tiene múltiples versiones, se retorna información de la última versión (más reciente).

4. **Performance**: La consulta SQL usa CTEs recursivos. Para carpetas con muchos documentos, puede tomar algunos milisegundos.

5. **Manejo de Errores**: Siempre maneja errores de red y validaciones del backend.

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- [Guía Principal de Repositorio V2](./REPOSITORIO-AI-V2-FRONTEND-V3-GUIA.md)
- [Enviar Documentos a Junta](./REPOSITORIO-AI-V2-ENVIAR-DOCUMENTOS-JUNTA.md)
- [Endpoint Backend](./REPOSITORIO-V2-CHECK-DUPLICATE-ENDPOINT.md)

---

**¡Listo para usar, mi rey!** 🚀💪

