# 💰 DOCUMENTACIÓN: APORTE DINERARIO - APORTANTES Y APORTES

**Proyecto**: ProBO V2.5 (Vue 3 + Vite)  
**Flujo**: Aumento de Capital por Aporte Dinerario  
**Fecha**: Diciembre 2025  
**Propósito**: Documentar los pasos **Aportantes** y **Aportes** para migración a Nuxt 4

---

## 📑 TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Flujo](#arquitectura-flujo)
3. [PASO 1: Aportantes](#paso-aportantes)
   - 3.1. Store: useAportantesAumentoCapitalStore
   - 3.2. Modelos e Interfaces
   - 3.3. Funcionalidades
   - 3.4. Flujo de Datos API
4. [PASO 2: Aportes](#paso-aportes)
   - 4.1. Store: useAportesAumentoCapitalStore
   - 4.2. Modelos e Interfaces
   - 4.3. Funcionalidades
   - 4.4. Flujo de Datos API
5. [Relación entre Aportantes y Aportes](#relacion)
6. [Migración a Nuxt 4](#migracion-nuxt4)
7. [Ejemplos Completos](#ejemplos)

---

## 🎯 <a id="resumen-ejecutivo"></a>1. RESUMEN EJECUTIVO

### ¿Qué es el Aporte Dinerario?

El **Aporte Dinerario** es un flujo de aumento de capital donde los accionistas (existentes o nuevos) realizan aportes monetarios a la sociedad a cambio de acciones.

### Los 2 Pasos Clave

```
┌─────────────────────────────────────────────────────────────┐
│  PASO 1: APORTANTES                                         │
│  ¿QUIÉNES van a aportar?                                    │
│                                                              │
│  - Accionistas existentes (ACCIONISTA)                      │
│  - Nuevos accionistas (NUEVO_ACCIONISTA)                    │
│                                                              │
│  Store: useAportantesAumentoCapitalStore                    │
│  Variable: items: ContributorResponse[]                     │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 2: APORTES                                            │
│  ¿CUÁNTO aporta cada uno?                                   │
│                                                              │
│  Para cada aportante:                                       │
│  - Monto en soles/dólares                                   │
│  - Acciones a recibir                                       │
│  - Distribución (capital social, prima, reserva)            │
│                                                              │
│  Store: useAportesAumentoCapitalStore                       │
│  Variable: monetaryByParticipant: Record<id, Item[]>        │
└─────────────────────────────────────────────────────────────┘
```

### Diferencia Conceptual

| Aspecto | Aportantes | Aportes |
|---------|------------|---------|
| **Pregunta** | ¿Quiénes? | ¿Cuánto? |
| **Entidad** | Persona (natural/jurídica) | Contribución monetaria |
| **Cardinalidad** | 1 aportante = 1 registro | 1 aportante = N aportes |
| **Ejemplo** | "Juan Pérez" | "S/ 10,000 → 100 acciones" |

---

## 🏗️ <a id="arquitectura-flujo"></a>2. ARQUITECTURA DEL FLUJO

### Flujo Completo (10 Pasos)

```
Aumento de Capital por Aporte Dinerario
├─ Paso 1: Tipo de Junta
├─ Paso 2: Detalles de la Junta
├─ Paso 3: Instalación (Asistencia + Quórum)
├─ Paso 4: Presidente y Secretario
├─ Paso 5: APORTANTES ← AQUÍ EMPIEZA
│   └─ Store: useAportantesAumentoCapitalStore
├─ Paso 6: APORTES ← CONTINUAMOS AQUÍ
│   └─ Store: useAportesAumentoCapitalStore
├─ Paso 7: Votación
├─ Paso 8: Resumen
├─ Paso 9: Descarga de Documentos
└─ Paso 10: Finalizar
```

### Ubicación de Archivos

```
src/
├── components/
│   └── Views/
│       ├── AportanteAumentoCapital/
│       │   └── aportantes-aumento-capital.store.ts  ← Store Aportantes
│       └── AportesAumentoCapital/
│           ├── aportes-aumento-capital.store.ts     ← Store Aportes
│           └── MonetaryContribution/
│               ├── MonetaryContributionTypes.ts     ← Interfaces
│               └── infraestructure/
│                   └── monetary-contributions.dto.ts ← DTOs
└── wizards/
    └── shareholders-meeting/
        └── capital-increase/
            └── monetary-contribution/
                └── monetary-contributors/
                    ├── monetary-contributors.dto.ts  ← DTOs
                    └── monetary-contributors.service.ts ← API
```

---

## 👥 <a id="paso-aportantes"></a>3. PASO 1: APORTANTES

### 3.1. Store: useAportantesAumentoCapitalStore

#### 📂 Ubicación

```
src/components/Views/AportanteAumentoCapital/aportantes-aumento-capital.store.ts
```

#### 📝 Estado (State)

```typescript
interface AportantesAumentoCapitalState {
  // Modo del flujo
  isMonetaryContribution: boolean;  // true = Aporte Dinerario, false = Capitalización
  
  // Lista de aportantes/acreedores
  items: ContributorResponse[];     // ← ARRAY PRINCIPAL
  
  // Control de carga
  loading: boolean;                 // Cargando desde API
  submitting: boolean;              // Enviando a API
  deletingId: number | null;        // ID siendo eliminado
  fetchSeq: number;                 // Contador para evitar condiciones de carrera
  error: string | null;             // Mensaje de error
  
  // Control del modal (UI)
  isOpenModal: boolean;             // Modal abierto/cerrado
  isEdit: boolean;                  // Modo edición/creación
  currentEditId: number | null;     // ID en edición
}
```

#### Variables del State

| Variable | Tipo | Propósito |
|----------|------|-----------|
| `isMonetaryContribution` | `boolean` | Determina si es Aporte Dinerario (true) o Capitalización de Créditos (false) |
| `items` | `ContributorResponse[]` | **Lista principal** de aportantes/acreedores |
| `loading` | `boolean` | Indica si está cargando desde API |
| `submitting` | `boolean` | Indica si está guardando en API |
| `deletingId` | `number \| null` | ID del aportante siendo eliminado |
| `fetchSeq` | `number` | Contador para evitar que peticiones viejas sobrescriban nuevas |
| `error` | `string \| null` | Mensaje de error actual |
| `isOpenModal` | `boolean` | Controla visibilidad del modal |
| `isEdit` | `boolean` | Modo del modal: `true` = editar, `false` = crear |
| `currentEditId` | `number \| null` | ID del aportante en edición |

#### 🎯 Getters (Computados)

```typescript
getters: {
  // Filtrar solo contribuyentes
  contribuyentes: (state) => state.items.filter((x) => x.isContributor),
  
  // Filtrar solo no contribuyentes (asistentes que no aportan)
  noContribuyentes: (state) => state.items.filter((x) => !x.isContributor),
  
  // Cantidad total
  count: (state) => state.items.length,
  
  // Validación del formulario (desde sub-stores)
  isFormValid(): boolean {
    const form = useStorePersonaForm();
    return form.isFormValidate;
  },
  
  // UI labels (dinámicos según modo)
  title(state): string {
    return state.isMonetaryContribution ? "Aportantes" : "Acreedores";
  },
  
  body(state): string {
    return state.isMonetaryContribution
      ? "Selecciona accionistas existentes o agrega nuevos accionistas"
      : "Selecciona accionistas existentes o agrega nuevos accionistas";
  },
  
  textButton(state): string {
    return state.isMonetaryContribution ? "Agregar Aportante" : "Agregar Acreedor";
  }
}
```

#### ⚙️ Actions Principales

##### 1. `fetchAll()` - Cargar desde API

```typescript
async fetchAll() {
  this.loading = true;
  this.clearError();
  
  try {
    this.refreshMode();  // Actualizar modo según layout
    
    const { societyId, flowId } = this.getContextIds();
    
    if (!societyId || !flowId || flowId === -1) {
      throw new Error("IDs de sociedad/flujo no disponibles");
    }
    
    const service = this.getActiveService();  // MonetaryContributorsService
    const resp = await service.get(societyId, flowId);
    
    this.setItemsFromResponse(resp);  // Guardar en items
    
  } catch (error) {
    this.setError(error.message);
  } finally {
    this.loading = false;
  }
}
```

##### 2. `createContributor()` - Crear aportante

```typescript
async createContributor() {
  this.submitting = true;
  this.clearError();
  
  try {
    const { societyId, flowId } = this.getContextIds();
    const service = this.getActiveService();
    
    // Construir payload desde formulario
    const payload = this.buildPayloadFromForm();
    
    const resp = await service.create(societyId, flowId, payload);
    
    // Fusionar nuevo item en la lista
    this.mergeItemsFromPartial(resp);
    
    this.closeModal();
    
  } catch (error) {
    this.setError(error.message);
    throw error;
  } finally {
    this.submitting = false;
  }
}
```

##### 3. `toggleContributor()` - Marcar como contribuyente

```typescript
async toggleContributor(id: number) {
  try {
    const item = this.items.find((x) => x.id === id);
    if (!item) return;
    
    const { societyId, flowId } = this.getContextIds();
    const service = this.getActiveService();
    
    // Cambiar estado
    const newIsContributor = !item.isContributor;
    
    const payload = {
      id,
      isContributor: newIsContributor
    };
    
    const resp = await service.update(societyId, flowId, payload);
    
    // Actualizar en lista
    this.mergeItemsFromPartial(resp);
    
  } catch (error) {
    this.setError(error.message);
  }
}
```

##### 4. `deleteContributor()` - Eliminar aportante

```typescript
async deleteContributor(id: number) {
  this.deletingId = id;
  
  try {
    const { societyId, flowId } = this.getContextIds();
    const service = this.getActiveService();
    
    await service.delete(societyId, flowId, id);
    
    // Remover de la lista
    this.items = this.items.filter((x) => x.id !== id);
    
  } catch (error) {
    this.setError(error.message);
    throw error;
  } finally {
    this.deletingId = null;
  }
}
```

---

### 3.2. Modelos e Interfaces

#### Interface Principal: `ContributorResponse`

```typescript
export interface ContributorResponse {
  id?: number;
  contributorType: ContributorType;  // ACCIONISTA | NUEVO_ACCIONISTA
  isContributor: boolean;            // ¿Aporta dinero?
  isPresent: boolean;                // ¿Asistió a la junta?
  
  // Datos de la persona
  contributor: ContributorPerson;    // Natural | Jurídica
  
  // Asignación de acciones (datos históricos)
  allocationShare: AllocationShareItem[];
}
```

#### Enum: `ContributorType`

```typescript
export enum ContributorType {
  ACCIONISTA = "ACCIONISTA",           // Accionista existente
  NUEVO_ACCIONISTA = "NUEVO_ACCIONISTA" // Nuevo accionista
}
```

#### Union Type: `ContributorPerson`

```typescript
export type ContributorPerson = NaturalPerson | JuridicPerson;
```

#### Interface: `NaturalPerson` (Persona Natural)

```typescript
export interface NaturalPerson {
  personId?: number;
  type: PersonType.NATURAL;          // Discriminador
  
  // Documento de identidad
  typeDocument: string;              // "DNI", "PASAPORTE", "CARNET_EXTRANJERIA"
  documentNumber: string;
  issuingCountry?: string;           // Solo para PASAPORTE
  
  // Datos personales
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
}
```

**Ejemplo**:
```typescript
{
  personId: 123,
  type: "NATURAL",
  typeDocument: "DNI",
  documentNumber: "12345678",
  firstName: "Juan",
  lastNamePaternal: "Pérez",
  lastNameMaternal: "García"
}
```

#### Interface: `JuridicPerson` (Persona Jurídica)

```typescript
export interface JuridicPerson {
  personId?: number;
  type: PersonType.JURIDICA;         // Discriminador
  
  // Documento
  ruc?: string;
  documentNumber?: string;
  typeDocument?: string;
  
  // Datos empresariales
  legalName: string;                 // Razón social
  commercialName?: string;           // Nombre comercial
  address: string;                   // Dirección
  district?: string;
  province?: string;
  department?: string;
  country?: string;
  
  // Estado
  hasConstituted: boolean;           // ¿Constituida en Perú?
}
```

**Ejemplo**:
```typescript
{
  personId: 456,
  type: "JURIDICA",
  ruc: "20123456789",
  legalName: "Inversiones SAC",
  commercialName: "Inversiones",
  address: "Av. Principal 123",
  district: "Miraflores",
  province: "Lima",
  department: "Lima",
  country: "Perú",
  hasConstituted: true
}
```

#### Interface: `AllocationShareItem`

```typescript
export interface AllocationShareItem {
  id: number;
  action: AllocationAction;          // Tipo de acción
  subscribedSharesQuantity: number;  // Acciones suscritas
  pricePerShare: number;             // Precio por acción
  percentagePaidPerShare: number;    // Porcentaje pagado (0-100%)
  unpaidDividendTotal: number;       // Dividendo pasivo
  fullyPaid: boolean;                // ¿Completamente pagadas?
}
```

**Propósito**: Datos históricos de acciones que ya posee el accionista.

---

### 3.3. Funcionalidades

#### A. Listar Aportantes

```vue
<script setup lang="ts">
import { useAportantesAumentoCapitalStore } from "@/components/Views/AportanteAumentoCapital/aportantes-aumento-capital.store";

const storeAportantes = useAportantesAumentoCapitalStore();

onMounted(async () => {
  await storeAportantes.fetchAll();
});
</script>

<template>
  <div>
    <h2>{{ storeAportantes.title }}</h2>  <!-- "Aportantes" -->
    <p>{{ storeAportantes.body }}</p>
    
    <table>
      <thead>
        <tr>
          <th>Contribuye</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Documento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in storeAportantes.items" :key="item.id">
          <td>
            <input 
              type="checkbox" 
              :checked="item.isContributor"
              @change="storeAportantes.toggleContributor(item.id)"
            />
          </td>
          <td>
            {{ item.contributor.type === 'NATURAL' 
              ? `${item.contributor.firstName} ${item.contributor.lastNamePaternal}`
              : item.contributor.legalName 
            }}
          </td>
          <td>{{ item.contributorType }}</td>
          <td>{{ item.contributor.documentNumber }}</td>
          <td>{{ item.allocationShare.reduce((sum, a) => sum + a.subscribedSharesQuantity, 0) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

#### B. Agregar Aportante

```vue
<script setup lang="ts">
import { useAportantesAumentoCapitalStore } from "@/components/Views/AportanteAumentoCapital/aportantes-aumento-capital.store";
import { useStorePersonaForm } from "@/store/forms/persona-form.store";

const storeAportantes = useAportantesAumentoCapitalStore();
const formPersona = useStorePersonaForm();

const handleOpenModal = () => {
  storeAportantes.openModal(false);  // false = modo crear
};

const handleSave = async () => {
  if (!storeAportantes.isFormValid) {
    toast.error("Completa todos los campos obligatorios");
    return;
  }
  
  try {
    await storeAportantes.createContributor();
    toast.success("Aportante agregado correctamente");
  } catch (error) {
    // Error ya manejado en el store
  }
};
</script>

<template>
  <div>
    <button @click="handleOpenModal">
      {{ storeAportantes.textButton }}  <!-- "Agregar Aportante" -->
    </button>
    
    <Modal :open="storeAportantes.isOpenModal" @close="storeAportantes.closeModal">
      <h3>{{ storeAportantes.isEdit ? "Editar" : "Agregar" }} Aportante</h3>
      
      <!-- Formulario de persona -->
      <PersonaForm />
      
      <button @click="handleSave" :disabled="storeAportantes.submitting">
        Guardar
      </button>
    </Modal>
  </div>
</template>
```

---

### 3.4. Flujo de Datos API

#### Endpoint: GET - Listar Aportantes

```http
GET /api/v2/capital-increase/monetary-contribution/{societyId}/flow/{flowId}/contributors
```

**Response**:
```json
{
  "success": true,
  "message": "Contribuyentes obtenidos correctamente",
  "data": {
    "id": 1,
    "contributors": [
      {
        "id": 10,
        "contributorType": "ACCIONISTA",
        "isContributor": true,
        "isPresent": true,
        "contributor": {
          "personId": 100,
          "type": "NATURAL",
          "typeDocument": "DNI",
          "documentNumber": "12345678",
          "firstName": "Juan",
          "lastNamePaternal": "Pérez",
          "lastNameMaternal": "García"
        },
        "allocationShare": [
          {
            "id": 50,
            "action": {
              "id": 1,
              "name": "Clase A",
              "type": "ORDINARIA",
              "hasRightVote": true,
              "hasCommon": true
            },
            "subscribedSharesQuantity": 100,
            "pricePerShare": 1.0,
            "percentagePaidPerShare": 100,
            "unpaidDividendTotal": 0,
            "fullyPaid": true
          }
        ]
      },
      {
        "id": 11,
        "contributorType": "NUEVO_ACCIONISTA",
        "isContributor": true,
        "isPresent": false,
        "contributor": {
          "personId": 101,
          "type": "JURIDICA",
          "ruc": "20123456789",
          "legalName": "Inversiones SAC",
          "commercialName": "Inversiones",
          "address": "Av. Principal 123",
          "hasConstituted": true
        },
        "allocationShare": []
      }
    ]
  }
}
```

#### Endpoint: POST - Crear Aportante

```http
POST /api/v2/capital-increase/monetary-contribution/{societyId}/flow/{flowId}/contributors
```

**Request Body**:
```json
{
  "contributors": [
    {
      "contributorType": "NUEVO_ACCIONISTA",
      "isContributor": true,
      "contributor": {
        "type": "NATURAL",
        "typeDocument": "DNI",
        "documentNumber": "87654321",
        "firstName": "María",
        "lastNamePaternal": "Torres",
        "lastNameMaternal": "López"
      }
    }
  ]
}
```

**Response**: Igual que GET (devuelve el contributor creado)

---

## 💵 <a id="paso-aportes"></a>4. PASO 2: APORTES

### 4.1. Store: useAportesAumentoCapitalStore

#### 📂 Ubicación

```
src/components/Views/AportesAumentoCapital/aportes-aumento-capital.store.ts
```

#### 📝 Estado (State)

```typescript
interface AportesAumentoCapitalState {
  // Modo del flujo
  isMonetaryContribution: boolean;
  
  // Control
  loading: boolean;
  error: string | null;
  
  // ID padre en backend
  contributionsId?: number | null;
  
  // Fuentes de datos (del paso anterior)
  allParticipants: ContributorResponse[];   // Todos los aportantes
  onlyContributors: ContributorResponse[];  // Solo los marcados como contribuyentes
  
  // Datos de acciones (para selección)
  actions: Array<{
    id: number;
    name: string;
    type: string;
    hasRightVote: boolean;
  }>;
  nominalValue: number | null;
  
  // Aportes por participante (CLAVE)
  monetaryByParticipant: Record<string | number, MonetaryContributionItem[]>;
  creditByParticipant: Record<string | number, CreditCapitalizationItem[]>;
}
```

#### Variables del State

| Variable | Tipo | Propósito |
|----------|------|-----------|
| `isMonetaryContribution` | `boolean` | true = Aporte Dinerario, false = Capitalización |
| `contributionsId` | `number \| null` | ID del registro padre en backend |
| `allParticipants` | `ContributorResponse[]` | Lista de todos los aportantes (del paso anterior) |
| `onlyContributors` | `ContributorResponse[]` | Solo los que tienen `isContributor: true` |
| `actions` | `Array` | Lista de tipos de acciones disponibles (Clase A, B, etc.) |
| `nominalValue` | `number \| null` | Valor nominal de la acción |
| `monetaryByParticipant` | `Record<id, Item[]>` | **Aportes monetarios por participante** ← CLAVE |
| `creditByParticipant` | `Record<id, Item[]>` | Aportes por capitalización (no aplica aquí) |

**⭐ Estructura de `monetaryByParticipant`**:

```typescript
{
  "10": [  // ID del aportante
    {
      itemTableId: "unique-1",
      actionistId: 10,
      isDollars: false,
      solesAmount: 10000,
      dateContributions: "2025-12-01",
      actionId: 1,
      sharesToReceive: 100,
      pricePaidShare: 100,
      socialCapital: 9000,
      prima: 1000,
      reserve: 0,
      // ... más campos
    },
    {
      itemTableId: "unique-2",
      actionistId: 10,
      isDollars: true,
      dollarsAmount: 5000,
      // ... otro aporte del mismo participante
    }
  ],
  "11": [ /* aportes del participante 11 */ ]
}
```

#### 🎯 Getters (Computados)

```typescript
getters: {
  title(state): string {
    return state.isMonetaryContribution ? "Aportes" : "Capitalización";
  },
  
  body(state): string {
    return state.isMonetaryContribution
      ? "Registra los aportes dinerarios"
      : "Registra la capitalización de créditos";
  },
  
  nominalValueNumber(state): number {
    return state.nominalValue ?? 0;
  },
  
  // Lista de participantes para UI
  participantsUi(state): Array<{
    id: string | number;
    name: string;
    isContributor: boolean;
    contributorType: any;
  }> {
    return state.onlyContributors.map((p) => ({
      id: p.id,
      name: getContributorDisplayName(p.contributor),
      isContributor: p.isContributor,
      contributorType: p.contributorType
    }));
  },
  
  // Opciones para select de acciones
  selectedOptionsShares(state): Array<{ label: string; value: number }> {
    return state.actions.map((a) => ({
      label: `${a.name} (${a.type})`,
      value: a.id
    }));
  },
  
  // Obtener aportes de un participante
  getMonetaryByParticipant: (state) => (participantId: string | number) => {
    return state.monetaryByParticipant[participantId] || [];
  }
}
```

#### ⚙️ Actions Principales

##### 1. `setParticipants()` - Cargar aportantes

```typescript
setParticipants(items: ContributorResponse[]) {
  this.allParticipants = items ?? [];
  this.onlyContributors = this.allParticipants.filter((x) => x.isContributor);
}
```

##### 2. `addMonetary()` - Agregar aporte

```typescript
addMonetary(participantId: string | number, item: MonetaryContributionItem) {
  if (!this.monetaryByParticipant[participantId]) {
    this.monetaryByParticipant[participantId] = [];
  }
  this.monetaryByParticipant[participantId].push(item);
}
```

##### 3. `editMonetary()` - Editar aporte

```typescript
editMonetary(participantId: string | number, item: MonetaryContributionItem) {
  const items = this.monetaryByParticipant[participantId] || [];
  const index = items.findIndex((i) => i.itemTableId === item.itemTableId);
  
  if (index !== -1) {
    items[index] = item;
  }
}
```

##### 4. `deleteMonetary()` - Eliminar aporte

```typescript
deleteMonetary(participantId: string | number, itemTableId: string | number | null) {
  const items = this.monetaryByParticipant[participantId] || [];
  this.monetaryByParticipant[participantId] = items.filter(
    (i) => i.itemTableId !== itemTableId
  );
}
```

---

### 4.2. Modelos e Interfaces

#### Interface Principal: `MonetaryContributionItem`

```typescript
export interface MonetaryContributionItem {
  // IDs
  id?: number;
  itemTableId: string | number | null;    // ID único en UI
  detailId?: number;                      // ID en backend
  
  // Participante y acción
  actionistId: string | number | null;    // ID del aportante
  shareholderId?: number;
  actionId: number | string | null;       // ID del tipo de acción
  actionDetailId?: number;
  
  // Aporte en dólares (opcional)
  isDollars: boolean;                     // ¿Aporta en dólares?
  dollarsAmount: number;                  // Monto en USD
  changeType: number;                     // Tipo de cambio
  
  // Aporte en soles
  solesAmount: number;                    // Monto en PEN
  dateContributions: string;              // Fecha del aporte (ISO)
  
  // Acciones a recibir
  actionType: string;                     // Nombre del tipo de acción
  sharesToReceive: number;                // Cantidad de acciones
  pricePaidShare: number;                 // Precio pagado por acción
  
  // Distribución del aporte
  socialCapital: number;                  // A capital social
  prima: number;                          // A prima de capital
  reserve: number;                        // A reserva
  
  // Pago
  fullyPaidShares: boolean;               // ¿Pagado completamente?
  percentPaidShares: number;              // Porcentaje pagado (25-100%)
  totalPassiveDividend: number;           // Dividendo pasivo
  
  // Archivo de asiento contable
  accountingEntry: {
    fileName: string;
    fileUrl: string;
    fileId: number | null;
    version?: number;
    size?: number;
  };
  
  // Control UI
  submitting: boolean;                    // Enviando a API
}
```

#### Campos Clave Explicados

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `isDollars` | `boolean` | Si el aporte es en dólares | `true` |
| `dollarsAmount` | `number` | Monto en dólares | `5000` |
| `changeType` | `number` | Tipo de cambio USD → PEN | `3.75` |
| `solesAmount` | `number` | Monto final en soles (calculado o directo) | `18750` (5000 × 3.75) |
| `sharesToReceive` | `number` | Acciones que recibirá | `100` |
| `pricePaidShare` | `number` | Precio pagado por acción | `187.5` (18750 ÷ 100) |
| `socialCapital` | `number` | Parte que va a capital social | `15000` |
| `prima` | `number` | Prima de capital (sobreprecio) | `3750` |
| `reserve` | `number` | Reserva legal/estatutaria | `0` |
| `fullyPaidShares` | `boolean` | ¿Pago completo? | `false` |
| `percentPaidShares` | `number` | % pagado (mínimo 25%) | `50` |
| `totalPassiveDividend` | `number` | Monto pendiente de pago | `9375` (50% de 18750) |

#### Validaciones de Negocio

```typescript
// 1. Porcentaje pagado mínimo 25%
if (percentPaidShares < 25) {
  throw new Error("El porcentaje debe ser mayor o igual a 25%");
}

// 2. Distribución debe sumar el monto total
const distribucion = socialCapital + prima + reserve;
if (Math.abs(distribucion - solesAmount) > 0.01) {
  throw new Error("La distribución no coincide con el monto aportado");
}

// 3. Cálculo de dividendo pasivo
if (!fullyPaidShares) {
  totalPassiveDividend = solesAmount * (1 - percentPaidShares / 100);
}

// 4. Precio por acción
pricePaidShare = solesAmount / sharesToReceive;
```

---

### 4.3. Funcionalidades

#### A. Vista de Aportes (Tabla por Participante)

```vue
<script setup lang="ts">
import { useAportesAumentoCapitalStore } from "@/components/Views/AportesAumentoCapital/aportes-aumento-capital.store";

const storeAportes = useAportesAumentoCapitalStore();

onMounted(() => {
  // Los participantes ya fueron cargados en el paso anterior
  // y están disponibles en storeAportes.participantsUi
});
</script>

<template>
  <div>
    <h2>{{ storeAportes.title }}</h2>  <!-- "Aportes" -->
    
    <!-- Por cada participante, una tabla de aportes -->
    <div v-for="participant in storeAportes.participantsUi" :key="participant.id">
      <h3>{{ participant.name }}</h3>
      
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Moneda</th>
            <th>Monto</th>
            <th>Acciones</th>
            <th>Precio/Acción</th>
            <th>Capital</th>
            <th>Prima</th>
            <th>Reserva</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="aporte in storeAportes.getMonetaryByParticipant(participant.id)" 
            :key="aporte.itemTableId"
          >
            <td>{{ aporte.dateContributions }}</td>
            <td>{{ aporte.isDollars ? 'USD' : 'PEN' }}</td>
            <td>
              {{ aporte.isDollars 
                ? `$ ${aporte.dollarsAmount}` 
                : `S/ ${aporte.solesAmount}` 
              }}
            </td>
            <td>{{ aporte.sharesToReceive }}</td>
            <td>S/ {{ aporte.pricePaidShare.toFixed(2) }}</td>
            <td>S/ {{ aporte.socialCapital.toFixed(2) }}</td>
            <td>S/ {{ aporte.prima.toFixed(2) }}</td>
            <td>S/ {{ aporte.reserve.toFixed(2) }}</td>
            <td>
              <button @click="handleEdit(participant.id, aporte)">Editar</button>
              <button @click="handleDelete(participant.id, aporte.itemTableId)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <button @click="handleAdd(participant.id)">+ Agregar Aporte</button>
    </div>
  </div>
</template>
```

#### B. Modal de Aporte

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { useAportesAumentoCapitalStore } from "@/components/Views/AportesAumentoCapital/aportes-aumento-capital.store";

const storeAportes = useAportesAumentoCapitalStore();

const form = ref<MonetaryContributionItem>({
  itemTableId: null,
  actionistId: null,
  isDollars: false,
  dollarsAmount: 0,
  changeType: 0,
  solesAmount: 0,
  dateContributions: "",
  actionId: null,
  actionType: "",
  sharesToReceive: 0,
  pricePaidShare: 0,
  socialCapital: 0,
  prima: 0,
  reserve: 0,
  fullyPaidShares: true,
  percentPaidShares: 100,
  totalPassiveDividend: 0,
  accountingEntry: {
    fileName: "",
    fileUrl: "",
    fileId: null
  },
  submitting: false
});

// Cálculo automático de soles
const solesCalculado = computed(() => {
  if (form.value.isDollars) {
    return form.value.dollarsAmount * form.value.changeType;
  }
  return form.value.solesAmount;
});

// Cálculo de precio por acción
const precioPorAccion = computed(() => {
  if (form.value.sharesToReceive === 0) return 0;
  return solesCalculado.value / form.value.sharesToReceive;
});

// Cálculo de dividendo pasivo
const dividendoPasivo = computed(() => {
  if (form.value.fullyPaidShares) return 0;
  return solesCalculado.value * (1 - form.value.percentPaidShares / 100);
});

const handleSave = () => {
  // Actualizar campos calculados
  form.value.solesAmount = solesCalculado.value;
  form.value.pricePaidShare = precioPorAccion.value;
  form.value.totalPassiveDividend = dividendoPasivo.value;
  
  // Validar
  const totalDistribucion = 
    form.value.socialCapital + 
    form.value.prima + 
    form.value.reserve;
  
  if (Math.abs(totalDistribucion - form.value.solesAmount) > 0.01) {
    toast.error("La distribución no coincide con el monto total");
    return;
  }
  
  // Guardar
  if (form.value.itemTableId) {
    storeAportes.editMonetary(form.value.actionistId!, form.value);
  } else {
    form.value.itemTableId = generateUUID();
    storeAportes.addMonetary(form.value.actionistId!, form.value);
  }
  
  closeModal();
};
</script>

<template>
  <Modal :open="isOpen" @close="closeModal">
    <h3>Registrar Aporte</h3>
    
    <!-- Moneda -->
    <div>
      <label>
        <input type="radio" v-model="form.isDollars" :value="false" />
        Soles (PEN)
      </label>
      <label>
        <input type="radio" v-model="form.isDollars" :value="true" />
        Dólares (USD)
      </label>
    </div>
    
    <!-- Monto -->
    <div v-if="form.isDollars">
      <label>Monto USD</label>
      <input type="number" v-model="form.dollarsAmount" />
      
      <label>Tipo de Cambio</label>
      <input type="number" v-model="form.changeType" />
      
      <p>Equivalente: S/ {{ solesCalculado.toFixed(2) }}</p>
    </div>
    <div v-else>
      <label>Monto PEN</label>
      <input type="number" v-model="form.solesAmount" />
    </div>
    
    <!-- Fecha -->
    <div>
      <label>Fecha del Aporte</label>
      <input type="date" v-model="form.dateContributions" />
    </div>
    
    <!-- Tipo de Acción -->
    <div>
      <label>Tipo de Acción</label>
      <select v-model="form.actionId">
        <option :value="null">Seleccionar...</option>
        <option 
          v-for="action in storeAportes.selectedOptionsShares" 
          :key="action.value"
          :value="action.value"
        >
          {{ action.label }}
        </option>
      </select>
    </div>
    
    <!-- Acciones a recibir -->
    <div>
      <label>Acciones a Recibir</label>
      <input type="number" v-model="form.sharesToReceive" />
      
      <p>Precio por acción: S/ {{ precioPorAccion.toFixed(2) }}</p>
    </div>
    
    <!-- Distribución -->
    <div>
      <h4>Distribución del Aporte</h4>
      
      <label>Capital Social</label>
      <input type="number" v-model="form.socialCapital" />
      
      <label>Prima de Capital</label>
      <input type="number" v-model="form.prima" />
      
      <label>Reserva</label>
      <input type="number" v-model="form.reserve" />
      
      <p>
        Total: S/ {{ (form.socialCapital + form.prima + form.reserve).toFixed(2) }}
      </p>
    </div>
    
    <!-- Pago -->
    <div>
      <label>
        <input type="checkbox" v-model="form.fullyPaidShares" />
        ¿Pagado completamente?
      </label>
      
      <div v-if="!form.fullyPaidShares">
        <label>Porcentaje Pagado (%)</label>
        <input 
          type="number" 
          v-model="form.percentPaidShares" 
          min="25" 
          max="100" 
        />
        
        <p>Dividendo Pasivo: S/ {{ dividendoPasivo.toFixed(2) }}</p>
      </div>
    </div>
    
    <!-- Archivo -->
    <div>
      <label>Asiento Contable (opcional)</label>
      <input type="file" @change="handleFileUpload" />
    </div>
    
    <button @click="handleSave">Guardar</button>
  </Modal>
</template>
```

---

### 4.4. Flujo de Datos API

#### Endpoint: POST - Guardar Aportes

```http
POST /api/v2/capital-increase/monetary-contribution/{societyId}/flow/{flowId}/contributions
```

**Request Body**:
```json
{
  "id": 1,
  "details": [
    {
      "shareholderDetailId": 10,
      "actionDetailId": 1,
      "currency": "PEN",
      "amount": 10000,
      "contributionDate": "2025-12-01",
      "exchangeRate": null,
      "exchangedAmount": null,
      "sharesToReceive": 100,
      "pricePerShare": 100,
      "hasFullyPaid": true,
      "socialCapital": 9000,
      "premium": 1000,
      "reserve": 0,
      "percentPaidShares": 100,
      "totalPassiveDividend": 0,
      "fileAccountingEntryId": null
    },
    {
      "shareholderDetailId": 10,
      "actionDetailId": 1,
      "currency": "USD",
      "amount": 5000,
      "contributionDate": "2025-12-05",
      "exchangeRate": 3.75,
      "exchangedAmount": 18750,
      "sharesToReceive": 150,
      "pricePerShare": 125,
      "hasFullyPaid": false,
      "socialCapital": 15000,
      "premium": 3750,
      "reserve": 0,
      "percentPaidShares": 50,
      "totalPassiveDividend": 9375,
      "fileAccountingEntryId": 123
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Aportes guardados correctamente",
  "data": {
    "id": 1,
    "details": [
      {
        "id": 100,
        "contributionsId": 1,
        "shareholderDetailId": 10,
        "actionDetailId": 1,
        "currency": "PEN",
        "amount": 10000,
        "contributionDate": "2025-12-01",
        "exchangeRate": null,
        "exchangedAmount": null,
        "sharesToReceive": 100,
        "pricePerShare": 100,
        "hasFullyPaid": true,
        "socialCapital": 9000,
        "premium": 1000,
        "reserve": 0,
        "percentPaidShares": 100,
        "totalPassiveDividend": 0,
        "fileAccountingEntryId": null,
        "fileAccountingEntry": null
      }
    ]
  }
}
```

---

## 🔗 <a id="relacion"></a>5. RELACIÓN ENTRE APORTANTES Y APORTES

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│  PASO 1: APORTANTES                                     │
│  useAportantesAumentoCapitalStore                       │
│                                                          │
│  items: [                                                │
│    { id: 10, name: "Juan Pérez", isContributor: true }, │
│    { id: 11, name: "María Torres", isContributor: true }│
│  ]                                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
              onlyContributors: [id:10, id:11]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  PASO 2: APORTES                                        │
│  useAportesAumentoCapitalStore                          │
│                                                          │
│  setParticipants(aportantes.items)  ← Carga desde paso 1│
│                                                          │
│  monetaryByParticipant: {                                │
│    "10": [                                               │
│      { solesAmount: 10000, sharesToReceive: 100 },      │
│      { dollarsAmount: 5000, sharesToReceive: 150 }      │
│    ],                                                    │
│    "11": [                                               │
│      { solesAmount: 20000, sharesToReceive: 200 }       │
│    ]                                                     │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
```

### Código de Integración

```typescript
// En el paso de Aportes (onMounted)
const storeAportantes = useAportantesAumentoCapitalStore();
const storeAportes = useAportesAumentoCapitalStore();

onMounted(async () => {
  // 1. Cargar participantes desde el paso anterior
  storeAportes.setParticipants(storeAportantes.items);
  
  // 2. Cargar acciones disponibles
  await loadActions();
  
  // 3. Cargar aportes existentes (si es edición)
  await loadExistingAportes();
});
```

---

## 🚀 <a id="migracion-nuxt4"></a>6. MIGRACIÓN A NUXT 4

### Estructura Hexagonal Propuesta

```
app/core/hexag/juntas/aporte-dinerario/
├── domain/
│   ├── entities/
│   │   ├── aportante.entity.ts
│   │   ├── aporte.entity.ts
│   │   └── distribucion-aporte.entity.ts
│   └── ports/
│       ├── aportantes.repository.ts
│       └── aportes.repository.ts
│
├── application/
│   ├── dtos/
│   │   ├── aportante.dto.ts
│   │   └── aporte.dto.ts
│   └── use-cases/
│       ├── aportantes/
│       │   ├── get-aportantes.use-case.ts
│       │   ├── create-aportante.use-case.ts
│       │   ├── toggle-contribuidor.use-case.ts
│       │   └── delete-aportante.use-case.ts
│       └── aportes/
│           ├── get-aportes.use-case.ts
│           ├── create-aporte.use-case.ts
│           ├── validate-distribucion.use-case.ts
│           └── calculate-dividendo-pasivo.use-case.ts
│
└── infrastructure/
    ├── mappers/
    │   ├── aportante.mapper.ts
    │   └── aporte.mapper.ts
    └── repositories/
        ├── aportantes.http.repository.ts
        ├── aportantes.msw.repository.ts
        ├── aportes.http.repository.ts
        └── aportes.msw.repository.ts
```

### Store Migrado (Option API)

```typescript
// app/core/presentation/juntas/aporte-dinerario/stores/useAportantesStore.ts
import { GetAportantesUseCase } from "@/core/hexag/juntas/aporte-dinerario/application/use-cases";
import { aportantesRepository } from "@/core/hexag/juntas/aporte-dinerario/infrastructure";

export const useAportantesStore = defineStore("aportantes", {
  state: () => ({
    aportantes: [] as Aportante[],
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    contribuyentes(state): Aportante[] {
      return state.aportantes.filter((a) => a.isContributor);
    }
  },
  
  actions: {
    async loadAportantes(societyId: string, flowId: string) {
      this.loading = true;
      try {
        const useCase = new GetAportantesUseCase(aportantesRepository);
        this.aportantes = await useCase.execute(societyId, flowId);
      } finally {
        this.loading = false;
      }
    }
  }
});
```

---

## 💡 <a id="ejemplos"></a>7. EJEMPLOS COMPLETOS

### Ejemplo 1: Flujo Completo

```typescript
// 1. PASO APORTANTES
const storeAportantes = useAportantesAumentoCapitalStore();

// Cargar lista
await storeAportantes.fetchAll();

// Agregar nuevo aportante
await storeAportantes.createContributor();

// Marcar como contribuyente
await storeAportantes.toggleContributor(10);

// 2. PASO APORTES
const storeAportes = useAportesAumentoCapitalStore();

// Cargar participantes del paso anterior
storeAportes.setParticipants(storeAportantes.items);

// Agregar aporte
const aporte: MonetaryContributionItem = {
  itemTableId: generateUUID(),
  actionistId: 10,
  isDollars: false,
  solesAmount: 10000,
  dateContributions: "2025-12-01",
  actionId: 1,
  sharesToReceive: 100,
  pricePaidShare: 100,
  socialCapital: 9000,
  prima: 1000,
  reserve: 0,
  fullyPaidShares: true,
  percentPaidShares: 100,
  totalPassiveDividend: 0,
  accountingEntry: {
    fileName: "",
    fileUrl: "",
    fileId: null
  },
  submitting: false
};

storeAportes.addMonetary(10, aporte);
```

---

## ✅ RESUMEN PARA MIGRACIÓN

### Aportantes

**Store**: `useAportantesAumentoCapitalStore`  
**Variable clave**: `items: ContributorResponse[]`  
**Funciones principales**:
- `fetchAll()` - Cargar desde API
- `createContributor()` - Crear aportante
- `toggleContributor()` - Marcar como contribuyente
- `deleteContributor()` - Eliminar

### Aportes

**Store**: `useAportesAumentoCapitalStore`  
**Variable clave**: `monetaryByParticipant: Record<id, MonetaryContributionItem[]>`  
**Funciones principales**:
- `setParticipants()` - Cargar del paso anterior
- `addMonetary()` - Agregar aporte
- `editMonetary()` - Editar aporte
- `deleteMonetary()` - Eliminar aporte

---

**Última actualización**: Diciembre 2025  
**Versión**: 1.0.0  
**Autor**: Documentación ProBO V2.5

