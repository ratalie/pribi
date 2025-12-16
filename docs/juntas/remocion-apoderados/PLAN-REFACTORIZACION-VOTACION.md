# 📋 Plan de Refactorización: Votación de Remoción de Apoderados

**Objetivo:** Unificar la votación de Remoción de Apoderados para que funcione exactamente como los otros 3 flujos (Pronunciamiento, Aplicación de Resultados, Delegación de Auditores).

**Fecha:** 2025-01-XX  
**Estado:** 📝 Planificado

---

## 🎯 Objetivo Principal

Hacer que **Remoción de Apoderados** use el mismo patrón que los otros 3 flujos:

1. ✅ **Store dedicado** (no compartido)
2. ✅ **Controller con misma estructura**
3. ✅ **Vista con mismo formato de props**
4. ✅ **Aislamiento total** (sin interferencia entre flujos)

---

## 📊 Análisis de Diferencias Actuales

### ✅ **Los 3 que funcionan bien:**

| Aspecto | Pronunciamiento/Aplicación/Auditores |
|---------|--------------------------------------|
| **Store** | Dedicado (`useVotacionPronunciamientoStore`, etc.) |
| **Ubicación Store** | `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/[flujo]/votacion/stores/` |
| **Controller** | Usa store dedicado |
| **Vista** | Pasa `:texto-votacion` (string) |
| **Vista** | Pasa `:get-voto` (función) |
| **Vista** | NO pasa `:preguntas` |
| **Items** | 1 solo item (una pregunta) |

### ❌ **Remoción de Apoderados (actual):**

| Aspecto | Remoción de Apoderados |
|---------|------------------------|
| **Store** | Compartido (`useVotacionStore`) ⚠️ |
| **Ubicación Store** | `app/core/presentation/juntas/stores/votacion.store.ts` ⚠️ |
| **Controller** | Usa store compartido ⚠️ |
| **Vista** | Pasa `:preguntas` (array) ⚠️ |
| **Vista** | NO pasa `:texto-votacion` ⚠️ |
| **Vista** | Pasa `:get-voto` (pero adaptado) ⚠️ |
| **Items** | Múltiples items (una pregunta por apoderado) |

---

## 🔧 Plan de Refactorización

### **FASE 1: Crear Store Dedicado** 🟢

**Objetivo:** Crear un store dedicado para Remoción de Apoderados, igual que los otros 3.

**Archivo a crear:**
```
app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts
```

**Estructura del store (copiar de `useVotacionPronunciamientoStore.ts`):**

```typescript
export const useVotacionRemocionApoderadosStore = defineStore("votacionRemocionApoderados", {
  state: () => ({
    sesionVotacion: null as VoteSession | null,
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    hasVotacion(): boolean { ... },
    itemVotacion(): VoteItem | null { ... }, // ⚠️ Para múltiples items, retornar items[0] o crear getter específico
    votos(): VoteEntry[] { ... },
    getVotoByAccionista: (state) => (accionistaId: string, itemIndex?: number): VoteEntry | null { ... },
    esUnanimidad(): boolean { ... },
    esSometidaAVotacion(): boolean { ... },
    getResult: (state) => (puntoId: string) => { ... },
    
    // ✅ NUEVO: Getters específicos para múltiples items
    items(): VoteItem[] { ... },
    getItemByIndex: (state) => (index: number): VoteItem | null { ... },
    getVotoByAccionistaAndItem: (state) => (accionistaId: string, itemIndex: number): VoteEntry | null { ... },
  },

  actions: {
    async loadVotacion(societyId: number, flowId: number) { ... },
    async createVotacion(...) { ... },
    async addVote(...) { ... },
    async updateVote(...) { ... },
    async removeVote(...) { ... },
    async updateTipoAprobacion(...) { ... },
    
    // ✅ NUEVO: Actions para múltiples items
    async addVoteItem(...) { ... },
    async updateVoteItem(...) { ... },
    async addOrUpdateVoteForItem(itemIndex: number, accionistaId: string, valor: VoteValue) { ... },
  },
});
```

**Cambios clave:**
- ✅ Contexto fijo: `VoteContext.REMOCION_APODERADOS`
- ✅ Soporte para múltiples items (una pregunta por apoderado)
- ✅ Mismos métodos que los otros stores, pero adaptados para múltiples items

**Tiempo estimado:** 2-3 horas

---

### **FASE 2: Refactorizar Controller** 🟡

**Objetivo:** Adaptar el controller para usar el store dedicado y seguir el mismo patrón.

**Archivo a modificar:**
```
app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts
```

**Cambios necesarios:**

1. **Reemplazar store compartido por store dedicado:**
   ```typescript
   // ❌ ANTES:
   import { useVotacionStore } from "~/core/presentation/juntas/stores/votacion.store";
   const votacionStore = useVotacionStore();
   
   // ✅ DESPUÉS:
   import { useVotacionRemocionApoderadosStore } from "../stores/useVotacionRemocionApoderadosStore";
   const votacionStore = useVotacionRemocionApoderadosStore();
   ```

2. **Eliminar validaciones de contexto:**
   - Ya no son necesarias porque el store es dedicado
   - Eliminar todas las validaciones `if (contexto !== REMOCION_APODERADOS)`

3. **Adaptar `textoVotacion` para múltiples preguntas:**
   ```typescript
   // ✅ Opción 1: Retornar texto combinado (recomendado para mantener compatibilidad)
   const textoVotacion = computed(() => {
     if (votacionStore.items.length === 0) {
       return "Se aprueba la remoción de los apoderados seleccionados.";
     }
     // Combinar todas las preguntas en un solo texto
     return votacionStore.items
       .map((item, index) => `${index + 1}. ${item.label}`)
       .join("\n\n");
   });
   
   // ✅ Opción 2: Mantener array de preguntas pero pasar como textoVotacion
   // (requiere modificar componente MetodoVotacio para aceptar array)
   ```

4. **Adaptar `getVoto` para múltiples items:**
   ```typescript
   // ⚠️ PROBLEMA: Los otros 3 tienen 1 item, Remoción tiene múltiples
   // SOLUCIÓN: getVoto retorna el voto del primer item (para compatibilidad)
   // O crear función específica para múltiples items
   
   function getVoto(accionistaId: string): VoteValue | null {
     // Retornar voto del primer item (compatibilidad con otros flujos)
     return votacionStore.getVotoByAccionista(accionistaId, 0)?.valor as VoteValue | null;
   }
   
   // ✅ NUEVO: Función para obtener voto de un item específico
   function getVotoForItem(itemIndex: number, accionistaId: string): VoteValue | null {
     return votacionStore.getVotoByAccionistaAndItem(accionistaId, itemIndex)?.valor as VoteValue | null;
   }
   ```

5. **Adaptar `setVoto` para múltiples items:**
   ```typescript
   // ⚠️ PROBLEMA: setVoto necesita saber a qué item pertenece el voto
   // SOLUCIÓN: Agregar parámetro itemIndex
   
   function setVoto(itemIndex: number, accionistaId: string, valor: VoteValue) {
     await votacionStore.addOrUpdateVoteForItem(itemIndex, accionistaId, valor);
   }
   ```

6. **Mantener `mapearVotantesDesdeSnapshot()`:**
   - Ya está implementado correctamente
   - No requiere cambios

7. **Adaptar `guardarVotacion()`:**
   - Guardar todos los items de la sesión
   - Mantener la lógica de actualización de estados de candidatos

**Tiempo estimado:** 3-4 horas

---

### **FASE 3: Refactorizar Vista** 🟡

**Objetivo:** Adaptar la vista para usar el mismo formato de props que los otros 3.

**Archivo a modificar:**
```
app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/votacion.vue
```

**Cambios necesarios:**

1. **Eliminar prop `:preguntas`:**
   ```vue
   <!-- ❌ ANTES: -->
   <MetodoVotacio
     :preguntas="preguntas"
     ...
   />
   
   <!-- ✅ DESPUÉS: -->
   <MetodoVotacio
     :texto-votacion="textoVotacion"
     ...
   />
   ```

2. **Agregar prop `:texto-votacion`:**
   ```vue
   <script setup lang="ts">
     const controller = useVotacionRemocionApoderadosController();
     const textoVotacion = controller.textoVotacion; // ✅ Computed que retorna string
     const getVoto = controller.getVoto; // ✅ Función
   </script>
   ```

3. **Mantener `:get-voto`:**
   - Ya está implementado
   - Solo asegurar que funcione correctamente

4. **Adaptar `handleCambiarVoto` para múltiples items:**
   ```typescript
   // ⚠️ PROBLEMA: handleCambiarVoto necesita itemIndex
   // SOLUCIÓN: El componente MetodoVotacio debe pasar preguntaIndex
   
   function handleCambiarVoto(
     accionistaId: string,
     valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION",
     preguntaIndex?: number // ✅ Agregar parámetro opcional
   ) {
     const itemIndex = preguntaIndex ?? 0; // Default al primer item
     controller.setVoto(itemIndex, accionistaId, voteValue);
   }
   ```

**Tiempo estimado:** 1 hora

---

### **FASE 4: Adaptar Componente MetodoVotacio (si es necesario)** 🟡

**Objetivo:** Asegurar que `MetodoVotacio` y `MayoriaVotacion` funcionen con múltiples preguntas.

**Archivos a revisar:**
```
app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue
app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MayoriaVotacion.vue
```

**Cambios necesarios:**

1. **Verificar soporte para múltiples preguntas:**
   - `MayoriaVotacion` ya soporta múltiples preguntas (usa `preguntas.value.forEach`)
   - Solo asegurar que funcione correctamente con `textoVotacion` que contiene múltiples líneas

2. **Si `textoVotacion` contiene múltiples líneas:**
   ```typescript
   // En MayoriaVotacion.vue
   const preguntas = computed(() => {
     if (props.textoVotacion) {
       // Si textoVotacion contiene saltos de línea, dividir en preguntas
       const textoValue = typeof props.textoVotacion === "object" && "value" in props.textoVotacion
         ? (props.textoVotacion as any).value
         : props.textoVotacion;
       
       if (typeof textoValue === "string" && textoValue.includes("\n\n")) {
         return textoValue.split("\n\n").filter(p => p.trim() !== "");
       }
       return [textoValue];
     }
     return props.preguntas || [];
   });
   ```

**Tiempo estimado:** 1-2 horas

---

### **FASE 5: Eliminar Dependencias del Store Compartido** 🟢

**Objetivo:** Limpiar código que ya no se necesita.

**Archivos a modificar:**
```
app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts
app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/useRemocionApoderadosPage.ts
```

**Cambios necesarios:**

1. **Eliminar import de `useVotacionStore` del controller:**
   - Ya no se necesita

2. **Revisar `useRemocionApoderadosPage.ts`:**
   - Verificar si usa `useVotacionStore`
   - Si lo usa, adaptar para usar el store dedicado o eliminar dependencia

**Tiempo estimado:** 30 minutos

---

### **FASE 6: Testing y Validación** 🟢

**Objetivo:** Verificar que todo funcione correctamente.

**Checklist:**

- [ ] Store dedicado carga votación correctamente
- [ ] Controller genera `textoVotacion` correctamente (múltiples preguntas)
- [ ] Vista muestra preguntas correctas
- [ ] `getVoto` funciona para cada item
- [ ] `setVoto` guarda votos en el item correcto
- [ ] Guardado de votación funciona
- [ ] No hay interferencia con otros flujos
- [ ] No se muestra pregunta de "Aportes Dinerarios"

**Tiempo estimado:** 2 horas

---

## 📝 Resumen de Archivos a Modificar/Crear

### **Archivos a CREAR:**
1. ✅ `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts` (NUEVO - basado en `useVotacionPronunciamientoStore.ts`)

### **Archivos a MODIFICAR:**
1. ✅ `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`
2. ✅ `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/votacion.vue`
3. ✅ `app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MayoriaVotacion.vue` (si es necesario)
4. ✅ `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/useRemocionApoderadosPage.ts` (revisar dependencias)

### **Archivos a ELIMINAR:**
- ❌ Ninguno (el store compartido se sigue usando para otros flujos)

---

## ⚠️ Consideraciones Especiales

### **Múltiples Items vs Un Solo Item**

**Problema:** Los otros 3 flujos tienen 1 item, Remoción tiene múltiples.

**Solución adoptada:**
1. Store dedicado con soporte para múltiples items
2. `textoVotacion` combina todas las preguntas en un solo string (separadas por `\n\n`)
3. `getVoto` retorna voto del primer item (para compatibilidad)
4. `setVoto` acepta `itemIndex` para especificar a qué item pertenece el voto
5. `MayoriaVotacion` divide `textoVotacion` en preguntas si contiene saltos de línea

**Alternativa (no recomendada):**
- Modificar `MetodoVotacio` para aceptar `:preguntas` además de `:texto-votacion`
- Esto rompería la unificación

---

## 🎯 Resultado Final Esperado

Después de la refactorización:

1. ✅ **Remoción de Apoderados** usa store dedicado (igual que los otros 3)
2. ✅ **Remoción de Apoderados** pasa `:texto-votacion` (igual que los otros 3)
3. ✅ **Remoción de Apoderados** pasa `:get-voto` (igual que los otros 3)
4. ✅ **Remoción de Apoderados** NO pasa `:preguntas` (igual que los otros 3)
5. ✅ **Aislamiento total** - Sin interferencia entre flujos
6. ✅ **Mismo patrón** - Todos los flujos funcionan igual

---

## ⏱️ Tiempo Total Estimado

- **Fase 1:** 2-3 horas
- **Fase 2:** 3-4 horas
- **Fase 3:** 1 hora
- **Fase 4:** 1-2 horas
- **Fase 5:** 30 minutos
- **Fase 6:** 2 horas

**Total:** 9.5 - 12.5 horas

---

## 🚀 Orden de Implementación Recomendado

1. **Fase 1** - Crear store dedicado (base sólida)
2. **Fase 2** - Refactorizar controller (lógica principal)
3. **Fase 3** - Refactorizar vista (interfaz)
4. **Fase 4** - Adaptar componentes (si es necesario)
5. **Fase 5** - Limpiar dependencias (optimización)
6. **Fase 6** - Testing (validación)

---

## ✅ Checklist Final

- [ ] Store dedicado creado y funcionando
- [ ] Controller refactorizado y usando store dedicado
- [ ] Vista refactorizada con mismo formato de props
- [ ] Componentes adaptados para múltiples preguntas
- [ ] Dependencias del store compartido eliminadas
- [ ] Testing completo realizado
- [ ] No hay interferencia entre flujos
- [ ] Código unificado y consistente

---

**¿Listo para comenzar?** 🚀



