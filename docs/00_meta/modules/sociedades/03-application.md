# 📦 Sociedades - Capa Application

> Este documento describe la **capa Application** del módulo de Sociedades: DTOs y Use Cases.

---

## 🎯 ¿Qué es la Capa Application?

La capa Application contiene:
- **DTOs:** Formato de datos para comunicación con backend (request/response)
- **Use Cases:** Orquestación de lógica de negocio

**Responsabilidad:** Coordinar Domain + Infrastructure, NO hacer IO directamente.

---

## 📂 Estructura

```
app/core/hexag/registros/sociedades/pasos/
├── datos-principales/
│   └── application/
│       ├── dtos/
│       │   ├── create-datos-principales.dto.ts
│       │   └── datos-principales-response.dto.ts
│       └── use-cases/
│           ├── create-datos-principales.use-case.ts
│           ├── get-datos-principales.use-case.ts
│           └── update-datos-principales.use-case.ts
├── accionistas/
│   └── application/
│       ├── dtos/
│       └── use-cases/
├── acciones/
│   └── application/
│       ├── dtos/
│       └── use-cases/
└── ... (otros pasos)
```

---

## 1️⃣ DTOs (Data Transfer Objects)

### ¿Qué son los DTOs?

Los DTOs representan el formato **exacto** que el backend espera (request) y devuelve (response).

**Características:**
- ✅ Bidireccional: sirve para request Y response
- ✅ Representa formato backend (snake_case, tipos string para fechas, etc.)
- ✅ NO es la entidad (se mapea después en Infrastructure)

---

### Paso 1: Datos Principales

#### Request DTO:

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/application/dtos/create-datos-principales.dto.ts

export interface CreateDatosPrincipalesDTO {
  razonSocial: string;
  nombreComercial: string;
  objetoSocial: string;
  tipoSociedad: "SA" | "SRL" | "EIRL" | "SAC";
  duracion: number; // años
  capitalSocial: number;
  numeroDocumento?: string;
}
```

#### Response DTO:

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
  numero_documento?: string;
  created_at: string; // ⚠️ String ISO del backend
  updated_at: string;
}
```

---

### Paso 2: Accionistas

#### Request DTO:

```typescript
// app/core/hexag/registros/sociedades/pasos/accionistas/application/dtos/create-accionista.dto.ts

export interface CreateAccionistaDTO {
  tipoPersona: "NATURAL" | "JURIDICA";
  tipoDocumento: string;
  numeroDocumento: string;
  nombres?: string; // Solo persona natural
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  razonSocial?: string; // Solo persona jurídica
  nacionalidad: string;
  domicilio: string;
  correoElectronico?: string;
  telefono?: string;
}
```

#### Response DTO:

```typescript
// app/core/hexag/registros/sociedades/pasos/accionistas/application/dtos/accionista-response.dto.ts

export interface AccionistaResponseDTO {
  id: string;
  society_profile_id: string;
  tipo_persona: string;
  tipo_documento: string;
  numero_documento: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  razon_social?: string;
  nacionalidad: string;
  domicilio: string;
  correo_electronico?: string;
  telefono?: string;
  created_at: string;
  updated_at: string;
}
```

---

### Paso 3: Acciones

```typescript
// app/core/hexag/registros/sociedades/pasos/acciones/application/dtos/create-accion.dto.ts

export interface CreateAccionDTO {
  tipoAccion: "ORDINARIA" | "PREFERENCIAL" | "SIN_DERECHO_VOTO";
  numeroAcciones: number;
  valorNominal: number;
  descripcion?: string;
}
```

---

### Paso 4: Asignación de Acciones

```typescript
// app/core/hexag/registros/sociedades/pasos/asignacion-acciones/application/dtos/create-asignacion.dto.ts

export interface CreateAsignacionDTO {
  accionistaId: string;
  accionId: string;
  numeroAcciones: number;
}

// Para asignar múltiples a la vez
export interface CreateAsignacionBulkDTO {
  asignaciones: CreateAsignacionDTO[];
}
```

---

### Paso 5: Directorio

```typescript
// app/core/hexag/registros/sociedades/pasos/directorio/application/dtos/create-directorio-config.dto.ts

export interface CreateDirectorioConfigDTO {
  tieneDirectorio: boolean;
  cantidadDirectores: number;
  tienePresidente: boolean;
}
```

```typescript
// app/core/hexag/registros/sociedades/pasos/directorio/application/dtos/create-director.dto.ts

export interface CreateDirectorDTO {
  accionistaId: string;
  cargo: "PRESIDENTE" | "DIRECTOR";
}
```

---

### Paso 6: Apoderados

```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/application/dtos/create-clase-apoderado.dto.ts

export interface CreateClaseApoderadoDTO {
  nombre: string;
  descripcion?: string;
  facultades: string[]; // Array de facultades
}
```

```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/application/dtos/create-apoderado.dto.ts

export interface CreateApoderadoDTO {
  claseApoderadoId: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correoElectronico?: string;
  telefono?: string;
}
```

---

### Paso 8: Quorum

```typescript
// app/core/hexag/registros/sociedades/pasos/quorum/application/dtos/update-quorum.dto.ts

export interface UpdateQuorumDTO {
  quorumMinimoSimple: number; // 0-100
  quorumMinimoCalificado: number;
  primeraConvocatoriaSimple: number;
  primeraConvocatoriaCalificada: number;
  segundaConvocatoriaSimple: number;
  segundaConvocatoriaCalificada: number;
}
```

---

## 2️⃣ Use Cases (Casos de Uso)

### ¿Qué son los Use Cases?

Los Use Cases orquestan la lógica de negocio, coordinando Domain + Infrastructure.

**Características:**
- ✅ Usan **Ports** (interfaces de Domain), NO implementaciones directas
- ✅ Contienen validaciones de negocio
- ✅ Fáciles de testear (inyectar mocks)

---

### Paso 1: Crear Datos Principales

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/application/use-cases/create-datos-principales.use-case.ts

import type { DatosPrincipalesRepositoryPort } from "../../domain/ports/datos-principales.repository.port";
import type { DatosPrincipalesEntity } from "../../domain/entities/datos-principales.entity";
import type { CreateDatosPrincipalesDTO } from "../dtos/create-datos-principales.dto";

export class CreateDatosPrincipalesUseCase {
  constructor(
    private repository: DatosPrincipalesRepositoryPort // ⚠️ Usa Port, no implementación
  ) {}

  async execute(data: CreateDatosPrincipalesDTO): Promise<DatosPrincipalesEntity> {
    // Validaciones de negocio (opcional)
    this.validate(data);

    // Delegar a infraestructura
    return await this.repository.create(data);
  }

  private validate(data: CreateDatosPrincipalesDTO): void {
    if (!data.razonSocial || data.razonSocial.trim().length === 0) {
      throw new Error("La razón social es requerida");
    }

    if (data.capitalSocial <= 0) {
      throw new Error("El capital social debe ser mayor a 0");
    }

    if (data.duracion <= 0) {
      throw new Error("La duración debe ser mayor a 0 años");
    }
  }
}
```

---

### Paso 2: Crear Accionista

```typescript
// app/core/hexag/registros/sociedades/pasos/accionistas/application/use-cases/create-accionista.use-case.ts

import type { AccionistasRepositoryPort } from "../../domain/ports/accionistas.repository.port";
import type { AccionistaEntity } from "../../domain/entities/accionista.entity";
import type { CreateAccionistaDTO } from "../dtos/create-accionista.dto";

export class CreateAccionistaUseCase {
  constructor(
    private repository: AccionistasRepositoryPort
  ) {}

  async execute(societyId: string, data: CreateAccionistaDTO): Promise<AccionistaEntity> {
    this.validate(data);

    return await this.repository.create(societyId, data);
  }

  private validate(data: CreateAccionistaDTO): void {
    // Validar según tipo de persona
    if (data.tipoPersona === "NATURAL") {
      if (!data.nombres || !data.apellidoPaterno) {
        throw new Error("Nombres y apellido paterno son requeridos para persona natural");
      }
    } else if (data.tipoPersona === "JURIDICA") {
      if (!data.razonSocial) {
        throw new Error("Razón social es requerida para persona jurídica");
      }
    }

    if (!data.numeroDocumento) {
      throw new Error("Número de documento es requerido");
    }
  }
}
```

---

### Paso 5: Configurar Directorio

```typescript
// app/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/update-directorio-config.use-case.ts

import type { DirectorioRepositoryPort } from "../../domain/ports/directorio.repository.port";
import type { DirectorioConfigEntity } from "../../domain/entities/directorio-config.entity";
import type { CreateDirectorioConfigDTO } from "../dtos/create-directorio-config.dto";

export class UpdateDirectorioConfigUseCase {
  constructor(
    private repository: DirectorioRepositoryPort
  ) {}

  async execute(societyId: string, data: CreateDirectorioConfigDTO): Promise<DirectorioConfigEntity> {
    this.validate(data);

    return await this.repository.updateConfig(societyId, data);
  }

  private validate(data: CreateDirectorioConfigDTO): void {
    if (data.tieneDirectorio && data.cantidadDirectores <= 0) {
      throw new Error("Debe haber al menos 1 director si tiene directorio");
    }

    if (data.cantidadDirectores > 0 && !data.tieneDirectorio) {
      throw new Error("Si hay directores, debe activar 'tieneDirectorio'");
    }

    if (data.tienePresidente && data.cantidadDirectores < 1) {
      throw new Error("Debe haber al menos 1 director para tener presidente");
    }
  }
}
```

---

### Paso 6: Crear Apoderado

```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-apoderado.use-case.ts

import type { ApoderadosRepositoryPort } from "../../domain/ports/apoderados.repository.port";
import type { ApoderadoEntity } from "../../domain/entities/apoderado.entity";
import type { CreateApoderadoDTO } from "../dtos/create-apoderado.dto";

export class CreateApoderadoUseCase {
  constructor(
    private repository: ApoderadosRepositoryPort
  ) {}

  async execute(societyId: string, data: CreateApoderadoDTO): Promise<ApoderadoEntity> {
    this.validate(data);

    return await this.repository.create(societyId, data);
  }

  private validate(data: CreateApoderadoDTO): void {
    if (!data.nombres || !data.apellidoPaterno) {
      throw new Error("Nombres y apellido paterno son requeridos");
    }

    if (!data.numeroDocumento) {
      throw new Error("Número de documento es requerido");
    }

    if (!data.claseApoderadoId) {
      throw new Error("Debe seleccionar una clase de apoderado");
    }
  }
}
```

---

### Paso 8: Actualizar Quorum

```typescript
// app/core/hexag/registros/sociedades/pasos/quorum/application/use-cases/update-quorum.use-case.ts

import type { QuorumRepositoryPort } from "../../domain/ports/quorum.repository.port";
import type { QuorumEntity } from "../../domain/entities/quorum.entity";
import type { UpdateQuorumDTO } from "../dtos/update-quorum.dto";

export class UpdateQuorumUseCase {
  constructor(
    private repository: QuorumRepositoryPort
  ) {}

  async execute(societyId: string, data: UpdateQuorumDTO): Promise<QuorumEntity> {
    this.validate(data);

    return await this.repository.update(societyId, data);
  }

  private validate(data: UpdateQuorumDTO): void {
    // Validar rangos (0-100)
    const fields = [
      data.quorumMinimoSimple,
      data.quorumMinimoCalificado,
      data.primeraConvocatoriaSimple,
      data.primeraConvocatoriaCalificada,
      data.segundaConvocatoriaSimple,
      data.segundaConvocatoriaCalificada,
    ];

    for (const field of fields) {
      if (field < 0 || field > 100) {
        throw new Error("Los porcentajes deben estar entre 0 y 100");
      }
    }

    // Validar coherencia
    if (data.segundaConvocatoriaSimple < data.primeraConvocatoriaSimple) {
      throw new Error("Segunda convocatoria simple debe ser >= primera");
    }

    if (data.segundaConvocatoriaCalificada < data.primeraConvocatoriaCalificada) {
      throw new Error("Segunda convocatoria calificada debe ser >= primera");
    }
  }
}
```

---

## 🎯 Principios de Application

### ✅ Hacer:

1. **DTOs representan backend exacto:**
   ```typescript
   export interface ResponseDTO {
     razon_social: string; // ✅ Snake case del backend
     created_at: string; // ✅ String ISO del backend
   }
   ```

2. **Use Cases usan Ports:**
   ```typescript
   export class CreateUseCase {
     constructor(
       private repository: RepositoryPort // ✅ Port, no implementación
     ) {}
   }
   ```

3. **Validaciones de negocio:**
   ```typescript
   private validate(data: DTO): void {
     if (data.campo <= 0) {
       throw new Error("Campo debe ser > 0");
     }
   }
   ```

---

### ❌ Evitar:

1. **NO hacer HTTP directamente:**
   ```typescript
   // ❌ MAL
   async execute() {
     const response = await $fetch('/api/...');
   }
   ```

2. **NO depender de Infrastructure:**
   ```typescript
   // ❌ MAL
   import { HttpRepository } from "../../infrastructure/...";

   // ✅ BIEN
   import type { RepositoryPort } from "../../domain/ports/...";
   ```

---

## 📚 Recursos Adicionales

- [02-domain.md](./02-domain.md) - Capa Domain (Entities, Ports)
- [04-infrastructure.md](./04-infrastructure.md) - Implementaciones de Use Cases
- [../../../architecture/02-hexagonal-ddd-profundo.md](../../../architecture/02-hexagonal-ddd-profundo.md) - Arquitectura completa

---

**Última actualización:** Diciembre 3, 2025



