# 🧠 MI ENTENDIMIENTO: Registro de Sociedades y Juntas (V2.5)

**Autor**: IA Assistant  
**Fecha**: 2 de Diciembre 2025  
**Propósito**: Documentar con mis propias palabras cómo funcionan Registro de Sociedades y Selección de Juntas en V2.5, para luego crear los pasos en V3  
**Audiencia**: Yo mismo (IA) y el equipo de desarrollo

---

## 📋 ÍNDICE

1. [Registro de Sociedades: Cómo funciona](#registro-sociedades)
2. [Selección de Juntas: Cómo funciona](#seleccion-juntas)
3. [Patrón identificado](#patron-identificado)
4. [Plan para V3](#plan-v3)

---

## 1️⃣ <a id="registro-sociedades"></a>REGISTRO DE SOCIEDADES: CÓMO FUNCIONA

### Concepto General

El Registro de Sociedades es un **wizard de 9 pasos** donde el usuario:
1. Busca una sociedad por RUC (consulta SUNAT)
2. Completa información adicional paso a paso
3. Cada paso guarda datos en backend inmediatamente
4. Al final, tiene una sociedad completa registrada

### Arquitectura V2.5

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTROLLER                               │
│         society-profile.controller.ts                        │
│                                                              │
│  - Orquesta el flujo de 9 pasos                            │
│  - Decide qué service llamar según currentStep              │
│  - Maneja navegación entre pasos                           │
│  - En modo EDIT: carga todos los datos al inicio           │
│  - En modo CREATE: guarda paso a paso                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     SERVICES                                 │
│                                                              │
│  Paso 1: SocietyService         (datos sociedad)           │
│  Paso 2: ActionsService          (clases de acciones)      │
│  Paso 3: ActionistService        (accionistas)             │
│  Paso 4: SharesAllocationService (asignación acciones)     │
│  Paso 5: DirectoryService        (directorio)              │
│  Paso 6: PowerRegimeService      (régimen de poderes)      │
│  Paso 7: AttorneyRegistryService (apoderados)              │
│  Paso 8: QuorumMajoritiesService (quorum y mayorías)       │
│  Paso 9: CorporateAgreementsService (acuerdos)             │
│                                                              │
│  Cada service tiene:                                        │
│  - upsert(): Crea o actualiza según contexto               │
│  - get(): Obtiene datos del backend                        │
│  - Mapper: Transforma data API ↔ Store                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     STORES (Pinia)                           │
│                                                              │
│  - useStoreRegisterSociety (paso 1)                        │
│  - useStoreActions (paso 2)                                │
│  - useStoreActionist (paso 3)                              │
│  - useStoreSharesAllocation (paso 4)                       │
│  - useStoreDirectory (paso 5)                              │
│  - useStorePowerRegime (paso 6)                            │
│  - useStoreAttorneyRegistry (paso 7)                       │
│  - useStoreQuorumMajorities (paso 8)                       │
│  - useStoreCorporateAgreements (paso 9)                    │
│                                                              │
│  Cada store contiene:                                       │
│  - State: Todos los campos del formulario                  │
│  - Getters: validateForm, payloadData                      │
│  - Actions: setDataLocal, resetPartial                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   COMPONENTES VUE                            │
│                                                              │
│  - RegistroSociedades.vue (Paso 1)                         │
│  - CapitalSocialAcciones.vue (Paso 2)                      │
│  - Accionistas.vue (Paso 3)                                │
│  - AsignacionAcciones.vue (Paso 4)                         │
│  - Directorio.vue (Paso 5)                                 │
│  - RegimenPoderes.vue (Paso 6)                             │
│  - RegistroApoderados.vue (Paso 7)                         │
│  - QuorumMayorias.vue (Paso 8)                             │
│  - AcuerdosSocietarios.vue (Paso 9)                        │
│                                                              │
│  Cada componente:                                           │
│  - Usa v-model con el store correspondiente                │
│  - Deshabilita campos según estado (isPreview, isDisable)  │
│  - Valida formulario en tiempo real                        │
└─────────────────────────────────────────────────────────────┘
```

### Flujo Detallado: Paso 1 (Datos de Sociedad)

#### A. Usuario ingresa RUC

```typescript
// Componente: RegistroSociedades.vue
<BaseInputSearch
  v-model="registerSocietyStore.ruc"
  :handleSearch="handleSearchRuc"  // ← Función que consulta SUNAT
/>

// useSocietyRegister.ts
const handleSearchRuc = async () => {
  isLoadingRuc.value = true;
  
  // 1. Consultar API SUNAT (composable)
  const data = await fetchSunatData(registerSocietyStore.ruc);
  
  // 2. Llenar el store con datos de SUNAT
  registerSocietyStore.setDataRegisterSociety(data);
  
  // 3. Habilitar campos para edición
  isDisable.value = false;
  isLoadingRuc.value = false;
};
```

**¿Qué hace `setDataRegisterSociety`?**

```typescript
// useStoreRegisterSociety.ts
setDataRegisterSociety(data: SunatResponseRuc) {
  // Mapea datos de SUNAT a campos del store
  this.ruc = data.ruc;                                    // "20123456789"
  this.typeSocietyId = Number(getSociety(data.tipo));     // 1 (SA), 2 (SAC), etc.
  this.reasonSocial = data.razonSocial;                   // "EMPRESA S.A."
  this.commercialName = data.nombreComercial || "No existe registro";
  this.address = data.direccion;                          // "Av. Principal 123"
  this.district = data.distrito;                          // "Miraflores"
  this.province = data.provincia;                         // "Lima"
  this.department = data.departamento;                    // "Lima"
  this.registrationDate = formatDate(data.fechaInscripcion); // "2024-01-15"
  this.foreignActivity = data.actividadExterior || "No existe registro";
  
  // ⭐ LÓGICA DE NEGOCIO: SA siempre tiene directorio, SAC depende
  this.hasDirectory = this.typeSocietyId === 1 || this.typeSocietyId === 2;
  this.idDirectory = -1; // Reset para nueva sociedad
}
```

#### B. Usuario completa campos faltantes

```vue
<!-- RegistroSociedades.vue -->
<!-- Fecha de Escritura Pública -->
<DateInput
  v-model="registerSocietyStore.publicDeedDate"
  title="Fecha de Escritura Pública de Constitución"
/>

<!-- Partida Registral -->
<BaseInputText
  v-model="registerSocietyStore.registrationRecord"
  placeholder="Ingrese la partida registral"
/>

<!-- Oficina Registral -->
<BaseInputSelect
  v-model="registerSocietyStore.registryOffice"
  :options="officeOptions"
  title="Oficina Registral"
/>
```

**Validación en tiempo real**:

```typescript
// useStoreRegisterSociety.ts - Getter
validateForm(): boolean {
  return (
    this.typeSocietyId !== 0 &&
    this.reasonSocial !== "" &&
    this.commercialName !== "" &&
    this.address !== "" &&
    this.district !== "" &&
    this.province !== "" &&
    this.department !== "" &&
    this.registrationDate !== "" &&
    this.foreignActivity !== "" &&
    this.registryOffice !== ""
  );
}

// RegistroSociedades.vue - watchEffect
watchEffect(() => {
  // ⭐ Habilita/deshabilita botón "Siguiente" según validación
  layoutStore.isButtonDisabled = registerSocietyStore.validateForm;
});
```

#### C. Usuario hace clic en "Siguiente"

```typescript
// Layout Footer tiene un botón "Siguiente"
<Button @click="layoutStore.onclick()">Siguiente</Button>

// layoutStore.onclick apunta a:
layoutStore.onclick = () => wizardController(layoutStore, false);

// wizardController llama a:
await societyProfileController(layout, isEdit, societyId);
```

**¿Qué hace el controller?**

```typescript
// society-profile.controller.ts
export async function societyProfileController(
  layout: ReturnType<typeof useLayoutStore>,
  isEdit: boolean,
  societyId?: number
) {
  const registerSocietyStore = useStoreRegisterSociety();
  const societyService = new SocietyService();
  
  // ... (crear instancias de todos los services)
  
  // ⭐ MODO EDIT: Cargar todos los datos al inicio
  if (isEdit) {
    await societyService.get(societyId!);           // Paso 1
    await actionsService.get(societyId!);           // Paso 2
    await actionistService.get(societyId!);         // Paso 3
    await sharesAllocationService.get(societyId!);  // Paso 4
    
    // Cargar pasos restantes en paralelo
    await Promise.allSettled([
      directoryService.get(societyId!),
      powerRegimenService.get(societyId!),
      attorneyRegistryService.getDataLocal(),
      quorumMajoritiesService.get(societyId!),
      corporateAgreementsService.get(societyId!),
    ]);
    
    return; // No navegar, solo cargar datos
  }
  
  // ⭐ MODO CREATE: Guardar paso actual y navegar al siguiente
  switch (layout.currentStep) {
    case 1:
      await societyService.upsert();  // ← Guarda datos del Paso 1
      router.push({ name: 'CAPITAL_SOCIAL_Y_ACCIONES_2' });
      break;
    case 2:
      await actionsService.upsert();
      router.push({ name: 'ACCIONISTAS_3' });
      break;
    // ... (casos 3-9)
  }
}
```

#### D. Service guarda en backend

```typescript
// society.service.ts
export class SocietyService extends AbstractService<ApiResponse<SocietyResponse>> {
  private mapper = new SocietyMapper();
  private societyStore = useStoreSocietyFlow();
  private registerSocietyStore = useStoreRegisterSociety();

  async upsert(): Promise<ApiResponse<SocietyResponse>> {
    if (this.societyStore.idSocietySelect) {
      return this.update();  // Si existe ID, actualizar
    }
    return this.create();    // Si no existe ID, crear
  }

  async create(): Promise<ApiResponse<SocietyResponse>> {
    try {
      // 1. Mapper: Store → DTO API
      const dto: SocietyDto = this.mapper.storeToApi();
      
      // 2. POST al backend
      const response = await postMainDataSociety(dto);
      
      // 3. Mapper: DTO API → Store (con ID asignado por backend)
      const apiToStore = this.mapper.apiToStore(response);
      this.registerSocietyStore.$state = apiToStore;
      
      // 4. Guardar ID de sociedad para próximos pasos
      this.societyStore.idSocietySelect = response.data.society.id;
      
      return response;
    } catch (error: any) {
      toastMessage("error", error?.response?.data?.message);
      throw error;
    }
  }
  
  async update(): Promise<ApiResponse<SocietyResponse>> {
    // Similar a create(), pero usa PUT
    const dto = this.mapper.storeToApi();
    const response = await putMainDataSociety(this.societyStore.idSocietySelect!, dto);
    
    // Actualizar store con respuesta
    const apiToStore = this.mapper.apiToStore(response);
    this.registerSocietyStore.$state = apiToStore;
    
    return response;
  }
}
```

**¿Qué hace el Mapper?**

```typescript
// society.mapper.ts
export class SocietyMapper {
  // Store → DTO API
  storeToApi(): SocietyDto {
    const store = useStoreRegisterSociety();
    
    return {
      id: store.id,
      ruc: store.ruc,
      typeSocietyId: store.typeSocietyId,
      reasonSocial: store.reasonSocial,
      commercialName: store.commercialName,
      address: store.address,
      district: store.district,
      province: store.province,
      department: store.department,
      registrationDate: store.registrationDate,
      foreignActivity: store.foreignActivity,
      publicDeedDate: store.publicDeedDate,
      registrationRecord: store.registrationRecord,
      registryOffice: store.registryOffice,
      hasDirectory: store.hasDirectory,
    };
  }
  
  // DTO API → Store
  apiToStore(response: ApiResponse<SocietyResponse>): RegisterSocietyState {
    const data = response.data.society;
    
    return {
      id: data.id,
      ruc: data.ruc,
      typeSocietyId: data.typeSocietyId,
      reasonSocial: data.reasonSocial,
      commercialName: data.commercialName,
      address: data.address,
      district: data.district,
      province: data.province,
      department: data.department,
      registrationDate: data.registrationDate,
      foreignActivity: data.foreignActivity,
      publicDeedDate: data.publicDeedDate,
      registrationRecord: data.registrationRecord,
      registryOffice: data.registryOffice,
      hasDirectory: data.hasDirectory,
      idDirectory: response.data.directoryId || -1,
    };
  }
}
```

### Puntos Clave del Patrón

#### 1. **Store como fuente de verdad**
- El store contiene TODOS los datos del formulario
- Los componentes Vue usan `v-model` directo al store
- No hay state local en componentes

```vue
<!-- Directamente vinculado al store -->
<BaseInputText v-model="registerSocietyStore.reasonSocial" />
```

#### 2. **Validación reactiva**
- El store tiene un getter `validateForm` que verifica todos los campos
- El botón "Siguiente" se habilita/deshabilita según `validateForm`

```typescript
// Store
validateForm(): boolean {
  return this.field1 !== "" && this.field2 !== "" && ...;
}

// Componente
watchEffect(() => {
  layoutStore.isButtonDisabled = registerSocietyStore.validateForm;
});
```

#### 3. **Guardado inmediato**
- Cada paso guarda en backend ANTES de navegar al siguiente
- Si falla el guardado, no se navega (throw error)

```typescript
case 1:
  await societyService.upsert();  // ← Espera a que termine
  router.push({ name: 'PASO_2' }); // ← Solo si no hay error
```

#### 4. **Mapper centralizado**
- Todas las transformaciones Store ↔ API en un solo lugar
- Evita código duplicado en services

```typescript
// En lugar de:
const dto = { id: store.id, ruc: store.ruc, ... } // ❌ Repetido

// Se hace:
const dto = this.mapper.storeToApi(); // ✅ Centralizado
```

#### 5. **Modo Edit vs Create**
- **Create**: Guarda paso a paso, avanza linealmente
- **Edit**: Carga todos los datos al inicio, luego permite editar cualquier paso

```typescript
if (isEdit) {
  // Cargar todos los datos en paralelo
  await Promise.allSettled([...todos los services.get()]);
} else {
  // Guardar solo el paso actual
  await currentService.upsert();
  router.push(nextStep);
}
```

---

## 2️⃣ <a id="seleccion-juntas"></a>SELECCIÓN DE JUNTAS: CÓMO FUNCIONA

### Concepto General

La "Selección de Juntas" es el **primer paso de TODOS los flujos de juntas** donde el usuario elige:
- **Junta General** (requiere convocatoria, asistencia)
- **Junta Universal** (todos presentes, sin convocatoria formal)

Esta selección determina si se saltean ciertos pasos del flujo.

### Arquitectura V2.5

```
┌─────────────────────────────────────────────────────────────┐
│             COMPONENTE PRINCIPAL                             │
│           SeleccionarJunta.vue                               │
│                                                              │
│  - Muestra 2 opciones: Junta General / Junta Universal     │
│  - Usa <SelectRatioJuntaType /> para el diseño             │
│  - Delega lógica a useMeetingTypeSelection                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                 COMPOSABLE                                   │
│           useMeetingTypeSelection.ts                         │
│                                                              │
│  - Maneja la selección del tipo de junta                   │
│  - Actualiza 3 stores diferentes                           │
│  - Dispara navegación al siguiente paso                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    STORES                                    │
│                                                              │
│  1. useTypeMeetingStore                                     │
│     - workingMeetingId: MeetingByIdEnum                    │
│     - updateWorkingMeetingId(id)                           │
│                                                              │
│  2. useRoleMeetingStore                                     │
│     - meetingType: MeetingType                             │
│     - updateMeetingType(type)                              │
│                                                              │
│  3. useLayoutStore                                          │
│     - tipoDeJunta: "Junta General" | "Junta Universal"    │
│     - currentStep, arraySelec, etc.                        │
└─────────────────────────────────────────────────────────────┘
```

### Flujo Detallado

#### A. Usuario ve las opciones

```vue
<!-- SeleccionarJunta.vue -->
<template>
  <div class="flex flex-col h-full">
    <JuntaTypeSkeleton v-if="layout.isLoading" />
    <SelectRatioJuntaType v-else />
  </div>
</template>

<script setup>
import { useMeetingTypeSetup } from "./useMeetingType.setup";

useMeetingTypeSetup(); // ← Inicializa stores y layout
</script>
```

**Componente de selección**:

```vue
<!-- SelectRatioJuntaType.vue (simplificado) -->
<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Opción 1: Junta General -->
    <CardOption
      title="Junta General"
      description="Requiere convocatoria previa"
      icon="calendar"
      :selected="localSelectedJunta === MeetingTypeV2.JUNTA_GENERAL"
      @click="handleSelect(MeetingTypeV2.JUNTA_GENERAL)"
    />
    
    <!-- Opción 2: Junta Universal -->
    <CardOption
      title="Junta Universal"
      description="Todos los accionistas presentes"
      icon="users"
      :selected="localSelectedJunta === MeetingTypeV2.JUNTA_UNIVERSAL"
      @click="handleSelect(MeetingTypeV2.JUNTA_UNIVERSAL)"
    />
  </div>
</template>

<script setup>
import { useMeetingTypeSelection } from "./useMeetingTypeSelection";

const { localSelectedJunta, handleSelect } = useMeetingTypeSelection();
</script>
```

#### B. Usuario selecciona un tipo

```typescript
// useMeetingTypeSelection.ts
export function useMeetingTypeSelection() {
  // Stores
  const storeFlowMeeting = useTypeMeetingStore();
  const storeRoleMeeting = useRoleMeetingStore();
  const storeLayout = useLayoutStore();

  // ⭐ COMPUTED: Selección actual basada en store
  const localSelectedJunta = computed<MeetingTypeV2>(() =>
    storeFlowMeeting.workingMeetingId === MeetingByIdEnum.JUNTA_UNIVERSAL
      ? MeetingTypeV2.JUNTA_UNIVERSAL
      : MeetingTypeV2.JUNTA_GENERAL
  );

  // ⭐ MÉTODO: Manejar selección
  const handleSelect = async (meetingType: MeetingTypeV2) => {
    // 1. Derivar ID numérico del enum
    const derivedId =
      meetingType === MeetingTypeV2.JUNTA_UNIVERSAL
        ? MeetingByIdEnum.JUNTA_UNIVERSAL  // 2
        : MeetingByIdEnum.JUNTA_GENERAL;   // 1
    
    // 2. Actualizar store de flow meeting
    storeFlowMeeting.updateWorkingMeetingId(derivedId);
    
    // 3. Actualizar store de role meeting
    storeRoleMeeting.updateMeetingType(
      meetingType === MeetingTypeV2.JUNTA_UNIVERSAL
        ? MeetingType.JUNTA_UNIVERSAL
        : MeetingType.JUNTA_GENERAL
    );
    
    // 4. Actualizar layout store (para UI)
    storeLayout.tipoDeJunta =
      meetingType === MeetingTypeV2.JUNTA_UNIVERSAL
        ? "Junta Universal"
        : "Junta General";
    
    // 5. ⭐ Disparar navegación al siguiente paso
    await wizardController(storeLayout, false);
  };

  return {
    localSelectedJunta,
    handleSelect,
  };
}
```

#### C. Navegación condicional según tipo

```typescript
// executive-register.router.ts (ejemplo de Aporte Dinerario)
{
  path: 'asistencia',
  name: 'asistencia-acad',
  component: AsistenciaAccionistas,
  
  // ⭐ GUARD: Solo mostrar si es Junta General
  beforeEnter: (to, from, next) => {
    const storeRoleMeeting = useMeetingTypeSelection();
    
    if (storeRoleMeeting.localSelectedJunta.value === MeetingTypeV2.JUNTA_GENERAL) {
      next();  // Continuar a Asistencia
    } else {
      // ⭐ Saltar Asistencia si es Junta Universal
      next({ name: 'presidente-acad' });
    }
  }
}
```

**¿Por qué se salta Asistencia?**

- **Junta General**: Requiere convocatoria, algunos accionistas pueden faltar → necesita registro de asistencia
- **Junta Universal**: TODOS los accionistas presentes por definición → no necesita registro de asistencia

### Diferencias entre los 3 Stores

#### 1. `useTypeMeetingStore`

**Propósito**: Guardar el tipo de junta a nivel de flujo

```typescript
export const useTypeMeetingStore = defineStore("typeMeeting", {
  state: () => ({
    workingMeetingId: 0 as MeetingByIdEnum,  // 1 o 2
  }),
  
  actions: {
    updateWorkingMeetingId(id: MeetingByIdEnum) {
      this.workingMeetingId = id;
    }
  }
});

// Enums
export enum MeetingByIdEnum {
  JUNTA_GENERAL = 1,
  JUNTA_UNIVERSAL = 2,
}
```

**Cuándo se usa**: Para lógica de negocio, persistencia en backend

#### 2. `useRoleMeetingStore`

**Propósito**: Guardar el tipo de junta a nivel de rol/sesión

```typescript
export const useRoleMeetingStore = defineStore("roleMeeting", {
  state: () => ({
    meetingType: MeetingType.JUNTA_GENERAL,  // String enum
  }),
  
  actions: {
    updateMeetingType(type: MeetingType) {
      this.meetingType = type;
    }
  }
});

// Enums
export enum MeetingType {
  JUNTA_GENERAL = "JUNTA_GENERAL",
  JUNTA_UNIVERSAL = "JUNTA_UNIVERSAL",
}
```

**Cuándo se usa**: Para guards de navegación, validaciones

#### 3. `useLayoutStore`

**Propósito**: Guardar estado de UI/Layout

```typescript
export const useLayoutStore = defineStore("layout", {
  state: () => ({
    tipoDeJunta: "" as "Junta General" | "Junta Universal",
    currentStep: 1,
    arraySelec: "default",
    isButtonDisabled: false,
    // ... muchos más campos de UI
  })
});
```

**Cuándo se usa**: Para mostrar texto en UI, breadcrumbs, sidebar

### Puntos Clave del Patrón

#### 1. **Múltiples stores para diferentes propósitos**
- No es un error tener 3 stores con datos similares
- Cada uno tiene un propósito específico
- Mantenerlos sincronizados manualmente

```typescript
// Sincronización manual en handleSelect
storeFlowMeeting.updateWorkingMeetingId(derivedId);  // Para backend
storeRoleMeeting.updateMeetingType(type);            // Para guards
storeLayout.tipoDeJunta = text;                      // Para UI
```

#### 2. **Guards condicionales**
- La selección de junta determina qué pasos se muestran
- beforeEnter en rutas decide si continuar o saltar

```typescript
beforeEnter: (to, from, next) => {
  if (esJuntaGeneral) {
    next(); // Mostrar este paso
  } else {
    next({ name: 'siguiente-paso' }); // Saltar este paso
  }
}
```

#### 3. **Computed para selección actual**
- No usar state local, usar computed basado en store
- Reactivo automáticamente

```typescript
const localSelectedJunta = computed(() =>
  store.workingMeetingId === JUNTA_UNIVERSAL
    ? MeetingTypeV2.JUNTA_UNIVERSAL
    : MeetingTypeV2.JUNTA_GENERAL
);
```

#### 4. **Navegación después de selección**
- No navegar directamente, delegar a wizardController
- wizardController maneja lógica compleja de siguiente paso

```typescript
const handleSelect = async (meetingType) => {
  // Actualizar stores
  store1.update(value1);
  store2.update(value2);
  store3.update(value3);
  
  // Delegar navegación
  await wizardController(storeLayout, false);
};
```

---

## 3️⃣ <a id="patron-identificado"></a>PATRÓN IDENTIFICADO

### Similitudes entre Registro y Juntas

Ambos flujos comparten el MISMO patrón fundamental:

```
┌─────────────────────────────────────────────────────────────┐
│                    PATRÓN UNIVERSAL                          │
└─────────────────────────────────────────────────────────────┘

1. COMPONENTE VUE
   ├─ v-model directo al store
   ├─ Validación en tiempo real
   └─ Sin state local

2. STORE (Pinia)
   ├─ State: Todos los campos del formulario
   ├─ Getters: validateForm, payloadData
   └─ Actions: setDataLocal, resetPartial

3. SERVICE
   ├─ upsert(): Crea o actualiza
   ├─ get(): Obtiene datos
   └─ Mapper: Store ↔ API

4. MAPPER
   ├─ storeToApi(): Para enviar al backend
   └─ apiToStore(): Para recibir del backend

5. CONTROLLER
   ├─ Orquesta navegación
   ├─ Llama services según paso actual
   └─ Maneja modo Edit vs Create
```

### Diferencias Clave

| Aspecto | Registro Sociedades | Juntas |
|---------|-------------------|---------|
| **Estructura** | 9 pasos lineales | 11 pasos, algunos condicionales |
| **Navegación** | Siempre avanza 1→2→3→...→9 | Puede saltar pasos según tipo junta |
| **Guardado** | Cada paso guarda inmediatamente | Pasos comunes (1-5) también guardan |
| **Stores** | 1 store por paso (9 stores) | 1 store por paso + stores compartidos |
| **Lógica condicional** | hasDirectory según tipo sociedad | Mostrar/ocultar pasos según tipo junta |

---

## 4️⃣ <a id="plan-v3"></a>PLAN PARA V3

### Estrategia General

**REUTILIZAR** la lógica de V2.5, pero con **arquitectura hexagonal**:

```
V2.5 (Funcionando)                V3 (Hexagonal)
┌─────────────────┐              ┌─────────────────┐
│  Componente Vue │              │  Componente Vue │
│  ↓              │              │  ↓              │
│  Store (Pinia)  │   →→→→→→→→  │  Store (Pinia)  │
│  ↓              │              │  ↓              │
│  Service        │              │  Controller     │
│  ↓              │              │  ↓              │
│  Mapper         │              │  Use Case       │
│  ↓              │              │  ↓              │
│  API Call       │              │  Repository     │
└─────────────────┘              │  ↓              │
                                 │  Mapper         │
                                 │  ↓              │
                                 │  API Call       │
                                 └─────────────────┘
```

### Migración Paso a Paso: Registro de Sociedades

#### 1. **Domain Layer** (entidades puras)

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-sociedad/domain/entities/sociedad.entity.ts
export interface Sociedad {
  id?: number;
  ruc: string;
  tipoSociedad: TipoSociedad;
  razonSocial: string;
  nombreComercial: string;
  direccion: Direccion;
  fechaInscripcion: Date;
  actividadExterior: string;
  fechaEscrituraPublica?: Date;
  partidaRegistral?: string;
  oficinaRegistral: string;
  tieneDirectorio: boolean;
}

export interface Direccion {
  calle: string;
  distrito: string;
  provincia: string;
  departamento: string;
}

export enum TipoSociedad {
  SA = 1,
  SAC = 2,
  SAA = 3,
  // ...
}
```

**⭐ Diferencia con V2.5**:
- Entidades con nombres en español (más cercano al negocio)
- Objetos value (Direccion)
- Enums tipados fuertemente
- Sin campos de UI (isLoading, isDisable)

#### 2. **Domain Layer** (puertos)

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-sociedad/domain/ports/sociedad.repository.ts
export interface SociedadRepository {
  crear(sociedad: Sociedad): Promise<Sociedad>;
  actualizar(id: number, sociedad: Sociedad): Promise<Sociedad>;
  obtenerPorId(id: number): Promise<Sociedad>;
  eliminar(id: number): Promise<void>;
}
```

**⭐ Diferencia con V2.5**:
- Interface (contrato), no implementación
- Nombres en español
- Devuelve entidades, no DTOs

#### 3. **Application Layer** (DTOs)

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-sociedad/application/dtos/create-sociedad.dto.ts
export interface CreateSociedadDto {
  ruc: string;
  typeSocietyId: number;  // ← API usa nombres en inglés
  reasonSocial: string;
  commercialName: string;
  address: string;
  district: string;
  province: string;
  department: string;
  registrationDate: string;  // ← API usa strings para fechas
  foreignActivity: string;
  publicDeedDate?: string;
  registrationRecord?: string;
  registryOffice: string;
  hasDirectory: boolean;
}

// app/core/hexag/registros/sociedades/pasos/datos-sociedad/application/dtos/sociedad-response.dto.ts
export interface SociedadResponseDto {
  success: boolean;
  message: string;
  data: {
    society: CreateSociedadDto;
    directoryId?: number;
  };
}
```

**⭐ Diferencia con V2.5**:
- DTOs separados: CreateDto, UpdateDto, ResponseDto
- Mantienen nombres del backend (inglés)
- Documentan contrato con backend

#### 4. **Application Layer** (Use Cases)

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-sociedad/application/use-cases/create-sociedad.use-case.ts
export class CreateSociedadUseCase {
  constructor(
    private readonly repository: SociedadRepository
  ) {}
  
  async execute(sociedad: Sociedad): Promise<Sociedad> {
    // ⭐ VALIDACIONES DE NEGOCIO
    this.validarDatosObligatorios(sociedad);
    this.validarRuc(sociedad.ruc);
    this.validarTipoSociedad(sociedad.tipoSociedad);
    
    // ⭐ LÓGICA DE NEGOCIO
    // SA siempre tiene directorio
    if (sociedad.tipoSociedad === TipoSociedad.SA) {
      sociedad.tieneDirectorio = true;
    }
    
    // ⭐ PERSISTENCIA (delegada a repository)
    return await this.repository.crear(sociedad);
  }
  
  private validarDatosObligatorios(sociedad: Sociedad): void {
    if (!sociedad.ruc) throw new Error("RUC requerido");
    if (!sociedad.razonSocial) throw new Error("Razón social requerida");
    // ...
  }
  
  private validarRuc(ruc: string): void {
    if (ruc.length !== 11) throw new Error("RUC debe tener 11 dígitos");
    // Más validaciones...
  }
  
  private validarTipoSociedad(tipo: TipoSociedad): void {
    if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(tipo)) {
      throw new Error("Tipo de sociedad inválido");
    }
  }
}
```

**⭐ Diferencia con V2.5**:
- Lógica de negocio centralizada
- Validaciones explícitas
- Testeable sin backend

**Use Cases adicionales**:
```typescript
// update-sociedad.use-case.ts
export class UpdateSociedadUseCase {
  execute(id: number, sociedad: Sociedad): Promise<Sociedad>
}

// get-sociedad.use-case.ts
export class GetSociedadUseCase {
  execute(id: number): Promise<Sociedad>
}

// delete-sociedad.use-case.ts
export class DeleteSociedadUseCase {
  execute(id: number): Promise<void>
}
```

#### 5. **Infrastructure Layer** (Repositories)

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/sociedad-http.repository.ts
export class SociedadHttpRepository implements SociedadRepository {
  constructor(
    private readonly mapper: SociedadMapper
  ) {}
  
  async crear(sociedad: Sociedad): Promise<Sociedad> {
    // 1. Mapper: Entidad → DTO API
    const dto = this.mapper.entityToCreateDto(sociedad);
    
    // 2. API Call
    const response = await $fetch<SociedadResponseDto>(
      '/api/v2/society-profile/main-data',
      { method: 'POST', body: dto }
    );
    
    // 3. Mapper: DTO API → Entidad
    return this.mapper.responseDtoToEntity(response);
  }
  
  async actualizar(id: number, sociedad: Sociedad): Promise<Sociedad> {
    const dto = this.mapper.entityToUpdateDto(sociedad);
    
    const response = await $fetch<SociedadResponseDto>(
      `/api/v2/society-profile/${id}/main-data`,
      { method: 'PUT', body: dto }
    );
    
    return this.mapper.responseDtoToEntity(response);
  }
  
  async obtenerPorId(id: number): Promise<Sociedad> {
    const response = await $fetch<SociedadResponseDto>(
      `/api/v2/society-profile/${id}/main-data`
    );
    
    return this.mapper.responseDtoToEntity(response);
  }
  
  async eliminar(id: number): Promise<void> {
    await $fetch(`/api/v2/society-profile/${id}/main-data`, {
      method: 'DELETE'
    });
  }
}
```

**Repository MSW** (para desarrollo sin backend):

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/sociedad-msw.repository.ts
export class SociedadMswRepository implements SociedadRepository {
  private sociedades: Map<number, Sociedad> = new Map();
  private nextId = 1;
  
  async crear(sociedad: Sociedad): Promise<Sociedad> {
    await this.delay(300); // Simular latencia
    
    const nuevaSociedad = {
      ...sociedad,
      id: this.nextId++
    };
    
    this.sociedades.set(nuevaSociedad.id, nuevaSociedad);
    return nuevaSociedad;
  }
  
  async actualizar(id: number, sociedad: Sociedad): Promise<Sociedad> {
    await this.delay(200);
    
    if (!this.sociedades.has(id)) {
      throw new Error("Sociedad no encontrada");
    }
    
    const actualizada = { ...sociedad, id };
    this.sociedades.set(id, actualizada);
    return actualizada;
  }
  
  async obtenerPorId(id: number): Promise<Sociedad> {
    await this.delay(150);
    
    const sociedad = this.sociedades.get(id);
    if (!sociedad) throw new Error("Sociedad no encontrada");
    
    return sociedad;
  }
  
  async eliminar(id: number): Promise<void> {
    await this.delay(100);
    this.sociedades.delete(id);
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**⭐ Diferencia con V2.5**:
- 2 implementaciones: HTTP (real) y MSW (mock)
- Mismo contrato (SociedadRepository)
- Intercambiables cambiando 1 línea

#### 6. **Infrastructure Layer** (Mappers)

```typescript
// app/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/mappers/sociedad.mapper.ts
export class SociedadMapper {
  // Entidad → DTO API (CREATE)
  entityToCreateDto(entity: Sociedad): CreateSociedadDto {
    return {
      ruc: entity.ruc,
      typeSocietyId: entity.tipoSociedad,
      reasonSocial: entity.razonSocial,
      commercialName: entity.nombreComercial,
      address: entity.direccion.calle,
      district: entity.direccion.distrito,
      province: entity.direccion.provincia,
      department: entity.direccion.departamento,
      registrationDate: entity.fechaInscripcion.toISOString().split('T')[0],
      foreignActivity: entity.actividadExterior,
      publicDeedDate: entity.fechaEscrituraPublica?.toISOString().split('T')[0],
      registrationRecord: entity.partidaRegistral,
      registryOffice: entity.oficinaRegistral,
      hasDirectory: entity.tieneDirectorio,
    };
  }
  
  // Entidad → DTO API (UPDATE)
  entityToUpdateDto(entity: Sociedad): UpdateSociedadDto {
    return {
      ...this.entityToCreateDto(entity),
      id: entity.id,
    };
  }
  
  // DTO API → Entidad
  responseDtoToEntity(response: SociedadResponseDto): Sociedad {
    const data = response.data.society;
    
    return {
      id: data.id,
      ruc: data.ruc,
      tipoSociedad: data.typeSocietyId as TipoSociedad,
      razonSocial: data.reasonSocial,
      nombreComercial: data.commercialName,
      direccion: {
        calle: data.address,
        distrito: data.district,
        provincia: data.province,
        departamento: data.department,
      },
      fechaInscripcion: new Date(data.registrationDate),
      actividadExterior: data.foreignActivity,
      fechaEscrituraPublica: data.publicDeedDate ? new Date(data.publicDeedDate) : undefined,
      partidaRegistral: data.registrationRecord,
      oficinaRegistral: data.registryOffice,
      tieneDirectorio: data.hasDirectory,
    };
  }
  
  // Store V2.5 → Entidad (para migración gradual)
  storeToEntity(store: RegisterSocietyState): Sociedad {
    return {
      id: store.id,
      ruc: store.ruc,
      tipoSociedad: store.typeSocietyId as TipoSociedad,
      razonSocial: store.reasonSocial,
      nombreComercial: store.commercialName,
      direccion: {
        calle: store.address,
        distrito: store.district,
        provincia: store.province,
        departamento: store.department,
      },
      fechaInscripcion: new Date(store.registrationDate),
      actividadExterior: store.foreignActivity,
      fechaEscrituraPublica: store.publicDeedDate ? new Date(store.publicDeedDate) : undefined,
      partidaRegistral: store.registrationRecord,
      oficinaRegistral: store.registryOffice,
      tieneDirectorio: store.hasDirectory,
    };
  }
  
  // Entidad → Store V2.5 (para migración gradual)
  entityToStore(entity: Sociedad): RegisterSocietyState {
    return {
      id: entity.id,
      ruc: entity.ruc,
      typeSocietyId: entity.tipoSociedad,
      reasonSocial: entity.razonSocial,
      commercialName: entity.nombreComercial,
      address: entity.direccion.calle,
      district: entity.direccion.distrito,
      province: entity.direccion.provincia,
      department: entity.direccion.departamento,
      registrationDate: entity.fechaInscripcion.toISOString().split('T')[0],
      foreignActivity: entity.actividadExterior,
      publicDeedDate: entity.fechaEscrituraPublica?.toISOString().split('T')[0] || "",
      registrationRecord: entity.partidaRegistral || "",
      registryOffice: entity.oficinaRegistral,
      hasDirectory: entity.tieneDirectorio,
      idDirectory: -1,
    };
  }
}
```

**⭐ Diferencia con V2.5**:
- 5 métodos de mapeo (vs 2 en V2.5)
- Transformaciones bidireccionales documentadas
- Incluye mapeo Store ↔ Entidad para migración gradual

#### 7. **Presentation Layer** (Controller)

```typescript
// app/core/presentation/registros/sociedades/datos-sociedad/controllers/sociedad.controller.ts
export class SociedadController {
  constructor(
    private readonly createUseCase: CreateSociedadUseCase,
    private readonly updateUseCase: UpdateSociedadUseCase,
    private readonly getUseCase: GetSociedadUseCase,
    private readonly deleteUseCase: DeleteSociedadUseCase,
    private readonly mapper: SociedadMapper
  ) {}
  
  async crear(store: RegisterSocietyState): Promise<void> {
    try {
      // 1. Store → Entidad
      const sociedad = this.mapper.storeToEntity(store);
      
      // 2. Ejecutar Use Case
      const resultado = await this.createUseCase.execute(sociedad);
      
      // 3. Entidad → Store (actualizar con ID asignado)
      const storeActualizado = this.mapper.entityToStore(resultado);
      Object.assign(store, storeActualizado);
      
      // 4. Notificar éxito
      toastMessage("success", "Sociedad creada exitosamente");
    } catch (error: any) {
      toastMessage("error", error.message);
      throw error;
    }
  }
  
  async actualizar(id: number, store: RegisterSocietyState): Promise<void> {
    try {
      const sociedad = this.mapper.storeToEntity(store);
      const resultado = await this.updateUseCase.execute(id, sociedad);
      
      const storeActualizado = this.mapper.entityToStore(resultado);
      Object.assign(store, storeActualizado);
      
      toastMessage("success", "Sociedad actualizada exitosamente");
    } catch (error: any) {
      toastMessage("error", error.message);
      throw error;
    }
  }
  
  async obtenerPorId(id: number, store: RegisterSocietyState): Promise<void> {
    try {
      const sociedad = await this.getUseCase.execute(id);
      
      const storeActualizado = this.mapper.entityToStore(sociedad);
      Object.assign(store, storeActualizado);
    } catch (error: any) {
      toastMessage("error", error.message);
      throw error;
    }
  }
  
  async eliminar(id: number): Promise<void> {
    try {
      await this.deleteUseCase.execute(id);
      toastMessage("success", "Sociedad eliminada exitosamente");
    } catch (error: any) {
      toastMessage("error", error.message);
      throw error;
    }
  }
}
```

**⭐ Diferencia con V2.5**:
- Controller delega TODA la lógica a Use Cases
- Solo maneja Store ↔ Entidad
- No tiene lógica de negocio

#### 8. **Presentation Layer** (Store V3)

```typescript
// app/core/presentation/registros/sociedades/datos-sociedad/stores/sociedad.store.ts
import { defineStore } from 'pinia';

export const useSociedadStore = defineStore('sociedad', {
  state: (): RegisterSocietyState => ({
    // ⭐ MISMO state que V2.5 (compatibilidad)
    id: undefined,
    ruc: "",
    typeSocietyId: 0,
    reasonSocial: "",
    commercialName: "",
    address: "",
    district: "",
    province: "",
    department: "",
    registrationDate: "",
    foreignActivity: "",
    publicDeedDate: "",
    registrationRecord: "",
    registryOffice: "",
    hasDirectory: true,
    idDirectory: -1,
  }),
  
  getters: {
    // ⭐ MISMOS getters que V2.5
    validateForm(): boolean {
      return (
        this.typeSocietyId !== 0 &&
        this.reasonSocial !== "" &&
        this.commercialName !== "" &&
        this.address !== "" &&
        this.district !== "" &&
        this.province !== "" &&
        this.department !== "" &&
        this.registrationDate !== "" &&
        this.foreignActivity !== "" &&
        this.registryOffice !== ""
      );
    },
    
    hasDirectoryComputed(): boolean {
      if (this.typeSocietyId === 1) return true;
      if (this.typeSocietyId === 2 || this.typeSocietyId === 3) {
        if (this.idDirectory > 0) return true;
        return this.hasDirectory;
      }
      return false;
    },
  },
  
  actions: {
    // ⭐ Actions DELEGANDO a controller
    async crear() {
      const controller = useSociedadController(); // DI
      await controller.crear(this.$state);
    },
    
    async actualizar() {
      if (!this.id) throw new Error("ID no definido");
      const controller = useSociedadController();
      await controller.actualizar(this.id, this.$state);
    },
    
    async obtenerPorId(id: number) {
      const controller = useSociedadController();
      await controller.obtenerPorId(id, this.$state);
    },
    
    async eliminar() {
      if (!this.id) throw new Error("ID no definido");
      const controller = useSociedadController();
      await controller.eliminar(this.id);
    },
    
    // ⭐ Helpers (igual que V2.5)
    setDataRegisterSociety(data: SunatResponseRuc) {
      this.ruc = data.ruc;
      this.typeSocietyId = Number(getSociety(data.tipo));
      this.reasonSocial = data.razonSocial;
      // ... (igual que V2.5)
    },
    
    resetPartial() {
      this.$reset();
    },
  },
});
```

**⭐ Diferencia con V2.5**:
- Actions delegan a controller
- Controller maneja Use Cases
- Store SOLO maneja estado de UI

#### 9. **Presentation Layer** (Componente Vue)

```vue
<!-- app/pages/operaciones/sociedades/[id]/editar.vue -->
<script setup lang="ts">
import { useSociedadStore } from '@/core/presentation/registros/sociedades/datos-sociedad/stores/sociedad.store';
import { useLayoutStore } from '@/store/juntas/aumento-capital/useLayoutStore';
import { wizardController } from '@/wizards/wizar.controller';

const sociedadStore = useSociedadStore();
const layoutStore = useLayoutStore();

// ⭐ MISMO código que V2.5
watchEffect(() => {
  layoutStore.isButtonDisabled = sociedadStore.validateForm;
});

onMounted(() => {
  layoutStore.arraySelec = "agregarSociedad";
  layoutStore.currentStep = 1;
  layoutStore.onclick = () => wizardController(layoutStore, false);
});
</script>

<template>
  <!-- ⭐ MISMO template que V2.5 -->
  <div class="w-full flex flex-col gap-11">
    <HeaderSecction title="Datos principales" />
    
    <div class="grid grid-cols-2 gap-4">
      <!-- Búsqueda RUC -->
      <BaseInputSearch
        v-model="sociedadStore.ruc"
        :handleSearch="handleSearchRuc"
      />
      
      <!-- Tipo de Sociedad -->
      <BaseInputSelect
        v-model="sociedadStore.typeSocietyId"
        :options="societyTypeOptions"
      />
      
      <!-- Razón Social -->
      <BaseInputText
        v-model="sociedadStore.reasonSocial"
        placeholder="Ingrese la razón social"
      />
      
      <!-- ... más campos ... -->
    </div>
  </div>
</template>
```

**⭐ Diferencia con V2.5**:
- Componente IGUAL (reutilizable)
- Store internamente usa hexagonal
- Usuario NO nota diferencia

### Migración Paso a Paso: Selección de Juntas

#### 1. **Domain Layer** (entidades)

```typescript
// app/core/hexag/juntas/domain/entities/tipo-junta.entity.ts
export enum TipoJunta {
  GENERAL = "GENERAL",
  UNIVERSAL = "UNIVERSAL",
}

export interface JuntaConfiguracion {
  tipoJunta: TipoJunta;
  requiereConvocatoria: boolean;
  requiereAsistencia: boolean;
  requiereQuorum: boolean;
}

// Lógica de negocio
export function obtenerConfiguracion(tipo: TipoJunta): JuntaConfiguracion {
  if (tipo === TipoJunta.UNIVERSAL) {
    return {
      tipoJunta: TipoJunta.UNIVERSAL,
      requiereConvocatoria: false,
      requiereAsistencia: false,
      requiereQuorum: false,
    };
  }
  
  return {
    tipoJunta: TipoJunta.GENERAL,
    requiereConvocatoria: true,
    requiereAsistencia: true,
    requiereQuorum: true,
  };
}
```

#### 2. **Application Layer** (Use Case)

```typescript
// app/core/hexag/juntas/application/use-cases/seleccionar-tipo-junta.use-case.ts
export class SeleccionarTipoJuntaUseCase {
  execute(tipoJunta: TipoJunta): JuntaConfiguracion {
    // Validación
    if (!Object.values(TipoJunta).includes(tipoJunta)) {
      throw new Error("Tipo de junta inválido");
    }
    
    // Lógica de negocio
    return obtenerConfiguracion(tipoJunta);
  }
}
```

#### 3. **Presentation Layer** (Composable)

```typescript
// app/composables/useMeetingTypeSelection.ts
export function useMeetingTypeSelection() {
  const useCase = new SeleccionarTipoJuntaUseCase();
  const storeFlowMeeting = useTypeMeetingStore();
  const storeRoleMeeting = useRoleMeetingStore();
  const storeLayout = useLayoutStore();
  
  const localSelectedJunta = computed(() => 
    storeFlowMeeting.workingMeetingId === MeetingByIdEnum.JUNTA_UNIVERSAL
      ? TipoJunta.UNIVERSAL
      : TipoJunta.GENERAL
  );
  
  const handleSelect = async (meetingType: MeetingTypeV2) => {
    // 1. Mapear V2 enum → V3 enum
    const tipoJunta = meetingType === MeetingTypeV2.JUNTA_UNIVERSAL
      ? TipoJunta.UNIVERSAL
      : TipoJunta.GENERAL;
    
    // 2. Ejecutar Use Case
    const configuracion = useCase.execute(tipoJunta);
    
    // 3. Actualizar stores (igual que V2.5)
    const derivedId = tipoJunta === TipoJunta.UNIVERSAL
      ? MeetingByIdEnum.JUNTA_UNIVERSAL
      : MeetingByIdEnum.JUNTA_GENERAL;
    
    storeFlowMeeting.updateWorkingMeetingId(derivedId);
    storeRoleMeeting.updateMeetingType(configuracion.tipoJunta);
    storeLayout.tipoDeJunta = configuracion.tipoJunta;
    
    // 4. Navegar (igual que V2.5)
    await wizardController(storeLayout, false);
  };
  
  return {
    localSelectedJunta,
    handleSelect,
  };
}
```

**⭐ Diferencia con V2.5**:
- Usa Use Case para validar y obtener configuración
- Lógica de negocio centralizada
- Composable sigue igual (compatible)

### Estrategia de Migración Gradual

#### Fase 1: Crear arquitectura hexagonal (sin tocar UI)

```typescript
// 1. Crear entidades, DTOs, Use Cases, Repositories
// 2. Implementar MSW repository
// 3. Testear Use Cases con MSW
// 4. NO tocar stores ni componentes aún
```

#### Fase 2: Conectar stores a hexagonal

```typescript
// 1. Crear controllers
// 2. Actualizar actions de stores para usar controllers
// 3. Mantener state y getters igual
// 4. Componentes siguen funcionando sin cambios
```

#### Fase 3: Cambiar a HTTP repository

```typescript
// 1. Implementar HTTP repository
// 2. Cambiar DI: MSW → HTTP
// 3. Testear con backend real
```

### Ejemplo de DI (Dependency Injection)

```typescript
// app/plugins/di.ts
export function useSociedadController() {
  // ⭐ Cambiar esta línea para alternar MSW ↔ HTTP
  const useMsw = import.meta.env.DEV; // MSW en dev, HTTP en prod
  
  // Repository
  const repository = useMsw
    ? new SociedadMswRepository()
    : new SociedadHttpRepository(new SociedadMapper());
  
  // Use Cases
  const createUseCase = new CreateSociedadUseCase(repository);
  const updateUseCase = new UpdateSociedadUseCase(repository);
  const getUseCase = new GetSociedadUseCase(repository);
  const deleteUseCase = new DeleteSociedadUseCase(repository);
  
  // Controller
  return new SociedadController(
    createUseCase,
    updateUseCase,
    getUseCase,
    deleteUseCase,
    new SociedadMapper()
  );
}
```

**⭐ Beneficio**:
- Desarrollo sin backend: `useMsw = true`
- Producción con backend: `useMsw = false`
- Cambio en 1 línea

---

## 🎯 CONCLUSIÓN

### Lo que entendí

1. **Registro de Sociedades** es un wizard de 9 pasos con guardado inmediato paso a paso
2. **Selección de Juntas** determina el tipo de junta (General/Universal) y condiciona pasos posteriores
3. Ambos siguen el MISMO patrón: Componente → Store → Service → Mapper → API
4. V2.5 funciona bien, solo falta arquitectura hexagonal

### Lo que voy a hacer

1. **Replicar lógica de V2.5** en arquitectura hexagonal
2. **Mantener stores compatibles** para no romper componentes
3. **Usar MSW** para desarrollo sin backend
4. **Migrar gradualmente** sin bloquear avance

### Próximos pasos

1. Crear arquitectura hexagonal para **Paso 1: Datos de Sociedad**
2. Testear con MSW
3. Conectar store existente a nueva arquitectura
4. Replicar patrón a otros 8 pasos
5. Hacer lo mismo con Juntas

**¿Listo para empezar?** 🚀

