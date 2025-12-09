# 🔍 PLAN DE AUDITORÍA Y REFACTORIZACIÓN: ARQUITECTURA REPOSITORIO V3

**Fecha**: 9 de Diciembre 2025  
**Estado**: 📋 PLAN PARA AUDITORÍA EXTERNA  
**Objetivo**: Documentar el estado actual de la arquitectura para que otra AI pueda auditar, refactorizar y mejorar el código

---

## 🎯 CONTEXTO

### **Estado Actual**

✅ **Fase 1: Envío al Repositorio - COMPLETADO**
- ✅ Use case: `EnviarDocumentosRepositorioUseCase`
- ✅ Composable: `useEnviarDocumentosRepositorio`
- ✅ Repository: `RepositorioDocumentosHttpRepository`
- ✅ UI: Checkbox y botón "Enviar al Repositorio" con selección individual
- ✅ Endpoints V2 funcionando correctamente
- ✅ Autenticación con token funcionando

⏳ **Fase 2: Vista Repositorio - EN PROGRESO**
- ✅ Componente `DocumentosGeneradosView.vue` existe
- ✅ Composable `useDocumentosGenerados` existe
- ⚠️ **FALTA**: Conectar con endpoint real para obtener documentos de juntas
- ⚠️ **FALTA**: Filtrar documentos por path `/core/juntas/{flowId}/`

⏳ **Fase 3: Repositorio V3 (Google Drive) - PENDIENTE**
- ✅ Componente `AlmacenView.vue` existe
- ⚠️ **FALTA**: Funcionalidades completas de Google Drive

---

## 📋 ÁREAS DE AUDITORÍA

### **1. Arquitectura Hexagonal**

#### **1.1. Domain Layer**
**Ubicación**: `app/core/hexag/repositorio/domain/`

**Archivos a revisar**:
- `domain/ports/repositorio-documentos.repository.ts` - ✅ Port definido
- `domain/entities/` - ⚠️ Verificar si existen entidades necesarias

**Preguntas de auditoría**:
- [ ] ¿Las entidades del dominio están bien definidas?
- [ ] ¿Los ports (interfaces) están completos?
- [ ] ¿Falta alguna entidad o port necesario?

#### **1.2. Application Layer**
**Ubicación**: `app/core/hexag/repositorio/application/`

**Archivos a revisar**:
- `application/use-cases/enviar-documentos-repositorio.use-case.ts` - ✅ Implementado
- `application/dtos/` - ⚠️ Verificar si existen DTOs necesarios

**Preguntas de auditoría**:
- [ ] ¿Los use cases están bien estructurados?
- [ ] ¿Faltan DTOs para las operaciones?
- [ ] ¿La lógica de negocio está en el lugar correcto?

#### **1.3. Infrastructure Layer**
**Ubicación**: `app/core/hexag/repositorio/infrastructure/`

**Archivos a revisar**:
- `infrastructure/repositories/repositorio-documentos-http.repository.ts` - ✅ Implementado
- `infrastructure/mappers/` - ⚠️ Verificar si existen mappers necesarios

**Preguntas de auditoría**:
- [ ] ¿Los mappers están implementados correctamente?
- [ ] ¿La conversión DTO ↔ Entidad está completa?
- [ ] ¿Los repositorios HTTP manejan errores correctamente?

#### **1.4. Presentation Layer**
**Ubicación**: `app/core/presentation/repositorio/` y `app/composables/`

**Archivos a revisar**:
- `app/composables/useEnviarDocumentosRepositorio.ts` - ✅ Implementado
- `app/core/presentation/repositorio/stores/` - ⚠️ Verificar stores
- `app/components/repository/` - ✅ Componentes existentes

**Preguntas de auditoría**:
- [ ] ¿Los stores usan Option API (NO Composition API)?
- [ ] ¿Los composables están bien estructurados?
- [ ] ¿La separación de responsabilidades es correcta?

---

### **2. Endpoints y API**

#### **2.1. Endpoints V2 Utilizados**

**Envío de Documentos**:
```typescript
// Obtener folder de junta
GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder

// Enviar documentos
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core?name={nombre}
```

**Preguntas de auditoría**:
- [ ] ¿Los endpoints están correctamente documentados?
- [ ] ¿Los errores se manejan correctamente?
- [ ] ¿La autenticación funciona en todos los casos?

#### **2.2. Endpoints Faltantes**

**Obtener Documentos del Repositorio**:
```typescript
// ⚠️ FALTA IMPLEMENTAR
GET /api/v2/repository/society-profile/:structureId/nodes/core
// O alternativamente:
GET /api/v2/repositorio/:sociedadId/documentos-generados
```

**Preguntas de auditoría**:
- [ ] ¿Qué endpoint debemos usar para obtener documentos?
- [ ] ¿Cómo filtramos documentos por path `/core/juntas/{flowId}/`?
- [ ] ¿Necesitamos un endpoint específico para documentos de juntas?

---

### **3. Manejo de Errores**

#### **3.1. Errores Conocidos**

**Error 401 (Token no proporcionado)**:
- ✅ **RESUELTO**: Se corrigió el problema de headers con FormData
- ⚠️ **VERIFICAR**: ¿Hay otros casos donde se pierde el token?

**Error 404 (Endpoint no encontrado)**:
- ✅ **RESUELTO**: Se corrigió la resolución de base URL
- ⚠️ **VERIFICAR**: ¿Todos los endpoints usan la base URL correcta?

**Preguntas de auditoría**:
- [ ] ¿Todos los errores se manejan correctamente?
- [ ] ¿Los mensajes de error son claros para el usuario?
- [ ] ¿Se loguean los errores correctamente para debugging?

---

### **4. Código Duplicado y Reutilización**

#### **4.1. Funciones Comunes**

**`resolveBaseUrl()`**:
- ✅ Implementado en `RepositorioDocumentosHttpRepository`
- ⚠️ **VERIFICAR**: ¿Debería estar en un lugar compartido?

**`getCorrectMimeType()`**:
- ✅ Implementado en `RepositorioDocumentosHttpRepository`
- ⚠️ **VERIFICAR**: ¿Debería estar en un lugar compartido?

**Preguntas de auditoría**:
- [ ] ¿Hay código duplicado que debería refactorizarse?
- [ ] ¿Las funciones comunes están en el lugar correcto?
- [ ] ¿Se pueden crear utilidades compartidas?

---

### **5. Testing y Calidad**

#### **5.1. Testing Manual**

**Casos de prueba realizados**:
- ✅ Envío de documentos al repositorio
- ✅ Selección individual de documentos
- ✅ Autenticación con token

**Casos de prueba pendientes**:
- ⏳ Obtener documentos del repositorio
- ⏳ Mostrar documentos en la vista
- ⏳ Navegación por carpetas

**Preguntas de auditoría**:
- [ ] ¿Se necesitan tests unitarios?
- [ ] ¿Se necesitan tests de integración?
- [ ] ¿Cómo podemos automatizar las pruebas?

---

## 🔧 TAREAS DE REFACTORIZACIÓN SUGERIDAS

### **Tarea 1: Extraer Funciones Comunes**

**Problema**: `resolveBaseUrl()` y `getCorrectMimeType()` están duplicados o deberían estar en un lugar compartido.

**Solución sugerida**:
```typescript
// app/core/shared/http/resolve-base-url.ts
export function resolveBaseUrl(): string {
  // ... implementación
}

// app/core/shared/utils/mime-types.ts
export function getCorrectMimeType(fileName: string, currentType: string): string {
  // ... implementación
}
```

**Archivos a modificar**:
- `app/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository.ts`
- Cualquier otro repositorio que use estas funciones

---

### **Tarea 2: Implementar Mappers**

**Problema**: Los DTOs del backend no se mapean a entidades del dominio.

**Solución sugerida**:
```typescript
// app/core/hexag/repositorio/infrastructure/mappers/repositorio-node.mapper.ts
export class RepositorioNodeMapper {
  static toEntity(dto: RepositorioNodeDTO): RepositorioNode {
    // ... mapeo
  }
}
```

**Archivos a crear**:
- `app/core/hexag/repositorio/infrastructure/mappers/repositorio-node.mapper.ts`
- `app/core/hexag/repositorio/domain/entities/repositorio-node.entity.ts`
- `app/core/hexag/repositorio/application/dtos/repositorio-node.dto.ts`

---

### **Tarea 3: Mejorar Manejo de Errores**

**Problema**: Los errores no se manejan de forma consistente.

**Solución sugerida**:
```typescript
// app/core/shared/errors/repositorio-errors.ts
export class RepositorioError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

export class TokenExpiredError extends RepositorioError {
  constructor() {
    super("Token expirado", "TOKEN_EXPIRED", 401);
  }
}

export class StorageLimitExceededError extends RepositorioError {
  constructor() {
    super("Límite de almacenamiento excedido", "STORAGE_LIMIT_EXCEEDED", 413);
  }
}
```

**Archivos a crear**:
- `app/core/shared/errors/repositorio-errors.ts`
- Actualizar todos los repositorios para usar estos errores

---

### **Tarea 4: Implementar Obtener Documentos del Repositorio**

**Problema**: No hay forma de obtener documentos que se enviaron al repositorio.

**Solución sugerida**:
```typescript
// app/core/hexag/repositorio/domain/ports/repositorio-documentos.repository.ts
export interface RepositorioDocumentosRepository {
  // ... métodos existentes
  obtenerDocumentosPorSociedad(structureId: string): Promise<RepositorioNode[]>;
  obtenerDocumentosPorJunta(structureId: string, flowId: string): Promise<RepositorioNode[]>;
}

// app/core/hexag/repositorio/application/use-cases/obtener-documentos-junta.use-case.ts
export class ObtenerDocumentosJuntaUseCase {
  async execute(structureId: string, flowId: string): Promise<RepositorioNode[]> {
    // ... implementación
  }
}
```

**Archivos a crear/modificar**:
- `app/core/hexag/repositorio/domain/ports/repositorio-documentos.repository.ts` (agregar métodos)
- `app/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository.ts` (implementar métodos)
- `app/core/hexag/repositorio/application/use-cases/obtener-documentos-junta.use-case.ts` (nuevo)
- `app/composables/useObtenerDocumentosRepositorio.ts` (nuevo)

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

### **Archivos Clave**

1. **Documentación de Endpoints**:
   - `docs/backend/repositorio/GUIA-COMPLETA-ENDPOINTS-V2.md`
   - `docs/juntas/ISSUE-REPOSITORIO-DOCUMENTOS-V3.md`

2. **Análisis V2.5**:
   - `docs/juntas/ANALISIS-V25-REPOSITORIO-COMPLETO.md`
   - `docs/version 2.5/V25-CONEXION-REPOSITORIO-V2-V3.md`

3. **Arquitectura Hexagonal**:
   - `docs/general/ARCHITECTURE.md`
   - `docs/general/examples/producto-example.md`

### **Código de Referencia V2.5**

**⚠️ IMPORTANTE**: Estos archivos son la referencia principal:
- `../probo-2.5/src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts`
- `../probo-2.5/src/api/connection-probo-ai/postFilesToNode.ts`
- `../probo-2.5/src/api/connection-probo-ai/getNodeBySociety.ts`

---

## ✅ CHECKLIST DE AUDITORÍA

### **Arquitectura**
- [ ] Verificar que todas las capas respetan la arquitectura hexagonal
- [ ] Verificar que no hay dependencias circulares
- [ ] Verificar que los mappers están en Infrastructure
- [ ] Verificar que los DTOs están en Application
- [ ] Verificar que las entidades están en Domain

### **Código**
- [ ] Verificar que no hay código duplicado
- [ ] Verificar que las funciones comunes están compartidas
- [ ] Verificar que los nombres son descriptivos
- [ ] Verificar que los comentarios son útiles

### **Errores**
- [ ] Verificar que todos los errores se manejan correctamente
- [ ] Verificar que los mensajes de error son claros
- [ ] Verificar que los errores se loguean correctamente

### **Testing**
- [ ] Verificar que hay casos de prueba documentados
- [ ] Verificar que los casos de prueba cubren los escenarios principales
- [ ] Verificar que los casos de prueba se pueden ejecutar

### **Documentación**
- [ ] Verificar que la documentación está actualizada
- [ ] Verificar que los ejemplos de código funcionan
- [ ] Verificar que las referencias a archivos son correctas

---

## 🚀 PRÓXIMOS PASOS

1. **Auditoría Externa**: Otra AI revisa este documento y el código
2. **Refactorización**: Se implementan las mejoras sugeridas
3. **Testing**: Se prueban todas las funcionalidades
4. **Documentación**: Se actualiza la documentación con los cambios

---

**¡Listo para auditoría, mi rey!** 🚀💪

