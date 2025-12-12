# ✅ Implementación: Cálculo de Votación y Aprobación

## 📋 Resumen

Se ha implementado el sistema completo para calcular el resultado de votaciones en juntas de accionistas, incluyendo:

1. **Composable `useSnapshotVotacion`**: Procesa datos del snapshot relacionados con votación
2. **Getter `getResult()` en `useVotacionStore`**: Calcula el resultado completo de la votación

---

## 🎯 Archivos Creados/Modificados

### 1. Nuevo Composable

**Ubicación**: `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useSnapshotVotacion.ts`

**Funcionalidad**:
- **1. Accionistas con derecho a voto**: Filtrados y con acciones y porcentajes calculados
- **2. Accionistas totales**: Con acciones divididas por derecho a voto (con/sin)
- **3. Tipos de acciones**: Filtrados por con derecho a voto y sin derecho a voto

**Retorna**:
```typescript
{
  accionistasConDerechoVoto: ShareholderWithShares[],
  accionistasTotales: Array<{
    shareholder: Shareholder,
    accionesConDerechoVoto: number,
    accionesSinDerechoVoto: number,
    totalAcciones: number,
    porcentajeParticipacionConVoto: number,
    porcentajeParticipacionSinVoto: number,
    porcentajeParticipacionTotal: number,
  }>,
  tiposAcciones: {
    conDerechoVoto: Accion[],
    sinDerechoVoto: Accion[],
    todos: Accion[],
  },
  totalAccionesConDerechoVoto: number,
  totalAccionesSinDerechoVoto: number,
  totalAcciones: number,
}
```

---

### 2. Getter `getResult()` en Store

**Ubicación**: `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore.ts`

**Uso**:
```typescript
const votacionStore = useVotacionStore();
const resultado = votacionStore.getResult("aporte-dinerarios");
```

**Retorna**:
```typescript
{
  // Tipo de acuerdo
  tipoAcuerdo: "SIMPLE" | "CALIFICADO",
  quorumMinimoRequerido: number, // 50 o 60 según tipo
  
  // Totales
  totalAccionesConDerechoVoto: number,
  accionesVotantes: number,
  porcentajeVotantes: number,
  
  // Resultados por tipo de voto
  accionesAFavor: number,
  accionesEnContra: number,
  accionesAbstencion: number,
  accionesSinVoto: number,
  
  // Porcentajes
  porcentajeAFavor: number,
  porcentajeEnContra: number,
  porcentajeAbstencion: number,
  porcentajeSinVoto: number,
  
  // Aprobación
  aprobado: boolean,
  
  // Detalles adicionales
  totalVotantes: number,
  totalAccionistas: number,
}
```

---

## 🔍 Lógica de Cálculo

### 1. Determinación de Tipo de Acuerdo

**Normativa**:
- **CALIFICADO**: `aporte-dinerarios`, `aporte-no-dinerario`, `capitalizacion-creditos`
- **SIMPLE**: Resto de puntos de agenda

**Implementación**:
```typescript
import { getTipoAcuerdo } from "~/core/hexag/juntas/domain/constants/agenda-classification.constants";

const tipoAcuerdo = getTipoAcuerdo("aporte-dinerarios"); // CALIFICADO
```

---

### 2. Cálculo de Quorum Mínimo

**Lógica**:
- **SIMPLE**: Usa `quorumMinimoSimple` (por defecto 50%)
- **CALIFICADO**: Usa `quorumMinimoCalificado` (por defecto 60%)

**Fuente**: Del snapshot (`snapshot.quorums`)

---

### 3. Cálculo de Acciones por Tipo de Voto

**Proceso**:
1. Obtener accionistas con derecho a voto del snapshot
2. Obtener votos del store de votación
3. Para cada voto, buscar las acciones del accionista
4. Agrupar por tipo de voto (A_FAVOR, EN_CONTRA, ABSTENCION)
5. Calcular acciones sin voto (accionistas que no votaron)

**Importante**: Solo se cuentan acciones con derecho a voto

---

### 4. Determinación de Aprobación

**Lógica**:
```typescript
const aprobado = porcentajeAFavor >= quorumMinimoRequerido;
```

**Ejemplo**:
- Tipo: CALIFICADO
- Quorum mínimo: 60%
- Votos a favor: 65% de acciones con derecho a voto
- Resultado: ✅ **APROBADO**

---

## 📊 Ejemplo de Uso

```typescript
// En un componente Vue
<script setup lang="ts">
import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
import { useSnapshotVotacion } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useSnapshotVotacion";

const votacionStore = useVotacionStore();
const snapshotVotacion = useSnapshotVotacion();

// Obtener resultado de votación
const resultado = computed(() => {
  return votacionStore.getResult("aporte-dinerarios");
});

// Usar datos del snapshot
const accionistasConVoto = snapshotVotacion.accionistasConDerechoVoto;
const accionistasTotales = snapshotVotacion.accionistasTotales;
const tiposAcciones = snapshotVotacion.tiposAcciones;
</script>

<template>
  <div>
    <h2>Resultado de Votación</h2>
    <p>Tipo: {{ resultado.tipoAcuerdo }}</p>
    <p>Quorum mínimo: {{ resultado.quorumMinimoRequerido }}%</p>
    <p>Porcentaje a favor: {{ resultado.porcentajeAFavor.toFixed(2) }}%</p>
    <p>Estado: {{ resultado.aprobado ? "✅ APROBADO" : "❌ RECHAZADO" }}</p>
    
    <h3>Desglose</h3>
    <ul>
      <li>A favor: {{ resultado.accionesAFavor }} acciones ({{ resultado.porcentajeAFavor.toFixed(2) }}%)</li>
      <li>En contra: {{ resultado.accionesEnContra }} acciones ({{ resultado.porcentajeEnContra.toFixed(2) }}%)</li>
      <li>Abstenciones: {{ resultado.accionesAbstencion }} acciones ({{ resultado.porcentajeAbstencion.toFixed(2) }}%)</li>
      <li>Sin voto: {{ resultado.accionesSinVoto }} acciones ({{ resultado.porcentajeSinVoto.toFixed(2) }}%)</li>
    </ul>
  </div>
</template>
```

---

## ✅ Checklist de Funcionalidades

- [x] Composable `useSnapshotVotacion` creado
- [x] Getter `getResult()` implementado en `useVotacionStore`
- [x] Cálculo de acciones por tipo de voto (a favor, en contra, abstención)
- [x] Cálculo de porcentajes
- [x] Determinación de tipo de acuerdo (SIMPLE/CALIFICADO)
- [x] Comparación con quorum mínimo
- [x] Determinación de aprobación
- [x] Cálculo de acciones sin voto

---

## 🔄 Próximos Pasos

1. **Mejorar seeds**: Agregar sociedades con sistema clásico y de clases
2. **Testing**: Crear tests unitarios para el cálculo
3. **UI**: Integrar el resultado en componentes de votación
4. **Validación**: Verificar que los porcentajes se rendericen correctamente en la vista de aporte dinerario

---

## 📝 Notas Importantes

1. **Solo acciones con derecho a voto**: Todos los cálculos se basan en acciones con derecho a voto, no en el total de acciones
2. **Tipo de acuerdo**: Se determina automáticamente según el punto de agenda
3. **Quorum mínimo**: Viene del snapshot, no está hardcodeado
4. **Reactividad**: Los getters son reactivos, se actualizan automáticamente cuando cambian los datos

