# Documentación: Votación de Nombramiento de Directores

## Índice

1. [Endpoints del Backend](#endpoints-del-backend)
2. [Estructura de Datos (DTOs y Responses)](#estructura-de-datos-dtos-y-responses)
3. [Servicios](#servicios)
4. [Stores (Estado Global)](#stores-estado-global)
5. [Componentes Principales](#componentes-principales)
6. [Tipos de Votación](#tipos-de-votación)
7. [Flujo Completo](#flujo-completo)
8. [Manejo de Empates](#manejo-de-empates)
9. [Ejemplos de Uso](#ejemplos-de-uso)
10. [Manejo de Errores](#manejo-de-errores)

---

## Endpoints del Backend

### Base URL

```
/society-profile/:societyId/flow/:flowId
```

### 1. Votación de Designación

#### POST - Crear Votación de Designación

```typescript
POST / vote - designation;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/designation-voting/postDesignationVoting.ts`

**Parámetros:**

- `idSociety: number` - ID de la sociedad
- `flowId: number` - ID del flujo de junta
- `dto: DirectorsDesignationVotingDTO` - Datos de la votación

**Body (DirectorsDesignationVotingDTO):**

```typescript
{
  details: DirectorDesignationAcumulativeVoting[];
}

// DirectorDesignationAcumulativeVoting
{
  id?: number; // Opcional, para actualizar
  personId: number; // ID de la persona (director)
  voteAgreementType: "SUBMITTED_TO_VOTES"; // Tipo de acuerdo de voto
  votingsCumulative: VotingAcumulativePerson[]; // Votos de cada accionista
}

// VotingAcumulativePerson
{
  id?: number; // Opcional, para actualizar
  personId: number; // ID del accionista que votó
  voteAgreement: number; // Cantidad de votos asignados
}
```

**Response:**

```typescript
{
  success: boolean;
  data: DirectorsDesignationVotingResponse;
  message?: string;
}

// DirectorsDesignationVotingResponse
{
  id: number;
  details: DirectorDesignationAcumulativeVoting[];
}
```

#### PUT - Actualizar Votación de Designación

```typescript
PUT / vote - designation;
```

**Ubicación del código:**

- `src/api/shareholders-meeting/director-designation-removal/designation-voting/putDesignationVoting.ts`

**Parámetros:**

- `idSociety: number`
- `flowId: number`
- `dto: DirectorsDesignationVotingDTO`

**Body:** Mismo que POST.

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

**Parámetros:**

- `idSociety: number`
- `flowId: number`

**Response:**

```typescript
{
  success: boolean;
  data: DirectorsDesignationVotingResponse;
  message?: string;
}
```

---

## Estructura de Datos (DTOs y Responses)

### DirectorsDesignationVotingDTO

**Ubicación:** `src/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.dto.ts`

```typescript
export interface DirectorsDesignationVotingDTO {
  details: DirectorDesignationAcumulativeVoting[];
}

export interface DirectorDesignationAcumulativeVoting {
  id?: number; // ID del registro de votación (para actualizar)
  personId: number; // ID de la persona (director designado)
  voteAgreementType: VoteAgreementType.SUBMITTED_TO_VOTES; // Tipo de acuerdo
  votingsCumulative: VotingAcumulativePerson[]; // Array de votos por accionista
}

export interface VotingAcumulativePerson {
  id?: number; // ID del voto (para actualizar)
  personId: number; // ID del accionista que votó
  voteAgreement: number; // Cantidad de votos asignados (número entero)
}
```

### DirectorsDesignationVotingResponse

**Ubicación:** `src/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.response.ts`

```typescript
export interface DirectorsDesignationVotingResponse {
  id: number; // ID de la votación
  details: DirectorDesignationAcumulativeVoting[]; // Detalles de votación por director
}
```

### Enums Importantes

#### TypeVoting

**Ubicación:** `src/utils/enums/TypeVoting.enum.ts`

```typescript
export enum TypeVoting {
  DEFAULT_VALUE = "default_value",
  UNANIMIDAD = "unanimidad", // Votación por unanimidad
  MAYORIA_SIMPLE = "mayoria_simple",
  ACUMULATIVA = "acumulativa", // Votación acumulativa
}
```

#### StateDirector

**Ubicación:** `src/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion.ts`

```typescript
export enum StateDirector {
  PENDIENTE = "PENDIENTE", // Candidato en empate, requiere resolución
  SELECCIONADO = "SELECCIONADO", // Candidato seleccionado/aprobado
  NO_SELECCIONADO = "NO SELECCIONADO", // Candidato no seleccionado
}
```

#### VoteAgreementType

**Ubicación:** `src/wizards/shareholders-meeting/shared-workflow/vote-agreement/vote-agreement.emuns.ts`

```typescript
export enum VoteAgreementType {
  SUBMITTED_TO_VOTES = "SUBMITTED_TO_VOTES", // Sometido a votación
}
```

---

## Servicios

### DesignationVotingService

**Ubicación:** `src/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.service.ts`

#### Métodos Principales

##### upsert()

Crea o actualiza la votación de designación (crea si no existe `id`, actualiza si existe).

```typescript
const service = new DesignationVotingService();
await service.upsert();
```

**Retorna:** `void`

##### create()

Crea una nueva votación de designación.

```typescript
const service = new DesignationVotingService();
await service.create();
```

**Retorna:** `void`

**Nota:** Este método:

1. Obtiene el DTO del store mediante `storeVDesignacion.getDtoToSendApi`
2. Lo mapea usando `DesignationVotingMapper.storeToApiVoting`
3. Envía la petición POST al backend
4. Actualiza el store con el `id` de la votación
5. Actualiza los datos desde la respuesta de la API

##### update()

Actualiza una votación de designación existente.

```typescript
const service = new DesignationVotingService();
await service.update();
```

**Retorna:** `void`

**Nota:** Este método:

1. Obtiene el DTO del store
2. Lo mapea y envía PUT al backend
3. Actualiza el store con los nuevos datos

##### get()

Obtiene la votación de designación desde el backend.

```typescript
const service = new DesignationVotingService();
await service.get();
```

**Retorna:** `void`

**Nota:** Este método actualiza el store con:

- `id`: ID de la votación
- Datos de votación mediante `updateDataFromApi`

##### getDataLocal()

Obtiene todos los datos necesarios para la votación y los carga en el store.

```typescript
const service = new DesignationVotingService();
await service.getDataLocal();
```

**Retorna:** `void`

**Nota:** Este método:

1. Obtiene quórum y mayorías (`getQuorumPercent`)
2. Obtiene accionistas con acciones (`getShareholdersWithActions`)
3. Obtiene datos del directorio (`getDirectoryFlow`)
4. Actualiza el store con todos los datos
5. Obtiene la votación existente (`get`)

##### getShareholdersWithActions()

Obtiene accionistas con sus acciones y poderes de representación.

```typescript
const service = new DesignationVotingService();
const shareholders = await service.getShareholdersWithActions();
```

**Retorna:** `VoteData[]` - Array de accionistas con sus datos de votación

##### getDirectoryFlow()

Obtiene datos del directorio desde el flujo.

```typescript
const service = new DesignationVotingService();
const { mapper, hasRemovedPresident } = await service.getDirectoryFlow();
```

**Retorna:** `{ mapper: ListDesignedDirectors[], hasRemovedPresident: boolean }`

---

## Stores (Estado Global)

### useStoreVotacionDesignacion

**Ubicación:** `src/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion.ts`

#### State

```typescript
interface State {
  id: number | null; // ID de la votación en el backend
  selectedOption: TypeVoting; // Tipo de votación seleccionado (UNANIMIDAD | ACUMULATIVA)
  confirmDesigned: boolean; // Confirmación de unanimidad (solo para UNANIMIDAD)
  maxLimitDirectors: number; // Límite máximo de directores titulares
  isOpenModalEmpate: boolean; // Si el modal de empate está abierto
  hasRemovedPresident: boolean; // Si se removió al presidente
  listDesignedDirectors: ListDesignedDirectors[]; // Lista de directores designados
  listVotingAcumulative: ListVotingAcumulative[]; // Lista de votación acumulativa
  resolvedTieResults: ResultData[]; // Resultados de empates resueltos
  resultadosDesignacion: string[]; // Textos de resultados
  directoryPresident: President | null; // Presidente del directorio seleccionado
  selectedCandidates: ResultData[]; // Candidatos seleccionados
}
```

#### Interfaces del Store

##### ListDesignedDirectors

```typescript
export interface ListDesignedDirectors {
  id: number; // ID del director en el flujo
  apiId?: number; // ID del registro de votación en el backend
  personId: number; // ID de la persona
  name: string; // Nombre
  lastNamePaternal: string; // Apellido paterno
  lastNameMaternal: string; // Apellido materno
  documentNumber: string; // Número de documento
  documentType: DocumentTypeEnum; // Tipo de documento
  position: DirectoryType; // Tipo de director (TITULAR, SUPLENTE, ALTERNO)
  voteData: VoteData[]; // Datos de votación (para unanimidad)
}
```

##### ListVotingAcumulative

```typescript
export interface ListVotingAcumulative {
  id: number | string; // ID del accionista
  actionistDetailsId: number; // ID del accionista en el sistema
  name: string; // Nombre del accionista
  tickets: number; // Total de tickets disponibles (acciones × maxLimitDirectors)
  candidates: Candidate[]; // Candidatos a los que puede votar
}

export interface Candidate {
  id: number | string; // ID del candidato (personId)
  apiId?: number; // ID del voto en el backend (para actualizar)
  candidato: string; // Nombre completo del candidato
  tipoDirector: DirectoryType; // Tipo de director
  votosAsignados: number; // Votos asignados por este accionista
  documentNumber: string; // Número de documento
  documentType: DocumentTypeEnum; // Tipo de documento
}
```

##### ResultData

```typescript
export interface ResultData {
  id: number | string; // ID del candidato
  name: string; // Nombre completo
  position: DirectoryType; // Tipo de director
  countVotes?: number; // Cantidad de votos recibidos
  documentNumber: string; // Número de documento
  documentType: DocumentTypeEnum; // Tipo de documento
  stateDirector: StateDirector | null; // Estado del candidato
}
```

##### President

```typescript
export interface President {
  id: number | string; // ID del director
  name: string; // Nombre completo
  documentNumber: string; // Número de documento
  documentType: DocumentTypeEnum; // Tipo de documento
}
```

#### Getters

##### getDtoToSendApi

Retorna el objeto DTO listo para enviar al backend.

```typescript
const store = useStoreVotacionDesignacion();
const dto = store.getDtoToSendApi;
// {
//   selectedOption: TypeVoting,
//   listDesignedDirectors: ListDesignedDirectors[],
//   listVotingAcumulative: ListVotingAcumulative[],
//   directoryPresident: President | null
// }
```

##### getResultsStatus

Calcula y retorna el estado de los resultados de la votación.

```typescript
const store = useStoreVotacionDesignacion();
const results = store.getResultsStatus; // ResultData[]
```

**Lógica:**

- **Para UNANIMIDAD:**

  - Distribuye votos equitativamente entre todos los directores
  - Todos los directores tienen estado `SELECCIONADO`

- **Para ACUMULATIVA:**
  - Suma votos de cada candidato
  - Ordena por votos (descendente)
  - Para **suplentes y alternos**: Si tienen votos > 0 → `SELECCIONADO`, si no → `NO_SELECCIONADO`
  - Para **titulares**:
    - Si hay menos o igual titulares que `maxLimitDirectors`: Todos con votos > 0 son `SELECCIONADO`
    - Si hay más titulares que `maxLimitDirectors`:
      - Los primeros `maxLimitDirectors` con más votos son `SELECCIONADO`
      - Si hay empate en la posición de corte → `PENDIENTE` (requiere resolución)
      - Los demás son `NO_SELECCIONADO`

##### getSelectedCandidates

Retorna solo los candidatos seleccionados.

```typescript
const store = useStoreVotacionDesignacion();
const selected = store.getSelectedCandidates; // ResultData[] (solo SELECCIONADO)
```

##### hasRealTieConflict

Verifica si hay un empate real que necesita resolución.

```typescript
const store = useStoreVotacionDesignacion();
const hasTie = store.hasRealTieConflict; // boolean
```

##### getResultTexts

Genera textos de resultados automáticamente.

```typescript
const store = useStoreVotacionDesignacion();
const texts = store.getResultTexts; // string[]
// Ejemplo: ["Se aprobó la designación de Juan Pérez García como Director TITULAR."]
```

#### Actions

##### voteUpdate(actionistId, candidateId, newValue)

Actualiza los votos asignados por un accionista a un candidato.

```typescript
const store = useStoreVotacionDesignacion();
store.voteUpdate(accionistaId, candidatoId, cantidadVotos);
```

**Parámetros:**

- `actionistId: number | string` - ID del accionista
- `candidateId: number | string` - ID del candidato
- `newValue: number` - Nueva cantidad de votos

##### countTickests(actionistId)

Cuenta cuántos tickets ha usado un accionista.

```typescript
const store = useStoreVotacionDesignacion();
const used = store.countTickests(accionistaId); // number
```

##### calculateMaxLimt(actionistId)

Calcula cuántos tickets le quedan disponibles a un accionista.

```typescript
const store = useStoreVotacionDesignacion();
const remaining = store.calculateMaxLimt(accionistaId); // number
```

##### evaluateIfHasTieConflict()

Evalúa si hay un empate que requiere resolución.

```typescript
const store = useStoreVotacionDesignacion();
const evaluation = store.evaluateIfHasTieConflict();
// {
//   hasTie: boolean,
//   tiedCandidates: ResultData[],
//   availableSlots: number
// }
```

##### openTieModal()

Abre el modal de empate si es necesario.

```typescript
const store = useStoreVotacionDesignacion();
const opened = store.openTieModal(); // boolean (true si se abrió el modal)
```

##### resolveTie(selectedIds)

Resuelve un empate seleccionando los candidatos ganadores.

```typescript
const store = useStoreVotacionDesignacion();
store.resolveTie([id1, id2, id3]); // Array de IDs de candidatos seleccionados
```

**Parámetros:**

- `selectedIds: (string | number)[]` - Array de IDs de candidatos seleccionados

**Efecto:**

- Marca los candidatos seleccionados como `SELECCIONADO`
- Marca los no seleccionados como `NO_SELECCIONADO`
- Guarda el resultado en `resolvedTieResults`
- Cierra el modal de empate

##### updateSelectedCandidates()

Actualiza la lista de candidatos seleccionados.

```typescript
const store = useStoreVotacionDesignacion();
store.updateSelectedCandidates();
```

##### ApiToStoreResultadosDesignacion(resultados)

Carga resultados de designación desde la API.

```typescript
const store = useStoreVotacionDesignacion();
store.ApiToStoreResultadosDesignacion(["Resultado 1", "Resultado 2", ...]);
```

##### updateApiDataToStore(designedDirectors, hasRemovedPresident, shareholders)

Actualiza el store con datos del API.

```typescript
const store = useStoreVotacionDesignacion();
store.updateApiDataToStore(
  listaDirectoresDesignados,
  true, // hasRemovedPresident
  accionistas
);
```

##### updateDataFromApi(data)

Actualiza datos de votación desde la respuesta del API.

```typescript
const store = useStoreVotacionDesignacion();
store.updateDataFromApi(datosDeVotacion);
```

---

## Componentes Principales

### VotacionDesignacion.vue

**Ubicación:** `src/components/Views/DesignacionDirector/VotacionDesignacion/VotacionDesignacion.vue`

**Descripción:** Componente principal de votación de designación.

**Props:**

```typescript
interface Props {
  isPreview?: boolean; // Si está en modo preview
}
```

**Funcionalidad:**

- Muestra selector de método de votación (Unanimidad/Acumulativa)
- Muestra acuerdo de accionistas (solo unanimidad)
- Muestra asignación de votos (solo acumulativa)
- Muestra resultados de votación (solo acumulativa)
- Maneja modal de empate
- Valida si se removió presidente y requiere designación
- Calcula y muestra candidatos seleccionados

### MetodoVotacionD.vue

**Ubicación:** `src/components/Views/DesignacionDirector/VotacionDesignacion/MetodoVotacionD.vue`

**Descripción:** Componente para seleccionar el método de votación.

**Props:**

```typescript
interface Props {
  selectedVotingMethod: string | null; // TypeVoting
}
```

**Opciones:**

- **Unanimidad:** Todos los accionistas votan en conjunto
- **Acumulativa:** Cada accionista distribuye sus votos

### AcuerdoAccionistasD.vue

**Ubicación:** `src/components/Views/DesignacionDirector/VotacionDesignacion/AcuerdoAccionistasD.vue`

**Descripción:** Componente para confirmar acuerdo por unanimidad.

**Props:**

```typescript
interface Props {
  modelValue: boolean; // confirmDesigned
  listDesignedDirectors: ListDesignedDirectors[];
  plazasDisponibles: number;
  unanimidadNoPermitida: boolean; // Si hay más candidatos que plazas
}
```

**Funcionalidad:**

- Muestra tabla de directores designados
- Checkbox para confirmar acuerdo unánime
- Deshabilitado si hay más candidatos titulares que plazas disponibles

### AsignacionVotosD.vue

**Ubicación:** `src/components/Views/DesignacionDirector/VotacionDesignacion/AsignacionVotosD.vue`

**Descripción:** Componente para asignar votos en votación acumulativa.

**Props:**

```typescript
interface Props {
  plazasDisponibles: number;
  listVotingAcumulative: ListVotingAcumulative[];
  handleVoteUpdate: (actionistId, candidateId, vote) => void;
  handleCountTickests: (actionistId) => number;
  handleCalculateMaxLimit: (actionistId) => number;
}
```

**Funcionalidad:**

- Muestra lista de accionistas
- Para cada accionista:
  - Muestra tickets totales disponibles
  - Muestra tickets usados / totales
  - Tabla de candidatos para asignar votos
  - Validación de que no se excedan los tickets

### ResultadosVotacionD.vue

**Ubicación:** `src/components/Views/DesignacionDirector/VotacionDesignacion/ResultadosVotacionD.vue`

**Descripción:** Componente que muestra resultados de la votación.

**Funcionalidad:**

- Muestra tabla con candidatos, votos y estado
- Selector para elegir presidente del directorio (solo titulares seleccionados)
- Actualiza textos de resultados según selección

### ModalEmpate.vue

**Ubicación:** `src/components/Views/DesignacionDirector/VotacionDesignacion/ModalEmpate.vue`

**Descripción:** Modal para resolver empates.

**Props:**

```typescript
interface Props {
  isOpenModal: boolean;
  plazasDisponibles: number; // Plazas disponibles para el sorteo
  candidatosEmpatados: ResultData[]; // Candidatos en empate
}
```

**Funcionalidad:**

- Muestra lista de candidatos empatados
- Permite seleccionar candidatos (hasta `plazasDisponibles`)
- Botón para resolver empate (solo habilitado si se seleccionaron exactamente `plazasDisponibles`)

### useHandleDesignacion

**Ubicación:** `src/components/Views/DesignacionDirector/VotacionDesignacion/useHandleDesignacion.ts`

**Descripción:** Composable que maneja la lógica de votación.

**Retorna:**

```typescript
{
  storeVotacionDesignacion: Store;
  handleVoteUpdate: (actionistId, candidateId, vote) => void;
  handleCountTickests: (actionistId) => number;
  handleCalculateMaxLimit: (actionistId) => number;
  handleEvaluateAndOpenTieModal: () => boolean;
}
```

**Funcionalidad:**

- Calcula `maxLimitDirectors` basado en:
  - Cantidad de directores definida
  - Directores activos actuales
  - Remociones rechazadas
- Maneja actualización de votos
- Calcula tickets disponibles
- Evalúa y abre modal de empate

---

## Tipos de Votación

### 1. Votación por Unanimidad

**Descripción:** Todos los accionistas están de acuerdo con la designación de los directores propuestos.

**Características:**

- No requiere asignación individual de votos
- Todos los directores designados son aprobados automáticamente
- Requiere confirmación mediante checkbox
- Los votos se distribuyen equitativamente entre todos los directores
- No permite empates (todos son seleccionados)

**Flujo:**

1. Usuario selecciona "Votación por unanimidad"
2. Se muestra lista de directores designados
3. Usuario marca checkbox "Confirmo que todos los accionistas están de acuerdo..."
4. Al marcar, todos los accionistas votan "A FAVOR" automáticamente
5. Todos los directores quedan con estado `SELECCIONADO`

**Validaciones:**

- Si hay más candidatos titulares que `maxLimitDirectors`, la unanimidad no está permitida
- Se muestra mensaje de error si se intenta usar unanimidad cuando no está permitida

**Ejemplo de DTO enviado:**

```typescript
{
  details: [
    {
      personId: 1,
      voteAgreementType: "SUBMITTED_TO_VOTES",
      votingsCumulative: [
        {
          personId: 10, // ID del accionista
          voteAgreement: 5, // Votos distribuidos equitativamente
        },
        {
          personId: 11,
          voteAgreement: 5,
        },
      ],
    },
    {
      personId: 2,
      voteAgreementType: "SUBMITTED_TO_VOTES",
      votingsCumulative: [
        {
          personId: 10,
          voteAgreement: 5,
        },
        {
          personId: 11,
          voteAgreement: 5,
        },
      ],
    },
  ];
}
```

### 2. Votación Acumulativa

**Descripción:** Cada accionista distribuye sus votos entre los candidatos.

**Características:**

- Cada accionista tiene tickets = `acciones × maxLimitDirectors`
- Cada accionista puede distribuir sus tickets libremente entre candidatos
- Los candidatos con más votos son seleccionados
- Puede haber empates que requieren resolución manual
- Permite designar presidente del directorio

**Flujo:**

1. Usuario selecciona "Votación acumulativa"
2. Se muestra lista de accionistas
3. Para cada accionista:
   - Muestra tickets disponibles (acciones × plazas)
   - Tabla de candidatos para asignar votos
   - Validación de no exceder tickets disponibles
4. Se calculan resultados automáticamente
5. Se muestran resultados ordenados por votos
6. Si hay empate, se abre modal para resolverlo
7. Usuario puede seleccionar presidente del directorio

**Ejemplo de asignación:**

```
Accionista 1 (10 acciones, 3 plazas disponibles):
- Tickets totales: 10 × 3 = 30 tickets
- Candidato A: 15 votos
- Candidato B: 10 votos
- Candidato C: 5 votos
- Total usado: 30 tickets ✓

Accionista 2 (5 acciones, 3 plazas disponibles):
- Tickets totales: 5 × 3 = 15 tickets
- Candidato A: 8 votos
- Candidato B: 7 votos
- Total usado: 15 tickets ✓

Resultados:
- Candidato A: 15 + 8 = 23 votos
- Candidato B: 10 + 7 = 17 votos
- Candidato C: 5 + 0 = 5 votos
```

**Ejemplo de DTO enviado:**

```typescript
{
  details: [
    {
      id: 1, // ID existente si se está actualizando
      personId: 1, // ID del director
      voteAgreementType: "SUBMITTED_TO_VOTES",
      votingsCumulative: [
        {
          id: 10, // ID del voto si existe
          personId: 10, // ID del accionista
          voteAgreement: 15, // Votos asignados
        },
        {
          personId: 11,
          voteAgreement: 8,
        },
      ],
    },
    {
      personId: 2,
      voteAgreementType: "SUBMITTED_TO_VOTES",
      votingsCumulative: [
        {
          personId: 10,
          voteAgreement: 10,
        },
        {
          personId: 11,
          voteAgreement: 7,
        },
      ],
    },
  ];
}
```

---

## Flujo Completo

### 1. Inicialización

```typescript
// 1. Obtener datos necesarios
const service = new DesignationVotingService();
await service.getDataLocal();

// Esto actualiza automáticamente el store con:
// - listDesignedDirectors: Directores designados en el flujo
// - listVotingAcumulative: Accionistas con sus tickets
// - maxLimitDirectors: Plazas disponibles para titulares
// - hasRemovedPresident: Si se removió al presidente
// - id: ID de la votación si ya existe
```

### 2. Votación por Unanimidad

```typescript
// 1. Usuario selecciona "Unanimidad"
store.selectedOption = TypeVoting.UNANIMIDAD;

// 2. Se muestra lista de directores y checkbox de confirmación

// 3. Usuario marca confirmación
store.confirmDesigned = true;

// Esto automáticamente actualiza todos los votos a "A FAVOR"
// (se hace mediante watcher en useHandleDesignacion)

// 4. Al hacer clic en "Siguiente", se guarda la votación
await service.upsert();
```

**Mapeo a DTO:**

```typescript
// DesignationVotingMapper.storeToApiVoting()
// Para unanimidad, distribuye votos equitativamente:
// - Cada accionista tiene tickets = acciones × maxLimitDirectors
// - Se divide entre todos los directores designados
// - Si hay 3 directores y accionista tiene 30 tickets:
//   - Cada director recibe: 30 / 3 = 10 votos
```

### 3. Votación Acumulativa

```typescript
// 1. Usuario selecciona "Acumulativa"
store.selectedOption = TypeVoting.ACUMULATIVA;

// 2. Se muestra lista de accionistas con sus tickets

// 3. Usuario asigna votos a cada candidato
store.voteUpdate(accionistaId, candidatoId, cantidadVotos);

// Ejemplo:
// Accionista 1 (30 tickets):
store.voteUpdate(1, 101, 15); // Candidato A: 15 votos
store.voteUpdate(1, 102, 10); // Candidato B: 10 votos
store.voteUpdate(1, 103, 5); // Candidato C: 5 votos
// Total: 30 tickets ✓

// 4. Los resultados se calculan automáticamente mediante getResultsStatus
const results = store.getResultsStatus;
// [
//   { id: 101, name: "Juan Pérez", countVotes: 23, stateDirector: "SELECCIONADO" },
//   { id: 102, name: "María López", countVotes: 17, stateDirector: "SELECCIONADO" },
//   { id: 103, name: "Carlos Ruiz", countVotes: 5, stateDirector: "NO_SELECCIONADO" }
// ]

// 5. Si hay empate, se abre modal automáticamente
const hasTie = store.evaluateIfHasTieConflict();
if (hasTie.hasTie) {
  store.openTieModal(); // Abre modal
}

// 6. Usuario resuelve empate (si aplica)
store.resolveTie([id1, id2]); // Selecciona candidatos ganadores

// 7. Usuario selecciona presidente (si aplica)
store.directoryPresident = {
  id: candidatoId,
  name: "Juan Pérez García",
  documentNumber: "12345678",
  documentType: DocumentTypeEnum.DNI,
};

// 8. Al hacer clic en "Siguiente", se guarda la votación
await service.upsert();
```

### 4. Cálculo de Plazas Disponibles (maxLimitDirectors)

```typescript
// Se calcula en useHandleDesignacion mediante watcher:

// maxLimitDirectors = directorsCount - (directoresActivosTitulares + remocionesRechazadas)

// Ejemplo:
// - directorsCount: 5 (definido en votación de cantidad)
// - directoresActivosTitulares: 2
// - remocionesRechazadas: 1
// - maxLimitDirectors = 5 - (2 + 1) = 2 plazas disponibles
```

### 5. Cálculo de Tickets por Accionista

```typescript
// Tickets = acciones × maxLimitDirectors

// Ejemplo:
// - Accionista tiene 10 acciones
// - maxLimitDirectors = 3
// - Tickets = 10 × 3 = 30 tickets

// Este cálculo se hace en updateApiDataToStore:
listVotingAcumulative = shareholders.map((shareholder) => ({
  tickets: shareholder.quantityShares * this.maxLimitDirectors,
  // ...
}));
```

---

## Manejo de Empates

### Cuándo Ocurre un Empate

Un empate ocurre cuando:

1. Hay más candidatos titulares con votos > 0 que `maxLimitDirectors`
2. En la posición de corte (índice `maxLimitDirectors - 1`), hay múltiples candidatos con el mismo número de votos

**Ejemplo:**

```
maxLimitDirectors = 3 (3 plazas disponibles)

Resultados ordenados por votos:
1. Candidato A: 25 votos → SELECCIONADO
2. Candidato B: 20 votos → SELECCIONADO
3. Candidato C: 15 votos → PENDIENTE (empate)
4. Candidato D: 15 votos → PENDIENTE (empate)
5. Candidato E: 15 votos → PENDIENTE (empate)

Hay 3 candidatos empatados pero solo 1 plaza disponible
→ Se abre modal para resolver empate
```

### Resolución de Empate

#### 1. Detección Automática

```typescript
// Al hacer clic en "Siguiente", se evalúa si hay empate
const hasTie = store.evaluateIfHasTieConflict();

if (hasTie.hasTie) {
  store.openTieModal(); // Abre modal automáticamente
  return; // No navega hasta resolver
}
```

#### 2. Modal de Empate

```typescript
// El modal muestra:
// - Candidatos empatados (todos con mismo número de votos)
// - Plazas disponibles para el sorteo
// - Checkboxes para seleccionar ganadores

// Usuario selecciona candidatos (hasta plazasDisponibles)
// Ejemplo: 3 candidatos empatados, 1 plaza disponible
// → Usuario selecciona 1 candidato
```

#### 3. Resolver Empate

```typescript
// Cuando usuario hace clic en "Resolver":
store.resolveTie([idCandidatoSeleccionado1, idCandidatoSeleccionado2]);

// Esto:
// 1. Marca los seleccionados como SELECCIONADO
// 2. Marca los no seleccionados como NO_SELECCIONADO
// 3. Guarda en resolvedTieResults
// 4. Cierra el modal
```

#### 4. Persistencia de Resolución

```typescript
// Los resultados resueltos se guardan en resolvedTieResults
// Si el usuario cambia los votos, se limpia resolvedTieResults
// para recalcular empates

store.voteUpdate(accionistaId, candidatoId, nuevosVotos);
// Esto limpia: store.resolvedTieResults = []
```

---

## Ejemplos de Uso

### Ejemplo 1: Votación por Unanimidad

```typescript
import { DesignationVotingService } from "@/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.service";
import { TypeVoting } from "@/utils/enums/TypeVoting.enum";
import { useStoreVotacionDesignacion } from "@/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion";

const service = new DesignationVotingService();
const store = useStoreVotacionDesignacion();

// 1. Cargar datos iniciales
await service.getDataLocal();

// 2. Seleccionar unanimidad
store.selectedOption = TypeVoting.UNANIMIDAD;

// 3. Confirmar acuerdo unánime
store.confirmDesigned = true;

// 4. Verificar que no haya más candidatos que plazas
const titularesCount = store.listDesignedDirectors.filter(
  (d) => d.position === DirectoryType.TITULAR
).length;

if (titularesCount > store.maxLimitDirectors) {
  toastMessage("error", "No puedes votar por unanimidad: hay más candidatos que plazas");
  return;
}

// 5. Guardar votación
await service.upsert();

// 6. Obtener resultados
const resultados = store.getResultTexts;
// ["Se aprobó la designación de Juan Pérez García como Director TITULAR.", ...]
```

### Ejemplo 2: Votación Acumulativa - Asignación de Votos

```typescript
import { DesignationVotingService } from "@/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.service";
import { TypeVoting } from "@/utils/enums/TypeVoting.enum";
import { useStoreVotacionDesignacion } from "@/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion";
import { DirectoryType } from "@/components/Views/DatosDeSociedades/Directorio/Directores/DirectoryType.enum";

const service = new DesignationVotingService();
const store = useStoreVotacionDesignacion();

// 1. Cargar datos iniciales
await service.getDataLocal();

// 2. Seleccionar acumulativa
store.selectedOption = TypeVoting.ACUMULATIVA;

// 3. Obtener accionistas
const accionistas = store.listVotingAcumulative;

// 4. Para cada accionista, asignar votos
accionistas.forEach((accionista) => {
  const ticketsDisponibles = accionista.tickets;

  // Ejemplo: Distribuir votos
  accionista.candidates.forEach((candidato, index) => {
    if (index < 3) {
      // Asignar 10 votos a los primeros 3 candidatos
      const votos = Math.min(10, ticketsDisponibles / 3);
      store.voteUpdate(accionista.id, candidato.id, votos);
    }
  });
});

// 5. Verificar que todos los tickets estén asignados
accionistas.forEach((accionista) => {
  const usados = store.countTickests(accionista.id);
  const disponibles = accionista.tickets;

  if (usados !== disponibles) {
    console.warn(
      `Accionista ${accionista.name} tiene ${usados}/${disponibles} tickets usados`
    );
  }
});

// 6. Obtener resultados
const resultados = store.getResultsStatus;

// 7. Verificar empates
const evaluation = store.evaluateIfHasTieConflict();
if (evaluation.hasTie) {
  // Abrir modal para resolver empate
  store.openTieModal();
}

// 8. Si no hay empate, guardar votación
if (!evaluation.hasTie) {
  await service.upsert();
}
```

### Ejemplo 3: Resolver Empate

```typescript
import { useStoreVotacionDesignacion } from "@/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion";
import { StateDirector } from "@/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion";

const store = useStoreVotacionDesignacion();

// 1. Evaluar si hay empate
const evaluation = store.evaluateIfHasTieConflict();

if (evaluation.hasTie) {
  console.log(`Hay ${evaluation.tiedCandidates.length} candidatos empatados`);
  console.log(`${evaluation.availableSlots} plazas disponibles`);

  // 2. Abrir modal (se hace automáticamente)
  store.openTieModal();

  // 3. Usuario selecciona candidatos ganadores (en el modal)
  // Ejemplo: Seleccionar los primeros 2 candidatos
  const selectedIds = evaluation.tiedCandidates
    .slice(0, evaluation.availableSlots)
    .map((c) => c.id);

  // 4. Resolver empate
  store.resolveTie(selectedIds);

  // 5. Verificar que el empate se resolvió
  const newResults = store.getResultsStatus;
  const stillPending = newResults.filter((r) => r.stateDirector === StateDirector.PENDIENTE);

  if (stillPending.length === 0) {
    console.log("Empate resuelto exitosamente");
  }
}
```

### Ejemplo 4: Seleccionar Presidente del Directorio

```typescript
import { useStoreVotacionDesignacion } from "@/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion";
import { DirectoryType } from "@/components/Views/DatosDeSociedades/Directorio/Directores/DirectoryType.enum";
import { StateDirector } from "@/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion";

const store = useStoreVotacionDesignacion();

// 1. Obtener candidatos titulares seleccionados
const titularesSeleccionados = store.getResultsStatus.filter(
  (r) => r.stateDirector === StateDirector.SELECCIONADO && r.position === DirectoryType.TITULAR
);

if (titularesSeleccionados.length === 0) {
  toastMessage("error", "No hay directores titulares seleccionados");
  return;
}

// 2. Seleccionar el primer candidato como presidente
const presidente = titularesSeleccionados[0];

store.directoryPresident = {
  id: presidente.id,
  name: presidente.name,
  documentNumber: presidente.documentNumber,
  documentType: presidente.documentType,
};

// 3. Actualizar textos de resultados (incluye mención del presidente)
const textos = store.getResultTexts;
// ["Se aprobó la designación de Juan Pérez García como Director TITULAR y Presidente del Directorio.", ...]
```

### Ejemplo 5: Guardar Votación Completa

```typescript
import { DesignationVotingService } from "@/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.service";
import { useStoreVotacionDesignacion } from "@/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion";
import { toastMessage } from "@/utils/toastMessage";

const service = new DesignationVotingService();
const store = useStoreVotacionDesignacion();

const guardarVotacion = async () => {
  try {
    // 1. Validar datos antes de guardar

    // Para unanimidad
    if (store.selectedOption === TypeVoting.UNANIMIDAD) {
      if (!store.confirmDesigned) {
        toastMessage("error", "Debes confirmar el acuerdo unánime");
        return;
      }
    }

    // Para acumulativa
    if (store.selectedOption === TypeVoting.ACUMULATIVA) {
      // Verificar que no haya empates pendientes
      const evaluation = store.evaluateIfHasTieConflict();
      if (evaluation.hasTie) {
        toastMessage("warning", "Debes resolver el empate antes de continuar");
        store.openTieModal();
        return;
      }

      // Verificar que se haya designado presidente si se removió
      if (store.hasRemovedPresident && !store.directoryPresident) {
        toastMessage(
          "warning",
          "Debes designar un nuevo Presidente del Directorio antes de continuar"
        );
        return;
      }
    }

    // 2. Guardar votación
    await service.upsert();

    toastMessage("success", "Votación guardada exitosamente");
  } catch (error) {
    console.error("Error al guardar votación:", error);
    toastMessage("error", "Error al guardar la votación");
  }
};
```

### Ejemplo 6: Cargar Votación Existente

```typescript
import { DesignationVotingService } from "@/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.service";
import { useStoreVotacionDesignacion } from "@/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion";

const service = new DesignationVotingService();
const store = useStoreVotacionDesignacion();

// 1. Cargar todos los datos
await service.getDataLocal();

// 2. Verificar si hay votación existente
if (store.id !== null) {
  console.log(`Votación existente con ID: ${store.id}`);

  // 3. Obtener tipo de votación
  console.log(`Tipo de votación: ${store.selectedOption}`);

  // 4. Obtener resultados
  const resultados = store.getResultsStatus;
  console.log(`Candidatos:`, resultados);

  // 5. Si es acumulativa, verificar votos asignados
  if (store.selectedOption === TypeVoting.ACUMULATIVA) {
    store.listVotingAcumulative.forEach((accionista) => {
      const usados = store.countTickests(accionista.id);
      console.log(`${accionista.name}: ${usados}/${accionista.tickets} tickets usados`);
    });
  }

  // 6. Obtener textos de resultados
  const textos = store.resultadosDesignacion;
  console.log("Textos de resultados:", textos);
}
```

---

## Manejo de Errores

### Errores Comunes

#### 1. Más candidatos que plazas en unanimidad

```typescript
const titularesCount = store.listDesignedDirectors.filter(
  (d) => d.position === DirectoryType.TITULAR
).length;

if (titularesCount > store.maxLimitDirectors) {
  toastMessage(
    "error",
    "No puedes votar por unanimidad: hay más candidatos titulares que plazas disponibles"
  );
  // Deshabilitar checkbox de confirmación
}
```

#### 2. Tickets no asignados completamente

```typescript
store.listVotingAcumulative.forEach((accionista) => {
  const usados = store.countTickests(accionista.id);
  const disponibles = accionista.tickets;

  if (usados !== disponibles) {
    console.warn(
      `Accionista ${accionista.name} tiene ${disponibles - usados} tickets sin asignar`
    );
    // Puede ser válido (abstenciones), pero es bueno advertirlo
  }
});
```

#### 3. Empate no resuelto

```typescript
const evaluation = store.evaluateIfHasTieConflict();

if (evaluation.hasTie) {
  toastMessage("warning", "Debes resolver el empate antes de continuar");
  store.openTieModal();
  return false; // No permitir continuar
}
```

#### 4. Presidente no designado cuando se removió

```typescript
if (store.hasRemovedPresident && !store.directoryPresident) {
  toastMessage(
    "warning",
    "Se removió al Presidente del Directorio. Debe designar un nuevo Presidente entre los directores seleccionados antes de continuar."
  );
  return false;
}
```

#### 5. Error al guardar votación

```typescript
try {
  await service.upsert();
} catch (error) {
  console.error("Error al guardar votación:", error);
  toastMessage("error", "Error al guardar la votación. Inténtalo de nuevo.");
}
```

### Try-Catch en Servicios

Los servicios manejan errores internamente:

```typescript
// En DesignationVotingService
async create() {
  try {
    // ... lógica
    this.storeVDesignacion.id = response.data.id;
    this.storeVDesignacion.updateDataFromApi(response.data.details);
  } catch (error) {
    console.log("❌ Error inesperado en create:", error);
    throw error; // Re-lanzar para manejo superior
  }
}
```

---

## Resumen de Archivos Clave

### APIs (Llamadas HTTP)

- `src/api/shareholders-meeting/director-designation-removal/designation-voting/postDesignationVoting.ts`
- `src/api/shareholders-meeting/director-designation-removal/designation-voting/putDesignationVoting.ts`
- `src/api/shareholders-meeting/director-designation-removal/designation-voting/getDesignationVoting.ts`

### Servicios

- `src/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.service.ts`

### Stores

- `src/components/Views/DesignacionDirector/VotacionDesignacion/useStoreVotacionDesignacion.ts`

### Componentes

- `src/components/Views/DesignacionDirector/VotacionDesignacion/VotacionDesignacion.vue`
- `src/components/Views/DesignacionDirector/VotacionDesignacion/MetodoVotacionD.vue`
- `src/components/Views/DesignacionDirector/VotacionDesignacion/AcuerdoAccionistasD.vue`
- `src/components/Views/DesignacionDirector/VotacionDesignacion/AsignacionVotosD.vue`
- `src/components/Views/DesignacionDirector/VotacionDesignacion/ResultadosVotacionD.vue`
- `src/components/Views/DesignacionDirector/VotacionDesignacion/ModalEmpate.vue`
- `src/components/Views/DesignacionDirector/VotacionDesignacion/useHandleDesignacion.ts`

### DTOs y Responses

- `src/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.dto.ts`
- `src/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.response.ts`

### Mappers

- `src/wizards/shareholders-meeting/director-designation-removal/designation-voting/designation-voting.mapper.ts`

---

## Notas Importantes

1. **IDs Requeridos:**

   - `societyId`: Se obtiene de `useAppStore().societySelectData.id`
   - `flowId`: Se obtiene de `useTypeMeetingStore().meetingFlowId`

2. **Persistencia:**

   - El store `useStoreVotacionDesignacion` tiene persistencia habilitada con la key `"storeVotacionDesignacion"`

3. **Cálculo de Tickets:**

   - Tickets = `acciones × maxLimitDirectors`
   - Cada accionista puede distribuir sus tickets libremente
   - No es necesario usar todos los tickets (permite abstenciones)

4. **Estados del Candidato:**

   - `SELECCIONADO`: Candidato aprobado/seleccionado
   - `PENDIENTE`: Candidato en empate, requiere resolución manual
   - `NO_SELECCIONADO`: Candidato no seleccionado

5. **Tipos de Director en Votación:**

   - **Titulares:** Compiten por `maxLimitDirectors` plazas, pueden tener empates
   - **Suplentes y Alternos:** Si tienen votos > 0 → seleccionados, si no → no seleccionados (no hay empates)

6. **Empates:**

   - Solo ocurren en titulares
   - Se resuelven manualmente mediante modal
   - Si se cambian los votos, se limpia la resolución y se recalcula

7. **Presidente del Directorio:**

   - Solo se puede seleccionar entre titulares seleccionados
   - Es opcional, pero requerido si se removió al presidente anterior
   - Se guarda en `directoryPresident`

8. **Mapeo de Votos:**

   - **Unanimidad:** Votos se distribuyen equitativamente entre todos los directores
   - **Acumulativa:** Votos se asignan según la distribución del usuario

9. **Validaciones Antes de Guardar:**

   - Unanimidad: `confirmDesigned` debe ser `true`
   - Acumulativa: No debe haber empates pendientes
   - Si se removió presidente: Debe haber `directoryPresident` seleccionado

---

**Última actualización:** 2024
**Versión del documento:** 1.0
