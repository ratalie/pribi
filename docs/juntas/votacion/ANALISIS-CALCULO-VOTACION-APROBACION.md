# 📊 Análisis: Cálculo de Votación y Aprobación

## ✅ Lo que YA funciona

### 1. Cálculo de Porcentajes de Accionistas

**Ubicación**: `app/core/presentation/juntas/stores/snapshot.store.ts`

**Getter**: `accionistasConDerechoVoto()`

**Cómo funciona**:
1. Toma `shareAllocations` del snapshot
2. Filtra solo las acciones con `conDerechoVoto: true` (usando `shareClasses`)
3. Agrupa por `accionistaId`
4. Suma `cantidadSuscrita` por accionista
5. Calcula porcentaje: `(acciones del accionista / total acciones con voto) * 100`

**Ejemplo**:
```typescript
// Snapshot tiene:
shareAllocations: [
  { accionistaId: "A", accionId: "COMUN", cantidadSuscrita: 300 },
  { accionistaId: "B", accionId: "COMUN", cantidadSuscrita: 200 },
  { accionistaId: "C", accionId: "PREFERENTE", cantidadSuscrita: 100 }, // Sin voto
]

shareClasses: [
  { id: "COMUN", conDerechoVoto: true },
  { id: "PREFERENTE", conDerechoVoto: false },
]

// Resultado:
accionistasConDerechoVoto: [
  { shareholder: A, totalAcciones: 300, porcentajeParticipacion: 60 },
  { shareholder: B, totalAcciones: 200, porcentajeParticipacion: 40 },
]
// C no aparece porque sus acciones no tienen derecho a voto
```

**✅ Esto ya está funcionando correctamente**

---

### 2. Quorums Disponibles

**Ubicación**: `app/core/presentation/juntas/stores/snapshot.store.ts`

**Getter**: `quorums()`

**Valores disponibles**:
```typescript
{
  primeraConvocatoriaSimple: 60,      // Para abrir junta (simple)
  primeraConvocatoriaCalificada: 60,  // Para abrir junta (calificado)
  segundaConvocatoriaSimple: 66,      // Para abrir junta (simple, 2da convocatoria)
  segundaConvocatoriaCalificada: 66,  // Para abrir junta (calificado, 2da convocatoria)
  quorumMinimoSimple: 50,             // Para aprobar acuerdos (simple)
  quorumMinimoCalificado: 60,         // Para aprobar acuerdos (calificado)
}
```

**✅ Esto ya está disponible**

---

## ❌ Lo que FALTA

### 1. Cálculo de Aprobación en Votación

**Problema**: No hay un getter/computed que calcule si una votación se aprobó o no.

**Necesitamos**:
- Calcular porcentaje de votos a favor
- Comparar con `quorumMinimoSimple` o `quorumMinimoCalificado` según el tipo de acuerdo
- Determinar si se aprobó o no

**Lógica**:
```typescript
// 1. Obtener votos del store de votación
const votos = votacionStore.votos; // VoteEntry[]

// 2. Obtener accionistas con derecho a voto del snapshot
const accionistas = snapshotStore.accionistasConDerechoVoto;

// 3. Calcular acciones que votaron a favor
const accionesAFavor = votos
  .filter(v => v.valor === "A_FAVOR")
  .reduce((sum, v) => {
    const accionista = accionistas.find(a => a.shareholder.id === v.accionistaId);
    return sum + (accionista?.totalAcciones || 0);
  }, 0);

// 4. Calcular total de acciones con voto
const totalAccionesConVoto = accionistas.reduce(
  (sum, a) => sum + a.totalAcciones, 
  0
);

// 5. Calcular porcentaje a favor
const porcentajeAFavor = totalAccionesConVoto > 0
  ? (accionesAFavor / totalAccionesConVoto) * 100
  : 0;

// 6. Determinar tipo de acuerdo (SIMPLE o CALIFICADO)
const tipoAcuerdo = "SIMPLE"; // o "CALIFICADO" según el punto de agenda

// 7. Obtener quorum mínimo requerido
const quorumMinimo = tipoAcuerdo === "SIMPLE"
  ? snapshotStore.quorums?.quorumMinimoSimple || 50
  : snapshotStore.quorums?.quorumMinimoCalificado || 60;

// 8. Determinar si se aprobó
const aprobado = porcentajeAFavor >= quorumMinimo;
```

**Solución**: Crear un getter en `useVotacionStore` o un composable `useVotacionAprobacion`

---

### 2. Mejora de Seeds

**Problema**: Los seeds actuales no tienen variedad de tipos de acciones.

**Necesitamos**:
- **Sociedad 1**: Sistema clásico (Comunes con voto, Preferentes sin voto)
- **Sociedad 2**: Sistema de clases (Clase A, B, D, etc. con/sin voto)

**Sistema Clásico**:
```typescript
shareClasses: [
  { id: "COMUN", tipo: "COMUN", conDerechoVoto: true },
  { id: "PREFERENTE", tipo: "SIN_DERECHO_A_VOTO", conDerechoVoto: false },
]
```

**Sistema de Clases**:
```typescript
shareClasses: [
  { id: "CLASE_A", tipo: "CLASE", nombre: "Clase A", conDerechoVoto: true },
  { id: "CLASE_B", tipo: "CLASE", nombre: "Clase B", conDerechoVoto: true },
  { id: "CLASE_D", tipo: "CLASE", nombre: "Clase D", conDerechoVoto: false },
]
```

---

## 🎯 Plan de Acción

### Opción 1: Getter en `useVotacionStore` (Recomendado)

**Ventajas**:
- Todo relacionado con votación en un solo lugar
- Fácil de usar desde componentes
- Reactivo automáticamente

**Implementación**:
```typescript
// app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore.ts

getters: {
  // ... getters existentes ...
  
  /**
   * Calcula si la votación está aprobada
   * @param tipoAcuerdo "SIMPLE" | "CALIFICADO"
   */
  estaAprobada: (state) => (tipoAcuerdo: "SIMPLE" | "CALIFICADO"): boolean => {
    // Implementación aquí
  },
  
  /**
   * Calcula el porcentaje de votos a favor
   */
  porcentajeAFavor(): number {
    // Implementación aquí
  },
}
```

---

### Opción 2: Composable `useVotacionAprobacion`

**Ventajas**:
- Separación de responsabilidades
- Reutilizable en diferentes contextos
- Más flexible

**Implementación**:
```typescript
// app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionAprobacion.ts

export function useVotacionAprobacion(tipoAcuerdo: "SIMPLE" | "CALIFICADO") {
  const votacionStore = useVotacionStore();
  const snapshotStore = useSnapshotStore();
  
  const porcentajeAFavor = computed(() => {
    // Cálculo aquí
  });
  
  const aprobado = computed(() => {
    // Comparación con quorum aquí
  });
  
  return {
    porcentajeAFavor,
    aprobado,
    // ... otros valores calculados
  };
}
```

---

## 📋 Checklist

- [ ] Crear getter/composable para calcular aprobación
- [ ] Mejorar seeds con sistema clásico y de clases
- [ ] Verificar que la vista de aporte dinerario renderice correctamente los porcentajes
- [ ] Agregar tests para el cálculo de aprobación

---

## 🔍 Preguntas Pendientes

1. **¿Dónde se determina si un punto de agenda es SIMPLE o CALIFICADO?**
   - ¿Viene del backend?
   - ¿Está hardcodeado en el frontend?
   - ¿Se configura en algún lugar?

2. **¿Los votos ya incluyen las acciones del accionista?**
   - ¿O necesitamos hacer el match con `accionistasConDerechoVoto`?

3. **¿Necesitamos calcular también votos en contra y abstenciones?**
   - Para mostrar en la UI

