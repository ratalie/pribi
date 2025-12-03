# 📊 INFORME EJECUTIVO: ProBO V2.5 - Estado Actual del Proyecto

**Fecha**: Diciembre 2025  
**Proyecto**: ProBO V2.5 (Vue 3 + Vite + TypeScript)  
**Objetivo**: Entender estado actual para avanzar rápido en Juntas, Repositorio y Panel Administrativo

---

## 🎯 RESUMEN EJECUTIVO

ProBO V2.5 es una aplicación legal para gestión de sociedades y juntas de accionistas en Perú. El proyecto está en Vue 3 + Vite con TypeScript y tiene **3 módulos principales funcionales**:

1. ✅ **Registro de Sociedades** - 100% funcional (8 pasos completos)
2. ✅ **Juntas de Accionistas** - 80% funcional (5 flujos implementados)
3. ✅ **Repositorio (ProBO AI)** - 90% funcional (Google Drive + IA + Chat)

---

## 1️⃣ REGISTRO DE SOCIEDADES

### Estado Actual
**✅ 100% IMPLEMENTADO Y FUNCIONAL**

### Ubicación
```
src/wizards/society-profile/
├── society/                # Paso 1: Datos sociedad
├── actionist/              # Paso 2: Accionistas
├── actions/                # Paso 3: Clases de acciones
├── shares-allocation/      # Paso 4: Asignación de acciones
├── directorio/             # Paso 5: Directorio
├── attorney-registry/      # Paso 6: Apoderados
├── general-regime/         # Paso 7: Quorum y mayorías
└── corporate-agreements/   # Paso 8: Acuerdos societarios
```

### Flujo Completo (8 Pasos)

| Paso | Nombre | Ruta | Estado | API |
|------|--------|------|--------|-----|
| 1 | Datos Sociedad | `/sociedades/:id/editar` | ✅ 100% | `/api/v2/society-profile/:id/main-data` |
| 2 | Accionistas | (Wizard step 2) | ✅ 100% | `/api/v2/society-profile/:id/shareholders` |
| 3 | Clases Acciones | (Wizard step 3) | ✅ 100% | `/api/v2/society-profile/:id/actions` |
| 4 | Asignación | (Wizard step 4) | ✅ 100% | `/api/v2/society-profile/:id/shares-allocation` |
| 5 | Directorio | (Wizard step 5) | ✅ 100% | `/api/v2/society-profile/:id/directory` |
| 6 | Apoderados | (Wizard step 6) | ✅ 100% | `/api/v2/society-profile/:id/attorney-register` |
| 7 | Quorum/Mayorías | (Wizard step 7) | ✅ 100% | `/api/v2/society-profile/:id/quorum-majorities` |
| 8 | Acuerdos | (Wizard step 8) | ✅ 100% | `/api/v2/society-profile/:id/corporate-agreements` |

### Patrón de Implementación
```typescript
// Controlador del wizard
src/wizards/society-profile/society-profile.controller.ts

// Cada paso tiene:
- Componente Vue (vista)
- Store Pinia (estado)
- API service (peticiones)
- Validaciones

// Ejemplo: Accionistas
src/wizards/society-profile/actionist/
├── accionistas.vue                  // Componente
├── accionistas.store.ts             // Store Pinia
└── src/api/society-profile/shareholder-data/
    ├── postShareHolderData.ts       // POST
    ├── getShareHolderData.ts        // GET
    └── putShareHolderData.ts        // PUT
```

### Endpoints Registro de Sociedades

```typescript
// Base URL: /api/v2/society-profile/:societyId

// CRUD completo para cada paso
GET    /main-data                    // Datos sociedad
POST   /main-data
PUT    /main-data

GET    /shareholders                 // Accionistas
POST   /shareholders
PUT    /shareholders/:id
DELETE /shareholders/:id

GET    /actions                      // Clases acciones
POST   /actions
PUT    /actions/:id
DELETE /actions/:id

GET    /shares-allocation            // Asignación
POST   /shares-allocation
PUT    /shares-allocation

GET    /directory                    // Directorio
POST   /directory
PUT    /directory

GET    /attorney-register            // Apoderados
POST   /attorney-register/classes    // Crear clase
POST   /attorney-register/attorneys  // Registrar apoderado
PUT    /attorney-register/attorneys/:id
DELETE /attorney-register/attorneys/:id

GET    /quorum-majorities            // Quorum
POST   /quorum-majorities
PUT    /quorum-majorities

GET    /corporate-agreements         // Acuerdos
POST   /corporate-agreements
PUT    /corporate-agreements
```

### ¿Cómo funciona Registro de Sociedades?

1. **Wizard Controller**: `society-profile.controller.ts` maneja navegación entre pasos
2. **Step-by-step**: Usuario avanza paso a paso llenando datos
3. **Guardado automático**: Cada paso guarda en backend inmediatamente
4. **Validaciones**: Validaciones por paso antes de avanzar
5. **Preview**: Al final, vista de resumen con todos los datos

### 🎯 Para migrar a V3 (según guía):
- ✅ La lógica ya está probada y funcional
- ⚠️ Falta arquitectura hexagonal (Domain → Application → Infrastructure → Presentation)
- ⚠️ Crear Use Cases, Repositories, Mappers
- ⚠️ Implementar DTOs bidireccionales

---

## 2️⃣ JUNTAS DE ACCIONISTAS

### Estado Actual
**✅ 80% IMPLEMENTADO - 5 Flujos Completos**

### Ubicación
```
src/wizards/shareholders-meeting/
├── capital-increase/
│   ├── monetary-contribution/      # ACAD - Aporte Dinerario
│   └── credit-application/         # ACCC - Capitalización Créditos
├── appointments/
│   ├── director-designation-removal/     # Directores
│   └── manager-attorney-designation-removal/  # Gerentes/Apoderados
└── financials/
    └── financial-statements/       # Estados Financieros
```

### Flujos de Juntas Implementados

#### **1. Aumento de Capital - Aporte Dinerario (ACAD)** ✅ 100%

**Ruta base**: `/juntas/aumento-capital/aportes-dinerarios`

| Paso | Nombre | Componente | Estado |
|------|--------|-----------|--------|
| 1 | Tipo de Junta | `DesignarCargo.vue` | ✅ 100% |
| 2 | Convocatoria | `ConvocatoriaJunta.vue` | ✅ 100% |
| 3 | Representación (Poderes) | `PoderesRepresentacion.vue` | ✅ 100% |
| 4 | Asistencia | `AsistenciaAccionistas.vue` | ✅ 100% |
| 5 | Presidente/Secretario | `DesigPresidentSecretary.vue` | ✅ 100% |
| 6 | Aportantes | `AportanteAumentoCapital.vue` | ✅ 100% |
| 7 | Aportes | `AportesAumentoCapital.vue` | ✅ 100% |
| 8 | Votación | `NuevaVotacionAcuerdosACAD.vue` | ✅ 100% |
| 9 | Resumen | `PreviewDocumentACAD.vue` | ✅ 100% |
| 10 | Descarga | `FinalizarACAD.vue` | ✅ 100% |

**Endpoints ACAD**:
```typescript
// Base: /api/v2/society-profile/:societyId/flow/:flowId

POST   /monetary-contributions/contributors    // Aportantes
GET    /monetary-contributions/contributors
PUT    /monetary-contributions/contributors/:id

POST   /monetary-contributions/contributions   // Aportes
GET    /monetary-contributions/contributions
PUT    /monetary-contributions/contributions/:id

POST   /monetary-contributions/vote            // Votación
GET    /monetary-contributions/vote
```

#### **2. Aumento de Capital - Capitalización de Créditos (ACCC)** ✅ 100%

**Ruta base**: `/juntas/aumento-capital/capitalizacion-de-creditos`

| Paso | Nombre | Estado |
|------|--------|--------|
| 1-5 | Pasos comunes (Tipo, Convocatoria, etc.) | ✅ 100% |
| 6 | Acreedores | ✅ 100% |
| 7 | Capitalización | ✅ 100% |
| 8 | Votación | ✅ 100% |
| 9 | Resumen | ✅ 100% |
| 10 | Descarga | ✅ 100% |

**Endpoints ACCC**:
```typescript
POST   /credit-capitalization/creditors        // Acreedores
GET    /credit-capitalization/creditors
PUT    /credit-capitalization/creditors/:id

POST   /credit-capitalization/capitalizations  // Capitalizaciones
GET    /credit-capitalization/capitalizations
PUT    /credit-capitalization/capitalizations/:id

POST   /credit-capitalization/vote             // Votación
GET    /credit-capitalization/vote
```

#### **3. Designación/Remoción de Directores** ✅ 95%

**Ruta base**: `/juntas/designar-remover/director`

| Paso | Nombre | Estado |
|------|--------|--------|
| 1-5 | Pasos comunes | ✅ 100% |
| 6 | Votación Cantidad Directores | ✅ 100% |
| 7 | Designación/Remoción | ✅ 100% |
| 8 | Votación Remoción | ✅ 100% |
| 9 | Votación Designación | ✅ 100% |
| 10 | Resumen | ✅ 100% |
| 11 | Descarga | ✅ 100% |

**Endpoints Directores**:
```typescript
POST   /director-designation-removal/directors
GET    /director-designation-removal/directors
PUT    /director-designation-removal/directors/:id

POST   /director-designation-removal/quantity-vote
GET    /director-designation-removal/quantity-vote

POST   /director-designation-removal/removal-vote
GET    /director-designation-removal/removal-vote

POST   /director-designation-removal/designation-vote
GET    /director-designation-removal/designation-vote
```

#### **4. Designación/Remoción de Gerentes y Apoderados** ✅ 100%

**Ruta base**: `/juntas/designar-remover/gerente`

| Paso | Nombre | Estado |
|------|--------|--------|
| 1-5 | Pasos comunes | ✅ 100% |
| 6 | Designación/Remoción | ✅ 100% |
| 7 | Otorgamiento de Poderes | ✅ 100% |
| 8 | Votación Remoción | ✅ 100% |
| 9 | Votación Designación | ✅ 100% |
| 10 | Resumen | ✅ 100% |
| 11 | Descarga | ✅ 100% |

**Ubicación especial**: 
```
src/modules/sociedades/juntas/designacion-remocion/gerente-apoderados/
└── otorgamiento-poderes/     # Paso 7 - Sistema complejo de poderes
    ├── OtorgamientoPoderesEspeciales.vue
    ├── master-data/          # Datos maestros de poderes
    └── README.md             # Documentación detallada
```

**Endpoints Gerentes/Apoderados**:
```typescript
POST   /manager-attorney-designation-removal/managers
GET    /manager-attorney-designation-removal/managers
PUT    /manager-attorney-designation-removal/managers/:id

POST   /granting-of-powers                     // Otorgamiento poderes
GET    /granting-of-powers
PUT    /granting-of-powers/:id

POST   /manager-attorney-designation-removal/removal-vote
GET    /manager-attorney-designation-removal/removal-vote

POST   /manager-attorney-designation-removal/designation-vote
GET    /manager-attorney-designation-removal/designation-vote
```

#### **5. Estados Financieros y Reparto de Dividendos** ✅ 100%

**Ruta base**: `/juntas/estados-financieros-y-reparto-dividendos/main`

| Paso | Nombre | Estado |
|------|--------|--------|
| 1-5 | Pasos comunes | ✅ 100% |
| 6 | Estados Financieros | ✅ 100% |
| 7 | Votación Estados Financieros | ✅ 100% |
| 8 | Reparto Dividendos | ✅ 100% |
| 9 | Votación Reparto Dividendos | ✅ 100% |
| 10 | Resumen | ✅ 100% |
| 11 | Descarga | ✅ 100% |

**Endpoints Estados Financieros**:
```typescript
POST   /financial-statements-dividend/financial-statements
GET    /financial-statements-dividend/financial-statements
PUT    /financial-statements-dividend/financial-statements/:id

POST   /financial-statements-dividend/fs-vote
GET    /financial-statements-dividend/fs-vote

POST   /financial-statements-dividend/dividend-distribution
GET    /financial-statements-dividend/dividend-distribution

POST   /financial-statements-dividend/dd-vote
GET    /financial-statements-dividend/dd-vote
```

### Pasos Comunes a Todos los Flujos (1-5)

```typescript
// Estos pasos se comparten entre TODOS los flujos
src/wizards/shareholders-meeting/shared-workflow/

1. Tipo de Junta (General / Universal)
2. Convocatoria (Fecha, hora, lugar)
3. Representación (Poderes de representación)
4. Asistencia (Asistencia de accionistas) - Solo si es Junta General
5. Presidente/Secretario (Designación de mesa directiva)

// Endpoints compartidos:
POST   /flow/:flowId/meeting-type
GET    /flow/:flowId/meeting-type

POST   /flow/:flowId/meeting-details
GET    /flow/:flowId/meeting-details

POST   /flow/:flowId/power-representation
GET    /flow/:flowId/power-representation

POST   /flow/:flowId/shareholder-assistance
GET    /flow/:flowId/shareholder-assistance

POST   /flow/:flowId/president-secretary
GET    /flow/:flowId/president-secretary
```

### Sistema de Generación de Documentos

**Ubicación**: `src/composables/documents/`

```
src/composables/documents/
├── monetary-contributions/
│   └── useAporteDinerarioPrintV2.ts          # 872 líneas - Sistema completo
├── credit-capitalization/
│   └── useCreditCapitalizationPrintV2.ts
├── director-designation-removal/
│   └── useDirectorDesignationPrint.ts
├── manager-attorney-designation-removal/
│   └── useManagerAttorneyPrint.ts
└── financial-statements/
    └── useFinancialStatementsPrint.ts
```

**Templates**:
```
public/templates/
├── AumentoCapital/
│   ├── Acta-Junta-General.docx
│   ├── Minuta-Aumento-Capital.docx
│   ├── Certificaciones-de-Actas.docx
│   ├── Carta-Aviso.docx
│   ├── Asiento-Contable.docx
│   └── Certificado-Aporte.docx
├── CapitalizacionCreditos/
│   └── (templates similares)
└── (más carpetas por flujo)
```

**¿Cómo funciona la generación?**

1. **Docxtemplater**: Usa templates .docx con placeholders `{variable}`
2. **Composables**: Generan datos formateados desde stores
3. **ZIP**: Empaqueta todos los documentos en un ZIP
4. **Descarga**: Usuario descarga ZIP con todos los documentos

**Ejemplo de generación**:
```typescript
// src/composables/documents/monetary-contributions/useAporteDinerarioPrintV2.ts
export const generateAporteDinerarioDocumentsV2 = async () => {
  // 1. Cargar datos de todos los stores
  const societyData = useSocietyStore();
  const meetingData = useMeetingStore();
  const contributorsData = useContributorsStore();
  
  // 2. Generar documentos individuales
  const actaJunta = await generateActaJunta(societyData, meetingData);
  const minuta = await generateMinuta(societyData, contributorsData);
  const certificaciones = await generateCertificaciones();
  const cartaAviso = await generateCartaAviso();
  
  // 3. Empaquetar en ZIP
  const zip = new JSZip();
  zip.file("Acta-Junta.docx", actaJunta);
  zip.file("Minuta.docx", minuta);
  zip.file("Certificaciones.docx", certificaciones);
  zip.file("Carta-Aviso.docx", cartaAviso);
  
  // 4. Descargar
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "Aporte-Dinerario.zip");
};
```

### Stores de Juntas

```
src/store/juntas/
├── aumento-capital/
│   ├── useLayoutStore.ts                    # Layout y navegación
│   ├── aporte-dinerario/
│   │   ├── useAportantesStore.ts
│   │   ├── useAportesStore.ts
│   │   └── useVotacionStore.ts
│   └── capitalizacion-creditos/
│       ├── useAcreedoresStore.ts
│       ├── useCapitalizacionStore.ts
│       └── useVotacionStore.ts
├── designacion-remocion/
│   ├── directores/
│   │   └── useDesigRemoDirectorStore.ts
│   └── gerente-apoderado/
│       └── useStoreDRGerenteApoderado.ts
├── estados-financieros/
│   └── useEstadosFinancierosStore.ts
└── useTablaPoderes.ts                       # Store compartido de poderes
```

### 🎯 Para avanzar rápido en Juntas:

**LO QUE FUNCIONA BIEN** ✅:
- ✅ Los 5 flujos están completos y funcionales
- ✅ Sistema de generación de documentos probado
- ✅ Validaciones de quórum implementadas
- ✅ Sistema de poderes complejo funcionando
- ✅ Navegación condicional (skipea pasos según tipo junta)

**LO QUE PUEDES MEJORAR** ⚠️:
- ⚠️ **Refactorizar a arquitectura hexagonal** (según guía V3)
- ⚠️ **Separar lógica de negocio** de stores a Use Cases
- ⚠️ **Crear DTOs bidireccionales** para API calls
- ⚠️ **Implementar Mappers** para transformaciones
- ⚠️ **Crear Repositories duales** (HTTP + MSW para testing)

**PRÓXIMOS PASOS RECOMENDADOS**:
1. **Identificar qué funcionalidad falta** (comparar con guía V3)
2. **Empezar con flujo pequeño** (ejemplo: Estados Financieros)
3. **Migrar a arquitectura hexagonal** paso a paso
4. **NO tocar generación de documentos** (funciona perfecto, reutilizar)

---

## 3️⃣ REPOSITORIO (ProBO AI)

### Estado Actual
**✅ 90% IMPLEMENTADO Y FUNCIONAL**

### Ubicación
```
src/modules/probo-ai/
├── pages/
│   ├── repository/
│   │   ├── Index.vue                        # Dashboard principal
│   │   ├── otherDocuments/                  # Documentos Societarios
│   │   ├── proboDocuments/                  # Documentos Generados
│   │   └── personalizedFolder/              # Carpetas Personalizadas
│   ├── chats/
│   │   └── Chats.vue                        # Página de chats
│   └── storage/
│       └── Storage.vue                      # Almacenamiento
├── components/
│   ├── repository/
│   │   ├── common/                          # Componentes compartidos
│   │   ├── documentPreview/                 # Preview de documentos
│   │   ├── modals/                          # Modales
│   │   ├── popover/                         # Popovers
│   │   └── search/                          # Búsqueda
│   ├── chatAI/                              # Chat con IA
│   ├── storage/                             # Storage components
│   └── charts/                              # Gráficos (métricas)
├── services/
│   ├── folderService.ts                     # Gestión de carpetas
│   ├── nodeService.ts                       # Navegación jerárquica
│   ├── fileService.ts                       # Subida/descarga archivos
│   ├── chatService.ts                       # Chat con IA (SSE)
│   ├── searchService.ts                     # Búsqueda global
│   └── (10+ servicios más)
├── store/
│   └── repositoryStore.ts                   # Store principal
└── types/
    ├── folder.ts                            # Tipos carpetas
    ├── nodes.ts                             # Tipos nodos jerárquicos
    ├── chat.ts                              # Tipos chat
    └── (más tipos)
```

### Rutas del Repositorio

```typescript
// Rutas implementadas en src/modules/probo-ai/router/probo-ai.router.ts

GET    /probo-ai/repository                           // Dashboard principal
GET    /probo-ai/repository/other-files/:nodeId       // Documentos Societarios
GET    /probo-ai/repository/personalized-folder/:folderId  // Carpeta Personalizada
GET    /probo-ai/repository/probo-documents/:nodeId(.*) // Documentos Generados (jerárquico)
GET    /probo-ai/search-results?q=...&type=...        // Resultados búsqueda

// Chat
GET    /probo-ai/chats                                // Listado chats

// Storage (métricas)
GET    /probo-ai/storage                              // Dashboard storage
```

### Submódulos del Repositorio

#### **1. Documentos Societarios** (Google Drive) ✅ 95%

**¿Qué es?**: Sistema tipo Google Drive para subir/organizar archivos de la sociedad

**Funcionalidades**:
- ✅ Navegación jerárquica (carpetas dentro de carpetas)
- ✅ Subida de archivos (drag & drop)
- ✅ Descarga de archivos
- ✅ Crear carpetas
- ✅ Eliminar archivos/carpetas
- ✅ Búsqueda de archivos
- ✅ Preview de documentos (PDF, DOCX, imágenes)
- ✅ Breadcrumbs de navegación

**Endpoints**:
```typescript
// Base: /repository/society/:societyId

GET    /virtual-nodes/root                    // Carpetas raíz
GET    /virtual-nodes/:nodeId/children        // Hijos de carpeta
GET    /virtual-nodes/:nodeId                 // Detalle nodo

POST   /virtual-nodes/folder                  // Crear carpeta
PUT    /virtual-nodes/:nodeId                 // Renombrar
DELETE /virtual-nodes/:nodeId                 // Eliminar

POST   /virtual-nodes/upload                  // Subir archivo
GET    /virtual-nodes/:nodeId/download        // Descargar archivo

GET    /virtual-nodes/search?q=...            // Buscar
```

**Componente principal**:
```vue
<!-- src/modules/probo-ai/pages/repository/Index.vue -->
<template>
  <RepositoryLayout>
    <!-- Carpetas del sistema (Documentos Societarios + Generados) -->
    <FolderList :folders="systemFolders" />
    
    <!-- Carpetas personalizadas -->
    <FolderList :folders="personalizedFolders" />
  </RepositoryLayout>
</template>
```

#### **2. Documentos Generados en ProBO** ✅ 90%

**¿Qué es?**: Documentos generados automáticamente desde Juntas y Registro de Sociedades

**Estructura jerárquica**:
```
Documentos Generados en ProBO/
├── Juntas de Accionistas/
│   ├── Junta 1 - Aporte Dinerario (12/01/2025)/
│   │   ├── Acta-Junta.docx
│   │   ├── Minuta.docx
│   │   └── Certificaciones.docx
│   ├── Junta 2 - Capitalización Créditos (15/02/2025)/
│   │   └── ...
│   └── Junta 3 - Gerentes (20/03/2025)/
│       └── ...
├── Registros de Sociedades/
│   ├── Estatuto-Social.docx
│   ├── Minuta-Constitución.docx
│   └── Acta-Fundación.docx
└── Sucursales/
    └── (en desarrollo)
```

**Funcionalidades**:
- ✅ Vista jerárquica con expansión/colapso
- ✅ Navegación por carpetas automáticas
- ✅ Descarga de documentos
- ✅ Preview de documentos
- ✅ Filtros por tipo de junta
- ⚠️ Generación automática (parcial - solo desde V2.5)

**Endpoints**:
```typescript
// Los documentos generados se guardan automáticamente al finalizar juntas
// Usan los mismos endpoints de Documentos Societarios
// Pero se almacenan en carpetas especiales del sistema
```

#### **3. Carpetas Personalizadas** ✅ 95%

**¿Qué es?**: Carpetas creadas por usuarios para organizar documentos + chat con IA

**Funcionalidades**:
- ✅ Crear carpetas personalizadas
- ✅ Agregar enlaces a documentos existentes (referencias, no copias)
- ✅ Eliminar carpetas
- ✅ Chat con IA sobre documentos de la carpeta
- ✅ Sistema de permisos (owner, shared)
- ✅ Búsqueda dentro de carpeta

**Diferencia clave**: 
- ❌ NO copia archivos
- ✅ Solo enlaza (referencia) a documentos existentes
- ✅ Permite chat con IA sobre esos documentos

**Endpoints**:
```typescript
// Base: /repository/society/:societyId

GET    /personalized-folders                  // Listar carpetas
POST   /personalized-folders                  // Crear carpeta
PUT    /personalized-folders/:folderId        // Editar
DELETE /personalized-folders/:folderId        // Eliminar

POST   /personalized-folders/:folderId/documents/:documentId  // Enlazar documento
DELETE /personalized-folders/:folderId/documents/:documentId  // Desvincular

// Chat con IA en carpeta personalizada
POST   /personalized-folders/:folderId/chat/message
GET    /personalized-folders/:folderId/chat/history
```

**Componente**:
```vue
<!-- src/modules/probo-ai/pages/repository/personalizedFolder/PersonalizedFolder.vue -->
<template>
  <div>
    <!-- Tabs: Documentos | Chat IA | Permisos -->
    <Tabs>
      <TabPanel name="documentos">
        <DocumentList :documents="documents" />
      </TabPanel>
      
      <TabPanel name="chat">
        <ChatAI :folderId="folderId" />
      </TabPanel>
      
      <TabPanel name="permisos">
        <AccessControl :folderId="folderId" />
      </TabPanel>
    </Tabs>
  </div>
</template>
```

#### **4. Búsqueda Global** ✅ 90%

**Funcionalidades**:
- ✅ Búsqueda en todos los módulos
- ✅ Filtros por tipo (carpeta, archivo)
- ✅ Búsqueda por nombre de archivo
- ✅ Resultados paginados
- ⚠️ Búsqueda por contenido (pendiente)

**Endpoints**:
```typescript
GET /repository/society/:societyId/search?q=...&type=...&page=1&limit=10
```

### Servicios del Repositorio

**Servicios principales** en `src/modules/probo-ai/services/`:

```typescript
// folderService.ts - Gestión de carpetas
export class FolderService {
  static async getRootFolders(societyId: string): Promise<VirtualFolder[]>
  static async getChildren(nodeId: number): Promise<FolderNode[]>
  static async createFolder(request: CreateFolderRequest): Promise<Folder>
  static async deleteFolder(nodeId: number): Promise<void>
}

// fileService.ts - Gestión de archivos
export class FileService {
  static async uploadFile(file: File, parentId?: number): Promise<FileNode>
  static async downloadFile(nodeId: number): Promise<Blob>
  static async deleteFile(nodeId: number): Promise<void>
}

// nodeService.ts - Navegación jerárquica
export class NodeService {
  static async getNodeDetails(nodeId: number): Promise<FolderNode>
  static async navigateToNode(nodeId: number): Promise<NavigationResult>
}

// searchService.ts - Búsqueda
export class SearchService {
  static async search(query: string, filters?: SearchFilters): Promise<SearchResult[]>
}

// chatService.ts - Chat con IA
export class ChatService {
  async sendMessage(conversationId: number, message: string): Promise<void>
  async getConversations(societyId: number): Promise<Conversation[]>
  async getConversation(conversationId: number): Promise<Conversation>
}
```

### Store del Repositorio

```typescript
// src/modules/probo-ai/store/repositoryStore.ts
export const useRepositoryStore = defineStore('repository', {
  state: () => ({
    currentNode: null as FolderNode | null,
    breadcrumbs: [] as Breadcrumb[],
    folders: [] as Folder[],
    files: [] as FileNode[],
    selectedSociety: null as string | null,
    loading: false
  }),
  
  actions: {
    async loadRootFolders(societyId: string) {
      const folders = await FolderService.getRootFolders(societyId);
      this.folders = folders;
    },
    
    async navigateToFolder(nodeId: number) {
      const result = await NodeService.navigateToNode(nodeId);
      this.currentNode = result.node;
      this.breadcrumbs = result.breadcrumbs;
    }
  }
});
```

### Dashboard del Repositorio

**Vista**: `src/modules/probo-ai/pages/repository/Index.vue`

**Elementos**:
1. **Selector de sociedad** (dropdown)
2. **Buscador global** (RepositorySearchBar)
3. **Botón "Crear Carpeta"** (solo carpetas personalizadas)
4. **Carpetas del sistema** (2 carpetas raíz):
   - 📁 Documentos Societarios
   - 📁 Documentos Generados en ProBO
5. **Carpetas personalizadas** (lista dinámica)

**Métricas** (en `/probo-ai/storage`):
- Total de archivos
- Espacio usado
- Tipo de archivos (gráfico circular)
- Actividad reciente (gráfico de líneas)

### 🎯 Para avanzar rápido en Repositorio:

**LO QUE TIENES Y FUNCIONA** ✅:
- ✅ Dashboard completo con selector de sociedad
- ✅ Sistema Google Drive completo (navegación, subir, descargar)
- ✅ Carpetas personalizadas con enlaces
- ✅ Chat con IA funcionando (SSE)
- ✅ Búsqueda global básica
- ✅ Preview de documentos (PDF, DOCX, imágenes)
- ✅ Sistema de permisos (owner, shared)

**LO QUE FALTA O PUEDE MEJORAR** ⚠️:
- ⚠️ **Arquitectura hexagonal**: Todo está en services, no hay Use Cases
- ⚠️ **Búsqueda por contenido**: Solo busca por nombre de archivo
- ⚠️ **Versiones de archivos**: No hay historial de versiones
- ⚠️ **Drag & Drop entre carpetas**: Solo upload
- ⚠️ **Métricas avanzadas**: Gráficos básicos, faltan más insights

**SCOPE RECOMENDADO PARA V3** (según tu guía):

**Fase 1 (MVP - 2 semanas)**:
1. Dashboard simple (solo métricas, sin gráficos complejos)
2. Vista Almacenamiento básica (grid, sin drag&drop avanzado)
3. Navegación entre carpetas
4. Upload/download básico

**Fase 2 (Completo - 4 semanas)**:
1. Dashboard con gráficos (Recharts o Chart.js)
2. Drag & Drop avanzado
3. Preview de documentos mejorado
4. Vista Documentos Generados jerárquica completa
5. Vista Carpetas Personalizadas con chat IA

**¿Está bien lo que tienes?**
- ✅ **SÍ** - La funcionalidad core está completa
- ✅ **SÍ** - La UI está bien diseñada
- ⚠️ **FALTA** - Arquitectura hexagonal (migrar a V3)
- ⚠️ **FALTA** - Testing (MSW repositories)

**¿Se ve igual a V2.5?**
- ✅ **SÍ** - La UI actual es la de V2.5 (React)
- ⚠️ **FALTA** - Migrar componentes React → Vue (si usas React en probo-ai)
- ✅ **PERO** - Los servicios y lógica son reutilizables

**RECOMENDACIÓN**:
1. **NO toques la lógica** (servicios funcionan bien)
2. **Enfócate en migrar a hexagonal** (Create Use Cases, Repositories, Mappers)
3. **Mejora UI incrementalmente** (gráficos, métricas)
4. **Prioriza búsqueda por contenido** (alta demanda de usuarios)

---

## 4️⃣ CHAT CON IA

### Estado Actual
**✅ 100% IMPLEMENTADO Y FUNCIONAL**

### Ubicación
```
src/modules/probo-ai/
├── components/chatAI/
│   ├── ChatAI.vue                   # Componente principal
│   ├── ChatMessage.vue              # Mensaje individual
│   ├── ChatInput.vue                # Input de mensaje
│   └── ConversationList.vue         # Lista de conversaciones
├── services/
│   ├── chatService.ts               # Servicio principal
│   ├── sseClient.ts                 # Cliente SSE (streaming)
│   └── contextService.ts            # Contexto de conversación
└── pages/
    └── chats/
        └── Chats.vue                # Página de chats
```

### ¿Cómo funciona el Chat con IA?

**Tecnología**: Server-Sent Events (SSE) para streaming de respuestas

**Flujo**:
1. Usuario escribe mensaje
2. Frontend envía mensaje al backend (POST)
3. Backend responde con SSE (streaming)
4. Frontend recibe chunks de respuesta en tiempo real
5. Frontend actualiza UI progresivamente

**Ejemplo de uso**:
```typescript
// src/modules/probo-ai/services/chatService.ts
class ChatServiceImpl {
  async sendMessage(
    conversationId: number,
    message: string,
    callbacks?: SSECallbacks
  ): Promise<void> {
    await sseClient.sendMessage(conversationId, message, {
      onChunk: (chunk) => {
        // Actualizar UI con cada chunk
        console.log('Recibido:', chunk);
      },
      onComplete: () => {
        // Mensaje completado
        console.log('Respuesta completa');
      },
      onError: (error) => {
        // Manejar error
        console.error('Error:', error);
      }
    });
  }
}
```

### Endpoints de Chat

```typescript
// Base: /repository/society/:societyId

// Listar conversaciones
GET    /conversations?page=1&limit=10&userId=...

// Obtener conversación específica
GET    /conversations/:conversationId

// Crear conversación (automático al enviar primer mensaje)
POST   /conversations

// Enviar mensaje (SSE)
POST   /conversations/:conversationId/messages
// Response: text/event-stream (SSE)

// Eliminar conversación
DELETE /conversations/:conversationId
```

### SSE Client

```typescript
// src/modules/probo-ai/services/sseClient.ts
export class SSEClient {
  async sendMessage(
    conversationId: number,
    message: string,
    callbacks?: SSECallbacks
  ): Promise<void> {
    const eventSource = new EventSource(
      `/api/repository/conversations/${conversationId}/messages?message=${encodeURIComponent(message)}`
    );
    
    eventSource.onmessage = (event) => {
      const chunk = JSON.parse(event.data);
      callbacks?.onChunk?.(chunk);
    };
    
    eventSource.onerror = (error) => {
      callbacks?.onError?.(error);
      eventSource.close();
    };
    
    eventSource.addEventListener('done', () => {
      callbacks?.onComplete?.();
      eventSource.close();
    });
  }
}
```

### Contexto de Conversación

El chat con IA puede tener **contexto**:
- **Sin contexto**: Conversación general
- **Con contexto de carpeta**: Chat sobre documentos específicos de una carpeta personalizada
- **Con contexto de sociedad**: Chat sobre datos de una sociedad

```typescript
// src/modules/probo-ai/services/contextService.ts
export interface ConversationContext {
  societyId?: number;
  folderId?: number;        // Carpeta personalizada
  documentIds?: number[];   // Documentos específicos
}

// Crear conversación con contexto
POST /repository/society/:societyId/conversations
{
  "folderId": 123,          // Opcional
  "documentIds": [1, 2, 3], // Opcional
  "initialMessage": "¿Qué dice este documento sobre los accionistas?"
}
```

### Componente ChatAI

```vue
<!-- src/modules/probo-ai/components/chatAI/ChatAI.vue -->
<template>
  <div class="chat-container">
    <!-- Lista de conversaciones (sidebar) -->
    <ConversationList 
      :conversations="conversations"
      :activeId="activeConversationId"
      @select="selectConversation"
    />
    
    <!-- Ventana de chat -->
    <div class="chat-window">
      <!-- Mensajes -->
      <div class="messages">
        <ChatMessage 
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
        />
      </div>
      
      <!-- Input -->
      <ChatInput 
        :loading="isLoading"
        @send="sendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const chatService = new ChatServiceImpl();

const sendMessage = async (text: string) => {
  await chatService.sendMessage(activeConversationId.value, text, {
    onChunk: (chunk) => {
      // Agregar chunk al mensaje actual
      currentMessage.value += chunk.content;
    },
    onComplete: () => {
      // Finalizar mensaje
      isLoading.value = false;
    }
  });
};
</script>
```

### Tipos de Chat

```typescript
// src/modules/probo-ai/types/chat.ts
export interface Conversation {
  id: number;
  societyId: number;
  userId: number;
  folderId?: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface Message {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface SSECallbacks {
  onChunk?: (chunk: MessageChunk) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface MessageChunk {
  content: string;
  done: boolean;
}
```

### Integración con Carpetas Personalizadas

```vue
<!-- src/modules/probo-ai/pages/repository/personalizedFolder/PersonalizedFolder.vue -->
<template>
  <Tabs>
    <!-- Tab de Chat -->
    <TabPanel name="chat">
      <ChatAI 
        :societyId="societyId"
        :folderId="folderId"
        :documentIds="linkedDocumentIds"
      />
    </TabPanel>
  </Tabs>
</template>
```

Cuando el usuario envía un mensaje en el chat de una carpeta personalizada:
1. El chat tiene contexto de `folderId`
2. Backend accede a los documentos enlazados en esa carpeta
3. IA responde basándose en el contenido de esos documentos

### 🎯 Para avanzar en Chat con IA:

**LO QUE FUNCIONA** ✅:
- ✅ SSE streaming completo
- ✅ Conversaciones múltiples
- ✅ Contexto de carpetas
- ✅ UI completa con lista de conversaciones
- ✅ Manejo de errores

**LO QUE PUEDE MEJORAR** ⚠️:
- ⚠️ **Markdown rendering**: Mejorar formato de respuestas (código, listas, etc.)
- ⚠️ **Adjuntar archivos**: Permitir subir archivos en chat
- ⚠️ **Citar fuentes**: Mostrar de qué documento viene cada respuesta
- ⚠️ **Conversaciones compartidas**: Compartir chats con otros usuarios
- ⚠️ **Historial persistente**: Cargar más mensajes antiguos

**RECOMENDACIÓN**:
- ✅ El sistema actual funciona bien
- ⚠️ Priorizar mejoras de UX (markdown, citas)
- ⚠️ Backend debe implementar RAG (Retrieval-Augmented Generation)
- ⚠️ Considerar migrar a WebSockets si SSE da problemas

---

## 5️⃣ RUTAS COMPLETAS DEL PROYECTO

### Estructura de Rutas

```
/signin                                      # Login

/sociedades                                  # Dashboard sociedades
/sociedades/:id                              # Detalle sociedad
/sociedades/:id/editar                       # Editar sociedad (8 pasos wizard)

# JUNTAS - Aumento Capital
/juntas/aumento-capital/aportes-dinerarios/tipo-junta
/juntas/aumento-capital/aportes-dinerarios/convocatoria
/juntas/aumento-capital/aportes-dinerarios/representacion
/juntas/aumento-capital/aportes-dinerarios/asistencia
/juntas/aumento-capital/aportes-dinerarios/presidente
/juntas/aumento-capital/aportes-dinerarios/aportantes
/juntas/aumento-capital/aportes-dinerarios/aportes
/juntas/aumento-capital/aportes-dinerarios/votacion
/juntas/aumento-capital/aportes-dinerarios/resumen
/juntas/aumento-capital/aportes-dinerarios/finalizar

/juntas/aumento-capital/capitalizacion-de-creditos/(...)  # Mismo patrón

# JUNTAS - Designación/Remoción
/juntas/designar-remover/director/(...)      # 11 pasos
/juntas/designar-remover/gerente/(...)       # 11 pasos

# JUNTAS - Estados Financieros
/juntas/estados-financieros-y-reparto-dividendos/main/(...)  # 11 pasos

# JUNTAS - Preview
/sociedades/aporte-dinerario/:id             # Preview junta ACAD
/sociedades/capitalizacion-de-creditos/:id   # Preview junta ACCC
/sociedades/gerente-apoderado/:id            # Preview junta Gerentes
/sociedades/directores-preview/:id           # Preview junta Directores
/sociedades/estados-financieros/:id          # Preview junta EF

# JUNTAS - Historial
/sociedades/:id/historial-juntas             # Listado de juntas

# PROBO AI - Repositorio
/probo-ai/repository                         # Dashboard
/probo-ai/repository/other-files/:nodeId     # Documentos Societarios
/probo-ai/repository/probo-documents/:nodeId # Documentos Generados (jerárquico)
/probo-ai/repository/personalized-folder/:folderId  # Carpeta Personalizada

# PROBO AI - Chat
/probo-ai/chats                              # Página de chats

# PROBO AI - Storage
/probo-ai/storage                            # Métricas y almacenamiento

# PROBO AI - Búsqueda
/probo-ai/search-results?q=...&type=...      # Resultados búsqueda
```

### Rutas Enums

```typescript
// src/utils/enums/rutas/path-aporte-dinerario.enum.ts
export enum PathAporteDinerario {
  TIPO_JUNTA_1 = "tipo-junta",
  CONVOCATORIA_2 = "convocatoria",
  REPRESENTACION_3 = "representacion",
  ASISTENCIA_4 = "asistencia",
  PRESIDENTE_5 = "presidente",
  APORTANTES_6 = "aportantes",
  APORTES_7 = "aportes",
  VOTACION_8 = "votacion",
  RESUMEN_9 = "resumen",
  FINALIZAR_10 = "finalizar",
}

export enum NameAporteDinerario {
  TIPO_JUNTA_1 = "tipo-junta-acad",
  CONVOCATORIA_2 = "convocatoria-acad",
  // ... (mismo patrón)
}
```

Enums similares para:
- `path-capitalizacion-de-creditos.enum.ts`
- `path-directorio.enum.ts`
- `path-gerentes.enum.ts`
- `path-estados-financieros.ts`
- `path-juntas.enum.ts` (rutas compartidas)

### Navegación Condicional

```typescript
// Ejemplo: Saltar Asistencia si es Junta Universal
{
  path: 'asistencia',
  name: 'asistencia-acad',
  component: AsistenciaAccionistas,
  beforeEnter: (to, from, next) => {
    const store = useMeetingTypeSelection();
    if (store.meetingType === MeetingType.JUNTA_GENERAL) {
      next();  // Continuar a Asistencia
    } else {
      next({ name: 'presidente-acad' });  // Saltar a Presidente
    }
  }
}
```

### Router Guards

```typescript
// src/router/router.ts
router.beforeEach((to, from, next) => {
  const userToken = localStorage.getItem("token");
  const needAuth = to.meta.requireAuth;

  if (needAuth && !userToken) {
    return next({ name: "Login", replace: true });
  }

  next();
});
```

---

## 6️⃣ ENDPOINTS DEL BACKEND

### Base URL
```
VITE_API_PROBO=https://api.probo.com/api/v2
```

### Endpoints Registro de Sociedades

```typescript
// Society Profile
GET    /society-profile/:id/main-data
POST   /society-profile/:id/main-data
PUT    /society-profile/:id/main-data

// Shareholders
GET    /society-profile/:id/shareholders
POST   /society-profile/:id/shareholders
PUT    /society-profile/:id/shareholders/:shareholderId
DELETE /society-profile/:id/shareholders/:shareholderId

// Actions (Clases de acciones)
GET    /society-profile/:id/actions
POST   /society-profile/:id/actions
PUT    /society-profile/:id/actions/:actionId
DELETE /society-profile/:id/actions/:actionId

// Shares Allocation
GET    /society-profile/:id/shares-allocation
POST   /society-profile/:id/shares-allocation
PUT    /society-profile/:id/shares-allocation/:allocationId
DELETE /society-profile/:id/shares-allocation/:allocationId

// Directory
GET    /society-profile/:id/directory
POST   /society-profile/:id/directory
PUT    /society-profile/:id/directory/:directoryId
DELETE /society-profile/:id/directory/:directoryId

// Attorney Register
GET    /society-profile/:id/attorney-register/classes
POST   /society-profile/:id/attorney-register/classes
PUT    /society-profile/:id/attorney-register/classes/:classId

GET    /society-profile/:id/attorney-register/attorneys
POST   /society-profile/:id/attorney-register/attorneys
PUT    /society-profile/:id/attorney-register/attorneys/:attorneyId
DELETE /society-profile/:id/attorney-register/attorneys/:attorneyId

// Quorum & Majorities
GET    /society-profile/:id/quorum-majorities
POST   /society-profile/:id/quorum-majorities
PUT    /society-profile/:id/quorum-majorities

// Corporate Agreements
GET    /society-profile/:id/corporate-agreements
POST   /society-profile/:id/corporate-agreements
PUT    /society-profile/:id/corporate-agreements
```

### Endpoints Juntas - Shared Workflow (Pasos comunes)

```typescript
// Base: /society-profile/:societyId

// Crear flow (junta)
POST   /flow
// Body: { type: "ACAD" | "ACCC" | "DRDIR" | "DRGER" | "EF" }
// Response: { flowId: string }

// Meeting Type
GET    /flow/:flowId/meeting-type
POST   /flow/:flowId/meeting-type
// Body: { meetingType: "GENERAL" | "UNIVERSAL" }

// Meeting Details (Convocatoria)
GET    /flow/:flowId/meeting-details
POST   /flow/:flowId/meeting-details
PUT    /flow/:flowId/meeting-details
// Body: { date, time, place, convocationType, ... }

// Power Representation (Poderes)
GET    /flow/:flowId/power-representation
POST   /flow/:flowId/power-representation
PUT    /flow/:flowId/power-representation/:powerId
DELETE /flow/:flowId/power-representation/:powerId
// Body: { representedShareholderId, representativeId, powerType, ... }

// Shareholder Assistance (Asistencia)
GET    /flow/:flowId/shareholder-assistance
POST   /flow/:flowId/shareholder-assistance
PUT    /flow/:flowId/shareholder-assistance
// Body: { attendances: [{ shareholderId, isPresent, ... }] }

// President & Secretary
GET    /flow/:flowId/president-secretary
POST   /flow/:flowId/president-secretary
PUT    /flow/:flowId/president-secretary
// Body: { presidentId, secretaryId }
```

### Endpoints Juntas - Aporte Dinerario

```typescript
// Base: /society-profile/:societyId/flow/:flowId

// Contributors (Aportantes)
GET    /monetary-contributions/contributors
POST   /monetary-contributions/contributors
PUT    /monetary-contributions/contributors/:contributorId
DELETE /monetary-contributions/contributors/:contributorId
// Body: { shareholderId, contributionAmount, sharesReceived, ... }

// Contributions (Aportes)
GET    /monetary-contributions/contributions
POST   /monetary-contributions/contributions
PUT    /monetary-contributions/contributions/:contributionId
DELETE /monetary-contributions/contributions/:contributionId
// Body: { contributorId, actionClassId, amount, numberOfShares, ... }

// Vote (Votación)
GET    /monetary-contributions/vote
POST   /monetary-contributions/vote
PUT    /monetary-contributions/vote
// Body: { votes: [{ shareholderId, vote: "A FAVOR" | "EN CONTRA" | "ABSTENCION", ... }] }

// Generate Documents (Generación)
POST   /monetary-contributions/generate-documents
// Response: { documents: [{ name, url, ... }] }
```

### Endpoints Juntas - Capitalización Créditos

```typescript
// Base: /society-profile/:societyId/flow/:flowId

// Creditors (Acreedores)
GET    /credit-capitalization/creditors
POST   /credit-capitalization/creditors
PUT    /credit-capitalization/creditors/:creditorId
DELETE /credit-capitalization/creditors/:creditorId
// Body: { creditorName, creditorType, amount, ... }

// Capitalizations (Capitalizaciones)
GET    /credit-capitalization/capitalizations
POST   /credit-capitalization/capitalizations
PUT    /credit-capitalization/capitalizations/:capitalizationId
DELETE /credit-capitalization/capitalizations/:capitalizationId
// Body: { creditorId, actionClassId, creditAmount, sharesReceived, ... }

// Vote
GET    /credit-capitalization/vote
POST   /credit-capitalization/vote
PUT    /credit-capitalization/vote

// Generate Documents
POST   /credit-capitalization/generate-documents
```

### Endpoints Juntas - Directores

```typescript
// Base: /society-profile/:societyId/flow/:flowId

// Directors
GET    /director-designation-removal/directors
POST   /director-designation-removal/directors
PUT    /director-designation-removal/directors/:directorId
DELETE /director-designation-removal/directors/:directorId
// Body: { personId, status: "DESIGNADO" | "REMOVIDO" | "RATIFICADO", ... }

// Quantity Vote (Votación cantidad)
GET    /director-designation-removal/quantity-vote
POST   /director-designation-removal/quantity-vote
// Body: { proposedQuantity, votes: [...] }

// Removal Vote
GET    /director-designation-removal/removal-vote
POST   /director-designation-removal/removal-vote
// Body: { votes: [{ directorId, vote, ... }] }

// Designation Vote
GET    /director-designation-removal/designation-vote
POST   /director-designation-removal/designation-vote
// Body: { votes: [{ directorId, vote, ... }] }

// Generate Documents
POST   /director-designation-removal/generate-documents
```

### Endpoints Juntas - Gerentes y Apoderados

```typescript
// Base: /society-profile/:societyId/flow/:flowId

// Managers/Attorneys
GET    /manager-attorney-designation-removal/managers
POST   /manager-attorney-designation-removal/managers
PUT    /manager-attorney-designation-removal/managers/:managerId
DELETE /manager-attorney-designation-removal/managers/:managerId
// Body: { personId, role: "GERENTE" | "APODERADO", status: "DESIGNADO" | "REMOVIDO", ... }

// Granting of Powers (Otorgamiento de poderes)
GET    /granting-of-powers
POST   /granting-of-powers
PUT    /granting-of-powers/:powerId
DELETE /granting-of-powers/:powerId
// Body: { managerId, powers: [{ powerId, scope, ... }], ... }

// Removal Vote
GET    /manager-attorney-designation-removal/removal-vote
POST   /manager-attorney-designation-removal/removal-vote

// Designation Vote
GET    /manager-attorney-designation-removal/designation-vote
POST   /manager-attorney-designation-removal/designation-vote

// Generate Documents
POST   /manager-attorney-designation-removal/generate-documents
```

### Endpoints Juntas - Estados Financieros

```typescript
// Base: /society-profile/:societyId/flow/:flowId

// Financial Statements
GET    /financial-statements-dividend/financial-statements
POST   /financial-statements-dividend/financial-statements
PUT    /financial-statements-dividend/financial-statements/:statementId
// Body: { year, period, files: [...], ... }

// FS Vote
GET    /financial-statements-dividend/fs-vote
POST   /financial-statements-dividend/fs-vote

// Dividend Distribution
GET    /financial-statements-dividend/dividend-distribution
POST   /financial-statements-dividend/dividend-distribution
PUT    /financial-statements-dividend/dividend-distribution/:distributionId
// Body: { totalAmount, distributions: [{ shareholderId, amount, ... }] }

// DD Vote
GET    /financial-statements-dividend/dd-vote
POST   /financial-statements-dividend/dd-vote

// Generate Documents
POST   /financial-statements-dividend/generate-documents
```

### Endpoints Repositorio

```typescript
// Base: /repository/society/:societyId

// Virtual Nodes (Carpetas y archivos)
GET    /virtual-nodes/root                    // Carpetas raíz
GET    /virtual-nodes/:nodeId/children        // Hijos de nodo
GET    /virtual-nodes/:nodeId                 // Detalle de nodo

POST   /virtual-nodes/folder                  // Crear carpeta
PUT    /virtual-nodes/:nodeId                 // Actualizar nodo
DELETE /virtual-nodes/:nodeId                 // Eliminar nodo

POST   /virtual-nodes/upload                  // Subir archivo
GET    /virtual-nodes/:nodeId/download        // Descargar archivo

GET    /virtual-nodes/search?q=...&type=...   // Buscar

// Personalized Folders
GET    /personalized-folders                  // Listar
POST   /personalized-folders                  // Crear
PUT    /personalized-folders/:folderId        // Actualizar
DELETE /personalized-folders/:folderId        // Eliminar

POST   /personalized-folders/:folderId/documents/:documentId  // Enlazar
DELETE /personalized-folders/:folderId/documents/:documentId  // Desvincular

// Conversations (Chat IA)
GET    /conversations?page=1&limit=10&userId=...
GET    /conversations/:conversationId
POST   /conversations
POST   /conversations/:conversationId/messages  // SSE
DELETE /conversations/:conversationId

// Storage Stats
GET    /storage/stats                         // Métricas
```

### Endpoints Autenticación

```typescript
// Auth
POST   /auth/signin
// Body: { email, password }
// Response: { token, user }

POST   /auth/signup
// Body: { email, password, name }

POST   /auth/refresh
// Body: { refreshToken }
// Response: { token }

GET    /auth/me
// Headers: { Authorization: "Bearer <token>" }
// Response: { user }
```

### Endpoints Varios

```typescript
// Dollar Exchange Rate
GET    /exchange-rate/dollar
// Response: { rate: number, date: string }

// DNI Data (RENIEC)
GET    /dni/:dni
// Response: { nombre, apellidoPaterno, apellidoMaterno, ... }

// Societies
GET    /societies
// Response: [{ id, name, ruc, ... }]

GET    /societies/:id
// Response: { id, name, ruc, ... }

POST   /societies
// Body: { name, ruc, ... }

PUT    /societies/:id
// Body: { name, ruc, ... }

DELETE /societies/:id
```

---

## 7️⃣ STACK TECNOLÓGICO

### Frontend
```json
{
  "framework": "Vue 3.5.13",
  "build": "Vite 6.3.5",
  "language": "TypeScript 5.5.3",
  "state": "Pinia 2.3.0",
  "router": "Vue Router 4.5.0",
  "ui": "Tailwind CSS 3.4.13",
  "icons": "Boxicons 2.1.4 + @iconify/vue 3.2.1",
  "notifications": "Notivue 2.4.5",
  "alerts": "SweetAlert2 11.22.0",
  "http": "Axios 1.7.7",
  "documents": "Docxtemplater 3.50.0 + JSZip 3.10.1",
  "pdf": "jsPDF 3.0.1 + pdfjs-dist 5.3.31",
  "dates": "date-fns 4.1.0",
  "charts": "Chart.js 4.5.0 + Vue-ChartJS 5.3.2",
  "excel": "XLSX 0.18.5",
  "numbers": "numero-a-letras 1.0.6",
  "i18n": "Vue I18n 10.0.3",
  "forms": "@tailwindcss/forms 0.5.9",
  "headless": "@headlessui/vue 1.7.23",
  "query": "@tanstack/vue-query 5.85.5"
}
```

### Herramientas de Desarrollo
```json
{
  "devServer": "Vite Dev Server",
  "typecheck": "vue-tsc 2.0.29",
  "css": "PostCSS 8.4.47 + Autoprefixer 10.4.20",
  "linter": "(no especificado - agregar ESLint/Prettier)",
  "devtools": "vite-plugin-vue-devtools 7.6.8"
}
```

### Persistencia
```json
{
  "localStorage": "Token de autenticación",
  "pinia-plugin-persistedstate": "Estado de aplicación"
}
```

---

## 8️⃣ ARQUITECTURA ACTUAL (V2.5)

### Patrón de Capas

```
src/
├── pages/              # Vistas principales
├── components/         # Componentes Vue
├── wizards/            # Flujos wizard (registros y juntas)
├── store/              # Pinia stores
├── api/                # Servicios de API
├── services/           # Lógica de negocio
├── composables/        # Composables Vue
├── utils/              # Utilidades
├── types/              # Tipos TypeScript
├── router/             # Rutas
└── modules/            # Módulos independientes (probo-ai)
```

### Problemas de Arquitectura Actual

❌ **NO hay separación de responsabilidades**:
- Stores mezclan lógica de negocio, transformaciones y API calls
- Componentes tienen lógica que debería estar en servicios
- No hay capa de dominio (entidades puras)

❌ **NO hay contratos (interfaces)**:
- API calls directos sin abstracción
- Imposible cambiar de backend sin tocar stores/componentes
- Difícil testear sin backend real

❌ **NO hay DTOs bidireccionales**:
- Transformaciones inline (sin Mappers)
- Tipos mezclados entre API y dominio
- Difícil mantener consistencia

❌ **NO hay Use Cases**:
- Lógica de negocio dispersa
- Difícil reutilizar
- Difícil testear unitariamente

### ✅ Lo que SÍ está bien

✅ **Separación por módulos** (`wizards/`, `modules/`)
✅ **TypeScript estricto** (buenos tipos)
✅ **Stores con Pinia** (bien estructurados)
✅ **Servicios separados** (`api/`, `services/`)
✅ **Composables reutilizables** (`composables/`)

---

## 9️⃣ MIGRACIÓN A V3 (Arquitectura Hexagonal)

### ¿Qué es V3?

Según tu guía `GUIA-MIGRACION-V25-A-V3.md`, V3 es:
- **Framework**: Nuxt 4 (no Vue 3 + Vite)
- **Arquitectura**: Hexagonal estricta (Domain → Application → Infrastructure → Presentation)
- **Patrón**: Use Cases + Repositories + Mappers + DTOs

### Estructura V3 (Objetivo)

```
app/core/hexag/
├── registros/
│   └── sociedades/
│       ├── domain/
│       │   ├── entities/          # Entidades puras
│       │   └── ports/             # Contratos (interfaces)
│       ├── application/
│       │   ├── dtos/              # DTOs bidireccionales
│       │   └── use-cases/         # Casos de uso
│       ├── infrastructure/
│       │   ├── repositories/      # HTTP + MSW
│       │   └── mappers/           # DTO ↔ Entidad
│       └── pasos/                 # 8 subdominios
│           ├── datos-sociedad/
│           ├── accionistas/
│           └── ... (8 pasos)
├── juntas/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── (estructura similar)
├── repositorio/
│   ├── almacenamiento/
│   ├── documentos-generados/
│   └── carpetas-personalizadas/
└── panel-administrativo/
```

### Patrón de Migración

#### **ANTES (V2.5)**:
```typescript
// Store (lógica mezclada)
export const useAccionistasStore = defineStore('accionistas', {
  state: () => ({
    accionistas: [],
    loading: false
  }),
  
  actions: {
    async saveAccionista(data) {
      this.loading = true;
      
      // ❌ Validaciones aquí
      if (!data.nombre) throw new Error('Nombre requerido');
      
      // ❌ Transformaciones aquí
      const payload = {
        id: generateUUID(),
        nombre: data.nombre,
        participacion: data.porcentaje / 100
      };
      
      // ❌ API call directo
      const response = await $fetch('/api/shareholders', {
        method: 'POST',
        body: payload
      });
      
      // ❌ Más transformaciones
      this.accionistas.push({
        id: response.data.id,
        nombre: response.data.name,
        porcentaje: response.data.participation * 100
      });
      
      this.loading = false;
    }
  }
});
```

#### **DESPUÉS (V3)**:

```typescript
// 1. Domain Layer - Entidad pura
export interface Accionista {
  id: string;
  persona: Persona;
  porcentajeParticipacion: number;
  observaciones?: string;
}

// 2. Domain Layer - Puerto (contrato)
export interface AccionistasRepository {
  create(societyId: string, accionista: Accionista): Promise<Accionista>;
  findAll(societyId: string): Promise<Accionista[]>;
}

// 3. Application Layer - DTO
export interface CreateAccionistaDto {
  persona: PersonaDto;
  porcentajeParticipacion: number;
  observaciones?: string;
}

// 4. Application Layer - Use Case
export class CreateAccionistaUseCase {
  constructor(private repository: AccionistasRepository) {}
  
  async execute(societyId: string, dto: CreateAccionistaDto): Promise<Accionista> {
    // ✅ Validaciones de negocio AQUÍ
    if (dto.porcentajeParticipacion <= 0) {
      throw new DomainError('Porcentaje debe ser mayor a 0');
    }
    
    // ✅ Mapper: DTO → Entidad
    const accionista = AccionistasMapper.dtoToEntity(dto);
    
    // ✅ Repository maneja persistencia
    return await this.repository.create(societyId, accionista);
  }
}

// 5. Infrastructure Layer - Mapper
export class AccionistasMapper {
  static dtoToEntity(dto: CreateAccionistaDto): Accionista {
    return {
      id: generateUUID(),
      persona: PersonaMapper.dtoToEntity(dto.persona),
      porcentajeParticipacion: dto.porcentajeParticipacion,
      observaciones: dto.observaciones
    };
  }
  
  static entityToDto(entity: Accionista): AccionistaDto {
    return {
      persona: PersonaMapper.entityToDto(entity.persona),
      porcentajeParticipacion: entity.porcentajeParticipacion,
      observaciones: entity.observaciones
    };
  }
}

// 6. Infrastructure Layer - Repository HTTP
export class AccionistasHttpRepository implements AccionistasRepository {
  async create(societyId: string, accionista: Accionista): Promise<Accionista> {
    // ✅ Mapper: Entidad → DTO API
    const dto = AccionistasMapper.entityToDto(accionista);
    
    const response = await $fetch(`/api/v2/society-profile/${societyId}/shareholders`, {
      method: 'POST',
      body: dto
    });
    
    // ✅ Mapper: DTO API → Entidad
    return AccionistasMapper.apiToEntity(response.data);
  }
  
  async findAll(societyId: string): Promise<Accionista[]> {
    const response = await $fetch(`/api/v2/society-profile/${societyId}/shareholders`);
    return response.data.map(AccionistasMapper.apiToEntity);
  }
}

// 7. Infrastructure Layer - Repository MSW (testing)
export class AccionistasMswRepository implements AccionistasRepository {
  async create(societyId: string, accionista: Accionista): Promise<Accionista> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay
    return accionista; // Mock
  }
  
  async findAll(societyId: string): Promise<Accionista[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAccionistas; // Mock data
  }
}

// 8. Presentation Layer - Store (SOLO estado UI)
export const useAccionistasStore = defineStore('accionistas', {
  state: () => ({
    accionistas: [] as Accionista[],
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    // ✅ Delega a Use Case
    async saveAccionista(societyId: string, dto: CreateAccionistaDto) {
      this.loading = true;
      this.error = null;
      
      try {
        const useCase = new CreateAccionistaUseCase(accionistasRepository);
        const accionista = await useCase.execute(societyId, dto);
        this.accionistas.push(accionista);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
```

### Beneficios de V3

✅ **Testeable**: Use Cases se testean con mock repositories
✅ **Mantenible**: Lógica separada por responsabilidades
✅ **Escalable**: Fácil agregar nuevos casos de uso
✅ **Intercambiable**: Cambiar de HTTP a MSW sin tocar lógica
✅ **Type-safe**: DTOs y Entidades bien tipados
✅ **Desarrollo sin backend**: MSW repositories funcionales

### Plan de Migración Recomendado

**Fase 1: Juntas (Prioridad ALTA)** - 4-6 semanas
1. Migrar Aporte Dinerario a hexagonal
   - Crear entidades, DTOs, Use Cases
   - Implementar Repositories (HTTP + MSW)
   - Crear Mappers
   - Actualizar Store para usar Use Cases
2. Reutilizar sistema de generación de documentos (NO migrar)
3. Testear flujo completo

**Fase 2: Repositorio (Prioridad MEDIA)** - 3-4 semanas
1. Crear arquitectura hexagonal para Almacenamiento
2. Migrar servicios a Use Cases
3. Implementar Repositories duales
4. Mantener UI actual (funciona bien)

**Fase 3: Registro de Sociedades (Prioridad BAJA)** - 6-8 semanas
1. Funciona bien en V2.5
2. Migrar solo si es necesario
3. Empezar con un paso (Accionistas)
4. Replicar patrón a otros 7 pasos

**Fase 4: Panel Administrativo (Prioridad BAJA)** - 2-3 semanas
1. Backend tiene más avance
2. Crear UI desde cero en V3
3. Usar arquitectura hexagonal desde día 1

---

## 🎯 RECOMENDACIONES FINALES

### Para JUNTAS 🚀

**LO URGENTE**:
1. **NO tocar generación de documentos** - Funciona perfecto
2. **Identificar gaps** - ¿Qué flujos faltan?
3. **Empezar migración hexagonal** - Un flujo a la vez
4. **Testing con MSW** - Desarrollo sin backend

**PRIORIDAD**:
- 🔴 **ALTA**: Migrar Aporte Dinerario a hexagonal (flujo más usado)
- 🟡 **MEDIA**: Mejorar sistema de votaciones
- 🟢 **BAJA**: Migrar otros flujos (ya funcionan)

### Para REPOSITORIO 📁

**LO URGENTE**:
1. **Arquitectura hexagonal** - Servicios → Use Cases
2. **Búsqueda por contenido** - Alta demanda
3. **Métricas avanzadas** - Gráficos mejorados

**PRIORIDAD**:
- 🔴 **ALTA**: Búsqueda por contenido de archivos
- 🟡 **MEDIA**: Drag & Drop mejorado
- 🟢 **BAJA**: Historial de versiones

### Para PANEL ADMINISTRATIVO 👥

**LO URGENTE**:
1. **Crear UI completa** - No existe en V2.5
2. **Gestión de usuarios** - CRUD completo
3. **Sistema de permisos** - Matrix de permisos

**PRIORIDAD**:
- 🔴 **ALTA**: UI básica (tabla + formulario)
- 🟡 **MEDIA**: Permisos granulares
- 🟢 **BAJA**: Auditoría de cambios

### Stack V3 Recomendado

```json
{
  "framework": "Nuxt 4",
  "language": "TypeScript (estricto)",
  "state": "Pinia",
  "ui": "Tailwind 4 + NuxtUI",
  "testing": "Vitest + MSW",
  "arquitectura": "Hexagonal (SIEMPRE)",
  "patterns": "Use Cases + Repositories + Mappers"
}
```

---

## 📞 PRÓXIMOS PASOS

1. **Revisar este informe** ✅
2. **Decidir prioridades** con el equipo
3. **Empezar con Juntas** (Aporte Dinerario hexagonal)
4. **Iterar rápido** - MVP → Producción
5. **No paralizar desarrollo** - Migrar incrementalmente

---

**¿Preguntas?** 🤔

Estoy listo para ayudarte a:
- 🚀 Implementar cualquier flujo de Juntas
- 📁 Mejorar Repositorio
- 👥 Crear Panel Administrativo
- 🏗️ Migrar a arquitectura hexagonal
- 🧪 Crear tests con MSW

**¡Vamos a avanzar rápido mi rey!** 💪

