# 📖 Ejemplo de Uso: Endpoints de Repositorio

## 🎯 Objetivo

Crear una carpeta cuando entres a la vista de la junta, y luego subir todos los archivos a esa carpeta (sin crear subcarpetas).

---

## ✅ Endpoints Disponibles

### 1. Crear Carpeta
**Endpoint**: `POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder`

**Composable**: `useCrearCarpetaRepositorio()`

### 2. Subir Archivo
**Endpoint**: `POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents`

**Composable**: `useSubirArchivoRepositorio()`

---

## 📝 Ejemplo Completo

### Paso 1: Al entrar a la vista de la junta

```vue
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCrearCarpetaRepositorio } from '~/core/presentation/repositorio/composables/useCrearCarpetaRepositorio';
import { useSubirArchivoRepositorio } from '~/core/presentation/repositorio/composables/useSubirArchivoRepositorio';
import { useObtenerNodoJuntas } from '~/core/presentation/repositorio/composables/useObtenerNodoJuntas';
import type { RepositorioNode } from '~/core/hexag/repositorio/domain/entities/repositorio-node.entity';

const route = useRoute();
const { crearCarpeta, isCreating } = useCrearCarpetaRepositorio();
const { subirArchivo, subirMultiplesArchivos, isUploading } = useSubirArchivoRepositorio();
const { obtenerNodoJuntas } = useObtenerNodoJuntas();

const structureId = computed(() => route.params.societyId as string);
const flowId = computed(() => route.params.flowId as string);
const carpetaCreada = ref<RepositorioNode | null>(null);

// Fecha legible de la junta (ej: "20 de diciembre del 2025")
const fechaJunta = computed(() => {
  // Aquí obtienes la fecha de la junta desde donde corresponda
  // Por ejemplo, desde downloadData o meetingDetails
  return "20 de diciembre del 2025";
});

// Al montar el componente, crear la carpeta
onMounted(async () => {
  try {
    // 1. Obtener el nodo "juntas" (parent)
    const nodoJuntas = await obtenerNodoJuntas(structureId.value);
    
    // 2. Crear carpeta con fecha legible
    const carpeta = await crearCarpeta(
      structureId.value,
      parseInt(nodoJuntas.id), // parentNodeId (convertir string a number)
      fechaJunta.value, // "20 de diciembre del 2025"
      null // description opcional
    );
    
    carpetaCreada.value = carpeta;
    console.log("✅ Carpeta creada:", carpeta);
  } catch (error) {
    console.error("❌ Error al crear carpeta:", error);
  }
});

// Función para subir un documento
const handleSubirDocumento = async (documento: Documento) => {
  if (!carpetaCreada.value) {
    throw new Error("La carpeta no ha sido creada aún");
  }

  // Convertir Documento a File
  const file = new File(
    [documento.blob],
    documento.nombre,
    { type: documento.mimeType || "application/octet-stream" }
  );

  // Subir archivo a la carpeta creada
  const documentoSubido = await subirArchivo(
    structureId.value,
    parseInt(carpetaCreada.value.id),
    file
  );

  console.log("✅ Documento subido:", documentoSubido);
};

// Función para subir múltiples documentos
const handleSubirMultiplesDocumentos = async (documentos: Documento[]) => {
  if (!carpetaCreada.value) {
    throw new Error("La carpeta no ha sido creada aún");
  }

  // Convertir Documentos a Files
  const files = documentos.map((doc) => 
    new File(
      [doc.blob],
      doc.nombre,
      { type: doc.mimeType || "application/octet-stream" }
    )
  );

  // Subir archivos a la carpeta creada
  const documentosSubidos = await subirMultiplesArchivos(
    structureId.value,
    parseInt(carpetaCreada.value.id),
    files
  );

  console.log("✅ Documentos subidos:", documentosSubidos);
};
</script>
```

---

## 🔧 Uso Simplificado

### Solo crear carpeta:

```typescript
import { useCrearCarpetaRepositorio } from '~/core/presentation/repositorio/composables/useCrearCarpetaRepositorio';
import { useObtenerNodoJuntas } from '~/core/presentation/repositorio/composables/useObtenerNodoJuntas';

const { crearCarpeta } = useCrearCarpetaRepositorio();
const { obtenerNodoJuntas } = useObtenerNodoJuntas();

// 1. Obtener el nodo "juntas" (parent)
const nodoJuntas = await obtenerNodoJuntas("5"); // structureId

// 2. Crear carpeta
const carpeta = await crearCarpeta(
  "5", // structureId
  parseInt(nodoJuntas.id), // parentNodeId (convertir string a number)
  "20 de diciembre del 2025", // nombre
  null // description (opcional)
);

console.log("Carpeta creada:", carpeta.id);
```

### Solo subir archivo:

```typescript
import { useSubirArchivoRepositorio } from '~/core/presentation/repositorio/composables/useSubirArchivoRepositorio';

const { subirArchivo } = useSubirArchivoRepositorio();

// Crear File desde Blob
const file = new File([blob], "documento.docx", {
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
});

// Subir archivo
const documento = await subirArchivo(
  "5", // structureId
  123, // parentNodeId (ID de la carpeta)
  file
);

console.log("Documento subido:", documento.id);
```

---

## 📋 Flujo Recomendado

1. **Al entrar a la vista de la junta**:
   - Obtener el nodo "juntas" (parent)
   - Crear carpeta con fecha legible: `crearCarpeta(structureId, nodoJuntas.id, "20 de diciembre del 2025")`
   - Guardar el ID de la carpeta creada

2. **Al enviar documentos**:
   - Convertir cada `Documento` a `File`
   - Subir cada archivo a la carpeta creada: `subirArchivo(structureId, carpetaId, file)`
   - O usar `subirMultiplesArchivos` para subir todos de una vez

---

## ⚠️ Notas Importantes

1. **No crear subcarpetas**: Al subir archivos, NO uses el endpoint `/core?name={nombre}` porque crea subcarpetas. Usa directamente `/documents`.

2. **Formato de fecha**: La fecha debe estar en formato legible: "20 de diciembre del 2025" (no "20-12-2025").

3. **Parent Node ID**: Necesitas el ID numérico del nodo padre (ej: el nodo "juntas" tiene un ID como `5`).

4. **Conversión de tipos**: 
   - `structureId` es `string`
   - `parentNodeId` es `number`
   - `RepositorioNode.id` es `string`, así que necesitas `parseInt(carpeta.id)` para usarlo como `parentNodeId`

