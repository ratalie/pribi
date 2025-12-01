# 📚 Documentación Completa del Repositorio de IA (Probo AI)

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Documentos Societarios](#documentos-societarios)
4. [Documentos Generados](#documentos-generados)
5. [Carpetas Personalizadas](#carpetas-personalizadas)
6. [Chats con IA](#chats-con-ia)
7. [Sistema de Búsqueda](#sistema-de-búsqueda)
8. [Previews y Thumbnails](#previews-y-thumbnails)
9. [Permisos y Seguridad](#permisos-y-seguridad)
10. [API y Servicios](#api-y-servicios)

---

## 🎯 Visión General

El **Repositorio de IA (Probo AI)** es un sistema completo de almacenamiento, organización y consulta inteligente de documentos legales y empresariales. Combina un sistema de gestión de archivos tipo Google Drive con capacidades avanzadas de inteligencia artificial para búsqueda semántica y consultas contextuales.

### Propósito Principal

- **Almacenar** documentos societarios y documentos generados por el sistema
- **Organizar** documentos en carpetas personalizadas y del sistema
- **Buscar** documentos mediante búsqueda semántica inteligente
- **Consultar** documentos mediante chat con IA contextual
- **Visualizar** documentos con previews y thumbnails automáticos

### Características Clave

✅ **Almacenamiento Jerárquico**: Sistema de carpetas y subcarpetas  
✅ **Búsqueda Semántica**: Encuentra documentos por significado, no solo palabras clave  
✅ **Chat con IA Contextual**: Consulta documentos con IA que solo accede al contexto relevante  
✅ **Previews Automáticos**: Generación automática de miniaturas para PDF, Word y Excel  
✅ **Gestión de Versiones**: Sistema completo de versionado de documentos  
✅ **Compartir Carpetas**: Compartir carpetas personalizadas con otros usuarios  
✅ **Permisos Granulares**: Control de acceso por rol y carpeta  

---

## 🏗️ Arquitectura del Sistema

### Estructura de Carpetas del Sistema

```
Repositorio Probo AI
│
├── {Nombre de la Empresa}/
│   │
│   ├── 📁 Documentos Societarios de la Empresa/
│   │   ├── Escrituras públicas
│   │   ├── Actas de juntas
│   │   ├── Documentos de constitución
│   │   ├── Contratos
│   │   └── Otros documentos legales
│   │
│   └── 📁 Documentos Generados en Probo/
│       ├── 📁 Juntas/
│       │   ├── 📁 Aumento de Capital/
│       │   │   ├── 📁 Aporte Dinerario/
│       │   │   │   ├── Actas de Junta
│       │   │   │   ├── Minutas
│       │   │   │   ├── Certificaciones
│       │   │   │   └── Certificados de Aporte
│       │   │   └── 📁 Capitalización de Créditos/
│       │   │       └── [documentos similares]
│       │   └── 📁 Designación/Remoción/
│       │       └── [documentos de designación]
│       └── [otros documentos generados]
│
└── 📁 Carpetas Personalizadas/
    ├── 📁 Carpeta Usuario 1/
    │   ├── [documentos enlazados]
    │   └── [subcarpetas]
    └── 📁 Carpeta Usuario 2/
        └── [documentos enlazados]
```

### Componentes Principales

```
src/modules/probo-ai/
├── pages/
│   ├── repository/
│   │   ├── Index.vue                    # Vista principal del repositorio
│   │   ├── personalizedFolder/          # Vista de carpeta personalizada
│   │   ├── proboDocuments/              # Vista de documentos generados
│   │   └── otherDocuments/              # Vista de otros documentos
│   ├── chats/
│   │   └── Chats.vue                    # Página de chats con IA
│   └── storage/
│       └── Storage.vue                  # Página de almacenamiento
│
├── components/
│   ├── repository/
│   │   ├── common/                      # Componentes comunes
│   │   │   ├── FolderCard.vue          # Tarjeta de carpeta
│   │   │   ├── FileCard.vue            # Tarjeta de archivo
│   │   │   ├── FolderList.vue          # Lista de carpetas
│   │   │   ├── SearchBar.vue           # Barra de búsqueda
│   │   │   └── InfoPopover.vue         # Popover informativo
│   │   ├── documentPreview/            # Preview de documentos
│   │   │   └── DocumentPreview.vue
│   │   └── modals/                      # Modales
│   │       ├── AddPersonalizedFolderModal.vue
│   │       ├── RenameFolderModal.vue
│   │       └── ShareFolderModal.vue
│   └── chatAI/
│       ├── ChatLayout.vue               # Layout del chat
│       └── SelectFolderModal.vue        # Modal de selección de carpeta
│
├── services/
│   ├── fileService.ts                   # Servicio de archivos
│   ├── folderService.ts                 # Servicio de carpetas
│   ├── chatService.ts                   # Servicio de chat
│   ├── searchService.ts                 # Servicio de búsqueda
│   ├── agentService.ts                  # Servicio de IA
│   ├── nodeService.ts                   # Servicio de nodos del sistema
│   ├── fileVersionService.ts            # Servicio de versiones
│   ├── previewCacheService.ts           # Servicio de cache de previews
│   └── thumbnailService.ts              # Servicio de thumbnails
│
├── composables/
│   ├── useAgentChat.ts                  # Composable para chat con IA
│   ├── useDocumentViewer.ts             # Composable para visualización
│   ├── useFileUpload.ts                 # Composable para subida
│   ├── useChat.ts                       # Composable para gestión de chats
│   ├── useDocumentStore.ts              # Store de documentos
│   └── useUserPermissions.ts             # Composable de permisos
│
└── router/
    └── probo-ai.router.ts                # Rutas del módulo
```

---

## 📄 Documentos Societarios

### Descripción

Los **Documentos Societarios** son documentos legales de la empresa que se almacenan en el repositorio. Estos incluyen:

- Escrituras públicas
- Actas de juntas (no generadas por Probo)
- Documentos de constitución
- Contratos y acuerdos
- Estados financieros
- Otros documentos legales relevantes

### Ubicación en el Sistema

**Ruta**: `{Nombre de la Empresa}/Documentos Societarios de la Empresa`

Esta es una **carpeta del sistema** que se crea automáticamente para cada sociedad registrada en Probo.

### Características

- ✅ **Solo lectura para usuarios externos**: Los usuarios externos no pueden modificar estos documentos
- ✅ **Subida manual**: Los documentos se suben manualmente por usuarios con permisos
- ✅ **Organización jerárquica**: Se pueden crear subcarpetas dentro de esta carpeta
- ✅ **Búsqueda**: Todos los documentos son indexados para búsqueda semántica
- ✅ **Previews**: Se generan previews automáticos para PDF, Word y Excel

### Funcionalidades Disponibles

#### Para Usuarios con Permisos WRITE/ADMIN:

- ✅ Subir nuevos documentos
- ✅ Crear subcarpetas
- ✅ Renombrar carpetas
- ✅ Eliminar documentos y carpetas
- ✅ Descargar documentos
- ✅ Iniciar chat con IA sobre estos documentos

#### Para Usuarios READ/EXTERNO:

- ✅ Visualizar documentos
- ✅ Descargar documentos
- ✅ Navegar por carpetas
- ❌ No pueden subir, editar o eliminar

---

## 📝 Documentos Generados

### Descripción

Los **Documentos Generados** son documentos creados automáticamente por el sistema Probo durante los diferentes flujos de trabajo, principalmente:

- **Actas de Juntas**: Generadas al completar una junta de accionistas
- **Minutas**: Documentos legales generados para aumentos de capital
- **Certificaciones**: Certificaciones de actas y acuerdos
- **Certificados**: Certificados de aporte, de acciones, etc.
- **Cartas Aviso**: Notificaciones y avisos legales
- **Asientos Contables**: Documentos contables generados

### Ubicación en el Sistema

**Ruta**: `{Nombre de la Empresa}/Documentos Generados en Probo`

Esta es una **carpeta del sistema** que se organiza jerárquicamente según el tipo de flujo:

```
Documentos Generados en Probo/
├── Juntas/
│   ├── Aumento de Capital/
│   │   ├── Aporte Dinerario/
│   │   │   ├── {Fecha} - Acta de Junta.docx
│   │   │   ├── {Fecha} - Minuta de Aumento de Capital.docx
│   │   │   ├── {Fecha} - Certificaciones de Actas.docx
│   │   │   └── {Fecha} - Certificados de Aporte/
│   │   └── Capitalización de Créditos/
│   │       └── [documentos similares]
│   └── Designación/Remoción/
│       └── [documentos de designación]
└── [otros tipos de documentos generados]
```

### Características

- ✅ **Generación Automática**: Los documentos se generan automáticamente al completar flujos
- ✅ **Organización Automática**: Se organizan automáticamente en carpetas según el tipo de flujo
- ✅ **Guardado Automático**: Se guardan automáticamente en el repositorio al generarse
- ✅ **Versionado**: Cada documento tiene un sistema de versionado
- ✅ **Búsqueda**: Todos los documentos son indexados para búsqueda semántica

### Flujo de Guardado

1. **Usuario completa un flujo** (ej: Aumento de Capital - Aporte Dinerario)
2. **Sistema genera documentos** usando plantillas Word y datos del flujo
3. **Sistema guarda automáticamente** en la carpeta correspondiente del repositorio
4. **Usuario puede descargar** el ZIP con todos los documentos
5. **Documentos quedan disponibles** en el repositorio para consulta futura

### Integración con Flujos

El repositorio se integra automáticamente con:

- ✅ **Juntas de Accionistas**: Actas, minutas, certificaciones
- ✅ **Aumento de Capital**: Documentos de aporte dinerario y capitalización
- ✅ **Designación/Remoción**: Actas de designación y remoción
- ✅ **Otros flujos**: Cualquier flujo que genere documentos

---

## 📁 Carpetas Personalizadas

### Descripción

Las **Carpetas Personalizadas** son carpetas creadas por usuarios para organizar documentos de manera personalizada. A diferencia de las carpetas del sistema, estas carpetas son completamente personalizables y pueden incluir acceso al chat con IA.

### Características Principales

#### 1. Creación Ilimitada

Los usuarios con permisos WRITE/ADMIN pueden crear tantas carpetas personalizadas como necesiten.

#### 2. Organización Jerárquica

- ✅ Crear subcarpetas dentro de carpetas personalizadas
- ✅ Navegación jerárquica con breadcrumbs
- ✅ Organización flexible según necesidades del usuario

#### 3. Enlace de Documentos (No Duplicación)

**Característica clave**: Las carpetas personalizadas **no duplican** documentos, solo los **enlazan**.

- Un documento puede estar enlazado en múltiples carpetas personalizadas
- Eliminar un enlace NO elimina el documento original
- Los documentos físicos viven en las carpetas del sistema
- Las carpetas personalizadas solo guardan referencias

#### 4. Chat con IA Contextual

Las carpetas personalizadas pueden tener **acceso al chat con IA**:

- Al crear la carpeta, se puede habilitar "Acceso a chat con IA"
- La IA solo tiene acceso a los documentos enlazados en esa carpeta
- Respuestas contextuales basadas únicamente en esos documentos
- Ideal para consultas específicas sobre un conjunto de documentos

#### 5. Compartir Carpetas

- ✅ Compartir carpetas con otros usuarios
- ✅ Control de permisos por usuario (READ, WRITE)
- ✅ Usuarios externos pueden acceder a carpetas compartidas
- ✅ Gestión de accesos desde el modal de compartir

### Creación de Carpeta Personalizada

#### Proceso:

1. **Usuario hace clic en "Crear Carpeta"**
2. **Se abre modal** con opciones:
   - Nombre de la carpeta
   - Descripción (opcional)
   - **Habilitar chat con IA** (checkbox)
3. **Usuario completa formulario** y confirma
4. **Carpeta se crea** y aparece en la lista de carpetas personalizadas
5. **Usuario puede agregar documentos** desde cualquier parte del repositorio

### Agregar Documentos a Carpeta Personalizada

#### Métodos:

1. **Desde FileCard**:
   - Menú contextual del archivo
   - Opción "Agregar a carpeta personalizada"
   - Seleccionar carpeta destino

2. **Desde dentro de la carpeta**:
   - Botón "Añadir Documento"
   - Buscar y seleccionar documentos
   - Enlazar a la carpeta

3. **Selección múltiple**:
   - Seleccionar múltiples archivos
   - Agregar todos a una carpeta de una vez

### Estructura de Datos

```typescript
interface PersonalizedFolder {
  id: number;
  name: string;
  description?: string;
  hasAIChatAccess: boolean;        // Si tiene acceso a chat con IA
  isPersonalizedFolder: boolean;   // Siempre true para carpetas personalizadas
  isHidden: boolean;                // Para carpetas virtuales (búsqueda)
  createdAt: string;
  updatedAt: string;
  societyId: number;
  // Documentos enlazados (virtual children)
  children?: DocumentNode[];
}
```

### Casos de Uso

#### Caso 1: Organizar Documentos de un Proyecto Específico

```
Carpeta: "Due Diligence - Empresa ABC"
├── Contrato de Compra
├── Estados Financieros 2023
├── Escritura de Constitución
└── Actas de Juntas Relevantes
```

#### Caso 2: Carpeta para Consulta con IA

```
Carpeta: "Análisis de Contratos" (con chat IA habilitado)
├── Contrato 1
├── Contrato 2
└── Contrato 3

→ Usuario puede hacer preguntas como:
   "¿Cuáles son las cláusulas de terminación?"
   "¿Qué obligaciones tiene la parte A?"
```

#### Caso 3: Compartir con Cliente

```
Carpeta: "Documentos para Cliente XYZ" (compartida)
├── Informe Legal
├── Propuesta
└── Contratos Relevantes

→ Cliente puede ver y descargar, pero no modificar
```

---

## 💬 Chats con IA

### Descripción

El sistema de **Chats con IA** permite consultar documentos mediante conversaciones con inteligencia artificial. La IA tiene acceso contextual solo a los documentos relevantes, proporcionando respuestas precisas y basadas en el contenido real de los documentos.

### Características Principales

#### 1. Chat Contextual

**Característica clave**: La IA solo tiene acceso a los documentos del contexto actual.

- Si el chat está en una carpeta personalizada, solo ve documentos de esa carpeta
- Si el chat es general, puede acceder a todos los documentos de la sociedad
- Las respuestas se basan únicamente en los documentos disponibles

#### 2. Búsqueda Semántica Integrada

- La IA utiliza búsqueda semántica para encontrar documentos relevantes
- No busca solo palabras clave, sino significado y contexto
- Encuentra documentos relacionados aunque no contengan las palabras exactas

#### 3. Documentos Utilizados

- Cada respuesta muestra qué documentos fueron utilizados
- Permite verificar la fuente de la información
- Facilita la trazabilidad de las respuestas

#### 4. Historial de Conversaciones

- Todas las conversaciones se guardan
- Se pueden reanudar conversaciones anteriores
- Múltiples conversaciones por carpeta/contexto

### Flujos de Uso

#### Flujo 1: Chat desde Carpeta Personalizada

1. **Usuario abre carpeta personalizada** con chat IA habilitado
2. **Hace clic en "Chat con IA"** (botón en la carpeta)
3. **Se abre página de chat** con contexto de la carpeta
4. **Usuario hace pregunta**: "¿Qué dice el contrato sobre las obligaciones?"
5. **IA busca en documentos** de la carpeta
6. **IA responde** basándose solo en esos documentos
7. **Se muestran documentos utilizados** en la respuesta

#### Flujo 2: Chat desde Búsqueda

1. **Usuario busca documentos** en el repositorio
2. **Obtiene resultados** de búsqueda
3. **Hace clic en "Iniciar chat con IA"**
4. **Sistema crea carpeta virtual oculta** con los resultados
5. **Se abre chat** con contexto de esos documentos
6. **Usuario puede hacer preguntas** sobre los documentos encontrados

#### Flujo 3: Chat General

1. **Usuario va a página de Chats**
2. **Inicia nueva conversación** sin contexto específico
3. **Puede seleccionar carpeta** para dar contexto
4. **Hace preguntas generales** sobre documentos de la sociedad

### Interfaz del Chat

```
┌─────────────────────────────────────────┐
│  Chat con IA - Carpeta: "Análisis XYZ"  │
├─────────────────────────────────────────┤
│                                         │
│  Usuario:                               │
│  ¿Cuáles son las cláusulas de          │
│  terminación del contrato?              │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  IA:                                    │
│  Según los documentos analizados,       │
│  las cláusulas de terminación son:     │
│                                         │
│  1. Incumplimiento material             │
│  2. Quiebra o insolvencia               │
│  3. Mutuo acuerdo                       │
│                                         │
│  📎 Documentos utilizados:              │
│  • Contrato Principal.pdf               │
│  • Anexo de Términos.docx               │
└─────────────────────────────────────────┘
```

### Tecnología

- **Backend**: Integración con servicio de IA (probablemente OpenAI o similar)
- **Frontend**: Comunicación mediante Server-Sent Events (SSE) para respuestas en tiempo real
- **Contexto**: Se envía lista de documentos relevantes con cada pregunta
- **Embeddings**: Búsqueda semántica mediante embeddings vectoriales

### Composable: useAgentChat

```typescript
const {
  messages,              // Array de mensajes
  isLoading,            // Estado de carga
  sendMessage,          // Función para enviar mensaje
  currentConversation,  // Conversación actual
  createConversation,   // Crear nueva conversación
  loadConversation,     // Cargar conversación existente
} = useAgentChat();
```

---

## 🔍 Sistema de Búsqueda

### Descripción

El sistema de búsqueda permite encontrar documentos mediante:

- **Búsqueda por texto**: Búsqueda tradicional por palabras clave
- **Búsqueda semántica**: Búsqueda por significado y contexto
- **Filtros**: Por tipo de documento, origen, fecha, etc.

### Búsqueda Semántica

#### Características:

- ✅ **Búsqueda por significado**: Encuentra documentos relacionados aunque no contengan las palabras exactas
- ✅ **Embeddings vectoriales**: Utiliza modelos de embeddings para representar el significado
- ✅ **Ordenamiento por relevancia**: Resultados ordenados por similitud semántica
- ✅ **Búsqueda en tiempo real**: Con debounce para optimizar rendimiento

#### Ejemplo:

**Búsqueda**: "documentos sobre aumento de capital"

**Encuentra**:
- "Acta de Junta - Aumento de Capital"
- "Minuta de Aumento de Capital"
- "Certificado de Aporte"
- "Resolución de Aumento de Capital"

Aunque algunos documentos no contengan exactamente "aumento de capital", la búsqueda semántica los encuentra por su significado relacionado.

### Filtros Disponibles

- **Tipo de documento**: PDF, Word, Excel, PowerPoint
- **Origen**: Documentos Generados en Probo / Otros documentos
- **Fecha**: Rango de fechas
- **Tamaño**: Rango de tamaños
- **Sociedad**: Filtrar por sociedad específica

### Página de Resultados

La página de resultados muestra:

- Lista de documentos encontrados
- Información relevante (nombre, tipo, origen, fecha)
- Porcentaje de relevancia
- Opción para iniciar chat con IA sobre los resultados
- Opción para agregar a carpeta personalizada

---

## 🖼️ Previews y Thumbnails

### Descripción

El sistema genera automáticamente **previews** (vistas previas) y **thumbnails** (miniaturas) para documentos, permitiendo ver el contenido sin descargar el archivo completo.

### Tipos de Archivo Soportados

#### 1. PDF

- **Tecnología**: PDF.js
- **Renderizado**: Primera página del PDF
- **Optimización**: Redimensionamiento automático para thumbnails
- **Timeout**: 30 segundos (8 segundos en móvil)

#### 2. Word (DOC/DOCX)

- **Tecnología**: Mammoth.js + HTML2Canvas
- **Proceso**:
  1. Conversión de Word a HTML
  2. Renderizado temporal en DOM oculto
  3. Captura con HTML2Canvas
  4. Conversión a imagen
- **Características**: Preserva formato básico y estilos

#### 3. Excel (XLS/XLSX)

- **Tecnología**: SheetJS (XLSX) + HTML2Canvas
- **Proceso**:
  1. Lectura de primera hoja
  2. Conversión a HTML con estilos
  3. Renderizado con HTML2Canvas
  4. Conversión a imagen
- **Validaciones**: Límites de celdas, filas y columnas por seguridad

### Sistema de Cache

#### Cache del Servidor

- Los previews generados se guardan en el servidor
- Evita regenerar previews para documentos ya procesados
- Optimización automática de tamaño (máximo 256KB)
- Compresión JPEG con calidad adaptativa

#### Flujo de Cache

1. **Verificar si existe preview** en el servidor
2. **Si existe**: Descargar y mostrar
3. **Si no existe**: Generar nuevo preview
4. **Guardar en servidor** para futuras consultas

### Optimizaciones

#### Lazy Loading

- Los previews se generan solo cuando el elemento es visible
- Utiliza Intersection Observer
- Carga cuando está a 50px de ser visible

#### Optimización Móvil

- Dimensiones reducidas (200x200 vs 400x400)
- Calidad reducida (0.7 vs 0.9)
- Timeouts más estrictos (8s vs 30s)
- Límites de tamaño de archivo más bajos

### Configuración

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
    maxFileSize: 8 * 1024 * 1024,  // 8MB
    maxTotalCells: 100000,
    maxRowsPerSheet: 2000,
    maxColumnsPerSheet: 200,
    maxSheets: 15,
  },
};
```

---

## 🔐 Permisos y Seguridad

### Roles de Usuario

#### 1. READ (Solo Lectura)

**Permisos**:
- ✅ Visualizar documentos
- ✅ Descargar archivos
- ✅ Navegar por carpetas
- ✅ Ver información de carpetas

**Restricciones**:
- ❌ Crear carpetas personalizadas
- ❌ Editar/eliminar carpetas
- ❌ Subir/eliminar archivos
- ❌ Compartir carpetas
- ❌ Iniciar chats con IA (en algunos contextos)

#### 2. WRITE/USUARIO (Editor)

**Permisos**:
- ✅ Todas las funciones de READ
- ✅ Crear carpetas personalizadas
- ✅ Editar/eliminar carpetas propias
- ✅ Subir/eliminar archivos
- ✅ Compartir carpetas
- ✅ Iniciar chats con IA
- ✅ Agregar documentos a carpetas

**Restricciones**:
- ❌ Modificar carpetas del sistema (solo lectura)
- ❌ Eliminar documentos del sistema

#### 3. ADMIN (Administrador)

**Permisos**:
- ✅ Control total del sistema
- ✅ Todas las funciones de WRITE
- ✅ Modificar carpetas del sistema
- ✅ Eliminar documentos del sistema
- ✅ Gestión de usuarios y permisos
- ✅ Acceso a todas las funcionalidades

#### 4. EXTERNO (Usuario Externo)

**Permisos**:
- ✅ Ver carpetas compartidas
- ✅ Visualizar documentos en carpetas compartidas
- ✅ Descargar archivos de carpetas compartidas
- ✅ Navegar por carpetas compartidas

**Restricciones**:
- ❌ No puede acceder a carpetas del sistema
- ❌ No puede crear carpetas propias
- ❌ No puede editar/compartir/eliminar carpetas compartidas
- ❌ No puede subir archivos
- ❌ Acceso limitado solo a lo compartido explícitamente

### Control de Acceso por Carpeta

- **Carpetas del Sistema**: Solo lectura para usuarios externos, control total para ADMIN
- **Carpetas Personalizadas**: Control por el creador y usuarios compartidos
- **Compartir**: Permisos granulares al compartir (READ o WRITE)

### Seguridad de Documentos

- ✅ **Autenticación**: Requerida para todas las operaciones
- ✅ **Autorización**: Verificación de permisos en cada operación
- ✅ **Validación**: Validación de tipos de archivo y tamaños
- ✅ **Sanitización**: Limpieza de nombres de archivo y rutas
- ✅ **Auditoría**: Registro de operaciones importantes (futuro)

---

## 🔌 API y Servicios

### Servicios Principales

#### FileService

Gestión de archivos:

```typescript
// Subir archivo
FileService.uploadFile(file: File, folderId: string)

// Listar archivos de carpeta
FileService.getFolderFiles(folderId: string)

// Descargar archivo
FileService.downloadFile(nodeId: string)

// Eliminar archivo
FileService.deleteFile(nodeId: string)
```

#### FolderService

Gestión de carpetas:

```typescript
// Crear carpeta personalizada
FolderService.createPersonalizedFolder(data: CreateFolderData)

// Listar carpetas personalizadas
FolderService.getPersonalizedFolders(societyId: string)

// Enlazar documento a carpeta
FolderService.linkDocumentToVirtualFolder(folderId: string, nodeId: string)

// Compartir carpeta
FolderService.shareFolder(folderId: string, users: ShareUser[])
```

#### ChatService

Gestión de chats:

```typescript
// Crear conversación
ChatService.createConversation(data: CreateConversationData)

// Enviar mensaje
ChatService.sendMessage(conversationId: number, content: string)

// Obtener conversaciones
ChatService.getConversations(societyId: number, folderId?: number)
```

#### SearchService

Búsqueda de documentos:

```typescript
// Búsqueda semántica
SearchService.semanticSearch(query: string, filters?: SearchFilters)

// Búsqueda por texto
SearchService.textSearch(query: string, filters?: SearchFilters)
```

#### AgentService

Servicio de IA:

```typescript
// Enviar mensaje a IA
AgentService.sendMessage(conversationId: number, content: string, context: DocumentContext[])
```

### Endpoints Principales

#### Archivos

- `POST /repository/society/nodes/{nodeId}/documents` - Subir archivo
- `GET /repository/society/nodes/{nodeId}/documents` - Listar archivos
- `GET /repository/society/nodes/{nodeId}/download` - Descargar archivo
- `DELETE /repository/society/nodes/{nodeId}` - Eliminar archivo

#### Carpetas

- `POST /repository/society/{societyId}/personalized-folders` - Crear carpeta
- `GET /repository/society/{societyId}/personalized-folders` - Listar carpetas
- `PUT /repository/society/personalized-folders/{folderId}` - Actualizar carpeta
- `DELETE /repository/society/personalized-folders/{folderId}` - Eliminar carpeta

#### Chat

- `POST /api/workspaces/{workspaceId}/chat/conversations` - Crear conversación
- `POST /api/workspaces/{workspaceId}/chat/messages` - Enviar mensaje
- `GET /api/workspaces/{workspaceId}/chat/conversations` - Listar conversaciones

#### Búsqueda

- `POST /api/search/semantic` - Búsqueda semántica
- `GET /api/search/text?q={query}` - Búsqueda por texto

#### Previews

- `HEAD /repository/society/nodes/{nodeCode}/preview` - Verificar existencia
- `GET /repository/society/nodes/{nodeCode}/preview` - Descargar preview
- `PUT /repository/society/nodes/{nodeCode}/preview` - Subir preview

---

## 📝 Resumen de Funcionalidades

### ✅ Funcionalidades Implementadas

- [x] Almacenamiento de documentos societarios
- [x] Almacenamiento de documentos generados
- [x] Carpetas personalizadas con organización jerárquica
- [x] Enlace de documentos (sin duplicación)
- [x] Compartir carpetas con otros usuarios
- [x] Chat con IA contextual
- [x] Búsqueda semántica de documentos
- [x] Previews automáticos para PDF, Word y Excel
- [x] Sistema de versionado de documentos
- [x] Permisos granulares por rol
- [x] Gestión de versiones
- [x] Cache de previews en servidor
- [x] Optimización para móviles

### 🔄 Funcionalidades Futuras

- [ ] Espacios de trabajo colaborativos (Workspaces)
- [ ] Comentarios en documentos
- [ ] Etiquetas y categorías
- [ ] Notificaciones de cambios
- [ ] Auditoría completa de accesos
- [ ] Exportación masiva de documentos
- [ ] Integración con otros sistemas
- [ ] Previews para más tipos de archivo

---

## 📞 Soporte

Para dudas sobre el Repositorio de IA:

- **Documentación técnica**: `/src/modules/probo-ai/docs/`
- **Código fuente**: `/src/modules/probo-ai/`
- **Issues**: Consultar el repositorio de GitHub

---

**Última actualización**: Diciembre 2024  
**Versión**: 2.5.0


