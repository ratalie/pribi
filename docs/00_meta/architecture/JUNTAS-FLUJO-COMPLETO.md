# 🔄 Flujo Completo - Junta de Accionistas

## 📖 Descripción

Este documento describe el flujo completo de una Junta de Accionistas, desde la creación hasta la generación de documentos.

---

## 🗺️ Mapa del Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│  PASO 0: CREAR JUNTA                                            │
│  POST /api/v2/society-profile/:id/register-assembly             │
│  → Retorna flowId                                               │
└──────────────────────┬──────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 1: SELECCIÓN DE AGENDA                                    │
│  GET/PUT .../register-assembly/:flowId/agenda-items             │
│  → Seleccionar puntos de agenda                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 2: DETALLES DE LA JUNTA                                   │
│  GET/PUT .../register-assembly/:flowId/meeting-details          │
│  → Tipo, Convocatoria, Lugar, Presidencia                      │
└──────────────────────┬──────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 3: INSTALACIÓN DE LA JUNTA                                │
│  GET/PUT .../register-assembly/:flowId/attendance               │
│  → Asistencia, Representación, Quorum                          │
└──────────────────────┬──────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 4-N: PUNTOS DE AGENDA SELECCIONADOS                       │
│  Por cada punto seleccionado:                                   │
│  - Aporte Dinerario                                             │
│  - Capitalización de Créditos                                   │
│  - Nombramiento de Gerente                                      │
│  - Remoción de Directores                                       │
│  - etc.                                                         │
└──────────────────────┬──────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO FINAL: RESUMEN Y GENERACIÓN DE DOCUMENTOS                 │
│  GET .../register-assembly/:flowId/snapshot/complete            │
│  → PDF de Acta, Certificados, etc.                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Detalle de Cada Paso

### PASO 0: Crear Junta

**Endpoint:**
```
POST /api/v2/society-profile/{societyId}/register-assembly
```

**Payload:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "message": "Junta creada exitosamente",
  "code": 201,
  "data": {
    "flowId": "31",
    "societyProfileId": 68,
    "estado": "BORRADOR",
    "createdAt": "2025-12-04T10:00:00Z"
  }
}
```

**Arquitectura:**
```
Page
  ↓
Store.createJunta()
  ↓
CreateJuntaUseCase.execute(societyId)
  ↓
JuntaHttpRepository.create(societyId)
  ↓
POST /api/v2/society-profile/{societyId}/register-assembly
```

---

### PASO 1: Selección de Agenda

**Endpoint:**
```
GET /api/v2/society-profile/{societyId}/register-assembly/{flowId}/agenda-items
PUT /api/v2/society-profile/{societyId}/register-assembly/{flowId}/agenda-items
```

**Payload (PUT):**
```json
[
  {
    "id": "aporte-dinerarios",
    "selected": true,
    "order": 1
  },
  {
    "id": "nombramiento-gerente",
    "selected": true,
    "order": 2
  },
  {
    "id": "capitalizacion-creditos",
    "selected": false,
    "order": 3
  }
]
```

**Arquitectura:**
```
SeleccionPuntosAgenda.vue
  ↓
useAgendaItemsController(societyId, flowId)
  ↓
useAgendaItemsStore (Pinia Option API)
  ↓
GetAgendaItemsUseCase.execute()
  ↓
AgendaItemsHttpRepository.get()
  ↓
GET .../agenda-items
```

**Componentes:**
- `app/components/juntas/SeleccionPuntosAgenda.vue`
- `app/core/presentation/operaciones/junta-accionistas/seleccion-agenda/stores/agenda-items.store.ts`
- `app/core/presentation/operaciones/junta-accionistas/seleccion-agenda/composables/useAgendaItemsController.ts`

---

### PASO 2: Detalles de la Junta

**Endpoints:**
```
GET/PUT .../register-assembly/{flowId}/meeting-details
```

**Payload (PUT):**
```json
{
  "type": "GENERAL",
  "convocation": {
    "firstCallDate": "2025-02-01T10:00:00Z",
    "secondCallDate": "2025-02-01T11:00:00Z",
    "minimumNoticeDays": 15,
    "mode": "PRESENCIAL"
  },
  "location": {
    "address": "Av. Principal 123",
    "district": "San Isidro",
    "province": "Lima",
    "department": "Lima"
  },
  "presidency": {
    "presidentId": "director-123",
    "secretaryId": "director-456"
  }
}
```

**Arquitectura:**
```
DetallesJuntaPage.vue
  ↓
useMeetingDetailsController(societyId, flowId)
  ↓
useMeetingDetailsStore (Pinia Option API)
  ├─ setTipoJunta()
  ├─ setConvocatoria()
  ├─ setLugar()
  └─ setPresidencia()
  ↓
UpdateMeetingDetailsUseCase.execute()
  ↓
MeetingDetailsHttpRepository.update()
  ↓
PUT .../meeting-details
```

**Componentes:**
- `app/components/juntas/detalles/TipoJuntaSection.vue`
- `app/components/juntas/detalles/ConvocatoriaJuntaSection.vue`
- `app/components/juntas/detalles/ModalidadJuntaSection.vue`
- `app/core/presentation/operaciones/junta-accionistas/detalles/stores/meeting-details.store.ts`
- `app/core/presentation/operaciones/junta-accionistas/detalles/composables/useMeetingDetailsController.ts`

**Validaciones:**
- Si `type === "UNIVERSAL"` → No requiere convocatoria (todos presentes)
- Si `type === "GENERAL"` → Requiere convocatoria con fechas y plazos
- `minimumNoticeDays >= 3` (requisito legal en Perú)

---

### PASO 3: Instalación de la Junta

**Endpoints:**
```
GET .../register-assembly/{flowId}/snapshot/complete
GET/PUT .../register-assembly/{flowId}/attendance
```

**Payload (PUT attendance):**
```json
{
  "attendees": [
    {
      "shareholderId": "accionista-1",
      "shares": 500,
      "votes": 500,
      "represented": false
    },
    {
      "shareholderId": "accionista-2",
      "shares": 300,
      "votes": 300,
      "represented": true,
      "representativeId": "accionista-1"
    }
  ],
  "boardOfDirectors": {
    "presidentId": "director-1",
    "secretaryId": "director-2"
  }
}
```

**Arquitectura:**
```
InstalacionJuntaPage.vue
  ↓
useAsistenciaController(societyId, flowId)
  ↓
useAsistenciaStore (Pinia Option API)
  ├─ markAsistente()
  ├─ setMesaDirectiva()
  └─ calculateQuorum() (auto)
  ↓
UpdateAsistenciaUseCase.execute()
  ↓
AsistenciaHttpRepository.update()
  ↓
PUT .../attendance
```

**Componentes:**
- `app/components/juntas/instalacion/AsistenciaRepresentacionSection.vue`
- `app/components/juntas/instalacion/QuorumSection.vue`
- `app/components/juntas/instalacion/MesaDirectivaSection.vue`
- `app/core/presentation/operaciones/junta-accionistas/instalacion/stores/asistencia.store.ts`
- `app/core/presentation/operaciones/junta-accionistas/instalacion/composables/useAsistenciaController.ts`

**Cálculos:**
- **Capital Presente** = Suma de acciones de asistentes + representados
- **Porcentaje Asistencia** = (Capital Presente / Capital Total) * 100
- **Quorum Alcanzado** = Porcentaje >= Quorum Mínimo (del Paso 8 de Sociedades)

---

### PASO 4-N: Puntos de Agenda

Cada punto seleccionado en el Paso 1 genera su propio flujo.

**Ejemplo: Aporte Dinerario**

```
1. Aportantes (quiénes aportan)
   POST .../aporte-dinerario/aportantes

2. Aportes (cuánto aporta cada uno)
   POST .../aporte-dinerario/aportes

3. Votación (quién vota a favor/contra)
   POST .../aporte-dinerario/votacion

4. Resumen (preview antes de aprobar)
   GET .../aporte-dinerario/resumen
```

---

## 🔄 Estados de la Junta

```typescript
export enum EstadoJunta {
  BORRADOR = 'BORRADOR',           // Recién creada
  AGENDA_COMPLETA = 'AGENDA_COMPLETA', // Paso 1 completo
  DETALLES_COMPLETOS = 'DETALLES_COMPLETOS', // Paso 2 completo
  INSTALADA = 'INSTALADA',         // Paso 3 completo
  EN_VOTACION = 'EN_VOTACION',     // Pasos 4-N en progreso
  FINALIZADA = 'FINALIZADA',       // Todo completo
  DOCUMENTOS_GENERADOS = 'DOCUMENTOS_GENERADOS', // PDFs listos
}
```

**Transiciones permitidas:**
```
BORRADOR → AGENDA_COMPLETA → DETALLES_COMPLETOS → INSTALADA → EN_VOTACION → FINALIZADA → DOCUMENTOS_GENERADOS
```

---

## 🧪 Testing del Flujo Completo

```typescript
// tests/juntas/flujo-completo-junta.test.ts

describe('🏢 FLUJO COMPLETO: Junta de Accionistas', () => {
  let societyId: string;
  let flowId: string;

  beforeAll(async () => {
    // 1. Crear sociedad
    const sociedadRepo = new SociedadHttpRepository();
    societyId = await sociedadRepo.create();

    // 2. Crear junta
    const juntaRepo = new JuntaHttpRepository();
    flowId = await juntaRepo.create(parseInt(societyId, 10));
  });

  afterAll(async () => {
    // Cleanup
    const sociedadRepo = new SociedadHttpRepository();
    await sociedadRepo.delete(societyId);
  });

  it('PASO 1: debe seleccionar puntos de agenda', async () => {
    const agendaRepo = new AgendaItemsHttpRepository();
    const items = await agendaRepo.get(parseInt(societyId, 10), flowId);

    items[0].selected = true; // aporte-dinerarios
    items[1].selected = true; // nombramiento-gerente

    await agendaRepo.update(parseInt(societyId, 10), flowId, items);

    const updated = await agendaRepo.get(parseInt(societyId, 10), flowId);
    const selected = updated.filter((i) => i.selected);

    expect(selected.length).toBe(2);
    console.log('✅ PASO 1 completo');
  });

  it('PASO 2: debe configurar detalles de la junta', async () => {
    const detailsRepo = new MeetingDetailsHttpRepository();
    const payload = {
      tipo: TipoJunta.GENERAL,
      convocatoria: { /* ... */ },
      lugar: { /* ... */ },
      presidencia: { /* ... */ },
    };

    await detailsRepo.update(parseInt(societyId, 10), flowId, payload);

    const updated = await detailsRepo.get(parseInt(societyId, 10), flowId);
    expect(updated?.tipo).toBe(TipoJunta.GENERAL);
    console.log('✅ PASO 2 completo');
  });

  it('PASO 3: debe instalar la junta', async () => {
    const asistenciaRepo = new AsistenciaHttpRepository();
    const payload = {
      asistentes: [ /* ... */ ],
      mesaDirectiva: { /* ... */ },
    };

    await asistenciaRepo.update(parseInt(societyId, 10), flowId, payload);

    const updated = await asistenciaRepo.get(parseInt(societyId, 10), flowId);
    expect(updated?.asistentes.length).toBeGreaterThan(0);
    console.log('✅ PASO 3 completo');
  });

  it('PASO FINAL: debe generar snapshot completo', async () => {
    const snapshotRepo = new SnapshotHttpRepository();
    const snapshot = await snapshotRepo.get(parseInt(societyId, 10), flowId);

    expect(snapshot).toBeDefined();
    expect(snapshot?.agendaItems).toBeDefined();
    expect(snapshot?.meetingDetails).toBeDefined();
    expect(snapshot?.asistencia).toBeDefined();
    console.log('✅ SNAPSHOT completo');
  });
});
```

---

## 🎯 Dependencias Entre Pasos

### Orden Obligatorio

```
1. Crear Junta (obtener flowId)
   ↓
2. Selección de Agenda (definir qué se votará)
   ↓
3. Detalles (cuándo, dónde, cómo)
   ↓
4. Instalación (quiénes están presentes, quorum)
   ↓
5. Puntos de Agenda (votaciones por cada punto seleccionado)
   ↓
6. Resumen y Documentos
```

### Validaciones Backend

- **No puedes ir al Paso 2** si no has completado el Paso 1
- **No puedes ir al Paso 3** si faltan detalles
- **No puedes votar** si no alcanzas quorum

---

## 🔑 Datos Clave del Flujo

### societyId (number)

- ID de la sociedad (ej: 68)
- Se obtiene de la ruta: `/sociedades/[societyId]/`
- Es incremental, generado por el backend

### flowId (string)

- ID del flujo de la junta (ej: "31")
- Se genera al crear la junta (Paso 0)
- Se usa en todos los pasos siguientes

### Snapshot Complete

Endpoint especial que retorna **TODO** el estado de la junta:

```typescript
GET /api/v2/society-profile/{societyId}/register-assembly/{flowId}/snapshot/complete

{
  "societyProfile": { /* datos de la sociedad */ },
  "agendaItems": [ /* puntos seleccionados */ ],
  "meetingDetails": { /* detalles */ },
  "asistencia": { /* asistentes y quorum */ },
  "votaciones": { /* resultados de votaciones */ }
}
```

Se usa para:
- Renderizar página de resumen
- Generar documentos PDF
- Validar que todo esté completo

---

## 🏗️ Arquitectura por Paso

### PASO 1: Selección de Agenda

```
Domain:
  - entities/agenda-item.entity.ts
  - ports/agenda-items.repository.ts
  - constants/puntos-agenda.constants.ts

Application:
  - dtos/agenda-item.dto.ts
  - use-cases/get-agenda-items.use-case.ts
  - use-cases/update-agenda-items.use-case.ts

Infrastructure:
  - repositories/agenda-items.http.repository.ts
  - mappers/agenda-items.mapper.ts
  - mocks/handlers/agenda-items.handlers.ts

Presentation:
  - stores/agenda-items.store.ts
  - composables/useAgendaItemsController.ts
  - components/SeleccionPuntosAgenda.vue
```

### PASO 2: Detalles

```
Domain:
  - entities/meeting-details.entity.ts
  - entities/convocatoria.entity.ts
  - ports/meeting-details.repository.ts

Application:
  - dtos/meeting-details.dto.ts
  - use-cases/get-meeting-details.use-case.ts
  - use-cases/update-meeting-details.use-case.ts

Infrastructure:
  - repositories/meeting-details.http.repository.ts
  - mappers/meeting-details.mapper.ts
  - mocks/handlers/meeting-details.handlers.ts

Presentation:
  - stores/meeting-details.store.ts
  - composables/useMeetingDetailsController.ts
  - components/TipoJuntaSection.vue
  - components/ConvocatoriaJuntaSection.vue
  - components/ModalidadJuntaSection.vue
```

### PASO 3: Instalación

```
Domain:
  - entities/asistencia.entity.ts
  - entities/quorum-estado.entity.ts
  - ports/asistencia.repository.ts

Application:
  - dtos/asistencia.dto.ts
  - use-cases/asistencia/get-asistencia.use-case.ts
  - use-cases/asistencia/update-asistencia.use-case.ts

Infrastructure:
  - repositories/asistencia.http.repository.ts
  - mappers/asistencia.mapper.ts
  - mocks/handlers/asistencia.handlers.ts

Presentation:
  - stores/asistencia.store.ts
  - composables/useAsistenciaController.ts
  - components/AsistenciaRepresentacionSection.vue
  - components/QuorumSection.vue
  - components/MesaDirectivaSection.vue
```

---

## 🎨 UI/UX del Flujo

### Navegación entre Pasos

```vue
<!-- Navbar de pasos -->
<template>
  <nav>
    <NuxtLink 
      :to="`/operaciones/sociedades/${societyId}/junta-accionistas/${flowId}/seleccion-agenda`"
      :class="{ active: currentStep === 1 }"
    >
      1. Selección de Agenda
    </NuxtLink>
    
    <NuxtLink 
      :to="`/operaciones/sociedades/${societyId}/junta-accionistas/${flowId}/detalles`"
      :class="{ active: currentStep === 2, disabled: !paso1Completo }"
    >
      2. Detalles
    </NuxtLink>
    
    <NuxtLink 
      :to="`/operaciones/sociedades/${societyId}/junta-accionistas/${flowId}/instalacion`"
      :class="{ active: currentStep === 3, disabled: !paso2Completo }"
    >
      3. Instalación
    </NuxtLink>
  </nav>
</template>
```

### Validación de Paso Completo

Cada store tiene un getter `isReadyToContinue`:

```typescript
// agenda-items.store.ts
getters: {
  isReadyToContinue(state): boolean {
    return state.items.some(i => i.selected) && !state.loading;
  }
}

// meeting-details.store.ts
getters: {
  isReadyToContinue(state): boolean {
    return this.isComplete && !state.loading;
  }
}
```

Se usa para habilitar/deshabilitar el botón "Continuar":

```vue
<template>
  <Button 
    :disabled="!isReadyToContinue"
    @click="goToNextStep"
  >
    Continuar
  </Button>
</template>
```

---

## 📚 Referencias

- **Arquitectura**: `app/core/hexag/juntas/README.md`
- **Testing**: `docs/00_meta/testing/GUIA-TESTING-JUNTAS.md`
- **Ejemplo de Implementación**: `docs/00_meta/architecture/JUNTAS-EJEMPLO-COMPLETO.md`

---

**Última actualización**: Diciembre 4, 2024

