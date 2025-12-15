# 📋 Plan Completo de Refactorización: Detalles de la Junta

## 🎯 Objetivo

Refactorizar los componentes de **Detalles de la Junta** para tener componentes atómicos, bien estructurados, con responsabilidades separadas, siguiendo el estilo de `flow-layout-juntas` y el patrón usado en `seleccion-agenda`.

---

## 📊 Análisis del Estado Actual

### 1. **TipoJuntaSection.vue** (82 líneas)

**Estado:** ✅ Relativamente bien estructurado

**Problemas identificados:**
- ⚠️ Lógica de negocio mezclada con presentación
- ⚠️ Lógica de limpieza de `segundaConvocatoria` cuando cambia a Universal
- ⚠️ Podría extraer lógica a composable

**Lo que SÍ se puede mapear:**
- ✅ Extraer lógica de cambio de tipo de junta a `useTipoJunta.ts`
- ✅ Extraer lógica de limpieza de datos al cambiar tipo

**Lo que NO se debe tocar:**
- ✅ El componente en sí está bien estructurado
- ✅ La integración con el store es correcta

---

### 2. **ConvocatoriaJuntaSection.vue** (432 líneas) ⚠️ **CRÍTICO**

**Estado:** ❌ Componente muy largo con código duplicado

**Problemas identificados:**
- ❌ **432 líneas** con código muy repetido
- ❌ **6 computed properties similares** (primeraModo, primeraDireccion, primeraFecha, primeraHora, segundaModo, segundaDireccion, detalleModo, detalleDireccion, detalleFecha, detalleHora)
- ❌ Helper `ensureConvocatoria` se llama en cada computed (repetitivo)
- ❌ Lógica de formateo de fechas/horas duplicada 3 veces
- ❌ Lógica de creación de convocatorias duplicada
- ❌ Validaciones mezcladas con presentación

**Lo que SÍ se puede mapear:**
- ✅ **Extraer lógica de convocatorias a `useConvocatoria.ts`** (composable reutilizable)
- ✅ **Crear componente `ConvocatoriaFormFields.vue`** (molecular) para campos comunes
- ✅ **Extraer lógica de formateo a `useConvocatoriaFormatting.ts`**
- ✅ **Extraer validaciones a `useConvocatoriaValidation.ts`**
- ✅ **Dividir en componentes:**
  - `ConvocatoriaUniversalCard.vue` (para junta universal)
  - `ConvocatoriaGeneralCards.vue` (para junta general con 2 cards)

**Lo que NO se debe tocar:**
- ✅ La integración con el store (usa `patchMeetingDetails` correctamente)
- ✅ La estructura de datos (MeetingDetails entity)
- ✅ El mapper (parte de infraestructura)

---

### 3. **ConvocatoriaCard.vue** (144 líneas)

**Estado:** ✅ Bien estructurado

**Problemas identificados:**
- ⚠️ Validaciones con Zod mezcladas en el componente
- ⚠️ Podría extraer validaciones a composable

**Lo que SÍ se puede mapear:**
- ✅ Extraer validaciones a `useConvocatoriaValidation.ts`
- ✅ Crear componente atómico `ConvocatoriaInfoBanner.vue` (ya está dentro, extraerlo)

**Lo que NO se debe tocar:**
- ✅ La estructura del componente está bien
- ✅ Los props y emits están bien definidos

---

### 4. **Página Principal** (`detalles/index.vue`)

**Estado:** ✅ Bien estructurada

**Lo que NO se debe tocar:**
- ✅ La página solo orquesta, está bien
- ✅ La lógica de carga y guardado es correcta
- ✅ La integración con `useJuntasFlowNext` es correcta

---

## 🗺️ Mapeo: Qué SÍ y Qué NO

### ✅ **LO QUE SÍ SE DEBE MAPEAR/REFACTORIZAR**

#### 1. **Lógica de Tipo de Junta**
- ✅ Extraer a `useTipoJunta.ts`:
  - Lógica de cambio de tipo
  - Limpieza de `segundaConvocatoria` al cambiar a Universal
  - Validaciones de cambio de tipo

#### 2. **Lógica de Convocatorias** (CRÍTICO - Código Duplicado)
- ✅ Extraer a `useConvocatoria.ts`:
  - Helper `ensureConvocatoria` (reutilizable)
  - Lógica de creación/actualización de convocatorias
  - Lógica de formateo de fechas/horas
  - Computed properties reutilizables para modo, dirección, fecha, hora

#### 3. **Validaciones de Convocatorias**
- ✅ Extraer a `useConvocatoriaValidation.ts`:
  - Schemas de Zod
  - Validaciones de plazos (3 días, 3-10 días)
  - Validaciones de campos requeridos

#### 4. **Componentes Atómicos**
- ✅ `ConvocatoriaInfoBanner.vue` (extraer de ConvocatoriaCard)
- ✅ `ModalidadSwitch.vue` (si se usa en otros lugares)

#### 5. **Componentes Moleculares**
- ✅ `ConvocatoriaFormFields.vue` (campos comunes: modalidad, dirección, fecha, hora)
- ✅ `ConvocatoriaUniversalCard.vue` (card para junta universal)
- ✅ `ConvocatoriaGeneralCards.vue` (2 cards para junta general)

#### 6. **Refactorizar ConvocatoriaJuntaSection**
- ✅ Dividir en componentes más pequeños
- ✅ Usar composables para eliminar código duplicado
- ✅ Reducir de 432 líneas a ~100-150 líneas

---

### ❌ **LO QUE NO SE DEBE TOCAR**

#### 1. **Arquitectura Hexagonal**
- ❌ **NO tocar** `MeetingDetails` entity (domain)
- ❌ **NO tocar** `MeetingDetailsMapper` (infrastructure)
- ❌ **NO tocar** `useMeetingDetailsStore` (presentation store)
- ❌ **NO tocar** DTOs (application layer)

#### 2. **Integración con Store**
- ❌ **NO cambiar** cómo se usa `patchMeetingDetails`
- ❌ **NO cambiar** la estructura de datos del store
- ❌ **NO cambiar** cómo se carga/guarda en el backend

#### 3. **Página Principal**
- ❌ **NO tocar** `detalles/index.vue` (solo orquesta, está bien)

#### 4. **Componentes Base Existentes**
- ❌ **NO tocar** `TitleH4`, `LabeledCardSwitch`, `TextInputZod`, etc.
- ❌ **NO tocar** componentes de UI base (shadcn-vue)

---

## 🏗️ Estructura Propuesta

```
app/components/juntas/detalles/
├── composables/
│   ├── useTipoJunta.ts                    ✅ NUEVO - Lógica de tipo de junta
│   ├── useConvocatoria.ts                 ✅ NUEVO - Lógica reutilizable de convocatorias
│   ├── useConvocatoriaFormatting.ts       ✅ NUEVO - Formateo de fechas/horas
│   └── useConvocatoriaValidation.ts       ✅ NUEVO - Validaciones
├── atoms/
│   └── ConvocatoriaInfoBanner.vue         ✅ NUEVO - Extraer de ConvocatoriaCard
├── molecules/
│   ├── ConvocatoriaFormFields.vue         ✅ NUEVO - Campos comunes
│   ├── ConvocatoriaUniversalCard.vue      ✅ NUEVO - Card para Universal
│   └── ConvocatoriaGeneralCards.vue       ✅ NUEVO - 2 Cards para General
├── organisms/
│   ├── TipoJuntaSection.vue               🔄 MEJORAR - Usar useTipoJunta
│   └── ConvocatoriaJuntaSection.vue       🔄 REFACTORIZAR - Usar composables
└── ConvocatoriaCard.vue                    ✅ MANTENER - Ya está bien, solo extraer banner
```

---

## 📝 Plan Detallado de Implementación

### **Fase 1: Crear Composables (Lógica de Negocio)**

#### 1.1 `useTipoJunta.ts`
**Responsabilidades:**
- Gestionar selección de tipo de junta
- Limpiar `segundaConvocatoria` al cambiar a Universal
- Validar cambios de tipo
- Sincronizar con store

**Interfaz propuesta:**
```typescript
export function useTipoJunta() {
  const tipoJunta = computed(...);
  const tipoJuntaOptions = [...];
  
  const changeTipoJunta = (newTipo: TipoJunta) => {
    // Lógica de cambio
    // Limpieza de segundaConvocatoria si es necesario
  };
  
  return { tipoJunta, tipoJuntaOptions, changeTipoJunta };
}
```

#### 1.2 `useConvocatoria.ts` ⭐ **CRÍTICO - Elimina Código Duplicado**
**Responsabilidades:**
- Helper `ensureConvocatoria` reutilizable
- Computed properties reutilizables para modo, dirección, fecha, hora
- Crear/actualizar convocatorias
- Manejar primera, segunda y detalle (universal)

**Interfaz propuesta:**
```typescript
export function useConvocatoria(
  tipo: 'primera' | 'segunda' | 'detalle',
  tipoJunta: Ref<TipoJunta>
) {
  const modo = computed({ get: ..., set: ... });
  const direccion = computed({ get: ..., set: ... });
  const fecha = computed({ get: ..., set: ... });
  const hora = computed({ get: ..., set: ... });
  
  return { modo, direccion, fecha, hora };
}
```

**Beneficio:** Elimina ~300 líneas de código duplicado

#### 1.3 `useConvocatoriaFormatting.ts`
**Responsabilidades:**
- Formatear fecha (Date → string "YYYY-MM-DD")
- Formatear hora (Date → string "HH:mm")
- Parsear fecha (string → Date)
- Parsear hora (string → Date)

**Interfaz propuesta:**
```typescript
export function useConvocatoriaFormatting() {
  const formatDate = (date: Date | string | undefined): string => {...};
  const formatTime = (date: Date | string | undefined): string => {...};
  const parseDate = (value: string): Date => {...};
  const parseTime = (value: string): Date => {...};
  
  return { formatDate, formatTime, parseDate, parseTime };
}
```

#### 1.4 `useConvocatoriaValidation.ts`
**Responsabilidades:**
- Schemas de Zod para validación
- Validaciones de plazos (3 días, 3-10 días)
- Mensajes de error

**Interfaz propuesta:**
```typescript
export function useConvocatoriaValidation() {
  const direccionSchema = z.string().min(1, 'Este campo es obligatorio');
  const fechaSchema = z.string().min(1, 'La fecha es obligatoria');
  const horaSchema = z.string().min(1, 'La hora es obligatoria');
  
  const validatePlazoPrimera = (fecha: Date): boolean => {...};
  const validatePlazoSegunda = (fecha1: Date, fecha2: Date): boolean => {...};
  
  return { direccionSchema, fechaSchema, horaSchema, validatePlazoPrimera, validatePlazoSegunda };
}
```

---

### **Fase 2: Crear Componentes Atómicos**

#### 2.1 `ConvocatoriaInfoBanner.vue`
**Extraer de:** `ConvocatoriaCard.vue` (líneas 52-60)

**Props:**
```typescript
interface Props {
  text: string;
  variant?: 'info' | 'warning';
}
```

---

### **Fase 3: Crear Componentes Moleculares**

#### 3.1 `ConvocatoriaFormFields.vue`
**Responsabilidades:**
- Agrupar campos comunes: modalidad, dirección, fecha, hora
- Usar `ConvocatoriaInfoBanner` si es necesario
- Emitir eventos para v-model bidireccional

**Props:**
```typescript
interface Props {
  modo: ModoReunion;
  direccion: string;
  fecha?: string;
  hora?: string;
  prefix: string;
  showInfoBanner?: boolean;
  infoBannerText?: string;
}
```

**Emits:**
```typescript
{
  'update:modo': [value: ModoReunion];
  'update:direccion': [value: string];
  'update:fecha': [value: string];
  'update:hora': [value: string];
}
```

#### 3.2 `ConvocatoriaUniversalCard.vue`
**Responsabilidades:**
- Renderizar card para junta universal
- Usar `ConvocatoriaFormFields`
- Título: "Detalles de la Junta"

**Props:**
```typescript
interface Props {
  modo: ModoReunion;
  direccion: string;
  fecha?: string;
  hora?: string;
}
```

#### 3.3 `ConvocatoriaGeneralCards.vue`
**Responsabilidades:**
- Renderizar 2 cards: Primera y Segunda Convocatoria
- Usar `ConvocatoriaFormFields` para cada una
- Mostrar banners informativos

**Props:**
```typescript
interface Props {
  primeraModo: ModoReunion;
  primeraDireccion: string;
  primeraFecha?: string;
  primeraHora?: string;
  segundaModo: ModoReunion;
  segundaDireccion: string;
  segundaFecha?: string;
  segundaHora?: string;
}
```

---

### **Fase 4: Refactorizar Componentes Existentes**

#### 4.1 `TipoJuntaSection.vue` (Mejorar)
**Cambios:**
- Usar `useTipoJunta` composable
- Reducir lógica interna
- Mantener estructura visual

**Antes:** 82 líneas con lógica mezclada
**Después:** ~40-50 líneas, solo presentación

#### 4.2 `ConvocatoriaJuntaSection.vue` (Refactorizar) ⭐ **CRÍTICO**
**Cambios:**
- Usar `useConvocatoria` para eliminar código duplicado
- Usar `ConvocatoriaUniversalCard` y `ConvocatoriaGeneralCards`
- Reducir de 432 líneas a ~100-150 líneas

**Antes:** 432 líneas con 6 computed properties duplicados
**Después:** ~100-150 líneas, usando composables y componentes

**Estructura nueva:**
```vue
<template>
  <section id="convocatoria" class="flex flex-col gap-5">
    <TitleH4 ... />
    
    <!-- JUNTA UNIVERSAL -->
    <ConvocatoriaUniversalCard
      v-if="tipoJunta === TipoJunta.UNIVERSAL"
      :modo="convocatoriaUniversal.modo.value"
      :direccion="convocatoriaUniversal.direccion.value"
      :fecha="convocatoriaUniversal.fecha.value"
      :hora="convocatoriaUniversal.hora.value"
      @update:modo="convocatoriaUniversal.modo.value = $event"
      @update:direccion="convocatoriaUniversal.direccion.value = $event"
      @update:fecha="convocatoriaUniversal.fecha.value = $event"
      @update:hora="convocatoriaUniversal.hora.value = $event"
    />
    
    <!-- JUNTA GENERAL -->
    <ConvocatoriaGeneralCards
      v-else
      :primera-modo="convocatoriaPrimera.modo.value"
      :primera-direccion="convocatoriaPrimera.direccion.value"
      :primera-fecha="convocatoriaPrimera.fecha.value"
      :primera-hora="convocatoriaPrimera.hora.value"
      :segunda-modo="convocatoriaSegunda.modo.value"
      :segunda-direccion="convocatoriaSegunda.direccion.value"
      :segunda-fecha="convocatoriaSegunda.fecha.value"
      :segunda-hora="convocatoriaSegunda.hora.value"
      @update:primera-modo="convocatoriaPrimera.modo.value = $event"
      @update:primera-direccion="convocatoriaPrimera.direccion.value = $event"
      @update:primera-fecha="convocatoriaPrimera.fecha.value = $event"
      @update:primera-hora="convocatoriaPrimera.hora.value = $event"
      @update:segunda-modo="convocatoriaSegunda.modo.value = $event"
      @update:segunda-direccion="convocatoriaSegunda.direccion.value = $event"
      @update:segunda-fecha="convocatoriaSegunda.fecha.value = $event"
      @update:segunda-hora="convocatoriaSegunda.hora.value = $event"
    />
  </section>
</template>

<script setup lang="ts">
import { useConvocatoria } from './composables/useConvocatoria';
import { useTipoJunta } from './composables/useTipoJunta';

const { tipoJunta } = useTipoJunta();

// Usar composable reutilizable
const convocatoriaUniversal = useConvocatoria('detalle', tipoJunta);
const convocatoriaPrimera = useConvocatoria('primera', tipoJunta);
const convocatoriaSegunda = useConvocatoria('segunda', tipoJunta);
</script>
```

#### 4.3 `ConvocatoriaCard.vue` (Mejorar)
**Cambios:**
- Extraer `ConvocatoriaInfoBanner` a componente atómico
- Usar `useConvocatoriaValidation` para schemas
- Mantener estructura, solo limpiar

**Antes:** 144 líneas con validaciones mezcladas
**Después:** ~100-120 líneas, validaciones en composable

---

## ✅ Checklist de Implementación

### Fase 1: Composables
- [ ] Crear `useTipoJunta.ts`
- [ ] Crear `useConvocatoria.ts` ⭐ (CRÍTICO - elimina código duplicado)
- [ ] Crear `useConvocatoriaFormatting.ts`
- [ ] Crear `useConvocatoriaValidation.ts`
- [ ] Probar cada composable individualmente

### Fase 2: Componentes Atómicos
- [ ] Crear `ConvocatoriaInfoBanner.vue`
- [ ] Probar componente

### Fase 3: Componentes Moleculares
- [ ] Crear `ConvocatoriaFormFields.vue`
- [ ] Crear `ConvocatoriaUniversalCard.vue`
- [ ] Crear `ConvocatoriaGeneralCards.vue`
- [ ] Probar cada componente

### Fase 4: Refactorizar Existentes
- [ ] Refactorizar `TipoJuntaSection.vue` (usar `useTipoJunta`)
- [ ] Refactorizar `ConvocatoriaJuntaSection.vue` ⭐ (usar composables y componentes nuevos)
- [ ] Mejorar `ConvocatoriaCard.vue` (extraer banner, usar validaciones)
- [ ] Probar funcionalidad completa
- [ ] Verificar que no se rompió nada

### Testing
- [ ] Probar cambio de tipo de junta (General ↔ Universal)
- [ ] Probar creación de convocatorias
- [ ] Probar actualización de convocatorias
- [ ] Probar validaciones
- [ ] Probar carga desde backend
- [ ] Probar guardado en backend

---

## 🎯 Resultado Esperado

### Antes:
- ❌ `ConvocatoriaJuntaSection.vue`: **432 líneas** con código duplicado
- ❌ `TipoJuntaSection.vue`: **82 líneas** con lógica mezclada
- ❌ `ConvocatoriaCard.vue`: **144 líneas** con validaciones mezcladas
- ❌ **Total:** ~658 líneas con código repetido

### Después:
- ✅ `ConvocatoriaJuntaSection.vue`: **~100-150 líneas** (usando composables)
- ✅ `TipoJuntaSection.vue`: **~40-50 líneas** (usando composable)
- ✅ `ConvocatoriaCard.vue`: **~100-120 líneas** (validaciones extraídas)
- ✅ **Composables:** ~300-400 líneas (reutilizables)
- ✅ **Componentes atómicos/moleculares:** ~200-300 líneas (reutilizables)
- ✅ **Total:** Mismo código pero bien organizado y reutilizable

### Beneficios:
- ✅ **Eliminación de ~300 líneas de código duplicado**
- ✅ **Componentes reutilizables**
- ✅ **Fácil de testear cada parte**
- ✅ **Mantenible y escalable**
- ✅ **Sigue estilo de `flow-layout-juntas` y `seleccion-agenda`**

---

## 📌 Notas Importantes

1. **Mantener compatibilidad:** Los cambios no deben romper funcionalidad existente
2. **Store:** NO tocar `useMeetingDetailsStore`, solo usarlo
3. **Mapper:** NO tocar `MeetingDetailsMapper`, solo usarlo
4. **Entity:** NO tocar `MeetingDetails` entity, solo usarla
5. **Testing:** Probar cada componente después de crearlo
6. **Tipos TypeScript:** Todos los props deben estar bien tipados
7. **Comentarios:** Documentar componentes complejos

---

## 🚦 Siguiente Paso

**Plan completo listo. Esperando aprobación para comenzar implementación.**

**Prioridad:** Empezar con `useConvocatoria.ts` (Fase 1.2) porque elimina la mayor cantidad de código duplicado.

