# 📊 Reporte de Auditoría: Remoción de Apoderados

**Fecha:** 2025-01-XX  
**Auditor:** Auto (IA Assistant)  
**Alcance:** Comparación con Aporte Dinerario, Remoción de Gerente y Capitalización de Créditos

---

## 📋 Resumen Ejecutivo

Se realizó una auditoría completa del flujo de **Remoción de Apoderados** comparándolo con los otros 3 flujos principales de juntas:

1. **Aporte Dinerario** (flujo de referencia)
2. **Remoción de Gerente** (flujo similar)
3. **Capitalización de Créditos** (flujo similar)

### Estado General: 🟡 **PARCIALMENTE CONFORME**

El flujo está bien estructurado en general, pero tiene algunas inconsistencias arquitectónicas y diferencias con los otros flujos que deben corregirse.

---

## ✅ Cumplimientos

### 1. Arquitectura Hexagonal

- ✅ **Domain Layer:**

  - ✅ Puerto (contrato) existe: `domain/ports/removal-attorney.repository.ts`
  - ✅ DTOs están en `application/dtos/removal-attorney.dto.ts`
  - ✅ Casos de uso están en `application/use-cases/removal-attorney/`
  - ✅ Repositorio HTTP está en `infrastructure/repositories/removal-attorney.http.repository.ts`

- ✅ **Presentation Layer:**
  - ✅ Stores están en `presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/`
  - ✅ Controllers están en `presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/`
  - ✅ Componentes están en `presentation/juntas/puntos-acuerdo/remocion-apoderados/components/`

### 2. Stores (Pinia)

- ✅ **useRemocionApoderadosStore** usa **Option API** correctamente
- ✅ **useVotacionRemocionApoderadosStore** usa **Option API** correctamente
- ✅ Ambos stores tienen persistencia configurada correctamente

### 3. Separación de Responsabilidades

- ✅ Los casos de uso no hacen IO directamente
- ✅ Los repositorios están correctamente implementados
- ✅ Los controllers orquestan correctamente

### 4. Funcionalidad Específica

- ✅ Soporta múltiples items de votación (una por apoderado)
- ✅ Maneja correctamente la creación de candidatos
- ✅ Actualiza estados de candidatos después de votación
- ✅ Sincroniza votos con votantes actuales

---

## ⚠️ Problemas Encontrados

### 1. **FALTA ENTIDAD DE DOMINIO** 🔴 CRÍTICO

**Problema:** No existe una entidad de dominio para `RemovalAttorney` en `domain/entities/`

**Ubicación:** `app/core/hexag/juntas/domain/entities/`

**Comparación con otros flujos:**

- ✅ **Aporte Dinerario:** No tiene entidad específica (usa entidades genéricas)
- ✅ **Remoción de Gerente:** No tiene entidad específica (usa entidades genéricas)
- ✅ **Capitalización de Créditos:** Tiene `credit-capitalization.entity.ts` y `creditor.entity.ts`

**Impacto:**

- El flujo funciona, pero no sigue el patrón completo de arquitectura hexagonal
- Los DTOs se usan directamente sin transformación a entidades de dominio
- Dificulta la validación de reglas de negocio en el dominio

**Recomendación:**

- Si otros flujos similares (Remoción de Gerente) no tienen entidades, puede ser aceptable
- Si Capitalización de Créditos tiene entidades, debería seguir el mismo patrón

---

### 2. **FALTA MAPPER DE INFRASTRUCTURE** 🟡 MEDIO

**Problema:** No existe mapper en `infrastructure/mappers/` para transformar DTO ↔ Entidad

**Ubicación esperada:** `app/core/hexag/juntas/infrastructure/mappers/removal-attorney.mapper.ts`

**Comparación con otros flujos:**

- ❓ **Aporte Dinerario:** Verificar si tiene mapper
- ❓ **Remoción de Gerente:** Verificar si tiene mapper
- ✅ **Capitalización de Créditos:** Tiene `credit-capitalization.mapper.ts` y `creditor.mapper.ts`

**Impacto:**

- Si no hay entidad de dominio, el mapper no es necesario
- Si se crea la entidad, el mapper será obligatorio

**Recomendación:**

- Si se decide crear la entidad de dominio, crear el mapper correspondiente
- Si no se crea la entidad, este punto no aplica

---

### 3. **DIFERENCIA EN ESTRUCTURA DE VOTACIÓN** 🟡 MEDIO

**Problema:** El flujo usa un store dedicado (`useVotacionRemocionApoderadosStore`) mientras que otros flujos usan el store global (`useVotacionStore`)

**Ubicación:**

- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts`
- `app/core/presentation/juntas/stores/votacion.store.ts` (store global)

**Comparación con otros flujos:**

- ✅ **Aporte Dinerario:** Usa `useVotacionStore` (store global) + `useVotacionAportesStore` (store específico para cálculos)
- ✅ **Remoción de Gerente:** Usa `useVotacionStore` (store global) + `useVotacionRemocionStore` (store específico)
- ❓ **Capitalización de Créditos:** Verificar estructura

**Análisis:**

- El store dedicado es necesario porque maneja **múltiples items** (una votación por apoderado)
- El store global (`useVotacionStore`) está diseñado para un solo item
- Esta diferencia es **justificada** por la complejidad del flujo

**Recomendación:**

- ✅ **MANTENER** el store dedicado (es correcto para este caso)
- Documentar por qué se usa un store dedicado en lugar del global

---

### 4. **DIFERENCIA EN CREACIÓN DE ITEMS DE VOTACIÓN** 🟡 MEDIO

**Problema:** Los items de votación se crean en `useRemocionApoderadosPage.ts` (composable de selección) en lugar de en el controller de votación

**Ubicación:**

- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/useRemocionApoderadosPage.ts` (líneas 126-285)

**Comparación con otros flujos:**

- ✅ **Aporte Dinerario:** Los items se crean en el controller de votación (`useVotacionController.ts`)
- ✅ **Remoción de Gerente:** Los items se crean en el controller de votación (`useVotacionRemocionController.ts`)
- ❓ **Capitalización de Créditos:** Verificar

**Análisis:**

- En Remoción de Apoderados, los items se crean cuando el usuario hace "Siguiente" en la página de selección
- Esto es necesario porque se necesita crear una votación por cada apoderado seleccionado
- La lógica está mezclada entre selección y votación

**Recomendación:**

- ⚠️ **CONSIDERAR** mover la creación de items al controller de votación
- Si se mantiene en la página de selección, documentar por qué
- Separar mejor las responsabilidades: selección solo crea candidatos, votación crea items

---

### 5. **FALTA VALIDACIÓN DE CONTEXTO EN STORE GLOBAL** 🟡 MEDIO

**Problema:** El store dedicado (`useVotacionRemocionApoderadosStore`) no valida el contexto al cargar votaciones

**Ubicación:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts` (línea 238)

**Comparación con otros flujos:**

- ✅ **Remoción de Gerente:** Valida el contexto en el controller (`useVotacionRemocionController.ts` líneas 65-79)
- ❓ **Aporte Dinerario:** Verificar validación de contexto

**Recomendación:**

- Agregar validación de contexto en `loadVotacion()` del store dedicado
- O mantener la validación en el controller (como en Remoción de Gerente)

---

### 6. **DIFERENCIA EN MANEJO DE VOTOS MÚLTIPLES** 🟢 BAJO

**Problema:** El flujo maneja múltiples items de votación, pero algunos métodos del store solo trabajan con el primer item

**Ubicación:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts`

**Ejemplos:**

- `itemVotacion()` getter retorna solo el primer item (línea 50)
- `votos()` getter retorna solo votos del primer item (línea 57)
- `esUnanimidad()` y `esSometidaAVotacion()` solo verifican el primer item (líneas 92-102)

**Análisis:**

- Esto es intencional para compatibilidad con componentes que esperan un solo item
- El store tiene métodos específicos para múltiples items (`getVotoByAccionistaAndItem`, `getItemByIndex`)

**Recomendación:**

- ✅ **MANTENER** la estructura actual (es correcta)
- Documentar que los getters simples son para compatibilidad
- Usar métodos específicos cuando se necesite trabajar con múltiples items

---

## 📋 Checklist de Correcciones Necesarias

### 🔴 Críticas (Alta Prioridad)

- [ ] **Decidir si crear entidad de dominio** `RemovalAttorney` en `domain/entities/`
  - [ ] Si se crea: Crear mapper en `infrastructure/mappers/removal-attorney.mapper.ts`
  - [ ] Si no se crea: Documentar por qué (comparar con Remoción de Gerente)

### 🟡 Medias (Prioridad Media)

- [ ] **Evaluar mover creación de items** de `useRemocionApoderadosPage.ts` al controller de votación

  - [ ] Analizar impacto en el flujo
  - [ ] Si se mueve: Refactorizar para separar responsabilidades
  - [ ] Si no se mueve: Documentar justificación

- [ ] **Agregar validación de contexto** en `loadVotacion()` del store dedicado

  - [ ] O mantener validación en controller (como Remoción de Gerente)

- [ ] **Documentar diferencias** con otros flujos:
  - [ ] Por qué se usa store dedicado en lugar del global
  - [ ] Por qué los items se crean en la página de selección

### 🟢 Bajas (Prioridad Baja)

- [ ] **Revisar consistencia** en nombres de métodos entre stores
- [ ] **Agregar comentarios** explicando la estructura de múltiples items
- [ ] **Verificar** que todos los métodos de múltiples items estén documentados

---

## 📊 Comparación Detallada por Capa

### Domain Layer

| Aspecto                 | Remoción Apoderados | Aporte Dinerario | Remoción Gerente | Capitalización Créditos                                             |
| ----------------------- | ------------------- | ---------------- | ---------------- | ------------------------------------------------------------------- |
| **Entidad de Dominio**  | ❌ No existe        | ❌ No existe     | ❌ No existe     | ✅ Existe (`credit-capitalization.entity.ts`, `creditor.entity.ts`) |
| **Puerto (Repository)** | ✅ Existe           | ✅ Existe        | ✅ Existe        | ✅ Existe                                                           |
| **DTOs**                | ✅ Existe           | ✅ Existe        | ✅ Existe        | ✅ Existe                                                           |

**Conclusión:** Remoción de Apoderados está alineado con Aporte Dinerario y Remoción de Gerente, pero diferente de Capitalización de Créditos.

### Application Layer

| Aspecto          | Remoción Apoderados | Aporte Dinerario   | Remoción Gerente | Capitalización Créditos |
| ---------------- | ------------------- | ------------------ | ---------------- | ----------------------- |
| **Casos de Uso** | ✅ 3 casos de uso   | ✅ Múltiples casos | ✅ 1 caso de uso | ✅ 4 casos de uso       |
| **DTOs**         | ✅ Completo         | ✅ Completo        | ✅ Completo      | ✅ Completo             |

**Conclusión:** Todos los flujos tienen casos de uso bien estructurados.

### Infrastructure Layer

| Aspecto                  | Remoción Apoderados | Aporte Dinerario | Remoción Gerente | Capitalización Créditos                                             |
| ------------------------ | ------------------- | ---------------- | ---------------- | ------------------------------------------------------------------- |
| **Repositorio HTTP**     | ✅ Existe           | ✅ Existe        | ✅ Existe        | ✅ Existe                                                           |
| **Mapper DTO ↔ Entidad** | ❌ No existe        | ❓ Verificar     | ❓ Verificar     | ✅ Existe (`credit-capitalization.mapper.ts`, `creditor.mapper.ts`) |

**Conclusión:** Remoción de Apoderados no tiene mapper, pero esto es consistente si no hay entidad de dominio.

### Presentation Layer

| Aspecto               | Remoción Apoderados    | Aporte Dinerario             | Remoción Gerente             | Capitalización Créditos |
| --------------------- | ---------------------- | ---------------------------- | ---------------------------- | ----------------------- |
| **Store Principal**   | ✅ Option API          | ✅ Option API                | ✅ Option API                | ❓ Verificar            |
| **Store de Votación** | ✅ Store dedicado      | ✅ Store global + específico | ✅ Store global + específico | ❓ Verificar            |
| **Controller**        | ✅ Existe              | ✅ Existe                    | ✅ Existe                    | ❓ Verificar            |
| **Creación de Items** | ⚠️ En página selección | ✅ En controller             | ✅ En controller             | ❓ Verificar            |

**Conclusión:** Remoción de Apoderados tiene una estructura ligeramente diferente pero justificada por la complejidad de múltiples items.

---

## 💡 Sugerencias de Mejora (Opcional)

### 1. **Consistencia con Capitalización de Créditos**

Si Capitalización de Créditos tiene entidades de dominio y mappers, considerar seguir el mismo patrón para Remoción de Apoderados para mantener consistencia en el código.

### 2. **Separación de Responsabilidades**

Considerar mover la creación de items de votación del composable de selección (`useRemocionApoderadosPage.ts`) al controller de votación (`useVotacionRemocionApoderadosController.ts`) para mejor separación de responsabilidades.

### 3. **Documentación**

Agregar documentación explicando:

- Por qué se usa un store dedicado en lugar del global
- Cómo funciona la estructura de múltiples items
- Diferencias con otros flujos similares

### 4. **Validación de Contexto**

Agregar validación de contexto en el store dedicado para evitar conflictos si se carga una votación con contexto incorrecto.

---

## ✅ Conclusión

El flujo de **Remoción de Apoderados** está **bien estructurado** en general y sigue la arquitectura hexagonal correctamente. Las principales diferencias con otros flujos son:

1. **Store dedicado para votación** - Justificado por la complejidad de múltiples items
2. **Creación de items en página de selección** - Funcional pero podría mejorarse
3. **Falta de entidad de dominio** - Consistente con otros flujos similares (Aporte Dinerario, Remoción de Gerente)

**Recomendación Final:** El flujo está **funcionalmente correcto** y sigue buenas prácticas. Las diferencias son justificadas por la complejidad específica del flujo. Se recomienda documentar estas diferencias y considerar las mejoras sugeridas en el futuro.

---

**Próximos Pasos:**

1. Decidir si crear entidad de dominio (comparar con Capitalización de Créditos)
2. Evaluar mover creación de items al controller de votación
3. Agregar validación de contexto en store dedicado
4. Documentar diferencias con otros flujos
