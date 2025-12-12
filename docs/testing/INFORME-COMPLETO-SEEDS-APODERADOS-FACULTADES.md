# 📊 INFORME COMPLETO: Seeds de Sociedades - Apoderados, Otros Apoderados, Clases y Facultades

**Fecha:** Diciembre 2024  
**Objetivo:** Crear 5 nuevos seeds que incluyan apoderados, otros apoderados, clases de apoderados, clases de facultades y asignación de poderes

---

## 📋 ESTADO ACTUAL DE LOS SEEDS

### ✅ Lo que YA funciona (5 empresas actuales)

Los seeds actuales (`app/pages/dev/seeds-sociedades.vue`) crean sociedades con:

1. **Root** - Crear sociedad ✅
2. **Datos principales** ✅
3. **Accionistas** (2 naturales) ✅
4. **Valor nominal** ✅
5. **Acciones** (500 comunes) ✅
6. **Asignación de acciones** (300 + 200) ✅
7. **Quórums y mayorías** ✅
8. **Directores** (3-5 según configuración) ✅
9. **Directorio** (configuración) ✅
10. **Clase Apoderado** - Solo obtiene "Gerente General" existente ✅
11. **Apoderado** - Solo crea Gerente General ✅

### ❌ Lo que FALTA implementar

1. **Crear Clases de Apoderados** (no solo obtener "Gerente General")
2. **Crear Otros Apoderados** (apoderados que no son Gerente General)
3. **Crear Clases de Facultades** (tipos de poderes)
4. **Asignar Facultades a Apoderados** (otorgamiento de poderes a clases)
5. **Asignar Facultades a Otros Apoderados** (otorgamiento de poderes a apoderados individuales)

---

## 🏗️ ARQUITECTURA Y ESTRUCTURA

### Flujo Correcto (V3)

```
PASO 1: Crear Clases de Apoderados
  ↓
PASO 2: Registrar Apoderados (asociados a clase)
  ↓
PASO 3: Registrar Otros Apoderados (sin clase)
  ↓
PASO 4: Crear Tipos de Facultades (clases de poderes)
  ↓
PASO 5: Asignar Facultades a Apoderados (por clase)
  ↓
PASO 6: Asignar Facultades a Otros Apoderados (individual)
```

---

## 📡 ENDPOINTS Y OBJETOS

### 1. Clases de Apoderados

#### Endpoint
```
POST /api/v2/society-profile/{profileId}/attorney-register/classes
GET  /api/v2/society-profile/{profileId}/attorney-register/classes
PUT  /api/v2/society-profile/{profileId}/attorney-register/classes
DELETE /api/v2/society-profile/{profileId}/attorney-register/classes/{claseId}
```

#### Use Case
```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-clase-apoderado.use-case.ts
CreateClaseApoderadoUseCase
```

#### DTO/Payload (Core)
```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/domain/entities/clase-apoderado-payload.ts
interface ClaseApoderadoPayload {
  id: string;        // ✅ UUID generado
  nombre: string;   // ✅ "Gerente General", "Apoderado Especial", etc.
}
```

#### Repositorio
```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/repositories/apoderados.http.repository.ts
ApoderadosHttpRepository.createClase(profileId, payload)
```

---

### 2. Apoderados (Registro)

#### Endpoint
```
POST /api/v2/society-profile/{profileId}/attorney-register/attorneys
GET  /api/v2/society-profile/{profileId}/attorney-register/attorneys
PUT  /api/v2/society-profile/{profileId}/attorney-register/attorneys
DELETE /api/v2/society-profile/{profileId}/attorney-register/attorneys/{attorneyId}
```

#### Use Case
```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-apoderado.use-case.ts
CreateApoderadoUseCase
```

#### DTO (Core)
```typescript
// app/core/hexag/registros/sociedades/pasos/apoderados/application/dtos/apoderado.dto.ts
interface ApoderadoDTO {
  id: string;                    // ✅ UUID generado
  claseApoderadoId: string;     // ✅ ID de la clase creada
  persona: PersonaNatural | PersonaJuridica;  // ✅ Entidad Persona de core
}
```

#### Repositorio
```typescript
ApoderadosHttpRepository.createApoderado(profileId, payload)
```

---

### 3. Otros Apoderados

**✅ VERIFICADO:** "Otros Apoderados" es una **clase especial** que se crea automáticamente. Los apoderados se registran asociados a esta clase.

#### Endpoint
```
POST /api/v2/society-profile/{profileId}/attorney-register/attorneys
```

**✅ CONFIRMADO:** Usa el mismo endpoint que apoderados normales, pero con `claseApoderadoId` = ID de la clase "Otros Apoderados".

#### Clase Especial
```typescript
// app/core/presentation/registros/sociedades/pasos/apoderados/types/enums/ClasesApoderadoEspecialesEnum.ts
enum ClasesApoderadoEspecialesEnum {
  GERENTE_GENERAL = "Gerente General",
  OTROS_APODERADOS = "Otros Apoderados",  // ✅ Clase especial
}
```

#### DTO (Core)
```typescript
// Mismo ApoderadoDTO pero con claseApoderadoId = ID de clase "Otros Apoderados"
interface OtroApoderadoDTO {
  id: string;
  claseApoderadoId: string;  // ✅ ID de la clase "Otros Apoderados" (obtenida al listar clases)
  persona: PersonaNatural | PersonaJuridica;
}
```

**✅ CONFIRMADO:** La clase "Otros Apoderados" se crea automáticamente. Solo necesitamos obtener su ID al listar clases.

---

### 4. Tipos de Facultades (Clases de Poderes)

#### Endpoint
```
POST /api/v2/society-profile/{profileId}/power-regime/faculty-types
GET  /api/v2/society-profile/{profileId}/power-regime/faculty-types
PUT  /api/v2/society-profile/{profileId}/power-regime/faculty-types
DELETE /api/v2/society-profile/{profileId}/power-regime/faculty-types/{typeId}
```

#### Use Case
```typescript
// Buscar en: app/core/hexag/registros/sociedades/pasos/regimen-poderes/
// Necesito verificar si existe CreateTipoFacultadUseCase
```

#### DTO (Core)
```typescript
// Buscar en: app/core/hexag/registros/sociedades/pasos/regimen-poderes/application/dtos/
// Necesito verificar la estructura exacta
```

**⚠️ VERIFICAR:** Necesito confirmar la estructura exacta del DTO y si existe el use case.

---

### 5. Asignación de Facultades (Otorgamiento de Poderes)

#### Endpoint
```
POST /api/v2/society-profile/{profileId}/power-regime/powers-grants
PUT  /api/v2/society-profile/{profileId}/power-regime/powers-grants
DELETE /api/v2/society-profile/{profileId}/power-regime/powers-grants
```

#### Use Case
```typescript
// app/core/hexag/registros/sociedades/pasos/regimen-poderes/application/use-case/create-otorgamiento-poder.use-case.ts
CreateOtorgamientoPoderUseCase
```

#### Payload (Core)
```typescript
// app/core/hexag/registros/sociedades/pasos/regimen-poderes/domain/entities/create-otorgamiento-poder.payload.ts
type CreateOtorgamientoPoderPayload = BaseOtorgamientoPoderPayloadCreate & ReglaMonetaria;

// BaseOtorgamientoPoderPayloadCreate es un discriminated union:
type BaseOtorgamientoPoderPayloadCreate =
  | BaseOtorgamientoPoderPayloadCreateClase
  | BaseOtorgamientoPoderPayloadCreateApoderado;

// Para clases (scope: CLASS):
interface BaseOtorgamientoPoderPayloadCreateClase {
  id: string;                    // ✅ UUID generado
  poderId: string;               // ✅ ID del tipo de facultad
  scope: ScopeUIEnum.CLASS;      // ✅ "CLASS" para clases
  claseApoderadoId: string;      // ✅ ID de la clase de apoderado
  esIrrevocable: boolean;
  fechaInicio: Date;            // ✅ Date object
  fechaFin?: Date;               // ✅ Date object (opcional)
}

// Para apoderados individuales (scope: ATTORNEY):
interface BaseOtorgamientoPoderPayloadCreateApoderado {
  id: string;                    // ✅ UUID generado
  poderId: string;               // ✅ ID del tipo de facultad
  scope: ScopeUIEnum.ATTORNEY;   // ✅ "ATTORNEY" para apoderados individuales
  apoderadoId: string;           // ✅ ID del apoderado individual
  esIrrevocable: boolean;
  fechaInicio: Date;            // ✅ Date object
  fechaFin?: Date;               // ✅ Date object (opcional)
}

// ReglaMonetaria (opcional):
type ReglaMonetaria = ConReglasMonetarias | SinReglasMonetarias;

interface ConReglasMonetarias {
  tieneReglasFirma: true;
  reglasMonetarias: CreateReglaMonetariaPayload[];
}

interface SinReglasMonetarias {
  tieneReglasFirma: false;
}
```

**✅ IMPORTANTE:** 
- Para `scope: CLASS` → usar `claseApoderadoId`
- Para `scope: ATTORNEY` → usar `apoderadoId` (incluso para "Otros Apoderados")
- `fechaInicio` y `fechaFin` son objetos `Date`, no strings

#### Repositorio
```typescript
// app/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/repository/regimen-facultades.http.repository.ts
RegimenFacultadesHttpRepository.createOtorgamientoPoder(profileId, payload)
```

---

## ✅ VERIFICACIÓN DE TIPADO

### Tipos de Core Utilizados

| Objeto | Tipo Core | Ubicación | ✅ Verificado |
|--------|-----------|-----------|---------------|
| `ClaseApoderadoPayload` | ✅ Core | `app/core/hexag/registros/sociedades/pasos/apoderados/domain/entities/clase-apoderado-payload.ts` | ✅ |
| `ApoderadoDTO` | ✅ Core | `app/core/hexag/registros/sociedades/pasos/apoderados/application/dtos/apoderado.dto.ts` | ✅ |
| `PersonaNatural/PersonaJuridica` | ✅ Core | `app/core/hexag/registros/sociedades/pasos/apoderados/domain/types/` | ✅ |
| `CreateOtorgamientoPoderPayload` | ✅ Core | `app/core/hexag/registros/sociedades/pasos/regimen-poderes/domain/entities/create-otorgamiento-poder.payload.ts` | ✅ |

**✅ CONCLUSIÓN:** Todos los objetos utilizan tipos de core correctamente.

---

## 📝 PLAN DE ACCIÓN

### Fase 1: Investigación y Verificación (2-3 horas)

#### Tarea 1.1: Verificar Endpoints de Otros Apoderados
- [ ] Confirmar si "Otros Apoderados" usan el mismo endpoint que apoderados normales
- [ ] Verificar si hay un campo especial o endpoint separado
- [ ] Revisar documentación del backend o código existente

#### Tarea 1.2: Verificar Tipos de Facultades
- [ ] Buscar use case `CreateTipoFacultadUseCase` o similar
- [ ] Verificar DTO de creación de tipo de facultad
- [ ] Confirmar endpoint exacto: `/power-regime/faculty-types`

#### Tarea 1.3: Revisar Estructura de Payloads
- [ ] Leer `BaseOtorgamientoPoderPayloadCreate` completo
- [ ] Entender estructura de `CreateReglaMonetariaPayload`
- [ ] Verificar ejemplos en código existente (stores, composables)

---

### Fase 2: Implementación de Seeds (4-6 horas)

#### Tarea 2.1: Agregar Creación de Clases de Apoderados
**Archivo:** `app/pages/dev/seeds-sociedades.vue`

```typescript
// En generateTestData(), agregar:
clasesApoderado: [
  {
    id: generateUUID(),
    nombre: "Apoderado Especial",
  },
  {
    id: generateUUID(),
    nombre: "Apoderado Judicial",
  },
] as ClaseApoderadoPayload[],

// En createSociety(), agregar paso:
// Paso 10: Crear clases de apoderados
currentStep.value = `[Sociedad ${index + 1}] Paso 11/15: Creando clases de apoderados...`;
steps.clasesApoderado = await executeStep("clasesApoderado", "clasesApoderado", async () => {
  const clasesCreadas: string[] = [];
  for (const clase of testData.clasesApoderado) {
    const claseCreada = await createClaseApoderadoUseCase.execute(societyId, clase);
    clasesCreadas.push(claseCreada.id);
  }
  (testData as any).clasesApoderadoIds = clasesCreadas;
});
```

**Use Case necesario:**
```typescript
import { CreateClaseApoderadoUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-clase-apoderado.use-case";

const createClaseApoderadoUseCase = new CreateClaseApoderadoUseCase(apoderadosRepo);
```

---

#### Tarea 2.2: Agregar Creación de Otros Apoderados
**Archivo:** `app/pages/dev/seeds-sociedades.vue`

```typescript
// En generateTestData(), agregar:
otrosApoderados: [
  {
    id: generateUUID(),
    persona: {
      id: generateUUID(),
      tipo: "NATURAL",
      nombre: "Carlos",
      apellidoPaterno: "Vargas",
      apellidoMaterno: "Ramírez",
      numeroDocumento: String(index * 7 + 7).padStart(8, "0"),
      tipoDocumento: "DNI",
      fechaNacimiento: "01-01-1980",
      nacionalidad: "Peruana",
      estadoCivil: "SOLTERO",
      direccion: "Av. Otro Apoderado 123",
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
    } as Persona,
  },
] as ApoderadoDTO[], // ⚠️ Verificar si necesita claseApoderadoId: null

// En createSociety(), agregar paso:
// Paso 11: Crear otros apoderados
currentStep.value = `[Sociedad ${index + 1}] Paso 12/15: Creando otros apoderados...`;
steps.otrosApoderados = await executeStep("otrosApoderados", "otrosApoderados", async () => {
  const otrosApoderadosCreados: string[] = [];
  for (const otroApoderado of testData.otrosApoderados) {
    // ⚠️ Verificar si se usa el mismo use case o uno diferente
    await apoderadoUseCase.execute(societyId, otroApoderado);
    // ⚠️ Necesitamos obtener el ID después (el backend no lo retorna)
    const apoderados = await listApoderadosUseCase.execute(societyId);
    const apoderadoCreado = apoderados.find(a => 
      a.persona.numeroDocumento === otroApoderado.persona.numeroDocumento
    );
    if (apoderadoCreado) {
      otrosApoderadosCreados.push(apoderadoCreado.id);
    }
  }
  (testData as any).otrosApoderadosIds = otrosApoderadosCreados;
});
```

**⚠️ VERIFICAR:**
- ¿Se usa el mismo `CreateApoderadoUseCase` con `claseApoderadoId: null`?
- ¿O hay un use case separado para "Otros Apoderados"?

---

#### Tarea 2.3: Agregar Creación de Tipos de Facultades
**Archivo:** `app/pages/dev/seeds-sociedades.vue`

```typescript
// En generateTestData(), agregar:
tiposFacultades: [
  {
    id: generateUUID(),
    nombre: "Poder para Contratar",
    descripcion: "Facultad para celebrar contratos",
  },
  {
    id: generateUUID(),
    nombre: "Poder Judicial",
    descripcion: "Facultad para representar en juicios",
  },
] as TipoFacultadPayload[], // ⚠️ Verificar tipo exacto

// En createSociety(), agregar paso:
// Paso 12: Crear tipos de facultades
currentStep.value = `[Sociedad ${index + 1}] Paso 13/15: Creando tipos de facultades...`;
steps.tiposFacultades = await executeStep("tiposFacultades", "tiposFacultades", async () => {
  const tiposCreados: string[] = [];
  for (const tipo of testData.tiposFacultades) {
    // ⚠️ Verificar use case exacto
    const tipoCreado = await createTipoFacultadUseCase.execute(societyId, tipo);
    tiposCreados.push(tipoCreado.id);
  }
  (testData as any).tiposFacultadesIds = tiposCreados;
});
```

**⚠️ VERIFICAR:**
- ¿Existe `CreateTipoFacultadUseCase`?
- ¿Cuál es el DTO exacto?
- ¿Cuál es el endpoint exacto?

---

#### Tarea 2.4: Agregar Asignación de Facultades a Apoderados (por Clase)
**Archivo:** `app/pages/dev/seeds-sociedades.vue`

```typescript
// En generateTestData(), agregar:
facultadesApoderados: [
  {
    claseApoderadoId: "", // Se llenará con IDs creados
    tipoFacultadId: "",  // Se llenará con IDs creados
    esIrrevocable: false,
    tieneReglasFirma: false,
  },
] as FacultadApoderadoPayload[], // ⚠️ Verificar tipo exacto

// En createSociety(), agregar paso:
// Paso 13: Asignar facultades a apoderados (por clase)
currentStep.value = `[Sociedad ${index + 1}] Paso 14/15: Asignando facultades a apoderados...`;
steps.facultadesApoderados = await executeStep("facultadesApoderados", "facultadesApoderados", async () => {
  const clasesIds = (testData as any).clasesApoderadoIds || [];
  const tiposIds = (testData as any).tiposFacultadesIds || [];
  
  // Asignar primera facultad a primera clase
  if (clasesIds.length > 0 && tiposIds.length > 0) {
    const payload: CreateOtorgamientoPoderPayload = {
      poderId: tiposIds[0],
      scope: "CLASS",
      id: clasesIds[0],
      esIrrevocable: false,
      tieneReglasFirma: false,
    };
    await createOtorgamientoPoderUseCase.execute(societyId, payload);
  }
});
```

**Use Case necesario:**
```typescript
import { CreateOtorgamientoPoderUseCase } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/application/use-case/create-otorgamiento-poder.use-case";
import { RegimenFacultadesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/repository/regimen-facultades.http.repository";

const regimenFacultadesRepo = new RegimenFacultadesHttpRepository();
const createOtorgamientoPoderUseCase = new CreateOtorgamientoPoderUseCase(regimenFacultadesRepo);
```

---

#### Tarea 2.5: Agregar Asignación de Facultades a Otros Apoderados
**Archivo:** `app/pages/dev/seeds-sociedades.vue`

```typescript
// En createSociety(), agregar paso:
// Paso 14: Asignar facultades a otros apoderados
currentStep.value = `[Sociedad ${index + 1}] Paso 15/15: Asignando facultades a otros apoderados...`;
steps.facultadesOtrosApoderados = await executeStep("facultadesOtrosApoderados", "facultadesOtrosApoderados", async () => {
  const otrosApoderadosIds = (testData as any).otrosApoderadosIds || [];
  const tiposIds = (testData as any).tiposFacultadesIds || [];
  
  // Asignar primera facultad a primer otro apoderado
  if (otrosApoderadosIds.length > 0 && tiposIds.length > 0) {
    const payload: CreateOtorgamientoPoderPayload = {
      poderId: tiposIds[0],
      scope: "ATTORNEY",
      id: otrosApoderadosIds[0],
      esIrrevocable: false,
      tieneReglasFirma: false,
    };
    await createOtorgamientoPoderUseCase.execute(societyId, payload);
  }
});
```

---

### Fase 3: Testing y Validación (1-2 horas)

#### Tarea 3.1: Crear 5 Seeds de Prueba
- [ ] Ejecutar `createMultipleSocieties(5)` con nuevos pasos
- [ ] Verificar que todos los pasos se completen correctamente
- [ ] Revisar logs de consola para errores

#### Tarea 3.2: Validar Datos en Backend
- [ ] Verificar que las clases de apoderados se crearon
- [ ] Verificar que los otros apoderados se crearon
- [ ] Verificar que los tipos de facultades se crearon
- [ ] Verificar que las asignaciones de facultades se crearon

#### Tarea 3.3: Documentar Resultados
- [ ] Documentar qué funciona y qué no
- [ ] Reportar errores encontrados
- [ ] Crear lista de ajustes necesarios

---

## ⚠️ PUNTOS CRÍTICOS A VERIFICAR

### 1. Otros Apoderados
- [x] ✅ Usan el mismo endpoint que apoderados normales
- [x] ✅ Necesitan `claseApoderadoId` = ID de clase "Otros Apoderados"
- [x] ✅ Usan el mismo `CreateApoderadoUseCase`
- [x] ✅ La clase "Otros Apoderados" se crea automáticamente

### 2. Tipos de Facultades
- [x] ✅ Existe `CreateTiposFacultadesUseCase`
- [x] ✅ DTO: `TipoFacultadPayload { id, tipoFacultades }`
- [x] ✅ Endpoint: `/powers-regime/powers`

### 3. Asignación de Facultades
- [x] ✅ El scope "CLASS" usa `claseApoderadoId` (en el payload base)
- [x] ✅ El scope "ATTORNEY" usa `apoderadoId` (en el payload base)
- [x] ✅ Para obtener IDs: hacer GET después de POST (el backend no retorna IDs)

### 4. Obtención de IDs
- [ ] El backend NO retorna IDs en POST, solo confirma éxito
- [ ] Necesitamos hacer GET después para obtener IDs
- [ ] Verificar que los mappers y use cases manejen esto correctamente

---

## 📊 RESUMEN DE ENDPOINTS

| Operación | Método | Endpoint | Payload | ✅ Verificado |
|-----------|--------|----------|---------|---------------|
| Crear Clase Apoderado | POST | `/attorney-register/classes` | `ClaseApoderadoPayload` | ✅ |
| Listar Clases | GET | `/attorney-register/classes` | - | ✅ |
| Crear Apoderado | POST | `/attorney-register/attorneys` | `ApoderadoDTO` | ✅ |
| Listar Apoderados | GET | `/attorney-register/attorneys` | - | ✅ |
| Crear Otro Apoderado | POST | `/attorney-register/attorneys` | `ApoderadoDTO` (con clase "Otros Apoderados") | ✅ |
| Crear Tipo Facultad | POST | `/powers-regime/powers` | `TipoFacultadPayload` | ✅ |
| Listar Tipos Facultad | GET | `/powers-regime/powers` | - | ✅ |
| Crear Otorgamiento Poder | POST | `/power-regime/powers-grants` | `CreateOtorgamientoPoderPayload` | ✅ |

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Verificar endpoints y use cases faltantes** (30 min)
   - Buscar `CreateTipoFacultadUseCase`
   - Verificar estructura de "Otros Apoderados"
   - Confirmar endpoints exactos

2. **Crear estructura base en seeds** (1 hora)
   - Agregar imports necesarios
   - Agregar datos de prueba en `generateTestData()`
   - Crear esqueletos de pasos

3. **Implementar paso a paso** (3-4 horas)
   - Implementar cada paso uno por uno
   - Probar después de cada paso
   - Ajustar según resultados

4. **Testing completo** (1 hora)
   - Crear 5 seeds
   - Validar todos los pasos
   - Documentar resultados

---

**Última actualización:** Diciembre 2024  
**Estado:** 📋 Listo para implementar (después de verificar puntos críticos)

