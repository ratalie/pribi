# Documentación: Thumbnails y Previews en el Módulo Probo AI

## Resumen General

El módulo Probo AI implementa un sistema completo de generación de thumbnails y previews para documentos DOC, PDF y EXCEL. El sistema está diseñado para ser eficiente, escalable y compatible con dispositivos móviles, utilizando tecnologías modernas del navegador y un sistema de cache inteligente.

## Arquitectura del Sistema

### Componentes Principales

1. **FileCard.vue** - Componente principal que muestra las tarjetas de archivos
2. **FileThumbnail.vue** - Componente especializado en la generación y visualización de thumbnails
3. **ThumbnailService** - Servicio para generación de thumbnails básicos
4. **FilePreviewService** - Servicio avanzado para previews reales del contenido
5. **PreviewCacheService** - Servicio de cache del servidor
6. **filePreview.ts** - Configuración centralizada del sistema

## Flujo de Generación de Thumbnails

### 1. Detección de Archivos Soportados

El sistema detecta automáticamente los tipos de archivo soportados:

```typescript
// Tipos soportados para thumbnails
const officeExtensions = [
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "odt",
  "odp",
  "ods",
  "rtf",
];

const officeMimeTypes = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/rtf",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.oasis.opendocument.spreadsheet",
];
```

### 2. Estrategia de Generación

El sistema utiliza una estrategia de fallback en cascada:

1. **Cache del Servidor** - Verifica si existe un preview cacheado
2. **FilePreviewService** - Genera previews reales del contenido
3. **ThumbnailService** - Genera thumbnails genéricos como fallback

## Implementación por Tipo de Archivo

### PDF Files

**Tecnología**: PDF.js
**Ubicación**: `ThumbnailService.generatePDFThumbnail()`

```typescript
// Configuración específica para PDFs
const config = isMobile ? FILE_PREVIEW_CONFIG.preview.mobile : FILE_PREVIEW_CONFIG.preview;

// Renderizado con PDF.js
const pdf = await pdfjsLib.getDocument({
  data: arrayBuffer,
  ...(isMobile && {
    maxImageSize: 1024 * 1024,
    disableFontFace: true,
    verbosity: 0,
  }),
}).promise;
```

**Características**:

- Renderizado de la primera página por defecto
- Optimización automática para dispositivos móviles
- Timeout de 8 segundos en móviles, 30 segundos en desktop
- Escalado automático para mantener proporciones

### Word Documents (DOC/DOCX)

**Tecnología**: Mammoth.js + HTML2Canvas
**Ubicación**: `FilePreviewService.generateWordPreview()`

```typescript
// Conversión de Word a HTML
const result = await mammoth.convertToHtml({ arrayBuffer });

// Renderizado a canvas
const canvas = await html2canvas.default(tempDiv, {
  width: effectiveWidth,
  height,
  scale: 1,
  useCORS: true,
  allowTaint: true,
  backgroundColor: "#ffffff",
});
```

**Características**:

- Conversión real del contenido del documento
- Preservación de formato y estilos básicos
- Renderizado temporal en DOM oculto
- Limpieza automática de recursos

### Excel Files (XLS/XLSX)

**Tecnología**: SheetJS (XLSX) + HTML2Canvas
**Ubicación**: `FilePreviewService.generateExcelPreview()`

```typescript
// Lectura del archivo Excel
const workbook = XLSX.read(arrayBuffer, {
  type: "array",
  cellDates: true,
  cellNF: false,
  cellText: false,
});

// Conversión a HTML
const html = XLSX.utils.sheet_to_html(worksheet, {
  editable: false,
  header: "",
  footer: "",
});
```

**Características**:

- Procesamiento de la primera hoja por defecto
- Validaciones de seguridad (límites de celdas, filas, columnas)
- Estilos CSS aplicados para mejor presentación
- Soporte para formatos de fecha y números

## Sistema de Cache

### Cache del Servidor

**Ubicación**: `PreviewCacheService`

```typescript
// Verificación de preview existente
const hasPreview = await PreviewCacheService.hasPreview(nodeCode);

// Descarga de preview cacheado
const cachedPreview = await PreviewCacheService.downloadPreview(nodeCode);

// Subida de nuevo preview
await PreviewCacheService.uploadPreview(nodeCode, thumbnailDataUrl);
```

**Características**:

- Endpoints REST para gestión de previews
- Optimización automática de tamaño (máximo 256KB)
- Compresión JPEG con calidad adaptativa
- Fallback silencioso en caso de error

### Optimización de Cache

```typescript
// Optimización automática de blobs
private static async optimizeBlob(blob: Blob): Promise<Blob> {
  const maxSize = 256 * 1024; // 256 KB

  if (blob.size <= maxSize) {
    return blob;
  }

  // Redimensionamiento y compresión automática
  // Intento con diferentes calidades hasta cumplir el límite
}
```

## Configuración y Optimización

### Configuración Centralizada

**Ubicación**: `config/filePreview.ts`

```typescript
export const FILE_PREVIEW_CONFIG = {
  preview: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.9,
    outputFormat: "image/jpeg",
    mobile: {
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.7,
    },
  },
  safety: {
    maxFileSize: 8 * 1024 * 1024, // 8MB
    maxTotalCells: 100000,
    maxRowsPerSheet: 2000,
    maxColumnsPerSheet: 200,
    maxSheets: 15,
  },
};
```

### Detección de Capacidades

```typescript
export const canSafelyGeneratePreview = (file: File) => {
  const capabilities = getBrowserCapabilities();
  const isMobile = isMobileDevice();

  // Validaciones de seguridad
  if (!capabilities.supportsCanvas) {
    return { canGenerate: false, reason: "Browser does not support Canvas API" };
  }

  if (isMobile && fileSize > FILE_PREVIEW_CONFIG.safety.mobileMaxFileSize) {
    return { canGenerate: false, reason: "File too large for mobile" };
  }

  return { canGenerate: true };
};
```

## Lazy Loading y Performance

### Intersection Observer

```typescript
// Lazy loading con Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isLoading.value && !thumbnail.value) {
        generateThumbnail();
        observer.disconnect();
      }
    });
  },
  {
    rootMargin: "50px", // Cargar cuando esté a 50px de ser visible
    threshold: 0.1,
  }
);
```

### Carga Dinámica de Librerías

```typescript
// Importaciones dinámicas para reducir bundle inicial
const loadLibraries = async () => {
  if (!XLSX) {
    XLSX = await import("xlsx");
  }
  if (!mammoth) {
    mammoth = await import("mammoth");
  }
  if (!html2canvas) {
    html2canvas = await import("html2canvas");
  }
};
```

## Estados de la UI

### Estados del Componente FileThumbnail

1. **Loading** - Muestra spinner mientras genera thumbnail
2. **Success** - Muestra la imagen generada
3. **Error** - Muestra icono genérico y mensaje de error
4. **No Preview** - Muestra botón para generar preview manualmente

### Manejo de Errores

```typescript
// Fallback en cascada
try {
  // Intentar FilePreviewService primero
  generatedThumbnail = await FilePreviewService.generateFilePreview(file, options);
} catch (error) {
  // Fallback a ThumbnailService
  if (!generatedThumbnail) {
    generatedThumbnail = await ThumbnailService.generateThumbnail(file, options);
  }
}
```

## Integración con FileCard

### Props del Componente

```typescript
interface Props {
  file: File | Blob | { name: string; type: string; size: number };
  fileName: string;
  fileId?: string;
  thumbnail?: string;
  options?: ThumbnailOptions;
  showThumbnail?: boolean;
  nodeCode?: string; // UUID del nodo para cache del servidor
}
```

### Eventos Emitidos

```typescript
const emit = defineEmits<{
  (e: "thumbnail-generated", thumbnail: string): void;
  (e: "thumbnail-error", error: Error): void;
}>();
```

## Consideraciones de Seguridad

### Validaciones de Archivo

- Límite de tamaño de archivo (8MB desktop, 5MB móvil)
- Límite de celdas en Excel (100,000 total)
- Límite de filas por hoja (2,000)
- Límite de columnas por hoja (200)
- Límite de hojas por archivo (15)

### Timeouts y Límites

- PDF render: 30 segundos (8 segundos en móvil)
- Office render: 15 segundos
- Image load: 10 segundos
- Worker timeout: 30 segundos

## Optimizaciones Móviles

### Configuración Específica para Móviles

```typescript
const isMobile = isMobileDevice();

if (isMobile) {
  // Reducir calidad y dimensiones
  const config = FILE_PREVIEW_CONFIG.preview.mobile;

  // Aplicar timeouts más estrictos
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("PDF render timeout on mobile")), 8000);
  });
}
```

### Detección de Dispositivos

```typescript
export const isMobileDevice = (): boolean => {
  return FILE_PREVIEW_CONFIG.mobile.userAgentPatterns.some((pattern) =>
    pattern.test(navigator.userAgent)
  );
};
```

## API del Servidor

### Endpoints de Cache

- `HEAD /repository/society/nodes/{nodeCode}/preview` - Verificar existencia
- `GET /repository/society/nodes/{nodeCode}/preview` - Descargar preview
- `PUT /repository/society/nodes/{nodeCode}/preview` - Subir preview

### Formato de Respuesta

- **Success**: Blob de imagen JPEG
- **Not Found**: 404
- **Error**: 500 con mensaje de error

## Dependencias Externas

### Librerías Principales

- **pdfjs-dist**: Renderizado de PDFs
- **xlsx**: Procesamiento de archivos Excel
- **mammoth**: Conversión de Word a HTML
- **html2canvas**: Renderizado de HTML a imagen

### Configuración de Workers

```typescript
// Configuración del worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = getWorkerSrc();
```

## Troubleshooting

### Problemas Comunes

1. **Thumbnail no se genera**

   - Verificar que el archivo esté soportado
   - Revisar límites de tamaño
   - Comprobar capacidades del navegador

2. **Error de memoria en móviles**

   - Reducir calidad de preview
   - Implementar límites más estrictos
   - Usar timeouts más cortos

3. **Cache no funciona**
   - Verificar conectividad con el servidor
   - Revisar permisos de la API
   - Comprobar formato de nodeCode

### Logs y Debugging

```typescript
// Logs detallados para debugging
console.error("Error generando miniatura:", error);
console.warn(`Cannot generate preview: ${safetyCheck.reason}`);
```

## Futuras Mejoras

### Optimizaciones Planificadas

1. **Web Workers** - Mover procesamiento a hilos separados
2. **Service Workers** - Cache offline de previews
3. **Compresión Avanzada** - WebP/AVIF para mejor compresión
4. **Previews Interactivos** - Zoom y navegación en previews
5. **Batch Processing** - Generación masiva de thumbnails

### Métricas de Performance

- Tiempo de generación por tipo de archivo
- Tasa de éxito de generación
- Uso de memoria y CPU
- Tamaño promedio de thumbnails generados

---

_Esta documentación refleja el estado actual del sistema de thumbnails y previews en el módulo Probo AI. Para actualizaciones o cambios, consultar con el equipo de desarrollo._
