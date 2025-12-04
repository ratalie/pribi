# 🔧 Sociedades - Capa Infrastructure

> Este documento describe la **capa Infrastructure** del módulo de Sociedades: Mappers y Repositories.

---

## 🎯 ¿Qué es la Capa Infrastructure?

La capa Infrastructure contiene:
- **Mappers:** Conversión DTO ↔ Entidad
- **Repositories:** Implementaciones HTTP que acceden al backend

**Responsabilidad:** Implementar los Ports definidos en Domain.

---

## 📂 Estructura

```
app/core/hexag/registros/sociedades/pasos/
└── datos-principales/
    └── infrastructure/
        ├── mappers/
        │   └── datos-principales.mapper.ts
        └── repositories/
            ├── datos-principales.http.repository.ts
            └── __tests__/
                └── datos-principales.test.ts
```

---

## 1️⃣ Mappers (DTO ↔ Entidad)

### Propósito:
Convertir entre DTOs (backend) y Entidades (dominio).

### Ejemplo: Datos Principales

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/infrastructure/mappers/datos-principales.mapper.ts

import type { DatosPrincipalesResponseDTO } from "../../application/dtos/datos-principales-response.dto";
import type { DatosPrincipalesEntity } from "../../domain/entities/datos-principales.entity";

export class DatosPrincipalesMapper {
  // DTO (backend) → Entidad (dominio)
  static toDomain(dto: DatosPrincipalesResponseDTO): DatosPrincipalesEntity {
    return {
      id: dto.id,
      razonSocial: dto.razon_social, // Snake case → Camel case
      nombreComercial: dto.nombre_comercial,
      objetoSocial: dto.objeto_social,
      tipoSociedad: dto.tipo_sociedad as "SA" | "SRL" | "EIRL" | "SAC",
      duracion: dto.duracion,
      capitalSocial: dto.capital_social,
      numeroDocumento: dto.numero_documento,
      createdAt: new Date(dto.created_at), // String → Date
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
      numero_documento: entity.numeroDocumento,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}
```

**Responsabilidades:**
- ✅ Snake case ↔ Camel case
- ✅ String (ISO) ↔ Date
- ✅ Transformaciones de formato
- ✅ Bidireccional (toDomain + toDTO)

---

## 2️⃣ Repositories (Implementaciones HTTP)

### Propósito:
Implementar los Ports definidos en Domain, accediendo al backend vía HTTP.

### Ejemplo: Datos Principales

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
    try {
      const response = await $fetch<DatosPrincipalesResponseDTO>(`${this.baseUrl}/${id}`);
      return DatosPrincipalesMapper.toDomain(response);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
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

**Responsabilidades:**
- ✅ Implementa Port (interface de Domain)
- ✅ Hace llamadas HTTP al backend
- ✅ Usa Mapper para convertir DTO → Entidad
- ✅ Maneja errores HTTP

---

## 3️⃣ Tests Unitarios

### Ubicación: `infrastructure/repositories/__tests__/`

### Ejemplo:

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/infrastructure/repositories/__tests__/datos-principales.test.ts

import { describe, it, expect } from "vitest";
import { DatosPrincipalesHttpRepository } from "../datos-principales.http.repository";

describe("DatosPrincipalesHttpRepository", () => {
  const repository = new DatosPrincipalesHttpRepository();

  it("debe crear datos principales", async () => {
    const result = await repository.create({
      razonSocial: "Test SA",
      nombreComercial: "Test",
      objetoSocial: "Comercio",
      tipoSociedad: "SA",
      duracion: 50,
      capitalSocial: 10000,
    });

    expect(result.id).toBeDefined();
    expect(result.razonSocial).toBe("Test SA");
    expect(result.capitalSocial).toBe(10000);
    expect(result.createdAt).toBeInstanceOf(Date); // ✅ Mapeado a Date
  });

  it("debe obtener sociedad por ID", async () => {
    // Primero crear
    const created = await repository.create({
      razonSocial: "Test SA",
      tipoSociedad: "SA",
      capitalSocial: 10000,
    });

    // Luego obtener
    const result = await repository.getById(created.id);

    expect(result).toBeDefined();
    expect(result?.razonSocial).toBe("Test SA");
  });

  it("debe retornar null si no existe", async () => {
    const result = await repository.getById("id-inexistente");
    expect(result).toBeNull();
  });
});
```

---

## 📊 Repositorios por Paso

| Paso | Repository | Métodos |
|------|-----------|---------|
| 1. Datos Principales | `DatosPrincipalesHttpRepository` | create, getById, update, delete |
| 2. Accionistas | `AccionistasHttpRepository` | create, getBySocietyId, update, delete |
| 3. Acciones | `AccionesHttpRepository` | create, getBySocietyId, update, delete |
| 4. Asignación | `AsignacionAccionesHttpRepository` | createBulk, getBySocietyId |
| 5. Directorio | `DirectorioHttpRepository` | getConfig, updateConfig, createDirector, getDirectores, updateDirector, deleteDirector, setPresidente |
| 6. Apoderados | `ClasesApoderadosHttpRepository` + `ApoderadosHttpRepository` | create, getBySocietyId, update, delete (ambos) |
| 8. Quorum | `QuorumHttpRepository` | getById, update |

---

## 🎯 Principios de Infrastructure

### ✅ Hacer:

1. **Implementar Ports:**
   ```typescript
   export class Repository implements RepositoryPort {
     // Implementa todos los métodos del Port
   }
   ```

2. **Usar Mappers:**
   ```typescript
   const response = await $fetch(url);
   return Mapper.toDomain(response); // ✅ Siempre mapear
   ```

3. **Manejo de errores:**
   ```typescript
   try {
     const response = await $fetch(url);
     return Mapper.toDomain(response);
   } catch (error: any) {
     if (error.statusCode === 404) {
       return null;
     }
     throw error;
   }
   ```

---

### ❌ Evitar:

1. **NO retornar DTOs directamente:**
   ```typescript
   // ❌ MAL
   async create(data: DTO): Promise<ResponseDTO> {
     return await $fetch(url, { body: data });
   }

   // ✅ BIEN
   async create(data: DTO): Promise<Entity> {
     const response = await $fetch<ResponseDTO>(url, { body: data });
     return Mapper.toDomain(response);
   }
   ```

2. **NO olvidar tests:**
   Cada repository DEBE tener tests en `__tests__/`.

---

## 📚 Recursos Adicionales

- [02-domain.md](./02-domain.md) - Ports que implementa Infrastructure
- [03-application.md](./03-application.md) - DTOs usados en Mappers
- [06-testing-unitario.md](./06-testing-unitario.md) - Cómo testear repositories

---

**Última actualización:** Diciembre 3, 2025


