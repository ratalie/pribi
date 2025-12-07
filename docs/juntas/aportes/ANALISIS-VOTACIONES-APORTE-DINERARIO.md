# 📊 Análisis: Implementación de Votaciones - Aporte Dinerario

## 🎯 Objetivo

Analizar el estado actual de la implementación de votaciones para **Aporte Dinerario**, identificar qué falta para completar la arquitectura hexagonal/DDD y qué se necesita para conectarse al backend.

---

## 📁 Estado Actual de la Implementación

### ✅ **Lo que SÍ existe:**

#### 1. **Página de Votación** (`votacion.vue`)

- ✅ Ubicación: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aporte-dinerario/votacion.vue`
- ✅ Usa `MetodoVotacio` component
- ✅ Tiene `useJuntasFlowNext` configurado (pero sin validación/guardado)
- ✅ Navegación funcional

#### 2. **Componentes Visuales**

- ✅ `MetodoVotacio.vue` - Selector de método (unanimidad/mayoría)
- ✅ `UnanimidadVotacion.vue` - Vista de votación por unanimidad
- ✅ `MayoriaVotacion.vue` - Vista de votación por mayoría
- ✅ UI completa con:
  - Tabla de accionistas
  - Botones de voto (A favor, En contra, Abstención)
  - Barras de progreso
  - Cards de resumen
  - Resultado de votación

#### 3. **Datos Hardcodeados (Temporal)**

- ⚠️ Accionistas: `["Olenka Sanchez Aguilar", "Melanie Sanchez Aguilar", "Braulio Sanchez Aguilar"]`
- ⚠️ Pregunta: Hardcodeada en español
- ⚠️ Método de votación: `"unanimidad"` por defecto

---

## ❌ Lo que FALTA

### 🔴 **1. Arquitectura Hexagonal/DDD (0% implementado)**

#### **Domain Layer** - ❌ NO EXISTE

```
app/core/hexag/juntas/
└── domain/
    ├── entities/
    │   └── vote.entity.ts              ❌ FALTA
    │   └── vote-item.entity.ts         ❌ FALTA
    │   └── vote-entry.entity.ts        ❌ FALTA
    ├── ports/
    │   └── vote.repository.port.ts     ❌ FALTA
    └── enums/
        └── vote-context.enum.ts        ❌ FALTA
        └── vote-mode.enum.ts            ❌ FALTA
        └── vote-value.enum.ts          ❌ FALTA
```

#### **Application Layer** - ❌ NO EXISTE

```
app/core/hexag/juntas/
└── application/
    ├── dtos/
    │   └── vote.dto.ts                 ❌ FALTA
    │   └── vote-item.dto.ts            ❌ FALTA
    │   └── vote-entry.dto.ts           ❌ FALTA
    └── use-cases/
        └── create-vote-session.use-case.ts    ❌ FALTA
        └── update-vote-session.use-case.ts     ❌ FALTA
        └── get-vote-session.use-case.ts        ❌ FALTA
```

#### **Infrastructure Layer** - ❌ NO EXISTE

```
app/core/hexag/juntas/
└── infrastructure/
    ├── repositories/
    │   └── vote.http.repository.ts     ❌ FALTA
    │   └── vote.msw.repository.ts      ❌ FALTA (opcional)
    └── mappers/
        └── vote.mapper.ts              ❌ FALTA
```

#### **Presentation Layer** - ⚠️ PARCIAL (solo UI, sin lógica)

```
app/core/presentation/juntas/
└── puntos-acuerdo/
    └── aporte-dinerario/
        └── votacion/                    ❌ FALTA (debería existir)
            ├── stores/
            │   └── useVotacionStore.ts  ❌ FALTA
            ├── composables/
            │   └── useVotacionController.ts  ❌ FALTA
            └── components/
                └── (ya existen en instalacion/components/votacion/)
```

---

### 🔴 **2. Stores Pinia (0% implementado)**

**Falta crear:**

- ❌ `useVotacionStore` (Option API) para gestionar estado de votación
- ❌ Estado: `sesionVotacion`, `modo`, `items`, `votos`, `loading`, `error`
- ❌ Actions: `loadVotacion()`, `createVotacion()`, `updateVotacion()`, `addVote()`, `updateVote()`, `removeVote()`

---

### 🔴 **3. Conexión con Backend (0% implementado)**

**Endpoints que faltan integrar:**

| Endpoint                                 | Método | Estado | Notas                                              |
| ---------------------------------------- | ------ | ------ | -------------------------------------------------- |
| `GET /votes?contexto=APORTES_DINERARIOS` | GET    | ❌     | Cargar votación existente                          |
| `POST /votes`                            | POST   | ❌     | Crear nueva sesión de votación                     |
| `PUT /votes`                             | PUT    | ❌     | Actualizar votos (addVote, updateVote, removeVote) |

---

### 🔴 **4. Datos Dinámicos (0% implementado)**

**Lo que está hardcodeado y debería ser dinámico:**

1. **Accionistas/Votantes:**

   - ❌ Actualmente: Array hardcodeado de nombres
   - ✅ Debería: Cargar desde `snapshot.accionistasConDerechoVoto` o desde participantes con `isContributor: true`

2. **Pregunta/Item de Votación:**

   - ❌ Actualmente: String hardcodeado en español
   - ✅ Debería: Generarse dinámicamente basado en:
     - Total de aportes registrados
     - Monto total aportado
     - Cantidad de acciones nuevas
     - Valor nominal

3. **Método de Votación:**
   - ⚠️ Actualmente: `"unanimidad"` por defecto
   - ❓ Pregunta: ¿El método se guarda en el backend o solo es para UI?

---

### 🔴 **5. Validaciones y Lógica de Negocio (0% implementado)**

**Falta implementar:**

1. **Validaciones:**

   - ❌ Verificar que el punto de agenda `aportesDinerarios` esté activo
   - ❌ Validar que haya al menos un aporte registrado antes de votar
   - ❌ Validar que todos los votantes hayan emitido su voto (opcional)

2. **Cálculos:**

   - ⚠️ Porcentajes: Actualmente calcula por cantidad de personas, pero debería ser por acciones (si es modo CUMULATIVO)
   - ❌ Mayoría: Determinar si se aprobó según quórum y mayoría requerida

3. **Generación de UUIDs:**
   - ❌ Generar UUIDs para `id`, `items[].id`, `votos[].id`

---

## ❓ PREGUNTAS CRÍTICAS

### **1. Sobre los Votantes**

**❓ ¿Quiénes pueden votar en la votación de aportes dinerarios?**

**Opciones:**

- **A)** Solo los accionistas que asistieron a la junta (`asistencia.asistio === true`)
- **B)** Todos los accionistas con derecho a voto (del snapshot)
- **C)** Solo los aportantes que son contribuyentes (`isContributor === true`)
- **D)** Una combinación de las anteriores

**Mi recomendación:** Probablemente **A** (solo asistentes), pero necesito confirmación.

---

### **2. Sobre el Método de Votación**

**❓ ¿El método de votación (unanimidad/mayoría) se guarda en el backend?**

**Según la documentación del backend:**

- El backend tiene `modo: "SIMPLE" | "CUMULATIVO"` (no "unanimidad"/"mayoría")
- `SIMPLE` = Un voto por persona (A_FAVOR, EN_CONTRA, ABSTENCION)
- `CUMULATIVO` = Votos proporcionales a acciones (número)

**❓ Preguntas:**

- ¿"Unanimidad" = `SIMPLE`?
- ¿"Mayoría" = `CUMULATIVO`?
- ¿O "unanimidad"/"mayoría" es solo para UI y siempre se envía `SIMPLE`?

---

### **3. Sobre el Item de Votación**

**❓ ¿Cómo se genera el texto del item de votación?**

**Según la documentación:**

- El backend espera: `label: "Aprobación de aportes dinerarios"` y `descripción?: string`

**❓ Preguntas:**

- ¿El `label` es fijo o se genera dinámicamente?
- ¿La `descripción` debe incluir detalles de los aportes (montos, acciones, etc.)?
- ¿Ejemplo de descripción completa? (ej: "Se vota sobre la aprobación de los aportes dinerarios propuestos: S/ 10,000.00, 1,000 acciones nuevas...")

---

### **4. Sobre los Cálculos de Mayoría**

**❓ ¿Cómo se determina si se aprobó?**

**Según la documentación:**

- Modo `SIMPLE`: Se cuenta cantidad de votos
- Modo `CUMULATIVO`: Se cuenta por acciones

**❓ Preguntas:**

- ¿Qué mayoría se requiere? (Simple, Calificada)
- ¿Se usa el quórum del snapshot?
- ¿Cómo se calcula el porcentaje de aprobación?

---

### **5. Sobre la Estructura de Datos**

**❓ ¿Cuántos items de votación hay?**

**Según la documentación del backend:**

- Puede haber múltiples items en `items[]`
- Cada item tiene su propio array de `votos[]`

**❓ Preguntas:**

- ¿Para aporte dinerario siempre hay **1 solo item**?
- ¿O puede haber múltiples items? (ej: uno por cada aportante, o uno por cada aporte)

**Mi recomendación:** Probablemente **1 solo item** con el texto general, pero necesito confirmación.

---

### **6. Sobre el Flujo de Guardado**

**❓ ¿Cuándo se guarda la votación?**

**Opciones:**

- **A)** Al hacer click en "Siguiente" (en `useJuntasFlowNext`)
- **B)** Automáticamente al cambiar cada voto
- **C)** Con un botón "Guardar" explícito
- **D)** Al cambiar de método (unanimidad → mayoría)

**Mi recomendación:** **A** (al hacer click en "Siguiente"), pero guardar también automáticamente si hay cambios sin guardar.

---

### **7. Sobre la Carga Inicial**

**❓ ¿Se carga una votación existente al entrar a la página?**

**Según la documentación:**

- `GET /votes?contexto=APORTES_DINERARIOS` devuelve la sesión si existe

**❓ Preguntas:**

- ¿Siempre se intenta cargar al montar la página?
- ¿Qué pasa si no existe? (¿se crea automáticamente o se muestra vacío?)
- ¿Se debe crear la sesión inicial con un item vacío o esperar a que el usuario vote?

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Domain Layer** (Prioridad Alta)

- [ ] Crear `domain/entities/vote.entity.ts`

  - [ ] `VoteSession` (id, contexto, modo, items[])
  - [ ] `VoteItem` (id, orden, label, descripción, personaId?, votos[])
  - [ ] `VoteEntry` (id, personaId, valor)

- [ ] Crear `domain/enums/vote-context.enum.ts`

  - [ ] `VoteContext.APORTES_DINERARIOS = "APORTES_DINERARIOS"`

- [ ] Crear `domain/enums/vote-mode.enum.ts`

  - [ ] `VoteMode.SIMPLE = "SIMPLE"`
  - [ ] `VoteMode.CUMULATIVO = "CUMULATIVO"`

- [ ] Crear `domain/enums/vote-value.enum.ts`

  - [ ] `VoteValue.A_FAVOR = "A_FAVOR"`
  - [ ] `VoteValue.EN_CONTRA = "EN_CONTRA"`
  - [ ] `VoteValue.ABSTENCION = "ABSTENCION"`

- [ ] Crear `domain/ports/vote.repository.port.ts`
  - [ ] `getVoteSession(societyId, flowId, contexto): Promise<VoteSession | null>`
  - [ ] `createVoteSession(societyId, flowId, session): Promise<void>`
  - [ ] `updateVoteSession(societyId, flowId, contexto, items): Promise<void>`

---

### **Fase 2: Application Layer** (Prioridad Alta)

- [ ] Crear `application/dtos/vote.dto.ts`

  - [ ] `VoteSessionDTO` (formato exacto del backend)
  - [ ] `VoteItemDTO`
  - [ ] `VoteEntryDTO`
  - [ ] `CreateVoteSessionRequestDTO`
  - [ ] `UpdateVoteSessionRequestDTO`

- [ ] Crear `application/use-cases/get-vote-session.use-case.ts`
- [ ] Crear `application/use-cases/create-vote-session.use-case.ts`
- [ ] Crear `application/use-cases/update-vote-session.use-case.ts`

---

### **Fase 3: Infrastructure Layer** (Prioridad Alta)

- [ ] Crear `infrastructure/mappers/vote.mapper.ts`

  - [ ] `toDomain(dto): VoteSession`
  - [ ] `toDTO(entity): VoteSessionDTO`

- [ ] Crear `infrastructure/repositories/vote.http.repository.ts`
  - [ ] Implementar `VoteRepository` port
  - [ ] `GET /votes?contexto=APORTES_DINERARIOS`
  - [ ] `POST /votes`
  - [ ] `PUT /votes`

---

### **Fase 4: Presentation Layer** (Prioridad Alta)

- [ ] Crear `presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore.ts`

  - [ ] State: `sesionVotacion`, `modo`, `loading`, `error`
  - [ ] Actions: `loadVotacion()`, `createVotacion()`, `updateVotacion()`, `addVote()`, `updateVote()`, `removeVote()`
  - [ ] Getters: `hasVotacion()`, `getItemById()`, `getVotosByItem()`

- [ ] Crear `presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts`
  - [ ] Orquestar carga inicial
  - [ ] Gestionar ciclo de vida (onMounted, onActivated)
  - [ ] Conectar stores con componentes

---

### **Fase 5: Integración de Datos Dinámicos** (Prioridad Media)

- [ ] **Cargar Accionistas/Votantes:**

  - [ ] Opción A: Desde `useSnapshotStore.accionistasConDerechoVoto`
  - [ ] Opción B: Desde participantes con `isContributor: true`
  - [ ] Opción C: Desde `useAsistenciaStore.asistenciasEnriquecidas.filter(a => a.asistio)`
  - [ ] ❓ **PREGUNTA:** ¿Cuál usar?

- [ ] **Generar Item de Votación Dinámicamente:**

  - [ ] Obtener total de aportes desde `useAportesManagerStore.aportes`
  - [ ] Calcular monto total, acciones nuevas, capital social incrementado
  - [ ] Generar `label` y `descripción` basados en estos datos
  - [ ] ❓ **PREGUNTA:** ¿Formato exacto del texto?

- [ ] **Mapear Método UI → Backend:**
  - [ ] "unanimidad" → `VoteMode.SIMPLE`?
  - [ ] "mayoría" → `VoteMode.CUMULATIVO`?
  - [ ] ❓ **PREGUNTA:** ¿Confirmación del mapeo?

---

### **Fase 6: Validaciones y Guardado** (Prioridad Media)

- [ ] **Validar antes de guardar:**

  - [ ] Verificar que `aportesDinerarios` esté activo en agenda-items
  - [ ] Verificar que haya al menos un aporte registrado
  - [ ] Validar que todos los votantes hayan votado (opcional)

- [ ] **Implementar guardado:**

  - [ ] En `useJuntasFlowNext` de `votacion.vue`
  - [ ] Si no existe sesión → `createVoteSession`
  - [ ] Si existe → `updateVoteSession` con operaciones `addVote`, `updateVote`, `removeVote`

- [ ] **Cálculos de Mayoría:**
  - [ ] Calcular porcentaje de aprobación según modo (SIMPLE vs CUMULATIVO)
  - [ ] Determinar si se aprobó según quórum del snapshot
  - [ ] Mostrar resultado en UI

---

### **Fase 7: Mejoras de UX** (Prioridad Baja)

- [ ] **Carga Inicial:**

  - [ ] Intentar cargar votación existente al montar
  - [ ] Si no existe, crear sesión inicial con item vacío
  - [ ] Mostrar loading state

- [ ] **Persistencia Local:**

  - [ ] Guardar en localStorage para no perder votos al recargar (opcional)

- [ ] **Feedback Visual:**
  - [ ] Mostrar toast al guardar exitosamente
  - [ ] Mostrar error si falla el guardado
  - [ ] Indicar si hay cambios sin guardar

---

## 🎯 RESUMEN: ¿Qué Falta?

### **Arquitectura Hexagonal: 0%** ❌

- ❌ Domain Layer: 0% (no existe)
- ❌ Application Layer: 0% (no existe)
- ❌ Infrastructure Layer: 0% (no existe)
- ⚠️ Presentation Layer: 30% (solo UI, sin stores/composables)

### **Conexión Backend: 0%** ❌

- ❌ No hay llamadas a API
- ❌ No hay mapeo DTO ↔ Entity
- ❌ No hay stores que gestionen estado

### **Datos Dinámicos: 0%** ❌

- ❌ Accionistas hardcodeados
- ❌ Pregunta hardcodeada
- ❌ Método de votación no mapeado

### **Validaciones: 0%** ❌

- ❌ No valida punto de agenda activo
- ❌ No valida que haya aportes
- ❌ No calcula mayorías correctamente

---

## 🚀 PLAN DE ACCIÓN RECOMENDADO

### **Opción 1: Implementación Completa (Hexagonal)**

1. Crear Domain Layer completo
2. Crear Application Layer completo
3. Crear Infrastructure Layer completo
4. Crear Presentation Layer (stores + composables)
5. Integrar con componentes existentes
6. Conectar con backend

**Tiempo estimado:** 4-6 horas

---

### **Opción 2: Implementación Rápida (Solo Presentation)**

1. Crear Store directamente (sin hexagonal)
2. Llamar API directamente desde store
3. Integrar con componentes existentes
4. Refactorizar a hexagonal después (si es necesario)

**Tiempo estimado:** 2-3 horas

**⚠️ Nota:** Esta opción rompe la arquitectura hexagonal, pero es más rápida.

---

### **Opción 3: Implementación Híbrida (Recomendada)**

1. Crear Domain Layer básico (entities + enums)
2. Crear Application Layer básico (DTOs + 1 use case)
3. Crear Infrastructure Layer básico (repository HTTP + mapper)
4. Crear Presentation Layer (store + composable)
5. Integrar con componentes existentes

**Tiempo estimado:** 3-4 horas

**✅ Ventaja:** Mantiene arquitectura hexagonal pero sin sobre-ingeniería.

---

## ❓ PREGUNTAS FINALES PARA Olenka/Tú

1. **¿Quiénes pueden votar?** (A, B, C o D de la sección anterior)
2. **¿Método de votación?** (unanimidad = SIMPLE, mayoría = CUMULATIVO?)
3. **¿Formato del label/descripción?** (¿ejemplo exacto?)
4. **¿Cuántos items?** (¿siempre 1 o puede haber más?)
5. **¿Cuándo guardar?** (A, B, C o D de la sección anterior)
6. **¿Carga inicial?** (¿siempre intentar cargar o crear nueva?)

---

**Una vez que respondas estas preguntas, puedo implementar todo el flujo completo! 🚀**

