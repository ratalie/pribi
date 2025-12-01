# 📋 Plan de Implementación: Snapshot Completo de Junta

## 🎯 Objetivo

Implementar la obtención del **snapshot completo** después de crear una junta, para:
1. ✅ Validar que el endpoint funciona
2. ✅ Mostrar la data por consola
3. ✅ Usar esa data para construir los pasos de la junta

---

## 📊 Endpoint a Implementar

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
```

**Respuesta**: `SnapshotComplete` (ver `FRONTEND_TYPES.ts`)

---

## 🏗️ Arquitectura a Seguir

Siguiendo el patrón hexagonal aprendido de Registro de Sociedades:

```
juntas/
├── domain/
│   └── ports/
│       └── junta.repository.ts  # Agregar método getSnapshot()
├── application/
│   ├── dtos/
│   │   └── snapshot-complete.dto.ts  # Nuevo DTO
│   └── use-cases/
│       └── get-snapshot.use-case.ts  # Nuevo use case
└── infrastructure/
    ├── repositories/
    │   ├── junta.http.repository.ts  # Implementar getSnapshot()
    │   └── junta.msw.repository.ts   # Implementar getSnapshot()
    ├── mappers/
    │   └── snapshot.mapper.ts  # Nuevo mapper (opcional, puede usar tipos directos)
    └── mocks/
        ├── data/
        │   └── snapshot.state.ts  # State mock para snapshot
        └── handlers/
            └── snapshot.handlers.ts  # Handler MSW para GET /snapshot/complete
```

---

## ✅ Checklist de Implementación

### Fase 1: Domain Layer (Contrato)

- [ ] **1.1** Agregar método `getSnapshot()` a `JuntaRepository` interface
  ```typescript
  getSnapshot(societyId: number, flowId: number): Promise<SnapshotCompleteDTO>;
  ```

### Fase 2: Application Layer (DTOs y Use Cases)

- [ ] **2.1** Crear `SnapshotCompleteDTO` en `application/dtos/snapshot-complete.dto.ts`
  - Usar los tipos de `FRONTEND_TYPES.ts`
  - Exportar desde `application/dtos/index.ts`

- [ ] **2.2** Crear `GetSnapshotUseCase` en `application/use-cases/get-snapshot.use-case.ts`
  - Recibe `societyId` y `flowId`
  - Llama a `repository.getSnapshot()`
  - Retorna `SnapshotCompleteDTO`

### Fase 3: Infrastructure Layer

#### 3.1. HTTP Repository

- [ ] **3.1.1** Implementar `getSnapshot()` en `junta.http.repository.ts`
  - Construir URL: `/api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete`
  - Hacer GET request con autenticación
  - Retornar `SnapshotCompleteDTO` directamente (sin mapper, usar tipos del backend)

#### 3.2. MSW Repository

- [ ] **3.2.1** Implementar `getSnapshot()` en `junta.msw.repository.ts`
  - Usar `getSnapshotMock()` del state

#### 3.3. State Mock

- [ ] **3.3.1** Crear `mocks/data/snapshot.state.ts`
  - Función `getSnapshotMock(societyId, flowId)`
  - Construir snapshot desde datos existentes de la sociedad (usar datos de otros stores)
  - O crear datos mock completos

#### 3.4. MSW Handlers

- [ ] **3.4.1** Crear `mocks/handlers/snapshot.handlers.ts`
  - Handler para `GET */api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete`
  - Usar `getSnapshotMock()`
  - Retornar formato del backend

- [ ] **3.4.2** Registrar handler en `mocks/index.ts` y `register-handlers.ts`

### Fase 4: Presentation Layer (Integración)

- [ ] **4.1** Modificar `junta-historial.store.ts`
  - En `crearJunta()`, después de crear, llamar a `getSnapshot()`
  - Mostrar snapshot por consola con `console.log` formateado

- [ ] **4.2** (Opcional) Agregar snapshot al state del store para uso futuro

---

## 🔄 Flujo Completo

```
1. Usuario crea junta
   ↓
2. Store.crearJunta() → UseCase.create()
   ↓
3. Repository.create() → POST /register-assembly
   ↓
4. Backend crea junta y replica data
   ↓
5. Store obtiene flowId
   ↓
6. Store.getSnapshot() → UseCase.getSnapshot()
   ↓
7. Repository.getSnapshot() → GET /snapshot/complete
   ↓
8. Backend/MSW retorna SnapshotComplete
   ↓
9. Store muestra snapshot por consola
   ↓
10. (Futuro) Store usa snapshot para construir pasos
```

---

## 📝 Orden de Implementación

1. ✅ **Domain**: Agregar método al contrato
2. ✅ **Application**: Crear DTO y Use Case
3. ✅ **Infrastructure HTTP**: Implementar en HTTP repository
4. ✅ **Infrastructure MSW**: Crear handler y state mock
5. ✅ **Presentation**: Integrar en store y mostrar por consola

---

## 🧪 Validación

Después de implementar, validar:

1. ✅ Crear una junta
2. ✅ Ver en consola el snapshot completo
3. ✅ Verificar que todos los campos estén presentes
4. ✅ Verificar que MSW también funciona

---

## 📚 Referencias

- Tipos TypeScript: `docs/juntas/snapshot/FRONTEND_TYPES.ts`
- Guía Frontend: `docs/juntas/snapshot/FRONTEND_SNAPSHOT_COMPLETE_GUIDE.md`
- Patrón MSW: `docs/testing/PATRON-MSW-COMPLETO-REGISTRO-SOCIEDADES.md`

---

**Última actualización**: 2025-12-01

