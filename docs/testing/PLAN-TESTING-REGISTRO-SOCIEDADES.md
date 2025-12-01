# 📋 Plan Completo: Testing Registro de Sociedades

## 🎯 Objetivo

Implementar testing completo (Backend Real + MSW) para los pasos del flujo de **Registro de Sociedades** que son necesarios para **Juntas de Accionistas**, y validar que el **seed completo** funciona correctamente.

---

## 📊 Estado Actual

### ✅ Completado

1. **Build arreglado** - Sin errores de TypeScript/linting
2. **Testing Backend Real** - Solo para `POST/GET/DELETE /api/v2/society-profile` (Paso 0)
3. **Sistema de Logs** - TestLogger implementado
4. **Patrón de Tests Compartidos** - Establecido y funcionando
5. **Documentación consolidada** - `docs/testing/GUIA-COMPLETA-TESTS.md`

### ❌ Pendiente

**Testing Backend Real** para pasos:
- ❌ Paso 1: Datos principales
- ❌ Paso 2: Accionistas
- ❌ Paso 3: Acciones
- ❌ Paso 4: Asignación de acciones
- ❌ Paso 5: Quórums y mayorías
- ❌ Paso 6: Directores
- ❌ Paso 8: Registro de apoderados (clase + apoderado)

**MSW** para pasos:
- ❌ Paso 3: Acciones
- ❌ Paso 4: Asignación de acciones
- ❌ Paso 6: Directores (parcial, falta directorio)

**Testing del Seed Completo**:
- ❌ Test que valide creación de 5 sociedades completas en backend real

---

## 🗺️ Pasos del Seed (Referencia)

Según `app/pages/dev/seeds-sociedades.vue`, el seed ejecuta estos pasos:

```
Paso 0: Crear sociedad (root)
  → POST /api/v2/society-profile
  → ✅ Ya testado

Paso 1: Datos principales
  → PUT /api/v2/society-profile/:id/society
  → ❌ Pendiente testing

Paso 2: Accionistas (2 naturales)
  → POST /api/v2/society-profile/:id/shareholder
  → ❌ Pendiente testing

Paso 3: Acciones (500 comunes)
  → POST /api/v2/society-profile/:id/action
  → ❌ Pendiente testing

Paso 4: Asignación de acciones
  → POST /api/v2/society-profile/:id/share-assignment
  → ❌ Pendiente testing

Paso 5: Quórums y mayorías
  → PUT /api/v2/society-profile/:id/quorum
  → ❌ Pendiente testing

Paso 6: Directores (3-5 según configuración)
  → POST /api/v2/society-profile/:id/director
  → ❌ Pendiente testing

Paso 7: Directorio
  → PUT /api/v2/society-profile/:id/directory
  → ⚠️ No mencionado en pasos a testear (pero necesario para seed)

Paso 8: Clase de apoderado
  → POST /api/v2/society-profile/:id/attorney-class
  → ❌ Pendiente testing

Paso 9: Apoderado (Gerente)
  → POST /api/v2/society-profile/:id/attorney
  → ❌ Pendiente testing
```

---

## 🚀 Plan de Implementación

### **FASE 1: Testing Backend Real** (Prioridad Alta)

**Objetivo**: Validar que todos los endpoints del backend funcionan correctamente antes de implementar MSW.

**Orden de implementación** (siguiendo el flujo del seed):

#### 1.1. Paso 1: Datos Principales

**Archivo**: `app/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/__tests__/datos-sociedad.repository.integration.test.ts`

**Endpoints a testear**:
- `PUT /api/v2/society-profile/:id/society` - Actualizar datos principales
- `GET /api/v2/society-profile/:id/society` - Obtener datos principales

**Tests**:
- ✅ Debe actualizar datos principales de una sociedad existente
- ✅ Debe obtener datos principales de una sociedad
- ✅ Debe validar que los datos se guardaron correctamente
- ✅ Debe limpiar datos creados al finalizar

**Dependencias**: 
- Requiere sociedad creada (Paso 0) ✅ Ya disponible

---

#### 1.2. Paso 2: Accionistas

**Archivo**: `app/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/repositories/__tests__/accionistas.repository.integration.test.ts`

**Endpoints a testear**:
- `POST /api/v2/society-profile/:id/shareholder` - Crear accionista
- `GET /api/v2/society-profile/:id/shareholder` - Listar accionistas
- `PUT /api/v2/society-profile/:id/shareholder/:shareholderId` - Actualizar accionista
- `DELETE /api/v2/society-profile/:id/shareholder/:shareholderId` - Eliminar accionista

**Tests**:
- ✅ Debe crear un accionista natural
- ✅ Debe crear un accionista jurídico
- ✅ Debe listar todos los accionistas de una sociedad
- ✅ Debe actualizar un accionista existente
- ✅ Debe eliminar un accionista
- ✅ Debe validar que los accionistas se guardaron correctamente
- ✅ Debe limpiar accionistas creados al finalizar

**Dependencias**: 
- Requiere sociedad creada (Paso 0) ✅ Ya disponible

---

#### 1.3. Paso 3: Acciones

**Archivo**: `app/core/hexag/registros/sociedades/pasos/acciones/infrastructure/repositories/__tests__/acciones.repository.integration.test.ts`

**Endpoints a testear**:
- `POST /api/v2/society-profile/:id/action` - Crear acción
- `GET /api/v2/society-profile/:id/action` - Listar acciones
- `PUT /api/v2/society-profile/:id/action/:actionId` - Actualizar acción
- `DELETE /api/v2/society-profile/:id/action/:actionId` - Eliminar acción

**Tests**:
- ✅ Debe crear una acción común
- ✅ Debe crear una acción preferencial
- ✅ Debe listar todas las acciones de una sociedad
- ✅ Debe actualizar una acción existente
- ✅ Debe eliminar una acción
- ✅ Debe validar que las acciones se guardaron correctamente
- ✅ Debe limpiar acciones creadas al finalizar

**Dependencias**: 
- Requiere sociedad creada (Paso 0) ✅ Ya disponible

---

#### 1.4. Paso 4: Asignación de Acciones

**Archivo**: `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/infrastructure/repositories/__tests__/asignacion-acciones.repository.integration.test.ts`

**Endpoints a testear**:
- `POST /api/v2/society-profile/:id/share-assignment` - Crear asignación
- `GET /api/v2/society-profile/:id/share-assignment` - Listar asignaciones
- `PUT /api/v2/society-profile/:id/share-assignment/:assignmentId` - Actualizar asignación
- `DELETE /api/v2/society-profile/:id/share-assignment/:assignmentId` - Eliminar asignación

**Tests**:
- ✅ Debe crear una asignación de acciones a un accionista
- ✅ Debe listar todas las asignaciones de una sociedad
- ✅ Debe actualizar una asignación existente
- ✅ Debe eliminar una asignación
- ✅ Debe validar que las asignaciones se guardaron correctamente
- ✅ Debe limpiar asignaciones creadas al finalizar

**Dependencias**: 
- Requiere sociedad creada (Paso 0) ✅ Ya disponible
- Requiere accionistas creados (Paso 2) ⚠️ Crear en el test
- Requiere acciones creadas (Paso 3) ⚠️ Crear en el test

---

#### 1.5. Paso 5: Quórums y Mayorías

**Archivo**: `app/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/repositories/__tests__/quorum.repository.integration.test.ts`

**Endpoints a testear**:
- `PUT /api/v2/society-profile/:id/quorum` - Actualizar quórums
- `GET /api/v2/society-profile/:id/quorum` - Obtener quórums

**Tests**:
- ✅ Debe actualizar quórums y mayorías de una sociedad
- ✅ Debe obtener quórums de una sociedad
- ✅ Debe validar que los quórums se guardaron correctamente
- ✅ Debe validar reglas de negocio (segundaConvocatoria >= quorumMinimo)
- ✅ Debe limpiar quórums actualizados al finalizar

**Dependencias**: 
- Requiere sociedad creada (Paso 0) ✅ Ya disponible

---

#### 1.6. Paso 6: Directores

**Archivo**: `app/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/__tests__/director.repository.integration.test.ts`

**Endpoints a testear**:
- `POST /api/v2/society-profile/:id/director` - Crear director
- `GET /api/v2/society-profile/:id/director` - Listar directores
- `PUT /api/v2/society-profile/:id/director/:directorId` - Actualizar director
- `DELETE /api/v2/society-profile/:id/director/:directorId` - Eliminar director

**Tests**:
- ✅ Debe crear un director titular
- ✅ Debe crear un director suplente
- ✅ Debe listar todos los directores de una sociedad
- ✅ Debe actualizar un director existente
- ✅ Debe eliminar un director
- ✅ Debe validar que los directores se guardaron correctamente
- ✅ Debe limpiar directores creados al finalizar

**Dependencias**: 
- Requiere sociedad creada (Paso 0) ✅ Ya disponible

---

#### 1.7. Paso 8: Registro de Apoderados

**Archivo**: `app/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/repositories/__tests__/apoderados.repository.integration.test.ts`

**Endpoints a testear**:
- `POST /api/v2/society-profile/:id/attorney-class` - Crear clase de apoderado
- `GET /api/v2/society-profile/:id/attorney-class` - Listar clases de apoderado
- `POST /api/v2/society-profile/:id/attorney` - Crear apoderado
- `GET /api/v2/society-profile/:id/attorney` - Listar apoderados
- `PUT /api/v2/society-profile/:id/attorney/:attorneyId` - Actualizar apoderado
- `DELETE /api/v2/society-profile/:id/attorney/:attorneyId` - Eliminar apoderado

**Tests**:
- ✅ Debe crear una clase de apoderado
- ✅ Debe listar clases de apoderado
- ✅ Debe crear un apoderado asociado a una clase
- ✅ Debe listar todos los apoderados de una sociedad
- ✅ Debe actualizar un apoderado existente
- ✅ Debe eliminar un apoderado
- ✅ Debe validar que los apoderados se guardaron correctamente
- ✅ Debe limpiar apoderados y clases creadas al finalizar

**Dependencias**: 
- Requiere sociedad creada (Paso 0) ✅ Ya disponible

---

### **FASE 2: MSW** (Después de completar Fase 1)

**Objetivo**: Implementar MSW para los pasos que faltan, permitiendo desarrollo sin backend.

**Pasos a implementar** (según `docs/msw/PLAN-MSW-REGISTRO-SOCIEDADES.md`):

1. **Paso 3: Acciones** - Crear `mocks/` completo
2. **Paso 4: Asignación de Acciones** - Crear `mocks/` completo
3. **Paso 6: Directorio** - Completar `mocks/` (ya tiene directores, falta directorio)

**Orden**: Seguir el mismo orden que Fase 1 para mantener consistencia.

---

### **FASE 3: Tests Compartidos** (Después de completar Fase 2)

**Objetivo**: Crear tests compartidos para validar que MSW y Backend Real funcionan igual.

**Archivos a crear** (uno por paso):
- `datos-sociedad.repository.shared.test.ts`
- `accionistas.repository.shared.test.ts`
- `acciones.repository.shared.test.ts`
- `asignacion-acciones.repository.shared.test.ts`
- `quorum.repository.shared.test.ts`
- `director.repository.shared.test.ts`
- `apoderados.repository.shared.test.ts`

**Patrón**: Usar `describe.each` para testear ambos repositorios (HTTP y MSW).

---

### **FASE 4: Testing del Seed Completo** (Final)

**Objetivo**: Validar que el seed completo crea 5 sociedades correctamente en el backend real.

**Archivo**: `tests/integration/seed-sociedades-completo.test.ts`

**Tests**:
- ✅ Debe crear 5 sociedades completas siguiendo el flujo del seed
- ✅ Debe validar que cada sociedad tiene todos los pasos completados:
  - Datos principales
  - 2 accionistas
  - 1 acción (500 comunes)
  - 2 asignaciones de acciones
  - Quórums configurados
  - 3-5 directores
  - Directorio configurado
  - Clase de apoderado
  - Apoderado (Gerente)
- ✅ Debe limpiar todas las sociedades creadas al finalizar
- ✅ Debe generar un resumen completo con TestLogger

**Dependencias**: 
- Requiere que todos los pasos (1,2,3,4,5,6,8) estén testeados en Fase 1 ✅

---

## 📝 Checklist de Implementación

### Fase 1: Testing Backend Real

- [ ] **Paso 1: Datos Principales**
  - [ ] Crear `datos-sociedad.repository.integration.test.ts`
  - [ ] Test: actualizar datos principales
  - [ ] Test: obtener datos principales
  - [ ] Test: validar datos guardados
  - [ ] Test: limpieza automática

- [ ] **Paso 2: Accionistas**
  - [ ] Crear `accionistas.repository.integration.test.ts`
  - [ ] Test: crear accionista natural
  - [ ] Test: crear accionista jurídico
  - [ ] Test: listar accionistas
  - [ ] Test: actualizar accionista
  - [ ] Test: eliminar accionista
  - [ ] Test: limpieza automática

- [ ] **Paso 3: Acciones**
  - [ ] Crear `acciones.repository.integration.test.ts`
  - [ ] Test: crear acción común
  - [ ] Test: crear acción preferencial
  - [ ] Test: listar acciones
  - [ ] Test: actualizar acción
  - [ ] Test: eliminar acción
  - [ ] Test: limpieza automática

- [ ] **Paso 4: Asignación de Acciones**
  - [ ] Crear `asignacion-acciones.repository.integration.test.ts`
  - [ ] Test: crear asignación
  - [ ] Test: listar asignaciones
  - [ ] Test: actualizar asignación
  - [ ] Test: eliminar asignación
  - [ ] Test: limpieza automática

- [ ] **Paso 5: Quórums**
  - [ ] Crear `quorum.repository.integration.test.ts`
  - [ ] Test: actualizar quórums
  - [ ] Test: obtener quórums
  - [ ] Test: validar reglas de negocio
  - [ ] Test: limpieza automática

- [ ] **Paso 6: Directores**
  - [ ] Crear `director.repository.integration.test.ts`
  - [ ] Test: crear director titular
  - [ ] Test: crear director suplente
  - [ ] Test: listar directores
  - [ ] Test: actualizar director
  - [ ] Test: eliminar director
  - [ ] Test: limpieza automática

- [ ] **Paso 8: Apoderados**
  - [ ] Crear `apoderados.repository.integration.test.ts`
  - [ ] Test: crear clase de apoderado
  - [ ] Test: crear apoderado
  - [ ] Test: listar apoderados
  - [ ] Test: actualizar apoderado
  - [ ] Test: eliminar apoderado
  - [ ] Test: limpieza automática

### Fase 2: MSW

- [ ] **Paso 3: Acciones**
  - [ ] Crear `mocks/data/acciones.state.ts`
  - [ ] Crear `mocks/handlers/acciones.handlers.ts`
  - [ ] Registrar handlers en `register-handlers.ts`
  - [ ] Crear `acciones.msw.repository.ts`

- [ ] **Paso 4: Asignación de Acciones**
  - [ ] Crear `mocks/data/asignacion-acciones.state.ts`
  - [ ] Crear `mocks/handlers/asignacion-acciones.handlers.ts`
  - [ ] Registrar handlers en `register-handlers.ts`
  - [ ] Crear `asignacion-acciones.msw.repository.ts`

- [ ] **Paso 6: Directorio**
  - [ ] Completar `mocks/data/directorio.state.ts`
  - [ ] Completar `mocks/handlers/directorio.handlers.ts`
  - [ ] Registrar handlers en `register-handlers.ts`
  - [ ] Crear `directorio.msw.repository.ts`

### Fase 3: Tests Compartidos

- [ ] Crear tests compartidos para cada paso (7 archivos)
- [ ] Validar que MSW y Backend Real producen resultados idénticos

### Fase 4: Testing del Seed Completo

- [ ] Crear `tests/integration/seed-sociedades-completo.test.ts`
- [ ] Test: crear 5 sociedades completas
- [ ] Test: validar estructura de cada sociedad
- [ ] Test: limpieza automática
- [ ] Test: resumen con TestLogger

---

## 🎯 Criterios de Éxito

### Fase 1 (Backend Real)
- ✅ Todos los tests de integración pasan
- ✅ Todos los datos creados se limpian automáticamente
- ✅ TestLogger genera resúmenes completos
- ✅ No quedan sociedades de prueba en la DB

### Fase 2 (MSW)
- ✅ MSW intercepta todos los endpoints correctamente
- ✅ MSW retorna respuestas en el formato esperado
- ✅ MSW mantiene estado en memoria correctamente

### Fase 3 (Tests Compartidos)
- ✅ MSW y Backend Real producen resultados idénticos
- ✅ Todos los tests compartidos pasan para ambos repositorios

### Fase 4 (Seed Completo)
- ✅ Seed crea 5 sociedades completas sin errores
- ✅ Cada sociedad tiene todos los pasos completados
- ✅ Todas las sociedades se eliminan al finalizar
- ✅ Resumen completo generado con TestLogger

---

## 📚 Referencias

- **Guía Completa de Tests**: `docs/testing/GUIA-COMPLETA-TESTS.md`
- **Plan MSW**: `docs/msw/PLAN-MSW-REGISTRO-SOCIEDADES.md`
- **Seed de Desarrollo**: `app/pages/dev/seeds-sociedades.vue`
- **Endpoints Backend**: `docs/backend/ENDPOINTS-BACKEND-LOCATION.md`

---

## ⏱️ Estimación

- **Fase 1 (Backend Real)**: ~2-3 días (7 pasos × 4-6 tests cada uno)
- **Fase 2 (MSW)**: ~1-2 días (3 pasos pendientes)
- **Fase 3 (Tests Compartidos)**: ~1 día (7 archivos)
- **Fase 4 (Seed Completo)**: ~0.5 días (1 test complejo)

**Total estimado**: ~4-6 días de trabajo

---

**Fecha de creación**: 2025-01-XX  
**Última actualización**: 2025-01-XX

