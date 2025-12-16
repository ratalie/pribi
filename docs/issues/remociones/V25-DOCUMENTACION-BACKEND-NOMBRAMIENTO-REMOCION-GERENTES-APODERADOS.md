# Documentación Backend: Nombramiento y Remoción de Gerentes y Apoderados

## Índice

1. [Endpoints del Backend](#endpoints-del-backend)
2. [Estructura de Datos (DTOs y Responses)](#estructura-de-datos-dtos-y-responses)
3. [Servicios](#servicios)
4. [Stores (Estado Global)](#stores-estado-global)
5. [Componentes Principales](#componentes-principales)
6. [Flujo Completo](#flujo-completo)
7. [Ejemplos de Uso](#ejemplos-de-uso)
8. [Manejo de Errores](#manejo-de-errores)

---

## Endpoints del Backend

### Base URL

```
/society-profile/:societyId/flow/:flowId
```

### 1. Gestión de Gerentes y Apoderados

#### POST - Crear Gerente/Apoderado

```typescript
POST / designation - removal - manager;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney/postAttorneyFlow.ts`

**Parámetros:**

- `societyId: number` - ID de la sociedad
- `flowId: number` - ID del flujo de junta
- `dto: AttorneyDesignationRemovalDTO` - Datos del gerente/apoderado

**Body (AttorneyDesignationRemovalDTO):**

```typescript
{
  id?: number; // Opcional, para actualizar
  attorneyTypeDetailId?: number; // ID del tipo de apoderado
  attorneyTypeDetail?: {
    name: string; // Nombre del tipo (solo para nuevos tipos)
  };
  person: NaturalPersonDTO | JuridicPersonDTO; // Datos de la persona
  termOffice: "DETERMINADO" | "INDEFINIDO"; // Tipo de cargo
  startTime?: string; // Fecha de inicio (ISO string)
  finalTime?: string; // Fecha de fin (ISO string, solo si es DETERMINADO)
  action: ActionTypeState; // DESIGNATE | REMOVE | CONTINUE
  representative?: NaturalPersonDTO; // Representante legal (solo para personas jurídicas)
}
```

**Response:**

```typescript
{
  success: boolean;
  data: AttorneyDesignationRemovalResponse;
  message?: string;
}
```

#### PUT - Actualizar Gerente/Apoderado

```typescript
PUT / designation - removal - manager;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney/putAttorneyFlow.ts`

**Parámetros:**

- `societyId: number`
- `flowId: number`
- `dto: AttorneyDesignationRemovalDTO`

**Body:** Mismo que POST, pero `id` es requerido para actualizar.

**Response:**

```typescript
{
  success: boolean;
  data: AttorneyDesignationRemovalResponse;
  message?: string;
}
```

#### DELETE - Eliminar Gerente/Apoderado

```typescript
DELETE / designation - removal - manager;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney/deleteAttorneyFlow.ts`

**Parámetros:**

- `societyId: number`
- `flowId: number`
- `dto: number[]` - Array de IDs de gerentes/apoderados a eliminar

**Body:**

```typescript
[1, 2, 3]; // Array de IDs
```

**Response:**

```typescript
{
  success: boolean;
  data: boolean;
  message?: string;
}
```

#### GET - Obtener Lista de Gerentes/Apoderados

```typescript
GET / designation - removal - manager;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/getAttorneyListFlow.ts`

**Parámetros:**

- `societyId: number`
- `flowId: number`

**Response:**

```typescript
{
  success: boolean;
  data: AttorneyDesignationRemovalResponse[];
  message?: string;
}
```

#### GET - Obtener Tipos de Apoderados y Poderes

```typescript
GET / power - regime;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/getPowersAndAttorneyTypesFlow.ts`

**Parámetros:**

- `societyId: number`
- `meetingFlowId: number`

**Response:**

```typescript
{
  success: boolean;
  data: {
    id: number;
    powerType: PowerTypeDTO[];
    attorneyType: AttorneyTypeDTO[];
    attorneyPowers: AttorneyPowersDTO[];
  };
  message?: string;
}
```

### 2. Votación de Remoción

#### POST - Crear Votación de Remoción

```typescript
POST / vote - removal - manager;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/manager-attorney-designation-removal/removal-voting/postRemovalVoting.ts`

**Body:**

```typescript
{
  votes: Array<{
    managerId: number;
    vote: "FAVOR" | "CONTRA" | "ABSTENCION";
    shareholderId: number;
    shares: number;
  }>;
}
```

**Response:**

```typescript
{
  success: boolean;
  data: RemovalVotingResponse;
  message?: string;
}
```

#### GET - Obtener Votación de Remoción

```typescript
GET / manager - attorney - designation - removal / removal - vote;
```

### 3. Votación de Designación

#### POST - Crear Votación de Designación

```typescript
POST / vote - designation - manager;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/manager-attorney-designation-removal/designation-voting/postDesignationVoting.ts`

**Body:**

```typescript
{
  votes: Array<{
    managerId: number;
    vote: "FAVOR" | "CONTRA" | "ABSTENCION";
    shareholderId: number;
    shares: number;
  }>;
}
```

**Response:**

```typescript
{
  success: boolean;
  data: DesignationVotingResponse;
  message?: string;
}
```

#### GET - Obtener Votación de Designación

```typescript
GET / manager - attorney - designation - removal / designation - vote;
```

### 4. Otorgamiento de Poderes

#### POST - Crear Otorgamiento de Poderes

```typescript
POST / granting - of - powers;
```

**Nota:** Este endpoint está documentado en el informe ejecutivo pero requiere documentación adicional del módulo de poderes.

### 5. Generación de Documentos

#### POST - Generar Documentos

```typescript
POST / manager - attorney - designation - removal / generate - documents;
```

**Nota:** Este endpoint está documentado en el informe ejecutivo pero no se encontró implementación en el código actual.

---

## Estructura de Datos (DTOs y Responses)

### AttorneyDesignationRemovalDTO

**Ubicación:** `src/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.dto.ts`

```typescript
export interface AttorneyDesignationRemovalDTO extends AttorneyDesignationRemovalBase {
  attorneyTypeDetailId?: number;
  attorneyTypeDetail?: {
    name: string;
  };
}

export interface AttorneyDesignationRemovalBase {
  id?: number;
  person: NaturalPersonDTO | JuridicPersonDTO;
  termOffice: "DETERMINADO" | "INDEFINIDO";
  startTime?: string;
  finalTime?: string;
  action: ActionTypeState;
  representative?: NaturalPersonDTO; // Solo para personas jurídicas
}
```

### NaturalPersonDTO

**Ubicación:** `src/wizards/utils/person-type.response.ts`

```typescript
export interface NaturalPersonDTO {
  personId?: number;
  type: "NATURAL";
  typeDocument: DocumentTypeEnum; // DNI, PASAPORTE, CARNET_EXTRANJERIA
  documentNumber: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  countryOrigin?: string; // Solo para PASAPORTE
}
```

### JuridicPersonDTO

**Ubicación:** `src/wizards/utils/person-type.response.ts`

```typescript
export interface JuridicPersonDTO {
  personId?: number;
  type: "JURIDICA";
  typeDocument: string; // RUC
  ruc: string;
  legalName: string; // Razón social
  commercialName?: string; // Nombre comercial
  address: string;
  district?: string;
  province?: string;
  department?: string;
  country: string;
  hasConstituted: boolean; // Si está constituida en Perú
  representative?: NaturalPersonDTO; // Representante legal
}
```

### AttorneyDesignationRemovalResponse

**Ubicación:** `src/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.response.ts`

```typescript
export interface AttorneyDesignationRemovalResponse extends AttorneyDesignationRemovalBase {
  attorneyTypeDetail: AttorneyTypeDTO;
}

export interface AttorneyTypeDTO {
  id: number;
  name: string;
}
```

### Enums Importantes

#### ActionTypeState

**Ubicación:** `src/wizards/utils/enums/action-type-state.ts`

```typescript
export enum ActionTypeState {
  DESIGNATE = "DESIGNATE", // Designar
  REMOVE = "REMOVE", // Remover
  CONTINUE = "CONTINUE", // Continuar (restaurar)
  RATIFY = "RATIFY", // Ratificar
}
```

#### StatusManager

**Ubicación:** `src/utils/enums/StatusManager.enum.ts`

```typescript
export enum StatusManager {
  ACTIVO = "ACTIVO", // Gerente/Apoderado activo
  DESIGNADO = "DESIGNADO", // Recién designado en el flujo
  REMOVIDO = "REMOVIDO", // Removido en el flujo
}
```

#### TipoApoderado

**Ubicación:** `src/utils/enums/TipoApoderado.enum.ts`

```typescript
export enum TipoApoderado {
  GERENTE_GENERAL = "Gerente General",
  APODERADO = "Apoderado",
  OTRO_TIPO_DE_APODERADO = "Otro tipo de apoderado",
}
```

#### TypeDateDesignation

**Ubicación:** `src/utils/enums/DesignacionType.enum.ts`

```typescript
export enum TypeDateDesignation {
  DETERMIADO = "Tiempo determinado",
  INDETERMINADO = "Tiempo indefinido",
}
```

#### DocumentTypeEnum

**Ubicación:** `src/wizards/utils/enums/type-document.enum.ts`

```typescript
export enum DocumentTypeEnum {
  DNI = "DNI",
  PASAPORTE = "PASAPORTE",
  CARNET_EXTRANJERIA = "CARNET_EXTRANJERIA",
}
```

---

## Servicios

### AttorneyDesignationRemovalService

**Ubicación:** `src/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.service.ts`

#### Métodos Principales

##### createAttorneyFlow(dto: AttorneyDesignationRemovalDTO)

Crea un nuevo gerente/apoderado en el flujo.

```typescript
const service = new AttorneyDesignationRemovalService();
const newAttorney = await service.createAttorneyFlow({
  attorneyTypeDetailId: 1,
  person: {
    type: "NATURAL",
    typeDocument: DocumentTypeEnum.DNI,
    documentNumber: "12345678",
    firstName: "Juan",
    lastNamePaternal: "Pérez",
    lastNameMaternal: "García",
  },
  termOffice: "INDEFINIDO",
  startTime: "2024-01-01",
  action: ActionTypeState.DESIGNATE,
});
```

**Retorna:** `ListApoderados | null`

##### updateAttorneyFlow(dto: AttorneyDesignationRemovalDTO)

Actualiza el estado de un gerente/apoderado (designar, remover o continuar).

```typescript
const service = new AttorneyDesignationRemovalService();
const updated = await service.updateAttorneyFlow({
  id: 1,
  attorneyTypeDetailId: 1,
  person: {
    /* ... */
  },
  termOffice: "INDEFINIDO",
  action: ActionTypeState.REMOVE,
});
```

**Retorna:** `ListApoderados | null`

##### deleteAttorneyFlow(dto: number[])

Elimina uno o más gerentes/apoderados del flujo.

```typescript
const service = new AttorneyDesignationRemovalService();
const deleted = await service.deleteAttorneyFlow([1, 2, 3]);
```

**Retorna:** `boolean` (success)

##### getDataLocal()

Obtiene todos los datos de gerentes/apoderados y tipos disponibles del flujo.

```typescript
const service = new AttorneyDesignationRemovalService();
await service.getDataLocal();
// Los datos se actualizan automáticamente en el store
```

**Retorna:** `void`

**Nota:** Este método actualiza automáticamente el store `useStoreDRGerenteApoderado` con:

- `listApoderados`: Lista de gerentes/apoderados agrupados por tipo
- Tipos de apoderados disponibles
- Poderes disponibles

---

## Stores (Estado Global)

### useStoreDRGerenteApoderado

**Ubicación:** `src/store/juntas/designacion-remocion/gerente-apoderado/useStoreDRGerenteApoderado.ts`

#### State

```typescript
interface State {
  listApoderados: ListApoderados[];
  listActivities: ListActivities[];
}
```

#### ListApoderados

```typescript
export interface ListApoderados {
  id: number | string; // ID del tipo de apoderado
  representativeType: string; // Nombre del tipo (ej: "Gerente General")
  representativeTypeId: number; // ID del tipo
  activeData: PersonDataManagerNat | PersonDataManagerJur | null; // Datos del activo
  designatedData: PersonDataManagerNat | PersonDataManagerJur | null; // Datos del designado
  removedData: PersonDataManagerNat | PersonDataManagerJur | null; // Datos del removido
}
```

#### PersonDataManagerNat (Persona Natural)

```typescript
export interface PersonDataManagerNat {
  id: number | string;
  personId: number;
  statusManager: StatusManager;
  type: "naturalPerson";
  typeDocument: IdentificationType;
  documentNumber: string;
  name: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  countryOrigin: string;
  positionValidity: TypeDateDesignation;
  startDate: string;
  endDate: string;
}
```

#### PersonDataManagerJur (Persona Jurídica)

```typescript
export interface PersonDataManagerJur {
  id: number | string;
  personId: number;
  statusManager: StatusManager;
  type: "juridicPerson";
  typeDocument: IdentificationType | string;
  documentNumber: string;
  reasonSocial: string;
  comercialName: string;
  direction: string;
  isCreatedInPeru: boolean;
  createdCountry: string;
  represent: {
    type: "naturalPerson";
    typeDocument: IdentificationType;
    documentNumber: string;
    name: string;
    lastNamePaternal: string;
    lastNameMaternal: string;
    countryOrigin: string;
  };
  positionValidity: TypeDateDesignation;
  startDate: string;
  endDate: string;
}
```

#### Getters

##### getListActivities

Retorna lista de actividades (designaciones y remociones) en el flujo.

```typescript
const store = useStoreDRGerenteApoderado();
const activities = store.getListActivities;
```

##### haveAssignmentManager

Valida si hay designaciones o remociones y determina el siguiente paso.

```typescript
const store = useStoreDRGerenteApoderado();
const validation = store.haveAssignmentManager;
// {
//   validate: boolean,
//   isNextStep?: boolean, // Si va al siguiente paso (VOTACION_8) o a PODERES_7
//   representative: string
// }
```

#### Actions

##### getListApoderado(listApoderados: ListApoderados[])

Actualiza la lista de gerentes/apoderados.

```typescript
const store = useStoreDRGerenteApoderado();
store.getListApoderado(listaApoderados);
```

##### addApoderado(apoderado: ListApoderados)

Agrega un nuevo gerente/apoderado a la lista.

```typescript
const store = useStoreDRGerenteApoderado();
store.addApoderado(nuevoApoderado);
```

---

## Componentes Principales

### DesignacionRemocionGerenteApoderado.vue

**Ubicación:** `src/components/Views/DesignarGerenteApoderado/D-R-GerenteApoderadoSection/DesignacionRemocionGerenteApoderado.vue`

**Descripción:** Componente principal para designar y remover gerentes/apoderados.

**Props:**

```typescript
interface Props {
  isPreview?: boolean; // Si está en modo preview
}
```

**Funcionalidad:**

- Muestra lista de gerentes/apoderados por tipo
- Permite designar nuevos gerentes/apoderados
- Permite remover gerentes/apoderados existentes
- Permite restaurar gerentes/apoderados removidos
- Muestra actividad reciente

### useHandleDRGerenteApoderado

**Ubicación:** `src/components/Views/DesignarGerenteApoderado/D-R-GerenteApoderadoSection/useHandleDRGerenteApoderado.ts`

**Descripción:** Composable que maneja la lógica de designación y remoción.

**Retorna:**

```typescript
{
  storeDRGerenteApoderado: Store; // Store de gerentes/apoderados
  isOpenModal: Ref<boolean>;
  isLoadingDesignate: Ref<boolean>;
  isLoadingRemovedById: (id: string | number) => boolean;
  isLoadingRefreshById: (id: string | number) => boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleRefresh: (id: number | string) => Promise<void>; // Restaurar removido
  handleRemoveManager: (id: number | string) => Promise<void>; // Remover
  handleSubmitModal: () => Promise<void>; // Designar
  handleSubmitEditModal: () => void;
}
```

**Ejemplo de uso:**

```typescript
const {
  storeDRGerenteApoderado,
  handleRemoveManager,
  handleOpenModal,
  handleSubmitModal,
  isOpenModal,
} = useHandleDRGerenteApoderado(false);

// Designar gerente/apoderado
await handleSubmitModal();

// Remover gerente/apoderado
await handleRemoveManager(1);
```

---

## Flujo Completo

### 1. Inicialización del Flujo

```typescript
// 1. Obtener datos de gerentes/apoderados y tipos disponibles
const service = new AttorneyDesignationRemovalService();
await service.getDataLocal();

// Esto actualiza automáticamente el store con:
// - listApoderados (agrupados por tipo)
// - Tipos de apoderados disponibles
// - Poderes disponibles
```

### 2. Designar un Gerente/Apoderado

#### 2.1. Gerente General

```typescript
// 1. Preparar datos del gerente
const newManager = {
  attorneyTypeDetailId: findManager.representativeTypeId,
  person: {
    type: "NATURAL",
    typeDocument: DocumentTypeEnum.DNI,
    documentNumber: "12345678",
    firstName: "Juan",
    lastNamePaternal: "Pérez",
    lastNameMaternal: "García",
  },
  termOffice: "INDEFINIDO",
  startTime: new Date().toISOString().split("T")[0],
  action: ActionTypeState.DESIGNATE,
};

// 2. Si hay un gerente activo, removerlo primero
if (findManager.activeData) {
  const removedDto = {
    id: Number(findManager.activeData.id),
    attorneyTypeDetailId: findManager.representativeTypeId,
    person: /* datos del activo */,
    termOffice: "INDEFINIDO",
    startTime: new Date().toISOString().split("T")[0],
    action: ActionTypeState.REMOVE,
  };
  await service.updateAttorneyFlow(removedDto);
}

// 3. Designar nuevo gerente
const designedAttorney = findManager.designatedData
  ? await service.updateAttorneyFlow(newManager)
  : await service.createAttorneyFlow(newManager);

// 4. Actualizar store local
if (designedAttorney) {
  findManager.designatedData = designedAttorney.designatedData;
  findManager.activeData = removedAttorney?.activeData || null;
  findManager.removedData = removedAttorney?.removedData || null;
}
```

#### 2.2. Apoderado Existente

```typescript
// 1. Preparar datos del apoderado
const newAttorney = {
  id: findApoderado.designatedData
    ? Number(findApoderado.designatedData.id)
    : undefined,
  attorneyTypeDetailId: findApoderado.representativeTypeId,
  person: {
    type: "NATURAL",
    typeDocument: DocumentTypeEnum.DNI,
    documentNumber: "12345678",
    firstName: "María",
    lastNamePaternal: "González",
    lastNameMaternal: "López",
  },
  termOffice: positionValidity === TypeDateDesignation.INDETERMINADO
    ? "INDEFINIDO"
    : "DETERMINADO",
  startTime: startDate !== "" ? startDate : new Date().toISOString().split("T")[0],
  finalTime: endDate !== "" ? endDate : undefined,
  action: ActionTypeState.DESIGNATE,
};

// 2. Si hay un apoderado activo, removerlo primero
if (findApoderado.activeData) {
  const removedDto = {
    id: Number(findApoderado.activeData.id),
    attorneyTypeDetailId: findApoderado.representativeTypeId,
    person: /* datos del activo */,
    termOffice: /* ... */,
    action: ActionTypeState.REMOVE,
  };
  await service.updateAttorneyFlow(removedDto);
}

// 3. Designar nuevo apoderado
const designedAttorney = findApoderado.designatedData
  ? await service.updateAttorneyFlow(newAttorney)
  : await service.createAttorneyFlow(newAttorney);

// 4. Actualizar store local
if (designedAttorney) {
  findApoderado.designatedData = designedAttorney.designatedData;
  findApoderado.activeData = removedAttorney?.activeData || null;
  findApoderado.removedData = removedAttorney?.removedData || null;
}
```

#### 2.3. Nuevo Tipo de Apoderado

```typescript
// 1. Preparar datos del nuevo tipo de apoderado
const newAttorneyType = {
  attorneyTypeDetail: {
    name: "Nuevo Tipo de Apoderado",
  },
  person: {
    type: "NATURAL",
    typeDocument: DocumentTypeEnum.DNI,
    documentNumber: "12345678",
    firstName: "Carlos",
    lastNamePaternal: "Rodríguez",
    lastNameMaternal: "Sánchez",
  },
  termOffice: "DETERMINADO",
  startTime: "2024-01-01",
  finalTime: "2027-01-01",
  action: ActionTypeState.DESIGNATE,
};

// 2. Crear nuevo apoderado
const designedAttorney = await service.createAttorneyFlow(newAttorneyType);

// 3. Agregar al store
if (designedAttorney) {
  storeDRGerenteApoderado.addApoderado(designedAttorney);
}
```

### 3. Remover un Gerente/Apoderado

```typescript
// 1. Encontrar gerente/apoderado en el store
const findApoderado = storeDRGerenteApoderado.listApoderados.find((item) => item.id === id);

if (!findApoderado || !findApoderado.activeData) {
  toastMessage("error", "No se encontró el gerente/apoderado");
  return;
}

// 2. Preparar DTO para remover
const removedDto: AttorneyDesignationRemovalDTO = {
  id: Number(findApoderado.activeData.id),
  attorneyTypeDetailId: findApoderado.representativeTypeId,
  person: AttorneyDesignationRemovalMapper.handleGetPersonAttorney(findApoderado.activeData),
  termOffice:
    findApoderado.activeData.positionValidity === TypeDateDesignation.INDETERMINADO
      ? "INDEFINIDO"
      : "DETERMINADO",
  startTime:
    findApoderado.activeData.startDate !== ""
      ? findApoderado.activeData.startDate
      : new Date().toISOString().split("T")[0],
  finalTime:
    findApoderado.activeData.endDate !== "" ? findApoderado.activeData.endDate : undefined,
  action: ActionTypeState.REMOVE,
};

// 3. Remover
const removedAttorney = await service.updateAttorneyFlow(removedDto);

// 4. Actualizar store local
if (removedAttorney) {
  findApoderado.activeData = removedAttorney.activeData;
  findApoderado.removedData = removedAttorney.removedData;
}
```

### 4. Restaurar un Gerente/Apoderado Removido

```typescript
// 1. Encontrar gerente/apoderado en el store
const findApoderado = storeDRGerenteApoderado.listApoderados.find((item) => item.id === id);

if (!findApoderado || !findApoderado.removedData) {
  toastMessage("error", "No hay datos para restaurar");
  return;
}

// 2. Eliminar designación si existe
if (findApoderado.designatedData) {
  const deleteResponse = await service.deleteAttorneyFlow([
    Number(findApoderado.designatedData.id),
  ]);
  if (deleteResponse) {
    findApoderado.designatedData = null;
  }
}

// 3. Restaurar removido a activo
const restoreData: AttorneyDesignationRemovalDTO = {
  id: Number(findApoderado.removedData.id),
  attorneyTypeDetailId: findApoderado.representativeTypeId,
  person: AttorneyDesignationRemovalMapper.handleGetPersonAttorney(findApoderado.removedData),
  termOffice:
    findApoderado.removedData.positionValidity === TypeDateDesignation.INDETERMINADO
      ? "INDEFINIDO"
      : "DETERMINADO",
  startTime:
    findApoderado.removedData.startDate !== ""
      ? findApoderado.removedData.startDate
      : new Date().toISOString().split("T")[0],
  finalTime:
    findApoderado.removedData.endDate !== "" ? findApoderado.removedData.endDate : undefined,
  action: ActionTypeState.CONTINUE, // CONTINUE restaura a activo
};

// 4. Restaurar
const restoredPerson = await service.updateAttorneyFlow(restoreData);

// 5. Actualizar store local
if (restoredPerson) {
  findApoderado.activeData = restoredPerson.activeData;
  findApoderado.removedData = restoredPerson.removedData;
}
```

### 5. Eliminar Gerente/Apoderado del Flujo

```typescript
// 1. Eliminar gerente/apoderado
const service = new AttorneyDesignationRemovalService();
const deleted = await service.deleteAttorneyFlow([attorneyId]);

// 2. Actualizar store local
if (deleted) {
  const store = useStoreDRGerenteApoderado();
  const findApoderado = store.listApoderados.find(
    (item) => item.designatedData?.id === attorneyId
  );
  if (findApoderado) {
    findApoderado.designatedData = null;
  }
}
```

### 6. Votación de Remoción

```typescript
// 1. Preparar votos
const votes = [
  {
    managerId: 1,
    vote: "FAVOR",
    shareholderId: 10,
    shares: 100,
  },
  // ... más votos
];

// 2. Enviar votación
const response = await postRemovalVoting(societyId, flowId, { votes });
```

### 7. Votación de Designación

```typescript
// 1. Preparar votos
const votes = [
  {
    managerId: 2,
    vote: "FAVOR",
    shareholderId: 10,
    shares: 100,
  },
  // ... más votos
];

// 2. Enviar votación
const response = await postDesignationVoting(societyId, flowId, { votes });
```

---

## Ejemplos de Uso

### Ejemplo 1: Designar Gerente General (Persona Natural)

```typescript
import { AttorneyDesignationRemovalService } from "@/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.service";
import { ActionTypeState } from "@/wizards/utils/enums/action-type-state";
import { DocumentTypeEnum } from "@/wizards/utils/enums/type-document.enum";
import { useStoreDRGerenteApoderado } from "@/store/juntas/designacion-remocion/gerente-apoderado/useStoreDRGerenteApoderado";
import { toastMessage } from "@/utils/toastMessage";

const service = new AttorneyDesignationRemovalService();
const store = useStoreDRGerenteApoderado();

// Encontrar gerente general
const findManager = store.listApoderados.find(
  (item) => item.representativeType.toString().toUpperCase() === "GERENTE GENERAL"
);

if (!findManager) {
  toastMessage("error", "No se encontró el gerente general");
  return;
}

const newManager = {
  id: findManager.designatedData ? Number(findManager.designatedData.id) : undefined,
  attorneyTypeDetailId: findManager.representativeTypeId,
  person: {
    type: "NATURAL",
    typeDocument: DocumentTypeEnum.DNI,
    documentNumber: "12345678",
    firstName: "Juan",
    lastNamePaternal: "Pérez",
    lastNameMaternal: "García",
  },
  termOffice: "INDEFINIDO",
  startTime: new Date().toISOString().split("T")[0],
  action: ActionTypeState.DESIGNATE,
};

try {
  // Si hay gerente activo, removerlo primero
  if (findManager.activeData) {
    const removedDto = {
      id: Number(findManager.activeData.id),
      attorneyTypeDetailId: findManager.representativeTypeId,
      person: /* datos del activo */,
      termOffice: "INDEFINIDO",
      startTime: new Date().toISOString().split("T")[0],
      action: ActionTypeState.REMOVE,
    };
    const removedAttorney = await service.updateAttorneyFlow(removedDto);
    if (removedAttorney) {
      findManager.activeData = removedAttorney.activeData;
      findManager.removedData = removedAttorney.removedData;
    }
  }

  // Designar nuevo gerente
  const designedAttorney = findManager.designatedData
    ? await service.updateAttorneyFlow(newManager)
    : await service.createAttorneyFlow(newManager);

  if (designedAttorney) {
    findManager.designatedData = designedAttorney.designatedData;
    toastMessage("success", "Gerente general designado correctamente");
  } else {
    toastMessage("error", "Error al designar el gerente general");
  }
} catch (error) {
  console.error("Error:", error);
  toastMessage("error", "Error al designar el gerente general");
}
```

### Ejemplo 2: Designar Apoderado con Tiempo Determinado

```typescript
import { AttorneyDesignationRemovalService } from "@/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.service";
import { ActionTypeState } from "@/wizards/utils/enums/action-type-state";
import { DocumentTypeEnum } from "@/wizards/utils/enums/type-document.enum";
import { TypeDateDesignation } from "@/utils/enums/DesignacionType.enum";
import { useStoreDRGerenteApoderado } from "@/store/juntas/designacion-remocion/gerente-apoderado/useStoreDRGerenteApoderado";

const service = new AttorneyDesignationRemovalService();
const store = useStoreDRGerenteApoderado();

// Encontrar apoderado por ID de tipo
const apoderadoId = 5; // ID del tipo de apoderado
const findApoderado = store.listApoderados.find(
  (item) => item.representativeTypeId === apoderadoId
);

if (!findApoderado) {
  toastMessage("error", "No se encontró el apoderado");
  return;
}

const newAttorney = {
  id: findApoderado.designatedData
    ? Number(findApoderado.designatedData.id)
    : undefined,
  attorneyTypeDetailId: findApoderado.representativeTypeId,
  person: {
    type: "NATURAL",
    typeDocument: DocumentTypeEnum.DNI,
    documentNumber: "87654321",
    firstName: "María",
    lastNamePaternal: "González",
    lastNameMaternal: "López",
  },
  termOffice: "DETERMINADO",
  startTime: "2024-01-01",
  finalTime: "2027-01-01",
  action: ActionTypeState.DESIGNATE,
};

try {
  // Si hay apoderado activo, removerlo primero
  if (findApoderado.activeData) {
    const removedDto = {
      id: Number(findApoderado.activeData.id),
      attorneyTypeDetailId: findApoderado.representativeTypeId,
      person: /* datos del activo */,
      termOffice: "DETERMINADO",
      startTime: findApoderado.activeData.startDate,
      finalTime: findApoderado.activeData.endDate,
      action: ActionTypeState.REMOVE,
    };
    const removedAttorney = await service.updateAttorneyFlow(removedDto);
    if (removedAttorney) {
      findApoderado.activeData = removedAttorney.activeData;
      findApoderado.removedData = removedAttorney.removedData;
    }
  }

  // Designar nuevo apoderado
  const designedAttorney = findApoderado.designatedData
    ? await service.updateAttorneyFlow(newAttorney)
    : await service.createAttorneyFlow(newAttorney);

  if (designedAttorney) {
    findApoderado.designatedData = designedAttorney.designatedData;
    toastMessage("success", "Apoderado designado correctamente");
  }
} catch (error) {
  console.error("Error:", error);
  toastMessage("error", "Error al designar el apoderado");
}
```

### Ejemplo 3: Remover Gerente/Apoderado

```typescript
import { AttorneyDesignationRemovalService } from "@/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.service";
import { ActionTypeState } from "@/wizards/utils/enums/action-type-state";
import { AttorneyDesignationRemovalMapper } from "@/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.mapper";
import { TypeDateDesignation } from "@/utils/enums/DesignacionType.enum";
import { useStoreDRGerenteApoderado } from "@/store/juntas/designacion-remocion/gerente-apoderado/useStoreDRGerenteApoderado";
import { toastMessage } from "@/utils/toastMessage";

const service = new AttorneyDesignationRemovalService();
const store = useStoreDRGerenteApoderado();

const handleRemoveManager = async (id: number | string) => {
  const findApoderado = store.listApoderados.find((item) => item.id === id);

  if (!findApoderado || !findApoderado.activeData) {
    toastMessage("error", "No se encontró el gerente/apoderado");
    return;
  }

  const newDate = new Date().toISOString().split("T")[0];

  try {
    const removedDto = {
      id: Number(findApoderado.activeData.id),
      attorneyTypeDetailId: findApoderado.representativeTypeId,
      person: AttorneyDesignationRemovalMapper.handleGetPersonAttorney(
        findApoderado.activeData
      ),
      termOffice:
        findApoderado.activeData.positionValidity === TypeDateDesignation.INDETERMINADO
          ? "INDEFINIDO"
          : "DETERMINADO",
      startTime:
        findApoderado.activeData.startDate !== ""
          ? findApoderado.activeData.startDate
          : newDate,
      finalTime:
        findApoderado.activeData.endDate !== "" ? findApoderado.activeData.endDate : undefined,
      action: ActionTypeState.REMOVE,
    };

    const removedAttorney = await service.updateAttorneyFlow(removedDto);

    if (removedAttorney) {
      findApoderado.activeData = removedAttorney.activeData;
      findApoderado.removedData = removedAttorney.removedData;
      toastMessage("success", "Gerente/Apoderado removido correctamente");
    } else {
      toastMessage("error", "Error al remover el gerente/apoderado");
    }
  } catch (error) {
    console.error("Error:", error);
    toastMessage("error", "Error al remover el gerente/apoderado");
  }
};
```

### Ejemplo 4: Cargar Datos del Flujo

```typescript
import { AttorneyDesignationRemovalService } from "@/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.service";
import { useStoreDRGerenteApoderado } from "@/store/juntas/designacion-remocion/gerente-apoderado/useStoreDRGerenteApoderado";
import { ref } from "vue";

const service = new AttorneyDesignationRemovalService();
const store = useStoreDRGerenteApoderado();
const isLoading = ref(false);

const loadData = async () => {
  isLoading.value = true;
  try {
    await service.getDataLocal();
    // Los datos se actualizan automáticamente en el store:
    // - store.listApoderados (agrupados por tipo)
    // - Tipos de apoderados disponibles
    // - Poderes disponibles
  } catch (error) {
    console.error("Error al cargar datos:", error);
    toastMessage("error", "Error al cargar los datos de gerentes/apoderados");
  } finally {
    isLoading.value = false;
  }
};

// Llamar al montar el componente
onMounted(() => {
  loadData();
});
```

### Ejemplo 5: Designar Persona Jurídica como Gerente

```typescript
import { AttorneyDesignationRemovalService } from "@/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.service";
import { ActionTypeState } from "@/wizards/utils/enums/action-type-state";
import { useStoreDRGerenteApoderado } from "@/store/juntas/designacion-remocion/gerente-apoderado/useStoreDRGerenteApoderado";

const service = new AttorneyDesignationRemovalService();
const store = useStoreDRGerenteApoderado();

const findManager = store.listApoderados.find(
  (item) => item.representativeType.toString().toUpperCase() === "GERENTE GENERAL"
);

const newManager = {
  id: findManager.designatedData ? Number(findManager.designatedData.id) : undefined,
  attorneyTypeDetailId: findManager.representativeTypeId,
  person: {
    type: "JURIDICA",
    typeDocument: "RUC",
    ruc: "20123456789",
    legalName: "Empresa XYZ S.A.C.",
    commercialName: "XYZ",
    address: "Av. Principal 123",
    country: "Perú",
    hasConstituted: true,
  },
  termOffice: "INDEFINIDO",
  startTime: new Date().toISOString().split("T")[0],
  action: ActionTypeState.DESIGNATE,
  representative: {
    // Representante legal (requerido para personas jurídicas)
    type: "NATURAL",
    typeDocument: DocumentTypeEnum.DNI,
    documentNumber: "12345678",
    firstName: "Juan",
    lastNamePaternal: "Pérez",
    lastNameMaternal: "García",
  },
};

const designedAttorney = await service.createAttorneyFlow(newManager);
if (designedAttorney) {
  findManager.designatedData = designedAttorney.designatedData;
}
```

---

## Manejo de Errores

### Errores Comunes

#### 1. Gerente/Apoderado no encontrado

```typescript
const findApoderado = store.listApoderados.find((item) => item.id === id);
if (!findApoderado) {
  toastMessage("error", "No se encontró el gerente/apoderado");
  return;
}
```

#### 2. Error al crear gerente/apoderado

```typescript
const createdAttorney = await service.createAttorneyFlow(newAttorney);
if (!createdAttorney) {
  toastMessage("error", "Error al crear el gerente/apoderado. Inténtalo de nuevo.");
  return;
}
```

#### 3. Error al actualizar gerente/apoderado

```typescript
const updated = await service.updateAttorneyFlow(dto);
if (!updated) {
  toastMessage("error", "Error al actualizar el gerente/apoderado. Inténtalo de nuevo.");
  return;
}
```

#### 4. Validación de tipo de apoderado duplicado

```typescript
const findDuplicateApoderado = store.listApoderados.find(
  (item) => item.representativeType.toString().toUpperCase() === newApoderado.toUpperCase()
);

if (findDuplicateApoderado) {
  toastMessage("warning", "Ya existe una clase de apoderado con el mismo nombre");
  return;
}
```

#### 5. Validación de datos requeridos para persona jurídica

```typescript
// Para personas jurídicas, se requiere representante legal
if (person.type === "JURIDICA" && !person.representative) {
  toastMessage("error", "Las personas jurídicas requieren un representante legal");
  return;
}
```

### Try-Catch en Servicios

Los servicios ya manejan errores internamente y retornan `null` o `false` en caso de error:

```typescript
// En AttorneyDesignationRemovalService
async createAttorneyFlow(dto: AttorneyDesignationRemovalDTO) {
  try {
    // ... lógica
    return mapper;
  } catch (error) {
    console.log("❌ Error inesperado en createAttorneyFlow:", error);
    return null; // Retorna null en caso de error
  }
}
```

### Logging de Errores

Todos los servicios incluyen logging de errores:

```typescript
catch (error) {
  console.error("Error al designar o remover gerente/apoderado:", error);
  throw error; // Re-lanzar para manejo superior
}
```

---

## Resumen de Archivos Clave

### APIs (Llamadas HTTP)

- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney/postAttorneyFlow.ts`
- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney/putAttorneyFlow.ts`
- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney/deleteAttorneyFlow.ts`
- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/getAttorneyListFlow.ts`
- `src/api/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/getPowersAndAttorneyTypesFlow.ts`
- `src/api/shareholders-meeting/manager-attorney-designation-removal/removal-voting/postRemovalVoting.ts`
- `src/api/shareholders-meeting/manager-attorney-designation-removal/designation-voting/postDesignationVoting.ts`

### Servicios

- `src/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.service.ts`

### Stores

- `src/store/juntas/designacion-remocion/gerente-apoderado/useStoreDRGerenteApoderado.ts`

### Componentes

- `src/components/Views/DesignarGerenteApoderado/D-R-GerenteApoderadoSection/DesignacionRemocionGerenteApoderado.vue`
- `src/components/Views/DesignarGerenteApoderado/D-R-GerenteApoderadoSection/useHandleDRGerenteApoderado.ts`

### DTOs y Responses

- `src/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.dto.ts`
- `src/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.response.ts`

### Mappers

- `src/wizards/shareholders-meeting/attorney-designation-removal/attorney-designation-removal/attorney-designation-removal.mapper.ts`

---

## Notas Importantes

1. **IDs Requeridos:**

   - `societyId`: Se obtiene de `useAppStore().societySelectData.id`
   - `flowId`: Se obtiene de `useTypeMeetingStore().meetingFlowId`

2. **Persistencia:**

   - El store `useStoreDRGerenteApoderado` tiene persistencia habilitada con la key `"D/R-GerenteApoderado"`

3. **Estados del Gerente/Apoderado:**

   - `ACTIVO`: Gerente/Apoderado activo en la sociedad
   - `DESIGNADO`: Gerente/Apoderado recién designado en el flujo
   - `REMOVIDO`: Gerente/Apoderado removido en el flujo

4. **Tipos de Cargo:**

   - `DETERMINADO`: Cargo con fecha de inicio y fin
   - `INDEFINIDO`: Cargo sin fecha de fin

5. **Tipos de Apoderado:**

   - `GERENTE_GENERAL`: Gerente general de la sociedad
   - `APODERADO`: Apoderado estándar
   - `OTRO_TIPO_DE_APODERADO`: Nuevo tipo de apoderado personalizado

6. **Personas Jurídicas:**

   - Requieren un representante legal (persona natural)
   - El representante se envía en el campo `representative` del DTO

7. **Flujo de Designación/Remoción:**

   - Al designar un nuevo gerente/apoderado, si hay uno activo, se remueve automáticamente
   - Los datos se organizan en `activeData`, `designatedData` y `removedData`
   - Se puede restaurar un removido usando `ActionTypeState.CONTINUE`

8. **Agrupación por Tipo:**

   - Los gerentes/apoderados se agrupan por `attorneyTypeDetailId`
   - Cada tipo puede tener solo un activo, pero puede tener designado y removido simultáneamente

---

**Última actualización:** 2024
**Versión del documento:** 1.0
