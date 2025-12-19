# 📋 Plan de Implementación: Participantes Compartidos (Aporte Dinerario + Capitalización)

## 🎯 Objetivo

Implementar un sistema donde los participantes de **Aporte Dinerario** y **Capitalización de Créditos** compartan la misma estructura (`contributorsId`), pero puedan ser identificados y filtrados por módulo usando un campo adicional `contributionModule`.

---

## 📊 Análisis del Problema Actual

### **Estado Actual:**

1. **Estructuras separadas (pero código incorrecto):**
   - Aporte Dinerario busca en: `contributorsId` ✅
   - Capitalización busca en: `contributorsId` ❌ (debería ser `creditCapitalizationId` o compartir)

2. **Problemas identificados:**
   - Si ambos puntos de agenda están activos, no hay forma de distinguir para qué módulo es cada participante
   - `personId` es `@unique` en `ShareholderV2`, no se pueden duplicar registros
   - No hay clonación automática de accionistas cuando se activa un punto de agenda
   - El endpoint `/participants` devuelve array vacío porque la estructura está vacía

3. **Tipos de participantes:**
   - `ACCIONISTA`: Accionista existente del snapshot
   - `NUEVO_APORTANTE_CASH`: Nuevo aportante para aporte dinerario
   - `NUEVO_APORTANTE_CREDIT`: Nuevo aportante para capitalización

---

## 💡 Solución Propuesta

### **Arquitectura:**

1. **Estructura compartida:** Ambos módulos usan `contributorsId`
2. **Campo discriminador:** Agregar `contributionModule` para identificar el módulo
3. **Clonación automática:** Al activar punto de agenda, clonar accionistas del snapshot
4. **Filtrado inteligente:** Cada endpoint filtra por `typeShareholder` + `contributionModule`

### **Schema Changes:**

```prisma
model ShareholderV2 {
  // ... campos existentes ...
  contributionModule String? @db.VarChar(10) // 'CASH' | 'CREDIT' | 'BOTH'
  @@index([structureId, contributionModule])
}
```

### **Lógica de Clonación:**

```
Cuando se activa APORTE DINERARIO:
  → Clonar accionistas del snapshot
  → typeShareholder: 'ACCIONISTA'
  → contributionModule: 'CASH'
  → isContributor: false

Cuando se activa CAPITALIZACIÓN:
  → Si accionista ya existe (mismo personId):
    → Si contributionModule = 'CASH' → actualizar a 'BOTH'
    → Si contributionModule = null → actualizar a 'CREDIT'
  → Si no existe:
    → Clonar con contributionModule: 'CREDIT'

Si ambos se activan al mismo tiempo:
  → Clonar una vez con contributionModule: 'BOTH'
```

### **Filtrado por Endpoint:**

**Aporte Dinerario (`/cash-contribution/participants`):**
```typescript
where: {
  structureId: contributorsId,
  status: true,
  OR: [
    { typeShareholder: 'NUEVO_APORTANTE_CASH' },
    { 
      typeShareholder: 'ACCIONISTA',
      contributionModule: { in: ['CASH', 'BOTH'] }
    }
  ]
}
```

**Capitalización (`/credit-capitalization/participants`):**
```typescript
where: {
  structureId: contributorsId,
  status: true,
  OR: [
    { typeShareholder: 'NUEVO_APORTANTE_CREDIT' },
    { 
      typeShareholder: 'ACCIONISTA',
      contributionModule: { in: ['CREDIT', 'BOTH'] }
    }
  ]
}
```

---

## 🚀 Plan de Ejecución

### **FASE 1: Modificar Schema y Migración**

#### **1.1 Actualizar Schema Prisma**

**Archivo:** `prisma/schema.prisma`

```prisma
model ShareholderV2 {
  // ... campos existentes ...
  contributionModule String? @db.VarChar(10) // 'CASH' | 'CREDIT' | 'BOTH'
  
  @@index([structureId, contributionModule])
}
```

**Acciones:**
- [ ] Agregar campo `contributionModule` a `ShareholderV2`
- [ ] Agregar índice compuesto para optimizar queries
- [ ] Crear migración: `npx prisma migrate dev --name add_contribution_module_to_shareholder`

---

### **FASE 2: Crear Servicio de Clonación de Participantes**

#### **2.1 Crear Servicio de Clonación**

**Archivo:** `src/modules/flows-v2/register-assembly/shared/services/clone-participants.service.ts`

**Responsabilidades:**
- Clonar accionistas del snapshot a `contributorsId`
- Asignar `contributionModule` según el módulo activado
- Manejar casos donde ambos módulos están activos
- Evitar duplicados (verificar por `personId`)

**Métodos:**
```typescript
async cloneShareholdersForCashModule(
  structureId: string,
  snapshotShareholders: Shareholder[],
  existingParticipants: ShareholderV2[]
): Promise<void>

async cloneShareholdersForCreditModule(
  structureId: string,
  snapshotShareholders: Shareholder[],
  existingParticipants: ShareholderV2[]
): Promise<void>

async cloneShareholdersForBothModules(
  structureId: string,
  snapshotShareholders: Shareholder[]
): Promise<void>
```

**Acciones:**
- [ ] Crear servicio `CloneParticipantsService`
- [ ] Implementar lógica de clonación
- [ ] Implementar lógica de actualización de `contributionModule`
- [ ] Agregar validaciones para evitar duplicados

---

### **FASE 3: Integrar Clonación en Update Agenda Items**

#### **3.1 Modificar Update Agenda Item Handler**

**Archivo:** `src/modules/flows-v2/register-assembly/1.agenda-items/application/commands/update-agenda-item/update-agenda-item.handler.ts`

**Cambios:**
- Inyectar `CloneParticipantsService`
- Después de actualizar agenda items, verificar si se activó aporte dinerario o capitalización
- Llamar al servicio de clonación correspondiente

**Lógica:**
```typescript
// Después de agendaItem.update(command.items)
const items = agendaItem.items;

if (items.aportesDinerarios && !items.capitalizacionDeCreditos) {
  // Solo aporte dinerario
  await this.cloneParticipantsService.cloneForCashModule(...);
} else if (!items.aportesDinerarios && items.capitalizacionDeCreditos) {
  // Solo capitalización
  await this.cloneParticipantsService.cloneForCreditModule(...);
} else if (items.aportesDinerarios && items.capitalizacionDeCreditos) {
  // Ambos
  await this.cloneParticipantsService.cloneForBothModules(...);
}
```

**Acciones:**
- [ ] Inyectar `CloneParticipantsService` en el handler
- [ ] Obtener snapshot de accionistas
- [ ] Obtener participantes existentes
- [ ] Llamar servicio de clonación según módulos activos
- [ ] Manejar errores y transacciones

---

### **FASE 4: Actualizar Handlers de Find All Participants**

#### **4.1 Actualizar Aporte Dinerario Handler**

**Archivo:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/querys/find-all-participant/find-all-participant.handler.ts`

**Cambios:**
- Agregar filtro por `contributionModule`
- Incluir `NUEVO_APORTANTE_CASH` y `ACCIONISTA` con módulo correcto

**Query:**
```typescript
const where: Prisma.ShareholderV2WhereInput = {
  structureId: structure.contributorsId,
  status: true,
  OR: [
    { typeShareholder: 'NUEVO_APORTANTE_CASH' },
    { 
      typeShareholder: 'ACCIONISTA',
      contributionModule: { in: ['CASH', 'BOTH'] }
    }
  ]
};

if (query.isActive) {
  where.isContributor = true;
}
```

**Acciones:**
- [ ] Actualizar query para incluir filtro por `contributionModule`
- [ ] Probar que devuelve participantes correctos

#### **4.2 Actualizar Capitalización Handler**

**Archivo:** `src/modules/flows-v2/register-assembly/5.credit-capitalization/participants/querys/find-all-participant/find-all-participant.handler.ts`

**Cambios:**
- Cambiar de `contributorsId` a `contributorsId` (compartir estructura)
- Agregar filtro por `contributionModule`

**Query:**
```typescript
const where: Prisma.ShareholderV2WhereInput = {
  structureId: structure.contributorsId, // ← Cambiar de creditCapitalizationId
  status: true,
  OR: [
    { typeShareholder: 'NUEVO_APORTANTE_CREDIT' },
    { 
      typeShareholder: 'ACCIONISTA',
      contributionModule: { in: ['CREDIT', 'BOTH'] }
    }
  ]
};

if (query.isActive) {
  where.isContributor = true;
}
```

**Acciones:**
- [ ] Cambiar validación de `creditCapitalizationId` a `contributorsId`
- [ ] Actualizar query para incluir filtro por `contributionModule`
- [ ] Actualizar mensaje de error si no está activo

---

### **FASE 5: Actualizar Entidades y Repositorios**

#### **5.1 Actualizar Participant Entity (Aporte Dinerario)**

**Archivo:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/domain/entities/aportantes.entity.ts`

**Cambios:**
- Agregar getter para `contributionModule`
- Actualizar `rehydrate` para incluir `contributionModule`

**Acciones:**
- [ ] Agregar campo `contributionModule` a la entidad
- [ ] Actualizar `rehydrate` method
- [ ] Agregar getter

#### **5.2 Actualizar Participant Repository**

**Archivo:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/database/participant.repository.ts`

**Cambios:**
- Incluir `contributionModule` en `save` y `findById`

**Acciones:**
- [ ] Actualizar `save` para incluir `contributionModule`
- [ ] Actualizar `findById` para incluir `contributionModule` en select

#### **5.3 Actualizar Participant Mapper**

**Archivo:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/participant.mapper.ts`

**Cambios:**
- Incluir `contributionModule` en el DTO de respuesta

**Acciones:**
- [ ] Agregar `contributionModule` al mapper

---

### **FASE 6: Actualizar DTOs**

#### **6.1 Actualizar Participant DTO**

**Archivo:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/participant.dto.ts`

**Cambios:**
- Agregar campo `contributionModule` opcional

**Acciones:**
- [ ] Agregar campo al schema Zod
- [ ] Actualizar tipo TypeScript

---

### **FASE 7: Actualizar Create Participant Handlers**

#### **7.1 Aporte Dinerario - Create Participant**

**Archivo:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/commands/add-participant/create-participant.handler.ts`

**Cambios:**
- Al crear nuevo participante, asignar `contributionModule: 'CASH'` implícitamente (ya tiene `NUEVO_APORTANTE_CASH`)

**Acciones:**
- [ ] Verificar que `NUEVO_APORTANTE_CASH` ya identifica el módulo
- [ ] Opcional: agregar `contributionModule: 'CASH'` explícitamente

#### **7.2 Capitalización - Create Participant**

**Archivo:** `src/modules/flows-v2/register-assembly/5.credit-capitalization/participants/commands/add-participant/create-participant.handler.ts`

**Cambios:**
- Cambiar validación de `creditCapitalizationId` a `contributorsId`
- Al crear nuevo participante, asignar `contributionModule: 'CREDIT'` implícitamente

**Acciones:**
- [ ] Cambiar validación a `contributorsId`
- [ ] Verificar que `NUEVO_APORTANTE_CREDIT` ya identifica el módulo

---

### **FASE 8: Testing y Validación**

#### **8.1 Casos de Prueba**

**Escenarios:**
1. ✅ Activar solo Aporte Dinerario → Clona con `contributionModule: 'CASH'`
2. ✅ Activar solo Capitalización → Clona con `contributionModule: 'CREDIT'`
3. ✅ Activar ambos al mismo tiempo → Clona con `contributionModule: 'BOTH'`
4. ✅ Activar Aporte Dinerario primero, luego Capitalización → Actualiza a `'BOTH'`
5. ✅ Activar Capitalización primero, luego Aporte Dinerario → Actualiza a `'BOTH'`
6. ✅ Filtrar participantes en `/cash-contribution/participants` → Solo muestra CASH y BOTH
7. ✅ Filtrar participantes en `/credit-capitalization/participants` → Solo muestra CREDIT y BOTH
8. ✅ Crear nuevo aportante cash → `typeShareholder: NUEVO_APORTANTE_CASH`
9. ✅ Crear nuevo aportante credit → `typeShareholder: NUEVO_APORTANTE_CREDIT`

**Acciones:**
- [ ] Crear tests unitarios para `CloneParticipantsService`
- [ ] Crear tests de integración para flujo completo
- [ ] Probar en desarrollo con datos reales
- [ ] Validar que no se crean duplicados

---

### **FASE 9: Documentación**

#### **9.1 Actualizar Documentación Frontend**

**Archivo:** `docs/frontend/CONEXION-BACKEND-APORTE-DINERARIO.MD`

**Cambios:**
- Documentar nuevo campo `contributionModule`
- Explicar cómo funciona el filtrado
- Actualizar ejemplos de respuesta

**Acciones:**
- [ ] Actualizar documentación
- [ ] Agregar ejemplos de respuestas con `contributionModule`
- [ ] Explicar lógica de filtrado

---

## 📝 Checklist de Implementación

### **Schema y Base de Datos**
- [ ] Agregar campo `contributionModule` a `ShareholderV2`
- [ ] Agregar índice compuesto
- [ ] Crear y ejecutar migración
- [ ] Verificar migración en desarrollo

### **Servicios**
- [ ] Crear `CloneParticipantsService`
- [ ] Implementar clonación para módulo CASH
- [ ] Implementar clonación para módulo CREDIT
- [ ] Implementar clonación para módulo BOTH
- [ ] Implementar actualización de módulo existente

### **Handlers**
- [ ] Actualizar `UpdateAgendaItemHandler` con clonación
- [ ] Actualizar `FindAllParticipantHandler` (Aporte Dinerario)
- [ ] Actualizar `FindAllParticipantHandler` (Capitalización)
- [ ] Actualizar `CreateParticipantHandler` (Capitalización)

### **Entidades y Repositorios**
- [ ] Actualizar `Participant` entity (Aporte Dinerario)
- [ ] Actualizar `Participant` repository (Aporte Dinerario)
- [ ] Actualizar `Participant` mapper (Aporte Dinerario)
- [ ] Actualizar DTOs

### **Testing**
- [ ] Tests unitarios para servicio de clonación
- [ ] Tests de integración para flujo completo
- [ ] Validación manual en desarrollo

### **Documentación**
- [ ] Actualizar documentación frontend
- [ ] Documentar cambios en API
- [ ] Actualizar ejemplos

---

## 🔄 Flujo Completo

### **Escenario 1: Activar Solo Aporte Dinerario**

```
1. Usuario activa "Aportes Dinerarios" en agenda items
   ↓
2. UpdateAgendaItemHandler ejecuta
   ↓
3. Se crea/actualiza contributorsId
   ↓
4. CloneParticipantsService.cloneForCashModule()
   - Obtiene accionistas del snapshot
   - Clona cada accionista a contributorsId
   - typeShareholder: 'ACCIONISTA'
   - contributionModule: 'CASH'
   - isContributor: false
   ↓
5. GET /cash-contribution/participants
   - Filtra: typeShareholder = 'NUEVO_APORTANTE_CASH' OR 
             (typeShareholder = 'ACCIONISTA' AND contributionModule IN ('CASH', 'BOTH'))
   - Devuelve participantes clonados
```

### **Escenario 2: Activar Ambos Módulos**

```
1. Usuario activa ambos puntos de agenda
   ↓
2. UpdateAgendaItemHandler ejecuta
   ↓
3. CloneParticipantsService.cloneForBothModules()
   - Obtiene accionistas del snapshot
   - Clona cada accionista una vez
   - typeShareholder: 'ACCIONISTA'
   - contributionModule: 'BOTH'
   - isContributor: false
   ↓
4. GET /cash-contribution/participants → Devuelve participantes (filtra CASH o BOTH)
5. GET /credit-capitalization/participants → Devuelve mismos participantes (filtra CREDIT o BOTH)
```

### **Escenario 3: Activar Secuencialmente**

```
1. Usuario activa "Aportes Dinerarios"
   → Clona con contributionModule: 'CASH'
   ↓
2. Usuario activa "Capitalización de Créditos"
   → Detecta participantes existentes
   → Actualiza contributionModule: 'CASH' → 'BOTH'
   → Si no existe, clona con contributionModule: 'CREDIT'
```

---

## ⚠️ Consideraciones Importantes

1. **Transacciones:** Todas las operaciones deben estar en transacciones para mantener consistencia
2. **Idempotencia:** La clonación debe ser idempotente (no crear duplicados si se ejecuta múltiples veces)
3. **Performance:** Usar `createMany` para clonar múltiples participantes de una vez
4. **Validaciones:** Verificar que el snapshot tenga accionistas antes de clonar
5. **Rollback:** Si falla la clonación, hacer rollback de la actualización de agenda items

---

## 🎯 Resultado Esperado

Después de la implementación:

1. ✅ Los participantes se clonan automáticamente al activar puntos de agenda
2. ✅ Ambos módulos comparten la misma estructura `contributorsId`
3. ✅ Cada participante puede identificarse por módulo usando `contributionModule`
4. ✅ Los endpoints filtran correctamente según el módulo
5. ✅ No se crean duplicados cuando ambos módulos están activos
6. ✅ El frontend puede distinguir entre participantes de cada módulo

---

## 📅 Estimación de Tiempo

- **FASE 1 (Schema):** 30 min
- **FASE 2 (Servicio):** 2-3 horas
- **FASE 3 (Integración):** 1-2 horas
- **FASE 4 (Handlers):** 1 hora
- **FASE 5 (Entidades):** 1 hora
- **FASE 6 (DTOs):** 30 min
- **FASE 7 (Create Handlers):** 30 min
- **FASE 8 (Testing):** 2-3 horas
- **FASE 9 (Documentación):** 1 hora

**Total estimado:** 10-12 horas

---

## 🚦 Próximos Pasos

1. Revisar y aprobar este plan
2. Crear branch: `feat/shared-participants-contribution-module`
3. Comenzar con FASE 1 (Schema)
4. Implementar fase por fase
5. Testing continuo
6. Code review
7. Merge a develop

# 🔄 Diagrama de Flujo: Participantes Compartidos

## 📊 Flujo de Clonación Automática

```
┌─────────────────────────────────────────────────────────────┐
│  Usuario activa punto(s) de agenda                         │
│  PUT /agenda-items                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  UpdateAgendaItemHandler.execute()                          │
│  - Actualiza agenda items en BD                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────┴─────────────┐
         │  ¿Qué módulos activó?      │
         └─────────────┬─────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Solo CASH   │ │ Solo CREDIT  │ │ Ambos        │
└──────┬──────┘ └──────┬───────┘ └──────┬───────┘
       │               │                 │
       ▼               ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│  CloneParticipantsService                                    │
│                                                               │
│  Método: cloneForCashModule()                                │
│  - Obtiene accionistas del snapshot                          │
│  - Clona a contributorsId                                    │
│  - typeShareholder: 'ACCIONISTA'                             │
│  - contributionModule: 'CASH'                               │
│  - isContributor: false                                      │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  CloneParticipantsService                                    │
│                                                               │
│  Método: cloneForCreditModule()                              │
│  - Obtiene accionistas del snapshot                          │
│  - Verifica si ya existen (por personId)                    │
│  - Si existe con 'CASH' → actualiza a 'BOTH'                │
│  - Si no existe → clona con 'CREDIT'                        │
│  - typeShareholder: 'ACCIONISTA'                             │
│  - isContributor: false                                      │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  CloneParticipantsService                                    │
│                                                               │
│  Método: cloneForBothModules()                              │
│  - Obtiene accionistas del snapshot                          │
│  - Clona una vez a contributorsId                           │
│  - typeShareholder: 'ACCIONISTA'                             │
│  - contributionModule: 'BOTH'                               │
│  - isContributor: false                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Flujo de Consulta (GET /participants)

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend: GET /cash-contribution/participants                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  FindAllParticipantHandler (Aporte Dinerario)               │
│  - Obtiene structure.contributorsId                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Query Prisma:                                               │
│                                                               │
│  where: {                                                     │
│    structureId: contributorsId,                              │
│    status: true,                                              │
│    OR: [                                                      │
│      { typeShareholder: 'NUEVO_APORTANTE_CASH' },          │
│      {                                                        │
│        typeShareholder: 'ACCIONISTA',                        │
│        contributionModule: { in: ['CASH', 'BOTH'] }          │
│      }                                                        │
│    ]                                                          │
│  }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Resultado: Array de participantes                           │
│  - Solo participantes de Aporte Dinerario                    │
│  - Incluye ACCIONISTA con CASH o BOTH                        │
│  - Incluye NUEVO_APORTANTE_CASH                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Flujo de Consulta (GET /credit-capitalization/participants)

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend: GET /credit-capitalization/participants           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  FindAllParticipantHandler (Capitalización)                  │
│  - Obtiene structure.contributorsId (compartido)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Query Prisma:                                               │
│                                                               │
│  where: {                                                     │
│    structureId: contributorsId,                              │
│    status: true,                                              │
│    OR: [                                                      │
│      { typeShareholder: 'NUEVO_APORTANTE_CREDIT' },        │
│      {                                                        │
│        typeShareholder: 'ACCIONISTA',                        │
│        contributionModule: { in: ['CREDIT', 'BOTH'] }        │
│      }                                                        │
│    ]                                                          │
│  }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Resultado: Array de participantes                           │
│  - Solo participantes de Capitalización                      │
│  - Incluye ACCIONISTA con CREDIT o BOTH                       │
│  - Incluye NUEVO_APORTANTE_CREDIT                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Matriz de Tipos y Módulos

| typeShareholder        | contributionModule | Visible en Aporte Dinerario | Visible en Capitalización |
|------------------------|-------------------|----------------------------|--------------------------|
| `ACCIONISTA`           | `'CASH'`         | ✅ Sí                      | ❌ No                    |
| `ACCIONISTA`           | `'CREDIT'`       | ❌ No                      | ✅ Sí                    |
| `ACCIONISTA`           | `'BOTH'`         | ✅ Sí                      | ✅ Sí                    |
| `NUEVO_APORTANTE_CASH` | `null`           | ✅ Sí                      | ❌ No                    |
| `NUEVO_APORTANTE_CREDIT`| `null`          | ❌ No                      | ✅ Sí                    |

---

## 🔄 Escenario: Activación Secuencial

```
Tiempo T1: Usuario activa "Aportes Dinerarios"
    ↓
    Clona accionistas:
    - Juan Pérez: contributionModule = 'CASH'
    - María García: contributionModule = 'CASH'
    ↓
Tiempo T2: Usuario activa "Capitalización de Créditos"
    ↓
    Verifica participantes existentes:
    - Juan Pérez existe con 'CASH' → Actualiza a 'BOTH'
    - María García existe con 'CASH' → Actualiza a 'BOTH'
    ↓
Resultado:
    - Juan Pérez: contributionModule = 'BOTH' ✅
    - María García: contributionModule = 'BOTH' ✅
    ↓
GET /cash-contribution/participants → Devuelve ambos (filtra CASH o BOTH)
GET /credit-capitalization/participants → Devuelve ambos (filtra CREDIT o BOTH)
```

---

## 🎯 Estados de un Participante

```
┌─────────────────────────────────────────────────────────────┐
│  Estado Inicial (Snapshot)                                   │
│  - Accionista existe en sociedad                             │
│  - typeShareholder: (no aplica, está en otra estructura)    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Estado 1: Clonado para Aporte Dinerario                    │
│  - typeShareholder: 'ACCIONISTA'                            │
│  - contributionModule: 'CASH'                               │
│  - isContributor: false                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ (si se activa Capitalización)
┌─────────────────────────────────────────────────────────────┐
│  Estado 2: Actualizado para Ambos                           │
│  - typeShareholder: 'ACCIONISTA'                            │
│  - contributionModule: 'BOTH'                                │
│  - isContributor: false (puede cambiar)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Validaciones Importantes

```
┌─────────────────────────────────────────────────────────────┐
│  Antes de Clonar:                                           │
│  ✅ Verificar que contributorsId existe                      │
│  ✅ Verificar que snapshot tiene accionistas                 │
│  ✅ Verificar que no hay duplicados (por personId)           │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Durante Clonación:                                         │
│  ✅ Usar transacción para atomicidad                         │
│  ✅ Usar createMany para performance                         │
│  ✅ Manejar errores y hacer rollback                         │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Después de Clonar:                                         │
│  ✅ Verificar que se crearon correctamente                   │
│  ✅ Verificar contributionModule correcto                    │
│  ✅ Log de operación para debugging                          │
└─────────────────────────────────────────────────────────────┘
```

# 📋 Resumen Ejecutivo: Participantes Compartidos

## 🎯 Objetivo

Compartir estructura `contributorsId` entre Aporte Dinerario y Capitalización, usando `contributionModule` para identificar el módulo.

---

## 🔑 Cambios Principales

### **1. Schema**
```prisma
model ShareholderV2 {
  contributionModule String? @db.VarChar(10) // 'CASH' | 'CREDIT' | 'BOTH'
  @@index([structureId, contributionModule])
}
```

### **2. Servicio Nuevo**
- `CloneParticipantsService`: Clona accionistas del snapshot cuando se activa punto de agenda

### **3. Lógica de Clonación**
- **Solo Aporte Dinerario:** `contributionModule: 'CASH'`
- **Solo Capitalización:** `contributionModule: 'CREDIT'`
- **Ambos:** `contributionModule: 'BOTH'`
- **Secuencial:** Actualiza `'CASH'` → `'BOTH'` o `'CREDIT'` → `'BOTH'`

### **4. Filtrado**
- `/cash-contribution/participants` → Filtra: `NUEVO_APORTANTE_CASH` OR (`ACCIONISTA` AND `contributionModule IN ('CASH', 'BOTH')`)
- `/credit-capitalization/participants` → Filtra: `NUEVO_APORTANTE_CREDIT` OR (`ACCIONISTA` AND `contributionModule IN ('CREDIT', 'BOTH')`)

---

## 📦 Archivos a Modificar

### **Nuevos:**
- `src/modules/flows-v2/register-assembly/shared/services/clone-participants.service.ts`

### **Modificar:**
- `prisma/schema.prisma` (agregar campo)
- `src/modules/flows-v2/register-assembly/1.agenda-items/application/commands/update-agenda-item/update-agenda-item.handler.ts`
- `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/querys/find-all-participant/find-all-participant.handler.ts`
- `src/modules/flows-v2/register-assembly/5.credit-capitalization/participants/querys/find-all-participant/find-all-participant.handler.ts`
- `src/modules/flows-v2/register-assembly/5.credit-capitalization/participants/commands/add-participant/create-participant.handler.ts`
- Repositorios, entidades y DTOs relacionados

---

## ✅ Checklist Rápido

- [ ] Migración: Agregar `contributionModule` a `ShareholderV2`
- [ ] Crear `CloneParticipantsService`
- [ ] Integrar clonación en `UpdateAgendaItemHandler`
- [ ] Actualizar filtros en ambos `FindAllParticipantHandler`
- [ ] Actualizar entidades y repositorios
- [ ] Testing completo
- [ ] Documentación frontend

---

## 🚀 Orden de Implementación

1. **Schema** → Migración
2. **Servicio** → Lógica de clonación
3. **Integración** → Conectar con agenda items
4. **Handlers** → Actualizar queries
5. **Entidades** → Agregar campo
6. **Testing** → Validar todo

---

**Ver plan completo:** `PARTICIPANTES-APORTE-DINERARIO-CAPITALIZACION-PLAN.md`

