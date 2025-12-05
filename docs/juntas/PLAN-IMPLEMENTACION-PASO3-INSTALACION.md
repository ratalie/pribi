# 🚀 PLAN DE IMPLEMENTACIÓN: Paso 3 - Instalación de la Junta

**Fecha**: 2 de Diciembre 2025  
**Estado Paso 2**: ✅ 100% Completo y Funcional  
**Estado Paso 3**: 🎯 Listo para Implementar  
**Tiempo estimado**: 4-5 semanas

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen)
2. [Lo que vamos a construir](#objetivo)
3. [Arquitectura Completa](#arquitectura)
4. [Plan de Implementación Fase por Fase](#fases)
5. [Cronograma Detallado](#cronograma)
6. [Preguntas Pendientes](#preguntas)
7. [Checklist de Completitud](#checklist)

---

## 📊 <a id="resumen"></a>RESUMEN EJECUTIVO

### ¿Qué es el Paso 3?

**Fusión de 3 pasos de V2.5 en UNO SOLO**:

- ✅ Paso 3 V2.5: Poderes de Representación
- ✅ Paso 4 V2.5: Asistencia de Accionistas
- ✅ Paso 5 V2.5: Presidente y Secretario

→ **Paso 3 V3: Instalación de la Junta** (TODO en una vista)

### Lo que el usuario podrá hacer:

1. **Ver en qué convocatoria se instaló** (solo Junta General)
2. **Agregar representantes** para accionistas que lo requieren
3. **Marcar asistencia** de accionistas/representantes
4. **Ver quórum en tiempo real** (barra de progreso + métricas)
5. **Elegir presidente y secretario** (con/sin directorio)
6. **Guardar y continuar** al siguiente paso

---

## 🎯 <a id="objetivo"></a>LO QUE VAMOS A CONSTRUIR

### Diseño Visual

```
┌─────────────────────────────────────────────────────────────┐
│              INSTALACIÓN DE LA JUNTA                         │
└─────────────────────────────────────────────────────────────┘

━━━ 1. DETALLES DE LA CELEBRACIÓN ━━━━━━━━━━━━━━━━━━━━━━━━━━

[Si JUNTA_GENERAL]
  Dropdown: "¿En qué convocatoria se instaló?"
  → Primera Convocatoria / Segunda Convocatoria

  [Muestra datos de la convocatoria seleccionada (readonly)]
  - Dirección: ...
  - Fecha: ...
  - Hora: ...
  - Modo: PRESENCIAL / VIRTUAL

[Si JUNTA_UNIVERSAL]
  [Solo muestra datos de la junta (readonly)]

━━━ 2. ASISTENCIA Y REPRESENTACIÓN ━━━━━━━━━━━━━━━━━━━━━━━━━

  Tabla unificada con:

  Nombre | Tipo | Acciones | % | Representado por | Asistió
  ────────────────────────────────────────────────────────────
  Ana    | NAT  | 100      |20%| -                | [✓]
  Invers.| JUR  | 200      |40%| + Agregar        | [ ]
  Sucur. | SUC  | 50       |10%| José Matos       | [✓]

━━━ 3. ACCIONES PRESENTES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Acciones presentes                                    60.00%

  [████████████████████░░░░░░░░░░] 300/500

  ✅ Quórum alcanzado (Mínimo: 50%)

  Cards con métricas:
  - Quórum: CALIFICADO
  - Mínimo para instalar: 66.6%
  - Total acciones: 500
  - Acciones presentes: 300

━━━ 4. PRESIDENTE Y SECRETARIO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [Si tiene Directorio]
    Presidente: ¿Asistió? [NO] [SI]
    → Si NO: Dropdown para elegir reemplazo

    Secretario: ¿Asistió? [NO] [SI]
    → Si NO: Dropdown para elegir reemplazo

  [Si NO tiene Directorio]
    Presidente: [Dropdown: Seleccionar...]
    Secretario: [Dropdown: Seleccionar...]

                              [← Atrás] [Siguiente →]
```

---

## 🏗️ <a id="arquitectura"></a>ARQUITECTURA COMPLETA

### Estructura de Archivos (siguiendo patrón del Paso 2)

```
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   ├── instalacion-junta.entity.ts
│   │   ├── asistente.entity.ts
│   │   ├── representante.entity.ts
│   │   ├── autoridad.entity.ts
│   │   └── quorum-calculado.entity.ts
│   ├── enums/
│   │   ├── tipo-persona.enum.ts
│   │   └── tipo-quorum.enum.ts
│   ├── ports/
│   │   └── instalacion-junta.repository.ts (interface)
│   └── services/
│       └── quorum-calculator.service.ts
│
├── application/
│   ├── dtos/
│   │   └── instalacion-junta.dto.ts
│   └── use-cases/
│       ├── get-instalacion-junta.use-case.ts
│       └── update-instalacion-junta.use-case.ts
│
├── infrastructure/
│   ├── mappers/
│   │   └── instalacion-junta.mapper.ts
│   ├── repositories/
│   │   ├── instalacion-junta.http.repository.ts
│   │   ├── instalacion-junta.msw.repository.ts
│   │   └── __tests__/
│   │       └── instalacion-junta.repository.shared.test.ts
│   └── mocks/
│       ├── data/
│       │   ├── instalacion-junta.state.ts
│       │   └── directorio.state.ts
│       └── handlers/
│           └── instalacion-junta.handlers.ts
│
└── presentation/
    └── stores/
        └── instalacion-junta.store.ts

app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/
└── instalacion/
    └── index.vue

app/components/juntas/instalacion/
├── DetallesCelebracionSection.vue
├── AsistenciaRepresentacionSection.vue
├── ModalRepresentante.vue
├── QuorumMetricsSection.vue
└── AutoridadesSection.vue
```

---

## 📦 <a id="fases"></a>PLAN DE IMPLEMENTACIÓN FASE POR FASE

### FASE 1: Domain Layer (Días 1-3)

#### Día 1: Entidades Principales

**Archivos a crear**:

1. **`instalacion-junta.entity.ts`**

```typescript
export interface InstalacionJunta {
  convocatoriaInstalada?: OrdenConvocatoria; // Solo JUNTA_GENERAL
  asistentes: Asistente[];
  presidente: Autoridad;
  secretario: Autoridad;
  quorum: QuorumCalculado;
}
```

2. **`asistente.entity.ts`**

```typescript
export interface Asistente {
  accionistaId: number;
  nombre: string;
  tipoPersona: TipoPersona;
  tipoDocumento: string;
  numeroDocumento: string;
  acciones: number;
  porcentajeParticipacion: number;
  representante?: Representante;
  asistio: boolean;
}
```

3. **`representante.entity.ts`**

```typescript
export interface Representante {
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisEmisorPasaporte?: string;
}
```

4. **`autoridad.entity.ts`**

```typescript
export interface Autoridad {
  id?: number; // Si es del directorio
  nombre?: string; // Si es del directorio
  asistio: boolean; // Toggle "¿Asistió?"
  esDelDirectorio: boolean; // Si proviene del directorio
  reemplazo?: {
    // Si NO asistió
    accionistaId?: number;
    representanteDocumento?: string;
    nombreCompleto: string;
  };
}
```

5. **`quorum-calculado.entity.ts`**

```typescript
export interface QuorumCalculado {
  tipoQuorum: TipoQuorum;
  porcentajeMinimoRequerido: number;
  totalAcciones: number;
  accionesPresentes: number;
  porcentajePresente: number;
  cumpleQuorum: boolean;
}
```

#### Día 2: Enums y Servicios

**Archivos a crear**:

1. **`tipo-persona.enum.ts`**

```typescript
export enum TipoPersona {
  NATURAL = "NATURAL",
  JURIDICA = "JURIDICA",
  SUCURSAL = "SUCURSAL",
  SUCESION_INDIVISA = "SUCESION_INDIVISA",
  FIDEICOMISO = "FIDEICOMISO",
}
```

2. **`tipo-quorum.enum.ts`**

```typescript
export enum TipoQuorum {
  CALIFICADO = "CALIFICADO", // 66.67% (2/3)
  SIMPLE = "SIMPLE", // 50% + 1
  ABSOLUTO = "ABSOLUTO", // 100%
}
```

3. **`quorum-calculator.service.ts`**

```typescript
export class QuorumCalculator {
  calculate(asistentes: Asistente[]): QuorumCalculado {
    const totalAcciones = asistentes.reduce((sum, a) => sum + a.acciones, 0);
    const accionesPresentes = asistentes
      .filter((a) => a.asistio)
      .reduce((sum, a) => sum + a.acciones, 0);

    const porcentajePresente =
      totalAcciones > 0 ? (accionesPresentes / totalAcciones) * 100 : 0;

    // TODO: Obtener tipo de quórum de configuración de sociedad
    const tipoQuorum = TipoQuorum.CALIFICADO;
    const porcentajeMinimoRequerido = this.getMinimoPorTipo(tipoQuorum);

    return {
      tipoQuorum,
      porcentajeMinimoRequerido,
      totalAcciones,
      accionesPresentes,
      porcentajePresente,
      cumpleQuorum: porcentajePresente >= porcentajeMinimoRequerido,
    };
  }

  private getMinimoPorTipo(tipo: TipoQuorum): number {
    switch (tipo) {
      case TipoQuorum.CALIFICADO:
        return 66.67;
      case TipoQuorum.SIMPLE:
        return 50.01;
      case TipoQuorum.ABSOLUTO:
        return 100;
      default:
        return 50.01;
    }
  }
}
```

#### Día 3: Ports (Interfaces)

**Archivo a crear**:

**`instalacion-junta.repository.ts`** (interface)

```typescript
export interface InstalacionJuntaRepository {
  get(societyId: number, flowId: number): Promise<InstalacionJunta | null>;
  update(societyId: number, flowId: number, data: InstalacionJunta): Promise<InstalacionJunta>;
}
```

---

### FASE 2: Application Layer (Días 4-6)

#### Día 4: DTOs

**Archivo a crear**:

**`instalacion-junta.dto.ts`**

```typescript
// DTO para enviar al backend (Request)
export interface InstalacionJuntaRequestDto {
  instaladaEnConvocatoria?: "PRIMERA" | "SEGUNDA";

  asistentes: {
    accionistDetailsId: number;
    presentMeetingInstall: boolean;
    representBy?: {
      documentTypeId: number; // 1=DNI, 2=Pasaporte, 3=Carné
      documentNumber: string;
      firstName: string;
      lastNamePaternal: string;
      lastNameMaternal: string;
      passportCountryIssuer?: string;
    };
  }[];

  presidenteId?: number;
  presidenteAsistio: boolean;
  nombreOtroPresidente?: string;
  accionistaPresidenteId?: number;
  representantePresidenteDoc?: string;

  secretarioId?: number;
  secretarioAsistio: boolean;
  nombreOtroSecretario?: string;
  accionistaSecretarioId?: number;
  representanteSecretarioDoc?: string;
}

// DTO de respuesta del backend (Response)
export interface InstalacionJuntaResponseDto {
  success: boolean;
  message: string;
  data: {
    meetingInstallationId: string;
    instaladaEnConvocatoria?: "PRIMERA" | "SEGUNDA";
    asistentes: {
      id: number;
      accionistDetailsId: number;
      presentMeetingInstall: boolean;
      representBy?: {
        documentTypeId: number;
        documentNumber: string;
        firstName: string;
        lastNamePaternal: string;
        lastNameMaternal: string;
        passportCountryIssuer?: string;
      };
    }[];
    presidenteId?: number;
    presidenteAsistio: boolean;
    nombreOtroPresidente?: string;
    secretarioId?: number;
    secretarioAsistio: boolean;
    nombreOtroSecretario?: string;
  };
}
```

#### Día 5-6: Use Cases

**Archivos a crear**:

1. **`get-instalacion-junta.use-case.ts`**

```typescript
export class GetInstalacionJuntaUseCase {
  constructor(private readonly repository: InstalacionJuntaRepository) {}

  async execute(societyId: number, flowId: number): Promise<InstalacionJunta | null> {
    return await this.repository.get(societyId, flowId);
  }
}
```

2. **`update-instalacion-junta.use-case.ts`**

```typescript
export class UpdateInstalacionJuntaUseCase {
  constructor(
    private readonly repository: InstalacionJuntaRepository,
    private readonly quorumCalculator: QuorumCalculator
  ) {}

  async execute(
    societyId: number,
    flowId: number,
    instalacion: InstalacionJunta
  ): Promise<InstalacionJunta> {
    // 1. Validar representantes obligatorios
    this.validarRepresentantes(instalacion.asistentes);

    // 2. Validar autoridades
    this.validarAutoridades(instalacion.presidente, instalacion.secretario);

    // 3. Calcular quórum
    instalacion.quorum = this.quorumCalculator.calculate(instalacion.asistentes);

    // 4. Advertir si no hay quórum (no bloquea)
    if (!instalacion.quorum.cumpleQuorum) {
      console.warn("⚠️ No se alcanzó el quórum requerido");
    }

    // 5. Guardar
    return await this.repository.update(societyId, flowId, instalacion);
  }

  private validarRepresentantes(asistentes: Asistente[]): void {
    const sinRepresentante = asistentes.filter(
      (a) => this.requiereRepresentante(a.tipoPersona) && !a.representante
    );

    if (sinRepresentante.length > 0) {
      throw new Error(
        `Requieren representante: ${sinRepresentante.map((a) => a.nombre).join(", ")}`
      );
    }

    if (!asistentes.some((a) => a.asistio)) {
      throw new Error("Debe marcar al menos un asistente");
    }
  }

  private requiereRepresentante(tipo: TipoPersona): boolean {
    return [
      TipoPersona.JURIDICA,
      TipoPersona.SUCURSAL,
      TipoPersona.SUCESION_INDIVISA,
      TipoPersona.FIDEICOMISO,
    ].includes(tipo);
  }

  private validarAutoridades(presidente: Autoridad, secretario: Autoridad): void {
    if (!presidente.nombre && !presidente.reemplazo) {
      throw new Error("Debe definir un presidente");
    }

    if (!secretario.nombre && !secretario.reemplazo) {
      throw new Error("Debe definir un secretario");
    }
  }
}
```

---

### FASE 3: Infrastructure Layer (Días 7-12)

#### Día 7-8: Mappers

**Archivo a crear**:

**`instalacion-junta.mapper.ts`**

```typescript
export class InstalacionJuntaMapper {
  // Entidad → DTO Request (para enviar al backend)
  static toRequestDto(entity: InstalacionJunta): InstalacionJuntaRequestDto {
    return {
      instaladaEnConvocatoria: entity.convocatoriaInstalada,

      asistentes: entity.asistentes.map((a) => ({
        accionistDetailsId: a.accionistaId,
        presentMeetingInstall: a.asistio,
        representBy: a.representante
          ? {
              documentTypeId: this.getTipoDocumentoId(a.representante.tipoDocumento),
              documentNumber: a.representante.numeroDocumento,
              firstName: a.representante.nombres,
              lastNamePaternal: a.representante.apellidoPaterno,
              lastNameMaternal: a.representante.apellidoMaterno,
              passportCountryIssuer: a.representante.paisEmisorPasaporte,
            }
          : undefined,
      })),

      presidenteId: entity.presidente.id,
      presidenteAsistio: entity.presidente.asistio,
      nombreOtroPresidente: entity.presidente.reemplazo?.nombreCompleto,
      accionistaPresidenteId: entity.presidente.reemplazo?.accionistaId,
      representantePresidenteDoc: entity.presidente.reemplazo?.representanteDocumento,

      secretarioId: entity.secretario.id,
      secretarioAsistio: entity.secretario.asistio,
      nombreOtroSecretario: entity.secretario.reemplazo?.nombreCompleto,
      accionistaSecretarioId: entity.secretario.reemplazo?.accionistaId,
      representanteSecretarioDoc: entity.secretario.reemplazo?.representanteDocumento,
    };
  }

  // DTO Response → Entidad (del backend)
  static fromResponseDto(dto: InstalacionJuntaResponseDto): InstalacionJunta {
    // TODO: Mapeo completo
    // Por ahora, retornar estructura básica
    return {
      convocatoriaInstalada: dto.data.instaladaEnConvocatoria as OrdenConvocatoria,
      asistentes: [], // Mapear desde dto.data.asistentes
      presidente: {
        id: dto.data.presidenteId,
        nombre: undefined,
        asistio: dto.data.presidenteAsistio,
        esDelDirectorio: !!dto.data.presidenteId,
        reemplazo: dto.data.nombreOtroPresidente
          ? {
              nombreCompleto: dto.data.nombreOtroPresidente,
            }
          : undefined,
      },
      secretario: {
        id: dto.data.secretarioId,
        nombre: undefined,
        asistio: dto.data.secretarioAsistio,
        esDelDirectorio: !!dto.data.secretarioId,
        reemplazo: dto.data.nombreOtroSecretario
          ? {
              nombreCompleto: dto.data.nombreOtroSecretario,
            }
          : undefined,
      },
      quorum: {
        tipoQuorum: TipoQuorum.CALIFICADO,
        porcentajeMinimoRequerido: 66.67,
        totalAcciones: 0,
        accionesPresentes: 0,
        porcentajePresente: 0,
        cumpleQuorum: false,
      },
    };
  }

  private static getTipoDocumentoId(tipo: TipoDocumento): number {
    const map: Record<TipoDocumento, number> = {
      [TipoDocumento.DNI]: 1,
      [TipoDocumento.PASAPORTE]: 2,
      [TipoDocumento.CARNET_EXTRANJERIA]: 3,
    };
    return map[tipo];
  }
}
```

#### Día 9-10: MSW Repository + Mock Data

**Archivos a crear**:

1. **`instalacion-junta.state.ts`** (mock data)

```typescript
interface MockInstalacionState {
  [key: string]: InstalacionJunta; // key: "societyId-flowId"
}

let mockState: MockInstalacionState = {};

export const getInstalacionMock = (
  societyId: number,
  flowId: number
): InstalacionJunta | null => {
  const key = `${societyId}-${flowId}`;
  return mockState[key] || null;
};

export const updateInstalacionMock = (
  societyId: number,
  flowId: number,
  data: InstalacionJunta
): InstalacionJunta => {
  const key = `${societyId}-${flowId}`;
  mockState[key] = data;
  return data;
};

export const resetInstalacionMock = () => {
  mockState = {};
};
```

2. **`instalacion-junta.handlers.ts`** (MSW handlers)

```typescript
import { http, HttpResponse } from "msw";

export const instalacionJuntaHandlers = [
  // GET - Obtener instalación
  http.get(
    "/api/v2/society-profile/:societyId/register-assembly/:flowId/installation",
    ({ params }) => {
      const societyId = parseInt(params.societyId as string);
      const flowId = parseInt(params.flowId as string);

      const data = getInstalacionMock(societyId, flowId);

      if (!data) {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      }

      // Mapear a Response DTO
      const responseDto = InstalacionJuntaMapper.toResponseDto(data);

      return HttpResponse.json({
        success: true,
        message: "Instalación obtenida correctamente",
        data: responseDto,
        code: 200,
      });
    }
  ),

  // PUT - Actualizar instalación
  http.put(
    "/api/v2/society-profile/:societyId/register-assembly/:flowId/installation",
    async ({ params, request }) => {
      const societyId = parseInt(params.societyId as string);
      const flowId = parseInt(params.flowId as string);
      const body = await request.json();

      // Mapear de Request DTO a Entity
      const entity = InstalacionJuntaMapper.fromRequestDto(body);

      // Guardar en mock
      const saved = updateInstalacionMock(societyId, flowId, entity);

      // Mapear a Response DTO
      const responseDto = InstalacionJuntaMapper.toResponseDto(saved);

      return HttpResponse.json({
        success: true,
        message: "Instalación guardada correctamente",
        data: responseDto,
        code: 200,
      });
    }
  ),
];
```

3. **`instalacion-junta.msw.repository.ts`**

```typescript
export class InstalacionJuntaMswRepository implements InstalacionJuntaRepository {
  async get(societyId: number, flowId: number): Promise<InstalacionJunta | null> {
    const response = await $fetch<InstalacionJuntaResponseDto>(
      `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/installation`
    ).catch((error) => {
      if (error.statusCode === 404) return null;
      throw error;
    });

    if (!response) return null;

    return InstalacionJuntaMapper.fromResponseDto(response);
  }

  async update(
    societyId: number,
    flowId: number,
    data: InstalacionJunta
  ): Promise<InstalacionJunta> {
    const dto = InstalacionJuntaMapper.toRequestDto(data);

    const response = await $fetch<InstalacionJuntaResponseDto>(
      `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/installation`,
      { method: "PUT", body: dto }
    );

    return InstalacionJuntaMapper.fromResponseDto(response);
  }
}
```

#### Día 11: HTTP Repository

**Archivo a crear**:

**`instalacion-junta.http.repository.ts`**

```typescript
export class InstalacionJuntaHttpRepository implements InstalacionJuntaRepository {
  async get(societyId: number, flowId: number): Promise<InstalacionJunta | null> {
    try {
      const response = await $fetch<InstalacionJuntaResponseDto>(
        `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/installation`
      );

      return InstalacionJuntaMapper.fromResponseDto(response);
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async update(
    societyId: number,
    flowId: number,
    data: InstalacionJunta
  ): Promise<InstalacionJunta> {
    const dto = InstalacionJuntaMapper.toRequestDto(data);

    const response = await $fetch<InstalacionJuntaResponseDto>(
      `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/installation`,
      { method: "PUT", body: dto }
    );

    return InstalacionJuntaMapper.fromResponseDto(response);
  }
}
```

#### Día 12: Shared Tests (HTTP + MSW)

**Archivo a crear**:

**`instalacion-junta.repository.shared.test.ts`**

```typescript
import { describe, it, expect, beforeEach } from "vitest";

export const createSharedRepositoryTests = (
  repositoryName: string,
  createRepository: () => InstalacionJuntaRepository
) => {
  describe(`'${repositoryName}' - Tests Compartidos`, () => {
    let repository: InstalacionJuntaRepository;

    beforeEach(() => {
      repository = createRepository();
    });

    describe("get()", () => {
      it("debe retornar null si no existe instalación", async () => {
        const result = await repository.get(999, 999);
        expect(result).toBeNull();
      });
    });

    describe("update()", () => {
      it("debe guardar y retornar instalación", async () => {
        const data: InstalacionJunta = {
          convocatoriaInstalada: OrdenConvocatoria.PRIMERA,
          asistentes: [
            {
              accionistaId: 1,
              nombre: "Test",
              tipoPersona: TipoPersona.NATURAL,
              tipoDocumento: "DNI",
              numeroDocumento: "12345678",
              acciones: 100,
              porcentajeParticipacion: 20,
              asistio: true,
            },
          ],
          presidente: {
            id: 1,
            nombre: "Presidente Test",
            asistio: true,
            esDelDirectorio: true,
          },
          secretario: {
            id: 2,
            nombre: "Secretario Test",
            asistio: true,
            esDelDirectorio: true,
          },
          quorum: {
            tipoQuorum: TipoQuorum.CALIFICADO,
            porcentajeMinimoRequerido: 66.67,
            totalAcciones: 100,
            accionesPresentes: 100,
            porcentajePresente: 100,
            cumpleQuorum: true,
          },
        };

        const result = await repository.update(1, 1, data);

        expect(result).toBeDefined();
        expect(result.convocatoriaInstalada).toBe(OrdenConvocatoria.PRIMERA);
        expect(result.asistentes).toHaveLength(1);
      });
    });
  });
};

// Tests para MSW
describe("InstalacionJuntaMswRepository", () => {
  createSharedRepositoryTests("MSW", () => new InstalacionJuntaMswRepository());
});

// Tests para HTTP
describe("InstalacionJuntaHttpRepository", () => {
  createSharedRepositoryTests("HTTP", () => new InstalacionJuntaHttpRepository());
});
```

---

### FASE 4: Presentation Layer (Días 13-18)

#### Día 13-14: Store (Pinia Option API)

**Archivo a crear**:

**`instalacion-junta.store.ts`**

```typescript
export const useInstalacionJuntaStore = defineStore('instalacionJunta', {
  state: () => ({
    // IDs
    currentSocietyId: null as number | null,
    currentFlowId: null as number | null,

    // Datos del Paso 2
    tipoJunta: null as TipoJunta | null,
    primeraConvocatoria: null as Convocatoria | null,
    segundaConvocatoria: null as Convocatoria | null,

    // Selector de convocatoria
    convocatoriaInstalada: null as OrdenConvocatoria | null,

    // Asistentes
    asistentes: [] as Asistente[],

    // Autoridades
    tieneDirectorio: false,
    presidente: {
      id: null,
      nombre: null,
      asistio: true,
      esDelDirectorio: false,
      reemplazo: null,
    } as Autoridad,
    secretario: {
      id: null,
      nombre: null,
      asistio: true,
      esDelDirectorio: false,
      reemplazo: null,
    } as Autoridad,

    // Quórum
    quorum: null as QuorumCalculado | null,

    // Estado
    status: 'idle' as 'idle' | 'loading' | 'error',
    errorMessage: null as string | null,
  }),

  getters: {
    // Accionistas sin representante (que lo requieren)
    accionistasSinRepresentante(): Asistente[] {
      return this.asistentes.filter(a =>
        this.requiereRepresentante(a.tipoPersona) && !a.representante
      );
    },

    // Todos con representante
    todosConRepresentante(): boolean {
      return this.accionistasSinRepresentante.length === 0;
    },

    // Opciones para presidente/secretario
    opcionesAutoridades(): OpcionAutoridad[] {
      const opciones: OpcionAutoridad[] = [];

      // Accionistas presentes
      this.asistentes
        .filter(a => a.asistio)
        .forEach(a => {
          opciones.push({
            tipo: 'ACCIONISTA',
            id: a.accionistaId,
            nombre: a.nombre,
            label: `${a.nombre} (Accionista)`,
          });
        });

      // Representantes
      this.asistentes
        .filter(a => a.asistio && a.representante)
        .forEach(a => {
          opciones.push({
            tipo: 'REPRESENTANTE',
            documento: a.representante!.numeroDocumento,
            nombre: `${a.representante!.nombres} ${a.representante!.apellidoPaterno}`,
            label: `${a.representante!.nombres} ${a.representante!.apellidoPaterno} (Representante)`,
          });
        });

      return opciones;
    },

    // Validación completa
    formularioValido(): boolean {
      return (
        this.todosConRepresentante &&
        this.alMenosUnAsistente &&
        this.presidenteDefinido &&
        this.secretarioDefinido &&
        (this.tipoJunta === TipoJunta.UNIVERSAL || this.convocatoriaInstalada !== null)
      );
    },

    alMenosUnAsistente(): boolean {
      return this.asistentes.some(a => a.asistio);
    },

    presidenteDefinido(): boolean {
      if (this.presidente.esDelDirectorio) {
        return this.presidente.asistio || this.presidente.reemplazo !== null;
      }
      return this.presidente.reemplazo !== null;
    },

    secretarioDefinido(): boolean {
      if (this.secretario.esDelDirectorio) {
        return this.secretario.asistio || this.secretario.reemplazo !== null;
      }
      return this.secretario.reemplazo !== null;
    },
  },

  actions: {
    // Cargar datos iniciales
    async loadInstalacionJunta(societyId: number, flowId: number) {
      this.currentSocietyId = societyId;
      this.currentFlowId = flowId;
      this.status = 'loading';

      try {
        // 1. Cargar datos del Paso 2
        const detailsStore = useMeetingDetailsStore();
        if (!detailsStore.meetingDetails) {
          await detailsStore.loadMeetingDetails(societyId, flowId);
        }
        this.tipoJunta = detailsStore.meetingDetails.tipoJunta;
        this.primeraConvocatoria = detailsStore.meetingDetails.primeraConvocatoria;
        this.segundaConvocatoria = detailsStore.meetingDetails.segundaConvocatoria;

        // 2. Cargar accionistas
        await this.loadAccionistas(societyId);

        // 3. Cargar directorio
        await this.loadDirectorio(societyId);

        // 4. Intentar cargar datos guardados
        const useCase = new GetInstalacionJuntaUseCase(/* repository */);
        const datos = await useCase.execute(societyId, flowId);

        if (datos) {
          this.asistentes = datos.asistentes;
          this.convocatoriaInstalada = datos.convocatoriaInstalada;
          this.presidente = datos.presidente;
          this.secretario = datos.secretario;
          this.quorum = datos.quorum;
        }

        this.status = 'idle';
      } catch (error: any) {
        if (error.statusCode !== 404) {
          this.status = 'error';
          this.errorMessage = error.message;
        } else {
          this.status = 'idle';
        }
      }
    },

    // Actualizar representante
    updateRepresentante(accionistaId: number, representante: Representante) {
      const index = this.asistentes.findIndex(a => a.accionistaId === accionistaId);
      if (index !== -1) {
        this.asistentes[index].representante = representante;
        this.asistentes[index].asistio = true;
      }
    },

    // Toggle asistencia
    toggleAsistencia(accionistaId: number) {
      const asistente = this.asistentes.find(a => a.accionistaId === accionistaId);
      if (asistente) {
        asistente.asistio = !asistente.asistio;
        this.calcularQuorum();
      }
    },

    // Calcular quórum
    calcularQuorum() {
      const calculator = new QuorumCalculator();
      this.quorum = calculator.calculate(this.asistentes);
    },

    // Guardar
    async guardar() {
      if (!this.currentSocietyId || !this.currentFlowId) {
        throw new Error('Faltan IDs');
      }

      if (!this.formularioValido) {
        throw new Error('Formulario incompleto');
      }

      const useCase = new UpdateInstalacionJuntaUseCase(/* repository */, new QuorumCalculator());

      const instalacion: InstalacionJunta = {
        convocatoriaInstalada: this.convocatoriaInstalada,
        asistentes: this.asistentes,
        presidente: this.presidente,
        secretario: this.secretario,
        quorum: this.quorum!,
      };

      await useCase.execute(this.currentSocietyId, this.currentFlowId, instalacion);
    },

    // Helpers
    requiereRepresentante(tipo: TipoPersona): boolean {
      return [
        TipoPersona.JURIDICA,
        TipoPersona.SUCURSAL,
        TipoPersona.SUCESION_INDIVISA,
        TipoPersona.FIDEICOMISO,
      ].includes(tipo);
    },
  },
});

interface OpcionAutoridad {
  tipo: 'ACCIONISTA' | 'REPRESENTANTE';
  id?: number;
  documento?: string;
  nombre: string;
  label: string;
}
```

#### Día 15-16: Componentes Básicos

**Archivos a crear**:

1. **`DetallesCelebracionSection.vue`** - Selector de convocatoria + datos readonly
2. **`QuorumMetricsSection.vue`** - Barra de progreso + cards de métricas

#### Día 17-18: Componentes Complejos

**Archivos a crear**:

1. **`AsistenciaRepresentacionSection.vue`** - Tabla unificada
2. **`ModalRepresentante.vue`** - Formulario para agregar representante
3. **`AutoridadesSection.vue`** - Presidente y secretario

---

### FASE 5: Integración (Días 19-22)

#### Día 19-20: Página Principal

**Archivo a crear**:

**`instalacion/index.vue`**

```vue
<template>
  <div class="w-full px-spc-22 pt-16 flex flex-col gap-spc-40 pb-10">
    <DetallesCelebracionSection
      v-if="store.tipoJunta"
      :tipo-junta="store.tipoJunta"
      :primera-convocatoria="store.primeraConvocatoria"
      :segunda-convocatoria="store.segundaConvocatoria"
      v-model:convocatoria-instalada="store.convocatoriaInstalada"
    />

    <AsistenciaRepresentacionSection
      :asistentes="store.asistentes"
      @update-representante="handleUpdateRepresentante"
      @toggle-asistencia="handleToggleAsistencia"
    />

    <QuorumMetricsSection v-if="store.quorum" :quorum="store.quorum" />

    <AutoridadesSection
      :tiene-directorio="store.tieneDirectorio"
      v-model:presidente="store.presidente"
      v-model:secretario="store.secretario"
      :opciones="store.opcionesAutoridades"
    />
  </div>
</template>

<script setup lang="ts">
  const route = useRoute();
  const store = useInstalacionJuntaStore();

  const societyId = computed(() => parseInt(route.params.societyId as string));
  const flowId = computed(() => parseInt(route.params.flowId as string));

  onMounted(async () => {
    await store.loadInstalacionJunta(societyId.value, flowId.value);
  });

  const handleUpdateRepresentante = (accionistaId: number, representante: Representante) => {
    store.updateRepresentante(accionistaId, representante);
  };

  const handleToggleAsistencia = (accionistaId: number) => {
    store.toggleAsistencia(accionistaId);
  };

  // Navegación
  useJuntasFlowNext(async () => {
    await store.guardar();
  });

  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
```

#### Día 21-22: Testing End-to-End

- [ ] Flujo completo con MSW
- [ ] Validaciones de formulario
- [ ] Casos edge (sin quórum, sin directorio, etc.)

---

## 📅 <a id="cronograma"></a>CRONOGRAMA DETALLADO

### Semana 1: Foundation (Domain + Application)

| Día | Tarea                                   | Tiempo | Archivos            |
| --- | --------------------------------------- | ------ | ------------------- |
| 1   | Entidades principales                   | 4h     | 5 archivos entities |
| 2   | Enums + QuorumCalculator                | 3h     | 3 archivos          |
| 3   | Port (interface)                        | 1h     | 1 archivo           |
| 4   | DTOs                                    | 4h     | 1 archivo grande    |
| 5   | GetInstalacionUseCase                   | 2h     | 1 archivo           |
| 6   | UpdateInstalacionUseCase + validaciones | 4h     | 1 archivo           |

**Total Semana 1**: ~18 horas, **7 archivos core**

---

### Semana 2: Infrastructure

| Día | Tarea                     | Tiempo | Archivos        |
| --- | ------------------------- | ------ | --------------- |
| 7   | Mapper (Entity ↔ DTO)     | 4h     | 1 archivo       |
| 8   | Tests de mapper           | 2h     | Tests           |
| 9   | Mock data state           | 2h     | 2 archivos      |
| 10  | MSW handlers + repository | 4h     | 2 archivos      |
| 11  | HTTP repository           | 2h     | 1 archivo       |
| 12  | Shared tests (MSW + HTTP) | 4h     | 1 archivo tests |

**Total Semana 2**: ~18 horas, **6 archivos infra + tests**

---

### Semana 3: Presentation

| Día | Tarea                                | Tiempo | Archivos        |
| --- | ------------------------------------ | ------ | --------------- |
| 13  | Store - State + Getters              | 4h     | 1 archivo store |
| 14  | Store - Actions (load, update, etc.) | 4h     | Mismo archivo   |
| 15  | DetallesCelebracionSection           | 3h     | 1 componente    |
| 16  | QuorumMetricsSection                 | 2h     | 1 componente    |
| 17  | AsistenciaRepresentacionSection      | 4h     | 1 componente    |
| 18  | ModalRepresentante                   | 3h     | 1 componente    |

**Total Semana 3**: ~20 horas, **1 store + 4 componentes**

---

### Semana 4: Integration

| Día | Tarea                        | Tiempo | Archivos        |
| --- | ---------------------------- | ------ | --------------- |
| 19  | AutoridadesSection           | 4h     | 1 componente    |
| 20  | Página principal (index.vue) | 4h     | 1 página        |
| 21  | Testing E2E con MSW          | 4h     | Tests           |
| 22  | Validaciones + casos edge    | 4h     | Tests + ajustes |

**Total Semana 4**: ~16 horas, **2 componentes + página + tests**

---

### TOTAL: 4 SEMANAS, ~72 HORAS

**Desglose**:

- Domain: 8h
- Application: 10h
- Infrastructure: 18h
- Presentation: 20h
- Integration: 16h

---

## ❓ <a id="preguntas"></a>PREGUNTAS PENDIENTES DE VALIDACIÓN

### CRÍTICAS (bloquean implementación)

1. ❓ **¿Cómo se obtienen los accionistas para el flujo de junta?**

   - ¿Hay un endpoint específico?
   - ¿O se reutiliza el de registro de sociedades?
   - ¿Incluye solo accionistas con derecho a voto?

2. ❓ **¿El tipo de quórum viene del backend?**

   - ¿Está en la configuración de la sociedad?
   - ¿O lo definimos en frontend por defecto?

3. ❓ **Estructura exacta del endpoint de instalación**
   ```
   GET /api/v2/society-profile/:societyId/register-assembly/:flowId/installation
   PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/installation
   ```
   - ¿Estos endpoints ya existen?
   - ¿La estructura de DTOs es correcta?

### IMPORTANTES (afectan UX)

4. ❓ **¿Se permite continuar sin quórum?**

   - Solo advertencia (actual)
   - O es bloqueante

5. ❓ **¿Al eliminar representante, se desmarca la asistencia?**

   - Automáticamente
   - O se mantiene marcado

6. ❓ **¿Presidente y secretario pueden ser la misma persona?**
   - Sí (validar después)
   - No (error inmediato)

### OPCIONALES (nice-to-have)

7. ❓ **¿Se puede editar un representante ya agregado?**
8. ❓ **¿El usuario puede regresar al Paso 2 después de llenar el Paso 3?**
9. ❓ **¿Se guarda automáticamente o solo al presionar "Siguiente"?**

---

## ✅ <a id="checklist"></a>CHECKLIST DE COMPLETITUD

### Domain Layer

- [ ] 5 entidades creadas (`instalacion-junta`, `asistente`, `representante`, `autoridad`, `quorum-calculado`)
- [ ] 2 enums creados (`tipo-persona`, `tipo-quorum`)
- [ ] 1 service creado (`quorum-calculator`)
- [ ] 1 port (interface) creado (`instalacion-junta.repository`)

### Application Layer

- [ ] DTOs creados (`InstalacionJuntaRequestDto`, `InstalacionJuntaResponseDto`)
- [ ] 2 use cases creados (`GetInstalacion`, `UpdateInstalacion`)
- [ ] Validaciones implementadas

### Infrastructure Layer

- [ ] Mapper bidireccional creado
- [ ] Mock data + handlers MSW creados
- [ ] MSW repository implementado
- [ ] HTTP repository implementado
- [ ] Shared tests escritos (MSW + HTTP)
- [ ] Tests pasando al 100%

### Presentation Layer

- [ ] Store Pinia (Option API) con:
  - State completo
  - Getters calculados
  - Actions (load, update, toggle, etc.)
- [ ] 5 componentes Vue creados:
  - DetallesCelebracionSection
  - AsistenciaRepresentacionSection
  - ModalRepresentante
  - QuorumMetricsSection
  - AutoridadesSection
- [ ] Página principal (`instalacion/index.vue`)

### Integration

- [ ] Carga datos del Paso 2 (MeetingDetails)
- [ ] Carga accionistas de la sociedad
- [ ] Carga directorio (si existe)
- [ ] Guarda en backend
- [ ] Navega al siguiente paso
- [ ] Manejo de errores completo
- [ ] Loading states
- [ ] Toasts de feedback

### Testing

- [ ] Tests unitarios Domain (QuorumCalculator)
- [ ] Tests unitarios Application (Use Cases)
- [ ] Tests Infrastructure (Mapper, Repositories)
- [ ] Shared tests (MSW + HTTP consistency)
- [ ] Tests E2E con MSW
- [ ] Casos edge cubiertos

---

## 🎯 RESULTADO FINAL ESPERADO

Al completar este plan, tendrás:

✅ **Paso 3 completo** que fusiona 3 pasos de V2.5  
✅ **Tabla unificada** con representación + asistencia  
✅ **Cálculo automático** de quórum en tiempo real  
✅ **UI profesional** idéntica al diseño  
✅ **Arquitectura hexagonal** completa y testeada  
✅ **MSW funcionando** para desarrollo sin backend  
✅ **HTTP listo** para cuando el backend esté disponible  
✅ **Tests al 100%** desde el primer día

---

## 🚀 SIGUIENTE PASO INMEDIATO

**¿Listo para empezar, mi rey?**

### Opción 1: Empezar con Domain (Recomendado)

Crear las 5 entidades + 2 enums + QuorumCalculator

### Opción 2: Responder preguntas críticas primero

Validar endpoints, accionistas, y quórum con backend

### Opción 3: Ver un componente de ejemplo completo

Te muestro cómo quedaría `AsistenciaRepresentacionSection.vue`

**¿Qué opción prefieres?** 🎯









