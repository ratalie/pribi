# 🤖 EXPLICACIÓN COMPLETA: CHAT IA Y CARPETAS PERSONALIZADAS

**Fecha**: Diciembre 2025  
**Propósito**: Explicar en detalle cómo funciona el sistema de chat IA, su relación con carpetas personalizadas, y cómo se construye el contexto

---

## 📚 TABLA DE CONTENIDOS

1. [Relación entre Chat IA y Carpetas Personalizadas](#1-relación-entre-chat-ia-y-carpetas-personalizadas)
2. [Cómo Funciona el Sistema de Contexto](#2-cómo-funciona-el-sistema-de-contexto)
3. [Documentos Públicos (Contexto Legal)](#3-documentos-públicos-contexto-legal)
4. [Búsqueda Semántica Dinámica](#4-búsqueda-semántica-dinámica)
5. [¿Puedo tener chats sin carpetas personalizadas?](#5-puedo-tener-chats-sin-carpetas-personalizadas)
6. [Pre-entrenamiento y Fine-tuning](#6-pre-entrenamiento-y-fine-tuning)
7. [Limitaciones Actuales y Mejoras Posibles](#7-limitaciones-actuales-y-mejoras-posibles)

---

## 1. RELACIÓN ENTRE CHAT IA Y CARPETAS PERSONALIZADAS

### **1.1. Estructura de la Relación**

```
VirtualNode (Carpeta Personalizada)
  ├── isChatIA: true/false        ← Habilita/deshabilita chat
  ├── documents (VirtualDocumentNodes) ← Documentos enlazados
  └── conversations[]              ← Conversaciones asociadas
```

**Puntos Clave**:

- ✅ **Una conversación SIEMPRE está asociada a una carpeta virtual** (`virtualFolderId`)
- ✅ **Una carpeta virtual DEBE tener `isChatIA: true`** para permitir conversaciones
- ✅ **Una carpeta virtual DEBE tener al menos un documento enlazado** antes de crear conversación
- ✅ Una carpeta virtual puede tener **múltiples conversaciones**

### **1.2. Flujo de Creación**

```typescript
// 1. Crear carpeta virtual con chat IA habilitado
POST /api/v2/repository/society-profile/:structureId/virtual-nodes
{
  "name": "Documentos Legales",
  "isChatIA": true,  // ← HABILITA el chat
  "description": "..."
}

// 2. Enlazar documentos a la carpeta virtual
POST /api/v2/repository/virtual-nodes/:virtualNodeId/nodes/:documentNodeId

// 3. Crear conversación (requiere que la carpeta tenga documentos)
POST /api/v2/repository/conversations/virtual-nodes/:virtualNodeId

// 4. Enviar mensaje
POST /api/v2/repository/conversations/:conversationId/message
{
  "message": "¿Qué documentos tengo en esta carpeta?"
}
```

### **1.3. Validaciones**

El sistema valida antes de crear una conversación:

```typescript
// 1. La carpeta debe existir y tener isChatIA: true
if (!folder.isChatIA) {
  throw new BadRequestException('Folder is not a chatIA available');
}

// 2. La carpeta debe tener documentos enlazados
const documentNodes = await getVirtualDocumentNodeByParent(folder.id);
if (documentNodes.length === 0) {
  throw new BadRequestException('No document have been added to virtual folder');
}
```

---

## 2. CÓMO FUNCIONA EL SISTEMA DE CONTEXTO

### **2.1. Tipos de Contexto**

El sistema utiliza **3 tipos de contexto** que se inyectan en cada mensaje:

#### **A) Contexto Base (System Prompt Inicial)**

Se crea **UNA VEZ** al iniciar la conversación y contiene:

```typescript
// 1. Información de la Sociedad
- RUC, Nombre comercial, Razón social
- Dirección completa
- Fecha de escritura pública
- Fecha de creación en sistema

// 2. Información de Acciones (si existe)
- Valor nominal de acciones
- Tabla de tipos de acciones con detalles:
  * Nombre, Valor nominal, Cantidad suscrita
  * Disponible para canje, voto común, voto de derecho, etc.

// 3. Información de la Carpeta
- Nombre de la carpeta
- Descripción
- Fecha de creación

// 4. Lista de Documentos Disponibles
- Título, tipo MIME, path
- Máximo 100 documentos (se trunca si hay más)
```

**Ejemplo del System Prompt**:

```
Eres un asistente especializado en la gestión legal de sociedades de empresas que recide en Peru.
Tu función es responder con la máxima precisión posible y de forma concisa.
...

Información de Carpeta de conversación:
- Nombre: Documentos Legales
- descripcion: Carpeta para documentos legales con IA
- Fecha de creación: 2025-12-01

Información de Sociedad:
- RUC: 20123456789
- Nombre comercial: Mi Empresa SAC
- Razón social: Mi Empresa Sociedad Anónima Cerrada
...

Información básica de los documentos:
1. acta-junta-2024.pdf | application/pdf | /core/juntas/123/
2. estatuto-social.pdf | application/pdf | /core/documentos-generados/...
...
```

#### **B) Contexto de Documentos Públicos (SIEMPRE se añade)**

**Se busca y añade en CADA mensaje**, independientemente de si hay búsqueda semántica.

```typescript
// En create-conversation-message.usecase.ts (línea 71-76)
const publicRelevantDocumentFragments = (
  await this._documentEmbeddingRepository.getMostRelevantPublicFragmentsByEmbedding(
    embeddedPrompt, // ← Embedding del mensaje del usuario
    { fragmentLimit: 10 }, // ← Máximo 10 fragmentos
  )
).map(fragment => fragment.content);
```

**¿Qué son los documentos públicos?**

Son documentos legales base de Perú que se almacenan como embeddings:

- `LEY Nº 26887 LEY GENERAL DE SOCIEDADES .pdf`
- `REGLAMENTO DEL REGISTRO DE SOCIEDADES N°200-2001-SUNARP-SN.pdf`

**Ubicación**: `src/modules/file-repository/statics/public-documents/`

**Cómo se usa**:

```typescript
// Se añade como system message al inicio del input
{
  role: 'system',
  content: `Considera los siguientes fragmentos de leyes y documentos legales
            asocidados a sociedades PERUANAS relevantes para la siguiente respuesta:

${fragmento1}

${fragmento2}

... (hasta 10 fragmentos)
`
}
```

#### **C) Contexto de Búsqueda Semántica (Dinámico, si aplica)**

**Se añade SOLO si el analizador de prompts detecta que se requiere búsqueda semántica**.

```typescript
// En create-conversation-message.usecase.ts (línea 78-117)
if (refinePrompt.semanticSearch) {
  // 1. Generar embedding de la consulta de búsqueda
  const embedPayload = await this._embeddingService.generate(
    refinePrompt.semanticSearch,
    { chunkMode: 'semantic', weighedAverage: true }
  );

  // 2. Buscar en documentos de la carpeta virtual
  const scope = await getVirtualDocumentNodeByParent(folder.id)
    .map(node => node.nodeCode);

  // 3. Búsqueda vectorial con parámetros
  const semanticSearchParams = {
    distance: 0.35,      // ← Distancia máxima (0 = idéntico, 1 = completamente diferente)
    scope,               // ← Solo documentos de esta carpeta
    fragmentLimit: 20,   // ← Máximo 20 fragmentos relevantes
    documentLimit: 4,    // ← Máximo 4 documentos
  };

  semanticSearch = await getMostRelevantFileVersionsByEmbedding(
    embedSearch,
    semanticSearchParams
  );

  // 4. Fallback si no hay resultados
  if (semanticSearch.length === 0) {
    semanticSearchParams.distance = 0.55;  // ← Búsqueda menos precisa
    semanticSearchParams.fragmentLimit = 6;
    semanticSearch = await getMostRelevantFileVersionsByEmbedding(...);
  }
}
```

**Formato del contexto añadido**:

```typescript
{
  role: 'system',
  content: `El siguiente texto es un contexto adicional de una serie de fragmentos
            relevantes de varios documentos relevantes para la respuesta del usuario:

Documento: acta-junta-2024.pdf
Tipo: application/pdf
Tamaño: 245678 bytes

Fragmentos relevantes:
1. [fragmento de texto relevante del documento]
2. [otro fragmento relevante]
...

Documento: estatuto-social.pdf
...
`
}
```

### **2.2. Orden de Inyección de Contexto**

El orden en que se añade el contexto al input es importante:

```typescript
const input: ResponseInput = [
  // 1. PRIMERO: Contexto de documentos públicos (si existe)
  {
    role: 'system',
    content: NEW_PUBLIC_RELEVANT_CONTEXT_PROMPT + publicFragments.join(''),
  },

  // 2. SEGUNDO: Contexto de búsqueda semántica (si existe)
  {
    role: 'system',
    content: NEW_CONTEXT_PROMPT + semanticSearchFragments.join(''),
  },

  // 3. TERCERO: Mensaje del usuario
  {
    role: 'user',
    content: message.content,
  },
];
```

**Nota**: El contexto base (sociedad, carpeta, documentos) se envía en el `system` message inicial cuando se crea la conversación en OpenAI, y se mantiene en el historial.

---

## 3. DOCUMENTOS PÚBLICOS (CONTEXTO LEGAL)

### **3.1. ¿Qué son?**

Son documentos legales base del Perú que se almacenan como embeddings vectoriales para proporcionar contexto legal general en todas las conversaciones.

### **3.2. Documentos Actuales**

```
src/modules/file-repository/statics/public-documents/
├── LEY Nº 26887 LEY GENERAL DE SOCIEDADES .pdf
└── REGLAMENTO DEL REGISTRO DE SOCIEDADES N°200-2001-SUNARP-SN.pdf
```

### **3.3. ¿Cómo se procesan?**

1. **Al inicializar el sistema** (o manualmente):

   ```typescript
   // Se leen los PDFs de statics/public-documents/
   // Se parsean y dividen en chunks
   // Se generan embeddings para cada chunk
   // Se almacenan en tabla PublicDocumentEmbedding
   ```

2. **En cada mensaje**:

   ```typescript
   // Se genera embedding del mensaje del usuario
   const embeddedPrompt = await embeddingService.generate(message);

   // Se buscan los 10 fragmentos más relevantes
   const publicFragments = await getMostRelevantPublicFragmentsByEmbedding(embeddedPrompt, {
     fragmentLimit: 10,
     distance: 0.65,
   });

   // Se añaden al contexto del mensaje
   ```

### **3.4. Limitaciones Actuales**

⚠️ **Problema mencionado por el usuario**: Solo hay 2 documentos públicos y se pasan siempre (hasta 10 fragmentos), lo cual puede ser "medio flojo" porque:

1. **Pocos documentos**: Solo 2 documentos legales base
2. **No hay fine-tuning**: No se pre-entrena el modelo, solo se añade contexto
3. **Búsqueda siempre activa**: Se busca en documentos públicos en cada mensaje, incluso si no es necesario
4. **No se puede desactivar**: Siempre se añade contexto público

---

## 4. BÚSQUEDA SEMÁNTICA DINÁMICA

### **4.1. ¿Cuándo se activa?**

El sistema usa un **analizador de prompts** (`ConversationPromptAnalyzerService`) que decide si se necesita búsqueda semántica:

```typescript
const refinePrompt = await this._conversationPromptAnalyzerService.analyze({
  message: args.prompt,
  conversationCode: conversation.code,
});

// refinePrompt puede contener:
{
  message: "versión mejorada del mensaje",
  semanticSearch?: "consulta optimizada para búsqueda semántica",
  visualType?: "pie" | "bars" | "line",
  requireReasoning: boolean
}
```

**El analizador decide** si el mensaje requiere búsqueda en documentos basándose en:

- La intención del usuario
- El contexto de la conversación
- Si necesita información específica de documentos

### **4.2. Parámetros de Búsqueda**

```typescript
// Búsqueda inicial (más precisa)
{
  distance: 0.35,      // Solo fragmentos muy similares
  fragmentLimit: 20,   // Máximo 20 fragmentos
  documentLimit: 4,    // Máximo 4 documentos
  scope: [nodeCodes]   // Solo documentos de la carpeta virtual
}

// Fallback (menos precisa, si no hay resultados)
{
  distance: 0.55,      // Fragmentos menos similares también
  fragmentLimit: 6,    // Menos fragmentos
  documentLimit: 4,
  scope: [nodeCodes]
}
```

### **4.3. Cómo Funciona la Búsqueda Vectorial**

1. **Embedding del mensaje**: Se genera un vector del mensaje del usuario
2. **Búsqueda por similitud**: Se busca en la base de datos vectorial (PostgreSQL con extensión `vector`)
3. **Distancia coseno**: Se calcula la distancia entre el embedding del mensaje y los embeddings de los fragmentos
4. **Filtrado por distancia**: Solo se incluyen fragmentos con distancia < `distance`
5. **Ordenamiento**: Se ordenan por relevancia (menor distancia = más relevante)

---

## 5. ¿PUEDO TENER CHATS SIN CARPETAS PERSONALIZADAS?

### **5.1. Respuesta Corta**

❌ **NO, actualmente NO es posible**. El sistema está diseñado para que las conversaciones siempre estén asociadas a una carpeta virtual.

### **5.2. Por qué**

```typescript
// Schema de la base de datos
model Conversation {
  id              Int
  code            String
  virtualFolderId Int  // ← REQUERIDO, Foreign Key
  userId          Int
  ...
  virtualFolder   VirtualNode @relation(...)  // ← Relación obligatoria
}
```

```typescript
// Validación en CreateConversationUseCase
if (folder.parentId !== null || folder.type !== NodeType.Folder) {
  throw new BadRequestException('Invalid folder id provided');
}

if (!folder.isChatIA) {
  throw new BadRequestException('Folder is not a chatIA available');
}

const documentNodes = await getVirtualDocumentNodeByParent(folder.id);
if (documentNodes.length === 0) {
  throw new BadRequestException('No document have been added to virtual folder');
}
```

### **5.3. Soluciones Posibles**

#### **Opción 1: Crear una "Carpeta General" por Sociedad** (Actual)

```typescript
// Crear una carpeta virtual especial "Chat General" por sociedad
POST /api/v2/repository/society-profile/:structureId/virtual-nodes
{
  "name": "Chat General",
  "isChatIA": true,
  "description": "Conversaciones generales sin documentos específicos"
}

// Enlazar algunos documentos generales o dejar vacía (aunque requiere al menos 1)
```

#### **Opción 2: Modificar el Sistema** (Futuro)

Para permitir conversaciones sin carpetas, necesitarías:

1. **Modificar el schema**:

   ```prisma
   model Conversation {
     virtualFolderId Int?  // ← Hacer opcional
     ...
   }
   ```

2. **Modificar validaciones**:

   ```typescript
   // Permitir crear conversación sin carpeta virtual
   if (!virtualFolderId) {
     // Usar contexto general de la sociedad
     // No hacer búsqueda semántica en documentos específicos
   }
   ```

3. **Ajustar contexto inicial**:
   ```typescript
   // Si no hay carpeta virtual:
   // - Solo información de la sociedad
   // - Solo documentos públicos
   // - No hay búsqueda semántica en documentos específicos
   ```

---

## 6. PRE-ENTRENAMIENTO Y FINE-TUNING

### **6.1. Estado Actual**

❌ **NO hay pre-entrenamiento ni fine-tuning del modelo**.

El sistema funciona con:

- **Modelo base de OpenAI** (GPT-4, GPT-3.5, etc.)
- **Contexto inyectado** en cada mensaje (RAG - Retrieval Augmented Generation)
- **Embeddings** para búsqueda semántica

### **6.2. Cómo Funciona Actualmente (RAG)**

```
Usuario pregunta
    ↓
Analizador de prompts → ¿Necesita búsqueda semántica?
    ↓
Generar embedding del mensaje
    ↓
Buscar fragmentos relevantes (vectorial)
    ↓
Inyectar contexto en el prompt
    ↓
OpenAI procesa con contexto añadido
    ↓
Respuesta
```

**Ventajas**:

- ✅ No requiere reentrenar modelos
- ✅ Contexto siempre actualizado
- ✅ Menor costo computacional

**Desventajas**:

- ❌ Límite de tokens de contexto
- ❌ No "aprende" permanentemente
- ❌ Depende de la calidad de la búsqueda

### **6.3. ¿Qué sería el Pre-entrenamiento/Fine-tuning?**

#### **Pre-entrenamiento (Training desde cero)**

- Entrenar un modelo completamente nuevo con documentos legales peruanos
- Muy costoso y complejo
- Requiere infraestructura masiva

#### **Fine-tuning (Ajuste fino)**

- Tomar un modelo base (ej: GPT-3.5)
- Entrenarlo adicionalmente con documentos legales específicos
- El modelo "aprende" permanentemente

**Ejemplo**:

```typescript
// Fine-tuning con documentos legales
const fineTunedModel = await openai.fineTuning.jobs.create({
  training_file: "file-legal-docs.jsonl",  // Documentos legales procesados
  model: "gpt-3.5-turbo",
  suffix: "legal-peru"
});

// Usar modelo fine-tuneado
const response = await openai.chat.completions.create({
  model: fineTunedModel.id,  // ← Modelo especializado
  messages: [...]
});
```

### **6.4. Comparación: RAG vs Fine-tuning**

| Aspecto                | RAG (Actual)                  | Fine-tuning                    |
| ---------------------- | ----------------------------- | ------------------------------ |
| **Costo**              | Bajo (solo embeddings)        | Alto (entrenamiento)           |
| **Actualización**      | Inmediata (añadir documentos) | Requiere reentrenar            |
| **Especialización**    | Media (depende del contexto)  | Alta (aprende permanentemente) |
| **Límite de contexto** | Limitado (tokens por mensaje) | No limitado (ya aprendió)      |
| **Implementación**     | ✅ Ya implementado            | ❌ Requiere desarrollo         |

### **6.5. Recomendación**

Para tu caso, **RAG es suficiente** porque:

- ✅ Ya tienes embeddings funcionando
- ✅ Puedes añadir más documentos públicos fácilmente
- ✅ El contexto se actualiza dinámicamente
- ✅ Menor costo de operación

**Mejoras posibles sin fine-tuning**:

1. ✅ Añadir más documentos públicos legales
2. ✅ Mejorar la calidad de los embeddings (ajustar chunking)
3. ✅ Ajustar parámetros de búsqueda (distance, fragmentLimit)
4. ✅ Filtrar mejor los fragmentos públicos (solo si son realmente relevantes)

---

## 7. LIMITACIONES ACTUALES Y MEJORAS POSIBLES

### **7.1. Problemas Identificados**

#### **A) Documentos Públicos Limitados**

**Problema**: Solo 2 documentos públicos, siempre se añaden (hasta 10 fragmentos)

**Solución**:

```typescript
// 1. Añadir más documentos públicos
statics/public-documents/
├── LEY Nº 26887 LEY GENERAL DE SOCIEDADES .pdf
├── REGLAMENTO DEL REGISTRO DE SOCIEDADES N°200-2001-SUNARP-SN.pdf
├── CÓDIGO CIVIL (secciones relevantes).pdf
├── LEY DE SOCIEDADES COMERCIALES.pdf
└── ... más documentos legales

// 2. Filtrar mejor (solo si distancia < umbral)
const publicFragments = await getMostRelevantPublicFragmentsByEmbedding(
  embeddedPrompt,
  {
    fragmentLimit: 10,
    distance: 0.5  // ← Solo fragmentos realmente relevantes
  }
);

// 3. O mejor: Solo añadir si son relevantes
if (publicFragments.length > 0 && publicFragments[0].distance < 0.4) {
  // Añadir contexto público
} else {
  // No añadir (no es relevante)
}
```

#### **B) Conversaciones Requieren Carpetas Virtuales**

**Problema**: No puedes tener conversaciones generales sin carpetas

**Solución**: Ver sección [5.3](#53-soluciones-posibles)

#### **C) Contexto Público Siempre Activo**

**Problema**: Se busca en documentos públicos en cada mensaje, incluso si no es necesario

**Solución**:

```typescript
// Opción 1: Solo buscar si el analizador lo detecta
if (refinePrompt.requiresLegalContext) {
  const publicFragments = await getMostRelevantPublicFragmentsByEmbedding(...);
}

// Opción 2: Cachear búsquedas públicas comunes
const cachedPublicSearch = await cache.get(embeddedPromptHash);
if (cachedPublicSearch) {
  publicFragments = cachedPublicSearch;
} else {
  publicFragments = await getMostRelevantPublicFragmentsByEmbedding(...);
  await cache.set(embeddedPromptHash, publicFragments, { ttl: 3600 });
}
```

#### **D) No hay Fine-tuning**

**Problema**: El modelo no está especializado en documentos legales peruanos

**Solución**: Ver sección [6.5](#65-recomendación) - RAG es suficiente, pero si quieres fine-tuning:

- Recolectar dataset de documentos legales peruanos
- Procesarlos en formato JSONL
- Crear fine-tuning job en OpenAI
- Usar el modelo fine-tuneado en lugar del base

### **7.2. Mejoras Recomendadas (Prioridad)**

#### **Alta Prioridad**

1. ✅ **Añadir más documentos públicos legales**
   - Código Civil (secciones relevantes)
   - Más reglamentos de SUNARP
   - Jurisprudencia relevante

2. ✅ **Filtrar mejor los fragmentos públicos**
   - Solo añadir si distancia < 0.5 (más relevantes)
   - Reducir fragmentLimit de 10 a 5-7

3. ✅ **Optimizar búsqueda pública**
   - Cachear búsquedas comunes
   - Solo buscar si realmente necesario

#### **Media Prioridad**

4. ⏳ **Permitir conversaciones sin carpetas**
   - Modificar schema y validaciones
   - Usar contexto general de sociedad

5. ⏳ **Mejorar analizador de prompts**
   - Detectar mejor cuándo NO necesitas contexto público
   - Detectar mejor cuándo NO necesitas búsqueda semántica

#### **Baja Prioridad**

6. ⏳ **Fine-tuning del modelo** (solo si RAG no es suficiente)
   - Recolectar dataset
   - Crear fine-tuning job
   - Evaluar mejoras vs costos

---

## 8. RESUMEN EJECUTIVO

### **¿Cómo funciona el chat IA?**

1. **Requiere una carpeta virtual** con `isChatIA: true` y documentos enlazados
2. **Contexto base** (sociedad, carpeta, lista de documentos) se crea al iniciar conversación
3. **Contexto público** (documentos legales) se añade en cada mensaje (hasta 10 fragmentos)
4. **Búsqueda semántica** se activa si el analizador detecta que es necesario
5. **Respuesta** se genera con todo el contexto inyectado

### **Limitaciones actuales**

- ❌ Solo 2 documentos públicos (puede mejorarse añadiendo más)
- ❌ No hay fine-tuning (usa RAG, que es suficiente)
- ❌ Conversaciones requieren carpetas virtuales (puede modificarse)
- ❌ Contexto público siempre activo (puede optimizarse)

### **Recomendaciones**

1. ✅ **Añadir más documentos públicos** para mejor contexto legal
2. ✅ **Filtrar mejor los fragmentos públicos** (solo los realmente relevantes)
3. ⏳ **Considerar permitir conversaciones sin carpetas** si es necesario
4. ⏳ **Mantener RAG** en lugar de fine-tuning (más flexible y económico)

---

**¿Tienes más preguntas?** Puedo profundizar en cualquier sección específica. 🚀
