# 📋 DOCUMENTACIÓN: TABLA DE ASISTENCIA Y REPRESENTANTES

**Proyecto**: ProBO V2.5 (Vue 3 + Vite)  
**Fecha**: Diciembre 2025  
**Propósito**: Explicar cómo funciona la tabla de asistencia/representación y su relación con presidente y secretario

---

## 📑 TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura General](#arquitectura-general)
3. [Store Principal: useTablaPoderes](#store-principal)
4. [Interfaces y Tipos de Datos](#interfaces)
5. [Componente Vista: Asistencia.vue](#componente-vista)
6. [Flujo de Datos API → Store](#flujo-api-store)
7. [Relación con Presidente y Secretario](#relacion-presidente-secretario)
8. [Cálculo de Quórum](#calculo-quorum)
9. [Migración a Nuxt 4](#migracion-nuxt4)
10. [Ejemplos de Uso](#ejemplos-uso)

---

## 🎯 <a id="resumen-ejecutivo"></a>1. RESUMEN EJECUTIVO

### ¿Qué es esta tabla?

La **Tabla de Asistencia y Representantes** es el componente central del **Paso 3: Instalación de Junta** en el flujo de Juntas de Accionistas. Combina en una sola vista:

1. **Asistencia**: Checkbox para marcar quiénes asistieron a la junta
2. **Representación**: Asignación de representantes para personas jurídicas
3. **Cálculo de Quórum**: En tiempo real según asistentes marcados
4. **Datos para Autoridades**: Provee la lista de candidatos para presidente/secretario

### Características Clave

```
┌────────────────────────────────────────────────────────────────┐
│ Tabla Unificada: Asistencia + Representación                  │
├────────────────────────────────────────────────────────────────┤
│ ✅ Checkbox Asistió | Nombre | Acciones | % | Representante  │
├────────────────────────────────────────────────────────────────┤
│ [ ]                 | Ana    | 100      | 20% | -            │
│ [✓]                 | Invers.| 200      | 40% | + Agregar    │ ← Persona Jurídica
│ [✓]                 | Sucur. | 50       | 10% | José Matos   │
└────────────────────────────────────────────────────────────────┘
                            ↓
            📊 Cálculo Automático de Quórum
                   (20% + 40% = 60%)
                            ↓
        👥 Lista para Presidente/Secretario
        (Ana, Invers. [representado por José], José Matos)
```

### Ubicación en el Flujo

```
Junta de Accionistas (Flow)
├─ Paso 1: Selección de Agenda
├─ Paso 2: Detalles de la Junta
├─ Paso 3: Instalación ← AQUÍ ESTÁ LA TABLA
│   ├─ Convocatoria (Junta General/Universal)
│   ├─ Tabla Asistencia + Representantes ⭐
│   ├─ Métricas de Quórum
│   └─ Presidente y Secretario
├─ Paso 4: Puntos de Acuerdo
└─ Paso 5: Resumen y Descarga
```

---

## 🏗️ <a id="arquitectura-general"></a>2. ARQUITECTURA GENERAL

### Componentes Principales

```
┌──────────────────────────────────────────────────────────┐
│                    FLUJO DE DATOS                        │
└──────────────────────────────────────────────────────────┘

Backend API
    ↓
    ↓ [InstalacionJuntaAumento]
    ↓
ApiToStorePoderesRepresentacion()  ← Transformador
    ↓
    ↓ [DataTableAccionist[]]
    ↓
useTablaPoderes (Store - Pinia)  ← Estado Global
    ↓
    ├──→ Asistencia.vue (Componente Vista)
    ├──→ QuorumMetrics.vue (Cálculo en tiempo real)
    └──→ PresidenteSecretario.vue (Selección de autoridades)
```

### Archivos Clave

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| **useTablaPoderes.ts** | `src/store/juntas/` | Store principal (Pinia) |
| **Asistencia.vue** | `src/components/InformacionConvocatoria/` | Componente de vista |
| **CustomTable.vue** | `src/components/NewTable/` | Tabla reutilizable |
| **usePresidentSecretary.store.ts** | `src/components/Views/DesignacionPresidenteSecretario/` | Store de autoridades |
| **parser.ts** | `src/components/Views/` | Transformador Store → API |

---

## 🗄️ <a id="store-principal"></a>3. STORE PRINCIPAL: useTablaPoderes

### 📂 Ubicación

```
src/store/juntas/useTablaPoderes.ts
```

### 📝 Estado (State)

```typescript
interface UseTablePoderes {
  asistencia: DataTableAccionist[];  // Lista de accionistas con asistencia
  accionistSelected: string;         // Documento del accionista seleccionado
  percentageAccionista: number;      // Porcentaje del accionista seleccionado
  faltaQuorum: boolean;              // ¿Falta quórum para instalar junta?
}
```

#### Variables del State

| Variable | Tipo | Propósito |
|----------|------|-----------|
| `asistencia` | `DataTableAccionist[]` | **Array principal** con todos los accionistas, su asistencia y representantes |
| `accionistSelected` | `string` | Número de documento del accionista seleccionado (usado en modales) |
| `percentageAccionista` | `number` | Porcentaje de participación del accionista seleccionado |
| `faltaQuorum` | `boolean` | Estado del quórum: `true` = falta, `false` = alcanzado |

### 🎯 Getters (Computados)

#### 1. `findByIdAccionistSelected(id: number)`

**Propósito**: Buscar un accionista por su ID.

```typescript
findByIdAccionistSelected: (state) => (id: number) => {
  return state.asistencia.find((item) => item.id === id);
}
```

**Ejemplo de uso**:
```typescript
const accionista = storeTable.findByIdAccionistSelected(123);
console.log(accionista.name); // "Empresa XYZ SAC"
```

#### 2. `getAccionistSelect()`

**Propósito**: Obtener el accionista actualmente seleccionado (por número de documento).

```typescript
getAccionistSelect: (state) => () => {
  return state.asistencia.find(
    (item) => item.documentNumber === state.accionistSelected
  );
}
```

#### 3. `getPersonasJuridicas`

**Propósito**: Filtrar solo las **personas jurídicas que tienen representante**.

```typescript
getPersonasJuridicas: (state) => {
  return state.asistencia.filter(
    (represented) => represented.typeDocument == "RUC" && represented.representedBy
  );
}
```

**¿Cuándo se usa?**: Para listar en documentos quiénes son las personas jurídicas y sus representantes.

#### 4. `validateJuridicPersonRepresented(): boolean`

**Propósito**: Validar que **TODAS** las personas jurídicas tengan representante asignado.

```typescript
validateJuridicPersonRepresented(): boolean {
  const listJuridic = this.asistencia.filter((item) => item.typeDocument === "RUC");
  return listJuridic.every((item) => item.representedBy !== undefined);
}
```

**Validación crítica**: En Vue 3, las personas jurídicas **DEBEN** tener representante para poder asistir a la junta.

---

### ⚙️ Actions (Acciones)

#### 1. `updateAccionistSelected(document: string)`

**Propósito**: Marcar un accionista como seleccionado (para abrir modal de representante).

```typescript
updateAccionistSelected(document: string) {
  this.accionistSelected = document;
}
```

#### 2. `updateAsistencia(newData: DataTableAccionist[])`

**Propósito**: Reemplazar toda la lista de asistencia (usado al cargar desde API).

```typescript
updateAsistencia(newData: DataTableAccionist[]) {
  this.asistencia = newData;
}
```

#### 3. `updateRepresented(index: number, representedBy: Represent)`

**Propósito**: Asignar un representante a un accionista específico.

```typescript
updateRepresented(index: number, representedBy: Represent) {
  this.asistencia[index].present = true;        // ← Auto-marca como presente
  this.asistencia[index].representedBy = representedBy;
}
```

**⭐ Importante**: Al asignar representante, automáticamente se marca `present = true`.

#### 4. `deleteRepresented(index: number)`

**Propósito**: Eliminar el representante de un accionista.

```typescript
deleteRepresented(index: number) {
  this.asistencia[index].representedBy = undefined;
}
```

#### 5. `deleteRepresentedById(document: string)`

**Propósito**: Eliminar representante por número de documento + llamar al backend.

```typescript
async deleteRepresentedById(document: string) {
  const index = this.asistencia.findIndex(
    (item) => item.documentNumber === document
  );

  if (index !== -1) {
    this.asistencia[index].representedBy = undefined;
    this.asistencia[index].isRemoved = true;
  }

  // Llamada al servicio para eliminar en backend
  const powerService = new PowerRepresentationService();
  await powerService.deletePowersRepresentation(societyId, [shareholderId]);
}
```

#### 6. `updateAllAsistencia()`

**Propósito**: Marcar **TODOS** los accionistas como presentes.

```typescript
updateAllAsistencia() {
  this.asistencia.forEach((e) => {
    e.present = true;
  });
}
```

**Uso**: Botón "Marcar todos como presentes" en Juntas Universales.

#### 7. `updateClearAllAsistencia()`

**Propósito**: Desmarcar **TODOS** los accionistas.

```typescript
updateClearAllAsistencia() {
  this.asistencia.forEach((e) => {
    e.present = false;
  });
}
```

#### 8. `clearAllRepresented()`

**Propósito**: Limpiar **TODOS** los representantes asignados.

```typescript
clearAllRepresented() {
  this.asistencia.forEach((e) => {
    e.representedBy = undefined;
  });
}
```

#### 9. `ApiToStorePoderesRepresentacion(api: InstalacionJuntaAumento)` ⭐

**Propósito**: **TRANSFORMADOR PRINCIPAL** - Convierte la respuesta de la API al formato del store.

```typescript
async ApiToStorePoderesRepresentacion(api: InstalacionJuntaAumento) {
  const storeTable = useTablePoderes();

  // Filtrado de asistentes (solo accionistas, no nuevos aportantes)
  let filteredAsistentes = api.callQuorumAssistantsDetails;

  // Transformación API → Store
  storeTable.asistencia = filteredAsistentes.map((asistente) => {
    return {
      id: asistente.id,
      typeDocument: asistente.typeDocumentRepresented || "RUC",
      documentNumber: asistente.documentNumberRepresented,
      name: asistente.name,
      actions: asistente.actions,
      percentage: Number(asistente.percentage),
      typePerson: asistente.typePerson,
      accionistDetailsId: asistente.accionistDetailsId,
      present: asistente.presentMeetingInstall,
      
      // Transformación de representante (si existe)
      representedBy: asistente.representBy
        ? {
            typePerson: "NATURAL",
            documentNumber: asistente.representBy.documentNumber,
            documentType: getDocumentLabel(asistente.representBy.documentTypeId),
            passportCountryIssuer: asistente.representBy.passportCountryIssuer || "",
            firstName: asistente.representBy.firstName,
            lastNamePaternal: asistente.representBy.lastNamePaternal,
            lastNameMaternal: asistente.representBy.lastNameMaternal,
          }
        : undefined,
    };
  });
}
```

**⭐ Esta es la función clave** que carga los datos desde el backend.

#### 10. `ApiToStoreQuorumStatus(quorumStatus: boolean)`

**Propósito**: Cargar el estado del quórum desde la API.

```typescript
ApiToStoreQuorumStatus(quorumStatus: boolean) {
  this.faltaQuorum = !quorumStatus;  // Invertir: API envía true=alcanzado, store usa true=falta
}
```

---

## 📦 <a id="interfaces"></a>4. INTERFACES Y TIPOS DE DATOS

### Interface Principal: `DataTableAccionist`

```typescript
export interface DataTableAccionist {
  // Identificadores
  id: number;                           // ID del registro
  accionistDetailsId: number;           // ID del accionista en el sistema

  // Datos de la persona/empresa
  name: string;                         // Nombre completo o razón social
  typeDocument: string;                 // "DNI", "RUC", "PASAPORTE", etc.
  documentNumber: string;               // Número de documento
  typePerson: string;                   // "NATURAL", "JURIDICA", "SUCURSAL", etc.

  // Datos accionarios
  actions: number;                      // Cantidad de acciones
  percentage: number;                   // Porcentaje de participación (0-100)
  actionsType?: ShareholderDividendInfo[]; // Detalle por tipo de acción

  // Asistencia
  present: boolean;                     // ¿Asistió a la junta?

  // Representación
  representedBy: Represent | undefined; // Representante asignado (opcional)
  nameRepresented?: string;             // Nombre del representado (legacy)
  typeDocumentRepresented?: string;     // Tipo doc representado (legacy)
  documentNumberRepresented?: string;   // Num doc representado (legacy)

  // Control
  isRemoved?: boolean;                  // Marcado para eliminar
  country?: string;                     // País (para jurídicas extranjeras)
}
```

### Interface: `Represent` (Representante)

```typescript
export interface Represent {
  typePerson: "NATURAL";                // Siempre persona natural
  documentNumber: string;               // Número de documento
  documentType: string;                 // "DNI", "PASAPORTE", "CARNET_EXTRANJERIA"
  passportCountryIssuer: string;        // País emisor (si es pasaporte)
  firstName: string;                    // Nombres
  lastNamePaternal: string;             // Apellido paterno
  lastNameMaternal: string;             // Apellido materno
}
```

**⭐ Nota importante**: Los representantes en V2.5 **SIEMPRE** son personas naturales. Las personas jurídicas no pueden representar a otras en juntas.

### Interface: `ShareholderDividendInfo`

```typescript
export interface ShareholderDividendInfo {
  id: number;
  action: {
    id: number;
    type: string;                       // "ORDINARIA", "PREFERENTE", etc.
    name: string;
    hasRightVote: boolean;              // ¿Tiene derecho a voto?
    hasCommon: boolean;
  };
  subscribedSharesQuantity: string;
  pricePerShare: string;
  percentagePaidPerShare: string;
  unpaidDividendTotal: string;
  fullyPaid: boolean;
}
```

**Uso**: Detalle de acciones por tipo (cuando un accionista tiene acciones de diferentes clases).

---

## 🖼️ <a id="componente-vista"></a>5. COMPONENTE VISTA: Asistencia.vue

### 📂 Ubicación

```
src/components/InformacionConvocatoria/Asistencia.vue
```

### 📄 Código Completo

```vue
<script setup lang="ts">
  import CustomTable from "@/components/NewTable/CustomTable.vue";
  import { useTablePoderes } from "@/store/juntas/useTablaPoderes";

  interface Props {
    formId?: {
      type: String;
      default: "asistencia";
    };
    isDisabled?: Boolean;
    isLoading?: Boolean;
  }

  const props = defineProps<Props>();

  // Definición de columnas
  const headers = [
    { key: "present" },                    // Checkbox asistencia
    { key: "name", label: "Nombre/Razón Social" },
    { key: "actions", label: "Acciones" },
    { key: "percentage", label: "Porcentaje" },
    { key: "representedBy", label: "Representado por" },
  ];

  // Acceso al store
  const storeTable = useTablePoderes();
</script>

<template>
  <CustomTable
    :headers="headers"
    :dataTable="storeTable.asistencia"
    :isDisabled="!!isDisabled"
    :isLoading="props.isLoading || false"
    skeletonType="asistencia"
  />
</template>
```

### Explicación del Componente

1. **Props**:
   - `formId`: Identificador del formulario (default: "asistencia")
   - `isDisabled`: Deshabilita interacción (solo lectura)
   - `isLoading`: Muestra skeleton mientras carga

2. **Headers**: Define las columnas de la tabla
   - `present`: Columna con checkbox para marcar asistencia
   - `name`: Nombre o razón social del accionista
   - `actions`: Cantidad de acciones
   - `percentage`: Porcentaje de participación
   - `representedBy`: Representante asignado (con botón "+ Agregar")

3. **Store**: Usa `useTablePoderes()` para acceder a los datos de asistencia

4. **CustomTable**: Componente reutilizable que renderiza la tabla con:
   - Checkbox interactivo en columna `present`
   - Botón "+ Agregar" para asignar representante
   - Botón "🗑️" para eliminar representante
   - Skeleton de carga

---

## 🔄 <a id="flujo-api-store"></a>6. FLUJO DE DATOS API → Store

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────┐
│                    BACKEND API                          │
│  GET /api/v2/society-profile/:id/flow/:flowId/meeting  │
└─────────────────────────────────────────────────────────┘
                        ↓
                 [Response JSON]
                        ↓
    {
      callQuorumAssistantsDetails: [
        {
          id: 123,
          name: "Empresa XYZ SAC",
          typeDocumentRepresented: "RUC",
          documentNumberRepresented: "20123456789",
          actions: 200,
          percentage: 40.5,
          typePerson: "JURIDICA",
          accionistDetailsId: 456,
          presentMeetingInstall: true,
          representBy: {
            documentNumber: "12345678",
            documentTypeId: 1,
            firstName: "José",
            lastNamePaternal: "Matos",
            lastNameMaternal: "López",
            passportCountryIssuer: null
          }
        },
        // ... más asistentes
      ],
      quorumStatus: true
    }
                        ↓
        ┌──────────────────────────────────────┐
        │ ApiToStorePoderesRepresentacion()   │
        │ (Transformador en useTablaPoderes)  │
        └──────────────────────────────────────┘
                        ↓
              [Transformación]
                        ↓
    {
      id: 123,
      typeDocument: "RUC",
      documentNumber: "20123456789",
      name: "Empresa XYZ SAC",
      actions: 200,
      percentage: 40.5,
      typePerson: "JURIDICA",
      accionistDetailsId: 456,
      present: true,
      representedBy: {
        typePerson: "NATURAL",
        documentNumber: "12345678",
        documentType: "DNI",
        passportCountryIssuer: "",
        firstName: "José",
        lastNamePaternal: "Matos",
        lastNameMaternal: "López"
      }
    }
                        ↓
        ┌──────────────────────────────────────┐
        │   useTablaPoderes.asistencia[]      │
        │         (Pinia Store)               │
        └──────────────────────────────────────┘
                        ↓
        ┌──────────────────────────────────────┐
        │       Asistencia.vue                │
        │     (Vista en CustomTable)          │
        └──────────────────────────────────────┘
```

### Paso a Paso

#### Paso 1: Backend envía datos

```json
{
  "callQuorumAssistantsDetails": [
    {
      "id": 1,
      "name": "Ana García Pérez",
      "typeDocumentRepresented": "DNI",
      "documentNumberRepresented": "12345678",
      "actions": 100,
      "percentage": 20.0,
      "typePerson": "NATURAL",
      "accionistDetailsId": 10,
      "presentMeetingInstall": false,
      "representBy": null
    },
    {
      "id": 2,
      "name": "Inversiones SAC",
      "typeDocumentRepresented": "RUC",
      "documentNumberRepresented": "20123456789",
      "actions": 200,
      "percentage": 40.0,
      "typePerson": "JURIDICA",
      "accionistDetailsId": 20,
      "presentMeetingInstall": true,
      "representBy": {
        "documentNumber": "87654321",
        "documentTypeId": 1,
        "firstName": "José",
        "lastNamePaternal": "Matos",
        "lastNameMaternal": "López",
        "passportCountryIssuer": null
      }
    }
  ],
  "quorumStatus": false
}
```

#### Paso 2: Transformación con `ApiToStorePoderesRepresentacion()`

```typescript
// Se llama así:
const storeTable = useTablePoderes();
await storeTable.ApiToStorePoderesRepresentacion(apiResponse);
```

#### Paso 3: Resultado en el Store

```typescript
storeTable.asistencia = [
  {
    id: 1,
    typeDocument: "DNI",
    documentNumber: "12345678",
    name: "Ana García Pérez",
    actions: 100,
    percentage: 20.0,
    typePerson: "NATURAL",
    accionistDetailsId: 10,
    present: false,
    representedBy: undefined  // No tiene representante
  },
  {
    id: 2,
    typeDocument: "RUC",
    documentNumber: "20123456789",
    name: "Inversiones SAC",
    actions: 200,
    percentage: 40.0,
    typePerson: "JURIDICA",
    accionistDetailsId: 20,
    present: true,
    representedBy: {
      typePerson: "NATURAL",
      documentNumber: "87654321",
      documentType: "DNI",
      passportCountryIssuer: "",
      firstName: "José",
      lastNamePaternal: "Matos",
      lastNameMaternal: "López"
    }
  }
];

storeTable.faltaQuorum = true; // apiResponse.quorumStatus = false → !false = true
```

#### Paso 4: Renderizado en `Asistencia.vue`

```
┌──────────────────────────────────────────────────────────────────┐
│ [ ] | Ana García Pérez  | 100 | 20.0% | -              | [Editar]│
│ [✓] | Inversiones SAC   | 200 | 40.0% | José Matos     | [🗑️]    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 👥 <a id="relacion-presidente-secretario"></a>7. RELACIÓN CON PRESIDENTE Y SECRETARIO

### Concepto Clave

La tabla de asistencia **NO** solo sirve para marcar quiénes asistieron, sino que también:

1. **Provee la lista de candidatos** para presidente y secretario
2. **Filtra automáticamente** quiénes pueden ser elegidos
3. **Se integra con el store de PresidenteSecretario**

### Flujo Completo

```
┌────────────────────────────────────────────────────────────┐
│  1. Tabla de Asistencia (useTablePoderes)                 │
│     - Ana García (presente: false)                         │
│     - Inversiones SAC (presente: true, rep: José Matos)   │
│     - Sucursal Chile (presente: true, rep: María Torres)  │
└────────────────────────────────────────────────────────────┘
                        ↓
        ┌──────────────────────────────────────┐
        │  2. Cálculo de Quórum                │
        │     Presentes: 40% + 30% = 70%       │
        │     Quórum: ALCANZADO ✓              │
        └──────────────────────────────────────┘
                        ↓
        ┌──────────────────────────────────────┐
        │  3. Lista de Candidatos              │
        │     (Solo los presentes)             │
        │                                      │
        │  Candidatos disponibles:             │
        │  - Inversiones SAC                   │
        │  - José Matos (representante)        │
        │  - Sucursal Chile                    │
        │  - María Torres (representante)      │
        │                                      │
        │  ❌ Ana García NO está disponible    │
        │     (no marcó asistencia)            │
        └──────────────────────────────────────┘
                        ↓
        ┌──────────────────────────────────────┐
        │  4. Selección de Autoridades         │
        │     (usePresidentSecretaryStore)     │
        │                                      │
        │  Presidente: [Seleccionar... ▼]      │
        │              - José Matos            │
        │              - María Torres          │
        │              - Otros...              │
        │                                      │
        │  Secretario: [Seleccionar... ▼]      │
        │              - José Matos            │
        │              - María Torres          │
        │              - Otros...              │
        └──────────────────────────────────────┘
```

### Código: Construcción de Opciones para Dropdown

```typescript
// En el componente de Presidente/Secretario
const storeTable = useTablePoderes();
const presidentSecretaryStore = usePresidentSecretaryStore();

// Construir lista de candidatos desde la tabla de asistencia
const buildCandidatesOptions = () => {
  const options: OptionShareholder[] = [];

  storeTable.asistencia.forEach((asistente) => {
    // Solo incluir a los que asistieron
    if (asistente.present) {
      // Agregar al accionista/empresa
      options.push({
        value: asistente.accionistDetailsId,
        label: asistente.name
      });

      // Si tiene representante, agregarlo también como opción
      if (asistente.representedBy) {
        const representanteName = `${asistente.representedBy.firstName} ${asistente.representedBy.lastNamePaternal} ${asistente.representedBy.lastNameMaternal}`;
        
        options.push({
          value: asistente.accionistDetailsId * -1, // ID negativo para diferenciar
          label: `${representanteName} (representa a ${asistente.name})`
        });
      }
    }
  });

  // Agregar opción "Otro" al final
  options.push({
    value: -1,
    label: "Otro (especificar)"
  });

  return options;
};

// Guardar en el store de presidente/secretario
presidentSecretaryStore.setShareholders(buildCandidatesOptions());
```

### Store de Presidente/Secretario

#### 📂 Ubicación

```
src/components/Views/DesignacionPresidenteSecretario/usePresidentSecretary.store.ts
```

#### 📝 Estado Relevante

```typescript
interface State {
  // Opciones construidas desde la tabla de asistencia
  optionShareholders: OptionShareholder[];

  // Presidente seleccionado
  presidentSelect: number | null;
  otherPresident: string;
  directorPresident: { personId: number; name: string } | null;
  attendedPresident: boolean;

  // Secretario seleccionado
  secretarySelect: number | null;
  otherSecretary: string;
  managerSecretary: { personId: number; name: string } | null;
  attendedSecretary: boolean;
}
```

#### Getters para Obtener Nombres

```typescript
getters: {
  // Obtener nombre del presidente seleccionado
  getPresident(): { name: string; type: "director" | "shareholder" | "other" | "" } {
    const appStore = useAppStore();

    // Si tiene directorio y es el director presidente
    if (appStore.societySelectData.society.hasDirectory) {
      if (this.isDirectorPresident && this.directorPresident) {
        return { name: this.directorPresident.name, type: "director" };
      }
    }

    // Si es un accionista/representante seleccionado
    if (this.presidentSelect && this.presidentSelect > 0) {
      const shareholder = this.optionShareholders.find(
        (sh) => sh.value === this.presidentSelect
      );
      return { name: shareholder?.label || "", type: "shareholder" };
    }

    // Si es "Otro" (especificado manualmente)
    if (this.presidentSelect === -1 && this.otherPresident.trim() !== "") {
      return { name: this.otherPresident, type: "other" };
    }

    return { name: "", type: "" };
  },

  // Similar para secretario...
  getSecretary() { /* ... */ }
}
```

### Casos de Uso

#### Caso 1: Sociedad SIN Directorio

```
1. Usuario marca asistencia en tabla:
   [✓] José Matos (Natural, 200 acciones, 40%)
   [✓] María Torres (Natural, 150 acciones, 30%)
   [ ] Pedro Ruiz (Natural, 100 acciones, 20%)

2. Se construye lista de candidatos:
   - José Matos
   - María Torres
   - Otro (especificar)

3. Usuario selecciona:
   Presidente: José Matos ✓
   Secretario: María Torres ✓

4. Se guarda en backend:
   {
     presidentAccionistId: 123,  // ID de José Matos
     secretaryAccionistId: 456   // ID de María Torres
   }
```

#### Caso 2: Sociedad CON Directorio

```
1. Usuario marca asistencia en tabla:
   [✓] Inversiones SAC (Jurídica, rep: José Matos)
   [✓] Holding Corp (Jurídica, rep: María Torres)

2. Sistema carga directorio:
   Presidente del Directorio: Cristian Huamán
   Secretario del Directorio: Ana García

3. UI muestra:
   ┌──────────────────────────────────────┐
   │ Presidente:                          │
   │ ¿Asistió Cristian Huamán? [SI] [NO] │
   │                                      │
   │ Si NO asistió:                       │
   │ [Seleccionar... ▼]                   │
   │   - José Matos (rep de Inversiones)  │
   │   - María Torres (rep de Holding)    │
   │   - Otro...                          │
   └──────────────────────────────────────┘

4. Usuario marca:
   Presidente: ¿Asistió? → NO
   Selecciona: José Matos ✓

5. Se guarda:
   {
     presidentPersonType: "SHAREHOLDER",
     presidentAttended: false,
     presidentAccionistId: 123  // José Matos
   }
```

---

## 📊 <a id="calculo-quorum"></a>8. CÁLCULO DE QUÓRUM

### ¿Qué es el Quórum?

El **quórum** es el **porcentaje mínimo de acciones** que deben estar presentes para que la junta sea válida.

### Tipos de Quórum (según Estatutos)

| Tipo | Porcentaje Mínimo | Descripción |
|------|-------------------|-------------|
| **Simple** | 50% + 1 acción | Mayoría simple |
| **Calificado** | 66.67% (2/3) | Decisiones importantes |
| **Absoluto** | 75% | Modificaciones estatutarias |
| **Universal** | 100% | Todos los accionistas presentes |

### Cálculo en Tiempo Real

```typescript
// Composable para calcular quórum
export const useQuorumCalculator = () => {
  const storeTable = useTablePoderes();
  
  const calculateQuorum = computed(() => {
    // Total de acciones CON derecho a voto
    const totalActions = storeTable.asistencia.reduce(
      (sum, asistente) => sum + asistente.actions,
      0
    );

    // Acciones de los presentes
    const presentActions = storeTable.asistencia
      .filter((asistente) => asistente.present)
      .reduce((sum, asistente) => sum + asistente.actions, 0);

    // Porcentaje
    const percentage = (presentActions / totalActions) * 100;

    // Configuración de quórum desde estatutos
    const appStore = useAppStore();
    const quorumConfig = appStore.societySelectData.society.quorum;
    const minimumRequired = quorumConfig.percentageRequired || 50;

    return {
      tipoQuorum: quorumConfig.type,          // "SIMPLE", "CALIFICADO", etc.
      porcentajeMinimoRequerido: minimumRequired,
      totalAcciones: totalActions,
      accionesPresentes: presentActions,
      porcentajePresente: percentage,
      cumpleQuorum: percentage >= minimumRequired,
      mensaje: percentage >= minimumRequired 
        ? "Quórum alcanzado ✓" 
        : `Falta de quórum (Mínimo: ${minimumRequired}%)`
    };
  });

  return { quorum: calculateQuorum };
};
```

### Componente de Métricas

```vue
<template>
  <div class="quorum-section">
    <!-- Título y porcentaje -->
    <div class="flex justify-between mb-4">
      <h3>Acciones presentes</h3>
      <span class="text-2xl font-bold">
        {{ quorum.porcentajePresente.toFixed(2) }}%
      </span>
    </div>

    <!-- Barra de progreso -->
    <div class="progress-bar">
      <div
        class="progress-fill"
        :class="quorum.cumpleQuorum ? 'bg-green-500' : 'bg-red-500'"
        :style="{ width: `${quorum.porcentajePresente}%` }"
      />
    </div>

    <!-- Mensaje -->
    <div class="mt-4">
      <span
        :class="quorum.cumpleQuorum ? 'text-green-600' : 'text-red-600'"
        class="font-semibold"
      >
        {{ quorum.mensaje }}
      </span>
    </div>

    <!-- Cards de métricas -->
    <div class="grid grid-cols-2 gap-4 mt-6">
      <div class="card">
        <span class="text-gray-600">Quórum:</span>
        <span class="font-bold">{{ quorum.tipoQuorum }}</span>
      </div>

      <div class="card">
        <span class="text-gray-600">Mínimo para instalar:</span>
        <span class="font-bold">{{ quorum.porcentajeMinimoRequerido }}%</span>
      </div>

      <div class="card">
        <span class="text-gray-600">Total de acciones:</span>
        <span class="font-bold">{{ quorum.totalAcciones }}</span>
      </div>

      <div class="card">
        <span class="text-gray-600">Acciones presentes:</span>
        <span class="font-bold">{{ quorum.accionesPresentes }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useQuorumCalculator } from "@/composables/useQuorumCalculator";

  const { quorum } = useQuorumCalculator();
</script>
```

---

## 🚀 <a id="migracion-nuxt4"></a>9. MIGRACIÓN A NUXT 4

### Cambios Arquitectónicos

#### De Vue 3 (V2.5) → Nuxt 4 (V3)

| Aspecto | Vue 3 (V2.5) | Nuxt 4 (V3) |
|---------|-------------|-------------|
| **Store** | Pinia (cualquier API) | Pinia (Option API obligatorio) |
| **Lógica de negocio** | En stores/composables | En Use Cases (hexagonal) |
| **API calls** | $fetch directo | Repositories (HTTP + MSW) |
| **Validaciones** | Inline | Domain Layer |
| **Transformaciones** | Inline | Mappers (Infrastructure) |

### Estructura Hexagonal Propuesta

```
app/core/hexag/juntas/instalacion/
├── domain/
│   ├── entities/
│   │   ├── asistente.entity.ts
│   │   ├── representante.entity.ts
│   │   └── quorum.entity.ts
│   └── ports/
│       └── instalacion.repository.ts
│
├── application/
│   ├── dtos/
│   │   ├── asistente.dto.ts
│   │   └── instalacion.request.dto.ts
│   └── use-cases/
│       ├── get-asistentes.use-case.ts
│       ├── update-asistencia.use-case.ts
│       ├── assign-representante.use-case.ts
│       └── calculate-quorum.use-case.ts
│
└── infrastructure/
    ├── mappers/
    │   ├── asistente.mapper.ts
    │   └── quorum.mapper.ts
    └── repositories/
        ├── instalacion.http.repository.ts
        └── instalacion.msw.repository.ts
```

### Migración del Store

#### Antes (V2.5 - Vue 3)

```typescript
// ❌ V2.5 - Lógica mezclada en store
export const useTablePoderes = defineStore("tablePoderes", {
  state: () => ({
    asistencia: [],
  }),

  actions: {
    async updateRepresented(index: number, representedBy: Represent) {
      // ❌ Validación en store
      if (!representedBy.documentNumber) {
        throw new Error("Documento requerido");
      }

      // ❌ Transformación en store
      this.asistencia[index].present = true;
      this.asistencia[index].representedBy = representedBy;

      // ❌ API call directo
      await $fetch(`/api/asistencia/${index}/representante`, {
        method: "PUT",
        body: representedBy,
      });
    },
  },
});
```

#### Después (V3 - Nuxt 4 Hexagonal)

```typescript
// ✅ V3 - Domain Layer: Entidad
// app/core/hexag/juntas/instalacion/domain/entities/asistente.entity.ts
export interface Asistente {
  id: number;
  nombre: string;
  acciones: number;
  porcentaje: number;
  asistio: boolean;
  representante?: Representante;
}

export interface Representante {
  documentNumber: string;
  documentType: TipoDocumento;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
}
```

```typescript
// ✅ V3 - Application Layer: Use Case
// app/core/hexag/juntas/instalacion/application/use-cases/assign-representante.use-case.ts
export class AssignRepresentanteUseCase {
  constructor(private repository: InstalacionRepository) {}

  async execute(
    societyId: string,
    flowId: string,
    asistenteId: number,
    representante: Representante
  ): Promise<Asistente> {
    // ✅ Validación en Domain
    if (!representante.documentNumber) {
      throw new DomainError("El número de documento es obligatorio");
    }

    // ✅ Repository maneja persistencia
    const updatedAsistente = await this.repository.assignRepresentante(
      societyId,
      flowId,
      asistenteId,
      representante
    );

    // ✅ Al asignar representante, auto-marca como presente
    updatedAsistente.asistio = true;

    return updatedAsistente;
  }
}
```

```typescript
// ✅ V3 - Infrastructure Layer: Repository HTTP
// app/core/hexag/juntas/instalacion/infrastructure/repositories/instalacion.http.repository.ts
export class InstalacionHttpRepository implements InstalacionRepository {
  async assignRepresentante(
    societyId: string,
    flowId: string,
    asistenteId: number,
    representante: Representante
  ): Promise<Asistente> {
    // Mapper: Entidad → DTO
    const dto = RepresentanteMapper.entityToDto(representante);

    const response = await $fetch(
      `/api/v2/society-profile/${societyId}/flow/${flowId}/asistencia/${asistenteId}/representante`,
      {
        method: "PUT",
        body: dto,
      }
    );

    // Mapper: DTO → Entidad
    return AsistenteMapper.dtoToEntity(response.data);
  }
}
```

```typescript
// ✅ V3 - Presentation Layer: Store (Option API)
// app/core/presentation/juntas/instalacion/stores/useInstalacionStore.ts
import { AssignRepresentanteUseCase } from "@/core/hexag/juntas/instalacion/application/use-cases";
import { instalacionRepository } from "@/core/hexag/juntas/instalacion/infrastructure";

export const useInstalacionStore = defineStore("instalacion", {
  state: () => ({
    asistentes: [] as Asistente[],
    loading: false,
  }),

  actions: {
    // ✅ Store solo maneja estado UI, delega a Use Case
    async assignRepresentante(
      asistenteId: number,
      representante: Representante
    ) {
      this.loading = true;
      try {
        const route = useRoute();
        const societyId = route.params.societyId as string;
        const flowId = route.params.flowId as string;

        const useCase = new AssignRepresentanteUseCase(instalacionRepository);
        const updatedAsistente = await useCase.execute(
          societyId,
          flowId,
          asistenteId,
          representante
        );

        // Actualizar en el estado
        const index = this.asistentes.findIndex((a) => a.id === asistenteId);
        if (index !== -1) {
          this.asistentes[index] = updatedAsistente;
        }

        toast.success("Representante asignado correctamente");
      } finally {
        this.loading = false;
      }
    },
  },
});
```

### Beneficios de la Migración

1. **✅ Testeable**: Use Cases independientes, fáciles de testear con mocks
2. **✅ Mantenible**: Separación clara de responsabilidades
3. **✅ Escalable**: Fácil agregar nuevas funcionalidades
4. **✅ Type-safe**: TypeScript estricto en todas las capas
5. **✅ MSW Testing**: Desarrollo sin backend usando MSW repository
6. **✅ Reutilizable**: Use Cases pueden usarse desde múltiples componentes

---

## 💡 <a id="ejemplos-uso"></a>10. EJEMPLOS DE USO

### Ejemplo 1: Marcar Asistencia de un Accionista

```typescript
// En el componente
import { useTablePoderes } from "@/store/juntas/useTablaPoderes";

const storeTable = useTablePoderes();

// Función para toggle asistencia
const toggleAsistencia = (index: number) => {
  const asistente = storeTable.asistencia[index];
  asistente.present = !asistente.present;

  // Guardar en backend (llamada al servicio)
  await saveAsistenciaToBackend();
};
```

### Ejemplo 2: Asignar Representante a Persona Jurídica

```vue
<script setup lang="ts">
import { useTablePoderes } from "@/store/juntas/useTablaPoderes";
import { ref } from "vue";

const storeTable = useTablePoderes();
const isModalOpen = ref(false);
const selectedAsistenteIndex = ref<number | null>(null);

// Abrir modal para asignar representante
const openRepresentanteModal = (index: number) => {
  selectedAsistenteIndex.value = index;
  isModalOpen.value = true;
};

// Guardar representante
const saveRepresentante = async (representante: Represent) => {
  if (selectedAsistenteIndex.value !== null) {
    storeTable.updateRepresented(selectedAsistenteIndex.value, representante);
    
    // Guardar en backend
    await saveRepresentanteToBackend();
    
    isModalOpen.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Tabla -->
    <Asistencia @add-representante="openRepresentanteModal" />

    <!-- Modal -->
    <ModalRepresentante
      :open="isModalOpen"
      @save="saveRepresentante"
      @close="isModalOpen = false"
    />
  </div>
</template>
```

### Ejemplo 3: Calcular Quórum en Tiempo Real

```vue
<script setup lang="ts">
import { useTablePoderes } from "@/store/juntas/useTablaPoderes";
import { computed } from "vue";

const storeTable = useTablePoderes();

// Cálculo reactivo del quórum
const quorum = computed(() => {
  const total = storeTable.asistencia.reduce(
    (sum, a) => sum + a.actions,
    0
  );

  const presentes = storeTable.asistencia
    .filter((a) => a.present)
    .reduce((sum, a) => sum + a.actions, 0);

  const percentage = (presentes / total) * 100;

  return {
    total,
    presentes,
    percentage: percentage.toFixed(2),
    cumple: percentage >= 50, // Quórum simple
  };
});
</script>

<template>
  <div class="quorum-card">
    <h3>Quórum</h3>
    <p>Total acciones: {{ quorum.total }}</p>
    <p>Acciones presentes: {{ quorum.presentes }}</p>
    <p>Porcentaje: {{ quorum.percentage }}%</p>
    <p :class="quorum.cumple ? 'text-green-600' : 'text-red-600'">
      {{ quorum.cumple ? "Quórum alcanzado ✓" : "Falta de quórum" }}
    </p>
  </div>
</template>
```

### Ejemplo 4: Construir Lista de Candidatos para Presidente/Secretario

```typescript
import { useTablePoderes } from "@/store/juntas/useTablaPoderes";
import { usePresidentSecretaryStore } from "@/components/Views/DesignacionPresidenteSecretario/usePresidentSecretary.store";

const storeTable = useTablePoderes();
const presidentSecretaryStore = usePresidentSecretaryStore();

// Construir opciones desde la tabla de asistencia
const buildOptions = () => {
  const options = [];

  storeTable.asistencia.forEach((asistente) => {
    // Solo los que asistieron
    if (asistente.present) {
      // Agregar accionista
      options.push({
        value: asistente.accionistDetailsId,
        label: asistente.name,
      });

      // Si tiene representante, agregarlo también
      if (asistente.representedBy) {
        const repName = `${asistente.representedBy.firstName} ${asistente.representedBy.lastNamePaternal}`;
        options.push({
          value: asistente.accionistDetailsId * -1,
          label: `${repName} (representa a ${asistente.name})`,
        });
      }
    }
  });

  // Opción "Otro"
  options.push({ value: -1, label: "Otro (especificar)" });

  return options;
};

// Guardar en store de presidente/secretario
presidentSecretaryStore.setShareholders(buildOptions());
```

### Ejemplo 5: Validar que Todas las Personas Jurídicas Tengan Representante

```typescript
import { useTablePoderes } from "@/store/juntas/useTablaPoderes";

const storeTable = useTablePoderes();

// Validar antes de pasar al siguiente paso
const validateAndContinue = () => {
  if (!storeTable.validateJuridicPersonRepresented) {
    toast.error(
      "Todas las personas jurídicas deben tener un representante asignado"
    );
    return;
  }

  // Continuar al siguiente paso
  router.push("/siguiente-paso");
};
```

### Ejemplo 6: Marcar Todos como Presentes (Junta Universal)

```typescript
import { useTablePoderes } from "@/store/juntas/useTablaPoderes";

const storeTable = useTablePoderes();

// Botón "Marcar todos como presentes"
const markAllPresent = () => {
  storeTable.updateAllAsistencia();
  toast.success("Todos los accionistas marcados como presentes");
};
```

---

## 📝 RESUMEN FINAL

### Lo Más Importante

1. **Store Principal**: `useTablaPoderes` en `src/store/juntas/useTablaPoderes.ts`
2. **Datos**: Array `asistencia: DataTableAccionist[]` con toda la información
3. **Funciones Clave**:
   - `ApiToStorePoderesRepresentacion()`: Carga desde API
   - `updateRepresented()`: Asigna representante
   - `validateJuridicPersonRepresented()`: Valida personas jurídicas
4. **Relación con Presidente/Secretario**: La tabla provee la lista de candidatos
5. **Quórum**: Se calcula sumando acciones de los presentes

### Migración a Nuxt 4

- ✅ Separar en 4 capas: Domain → Application → Infrastructure → Presentation
- ✅ Usar Use Cases para lógica de negocio
- ✅ Crear repositorios HTTP + MSW
- ✅ Store (Option API) solo maneja estado UI

### Próximos Pasos

1. Leer `usePresidentSecretary.store.ts` para entender la selección de autoridades
2. Ver `CustomTable.vue` para entender el componente de vista
3. Revisar servicios de backend en `PowerRepresentationService`
4. Estudiar cálculo de quórum en composables

---

**Última actualización**: Diciembre 2025  
**Versión**: 1.0.0  
**Autor**: Documentación ProBO V2.5

