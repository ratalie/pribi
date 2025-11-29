# Plan de Implementación: Selección de Puntos de Agenda (Juntas)

## 📋 Resumen

Implementar el guardado de puntos de agenda en el primer paso del flujo de juntas de accionistas, siguiendo la arquitectura hexagonal y conectando con el backend.

## 🎯 Objetivos

1. ✅ **Crear junta** - Ya implementado
2. ✅ **Ver junta en historial** - Ya implementado  
3. 🔄 **Guardar selección de puntos de agenda** - **A IMPLEMENTAR**
4. 🔄 **Cargar selección guardada** - **A IMPLEMENTAR**

## 📍 Backend - Endpoints Disponibles

### Ubicación del Backend
```
/home/yull23/legal-factory/backend/src/modules/flows-v2/register-assembly/1.agenda-items
```

### Endpoints

#### 1. Actualizar Puntos de Agenda
- **Método:** `PUT`
- **Ruta:** `/v2/society-profile/:societyId/assembly/:flowId/agenda-items`
- **Body:** `AgendaItemDto` (ver estructura abajo)
- **Respuesta:** `{ success: true, message: "...", code: 200 }`

#### 2. Obtener Puntos de Agenda
- **Método:** `GET`
- **Ruta:** `/v2/society-profile/:societyId/assembly/:flowId/agenda-items`
- **Respuesta:** `{ success: true, data: AgendaItemDto, code: 200 }`

### Estructura del DTO (Backend)

```typescript
{
  aumentoCapital: {
    aportesDinerarios: boolean,           // "aporte-dinerarios" en frontend
    aporteNoDinerario: boolean,           // "aporte-no-dinerario" en frontend
    capitalizacionDeCreditos: boolean,     // "capitalizacion-creditos" en frontend
  },
  remocion: {
    remocionGerenteGeneral: boolean,      // "remocion-gerente" en frontend
    remocionApoderados: boolean,          // "remocion-apoderados" en frontend
    remocionDirectores: boolean,          // "remocion-directores" en frontend
  },
  nombramiento: {
    nombramientoGerenteGeneral: boolean,  // "nombramiento-gerente" en frontend
    nombramientoApoderados: boolean,      // "nombramiento-apoderados" en frontend
    nombramientoDirectores: boolean,       // "nombramiento-directores" en frontend
    nombramientoNuevoDirectorio: boolean,  // "nombramiento-nuevo-directorio" en frontend
  },
  gestionSocialYResultadosEconomicos: {
    pronunciamientoGestionSocialYResultados: boolean,  // "pronunciamiento-gestion" en frontend
    aplicacionResultados: boolean,                     // "aplicacion-resultados" en frontend
    designacionAuditoresExternos: boolean,            // "delegacion-auditores" en frontend
  },
}
```

### Mapeo Frontend → Backend

| Frontend ID | Backend Campo |
|-------------|---------------|
| `aporte-dinerarios` | `aumentoCapital.aportesDinerarios` |
| `aporte-no-dinerario` | `aumentoCapital.aporteNoDinerario` |
| `capitalizacion-creditos` | `aumentoCapital.capitalizacionDeCreditos` |
| `remocion-gerente` | `remocion.remocionGerenteGeneral` |
| `remocion-apoderados` | `remocion.remocionApoderados` |
| `remocion-directores` | `remocion.remocionDirectores` |
| `nombramiento-gerente` | `nombramiento.nombramientoGerenteGeneral` |
| `nombramiento-apoderados` | `nombramiento.nombramientoApoderados` |
| `nombramiento-directores` | `nombramiento.nombramientoDirectores` |
| `nombramiento-nuevo-directorio` | `nombramiento.nombramientoNuevoDirectorio` |
| `pronunciamiento-gestion` | `gestionSocialYResultadosEconomicos.pronunciamientoGestionSocialYResultados` |
| `aplicacion-resultados` | `gestionSocialYResultadosEconomicos.aplicacionResultados` |
| `delegacion-auditores` | `gestionSocialYResultadosEconomicos.designacionAuditoresExternos` |

## 🏗️ Arquitectura Hexagonal - Estructura Propuesta

```
app/core/hexag/juntas/
├── domain/                    # Ya existe (entidades y contratos principales)
│   ├── entities/
│   │   └── junta.entity.ts
│   └── ports/
│       └── junta.repository.ts
├── application/               # Ya existe (casos de uso transversales)
│   ├── dtos/
│   │   ├── junta-resumen.dto.ts
│   │   └── agenda-item.dto.ts          # NUEVO
│   └── use-cases/
│       ├── create-junta.use-case.ts    # Ya existe
│       ├── list-juntas.use-case.ts     # Ya existe
│       ├── delete-junta.use-case.ts    # Ya existe
│       ├── update-agenda-items.use-case.ts  # NUEVO
│       └── get-agenda-items.use-case.ts     # NUEVO
├── infrastructure/           # Ya existe (repositorios HTTP/MSW)
│   ├── repositories/
│   │   ├── junta.http.repository.ts
│   │   └── agenda-items.http.repository.ts  # NUEVO
│   ├── mappers/
│   │   ├── junta.mapper.ts
│   │   └── agenda-items.mapper.ts           # NUEVO
│   └── mocks/
│       ├── data/
│       │   └── agenda-items.state.ts        # NUEVO
│       └── handlers/
│           └── agenda-items.handlers.ts     # NUEVO
└── pasos/                    # NUEVO - Para implementar después
    ├── seleccion-agenda/
    │   ├── domain/
    │   ├── application/
    │   └── infrastructure/
    ├── detalles/
    ├── instalacion/
    └── puntos-acuerdo/
```

## 📝 Plan de Implementación Detallado

### Fase 1: Domain (Contratos)

**Archivo:** `app/core/hexag/juntas/domain/ports/agenda-items.repository.ts`

```typescript
export interface AgendaItemsRepository {
  update(societyId: number, flowId: number, payload: AgendaItemsDTO): Promise<void>;
  get(societyId: number, flowId: number): Promise<AgendaItemsDTO | null>;
}
```

### Fase 2: Application (DTOs y Use Cases)

**Archivo:** `app/core/hexag/juntas/application/dtos/agenda-item.dto.ts`

```typescript
export interface AgendaItemsDTO {
  aumentoCapital: {
    aportesDinerarios: boolean;
    aporteNoDinerario: boolean;
    capitalizacionDeCreditos: boolean;
  };
  remocion: {
    remocionGerenteGeneral: boolean;
    remocionApoderados: boolean;
    remocionDirectores: boolean;
  };
  nombramiento: {
    nombramientoGerenteGeneral: boolean;
    nombramientoApoderados: boolean;
    nombramientoDirectores: boolean;
    nombramientoNuevoDirectorio: boolean;
  };
  gestionSocialYResultadosEconomicos: {
    pronunciamientoGestionSocialYResultados: boolean;
    aplicacionResultados: boolean;
    designacionAuditoresExternos: boolean;
  };
}
```

**Archivos:**
- `app/core/hexag/juntas/application/use-cases/update-agenda-items.use-case.ts`
- `app/core/hexag/juntas/application/use-cases/get-agenda-items.use-case.ts`

### Fase 3: Infrastructure (Repositorio HTTP y Mapper)

**Archivo:** `app/core/hexag/juntas/infrastructure/repositories/agenda-items.http.repository.ts`

- Endpoint: `PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items`
- Endpoint: `GET /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items`

**Archivo:** `app/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper.ts`

- Mapear IDs del frontend (`aporte-dinerarios`) → Estructura del backend (`aumentoCapital.aportesDinerarios`)
- Mapear estructura del backend → IDs del frontend

### Fase 4: Presentation (Store y Controller)

**Archivo:** `app/core/presentation/juntas/stores/agenda-items.store.ts` (Option API)

- `updateAgendaItems(societyId, flowId, items)`
- `loadAgendaItems(societyId, flowId)`
- `selectedItems` (state reactivo)

**Archivo:** `app/core/presentation/juntas/composables/useAgendaItemsController.ts` (opcional)

- Gestionar ciclo de vida (onMounted, onActivated)
- Sincronizar con el store

### Fase 5: UI (Actualizar Componente y Página)

**Archivo:** `app/components/juntas/SeleccionPuntosAgenda.vue`

- Cargar selección guardada al montar
- Guardar en backend cuando se seleccione/deseleccione
- Mostrar estado de carga/error

**Archivo:** `app/pages/operaciones/junta-accionistas/seleccion-agenda/index.vue`

- Integrar con el store de agenda-items
- Guardar al hacer clic en "Siguiente"

## 🔄 Flujo de Datos

### Al Cargar la Página

1. Usuario navega a `/operaciones/junta-accionistas/:flowId/seleccion-agenda`
2. `useAgendaItemsController` (o directamente en el componente) llama a `getAgendaItemsUseCase.execute(societyId, flowId)`
3. El mapper convierte la estructura del backend a IDs del frontend
4. El componente `SeleccionPuntosAgenda` muestra los checkboxes marcados según los datos cargados

### Al Seleccionar/Deseleccionar un Punto

1. Usuario hace clic en un checkbox
2. `handlePuntoChange` actualiza el estado local
3. **NUEVO:** Llamar a `updateAgendaItemsUseCase.execute(societyId, flowId, items)` para guardar en backend
4. El mapper convierte los IDs del frontend a la estructura del backend

### Al Hacer Clic en "Siguiente"

1. Validar que al menos un punto esté seleccionado
2. **NUEVO:** Asegurar que los datos estén guardados (si no se guardaron automáticamente)
3. Navegar al siguiente paso

## 📋 Checklist de Implementación

### Domain
- [ ] Crear `AgendaItemsRepository` (port/interface)

### Application
- [ ] Crear `AgendaItemsDTO`
- [ ] Crear `UpdateAgendaItemsUseCase`
- [ ] Crear `GetAgendaItemsUseCase`

### Infrastructure
- [ ] Crear `AgendaItemsHttpRepository`
- [ ] Crear `AgendaItemsMapper` (Frontend IDs ↔ Backend Structure)
- [ ] Crear mocks MSW (handlers + data)

### Presentation
- [ ] Crear `agenda-items.store.ts` (Option API)
- [ ] Crear `useAgendaItemsController.ts` (opcional)

### UI
- [ ] Actualizar `SeleccionPuntosAgenda.vue` para cargar datos guardados
- [ ] Actualizar `SeleccionPuntosAgenda.vue` para guardar en backend
- [ ] Actualizar `seleccion-agenda/index.vue` para integrar con el store

## 🎯 Prioridad: Solo "Aporte Dinerario"

**Por ahora, solo implementar el guardado de "Aporte Dinerario":**

- Mapear `aporte-dinerarios` → `aumentoCapital.aportesDinerarios`
- Guardar solo este campo cuando esté seleccionado
- Los demás campos pueden quedar en `false` por defecto

## 📝 Notas Importantes

1. **IDs del Frontend vs Backend:**
   - Frontend usa IDs como `"aporte-dinerarios"` (kebab-case)
   - Backend usa estructura anidada como `aumentoCapital.aportesDinerarios` (camelCase)
   - El mapper debe hacer la conversión bidireccional

2. **Sociedad ID y Flow ID:**
   - `societyId`: Se obtiene de la ruta o del store de juntas
   - `flowId`: Se obtiene de `route.params.id` en la página

3. **Persistencia:**
   - Guardar automáticamente cuando se seleccione/deseleccione (opcional)
   - O guardar solo al hacer clic en "Siguiente" (más simple)

4. **Carga Inicial:**
   - Al cargar la página, obtener los datos guardados del backend
   - Si no hay datos, mostrar todos los checkboxes desmarcados

---

**Última actualización:** 2025-01-29  
**Estado:** Plan creado, pendiente de implementación

