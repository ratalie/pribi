# 🏛️ Juntas - Arquitectura Hexagonal

## 📖 Descripción

Módulo de **Junta de Accionistas** construido siguiendo **Arquitectura Hexagonal (Puertos y Adaptadores)**.

Permite registrar, gestionar y documentar juntas de accionistas de sociedades comerciales en Perú.

---

## 🏗️ Arquitectura

```
app/core/hexag/juntas/
├── domain/                    ← CAPA 1: Lógica de Negocio Pura
│   ├── entities/             # Entidades de dominio
│   ├── ports/                # Contratos (interfaces)
│   ├── enums/                # Enumeraciones
│   ├── constants/            # Constantes del dominio
│   └── services/             # Servicios de dominio
│
├── application/               ← CAPA 2: Casos de Uso
│   ├── dtos/                 # Data Transfer Objects
│   ├── use-cases/            # Casos de uso (orquestación)
│   └── validators/           # Validadores de negocio
│
├── infrastructure/            ← CAPA 3: Adaptadores
│   ├── repositories/         # HTTP & MSW
│   ├── mappers/              # DTO ↔ Entity
│   └── mocks/                # MSW Handlers & State
│
└── README.md                 ← Este archivo
```

---

## 🔄 Flujo de Datos

```
Pages (Vue)
  ↓
Composables (Controllers) ← app/core/presentation/
  ↓
Stores (Pinia - Option API) ← app/core/presentation/
  ↓
Use Cases ← app/core/hexag/juntas/application/
  ↓
Repositories (Ports) ← app/core/hexag/juntas/domain/ports/
  ↓
HTTP Repository / MSW Repository ← app/core/hexag/juntas/infrastructure/
  ↓
Backend / MSW
```

---

## 📦 Pasos del Flujo

### 1. **Selección de Agenda**
- **Entities:** `AgendaItem`
- **Use Cases:** `GetAgendaItemsUseCase`, `UpdateAgendaItemsUseCase`
- **Repository:** `AgendaItemsRepository` → `AgendaItemsHttpRepository`
- **Store:** `useAgendaItemsStore` (Option API)
- **Controller:** `useAgendaItemsController`

### 2. **Detalles de la Junta**
- **Entities:** `MeetingDetails`, `Convocatoria`, `Lugar`, `Presidencia`
- **Use Cases:** `GetMeetingDetailsUseCase`, `UpdateMeetingDetailsUseCase`
- **Repository:** `MeetingDetailsRepository` → `MeetingDetailsHttpRepository`
- **Store:** `useMeetingDetailsStore` (Option API)
- **Controller:** `useMeetingDetailsController`

### 3. **Instalación de la Junta**
- **Entities:** `Asistencia`, `Quorum`, `MesaDirectiva`
- **Use Cases:** `GetAsistenciaUseCase`, `UpdateAsistenciaUseCase`
- **Repository:** `AsistenciaRepository` → `AsistenciaHttpRepository`
- **Store:** `useAsistenciaStore` (Option API)
- **Controller:** `useAsistenciaController`

---

## 🎯 Domain Layer

### Entities (domain/entities/)

```typescript
// meeting-details.entity.ts
export interface MeetingDetails {
  id: string;
  societyId: number;
  flowId: string;
  tipo: TipoJunta;
  convocatoria: Convocatoria;
  lugar: Lugar;
  presidencia: Presidencia;
}

// asistencia.entity.ts
export interface Asistencia {
  asistentes: Asistente[];
  representantes: Representante[];
  quorum: Quorum;
  mesaDirectiva: MesaDirectiva;
}
```

### Ports (domain/ports/)

```typescript
// junta.repository.ts
export interface JuntaRepository {
  create(societyId: number): Promise<string>; // flowId
  get(societyId: number, flowId: string): Promise<Junta | null>;
  list(societyId: number): Promise<Junta[]>;
  delete(societyId: number, flowId: string): Promise<void>;
}
```

### Constants (domain/constants/)

- **`puntos-agenda.constants.ts`**: Catálogo completo de puntos de agenda
- **`agenda-classification.constants.ts`**: Clasificación de acuerdos (simple/calificado)

---

## 📋 Application Layer

### Use Cases (application/use-cases/)

Cada Use Case tiene **UNA SOLA RESPONSABILIDAD**:

```typescript
// get-agenda-items.use-case.ts
export class GetAgendaItemsUseCase {
  constructor(private readonly repository: AgendaItemsRepository) {}

  async execute(societyId: number, flowId: string): Promise<AgendaItem[]> {
    return this.repository.get(societyId, flowId);
  }
}
```

### DTOs (application/dtos/)

Los DTOs son la representación **EXACTA** del formato del backend:

```typescript
// meeting-details.dto.ts
export interface MeetingDetailsDTO {
  id: string;
  type: string; // Backend usa "type", Domain usa "tipo"
  convocation: ConvocationDTO;
  location: LocationDTO;
  // ...
}
```

---

## ⚙️ Infrastructure Layer

### HTTP Repositories (infrastructure/repositories/)

```typescript
// agenda-items.http.repository.ts
export class AgendaItemsHttpRepository implements AgendaItemsRepository {
  async get(societyId: number, flowId: string): Promise<AgendaItem[]> {
    const url = `${apiBase}/society-profile/${societyId}/register-assembly/${flowId}/agenda-items`;
    const response = await $fetch<BackendApiResponse<AgendaItemDTO[]>>(url);
    
    // Mapper: DTO → Entity
    return AgendaItemsMapper.toDomain(response.data);
  }
  // ...
}
```

### MSW Repositories (infrastructure/repositories/)

Para testing **SIN BACKEND**:

```typescript
// agenda-items.msw.repository.ts
export class AgendaItemsMswRepository implements AgendaItemsRepository {
  async get(societyId: number, flowId: string): Promise<AgendaItem[]> {
    // Devuelve datos mockeados del state en memoria
    return getAgendaItemsMock(societyId, flowId);
  }
}
```

### Mappers (infrastructure/mappers/)

Transforman **DTO ↔ Entity**:

```typescript
// meeting-details.mapper.ts
export class MeetingDetailsMapper {
  static toDomain(dto: MeetingDetailsDTO): MeetingDetails {
    return {
      id: dto.id,
      tipo: dto.type === 'GENERAL' ? TipoJunta.GENERAL : TipoJunta.UNIVERSAL,
      // ...
    };
  }

  static toDTO(entity: MeetingDetails): MeetingDetailsDTO {
    return {
      id: entity.id,
      type: entity.tipo === TipoJunta.GENERAL ? 'GENERAL' : 'UNIVERSAL',
      // ...
    };
  }
}
```

---

## 🎨 Presentation Layer

Ver: `app/core/presentation/operaciones/junta-accionistas/README.md`

---

## 🧪 Testing

### Estructura de Tests

```
app/core/hexag/juntas/infrastructure/repositories/__tests__/
├── junta.repository.shared.test.ts
├── agenda-items.repository.shared.test.ts
├── meeting-details.repository.shared.test.ts
└── asistencia.repository.shared.test.ts
```

### Comandos

```bash
# Tests con MSW (SIN backend)
npm run test:juntas:msw

# Tests con Backend Real
npm run test:juntas:backend

# Tests en modo watch
npm run test:juntas:watch
```

### Patrón Shared Tests

Los tests usan **Shared Test Suite** para probar AMBOS adaptadores:

```typescript
// junta.repository.shared.test.ts
import { testJuntaRepository } from './junta.repository.contract';

describe('Junta Repository - HTTP', () => {
  const repository = new JuntaHttpRepository();
  testJuntaRepository(repository, { useMsw: false });
});

describe('Junta Repository - MSW', () => {
  const repository = new JuntaMswRepository();
  testJuntaRepository(repository, { useMsw: true });
});
```

---

## 🔄 Cambiar de Adaptador

**El PODER de la Arquitectura Hexagonal**: cambiar de MSW a Backend solo requiere cambiar el adaptador!

### Antes (acoplado):
```typescript
// ❌ MAL: Componente habla directamente con el backend
async function loadData() {
  const response = await fetch(`/api/juntas/${id}`);
  this.data = response.json();
}
```

### Después (hexagonal):
```typescript
// ✅ BIEN: Componente usa Use Case (no sabe qué adaptador usa)
const useCase = new GetJuntaUseCase(repository); // ← Inyección
const junta = await useCase.execute(societyId, flowId);
```

### Para cambiar de MSW → Backend:
```typescript
// SOLO cambiar esta línea:
const repository = new JuntaHttpRepository(); // En lugar de JuntaMswRepository
```

---

## 📚 Documentación Adicional

- **Presentation Layer**: `app/core/presentation/operaciones/junta-accionistas/README.md`
- **Testing Guide**: `docs/00_meta/testing/GUIA-TESTING-JUNTAS.md`
- **Arquitectura General**: `docs/00_meta/architecture/ARQUITECTURA-HEXAGONAL.md`
- **Diagrama de Flujo**: `docs/00_meta/architecture/JUNTAS-FLUJO-COMPLETO.md`

---

## 🎯 Próximos Pasos (Otros Puntos de Agenda)

Los pasos 1-3 están completos. Para agregar más pasos (aporte dinerario, capitalización, etc.):

1. **Ya tienes** Domain, Application, Infrastructure base
2. **Agrega** casos de uso específicos en `application/use-cases/[paso]/`
3. **Agrega** stores y controllers en `presentation/[paso]/`
4. **Agrega** tests en `infrastructure/repositories/__tests__/`

**Cada paso sigue el mismo patrón** → Escalabilidad garantizada! 🚀

---

## 🤝 Contribuir

Para agregar nuevos pasos o funcionalidades, sigue siempre el orden:

1. **Domain** → Entities, Ports, Enums
2. **Application** → DTOs, Use Cases
3. **Infrastructure** → Repositories, Mappers, MSW
4. **Presentation** → Stores, Controllers, Components
5. **Tests** → Shared Test Suite

---

**Arquitectura by**: Yull23 & Cursor AI
**Fecha**: Diciembre 2024

