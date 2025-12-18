# 🎯 Solución: Múltiples Votaciones en Remoción de Apoderados

**Problema:** Necesitamos manejar múltiples votaciones (una por cada apoderado a remover) y mostrarlas en la vista, pero estandarizando con los otros flujos.

**Fecha:** 2025-01-XX

---

## ✅ Buenas Noticias

El componente `MayoriaVotacion` **YA soporta múltiples preguntas**:

```vue
<!-- MayoriaVotacion.vue -->
<div v-for="(pregunta, preguntaIndex) in preguntas" :key="preguntaIndex">
  <!-- Cada pregunta tiene su propia tabla de votación -->
  <!-- Los votos se almacenan: votos[preguntaIndex][accionistaIndex] -->
</div>
```

**Esto significa que:**
- ✅ Puedes pasar múltiples preguntas como array
- ✅ Cada pregunta se muestra con su propia tabla de votación
- ✅ Los votos se manejan independientemente por pregunta
- ✅ El componente emite `@cambiar-voto` con `preguntaIndex`

---

## 🎯 Solución Estandarizada

### **Opción 1: Mantener `:preguntas` (Recomendada para múltiples items)**

**Ventajas:**
- ✅ Ya funciona con múltiples preguntas
- ✅ No requiere cambios en `MayoriaVotacion`
- ✅ Soporta cualquier cantidad de preguntas dinámicamente

**Estructura:**

```vue
<!-- votacion.vue -->
<MetodoVotacio
  :preguntas="preguntas"  <!-- ✅ Array de strings -->
  :votantes="votantes"
  :get-voto="getVoto"     <!-- ✅ Función que acepta preguntaIndex -->
  @cambiar-voto="handleCambiarVoto"
/>
```

**Controller:**

```typescript
// ✅ preguntas: Array de strings (una por apoderado)
const preguntas = computed(() => {
  return votacionStore.items.map(item => item.label);
});

// ✅ getVoto: Función que acepta preguntaIndex
function getVoto(preguntaIndex: number, accionistaId: string): VoteValue | null {
  return votacionStore.getVotoByAccionistaAndItem(accionistaId, preguntaIndex)?.valor || null;
}

// ✅ setVoto: Función que acepta preguntaIndex
function setVoto(preguntaIndex: number, accionistaId: string, valor: VoteValue) {
  await votacionStore.addOrUpdateVoteForItem(preguntaIndex, accionistaId, valor);
}
```

**Store:**

```typescript
// ✅ Soporte para múltiples items
getters: {
  items(): VoteItem[] {
    return this.sesionVotacion?.items || [];
  },
  
  getVotoByAccionistaAndItem: (state) => 
    (accionistaId: string, itemIndex: number): VoteEntry | null => {
      const item = state.sesionVotacion?.items[itemIndex];
      if (!item) return null;
      return item.votos.find(v => v.accionistaId === accionistaId) || null;
    },
},

actions: {
  async addOrUpdateVoteForItem(
    itemIndex: number, 
    accionistaId: string, 
    valor: VoteValue
  ) {
    const item = this.sesionVotacion?.items[itemIndex];
    if (!item) throw new Error(`Item ${itemIndex} no existe`);
    
    const votoExistente = item.votos.find(v => v.accionistaId === accionistaId);
    if (votoExistente) {
      await this.updateVote(societyId, flowId, votoExistente.id, valor);
    } else {
      await this.addVote(societyId, flowId, accionistaId, valor);
    }
  },
}
```

---

### **Opción 2: Usar `:texto-votacion` con separadores (Alternativa)**

**Ventajas:**
- ✅ Mismo formato que los otros 3 flujos
- ✅ Unifica completamente el patrón

**Desventajas:**
- ⚠️ Requiere modificar `MayoriaVotacion` para dividir el texto
- ⚠️ Menos flexible para múltiples preguntas

**Estructura:**

```typescript
// Controller
const textoVotacion = computed(() => {
  return votacionStore.items
    .map((item, index) => `${index + 1}. ${item.label}`)
    .join("\n\n"); // Separador: doble salto de línea
});

// MayoriaVotacion.vue (modificar)
const preguntas = computed(() => {
  if (props.textoVotacion) {
    const texto = typeof props.textoVotacion === "object" && "value" in props.textoVotacion
      ? (props.textoVotacion as any).value
      : props.textoVotacion;
    
    // Dividir por doble salto de línea
    if (typeof texto === "string" && texto.includes("\n\n")) {
      return texto.split("\n\n").filter(p => p.trim() !== "");
    }
    return [texto];
  }
  return props.preguntas || [];
});
```

---

## 🎯 Recomendación: Opción 1 (Mantener `:preguntas`)

**Razones:**

1. ✅ **Ya funciona:** `MayoriaVotacion` ya soporta múltiples preguntas
2. ✅ **Más flexible:** Permite cualquier cantidad de preguntas dinámicamente
3. ✅ **Menos cambios:** No requiere modificar `MayoriaVotacion`
4. ✅ **Más claro:** Array de preguntas es más explícito que texto con separadores
5. ✅ **Estandarización parcial:** Store dedicado + Controller estandarizado, solo la prop es diferente

---

## 📋 Plan de Implementación (Opción 1)

### **FASE 1: Crear Store Dedicado con Soporte Múltiples Items**

```typescript
// useVotacionRemocionApoderadosStore.ts
export const useVotacionRemocionApoderadosStore = defineStore("votacionRemocionApoderados", {
  state: () => ({
    sesionVotacion: null as VoteSession | null,
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    hasVotacion(): boolean { ... },
    
    // ✅ Soporte para múltiples items
    items(): VoteItem[] {
      return this.sesionVotacion?.items || [];
    },
    
    // ✅ Para compatibilidad con otros flujos (retorna primer item)
    itemVotacion(): VoteItem | null {
      return this.items[0] || null;
    },
    
    // ✅ Obtener voto por item específico
    getVotoByAccionistaAndItem: (state) => 
      (accionistaId: string, itemIndex: number): VoteEntry | null => {
        const item = state.sesionVotacion?.items[itemIndex];
        if (!item) return null;
        return item.votos.find(v => v.accionistaId === accionistaId) || null;
      },
  },

  actions: {
    async loadVotacion(societyId: number, flowId: number) {
      // Cargar con contexto REMOCION_APODERADOS
      const repository = new VoteHttpRepository();
      const useCase = new GetVoteSessionUseCase(repository);
      this.sesionVotacion = await useCase.execute(
        societyId, 
        flowId, 
        VoteContext.REMOCION_APODERADOS
      );
    },
    
    // ✅ Agregar/actualizar voto para un item específico
    async addOrUpdateVoteForItem(
      societyId: number,
      flowId: number,
      itemIndex: number,
      accionistaId: string,
      valor: VoteValue
    ) {
      const item = this.items[itemIndex];
      if (!item) throw new Error(`Item ${itemIndex} no existe`);
      
      const votoExistente = item.votos.find(v => v.accionistaId === accionistaId);
      if (votoExistente) {
        await this.updateVote(societyId, flowId, votoExistente.id, valor);
      } else {
        await this.addVote(societyId, flowId, accionistaId, valor);
      }
    },
  },
});
```

### **FASE 2: Refactorizar Controller**

```typescript
// useVotacionRemocionApoderadosController.ts
export function useVotacionRemocionApoderadosController() {
  const votacionStore = useVotacionRemocionApoderadosStore(); // ✅ Store dedicado
  
  // ✅ preguntas: Array de strings (una por apoderado)
  const preguntas = computed(() => {
    // Prioridad 1: Items de la sesión
    if (votacionStore.items.length > 0) {
      return votacionStore.items.map(item => item.label);
    }
    
    // Prioridad 2: Generar desde candidatos
    if (remocionStore.candidatos.length > 0) {
      return remocionStore.candidatos.map(c => {
        const nombre = getNombreCompletoPersona(c.persona);
        return `Se aprueba la remoción del apoderado ${nombre} de sus funciones como ${c.claseApoderado.nombre}.`;
      });
    }
    
    return [];
  });
  
  // ✅ getVoto: Función que acepta preguntaIndex
  function getVoto(preguntaIndex: number, accionistaId: string): VoteValue | null {
    const voto = votacionStore.getVotoByAccionistaAndItem(accionistaId, preguntaIndex);
    return voto?.valor as VoteValue | null;
  }
  
  // ✅ setVoto: Función que acepta preguntaIndex
  async function setVoto(preguntaIndex: number, accionistaId: string, valor: VoteValue) {
    await votacionStore.addOrUpdateVoteForItem(
      societyId.value,
      flowId.value,
      preguntaIndex,
      accionistaId,
      valor
    );
  }
  
  return {
    preguntas,
    getVoto,
    setVoto,
    // ... otros métodos
  };
}
```

### **FASE 3: Adaptar Vista**

```vue
<!-- votacion.vue -->
<script setup lang="ts">
  const controller = useVotacionRemocionApoderadosController();
  
  // ✅ Preguntas como array
  const preguntas = controller.preguntas;
  
  // ✅ getVoto adaptado para múltiples items
  function getVotoForComponent(accionistaId: string): VoteValue | null {
    // Para compatibilidad con MayoriaVotacion (solo primera pregunta)
    return controller.getVoto(0, accionistaId);
  }
  
  // ✅ handleCambiarVoto con preguntaIndex
  function handleCambiarVoto(
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION",
    preguntaIndex?: number
  ) {
    const itemIndex = preguntaIndex ?? 0;
    controller.setVoto(itemIndex, accionistaId, voteValue);
  }
</script>

<template>
  <MetodoVotacio
    :preguntas="preguntas"  <!-- ✅ Array de strings -->
    :votantes="votantes"
    :get-voto="getVotoForComponent"  <!-- ✅ Para primera pregunta (compatibilidad) -->
    @cambiar-voto="handleCambiarVoto"  <!-- ✅ Recibe preguntaIndex -->
  />
</template>
```

### **FASE 4: Adaptar MayoriaVotacion (si es necesario)**

El componente `MayoriaVotacion` ya maneja múltiples preguntas, pero necesitamos asegurar que `getVoto` funcione con `preguntaIndex`:

```typescript
// MayoriaVotacion.vue
// ✅ Si hay función getVoto, adaptarla para múltiples preguntas
if (props.getVoto) {
  // Crear función adaptada que acepta preguntaIndex
  const getVotoFn = (accionistaId: string, preguntaIndex: number) => {
    const baseGetVoto = typeof props.getVoto === "function"
      ? props.getVoto
      : (props.getVoto as any)?.value || props.getVoto;
    
    // Si getVoto acepta preguntaIndex como primer parámetro
    if (baseGetVoto.length === 2) {
      return baseGetVoto(preguntaIndex, accionistaId);
    }
    
    // Si solo acepta accionistaId (legacy), usar solo para primera pregunta
    if (preguntaIndex === 0) {
      return baseGetVoto(accionistaId);
    }
    
    return null;
  };
  
  // Usar getVotoFn para cargar votos de cada pregunta
  preguntas.value.forEach((pregunta, preguntaIndex) => {
    listaVotantes.value.forEach((votante, accionistaIndex) => {
      const voto = getVotoFn(votante.accionistaId, preguntaIndex);
      if (votos.value[preguntaIndex]) {
        votos.value[preguntaIndex][accionistaIndex] = voto;
      }
    });
  });
}
```

**O mejor aún:** Modificar `getVoto` para que acepte `preguntaIndex`:

```typescript
// Controller
function getVoto(preguntaIndex: number, accionistaId: string): VoteValue | null {
  return votacionStore.getVotoByAccionistaAndItem(accionistaId, preguntaIndex)?.valor || null;
}

// Vista
function getVotoForComponent(preguntaIndex: number, accionistaId: string): VoteValue | null {
  return controller.getVoto(preguntaIndex, accionistaId);
}

// MetodoVotacio.vue
interface Props {
  getVoto?: (preguntaIndex: number, accionistaId: string) => VoteValue | null;
}
```

---

## 🎯 Resultado Final

Después de la implementación:

1. ✅ **Store dedicado** con soporte para múltiples items
2. ✅ **Controller estandarizado** (igual estructura que los otros 3)
3. ✅ **Vista con `:preguntas`** (array de strings)
4. ✅ **Múltiples votaciones** mostradas correctamente
5. ✅ **Votos independientes** por cada pregunta
6. ✅ **Aislamiento total** (store dedicado)

---

## 📊 Comparación Final

| Aspecto | Otros 3 Flujos | Remoción Apoderados |
|---------|----------------|---------------------|
| **Store** | Dedicado | Dedicado ✅ |
| **Items** | 1 item | Múltiples items ✅ |
| **Props Vista** | `:texto-votacion` | `:preguntas` (array) |
| **getVoto** | `(accionistaId)` | `(preguntaIndex, accionistaId)` |
| **Aislamiento** | Total | Total ✅ |

**Conclusión:** Estandarizado en store y controller, diferente solo en la prop de vista (necesario para múltiples preguntas).

---

## ✅ Checklist de Implementación

- [ ] Crear store dedicado con soporte múltiples items
- [ ] Refactorizar controller para usar store dedicado
- [ ] Adaptar `getVoto` para aceptar `preguntaIndex`
- [ ] Adaptar `setVoto` para aceptar `preguntaIndex`
- [ ] Mantener `:preguntas` en vista (array de strings)
- [ ] Verificar que `MayoriaVotacion` maneje múltiples preguntas correctamente
- [ ] Testing: Verificar que cada pregunta tenga votos independientes
- [ ] Testing: Verificar que se guarden correctamente en el backend

---

**¿Listo para implementar?** 🚀



