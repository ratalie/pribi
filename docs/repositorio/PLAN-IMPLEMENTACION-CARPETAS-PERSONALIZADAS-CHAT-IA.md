# 📋 PLAN COMPLETO: CARPETAS PERSONALIZADAS Y CHAT IA

**Fecha**: Diciembre 2025  
**Objetivo**: Replicar funcionalidad v2.5 de carpetas personalizadas con chat IA  
**Estado**: 🟡 En Planificación  
**Asunción**: Endpoints del backend V2 ya están implementados

---

## 📚 TABLA DE CONTENIDOS

1. [Estado Actual](#estado-actual)
2. [Objetivos](#objetivos)
3. [Arquitectura y Flujo](#arquitectura-y-flujo)
4. [Plan de Implementación](#plan-de-implementación)
5. [Checklist Completo](#checklist-completo)
6. [Archivos a Crear/Modificar](#archivos-a-crearmodificar)
7. [Testing](#testing)
8. [Referencias](#referencias)

---

## 📊 ESTADO ACTUAL

### ✅ Lo que ya está implementado

1. **Arquitectura Hexagonal Completa**
   - ✅ Domain: Entidades y Ports
   - ✅ Application: DTOs y Use Cases
   - ✅ Infrastructure: Mappers y Repositories (HTTP y Mock)
   - ✅ Presentation: Stores y Composables

2. **UI Parcial**
   - ✅ `CarpetasPersonalizadasView.vue` - Vista principal (lista de carpetas)
   - ✅ `CarpetaDetailView.vue` - Vista de detalle con tabs
   - ✅ Modal de crear carpeta (sin checkbox `isChatIA`)
   - ✅ Páginas de routing configuradas

3. **Stores y Composables**
   - ✅ `carpetas-personalizadas.store.ts` (Option API)
   - ✅ `useCarpetasPersonalizadas.ts`

### ❌ Lo que falta

1. **Campo `isChatIA`**
   - ❌ No existe en entidad `CarpetaPersonalizada`
   - ❌ No existe en DTOs
   - ❌ No existe en mapper
   - ❌ No existe checkbox en modal de crear carpeta

2. **Endpoints Incorrectos**
   - ❌ Repositorio HTTP usa `/api/v2/repositorio/...` (incorrecto)
   - ✅ Debe usar `/api/v2/repository/society-profile/:structureId/virtual-nodes`

3. **Store usando Mock**
   - ❌ Store usa `CarpetasPersonalizadasMockRepository`
   - ✅ Debe usar `CarpetasPersonalizadasHttpRepository`

4. **Chat IA No Implementado**
   - ❌ No existe servicio SSE
   - ❌ No existe composable `useAgentChat`
   - ❌ No existe componente `ChatInterface`
   - ❌ Chat en `CarpetaDetailView` es mock

---

## 🎯 OBJETIVOS

### Objetivo Principal

**Replicar funcionalidad v2.5**: Permitir crear carpetas personalizadas con chat IA habilitado y poder chatear con la IA sobre los documentos enlazados.

### Objetivos Específicos

1. ✅ **Crear carpetas personalizadas** con opción de habilitar chat IA
2. ✅ **Enlazar documentos** a carpetas personalizadas
3. ✅ **Abrir chat IA** desde carpeta personalizada
4. ✅ **Chatear con IA** usando SSE streaming (como v2.5)
5. ✅ **Ver documentos utilizados** en cada respuesta de la IA

---

## 🏗️ ARQUITECTURA Y FLUJO

### Flujo Completo

```
1. Usuario crea carpeta personalizada
   ↓
2. Usuario marca checkbox "Habilitar chat IA" (isChatIA: true)
   ↓
3. Carpeta se crea en backend con isChatIA: true
   ↓
4. Usuario enlaza documentos a la carpeta
   ↓
5. Usuario abre carpeta → Tab "Chat IA"
   ↓
6. Usuario crea conversación (automático al enviar primer mensaje)
   ↓
7. Usuario envía mensaje → SSE streaming → Respuesta de IA
   ↓
8. IA responde basándose en documentos enlazados + contexto legal
```

### Estructura de Datos

```typescript
// Carpeta Personalizada (Virtual Node)
interface CarpetaPersonalizada {
  id: string;
  nombre: string;
  descripcion?: string;
  isChatIA: boolean;  // ← NUEVO: Habilita chat IA
  fechaCreacion: Date;
  fechaModificacion: Date;
  creadorId: string;
  creadorNombre: string;
  totalEnlaces: number;
}

// Conversación
interface Conversation {
  id: number;
  code: string;
  title: string;
  virtualFolderId: number;  // ID de la carpeta
  userId: number;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

// Mensaje
interface Message {
  id: number;
  type: ConversationMessageTypeEnum;
  conversationId: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  documents?: UsedDocument[];  // Documentos utilizados por la IA
  createdAt: string;
  updatedAt: string;
}
```

### Endpoints del Backend (Asumidos Implementados)

```typescript
// Virtual Nodes (Carpetas Personalizadas)
POST   /api/v2/repository/society-profile/:structureId/virtual-nodes
GET    /api/v2/repository/society-profile/:structureId/virtual-nodes
GET    /api/v2/repository/virtual-nodes/:virtualNodeId
PUT    /api/v2/repository/virtual-nodes/:virtualNodeId
DELETE /api/v2/repository/virtual-nodes/:virtualNodeId

// Enlaces de Documentos
POST   /api/v2/repository/virtual-nodes/:virtualNodeId/nodes/:documentNodeId
DELETE /api/v2/repository/virtual-nodes/:virtualNodeId/nodes/:documentNodeId

// Conversations (Chat IA)
GET    /api/v2/repository/society-profile/:structureId/conversations
GET    /api/v2/repository/conversations/:conversationId
POST   /api/v2/repository/virtual-nodes/:virtualNodeId/conversations
POST   /api/v2/repository/conversations/:conversationId/message  // SSE streaming
DELETE /api/v2/repository/conversations/:conversationId
```

---

## 📝 PLAN DE IMPLEMENTACIÓN

### **FASE 1: Agregar Campo `isChatIA` a Carpetas Personalizadas**

#### **1.1. Actualizar Entidad de Dominio**

**Archivo**: `app/core/hexag/repositorio/carpetas-personalizadas/domain/entities/carpeta-personalizada.entity.ts`

**Cambios**:
```typescript
export interface CarpetaPersonalizada {
  id: string;
  nombre: string;
  descripcion?: string;
  isChatIA: boolean;  // ← AGREGAR
  fechaCreacion: Date;
  fechaModificacion: Date;
  creadorId: string;
  creadorNombre: string;
  totalEnlaces: number;
}
```

#### **1.2. Actualizar DTOs**

**Archivo**: `app/core/hexag/repositorio/carpetas-personalizadas/application/dtos/carpeta-personalizada.dto.ts`

**Cambios**:
```typescript
// DTO de respuesta
export interface CarpetaPersonalizadaDTO {
  id: string;
  nombre: string;
  descripcion?: string;
  isChatIA: boolean;  // ← AGREGAR
  fechaCreacion: string;
  fechaModificacion: string;
  creadorId: string;
  creadorNombre: string;
  totalEnlaces: number;
}

// DTO para crear
export interface CreateCarpetaDTO {
  nombre: string;
  descripcion?: string;
  isChatIA?: boolean;  // ← AGREGAR (opcional, default: false)
}
```

#### **1.3. Actualizar Mapper**

**Archivo**: `app/core/hexag/repositorio/carpetas-personalizadas/infrastructure/mappers/carpetas-personalizadas.mapper.ts`

**Cambios**:
```typescript
static dtoToEntity(dto: CarpetaPersonalizadaDTO): CarpetaPersonalizada {
  return {
    // ... campos existentes
    isChatIA: dto.isChatIA,  // ← AGREGAR
  };
}

static entityToDto(entity: CarpetaPersonalizada): CarpetaPersonalizadaDTO {
  return {
    // ... campos existentes
    isChatIA: entity.isChatIA,  // ← AGREGAR
  };
}
```

#### **1.4. Actualizar Puerto del Repositorio**

**Archivo**: `app/core/hexag/repositorio/carpetas-personalizadas/domain/ports/carpetas-personalizadas.repository.ts`

**Cambios**:
```typescript
create(
  sociedadId: string, 
  nombre: string, 
  descripcion?: string,
  isChatIA?: boolean  // ← AGREGAR
): Promise<CarpetaPersonalizada>;

update(
  sociedadId: string, 
  carpetaId: string, 
  nombre: string, 
  descripcion?: string,
  isChatIA?: boolean  // ← AGREGAR
): Promise<CarpetaPersonalizada>;
```

#### **1.5. Actualizar Use Case de Crear**

**Archivo**: `app/core/hexag/repositorio/carpetas-personalizadas/application/use-cases/create-carpeta.use-case.ts`

**Cambios**:
```typescript
async execute(sociedadId: string, dto: CreateCarpetaDTO): Promise<CarpetaPersonalizada> {
  return this.repository.create(
    sociedadId, 
    dto.nombre, 
    dto.descripcion,
    dto.isChatIA ?? false  // ← AGREGAR (default: false)
  );
}
```

#### **1.6. Actualizar Use Case de Actualizar**

**Archivo**: `app/core/hexag/repositorio/carpetas-personalizadas/application/use-cases/update-carpeta.use-case.ts`

**Cambios**:
```typescript
async execute(
  sociedadId: string, 
  carpetaId: string, 
  dto: UpdateCarpetaDTO
): Promise<CarpetaPersonalizada> {
  return this.repository.update(
    sociedadId, 
    carpetaId, 
    dto.nombre, 
    dto.descripcion,
    dto.isChatIA  // ← AGREGAR
  );
}
```

#### **1.7. Actualizar Repositorio HTTP**

**Archivo**: `app/core/hexag/repositorio/carpetas-personalizadas/infrastructure/repositories/carpetas-personalizadas-http.repository.ts`

**Cambios**:
```typescript
// 1. Corregir endpoints (usar structureId en lugar de sociedadId)
// 2. Agregar isChatIA en create y update

async create(
  sociedadId: string, 
  nombre: string, 
  descripcion?: string,
  isChatIA?: boolean  // ← AGREGAR
): Promise<CarpetaPersonalizada> {
  // Obtener structureId desde sociedadId (si es necesario)
  const response = await $fetch<{ data: any }>(
    `/api/v2/repository/society-profile/${sociedadId}/virtual-nodes`,  // ← CORREGIR endpoint
    {
      ...withAuthHeaders(),
      method: 'POST' as const,
      body: { 
        name: nombre,  // ← Verificar nombre del campo en backend
        description: descripcion,
        isChatIA: isChatIA ?? false  // ← AGREGAR
      },
    }
  );
  return CarpetasPersonalizadasMapper.dtoToEntity(response.data);
}
```

#### **1.8. Actualizar Repositorio Mock**

**Archivo**: `app/core/hexag/repositorio/carpetas-personalizadas/infrastructure/repositories/carpetas-personalizadas-mock.repository.ts`

**Cambios**:
```typescript
// Agregar isChatIA en todos los métodos mock
```

#### **1.9. Actualizar Store**

**Archivo**: `app/core/presentation/repositorio/stores/carpetas-personalizadas.store.ts`

**Cambios**:
```typescript
// 1. Cambiar de MockRepository a HttpRepository
// 2. Agregar isChatIA en crearCarpeta y actualizarCarpeta

async crearCarpeta(dto: CreateCarpetaDTO, sociedadId?: string) {
  // ...
  const repository = new CarpetasPersonalizadasHttpRepository();  // ← CAMBIAR
  // ...
}
```

#### **1.10. Agregar Checkbox en Modal de Crear Carpeta**

**Archivo**: `app/components/repository/CarpetasPersonalizadasView.vue`

**Cambios**:
```vue
<!-- En el modal de crear carpeta -->
<div>
  <label>
    <input 
      type="checkbox" 
      v-model="newCarpetaIsChatIA"
    />
    Habilitar chat con IA
  </label>
  <p class="text-xs text-muted">
    Permite consultar documentos de esta carpeta mediante chat con IA
  </p>
</div>
```

---

### **FASE 2: Corregir Endpoints y Conectar con Backend Real**

#### **2.1. Verificar Estructura de IDs**

**Tarea**: Confirmar si el backend usa `structureId` (número) o `societyId` (UUID)

**Archivos a revisar**:
- `app/core/presentation/repositorio/stores/repositorio-dashboard.store.ts`
- Ver cómo se obtiene `sociedadSeleccionada`

#### **2.2. Actualizar Repositorio HTTP con Endpoints Correctos**

**Archivo**: `app/core/hexag/repositorio/carpetas-personalizadas/infrastructure/repositories/carpetas-personalizadas-http.repository.ts`

**Cambios completos**:
```typescript
// Todos los métodos deben usar:
// /api/v2/repository/society-profile/:structureId/virtual-nodes
// En lugar de:
// /api/v2/repositorio/:sociedadId/carpetas-personalizadas
```

#### **2.3. Actualizar Store para Usar HttpRepository**

**Archivo**: `app/core/presentation/repositorio/stores/carpetas-personalizadas.store.ts`

**Cambios**:
- Reemplazar todas las instancias de `CarpetasPersonalizadasMockRepository` por `CarpetasPersonalizadasHttpRepository`

---

### **FASE 3: Implementar Chat IA con SSE**

#### **3.1. Crear Tipos para Chat**

**Archivo**: `app/core/hexag/repositorio/chat-ia/domain/entities/chat.types.ts` (NUEVO)

**Contenido**:
```typescript
// Tipos basados en v2.5
export enum ConversationMessageTypeEnum {
  ProcessStarted = "processStarted",
  ProcessEnded = "processEnded",
  MessageStart = "messageStart",
  Message = "message",
  MessageEnd = "messageEnd",
  Visual = "visual",
  Error = "error",
  Incomplete = "incomplete",
  Aborted = "aborted",
}

export enum ConversationMessageRoleEnum {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export interface Message {
  id: number;
  type: ConversationMessageTypeEnum;
  conversationId: number;
  role: ConversationMessageRoleEnum;
  content: string;
  visual?: VisualContent | null;
  documents?: UsedDocument[];
  createdAt: string;
  updatedAt: string;
  isCompleted?: boolean;
}

export interface Conversation {
  id: number;
  code: string;
  title: string;
  virtualFolderId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface UsedDocument {
  versionCode: string;
  documentCode: string;
  title: string;
}

export interface VisualContent {
  type: 'pie' | 'bars' | 'line';
  title: string;
  description: string;
  data: Array<{ label: string; value: number }>;
}

export interface SSEEvent {
  type: ConversationMessageTypeEnum;
  content: string;
  visual?: VisualContent;
  usedContext?: UsedDocument[];
}

export interface SSECallbacks {
  processStarted?: () => void;
  messageStart?: () => void;
  message?: (content: string) => void;
  visual?: (visual: VisualContent) => void;
  messageEnd?: (usedContext?: UsedDocument[]) => void;
  processEnded?: () => void;
  error?: (error: string) => void;
  aborted?: (message: string) => void;
}
```

#### **3.2. Crear Servicio SSE**

**Archivo**: `app/core/hexag/repositorio/chat-ia/infrastructure/services/sse-client.service.ts` (NUEVO)

**Contenido**: Adaptar de `../probo-frotend-v25/src/modules/probo-ai/services/sseClient.ts`

**Cambios principales**:
- Usar endpoints V2: `/api/v2/repository/conversations/:conversationId/message`
- Adaptar a estructura de Nuxt 4

#### **3.3. Crear Puerto del Repositorio de Chat**

**Archivo**: `app/core/hexag/repositorio/chat-ia/domain/ports/chat.repository.ts` (NUEVO)

**Contenido**:
```typescript
export interface ChatRepository {
  getConversations(
    structureId: string,
    filters?: { page?: number; limit?: number; userId?: number }
  ): Promise<{ conversations: Conversation[]; pagination: PaginationInfo }>;
  
  getConversation(conversationId: number): Promise<Conversation>;
  
  createConversation(virtualNodeId: number): Promise<Conversation>;
  
  deleteConversation(conversationId: number): Promise<void>;
  
  sendMessage(
    conversationId: number,
    message: string,
    callbacks: SSECallbacks
  ): Promise<void>;
  
  cancelMessage(): void;
  
  isMessageInProgress(): boolean;
}
```

#### **3.4. Crear Repositorio HTTP de Chat**

**Archivo**: `app/core/hexag/repositorio/chat-ia/infrastructure/repositories/chat-http.repository.ts` (NUEVO)

**Contenido**: Implementar `ChatRepository` usando endpoints V2 y SSE client

#### **3.5. Crear Use Cases de Chat**

**Archivos** (NUEVOS):
- `app/core/hexag/repositorio/chat-ia/application/use-cases/get-conversations.use-case.ts`
- `app/core/hexag/repositorio/chat-ia/application/use-cases/get-conversation.use-case.ts`
- `app/core/hexag/repositorio/chat-ia/application/use-cases/create-conversation.use-case.ts`
- `app/core/hexag/repositorio/chat-ia/application/use-cases/send-message.use-case.ts`
- `app/core/hexag/repositorio/chat-ia/application/use-cases/delete-conversation.use-case.ts`

#### **3.6. Crear Composable useAgentChat**

**Archivo**: `app/core/presentation/repositorio/composables/useAgentChat.ts` (NUEVO)

**Contenido**: Adaptar de `../probo-frotend-v25/src/modules/probo-ai/composables/useAgentChat.ts`

**Cambios principales**:
- Usar stores de Nuxt 4
- Adaptar a estructura de carpetas personalizadas

#### **3.7. Crear Store de Chat**

**Archivo**: `app/core/presentation/repositorio/stores/chat.store.ts` (NUEVO)

**Contenido**: Store con Option API para manejar estado del chat

#### **3.8. Crear Componente ChatInterface**

**Archivo**: `app/components/repository/ChatInterface.vue` (NUEVO)

**Contenido**: Componente principal del chat con:
- Lista de mensajes
- Input de mensaje
- Indicador de typing
- Mostrar documentos utilizados
- Streaming de respuestas

#### **3.9. Integrar Chat en CarpetaDetailView**

**Archivo**: `app/components/repository/CarpetaDetailView.vue`

**Cambios**:
- Reemplazar chat mock por `ChatInterface` real
- Solo mostrar tab "Chat IA" si `carpetaActual.isChatIA === true`
- Conectar con `useAgentChat` composable

---

### **FASE 4: Funcionalidades Adicionales**

#### **4.1. Agregar Documentos a Carpeta**

**Archivo**: `app/components/repository/CarpetaDetailView.vue`

**Funcionalidad**:
- Botón "Agregar Documento" funcional
- Modal para buscar y seleccionar documentos
- Enlazar documentos a la carpeta

#### **4.2. Validaciones**

**Validaciones necesarias**:
- No permitir crear conversación si carpeta no tiene `isChatIA: true`
- No permitir crear conversación si carpeta no tiene documentos enlazados
- Mostrar mensajes de error apropiados

#### **4.3. Mejoras de UX**

- Loading states
- Error handling
- Mensajes informativos
- Confirmaciones para acciones destructivas

---

## ✅ CHECKLIST COMPLETO

### **FASE 1: Campo `isChatIA`**

- [ ] **1.1** Actualizar entidad `CarpetaPersonalizada` con `isChatIA: boolean`
- [ ] **1.2** Actualizar DTOs (CreateCarpetaDTO, CarpetaPersonalizadaDTO)
- [ ] **1.3** Actualizar mapper (dtoToEntity, entityToDto)
- [ ] **1.4** Actualizar puerto del repositorio (create, update)
- [ ] **1.5** Actualizar use case `CreateCarpetaUseCase`
- [ ] **1.6** Actualizar use case `UpdateCarpetaUseCase`
- [ ] **1.7** Actualizar repositorio HTTP (create, update con isChatIA)
- [ ] **1.8** Actualizar repositorio Mock (create, update con isChatIA)
- [ ] **1.9** Actualizar store (usar HttpRepository, agregar isChatIA)
- [ ] **1.10** Agregar checkbox en modal de crear carpeta

### **FASE 2: Endpoints y Backend**

- [ ] **2.1** Verificar estructura de IDs (structureId vs societyId)
- [ ] **2.2** Corregir todos los endpoints en repositorio HTTP
- [ ] **2.3** Cambiar store para usar HttpRepository (no Mock)
- [ ] **2.4** Probar endpoints con backend real

### **FASE 3: Chat IA**

- [ ] **3.1** Crear tipos de chat (`chat.types.ts`)
- [ ] **3.2** Crear servicio SSE (`sse-client.service.ts`)
- [ ] **3.3** Crear puerto del repositorio de chat
- [ ] **3.4** Crear repositorio HTTP de chat
- [ ] **3.5** Crear use cases de chat (5 archivos)
- [ ] **3.6** Crear composable `useAgentChat`
- [ ] **3.7** Crear store de chat
- [ ] **3.8** Crear componente `ChatInterface`
- [ ] **3.9** Integrar chat en `CarpetaDetailView`

### **FASE 4: Funcionalidades Adicionales**

- [ ] **4.1** Implementar "Agregar Documento" funcional
- [ ] **4.2** Agregar validaciones (isChatIA, documentos requeridos)
- [ ] **4.3** Mejorar UX (loading, errors, confirmaciones)

---

## 📁 ARCHIVOS A CREAR/MODIFICAR

### **Archivos a Modificar**

1. `app/core/hexag/repositorio/carpetas-personalizadas/domain/entities/carpeta-personalizada.entity.ts`
2. `app/core/hexag/repositorio/carpetas-personalizadas/application/dtos/carpeta-personalizada.dto.ts`
3. `app/core/hexag/repositorio/carpetas-personalizadas/infrastructure/mappers/carpetas-personalizadas.mapper.ts`
4. `app/core/hexag/repositorio/carpetas-personalizadas/domain/ports/carpetas-personalizadas.repository.ts`
5. `app/core/hexag/repositorio/carpetas-personalizadas/application/use-cases/create-carpeta.use-case.ts`
6. `app/core/hexag/repositorio/carpetas-personalizadas/application/use-cases/update-carpeta.use-case.ts`
7. `app/core/hexag/repositorio/carpetas-personalizadas/infrastructure/repositories/carpetas-personalizadas-http.repository.ts`
8. `app/core/hexag/repositorio/carpetas-personalizadas/infrastructure/repositories/carpetas-personalizadas-mock.repository.ts`
9. `app/core/presentation/repositorio/stores/carpetas-personalizadas.store.ts`
10. `app/components/repository/CarpetasPersonalizadasView.vue`
11. `app/components/repository/CarpetaDetailView.vue`

### **Archivos a Crear**

1. `app/core/hexag/repositorio/chat-ia/domain/entities/chat.types.ts`
2. `app/core/hexag/repositorio/chat-ia/infrastructure/services/sse-client.service.ts`
3. `app/core/hexag/repositorio/chat-ia/domain/ports/chat.repository.ts`
4. `app/core/hexag/repositorio/chat-ia/infrastructure/repositories/chat-http.repository.ts`
5. `app/core/hexag/repositorio/chat-ia/application/use-cases/get-conversations.use-case.ts`
6. `app/core/hexag/repositorio/chat-ia/application/use-cases/get-conversation.use-case.ts`
7. `app/core/hexag/repositorio/chat-ia/application/use-cases/create-conversation.use-case.ts`
8. `app/core/hexag/repositorio/chat-ia/application/use-cases/send-message.use-case.ts`
9. `app/core/hexag/repositorio/chat-ia/application/use-cases/delete-conversation.use-case.ts`
10. `app/core/presentation/repositorio/composables/useAgentChat.ts`
11. `app/core/presentation/repositorio/stores/chat.store.ts`
12. `app/components/repository/ChatInterface.vue`

---

## 🧪 TESTING

### **Testing Manual**

1. **Crear Carpeta con Chat IA**
   - [ ] Crear carpeta sin chat IA → No debe mostrar tab "Chat IA"
   - [ ] Crear carpeta con chat IA → Debe mostrar tab "Chat IA"

2. **Enlazar Documentos**
   - [ ] Agregar documento a carpeta
   - [ ] Verificar que aparece en lista de enlaces
   - [ ] Eliminar enlace

3. **Chat IA**
   - [ ] Abrir chat en carpeta con `isChatIA: true` y documentos
   - [ ] Enviar primer mensaje → Debe crear conversación automáticamente
   - [ ] Verificar streaming SSE
   - [ ] Verificar que muestra documentos utilizados
   - [ ] Enviar múltiples mensajes
   - [ ] Verificar historial de conversación

4. **Validaciones**
   - [ ] Intentar crear conversación sin documentos → Debe mostrar error
   - [ ] Intentar abrir chat en carpeta sin `isChatIA` → No debe mostrar tab

---

## 📚 REFERENCIAS

### **Documentación**

- `docs/research/EXPLICACION-COMPLETA-CHAT-IA-REPOSITORIO.md` - Explicación completa del sistema
- `docs/repositorio/version2.5/REPOSITORIO-IA-COMPLETO.md` - Documentación v2.5
- `docs/backend/GUIA-COMPLETA-REPOSITORIO-V2-V3.md` - Guía de endpoints

### **Código de Referencia (v2.5)**

- `../probo-frotend-v25/src/modules/probo-ai/services/sseClient.ts` - Servicio SSE
- `../probo-frotend-v25/src/modules/probo-ai/composables/useAgentChat.ts` - Composable de chat
- `../probo-frotend-v25/src/modules/probo-ai/services/chatService.ts` - Servicio de chat
- `../probo-frotend-v25/src/modules/probo-ai/types/chat.ts` - Tipos de chat

---

## ⏱️ ESTIMACIÓN DE TIEMPO

- **Fase 1**: 1-2 horas (agregar campo isChatIA)
- **Fase 2**: 1 hora (corregir endpoints)
- **Fase 3**: 4-6 horas (implementar chat IA)
- **Fase 4**: 1-2 horas (funcionalidades adicionales)

**Total**: 7-11 horas

---

## 🚀 PRÓXIMOS PASOS

1. **Revisar y aprobar este plan**
2. **Confirmar estructura de endpoints del backend**
3. **Comenzar con Fase 1** (agregar campo isChatIA)
4. **Seguir orden de implementación**
5. **Testing continuo en cada fase**

---

**¿Listo para comenzar?** 🎯

