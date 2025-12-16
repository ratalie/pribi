# Documentación Backend: Nombramiento y Remoción de Directores

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

### 1. Gestión de Directores

#### POST - Crear Director

```typescript
POST / designation - removal / director;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/directors-designation-removal/postDirectorFlow.ts`

**Parámetros:**

- `idSociety: number` - ID de la sociedad
- `flowId: number` - ID del flujo de junta
- `dto: DirectorFlowDTO` - Datos del director

**Body (DirectorFlowDTO):**

```typescript
{
  docType: DocumentTypeEnum;           // Tipo de documento (DNI, PASAPORTE, etc.)
  docNumber: string;                    // Número de documento
  issuingCountry?: string;              // País emisor (opcional, solo para PASAPORTE)
  firstName: string;                    // Nombre
  lastNamePaternal: string;            // Apellido paterno
  lastNameMaternal: string;             // Apellido materno
  directorRole: DirectoryType;          // Tipo de director (TITULAR, SUPLENTE, ALTERNO)
  replacesId?: number;                 // ID del director que reemplaza (opcional)
  action: ActionTypeState;             // Acción: DESIGNATE | REMOVE
}
```

**Response:**

```typescript
{
  success: boolean;
  data: DirectorFlowResponse;
  message?: string;
}
```

#### PUT - Actualizar Director

```typescript
PUT / designation - removal / director;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/directors-designation-removal/putDirectorFlow.ts`

**Parámetros:**

- `idSociety: number`
- `flowId: number`
- `dto: DirectorFlowEditDTO`

**Body (DirectorFlowEditDTO):**

```typescript
{
  id: number; // ID del director a actualizar
  action: ActionTypeState; // Acción: DESIGNATE | REMOVE
}
```

**Response:**

```typescript
{
  success: boolean;
  data: DirectorFlowResponse;
  message?: string;
}
```

#### DELETE - Eliminar Director

```typescript
DELETE / designation - removal / director;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/directors-designation-removal/deleteDirectorFlow.ts`

**Parámetros:**

- `idSociety: number`
- `flowId: number`
- `dto: number[]` - Array de IDs de directores a eliminar

**Body:**

```typescript
[1, 2, 3]; // Array de IDs
```

**Response:**

```typescript
{
  success: boolean;
  data: DirectorResponse;
  message?: string;
}
```

#### GET - Obtener Directorio Completo

```typescript
GET / designation - removal;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/directors-designation-removal/getDirectoryFlow.ts`

**Parámetros:**

- `idSociety: number`
- `flowId: number`

**Response:**

```typescript
{
  success: boolean;
  data: DirectoryFlowResponse;
  message?: string;
}
```

### 2. Votación de Cantidad de Directores

#### GET - Obtener Votación de Cantidad

```typescript
GET / vote - count - director;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/directors-quantity-voting/getQuantityVoting.ts`

**Response:**

```typescript
{
  success: boolean;
  data: DirectorsQuantityVotingResponse;
  message?: string;
}
```

#### POST - Crear Votación de Cantidad

```typescript
POST / vote - count - director;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/directors-quantity-voting/postQuantityVoting.ts`

**Body:**

```typescript
{
  proposedQuantity: number; // Cantidad propuesta
  votes: Array<{
    shareholderId: number;
    vote: "FAVOR" | "CONTRA" | "ABSTENCION";
    shares: number;
  }>;
}
```

#### PUT - Actualizar Votación de Cantidad

```typescript
PUT / vote - count - director;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/directors-quantity-voting/putQuantityVoting.ts`

### 3. Votación de Remoción

#### POST - Crear Votación de Remoción

```typescript
POST / vote - removal;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/removal-voting/postRemovalVoting.ts`

**Body:**

```typescript
{
  votes: Array<{
    directorId: number;
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
  data: DirectorsRemovalVotingResponse;
  message?: string;
}
```

#### GET - Obtener Votación de Remoción

```typescript
GET / vote - removal;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/removal-voting/getRemovalVoting.ts`

### 4. Votación de Designación

#### POST - Crear Votación de Designación

```typescript
POST / vote - designation;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/designation-voting/postDesignationVoting.ts`

**Body:**

```typescript
{
  votes: Array<{
    directorId: number;
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
  data: DirectorsDesignationVotingResponse;
  message?: string;
}
```

#### GET - Obtener Votación de Designación

```typescript
GET / vote - designation;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/designation-voting/getDesignationVoting.ts`

### 5. Generación de Documentos

#### POST - Generar Documentos

```typescript
POST / director - designation - removal / generate - documents;
```

**Nota:** Este endpoint está documentado en el informe ejecutivo pero no se encontró implementación en el código actual.

---

## Estructura de Datos (DTOs y Responses)

### DirectorFlowDTO

**Ubicación:** `src/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.dto.ts`

```typescript
export interface DirectorFlowDTO extends DirectorDto {
  action: ActionTypeState; // DESIGNATE | REMOVE
}

export interface DirectorFlowEditDTO {
  id: number;
  action: ActionTypeState;
}
```

### DirectorDto (Base)

**Ubicación:** `src/wizards/society-profile/directorio/directory-dto.type.ts`

```typescript
export interface DirectorDto {
  id?: number;
  docType: DocumentTypeEnum; // DNI, PASAPORTE, CARNET_EXTRANJERIA
  docNumber: string;
  issuingCountry?: string; // Solo para PASAPORTE
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  directorRole: DirectoryType; // TITULAR, SUPLENTE, ALTERNO
  replacesId?: number; // ID del director que reemplaza
}
```

### DirectorFlowResponse

**Ubicación:** `src/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.response.ts`

```typescript
export interface DirectorFlowResponse extends DirectorResponse {
  action: ActionTypeState;
}

export interface DirectorResponse {
  id: number;
  person: Person;
  directorRole: DirectoryType;
  replacesId?: number;
}

export interface Person {
  personId: number;
  type: string;
  typeDocument: DocumentTypeEnum;
  documentNumber: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  issuingCountry?: string;
}
```

### DirectoryFlowResponse

**Ubicación:** `src/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.response.ts`

```typescript
export interface DirectoryFlowResponse {
  id: number;
  directorCount?: number; // Cantidad de directores
  minDirectors?: number; // Mínimo de directores
  maxDirectors?: number; // Máximo de directores
  customCount: boolean; // Si la cantidad es personalizada
  term: string; // Duración del directorio
  termStart: string; // Fecha de inicio (ISO string)
  termEnd: string; // Fecha de fin (ISO string)
  minQuorum: number; // Quórum mínimo
  majority: number; // Mayoría requerida
  presidentAppointed: boolean; // Si hay presidente designado
  secretaryAssigned: boolean; // Si hay secretario asignado
  reelectionAllowed: boolean; // Si se permite reelección
  presidentChairs: boolean; // Si el presidente preside
  presidentTiebreak: boolean; // Si el presidente tiene voto de calidad
  presidentId: number | null; // ID del presidente
  directors: DirectorFlowResponse[]; // Lista de directores
}
```

### Enums Importantes

#### ActionTypeState

**Ubicación:** `src/wizards/utils/enums/action-type-state.ts`

```typescript
export enum ActionTypeState {
  DESIGNATE = "DESIGNATE", // Designar
  REMOVE = "REMOVE", // Remover
  RATIFY = "RATIFY", // Ratificar
}
```

#### DirectoryType

**Ubicación:** `src/components/Views/DatosDeSociedades/Directorio/Directores/DirectoryType.enum.ts`

```typescript
export enum DirectoryType {
  TITULAR = "TITULAR", // Director titular
  SUPLENTE = "SUPLENTE", // Director suplente
  ALTERNO = "ALTERNO", // Director alterno
}
```

#### StatusDirector

**Ubicación:** `src/utils/enums/StatusDirector.enum.ts`

```typescript
export enum StatusDirector {
  ACTIVO = "ACTIVO", // Director activo
  DESIGNADO = "DESIGNADO", // Director designado
  REMOVIDO = "REMOVIDO", // Director removido
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

### DirectorsDesignationRemovalService

**Ubicación:** `src/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.service.ts`

#### Métodos Principales

##### createDirectorFlow(dto: DirectorFlowDTO)

Crea un nuevo director en el flujo.

```typescript
const service = new DirectorsDesignationRemovalService();
const newDirector = await service.createDirectorFlow({
  docType: DocumentTypeEnum.DNI,
  docNumber: "12345678",
  firstName: "Juan",
  lastNamePaternal: "Pérez",
  lastNameMaternal: "García",
  directorRole: DirectoryType.TITULAR,
  action: ActionTypeState.DESIGNATE,
});
```

**Retorna:** `Director | null`

##### updateDirectorFlow(dto: DirectorFlowEditDTO)

Actualiza el estado de un director (designar o remover).

```typescript
const service = new DirectorsDesignationRemovalService();
const updated = await service.updateDirectorFlow({
  id: 1,
  action: ActionTypeState.REMOVE,
});
```

**Retorna:** `boolean` (success)

##### deleteDirectorFlow(dto: number[])

Elimina uno o más directores del flujo.

```typescript
const service = new DirectorsDesignationRemovalService();
const deleted = await service.deleteDirectorFlow([1, 2, 3]);
```

**Retorna:** `boolean` (success)

##### getDataLocal()

Obtiene todos los datos del directorio y los directores del flujo.

```typescript
const service = new DirectorsDesignationRemovalService();
await service.getDataLocal();
// Los datos se actualizan automáticamente en el store
```

**Retorna:** `void`

**Nota:** Este método actualiza automáticamente el store `useDesiRemoDirectorio` con:

- `directorsCount`: Cantidad de directores
- `directoryDuration`: Duración del directorio
- `startDate`: Fecha de inicio
- `endDate`: Fecha de fin
- `listaDirectores`: Lista de directores

### DirectorsQuantityVotingService

**Ubicación:** `src/wizards/shareholders-meeting/director-designation-removal/directors-quantity-voting/directors-quantity-voting.service.ts`

#### Métodos Principales

##### upsert()

Crea o actualiza la votación de cantidad de directores.

```typescript
const service = new DirectorsQuantityVotingService();
await service.upsert();
```

##### get()

Obtiene la votación de cantidad de directores.

```typescript
const service = new DirectorsQuantityVotingService();
await service.get();
```

##### getDataLocal()

Obtiene todos los datos necesarios para la votación:

- Directorio (cantidad mínima/máxima)
- Quórum y mayorías
- Accionistas con acciones

```typescript
const service = new DirectorsQuantityVotingService();
await service.getDataLocal();
```

---

## Stores (Estado Global)

### useDesiRemoDirectorio

**Ubicación:** `src/components/Views/DesignacionDirector/useDesigRemoDirector.ts`

#### State

```typescript
interface State {
  presidenteAsistio: boolean;
  secretarioAsistio: boolean;
  directorsCount?: number; // Cantidad de directores
  directoryDuration: string; // Duración del directorio
  startDate: string; // Fecha de inicio
  endDate: string; // Fecha de fin
  isLoading: boolean;
  listaDirectores: Director[]; // Lista de directores
  listCopyDirectoreToRestart: Director[]; // Copia para resetear
}
```

#### Getters

##### hasDirectorsInFlow

Retorna `true` si hay directores designados o removidos en el flujo.

```typescript
const store = useDesiRemoDirectorio();
if (store.hasDirectorsInFlow) {
  // Hay directores en el flujo
}
```

##### getListMainDirectors

Retorna lista de directores titulares (activos o designados).

```typescript
const store = useDesiRemoDirectorio();
const titulares = store.getListMainDirectors;
```

##### getListAlternateDirectors

Retorna lista de directores suplentes y alternos.

```typescript
const store = useDesiRemoDirectorio();
const alternos = store.getListAlternateDirectors;
```

##### getListDirectorsFlow

Retorna lista de directores que están en el flujo (designados o removidos).

```typescript
const store = useDesiRemoDirectorio();
const enFlujo = store.getListDirectorsFlow;
```

##### getDirectorOptionsToRepresent

Retorna opciones de directores titulares para reemplazo.

```typescript
const store = useDesiRemoDirectorio();
const opciones = store.getDirectorOptionsToRepresent;
// [{ value: 1, label: "Juan Pérez García" }, ...]
```

#### Actions

##### updateDataToFlow(data, listDirectors)

Actualiza los datos del directorio y la lista de directores.

```typescript
const store = useDesiRemoDirectorio();
store.updateDataToFlow(
  {
    directorsCount: 5,
    directoryDuration: "3 años",
    startDate: "2024-01-01",
    endDate: "2027-01-01",
  },
  listaDirectores
);
```

##### getNameRepresent(id: number)

Obtiene el nombre completo de un director por su ID.

```typescript
const store = useDesiRemoDirectorio();
const nombre = store.getNameRepresent(1);
// "Juan Pérez García"
```

---

## Componentes Principales

### DesigRemoDirector.vue

**Ubicación:** `src/components/Views/DesignacionDirector/DesigRemoDirector/DesigRemoDirector.vue`

**Descripción:** Componente principal para designar y remover directores.

**Props:**

```typescript
interface Props {
  isPreview?: boolean; // Si está en modo preview
}
```

**Funcionalidad:**

- Muestra lista de directores titulares
- Muestra lista de directores suplentes/alternos
- Permite designar nuevos directores
- Permite remover directores existentes
- Muestra actividad reciente

### useHandleDRDirector

**Ubicación:** `src/components/Views/DesignacionDirector/DesigRemoDirector/useHandleDRDirector.ts`

**Descripción:** Composable que maneja la lógica de designación y remoción.

**Retorna:**

```typescript
{
  storeDesiRemoDirectorio: Store;      // Store de directores
  handleRemoveDirector: (id: number) => Promise<void>;  // Remover director
  handleOpenModal: () => void;        // Abrir modal
  handleCloseModal: () => void;       // Cerrar modal
  handleSubmit: () => Promise<void>;   // Crear director
  setModalMode: (mode: "titular" | "otros") => void;
  modalMode: Ref<"titular" | "otros">;
  isOpenModal: Ref<boolean>;
  isButtonDisabledModal: ComputedRef<boolean>;
  isCreateDirector: Ref<boolean>;
}
```

**Ejemplo de uso:**

```typescript
const {
  storeDesiRemoDirectorio,
  handleRemoveDirector,
  handleOpenModal,
  handleSubmit,
  isOpenModal,
} = useHandleDRDirector(false);

// Designar director
await handleSubmit();

// Remover director
await handleRemoveDirector(1);
```

---

## Flujo Completo

### 1. Inicialización del Flujo

```typescript
// 1. Obtener datos del directorio
const service = new DirectorsDesignationRemovalService();
await service.getDataLocal();

// Esto actualiza automáticamente el store con:
// - directorsCount
// - directoryDuration
// - startDate, endDate
// - listaDirectores
```

### 2. Designar un Director

```typescript
// 1. Preparar datos del director
const newDirector = {
  docType: DocumentTypeEnum.DNI,
  docNumber: "12345678",
  firstName: "Juan",
  lastNamePaternal: "Pérez",
  lastNameMaternal: "García",
  directorRole: DirectoryType.TITULAR, // o SUPLENTE, ALTERNO
  replacesId: undefined, // Opcional: ID del director que reemplaza
  action: ActionTypeState.DESIGNATE,
};

// 2. Crear director
const service = new DirectorsDesignationRemovalService();
const createdDirector = await service.createDirectorFlow(newDirector);

// 3. Actualizar store local
if (createdDirector) {
  const store = useDesiRemoDirectorio();
  store.listaDirectores.push(createdDirector);
}
```

### 3. Remover un Director

```typescript
// 1. Encontrar director en el store
const store = useDesiRemoDirectorio();
const director = store.listaDirectores.find((d) => d.id === directorId);

if (!director || !director.id) {
  toastMessage("error", "Director no encontrado");
  return;
}

// 2. Actualizar estado a REMOVIDO
const service = new DirectorsDesignationRemovalService();
const updated = await service.updateDirectorFlow({
  id: director.id,
  action: ActionTypeState.REMOVE,
});

// 3. Actualizar store local
if (updated) {
  director.statusDirector = StatusDirector.REMOVIDO;
}
```

### 4. Eliminar Director del Flujo

```typescript
// 1. Eliminar director
const service = new DirectorsDesignationRemovalService();
const deleted = await service.deleteDirectorFlow([directorId]);

// 2. Actualizar store local
if (deleted) {
  const store = useDesiRemoDirectorio();
  store.listaDirectores = store.listaDirectores.filter((d) => d.id !== directorId);
}
```

### 5. Votación de Cantidad de Directores

```typescript
// 1. Obtener datos necesarios
const service = new DirectorsQuantityVotingService();
await service.getDataLocal();

// 2. Configurar votación en el store
const store = useStoreVotacionCantidad();
store.proposedQuantity = 5;
store.setVotingRowsFromAccionistas(accionistas);

// 3. Guardar votación
await service.upsert();
```

### 6. Votación de Remoción

```typescript
// 1. Preparar votos
const votes = [
  {
    directorId: 1,
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
    directorId: 2,
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

### Ejemplo 1: Designar Director Titular

```typescript
import { DirectorsDesignationRemovalService } from "@/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.service";
import { ActionTypeState } from "@/wizards/utils/enums/action-type-state";
import { DirectoryType } from "@/components/Views/DatosDeSociedades/Directorio/Directores/DirectoryType.enum";
import { DocumentTypeEnum } from "@/wizards/utils/enums/type-document.enum";
import { useDesiRemoDirectorio } from "@/components/Views/DesignacionDirector/useDesigRemoDirector";
import { toastMessage } from "@/utils/toastMessage";

const service = new DirectorsDesignationRemovalService();
const store = useDesiRemoDirectorio();

const newDirector = {
  docType: DocumentTypeEnum.DNI,
  docNumber: "12345678",
  firstName: "Juan",
  lastNamePaternal: "Pérez",
  lastNameMaternal: "García",
  directorRole: DirectoryType.TITULAR,
  action: ActionTypeState.DESIGNATE,
};

try {
  const createdDirector = await service.createDirectorFlow(newDirector);

  if (createdDirector) {
    store.listaDirectores.push(createdDirector);
    toastMessage("success", "Director designado correctamente");
  } else {
    toastMessage("error", "Error al designar el director");
  }
} catch (error) {
  console.error("Error:", error);
  toastMessage("error", "Error al designar el director");
}
```

### Ejemplo 2: Remover Director

```typescript
import { DirectorsDesignationRemovalService } from "@/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.service";
import { ActionTypeState } from "@/wizards/utils/enums/action-type-state";
import { StatusDirector } from "@/utils/enums/StatusDirector.enum";
import { useDesiRemoDirectorio } from "@/components/Views/DesignacionDirector/useDesigRemoDirector";
import { toastMessage } from "@/utils/toastMessage";

const service = new DirectorsDesignationRemovalService();
const store = useDesiRemoDirectorio();

const handleRemoveDirector = async (directorId: number) => {
  const director = store.listaDirectores.find((d) => d.id === directorId);

  if (!director || !director.id) {
    toastMessage("error", "Director no encontrado");
    return;
  }

  try {
    const updated = await service.updateDirectorFlow({
      id: director.id,
      action: ActionTypeState.REMOVE,
    });

    if (updated) {
      director.statusDirector = StatusDirector.REMOVIDO;
      toastMessage("success", "Director removido correctamente");
    } else {
      toastMessage("error", "Error al remover el director");
    }
  } catch (error) {
    console.error("Error:", error);
    toastMessage("error", "Error al remover el director");
  }
};
```

### Ejemplo 3: Cargar Datos del Flujo

```typescript
import { DirectorsDesignationRemovalService } from "@/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.service";
import { useDesiRemoDirectorio } from "@/components/Views/DesignacionDirector/useDesigRemoDirector";
import { ref } from "vue";

const service = new DirectorsDesignationRemovalService();
const store = useDesiRemoDirectorio();
const isLoading = ref(false);

const loadData = async () => {
  isLoading.value = true;
  try {
    await service.getDataLocal();
    // Los datos se actualizan automáticamente en el store:
    // - store.directorsCount
    // - store.directoryDuration
    // - store.startDate, store.endDate
    // - store.listaDirectores
  } catch (error) {
    console.error("Error al cargar datos:", error);
    toastMessage("error", "Error al cargar los datos del directorio");
  } finally {
    isLoading.value = false;
  }
};

// Llamar al montar el componente
onMounted(() => {
  loadData();
});
```

### Ejemplo 4: Designar Director Suplente con Reemplazo

```typescript
import { DirectorsDesignationRemovalService } from "@/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.service";
import { ActionTypeState } from "@/wizards/utils/enums/action-type-state";
import { DirectoryType } from "@/components/Views/DatosDeSociedades/Directorio/Directores/DirectoryType.enum";
import { DocumentTypeEnum } from "@/wizards/utils/enums/type-document.enum";
import { useDesiRemoDirectorio } from "@/components/Views/DesignacionDirector/useDesigRemoDirector";

const service = new DirectorsDesignationRemovalService();
const store = useDesiRemoDirectorio();

// Obtener opciones de directores titulares para reemplazo
const opcionesTitulares = store.getDirectorOptionsToRepresent;
// [{ value: 1, label: "Juan Pérez García" }, ...]

// Designar suplente que reemplaza a un titular
const newSuplente = {
  docType: DocumentTypeEnum.DNI,
  docNumber: "87654321",
  firstName: "María",
  lastNamePaternal: "González",
  lastNameMaternal: "López",
  directorRole: DirectoryType.SUPLENTE,
  replacesId: 1, // ID del director titular que reemplaza
  action: ActionTypeState.DESIGNATE,
};

const createdSuplente = await service.createDirectorFlow(newSuplente);
if (createdSuplente) {
  store.listaDirectores.push(createdSuplente);
}
```

---

## Manejo de Errores

### Errores Comunes

#### 1. Director no encontrado

```typescript
const director = store.listaDirectores.find((d) => d.id === directorId);
if (!director || !director.id) {
  toastMessage("error", "Director no encontrado");
  return;
}
```

#### 2. Error al crear director

```typescript
const createdDirector = await service.createDirectorFlow(newDirector);
if (!createdDirector) {
  toastMessage("error", "Error al crear el director. Inténtalo de nuevo.");
  return;
}
```

#### 3. Error al actualizar director

```typescript
const updated = await service.updateDirectorFlow({ id, action });
if (!updated) {
  toastMessage("error", "Error al actualizar el director. Inténtalo de nuevo.");
  return;
}
```

#### 4. Validación de campos requeridos

```typescript
// En el componente useHandleDRDirector
const isButtonDisabledModal = computed(() => {
  const modalData = storeModalDirector.$state;

  switch (modalData.typeDocument) {
    case DocumentTypeEnum.DNI:
    case DocumentTypeEnum.CARNET_EXTRANJERIA:
      return (
        modalData.numberDocument !== "" &&
        modalData.name !== "" &&
        modalData.lastNamePaternal !== "" &&
        modalData.lastNameMaternal !== ""
      );
    case DocumentTypeEnum.PASAPORTE:
      return (
        modalData.numberDocument !== "" &&
        modalData.name !== "" &&
        modalData.lastNamePaternal !== "" &&
        modalData.lastNameMaternal !== "" &&
        modalData.countryOrigin !== "" // Requerido para pasaporte
      );
    default:
      return false;
  }
});
```

### Try-Catch en Servicios

Los servicios ya manejan errores internamente y retornan `null` o `false` en caso de error:

```typescript
// En DirectorsDesignationRemovalService
async createDirectorFlow(dto: DirectorFlowDTO) {
  try {
    // ... lógica
    return mapper;
  } catch (error) {
    console.log("❌ Error inesperado en createDirectorFlow:", error);
    return null;  // Retorna null en caso de error
  }
}
```

### Logging de Errores

Todos los servicios incluyen logging de errores:

```typescript
catch (error) {
  console.error("Error al designar o remover director:", error);
  throw error;  // Re-lanzar para manejo superior
}
```

---

## Resumen de Archivos Clave

### APIs (Llamadas HTTP)

- `src/api/shareholders-meeting/director-designation-removal/directors-designation-removal/postDirectorFlow.ts`
- `src/api/shareholders-meeting/director-designation-removal/directors-designation-removal/putDirectorFlow.ts`
- `src/api/shareholders-meeting/director-designation-removal/directors-designation-removal/deleteDirectorFlow.ts`
- `src/api/shareholders-meeting/director-designation-removal/directors-designation-removal/getDirectoryFlow.ts`
- `src/api/shareholders-meeting/director-designation-removal/removal-voting/postRemovalVoting.ts`
- `src/api/shareholders-meeting/director-designation-removal/designation-voting/postDesignationVoting.ts`
- `src/api/shareholders-meeting/director-designation-removal/directors-quantity-voting/getQuantityVoting.ts`

### Servicios

- `src/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.service.ts`
- `src/wizards/shareholders-meeting/director-designation-removal/directors-quantity-voting/directors-quantity-voting.service.ts`

### Stores

- `src/components/Views/DesignacionDirector/useDesigRemoDirector.ts`

### Componentes

- `src/components/Views/DesignacionDirector/DesigRemoDirector/DesigRemoDirector.vue`
- `src/components/Views/DesignacionDirector/DesigRemoDirector/useHandleDRDirector.ts`

### DTOs y Responses

- `src/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.dto.ts`
- `src/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.response.ts`

### Mappers

- `src/wizards/shareholders-meeting/director-designation-removal/directors-designation-removal/directors-designation-removal.mapper.ts`

---

## Notas Importantes

1. **IDs Requeridos:**

   - `societyId`: Se obtiene de `useAppStore().societySelectData.id`
   - `flowId`: Se obtiene de `useTypeMeetingStore().meetingFlowId`

2. **Persistencia:**

   - El store `useDesiRemoDirectorio` tiene persistencia habilitada con la key `"storeDesiRemoDirectorio"`

3. **Validaciones:**

   - Los campos requeridos varían según el tipo de documento
   - Para PASAPORTE se requiere `issuingCountry`
   - Para directores suplentes/alternos se puede requerir `replacesId`

4. **Estados del Director:**

   - `ACTIVO`: Director activo en el directorio
   - `DESIGNADO`: Director recién designado en el flujo
   - `REMOVIDO`: Director removido en el flujo

5. **Tipos de Director:**
   - `TITULAR`: Director titular
   - `SUPLENTE`: Director suplente
   - `ALTERNO`: Director alterno

---

**Última actualización:** 2024
**Versión del documento:** 1.0
