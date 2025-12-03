# 🏛️ Sociedades - Capa Domain

> Este documento describe la **capa Domain** del módulo de Sociedades, donde vive la lógica de negocio pura.

---

## 🎯 ¿Qué es la Capa Domain?

La capa Domain contiene:
- **Entities:** Modelos de negocio puros (sin dependencias externas)
- **Ports:** Contratos (interfaces) que define el dominio

**Característica clave:** NO depende de nada (HTTP, Vue, Pinia, etc.)

---

## 📂 Estructura

```
app/core/hexag/registros/sociedades/pasos/
├── datos-principales/
│   └── domain/
│       ├── entities/
│       │   └── datos-principales.entity.ts
│       └── ports/
│           └── datos-principales.repository.port.ts
├── accionistas/
│   └── domain/
│       ├── entities/
│       │   └── accionista.entity.ts
│       └── ports/
│           └── accionistas.repository.port.ts
├── acciones/
│   └── domain/
│       ├── entities/
│       │   └── accion.entity.ts
│       └── ports/
│           └── acciones.repository.port.ts
├── asignacion-acciones/
│   └── domain/
│       ├── entities/
│       │   └── asignacion.entity.ts
│       └── ports/
│           └── asignacion.repository.port.ts
├── directorio/
│   └── domain/
│       ├── entities/
│       │   ├── directorio-config.entity.ts
│       │   └── director.entity.ts
│       └── ports/
│           └── directorio.repository.port.ts
├── apoderados/
│   └── domain/
│       ├── entities/
│       │   ├── clase-apoderado.entity.ts
│       │   └── apoderado.entity.ts
│       └── ports/
│           ├── clases-apoderados.repository.port.ts
│           └── apoderados.repository.port.ts
└── quorum/
    └── domain/
        ├── entities/
        │   └── quorum.entity.ts
        └── ports/
            └── quorum.repository.port.ts
```

---

## 1️⃣ Entities (Entidades)

### Paso 1: Datos Principales

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/domain/entities/datos-principales.entity.ts

export interface DatosPrincipalesEntity {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  objetoSocial: string;
  tipoSociedad: "SA" | "SRL" | "EIRL" | "SAC";
  duracion: number; // años
  capitalSocial: number;
  numeroDocumento?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Paso 2: Accionistas

```typescript
// app/core/hexag/registros/sociedades/pasos/accionistas/domain/entities/accionista.entity.ts

export interface AccionistaEntity {
  id: string;
  societyProfileId: string;
  tipoPersona: "NATURAL" | "JURIDICA";
  tipoDocumento: string;
  numeroDocumento: string;
  nombres?: string; // Solo para persona natural
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  razonSocial?: string; // Solo para persona jurídica
  nacionalidad: string;
  domicilio: string;
  correoElectronico?: string;
  telefono?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Con lógica de negocio:**

```typescript
export class AccionistaEntity {
  constructor(
    public id: string,
    public tipoPersona: "NATURAL" | "JURIDICA",
    public numeroDocumento: string,
    public nombres?: string,
    public razonSocial?: string
  ) {}

  // Lógica de negocio
  getNombreCompleto(): string {
    if (this.tipoPersona === "NATURAL") {
      return `${this.nombres}`;
    }
    return this.razonSocial || "";
  }

  esPersonaNatural(): boolean {
    return this.tipoPersona === "NATURAL";
  }

  esPersonaJuridica(): boolean {
    return this.tipoPersona === "JURIDICA";
  }
}
```

---

### Paso 3: Acciones

```typescript
// app/core/hexag/registros/sociedades/pasos/acciones/domain/entities/accion.entity.ts

export interface AccionEntity {
  id: string;
  societyProfileId: string;
  tipoAccion: "ORDINARIA" | "PREFERENCIAL" | "SIN_DERECHO_VOTO";
  numeroAcciones: number;
  valorNominal: number;
  valorTotal: number; // numeroAcciones * valorNominal
  descripcion?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Con lógica de negocio:**

```typescript
export class AccionEntity {
  constructor(
    public id: string,
    public tipoAccion: string,
    public numeroAcciones: number,
    public valorNominal: number
  ) {}

  calcularValorTotal(): number {
    return this.numeroAcciones * this.valorNominal;
  }

  esAccionOrdinaria(): boolean {
    return this.tipoAccion === "ORDINARIA";
  }
}
```

---

### Paso 4: Asignación de Acciones

```typescript
// app/core/hexag/registros/sociedades/pasos/asignacion-acciones/domain/entities/asignacion.entity.ts

export interface AsignacionAccionEntity {
  id: string;
  societyProfileId: string;
  accionistaId: string;
  accionId: string;
  numeroAcciones: number;
  porcentajeParticipacion: number;
  valorTotal: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Paso 5: Directorio

#### Configuración del Directorio:

```typescript
// app/core/hexag/registros/sociedades/pasos/directorio/domain/entities/directorio-config.entity.ts

export interface DirectorioConfigEntity {
  id: string;
  societyProfileId: string;
  tieneDirectorio: boolean;
  cantidadDirectores: number;
  tienePresidente: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Director:

```typescript
// app/core/hexag/registros/sociedades/pasos/directorio/domain/entities/director.entity.ts

export interface DirectorEntity {
  id: string;
  societyProfileId: string;
  accionistaId: string; // Referencia al accionista
  cargo: "PRESIDENTE" | "DIRECTOR";
  esPresidente: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Datos del accionista (joins)
  accionista?: {
    nombres?: string;
    razonSocial?: string;
    numeroDocumento: string;
  };
}
```

---

### Paso 6: Apoderados

#### Clase de Apoderado:

```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/domain/entities/clase-apoderado.entity.ts

export interface ClaseApoderadoEntity {
  id: string;
  societyProfileId: string;
  nombre: string;
  descripcion?: string;
  facultades: string[]; // Array de facultades
  createdAt: Date;
  updatedAt: Date;
}
```

#### Apoderado:

```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/domain/entities/apoderado.entity.ts

export interface ApoderadoEntity {
  id: string;
  societyProfileId: string;
  claseApoderadoId: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correoElectronico?: string;
  telefono?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Join con clase
  claseApoderado?: ClaseApoderadoEntity;
}
```

---

### Paso 8: Quorum

```typescript
// app/core/hexag/registros/sociedades/pasos/quorum/domain/entities/quorum.entity.ts

export interface QuorumEntity {
  id: string;
  societyProfileId: string;
  quorumMinimoSimple: number; // Porcentaje (0-100)
  quorumMinimoCalificado: number;
  primeraConvocatoriaSimple: number;
  primeraConvocatoriaCalificada: number;
  segundaConvocatoriaSimple: number;
  segundaConvocatoriaCalificada: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Con validaciones de negocio:**

```typescript
export class QuorumEntity {
  constructor(
    public quorumMinimoSimple: number,
    public quorumMinimoCalificado: number,
    public primeraConvocatoriaSimple: number,
    public primeraConvocatoriaCalificada: number,
    public segundaConvocatoriaSimple: number,
    public segundaConvocatoriaCalificada: number
  ) {
    this.validate();
  }

  private validate(): void {
    // Validar rangos (0-100)
    const fields = [
      this.quorumMinimoSimple,
      this.quorumMinimoCalificado,
      this.primeraConvocatoriaSimple,
      this.primeraConvocatoriaCalificada,
      this.segundaConvocatoriaSimple,
      this.segundaConvocatoriaCalificada,
    ];

    for (const field of fields) {
      if (field < 0 || field > 100) {
        throw new Error("Los porcentajes deben estar entre 0 y 100");
      }
    }

    // Validar coherencia: segunda convocatoria >= primera
    if (this.segundaConvocatoriaSimple < this.primeraConvocatoriaSimple) {
      throw new Error("Segunda convocatoria simple debe ser >= primera");
    }

    if (this.segundaConvocatoriaCalificada < this.primeraConvocatoriaCalificada) {
      throw new Error("Segunda convocatoria calificada debe ser >= primera");
    }
  }

  esQuorumValido(porcentajeAsistencia: number, esSimple: boolean): boolean {
    const minimoRequerido = esSimple ? this.quorumMinimoSimple : this.quorumMinimoCalificado;
    return porcentajeAsistencia >= minimoRequerido;
  }
}
```

---

## 2️⃣ Ports (Contratos)

### Paso 1: Datos Principales

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

---

### Paso 2: Accionistas

```typescript
// app/core/hexag/registros/sociedades/pasos/accionistas/domain/ports/accionistas.repository.port.ts

import type { AccionistaEntity } from "../entities/accionista.entity";
import type { CreateAccionistaDTO } from "../../application/dtos/create-accionista.dto";

export interface AccionistasRepositoryPort {
  create(societyId: string, data: CreateAccionistaDTO): Promise<AccionistaEntity>;
  getBySocietyId(societyId: string): Promise<AccionistaEntity[]>;
  update(id: string, data: Partial<CreateAccionistaDTO>): Promise<AccionistaEntity>;
  delete(id: string): Promise<void>;
}
```

---

### Paso 5: Directorio

```typescript
// app/core/hexag/registros/sociedades/pasos/directorio/domain/ports/directorio.repository.port.ts

import type { DirectorioConfigEntity, DirectorEntity } from "../entities/...";
import type { CreateDirectorioConfigDTO, CreateDirectorDTO } from "../../application/dtos/...";

export interface DirectorioRepositoryPort {
  // Configuración
  getConfig(societyId: string): Promise<DirectorioConfigEntity>;
  updateConfig(societyId: string, data: CreateDirectorioConfigDTO): Promise<DirectorioConfigEntity>;

  // Directores
  createDirector(societyId: string, data: CreateDirectorDTO): Promise<DirectorEntity>;
  getDirectores(societyId: string): Promise<DirectorEntity[]>;
  updateDirector(id: string, data: Partial<CreateDirectorDTO>): Promise<DirectorEntity>;
  deleteDirector(id: string): Promise<void>;
  setPresidente(directorId: string): Promise<void>;
}
```

---

### Paso 6: Apoderados

```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/domain/ports/clases-apoderados.repository.port.ts

import type { ClaseApoderadoEntity } from "../entities/clase-apoderado.entity";
import type { CreateClaseApoderadoDTO } from "../../application/dtos/create-clase-apoderado.dto";

export interface ClasesApoderadosRepositoryPort {
  create(societyId: string, data: CreateClaseApoderadoDTO): Promise<ClaseApoderadoEntity>;
  getBySocietyId(societyId: string): Promise<ClaseApoderadoEntity[]>;
  update(id: string, data: Partial<CreateClaseApoderadoDTO>): Promise<ClaseApoderadoEntity>;
  delete(id: string): Promise<void>;
}
```

```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/domain/ports/apoderados.repository.port.ts

import type { ApoderadoEntity } from "../entities/apoderado.entity";
import type { CreateApoderadoDTO } from "../../application/dtos/create-apoderado.dto";

export interface ApoderadosRepositoryPort {
  create(societyId: string, data: CreateApoderadoDTO): Promise<ApoderadoEntity>;
  getBySocietyId(societyId: string): Promise<ApoderadoEntity[]>;
  update(id: string, data: Partial<CreateApoderadoDTO>): Promise<ApoderadoEntity>;
  delete(id: string): Promise<void>;
}
```

---

## 🎯 Principios de Domain

### ✅ Hacer:

1. **Solo lógica de negocio:**
   ```typescript
   class AccionEntity {
     calcularValorTotal(): number {
       return this.numeroAcciones * this.valorNominal;
     }
   }
   ```

2. **Validaciones de negocio:**
   ```typescript
   class QuorumEntity {
     validate(): void {
       if (this.porcentaje < 0 || this.porcentaje > 100) {
         throw new Error("Porcentaje inválido");
       }
     }
   }
   ```

3. **Sin dependencias externas:**
   ```typescript
   // ✅ BIEN
   export interface AccionistaEntity { ... }

   // ❌ MAL
   import { $fetch } from "ofetch"; // NO depender de HTTP
   ```

---

### ❌ Evitar:

1. **HTTP, Vue, Pinia:**
   ```typescript
   // ❌ NO hacer esto en Domain
   import { $fetch } from "ofetch";
   import { ref } from "vue";
   ```

2. **Lógica de presentación:**
   ```typescript
   // ❌ NO hacer esto en Domain
   formatForUI(): string { ... }
   ```

---

## 📚 Recursos Adicionales

- [03-application.md](./03-application.md) - Capa Application (DTOs, Use Cases)
- [04-infrastructure.md](./04-infrastructure.md) - Implementaciones de Ports
- [../../../architecture/02-hexagonal-ddd-profundo.md](../../../architecture/02-hexagonal-ddd-profundo.md) - Arquitectura completa

---

**Última actualización:** Diciembre 3, 2025

