# 🏛️ Arquitectura Hexagonal + DDD

> Este documento explica en profundidad la **Arquitectura Hexagonal (Ports & Adapters)** aplicada al proyecto, siguiendo principios **DDD (Domain-Driven Design)**.

---

## 🎯 ¿Por Qué Arquitectura Hexagonal?

### Problemas que resuelve:

❌ **Sin Arquitectura Hexagonal:**
```typescript
// ❌ Componente Vue con lógica HTTP y negocio mezclados
<script setup>
const createSociety = async (formData) => {
  // Lógica de negocio mezclada con HTTP
  const response = await $fetch('/api/sociedades', {
    method: 'POST',
    body: formData
  });
  
  // Mapeo manual
  return {
    id: response.data.id,
    razonSocial: response.data.razon_social
  };
};
</script>
```

**Problemas:**
- 🔴 Lógica de negocio en componente Vue
- 🔴 Dependencia directa con HTTP
- 🔴 Difícil de testear
- 🔴 No reutilizable
- 🔴 Cambios en backend rompen frontend

---

✅ **Con Arquitectura Hexagonal:**
```typescript
// ✅ Componente Vue solo consume caso de uso
<script setup>
const { execute } = useCreateSocietyUseCase();

const createSociety = async (formData) => {
  // Solo delega al caso de uso
  return await execute(formData);
};
</script>
```

**Beneficios:**
- ✅ Lógica de negocio desacoplada
- ✅ Fácil de testear (mocks)
- ✅ Reutilizable en cualquier contexto
- ✅ Cambios en backend no afectan dominio
- ✅ Código limpio y mantenible

---

## 📐 Estructura de Capas

La arquitectura hexagonal se divide en **4 capas principales**:

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION                           │
│  (Stores, Controllers, Componentes Vue, Páginas)            │
│  - Maneja UI/UX                                             │
│  - Usa Application (Use Cases)                              │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │ usa
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION                            │
│  (DTOs, Use Cases)                                          │
│  - Orquesta lógica de negocio                               │
│  - Define contratos (DTOs)                                  │
│  - Usa Domain (Entities, Ports)                             │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │ usa
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                         DOMAIN                              │
│  (Entities, Ports)                                          │
│  - Define modelo de negocio (Entities)                      │
│  - Define contratos de infraestructura (Ports)              │
│  - NO depende de nada (núcleo puro)                         │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │ implementa
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE                            │
│  (Mappers, Repositories HTTP/Mock)                          │
│  - Implementa Ports (de Domain)                             │
│  - Convierte DTO ↔ Entidad (Mappers)                        │
│  - Accede a fuentes externas (HTTP, localStorage, etc.)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estructura de Carpetas

### Estructura obligatoria:

```
app/core/hexag/[dominio]/
├── domain/
│   ├── entities/              # Entidades de negocio (PURO)
│   │   └── sociedad.entity.ts
│   └── ports/                 # Contratos (interfaces)
│       └── sociedad.repository.port.ts
├── application/
│   ├── dtos/                  # DTOs bidireccionales (request + response)
│   │   ├── create-sociedad.dto.ts
│   │   └── sociedad-response.dto.ts
│   └── use-cases/             # Casos de uso
│       ├── create-sociedad.use-case.ts
│       └── get-sociedad.use-case.ts
└── infrastructure/
    ├── mappers/               # DTO ↔ Entidad
    │   └── sociedad.mapper.ts
    └── repositories/          # Implementaciones HTTP/Mock
        ├── sociedad.http.repository.ts
        ├── sociedad.mock.repository.ts
        └── __tests__/         # Tests unitarios
            └── sociedad.test.ts
```

### Ejemplo real del proyecto:

```
app/core/hexag/registros/sociedades/pasos/
├── datos-principales/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── datos-principales.entity.ts
│   │   └── ports/
│   │       └── datos-principales.repository.port.ts
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── create-datos-principales.dto.ts
│   │   │   └── datos-principales-response.dto.ts
│   │   └── use-cases/
│   │       ├── create-datos-principales.use-case.ts
│   │       └── get-datos-principales.use-case.ts
│   └── infrastructure/
│       ├── mappers/
│       │   └── datos-principales.mapper.ts
│       └── repositories/
│           ├── datos-principales.http.repository.ts
│           └── __tests__/
│               └── datos-principales.test.ts
├── accionistas/
│   └── ... (misma estructura)
├── acciones/
│   └── ... (misma estructura)
└── ... (8 pasos en total)
```

---

## 1️⃣ Domain (Núcleo de Negocio)

### 🎯 Propósito:
Contiene la **lógica de negocio pura**, sin dependencias externas.

### 📂 Estructura:

#### **Entities** (Entidades):
Representan conceptos de negocio.

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/domain/entities/datos-principales.entity.ts

export interface DatosPrincipalesEntity {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  objetoSocial: string;
  tipoSociedad: "SA" | "SRL" | "EIRL";
  duracion: number; // años
  capitalSocial: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Características:**
- ✅ Solo tipos y lógica de negocio
- ✅ NO depende de DTOs, HTTP, Vue, Pinia
- ✅ Puede tener métodos de negocio

**Ejemplo con métodos:**
```typescript
export class SociedadEntity {
  constructor(
    public id: string,
    public razonSocial: string,
    public capitalSocial: number
  ) {}

  // Lógica de negocio pura
  esCapitalSuficiente(minimo: number): boolean {
    return this.capitalSocial >= minimo;
  }

  calcularImportePorAccion(numeroAcciones: number): number {
    return this.capitalSocial / numeroAcciones;
  }
}
```

#### **Ports** (Contratos):
Definen **qué debe hacer** la infraestructura (no cómo).

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/domain/ports/datos-principales.repository.port.ts

import type { DatosPrincipalesEntity } from "../entities/datos-principales.entity";
import type { CreateDatosPrincipalesDTO } from "../../application/dtos/create-datos-principales.dto";

export interface DatosPrincipalesRepositoryPort {
  create(data: CreateDatosPrincipalesDTO): Promise<DatosPrincipalesEntity>;
  getById(id: string): Promise<DatosPrincipalesEntity | null>;
  update(id: string, data: Partial<CreateDatosPrincipalesDTO>): Promise<DatosPrincipalesEntity>;
  delete(id: string): Promise<void>;
}
```

**Características:**
- ✅ Solo define contratos (interfaces)
- ✅ NO implementa nada
- ✅ Infraestructura los implementa

---

## 2️⃣ Application (Orquestación)

### 🎯 Propósito:
Orquesta la lógica de negocio y define contratos de comunicación (DTOs).

### 📂 Estructura:

#### **DTOs** (Data Transfer Objects):
Formato de datos para comunicación (request + response).

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/application/dtos/create-datos-principales.dto.ts

export interface CreateDatosPrincipalesDTO {
  razonSocial: string;
  nombreComercial: string;
  objetoSocial: string;
  tipoSociedad: "SA" | "SRL" | "EIRL";
  duracion: number;
  capitalSocial: number;
}
```

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/application/dtos/datos-principales-response.dto.ts

export interface DatosPrincipalesResponseDTO {
  id: string;
  razon_social: string; // ⚠️ Snake case del backend
  nombre_comercial: string;
  objeto_social: string;
  tipo_sociedad: string;
  duracion: number;
  capital_social: number;
  created_at: string; // ⚠️ String ISO del backend
  updated_at: string;
}
```

**Características:**
- ✅ **Bidireccional**: sirve para request Y response
- ✅ Representa formato **exacto del backend** (snake_case, tipos string para fechas, etc.)
- ✅ NO es la entidad (se mapea después)

#### **Use Cases** (Casos de Uso):
Orquestan la lógica de negocio.

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/application/use-cases/create-datos-principales.use-case.ts

import type { DatosPrincipalesRepositoryPort } from "../../domain/ports/datos-principales.repository.port";
import type { DatosPrincipalesEntity } from "../../domain/entities/datos-principales.entity";
import type { CreateDatosPrincipalesDTO } from "../dtos/create-datos-principales.dto";

export class CreateDatosPrincipalesUseCase {
  constructor(
    private repository: DatosPrincipalesRepositoryPort
  ) {}

  async execute(data: CreateDatosPrincipalesDTO): Promise<DatosPrincipalesEntity> {
    // Validaciones de negocio (opcional)
    if (data.capitalSocial <= 0) {
      throw new Error("El capital social debe ser mayor a 0");
    }

    // Delegar a infraestructura
    return await this.repository.create(data);
  }
}
```

**Características:**
- ✅ Orquesta lógica de negocio
- ✅ Usa **Ports** (no implementaciones directas)
- ✅ Fácil de testear (inyectar mocks)

---

## 3️⃣ Infrastructure (Implementaciones)

### 🎯 Propósito:
Implementa los **Ports** (contratos) definidos en Domain.

### 📂 Estructura:

#### **Mappers** (DTO ↔ Entidad):
Convierten DTOs (backend) a Entidades (dominio).

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/infrastructure/mappers/datos-principales.mapper.ts

import type { DatosPrincipalesResponseDTO } from "../../application/dtos/datos-principales-response.dto";
import type { DatosPrincipalesEntity } from "../../domain/entities/datos-principales.entity";

export class DatosPrincipalesMapper {
  // DTO (backend) → Entidad (dominio)
  static toDomain(dto: DatosPrincipalesResponseDTO): DatosPrincipalesEntity {
    return {
      id: dto.id,
      razonSocial: dto.razon_social, // ⚠️ Snake case → Camel case
      nombreComercial: dto.nombre_comercial,
      objetoSocial: dto.objeto_social,
      tipoSociedad: dto.tipo_sociedad as "SA" | "SRL" | "EIRL",
      duracion: dto.duracion,
      capitalSocial: dto.capital_social,
      createdAt: new Date(dto.created_at), // ⚠️ String → Date
      updatedAt: new Date(dto.updated_at),
    };
  }

  // Entidad (dominio) → DTO (backend)
  static toDTO(entity: DatosPrincipalesEntity): DatosPrincipalesResponseDTO {
    return {
      id: entity.id,
      razon_social: entity.razonSocial,
      nombre_comercial: entity.nombreComercial,
      objeto_social: entity.objetoSocial,
      tipo_sociedad: entity.tipoSociedad,
      duracion: entity.duracion,
      capital_social: entity.capitalSocial,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}
```

**Características:**
- ✅ Conversión bidireccional (DTO ↔ Entidad)
- ✅ Maneja diferencias de formato (snake_case, fechas, etc.)
- ✅ Obligatorio en Infrastructure

#### **Repositories** (Implementaciones HTTP):
Implementan los Ports definidos en Domain.

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/infrastructure/repositories/datos-principales.http.repository.ts

import type { DatosPrincipalesRepositoryPort } from "../../domain/ports/datos-principales.repository.port";
import type { DatosPrincipalesEntity } from "../../domain/entities/datos-principales.entity";
import type { CreateDatosPrincipalesDTO } from "../../application/dtos/create-datos-principales.dto";
import type { DatosPrincipalesResponseDTO } from "../../application/dtos/datos-principales-response.dto";
import { DatosPrincipalesMapper } from "../mappers/datos-principales.mapper";

export class DatosPrincipalesHttpRepository implements DatosPrincipalesRepositoryPort {
  private baseUrl = "/api/v2/society-profile";

  async create(data: CreateDatosPrincipalesDTO): Promise<DatosPrincipalesEntity> {
    // 1. Llamar al backend
    const response = await $fetch<DatosPrincipalesResponseDTO>(this.baseUrl, {
      method: "POST",
      body: data,
    });

    // 2. Mapear DTO → Entidad
    return DatosPrincipalesMapper.toDomain(response);
  }

  async getById(id: string): Promise<DatosPrincipalesEntity | null> {
    const response = await $fetch<DatosPrincipalesResponseDTO>(`${this.baseUrl}/${id}`);
    return DatosPrincipalesMapper.toDomain(response);
  }

  async update(id: string, data: Partial<CreateDatosPrincipalesDTO>): Promise<DatosPrincipalesEntity> {
    const response = await $fetch<DatosPrincipalesResponseDTO>(`${this.baseUrl}/${id}`, {
      method: "PUT",
      body: data,
    });
    return DatosPrincipalesMapper.toDomain(response);
  }

  async delete(id: string): Promise<void> {
    await $fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
  }
}
```

**Características:**
- ✅ Implementa Port (contrato de Domain)
- ✅ Usa Mapper para convertir DTO → Entidad
- ✅ Maneja errores HTTP
- ✅ Fácil de reemplazar (Mock, LocalStorage, etc.)

---

## 4️⃣ Presentation (UI/UX)

### 🎯 Propósito:
Maneja la interacción con el usuario (UI/UX).

### 📂 Estructura:

```
app/core/presentation/[dominio]/
├── stores/                # Pinia stores (Option API OBLIGATORIO)
│   └── sociedad.store.ts
├── composables/           # Controllers (ciclo de vida)
│   └── useSociedadController.ts
├── mappers/               # FormData ↔ DTO/Entidad (opcional)
│   └── sociedad-form.mapper.ts
└── types/                 # Tipos de UI (FormData, etc.)
    └── sociedad-form.types.ts
```

#### **Stores** (Pinia - Option API OBLIGATORIO):

```typescript
// app/core/presentation/registros/sociedades/stores/sociedad.store.ts

import { defineStore } from "pinia";
import { CreateDatosPrincipalesUseCase } from "@hexag/registros/sociedades/pasos/datos-principales/application/use-cases/create-datos-principales.use-case";
import { DatosPrincipalesHttpRepository } from "@hexag/registros/sociedades/pasos/datos-principales/infrastructure/repositories/datos-principales.http.repository";
import type { DatosPrincipalesEntity } from "@hexag/registros/sociedades/pasos/datos-principales/domain/entities/datos-principales.entity";

export const useSociedadStore = defineStore("sociedad", {
  state: () => ({
    datos: null as DatosPrincipalesEntity | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async createSociedad(data: any) {
      this.loading = true;
      this.error = null;

      try {
        // Instanciar caso de uso con repositorio
        const repository = new DatosPrincipalesHttpRepository();
        const useCase = new CreateDatosPrincipalesUseCase(repository);

        // Ejecutar caso de uso
        this.datos = await useCase.execute(data);
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
```

**⚠️ IMPORTANTE:**
- **OBLIGATORIO usar Option API** (NO Composition API)
- **Formato correcto:**
  ```typescript
  export const useStore = defineStore("name", {
    state: () => ({ ... }),
    actions: { ... },
  });
  ```
- **Formato INCORRECTO (NO usar):**
  ```typescript
  // ❌ NO usar Composition API
  export const useStore = defineStore("name", () => {
    const data = ref([]);
    return { data };
  });
  ```

#### **Controllers** (Composables):
Manejan ciclo de vida y coordinan stores.

```typescript
// app/core/presentation/registros/sociedades/composables/useSociedadController.ts

import { onMounted, onActivated } from "vue";
import { useSociedadStore } from "../stores/sociedad.store";

export function useSociedadController() {
  const store = useSociedadStore();

  onMounted(() => {
    store.loadData();
  });

  onActivated(() => {
    store.refreshData();
  });

  return {
    datos: computed(() => store.datos),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    createSociedad: store.createSociedad,
  };
}
```

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Crear Sociedad

```
Usuario (Vue Component)
    ↓ llama
useSociedadController()
    ↓ usa
useSociedadStore()
    ↓ instancia
CreateDatosPrincipalesUseCase(repository)
    ↓ ejecuta
repository.create(data)
    ↓ llama HTTP
Backend (POST /api/v2/society-profile)
    ↓ retorna
DatosPrincipalesResponseDTO
    ↓ mapea
DatosPrincipalesMapper.toDomain(dto)
    ↓ retorna
DatosPrincipalesEntity
    ↓ actualiza
store.datos = entity
    ↓ reactiva
UI se actualiza
```

---

## ✅ Checklist de Implementación

Antes de implementar cualquier feature, verifica:

### Domain:
- [ ] ¿Creé las **Entities** en `domain/entities/`?
- [ ] ¿Creé los **Ports** en `domain/ports/`?
- [ ] ¿Las entidades NO dependen de nada externo?

### Application:
- [ ] ¿Creé los **DTOs** en `application/dtos/`?
- [ ] ¿Los DTOs representan el formato **exacto del backend**?
- [ ] ¿Creé los **Use Cases** en `application/use-cases/`?
- [ ] ¿Los Use Cases usan **Ports** (no implementaciones)?

### Infrastructure:
- [ ] ¿Creé los **Mappers** en `infrastructure/mappers/`?
- [ ] ¿Los mappers convierten **DTO ↔ Entidad**?
- [ ] ¿Creé los **Repositories** en `infrastructure/repositories/`?
- [ ] ¿Los repositories implementan los **Ports**?
- [ ] ¿Creé **tests** en `infrastructure/repositories/__tests__/`?

### Presentation:
- [ ] ¿Creé el **Store** en `presentation/[dominio]/stores/`?
- [ ] ¿El store usa **Option API** (NO Composition API)?
- [ ] ¿Creé el **Controller** en `presentation/[dominio]/composables/`?
- [ ] ¿El controller maneja el **ciclo de vida**?

---

## 📚 Recursos Adicionales

- Ver ejemplo completo: `app/core/hexag/registros/sociedades/pasos/datos-principales/`
- Tests de referencia: `app/core/hexag/registros/sociedades/pasos/datos-principales/infrastructure/repositories/__tests__/`
- Documentación de módulo: `docs/00_meta/modules/sociedades/`

---

**Última actualización:** Diciembre 3, 2025

